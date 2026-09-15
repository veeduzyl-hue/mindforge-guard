# ADR 0009: Commercial baseline ownership and version dimensions

- Status: Accepted owner disposition for Gate 1 Blocker Closure Phase A (B00); documentation only.
- Decision input: the product owner's explicit Phase A task, received 2026-09-14. Source files corroborate lineage; they do not decide commercial intent.
- Source baseline: [V8-000 reconciliation](../planning/13_V8_000_SOURCE_RECONCILIATION.md), preserved by commit `9d535a9329054d645ad1fc56e36bfe267eb33f26`.

## Decision

| Dimension | Normative disposition | Meaning and limit |
|---|---|---|
| TAGGED_RELEASE_LINEAGE | v6.13.0 -> v6.13.1 -> v7.0.0 -> v7.0.1 | Tagged release lineage in the reconciled interval. Interpret each artifact against its own snapshot; a tag does not prove remote package publication or current support. |
| PREVIOUS_COMMERCIAL_BASELINE | **v6.13.1** | Previous commercial baseline and a tagged historical release reference. |
| INTERNAL_PRODUCTIZATION_LINEAGE | **v6.14-v6.22** | Engineering/productization source and deterministic verification assets entered main; they did not become nine standalone tagged commercial releases. |
| CURRENT_PUBLIC_COMMERCIAL_BASELINE | **v7.0.1** | Owner-designated current commercial compatibility baseline; no new capability or release authorization. |
| Current engineering baseline | `30512dff336435f8d1c1bf4b633058c374668eb8` plus AGENTS constitutional commit `20aa844fe6f0239d5c0d18184cf5faffa366abf5` | Pinned source lineage reconciled by V8-000. The subsequent reconciliation commit preserves evidence; it adds no runtime behavior. |
| Internal V8 architecture/validation state | Research / architecture / validation, including existing internal substrate | Not a released V8 commercial baseline; repaired-track Gate 1 remains blocked. Earlier internal gate records remain historical evidence. |

**Internal V8 != released V8.**

**engineering baseline != commercial baseline.**

**Historical Evidence != Current Commercial Ownership.** Historical declarations remain evidence of their original context; current commercial ownership follows the explicit owner disposition above.

These dimensions must be named explicitly in later decisions. A package version, branch name, internal phase PASS or engineering commit cannot substitute for an owner commercial decision or a release event.

## Documentation reconciliation (2026-09-15)

The owner's Canonical Product & Version Baseline Documentation Reconciliation task authorizes current guidance normalization. It preserves the Phase A decision and pinned source evidence while separating tagged release lineage from internal productization lineage.

```text
PREVIOUS_COMMERCIAL_BASELINE = v6.13.1
INTERNAL_PRODUCTIZATION_LINEAGE = v6.14-v6.22
CURRENT_PUBLIC_COMMERCIAL_BASELINE = v7.0.1
PACKAGE_PUBLICATION_HISTORY_v6_14_TO_v6_22 = NOT_VERIFIED
```

`v6.14-v6.22` engineering lineage != tagged release lineage; source exists != standalone released version; verified mainline != commercial release. The v7.0/v7.0.1 line performed semantic narrowing and product consolidation, not wholesale publication of every preview semantic. See the [canonical lineage and capability status](../product/current/version-lineage-and-capability-status.md) for disposition and evidence limits.

The former phrase "Historical public stable baseline" is retained here only as `OWNER_DESIGNATED_HISTORICAL_LABEL`, not `INDEPENDENTLY_RECONSTRUCTED_RELEASE_STATE`. Canonical wording is: v6.13.1 is the previous commercial baseline and a tagged historical release reference. This qualification applies when interpreting the frozen Phase A wording; the historical record itself is unchanged.

## Historical conflicting evidence and precedence (Phase A snapshot)

At the Phase A snapshot, [AGENTS.md](../../AGENTS.md) and the [commercial-baseline skill](../../.agents/skills/guard-commercial-baseline-keeper/SKILL.md) retained v6.13-era wording. [README.md](../../README.md), [RELEASE.md](../../RELEASE.md), [current commercial documentation](../product/current/v7_0_1_commercial_baseline.md), the Guard package and lock inventory identify v7.0.1. The root package is unversioned; private Core is 0.1.0. No single repository-wide version is inferred.

The explicit owner disposition resolves B00's normative ambiguity for this workstream. It does not rewrite the contradictory historical declarations, retrospectively change V8-000's OPEN BLOCKER finding, or override unrelated AGENTS invariants. No remote publication assertion is necessary to this owner decision; none is newly verified here.

During Phase A, AGENTS.md, README.md, RELEASE.md, package.json, package-lock.json, package manifests, skills, release evidence and external-review records remained unchanged. The separately scoped 2026-09-15 documentation reconciliation now updates AGENTS and skill guidance; it does not retroactively change that Phase A result. Future readers should pair the frozen [readiness decision](../planning/15_GATE1_READINESS_DECISION.md) with the additive [Phase A decision](../planning/16_GATE1_BLOCKER_CLOSURE_PHASE_A_DECISION.md).

## Acceptance and compatibility

B00 = **PASS** remains the historical Phase A ownership decision. The current version model additionally names internal productization lineage without rewriting historical evidence. This is not a release decision and does not open Gate 1 or begin B09/B10.

Audit output / verdict / exit and deny exit code 25 unchanged; permit and classify unchanged; recommendation-only, additive-only, non-executing, default-off where applicable; no authority scope expansion. CLI/JSON, license gating/offline authority, installation, demos and commercial delivery remain unchanged. No control-plane, dashboard or orchestration expansion.
