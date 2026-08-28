# Production Evidence Readiness Experiment 2 Operational Plan v0.1

Status: Experiment 2A operational-readiness package. It prepares a bounded validation workflow and does not begin partner outreach or a live review.

## Purpose And Scope

Experiment 2 asks: **Did Guard reduce the cost, ambiguity, or evidence-chasing burden of a real review decision?** It validates workflow and buyer hypotheses, not certification, approval, deployment control, Cloud, or runtime enforcement.

Experiment 2A creates the reusable operating package. Experiment 2B may start only when a real external partner supplies a bounded subject, accountable reviewer, real review event, and permitted evidence.

## Entry And Partner Qualification

Entry requires the accepted Kernel PoC and Experiments 0, 1, and 1.1; the secret-safe intake protocol; this package; and the measurement template. Qualify the first three to five partners against the following 1-5 scorecard, prioritizing real review and evidence pain rather than organization size or brand.

| Criterion | 1 | 3 | 5 |
| --- | --- | --- | --- |
| Review urgency | hypothetical | planned event | current production-entry or material-change event |
| Evidence fragmentation | one summary | two partial sources | multiple relevant systems with known chase burden |
| Accountable ownership | none | role identified | accountable reviewer committed |
| Recurring review likelihood | one-off | possible | clear release, renewal, or re-review cadence |
| Evidence access | unavailable | partial | safe bounded evidence available |
| Privacy feasibility | unclear | redaction needed | bounded sanitation path agreed |
| Workflow measurability | anecdotal | some timestamps | baseline owners and units agreed |
| Commercial relevance | curiosity | user role plausible | buyer, budget, and repeat event can be discussed |
| Repeat-review potential | none | possible | second event is identifiable |
| Guard boundary fit | expects authority | accepts review support | accepts recommendation-only, non-executing review |

Minimum qualification: every required condition below must be true and the scorecard total must be at least 32/50.

- One real AI-assisted workflow, agent, or third-party integration.
- One accountable review-owner role.
- One production-entry, material-change, renewal, or re-review event.
- Evidence fragmented across at least two relevant systems.
- Ability to provide bounded, sanitized or redacted evidence and participate in measurement.

Disqualify demo-only projects; reviews without an accountable owner or real event; cases with no safe evidence access; requests for a generic compliance report; or expectations that Guard will certify, approve, authorize, deploy, or enforce.

## Review Subject And Intake

Freeze `subject_id`, subject type, workflow or agent identity, version or revision, review scope, trigger event, requested evidence question, and known limitations before intake. Convert broad requests such as "is this agent safe?" into a bounded evidence question tied to a concrete event.

Use the [intake template](./templates/production-evidence-readiness-design-partner-intake-v0.1.md) and the Experiment 1 [intake protocol](./evidence-assurance-experiment-1-intake-protocol-v0.1.md). Raw customer evidence stays outside Git; credentials never enter packets; sanitized evidence is retained only with permission; provenance and redaction are recorded; and redaction must not silently change claims.

## Evidence Request And Verification

Request profile-driven evidence by family: identity, release, build/test, deployment/provenance, tools, model/configuration, data/context, runtime, security/safety, rollback/recovery, limitations, and reviewer notes. Mark each family `required`, `conditionally_required`, `optional`, or `not_applicable`.

For each requested item separately record applicability and verification expectation: `declaration_acceptable`, `verification_recommended`, or `independent_verification_required`. Required evidence is not automatically independently verified.

## Execution And Supplementation

`Qualification -> Scope freeze -> Baseline capture -> Intake -> Validate -> Normalize -> Verify -> Kernel -> Profile -> Review packet -> Human review -> Supplementation -> Re-run -> Disposition -> Outcome measurement -> Interview`

Use the [review packet template](./templates/production-evidence-readiness-review-packet-v0.1.md). The reviewer may accept or reject evidence, request supplementation, acknowledge uncertainty, defer, or proceed externally. Guard presents evidence; it never owns the final decision.

Each supplementation request has an ID, reason, target conclusion, required evidence, accepted form, verification expectation, status, and re-review result. This measures whether evidence chasing becomes specific and executable.

## Measurements, Success, And Stop Rules

Before Guard, record cycle time, reviewer hours, evidence-chase actions, systems consulted, supplementation rounds, missing evidence, unverified claims, ambiguity, and decision-trace completeness. Use [the measurement template](../strategy/production-evidence-readiness-measurement-template-v0.1.md) for definitions, units, owners, timing, and before/after comparison. Do not predeclare a universal percentage improvement.

A valid Experiment 2 review needs a real external subject, reviewer, event, evidence, baseline, executed Guard review, reviewer-visible packet, and reviewer disposition or feedback. Stop or hold if evidence is unsafe to handle, scope cannot be bounded, the partner expects authority, or the review produces no usable reviewer feedback.

After three to five valid reviews, assess the portfolio only if there is measurable burden reduction, at least one paid or procurement-backed commitment, two partners identify the same recurring event, and one second review is materially faster. Interest or praise alone is not commercial validation. Capture buyer role, budget owner, procurement path, paid-pilot willingness, repeat-use intent, and their `Hypothesis` or `Evidence` status.

## Exit Status

`EXPERIMENT_2A_OPERATIONAL_READY = YES` when this package, privacy boundary, measurement, supplementation loop, success/stop rules, and templates are complete without authority drift.

`DESIGN_PARTNER_SECURED = NO` until real external information establishes otherwise.

`EXPERIMENT_2B = WAITING_FOR_DESIGN_PARTNER` until a qualified partner is secured. Independent-producer corroboration may be observed if the real workflow naturally provides it; it is not a forced intake requirement.

Temporal Authority remains observation-only: record authority/action-time changes, scope drift, deployment drift, or evidence staleness only if they appear in real reviews. `CLOUD_GO = NO`.
