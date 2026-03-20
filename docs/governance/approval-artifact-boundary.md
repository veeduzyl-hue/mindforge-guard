# Approval Artifact Boundary

`v4.7 Phase 1` introduces an approval-adjacent artifact above the stabilized
judgment layer.

Included:
- `approval_artifact_profile`
- approval consumer surface
- additive-only export surface
- recommendation-only exception contract

Preserved:
- audit main output
- audit main verdict
- actual audit exit behavior
- deny exit code `25`
- permit gate semantics
- enforcement pilot semantics
- limited-authority semantics
- authority scope `review_gate_deny_exit_recommendation_only`

Not included:
- actual authority execution
- automatic authority execution
- default-on approval
- main-path takeover
