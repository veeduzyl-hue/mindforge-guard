# AGENTS.md

This repository is `mindforge-guard`.

MindForge Guard is a deterministic governance product for AI coding and decision surfaces.
At the current stage, the project is advancing through bounded, additive, recommendation-only governance productization.
The repository must preserve backward compatibility and avoid semantic drift on main-path behavior.

## Product posture

Guard is not a control plane.
Guard is not a dashboard-first product.
Guard is not a multi-agent orchestration framework.
Guard is not an autonomous execution authority.
Guard is not a runtime that takes over the main path.

Guard is a deterministic execution/governance layer with bounded, inspectable, auditable artifacts.

## Current roadmap posture

The current line is the single-agent verifiable governance productization path.
Completed work up to `v6.6.0` should be treated as the baseline for the next productization steps.
The active development posture is:

- preserve the already completed governance object chain
- convert bounded governance artifacts into clearer evidence, receipt, explanation, packaging, and consumption surfaces
- improve sellability, demo clarity, installability, and verification clarity
- do not expand into dashboard/control-plane/platform drift
- do not expand into multi-agent orchestration drift
- do not convert supporting artifacts into execution authority

## Commercial baseline and roadmap boundary

The current stable commercial user-facing baseline is `v6.13`.
Treat `v6.14+` as an additive evolution track, not as a currently available capability set.

Preserve the current `v6.13` commercial surface unless a later change is separately implemented and released:

- CLI outputs unchanged unless explicitly scoped
- JSON contracts unchanged unless explicitly scoped
- exit semantics unchanged unless explicitly scoped
- license gating and offline license authority unchanged unless explicitly scoped
- install instructions unchanged unless explicitly scoped
- demo paths unchanged unless explicitly scoped

The following areas are future/additive only unless separately implemented and released:

- Authority / Intent Boundary
- Admissibility
- Commit Gate Dry-run
- Multi-Agent Handoff
- Graph-aware Governance
- Enterprise Runtime Governance

Guard remains:

- recommendation-only
- additive-only
- non-executing by default
- preview-first for execution-adjacent features
- default-off for consumption or gate behavior where applicable

Guard does not become:

- an orchestrator
- a control plane
- an agent builder
- an IAM replacement

## Hard invariants

The following invariants must be preserved unless the user explicitly states otherwise:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- `audit` main output unchanged
- `audit` verdict semantics unchanged
- `audit` exit semantics unchanged
- deny exit code `25` unchanged
- no unintended authority expansion
- no control-plane drift
- no dashboard-first drift
- no hidden policy enforcement takeover
- no main-path semantic takeover
- no silent CLI contract breakage
- no breaking rename or removal of established governance surfaces without explicit direction

## Canonical review language

When reviewing or proposing changes, always check and state whether the change preserves:

- audit output / verdict / exit unchanged
- permit behavior unchanged unless explicitly scoped
- classify behavior unchanged unless explicitly scoped
- recommendation-only
- additive-only
- non-executing
- default-off
- no authority scope expansion

## Development style

Prefer:

- bounded artifacts
- explicit schemas
- deterministic outputs
- compatibility-preserving additions
- explainable naming
- machine-verifiable scripts
- small, phase-based progress
- documentation that freezes intent and boundaries

Avoid:

- broad refactors without boundary necessity
- speculative platformization
- mixed unrelated changes in one PR
- hidden behavioral coupling
- vague wording such as “improve governance” without concrete bounded outputs
- introducing UI/control-plane assumptions into the CLI contract line

## Versioning and execution discipline

Work should generally follow phase-based progression:

1. Phase 1: boundary start / initial implementation
2. Phase 2: hardening / compatibility / verification expansion
3. Phase 3: final acceptance / freeze / release readiness

Each phase should aim to leave behind:

- clear boundary statement
- bounded code changes
- verification coverage
- status documentation
- preserved invariants statement

## Planning rules

When asked for the next version or next module:

- choose one primary version conclusion
- avoid multi-route indecision unless explicitly requested
- define what the version is
- define why it comes next
- define what is not included
- define boundary and acceptance criteria
- define expected verify surface
- define PR / merge / release path

## PR and merge expectations

A good PR in this repository should:

- have a narrow boundary
- preserve invariants
- state unchanged surfaces explicitly
- include or update verification
- include status/docs updates when needed
- avoid unrelated cleanup
- be safe to review against the current roadmap posture

## Release expectations

A release-ready module should have:

- scoped version summary
- preserved invariants stated clearly
- verification coverage identified
- smoke confidence on impacted surfaces
- no unresolved ambiguity on whether the change is authority-expanding
- no accidental drift into platform/control-plane positioning

## What agents should do by default

Agents working in this repository should default to:

- preserving compatibility
- being explicit about assumptions
- preferring additive changes
- checking roadmap alignment
- checking whether a proposal drifts toward authority expansion
- checking whether a proposal drifts toward dashboard/control-plane/platform language
- keeping outputs concise, structured, and operational

## What agents should not do by default

Agents should not, unless explicitly instructed:

- broaden the product into multi-agent orchestration
- introduce control-plane architecture
- rewrite the product positioning away from deterministic governance
- alter stable semantics of `audit`, `permit`, or `classify`
- introduce destructive git actions
- remove bounded surfaces that are part of released lineage
- merge multiple roadmap steps into one version without justification
