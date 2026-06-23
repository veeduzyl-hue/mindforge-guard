# Governance Report: release preparation without rollback evidence

## Executive Summary

This Markdown report presents the canonical Guard Core output for pack `epk_release_prep_missing_rollback_001` and report `governance-report:epk_release_prep_missing_rollback_001:1.0.0`.

The current verdict is `require_review` with evidence completeness `partial`, 2 missing evidence item(s), and 2 human review requirement(s).

- Top reason codes: `ROLLBACK_MISSING`, `HUMAN_REVIEW_REQUIRED`, `RELEASE_REVIEW_REQUIRED`
- Workflow: release preparation without rollback evidence (`release`)
- Authority status: `provided`
- Scope signal: 2 changed file(s)

## Verdict

| Field | Value |
| --- | --- |
| Verdict | `require_review` |
| Explanation | Rollback evidence is absent for a release-oriented workflow. Later governance flow may call for human review. Later governance flow may call for release review. |
| Confidence | `medium` |
| Reason codes | `ROLLBACK_MISSING`, `HUMAN_REVIEW_REQUIRED`, `RELEASE_REVIEW_REQUIRED` |

## Workflow

| Field | Value |
| --- | --- |
| Report ID | `governance-report:epk_release_prep_missing_rollback_001:1.0.0` |
| Pack ID | `epk_release_prep_missing_rollback_001` |
| Report schema version | `1.0.0` |
| Source schema version | `1.0.0` |
| Workflow name | release preparation without rollback evidence |
| Workflow type | `release` |
| Pack type | `ai_software_change` |
| Environment | `staging` |
| Repository | mindforge-labs/synthetic-release-service; branch release/2026.06.23-rc1; head release/2026.06.23-rc1; base main; commit 4444444444444444444444444444444444444444 |

## Authority

| Field | Value |
| --- | --- |
| Authorization status | `provided` |
| Requested by | release.synthetic |
| Owner | team.synthetic-release |
| Reviewers | `reviewer.release-manager`, `reviewer.platform` |
| Time window start | 2026-06-23T20:00:00Z |
| Time window end | 2026-06-23T22:30:00Z |
| Reason codes | None recorded. |

## Scope

| Field | Value |
| --- | --- |
| Changed file count | 2 |
| Touched resource count | 3 |
| In-scope count | 3 |
| Out-of-scope count | 3 |
| Data sensitivity | low |
| Reason codes | None recorded. |

## Evidence Coverage

| Field | Value |
| --- | --- |
| Completeness | `partial` |
| Manifest completeness | `partial` |
| Artifact count | 4 |
| Action count | 2 |
| Tool call count | 2 |
| Verification count | 2 |
| Blocked action count | 0 |
| Missing evidence count | 2 |
| Reason codes | `ROLLBACK_MISSING`, `MANIFEST_INCOMPLETE` |

## Risk Summary

| Field | Value |
| --- | --- |
| Max severity | `high` |
| Risk count | 4 |
| Risk categories | `release_rollback`, `evidence_integrity`, `human_review` |
| Reason codes | `ROLLBACK_MISSING`, `MANIFEST_INCOMPLETE`, `HUMAN_REVIEW_REQUIRED`, `RELEASE_REVIEW_REQUIRED` |

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
| Reason codes | `ROLLBACK_MISSING` |

## Missing Evidence

- `ROLLBACK_MISSING` (`high`); Rollback evidence is absent for a release-oriented workflow.; recommended fix: Provide a passed rollback check for the release workflow.
- `MANIFEST_INCOMPLETE` (`medium`); Manifest completeness indicates omitted or partial evidence inventory.; recommended fix: Provide a complete manifest inventory for the pack.

## Human Review Required

- `review:generic` for `reviewer`; reason: `HUMAN_REVIEW_REQUIRED`; A human review step is needed before relying on this governance report.
- `review:release` for `release`; reason: `RELEASE_REVIEW_REQUIRED`; Release review is needed before relying on this release summary.

## Next Actions

- `next:rollback` (`document_rollback`); owner: `operator`; priority: `high`; reason: `ROLLBACK_MISSING`; Provide rollback evidence for the release-oriented workflow.
- `next:provenance` (`provide_provenance`); owner: `operator`; priority: `medium`; reason: `MANIFEST_INCOMPLETE`; Align the manifest, artifact, and provenance material with the report input.
- `next:review:review:generic` (`request_review`); owner: `reviewer`; priority: `medium`; reason: `HUMAN_REVIEW_REQUIRED`; A human review step is needed before relying on this governance report.
- `next:review:review:release` (`request_review`); owner: `release`; priority: `medium`; reason: `RELEASE_REVIEW_REQUIRED`; Release review is needed before relying on this release summary.

## Evidence References

| Reference | Source | Description | Path |
| --- | --- | --- | --- |
| `pack:epk_release_prep_missing_rollback_001` | `pack` | submitted evidence pack | evidence-pack.json |
| `art_release_ticket` | `artifact` | synthetic release preparation authorization ticket | artifacts/authority/release-ticket.json |
| `art_release_diff` | `artifact` | synthetic release preparation diff | artifacts/diff/release-prep.patch |
| `art_build_log` | `artifact` | synthetic release build log | artifacts/logs/release-build.log |
| `art_release_bundle` | `artifact` | synthetic release bundle candidate | artifacts/build/release-bundle.tgz |
| `act_release_prep_001` | `action` | modify_code | CHANGELOG.md |
| `act_release_prep_002` | `action` | release_operation | dist/release-bundle.tgz |
| `tc_release_prep_001` | `tool_call` | updated changelog and release metadata files | Not recorded. |
| `tc_release_prep_002` | `tool_call` | release bundle built for staging review | Not recorded. |
| `ver_release_prep_001` | `verification` | staging release bundle built successfully | Not recorded. |
| `ver_release_prep_002` | `verification` | rollback validation evidence was not captured for this release preparation flow | Not recorded. |

## Provenance

| Field | Value |
| --- | --- |
| Generated by | `guard-core-report-service` |
| Generator version | `1.0.0` |
| Deterministic | Yes |
| Source pack hash | `4567456745674567456745674567456745674567456745674567456745674567` |
| Reason code version | `1.0.0` |
| Generated at | `2026-06-23T20:37:10Z` |
