# Exception Stabilization Boundary

`v5.2 Phase 3` freezes the exception layer as a final-acceptance consumer
surface only.

## Boundary

- upstream source is `governance_case_linkage_profile`
- compatibility source is `governance_exception_compatibility_contract`
- downstream purpose is final exception consumer stability only
- recommendation-only
- additive-only
- non-executing
- default-off
- no authority scope expansion
- no main-path takeover
- no governance object addition

## Preserved semantics

- exception waiver semantics preserved
- override record semantics preserved
- case linkage semantics preserved
- exception compatibility semantics preserved
- snapshot / evidence / policy / enforcement / approval / judgment semantics preserved
- audit main output preserved
- audit main verdict preserved
- actual audit exit code preserved
- denied exit code `25` preserved
- `--permit-gate` semantics preserved
- `--enforcement-pilot` semantics preserved
- `--limited-enforcement-authority` semantics preserved
- `guard action classify` semantics preserved

## Final consumer surface

- exception layer exports a stable final acceptance profile
- exception layer exports a stable final consumer contract
- exception layer exports a stable validation / permit-chain surface
- exception layer remains descriptive and non-authoritative in phase 3
