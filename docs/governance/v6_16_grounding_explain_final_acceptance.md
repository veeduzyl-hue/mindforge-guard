# v6.16 Grounding / Provenance Preview Boundary Final Acceptance / RC Freeze

## Status

`v6.16` Grounding / Provenance Preview Boundary is RC-frozen as an internal governance boundary.

This is not a commercial release.
`v6.13.1` remains the current commercial release baseline.
No release preparation is authorized.
No production deployment is authorized.
No commercial surface update is authorized.
No README or current-docs update is authorized.
No License Hub / Vercel / Paddle / pricing work is authorized.

## Scope

The accepted `v6.16` preview scope includes:

- `guard grounding explain --preview --json --fixture-file <file>`
- `current_evidence_package v1`
- `provenance_classification v1`
- `grounding_status v1`
- `grounding_explanation`
- `evidence_adequacy` supporting layer
- `evidence_hash`
- `source_hash`
- `provenance_hash`
- `deterministic_hash`
- `admissibility_readiness` reserved only

## Preserved Non-Goals

The `v6.16` Grounding / Provenance Preview Boundary remains RC-frozen with the following preserved non-goals:

- no admissibility decision
- no admit / deny / defer
- no `commitment_candidate`
- no `commitment_receipt`
- no commit gate
- no deployment gate
- no runtime enforcement
- no live repo reads
- no live source fetching
- no RAG integration
- no regulatory reporting module
- no insider-threat module
- no means/motive/opportunity modeling
- no commercial-surface changes

## Evidence Adequacy Boundary

The `evidence_adequacy` layer remains:

- supporting-only
- non-authoritative
- does not create permission
- does not expand authority
- does not alter audit verdicts
- does not change exit semantics
- records explicit evidence / source / artifact records
- records omissions with reasons
- records uncertainty notes
- records contrary artifact references

## Exit Semantics

The accepted `v6.16` preview exit behavior remains:

- `grounded` exits `0`
- `partially_grounded` exits `0`
- `ungrounded` exits `0`
- `unknown` exits `0`
- missing required options exit `2`
- malformed / invalid fixture exits `30`
- exit `21` is not used by `v6.16` preview
- exit `25` is not used by `v6.16` preview
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

## Direct Command Checks

The accepted direct command checks are:

- `node packages/guard/src/runGuard.mjs grounding explain --preview --json --fixture-file fixtures/grounding/grounding-boundary.grounded.valid.json`
- `node packages/guard/src/runGuard.mjs authority check --preview --json --fixture-file fixtures/authority/authority-boundary.inside-scope.valid.json`
- `node packages/guard/src/runGuard.mjs authority explain --preview --json --fixture-file fixtures/authority/authority-boundary.inside-scope.valid.json`

## Protected Surfaces

Post-merge verification confirmed no changes to:

- `README.md`
- `docs/product/current/*`
- `docs/demos/current/*`
- `docs/first-10-minutes.md`
- `docs/trust/safety-boundary.md`
- `apps/license-hub/*`
- `vercel.json`
- Paddle / checkout / pricing / license issuing / license validation surfaces

## RC Freeze Decision

`v6.16` Grounding / Provenance Preview Boundary is RC-frozen as an internal governance boundary.

This is not a commercial release.
`v6.13.1` remains the current commercial release baseline.
No release, deployment, pricing, License Hub, Vercel, README, demo, or public commercial update is authorized.
