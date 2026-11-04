// POST /.netlify/functions/start: the /start interest form.
// Stores the lead as a client (status 'new'), emails Skyler, and sends the
// prospect an auto-reply. Every dependency degrades gracefully: with no
// DATABASE_URL the lead is only emailed, with no Mailgun config it is only
// stored, and the function reports failure only if neither worked.
import { createHash } from "crypto";
import { getSql, rowsOf } from "../server/db.js";
import { json, parseBody } from "../server/http.js";
import { validateLead, notificationEmail, autoReplyEmail } from "../server/lead.js";
import { mailgunConfig, sendMail } from "../server/mailgun.js";

const MAX_BODY_BYTES = 20000;
const RATE_LIMIT = 5; // submissions per window per visitor
const RATE_WINDOW_MINUTES = 60;

// Fallback limiter when there is no database. Per warm instance, so best effort.
const memoryHits = new Map();

function visitorHash(event) {
  const h = event.headers || {};
  const ip =
    h["x-nf-client-connection-ip"] || (h["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  return createHash("sha256").update(`polytope-start:${ip}`).digest("hex").slice(0, 32);
}

async function tooManyRecent(hash, dbReady) {
  if (dbReady) {
    try {
      const rows = rowsOf(
        await getSql().query(
          `select count(*)::int as n from clients
            where submitter_hash = $1 and created_at > now() - ($2 || ' minutes')::interval`,
          [hash, String(RATE_WINDOW_MINUTES)]
        )
      );
      return rows[0].n >= RATE_LIMIT;
    } catch (err) {
      console.error("Rate limit lookup failed; falling back to memory:", err.message);
    }
  }
  const now = Date.now();
  const recent = (memoryHits.get(hash) || []).filter(t => now - t < RATE_WINDOW_MINUTES * 60000);
  memoryHits.set(hash, recent);
  return recent.length >= RATE_LIMIT;
}

export const handler = async event => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  if ((event.body || "").length > MAX_BODY_BYTES) return json(413, { error: "Request too large" });

  const body = parseBody(event);
  if (body.error) return json(400, { error: body.error });

  // Honeypot: real visitors never see or fill `website`. Pretend it worked.
  if (typeof body.website === "string" && body.website.trim()) {
    console.log("Honeypot tripped; dropping submission");
    return json(200, { ok: true });
  }

  const v = validateLead(body);
  if (v.error) return json(400, { error: v.error });
  const lead = v.value;

  const dbReady = !!process.env.DATABASE_URL;
  const hash = visitorHash(event);
  if (await tooManyRecent(hash, dbReady)) {
    console.warn("Rate limit hit for visitor", hash.slice(0, 8));
    return json(429, { error: "Too many submissions. Please try again later or email us directly." });
  }
  const hits = memoryHits.get(hash) || [];
  hits.push(Date.now());
  memoryHits.set(hash, hits);

  let stored = false;
  if (dbReady) {
    try {
      await getSql().query(
        `insert into clients
           (name, company, email, status, source, solution_area, project_description,
            timeline, budget, referral_source, submitter_hash)
         values ($1, $2, $3, 'new', 'start_form', $4, $5, $6, $7, $8, $9)`,
        [lead.name, lead.company, lead.email, lead.solution_area, lead.project_description,
         lead.timeline, lead.budget, lead.referral_source, hash]
      );
      stored = true;
    } catch (err) {
      console.error("Could not store lead (has the 0002 migration run?):", err.message);
    }
  } else {
    console.warn("DATABASE_URL not set; lead will only be emailed");
  }

  const cfg = mailgunConfig();
  const note = notificationEmail(lead, { stored });
  const reply = autoReplyEmail(lead);
  const [notified, replied] = await Promise.all([
    sendMail({ to: cfg.contactEmail, replyTo: lead.email, ...note }),
    sendMail({ to: lead.email, replyTo: cfg.contactEmail, ...reply }),
  ]);
  console.log("Lead handled", { stored, notified, replied });

  if (!stored && !notified.sent) {
    console.error("Lead was neither stored nor emailed; reporting failure");
    return json(503, { error: "Could not record your request. Please email us directly." });
  }
  return json(200, { ok: true });
};
