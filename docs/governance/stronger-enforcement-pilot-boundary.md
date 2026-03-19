# Stronger Enforcement Pilot Boundary

This document freezes the v3.5 Phase 1 stronger-enforcement pilot boundary.

## Pilot Position

- The pilot is explicit opt-in only.
- The pilot remains default-off.
- The pilot stays audit-adjacent and does not take over `guard audit`.
- The pilot does not modify `runGuard.mjs` default behavior.
- The pilot does not mutate the audit main output.
- The pilot does not mutate the audit main verdict.

## Pilot Result Boundary

- output remains a standalone sidecar result
- output is not a governance object
- output is non-enforcing
- output does not control audit exit behavior
- `summaryHash` is unrelated to the pilot and remains outside this boundary

## Phase 1 Non-Goals

- no default-on enforcement
- no permit-gate semantic rewrite
- no second main-path takeover
- no control plane
- no full enforcement platform
