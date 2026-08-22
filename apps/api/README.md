# NestJS API (`@repo/api`)

Production-oriented NestJS backend foundation for the Aqarmap-like marketplace.

## Stack

- NestJS + TypeScript
- PostgreSQL + Prisma
- JWT auth structure
- Cloudinary media provider abstraction
- Swagger
- Docker (PostgreSQL)

## Quick start

```bash
# from monorepo root
docker compose up -d
npm install
npm run prisma:generate --workspace=@repo/api
npm run dev:api
```

- API prefix: `http://localhost:4000/api/v1`
- Health: `http://localhost:4000/health`
- Swagger: `http://localhost:4000/docs`

Copy `apps/api/.env.example` → `apps/api/.env` if needed.

## Notes

- Domain Prisma models are **not** created yet (foundation only).
- Feature modules are scaffolds — no business logic yet.
- JWT guard is global; use `@Public()` for open routes.
