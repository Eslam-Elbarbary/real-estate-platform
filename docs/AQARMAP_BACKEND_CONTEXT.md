# AQARMAP BACKEND CONTEXT

## Real Estate Marketplace Platform

Official backend project context and architecture guide.

## Technology Stack

- Frontend: Next.js + TypeScript
- Admin: Separate Next.js application
- Backend: NestJS + TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Storage: Cloudinary

## Monorepo Structure

```
real-estate-platform

apps/
  web/     # Marketplace frontend
  admin/   # Admin dashboard
  api/     # NestJS backend

packages/
  ui/
  types/
  config/
  utils/

docs/
```

## Business Model

Platform connects:
- Buyers
- Renters
- Property owners
- Brokers
- Developers
- Admin team

Main features:
- Property marketplace
- Advanced search
- Map search
- Property valuation
- Compounds
- Advice content
- Paid listings
- Subscriptions
- Lead management

## Authentication

Method:
- Email + Password
- Email verification
- JWT access token
- Refresh token

## Roles

RBAC system:

- USER
- BROKER
- DEVELOPER
- ADMIN
- MODERATOR

A user can have multiple roles.

Example:
USER + BROKER

## Property System

Transaction types:
- Sale
- Rent

Property types:
- Apartment
- Villa
- Chalet
- Twin House
- Town House
- Duplex
- Penthouse
- Office
- Shop
- Clinic
- Land

Property can optionally belong to a compound.

Flow:

Draft
-> Subscription
-> Payment
-> Admin Review
-> Published

## Subscriptions

Plans:
- Basic
- Premium
- Featured

Payment architecture must support future gateways.

Current:
Mock payment provider

Future:
Paymob / Stripe / other gateways

## Media

Cloudinary is used from the beginning.

Database stores:
- url
- public_id
- type
- size

Do not store files in database.

## Lead System

No internal chat in first version.

Contacting owner creates a Lead.

Lead contains:
- buyer
- seller
- property
- message
- phone
- email
- status

Statuses:
- NEW
- CONTACTED
- FOLLOW_UP
- CLOSED
- REJECTED

## Admin Dashboard

Separate Next.js app.

Admin manages:
- Users
- Properties
- Property approvals
- Plans
- Payments
- Developers
- Compounds

## Database Main Entities

Authentication:
- users
- roles
- permissions
- user_roles
- role_permissions

Real Estate:
- properties
- property_types
- transaction_types
- property_images
- property_features
- locations

Business:
- plans
- subscriptions
- payments
- invoices

Engagement:
- favorites
- leads
- notifications

Content:
- developers
- compounds
- compound_units

## Backend Modules

NestJS modules:

- auth
- users
- roles
- permissions
- properties
- locations
- media
- subscriptions
- payments
- compounds
- developers
- leads
- favorites
- notifications
- dashboard

## Development Rules

- Clean Architecture
- SOLID principles
- DTO validation
- Swagger documentation
- Professional error handling
- Thin controllers
- Business logic in services
- Scalable production code

## Cursor Instructions

Before implementing:
1. Read this document.
2. Follow existing architecture.
3. Do not create duplicate systems.
4. Keep modules isolated.
5. Build production-ready code.
