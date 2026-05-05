# v6.18 Authority Drift / Execution-Time Authority Validity Preview Acceptance

## Status

`v6.18` preview acceptance covers the internal preview-only execution-time authority validity surface.

This is not a commercial release.
`v6.13.1` remains the current commercial baseline.

## Accepted Preview Scope

The accepted preview scope includes:

- `guard authority drift --preview --json --fixture-file <file>`
- `schemas/authority_drift/authority-drift-preview.schema.json`
- fixture-backed `authority_drift.status`
- fixture-backed `authority_drift.execution_time_validity`
- fixture-backed `authority_drift.drift_factors`
- fixture-backed `authority_drift.reason_codes`
- deterministic `deterministic_hash`
- explicit non-enforcement boundary metadata

## Accepted Execution-Time States

The accepted fixture-backed preview states are:

- `stable` with execution-time validity `valid`
- `drift_detected` with execution-time validity `invalid`
- `unknown` with execution-time validity `unknown`
- `not_applicable` with execution-time validity `not_applicable`

## Preserved Invariants

`v6.18` preview acceptance preserves:

- audit output / verdict / exit unchanged
- permit behavior unchanged
- classify behavior unchanged
- recommendation-only
- additive-only
- non-executing
- default-off
- no authority scope expansion
- no execution authority granted
- no blocking effect

## Preview Verification Chain

The accepted preview verification chain is:

- `node scripts/verify_v6_18_authority_drift_boundary_fixtures.mjs`
- `node scripts/verify_v6_18_authority_drift_preview.mjs`
- `node scripts/verify_v6_18_authority_drift_acceptance.mjs`

## Non-Goals

`v6.18` preview acceptance does not authorize:

- commit gate behavior
- permit gate behavior
- deployment gate behavior
- runtime enforcement
- deny / allow execution outcomes
- commercial entitlement changes
