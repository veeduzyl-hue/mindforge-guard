import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY,
  assertValidGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary,
} from "./governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_COMPATIBILITY_FREEZE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_COMPATIBILITY_FREEZE_KIND,
  assertValidGovernanceCaseReviewDecisionSelectionReceiptFinalCompatibilityFreeze,
} from "./governanceCaseReviewDecisionSelectionReceiptFinalCompatibilityFreeze.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_STABILITY =
  "frozen";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_CONSUMER_TIER =
  "external_consumer";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_ARTIFACT_ORDER =
  Object.freeze([
    "governance_case_review_decision_selection_receipt_final_acceptance",
    "governance_case_review_decision_selection_receipt_final_compatibility_freeze",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_META_EXPORTS =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_STABILITY",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_CONSUMER_TIER",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_ARTIFACT_ORDER",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_META_EXPORTS",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_MAP",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([
    ...GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_META_EXPORTS,
    "getGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceSurfaceEntry",
    "listGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceSurfaceEntries",
    "exportGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceSurface",
  ]);

export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_MAP =
  Object.freeze({
    governance_case_review_decision_selection_receipt_final_acceptance:
      Object.freeze({
        artifact_id:
          "governance_case_review_decision_selection_receipt_final_acceptance",
        kind:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_KIND,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_BOUNDARY,
        consumer_surface:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
        consumer_tier:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_CONSUMER_TIER,
        stability:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_STABILITY,
        recommendation_only: true,
        additive_only: true,
        executing: false,
        release_target: "v5.9.0",
        readiness_level:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY,
        judgment_source_enabled: false,
        authority_source_enabled: false,
        selection_feedback_enabled: false,
      }),
    governance_case_review_decision_selection_receipt_final_compatibility_freeze:
      Object.freeze({
        artifact_id:
          "governance_case_review_decision_selection_receipt_final_compatibility_freeze",
        kind:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_COMPATIBILITY_FREEZE_KIND,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_COMPATIBILITY_FREEZE_BOUNDARY,
        consumer_surface:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
        consumer_tier:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_CONSUMER_TIER,
        stability:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_STABILITY,
        recommendation_only: true,
        additive_only: true,
        executing: false,
        release_target: "v5.9.0",
      }),
  });

export function getGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceSurfaceEntry(
  artifactId
) {
  return (
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_MAP[
      artifactId
    ] ?? null
  );
}

export function listGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceSurfaceEntries() {
  return GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) =>
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_MAP[
        artifactId
      ]
  );
}

export function exportGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceSurface({
  governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary,
  governanceCaseReviewDecisionSelectionReceiptFinalCompatibilityFreeze,
}) {
  const boundary =
    assertValidGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary(
      governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary
    );
  const freeze =
    assertValidGovernanceCaseReviewDecisionSelectionReceiptFinalCompatibilityFreeze(
      governanceCaseReviewDecisionSelectionReceiptFinalCompatibilityFreeze
    );
  return Object.freeze({
    governance_case_review_decision_selection_receipt_final_acceptance:
      boundary,
    governance_case_review_decision_selection_receipt_final_compatibility_freeze:
      freeze,
    release_summary: Object.freeze({
      release_target: "v5.9.0",
      module: "Governance Case Review Decision Selection Receipt Boundary v1",
      readiness:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY,
      recommendation_only: true,
      additive_only: true,
      non_executing: true,
      default_off: true,
    }),
  });
}
