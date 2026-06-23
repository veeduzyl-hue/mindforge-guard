# Governance Report: dependency upgrade with breaking note

## Executive Summary

This Markdown report presents the canonical Guard Core output for pack `epk_dependency_upgrade_breaking_change_001` and report `governance-report:epk_dependency_upgrade_breaking_change_001:1.0.0`.

The current verdict is `require_review` with evidence completeness `partial`, 1 missing evidence item(s), and 2 human review requirement(s).

- Top reason codes: `INSUFFICIENT_VERIFICATION`, `HUMAN_REVIEW_REQUIRED`, `OWNER_REVIEW_REQUIRED`
- Workflow: dependency upgrade with breaking note (`dependency_upgrade`)
- Authority status: `provided`
- Scope signal: 3 changed file(s)

## Verdict

| Field | Value |
| --- | --- |
| Verdict | `require_review` |
| Explanation | Verification material is present but not strong enough for the recorded workflow. Later governance flow may call for human review. Later governance flow may call for owner review. |
| Confidence | `medium` |
| Reason codes | `INSUFFICIENT_VERIFICATION`, `HUMAN_REVIEW_REQUIRED`, `OWNER_REVIEW_REQUIRED` |

## Workflow

| Field | Value |
| --- | --- |
| Report ID | `governance-report:epk_dependency_upgrade_breaking_change_001:1.0.0` |
| Pack ID | `epk_dependency_upgrade_breaking_change_001` |
| Report schema version | `1.0.0` |
| Source schema version | `1.0.0` |
| Workflow name | dependency upgrade with breaking note |
| Workflow type | `dependency_upgrade` |
| Pack type | `ai_software_change` |
| Environment | `ci` |
| Repository | mindforge-labs/synthetic-web-client; branch feature/router-v6-upgrade; head feature/router-v6-upgrade; base main; commit 3333333333333333333333333333333333333333 |

## Authority

| Field | Value |
| --- | --- |
| Authorization status | `provided` |
| Requested by | developer.synthetic |
| Owner | team.synthetic-web |
| Reviewers | `reviewer.frontend-owner`, `reviewer.release` |
| Time window start | 2026-06-23T20:00:00Z |
| Time window end | 2026-06-23T22:00:00Z |
| Reason codes | None recorded. |

## Scope

| Field | Value |
| --- | --- |
| Changed file count | 3 |
| Touched resource count | 3 |
| In-scope count | 3 |
| Out-of-scope count | 3 |
| Data sensitivity | low |
| Reason codes | None recorded. |

## Evidence Coverage

| Field | Value |
| --- | --- |
| Completeness | `partial` |
| Manifest completeness | `complete` |
| Artifact count | 4 |
| Action count | 3 |
| Tool call count | 3 |
| Verification count | 2 |
| Blocked action count | 0 |
| Missing evidence count | 1 |
| Reason codes | `DEPENDENCY_CHANGE_DETECTED`, `LOCKFILE_CHANGED`, `BREAKING_CHANGE_UNVERIFIED`, `INSUFFICIENT_VERIFICATION` |

## Risk Summary

| Field | Value |
| --- | --- |
| Max severity | `high` |
| Risk count | 6 |
| Risk categories | `dependency_change`, `verification`, `human_review` |
| Reason codes | `DEPENDENCY_CHANGE_DETECTED`, `LOCKFILE_CHANGED`, `BREAKING_CHANGE_UNVERIFIED`, `INSUFFICIENT_VERIFICATION`, `HUMAN_REVIEW_REQUIRED`, `OWNER_REVIEW_REQUIRED` |

## Blocked Actions

No blocked actions recorded.

## Verification

| Field | Value |
| --- | --- |
| Total count | 2 |
| Passed count | 1 |
| Failed count | 0 |
| Not-run count | 0 |
| Inconclusive count | 1 |
| Reason codes | `DEPENDENCY_CHANGE_DETECTED`, `LOCKFILE_CHANGED`, `BREAKING_CHANGE_UNVERIFIED`, `INSUFFICIENT_VERIFICATION` |

## Missing Evidence

- `BREAKING_CHANGE_UNVERIFIED` (`high`); Evidence suggests possible breaking change impact without strong verification.; recommended fix: Provide stronger compatibility verification for the dependency change.

## Human Review Required

- `review:generic` for `reviewer`; reason: `HUMAN_REVIEW_REQUIRED`; A human review step is needed before relying on this governance report.
- `review:owner` for `owner`; reason: `OWNER_REVIEW_REQUIRED`; Owner review is needed for the dependency-oriented workflow.

## Next Actions

- `next:verification` (`rerun_verification`); owner: `developer`; priority: `high`; reason: `BREAKING_CHANGE_UNVERIFIED`; Strengthen verification evidence for the recorded change.
- `next:review:review:generic` (`request_review`); owner: `reviewer`; priority: `medium`; reason: `HUMAN_REVIEW_REQUIRED`; A human review step is needed before relying on this governance report.
- `next:review:review:owner` (`request_review`); owner: `owner`; priority: `medium`; reason: `OWNER_REVIEW_REQUIRED`; Owner review is needed for the dependency-oriented workflow.

## Evidence References

| Reference | Source | Description | Path |
| --- | --- | --- | --- |
| `pack:epk_dependency_upgrade_breaking_change_001` | `pack` | submitted evidence pack | evidence-pack.json |
| `art_upgrade_ticket` | `artifact` | synthetic dependency upgrade ticket | artifacts/authority/upgrade-ticket.json |
| `art_dependency_diff` | `artifact` | synthetic dependency and router diff | artifacts/diff/dependency-upgrade.patch |
| `art_upgrade_notes` | `artifact` | synthetic breaking migration note for reviewers | artifacts/notes/upgrade-notes.md |
| `art_build_log` | `artifact` | synthetic build log after dependency upgrade | artifacts/logs/build.log |
| `act_dependency_upgrade_001` | `action` | install_dependency | package.json |
| `act_dependency_upgrade_002` | `action` | modify_code | src/router/index.ts |
| `act_dependency_upgrade_003` | `action` | test_execution | Not recorded. |
| `tc_dependency_upgrade_001` | `tool_call` | package files updated with new dependency version | Not recorded. |
| `tc_dependency_upgrade_002` | `tool_call` | router source updated for new package API | Not recorded. |
| `tc_dependency_upgrade_003` | `tool_call` | build passed; integration behavior remains unverified | Not recorded. |
| `ver_dependency_upgrade_001` | `verification` | build completed after dependency upgrade | Not recorded. |
| `ver_dependency_upgrade_002` | `verification` | integration navigation flow was not exercised in this fixture | Not recorded. |

## Provenance

| Field | Value |
| --- | --- |
| Generated by | `guard-core-report-service` |
| Generator version | `1.0.0` |
| Deterministic | Yes |
| Source pack hash | `3456345634563456345634563456345634563456345634563456345634563456` |
| Reason code version | `1.0.0` |
| Generated at | `2026-06-23T20:23:05Z` |
