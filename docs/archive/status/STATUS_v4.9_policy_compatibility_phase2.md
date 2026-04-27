## v4.9 Phase 2

Status: policy compatibility, pinning, and migration readiness candidate

Scope:
- introduce policy compatibility contract
- introduce policy pinning contract
- introduce policy migration readiness profile
- introduce policy receipt-readiness and consumer compatibility surface
- preserve additive-only policy lifecycle semantics

Not included:
- actual authority execution
- automatic authority execution
- default-on authority
- audit output mutation
- audit verdict mutation
- actual exit-code mutation
- deny exit-code change
- permit-gate semantic rewrite
- enforcement-pilot semantic rewrite
- limited-enforcement-authority semantic rewrite
- authority scope expansion
- governance object addition
- main-path takeover
- drift / snapshot / risk integration
- UI / control plane
