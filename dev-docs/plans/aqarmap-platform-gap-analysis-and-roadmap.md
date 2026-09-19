# Platform Gap Analysis & Roadmap — Aqarmap-style Marketplace

**Goal:** build a real-estate marketplace comparable to [aqarmap.com.eg](https://aqarmap.com.eg/en/) (Egypt's leading property portal).
**Status date:** 2026-09-19
**Scope:** `apps/api` (NestJS), `apps/admin` (Next.js admin panel), `apps/web` (Next.js public site)

This document is a from-the-code audit (not a guess) of what's real, what's a disconnected prototype, and what's genuinely missing — followed by a phased plan to close the gaps. Every claim below was verified by reading the actual source, not inferred from file names.

---

## 1. Executive summary

**The backend and admin panel are solid. The public site's "supply side" (list a property, manage my properties, subscribe/pay) is a disconnected prototype that writes to browser cookies instead of the database.** That is the single highest-priority gap — everything else is secondary to it.

| Layer | Verdict |
|---|---|
| Data model / Prisma schema | Solid, mature, well-normalized |
| Admin panel (`apps/admin`) | Solid — real CRUD everywhere, backed by real API |
| Public site — demand side (search, details, favorites, leads, auth) | Solid — real, API-backed |
| Public site — supply side (add property, my properties, subscriptions, alerts, credits) | **Mocked** — cookie/fictional data, zero DB persistence |
| Public site — content features (valuation, market index, advice/forum, neighborhoods) | UI shells only, mock repositories |
| Role model | Backend has 6 roles but 2 are dead code; frontend already assumes a richer, unimplemented 4-tier commercial taxonomy |

---

## 2. What's real and working today

### 2.1 Data model (`apps/api/prisma/schema/*.prisma`)
- **Properties** (`properties.prisma`): draft-first lifecycle (`PropertyStatus`: DRAFT → PENDING_PAYMENT → PENDING_REVIEW → PUBLISHED / REJECTED / ARCHIVED / EXPIRED), 11 property types, payment types, finishing types, rent periods, full status-history audit trail.
- **Catalogs** (`catalogs.prisma`): PropertyType, TransactionType, Feature, PropertyView, PropertyLegalStatus — all admin-manageable.
- **Locations** (`locations.prisma`): Country → City → Area → District — admin-manageable as of this session (`admin-locations.controller.ts`).
- **Compounds/Developers** (`compounds.prisma`, `developers.prisma`): admin-managed only today (see gap in §5).
- **RBAC** (`rbac.prisma`, `users.prisma`): `Role`, `Permission`, `RolePermission`, `UserRole` — 6 roles, ~63 permissions, seeded in `apps/api/prisma/seeds/permissions.seed.ts`.
- **Engagement**: `Favorite`, `Lead`, `PropertyNote`, `Notification`, `SavedSearchAlert` — all real models with real API modules.
- **Billing**: `Plan`, `Subscription`, `Payment`, `Invoice` — real, well-architected (see §2.3).
- **Marketing**: `Banner`, `PlatformSetting`, `MediaAsset`.

### 2.2 Admin panel (`apps/admin`)
Fully real, all backed by the actual API: properties review/moderation queue, users, roles & permissions, developers, compounds, all catalogs (including the new locations manager), banners, media library, plans, payments (view/refund), leads, dashboard stats (`admin.service.ts#getDashboardStats` — real counts across users/properties/subscriptions/payments/leads).

### 2.3 Public site — demand side (`apps/web`)
Verified real (API-backed, no mock markers):
- Property search & map (`features/property-search-results/*`, `data/repositories/api-property-search.ts`)
- Property details (`features/property-details/*`, `data/repositories/api-property-details.ts`)
- Favorites (`data/repositories/api-favorites.ts`)
- Auth (`features/auth/{api-login,refresh,session}.ts`)
- Lead creation — phone/WhatsApp/contact-form (`features/property-details/actions/create-lead.ts` → `data/repositories/api-leads.ts`)

### 2.4 Subscriptions & payments backend (`apps/api/src/modules/payments`, `.../subscriptions`)
Well-architected and **ready to use**, just not wired to the real frontend flow:
- `PaymentProvider` interface (`payments/providers/payment-provider.interface.ts`) — clean DI abstraction (`PAYMENT_PROVIDER` token). Only a `MockPaymentProvider` is bound today; swapping in a real gateway is an isolated change.
- Real routes exist: `POST /properties/me/:id/subscription`, `GET /properties/me/:id/subscription`, `POST /payments/:id/pay`, `GET /payments/:id/payments`.
- `subscription-expiry.scheduler.ts` — real cron-based expiry automation.

### 2.5 Saved-search alert matching (`apps/api/src/modules/alerts`)
Real, working engine: `SavedSearchMatchingService.notifyMatchingAlerts()` runs when a property is published, matches it against active `SavedSearchAlert` rows, and creates `Notification` records for matching users. **The frontend never calls this** (see §3).

---

## 3. Critical gap: the public site's supply side is mocked

**Correction (post-audit):** an earlier pass of this doc flagged the Add Property wizard and My Properties dashboard as mock based on their `repository.ts` files alone. Re-checking `service.ts` (the layer components actually call) showed they're **already real** — `repository.ts` in both cases is dead/legacy code for one field with no backend column. Table below reflects the verified state.

| Feature | Route(s) | Verified state | Remaining work |
|---|---|---|---|
| **Add Property wizard** | `/add-property`, `/my-properties/[id]/{basic,details,price,description,media,contact,checkout,preview,publish}` | ✅ Real — `features/add-property/service.ts` calls `data/repositories/api-property-drafts.ts` / `api-listing-submission.ts`, which hit `/api/v1/properties/drafts`, `/api/v1/properties/me/:id/*` | None. `features/add-property/repository.ts` (cookie shell for the unpersisted `mortgageEligible` field) is legacy and could be deleted once that field gets a real column or is dropped. |
| **My Properties dashboard** | `/my-properties` | ✅ Real — `features/my-properties/service.ts#searchListings`/`getStatusCounts` call `data/repositories/api-my-properties.ts` → `/api/v1/properties/me` | `getEngagementSummary` returns all-`null` (no aggregate engagement endpoint on the backend yet — real but minor gap). `repository.ts`'s `getById`/`upsertListing` are explicitly commented as unused legacy — safe to delete. |
| **Per-listing checkout** (select plan → pay, inside the wizard) | `/my-properties/[id]/checkout` | ✅ Real — `getListingDraftService().selectPlan/payListingSubscription` call the real `/api/v1/subscriptions` + payment endpoints | Backend still binds `MockPaymentProvider` (see below) — the wiring is real, the gateway behind it isn't. |
| **Standalone "Pro membership" page** | `/pro`, `/pro/checkout`, `/account/subscription` | ❌ Mock — `features/account/service.ts#activateDemoSubscription`, `features/subscriptions/components/demo-payment-method-modal.tsx` | This is a *separate* concept from the (real) per-listing checkout above. Decide: wire it to the same real subscription flow, or retire it if it's a redundant/legacy concept. |
| **Saved search alerts** | `/alerts` | ✅ Real (as of 2026-09-19) — `features/activity/alerts/service.ts` now calls `data/repositories/api-alerts.ts` → real `/api/v1/alerts` CRUD; `mapper.ts` builds/reads the exact `AlertFilters` JSON shape `alert-filter-match.util.ts` expects, so the existing matching engine now actually fires for real alerts. Cookie repository deleted. | None — verified end-to-end against the live API (create/list/patch). |
| **Credits/wallet** | `/credits` | ❌ Mock — comment literally says *"Deterministic fictional demo credit ledger — not real money"*; **no Prisma model exists for this at all** | Either build a real `CreditAccount`/`CreditTransaction` model, or drop the feature if not part of the monetization plan |
| **Backend payment gateway** | n/a | ❌ Mock — `payments.module.ts` binds `PAYMENT_PROVIDER` to `MockPaymentProvider` (verified in the DI config directly) | Implement `PaymentProvider` for Paymob/Stripe, swap the binding |

**Business impact today:** listing a property and paying to publish it **already works end-to-end for real** (draft → review → payment → publish). What's still fake is the standalone "Pro" membership upsell, saved-search alerts, the credits/points system, and the actual money movement behind the real payment call (mock gateway, no live charge).

---

## 4. Content/marketing features that are UI shells only

These map to real Aqarmap features (confirmed via their live site + app store listings) but have no backend on our side. Lower priority than §3.

| Feature | Route(s) | Mock file | Aqarmap equivalent |
|---|---|---|---|
| Valuation ("AI property estimate") | `/valuation`, `/valuation/add`, `/valuation/report/[id]` | `features/valuation/mock-engine.ts` | "Know Your Property's Estimate Value with AI" |
| Market Index | `/market-index/[year]/[month]` | `features/market-index/repository.ts` | Price Guide / Real Estate Market Index |
| Advice hub (agents, forum, expo, articles, research) | `/advice/{agents,ask,exhibitions,index,research}` | `features/advice/{agents,articles,exhibitions,research}/repository.ts`, `features/advice/data/seed.ts` | Compound/developer ratings, "Ask Neighbors" forum, Aqarmap Expo, Research Portal |
| Neighborhood guides | `/neighborhood` | `features/neighborhoods/repository.ts` | Neighborhood/area guides |
| Marketing services | `/marketing-services` | `features/marketing-services/config.ts` (static) | — |

---

## 5. Role model: current vs. what the business needs

### 5.1 Current state (`apps/api/prisma/schema/users.prisma`, `prisma/seed.ts`)

| Role | `isAdmin` | Admin permissions | Actual differentiated behavior in code |
|---|---|---|---|
| `USER` | no | none | Default signup role (`auth.service.ts:56`). Can own properties, favorite, lead, notes, alerts. |
| `BROKER` | no | none | **Dead role** — no code branches on it anywhere. |
| `DEVELOPER` | no | none | **Dead role** — no code branches on it anywhere. |
| `MODERATOR` | yes | `properties.{view,approve,reject}`, `leads.{view,update_status}` | Real — review queue access only |
| `ADMIN` | yes | all ~63 permissions | Real — full admin panel |
| `SUPER_ADMIN` | yes | all ~63 permissions (identical set to `ADMIN` today) | No enforced difference from `ADMIN` found in code beyond being the untouchable seed account |

### 5.2 What the frontend already assumes (but doesn't implement)

`apps/web/src/features/credits/types.ts` and `features/packages/config/catalog.ts` already define a 4-tier commercial taxonomy used for pricing/package pages:

```ts
type CommercialAccountRole = 'owner' | 'marketer' | 'marketing_company' | 'compound_developer';
```

This is much closer to how Aqarmap (and similar portals) actually segment sellers: individual owners (free/basic), individual agents ("marketers", paid, higher limits), brokerage **companies** (team seats), and **developers** (bulk project/compound tools). None of this is wired to real backend enforcement.

### 5.3 Correction: most of this taxonomy is a *plan choice*, not a *role*

Initial version of this doc proposed `OWNER` and `MARKETER` as new roles. On review, that's over-engineering:

- **`OWNER` should not be a role at all.** `Property.ownerId` already accepts any `USER` with zero role check anywhere in the code. A "seller" is just a `USER` who has listed something — adding a distinct role would force artificial role-switching (is a person who both buys and sells one role or two?) for no behavioral benefit, since nothing would ever check that role.
- **`MARKETER` doesn't need to be a role either.** The only thing that should legitimately differ for a paying individual agent is their **quota/plan** — higher `listingLimit`, featured boost — already modeled via `Plan`/`Subscription` (§6.5, just not enforced yet). That's a purchase, not an identity. The dead `BROKER` role can simply be retired rather than repurposed.

**The only two tiers that genuinely need new structure** are the ones requiring *multiple people to share access to the same listings/compounds* — something a single `User` row can't represent:

| Tier | Why it needs more than "USER + a plan" |
|---|---|
| `MARKETING_COMPANY` | A brokerage has several employees who all need to manage the same pool of listings under one company identity — needs a `Company` entity + membership |
| `COMPOUND_DEVELOPER` | A developer's staff similarly share management of the same `Developer`/`Compound` records — needs a `User → Developer` membership link |

Even these two probably don't need a new `Role` enum value: a member's global role can stay `USER`. What changes is *which specific `Developer`/`Company` record* they're authorized to touch — checked the same way `Property.ownerId` is checked today (ownership/membership lookup), not via RBAC permissions.

### 5.4 Revised target model

| Concept | Type | What needs to be built |
|---|---|---|
| Buyer/seller (individual) | `USER` role (unchanged) | Real add-property flow (§3) — no schema/RBAC change |
| Paid individual agent ("marketer") | `USER` role + purchased `Plan` | Plan-based listing-limit enforcement (§6.5); public agent profile page keyed off the user, not a role |
| Marketing company / agency | `USER` role + new `Company` membership | New `Company` model + `CompanyMember` table; company-scoped listing ownership |
| Compound developer | `USER` role + `Developer` membership | New `User → Developer` membership link; self-service `Developer`/`Compound` API scoped to that link (currently admin-only) |
| Staff | `MODERATOR`, `ADMIN`, `SUPER_ADMIN` | Already work — keep as-is |

**Net effect on the `Role` enum:** drop `BROKER` entirely (dead weight, never repurposed), retire `DEVELOPER` as a *role* in favor of the `User → Developer` membership link above. End state is 4 roles: `USER`, `MODERATOR`, `ADMIN`, `SUPER_ADMIN`.

### 5.5 Membership roles *within* a company/developer account

`MARKETING_COMPANY` and `COMPOUND_DEVELOPER` are entities with **multiple people sharing access**, so each needs its own small, entity-scoped role — stored on a join table, not the global `Role` enum. A person's platform-wide role stays `USER` regardless; what varies is what they're allowed to do *within the specific company/developer they're a member of*. Authorization works the same way `Property.ownerId` already does: look up the membership row for `(userId, companyId/developerId)`, no new permissions system needed.

**`MARKETING_COMPANY` → new `Company` entity + `CompanyMember` join table**

Agencies broker *other people's* properties, so they don't fit the existing `Developer` model — this needs a genuinely new `Company` entity, plus a nullable `Property.companyId` so a listing can be attributed to both the agent who created it (`ownerId`, unchanged) and the company it's posted under.

| Membership role | Can do |
|---|---|
| `OWNER` | Everything: edit company profile, manage billing/subscription/plan, invite/remove/promote members, view & manage **all** listings posted under the company, delete the company |
| `ADMIN` *(optional, larger agencies)* | Manage members, view & manage all company listings — no billing access, can't delete the company |
| `AGENT` | Create/edit/archive **only their own** listings under the company; view-only on teammates' listings; no member/settings access |

**`COMPOUND_DEVELOPER` → reuse existing `Developer` entity + new `DeveloperMember` join table**

No new top-level entity — `Developer` already exists. This is purely a `User ↔ Developer` join table with a `role` column.

| Membership role | Can do |
|---|---|
| `OWNER` | Edit Developer profile, manage billing/subscription, create/edit Compounds, invite/remove staff |
| `MANAGER` *(optional)* | Create/edit Compounds, bulk-upload units — no billing or staff management |
| `STAFF` | Create/edit unit listings (`Property` rows) under an assigned Compound — can't edit the Compound record or developer-wide settings |

Three tiers each (not two, not more): two would be too rigid once an agency/developer grows past a handful of people (someone needs to run the team without touching billing); more than three adds permission-editing complexity that Aqarmap-style platforms don't expose to agencies anyway — just simple seniority tiers.

---

## 6. Other missing backend building blocks

1. **Real payment gateway** — implement `PaymentProvider` for Paymob (standard for Egypt) or Stripe, bind it in place of `MockPaymentProvider`.
2. **Notification delivery channels** — `Notification` rows are created (in-app only); no email/SMS/WhatsApp sending exists anywhere in `notifications/notifications.service.ts`. Needed for: lead received, listing approved/rejected/published, subscription expiring, payment receipt, alert match.
3. **`Company`/agency model** — for `MARKETING_COMPANY`: company profile, member/seat management, role within company (owner/agent).
4. **Self-service Developer/Compound management** — currently `admin-developers.controller.ts` / `admin-compounds.controller.ts` are the *only* way to create these; need owner-scoped equivalents (or relax admin panel access via a `COMPOUND_DEVELOPER`-permission set tied to only their own records).
5. **Plan-based listing-limit enforcement** — `Plan.features.listingLimit` already exists in seed data (`BASIC: 1`, `PREMIUM: 5`, `FEATURED: 10`) but nothing in `properties.service.ts` reads it to cap active listings per owner.
6. **Property valuation logic** — even a simple comps-based estimator (avg price/sqm by area + type from real `Property` rows) would beat the current pure-mock engine.
7. **Real price-index aggregation** — computable directly from existing `Property.price`/`areaSqm`/`areaId` data; no new schema needed, just aggregation queries.

---

## 7. Phased roadmap

### Phase 1 — Make the site actually transactional (highest priority)

1. ~~Wire `/add-property` + `/my-properties/[id]/*` to the real `Property` API~~ — **already done**, verified real.
2. ~~Wire `/my-properties` dashboard to a real "my listings" endpoint~~ — **already done**, verified real. Minor cleanup remaining: delete dead `repository.ts`/`demo-listings.ts` mock code once nothing references it, and consider adding a real engagement-summary aggregate endpoint.
3. ~~Wire `/alerts` to the real `SavedSearchAlert` API~~ — **done 2026-09-19**: new `types/api/alerts.ts`, `data/repositories/api-alerts.ts`, `features/activity/alerts/mapper.ts`, rewrote `service.ts`, deleted the cookie repository. Verified against the live API.
4. Implement a real Paymob `PaymentProvider`, swap it in for `MockPaymentProvider`. Separately decide the fate of the standalone `/pro` + `/pro/checkout` + `/account/subscription` pages (wire to the real per-listing subscription flow, or retire as redundant).
5. Add email delivery for the notification types that matter most at launch: lead received, listing approved/rejected/published, payment receipt.

### Phase 2 — Multi-tenant selling (no role/RBAC changes needed)
6. Enforce plan-based listing limits (read `Plan.features.listingLimit` in `properties.service.ts` create/submit path) — covers the "marketer" tier entirely; no new role.
7. ~~Build the `Company`/agency model + `CompanyMember` membership~~ — **done 2026-09-19**. `Company`/`CompanyMember`/`CompanyMemberRole` (OWNER/ADMIN/AGENT) added, `Property.companyId` wired, self-service `/companies` API (create, profile, members — add/promote/demote/remove, self-leave, last-owner protection) plus a minimal `/admin/companies` oversight endpoint (list + activate/deactivate, gated by new `companies.view`/`companies.update` permissions). Seed data: 1 demo company with an OWNER + AGENT member, one seeded property reassigned to it. Verified end-to-end against the live API, including every authorization edge case (member vs non-member, role-gated actions, last-owner guard, self-leave). **No frontend UI yet** — this shipped as backend-only; a company management page (admin oversight) and a self-service agency dashboard (web app) are natural follow-ups whenever that's prioritized.
8. ~~Build a `User → Developer` membership link + self-service API scoped to it~~ — **done 2026-09-19**. `DeveloperMember`/`DeveloperMemberRole` (OWNER/MANAGER/STAFF) added, self-service `/developer-accounts` API mirroring the Company model: create (creator becomes OWNER), profile get/update/delete, members list/add/promote/demote/remove with self-leave and last-owner protection, plus scoped compound sub-resource management (`GET/POST /developer-accounts/:id/compounds`, `PATCH /developer-accounts/:id/compounds/:compoundId`) so OWNER/MANAGER members can create and edit compounds under their own developer account without touching the admin-only `/admin/compounds` endpoints. No new admin permissions needed — `developers.*`/`compounds.*` already existed for staff oversight. Seed: the existing `prime-urban` developer got an OWNER + STAFF member. Verified end-to-end against the live API (member/non-member, role-gated profile and compound edits, promotion/demotion, last-owner guard, self-leave). **Bulk-listing units is not built** — a STAFF/MANAGER member still creates `Property` rows through the existing owner-scoped `/properties` flow and sets `compoundId` there; no dedicated bulk-upload endpoint exists yet, matching how `Company` shipped without wiring `companyId` into property creation either. **No frontend UI yet**, same as the Company model.
9. Drop the dead `BROKER` role; retire `DEVELOPER` as a role in favor of the membership link in item 8. End state: `USER`, `MODERATOR`, `ADMIN`, `SUPER_ADMIN`.

### Phase 3 — Content & differentiation
10. Real price-index page computed from actual `Property` data (replace `market-index` mock).
11. Real compound ratings/reviews (replace `advice` mock rating content).
12. Real agent/company public profile pages (replace `advice/agents` mock).
13. Comps-based valuation estimator (replace `valuation/mock-engine.ts`).
14. Neighborhood guides from real aggregated data (replace `neighborhoods` mock).

### Phase 4 — Long tail
Forum ("ask a question"), exhibitions/expo events, credits/points program (only if still wanted as a business model — currently has zero backend), marketing-services marketplace.

---

## 8. Recommended starting point

Items 1–3 are now done (items 1–2 turned out to already be real; item 3 was implemented and verified 2026-09-19). Remaining in Phase 1:

- **Item 4** (payment gateway + `/pro` page fate) needs a provider decision (Paymob is the natural Egypt default) and a business call on whether to wire `/pro` to the real per-listing subscription flow or retire it — worth discussing explicitly before starting.
- **Item 5** (email notifications) needs an email provider/service picked first (e.g. SES, Postmark, Resend).

Once those two decisions are made, both are similarly-scoped, mostly self-contained pieces of work.

---

## Appendix: full feature audit (Aqarmap reference vs. our platform)

| Aqarmap feature | Our route | Our status |
|---|---|---|
| Buy/Rent search & filters | `/properties/[transaction]/[propertyType]` | ✅ Real |
| Property details page | `/listing/[id]/[slug]` | ✅ Real |
| Compounds directory & guide | `/compounds`, `/compound/[slug]` | ✅ Real |
| Favorites/wishlist | `/favorites` | ✅ Real |
| Contact agent (call/WhatsApp/form) | property details page actions | ✅ Real |
| List a property | `/add-property` | ✅ Real |
| Manage my listings | `/my-properties` | ✅ Real |
| Pay to publish a listing (per-listing plan) | `/my-properties/[id]/checkout` | ✅ Real wiring, mock gateway behind it |
| Standalone "Pro" membership packages | `/packages`, `/pro` | ❌ Mock checkout |
| Saved search alerts | `/alerts` | ✅ Real |
| Price Guide / Market Index | `/market-index` | ❌ Mock |
| AI valuation estimate | `/valuation` | ❌ Mock |
| Agent/company directory & ratings | `/advice/agents` | ❌ Mock |
| Community forum ("Ask Neighbors") | `/advice/ask` | ❌ Mock |
| Aqarmap Expo (online events) | `/advice/exhibitions` | ❌ Mock |
| Research portal | `/advice/research` | ❌ Mock |
| Neighborhood guides | `/neighborhood` | ❌ Mock |
| Credits/points wallet | `/credits` | ❌ No backend model at all |
| Admin moderation & operations | admin panel | ✅ Real |
