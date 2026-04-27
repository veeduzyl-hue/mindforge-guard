---
name: guard-commercial-baseline-keeper
description: Use this skill whenever a task touches README, pricing, editions, install instructions, license setup, release assets, demo paths, website copy, docs/product/current, or other user-facing commercial documentation. This skill protects the current v6.13 commercial baseline, prevents future roadmap capabilities from being described as shipped, and requires additive-only changes plus boundary review before finalizing a commercial-facing PR.
---

# Guard Commercial Baseline Keeper

You are operating inside the `mindforge-guard` repository.

This skill is the commercial-baseline protection skill for Guard.
Use it whenever a task touches current commercial positioning, buyer-facing docs, commercial packaging, or release-facing surfaces that could drift the current baseline.

## Invoke this skill when

Use this skill whenever the task touches any of the following:

- `README.md`
- pricing pages or pricing copy
- editions docs or edition comparisons
- install instructions
- license setup or license activation docs
- release assets or release-facing commercial packaging
- demo paths or demo walkthrough docs
- website copy or License Hub marketing/product copy
- `docs/product/current`
- other user-facing commercial documentation

Also invoke this skill when the task includes keywords such as:

- commercial baseline
- pricing
- editions
- install
- onboarding
- license
- activation
- release asset
- demo path
- buyer-facing
- commercial docs
- product copy
- website copy
- launch copy
- commercial claim
- docs/product/current
- roadmap boundary

## Primary objective

Protect the current stable commercial baseline while allowing only bounded, additive documentation or packaging changes unless the user explicitly requests otherwise.

## Baseline that must be preserved

Treat `v6.13` as the current stable commercial user-facing baseline.

Treat `v6.14+` as an additive evolution track only.
Do not describe `v6.14+` roadmap capabilities as currently available unless they are separately implemented and released.

## Future/additive areas that must stay future-scoped

Unless separately implemented and released, keep the following in roadmap, next-version, planning, or future-boundary areas:

- Authority / Intent Boundary
- Admissibility
- Commit Gate Dry-run
- Multi-Agent Handoff
- Graph-aware Governance
- Enterprise Runtime Governance

Do not present these as current README, pricing, edition, install, license, demo, website, or release-delivery capabilities.

## Surfaces that must not drift

Unless the user explicitly requests a scoped change and the implementation/release state supports it, preserve:

- current install instructions
- current license setup and offline license authority
- current editions and entitlement framing
- current demo paths
- current release assets and commercial delivery framing
- current CLI outputs
- current JSON contracts
- current exit semantics

This includes preserving:

- `audit` output / verdict / exit unchanged unless explicitly scoped
- license gating behavior unchanged unless explicitly scoped
- current buyer-facing claims unchanged unless explicitly scoped

## Required posture checks

Every commercial-facing change should preserve:

- recommendation-only
- additive-only
- non-executing by default
- preview-first for execution-adjacent features
- default-off for consumption or gate behavior where applicable
- no orchestrator drift
- no control-plane drift
- no agent-builder drift
- no IAM-replacement drift
- no hidden authority expansion

## Editing rules

When using this skill:

- prefer additive-only documentation changes
- avoid rewriting stable commercial claims unless explicitly requested
- do not quietly expand the meaning of Enterprise
- do not imply hosted-service dependence for the main Guard runtime path
- do not rewrite install, pricing, license, or demo surfaces just to align them with future ideas
- do not move roadmap concepts into current-baseline docs

## Required review before finalizing

Before finalizing any commercial-facing PR, run a boundary review using the repo-local `guard-compat-boundary-review` skill or equivalent compatibility review.

That review must explicitly state whether the change preserves:

- `audit` output / verdict / exit unchanged
- permit behavior unchanged unless explicitly scoped
- classify behavior unchanged unless explicitly scoped
- recommendation-only
- additive-only
- non-executing
- default-off
- no authority scope expansion
- current commercial baseline positioning

## Standard output contract

Unless the user requests another format, return:

1. Commercial baseline status
2. Preserved current surfaces
3. Future capability containment status
4. Drift risks found
5. Required boundary review status
6. Can proceed / cannot proceed

## Good changes usually look like

- baseline freeze docs
- additive clarification notes
- explicit current-vs-future boundary language
- compatibility-preserving link additions
- release/readiness wording that avoids overstating availability

## Suspicious changes usually look like

- roadmap capability presented as shipped
- Enterprise wording that implies new runtime authority
- install or license guidance rewritten without a release change
- demo paths changed to imply capabilities not yet released
- pricing or edition copy that silently expands entitlement
- website copy that turns Guard into a control plane or orchestrator

## Do not use this skill for

- internal-only engineering docs with no commercial-facing effect
- code-level compatibility review where commercial baseline drift is not involved
- next-version planning that does not touch current commercial surfaces
