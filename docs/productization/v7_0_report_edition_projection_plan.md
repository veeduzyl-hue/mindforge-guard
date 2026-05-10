# v7.0 Report Edition Projection Plan

## 1. Scope

- Planning only
- No entitlement change
- No public commercial surface change
- No launch execution
- No implementation work

## 2. Current Commercial Baseline

- MindForge Guard v6.13.1 remains the current commercial baseline.
- v7.0 Single-Agent Governance Report is internally RC-frozen and commercially translation-plannable, but not publicly launched.

## 3. Canonical Report Contract

- v7.0 currently has one canonical report contract: `single_agent_governance_report_preview v1`
- Do not create separate schemas for Community / Pro / Pro+ / Enterprise.
- Edition projection must happen through profile, visibility, packaging, and explanation, not through different governance semantics.

## 4. Projection Principle

Edition projection controls visibility, packaging, and commercial explanation.
It does not grant approval, blocking, merge, deployment, or execution authority.

## 5. Edition Projection Summary

| Edition | Recommended Report Positioning | Primary Buyer Value | Allowed Projection | Blocked Projection |
| --- | --- | --- | --- | --- |
| Community | Basic Governance Visibility Report | understand what happened, what evidence exists, and where the non-enforcement boundary is | basic visibility, basic evidence summary, receipt references, deterministic hash, artifact provenance | readiness reasoning, CI bundle, PR governance package, enforcement, approval, safe-to-merge |
| Pro | Single-Agent Readiness Report | understand whether a single-agent run is reviewable, explainable, and evidence-backed | review posture, admissibility summary, authority summary, risk summary, drift summary, guardrail mapping, transition summary, lineage summary, missing evidence | approval, enforcement, safe-to-merge, safe-to-deploy, commit gate, deployment gate |
| Pro+ | PR / CI Governance Report Bundle Candidate | prepare richer governance bundles for technical review and workflow integration | bundle readiness, PR / CI artifact preparation, drift compare integration, assoc correlation integration, team review bundle candidate | GitHub Action launched, Marketplace availability, CI blocking, merge gate, deployment gate, automatic workflow execution |
| Enterprise | Evidence Package / Retention / Policy Hierarchy Candidate | prepare organizational evidence review, retention, hierarchy, and future lineage readiness | evidence package candidate, retention readiness, policy hierarchy readiness, procurement boundary language, future multi-agent handoff readiness | control plane, orchestrator, runtime enforcement, fleet control, auto containment, compliance certification, legal compliance claim |

## 6. Report Section Visibility Matrix

| Report Section | Community | Pro | Pro+ | Enterprise | Notes |
| --- | --- | --- | --- | --- | --- |
| action_summary | visible | visible | visible | visible | Core explanation of what happened. |
| intent_summary | blocked | visible | visible | visible | Community stays on outcome visibility, not deeper run intent framing. |
| authority_summary | blocked | visible | visible | visible | Visibility does not grant authority. |
| evidence_summary | visible | visible | visible | visible | Core evidence surface across all editions. |
| admissibility_summary | blocked | visible | visible | visible | Readiness-oriented summary begins at Pro. |
| risk_summary | blocked | visible | visible | visible | Review support only, not blocking logic. |
| drift_summary | blocked | visible | bundled | visible | Pro+ can package drift context into a review bundle. |
| guardrail_mapping_summary | blocked | visible | bundled | visible | Mapping may be packaged for workflow fit. |
| transition_summary | blocked | visible | bundled | visible | Useful for review and handoff framing, not execution. |
| procedural_receipt_summary | limited | visible | bundled | visible | Community may see a lighter procedural summary tied to receipt references. |
| lineage_summary | blocked | visible | bundled | enterprise_candidate | Enterprise may project lineage readiness without new semantics. |
| review_posture | limited | visible | bundled | visible | Community may receive bounded posture language only. |
| receipt_refs | visible | visible | bundled | visible | Pro+ may package refs into PR / CI review bundles. |
| deterministic_hash | visible | visible | visible | visible | Deterministic identity remains canonical across editions. |
| non_enforcement_boundary | visible | visible | visible | visible | Must stay explicit across all editions. |
| pre_v6_14_capability_foundation | limited | limited | limited | limited | Boundary language stays future-scoped and non-launching. |
| artifact_provenance | visible | visible | bundled | enterprise_candidate | Enterprise may project stronger evidence package readiness. |
| review_evidence | blocked | visible | bundled | enterprise_candidate | Enterprise may frame this as evidence package preparation only. |
| proposed_action | blocked | visible | visible | visible | Recommendation-only; never approval or execution. |
| policy_evaluation_preview | blocked | limited | bundled | enterprise_candidate | Preview-only visibility; no policy engine or enforcement claim. |
| findings | limited | visible | visible | visible | Community can receive bounded findings visibility without deeper gating implications. |

## 7. Blocked Claims Across All Editions

The following claims remain blocked across all editions:

- enforcement claims
- approval claims
- safe-to-merge claims
- safe-to-deploy claims
- compliance certification claims
- legal compliance claims
- policy engine claims
- runtime control plane claims
- orchestrator claims
- autonomous execution claims
- GitHub Action launch claims
- Marketplace launch claims
- Multi-Agent launch claims

## 8. License / Entitlement Boundary

- This plan does not change entitlement logic.
- This plan does not change License Hub behavior.
- This plan does not change pricing.
- This plan does not authorize edition packaging changes.
- Future entitlement implementation, if approved, must remain separate.

## 9. Commercial Surface Boundary

This file does not authorize modifying:

- README
- current docs
- License Hub
- pricing
- mindforge.run
- release notes
- public demos

## 10. Recommended Next Decision

Allowed values:

- hold_edition_projection
- prepare_selected_surface_copy
- prepare_edition_copy_candidates

Recommended next decision:

- prepare_edition_copy_candidates

This only authorizes candidate copy preparation. It does not authorize public commercial surface edits.

## 11. Next Phase

Recommended next phase:
v7.0 Edition Copy Candidate Draft

Explicit approval is required before that phase begins.
This plan does not authorize automatic edits to README, License Hub, pricing, or mindforge.run.
