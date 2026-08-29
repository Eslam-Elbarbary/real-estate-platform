# API Endpoint Inventory

**Base URL:** `http://localhost:4000/api/v1`  
**Health (no prefix):** `http://localhost:4000/health`  
**Total endpoints:** 89  
**Source:** Controllers under `apps/api/src/modules/**` (verified Phase 11)

## Global behavior

| Concern | Behavior |
|---------|----------|
| Authentication | JWT Bearer (`Authorization: Bearer <accessToken>`) unless `@Public()` |
| Authorization | `@Roles(ADMIN)` or `@Roles(ADMIN, MODERATOR)` on admin routes |
| Success wrapper | `{ success: true, message, data, meta?, timestamp, path? }` |
| Error wrapper | `{ success: false, message, data: null, errors?, statusCode, timestamp, path? }` |
| Pagination | `page` (min 1), `limit` (min 1, **max 100**, default 20) where applicable |

---

## HEALTH (1)

| Method | Route | Auth | Role | Notes |
|--------|-------|------|------|-------|
| GET | `/health` | Public | — | DB health; `ok` or `degraded` |

---

## AUTH (9)

| Method | Route | Auth | Body | Errors | Business rules |
|--------|-------|------|------|--------|----------------|
| POST | `/auth/register` | Public | RegisterDto | 409 | Dev-only `verificationToken` in response |
| POST | `/auth/login` | Public | LoginDto | 401 | Returns access + refresh tokens |
| POST | `/auth/verify-email` | Public | `{ token }` | 401 | 24h token TTL |
| POST | `/auth/refresh` | Public | `{ refreshToken }` | 401 | Rotates refresh token |
| POST | `/auth/logout` | Public | `{ refreshToken }` | — | Idempotent revoke |
| POST | `/auth/forgot-password` | Public | `{ email }` | — | Opaque success; no enumeration |
| POST | `/auth/reset-password` | Public | ResetPasswordDto | 401 | Revokes all sessions |
| GET | `/auth/me` | JWT | — | 401, 404 | Current user summary |

**Note:** There is no separate "verify reset code" endpoint. Password reset uses `POST /auth/reset-password` with the token from email (dev: check server logs).

---

## USERS (5)

| Method | Route | Auth | Body | Errors | Business rules |
|--------|-------|------|------|--------|----------------|
| GET | `/users/me` | JWT | — | 401 | Full profile; no secrets |
| PATCH | `/users/me` | JWT | UpdateProfileDto | 400 | firstName, lastName, phone |
| POST | `/users/me/avatar` | JWT | multipart | 400 | Max 5MB image |
| DELETE | `/users/me/avatar` | JWT | — | 401 | Removes avatar |
| POST | `/users/me/change-password` | JWT | ChangePasswordDto | 401, 400 | Revokes refresh tokens |

---

## LOCATIONS (5) — All Public

| Method | Route | Path params | Errors |
|--------|-------|-------------|--------|
| GET | `/locations/countries` | — | — |
| GET | `/locations/countries/:countryId/cities` | countryId | 404 |
| GET | `/locations/cities/:cityId/areas` | cityId | 404 |
| GET | `/locations/areas/:areaId/districts` | areaId | 404 |
| GET | `/locations/tree` | — | — |

---

## PROPERTIES — Public (2)

| Method | Route | Auth | Query | Errors | Business rules |
|--------|-------|------|-------|--------|----------------|
| GET | `/properties` | Public | SearchPropertiesDto | 400 | PUBLISHED only; paginated |
| GET | `/properties/:slug` | Public | — | 404 | Published details + similar |

---

## PROPERTIES — Seller / Wizard (17)

| Method | Route | Auth | Ownership | Errors | Business rules |
|--------|-------|------|-----------|--------|----------------|
| POST | `/properties/drafts` | JWT | owner | 401 | Creates DRAFT |
| GET | `/properties/me` | JWT | owner | 401 | Optional `status` filter |
| GET | `/properties/me/leads` | JWT | seller | 401 | Leads on owned properties |
| GET | `/properties/me/:id` | JWT | owner | 404 | Owner-only |
| PATCH | `/properties/me/:id` | JWT | owner | 403 | DRAFT or REJECTED only |
| DELETE | `/properties/me/:id` | JWT | owner | 403 | DRAFT only |
| PATCH | `/properties/me/:id/basic` | JWT | owner | 403 | Wizard step |
| PATCH | `/properties/me/:id/details` | JWT | owner | 403 | Wizard step |
| PATCH | `/properties/me/:id/location` | JWT | owner | 400 | Validates location refs |
| PUT | `/properties/me/:id/features` | JWT | owner | 400 | Replaces all features |
| POST | `/properties/me/:id/media` | JWT | owner | 403 | DRAFT/REJECTED; 5MB max |
| GET | `/properties/me/:id/media` | JWT | owner | 404 | Owner images |
| PATCH | `/properties/me/:id/media/reorder` | JWT | owner | 400 | All image IDs required |
| PATCH | `/properties/me/:id/media/:imageId/primary` | JWT | owner | 404 | Set primary |
| DELETE | `/properties/me/:id/media/:imageId` | JWT | owner | 403 | DRAFT/REJECTED only |
| GET | `/properties/me/:id/completion` | JWT | owner | 404 | Submit readiness |
| POST | `/properties/me/:id/submit` | JWT | owner | 403, 409 | **REJECTED resubmit only**; active subscription required |

---

## FEATURES (1)

| Method | Route | Auth |
|--------|-------|------|
| GET | `/features` | Public |

---

## PLANS (1)

| Method | Route | Auth | Business rules |
|--------|-------|------|----------------|
| GET | `/plans` | Public | ACTIVE plans only |

---

## SUBSCRIPTIONS (2)

| Method | Route | Auth | Body | Errors | Business rules |
|--------|-------|------|------|--------|----------------|
| POST | `/properties/me/:id/subscription` | JWT | `{ planId }` | 400, 409 | Complete property; Basic→review; Paid→PENDING_PAYMENT |
| GET | `/properties/me/:id/subscription` | JWT | — | 404 | Open subscription (PENDING/ACTIVE) |

---

## PAYMENTS (2)

| Method | Route | Auth | Errors | Business rules |
|--------|-------|------|--------|----------------|
| POST | `/subscriptions/:id/pay` | JWT (owner) | 400, 409 | Paid plans only; idempotent on retry |
| GET | `/subscriptions/:id/payments` | JWT (owner) | 404 | Payment history |

---

## LEADS (3)

| Method | Route | Auth | Body | Errors | Business rules |
|--------|-------|------|------|--------|----------------|
| POST | `/properties/:id/leads` | JWT | CreateLeadDto | 400, 403 | PUBLISHED only; not own property |
| GET | `/leads/me` | JWT | — | 401 | Buyer's leads |
| PATCH | `/leads/:id/status` | JWT | UpdateLeadStatusDto | 403 | Seller only |

---

## FAVORITES (4)

| Method | Route | Auth | Errors |
|--------|-------|------|--------|
| GET | `/favorites` | JWT | 401 |
| GET | `/favorites/:propertyId/check` | JWT | 404 |
| POST | `/favorites/:propertyId` | JWT | 409 duplicate |
| DELETE | `/favorites/:propertyId` | JWT | 404 |

---

## NOTES (4)

| Method | Route | Auth | Ownership | Errors |
|--------|-------|------|-----------|--------|
| POST | `/properties/:id/notes` | JWT | self | 404 |
| GET | `/notes` | JWT | self | 401 |
| PATCH | `/notes/:id` | JWT | note owner | 404 |
| DELETE | `/notes/:id` | JWT | note owner | 404 |

---

## ALERTS (4)

| Method | Route | Auth | Ownership | Errors |
|--------|-------|------|-----------|--------|
| POST | `/alerts` | JWT | self | 401 |
| GET | `/alerts` | JWT | self | 401 |
| PATCH | `/alerts/:id` | JWT | alert owner | 404 |
| DELETE | `/alerts/:id` | JWT | alert owner | 404 |

---

## NOTIFICATIONS (3)

| Method | Route | Auth | Ownership | Errors |
|--------|-------|------|-----------|--------|
| GET | `/notifications` | JWT | self | 401 |
| PATCH | `/notifications/read-all` | JWT | self | 401 |
| PATCH | `/notifications/:id/read` | JWT | self | 404 cross-user |

Response includes: `id`, `type`, `title`, `message`, `data`, `read`, `createdAt`.

---

## MEDIA (3)

| Method | Route | Auth | Query | Errors | Business rules |
|--------|-------|------|-------|--------|----------------|
| POST | `/media/upload` | JWT | — | 400 | 5MB max |
| GET | `/media` | JWT | ListMediaQueryDto | 400 | Paginated; limit max 100 |
| DELETE | `/media/:id` | JWT | — | 403 | Owner or ADMIN |

---

## COMPOUNDS — Public (2)

| Method | Route | Auth | Query |
|--------|-------|------|-------|
| GET | `/compounds` | Public | ListCompoundsQueryDto |
| GET | `/compounds/:slug` | Public | — |

---

## DEVELOPERS — Public (2)

| Method | Route | Auth | Query |
|--------|-------|------|-------|
| GET | `/developers` | Public | ListDevelopersQueryDto |
| GET | `/developers/:slug` | Public | — |

---

## ADMIN (19)

### Dashboard — ADMIN only

| GET | `/admin/dashboard` |

### Users — ADMIN only

| GET | `/admin/users` | ListAdminUsersQueryDto |
| GET | `/admin/users/:id` | |
| PATCH | `/admin/users/:id/status` | UpdateUserStatusDto; cannot change self |

### Properties — ADMIN + MODERATOR (archive: ADMIN only)

| GET | `/admin/properties` | ListAdminPropertiesQueryDto; default PENDING_REVIEW |
| GET | `/admin/properties/:id` | |
| POST | `/admin/properties/:id/approve` | Requires active subscription |
| POST | `/admin/properties/:id/reject` | RejectPropertyDto |
| POST | `/admin/properties/:id/archive` | **ADMIN only** |

### Plans — ADMIN only

| GET | `/admin/plans` | ListAdminPlansQueryDto |
| POST | `/admin/plans` | CreatePlanDto |
| GET | `/admin/plans/:id` | |
| PATCH | `/admin/plans/:id` | UpdatePlanDto |

### Developers — ADMIN only

| GET | `/admin/developers` | |
| POST | `/admin/developers` | CreateDeveloperDto |
| PATCH | `/admin/developers/:id` | UpdateDeveloperDto |

### Compounds — ADMIN only

| GET | `/admin/compounds` | |
| POST | `/admin/compounds` | CreateCompoundDto |
| PATCH | `/admin/compounds/:id` | UpdateCompoundDto |

---

## Property lifecycle summary

```
Initial submit: POST /properties/me/:id/subscription (NOT /submit)

PAID:  DRAFT → subscription → PENDING_PAYMENT → pay → PENDING_REVIEW → approve → PUBLISHED → expire → EXPIRED
BASIC: DRAFT → subscription → PENDING_REVIEW → approve → PUBLISHED → expire → EXPIRED
REJECTED: edit → POST /submit → PENDING_REVIEW (requires active subscription)
```
