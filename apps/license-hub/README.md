# MindForge License Hub

Phase 1 + Phase 2 skeleton for a bounded license automation subsystem that stays outside the Guard CLI main path.

## Scope

- mock payment webhook
- customer / order / license persistence
- Ed25519 license issuance
- magic link request / verify flow
- session-cookie based customer portal auth
- customer-owned license list / detail / download
- file-db fallback for local MVP
- Prisma schema as the canonical data model for later productionization

## Prerequisites

- Node.js 18+
- npm workspace install from repo root

## Install

From repo root:

```bash
npm.cmd install
```

## Environment

Copy `.env.example` to `.env.local` and set:

- `LICENSE_PRIVATE_KEY_PEM`
- `LICENSE_PUBLIC_KEY_PEM`
- `LICENSE_KEY_ID`
- `LICENSE_ISSUER_NAME`

For a no-codegen MVP, keep:

- `LICENSE_HUB_DB_PROVIDER=file`
- `MAGIC_LINK_MAIL_MODE=dev`

For Prisma-backed storage later:

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

## Magic link login

Open:

- `/login`

Submit the same email used in the paid order. In dev mode the response includes:

- `devMagicLink`

Open that link to establish the portal session cookie, then visit:

- `/portal`
- `/portal/licenses`

## Portal APIs

- `POST /api/auth/request-magic-link`
- `GET /api/auth/verify-magic-link?token=...`
- `POST /api/auth/logout`
- `GET /api/portal/me`
- `GET /api/portal/licenses`
- `GET /api/portal/licenses/:licenseId`
- `GET /api/portal/licenses/:licenseId/download`

## Manual verification

1. Start the app with `npm.cmd run license-hub:dev`.
2. Hit the mock payment webhook once to create a paid order and issued license.
3. Open `/login` and request a magic link for the same email.
4. In dev mode open the returned `devMagicLink`.
5. Confirm `/portal/licenses` shows the issued license.
6. Open the detail page and download the signed JSON.
7. Try another user's `licenseId` on the detail or download route and confirm it returns `404`.

## Phase 2 placeholders

- `/admin`
- resend / revoke / extend actions
- stronger provider-backed email delivery
- richer portal UX
