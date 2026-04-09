# Staging Sandbox Smoke Checklist

Run this checklist against the fixed staging deployment while Paddle remains in `sandbox`.

## 1. Page reachability

- `GET /`
- `GET /pricing`
- `GET /docs`
- `GET /support`
- `GET /contact`
- `GET /terms`
- `GET /privacy`
- `GET /refund-policy`
- `GET /paddle/success`
- `GET /paddle/cancel`

Expected:

- every page loads on the staging hostname
- public copy still states `sandbox validated, not live-ready`

## 2. Pricing surface

- confirm Community CTA routes to `/docs`
- confirm Enterprise CTA routes to `/contact`
- confirm the four paid offers are present:
  - Pro Monthly
  - Pro Annual
  - Pro+ Monthly
  - Pro+ Annual
- confirm checkout creation uses the existing `/api/paddle/checkout` path

## 3. Sandbox checkout

- start one hosted Paddle sandbox checkout from `/pricing`
- complete one successful sandbox payment
- confirm the return lands on the staging success URL
- confirm canceling a separate attempt lands on the staging cancel URL

## 4. Webhook and fulfillment

- confirm Paddle sandbox delivers an official webhook to `/api/webhooks/billing`
- confirm signature verification passes
- confirm the event is processed, not ignored or errored

## 5. Customer-facing state

- confirm `/account/orders` shows `paid`
- confirm `/account/billing` shows the expected payment and fulfillment state
- confirm `/portal/licenses` lists the issued license
- download the signed license JSON

## 6. CLI smoke

- run `guard license verify --file [downloaded-license.json]`
- run `guard license install --file [downloaded-license.json]`
- run `guard license status`
- run `guard status`

Expected:

- all commands succeed against the newly issued staging sandbox license

## 7. Support and legal

- open `/support`
- open `/contact`
- open `/terms`
- open `/privacy`
- open `/refund-policy`

Expected:

- pages are reachable
- published placeholders are obvious and consistent
- no quick tunnel or temporary ingress language remains

## 8. Minimum exception path

Validate at least one of:

- refund
- cancellation

Minimum checks:

- order state changes as expected
- license state changes as expected
- account and billing views reflect the change
