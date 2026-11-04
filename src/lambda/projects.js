// Admin CRUD for projects: GET /.netlify/functions/projects[?id=<uuid>][&client_id=<uuid>]
//   POST create, PATCH ?id=<uuid> partial update, DELETE ?id=<uuid>
// All methods require "Authorization: Bearer $ADMIN_API_TOKEN".
import { getSql, rowsOf } from "../server/db.js";
import { json, parseBody, queryParam, requireAdmin } from "../server/http.js";
import { isUuid, validateProject } from "../server/validate.js";

// Dates are cast to text so they serialize as YYYY-MM-DD rather than full timestamps.
const COLUMNS =
  "id, client_id, name, description, status, start_date::text as start_date, " +
  "due_date::text as due_date, created_at, updated_at";
const FK_VIOLATION = "23503";

export const handler = async (event) => {
  const denied = requireAdmin(event);
  if (denied) return denied;

  const id = queryParam(event, "id");
  const clientId = queryParam(event, "client_id");
  if (id !== null && !isUuid(id)) return json(400, { error: "id must be a UUID" });
  if (clientId !== null && !isUuid(clientId)) return json(400, { error: "client_id must be a UUID" });

  try {
    switch (event.httpMethod) {
      case "GET": {
        if (id) {
          const rows = rowsOf(await getSql().query(`select ${COLUMNS} from projects where id = $1`, [id]));
          return rows.length ? json(200, rows[0]) : json(404, { error: "Project not found" });
        }
        if (clientId) {
          const rows = rowsOf(
            await getSql().query(
              `select ${COLUMNS} from projects where client_id = $1 order by due_date nulls last, name`,
              [clientId]
            )
          );
          return json(200, rows);
        }
        const rows = rowsOf(
          await getSql().query(`select ${COLUMNS} from projects order by due_date nulls last, name`, [])
        );
        return json(200, rows);
      }

      case "POST": {
        const body = parseBody(event);
        if (body.error) return json(400, { error: body.error });
        const v = validateProject(body);
        if (v.error) return json(400, { error: v.error });
        const p = v.value;
        const rows = rowsOf(
          await getSql().query(
            `insert into projects (client_id, name, description, status, start_date, due_date)
             values ($1, $2, $3, $4, $5, $6) returning ${COLUMNS}`,
            [p.client_id, p.name, p.description ?? null, p.status, p.start_date ?? null, p.due_date ?? null]
          )
        );
        return json(201, rows[0]);
      }

      case "PATCH": {
        if (!id) return json(400, { error: "id is required" });
        const body = parseBody(event);
        if (body.error) return json(400, { error: body.error });
        const v = validateProject(body, { partial: true });
        if (v.error) return json(400, { error: v.error });

        const existing = rowsOf(
          await getSql().query(`select ${COLUMNS} from projects where id = $1`, [id])
        );
        if (!existing.length) return json(404, { error: "Project not found" });
        const next = { ...existing[0], ...v.value };

        const rows = rowsOf(
          await getSql().query(
            `update projects
                set client_id = $2, name = $3, description = $4, status = $5,
                    start_date = $6, due_date = $7, updated_at = now()
              where id = $1
            returning ${COLUMNS}`,
            [
              id,
              next.client_id,
              next.name,
              next.description ?? null,
              next.status,
              next.start_date ?? null,
              next.due_date ?? null,
            ]
          )
        );
        return json(200, rows[0]);
      }

      case "DELETE": {
        if (!id) return json(400, { error: "id is required" });
        const rows = rowsOf(await getSql().query("delete from projects where id = $1 returning id", [id]));
        return rows.length ? json(200, { deleted: id }) : json(404, { error: "Project not found" });
      }

      default:
        return json(405, { error: "Method not allowed" });
    }
  } catch (err) {
    if (err && err.code === FK_VIOLATION) {
      return json(400, { error: "client_id does not refer to an existing client" });
    }
    console.error("projects handler failed", err);
    return json(500, { error: "Server error" });
  }
};
