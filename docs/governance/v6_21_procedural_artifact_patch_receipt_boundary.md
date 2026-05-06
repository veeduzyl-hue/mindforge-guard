# v6.21 - Procedural Artifact Patch Receipt Boundary

## Status

`v6.21` starts as an internal preview-only governance boundary.

Core narrative: `Receipt of procedural change, not runtime skill execution`.

It does not change the current commercial release baseline.
`v6.13.1` remains the current commercial baseline.
No README, current product docs, current demo docs, License Hub, pricing, release asset, or public commercial entitlement surface is changed.

## Boundary Definition

`v6.21` records a declared procedural artifact or skill-patch change against frozen `v6.17-v6.20` summaries and receipt refs.

The boundary is:

- fixture-backed
- receipt-only
- explanation-only
- preview-only
- recommendation-only
- non-executing
- additive-only
- deterministic
- non-enforcing
- default-off

The PR-A preview surface is verifier-harness only.
There is no CLI in PR-A.
There are no `runGuard` changes in PR-A.

The required preview output includes:

- `schema_version`
- `preview: true`
- `receipt_only: true`
- `explanation_only: true`
- `execution_performed: false`
- `installation_performed: false`
- `permission_granted: false`
- `workflow_deployed: false`
- `agent_orchestration_performed: false`
- `file_mutation_performed: false`
- `enforcement_action: "none"`
- `blocking_effect: false`
- `input_ref`
- `artifact_subject`
- `declared_patch`
- `consumed_receipt_refs`
- `procedural_findings[]`
- `receipt_boundary`
- `deterministic_hash`

## Frozen Summary Consumption

`v6.21` consumes deterministic frozen lineage only:

- `v6.17` admissibility prerequisite summaries / receipt refs
- `v6.18` execution-time authority drift / validity summaries
- `v6.19` symbolic guardrail mapping summaries
- `v6.20` transition validity / preservation summaries

It does not recompute those prior decisions.
It does not read live repo state during preview receipt construction.

## Fixture Scope

The compact fixture bundle for `v6.21` includes procedural artifact receipt cases for:

- `receipted`
- `partially_receipted`
- `insufficient_basis`
- `out_of_scope`
- `unknown`

The compact fixture bundle keeps procedural artifact receipt first and treats skill patch receipt as a bounded subtype.

## Not Included

`v6.21` does not include:

- no skill execution runtime
- no skill installation
- no tool permission grant
- no agent orchestration
- no workflow deployment
- no file mutation
- no patch-safe-to-run proof
- no commit gate behavior
- no permit gate behavior
- no deployment gate behavior
- no runtime enforcement
- no policy engine
- no commercial entitlement change
- no live workspace procedural diff
- exit `21`
- exit `25`

## Verification Surface

PR-A verification starts with:

- `node scripts/verify_v6_21_procedural_artifact_patch_receipt_preview.mjs`

The verifier constructs deterministic preview receipts from the compact fixture bundle, validates the schema and fixture contract, and confirms the non-execution boundary.
The preview receipt remains bounded to frozen summaries plus receipt refs only.
