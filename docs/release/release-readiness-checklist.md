# Release Readiness Checklist

Use this checklist before a demo environment, internal handoff, or bounded production rollout.

## 1. Required environment variables

### License issuance

- `LICENSE_PRIVATE_KEY_PEM`
- `LICENSE_PUBLIC_KEY_PEM`
- `LICENSE_KEY_ID`
- `LICENSE_ISSUER_NAME`

### Session and auth

- `LICENSE_HUB_SESSION_SECRET`
- `MAGIC_LINK_MAIL_MODE`
- `LICENSE_HUB_ADMIN_EMAILS`

### Billing lifecycle

- `BILLING_PROVIDER`
- `BILLING_WEBHOOK_SECRET`
- `BILLING_SIGNATURE_HEADER`

### Provider mail

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

### Data storage

- `LICENSE_HUB_DB_PROVIDER`
- `DATABASE_URL` when using Prisma

## 2. Local vs dev vs prod posture

### Local MVP

- file DB allowed
- `MAGIC_LINK_MAIL_MODE=dev`
- unsigned billing webhook may be allowed with `BILLING_ALLOW_UNSIGNED_DEV=true`

### Shared dev / preview

- use explicit session secret
- prefer provider mail if email demos matter
- use signed billing webhook requests where possible

### Production

- `LICENSE_HUB_SESSION_SECRET` must be set
- `MAGIC_LINK_MAIL_MODE` must be explicit
- `devMagicLink` must not be exposed by default
- billing webhook secret must be configured
- admin allowlist must be explicit

## 3. Setup checklist

- [ ] `npm install`
- [ ] `npm run db:generate` when Prisma is used
- [ ] `npm run db:push` when initializing preview / staging Prisma storage
- [ ] `npm run db:migrate:dev` only when intentionally authoring local Prisma schema changes
- [ ] `npm run license-hub:dev` starts
- [ ] Guard CLI help and version commands run

## 4. License Hub smoke steps

- [ ] request magic link
- [ ] open `/portal`
- [ ] list licenses
- [ ] download a license
- [ ] open `/account`
- [ ] open `/account/orders`
- [ ] open `/account/licenses`
- [ ] open `/account/billing`

## 5. Admin smoke steps

- [ ] admin allowlist login works
- [ ] `/admin/licenses` loads
- [ ] resend works
- [ ] revoke works
- [ ] extend or supersede works
- [ ] admin action audit log is visible/persisted

## 6. Billing lifecycle smoke steps

- [ ] `payment_succeeded` marks order paid
- [ ] first success issues exactly one active license
- [ ] replay does not issue a second active license
- [ ] `payment_failed` marks order failed
- [ ] `payment_refunded` marks order refunded and license `refund_revoked`
- [ ] `order_canceled` marks order cancelled and revokes active license
- [ ] `webhook_events` and `system_actions` are written

## 7. Guard CLI smoke steps

- [ ] `guard license verify --file downloaded-license.json`
- [ ] `guard license install --file downloaded-license.json`
- [ ] `guard license status`
- [ ] `guard status`
- [ ] paid commands still gate by edition

## 8. Verify scripts

- [ ] `node scripts/verify_license_hub_skeleton_phase1.mjs`
- [ ] `node scripts/verify_license_hub_phase2_boundary.mjs`
- [ ] `node scripts/verify_license_hub_phase3_admin_boundary.mjs`
- [ ] `node scripts/verify_license_hub_phase4_payment_lifecycle_boundary.mjs`
- [ ] `node scripts/verify_guard_cli_activation_ux_phase5.mjs`
- [ ] `node scripts/verify_phase6_seats_account_activation_boundary.mjs`
- [ ] `node scripts/verify_commercial_edition_boundary.mjs`
- [ ] `node scripts/verify_phase6_5_commercial_packaging_boundary.mjs`

## 9. What is verified now vs not yet fully verified

### Verified by repo scripts

- commercial edition boundary
- License Hub phases 1 to 4 structure and key boundary rules
- Guard CLI activation/install UX boundary
- Phase 6 account/seats/activation boundary
- Phase 6.5 packaging docs and entry points

### Still requires hands-on environment validation

- real provider mail delivery
- real billing provider mapping and webhook payload alignment
- Prisma migrations in the target environment
- browser-level end-to-end demo runs
- production secrets and domain configuration
