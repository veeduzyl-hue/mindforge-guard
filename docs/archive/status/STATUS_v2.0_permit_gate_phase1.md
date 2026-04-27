# v2.0 Permit Gate Phase 1 Status

## Scope
This phase introduces the first explicit opt-in permit gate on the Guard main path.

The single goal is to let Guard consume the stabilized `policy-to-permit bridge contract`
as a governance input during `guard audit`, while keeping default behavior unchanged.

## Included
- explicit opt-in permit gate runtime
- main-path bridge contract consumption in `guard audit`
- isolated permit gate decision result
- off / allow / deny verification coverage

## Explicitly not included
- no permit gate by default
- no full enforcement rollout
- no audit main-output mutation by default
- no audit verdict mutation
- no drift / snapshot / risk integration
- no policy platform expansion

## Current status
- phase: v2.0-phase-1
- gate-default: off
- gate-scope: audit-main-path-only
- enforcement-rollout: not-included
