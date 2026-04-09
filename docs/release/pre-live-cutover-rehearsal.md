# Pre-Live Cutover Rehearsal

Use this checklist after staging is stable and before exposing any live buy surface.

Current posture:

- live environment may be configured
- public site must still avoid implying live-ready status until rehearsal passes

## 1. Domain and environment

- live domain is bound
- `LICENSE_HUB_BASE_URL` points to the live domain
- live success URL is configured
- live cancel URL is configured
- live environment variables are written to the deployment platform
- public buy surface is still held behind the release decision

## 2. Paddle live readiness

- live `PADDLE_API_KEY` is present
- live `PADDLE_CLIENT_TOKEN` is present
- live `PADDLE_WEBHOOK_SECRET` is present
- all four live `PADDLE_PRICE_ID_*` values are present
- live Paddle notification destination exists and targets the live webhook path
- live catalog is published and matches the four-offer site structure

## 3. Support and legal

- `support@your-domain` is monitored
- `sales@your-domain` is monitored
- if used, `billing@your-domain` is monitored
- `/terms` has final legal entity, effective date, and governing law language
- `/privacy` has final retention and provider disclosures
- `/refund-policy` has final refund and cancellation handling language

## 4. Configuration hygiene

- no sandbox key, token, or webhook secret remains in live configuration
- no quick tunnel, localtunnel, or temporary ingress language remains in docs or public pages
- no placeholder mailbox remains in public pages

## 5. Minimum state checks

- order state transitions can be observed
- license state transitions can be observed
- `/account/orders` reflects the expected result
- `/account/billing` reflects the expected result
- `/portal/licenses` reflects the expected result

## 6. Minimum exception checks

Confirm the rehearsal plan for:

- refund state change
- cancellation state change

For each, verify:

- order status change
- license status change
- account and billing surface change

## 7. Release gate

Do not expose live buy controls until:

- staging sandbox smoke passed
- live config handoff is complete
- support routing is monitored
- legal placeholders are replaced
- pre-live rehearsal checks are signed off
