import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SURFACE_MAP,
} = permitExports;

await import("./verify_governance_case_review_decision_attestation_closure_explanation_hardening.mjs");

const explanationSurface =
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SURFACE_MAP
    .governance_case_review_decision_attestation_closure_explanation;

if (!explanationSurface) {
  throw new Error(
    "review decision attestation closure explanation final acceptance missing export surface"
  );
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_STAGE !==
  "governance_case_review_decision_attestation_closure_explanation_boundary_phase1_v6_6_0"
) {
  throw new Error(
    "review decision attestation closure explanation final acceptance stage drifted"
  );
}

for (const exportName of [
  ...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STABLE_EXPORT_SET,
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_VERSION",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_BOUNDARY",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SURFACE_MAP",
  "buildGovernanceCaseReviewDecisionAttestationClosureExplanationContract",
  "consumeGovernanceCaseReviewDecisionAttestationClosureExplanation",
  "exportGovernanceCaseReviewDecisionAttestationClosureExplanationSurface",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision attestation closure explanation final acceptance export missing: ${exportName}`
    );
  }
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_KIND !==
    "governance_case_review_decision_attestation_closure_explanation_contract" ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_VERSION !==
    "v1" ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_BOUNDARY !==
    "bounded_governance_case_review_decision_attestation_closure_explanation_contract"
) {
  throw new Error(
    "review decision attestation closure explanation final acceptance contract envelope drifted"
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
  "closure_required",
  "explanation_bounded",
  "current_explanation_selected_only",
  "unique_current_explanation_required",
  "current_explanation_selection_stable",
  "unique_current_closure_required",
  "current_closure_selection_stable",
  "closure_validity_basis_required",
  "closure_selection_alignment_required",
  "attestation_selection_alignment_required",
  "applicability_alignment_required",
  "applicability_explanation_alignment_required",
  "continuity_lineage_alignment_required",
  "complete_supporting_linkage_required",
  "consumption_boundary_bounded",
]) {
  if (explanationSurface[field] !== true) {
    throw new Error(
      `review decision attestation closure explanation final acceptance surface drifted: ${field}`
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
  if (explanationSurface[field] !== false) {
    throw new Error(
      `review decision attestation closure explanation final acceptance surface drifted: ${field}`
    );
  }
}

process.stdout.write(
  "governance case review decision attestation closure explanation final acceptance verified\n"
);
