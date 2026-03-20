# Approval Final Acceptance Contract

The `approval_stabilization_profile` establishes the final acceptance contract
for the additive-only approval layer.

Final consumer contract:
- `acceptance_level = final_consumer_ready`
- `recommendation_only = true`
- `additive_only = true`
- `override_execution_available = false`
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
- `approval_exception_contract_preserved = true`
- `approval_waiver_contract_preserved = true`
- `approval_override_record_preserved = true`
- `approval_receipt_stable = true`

This contract does not introduce approval execution, does not mutate audit
main-path semantics, and does not widen any authority boundary.
