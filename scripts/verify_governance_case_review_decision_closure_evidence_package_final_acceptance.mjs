import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SURFACE_MAP,
} = permitExports;

await import("./verify_governance_case_review_decision_closure_evidence_package_boundary.mjs");

const packageSurface =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SURFACE_MAP
    .governance_case_review_decision_closure_evidence_package;

if (!packageSurface) {
  throw new Error(
    "review decision closure evidence package final acceptance missing export surface"
  );
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_STAGE !==
  "governance_case_review_decision_closure_evidence_package_boundary_phase2_v6_7_0"
) {
  throw new Error(
    "review decision closure evidence package final acceptance stage drifted"
  );
}

for (const exportName of [
  ...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_STABLE_EXPORT_SET,
  ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STABLE_EXPORT_SET,
  ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SURFACE_STABLE_EXPORT_SET,
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_VERSION",
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_BOUNDARY",
  "buildGovernanceCaseReviewDecisionClosureEvidencePackageContract",
  "consumeGovernanceCaseReviewDecisionClosureEvidencePackage",
  "exportGovernanceCaseReviewDecisionClosureEvidencePackageSurface",
  "buildGovernanceCaseReviewDecisionAttestationClosureReceiptContract",
  "consumeGovernanceCaseReviewDecisionAttestationClosureReceipt",
  "exportGovernanceCaseReviewDecisionAttestationClosureReceiptSurface",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision closure evidence package final acceptance export missing: ${exportName}`
    );
  }
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_KIND !==
    "governance_case_review_decision_closure_evidence_package_contract" ||
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_VERSION !==
    "v1" ||
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_BOUNDARY !==
    "bounded_governance_case_review_decision_closure_evidence_package_contract"
) {
  throw new Error(
    "review decision closure evidence package final acceptance contract envelope drifted"
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
  "receipt_required",
  "closure_required",
  "closure_explanation_required",
  "package_manifest_complete",
  "package_composition_bounded",
  "package_export_stable",
  "package_linkage_only",
  "consumption_boundary_bounded",
]) {
  if (packageSurface[field] !== true) {
    throw new Error(
      `review decision closure evidence package final acceptance surface drifted: ${field}`
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
  "governance_object_addition",
  "ui_control_plane",
  "executing",
]) {
  if (packageSurface[field] !== false) {
    throw new Error(
      `review decision closure evidence package final acceptance surface drifted: ${field}`
    );
  }
}

process.stdout.write(
  "governance case review decision closure evidence package final acceptance verified\n"
);
