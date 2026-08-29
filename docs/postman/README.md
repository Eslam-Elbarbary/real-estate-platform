# Postman Manual Testing Guide

This folder contains the complete API collection for the Aqarmap real-estate platform backend MVP.

## Files

| File | Purpose |
|------|---------|
| `real-estate-platform.postman_collection.json` | Full API collection (89 endpoints) |
| `real-estate-platform.postman_environment.json` | Local environment variables |
| `ENDPOINT_INVENTORY.md` | Complete endpoint reference |
| `generate-collection.mjs` | Regenerates collection/environment JSON |

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
| `baseUrl` | Default `http://localhost:4000/api/v1` |
| `accessToken` | Set automatically after Login |
| `refreshToken` | Set automatically after Login |
| `adminAccessToken` | Set manually after admin login |
| `verificationToken` | Set automatically after Register (development only) |
| `propertyId`, `subscriptionId`, etc. | Set by collection test scripts or manually |

**Never commit real tokens or passwords.** Placeholders only.

## Recommended manual test sequence

### 1. Health & auth

1. **01 - Health → Health Check** — expect `200`, status `ok`
2. **02 - Auth → Register** — unique email; saves `userId`, `verificationToken` (dev)
3. **02 - Auth → Verify Email** — uses `{{verificationToken}}`
4. **02 - Auth → Login** — saves `accessToken`, `refreshToken`
5. **02 - Auth → Me** — verify authenticated user

### 2. Reference data

6. **04 - Locations → Location Tree** — copy `countryId`, `cityId`, `areaId` to environment
7. **08 - Plans → List Active Plans** — saves first `planId` (Basic or Premium)
8. **19 - Features → List Features** — optional feature IDs for wizard

Set wizard IDs in environment before property creation:

- `propertyTypeId` — from seed or GET `/features` / DB
- `transactionTypeId` — from seed

### 3. Property wizard

9. **05 - Properties → Create Draft** — saves `propertyId`
10. **05 - Properties → Update Basic** — title, types
11. **05 - Properties → Update Location** — areaId
12. **05 - Properties → Update Details** — bedrooms, price via Update Property
13. **06 - Property Media → List Media** — upload via API client if needed (multipart)
14. **05 - Properties → Get Completion** — verify `completed: true`

### 4. Monetization path

**Basic (free):**

15. **09 - Subscriptions → Create Subscription** — use Basic plan (`price: 0`)
16. Verify property status → `PENDING_REVIEW` (via GET property)

**Premium (paid):**

15. **09 - Subscriptions → Create Subscription** — use Premium plan
16. Verify property status → `PENDING_PAYMENT`
17. **10 - Payments → Pay Subscription**
18. Verify property status → `PENDING_REVIEW`

### 5. Admin moderation

19. Login as admin; set `adminAccessToken` in environment
20. **20 - Admin → List Properties** — filter pending review
21. **20 - Admin → Approve Property** — property → `PUBLISHED`
22. Copy `propertySlug` from property response for public tests

### 6. Engagement features

23. **12 - Favorites → Add Favorite**
24. **13 - Notes → Create Note**
25. **14 - Alerts → Create Alert**
26. **11 - Leads → Create Lead** (different user as buyer)
27. **15 - Notifications → List Notifications** — verify event notifications

### 7. Rejection & resubmit flow

28. **20 - Admin → Reject Property** (another listing)
29. **05 - Properties → Update Property** — edit rejected listing
30. **05 - Properties → Resubmit** — only if REJECTED + active subscription
31. **15 - Notifications** — verify rejection/resubmit notifications

### 8. Public discovery

32. **18 - Public Properties → Search Published**
33. **18 - Public Properties → Property by Slug**
34. **16 - Compounds → List / Detail**
35. **17 - Developers → List / Detail**

## Expected status transitions

| Action | From | To |
|--------|------|-----|
| Create draft | — | DRAFT |
| Select Basic plan | DRAFT | PENDING_REVIEW |
| Select Paid plan | DRAFT | PENDING_PAYMENT |
| Pay subscription | PENDING_PAYMENT | PENDING_REVIEW |
| Admin approve | PENDING_REVIEW | PUBLISHED |
| Admin reject | PENDING_REVIEW | REJECTED |
| Resubmit | REJECTED | PENDING_REVIEW |
| Subscription expires | PUBLISHED | EXPIRED |

## Invalid operations (should fail)

| Operation | Expected |
|-----------|----------|
| POST `/submit` on DRAFT | 403 |
| POST `/pay` on Basic plan | 400 |
| POST `/pay` while property DRAFT | 409 |
| Admin approve without subscription | 400 |
| Edit PUBLISHED property | 403 |
| Edit PENDING_PAYMENT property | 403 |
| Duplicate subscription | 409 |
| Duplicate payment | 201 idempotent (same payment) |
| USER on `/admin/*` | 403 |
| MODERATOR on archive | 403 |
| Mark another user's notification read | 404 |

## Auth automation

The collection includes Postman test scripts that:

- Save `accessToken`, `refreshToken`, `userId` after **Login**
- Save `verificationToken` after **Register** (development only)
- Save `propertyId`, `subscriptionId`, `planId`, `leadId`, etc. after create operations
- Assert `{ success: true }` wrapper on successful responses

Admin requests use `{{adminAccessToken}}`. Log in as an admin user and paste the token manually, or duplicate the Login request with admin credentials.

## Swagger

Interactive docs: `http://localhost:4000/docs` (when `swaggerEnabled=true`)

## Regenerating the collection

```bash
node docs/postman/generate-collection.mjs
```

## Limitations

- File upload requests (avatar, property media, media library) require Postman form-data; templates are documented but not fully automated
- Password reset token is not returned in API responses (check server logs in development)
- Production never exposes `verificationToken` in register response
- Mock payment provider only — no real payment gateway
- Email/push delivery not implemented — notifications are in-app only
