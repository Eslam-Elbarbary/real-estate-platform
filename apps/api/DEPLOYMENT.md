# API Deployment Requirements (`@repo/api`)

The NestJS API is **not** deployed on Vercel. Use a Node.js host with PostgreSQL (Railway, Render, Fly.io, AWS, Docker VPS, etc.).

## Build & start

From the monorepo root:

```bash
npm install
npm run build --workspace=@repo/api
npm run start:prod --workspace=@repo/api
```

The build script runs `prisma generate` before `nest build`, so the Prisma client is always generated on fresh clones.

## Required environment variables

Copy `apps/api/.env.example` and set:

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | `production` in deployed environments |
| `PORT` | HTTP port (default `4000`) |
| `API_PREFIX` | API path prefix (default `api/v1`) |
| `CORS_ORIGIN` | Comma-separated frontend origins (web + admin URLs) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Access token signing secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token signing secret (min 32 chars) |
| `JWT_ACCESS_EXPIRES_IN` | e.g. `15m` |
| `JWT_REFRESH_EXPIRES_IN` | e.g. `7d` |

Optional (media uploads):

| Variable | Purpose |
|----------|---------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLOUDINARY_FOLDER` | Upload folder prefix |

Optional (docs):

| Variable | Purpose |
|----------|---------|
| `SWAGGER_ENABLED` | Set `false` in production if docs should be disabled |
| `SWAGGER_PATH` | Swagger UI path (default `docs`) |

## Database

1. Provision PostgreSQL.
2. Set `DATABASE_URL`.
3. Run migrations before first start:

```bash
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
```

4. Optionally seed (development/staging only):

```bash
npm run prisma:seed --workspace=@repo/api
```

## Frontend integration

Point Vercel apps at the deployed API:

- **Web:** `NEXT_PUBLIC_API_URL=https://your-api.example.com`
- **Admin:** `NEXT_PUBLIC_API_URL=https://your-api.example.com` and `ADMIN_DATA_SOURCE=api`

Ensure the API `CORS_ORIGIN` includes both frontend URLs.

## Health check

- `GET /health` — use for load balancer / platform health probes
- API base: `https://your-api.example.com/api/v1`

## Monorepo note

Install dependencies from the **repository root** (`npm install`), not only `apps/api`, so workspace packages `@repo/types` and `@repo/utils` resolve.
