# Production Evidence Readiness Measurement Template v0.1

Status: Experiment 2 measurement template prepared on 2026-08-27.

## 1. Purpose

This template prepares measurement for design-partner review runs.

It does not:

- claim design-partner validation has happened
- define a fixed success percentage
- authorize cloud rollout

## 2. Metrics

| Metric | Baseline capture | After capture | Unit |
| --- | --- | --- | --- |
| review cycle time | time from evidence submission to reviewer-ready packet before Guard | time from evidence submission to reviewer-ready packet with Guard | hours or days |
| reviewer hours | total reviewer effort before Guard | total reviewer effort with Guard | hours |
| evidence chase effort | number of manual evidence-follow-up actions before Guard | number of manual evidence-follow-up actions with Guard | count |
| supplementation rounds | number of evidence supplementation loops before decision | number of evidence supplementation loops with Guard | count |
| missing-evidence count | missing items identified during baseline review | missing items identified by the Guard-backed review | count |
| unverified-claim count | claims treated as unverified in the baseline process | claims treated as unverified in the Guard-backed process | count |
| contradiction count | contradictory evidence items surfaced in the baseline process | contradictory evidence items surfaced in the Guard-backed process | count |
| decision-trace completeness | reviewer assessment of whether the decision basis is traceable | reviewer assessment after Guard review packet | ordinal note |

## 3. Baseline Measurement Method

For each design-partner review event:

1. record the unassisted review path used immediately before the Guard-backed run
2. capture timestamps, reviewer roles, and manual evidence-chase steps
3. count supplementation loops and unresolved claims using the partner's actual review record
4. record the reviewer's own statement on whether the decision basis was complete, partial, or unclear

## 4. Comparison Method

For the matching Guard-backed review event:

1. use the same review subject
2. use the same decision owner or equivalent reviewer role when feasible
3. capture the same metrics on the Guard-backed run
4. compare baseline and after values side by side
5. preserve any scope differences or missing-producer limitations as explicit notes

## 5. Decision Rule

No universal percentage threshold is pre-committed in this template.

Decision rule:

- treat improvement as credible only when at least one materially important workflow metric improves and the reviewer says the difference changed real review work
- treat the result as mixed if the packet looks clearer but cycle time, evidence chase, and supplementation work do not improve
- treat the result as negative if the Guard-backed flow adds overhead without reducing ambiguity or reviewer effort

## 6. Capture Sheet

| Review ID | Subject | Buyer / owner role | Baseline cycle time | Guard cycle time | Baseline reviewer hours | Guard reviewer hours | Baseline chase count | Guard chase count | Baseline supplementation rounds | Guard supplementation rounds | Baseline missing count | Guard missing count | Baseline unverified claims | Guard unverified claims | Baseline contradictions | Guard contradictions | Baseline decision-trace note | Guard decision-trace note | Reviewer outcome note |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| sample-row | workflow-or-agent | platform / security / governance / procurement |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

## 7. Readiness Use

This template is ready for Experiment 2 on 2026-08-27.

It remains a template only until a real design-partner review run is executed.
