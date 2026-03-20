# Judgment Final Acceptance Contract

The `judgment_stabilization_profile` establishes the final acceptance contract
for the additive-only judgment layer.

Final consumer contract:
- `acceptance_level = final_consumer_ready`
- `recommendation_only = true`
- `additive_only = true`
- `audit_output_preserved = true`
- `audit_verdict_preserved = true`
- `actual_exit_code_preserved = true`
- `denied_exit_code_preserved = 25`
- `authority_scope = review_gate_deny_exit_recommendation_only`
- `governance_object_addition = false`

Preserved semantics:
- `permit_gate_semantics_preserved = true`
- `enforcement_pilot_semantics_preserved = true`
- `limited_authority_semantics_preserved = true`
- `judgment_mapping_stable = true`
- `consumer_contract_ready = true`

This contract does not introduce execution authority, does not mutate audit
main-path semantics, and does not widen any governance or authority boundary.
