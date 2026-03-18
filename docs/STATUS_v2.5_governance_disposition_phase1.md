# v2.5 Governance Disposition Phase 1 Status

## Scope
This phase introduces Governance Disposition v1 for explicit permit gate
applications.

The goal is to add a stable, opt-in governance disposition artifact for
`guard audit` when `--permit-gate` is enabled. It records final disposition
fact for the existing governance path and is not a second main-path entrypoint.

## Included
- governance disposition v1 contract
- explicit opt-in disposition emission for `guard audit`
- disposition verification for gate off / allow / deny paths

## Explicitly not included
- no second main-path entrypoint
- no permit gate by default
- no audit main-output mutation
- no audit verdict mutation
- no drift / snapshot / risk integration
- no full enforcement framework

## Current status
- phase: v2.5-phase-1
- goal: governance-disposition-v1
- gate-entry: guard.audit
- disposition-mode: explicit-opt-in
- default-behavior: unchanged
