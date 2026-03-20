# Limited Enforcement Authority Contract Boundary

This document freezes the v4.1 Phase 1 hardened contract boundary for the limited enforcement authority pilot.

## Hardened Position

- the pilot remains explicit opt-in only
- the pilot remains default-off
- the pilot remains local-audit-only
- the pilot remains audit-adjacent
- the pilot remains sidecar-only
- the pilot remains recommendation-only

## Hardened Guarantees

- stable sidecar shape
- stable serializer defaults
- stable top-level field order
- stable payload field order
- stable recommendation-only authority scope
- no audit main output mutation
- no audit main verdict mutation
- no actual audit exit-code mutation

## Non-Goals

- no promotion
- no automatic authority execution
- no permit-gate semantic rewrite
- no canonical action contract rewrite
- no new governance object
- no full enforcement platform
