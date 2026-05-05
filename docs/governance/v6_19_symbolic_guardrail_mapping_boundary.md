# v6.19 Symbolic Guardrail Mapping Boundary

## Status

`v6.19` starts as an internal preview-only governance boundary.

It does not change the current commercial release baseline.
`v6.13.1` remains the current commercial baseline.
No README, current product docs, current demo docs, License Hub, pricing, release asset, or public commercial entitlement surface is changed.

## Boundary Definition

`v6.19` maps admissibility-related requirements to deterministic symbolic guardrail surfaces.

The boundary is:

- fixture-backed
- mapping-only
- preview-only
- recommendation-only
- non-executing
- additive-only
- deterministic
- non-enforcing
- default-off

The preview surface is:

- `guard guardrail map --preview --json --fixture-file <file>`

The required preview output includes:

- `schema_version`
- `preview: true`
- `mapping_only: true`
- `enforcement_action: "none"`
- `blocking_effect: false`
- `execution_authority_granted: false`
- `input_ref`
- `input_summary`
- `requirements[]`
- `mappings[]`
- `unmapped_requirements[]`
- `non_enforcement_boundary`
- `deterministic_hash`

## Fixture Scope

The compact fixture bundle for `v6.19` includes symbolic mapping cases for:

- `mapped`
- `partially_mapped`
- `unmapped`
- `out_of_scope`
- `unknown`

## Not Included

`v6.19` does not include:

- guardrail pass/fail evaluation
- enforcement behavior
- admit / deny / defer
- allow / block
- commit gate behavior
- permit gate behavior
- deployment gate behavior
- runtime enforcement
- policy-engine behavior
- full symbolic runtime behavior
- exit `21`
- exit `25`
- audit / permit / classify semantic change
- authority expansion
- commercial entitlement change

## Verification Surface

PR-A verification starts with:

- `node scripts/verify_v6_19_symbolic_guardrail_mapping_preview.mjs`

The boundary remains compatible only if the preview stays mapping-only, recommendation-only, non-executing, additive-only, explicitly non-enforcing, and bounded to fixture-declared symbolic surfaces.
