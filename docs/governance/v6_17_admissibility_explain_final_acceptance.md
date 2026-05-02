# v6.17 Admissibility Readiness / Explanation Boundary Final Acceptance / RC Freeze

## Status

`v6.17` Admissibility Readiness / Explanation Boundary is RC-frozen as an internal governance boundary.

This is not a commercial release.
`v6.13.1` remains the current commercial baseline.
No release preparation is authorized.
No production deployment is authorized.
No commercial surface update is authorized.
No License Hub / Vercel / Paddle / pricing / README / demo / release asset changes were made.

## Scope

The accepted `v6.17` internal final-acceptance scope includes:

- `guard admissibility explain --preview --json --fixture-file <file>`
- `admissibility_input_package`
- `admissibility_prerequisite_matrix`
- `admissibility_explanation`
- reserved-only `admissibility_result`
- explicit `non_enforcement_boundary`
- deterministic `deterministic_hash`
- deterministic `input_package_hash`
- fixture-backed readiness states for `explanation_ready`
- fixture-backed readiness states for `explanation_incomplete`
- fixture-backed readiness states for `explanation_blocked`
- fixture-backed readiness states for `explanation_unknown`

## Preserved Non-Goals

`v6.17` remains RC-frozen with the following preserved non-goals:

- no admissibility decision
- no admit / deny / defer
- no commit gate
- no permit gate
- no deployment gate
- no runtime enforcement
- no live repo reads
- no live source fetching
- no commercial-surface changes

## Exit Semantics

The accepted `v6.17` preview exit behavior remains:

- `explanation_ready` exits `0`
- `explanation_incomplete` exits `0`
- `explanation_blocked` exits `0`
- `explanation_unknown` exits `0`
- missing required options exit `2`
- unknown options exit `2`
- malformed / invalid fixture exits `30`
- exit `21` is not used by `v6.17`
- exit `25` is not used by `v6.17`
- no new global exit semantics

## Verification Chain

The RC freeze verification chain is:

- `node scripts/verify_v6_14_authority_boundary_fixtures.mjs`
- `node scripts/verify_v6_14_authority_check_preview.mjs`
- `node scripts/verify_v6_14_authority_preview_acceptance.mjs`
- `node scripts/verify_v6_15_authority_explain_preview.mjs`
- `node scripts/verify_v6_15_authority_explain_acceptance.mjs`
- `node scripts/verify_v6_15_authority_explain_final_acceptance.mjs`
- `node scripts/verify_v6_16_grounding_boundary_fixtures.mjs`
- `node scripts/verify_v6_16_grounding_explain_preview.mjs`
- `node scripts/verify_v6_16_grounding_explain_acceptance.mjs`
- `node scripts/verify_v6_16_grounding_explain_final_acceptance.mjs`
- `node scripts/verify_v6_17_admissibility_boundary_fixtures.mjs`
- `node scripts/verify_v6_17_admissibility_explain_preview.mjs`
- `node scripts/verify_v6_17_admissibility_explain_final_acceptance.mjs`

## RC Freeze Decision

`v6.17` remains preview-only, fixture-backed, explanation-only, non-authoritative, non-executing, additive-only.

It does not implement admissibility decision.
It does not emit admit / deny / defer.
It does not implement commit gate, permit gate, deployment gate, or runtime enforcement.
It does not use exit `21` or `25`.
