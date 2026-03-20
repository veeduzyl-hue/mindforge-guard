# Authority Proof And Rollback Safety Contract

## Authority Proof Contract
- kind: `authority_proof_contract`
- version: `v1`
- boundary: `bounded_non_executing_authority_proof`

### Guarantees
- recommendation-only remains `true`
- additive-only remains `true`
- execution-enabled remains `false`
- default-on remains `false`
- authority scope remains `review_gate_deny_exit_recommendation_only`

## Rollback Safety Contract
- kind: `rollback_safety_contract`
- version: `v1`
- boundary: `bounded_non_executing_rollback_safety`

### Guarantees
- rollback execution remains `false`
- override execution remains `false`
- audit output preserved
- audit verdict preserved
- actual exit code preserved
- denied exit code preserved at `25`
- governance object addition remains `false`
