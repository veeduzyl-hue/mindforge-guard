import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_VERSION,
} from "./governanceCaseReviewDecisionAttestationExplanationProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_STABILITY =
  "stable";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_CONSUMER_TIER =
  "governance_case_review_decision_attestation_explanation_surface";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_ARTIFACT_ORDER =
  Object.freeze(["governance_case_review_decision_attestation_explanation"]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_META_EXPORTS =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_STABILITY",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_CONSUMER_TIER",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_ARTIFACT_ORDER",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_META_EXPORTS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_STABLE_EXPORT_SET",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP",
    "getGovernanceCaseReviewDecisionAttestationExplanationSurfaceEntry",
    "listGovernanceCaseReviewDecisionAttestationExplanationSurfaceEntries",
    "exportGovernanceCaseReviewDecisionAttestationExplanationSurface",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([
    ...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_META_EXPORTS,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP =
  Object.freeze({
    governance_case_review_decision_attestation_explanation: Object.freeze({
      artifact_id: "governance_case_review_decision_attestation_explanation",
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_CONSUMER_SURFACE,
      contract: Object.freeze({
        kind:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_KIND,
        version:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_VERSION,
        schema_id:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_SCHEMA_ID,
        stage:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_STAGE,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_BOUNDARY,
      }),
      derived_only: true,
      supporting_artifact_only: true,
      non_authoritative: true,
      additive_only: true,
      default_off: true,
      aggregate_export_only: true,
      permit_aggregate_export_only: true,
      attestation_required: true,
      explanation_bounded: true,
      permit_lane_consumption: false,
      judgment_source_enabled: false,
      authority_source_enabled: false,
      execution_binding_enabled: false,
      risk_source_enabled: false,
      audit_path_dependency: false,
      main_path_takeover: false,
      governance_object_addition: false,
      ui_control_plane: false,
      executing: false,
    }),
  });

export function getGovernanceCaseReviewDecisionAttestationExplanationSurfaceEntry(
  artifactId
) {
  return (
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP[
      artifactId
    ] ?? null
  );
}

export function listGovernanceCaseReviewDecisionAttestationExplanationSurfaceEntries() {
  return GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) =>
      getGovernanceCaseReviewDecisionAttestationExplanationSurfaceEntry(
        artifactId
      )
  );
}

export function exportGovernanceCaseReviewDecisionAttestationExplanationSurface() {
  return GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP;
}
