# v7.0 Policy-Aligned Report Reading View

## 1. Scope

- Planning supplement only
- Report-reading view only
- No canonical contract change
- No schema / fixture / verifier change
- No CLI change
- No edition entitlement change
- No public commercial surface change
- No launch execution
- No policy compliance module
- No runtime control plane

## 2. Purpose

This view organizes existing v7.0 report sections into a human-readable three-layer enterprise review structure.

It may inform future:

- human-readable report layout
- demo walkthrough
- edition copy candidate
- report reading guide
- enterprise adoption material

But this PR does not edit those surfaces.

## 3. Canonical Contract Boundary

The canonical report contract remains `single_agent_governance_report_preview v1`.

This view does not introduce:

- a new schema
- a new report contract
- a new edition
- a new entitlement
- a China compliance checker
- a legal compliance module
- a maturity certification
- an enforcement surface
- a policy engine
- a runtime control plane

For this reading view, `missing_evidence` is a human-readable reading label for existing evidence-gap content.
It does not create a new canonical top-level field.

## 4. Three-Layer Reading View

| Layer | Governance Question | Existing Report Sections | Allowed Interpretation | Blocked Interpretation |
| --- | --- | --- | --- | --- |
| Authority / Permission Boundary | Is the AI-assisted change within expected authority, scope, and permission boundary? | `intent_summary`, `authority_summary`, `proposed_action`, `policy_evaluation_preview`, `non_enforcement_boundary` | authority visibility, permission boundary explanation, out-of-scope signal, human review focus | approval, block, permit, legal authorization, safe-to-merge, safe-to-deploy |
| Execution / Behavior Evidence | What happened, what evidence exists, and can the behavior be traced? | `action_summary`, `evidence_summary`, `artifact_provenance`, `procedural_receipt_summary`, `receipt_refs`, `deterministic_hash`, `lineage_summary`, `transition_summary` | evidence organization, traceability, receipt-backed review, deterministic report artifact | runtime monitoring, production control, execution containment, behavior enforcement |
| Risk / Drift / Maturity Signals | What risk, drift, readiness, or evidence-maturity signals require review? | `risk_summary`, `drift_summary`, `admissibility_summary`, `guardrail_mapping_summary`, `review_posture`, `findings`, `missing_evidence` | review-readiness signal, risk visibility, drift signal, evidence maturity signal | maturity certification, compliance certification, legal compliance conclusion, regulatory approval |

## 5. Suggested PRD Supplement Paragraph

## Policy-Aligned Report Reading View

The canonical report contract remains `single_agent_governance_report_preview v1`.
This view does not introduce a new schema, edition, entitlement, legal compliance module, or enforcement surface.

For human-readable reports, existing sections may be grouped into three review views:

1. Authority / Permission Boundary
   - intent_summary
   - authority_summary
   - proposed_action
   - policy_evaluation_preview where available
   - non_enforcement_boundary

2. Execution / Behavior Evidence
   - action_summary
   - evidence_summary
   - artifact_provenance
   - procedural_receipt_summary
   - receipt_refs
   - deterministic_hash
   - lineage_summary
   - transition_summary

3. Risk / Drift / Maturity Signals
   - risk_summary
   - drift_summary
   - admissibility_summary
   - guardrail_mapping_summary
   - review_posture
   - findings
   - missing evidence

This grouping is a report-reading view only.
It does not create a China compliance checker, maturity certification, legal compliance claim, policy engine, runtime control plane, approval mechanism, safe-to-merge claim, or safe-to-deploy claim.

## 6. Affected Future Surfaces

- human-readable report
- demo walkthrough
- edition copy candidate
- report reading guide
- enterprise adoption material

This PR does not edit those surfaces.

## 7. Acceptance Criteria

- `single_agent_governance_report_preview v1` remains unchanged
- no schema changes
- no fixture changes
- no verifier changes
- no CLI changes
- no edition entitlement changes
- no public commercial surface changes
- no policy compliance checker claim
- no legal compliance claim
- no certification claim
- no approval / blocking / safe-to-merge / safe-to-deploy claim
- three-layer view uses only existing report sections
- view remains recommendation-only, additive-only, non-executing, default-off
- no authority expansion
- no control-plane drift

## 8. Prohibited Changes

- changing canonical report contract
- adding policy checker
- adding China compliance module
- adding legal compliance module
- adding maturity certification
- adding policy engine
- adding runtime control plane
- adding approval / block semantics
- adding safe-to-merge / safe-to-deploy semantics
- changing CLI behavior
- changing schemas / fixtures / verifiers
- changing entitlement / pricing / License Hub
- changing README / current docs / public demos / release notes / mindforge.run

## 9. Recommended Next Decision

Allowed values:

- hold_policy_reading_view
- prepare_report_reading_guide
- prepare_edition_copy_candidates

Recommended:

- prepare_report_reading_guide

This only authorizes a future planning or draft document for report reading guidance.
It does not authorize public commercial surface edits, canonical contract changes, CLI changes, schema changes, entitlement changes, or compliance claims.
