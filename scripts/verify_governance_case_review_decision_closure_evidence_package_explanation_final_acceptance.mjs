import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SURFACE_MAP,
} = permitExports;

await import(
  "./verify_governance_case_review_decision_closure_evidence_package_explanation_boundary.mjs"
);
await import(
  "./verify_governance_case_review_decision_closure_evidence_package_explanation_hardening.mjs"
);
await import(
  "./verify_governance_case_review_decision_closure_evidence_package_boundary.mjs"
);

const explanationSurface =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SURFACE_MAP
    .governance_case_review_decision_closure_evidence_package_explanation;

if (!explanationSurface) {
  throw new Error(
    "review decision closure evidence package explanation final acceptance missing export surface"
  );
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_STAGE !==
  "governance_case_review_decision_closure_evidence_package_explanation_boundary_phase1_v6_8_0"
) {
  throw new Error(
    "review decision closure evidence package explanation final acceptance stage drifted"
  );
}

for (const exportName of [
  ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STABLE_EXPORT_SET,
  ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_STABLE_EXPORT_SET,
  ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SURFACE_STABLE_EXPORT_SET,
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_VERSION",
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_BOUNDARY",
  "buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract",
  "consumeGovernanceCaseReviewDecisionClosureEvidencePackageExplanation",
  "exportGovernanceCaseReviewDecisionClosureEvidencePackageExplanationSurface",
  "buildGovernanceCaseReviewDecisionClosureEvidencePackageContract",
  "consumeGovernanceCaseReviewDecisionClosureEvidencePackage",
  "exportGovernanceCaseReviewDecisionClosureEvidencePackageSurface",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision closure evidence package explanation final acceptance export missing: ${exportName}`
    );
  }
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_KIND !==
    "governance_case_review_decision_closure_evidence_package_explanation_contract" ||
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_VERSION !==
    "v1" ||
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_BOUNDARY !==
    "bounded_governance_case_review_decision_closure_evidence_package_explanation_contract"
) {
  throw new Error(
    "review decision closure evidence package explanation final acceptance contract envelope drifted"
  );
}

for (const field of [
  "derived_only",
  "supporting_artifact_only",
  "non_authoritative",
  "additive_only",
  "non_executing",
  "default_off",
  "aggregate_export_only",
  "permit_aggregate_export_only",
  "package_required",
  "current_narrative_selected_only",
  "unique_current_narrative_required",
  "current_narrative_selection_stable",
  "package_manifest_complete",
  "package_composition_bounded",
  "package_export_stable",
  "package_linkage_only",
  "supporting_evidence_bounded",
  "closure_conclusion_bounded",
  "selection_basis_bounded",
  "explanation_summary_bounded",
  "interpretation_surface_bounded",
  "narrative_sections_complete",
  "narrative_section_alignment_stable",
  "section_artifact_binding_stable",
  "section_consumer_consistency_stable",
  "cross_surface_alignment_stable",
  "consumption_boundary_bounded",
]) {
  if (explanationSurface[field] !== true) {
    throw new Error(
      `review decision closure evidence package explanation final acceptance surface drifted: ${field}`
    );
  }
}

for (const field of [
  "permit_lane_consumption",
  "judgment_source_enabled",
  "authority_source_enabled",
  "execution_binding_enabled",
  "risk_source_enabled",
  "audit_path_dependency",
  "main_path_takeover",
  "governance_authority_object_addition",
  "ui_control_plane",
  "executing",
]) {
  if (explanationSurface[field] !== false) {
    throw new Error(
      `review decision closure evidence package explanation final acceptance surface drifted: ${field}`
    );
  }
}

process.stdout.write(
  "governance case review decision closure evidence package explanation final acceptance verified\n"
);
