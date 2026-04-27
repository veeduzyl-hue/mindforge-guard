# v4.4 Limited Enforcement Authority Finalization Phase 1

## Goal

Freeze the limited enforcement authority line at a finalized recommendation-only boundary without changing the audit main path, audit verdict, actual audit exit code, permit gate semantics, or deny exit code `25`.

## In Scope

- define limited-authority finalization stage and final acceptance-boundary constants
- freeze finalization gates and final export boundary
- validate sidecar serialization against the finalized contract
- add limited-authority finalization verification

## Out of Scope

- no actual authority execution
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

## Boundary Freeze

- remains explicit opt-in
- remains default-off
- remains local-audit-only
- remains audit-adjacent
- remains sidecar-only
- remains recommendation-only
- remains non-executing
- keeps `review_gate_deny_exit_recommendation_only`
- keeps `current_audit_exit_code = null`
- keeps `proposed_audit_exit_code = 25` only on the narrow deny recommendation path

## Boundary State

- finalization now anchors the limited-authority completion boundary
- final export surface extends the stabilization base additively
- serializer validation now targets the finalized contract
