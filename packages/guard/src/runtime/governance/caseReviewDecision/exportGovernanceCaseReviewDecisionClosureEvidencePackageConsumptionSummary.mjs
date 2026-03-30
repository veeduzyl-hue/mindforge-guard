import {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_VERSION,
} from "./governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_STABILITY =
  "stable";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_CONSUMER_TIER =
  "governance_case_review_decision_closure_evidence_package_consumption_summary_surface";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_ARTIFACT_ORDER =
  Object.freeze([
    "governance_case_review_decision_closure_evidence_package_consumption_summary",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_META_EXPORTS =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_STABILITY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_CONSUMER_TIER",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_ARTIFACT_ORDER",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_META_EXPORTS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_STABLE_EXPORT_SET",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_MAP",
    "getGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummarySurfaceEntry",
    "listGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummarySurfaceEntries",
    "exportGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummarySurface",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([
    ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_META_EXPORTS,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_MAP =
  Object.freeze({
    governance_case_review_decision_closure_evidence_package_consumption_summary:
      Object.freeze({
        artifact_id:
          "governance_case_review_decision_closure_evidence_package_consumption_summary",
        consumer_surface:
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONSUMER_SURFACE,
        contract: Object.freeze({
          kind:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_KIND,
          version:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_VERSION,
          schema_id:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_SCHEMA_ID,
          stage:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_STAGE,
          boundary:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_BOUNDARY,
        }),
        derived_only: true,
        supporting_artifact_only: true,
        non_authoritative: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
        aggregate_export_only: true,
        permit_aggregate_export_only: true,
        package_surface_required: true,
        explanation_surface_required: true,
        explanation_stabilized_surface_required: true,
        summary_ref_alignment_stable: true,
        explanation_stabilized_surface_semantics_stable: true,
        current_narrative_selected_only: true,
        current_narrative_selection_stable: true,
        narrative_section_alignment_stable: true,
        section_artifact_binding_stable: true,
        section_consumer_consistency_stable: true,
        cross_surface_alignment_stable: true,
        delivery_readiness_interpretation_stable: true,
        delivery_readiness_consumer_consistency_stable: true,
        delivery_readiness_summary_bounded: true,
        delivery_readiness_readable: true,
        consumer_reading_surface_bounded: true,
        summary_export_stable: true,
        consumption_boundary_bounded: true,
        permit_lane_consumption: false,
        judgment_source_enabled: false,
        authority_source_enabled: false,
        execution_binding_enabled: false,
        risk_source_enabled: false,
        audit_path_dependency: false,
        main_path_takeover: false,
        governance_authority_object_addition: false,
        ui_control_plane: false,
        executing: false,
      }),
  });

export function getGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummarySurfaceEntry(
  artifactId
) {
  return (
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_MAP[
      artifactId
    ] ?? null
  );
}

export function listGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummarySurfaceEntries() {
  return GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) =>
      getGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummarySurfaceEntry(
        artifactId
      )
  );
}

export function exportGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummarySurface() {
  return GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_MAP;
}
