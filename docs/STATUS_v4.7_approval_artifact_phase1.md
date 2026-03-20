# v4.7 Approval Artifact Phase 1

This phase introduces an additive-only approval-adjacent artifact above the
finalized judgment layer.

In scope:
- `approval_artifact_profile`
- exception / waiver contract
- approval consumer surface
- approval validation and export surface
- boundary clarification between approval and judgment layers

Out of scope:
- actual authority execution
- automatic authority execution
- default-on authority
- audit main output mutation
- audit main verdict mutation
- actual audit exit mutation
- authority scope expansion
- main-path takeover
- drift / snapshot / risk integration
- UI / control plane

Boundary requirements:
- recommendation-only
- additive-only
- audit output preserved
- audit verdict preserved
- actual exit code preserved
- deny exit code preserved as `25`
- authority scope preserved as `review_gate_deny_exit_recommendation_only`
- override execution remains unavailable
