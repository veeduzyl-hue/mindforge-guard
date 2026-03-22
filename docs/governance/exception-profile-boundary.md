# Governance Exception Profile Boundary

`v5.2 Phase 1` introduces the governance exception layer as a bounded,
consumer-facing profile only.

## Boundary

- upstream source is `governance_snapshot_stabilization_profile`
- downstream purpose is exception / waiver visibility only
- recommendation-only
- additive-only
- non-executing
- default-off
- no authority scope expansion
- no main-path takeover
- no governance object addition

## Preserved semantics

- audit main output preserved
- audit main verdict preserved
- actual audit exit code preserved
- denied exit code `25` preserved
- `--permit-gate` semantics preserved
- `--enforcement-pilot` semantics preserved
- `--limited-enforcement-authority` semantics preserved
- `guard action classify` semantics preserved

## Consumer surface

- exception layer exports a stable consumer surface
- exception layer exports a stable validation surface
- exception layer exports a stable permit-chain export surface
- exception layer remains descriptive and non-authoritative in phase 1
