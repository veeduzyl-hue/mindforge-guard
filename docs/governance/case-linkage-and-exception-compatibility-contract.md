# Case Linkage And Exception Compatibility Contract

The `v5.2 Phase 2` compatibility contract freezes the first bounded consumer
shape for override-ready exception artifacts.

## Contract invariants

- `recommendation_only = true`
- `additive_only = true`
- `execution_enabled = false`
- `default_on = false`
- `override_record_ready = true`
- `case_linkage_ready = true`
- `consumer_compatible = true`
- `authority_scope = review_gate_deny_exit_recommendation_only`
- `authority_scope_expansion = false`
- `governance_object_addition = false`
- `main_path_takeover = false`

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
