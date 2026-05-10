# v7.0 Report Reading Guide

## 1. Scope

- Planning / draft guide only
- No public current docs change
- No canonical contract change
- No schema / fixture / verifier change
- No CLI change
- No edition entitlement change
- No public commercial surface change
- No launch execution
- No compliance checker
- No maturity certification
- No approval / blocking semantics

## 2. Purpose

This guide explains how a human reviewer should read the v7.0 Single-Agent Governance Report.

It is intended to help:

- individual developers understand first report output
- technical reviewers inspect evidence and boundaries
- enterprise reviewers route findings to business / technical / governance owners
- future demo and edition copy work stay aligned with report semantics

It does not change the report contract or runtime behavior.

## 3. Reader Roles

| Reader Role | Primary Question | Relevant Report Areas | What They Should Not Infer |
| --- | --- | --- | --- |
| Individual Developer | What did Guard find, what evidence is missing, and what should I improve? | `action_summary`, `evidence_summary`, `findings`, `review_posture`, `non_enforcement_boundary` | safe-to-merge, safe-to-deploy, approval |
| Technical Reviewer | Is the run traceable, deterministic, and reviewable? | `artifact_provenance`, `receipt_refs`, `deterministic_hash`, `procedural_receipt_summary`, `lineage_summary` | runtime enforcement or production monitoring |
| Business Owner | Does the agent behavior match intended task and business scope? | `intent_summary`, `action_summary`, `proposed_action`, `review_posture` | legal approval or compliance certification |
| Governance / Risk Reviewer | What authority, risk, drift, or evidence maturity signals need review? | `authority_summary`, `risk_summary`, `drift_summary`, `admissibility_summary`, `guardrail_mapping_summary`, `findings` | policy enforcement, regulatory conclusion, certification |

## 4. Three-Layer Reading Flow

### 4.1 Authority / Permission Boundary

This layer helps reviewers understand whether the reported AI-assisted change appears inside the intended task scope and authority boundary.

Include:

- `intent_summary`
- `authority_summary`
- `proposed_action`
- `policy_evaluation_preview` where available
- `non_enforcement_boundary`

Reviewer should ask:

- What was the agent or workflow trying to do?
- What authority or permission boundary was visible?
- Did the proposed action appear inside or outside the expected scope?
- What does the report explicitly not authorize?

Blocked interpretation:

- approval
- permit
- block
- safe-to-merge
- safe-to-deploy
- legal authorization

### 4.2 Execution / Behavior Evidence

This layer helps reviewers understand what happened, what evidence exists, and whether the reported behavior is traceable.

Include:

- `action_summary`
- `evidence_summary`
- `artifact_provenance`
- `procedural_receipt_summary`
- `receipt_refs`
- `deterministic_hash`
- `lineage_summary`
- `transition_summary`

Reviewer should ask:

- What action or behavior was summarized?
- Which evidence artifacts support the report?
- Are receipts or references available?
- Is the output deterministic and traceable?
- Is there enough evidence for human review?

Blocked interpretation:

- runtime monitoring
- production control
- execution containment
- behavior enforcement

### 4.3 Risk / Drift / Maturity Signals

This layer helps reviewers identify risk, drift, readiness, and evidence-maturity signals.

Include:

- `risk_summary`
- `drift_summary`
- `admissibility_summary`
- `guardrail_mapping_summary`
- `review_posture`
- `findings`
- missing evidence / evidence gaps

Reviewer should ask:

- What risks are visible?
- What drift or change signals are present?
- What evidence gaps remain?
- Is the report ready for deeper review, or does the evidence need to be improved?
- Which owner should address the next action?

Blocked interpretation:

- maturity certification
- compliance certification
- legal compliance conclusion
- regulatory approval

## 5. How To Read Review Posture

`review_posture` is a human review routing signal, not an approval outcome.

It must be read with the following boundaries:

- `review_posture` is not approval
- `review_posture` is not denial
- `review_posture` is not safe-to-merge
- `review_posture` is not safe-to-deploy
- `review_posture` helps route attention to evidence quality, risk, authority boundary, or drift concerns

## 6. How To Read Omissions / Limitations / Findings

- omission means required or expected evidence is missing or not usable
- limitation means the report can be read but with reduced evidence depth or confidence
- finding means a review-relevant signal was identified
- none of these are enforcement actions

Omissions, limitations, and findings are report outputs for human review.
They do not block, approve, deploy, merge, or execute anything.

## 7. Edition Reading Notes

Community:

- reads basic governance visibility
- focuses on `action_summary`, `evidence_summary`, `receipt_refs`, `deterministic_hash`, `non_enforcement_boundary`
- should not expect full readiness reasoning or PR / CI bundle

Pro:

- reads single-agent readiness and evidence-backed review
- focuses on `authority_summary`, `admissibility_summary`, `risk_summary`, `drift_summary`, `review_posture`, `findings`
- should not infer approval or deployment safety

Pro+:

- reads report as a candidate PR / CI governance bundle
- focuses on bundle-ready evidence, drift compare integration, assoc correlation integration, team review package
- should not infer launched GitHub Action, CI blocking, or merge gate

Enterprise:

- reads report as evidence package / retention / policy hierarchy candidate
- focuses on organizational review, policy hierarchy readiness, future lineage readiness
- should not infer control plane, orchestrator, legal compliance, or certification

## 8. First-Report Review Checklist

- Did I identify the agent / workflow being reviewed?
- Did I understand the intended task?
- Did I see the authority or permission boundary?
- Did I review the evidence artifacts?
- Did I check `receipt_refs` and `deterministic_hash`?
- Did I inspect omissions / limitations / findings?
- Did I identify the next human owner?
- Did I avoid treating the report as approval, enforcement, or certification?

## 9. Enterprise Review Routing

| Signal | Likely Owner | Recommended Review Action | Not Authorized By Report |
| --- | --- | --- | --- |
| missing owner | business owner | assign accountable owner and rerun review with ownership clarified | approval, blocking, deployment, merge, legal certification |
| missing action boundary | governance reviewer | request explicit allowed / prohibited action boundary before relying on the report | approval, blocking, deployment, merge, legal certification |
| missing evidence | technical owner | add missing artifacts, receipts, or provenance inputs and rerun review | approval, blocking, deployment, merge, legal certification |
| risk signal | governance reviewer | inspect risk context and route to the correct reviewer for follow-up | approval, blocking, deployment, merge, legal certification |
| drift signal | technical owner | compare current behavior against expected scope and document the reason for drift | approval, blocking, deployment, merge, legal certification |
| unclear tool boundary | security reviewer | review tool permissions, side effects, and boundary clarity | approval, blocking, deployment, merge, legal certification |
| weak provenance | data owner | improve source traceability and evidence metadata quality | approval, blocking, deployment, merge, legal certification |
| unclear review standard | governance reviewer | define or attach clearer review standards before interpreting readiness deeply | approval, blocking, deployment, merge, legal certification |

## 10. Boundaries And Non-Claims

This guide does not create:

- new canonical report contract
- new schema
- new entitlement
- China compliance checker
- legal compliance module
- maturity certification
- policy engine
- runtime control plane
- approval or blocking mechanism
- safe-to-merge claim
- safe-to-deploy claim
- autonomous execution authority

## 11. Recommended Next Decision

Allowed values:

- hold_report_reading_guide
- prepare_first_report_flow
- prepare_edition_copy_candidates
- prepare_example_evidence_pack

Recommended:

- prepare_first_report_flow

This only authorizes a future planning or draft document for first-report user flow.
It does not authorize public docs, CLI changes, examples, GitHub Actions, Marketplace work, entitlement changes, or commercial surface edits.
