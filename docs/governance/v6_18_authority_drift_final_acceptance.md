# v6.18 Authority Drift / Execution-Time Authority Validity Final Acceptance / RC Freeze

## Status

`v6.18` Authority Drift / Execution-Time Authority Validity is RC-frozen as an internal preview-only governance boundary.

This is not a commercial release.
`v6.13.1` remains the current commercial baseline.
No release preparation is authorized.
No production deployment is authorized.
No README, License Hub, pricing, release asset, or public commercial entitlement surface was changed.

## Scope

The accepted `v6.18` internal final-acceptance scope includes:

- `guard authority drift --preview --json --fixture-file <file>`
- `schemas/authority_drift/authority-drift-preview.schema.json`
- fixture-backed `authority_drift.status`
- fixture-backed `authority_drift.execution_time_validity`
- fixture-backed `authority_drift.drift_factors`
- fixture-backed `authority_drift.reason_codes`
- deterministic `deterministic_hash`
- explicit `non_enforcement_boundary`
- stable execution-time authority fixture
- scope drift invalidation fixture
- evidence decay unknown-validity fixture
- actor drift invalidation fixture
- outside-scope non-authority fixture

## Preserved Non-Goals

`v6.18` remains RC-frozen with the following preserved non-goals:

- no execution authority granted
- no blocking effect
- no exit `21`
- no exit `25`
- no audit semantic change
- no permit semantic change
- no classify semantic change
- no IAM / RBAC / SSO / tenant behavior
- no dashboard / control-plane / orchestrator behavior
- no commercial entitlement change

## Exit Semantics

The accepted `v6.18` preview exit behavior remains:

- stable execution-time validity exits `0`
- invalid execution-time validity exits `0`
- unknown execution-time validity exits `0`
- not-applicable execution-time validity exits `0`
- missing required options exit `2`
- unknown options exit `2`
- malformed / invalid fixture exits `30`
- exit `21` is not used by `v6.18`
- exit `25` is not used by `v6.18`

## Verification Chain

The RC freeze verification chain is:

- `node scripts/verify_v6_14_authority_boundary_fixtures.mjs`
- `node scripts/verify_v6_14_authority_check_preview.mjs`
- `node scripts/verify_v6_15_authority_explain_preview.mjs`
- `node scripts/verify_v6_16_grounding_boundary_fixtures.mjs`
- `node scripts/verify_v6_16_grounding_explain_preview.mjs`
- `node scripts/verify_v6_17_admissibility_boundary_fixtures.mjs`
- `node scripts/verify_v6_17_admissibility_explain_preview.mjs`
- `node scripts/verify_v6_18_authority_drift_boundary_fixtures.mjs`
- `node scripts/verify_v6_18_authority_drift_preview.mjs`
- `node scripts/verify_v6_18_authority_drift_acceptance.mjs`
- `node scripts/verify_v6_18_authority_drift_final_acceptance.mjs`

## RC Freeze Decision

`v6.18` remains preview-only, fixture-backed, explanation-only, non-authoritative, non-executing, additive-only.

It does not grant execution authority.
It does not block execution.
It does not change audit, permit, or classify semantics.
It does not change the `v6.13.1` commercial entitlement baseline.
