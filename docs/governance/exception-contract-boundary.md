# Exception Contract Boundary

The approval exception contract remains non-executing and recommendation-only.

Contract guarantees:
- `recommendation_only = true`
- `additive_only = true`
- `actual_authority_execution = false`
- `audit_output_preserved = true`
- `audit_verdict_preserved = true`
- `actual_exit_code_preserved = true`
- `denied_exit_code_preserved = 25`
- `authority_scope = review_gate_deny_exit_recommendation_only`

This boundary does not introduce approval execution, override execution, or any
mutation of the audit main path.
