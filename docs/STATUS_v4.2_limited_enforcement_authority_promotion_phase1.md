# v4.2 Limited Enforcement Authority Promotion Phase 1

## Goal

Promote the limited enforcement authority pilot as a stronger explicit opt-in recommendation-only contract without changing `guard audit` default behavior, audit main output, audit main verdict, actual audit exit code, permit gate semantics, or deny exit code `25`.

## In Scope

- define promotion stage and promotion boundary constants
- freeze promoted export boundary and promotion guards
- add verification for promoted export and recommendation-only scope stability

## Out of Scope

- no stabilization
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

This phase is a promotion pass over the hardened limited enforcement authority pilot from `v4.1.0`.

## Boundary Freeze

- limited authority remains explicit opt-in only
- limited authority remains default-off
- limited authority remains audit-adjacent
- limited authority remains sidecar-only
- limited authority remains recommendation-only
- recommendation-only scope remains explicitly frozen
- promoted export boundary is explicitly frozen

## Boundary State

- promoted contract now anchors stable recommendation-only authority framing
- promoted export set extends the hardened export base without removing prior exports
- promotion guards remain non-executing boundary checks rather than authority-execution gates
