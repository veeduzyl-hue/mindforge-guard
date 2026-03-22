# Waiver And Exception Contract

The `v5.2 Phase 1` waiver / exception contract freezes the first bounded shape
for governance exception artifacts.

## Contract invariants

- `recommendation_only = true`
- `additive_only = true`
- `non_executing = true`
- `default_on = false`
- `waiver_available = true`
- `exception_record_available = true`
- `authority_scope = review_gate_deny_exit_recommendation_only`
- `authority_scope_expansion = false`
- `governance_object_addition = false`
- `main_path_takeover = false`

## Export invariants

- stable profile exports are frozen
- stable consumer surface exports are frozen
- permit-chain re-export availability is frozen

## Compatibility invariants

- snapshot semantics preserved
- evidence semantics preserved
- policy semantics preserved
- enforcement semantics preserved
- approval semantics preserved
- judgment semantics preserved
- permit gate semantics preserved
- audit output preserved
- audit verdict preserved
- actual exit code preserved
- deny exit code `25` preserved
