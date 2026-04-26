# Live Config Handoff Checklist (Historical)

This checklist captured the pre-live cutover inputs before License Hub went live.

License Hub is now live. Keep this file as historical operator reference only, and do not treat it as a current blocker for the public commercial surface.

Historical boundary:

- sandbox validation was completed before launch
- live cutover is closed
- do not reopen staging or rehearsal decisions unless a future operator incident requires it

## A. Human-provided inputs

These values must be supplied out-of-band and must not be committed:

- live `PADDLE_API_KEY`
- live `PADDLE_CLIENT_TOKEN`
- live `PADDLE_WEBHOOK_SECRET`
- live `PADDLE_PRICE_ID_PRO_MONTHLY`
- live `PADDLE_PRICE_ID_PRO_ANNUAL`
- live `PADDLE_PRICE_ID_PRO_PLUS_MONTHLY`
- live `PADDLE_PRICE_ID_PRO_PLUS_ANNUAL`
- live Paddle notification destination URL
- confirmation that the live Paddle catalog is published and active
- formal mailbox credentials
  - `support@your-domain`
  - `sales@your-domain`
  - optional `billing@your-domain`
  - mail provider credentials such as `RESEND_API_KEY`
- live `LICENSE_HUB_SESSION_SECRET`
- live license signing key pair
  - `LICENSE_PRIVATE_KEY_PEM`
  - `LICENSE_PUBLIC_KEY_PEM`
  - `LICENSE_KEY_ID`
- live `DATABASE_URL`
- final legal entity name
- final effective date for legal pages
- final governing law and dispute clause
- final refund window or approved case-by-case standard
- final retention period

## B. System configuration

These values are consumed by the app or deployment platform:

- `BILLING_PROVIDER=paddle`
- `PADDLE_ENV=production`
- `PADDLE_API_KEY`
- `PADDLE_CLIENT_TOKEN`
- `PADDLE_WEBHOOK_SECRET`
- `PADDLE_CHECKOUT_SUCCESS_URL`
- `PADDLE_CHECKOUT_CANCEL_URL`
- `PADDLE_PRICE_ID_PRO_MONTHLY`
- `PADDLE_PRICE_ID_PRO_ANNUAL`
- `PADDLE_PRICE_ID_PRO_PLUS_MONTHLY`
- `PADDLE_PRICE_ID_PRO_PLUS_ANNUAL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `LICENSE_HUB_SESSION_SECRET`
- `LICENSE_HUB_ADMIN_EMAILS`
- `LICENSE_HUB_BASE_URL`
- `LICENSE_PRIVATE_KEY_PEM`
- `LICENSE_PUBLIC_KEY_PEM`
- `LICENSE_KEY_ID`
- `DATABASE_URL`

## C. Original live switch order

1. Finalize staging deployment and pass the staging sandbox smoke checklist.
2. Finalize support mailbox routing and legal page placeholders.
3. Collect all live Paddle keys, live price IDs, live webhook secret, and live destination URL.
4. Write live configuration into the deployment platform secret store without opening the live buy surface.
5. Bind the live domain and set `LICENSE_HUB_BASE_URL`, success URL, and cancel URL to that domain.
6. Create the live Paddle notification destination and verify it points at the live webhook path.
7. Run the pre-live cutover rehearsal in `docs/release/pre-live-cutover-rehearsal.md`.
8. Only after rehearsal passes, decide whether to expose the live buy surface.

## D. Original handoff checks

Before the original live switch:

- confirm no sandbox values remain in live configuration
- confirm no temporary tunnel language remains in public pages
- confirm support and billing mailboxes are monitored
- confirm refund and cancellation handling is documented
- confirm the live catalog is the same four-offer structure expected by the site
