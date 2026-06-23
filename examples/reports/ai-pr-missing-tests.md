# Governance Report: controller update without executed tests

## Executive Summary

This Markdown report presents the canonical Guard Core output for pack `epk_ai_pr_missing_tests_001` and report `governance-report:epk_ai_pr_missing_tests_001:1.0.0`.

The current verdict is `require_review` with evidence completeness `partial`, 3 missing evidence item(s), and 1 human review requirement(s).

- Top reason codes: `TESTS_NOT_RUN`, `INSUFFICIENT_VERIFICATION`, `HUMAN_REVIEW_REQUIRED`
- Workflow: controller update without executed tests (`pull_request`)
- Authority status: `declared`
- Scope signal: 2 changed file(s)

## Verdict

| Field | Value |
| --- | --- |
| Verdict | `require_review` |
| Explanation | Evidence indicates test activity did not occur. Verification material is present but not strong enough for the recorded workflow. Later governance flow may call for human review. |
| Confidence | `medium` |
| Reason codes | `TESTS_NOT_RUN`, `INSUFFICIENT_VERIFICATION`, `HUMAN_REVIEW_REQUIRED` |

## Workflow

| Field | Value |
| --- | --- |
| Report ID | `governance-report:epk_ai_pr_missing_tests_001:1.0.0` |
| Pack ID | `epk_ai_pr_missing_tests_001` |
| Report schema version | `1.0.0` |
| Source schema version | `1.0.0` |
| Workflow name | controller update without executed tests |
| Workflow type | `pull_request` |
| Pack type | `ai_software_change` |
| Environment | `ci` |
| Repository | mindforge-labs/synthetic-app-service; branch feature/order-status-normalization; head feature/order-status-normalization; base main; commit 2222222222222222222222222222222222222222; PR 1847 |

## Authority

| Field | Value |
| --- | --- |
| Authorization status | `declared` |
| Requested by | developer.synthetic |
| Owner | team.synthetic-app |
| Reviewers | `reviewer.api-owner` |
| Time window start | 2026-06-23T19:30:00Z |
| Time window end | 2026-06-23T21:30:00Z |
| Reason codes | `DECLARED_AUTHORITY_ONLY` |

## Scope

| Field | Value |
| --- | --- |
| Changed file count | 2 |
| Touched resource count | 2 |
| In-scope count | 2 |
| Out-of-scope count | 3 |
| Data sensitivity | medium |
| Reason codes | None recorded. |

## Evidence Coverage

| Field | Value |
| --- | --- |
| Completeness | `partial` |
| Manifest completeness | `partial` |
| Artifact count | 3 |
| Action count | 3 |
| Tool call count | 3 |
| Verification count | 2 |
| Blocked action count | 0 |
| Missing evidence count | 3 |
| Reason codes | `TESTS_NOT_RUN`, `INSUFFICIENT_VERIFICATION`, `MANIFEST_INCOMPLETE` |

## Risk Summary

| Field | Value |
| --- | --- |
| Max severity | `medium` |
| Risk count | 5 |
| Risk categories | `authority`, `verification`, `evidence_integrity`, `human_review` |
| Reason codes | `DECLARED_AUTHORITY_ONLY`, `TESTS_NOT_RUN`, `INSUFFICIENT_VERIFICATION`, `MANIFEST_INCOMPLETE`, `HUMAN_REVIEW_REQUIRED` |

## Blocked Actions

No blocked actions recorded.

## Verification

| Field | Value |
| --- | --- |
| Total count | 2 |
| Passed count | 1 |
| Failed count | 0 |
| Not-run count | 1 |
| Inconclusive count | 0 |
| Reason codes | `TESTS_NOT_RUN`, `INSUFFICIENT_VERIFICATION` |

## Missing Evidence

- `DECLARED_AUTHORITY_ONLY` (`medium`); Authority is declared in the pack but lacks stronger supporting evidence.; recommended fix: Provide stronger authority evidence beyond declaration-only status.; evidence refs: `art_auth_pr_note`
- `TESTS_NOT_RUN` (`medium`); Evidence indicates test activity did not occur.; recommended fix: Provide successful unit or integration test evidence.
- `MANIFEST_INCOMPLETE` (`medium`); Manifest completeness indicates omitted or partial evidence inventory.; recommended fix: Provide a complete manifest inventory for the pack.

## Human Review Required

- `review:generic` for `reviewer`; reason: `HUMAN_REVIEW_REQUIRED`; A human review step is needed before relying on this governance report.

## Next Actions

- `next:authority` (`clarify_authority`); owner: `owner`; priority: `high`; reason: `DECLARED_AUTHORITY_ONLY`; Clarify or strengthen the authority material for this workflow.
- `next:verification` (`rerun_verification`); owner: `developer`; priority: `high`; reason: `TESTS_NOT_RUN`; Strengthen verification evidence for the recorded change.
- `next:provenance` (`provide_provenance`); owner: `operator`; priority: `medium`; reason: `MANIFEST_INCOMPLETE`; Align the manifest, artifact, and provenance material with the report input.
- `next:review:review:generic` (`request_review`); owner: `reviewer`; priority: `medium`; reason: `HUMAN_REVIEW_REQUIRED`; A human review step is needed before relying on this governance report.

## Evidence References

| Reference | Source | Description | Path |
| --- | --- | --- | --- |
| `pack:epk_ai_pr_missing_tests_001` | `pack` | submitted evidence pack | evidence-pack.json |
| `art_auth_pr_note` | `artifact` | synthetic declared pull request scope note | artifacts/authority/pr-note.md |
| `art_controller_diff` | `artifact` | synthetic controller diff | artifacts/diff/order-controller.patch |
| `art_build_log` | `artifact` | synthetic repository build log | artifacts/logs/build.log |
| `act_ai_pr_missing_tests_001` | `action` | read_file | src/controllers/orderController.ts |
| `act_ai_pr_missing_tests_002` | `action` | modify_code | src/controllers/orderController.ts |
| `act_ai_pr_missing_tests_003` | `action` | test_execution | Not recorded. |
| `tc_ai_pr_missing_tests_fs_001` | `tool_call` | returned controller and route mapping sources | Not recorded. |
| `tc_ai_pr_missing_tests_fs_002` | `tool_call` | updated application source files | Not recorded. |
| `tc_ai_pr_missing_tests_build_001` | `tool_call` | build passed; no unit test command executed | Not recorded. |
| `ver_ai_pr_missing_tests_001` | `verification` | no unit test evidence was exported for this pull request | Not recorded. |
| `ver_ai_pr_missing_tests_002` | `verification` | build executed in CI after controller change | Not recorded. |

## Provenance

| Field | Value |
| --- | --- |
| Generated by | `guard-core-report-service` |
| Generator version | `1.0.0` |
| Deterministic | Yes |
| Source pack hash | `2345234523452345234523452345234523452345234523452345234523452345` |
| Reason code version | `1.0.0` |
| Generated at | `2026-06-23T20:07:30Z` |
