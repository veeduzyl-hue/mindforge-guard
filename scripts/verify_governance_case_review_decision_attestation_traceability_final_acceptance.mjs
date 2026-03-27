import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP,
} = permitExports;

await import("./verify_governance_case_review_decision_attestation_traceability_hardening.mjs");

const traceabilitySurface =
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP
    .governance_case_review_decision_attestation_traceability;

if (!traceabilitySurface) {
  throw new Error(
    "review decision attestation traceability final acceptance missing export surface"
  );
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_STAGE !==
  "governance_case_review_decision_attestation_traceability_boundary_phase1_v6_4_0"
) {
  throw new Error(
    "review decision attestation traceability final acceptance stage drifted"
  );
}

for (const exportName of [
  ...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_STABLE_EXPORT_SET,
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_VERSION",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_BOUNDARY",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP",
  "buildGovernanceCaseReviewDecisionAttestationTraceabilityContract",
  "consumeGovernanceCaseReviewDecisionAttestationTraceability",
  "exportGovernanceCaseReviewDecisionAttestationTraceabilitySurface",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision attestation traceability final acceptance export missing: ${exportName}`
    );
  }
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_KIND !==
    "governance_case_review_decision_attestation_traceability_contract" ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_VERSION !==
    "v1" ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_BOUNDARY !==
    "bounded_governance_case_review_decision_attestation_traceability_contract"
) {
  throw new Error(
    "review decision attestation traceability final acceptance contract envelope drifted"
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
  "attestation_explanation_required",
  "attestation_receipt_required",
  "traceability_bounded",
  "unique_current_attestation_view_required",
  "attestation_explanation_alignment_required",
  "attestation_receipt_alignment_required",
  "continuity_chain_intact_required",
  "complete_supporting_linkage_required",
  "linkage_integrity_preserved",
  "non_authoritative_support_only",
  "traceability_basis_support_only",
]) {
  if (traceabilitySurface[field] !== true) {
    throw new Error(
      `review decision attestation traceability final acceptance surface drifted: ${field}`
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
  "attestation_trace_platform",
  "observability_platform_behavior",
  "traceability_platform_behavior",
  "executing",
]) {
  if (traceabilitySurface[field] !== false) {
    throw new Error(
      `review decision attestation traceability final acceptance surface drifted: ${field}`
    );
  }
}

process.stdout.write(
  "governance case review decision attestation traceability final acceptance verified\n"
);
