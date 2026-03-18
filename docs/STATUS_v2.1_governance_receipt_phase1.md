# v2.1 Governance Receipt Phase 1 Status

## Scope
This phase introduces Governance Receipt v1 for explicit permit gate outcomes.

The goal is to add a stable, opt-in governance receipt artifact for `guard audit`
when `--permit-gate` is enabled. It is not a second main-path entrypoint and it
is not a full enforcement rollout.

## Included
- governance receipt v1 contract
- explicit opt-in receipt emission for `guard audit`
- receipt verification for gate off / allow / deny paths

## Explicitly not included
- no second main-path entrypoint
- no permit gate by default
- no audit main-output mutation
- no audit verdict mutation
- no drift / snapshot / risk integration
- no full enforcement framework

## Current status
- phase: v2.1-phase-1
- goal: governance-receipt-v1
- gate-entry: guard.audit
- receipt-mode: explicit-opt-in
- default-behavior: unchanged
