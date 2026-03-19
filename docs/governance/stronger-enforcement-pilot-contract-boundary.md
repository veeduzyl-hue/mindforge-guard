# Stronger Enforcement Pilot Contract Boundary

This document freezes the v3.6 Phase 1 hardened contract boundary for the stronger-enforcement pilot.

## Hardened Position

- the pilot remains explicit opt-in only
- the pilot remains default-off
- the pilot remains non-enforcing
- the pilot remains a sidecar-only output
- the pilot remains local-audit-only

## Hardened Sidecar Guarantees

- stable top-level field order
- stable payload field order
- stable pretty-serialized output
- stable compatibility guards
- no audit output mutation
- no audit verdict mutation
- no exit-code authority claim

## Non-Goals

- no limited authority
- no default-on enforcement
- no permit-gate semantic rewrite
- no new governance object
- no main-path takeover
