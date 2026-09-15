# Version Lineage and Capability Status

## Authority and scope

This is the canonical current product/version taxonomy, reconciled on 2026-09-15 under the owner's documentation-only task and [ADR 0009](../../adr/0009-commercial-baseline-ownership-and-version-dimensions.md). Source reviewed: `dcfc021c4d13d19662fd6cab0191481707dada89`. This document supersedes stale current-state interpretation, not historical evidence. It makes no release or gate decision.

## Version dimensions

```text
TAGGED_RELEASE_LINEAGE = v6.13.0 -> v6.13.1 -> v7.0.0 -> v7.0.1
PREVIOUS_COMMERCIAL_BASELINE = v6.13.1
INTERNAL_PRODUCTIZATION_LINEAGE = v6.14-v6.22
CURRENT_PUBLIC_COMMERCIAL_BASELINE = v7.0.1
INTERNAL_ARCHITECTURE_VALIDATION_LINEAGE = Internal V8
INTERNAL_V8 = unreleased architecture / research / validation
PACKAGE_PUBLICATION_HISTORY_v6_14_TO_v6_22 = NOT_VERIFIED
```

- **TAGGED_RELEASE_LINEAGE** identifies repository release tags in the reconciled interval; it is not the complete all-time tag inventory or independently reconstructed registry history.
- **PREVIOUS_COMMERCIAL_BASELINE** identifies v6.13.1 as the previous commercial baseline and a tagged historical release reference.
- **INTERNAL_PRODUCTIZATION_LINEAGE** identifies mainline engineering/productization versions whose source and deterministic verification assets landed on main, without forming standalone tagged commercial releases.
- **CURRENT_PUBLIC_COMMERCIAL_BASELINE** identifies v7.0.1 as the current public/commercial compatibility and buyer-facing baseline.
- **INTERNAL_ARCHITECTURE_VALIDATION_LINEAGE** identifies Internal V8 research, architecture, implemented internal substrate and bounded validation. Internal V8 != released V8.

v6.14-v6.22 engineering assets exist in mainline and are deterministically verified, but they are not nine standalone tagged current commercial releases.

```text
v6.14-v6.22 engineering lineage != tagged release lineage
source exists != standalone released version
verified mainline != commercial release
```

The former phrase "Historical public stable baseline" is only an `OWNER_DESIGNATED_HISTORICAL_LABEL`, not `INDEPENDENTLY_RECONSTRUCTED_RELEASE_STATE`. Read frozen ADR/Phase A language with that qualification; do not rewrite historical records to modernize it.

## Version and capability matrix

"Verified" below describes retained deterministic verification evidence for the bounded line, not fresh execution of every old suite, real-world correctness, independent assurance, or current publication. A standalone commercial release YES is repository release lineage evidence, not a fresh registry check.

| Version/line | Source mainline | Deterministically verified | Git tag | Standalone commercial release | Current product surface | Status |
|---|---|---|---|---|---|---|
| v6.13.0 | YES | YES, recorded edition-boundary evidence | YES | YES, repository release lineage | Historical commercial edition foundation | TAGGED_HISTORICAL |
| v6.13.1 | YES | YES, recorded install/release verification | YES | YES, repository release lineage | Previous baseline; preserved compatibility foundation | PREVIOUS_COMMERCIAL_BASELINE |
| v6.14-v6.22 | YES | YES, verified mainline with bounded fixtures/acceptance assets | NO | NO based on repository evidence | Selected evidence structures/summaries consolidated in v7; full preview semantics remain internal | MAINLINE_INTERNAL |
| v7.0.0 | YES | YES, recorded bounded report/pack verification | YES | YES, repository release lineage | Single-agent report product consolidation lineage | TAGGED_HISTORICAL |
| v7.0.1 | YES | YES, documented released-baseline verification | YES | YES, repository release lineage | Current bounded CLI, Evidence Pack/report, editions and licensing support | CURRENT_PUBLIC_COMMERCIAL_BASELINE |
| Internal V8 | YES, internal substrate | YES for recorded internal suites; repaired-track completion not implied | NO released V8 tag in local inventory | NO | Unreleased architecture/research/validation; no public V8 promise | INTERNAL_ARCHITECTURE_VALIDATION |

Independent package publication for v6.14-v6.22 is **NOT_VERIFIED**. No tag in the repository is not proof of no npm publication. No independent registry reconstruction was performed by this documentation task.

## v6.14-v6.22 productization disposition

v7.0/v7.0.1 performed **semantic narrowing and product consolidation**. The labels below describe bounded disposition, not one new public feature per engineering version:

- **ABSORBED**: evidence structure or references contribute to the consolidated report; the complete originating preview engine is not implied.
- **REFRAMED**: internal concepts appear as narrower declarations, summaries or human-review context; the original strong interpretation is not a public guarantee.
- **PRESERVED_INTERNAL**: the full preview evaluator/semantic boundary remains an internal engineering asset; a similarly named public summary does not promote it.

| Version | Reconciled capability mapping | v7 disposition | Public meaning and retained limit |
|---|---|---|---|
| v6.14 | Authority / Intent Boundary | REFRAMED | Intent and authority summaries give declared scope and human-review context; no authorization is granted. |
| v6.15 | verification / current-state grounding | REFRAMED | Explainable evidence/current-state context, not independent authority verification. The historical source milestone is named Authority Explain Boundary; the reconciled label does not rename its contracts. |
| v6.16 | grounding / provenance / execution evidence | ABSORBED | Evidence summaries, source references and provenance support traceability; declarations do not prove execution or real-world truth. |
| v6.17 | admissibility / evidence association | REFRAMED | Evidence readiness and `review_posture` support human review; no admission, acceptance or execution decision. |
| v6.18 | authority drift | REFRAMED | A drift summary describes bounded changes and missing evidence; it does not independently prove current authority standing. |
| v6.19 | symbolic guardrail mapping | REFRAMED | Declared actions, data sources and tools provide requirement context; no guardrail enforcement or policy gate. |
| v6.20 | execution-bound transition validity | PRESERVED_INTERNAL | A report transition summary exists; full transition-validity semantics are not promoted to execution permission or proof that preconditions survived. |
| v6.21 | procedural artifact receipt | ABSORBED | Deterministic receipt references support recorded-artifact traceability; no procedural execution, installation or permission grant. |
| v6.22 | procedural lineage trajectory | PRESERVED_INTERNAL | A bounded report lineage summary/hash exists; full trajectory-preview semantics do not become trajectory control, orchestration or approval. |

All complete originating preview evaluators remain bounded internal assets unless a separate released contract establishes otherwise. These are documentation dispositions inferred from the historical mapping and implemented pack-to-report mapper, not a claim of direct imports of every v6 evaluator into v7.

### Evidence for the mapping

- [Historical productization mapping](../../governance/v6_14_to_v6_22_productization_mapping.md) and [internal expansion closeout](../../governance/v6_14_to_v6_22_internal_governance_expansion_closeout.md) preserve original engineering labels and pre-release intent.
- [v7 report PRD](../../productization/v7_0_single_agent_governance_report_prd.md) records the original absorption boundary and candidate section mapping. Planning alone is not release evidence.
- [Implemented pack-to-report mapper](../../../packages/guard/src/productization/single_agent_report_preview_mapper.mjs) supplies the bounded summaries, receipt references and explicit non-enforcement fields. Its file exists at v7.0.1 and is unchanged against that tag at the reviewed source snapshot.
- [Current first-report guide](./first-governance-report.md) defines the public pack/report preview path. Later internal [GovernanceReportModel](../../../packages/guard-core/src/reportModel.ts) substrate must not be silently equated with that released CLI contract.

### Mainline and deterministic verification references

The following accepted commits are in local `main` history. The linked scripts and acceptance records are retained engineering evidence; their version numbers do not create tags or independently establish package publication.

| Version | Mainline evidence commit | Deterministic verification asset |
|---|---|---|
| v6.14 | `a40d7ac` | [Authority preview acceptance](../../../scripts/verify_v6_14_authority_preview_acceptance.mjs) |
| v6.15 | `278a392` | [Authority explain final acceptance](../../../scripts/verify_v6_15_authority_explain_final_acceptance.mjs) |
| v6.16 | `df16e19` | [Grounding explain final acceptance](../../../scripts/verify_v6_16_grounding_explain_final_acceptance.mjs) |
| v6.17 | `1edf75d` | [Admissibility explain final acceptance](../../../scripts/verify_v6_17_admissibility_explain_final_acceptance.mjs) |
| v6.18 | `5b90115` | [Authority drift final acceptance](../../../scripts/verify_v6_18_authority_drift_final_acceptance.mjs) |
| v6.19 | `37d6062` | [Symbolic guardrail final acceptance](../../../scripts/verify_v6_19_symbolic_guardrail_mapping_final_acceptance.mjs) |
| v6.20 | `59ffe0b` | [Transition validity final acceptance](../../../scripts/verify_v6_20_transition_validity_final_acceptance.mjs) |
| v6.21 | `b2ac53e` | [Procedural receipt final acceptance](../../../scripts/verify_v6_21_procedural_artifact_patch_receipt_final_acceptance.mjs) |
| v6.22 | `2149388` | [Procedural trajectory final acceptance](../../../scripts/verify_v6_22_procedural_lineage_trajectory_final_acceptance.mjs) |

Local tag refs observed: v6.13.0 `61019a8f24bde6fc305c8255c012cf02193aeff1`; v6.13.1 `bf80e08c33737c84b6193dd6be53cde5146cf442`; v7.0.0 `5c36439bd686a9a037218c79b628513f7b278f36`; v7.0.1 `698cf0b5f8886491d34b2aeb38d7bb2d033b759c`. These are local ref values, not registry receipts. No v6.14-v6.22 release tags occur in the inspected local inventory.

Additional verification/release context: [release index](../../../RELEASE.md), [verification guide](../../VERIFY.md), [v6.13 edition evidence](../../archive/status/STATUS_v6.13_commercial_edition_boundary_completion.md), and [v7.0.1 entrypoint hotfix record](../../release/v7_0_1_cli_entrypoint_hotfix.md). Historical results remain unchanged.

## Current capability maturity

```text
CURRENT_PUBLIC_COMMERCIAL_BASELINE = v7.0.1
EAK = PROTOTYPE_VALIDATION_ONLY
MESR = ACTIVE_RESEARCH + IMPLEMENTED_INTERNAL_SUBSTRATE
Harness = NOT_CANONICALLY_INTEGRATED
Internal V8 = UNRELEASED ARCHITECTURE / VALIDATION
```

The [V8-000 source reconciliation](../../planning/13_V8_000_SOURCE_RECONCILIATION.md) documents internal EAK/MESR substrate and Harness compatibility gaps. Ingestion fixtures or adapter spikes do not prove canonical Harness integration. A standalone repository copy titled "MindForge Guard - Current Product Capability Baseline" was not found; the existing [commercial product overview](../current-product-baseline.md) and [edition capability table](../capability-baseline.md) are different documents. Their packaging content is preserved; this page supplies the reconciled version model and internal maturity boundary.

## Historical evidence and gate boundary

Historical release records, candidate bodies, Experiment 2B, V8-000, Phase A/B, prior validation results and tags remain evidence of their original snapshots. In particular, frozen references to v6.13.1 as then-current are valid in that context. The [v7 release notes candidate](../../release/v7_0_release_notes_candidate.md) carries a bounded `HISTORICAL_CANDIDATE_STATE` header; its original sentence and body remain intact. Other explicitly marked planning/candidate/acceptance records are not rewritten.

This documentation reconciliation does not open Gate 1, begin B09/B10, decide release readiness, publish packages, create/change tags or authorize execution. Gate-state evidence remains in the existing gate decisions; this page does not reinterpret their PASS results as implementation admission.

## Compatibility review

Audit output / verdict / exit and deny exit code 25 unchanged; permit and classify unchanged. Recommendation-only, additive-only, non-executing, default-off where applicable, no authority scope expansion and no control-plane drift are preserved. EvidencePackV1, schemas, reason-code behavior, GovernanceReportModel behavior, MESR/EAK implementation and Harness implementation are unchanged. CLI/JSON contracts, licensing/offline authority, install instructions and demo paths are unchanged.

## Consistency audit (pre-edit snapshot)

Scope: Markdown documentation/instructions returned by `rg` across the repository, including hidden instruction directories and excluding `.git` and dependency directories. The search `current commercial baseline|stable commercial baseline|v6\.13|v7\.0\.1` (case-insensitive) produced **239 hits** before edits at the source snapshot above. The following inventory classifies every hit; line numbers refer to that pre-edit snapshot, not the edited files. This is a documentation audit, not new release evidence.

| Classification | Pre-edit hits | Disposition |
|---|---|---|
| CURRENT_CORRECT | 71 | Preserved; current baseline page gains a taxonomy link. |
| HISTORICAL_CORRECT | 109 | Preserved as evidence of its original context. |
| STALE_CURRENT_WORDING | 7 | Corrected in AGENTS, the commercial-baseline skill and ADR 0009. |
| PLANNING_ONLY | 44 | Preserved as planning; no release authority. |
| CANDIDATE_ONLY | 8 | Preserved; only the named release-notes candidate gains a historical header. |

Remaining stale current-baseline wording after correction: **0 locations in this audited scope**. Historical old-version declarations listed below remain intentionally unchanged. The pinned v6.13 demo is a historical expected-output example; its commands and demo paths are preserved. Frozen V8-000/Phase A/B references to conflicting guidance describe their earlier snapshots, not an unresolved claim about the newly corrected current guidance.

| File | Pre-edit matching lines | Classification |
|---|---|---|
| `.agents/skills/guard-commercial-baseline-keeper/SKILL.md` | 50, 131 | CURRENT_CORRECT |
| `.agents/skills/guard-commercial-baseline-keeper/SKILL.md` | 3, 54 | STALE_CURRENT_WORDING |
| `AGENTS.md` | 34, 37 | STALE_CURRENT_WORDING |
| `README.md` | 7, 89, 181, 191 | CURRENT_CORRECT |
| `RELEASE.md` | 13, 47, 60, 65 | CURRENT_CORRECT |
| `RELEASE.md` | 51, 53 | HISTORICAL_CORRECT |
| `docs/VERIFY.md` | 5, 12, 39, 111, 132, 166, 198, 208, 230, 232, 248, 250, 260, 266, 268, 278, 280, 283, 285, 297, 299, 304, 309, 316, 318, 326 | CURRENT_CORRECT |
| `docs/VERIFY.md` | 17, 59, 61 | HISTORICAL_CORRECT |
| `docs/adr/0001-guard-first.md` | 27 | HISTORICAL_CORRECT |
| `docs/adr/0009-commercial-baseline-ownership-and-version-dimensions.md` | 13 | CURRENT_CORRECT |
| `docs/adr/0009-commercial-baseline-ownership-and-version-dimensions.md` | 11, 12, 27 | STALE_CURRENT_WORDING |
| `docs/architecture/evidence-assurance-kernel-v0.1.md` | 27, 317 | PLANNING_ONLY |
| `docs/archive/status/STATUS_v6.13_commercial_edition_boundary_completion.md` | 1 | HISTORICAL_CORRECT |
| `docs/commercial/v7_0_1_single_agent_governance_positioning.md` | 1, 5 | CURRENT_CORRECT |
| `docs/commercial/v7_0_download_to_first_report_ux.md` | 1, 5 | PLANNING_ONLY |
| `docs/commercial/v7_0_license_hub_copy_candidate.md` | 1 | CANDIDATE_ONLY |
| `docs/commercial/v7_0_mindforge_run_copy_candidate.md` | 1 | CANDIDATE_ONLY |
| `docs/commercial/v7_0_mindforge_run_implementation_pack.md` | 1, 163, 204 | CURRENT_CORRECT |
| `docs/demos/DEMO_A_AI_CODING_GOVERNANCE.md` | 61 | HISTORICAL_CORRECT |
| `docs/demos/current/README.md` | 5 | CURRENT_CORRECT |
| `docs/evidence-contract-v1.md` | 210, 212, 214 | CURRENT_CORRECT |
| `docs/external-evidence-assurance-service-gap-assessment-v0.1.md` | 689 | PLANNING_ONLY |
| `docs/governance-report-model.md` | 168 | CURRENT_CORRECT |
| `docs/governance/v6_14_to_v6_22_internal_governance_expansion_closeout.md` | 12, 68, 90 | HISTORICAL_CORRECT |
| `docs/governance/v6_14_to_v6_22_productization_mapping.md` | 70, 98 | PLANNING_ONLY |
| `docs/governance/v6_15_authority_explain_final_acceptance.md` | 45 | HISTORICAL_CORRECT |
| `docs/governance/v6_16_grounding_explain_final_acceptance.md` | 8, 120 | HISTORICAL_CORRECT |
| `docs/governance/v6_17_admissibility_explain_final_acceptance.md` | 8 | HISTORICAL_CORRECT |
| `docs/governance/v6_18_authority_drift_boundary.md` | 8 | HISTORICAL_CORRECT |
| `docs/governance/v6_18_authority_drift_final_acceptance.md` | 8, 83 | HISTORICAL_CORRECT |
| `docs/governance/v6_18_authority_drift_preview_acceptance.md` | 8 | HISTORICAL_CORRECT |
| `docs/governance/v6_19_symbolic_guardrail_mapping_boundary.md` | 10 | HISTORICAL_CORRECT |
| `docs/governance/v6_19_symbolic_guardrail_mapping_final_acceptance.md` | 101 | HISTORICAL_CORRECT |
| `docs/governance/v6_20_execution_bound_transition_validity_boundary.md` | 10 | HISTORICAL_CORRECT |
| `docs/governance/v6_20_execution_bound_transition_validity_final_acceptance.md` | 107 | HISTORICAL_CORRECT |
| `docs/governance/v6_20_execution_bound_transition_validity_scope_card.md` | 98 | HISTORICAL_CORRECT |
| `docs/governance/v6_21_procedural_artifact_patch_receipt_boundary.md` | 10 | HISTORICAL_CORRECT |
| `docs/governance/v6_21_procedural_artifact_patch_receipt_final_acceptance.md` | 153 | HISTORICAL_CORRECT |
| `docs/governance/v6_21_procedural_artifact_patch_receipt_scope_card.md` | 115 | HISTORICAL_CORRECT |
| `docs/governance/v6_22_procedural_lineage_trajectory_boundary.md` | 10 | HISTORICAL_CORRECT |
| `docs/governance/v6_22_procedural_lineage_trajectory_final_acceptance.md` | 160 | HISTORICAL_CORRECT |
| `docs/governance/v6_22_procedural_lineage_trajectory_scope_card.md` | 127 | HISTORICAL_CORRECT |
| `docs/governance/v7_0_commercial_release_gate_review.md` | 18, 67 | HISTORICAL_CORRECT |
| `docs/governance/v7_0_e2e_acceptance.md` | 36 | HISTORICAL_CORRECT |
| `docs/governance/v7_0_single_agent_governance_report_cli_preview_acceptance.md` | 105 | HISTORICAL_CORRECT |
| `docs/governance/v7_0_single_agent_governance_report_preview_acceptance.md` | 34 | HISTORICAL_CORRECT |
| `docs/html-renderer.md` | 86 | CURRENT_CORRECT |
| `docs/markdown-renderer.md` | 89 | CURRENT_CORRECT |
| `docs/mesr/07_IMPLEMENTATION_RECONCILIATION_MATRIX.md` | 17417, 17424, 17431, 17438, 20798, 20799, 20805, 20893, 21063, 21080, 21084 | HISTORICAL_CORRECT |
| `docs/non-goals.md` | 7, 38, 44 | CURRENT_CORRECT |
| `docs/planning/13_V8_000_SOURCE_RECONCILIATION.md` | 203, 204, 210 | HISTORICAL_CORRECT |
| `docs/planning/14_SOURCE_RECONCILED_GATE1_BACKLOG.md` | 13 | HISTORICAL_CORRECT |
| `docs/planning/15_GATE1_READINESS_DECISION.md` | 53, 70, 74 | HISTORICAL_CORRECT |
| `docs/planning/16_GATE1_BLOCKER_CLOSURE_PHASE_A_DECISION.md` | 70 | HISTORICAL_CORRECT |
| `docs/product-boundary.md` | 8, 61 | CURRENT_CORRECT |
| `docs/product/current-product-baseline.md` | 1 | CURRENT_CORRECT |
| `docs/product/current/commercial-baseline-v6.13.md` | 5, 14 | CURRENT_CORRECT |
| `docs/product/current/commercial-baseline-v6.13.md` | 1 | HISTORICAL_CORRECT |
| `docs/product/current/edition-value-map.md` | 5, 7, 85 | CURRENT_CORRECT |
| `docs/product/current/marketplace-action-feasibility.md` | 16 | HISTORICAL_CORRECT |
| `docs/product/current/marketplace-action-feasibility.md` | 129 | PLANNING_ONLY |
| `docs/product/current/security-review-packet-v1.md` | 3 | CURRENT_CORRECT |
| `docs/product/current/trust-faq.md` | 5, 7, 95, 109 | CURRENT_CORRECT |
| `docs/product/current/v7_0_1_commercial_baseline.md` | 1, 3 | CURRENT_CORRECT |
| `docs/product/current/v7_0_first_report.md` | 7 | CURRENT_CORRECT |
| `docs/product/next/v6.14-authority-intent-boundary.md` | 7, 143, 313, 314, 417, 499, 524 | PLANNING_ONLY |
| `docs/product/release-baseline-post-v6.13.md` | 1, 7, 8, 9, 13 | HISTORICAL_CORRECT |
| `docs/product/roadmap/guard-vnext-boundary-framework.md` | 5, 9, 89, 93, 95 | PLANNING_ONLY |
| `docs/product/roadmap/v6.14-authority-boundary-pr-plan.md` | 7, 24, 81, 168 | PLANNING_ONLY |
| `docs/productization/v7_0_cli_pack_validate_plan.md` | 196 | PLANNING_ONLY |
| `docs/productization/v7_0_commercial_release_gate_review.md` | 9, 89 | PLANNING_ONLY |
| `docs/productization/v7_0_commercial_surface_preparation_plan.md` | 7, 9 | PLANNING_ONLY |
| `docs/productization/v7_0_external_commercial_messaging_draft.md` | 7, 9 | CANDIDATE_ONLY |
| `docs/productization/v7_0_public_commercial_surface_candidate.md` | 22 | CANDIDATE_ONLY |
| `docs/productization/v7_0_report_edition_projection_plan.md` | 11, 13 | PLANNING_ONLY |
| `docs/productization/v7_0_report_single_agent_preview_plan.md` | 231 | PLANNING_ONLY |
| `docs/productization/v7_0_single_agent_governance_report_prd.md` | 8, 10, 88, 649 | PLANNING_ONLY |
| `docs/reason-codes.md` | 150 | CURRENT_CORRECT |
| `docs/release/v7_0_1_cli_entrypoint_hotfix.md` | 1, 6 | HISTORICAL_CORRECT |
| `docs/release/v7_0_1_legacy_verifier_authority_closure.md` | 1, 15, 19, 25, 34, 45, 72 | HISTORICAL_CORRECT |
| `docs/release/v7_0_1_verification_drift_disposition.md` | 1, 15, 16, 23, 32, 55, 56, 57, 58, 71, 81, 96, 106, 165, 219, 220, 222, 223, 226, 227, 229, 230, 234, 235, 243, 244, 245, 247, 251 | HISTORICAL_CORRECT |
| `docs/release/v7_0_final_main_verification_decision.md` | 16 | HISTORICAL_CORRECT |
| `docs/release/v7_0_final_tag_package_approval_packet.md` | 9 | HISTORICAL_CORRECT |
| `docs/release/v7_0_github_release_candidate.md` | 9 | CANDIDATE_ONLY |
| `docs/release/v7_0_release_notes_candidate.md` | 8 | CANDIDATE_ONLY |
| `docs/release/v7_0_version_tag_package_publish_readiness.md` | 9 | CANDIDATE_ONLY |
| `docs/schema-compatibility-matrix.md` | 133 | CURRENT_CORRECT |
| `docs/strategy/mindforge-guard-next-strategic-directions-assessment-v0.1.md` | 45, 54, 552, 649, 712, 724 | PLANNING_ONLY |
| `docs/strategy/v8-semantic-foundation-plan-v0.1.md` | 264 | HISTORICAL_CORRECT |
| `docs/strategy/v8-semantic-foundation-plan-v0.1.md` | 195, 223 | PLANNING_ONLY |
| `docs/validation/v8-gate-2-formal-closure-audit-v0.1.md` | 212 | HISTORICAL_CORRECT |
| `docs/validation/v8-gate-2-semantic-portability-closure-v0.1.md` | 186 | HISTORICAL_CORRECT |
| `docs/validation/v8-phase-2d-e3-a2-grounded-external-vocabulary-crosswalk-v0.1.md` | 134, 154, 157 | HISTORICAL_CORRECT |
| `docs/validation/v8-phase-3a-institutional-artifact-readiness-v0.1.md` | 81, 97 | HISTORICAL_CORRECT |
| `packages/guard/README.md` | 58 | CURRENT_CORRECT |
