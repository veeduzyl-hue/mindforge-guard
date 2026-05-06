# v6.20 - Execution-Bound Transition Validity Preview

## Status

`v6.20` starts as an internal preview-only governance boundary.

Core narrative: `Transition explanation, not execution permission`.

It does not change the current commercial release baseline.
`v6.13.1` remains the current commercial baseline.
No README, current product docs, current demo docs, License Hub, pricing, release asset, or public commercial entitlement surface is changed.

## Boundary Definition

`v6.20` explains whether a declared pre-execution transition preserves the already-mapped symbolic prerequisites needed for execution-bound validity.

The boundary is:

- fixture-backed
- explanation-only
- preview-only
- recommendation-only
- non-executing
- additive-only
- deterministic
- non-enforcing
- default-off

The preview surface is:

- `guard transition explain --preview --json --fixture-file <file>`

The required preview output includes:

- `schema_version`
- `preview: true`
- `explanation_only: true`
- `enforcement_action: "none"`
- `blocking_effect: false`
- `execution_authority_granted: false`
- `input_ref`
- `input_summary`
- `declared_transition`
- `prerequisite_refs`
- `transition_findings[]`
- `preservation_summary`
- `non_enforcement_boundary`
- `deterministic_hash`

## Fixture Scope

The compact fixture bundle for `v6.20` includes transition explanation cases for:

- `preserved`
- `changed`
- `partially_preserved`
- `not_applicable`
- `unknown`

## Not Included

`v6.20` does not include:

- execution permission grant
- enforcement behavior
- blocking behavior
- admit / deny / defer
- allow / block
- commit gate behavior
- permit gate behavior
- deployment gate behavior
- runtime enforcement
- policy-engine behavior
- full symbolic runtime behavior
- formal state equivalence proof
- exit `21`
- exit `25`
- audit / permit / classify semantic change
- authority expansion
- commercial entitlement change

## Verification Surface

PR-A verification starts with:

- `node scripts/verify_v6_20_transition_validity_preview.mjs`

The boundary remains compatible only if the preview stays fixture-backed, explanation-only, recommendation-only, non-executing, additive-only, explicitly non-enforcing, and bounded to frozen prerequisite summaries plus receipt references.
