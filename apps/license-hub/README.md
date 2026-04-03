# MindForge License Hub

Bounded commercial support subsystem for MindForge Guard. License Hub stays outside the Guard CLI main path and keeps issuance, billing lifecycle handling, portal access, and operator actions inspectable and auditable.

## Scope

- mock payment webhook
- billing webhook skeleton with signature verification and idempotency
- customer / order / license persistence
- Ed25519 license issuance and verification
- magic link login
- session-cookie based portal auth
- customer-owned license list / detail / download
- admin allowlist auth
- admin license resend / revoke / extend / supersede actions
- admin action audit log
- system action audit log for automated lifecycle events
- account self-serve surface for orders / licenses / billing overview
- organization and seat assignment skeleton
- optional online activation protocol skeleton
- file-db fallback for local MVP
- Prisma schema as canonical data model

## Guard boundary

This subsystem does **not** change:

- `packages/guard`
- `audit` output / verdict / exit semantics
- `permit` / `classify` / `drift` main-path behavior
- Community / Pro / Pro+ / Enterprise narrative boundaries

License Hub remains additive-only, non-breaking, and outside the Guard CLI governance surface.

## Prerequisites

- Node.js 18+
- npm workspace install from repo root

## Install

From repo root:

```bash
npm.cmd install
```

## Environment

Copy `.env.example` to `.env.local`.

Required for all modes:

- `LICENSE_PRIVATE_KEY_PEM`
- `LICENSE_PUBLIC_KEY_PEM`
- `LICENSE_KEY_ID`
- `LICENSE_ISSUER_NAME`

Local MVP defaults:

- `LICENSE_HUB_DB_PROVIDER=file`
- `MAGIC_LINK_MAIL_MODE=dev`
- `LICENSE_HUB_ADMIN_EMAILS=admin@example.com`
- `BILLING_ALLOW_UNSIGNED_DEV=true`

Production requirements:

- `LICENSE_HUB_SESSION_SECRET` must be explicitly configured
- `MAGIC_LINK_MAIL_MODE` must be explicitly set to `provider` or `dev`
- provider mail mode requires:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
- billing webhook processing requires:
  - `BILLING_PROVIDER`
  - `BILLING_WEBHOOK_SECRET`
  - `BILLING_SIGNATURE_HEADER`
- `MAGIC_LINK_MAIL_MODE=dev` in production additionally requires:
  - `ALLOW_DEV_MAGIC_LINK_IN_PRODUCTION=true`

Production hardening behavior:

- production never falls back to a fixed dev session secret
- production never falls back to `LICENSE_PRIVATE_KEY_PEM` for session signing
- production does not expose `devMagicLink` by default
- production billing webhook processing requires a secret unless explicit unsigned-dev override is enabled outside production

For Prisma-backed storage:

1. set `LICENSE_HUB_DB_PROVIDER=prisma`
2. set `DATABASE_URL`
3. run:

```bash
npm.cmd run db:generate
npm.cmd run db:migrate:dev
```

## Run

```bash
npm.cmd run license-hub:dev
```

## Webhooks

### Mock payment

```bash
curl -X POST http://localhost:3000/api/webhooks/mock-payment ^
  -H "Content-Type: application/json" ^
  -d "{\"id\":\"evt_demo_1\",\"type\":\"payment.succeeded\",\"data\":{\"customer\":{\"id\":\"cus_demo_1\",\"email\":\"buyer@example.com\",\"name\":\"Buyer Demo\"},\"order\":{\"id\":\"ord_demo_1\",\"edition\":\"pro\",\"amountCents\":9900,\"currency\":\"USD\"}}}"
```

### Billing webhook

Example local payload:

```bash
curl -X POST http://localhost:3000/api/webhooks/billing ^
  -H "Content-Type: application/json" ^
  -H "x-billing-signature: REPLACE_WITH_HMAC_SHA256_HEX" ^
  -d "{\"id\":\"evt_bill_1\",\"type\":\"payment_succeeded\",\"occurred_at\":\"2026-04-03T10:00:00.000Z\",\"data\":{\"customer\":{\"id\":\"cus_live_1\",\"email\":\"buyer@example.com\",\"name\":\"Buyer Demo\"},\"order\":{\"id\":\"ord_live_1\",\"edition\":\"pro\",\"amount_cents\":9900,\"currency\":\"USD\"},\"payment\":{\"id\":\"pay_live_1\"}}}"
```

In local dev, if `BILLING_ALLOW_UNSIGNED_DEV=true` and `BILLING_WEBHOOK_SECRET` is empty, the route will accept unsigned requests.

## Billing lifecycle rules

Normalized event types:

- `order_created`
- `payment_succeeded`
- `payment_failed`
- `order_canceled`
- `payment_refunded`

Order status flow:

- `order_created` -> `pending`
- `payment_succeeded` -> `paid`
- `payment_failed` -> `failed`
- `payment_refunded` -> `refunded`
- `order_canceled` -> `cancelled`

License lifecycle flow:

- `payment_succeeded` issues one active license for the order if no active license already exists
- repeated success events reuse the existing active license for that order
- `payment_refunded` revokes the active license for the order with status `refund_revoked`
- `order_canceled` revokes the active license for the order with status `revoked`
- no lifecycle event deletes historical records

Automated lifecycle events write both:

- `webhook_events`
- `system_actions`

Admin actions continue to write:

- `admin_actions`

## Customer portal

Open:

- `/login`

Submit the same email used in the paid order.

In local dev mode the response includes:

- `devMagicLink`

Open that link to establish the session cookie, then visit:

- `/portal`
- `/portal/licenses`

## Admin portal

Set `LICENSE_HUB_ADMIN_EMAILS` to a comma-separated allowlist, then sign in with one of those emails and visit:

- `/admin`
- `/admin/licenses`
- `/admin/licenses/[licenseId]`
- `/admin/orders`
- `/admin/customers`

Admin actions available on the license detail page:

- resend current signed license JSON
- revoke license and store revoke metadata
- extend by issuing a replacement license and superseding the old one
- supersede with a replacement license, optional edition change, and audit logging

## Account surface

Phase 6 adds an additive account surface alongside the existing portal:

- `/account`
- `/account/orders`
- `/account/licenses`
- `/account/billing`
- `/account/organization`
- `/account/seats`

Relationship to `/portal`:

- `/portal` remains the customer delivery and download surface
- `/account` is the broader self-serve visibility layer for orders, billing state, organization scaffolding, and seat skeletons
- no existing portal flow is removed or downgraded

## Seats skeleton

Phase 6 does **not** introduce full org RBAC, invitations, or seat provisioning workflows.

It adds the minimum bounded skeleton:

- `Organization`
- `OrganizationMember`
- `SeatEntitlement`
- `SeatAssignment`

Current posture:

- seats are modeled as license-scoped entitlements assigned inside an organization
- account APIs can assign and unassign seats against active licenses
- this is a bounded prebuild skeleton, not a full seat-management product

## Online activation skeleton

Phase 6 introduces an optional online activation protocol skeleton:

- `POST /api/activation/request`
- `POST /api/activation/confirm`
- `GET /api/activation/:id`

Important boundary:

- Guard CLI offline `license verify` / `license install` / `license status` remain authoritative
- online activation is optional and skeleton-only
- no existing Guard CLI path now depends on a live service

## APIs

Portal:

- `POST /api/auth/request-magic-link`
- `GET /api/auth/verify-magic-link?token=...`
- `POST /api/auth/logout`
- `GET /api/portal/me`
- `GET /api/portal/licenses`
- `GET /api/portal/licenses/:licenseId`
- `GET /api/portal/licenses/:licenseId/download`

Admin:

- `GET /api/admin/me`
- `GET /api/admin/licenses`
- `GET /api/admin/licenses/:licenseId`
- `POST /api/admin/licenses/:licenseId/resend`
- `POST /api/admin/licenses/:licenseId/revoke`
- `POST /api/admin/licenses/:licenseId/extend`
- `POST /api/admin/licenses/:licenseId/supersede`
- `GET /api/admin/orders`
- `GET /api/admin/customers`

Account:

- `GET /api/account/me`
- `GET /api/account/orders`
- `GET /api/account/licenses`
- `GET /api/account/billing`
- `GET /api/account/organization`
- `GET /api/account/seats`
- `POST /api/account/seats/assign`
- `POST /api/account/seats/unassign`

Activation skeleton:

- `POST /api/activation/request`
- `POST /api/activation/confirm`
- `GET /api/activation/:id`

Webhooks:

- `POST /api/webhooks/mock-payment`
- `POST /api/webhooks/billing`

## Verification

Scripts:

```bash
node scripts/verify_license_hub_skeleton_phase1.mjs
node scripts/verify_license_hub_phase2_boundary.mjs
node scripts/verify_license_hub_phase3_admin_boundary.mjs
node scripts/verify_license_hub_phase4_payment_lifecycle_boundary.mjs
```

Manual verification:

1. Start the app with `npm.cmd run license-hub:dev`.
2. Hit the mock payment webhook and confirm license issuance still works.
3. Request a customer magic link and confirm portal list / detail / download still work.
4. Confirm admin pages still work.
5. Send a `payment_succeeded` billing event and confirm:
   - `webhook_events` records the raw and normalized payload
   - the order becomes `paid`
   - a second replay does not create another active license
   - a `system_action` entry is created
6. Send a `payment_failed` billing event and confirm the order becomes `failed`.
7. Send a `payment_refunded` billing event and confirm:
   - the order becomes `refunded`
   - the active license becomes `refund_revoked`
   - no history is deleted
   - a `system_action` entry is created
8. Send an `order_canceled` billing event and confirm:
   - the order becomes `cancelled`
   - the active license becomes `revoked`
   - a `system_action` entry is created
9. In production-mode validation, confirm:
   - missing `LICENSE_HUB_SESSION_SECRET` blocks session use
   - `MAGIC_LINK_MAIL_MODE` must be explicit
   - `devMagicLink` is not exposed unless production dev override is explicitly enabled
   - missing `BILLING_WEBHOOK_SECRET` blocks billing webhook processing

## Phase 5 candidates

- formal payment provider mapping and richer field coverage
- billing UI / reconciliation UI
- refund recovery and charge dispute handling
- deeper Guard CLI activation/install integration
- team seats / organization support
