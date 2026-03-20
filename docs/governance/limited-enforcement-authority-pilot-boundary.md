# Limited Enforcement Authority Pilot Boundary

This document freezes the v4.0 Phase 1 boundary for the limited enforcement authority pilot.

## Pilot Position

- the pilot remains explicit opt-in only
- the pilot remains default-off
- the pilot remains local-audit-only
- the pilot remains audit-adjacent
- the pilot remains sidecar-emitted
- the pilot remains tightly bounded to recommendation-only authority

## Authority Scope

- authority scope is frozen as `review_gate_deny_exit_recommendation_only`
- the pilot may recommend deny exit code `25` in sidecar output when the authority status reaches the deny path
- the pilot may recommend review-only status in sidecar output
- the pilot does not mutate audit main output
- the pilot does not mutate audit main verdict
- the pilot does not mutate actual audit exit code

## Non-Goals

- no default-on enforcement
- no permit-gate semantic rewrite
- no canonical action contract rewrite
- no new governance object
- no enforcing authority takeover
- no full enforcement platform
