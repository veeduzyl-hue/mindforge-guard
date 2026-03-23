import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_VERSION,
} from "./governanceCaseReviewDecisionSelectionReceiptProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_STABILITY =
  "stable";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_CONSUMER_TIER =
  "governance_case_review_decision_selection_receipt_surface";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_ARTIFACT_ORDER =
  Object.freeze(["governance_case_review_decision_selection_receipt"]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_META_EXPORTS =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_STABILITY",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_CONSUMER_TIER",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_ARTIFACT_ORDER",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_META_EXPORTS",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_STABLE_EXPORT_SET",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP",
    "getGovernanceCaseReviewDecisionSelectionReceiptSurfaceEntry",
    "listGovernanceCaseReviewDecisionSelectionReceiptSurfaceEntries",
    "exportGovernanceCaseReviewDecisionSelectionReceiptSurface",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([
    ...GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_META_EXPORTS,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP =
  Object.freeze({
    governance_case_review_decision_selection_receipt: Object.freeze({
      artifact_id: "governance_case_review_decision_selection_receipt",
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONSUMER_SURFACE,
      contract: Object.freeze({
        kind: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_KIND,
        version:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_VERSION,
        schema_id:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_SCHEMA_ID,
        stage: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_STAGE,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_BOUNDARY,
      }),
      supporting_artifact_only: true,
      recommendation_only: true,
      additive_only: true,
      default_off: true,
      current_selection_required: true,
      selection_explanation_required: true,
      final_acceptance_required: true,
      eligibility_hardened: true,
      strict_identity_alignment: true,
      judgment_source_enabled: false,
      authority_source_enabled: false,
      selection_feedback_enabled: false,
      audit_path_dependency: false,
      executing: false,
    }),
  });

export function getGovernanceCaseReviewDecisionSelectionReceiptSurfaceEntry(
  artifactId
) {
  return (
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP[artifactId] ??
    null
  );
}

export function listGovernanceCaseReviewDecisionSelectionReceiptSurfaceEntries() {
  return GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) =>
      getGovernanceCaseReviewDecisionSelectionReceiptSurfaceEntry(artifactId)
  );
}

export function exportGovernanceCaseReviewDecisionSelectionReceiptSurface() {
  return GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP;
}
