import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_MAP,
} = permitExports;

await import(
  "./verify_governance_case_review_decision_closure_evidence_package_delivery_bundle_boundary.mjs"
);
await import(
  "./verify_governance_case_review_decision_closure_evidence_package_delivery_bundle_hardening.mjs"
);
await import(
  "./verify_governance_case_review_decision_closure_evidence_package_consumption_summary_final_acceptance.mjs"
);

const bundleSurface =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_MAP
    .governance_case_review_decision_closure_evidence_package_delivery_bundle;

if (!bundleSurface) {
  throw new Error(
    "review decision closure evidence package delivery bundle final acceptance missing export surface"
  );
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_STAGE !==
  "governance_case_review_decision_closure_evidence_package_delivery_bundle_boundary_phase2_v6_10_0"
) {
  throw new Error(
    "review decision closure evidence package delivery bundle final acceptance stage drifted"
  );
}

for (const exportName of [
  ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_STABLE_EXPORT_SET,
  ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_STABLE_EXPORT_SET,
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_VERSION",
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_BOUNDARY",
  "buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleContract",
  "consumeGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundle",
  "exportGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleSurface",
  "buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract",
  "consumeGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummary",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision closure evidence package delivery bundle final acceptance export missing: ${exportName}`
    );
  }
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_KIND !==
    "governance_case_review_decision_closure_evidence_package_delivery_bundle_contract" ||
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_VERSION !==
    "v1" ||
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_BOUNDARY !==
    "bounded_governance_case_review_decision_closure_evidence_package_delivery_bundle_contract"
) {
  throw new Error(
    "review decision closure evidence package delivery bundle final acceptance contract envelope drifted"
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
  "consumption_summary_surface_required",
  "explanation_stabilized_surface_required",
  "delivery_readiness_summary_required",
  "package_available",
  "explanation_available",
  "consumption_summary_available",
  "explanation_stabilized_surface_available",
  "delivery_readiness_summary_available",
  "bundle_ref_alignment_stable",
  "handoff_semantics_stable",
  "bundle_composition_stable",
  "bundle_handoff_readability_consistency_stable",
  "cross_surface_alignment_stable",
  "bundle_composition_bounded",
  "bundle_handoff_surface_bounded",
  "bundle_handoff_readable",
  "bundle_export_stable",
]) {
  if (bundleSurface[field] !== true) {
    throw new Error(
      `review decision closure evidence package delivery bundle final acceptance surface drifted: ${field}`
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
  if (bundleSurface[field] !== false) {
    throw new Error(
      `review decision closure evidence package delivery bundle final acceptance surface drifted: ${field}`
    );
  }
}

process.stdout.write(
  "governance case review decision closure evidence package delivery bundle final acceptance verified\n"
);
