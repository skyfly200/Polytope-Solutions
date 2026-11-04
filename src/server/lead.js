// Validation and email copy for the /start interest form.

export const SOLUTION_AREAS = [
  "AI Harnesses & Agentic Workflows",
  "Business Systems & Automation",
  "Web & Product Builds",
  "Networks & Systems",
  "Other",
];
export const LEAD_STATUSES = ["new", "discovery", "quoted", "won", "lost"];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(input, name, max, required) {
  if (input === undefined || input === null) input = "";
  if (typeof input !== "string") return { error: `${name} must be text` };
  const value = input.trim();
  if (!value) return required ? { error: `${name} is required` } : { value: null };
  if (value.length > max) return { error: `${name} must be at most ${max} characters` };
  return { value };
}

// Returns { value } with null for empty optional fields, or { error }.
export function validateLead(body) {
  const specs = [
    ["name", 200, true],
    ["email", 320, true],
    ["company", 200, false],
    ["solution_area", 100, true],
    ["project_description", 5000, true],
    ["timeline", 200, false],
    ["budget", 200, false],
    ["referral_source", 300, false],
  ];
  const value = {};
  for (const [key, max, required] of specs) {
    const r = field(body[key], key.replace(/_/g, " "), max, required);
    if (r.error) return { error: r.error };
    value[key] = r.value;
  }
  if (!EMAIL.test(value.email)) return { error: "email is not a valid address" };
  if (!SOLUTION_AREAS.includes(value.solution_area)) return { error: "solution area is not recognised" };
  return { value };
}

export const escapeHtml = s =>
  String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Strip CR/LF so visitor text can never inject mail headers.
export const oneLine = s => String(s ?? "").replace(/[\r\n]+/g, " ").trim();

export function notificationEmail(lead, { stored }) {
  const rows = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Company", lead.company],
    ["Solution area", lead.solution_area],
    ["Timeline", lead.timeline],
    ["Budget", lead.budget],
    ["Heard about us", lead.referral_source],
  ].filter(([, v]) => v);
  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nProject:\n${lead.project_description}\n\n` +
    (stored ? "Saved as a New client record." : "NOT saved to the database (see function logs). Follow up from this email.");
  const html =
    `<h2>New lead from /start</h2><table cellpadding="4">` +
    rows.map(([k, v]) => `<tr><td><b>${escapeHtml(k)}</b></td><td>${escapeHtml(v)}</td></tr>`).join("") +
    `</table><h3>Project</h3><p style="white-space:pre-wrap">${escapeHtml(lead.project_description)}</p>` +
    `<p><i>${stored ? "Saved as a New client record." : "NOT saved to the database (see function logs). Follow up from this email."}</i></p>`;
  return {
    subject: `New lead: ${oneLine(lead.name)}${lead.company ? ` (${oneLine(lead.company)})` : ""} - ${lead.solution_area}`,
    text,
    html,
  };
}

export function autoReplyEmail(lead) {
  const first = oneLine(lead.name).split(" ")[0];
  const text =
    `Hi ${first},\n\nThanks for reaching out to Polytope Solutions. I got your note about ` +
    `${lead.solution_area} and will reply within a day or two.\n\n` +
    `If anything changes in the meantime, just reply to this email.\n\n- Skyler\nPolytope Solutions`;
  const html =
    `<p>Hi ${escapeHtml(first)},</p><p>Thanks for reaching out to Polytope Solutions. I got your note about ` +
    `<b>${escapeHtml(lead.solution_area)}</b> and will reply within a day or two.</p>` +
    `<p>If anything changes in the meantime, just reply to this email.</p><p>- Skyler<br>Polytope Solutions</p>`;
  return { subject: "Thanks for reaching out to Polytope Solutions", text, html };
}
