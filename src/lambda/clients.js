// Admin CRUD for clients: GET /.netlify/functions/clients[?id=<uuid>]
//   POST create, PATCH ?id=<uuid> partial update, DELETE ?id=<uuid>
// All methods require "Authorization: Bearer $ADMIN_API_TOKEN".
import { getSql, rowsOf } from "../server/db.js";
import { json, parseBody, queryParam, requireAdmin } from "../server/http.js";
import { isUuid, validateClient } from "../server/validate.js";

const COLUMNS = "id, name, company, email, industry, notes, created_at, updated_at";
const FK_VIOLATION = "23503";

export const handler = async (event) => {
  const denied = requireAdmin(event);
  if (denied) return denied;

  const id = queryParam(event, "id");
  if (id !== null && !isUuid(id)) return json(400, { error: "id must be a UUID" });

  try {
    switch (event.httpMethod) {
      case "GET": {
        if (id) {
          const rows = rowsOf(await getSql().query(`select ${COLUMNS} from clients where id = $1`, [id]));
          return rows.length ? json(200, rows[0]) : json(404, { error: "Client not found" });
        }
        const rows = rowsOf(await getSql().query(`select ${COLUMNS} from clients order by name`, []));
        return json(200, rows);
      }

      case "POST": {
        const body = parseBody(event);
        if (body.error) return json(400, { error: body.error });
        const v = validateClient(body);
        if (v.error) return json(400, { error: v.error });
        const { name, company, email, industry, notes } = v.value;
        const rows = rowsOf(
          await getSql().query(
            `insert into clients (name, company, email, industry, notes)
             values ($1, $2, $3, $4, $5) returning ${COLUMNS}`,
            [name, company ?? null, email ?? null, industry ?? null, notes ?? null]
          )
        );
        return json(201, rows[0]);
      }

      case "PATCH": {
        if (!id) return json(400, { error: "id is required" });
        const body = parseBody(event);
        if (body.error) return json(400, { error: body.error });
        const v = validateClient(body, { partial: true });
        if (v.error) return json(400, { error: v.error });

        const existing = rowsOf(
          await getSql().query(`select ${COLUMNS} from clients where id = $1`, [id])
        );
        if (!existing.length) return json(404, { error: "Client not found" });
        const next = { ...existing[0], ...v.value };

        const rows = rowsOf(
          await getSql().query(
            `update clients
                set name = $2, company = $3, email = $4, industry = $5, notes = $6,
                    updated_at = now()
              where id = $1
            returning ${COLUMNS}`,
            [id, next.name, next.company ?? null, next.email ?? null, next.industry ?? null, next.notes ?? null]
          )
        );
        return json(200, rows[0]);
      }

      case "DELETE": {
        if (!id) return json(400, { error: "id is required" });
        const rows = rowsOf(
          await getSql().query("delete from clients where id = $1 returning id", [id])
        );
        return rows.length ? json(200, { deleted: id }) : json(404, { error: "Client not found" });
      }

      default:
        return json(405, { error: "Method not allowed" });
    }
  } catch (err) {
    if (err && err.code === FK_VIOLATION) {
      return json(409, { error: "Client has projects; delete or move them first" });
    }
    console.error("clients handler failed", err);
    return json(500, { error: "Server error" });
  }
};
