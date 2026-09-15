# ADR 0009: Commercial baseline ownership and version dimensions

- Status: Accepted owner disposition for Gate 1 Blocker Closure Phase A (B00); documentation only.
- Decision input: the product owner's explicit Phase A task, received 2026-09-14. Source files corroborate lineage; they do not decide commercial intent.
- Source baseline: [V8-000 reconciliation](../planning/13_V8_000_SOURCE_RECONCILIATION.md), preserved by commit `9d535a9329054d645ad1fc56e36bfe267eb33f26`.

## Decision

| Dimension | Normative disposition | Meaning and limit |
|---|---|---|
| Historical release baseline | Version-specific release lineage, including v6.13.0, v6.13.1, v7.0.0 and v7.0.1 documented in V8-000 | A historical artifact is interpreted against its own release and source snapshot. A tag is not a universal statement of current support or remote publication status. |
| Historical public stable baseline | **v6.13.1** | Owner-designated historical public stable reference; preserve v6.13-era evidence in its original context. |
| Current commercial/user-facing baseline | **v7.0.1** | Owner-designated baseline for current commercial compatibility. This does not authorize new capabilities or normalize existing files. |
| Current engineering baseline | `30512dff336435f8d1c1bf4b633058c374668eb8` plus AGENTS constitutional commit `20aa844fe6f0239d5c0d18184cf5faffa366abf5` | Pinned source lineage reconciled by V8-000. The subsequent reconciliation commit preserves evidence; it adds no runtime behavior. |
| Internal V8 architecture/validation state | Research / architecture / validation, including existing internal substrate | Not a released V8 commercial baseline; repaired-track Gate 1 remains blocked. Earlier internal gate records remain historical evidence. |

**Internal V8 != released V8.**

**engineering baseline != commercial baseline.**

**Historical Evidence != Current Commercial Ownership.** Historical declarations remain evidence of their original context; current commercial ownership follows the explicit owner disposition above.

These dimensions must be named explicitly in later decisions. A package version, branch name, internal phase PASS or engineering commit cannot substitute for an owner commercial decision or a release event.

## Conflicting evidence and precedence

[AGENTS.md](../../AGENTS.md) and the [commercial-baseline skill](../../.agents/skills/guard-commercial-baseline-keeper/SKILL.md) retain v6.13-era wording. [README.md](../../README.md), [RELEASE.md](../../RELEASE.md), [current commercial documentation](../product/current/v7_0_1_commercial_baseline.md), the Guard package and lock inventory identify v7.0.1. The root package is unversioned; private Core is 0.1.0. No single repository-wide version is inferred.

The explicit owner disposition resolves B00's normative ambiguity for this workstream. It does not rewrite the contradictory historical declarations, retrospectively change V8-000's OPEN BLOCKER finding, or override unrelated AGENTS invariants. No remote publication assertion is necessary to this owner decision; none is newly verified here.

AGENTS.md, README.md, RELEASE.md, package.json, package-lock.json, package manifests, skills, release evidence and external-review records remain unchanged. Any normalization is a later separately scoped change. Future readers should pair the frozen [readiness decision](../planning/15_GATE1_READINESS_DECISION.md) with the additive [Phase A decision](../planning/16_GATE1_BLOCKER_CLOSURE_PHASE_A_DECISION.md).

## Acceptance and compatibility

B00 = **PASS**: ownership and all five dimensions have explicit disposition without rewriting history. This is not a release decision.

Audit output / verdict / exit and deny exit code 25 unchanged; permit and classify unchanged; recommendation-only, additive-only, non-executing, default-off where applicable; no authority scope expansion. CLI/JSON, license gating/offline authority, installation, demos and commercial delivery remain unchanged. No control-plane, dashboard or orchestration expansion.
