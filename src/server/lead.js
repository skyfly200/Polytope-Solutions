// Validation for the /start interest form. Email copy lives in emailTemplates.js.

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

// The solution area is free text here on purpose: the /start dropdown is generated
// from src/data/solutions.ts, so a server-side list would drift and reject real leads.
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
  return { value };
}
