import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_VERSION,
} from "./governanceCaseReviewDecisionAttestationClosureReceiptProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_STABILITY =
  "stable";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_CONSUMER_TIER =
  "governance_case_review_decision_attestation_closure_receipt_surface";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_ARTIFACT_ORDER =
  Object.freeze(["governance_case_review_decision_attestation_closure_receipt"]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_META_EXPORTS =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_STABILITY",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_CONSUMER_TIER",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_ARTIFACT_ORDER",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_META_EXPORTS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_STABLE_EXPORT_SET",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_MAP",
    "getGovernanceCaseReviewDecisionAttestationClosureReceiptSurfaceEntry",
    "listGovernanceCaseReviewDecisionAttestationClosureReceiptSurfaceEntries",
    "exportGovernanceCaseReviewDecisionAttestationClosureReceiptSurface",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([
    ...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_META_EXPORTS,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_MAP =
  Object.freeze({
    governance_case_review_decision_attestation_closure_receipt: Object.freeze({
      artifact_id: "governance_case_review_decision_attestation_closure_receipt",
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONSUMER_SURFACE,
      contract: Object.freeze({
        kind: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_KIND,
        version:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_VERSION,
        schema_id:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_SCHEMA_ID,
        stage:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_STAGE,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_BOUNDARY,
      }),
      derived_only: true,
      supporting_artifact_only: true,
      non_authoritative: true,
      additive_only: true,
      non_executing: true,
      default_off: true,
      aggregate_export_only: true,
      permit_aggregate_export_only: true,
      closure_required: true,
      closure_explanation_required: true,
      receipt_bounded: true,
      current_closure_selected_only: true,
      current_explanation_selected_only: true,
      unique_current_closure_required: true,
      unique_current_explanation_required: true,
      current_closure_selection_stable: true,
      current_explanation_selection_stable: true,
      closure_selection_alignment_required: true,
      attestation_selection_alignment_required: true,
      applicability_explanation_alignment_required: true,
      continuity_lineage_alignment_required: true,
      complete_supporting_linkage_required: true,
      receipt_linkage_only: true,
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

export function getGovernanceCaseReviewDecisionAttestationClosureReceiptSurfaceEntry(
  artifactId
) {
  return (
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_MAP[
      artifactId
    ] ?? null
  );
}

export function listGovernanceCaseReviewDecisionAttestationClosureReceiptSurfaceEntries() {
  return GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) =>
      getGovernanceCaseReviewDecisionAttestationClosureReceiptSurfaceEntry(
        artifactId
      )
  );
}

export function exportGovernanceCaseReviewDecisionAttestationClosureReceiptSurface() {
  return GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SURFACE_MAP;
}
