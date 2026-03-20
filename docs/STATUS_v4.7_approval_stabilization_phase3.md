# v4.7 Approval Stabilization Phase 3

This phase consolidates the additive-only approval layer into a stabilized
final-acceptance contract.

In scope:
- `approval_stabilization_profile`
- final acceptance boundary freeze
- final approval consumer contract freeze
- preserved semantics declaration
- stabilization verification

Out of scope:
- actual authority execution
- automatic authority execution
- default-on authority
- audit main output mutation
- audit main verdict mutation
- actual audit exit mutation
- authority scope expansion
- governance object addition
- main-path takeover

Final acceptance requirements:
- recommendation-only
- additive-only
- override execution unavailable
- audit output preserved
- audit verdict preserved
- actual exit code preserved
- denied exit code preserved as `25`
- authority scope preserved as `review_gate_deny_exit_recommendation_only`
