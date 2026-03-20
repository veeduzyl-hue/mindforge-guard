# Waiver And Override Contract

The waiver and override contracts remain approval-adjacent only.

Waiver contract guarantees:
- `available = true`
- `recommendation_only = true`
- `additive_only = true`
- `execution_enabled = false`

Override record guarantees:
- `available = true`
- `contract_kind = approval_override_record`
- `executing = false`
- `audit_output_preserved = true`
- `audit_verdict_preserved = true`
- `actual_exit_code_preserved = true`

Approval receipt guarantees:
- `readiness = consumer_compatible`
- `denied_exit_code_preserved = 25`
- `authority_scope = review_gate_deny_exit_recommendation_only`
- `governance_object_addition = false`
