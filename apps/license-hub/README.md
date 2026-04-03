# MindForge License Hub

Bounded commercial support subsystem for MindForge Guard. License Hub stays outside the Guard CLI main path and keeps issuance, portal access, and minimal operator actions inspectable and auditable.

## Scope

- mock payment webhook
- customer / order / license persistence
- Ed25519 license issuance and verification
- magic link login
- session-cookie based portal auth
- customer-owned license list / detail / download
- admin allowlist auth
- admin license resend / revoke / extend / supersede actions
- admin action audit log
- file-db fallback for local MVP
- Prisma schema as canonical data model

## Guard boundary

This subsystem does **not** change:

- `packages/guard`
- `audit` output / verdict / exit semantics
- `permit` / `classify` / `drift` main-path behavior
- edition narrative boundaries

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

Production requirements:

- `LICENSE_HUB_SESSION_SECRET` must be explicitly configured
- `MAGIC_LINK_MAIL_MODE` must be explicitly set to `provider` or `dev`
- `MAGIC_LINK_MAIL_MODE=dev` in production additionally requires:
  - `ALLOW_DEV_MAGIC_LINK_IN_PRODUCTION=true`
- provider mode requires:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`

Production hardening behavior:

- production never falls back to a fixed dev session secret
- production never falls back to `LICENSE_PRIVATE_KEY_PEM` for session signing
- production does not expose `devMagicLink` by default
- production without explicit mail mode or without an allowed delivery path fails closed

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

## Mock webhook

Send:

```bash
curl -X POST http://localhost:3000/api/webhooks/mock-payment ^
  -H "Content-Type: application/json" ^
  -d "{\"id\":\"evt_demo_1\",\"type\":\"payment.succeeded\",\"data\":{\"customer\":{\"id\":\"cus_demo_1\",\"email\":\"buyer@example.com\",\"name\":\"Buyer Demo\"},\"order\":{\"id\":\"ord_demo_1\",\"edition\":\"pro\",\"amountCents\":9900,\"currency\":\"USD\"}}}"
```

Expected response:

- `ok: true`
- `eventType: payment.succeeded`
- `licenseId: ...`
- `idempotent: false` on first request, `true` on replay

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

## Verification

Scripts:

```bash
node scripts/verify_license_hub_skeleton_phase1.mjs
node scripts/verify_license_hub_phase2_boundary.mjs
node scripts/verify_license_hub_phase3_admin_boundary.mjs
```

Manual verification:

1. Start the app with `npm.cmd run license-hub:dev`.
2. Hit the mock payment webhook to create a paid order and issued license.
3. Request a customer magic link and confirm portal list / detail / download still work.
4. Set `LICENSE_HUB_ADMIN_EMAILS` to include the same email or another signed-in admin email.
5. Open `/admin/licenses`, `/admin/orders`, and `/admin/customers`.
6. On `/admin/licenses/[licenseId]`, test resend.
7. Revoke an active license and confirm status becomes `revoked` and an `admin_action` entry is created.
8. Issue a fresh active license, then test extend or supersede and confirm:
   - the previous license becomes `superseded`
   - a new replacement license is created
   - `supersedesLicenseId` links the new record to the old record
   - an `admin_action` entry is created
9. In production-mode validation, confirm:
   - missing `LICENSE_HUB_SESSION_SECRET` blocks session use
   - `MAGIC_LINK_MAIL_MODE` must be explicit
   - `devMagicLink` is not exposed unless production dev override is explicitly enabled

## Phase 4 candidates

- official Paddle / Stripe webhooks
- provider productionization beyond minimal Resend wiring
- refund / recovery workflows
- deeper Guard CLI install integration
- richer admin UX and operational reporting
