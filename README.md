# Real Estate Platform (Turborepo Monorepo)

Production-oriented Aqarmap-like marketplace scaffolded as a Turborepo monorepo.

## Structure

```
apps/
  web/      Next.js user marketplace (existing app)
  admin/    Next.js admin dashboard (placeholder)
  api/      NestJS backend (placeholder)
packages/
  ui/       Shared UI components
  types/    Shared TypeScript types
  config/   Shared TS / ESLint / Prettier configs
  utils/    Shared utilities
```

## Getting started

Install dependencies from the **repository root**:

```bash
npm install
```

### Run the user website

```bash
npm run dev:web
# or
npm run dev --workspace=@repo/web
```

Open [http://localhost:3000](http://localhost:3000).

### Run the admin placeholder

```bash
npm run dev:admin
```

Open [http://localhost:3001](http://localhost:3001).

### Run the API placeholder

```bash
npm run dev:api
```

Health check: [http://localhost:4000/health](http://localhost:4000/health).

### Run all apps

```bash
npm run dev
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:web` | Start the user website (port 3000) |
| `npm run dev:admin` | Start admin placeholder (port 3001) |
| `npm run dev:api` | Start NestJS placeholder (port 4000) |
| `npm run build` | Build all workspaces |
| `npm run lint` | Lint all workspaces |
| `npm run typecheck` | Typecheck all workspaces |
| `npm run format` | Format with Prettier |
| `npm run turbo:build` | Same as build, via Turbo (when Turbo binary works) |

### Turbo on Windows

`turbo.json` and the `turbo` dependency are installed. On some Windows setups the Turbo binary fails with `spawn EPERM` (often antivirus). Day-to-day scripts use npm workspaces; use `npm run turbo:*` once Turbo is allowed to run.

## Notes

- Shared configs live in `packages/config`.
- Workspace packages use the `@repo/*` scope.
- Run `npm install` only from the monorepo root.
- If install fails with certificate errors, this repo includes `.npmrc` with `strict-ssl=false` for local TLS interception environments.
