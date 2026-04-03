# Commercial Demo Paths

This document provides a compact, repeatable commercial demo baseline for sales, onboarding, and release walkthroughs.

## Demo Path A: minimal customer loop

### Start

- clean customer order
- valid billing success event
- no local license installed yet

### Steps

1. Trigger `payment_succeeded`
2. Show license issuance in License Hub
3. Open `/portal` or `/account/licenses`
4. Download the signed license JSON
5. Run:
   - `guard license verify --file downloaded-license.json`
   - `guard license install --file downloaded-license.json`
   - `guard license status`
   - `guard status`

### Key proof points

- signed license is issued once
- customer can self-serve download
- CLI install path is explicit
- CLI status and edition guidance are clear

### Value to narrate

- commercial delivery does not require changing Guard runtime semantics
- the buyer journey is concrete and deterministic

## Demo Path B: operator loop

### Start

- existing paid customer
- one active license present
- admin allowlist configured

### Steps

1. Open `/admin/licenses`
2. Open a license detail page
3. Trigger resend
4. Trigger revoke
5. Trigger extend or supersede
6. Open `/account/billing` or `/account/licenses`

### Key proof points

- admin actions are real, not placeholder buttons
- license history is preserved
- replacement chain is auditable
- customer-facing account surface stays in sync

### Value to narrate

- commercial support workflows are bounded and inspectable
- operational recovery does not require a hidden control plane

## Demo Path C: billing lifecycle loop

### Start

- prepared billing webhook payloads for:
  - payment success
  - replay
  - refund
  - cancellation

### Steps

1. Send `payment_succeeded`
2. Replay the same event
3. Show that no second active license is issued
4. Send `payment_refunded`
5. Send `order_canceled`
6. Inspect `webhook_events`, `system_actions`, and resulting order/license state

### Key proof points

- idempotency is enforced
- refund and cancellation update lifecycle state without deleting history
- automated actions remain auditable and separate from admin actions

### Value to narrate

- the commercial lifecycle is supportable and reviewable
- transaction handling is bounded, deterministic, and recoverable

## Suggested screenshot / output set

- portal license list
- account orders / billing pages
- admin license detail page
- CLI `guard license verify --file ...`
- CLI `guard license status`
- billing lifecycle evidence from stored events/actions
