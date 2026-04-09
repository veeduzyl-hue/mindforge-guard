# License Hub Staging Deployment Runbook

This runbook prepares `apps/license-hub` for a fixed staging deployment.

Current boundary:

- keep Paddle in `sandbox`
- keep staging distinct from live
- do not commit real secrets into the repo
- do not change checkout, webhook, or fulfillment core semantics

## Recommended platform

Primary recommendation: `Vercel`

Why:

- `apps/license-hub` is already a standard Next.js app
- the repo is a workspace monorepo, and License Hub already imports shared packages from `packages/db` and `packages/licensing`
- a fixed Vercel staging domain is materially more stable than quick tunnel or other temporary local ingress

Lightweight fallback: `Render`

Use it only if Vercel is unavailable. Keep the same staging domain, webhook path, and environment split.

## Repo layout

- App root: `apps/license-hub`
- Shared packages: `packages/db`, `packages/licensing`
- Root workspace manifest: `/package.json`
- App manifest: `/apps/license-hub/package.json`

## Vercel project setup

1. Create a new Vercel project from the `mindforge-guard` repository.
2. Set the Root Directory to `apps/license-hub`.
3. Keep framework detection on `Next.js`.
4. Ensure the project installs from the monorepo root so workspace dependencies remain available.
5. Set Node.js to a version compatible with `>=18`.

## Recommended staging domain

Choose one fixed hostname and keep it stable:

- `staging-license.mindforgeguard.com`
- or `staging-license-hub.mindforgeguard.com`

This document assumes:

- Base URL: `https://staging-license.mindforgeguard.com`

## Paddle sandbox URLs for staging

Use the fixed staging domain for all outward-facing sandbox URLs:

- Webhook destination:
  - `https://staging-license.mindforgeguard.com/api/webhooks/billing`
- Checkout success URL:
  - `https://staging-license.mindforgeguard.com/paddle/success`
- Checkout cancel URL:
  - `https://staging-license.mindforgeguard.com/paddle/cancel`

Do not keep temporary tunnel URLs in Paddle once staging is available.

## Staging environment variables

At minimum, configure these in the staging deployment:

- `LICENSE_HUB_BASE_URL=https://staging-license.mindforgeguard.com`
- `BILLING_PROVIDER=paddle`
- `PADDLE_ENV=sandbox`
- `PADDLE_API_KEY=[sandbox value from Paddle]`
- `PADDLE_CLIENT_TOKEN=[sandbox value from Paddle]`
- `PADDLE_WEBHOOK_SECRET=[sandbox webhook secret from Paddle]`
- `PADDLE_CHECKOUT_SUCCESS_URL=https://staging-license.mindforgeguard.com/paddle/success`
- `PADDLE_CHECKOUT_CANCEL_URL=https://staging-license.mindforgeguard.com/paddle/cancel`
- `PADDLE_PRICE_ID_PRO_MONTHLY=[sandbox price id]`
- `PADDLE_PRICE_ID_PRO_ANNUAL=[sandbox price id]`
- `PADDLE_PRICE_ID_PRO_PLUS_MONTHLY=[sandbox price id]`
- `PADDLE_PRICE_ID_PRO_PLUS_ANNUAL=[sandbox price id]`
- `DATABASE_URL=[staging database connection]`
- `LICENSE_HUB_SESSION_SECRET=[staging session secret]`
- `LICENSE_PRIVATE_KEY_PEM=[staging signing private key]`
- `LICENSE_PUBLIC_KEY_PEM=[staging signing public key]`
- `LICENSE_KEY_ID=[staging key id]`
- `RESEND_API_KEY=[staging mail provider key if mail is enabled]`
- `RESEND_FROM_EMAIL=[staging sender mailbox]`

Do not commit any of these values.

## Deployment steps

1. Deploy the current `main` branch to the staging project.
2. Bind the fixed staging domain.
3. Write the staging environment variables.
4. Confirm the staging root page responds on the final hostname.
5. In Paddle sandbox, update the notification destination to the staging webhook URL.
6. In Paddle sandbox, confirm success and cancel URLs point to the staging domain.
7. Run the staging sandbox smoke checklist in `docs/release/staging-sandbox-smoke-checklist.md`.

## Exit criteria

Staging is ready when:

- the staging domain is fixed
- Paddle sandbox points to the staging webhook URL
- checkout success and cancel return to the staging hostname
- the webhook is processed on staging
- portal, account, download, and CLI smoke all pass

## Render fallback

If Vercel is unavailable:

1. Deploy `apps/license-hub` from the same repo as a Next.js-compatible web service.
2. Keep the same fixed staging domain.
3. Keep the same environment split and Paddle sandbox configuration.
4. Reuse the exact same webhook, success, and cancel URLs.
