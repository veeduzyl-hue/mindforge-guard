import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP,
} = permitExports;

await import("./verify_governance_case_review_decision_attestation_boundary.mjs");

const attestationSurface =
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP
    .governance_case_review_decision_attestation;

if (!attestationSurface) {
  throw new Error("review decision attestation final acceptance missing export surface");
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_STAGE !==
  "governance_case_review_decision_attestation_hardening_phase2_v6_1_0"
) {
  throw new Error("review decision attestation final acceptance stage drifted");
}

for (const exportName of [
  ...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STABLE_EXPORT_SET,
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_VERSION",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_BOUNDARY",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP",
  "buildGovernanceCaseReviewDecisionAttestationContract",
  "consumeGovernanceCaseReviewDecisionAttestation",
  "exportGovernanceCaseReviewDecisionAttestationSurface",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision attestation final acceptance export missing: ${exportName}`
    );
  }
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_KIND !==
    "governance_case_review_decision_attestation_contract" ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_VERSION !== "v1" ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_BOUNDARY !==
    "bounded_governance_case_review_decision_attestation_contract"
) {
  throw new Error("review decision attestation final acceptance contract envelope drifted");
}

for (const field of [
  "derived_only",
  "supporting_artifact_only",
  "recommendation_only",
  "additive_only",
  "default_off",
  "aggregate_export_only",
  "permit_aggregate_export_only",
  "current_selection_required",
  "selection_receipt_required",
  "selection_explanation_required",
  "applicability_required",
  "applicability_explanation_required",
  "continuity_grounded",
  "supersession_grounded",
]) {
  if (attestationSurface[field] !== true) {
    throw new Error(
      `review decision attestation final acceptance surface drifted: ${field}`
    );
  }
}

for (const field of [
  "judgment_source_enabled",
  "authority_source_enabled",
  "execution_binding_enabled",
  "risk_source_enabled",
  "permit_lane_consumption",
  "audit_path_dependency",
  "main_path_takeover",
  "governance_object_addition",
  "ui_control_plane",
  "executing",
]) {
  if (attestationSurface[field] !== false) {
    throw new Error(
      `review decision attestation final acceptance surface drifted: ${field}`
    );
  }
}

process.stdout.write(
  "governance case review decision attestation final acceptance verified\n"
);
