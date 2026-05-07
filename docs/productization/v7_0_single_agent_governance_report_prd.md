# v7.0 - Single-Agent Governance Report Productization Design

## Status

Planning only.

This document defines the productization direction for `v7.0`.
It does not change the current commercial baseline, released behavior, entitlement logic, documentation surface, or implementation surface.

Current commercial baseline remains `MindForge Guard v6.13.1`.

`v6.14-v6.22` must be treated as productization assets, not semantic stacking and not current commercial surface.

## Boundary And Invariants

This PRD preserves:

- `audit` output unchanged
- `audit` verdict semantics unchanged
- `audit` exit semantics unchanged
- deny exit code `25` unchanged
- permit behavior unchanged unless separately scoped
- classify behavior unchanged unless separately scoped
- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- no authority scope expansion
- no control-plane drift
- no dashboard-first drift
- no multi-agent orchestration drift

This PRD does not modify:

- README
- current docs
- License Hub
- pricing
- `mindforge.run`
- release notes
- demo pages
- commercial copy
- package behavior
- CLI implementation
- schemas
- fixtures
- verifiers
- tests
- product entitlement logic

## 1. Stage Judgment

### Why not continue `v6.23` semantic expansion

The `v6.14-v6.22` arc already completed the next bounded governance evidence chain:

- authority and intent boundary
- explainability and provenance
- admissibility readiness
- drift and guardrail visibility
- transition validity preview
- procedural receipt
- lineage trajectory visibility

The current gap is no longer missing internal semantics.
The current gap is translation, consolidation, packaging, and review usability.

Starting `v6.23` as another semantic layer would create three risks:

- it would extend internal capability depth before the existing stack is turned into a coherent product object
- it would make future buyer and reviewer language harder to simplify
- it would increase the chance of platform drift, authority drift, or premature public surface fragmentation

The right next step is not another boundary primitive.
The right next step is a bounded report artifact that converts the completed single-agent stack into governance-ready evidence.

### Why not commercial launch now

A commercial launch would be early for four reasons:

- the consolidated report object is not yet frozen as a schema, fixture, and verifier-backed preview artifact
- the report language has not yet been translated cleanly from internal governance terms into buyer-safe user language
- the demo path is not yet reduced to a clear 10-minute walkthrough centered on one product object
- edition mapping and release-gate review have not yet been completed for a safe commercial translation

Current baseline protection remains mandatory:

- `v6.13.1` remains the commercial baseline
- no commercial claim should imply that `v6.14+` roadmap capabilities are currently shipped
- no README, License Hub, pricing, demo, or website change should occur from this planning phase

### Why `v7.0` should start with Single-Agent Governance Report

`v7.0` should start with Single-Agent Governance Report because it creates one primary product conclusion for the already completed internal arc:

- one bounded object instead of many internal-only boundaries
- one review-facing surface instead of many feature-level explanations
- one deterministic evidence package that stays recommendation-only
- one productization anchor for future demo, edition, and commercial review work

This keeps Guard aligned with its posture:

- deterministic governance layer
- inspectable evidence surface
- non-enforcing, non-executing review aid
- single-agent first before any multi-agent planning expansion

### Productization gaps that remain

The completed internal stack still needs:

- a consolidated single-agent report object
- user-facing section names and value translation
- a safe review-readiness vocabulary that does not become approval language
- preview schema, fixtures, and verifier support
- a compact demo path
- candidate edition mapping
- commercial release-gate review criteria

## 2. Product Goal

### Version definition

`v7.0 - Single-Agent Governance Report`

### Positioning

From AI-generated change to governance-ready evidence.

Chinese positioning:
从 AI 生成变更到可审查、可追溯、可采纳的治理证据。

### Core question

Is this AI-assisted change ready to be reviewed, accepted, escalated, or held for more evidence?

### Product goal statement

The goal of `v7.0` is to define a single deterministic report artifact that summarizes the governance-relevant evidence surrounding one AI-assisted change without making a decision, granting permission, or enforcing an outcome.

The report should help a human reviewer understand:

- what changed
- what the AI-assisted action appears intended to do
- what evidence exists
- where risk or drift may still require attention
- whether the artifact looks ready for review or needs more evidence

## 3. Target Users

- AI-assisted software developer
- solo founder / indie hacker
- small engineering team
- DevSecOps reviewer
- platform engineer evaluating AI coding outputs
- future enterprise AI governance owner

## 4. Product Value Translation

Internal terms should support implementation and verification, but they should not become buyer-facing feature names by default.

| Internal term | User-facing translation |
| --- | --- |
| authority / intent boundary | intended change scope and expected permissions context |
| authority explain | what the change appears allowed or expected to touch |
| grounding / provenance | where the supporting evidence came from |
| admissibility readiness | whether the evidence looks review-ready |
| authority drift | whether the change appears to have moved away from its stated scope |
| symbolic guardrail mapping | how the change lines up with stated review requirements |
| transition validity | whether required conditions still appear intact after the change |
| procedural patch receipt | whether the change was recorded with traceable review artifacts |
| lineage trajectory | how this change connects to prior related governance artifacts |

Buyer-facing language should prefer:

- review readiness
- evidence clarity
- scope visibility
- change risk
- traceable lineage
- requirement coverage

Buyer-facing language should avoid using internal governance labels as standalone feature names unless a later release intentionally exposes them.

## 5. Minimal Product Object

### Object definition

`single_agent_governance_report_preview v1`

This is the minimum report object for `v7.0`.
It is a preview report artifact, not a gate, not a permit, and not an execution instruction.

### Required report sections

| Section | Purpose |
| --- | --- |
| `action_summary` | concise summary of the AI-assisted action or change under review |
| `intent_summary` | summarized stated or inferred intent of the change |
| `authority_summary` | bounded description of expected scope and authority context |
| `evidence_summary` | summary of available evidence inputs supporting the report |
| `admissibility_summary` | summary of whether the evidence appears sufficient for human review |
| `risk_summary` | bounded summary of notable risk indicators or missing confidence areas |
| `drift_summary` | summary of scope, authority, or behavioral drift signals |
| `guardrail_mapping_summary` | summary of how the change lines up with stated review requirements |
| `transition_summary` | summary of whether required conditions appear to have remained intact across the change |
| `procedural_receipt_summary` | summary of recorded procedural artifacts related to the change |
| `lineage_summary` | summary of related prior artifacts, context chain, or change lineage |
| `review_posture` | non-decision readiness signal for human review routing |
| `receipt_refs` | stable references to supporting receipts and linked artifacts |
| `deterministic_hash` | deterministic content hash for report integrity and reproducibility |
| `non_enforcement_boundary` | explicit statement that the report does not approve, deny, or enforce action |

### Minimal object posture

The object should be:

- deterministic
- schema-friendly
- fixture-verifiable
- review-oriented
- recommendation-only
- additive to existing surfaces
- safe to keep preview-first until later release review

## GitHub Action Readiness

### Purpose

`v7.0` should define a stable Single-Agent Governance Report artifact that can later be consumed by a thin GitHub Action wrapper in CI and pull request workflows.

The purpose of this boundary is report-contract readiness only.
It does not introduce a GitHub delivery surface in `v7.0`, and it does not change the current single-agent, recommendation-only, non-executing posture.

### Non-goals

`v7.0` does not ship:

- a GitHub Action
- a GitHub Marketplace listing
- a GitHub App
- Marketplace billing
- a hosted dashboard
- a hosted evidence archive
- PR merge authority
- deployment authority
- runtime execution authority
- CI enforcement by default

### Future wrapper model

A future `mindforge-guard-action` should be described only as a thin wrapper around Guard CLI and report output.

That future wrapper may later:

- install or invoke Guard CLI
- run a stable `v7.0` report command once such a command exists
- collect JSON, Markdown, and receipt artifacts
- upload reports as GitHub Actions artifacts
- optionally write a pull request summary
- surface a review-readiness signal without granting approval

The future wrapper must not:

- reimplement Guard governance logic
- fork report semantics away from Guard CLI
- create a separate governance engine

### Advisory-by-default posture

Any future GitHub Action integration must remain advisory by default.

If a stricter CI workflow behavior is ever supported later, it must be framed as user-configured workflow policy outside the Guard report contract.
It must not be framed as Guard acquiring execution, approval, merge, blocking, or deployment authority.

### Stable report expectations

`v7.0` should keep the report contract ready for future CI consumption with the following stable output expectations:

- machine-readable JSON report
- human-readable Markdown report
- receipt or evidence artifact
- explicit schema or version identifier
- deterministic output from the same input
- clear limits and non-proofs
- explicit fields preserving:
  no execution authority granted
  no blocking effect by default
  no approval granted
  review readiness only

These expectations prepare a bounded report for future wrapper use without changing current `v7.0` semantics or entering Phase 2 implementation.

### Edition mapping boundary

Future Action usage should default to Community-visible capabilities.

If Pro or Pro+ capabilities are used later, they must be unlocked through the existing Guard license mechanism and License Hub path.
The wrapper must not create a separate edition model, separate entitlement path, or separate Marketplace billing path in `v7.0`.

### Marketplace readiness boundary

GitHub Marketplace may later become a distribution channel for the wrapper.
`v7.0` only prepares the report contract for that future possibility.

`v7.0` does not launch Marketplace distribution, Marketplace billing, or a separate commercial wrapper surface.

### Wording boundary

This readiness boundary should continue to use concise PRD language centered on:

- review-readiness
- evidence artifact
- human review
- advisory signal
- bounded report
- future wrapper

This readiness boundary should avoid:

- hype language
- SaaS or platform claims
- approval language
- certification claims
- compliance guaranteed claims
- safe to merge claims
- safe to deploy claims

## 6. `review_posture` Design

`review_posture` is a routing and readiness signal inside the report.

It is not:

- a decision
- approval
- enforcement
- a permit
- a release gate result
- a commit or deployment instruction

### Allowed values

- `ready_for_review`
- `needs_human_review`
- `insufficient_evidence`
- `out_of_scope`
- `unknown`

### Forbidden values

- `approve`
- `reject`
- `admit`
- `deny`
- `allow`
- `block`
- `pass`
- `fail`
- `permit`
- `commit`
- `deploy`

### Design intent by value

| Value | Meaning |
| --- | --- |
| `ready_for_review` | evidence appears sufficiently organized for normal human review |
| `needs_human_review` | the change is reviewable, but risk, ambiguity, or drift signals should be examined closely |
| `insufficient_evidence` | more evidence is needed before the report can support useful human review |
| `out_of_scope` | the change or artifact falls outside the intended report boundary |
| `unknown` | the system cannot safely summarize a more specific posture |

## 7. Pre-v6.14 Capability Foundation

The Single-Agent Governance Report should be built on top of already established pre-`v6.14` capability foundations rather than replacing them.

| Capability foundation | How it supports the report |
| --- | --- |
| `status` / `validate-policy` | provides baseline governance and policy-state visibility that supports intent, scope, and readiness framing |
| `audit` | remains the core deterministic governance review surface and contributes evidence inputs without changing its contract |
| `snapshot` | provides stable point-in-time capture for evidence continuity and reproducibility |
| `action classify` | helps describe what kind of AI-assisted action is under review for `action_summary` and `intent_summary` |
| `drift status` / `timeline` / `compare` | contributes drift visibility and change-context signals for `drift_summary` and `risk_summary` |
| `assoc correlate` | helps connect related artifacts and signals that support `lineage_summary` and evidence interpretation |
| `Risk v1` / `Spread Risk` | contributes bounded risk interpretation for `risk_summary` without becoming enforcement |
| license / edition gate | preserves current entitlement boundaries while future report packaging is evaluated safely |
| verification chain | ensures the report can become schema-backed, fixture-backed, and verifier-backed without changing released semantics |

## 8. `v6.14-v6.22` Mapping Table

| version | internal capability | report section supported | user-facing value | classification |
| --- | --- | --- | --- | --- |
| `v6.14` | Authority / Intent Boundary | `intent_summary`, `authority_summary` | clarifies what the change appears intended to do and what scope it touches | report infrastructure |
| `v6.15` | Authority Explain Boundary | `authority_summary`, `risk_summary` | makes expected scope and permission context easier to inspect | report infrastructure |
| `v6.16` | Grounding / Provenance Boundary | `evidence_summary`, `receipt_refs` | shows where supporting evidence came from | evidence infrastructure |
| `v6.17` | Admissibility Readiness / Explanation Boundary | `admissibility_summary`, `review_posture` | translates evidence readiness into human review readiness | future CLI candidate |
| `v6.18` | Execution-Time Authority Drift Boundary | `drift_summary`, `risk_summary` | shows whether the change appears to have moved away from expected scope | report infrastructure |
| `v6.19` | Symbolic Guardrail Mapping Boundary | `guardrail_mapping_summary` | shows how the change lines up with stated review requirements | future release narrative candidate |
| `v6.20` | Execution-Bound Transition Validity Preview | `transition_summary` | shows whether declared conditions appear to remain intact across the change | report infrastructure |
| `v6.21` | Procedural Artifact Patch Receipt Boundary | `procedural_receipt_summary`, `receipt_refs` | shows that review-relevant procedural artifacts were recorded | evidence infrastructure |
| `v6.22` | Procedural Lineage Trajectory Preview Boundary | `lineage_summary`, `receipt_refs`, `deterministic_hash` | shows how this change connects to prior governance artifacts and traceable lineage | future release narrative candidate |

## 9. Explicit Non-Goals

- no enforcement
- no execution permission
- no commit gate
- no deployment gate
- no workflow execution
- no agent orchestration
- no runtime control
- no automatic approval
- no commercial surface change in this phase
- no pricing change
- no License Hub change
- no README/current docs change
- no `mindforge.run` change

Also not included:

- no new released CLI behavior
- no schema change in this PRD phase
- no fixture or verifier change in this PRD phase
- no entitlement expansion
- no launch copy
- no dashboard-first packaging

## 10. `v7.0` Phased Plan

No commercial launch should occur before Phase 5.

### Phase 1: Single-Agent Governance Report PRD

Goal:
freeze the product boundary, user language, object definition, and non-goals.

Outputs:

- this PRD
- boundary statement
- review vocabulary
- candidate edition and release-gate framing

### Phase 2: `single_agent_governance_report_preview` schema / fixture / verifier

Goal:
turn the PRD object into a deterministic internal preview artifact.

Outputs:

- preview schema
- preview fixture set
- verifier coverage
- unchanged-surface confirmation for existing released contracts

### Phase 3: internal final acceptance / RC freeze

Goal:
confirm the report object is stable, bounded, and release-candidate ready internally.

Outputs:

- final acceptance review
- compatibility confirmation
- freeze statement
- unresolved ambiguity closeout

### Phase 4: 10-minute demo path

Goal:
reduce the report into a compact, repeatable walkthrough centered on one input and one output.

Outputs:

- demo fixture or demo-ready change input
- report walkthrough
- example `review_posture` outcomes
- operator guidance for what the report means and does not mean

### Phase 5: commercial release gate review

Goal:
decide whether the report is safe to translate into commercial-facing packaging.

Outputs:

- current-vs-future baseline review
- edition fit review
- launch safety review
- explicit go / hold judgment for any future commercial release work

Commercial launch remains blocked before this phase.

## 11. 10-Minute Demo Path

This is a future demo design, not a current demo change.

### Demo input

- one AI-generated change or controlled fixture

### Demo output

- one Single-Agent Governance Report

### Suggested demo flow

1. Start with one AI-assisted change artifact.
2. Show the report as the single consolidated review object.
3. Walk the reviewer through the evidence, risk, drift, and lineage summaries.
4. Explain `review_posture` as a review-readiness signal, not a decision.
5. End with the human question: review now, escalate, or gather more evidence.

### Example `review_posture` outcomes

| Example posture | Demo meaning |
| --- | --- |
| `ready_for_review` | the report looks organized enough for ordinary human review |
| `needs_human_review` | the report highlights ambiguity, drift, or risk that should be examined carefully |
| `insufficient_evidence` | the reviewer should gather more evidence before relying on the report |

The demo must not use:

- `approve`
- `block`
- `commit`
- `deploy`

## 12. Candidate Edition Mapping

No edition change is made by this planning document.

Candidate future mapping only:

| Edition | Candidate mapping |
| --- | --- |
| Community | Basic governance visibility report |
| Pro | Single-agent readiness report |
| Pro+ | PR / CI governance report bundle |
| Enterprise | Evidence package, retention, policy hierarchy, future multi-agent lineage |

This table is planning input only.
It must not be treated as a released entitlement change, pricing change, or current commercial claim.

## 13. Multi-Agent Start Conditions

Multi-Agent planning-only may begin only after:

- Single-Agent Governance Report PRD
- Single-Agent Report preview object / schema / fixture / verifier
- 10-minute demo path
- candidate edition mapping
- commercial release gate review path

The first Multi-Agent entry must be:

`Multi-Agent Handoff Receipt Boundary`

Core narrative:

Task handoff is visible; authority is not automatically inherited.

Multi-Agent follow-on planning must not design:

- orchestrator
- planner
- workflow engine
- agent routing
- auto delegation
- dashboard-first control plane
- runtime enforcement

## Final Planning Conclusion

`v7.0` should begin with Single-Agent Governance Report productization, not `v6.23` semantic expansion and not commercial launch.

This is the cleanest bounded next step because it:

- consolidates the completed single-agent internal stack into one review object
- preserves `v6.13.1` as the frozen commercial baseline
- keeps Guard recommendation-only, additive-only, and non-executing
- creates the minimum safe bridge from internal governance assets to future release evaluation
