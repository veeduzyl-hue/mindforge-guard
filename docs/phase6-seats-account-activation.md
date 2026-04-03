# Phase 6 Seats, Account, and Activation

## Version conclusion

Phase 6 should center on the **account / billing surface**.

That is the primary line because it:

- extends the already completed portal, admin, and billing lifecycle surfaces
- improves customer self-serve visibility without changing Guard CLI authority
- stays additive and bounded
- keeps online activation optional rather than making Guard dependent on a service

## Why this comes next

By the end of Phase 5, MindForge Guard already had:

- issuance and billing lifecycle handling in License Hub
- customer portal and admin operations
- offline Guard CLI verify / install / status UX

The most natural next productization step is to make account state visible and coherent for customers:

- what orders exist
- what licenses exist
- what billing state exists
- how an eventual organization / seats model would attach

That continuity is much stronger than jumping straight to mandatory online activation or a full team-management product.

## Direction decision

### Mainline for Phase 6

- `account / billing surface`

### Secondary depth in Phase 6

- `team / org seats`: bounded data model + assign/unassign skeleton
- `online activation`: optional protocol and API skeleton only

### Explicitly not the mainline yet

- full org RBAC
- invites / approvals / SSO / SCIM
- billing dashboard or reconciliation UI
- mandatory online activation
- account login inside Guard CLI

## Boundary

Phase 6 adds:

- customer-facing `/account` pages and APIs
- organization and seat data model scaffolding
- optional online activation record/API scaffolding

Phase 6 does **not** change:

- `packages/guard` main-path authority
- `audit` / `permit` / `classify` / `drift` semantics
- deny exit code
- Community / Pro / Pro+ / Enterprise boundaries
- offline Guard CLI install / verify / status as the authoritative activation path

## `/portal` vs `/account`

- `/portal` remains the existing delivery-oriented customer surface
- `/account` is the broader self-serve visibility layer
- both coexist during Phase 6
- no existing portal route is removed

## Seats model

Phase 6 models seats as **license-scoped entitlements assigned inside an organization**.

Minimum objects:

- `Organization`
- `OrganizationMember`
- `SeatEntitlement`
- `SeatAssignment`

Interpretation:

- the commercial license remains the root commercial artifact
- seats are the bounded allocation layer above that license
- organizations are the assignment context

This is intentionally simpler than a full tenancy or RBAC system.

## Activation model

Phase 6 introduces:

- `ActivationRecord`

Purpose:

- define the future online activation protocol boundary
- keep device/install identity out of the current offline authority path
- make it possible to harden later without changing today's CLI contract

Current posture:

- skeleton-only
- optional
- offline install / verify remain authoritative

## What is implemented now

### Real surface

- `/account`
- `/account/orders`
- `/account/licenses`
- `/account/billing`
- account APIs for me, orders, licenses, billing, organization, and seats

### Skeleton surface

- organization / seats assign and unassign APIs
- activation request / confirm / status APIs
- activation record persistence

## What is deferred to Phase 7

- team invites and pending-member workflow
- richer seat provisioning and entitlement quantities
- activation grants and device approval policy
- CLI-side optional `guard license activate` command
- account-linked renewal UX
- billing and reconciliation UI

## Preserved invariants

- additive-only
- non-breaking
- recommendation-only
- non-executing
- no authority expansion
- no control-plane takeover
- no change to Guard offline license authority
