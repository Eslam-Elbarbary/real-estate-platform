# Postman Manual Testing Guide

This folder contains the complete API collection for the Aqarmap real-estate platform backend.

The collection is **auto-generated from NestJS controllers** in `apps/api/src`. Do not edit the JSON by hand.

## Files

| File | Purpose |
|------|---------|
| `real-estate-platform.postman_collection.json` | Full API collection (91 endpoints, 30 controllers) |
| `real-estate-platform.postman_environment.json` | Local environment variables |
| `ENDPOINT_INVENTORY.md` | Endpoint reference (may lag behind; generator is source of truth) |
| `generate-collection.mjs` | Scans controllers/DTOs and regenerates collection + environment |

## Setup

1. Start the API: `npm run dev --workspace=@repo/api`
2. Ensure PostgreSQL is running and migrations/seeds are applied
3. Import into Postman:
   - **Collection:** `real-estate-platform.postman_collection.json`
   - **Environment:** `real-estate-platform.postman_environment.json`
4. Select the **Real Estate Platform - Local** environment

## Environment variables

| Variable | Description |
|----------|-------------|
| `serverUrl` | Default `http://localhost:4000` (used by Health; excluded from API prefix) |
| `baseUrl` | Default `http://localhost:4000/api/v1` |
| `accessToken` | Set automatically after Login |
| `refreshToken` | Set automatically after Login |
| `adminAccessToken` | Set manually after admin login |
| `verificationToken` | Set automatically after Register (development only) |
| `userId`, `propertyId`, `imageId` | Set by collection test scripts or manually |
| `subscriptionId`, `planId`, `propertyTypeId`, etc. | Set by test scripts or manually |

**Never commit real tokens or passwords.** Placeholders only.

IDs in requests use Postman variables (`{{propertyId}}`, `{{imageId}}`, …), never hardcoded database IDs.

## Collection folders

```
Real Estate Platform API
├── Health
├── Auth
├── Users
├── Properties
│   ├── Draft Creation
│   ├── Basic Info
│   ├── Location
│   ├── Details
│   ├── Features
│   ├── Media          ← multipart upload + list/reorder/primary/delete
│   ├── Submit
│   └── Public Search
├── Catalogs
├── Locations
├── Compounds
├── Developers
├── Plans
├── Subscriptions
├── Payments
├── Leads
├── Favorites
├── Notes
├── Notifications
├── Alerts
├── Media              ← media library (not property images)
└── Admin
    ├── Dashboard
    ├── Properties
    ├── Users
    ├── Plans
    ├── Developers
    └── Compounds
```

## Property media

All of these are in **Properties → Media**:

| Method | Path | Body |
|--------|------|------|
| POST | `/api/v1/properties/me/{{propertyId}}/media` | `multipart/form-data` field `file` |
| GET | `/api/v1/properties/me/{{propertyId}}/media` | — |
| PATCH | `/api/v1/properties/me/{{propertyId}}/media/reorder` | JSON `{ images: [{ id, sortOrder }] }` |
| PATCH | `/api/v1/properties/me/{{propertyId}}/media/{{imageId}}/primary` | — |
| DELETE | `/api/v1/properties/me/{{propertyId}}/media/{{imageId}}` | — |

Upload also exists for **Users** (avatar) and **Media** (library) as multipart `file`.

## Auth

- Public routes use Postman `noauth` (no bearer token).
- Owner/user routes use `Authorization: Bearer {{accessToken}}`.
- Admin routes use `Authorization: Bearer {{adminAccessToken}}`.

Health is public at `{{serverUrl}}/health` (not under `/api/v1`).

## Recommended manual test sequence

1. **Health → API health check** — expect `200`, status `ok`
2. **Auth → Register** — unique email; saves `userId`, `verificationToken` (dev)
3. **Auth → Verify Email** — uses `{{verificationToken}}`
4. **Auth → Login** — saves `accessToken`, `refreshToken`
5. **Auth → Get the current authenticated user**
6. **Catalogs / Locations / Plans** — copy IDs into the environment
7. **Properties → Draft Creation → Create a minimal property draft** — saves `propertyId`
8. Fill wizard steps (Basic, Location, Details, Features)
9. **Properties → Media → Upload** — select a local image for `file`; saves `imageId`
10. **Subscriptions → Select an active plan**
11. **Payments → Pay** (paid plans only)
12. Login as admin; set `adminAccessToken`
13. **Admin → Properties → Approve**

## Regenerating the collection

```bash
node docs/postman/generate-collection.mjs
```

The generator:

- Walks every `*.controller.ts` under `apps/api/src`
- Reads DTO classes for JSON bodies and query parameters
- Detects `@Public()`, `@Roles()`, and `FileInterceptor` / multipart
- Fails if generated requests do not match the controller inventory

## Swagger

Interactive docs: `http://localhost:4000/docs` (when `swaggerEnabled=true`)

## Limitations

- Multipart requests need a file selected in Postman (`file` form field)
- Password reset token is not returned in API responses (check server logs in development)
- Production never exposes `verificationToken` in register response
- Mock payment provider only — no real payment gateway
- Email/push delivery not implemented — notifications are in-app only
