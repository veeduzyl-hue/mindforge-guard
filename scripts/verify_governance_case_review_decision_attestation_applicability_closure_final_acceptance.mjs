import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SURFACE_MAP,
} = permitExports;

await import("./verify_governance_case_review_decision_attestation_applicability_closure_hardening.mjs");

const closureSurface =
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SURFACE_MAP
    .governance_case_review_decision_attestation_applicability_closure;

if (!closureSurface) {
  throw new Error(
    "review decision attestation applicability closure final acceptance missing export surface"
  );
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_STAGE !==
  "governance_case_review_decision_attestation_applicability_closure_boundary_phase1_v6_5_0"
) {
  throw new Error(
    "review decision attestation applicability closure final acceptance stage drifted"
  );
}

for (const exportName of [
  ...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STABLE_EXPORT_SET,
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_VERSION",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_BOUNDARY",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SURFACE_MAP",
  "buildGovernanceCaseReviewDecisionAttestationApplicabilityClosureContract",
  "consumeGovernanceCaseReviewDecisionAttestationApplicabilityClosure",
  "exportGovernanceCaseReviewDecisionAttestationApplicabilityClosureSurface",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision attestation applicability closure final acceptance export missing: ${exportName}`
    );
  }
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_KIND !==
    "governance_case_review_decision_attestation_applicability_closure_contract" ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_VERSION !==
    "v1" ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_BOUNDARY !==
    "bounded_governance_case_review_decision_attestation_applicability_closure_contract"
) {
  throw new Error(
    "review decision attestation applicability closure final acceptance contract envelope drifted"
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
  "attestation_required",
  "applicability_required",
  "applicability_explanation_required",
  "closure_bounded",
  "unique_current_attestation_view_required",
  "current_closure_selected_only",
  "unique_current_closure_required",
  "current_closure_selection_stable",
  "applicability_alignment_required",
  "applicability_explanation_alignment_required",
  "attestation_applicability_binding_unambiguous",
  "applicability_explanation_binding_unambiguous",
  "continuity_lineage_alignment_required",
  "continuity_chain_intact_required",
  "complete_supporting_linkage_required",
  "non_authoritative_support_only",
  "closure_linkage_only",
]) {
  if (closureSurface[field] !== true) {
    throw new Error(
      `review decision attestation applicability closure final acceptance surface drifted: ${field}`
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
  "observability_platform_behavior",
  "executing",
]) {
  if (closureSurface[field] !== false) {
    throw new Error(
      `review decision attestation applicability closure final acceptance surface drifted: ${field}`
    );
  }
}

process.stdout.write(
  "governance case review decision attestation applicability closure final acceptance verified\n"
);
