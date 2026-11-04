import { timingSafeEqual } from "crypto";

export function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

// Returns null when the request carries the admin token, otherwise an error response.
// Fails closed: if ADMIN_API_TOKEN is unset, every admin request is refused.
export function requireAdmin(event) {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected) return json(503, { error: "ADMIN_API_TOKEN is not configured" });

  const headers = event.headers || {};
  const header = headers.authorization || headers.Authorization || "";
  const match = /^Bearer (.+)$/.exec(header);
  const given = Buffer.from(match ? match[1] : "");
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) {
    return json(401, { error: "Unauthorized" });
  }
  return null;
}

export function parseBody(event) {
  if (!event.body) return {};
  try {
    const parsed = JSON.parse(event.body);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { error: "Body must be a JSON object" };
    }
    return parsed;
  } catch {
    return { error: "Body must be valid JSON" };
  }
}

export function queryParam(event, key) {
  const params = event.queryStringParameters || {};
  const value = params[key];
  return value === undefined || value === "" ? null : value;
}
