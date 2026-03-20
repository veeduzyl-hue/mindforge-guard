# v4.6 Judgment Profile Phase 1

## Goal

Define a unified judgment layer that maps signal, permit, governance decision, and limited-authority recommendation into a single additive-only judgment profile without changing audit main-path semantics.

## In Scope

- define `Judgment Profile v1`
- define judgment classes and source order
- define a consumer-facing judgment surface
- define judgment validation and export surface
- map policy-permit bridge signal, permit gate result, governance decision, and limited-authority recommendation into one profile
- add judgment verification and boundary documentation

## Out of Scope

- no actual authority execution
- no automatic authority execution
- no default-on authority
- no audit main output mutation
- no audit main verdict mutation
- no actual audit exit-code mutation
- no deny exit code change
- no permit-gate rewrite
- no authority scope expansion
- no new governance object
- no main-path takeover
- no drift / snapshot / risk integration
- no UI / control plane

## Boundary

- judgment remains a mapping and validation layer only
- permit semantics remain unchanged
- limited-authority recommendation semantics remain unchanged
- authority scope remains `review_gate_deny_exit_recommendation_only`
- `current_audit_exit_code` remains `null`
- `proposed_audit_exit_code` remains `25` only on the narrow deny recommendation path
