# v3.5 Stronger Enforcement Pilot Phase 1

## Goal

Start the first stronger-enforcement pilot on the audit-adjacent path without changing the default `guard audit` behavior.

## In Scope

- explicit opt-in stronger enforcement pilot
- default-off pilot boundary
- standalone pilot result output
- compatibility verification against existing audit, permit-gate, and classify behavior

## Out of Scope

- no default-on enforcement
- no audit main output mutation
- no audit verdict mutation
- no permit-gate semantic rewrite
- no new governance object
- no second main-path takeover
- no drift, snapshot, or risk integration
- no UI or control plane

## Phase Position

Phase 1 exists only to prove that a stronger-enforcement pilot can be introduced as an additive opt-in boundary on top of the existing audit-governance chain.

## Boundary Freeze

- stronger enforcement remains explicit opt-in
- stronger enforcement remains default-off
- stronger enforcement remains non-enforcing
- stronger enforcement remains sidecar-only
- audit main output and audit main verdict remain unchanged
