import {
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_VERSION,
} from "./governanceCaseReviewDecisionApplicabilityProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_STABILITY =
  "stable";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_CONSUMER_TIER =
  "governance_case_review_decision_applicability_surface";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_ARTIFACT_ORDER =
  Object.freeze(["governance_case_review_decision_applicability"]);
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_META_EXPORTS =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_STABILITY",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_CONSUMER_TIER",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_ARTIFACT_ORDER",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_META_EXPORTS",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_STABLE_EXPORT_SET",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP",
    "getGovernanceCaseReviewDecisionApplicabilitySurfaceEntry",
    "listGovernanceCaseReviewDecisionApplicabilitySurfaceEntries",
    "exportGovernanceCaseReviewDecisionApplicabilitySurface",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([
    ...GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_META_EXPORTS,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP =
  Object.freeze({
    governance_case_review_decision_applicability: Object.freeze({
      artifact_id: "governance_case_review_decision_applicability",
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONSUMER_SURFACE,
      contract: Object.freeze({
        kind: GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_KIND,
        version: GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_VERSION,
        schema_id: GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_SCHEMA_ID,
        stage: GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_STAGE,
        boundary: GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_BOUNDARY,
      }),
      supporting_artifact_only: true,
      recommendation_only: true,
      additive_only: true,
      default_off: true,
      current_selection_required: true,
      applicability_bounded: true,
      judgment_source_enabled: false,
      authority_source_enabled: false,
      audit_path_dependency: false,
      main_path_takeover: false,
      executing: false,
    }),
  });

export function getGovernanceCaseReviewDecisionApplicabilitySurfaceEntry(
  artifactId
) {
  return (
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP[artifactId] ??
    null
  );
}

export function listGovernanceCaseReviewDecisionApplicabilitySurfaceEntries() {
  return GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) =>
      getGovernanceCaseReviewDecisionApplicabilitySurfaceEntry(artifactId)
  );
}

export function exportGovernanceCaseReviewDecisionApplicabilitySurface() {
  return GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP;
}
