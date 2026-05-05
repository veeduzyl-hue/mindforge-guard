# v6.18 Authority Drift / Execution-Time Authority Validity Boundary

## Status

`v6.18` starts as an internal preview-only governance boundary.

It does not change the current commercial release baseline.
`v6.13.1` remains the current commercial baseline.
No README, License Hub, pricing, release asset, or public commercial entitlement surface is changed.

## Boundary Definition

`v6.18` explains whether a previously valid authority condition still remains valid at execution time.

The boundary is:

- fixture-backed
- explanation-only
- preview-only
- additive-only
- non-enforcing
- non-executing
- default-off

The preview surface is:

- `guard authority drift --preview --json --fixture-file <file>`

The required preview output includes:

- `kind: "authority_drift_preview"`
- `version: "v6.18"`
- `preview: true`
- `enforcement_action: "none"`
- `blocking_effect: false`
- `execution_authority_granted: false`
- `authority_drift.status`
- `authority_drift.execution_time_validity`
- `authority_drift.drift_factors`
- `authority_drift.reason_codes`

## Fixture Scope

The fixture-backed cases for `v6.18` are:

- stable authority at execution time
- scope drift invalidates execution-time authority
- evidence decay produces unknown execution-time validity
- actor drift invalidates authority
- outside-scope non-authority request

## Not Included

`v6.18` does not include:

- execution authority grant
- blocking behavior
- exit `21`
- exit `25`
- audit / permit / classify semantic change
- IAM / RBAC / SSO / tenant behavior
- dashboard / control-plane / orchestrator behavior
- current commercial entitlement change

## Verification Surface

Boundary verification starts with:

- `node scripts/verify_v6_18_authority_drift_boundary_fixtures.mjs`

The boundary remains compatible only if the preview stays recommendation-only, additive-only, non-executing, default-off, and explicitly non-authoritative.
