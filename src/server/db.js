import { neon } from "@neondatabase/serverless";

let client;

// Lazily creates the Neon HTTP client so modules can load without DATABASE_URL.
// Each call is a single statement over HTTPS, which suits short-lived functions.
export function getSql() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = neon(url);
  }
  return client;
}

// sql.query may return either a row array or a full result object depending on
// driver options; normalize to rows.
export function rowsOf(result) {
  return Array.isArray(result) ? result : result.rows;
}
