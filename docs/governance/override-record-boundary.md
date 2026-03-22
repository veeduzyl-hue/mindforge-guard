# Override Record Boundary

`v5.2 Phase 2` adds override record, case linkage, and compatibility readiness
without promoting the exception layer into execution.

## Boundary

- override record is descriptive only
- case linkage is readiness only
- compatibility is consumer-facing only
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
