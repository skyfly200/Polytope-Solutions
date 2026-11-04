// Minimal Mailgun client over the REST API. Configuration is env vars only:
//   MAILGUN_API_KEY  private API key (never commit)
//   DOMAIN           verified sending domain, e.g. mg.polytopesolutions.com
//   CONTACT_EMAIL    where Skyler's notifications go
//   MAILGUN_FROM     optional default From, e.g. "Polytope Solutions <contact@mail.polytopesolutions.com>"
//   MAILGUN_API_BASE optional, https://api.eu.mailgun.net for EU domains
// When not configured, sends are skipped with a clear log line instead of failing.

export function mailgunConfig(env = process.env) {
  const missing = ["MAILGUN_API_KEY", "DOMAIN"].filter(k => !env[k]);
  return {
    configured: missing.length === 0,
    missing,
    apiKey: env.MAILGUN_API_KEY,
    domain: env.DOMAIN,
    contactEmail: env.CONTACT_EMAIL || null,
    from: env.MAILGUN_FROM || (env.DOMAIN ? `Polytope Solutions <contact@${env.DOMAIN}>` : null),
    base: (env.MAILGUN_API_BASE || "https://api.mailgun.net").replace(/\/+$/, ""),
  };
}

// Returns { sent: true } | { skipped: reason } | { error }. Never throws.
export async function sendMail({ to, subject, text, html, replyTo, from }, { env = process.env, fetchImpl = fetch } = {}) {
  const cfg = mailgunConfig(env);
  if (!cfg.configured) {
    console.warn(`Mailgun not configured (missing ${cfg.missing.join(", ")}); skipping email "${subject}"`);
    return { skipped: "mailgun_not_configured" };
  }
  if (!to) {
    console.warn(`No recipient for email "${subject}" (CONTACT_EMAIL unset?); skipping`);
    return { skipped: "no_recipient" };
  }
  const form = new URLSearchParams();
  form.set("from", from || cfg.from);
  form.set("to", to);
  form.set("subject", subject);
  form.set("text", text);
  if (html) form.set("html", html);
  if (replyTo) form.set("h:Reply-To", replyTo);
  try {
    const res = await fetchImpl(`${cfg.base}/v3/${encodeURIComponent(cfg.domain)}/messages`, {
      method: "POST",
      headers: {
        authorization: "Basic " + Buffer.from(`api:${cfg.apiKey}`).toString("base64"),
        "content-type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });
    if (!res.ok) {
      const detail = (await res.text().catch(() => "")).slice(0, 300);
      console.error(`Mailgun rejected "${subject}": HTTP ${res.status} ${detail}`);
      return { error: `http_${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error(`Mailgun request failed for "${subject}":`, err && err.message);
    return { error: "network" };
  }
}
