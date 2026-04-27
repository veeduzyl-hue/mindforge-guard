# v2.2 Governance Decision Record Phase 1 Status

## Scope
This phase introduces Governance Decision Record v1 for explicit permit gate
decisions.

The goal is to add a stable, opt-in governance decision artifact for
`guard audit` when `--permit-gate` is enabled. It is not a second main-path
entrypoint and it is not a full enforcement rollout.

## Included
- governance decision record v1 contract
- explicit opt-in decision record emission for `guard audit`
- decision record verification for gate off / allow / deny paths

## Explicitly not included
- no second main-path entrypoint
- no permit gate by default
- no audit main-output mutation
- no audit verdict mutation
- no drift / snapshot / risk integration
- no full enforcement framework

## Current status
- phase: v2.2-phase-1
- goal: governance-decision-record-v1
- gate-entry: guard.audit
- decision-record-mode: explicit-opt-in
- default-behavior: unchanged
