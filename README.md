# Polytope-Solutions

[![Netlify Status](https://api.netlify.com/api/v1/badges/a7455cf9-205c-4ef9-a45f-312e3c0c2b92/deploy-status)](https://app.netlify.com/projects/polytope-solutions/deploys)

## Project setup
```
npm install
```

### Starts the Vite dev server with hot reload
```
npm run dev
```

### Builds for production (Vite, output in `dist/`)
```
npm run build
```

Netlify runs `npm run build` and publishes `dist/`. Node 22 is pinned in `netlify.toml`.

### Previews the production build
```
npm run build && npm run preview
```

### Customize configuration
See `vite.config.ts`.

## Clients and projects (Neon Postgres)

Clients and projects are stored in Neon serverless Postgres. The schema lives in
`db/migrations/`, and the admin API is served by Netlify Functions.

### One-time Neon setup
1. Create a project at https://console.neon.tech and copy the pooled connection
   string (it includes `sslmode=require`).
2. Set `DATABASE_URL` in `.env` for local use and in Netlify's environment variables.
3. Apply the migrations:
   ```
   DATABASE_URL=... npm run db:migrate
   ```
   Migrations run once each, in filename order, and are tracked in `schema_migrations`.

### Admin API
Every request must send `Authorization: Bearer <ADMIN_API_TOKEN>`. If the token is
unset the API refuses all requests.

| Endpoint | Methods |
| --- | --- |
| `/.netlify/functions/clients` | `GET` (list, or `?id=`), `POST`, `PATCH ?id=`, `DELETE ?id=` |
| `/.netlify/functions/projects` | `GET` (list, `?id=`, or `?client_id=`), `POST`, `PATCH ?id=`, `DELETE ?id=` |

Project `status` is one of `lead`, `quoted`, `active`, `on_hold`, `completed`, `cancelled`.
Dates use `YYYY-MM-DD`. Deleting a client that still has projects returns 409.

Example:
```
curl -H "Authorization: Bearer $ADMIN_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","company":"Acme"}' https://<site>/.netlify/functions/clients
```

For local development, `npm run lambda-serve` serves the functions from `src/lambda`.

## Logo

The primary logo is the 600-cell in its symmetric 10-fold rest pose (the hero's pose when the cursor is centred): `public/img/polytopes/logo-600cell.svg` (white strokes, for dark backgrounds) and `logo-600cell-dark.svg` (dark strokes, for light backgrounds). Use it for any large placement: header lockup, og/social image, email header.

The tesseract seal (`seal-tesseract.svg`) and 5-cell seal (`seal-5cell.svg`) are simplified secondary marks for small sizes only: favicon, nav mini logo and the /start form header.
