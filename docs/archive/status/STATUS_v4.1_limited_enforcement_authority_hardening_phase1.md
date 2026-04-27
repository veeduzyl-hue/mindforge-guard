# v4.1 Limited Enforcement Authority Hardening Phase 1

## Goal

Harden the limited enforcement authority pilot as a stable explicit opt-in recommendation-only sidecar boundary without changing `guard audit` default behavior, audit main output, audit main verdict, actual audit exit code, permit gate semantics, or deny exit code `25`.

## In Scope

- freeze limited-authority sidecar serializer defaults
- freeze top-level and payload field order
- freeze compatibility guards and recommendation-only scope
- add verification for output stability and repeated-run stability

## Out of Scope

- no promotion
- no audit main output mutation
- no audit main verdict mutation
- no actual audit exit-code mutation
- no deny exit code change
- no permit-gate semantic rewrite
- no canonical action contract rewrite
- no new governance object
- no drift, snapshot, or risk integration
- no UI or control plane
- no automatic authority execution

## Phase Position

This phase is a hardening pass over the released limited enforcement authority pilot from `v4.0.0`.

## Boundary Freeze

- limited authority remains explicit opt-in only
- limited authority remains default-off
- limited authority remains local-audit-only
- limited authority remains audit-adjacent
- limited authority remains sidecar-only
- recommendation-only scope is explicitly frozen
- serializer defaults and field order are explicitly frozen

## Boundary State

- hardened authority contract now anchors stable serializer defaults and stable field order
- recommendation-only authority scope remains pinned to `review_gate_deny_exit_recommendation_only`
- hardening guards remain compatibility checks rather than promotion or execution gates
