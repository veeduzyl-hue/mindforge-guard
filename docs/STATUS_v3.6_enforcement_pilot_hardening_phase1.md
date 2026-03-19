# v3.6 Stronger Enforcement Pilot Hardening Phase 1

## Goal

Stabilize the explicit opt-in stronger-enforcement pilot as a release-safe, non-enforcing sidecar boundary.

## In Scope

- stronger enforcement pilot contract hardening
- stable sidecar output shape
- stable serialization helpers for pilot output
- compatibility verification against audit default path and permit-gate behavior

## Out of Scope

- no authority transfer
- no audit main output mutation
- no audit verdict mutation
- no deny exit code change
- no permit-gate semantic rewrite
- no new governance object
- no default-on enforcement
- no drift, snapshot, or risk integration
- no UI or control plane

## Phase Position

Phase 1 exists only to harden the stronger-enforcement pilot boundary so it remains explicit opt-in, default-off, non-enforcing, and safe to consume as a stable sidecar.

## Boundary Freeze

- hardened contract remains explicit opt-in only
- hardened contract remains default-off
- hardened contract remains non-enforcing
- hardened contract remains sidecar-only
- hardened contract does not claim audit exit authority
- audit main output and audit main verdict remain unchanged
