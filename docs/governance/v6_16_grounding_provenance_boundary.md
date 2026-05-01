# v6.16 Grounding / Provenance Preview Boundary

## Scope

`v6.16` introduces one standalone preview command only:

- `guard grounding explain --preview --json --fixture-file <file>`

This boundary is:

- preview-only
- fixture-backed
- contract-first
- derived-only
- explanation-only
- machine-verifiable
- recommendation-only
- non-enforcing
- default-off

## Not Included

`v6.16` does not implement:

- admissibility decisions
- commit gate behavior
- commitment candidates
- commitment receipts
- deployment gates
- runtime enforcement
- live repo state reads
- live source fetching
- evidence auto-discovery
- web, search, or external connectors

## Frozen Compatibility

This preview boundary does not modify:

- `guard authority check --preview --json --fixture-file <file>`
- `guard authority explain --preview --json --fixture-file <file>`
- `v6.14` authority boundary fixtures or schema
- `v6.15` authority explain preview contracts

`v6.16` remains additive-only and does not mutate the frozen `v6.14` / `v6.15` authority contract line.

## Output Boundary

The preview output remains fixture-backed and explanation-only with these top-level sections:

- `boundary`
- `command`
- `mode`
- `schema_version`
- `input_ref`
- `current_evidence_package`
- `provenance_classification`
- `grounding_status`
- `grounding_explanation`
- `evidence_adequacy`
- `hashes`
- `admissibility_readiness`
- `receipt_linkage`
- `non_enforcement_boundary`

`evidence_adequacy` is an internal supporting explanation layer only. It:

- does not constitute deployment approval
- does not constitute risk acceptance
- does not implement regulatory reporting
- does not create permission
- does not expand authority
- does not alter audit verdicts
- does not alter exit semantics
- records omissions explicitly with reasons when evidence is missing
- keeps uncertainty notes and contrary artifact refs as supporting-only metadata

`admissibility_readiness` is reserved-only in this phase:

- `reserved: true`
- `evaluated: false`
- `decision: null`
- `reason: reserved_for_future_admissibility_boundary`

## Verification

PR1 preview verification is bounded to:

```bash
node scripts/verify_v6_16_grounding_boundary_fixtures.mjs
node scripts/verify_v6_16_grounding_explain_preview.mjs
```

These checks confirm:

- preview-only fixture-backed behavior
- deterministic hash stability
- no exit `21`
- no exit `25`
- no live repo or live source dependency
- no `v6.14` / `v6.15` authority contract mutation
