# Governance Reason Codes

## 1. Purpose

Governance reason codes are stable MindForge Guard explanatory primitives for later evidence coverage, risk summary, review requirement, receipt, and report work.

They give Guard Core a consistent vocabulary for why a submitted Evidence Pack may later need stronger evidence, more review context, clearer provenance, or additional next-step guidance.

## 2. Why These Codes Exist

Guard needs three different machine-readable layers:

| Layer | Meaning |
| --- | --- |
| Validation errors | structural invalidity in the Evidence Pack contract |
| Validation warnings | structurally valid evidence that may still be incomplete |
| Governance reason codes | later explanatory primitives for coverage gaps, risk framing, review needs, evidence integrity concerns, and next actions |

Reason codes do not replace validation errors or validation warnings.
They sit downstream from structural validation and upstream from later receipts or reports.

## 3. Explanatory Primitives, Not Verdicts

Governance reason codes are explanatory primitives, not final governance outcomes.

This document does not define:

- merge decisions
- deployment decisions
- approval outcomes
- enforcement outcomes
- any final governance disposition

PR-06 defines vocabulary only.
It does not implement evaluation logic.

## 4. Guard-Owned Vocabulary

MindForge Guard owns the canonical reason-code vocabulary.

That means:

- Guard Core is the only governance source of truth
- Evidence Pack remains the only factual input
- Harness is an Evidence Producer only
- Renderer, Studio, SDK, and CLI consume Guard Core-owned governance outputs
- Harness, Renderer, Studio, SDK, and CLI must not invent separate governance reason codes

If a fact is not present in the Evidence Pack, later Guard Core flows should treat it as unavailable rather than inferred.

## 5. Later Usage

Guard Core may later use these reason codes for:

- evidence coverage summaries
- risk summaries
- review requirement surfaces
- receipt generation
- unified report model generation
- bounded next-action guidance

This PR does not implement any of those later flows.

## 6. Category Set

The canonical category set is:

- `authority`
- `scope`
- `verification`
- `release_rollback`
- `tool_action`
- `data_security`
- `evidence_integrity`
- `dependency_change`
- `human_review`

These categories are stable and machine-readable.

## 7. Full Reason Code Table

| Code | Category | Severity Hint | Later Used By | Description |
| --- | --- | --- | --- | --- |
| `MISSING_AUTHORITY` | `authority` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Submitted evidence does not include authority material needed for governance interpretation. |
| `DECLARED_AUTHORITY_ONLY` | `authority` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Authority is declared in the pack but lacks stronger supporting evidence. |
| `AUTHORITY_OUT_OF_SCOPE` | `authority` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Submitted authority material does not cover the recorded workflow scope. |
| `REVIEWER_MISSING` | `authority` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Expected reviewer context is absent from submitted evidence. |
| `OWNER_MISSING` | `authority` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Expected ownership context is absent from submitted evidence. |
| `TIME_WINDOW_MISSING` | `authority` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Authority evidence does not include a bounded time window. |
| `TIME_WINDOW_EXPIRED` | `authority` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Authority time window is present but appears no longer current. |
| `OUT_OF_SCOPE_ACTION` | `scope` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | An action recorded in the pack exceeds the declared scope. |
| `OUT_OF_SCOPE_RESOURCE` | `scope` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | A touched resource exceeds the declared workflow scope. |
| `PROTECTED_RESOURCE_TOUCHED` | `scope` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Evidence indicates contact with a protected resource. |
| `UNDECLARED_FILE_CHANGE` | `scope` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Changed files appear outside the declared file list or declared limits. |
| `SCOPE_TOO_BROAD` | `scope` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Submitted scope is broader than the expected governance boundary. |
| `SCOPE_INCOMPLETE` | `scope` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Submitted scope material is incomplete for later interpretation. |
| `INSUFFICIENT_VERIFICATION` | `verification` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | Verification material is present but not strong enough for the recorded workflow. |
| `TESTS_NOT_RUN` | `verification` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | Evidence indicates test execution did not occur. |
| `TESTS_FAILED` | `verification` | `high` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | Evidence indicates test execution ended unsuccessfully. |
| `BUILD_NOT_RUN` | `verification` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | Evidence indicates build verification did not occur. |
| `BUILD_FAILED` | `verification` | `high` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | Evidence indicates build verification ended unsuccessfully. |
| `STATIC_ANALYSIS_NOT_RUN` | `verification` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | Expected static analysis evidence is absent. |
| `SECURITY_SCAN_NOT_RUN` | `verification` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | Expected security scan evidence is absent. |
| `MANUAL_REVIEW_MISSING` | `verification` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Expected human review evidence is absent. |
| `ROLLBACK_MISSING` | `release_rollback` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Rollback evidence is absent for a release-oriented workflow. |
| `ROLLBACK_UNVERIFIED` | `release_rollback` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Rollback material is present but not verified strongly enough. |
| `RELEASE_TARGET_UNCLEAR` | `release_rollback` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Release target details are incomplete or unclear. |
| `PRODUCTION_ENVIRONMENT_UNVERIFIED` | `release_rollback` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Production environment material is not sufficiently verified. |
| `BLOCKED_ACTION_PRESENT` | `tool_action` | `medium` | `risk_summary`, `receipts`, `reports`, `next_actions` | A halted action appears in submitted evidence. |
| `DESTRUCTIVE_COMMAND_ATTEMPTED` | `tool_action` | `high` | `risk_summary`, `receipts`, `reports`, `next_actions` | Evidence indicates an attempted destructive command. |
| `SECRET_ACCESS_ATTEMPTED` | `tool_action` | `high` | `risk_summary`, `receipts`, `reports`, `next_actions` | Evidence indicates an attempted secret-access operation. |
| `NETWORK_ACCESS_ATTEMPTED` | `tool_action` | `medium` | `risk_summary`, `receipts`, `reports`, `next_actions` | Evidence indicates an attempted network operation. |
| `UNSAFE_GIT_OPERATION` | `tool_action` | `high` | `risk_summary`, `receipts`, `reports`, `next_actions` | Evidence indicates a Git operation with elevated safety concern. |
| `TOOL_OUTPUT_MISSING` | `tool_action` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | A recorded tool interaction lacks expected output material. |
| `COMMAND_RESULT_MISSING` | `tool_action` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | A recorded command interaction lacks expected result material. |
| `HIGH_RISK_DATA` | `data_security` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Submitted evidence indicates interaction with high-risk data. |
| `DATA_SENSITIVITY_UNKNOWN` | `data_security` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Data sensitivity context is absent or unclear. |
| `CREDENTIAL_RISK` | `data_security` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Evidence indicates credential-handling risk. |
| `EXFILTRATION_RISK` | `data_security` | `critical` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Evidence indicates possible exfiltration risk. |
| `SECURITY_PATCH_SCOPE_UNCLEAR` | `data_security` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Security patch evidence does not define a clear remediation scope. |
| `CYBER_AUTHORIZATION_REQUIRED` | `data_security` | `critical` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Cyber-oriented workflow evidence calls for stronger authorization material. |
| `EVIDENCE_INCOMPLETE` | `evidence_integrity` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | Submitted evidence is structurally present but incomplete for stronger interpretation. |
| `MANIFEST_INCOMPLETE` | `evidence_integrity` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | Manifest completeness indicates omitted or partial evidence inventory. |
| `ARTIFACT_MISSING` | `evidence_integrity` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | An expected artifact is absent from submitted evidence. |
| `ARTIFACT_HASH_MISSING` | `evidence_integrity` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | An artifact reference is present without stable hash material. |
| `ARTIFACT_REF_UNRESOLVED` | `evidence_integrity` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | An artifact reference cannot be resolved within submitted evidence. |
| `PROVENANCE_MISSING` | `evidence_integrity` | `high` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | Provenance material is absent from submitted evidence. |
| `PRODUCER_IDENTITY_UNKNOWN` | `evidence_integrity` | `high` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | Producer identity is absent or cannot be established from submitted evidence. |
| `NON_DETERMINISTIC_PRODUCER` | `evidence_integrity` | `medium` | `evidence_coverage`, `risk_summary`, `receipts`, `reports` | Producer metadata indicates evidence generation may not be deterministic. |
| `DEPENDENCY_CHANGE_DETECTED` | `dependency_change` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Evidence indicates a dependency-oriented software change. |
| `BREAKING_CHANGE_UNVERIFIED` | `dependency_change` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Evidence suggests possible breaking change impact without strong verification. |
| `LOCKFILE_CHANGED` | `dependency_change` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Evidence indicates lockfile material changed during the workflow. |
| `MIGRATION_NOT_DOCUMENTED` | `dependency_change` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Migration-oriented evidence is expected but absent. |
| `PUBLIC_API_CHANGE_UNVERIFIED` | `dependency_change` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Evidence indicates public API change without strong verification. |
| `HUMAN_REVIEW_REQUIRED` | `human_review` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Later governance flow may call for human review. |
| `SECURITY_REVIEW_REQUIRED` | `human_review` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Later governance flow may call for security-oriented review. |
| `OWNER_REVIEW_REQUIRED` | `human_review` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Later governance flow may call for owner review. |
| `RELEASE_REVIEW_REQUIRED` | `human_review` | `high` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Later governance flow may call for release review. |
| `CUSTOMER_REVIEW_REQUIRED` | `human_review` | `medium` | `risk_summary`, `review_requirements`, `receipts`, `reports`, `next_actions` | Later governance flow may call for customer-facing review. |

## 8. Non-Goals

This PR does not:

- compute governance verdicts
- grant approval
- implement enforcement behavior
- execute actions
- implement scanner behavior
- reposition current `v7.0.1` commercial materials

## 9. Boundary Notes

PR-06 is intentionally narrow.

- It adds stable vocabulary only.
- It does not inspect Evidence Packs.
- It does not change parser or validator behavior.
- It does not add receipt generation or report generation.
- It does not change runtime CLI behavior.
- It does not change Harness alignment.
- It does not change Renderer, Studio, or SDK roles.

Guard remains non-executing, local-first, evidence-first, cross-runtime, and independent.
