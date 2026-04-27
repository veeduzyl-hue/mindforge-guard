# v2.4 Governance Application Record Phase 1 Status

## Scope
This phase introduces Governance Application Record v1 for explicit permit gate
applications.

The goal is to add a stable, opt-in application record artifact for
`guard audit` when `--permit-gate` is enabled. It records application fact for
the existing governance path and is not a second main-path entrypoint.

## Included
- governance application record v1 contract
- explicit opt-in application record emission for `guard audit`
- application record verification for gate off / allow / deny paths

## Explicitly not included
- no second main-path entrypoint
- no permit gate by default
- no audit main-output mutation
- no audit verdict mutation
- no drift / snapshot / risk integration
- no full enforcement framework

## Current status
- phase: v2.4-phase-1
- goal: governance-application-record-v1
- gate-entry: guard.audit
- application-record-mode: explicit-opt-in
- default-behavior: unchanged
