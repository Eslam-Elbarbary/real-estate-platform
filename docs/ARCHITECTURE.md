# Architecture

Foundation architecture for an Arabic RTL real-estate marketplace frontend built with Next.js App Router.

## Philosophy

- **Server Components by default.** Add `"use client"` only for genuine browser interactivity.
- **Feature-oriented modules.** Presentation and domain logic live in `features/*` and shared libraries, not in fat route files.
- **Repository boundary.** UI never imports mock JSON/data files directly.
- **URL-driven search.** Filters are parseable/serializable; avoid large global React filter state.
- **RTL-first.** Root document is `lang="ar"` and `dir="rtl"`. Prefer logical properties (`start`/`end`) over hard-coded left/right.
- **Thin routes.** `app/**/page.tsx` files compose features and fetch through services/repositories.

## Folder structure

```text
src/
  app/                     # Next.js routes (thin)
  components/
    ui/                    # Design-system primitives
    layout/                # Shell: Header, Footer, SiteShell
  features/
    properties/            # Property application services
    property-search/       # Search schemas + URL parse/serialize
  data/
    mock/                  # Original mock datasets (not imported by UI)
    repositories/          # Data-access abstractions
  lib/
    seo/                   # Metadata helpers
    formatting/            # Currency, area, date
    utils/                 # Shared helpers (cn)
  config/                  # Site, routes, search defaults
  types/                   # Domain models
docs/
  ARCHITECTURE.md
```

Directories are created only when they have a real purpose. Future feature folders (`auth`, `favorites`, `blog`, etc.) should be added when those features are implemented.

## Server vs Client components

| Layer | Default | Client only when |
| --- | --- | --- |
| `app/**` layouts/pages | Server | Never wrap the whole app in a client provider tree |
| `components/ui` | Server-friendly primitives | Needed for controlled inputs/menus later |
| Feature interactive widgets | Split | Local state, effects, browser APIs |
| Data fetching | Server | Client fetch for highly interactive widgets only |

Rules:

1. Keep route files thin.
2. Fetch data in Server Components or server-only services.
3. Pass serializable props into small client islands.
4. Do not create a giant client shell around the application.

## Data repository pattern

Current flow:

```text
Page / Feature Service → Repository → Mock Data
```

Future flow:

```text
Page / Feature Service → Repository → Express REST API
```

Contracts live in `src/data/repositories/*` as interfaces (`PropertyRepository`, `CompoundRepository`, `LocationRepository`).

Factory accessors (`getPropertyRepository()`, etc.) currently return mock implementations. Swapping to API implementations should not require changes in presentation components.

**Important:** UI components and pages must import services/repositories, never `src/data/mock/*`.

## Routing strategy

Planned routes (not all implemented in Phase 1):

- `/`
- `/properties/sale`
- `/properties/rent`
- `/properties/sale/[propertyType]`
- `/properties/sale/[propertyType]/[...location]`
- `/properties/rent/[propertyType]/[...location]`
- `/listing/[id]/[slug]`
- `/compounds`
- `/compounds/[...location]`
- `/compound/[slug]`
- `/neighborhood`
- `/neighborhood/[...location]`
- `/advice`
- `/advice/[category]`
- `/advice/[slug]`
- `/add-listing`
- `/login`
- `/register`
- `/favorites`

Route helpers live in `src/config/routes.ts` so links stay centralized.

## Search URL strategy

Example:

```text
/properties/sale/apartment/cairo/new-cairo?minPrice=3000000&maxPrice=10000000&bedrooms=3&minArea=120&sort=newest&page=2
```

Architecture pieces:

- Path segments: transaction, property type, hierarchical location slugs
- Query string: price/area/rooms/sort/pagination and other filters
- Zod schemas: `src/features/property-search/schemas.ts`
- Parse/serialize utilities: `src/features/property-search/search-params.ts`

Pages should read `searchParams`, parse them through the shared utilities, then call `searchProperties(filters)`.

## Future backend integration

1. Keep repository interfaces stable.
2. Add API client utilities under `src/lib/api/` when Express endpoints exist.
3. Implement `ApiPropertyRepository` (and siblings) that call REST endpoints.
4. Switch factory functions to return API repositories via env flag.
5. Keep domain types in `src/types` as the shared contract between frontend and API responses (adapt mappers if needed).

## Component conventions

- Primitives in `components/ui` use variants/sizes instead of one-off duplicates.
- Layout chrome belongs in `components/layout`.
- Feature-specific UI belongs in `features/<feature>/components`.
- Prefer composition over prop explosion.
- Use `next/image` for imagery and provide meaningful `sizes`.
- Use Lucide icons; add Embla only when a carousel is required.

## Naming conventions

- Files: kebab-case (`property-repository.ts`)
- Components: PascalCase exports (`PropertyCard`)
- Types/interfaces: PascalCase (`PropertySearchFilters`)
- Functions: camelCase (`parseSearchParams`)
- Route helpers: centralized in `config/routes.ts`
- Avoid `any`. Prefer unions/enums for closed sets (`TransactionType`, `PropertyType`).

## Design tokens

Tokens are centralized in `src/app/globals.css` as CSS variables and exposed to Tailwind via `@theme inline`.

Do not scatter arbitrary brand colors or container widths through feature components.

## SEO

Use `createPageMetadata()` / `createRootMetadata()` from `src/lib/seo/metadata.ts` for title, description, canonical, Open Graph, Twitter, and robots. Dynamic listing/compound/article pages should call these helpers from `generateMetadata`.

## Tooling

- TypeScript `strict`
- ESLint (`eslint-config-next` + Prettier compatibility)
- Prettier + `prettier-plugin-tailwindcss`
- Scripts: `lint`, `typecheck`, `format`, `build`
