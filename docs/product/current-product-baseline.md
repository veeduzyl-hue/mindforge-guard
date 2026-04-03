# Current Commercial Baseline

## What the product is today

MindForge Guard currently ships as a two-part commercial product:

1. `Guard CLI`
2. `License Hub`

The CLI is the governance runtime surface. License Hub is the commercial support surface around licensing, delivery, billing lifecycle handling, and customer/account visibility.

This is the current product baseline for demos, onboarding, deployment, and sales alignment.

## Guard CLI

Guard CLI is the product customers run locally in their repository workflow.

Current shipped capabilities:

- deterministic governance CLI
- local policy validation
- `audit`, `snapshot`, and action classification
- workflow drift visibility
- paid analytics gating by edition
- offline license verify, install, status, show, and remove

Current commercial posture:

- Community, Pro, Pro+, and Enterprise are formally bounded
- offline license install and verify remain authoritative
- the CLI does not require account login or an always-on service

## License Hub

License Hub is the bounded commercial support subsystem.

Current shipped capabilities:

- license issuance and signed JSON delivery
- customer portal login and license download
- admin resend, revoke, extend, and supersede flows
- payment lifecycle handling for success, replay, refund, and cancellation
- account self-serve surface for orders, licenses, billing, and bounded org/seats visibility

Current product posture:

- additive to Guard CLI
- outside the Guard main path
- inspectable and auditable
- not a control plane

## Real delivery surface vs bounded skeleton

### Real delivery surface now

- Guard CLI local install, verify, and status UX
- License Hub customer portal
- License Hub admin operations
- License Hub billing webhook lifecycle handling
- account view for orders, licenses, and billing state

### Bounded skeleton now

- organization and seats model
- seat assignment API and placeholder views
- optional online activation API skeleton

These exist to establish direction and integration boundaries. They should not be sold as fully launched multi-user account management or mandatory activation.

## What is currently sellable

The current sellable baseline is:

- a deterministic governance CLI with formal commercial editions
- signed license delivery and re-delivery
- customer self-serve download and account visibility
- operator workflows for resend, revoke, extend, and supersede
- billing lifecycle handling for payment success, replay safety, refund, and cancellation

## What should not be promised yet

Do not currently position the product as:

- a full SaaS control plane
- a full billing dashboard
- a complete organization and seat-management product
- a mandatory online activation service
- an account-login-first CLI

## How to talk about the product now

Recommended external story:

- Guard CLI is the deterministic governance product customers run locally.
- License Hub is the bounded commercial support layer for delivery, billing lifecycle handling, account visibility, and operator actions.
- Offline CLI installation remains the authority path.
- Online/account-connected capabilities exist only where they improve delivery and visibility, not to take over the runtime path.

## How not to talk about the product now

Avoid saying:

- “Guard is now a control plane”
- “Activation is online-first”
- “Seats are fully launched”
- “Enterprise adds new runtime authority”
- “Billing UI is production-complete”

## Operator and buyer references

- [Capability Baseline](./capability-baseline.md)
- [User Journey](./user-journey.md)
- [Commercial Demo Paths](../demo/commercial-demo-paths.md)
- [Release Readiness Checklist](../release/release-readiness-checklist.md)
