import {
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_VERSION,
} from "./governanceCaseReviewDecisionApplicabilityExplanationProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_STABILITY =
  "stable";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_CONSUMER_TIER =
  "governance_case_review_decision_applicability_explanation_surface";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_ARTIFACT_ORDER =
  Object.freeze(["governance_case_review_decision_applicability_explanation"]);
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_META_EXPORTS =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_STABILITY",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_CONSUMER_TIER",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_ARTIFACT_ORDER",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_META_EXPORTS",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_STABLE_EXPORT_SET",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_MAP",
    "getGovernanceCaseReviewDecisionApplicabilityExplanationSurfaceEntry",
    "listGovernanceCaseReviewDecisionApplicabilityExplanationSurfaceEntries",
    "exportGovernanceCaseReviewDecisionApplicabilityExplanationSurface",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([
    ...GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_META_EXPORTS,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_MAP =
  Object.freeze({
    governance_case_review_decision_applicability_explanation: Object.freeze({
      artifact_id: "governance_case_review_decision_applicability_explanation",
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONSUMER_SURFACE,
      contract: Object.freeze({
        kind:
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_KIND,
        version:
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_VERSION,
        schema_id:
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_SCHEMA_ID,
        stage:
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_STAGE,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_BOUNDARY,
      }),
      supporting_artifact_only: true,
      recommendation_only: true,
      additive_only: true,
      default_off: true,
      current_selection_required: true,
      applicability_required: true,
      explanation_bounded: true,
      judgment_source_enabled: false,
      authority_source_enabled: false,
      audit_path_dependency: false,
      main_path_takeover: false,
      executing: false,
    }),
  });

export function getGovernanceCaseReviewDecisionApplicabilityExplanationSurfaceEntry(
  artifactId
) {
  return (
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_MAP[
      artifactId
    ] ?? null
  );
}

export function listGovernanceCaseReviewDecisionApplicabilityExplanationSurfaceEntries() {
  return GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) =>
      getGovernanceCaseReviewDecisionApplicabilityExplanationSurfaceEntry(
        artifactId
      )
  );
}

export function exportGovernanceCaseReviewDecisionApplicabilityExplanationSurface() {
  return GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_SURFACE_MAP;
}
