import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_VERSION,
} from "./governanceCaseReviewDecisionAttestationTraceabilityProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_STABILITY =
  "stable";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_CONSUMER_TIER =
  "governance_case_review_decision_attestation_traceability_surface";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_ARTIFACT_ORDER =
  Object.freeze(["governance_case_review_decision_attestation_traceability"]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_META_EXPORTS =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_STABILITY",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_CONSUMER_TIER",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_ARTIFACT_ORDER",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_META_EXPORTS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_STABLE_EXPORT_SET",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP",
    "getGovernanceCaseReviewDecisionAttestationTraceabilitySurfaceEntry",
    "listGovernanceCaseReviewDecisionAttestationTraceabilitySurfaceEntries",
    "exportGovernanceCaseReviewDecisionAttestationTraceabilitySurface",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([
    ...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_META_EXPORTS,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP =
  Object.freeze({
    governance_case_review_decision_attestation_traceability: Object.freeze({
      artifact_id: "governance_case_review_decision_attestation_traceability",
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONSUMER_SURFACE,
      contract: Object.freeze({
        kind:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_KIND,
        version:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_VERSION,
        schema_id:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_SCHEMA_ID,
        stage:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_STAGE,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_BOUNDARY,
      }),
      derived_only: true,
      supporting_artifact_only: true,
      non_authoritative: true,
      recommendation_only: true,
      additive_only: true,
      non_executing: true,
      default_off: true,
      aggregate_export_only: true,
      permit_aggregate_export_only: true,
      attestation_required: true,
      attestation_explanation_required: true,
      attestation_receipt_required: true,
      traceability_bounded: true,
      unique_current_attestation_view_required: true,
      attestation_explanation_alignment_required: true,
      attestation_receipt_alignment_required: true,
      continuity_chain_intact_required: true,
      complete_supporting_linkage_required: true,
      linkage_integrity_preserved: true,
      non_authoritative_support_only: true,
      traceability_basis_support_only: true,
      permit_lane_consumption: false,
      judgment_source_enabled: false,
      authority_source_enabled: false,
      execution_binding_enabled: false,
      risk_source_enabled: false,
      audit_path_dependency: false,
      main_path_takeover: false,
      governance_object_addition: false,
      ui_control_plane: false,
      attestation_trace_platform: false,
      observability_platform_behavior: false,
      traceability_platform_behavior: false,
      executing: false,
    }),
  });

export function getGovernanceCaseReviewDecisionAttestationTraceabilitySurfaceEntry(
  artifactId
) {
  return (
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP[
      artifactId
    ] ?? null
  );
}

export function listGovernanceCaseReviewDecisionAttestationTraceabilitySurfaceEntries() {
  return GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) =>
      getGovernanceCaseReviewDecisionAttestationTraceabilitySurfaceEntry(
        artifactId
      )
  );
}

export function exportGovernanceCaseReviewDecisionAttestationTraceabilitySurface() {
  return GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP;
}
