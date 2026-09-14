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

## V8 semantic-foundation strategic context

The current released/commercial baseline remains governed by the sections above.

The V8 workstream is an additive research-and-architecture track and must not be treated as already released product behavior unless separately implemented, verified, and released.

### Long-term architecture direction

The long-term architecture direction is to evolve Guard toward an independent Evidence Assurance Infrastructure for consequential AI actions.

The intended strategic control point is:

**Evidence Semantic Control Point**

Guard should make consequential AI actions increasingly:

- provable
- semantically bounded
- cross-system understandable
- independently reviewable
- institutionally adoptable

This direction does not authorize Guard to become an execution authority, runtime control plane, orchestrator, security firewall, general-purpose GRC system, IAM/KYA issuer, audit firm, certification authority, or autonomous acceptance authority.

### Core architecture separation

The V8 semantic-foundation architecture uses the following separation:

- **Evidence Contract = Syntax**
  Defines how governance evidence is represented.

- **MESR = Semantics**
  Defines what evidence means, what claims it supports, and what claims it does not support.

- **EAK = Assurance**
  Evaluates which bounded claims are legitimately supportable from the available evidence and semantic basis.

- **Governance Report / Institutional Decision Artifact = Institutional Communication**
  Projects bounded assurance results into traceable, reviewable institutional artifacts without creating execution authority.

The intended architecture sequence is:

```text
Producer / Runtime
→ Evidence Contract
→ MESR
→ EAK
→ Governance Report / Institutional Decision Artifact
→ Institutional Consumer
```

### Semantic control invariant

The governing invariant for composable semantic architecture is:

> Core defines meaning. Modules extend context. No module may silently redefine evidence.

The composable direction is:

```text
Stable Core
+ Additive Modules
+ Strict Semantic Contracts
+ Composable Deployment
```

Domain Packs, Crosswalks, Institutional Profiles, and Producers may add context, specialization, mappings, or projections, but they must not silently widen Core claims, remove Core non-claims, or redefine canonical Core semantics.

### Critical claim-boundary invariants

Agents must preserve at least the following distinctions unless a later validated architecture decision explicitly changes them:

- Identity != Authority
- Access != Authority
- Capability != Authority
- Authority != Commitment
- Tool Call Observed != Action Succeeded
- Action Succeeded != Outcome Correct
- Execution Succeeded != Verification Passed
- Evidence Present != Evidence Sufficient
- Observation != Verification
- Producer Verification != Independent Verification
- Verification Passed != Acceptance
- Acceptance Authority != Acceptance Decision Occurred
- Historical Standing != Current Standing
- Runtime ALLOW != Safe
- Runtime ALLOW != Institutional Acceptance
- Guard `allow` != Execution Authorization
- Evidence Sufficiency != Audit Opinion
- Replayability != Real-world Truth
- Semantic Portability != Universal Interoperability

When a claim is not supported by available evidence, the implementation should prefer an explicit bounded unresolved/inconclusive posture over semantic inflation.

### V8.0 semantic-foundation scope

V8.0 is a **Semantic Foundation Release**, not a feature-expansion release.

Primary scope:

- MESR Core
- Semantic ID architecture
- Claim / Non-Claim model
- semantic versioning and supersession
- compatibility-preserving reason-code bindings
- Software Change Domain Pack
- Cyber Remediation contrast skeleton
- EAK semantic binding
- Governance Report semantic provenance
- module manifest and compatibility invariants
- Experiment 3 semantic portability/composition tests

Primary domain wedge remains:

**AI-generated software change governance**

Cyber Remediation is a contrast domain for semantic portability and composition testing, not a separate broad security-product expansion.

Finance, Healthcare, HR, Procurement, Industrial/OT, broad connector programs, marketplaces, large Studio redesigns, and probabilistic semantic reasoning remain out of scope unless separately re-entered through validated evidence and an explicit roadmap decision.

### Current V8 gate

Current architecture status:

```text
RESEARCH_COMPRESSION = PASS
SEMANTIC_ARCHITECTURE_REPAIR = PASS
V8_000_SOURCE_RECONCILIATION = REQUIRED_NEXT
GATE_1_IMPLEMENTATION = BLOCKED_UNTIL_V8_000_PASS
```

Research-derived semantic artifacts are candidates, not a second canonical implementation.

Before Gate 1 implementation, V8-000 must reconcile the repaired Research Semantic Baseline against the actual current Guard source repository, including:

- Evidence Contract schema and behavior
- canonical reason codes and consumers
- Governance Report semantics
- current MESR/EAK implementation
- fixtures and tests
- aliases and compatibility constraints

Every research semantic candidate must receive exactly one implementation verdict:

- `ALREADY_IMPLEMENTED`
- `ALIGN_AND_ADOPT`
- `NEEDS_EXPERIMENT`
- `REJECT_OR_DEFER`

No ambiguous fifth category should be introduced.

### External-review freeze

Already-delivered Experiment 2B external-review artifacts are frozen historical evidence.

Do not rewrite or silently update:

- reviewer packages
- reviewer questions
- acceptance contracts
- historical review records
- delivered evidence baselines

New V8/MESR/EAK concepts belong to the next architecture baseline.

Reviewer feedback should enter through:

```text
Reviewer Response
→ Verbatim Capture
→ Claim Extraction
→ Agreement / Challenge / Ambiguity
→ Architecture Impact
```

Historical review evidence must remain immutable even when current architecture evolves.

### Research-to-product discipline

External research must not be converted directly into product requirements.

Required progression:

```text
Research Signal
→ Guard Interpretation
→ Architecture Hypothesis
→ Experiment / Fixture
→ Validated Architecture Decision
→ Product Backlog
```

Prefer falsifiable experiments, deterministic fixtures, explicit provenance, and bounded claim/non-claim semantics over concept accumulation.

### V8 implementation discipline

For the semantic-foundation track, prefer in this order:

1. documentation / ADRs
2. schemas and specifications
3. deterministic analysis or validation scripts
4. fixtures and negative tests
5. additive compatibility mappings
6. narrowly scoped runtime changes only after the relevant gate is passed

Do not silently break:

- Evidence Contract compatibility
- established reason-code behavior
- Governance Report serialized output
- CLI / SDK consumers
- historical fixtures
- external-review evidence
- released commercial behavior

The V8 semantic-foundation track must strengthen evidence meaning and claim-boundary stability without causing authority expansion, runtime takeover, or control-plane drift.

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
