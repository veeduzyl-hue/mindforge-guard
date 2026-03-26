import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_VERSION,
} from "./governanceCaseReviewDecisionAttestationProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_VERSION = "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_STABILITY =
  "stable";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_CONSUMER_TIER =
  "governance_case_review_decision_attestation_surface";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_ARTIFACT_ORDER =
  Object.freeze(["governance_case_review_decision_attestation"]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_META_EXPORTS =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_STABILITY",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_CONSUMER_TIER",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_ARTIFACT_ORDER",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_META_EXPORTS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_STABLE_EXPORT_SET",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP",
    "getGovernanceCaseReviewDecisionAttestationSurfaceEntry",
    "listGovernanceCaseReviewDecisionAttestationSurfaceEntries",
    "exportGovernanceCaseReviewDecisionAttestationSurface",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_META_EXPORTS]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP =
  Object.freeze({
    governance_case_review_decision_attestation: Object.freeze({
      artifact_id: "governance_case_review_decision_attestation",
      consumer_surface: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONSUMER_SURFACE,
      contract: Object.freeze({
        kind: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_KIND,
        version: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_VERSION,
        schema_id: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_SCHEMA_ID,
        stage: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_STAGE,
        boundary: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_BOUNDARY,
      }),
      derived_only: true,
      supporting_artifact_only: true,
      recommendation_only: true,
      additive_only: true,
      default_off: true,
      current_selection_required: true,
      selection_receipt_required: true,
      selection_explanation_required: true,
      applicability_required: true,
      applicability_explanation_required: true,
      continuity_grounded: true,
      supersession_grounded: true,
      judgment_source_enabled: false,
      authority_source_enabled: false,
      audit_path_dependency: false,
      main_path_takeover: false,
      executing: false,
    }),
  });

export function getGovernanceCaseReviewDecisionAttestationSurfaceEntry(artifactId) {
  return GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP[artifactId] ?? null;
}

export function listGovernanceCaseReviewDecisionAttestationSurfaceEntries() {
  return GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) => getGovernanceCaseReviewDecisionAttestationSurfaceEntry(artifactId)
  );
}

export function exportGovernanceCaseReviewDecisionAttestationSurface() {
  return GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP;
}
