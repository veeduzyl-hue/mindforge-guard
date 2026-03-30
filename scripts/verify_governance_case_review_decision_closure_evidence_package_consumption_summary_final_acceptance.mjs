import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_MAP,
} = permitExports;

await import(
  "./verify_governance_case_review_decision_closure_evidence_package_consumption_summary_boundary.mjs"
);
await import(
  "./verify_governance_case_review_decision_closure_evidence_package_consumption_summary_hardening.mjs"
);
await import(
  "./verify_governance_case_review_decision_closure_evidence_package_explanation_final_acceptance.mjs"
);

const summarySurface =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_MAP
    .governance_case_review_decision_closure_evidence_package_consumption_summary;

if (!summarySurface) {
  throw new Error(
    "review decision closure evidence package consumption summary final acceptance missing export surface"
  );
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_STAGE !==
  "governance_case_review_decision_closure_evidence_package_consumption_summary_boundary_phase2_v6_9_0"
) {
  throw new Error(
    "review decision closure evidence package consumption summary final acceptance stage drifted"
  );
}

for (const exportName of [
  ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_STABLE_EXPORT_SET,
  ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_STABLE_EXPORT_SET,
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_VERSION",
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_BOUNDARY",
  "buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract",
  "consumeGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummary",
  "exportGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummarySurface",
  "buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract",
  "consumeGovernanceCaseReviewDecisionClosureEvidencePackageExplanation",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision closure evidence package consumption summary final acceptance export missing: ${exportName}`
    );
  }
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_KIND !==
    "governance_case_review_decision_closure_evidence_package_consumption_summary_contract" ||
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_VERSION !==
    "v1" ||
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_BOUNDARY !==
    "bounded_governance_case_review_decision_closure_evidence_package_consumption_summary_contract"
) {
  throw new Error(
    "review decision closure evidence package consumption summary final acceptance contract envelope drifted"
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
  "package_surface_required",
  "explanation_surface_required",
  "explanation_stabilized_surface_required",
  "summary_ref_alignment_stable",
  "explanation_stabilized_surface_semantics_stable",
  "current_narrative_selected_only",
  "current_narrative_selection_stable",
  "narrative_section_alignment_stable",
  "section_artifact_binding_stable",
  "section_consumer_consistency_stable",
  "cross_surface_alignment_stable",
  "delivery_readiness_interpretation_stable",
  "delivery_readiness_consumer_consistency_stable",
  "delivery_readiness_summary_bounded",
  "delivery_readiness_readable",
  "consumer_reading_surface_bounded",
  "summary_export_stable",
  "consumption_boundary_bounded",
]) {
  if (summarySurface[field] !== true) {
    throw new Error(
      `review decision closure evidence package consumption summary final acceptance surface drifted: ${field}`
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
  if (summarySurface[field] !== false) {
    throw new Error(
      `review decision closure evidence package consumption summary final acceptance surface drifted: ${field}`
    );
  }
}

process.stdout.write(
  "governance case review decision closure evidence package consumption summary final acceptance verified\n"
);
