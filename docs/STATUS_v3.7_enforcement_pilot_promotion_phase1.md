# v3.7 Stronger Enforcement Pilot Promotion Phase 1

## Goal

Promote the stronger-enforcement pilot into a stable explicit opt-in contract without changing `guard audit` default behavior, permit gate semantics, audit main output, audit main verdict, or deny exit code `25`.

## In Scope

- define the promoted stronger-enforcement pilot contract boundary
- freeze promoted export boundary and promoted sidecar surface
- add verification for promoted export and sidecar stability

## Out of Scope

- no limited authority
- no enforcing authority
- no default-on enforcement
- no audit main output mutation
- no audit main verdict mutation
- no deny exit code change
- no permit-gate semantic rewrite
- no canonical action contract rewrite
- no new governance object
- no drift, snapshot, or risk integration
- no UI or control plane

## Phase Position

This phase is a promotion pass over the hardened stronger-enforcement pilot from `v3.6.0`.

## Boundary Freeze

- promoted pilot remains explicit opt-in only
- promoted pilot remains default-off
- promoted pilot remains non-enforcing
- promoted pilot remains sidecar-only
- promoted pilot remains non-authoritative on the audit path
- promoted export boundary is explicitly frozen
- promoted sidecar/result surface is explicitly frozen

## Boundary State

- promoted pilot contract is now anchored as explicit opt-in, default-off, and sidecar-only
- promoted export set extends the hardened export base without removing or renaming prior exports
- promoted validators remain contract-only checks rather than authority or takeover gates
