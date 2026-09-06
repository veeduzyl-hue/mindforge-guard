# Reason Code To MESR Additive Migration v0.1

Status: Gate 1 migration design. Existing reason-code identifiers, evaluation, report use, and CLI behavior are unchanged. No production binding is implemented in this phase.

## 1. Migration Rule

The existing 56 `GuardReasonCode` values remain the canonical released explanatory vocabulary. MESR bindings are additive metadata:

```text
Reason Code
-> Core Semantic
-> optional Domain Semantic
-> Supported Claim
-> Explicit Non-Claims
```

A reason code is not renamed, removed, or reinterpreted. A binding cannot alter current Evidence Pack validation, evidence coverage, Governance Report verdict computation, report JSON, `audit`, `permit`, or `classify` behavior.

## 2. Explicit Non-Claim Bundles

The migration table uses these defined bundles to keep every row explicit:

| Bundle | Claims the reason code does not support |
| --- | --- |
| `NC-AUTH` | `authority.verified`, `authority.current`, `execution.authorized`, `action.approved` |
| `NC-VERIFY` | `verification.passed`, `change.correct`, `execution.authorized`, `outcome.safe` |
| `NC-EVIDENCE` | `evidence.sufficient`, `artifact.true`, `claim.correct`, `execution.authorized` |
| `NC-REVIEW` | `reviewer.authority_verified`, `applicable_approval`, `execution.authorized`, `legal_compliance` |
| `NC-EFFECT` | `outcome.correct`, `outcome.safe`, `causal_attribution`, `execution.authorized` |
| `NC-COMPLIANCE` | `legally_compliant`, `certified`, `safe`, `execution.authorized` |

## 3. Migration Table

### Authority

| Reason Code | Core Semantic | Domain Semantic | Supported Claim | Explicit Non-Claims |
| --- | --- | --- | --- | --- |
| `MISSING_AUTHORITY` | `mesr.core.authority.scope` | - | authority evidence is missing for the evaluated scope | `NC-AUTH` |
| `DECLARED_AUTHORITY_ONLY` | `mesr.core.authority.declared` | - | producer-declared authority is present | `NC-AUTH` |
| `AUTHORITY_OUT_OF_SCOPE` | `mesr.core.boundary.authority` | - | submitted authority does not cover the recorded scope | `NC-AUTH` |
| `REVIEWER_MISSING` | `mesr.core.review.review` | `mesr.domain.software.review.not_demonstrated` | reviewer context is missing | `NC-REVIEW` |
| `OWNER_MISSING` | `mesr.core.actor.principal` | - | ownership/principal context is missing | `NC-AUTH`, `NC-REVIEW` |
| `TIME_WINDOW_MISSING` | `mesr.core.temporal.basis` | - | authority time binding is missing | `NC-AUTH` |
| `TIME_WINDOW_EXPIRED` | `mesr.core.temporal.basis` | - | submitted authority basis is stale at evaluation time | `NC-AUTH` |

### Scope

| Reason Code | Core Semantic | Domain Semantic | Supported Claim | Explicit Non-Claims |
| --- | --- | --- | --- | --- |
| `OUT_OF_SCOPE_ACTION` | `mesr.core.boundary.authority` | - | recorded action exceeds declared scope | `NC-AUTH`, `NC-EFFECT` |
| `OUT_OF_SCOPE_RESOURCE` | `mesr.core.boundary.authority` | - | touched resource exceeds declared scope | `NC-AUTH`, `NC-EFFECT` |
| `PROTECTED_RESOURCE_TOUCHED` | `mesr.core.action.action` | - | protected-resource contact is recorded | `NC-AUTH`, `NC-EFFECT` |
| `UNDECLARED_FILE_CHANGE` | `mesr.core.action.action` | `mesr.domain.software.change.undeclared_file_observed` | a changed file is outside the declared list/limits | `NC-AUTH`, `NC-VERIFY` |
| `SCOPE_TOO_BROAD` | `mesr.core.claim.scope` | - | submitted scope is broader than the evaluated boundary | `NC-AUTH`, `NC-REVIEW` |
| `SCOPE_INCOMPLETE` | `mesr.core.claim.scope` | - | claim/action scope bindings are incomplete | `NC-AUTH`, `NC-EVIDENCE` |

### Verification

| Reason Code | Core Semantic | Domain Semantic | Supported Claim | Explicit Non-Claims |
| --- | --- | --- | --- | --- |
| `INSUFFICIENT_VERIFICATION` | `mesr.core.evidence.verification` | `mesr.domain.software.verification.insufficient` | available verification is insufficient for the requested claim | `NC-VERIFY` |
| `TESTS_NOT_RUN` | `mesr.core.evidence.verification` | `mesr.domain.software.verification.test_execution_not_demonstrated` | test execution is not demonstrated | `NC-VERIFY` |
| `TESTS_FAILED` | `mesr.core.evidence.verification` | `mesr.domain.software.verification.test_failure_observed` | submitted evidence records unsuccessful tests | `NC-VERIFY` |
| `BUILD_NOT_RUN` | `mesr.core.evidence.verification` | `mesr.domain.software.verification.build_execution_not_demonstrated` | build execution is not demonstrated | `NC-VERIFY` |
| `BUILD_FAILED` | `mesr.core.evidence.verification` | `mesr.domain.software.verification.build_failure_observed` | submitted evidence records an unsuccessful build | `NC-VERIFY` |
| `STATIC_ANALYSIS_NOT_RUN` | `mesr.core.evidence.verification` | `mesr.domain.software.verification.static_analysis_not_demonstrated` | static-analysis execution is not demonstrated | `NC-VERIFY` |
| `SECURITY_SCAN_NOT_RUN` | `mesr.core.evidence.verification` | `mesr.domain.software.verification.security_scan_not_demonstrated` | security-scan execution is not demonstrated | `NC-VERIFY`, `NC-COMPLIANCE` |
| `MANUAL_REVIEW_MISSING` | `mesr.core.review.review` | `mesr.domain.software.review.not_demonstrated` | expected manual review evidence is missing | `NC-REVIEW` |

### Release / Rollback

| Reason Code | Core Semantic | Domain Semantic | Supported Claim | Explicit Non-Claims |
| --- | --- | --- | --- | --- |
| `ROLLBACK_MISSING` | `mesr.core.evidence.item` | `mesr.domain.software.release.rollback_not_demonstrated` | rollback evidence is missing | `NC-VERIFY`, `NC-EFFECT` |
| `ROLLBACK_UNVERIFIED` | `mesr.core.evidence.verification` | `mesr.domain.software.release.rollback_not_verified` | rollback material lacks required verification | `NC-VERIFY`, `NC-EFFECT` |
| `RELEASE_TARGET_UNCLEAR` | `mesr.core.claim.scope` | `mesr.domain.software.release.target_unclear` | release target binding is unclear | `NC-AUTH`, `NC-EFFECT` |
| `PRODUCTION_ENVIRONMENT_UNVERIFIED` | `mesr.core.evidence.verification` | `mesr.domain.software.deployment.environment_not_verified` | production-environment claim is not sufficiently verified | `NC-VERIFY`, `NC-EFFECT` |

### Tool / Action

| Reason Code | Core Semantic | Domain Semantic | Supported Claim | Explicit Non-Claims |
| --- | --- | --- | --- | --- |
| `BLOCKED_ACTION_PRESENT` | `mesr.core.action.action` | - | a halted/blocked action is recorded | `NC-AUTH`, `NC-EFFECT` |
| `DESTRUCTIVE_COMMAND_ATTEMPTED` | `mesr.core.action.tool_invocation` | - | a destructive command attempt is recorded | `NC-AUTH`, `NC-EFFECT` |
| `SECRET_ACCESS_ATTEMPTED` | `mesr.core.action.tool_invocation` | - | a secret-access attempt is recorded | `NC-AUTH`, `NC-EFFECT` |
| `NETWORK_ACCESS_ATTEMPTED` | `mesr.core.action.tool_invocation` | - | a network-access attempt is recorded | `NC-AUTH`, `NC-EFFECT` |
| `UNSAFE_GIT_OPERATION` | `mesr.core.action.tool_invocation` | - | a Git operation with elevated concern is recorded | `NC-AUTH`, `NC-EFFECT` |
| `TOOL_OUTPUT_MISSING` | `mesr.core.evidence.item` | - | expected tool-output evidence is missing | `NC-EVIDENCE`, `NC-VERIFY` |
| `COMMAND_RESULT_MISSING` | `mesr.core.evidence.item` | - | expected command-result evidence is missing | `NC-EVIDENCE`, `NC-VERIFY` |

### Data / Security

| Reason Code | Core Semantic | Domain Semantic | Supported Claim | Explicit Non-Claims |
| --- | --- | --- | --- | --- |
| `HIGH_RISK_DATA` | `mesr.core.evidence.observation` | - | submitted evidence identifies high-risk-data interaction | `NC-AUTH`, `NC-COMPLIANCE` |
| `DATA_SENSITIVITY_UNKNOWN` | `mesr.core.claim.scope` | - | data-sensitivity binding is unknown | `NC-EVIDENCE`, `NC-COMPLIANCE` |
| `CREDENTIAL_RISK` | `mesr.core.actor.identity_assertion` | - | credential-handling risk is recorded | `NC-AUTH`, `NC-COMPLIANCE` |
| `EXFILTRATION_RISK` | `mesr.core.evidence.observation` | - | evidence records possible exfiltration risk | `NC-EFFECT`, `NC-COMPLIANCE` |
| `SECURITY_PATCH_SCOPE_UNCLEAR` | `mesr.core.claim.scope` | `mesr.domain.software.change.diff_scope` | security-patch scope is unclear | `NC-AUTH`, `NC-VERIFY`, `NC-COMPLIANCE` |
| `CYBER_AUTHORIZATION_REQUIRED` | `mesr.core.boundary.authority` | - | stronger applicable authorization evidence is required | `NC-AUTH`, `NC-COMPLIANCE` |

### Evidence Integrity

| Reason Code | Core Semantic | Domain Semantic | Supported Claim | Explicit Non-Claims |
| --- | --- | --- | --- | --- |
| `EVIDENCE_INCOMPLETE` | `mesr.core.evidence.item` | - | evidence is incomplete for the requested interpretation | `NC-EVIDENCE` |
| `MANIFEST_INCOMPLETE` | `mesr.core.evidence.item` | - | evidence inventory is incomplete | `NC-EVIDENCE` |
| `ARTIFACT_MISSING` | `mesr.core.evidence.item` | - | an expected artifact is missing | `NC-EVIDENCE` |
| `ARTIFACT_HASH_MISSING` | `mesr.core.provenance.lineage` | - | stable artifact-integrity binding is missing | `NC-EVIDENCE` |
| `ARTIFACT_REF_UNRESOLVED` | `mesr.core.provenance.lineage` | - | an artifact reference is unresolvable | `NC-EVIDENCE` |
| `PROVENANCE_MISSING` | `mesr.core.provenance.lineage` | - | required lineage is missing | `NC-EVIDENCE` |
| `PRODUCER_IDENTITY_UNKNOWN` | `mesr.core.provenance.producer` | - | producer identity is unknown | `NC-EVIDENCE`, `NC-VERIFY` |
| `NON_DETERMINISTIC_PRODUCER` | `mesr.core.provenance.producer` | - | producer generation may be non-deterministic | `NC-EVIDENCE`, `NC-VERIFY` |

### Dependency Change

| Reason Code | Core Semantic | Domain Semantic | Supported Claim | Explicit Non-Claims |
| --- | --- | --- | --- | --- |
| `DEPENDENCY_CHANGE_DETECTED` | `mesr.core.effect.state_transition` | `mesr.domain.software.change.dependency_observed` | a dependency-oriented change is recorded | `NC-VERIFY`, `NC-EFFECT` |
| `BREAKING_CHANGE_UNVERIFIED` | `mesr.core.evidence.verification` | `mesr.domain.software.change.breaking_impact_not_verified` | breaking-impact verification is missing/insufficient | `NC-VERIFY`, `NC-EFFECT` |
| `LOCKFILE_CHANGED` | `mesr.core.effect.state_transition` | `mesr.domain.software.change.lockfile_observed` | a lockfile change is recorded | `NC-VERIFY`, `NC-EFFECT` |
| `MIGRATION_NOT_DOCUMENTED` | `mesr.core.evidence.item` | `mesr.domain.software.change.migration_not_documented` | expected migration evidence is missing | `NC-EVIDENCE`, `NC-VERIFY` |
| `PUBLIC_API_CHANGE_UNVERIFIED` | `mesr.core.evidence.verification` | `mesr.domain.software.change.public_api_impact_not_verified` | public-API impact is not sufficiently verified | `NC-VERIFY`, `NC-EFFECT` |

### Human Review

| Reason Code | Core Semantic | Domain Semantic | Supported Claim | Explicit Non-Claims |
| --- | --- | --- | --- | --- |
| `HUMAN_REVIEW_REQUIRED` | `mesr.core.review.review` | - | human review is requested by current reasoning | `NC-REVIEW` |
| `SECURITY_REVIEW_REQUIRED` | `mesr.core.review.review` | - | security-oriented review is requested | `NC-REVIEW`, `NC-COMPLIANCE` |
| `OWNER_REVIEW_REQUIRED` | `mesr.core.review.review` | - | owner review is requested | `NC-REVIEW` |
| `RELEASE_REVIEW_REQUIRED` | `mesr.core.review.review` | `mesr.domain.software.review.not_demonstrated` | release-oriented review is requested | `NC-REVIEW` |
| `CUSTOMER_REVIEW_REQUIRED` | `mesr.core.review.review` | - | customer-facing review is requested | `NC-REVIEW` |

## 4. Example Bindings

```text
DECLARED_AUTHORITY_ONLY
-> mesr.core.authority.declared
-> supported claim: authority.declared
-> does_not_support: authority.verified, authority.current, execution.authorized
```

```text
TESTS_NOT_RUN
-> mesr.core.evidence.verification
-> mesr.domain.software.verification.test_execution_not_demonstrated
-> supported claim: test execution is not demonstrated
-> does_not_support: tests passed, change correct, execution authorized
```

## 5. Phase 2 Binding Requirements

Phase 2 may add a machine-readable seed only if it:

- contains all 56 existing reason codes exactly once;
- references resolvable MESR IDs;
- preserves existing reason-code ordering and definitions;
- exposes non-claims as data;
- rejects unknown or duplicate bindings deterministically;
- remains internal/default-off until compatibility verification passes.

No machine-readable seed is created in Phase 1. This avoids introducing a second incomplete registry before the semantic contracts are accepted.
