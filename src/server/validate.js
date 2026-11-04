// Field validation for the admin API. Each validator returns { value } or { error }.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const CLIENT_STATUSES = ["new", "discovery", "quoted", "won", "lost"];
export const PROJECT_STATUSES = ["lead", "quoted", "active", "on_hold", "completed", "cancelled"];

function text(input, field, { max = 2000, required = false } = {}) {
  if (input === undefined) return required ? { error: `${field} is required` } : { skip: true };
  if (input === null || input === "") {
    return required ? { error: `${field} is required` } : { value: null };
  }
  if (typeof input !== "string") return { error: `${field} must be a string` };
  const trimmed = input.trim();
  if (!trimmed) return required ? { error: `${field} is required` } : { value: null };
  if (trimmed.length > max) return { error: `${field} must be at most ${max} characters` };
  return { value: trimmed };
}

export function validateClient(body, { partial = false } = {}) {
  const fields = {
    name: text(body.name, "name", { max: 200, required: !partial }),
    company: text(body.company, "company", { max: 200 }),
    email: text(body.email, "email", { max: 320 }),
    industry: text(body.industry, "industry", { max: 200 }),
    notes: text(body.notes, "notes", { max: 10000 }),
  };
  const out = {};
  for (const [key, res] of Object.entries(fields)) {
    if (res.error) return { error: res.error };
    if (res.skip) continue;
    out[key] = res.value;
  }
  if (body.status !== undefined) {
    if (!CLIENT_STATUSES.includes(body.status)) {
      return { error: `status must be one of: ${CLIENT_STATUSES.join(", ")}` };
    }
    out.status = body.status;
  }
  if (out.email && !EMAIL.test(out.email)) return { error: "email is not a valid address" };
  return { value: out };
}

export function validateProject(body, { partial = false } = {}) {
  const out = {};

  if (body.client_id !== undefined || !partial) {
    if (typeof body.client_id !== "string" || !UUID.test(body.client_id)) {
      return { error: "client_id must be a UUID" };
    }
    out.client_id = body.client_id;
  }

  const name = text(body.name, "name", { max: 200, required: !partial });
  if (name.error) return { error: name.error };
  if (!name.skip) out.name = name.value;

  const description = text(body.description, "description", { max: 10000 });
  if (description.error) return { error: description.error };
  if (!description.skip) out.description = description.value;

  if (body.status !== undefined || !partial) {
    const status = body.status === undefined ? "lead" : body.status;
    if (!PROJECT_STATUSES.includes(status)) {
      return { error: `status must be one of: ${PROJECT_STATUSES.join(", ")}` };
    }
    out.status = status;
  }

  for (const key of ["start_date", "due_date"]) {
    if (body[key] === undefined && partial) continue;
    const v = body[key];
    if (v === undefined || v === null || v === "") {
      out[key] = null;
    } else if (typeof v !== "string" || !DATE.test(v) || Number.isNaN(Date.parse(v))) {
      return { error: `${key} must be a date in YYYY-MM-DD form` };
    } else {
      out[key] = v;
    }
  }

  return { value: out };
}

export function isUuid(value) {
  return typeof value === "string" && UUID.test(value);
}
