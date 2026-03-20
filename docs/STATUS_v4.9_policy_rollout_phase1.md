# v4.9 Policy Rollout Phase 1

## Status
- Phase: `v4.9 Phase 1 policy profile and rollout boundary candidate`
- Base: `main@v4.8.0`
- Scope: policy profile and rollout boundary introduction

## Included
- policy profile
- policy boundary and inheritance contract
- policy rollout readiness contract
- policy consumer surface
- policy validation and export surface
- policy lifecycle boundary above enforcement stabilization

## Not Included
- actual authority execution
- automatic authority execution
- default-on authority
- audit main output mutation
- audit main verdict mutation
- actual audit exit code mutation
- deny exit code mutation
- permit gate semantic rewrite
- authority scope expansion
- main-path takeover
- drift, snapshot, or risk integration
- UI or control plane

## Preservation
- recommendation-only posture remains fixed
- additive-only posture remains fixed
- authority scope remains `review_gate_deny_exit_recommendation_only`
- deny exit code remains `25`
- `runAudit.mjs` remains out of scope
