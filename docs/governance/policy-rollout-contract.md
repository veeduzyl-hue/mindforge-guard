# Policy Rollout Contract

## Policy Inheritance Contract
- kind: `policy_inheritance_contract`
- version: `v1`
- boundary: `bounded_policy_inheritance_contract`

## Rollout Readiness Contract
- kind: `policy_rollout_readiness_contract`
- version: `v1`
- boundary: `bounded_policy_rollout_readiness_contract`

## Guarantees
- recommendation-only remains `true`
- additive-only remains `true`
- execution-enabled remains `false`
- default-on remains `false`
- authority scope remains `review_gate_deny_exit_recommendation_only`
- authority scope expansion remains `false`
- audit output preserved
- audit verdict preserved
- actual exit code preserved
- denied exit code preserved at `25`
- governance object addition remains `false`
