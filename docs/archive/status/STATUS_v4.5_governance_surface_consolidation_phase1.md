# v4.5 Governance Surface Consolidation Phase 1

## Goal

Consolidate the final public governance surface for the finalized limited enforcement authority line without changing audit main-path semantics, authority scope, permit gate behavior, or exit behavior.

## In Scope

- define a release-grade public export surface for limited enforcement authority
- place limited enforcement authority on the consumer-facing governance surface
- place limited enforcement authority on the governance consumption profile
- add governance surface consolidation verification
- document the consolidated public boundary and consumer contract

## Out of Scope

- no actual authority execution
- no automatic authority execution
- no default-on authority
- no audit main output mutation
- no audit main verdict mutation
- no actual audit exit-code mutation
- no deny exit code change
- no permit-gate rewrite
- no canonical action rewrite
- no authority scope expansion
- no new governance object
- no drift / snapshot / risk integration
- no UI / control plane

## Consolidation Boundary

- limited enforcement authority remains explicit opt-in
- remains default-off
- remains local-audit-only
- remains audit-adjacent
- remains sidecar-only
- remains recommendation-only
- remains non-executing
- retains `review_gate_deny_exit_recommendation_only`
- retains `current_audit_exit_code = null`
- retains `proposed_audit_exit_code = 25` only on the narrow deny recommendation path

## Outcome

- limited enforcement authority is now treated as a release-grade consumer-facing governance surface
- public exports are frozen additively above the finalized contract
- consumption linkage is explicit and verifiable
