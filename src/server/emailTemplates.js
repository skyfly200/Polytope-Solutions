// HTML + plain-text email templates. Every template returns { subject, text, html }.
//
// Layout notes: table-based with inline CSS so it renders in Gmail, Outlook and
// Apple Mail. Every colour is set explicitly (bgcolor attributes plus inline
// styles) so clients that auto-invert for dark mode cannot make text unreadable.
// The small <style> block only adds a light variant for clients that support
// prefers-color-scheme (Apple Mail); everything else keeps the inline dark theme.
// All visitor-supplied values go through esc() or oneLine() before use.
//
// To add a template (quote, invoice, welcome, testimonial ask), build its body with
// the helpers below and wrap it in layout().

const SITE = "https://polytopesolutions.com";

const C = {
  page: "#0b0814",
  card: "#16112a",
  header: "#4527a0",
  accent: "#ffa000",
  text: "#f2effa",
  muted: "#b9b2d1",
  line: "#2f2650",
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export const esc = s =>
  String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Strip CR/LF so visitor text can never inject mail headers or break a subject.
export const oneLine = s => String(s ?? "").replace(/[\r\n]+/g, " ").trim();

const mailto = address => `mailto:${encodeURIComponent(address)}`;

// ---- building blocks -------------------------------------------------------

function paragraph(html) {
  return `<p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:${C.text};" class="pt-text">${html}</p>`;
}

function heading(text) {
  return `<h1 style="margin:0 0 16px 0;font-size:24px;line-height:1.3;font-weight:600;color:${C.text};" class="pt-text">${esc(text)}</h1>`;
}

function label(text) {
  return `<div style="margin:24px 0 8px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${C.accent};font-weight:600;">${esc(text)}</div>`;
}

// rows: [[label, value]]; empty values are skipped.
function fieldTable(rows) {
  const body = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr>` +
        `<td valign="top" width="34%" style="padding:10px 12px 10px 0;border-top:1px solid ${C.line};font-size:14px;color:${C.muted};font-family:${FONT};" class="pt-muted pt-line">${esc(k)}</td>` +
        `<td valign="top" style="padding:10px 0;border-top:1px solid ${C.line};font-size:15px;color:${C.text};font-family:${FONT};word-break:break-word;" class="pt-text pt-line">${esc(v)}</td>` +
        `</tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${body}</table>`;
}

function quote(text) {
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
    `<td bgcolor="${C.page}" style="background-color:${C.page};border-left:3px solid ${C.accent};padding:14px 16px;font-size:15px;line-height:1.6;color:${C.text};font-family:${FONT};white-space:pre-wrap;word-break:break-word;" class="pt-quote pt-text">${esc(text)}</td>` +
    `</tr></table>`
  );
}

function button(href, text) {
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 8px 0;"><tr>` +
    `<td bgcolor="${C.accent}" style="background-color:${C.accent};border-radius:8px;">` +
    `<a href="${esc(href)}" style="display:inline-block;padding:12px 24px;font-family:${FONT};font-size:16px;font-weight:600;color:#000000;text-decoration:none;">${esc(text)}</a>` +
    `</td></tr></table>`
  );
}

function layout({ title, preheader, bodyHtml }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${esc(title)}</title>
<style>
  @media (prefers-color-scheme: light) {
    .pt-page { background-color: #f1eef9 !important; }
    .pt-card { background-color: #ffffff !important; }
    .pt-text { color: #1b1530 !important; }
    .pt-muted { color: #5b5476 !important; }
    .pt-line { border-color: #e2dcf2 !important; }
    .pt-quote { background-color: #f6f3fd !important; }
  }
  @media (max-width: 620px) { .pt-inner { padding: 24px 20px !important; } }
</style>
</head>
<body style="margin:0;padding:0;background-color:${C.page};" bgcolor="${C.page}" class="pt-page">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background-color:${C.page};" class="pt-page">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
    <tr>
      <td bgcolor="${C.header}" style="background-color:${C.header};border-radius:12px 12px 0 0;padding:20px 32px;font-family:${FONT};">
        <a href="${SITE}" style="text-decoration:none;color:#ffffff;font-size:18px;font-weight:600;letter-spacing:0.04em;">
          <span style="color:${C.accent};font-size:22px;vertical-align:-1px;">&#11043;</span>&nbsp; POLYTOPE SOLUTIONS
        </a>
      </td>
    </tr>
    <tr>
      <td bgcolor="${C.card}" style="background-color:${C.card};padding:32px;font-family:${FONT};border-radius:0 0 12px 12px;" class="pt-inner pt-card">
        ${bodyHtml}
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:20px 12px;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};" class="pt-muted">
        Polytope Solutions &middot; <a href="${SITE}" style="color:${C.muted};">polytopesolutions.com</a><br>
        Gain Higher Perspectives
      </td>
    </tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

// ---- templates -------------------------------------------------------------

function leadRows(lead) {
  return [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Company", lead.company],
    ["Area of interest", lead.solution_area],
    ["Timeline", lead.timeline],
    ["Budget", lead.budget],
    ["Heard about us via", lead.referral_source],
  ];
}

function plainRows(rows) {
  return rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
}

// Sent to the prospect: confirms receipt and echoes what was submitted.
export function leadAutoReplyEmail(lead) {
  const first = oneLine(lead.name).split(" ")[0];
  const rows = leadRows(lead);
  const bodyHtml =
    heading("We have received your request") +
    paragraph(`Hello ${esc(first)},`) +
    paragraph(
      "Thank you for contacting Polytope Solutions. Your project request has reached us, and you can expect a personal reply asap."
    ) +
    label("What you sent us") +
    fieldTable(rows) +
    label("Project description") +
    quote(lead.project_description) +
    `<div style="height:24px;line-height:24px;">&nbsp;</div>` +
    paragraph(
      "If anything above is incorrect or incomplete, simply reply to this email and we will update our notes before we respond."
    ) +
    paragraph("Kind regards,<br><b>Polytope Solutions</b>");
  const text =
    `Hello ${first},\n\n` +
    `Thank you for contacting Polytope Solutions. Your project request has reached us, and you can expect a personal reply asap.\n\n` +
    `WHAT YOU SENT US\n${plainRows(rows)}\n\n` +
    `PROJECT DESCRIPTION\n${lead.project_description}\n\n` +
    `If anything above is incorrect or incomplete, simply reply to this email and we will update our notes before we respond.\n\n` +
    `Kind regards,\nPolytope Solutions\n${SITE}\n`;
  return {
    subject: "We have received your project request",
    text,
    html: layout({
      title: "We have received your request",
      preheader: "Your project request is in. Here is a copy of what you sent.",
      bodyHtml,
    }),
  };
}

// Sent to Skyler: every field, a one-click reply, and whether it was saved.
export function leadNotificationEmail(lead, { stored }) {
  const rows = leadRows(lead);
  const savedNote = stored
    ? "Saved as a New client record."
    : "NOT saved to the database (see the function logs). Follow up from this email.";
  const received = new Date().toUTCString();
  const bodyHtml =
    heading("New project request") +
    paragraph(
      `<b>${esc(oneLine(lead.name))}</b>${lead.company ? ` of ${esc(oneLine(lead.company))}` : ""} asked about <b>${esc(lead.solution_area)}</b>.`
    ) +
    fieldTable(rows) +
    label("Project description") +
    quote(lead.project_description) +
    button(mailto(lead.email), `Reply to ${oneLine(lead.name).split(" ")[0]}`) +
    `<p style="margin:16px 0 0 0;font-size:13px;line-height:1.6;color:${C.muted};" class="pt-muted">${esc(savedNote)}<br>Received ${esc(received)}</p>`;
  const text =
    `New project request\n\n${plainRows(rows)}\n\nPROJECT DESCRIPTION\n${lead.project_description}\n\n` +
    `${savedNote}\nReceived ${received}\nReply to this email to respond to ${lead.email}.\n`;
  return {
    subject: `New lead: ${oneLine(lead.name)}${lead.company ? ` (${oneLine(lead.company)})` : ""} - ${oneLine(lead.solution_area)}`,
    text,
    html: layout({
      title: "New project request",
      preheader: `${oneLine(lead.name)} - ${oneLine(lead.solution_area)}`,
      bodyHtml,
    }),
  };
}
