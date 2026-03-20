# v4.0 Limited Enforcement Authority Phase 1

## Goal

Start a strictly explicit opt-in, default-off, audit-adjacent limited enforcement authority pilot without changing `guard audit` default behavior, permit gate semantics, audit main output, audit main verdict, or deny exit code `25`.

## In Scope

- define the limited enforcement authority pilot boundary
- define the narrow authority scope and recommendation-only authority status
- add verification for authority-scope stability and compatibility stability

## Out of Scope

- no default-on enforcement
- no audit main output mutation
- no audit main verdict mutation
- no deny exit code change
- no permit-gate semantic rewrite
- no canonical action contract rewrite
- no new governance object
- no drift, snapshot, or risk integration
- no UI or control plane
- no main-path takeover

## Phase Position

This phase is the first authority-bearing experiment after the finalized non-authority stronger-enforcement pilot line in `v3.9.0`.

## Boundary Freeze

- limited authority pilot remains explicit opt-in only
- limited authority pilot remains default-off
- limited authority pilot remains local-audit-only
- limited authority pilot remains audit-adjacent
- limited authority pilot remains sidecar-emitted
- limited authority pilot remains recommendation-only for deny-exit and review-gate semantics
- actual audit main output, verdict, and exit behavior remain unchanged

## Boundary State

- limited authority is now scoped to `review_gate_deny_exit_recommendation_only`
- authority status is emitted as stable sidecar data rather than applied to audit main-path behavior
- validators remain pilot-scope and compatibility checks rather than takeover or platform gates
