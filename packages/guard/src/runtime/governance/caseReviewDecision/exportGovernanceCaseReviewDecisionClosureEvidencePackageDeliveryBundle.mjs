import {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_VERSION,
} from "./governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_STABILITY =
  "stable";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_CONSUMER_TIER =
  "governance_case_review_decision_closure_evidence_package_delivery_bundle_surface";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_ARTIFACT_ORDER =
  Object.freeze([
    "governance_case_review_decision_closure_evidence_package_delivery_bundle",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_META_EXPORTS =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_STABILITY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_CONSUMER_TIER",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_ARTIFACT_ORDER",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_META_EXPORTS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_STABLE_EXPORT_SET",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_MAP",
    "getGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleSurfaceEntry",
    "listGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleSurfaceEntries",
    "exportGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleSurface",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([
    ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_META_EXPORTS,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_MAP =
  Object.freeze({
    governance_case_review_decision_closure_evidence_package_delivery_bundle:
      Object.freeze({
        artifact_id:
          "governance_case_review_decision_closure_evidence_package_delivery_bundle",
        consumer_surface:
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONSUMER_SURFACE,
        contract: Object.freeze({
          kind:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_KIND,
          version:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_VERSION,
          schema_id:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_SCHEMA_ID,
          stage:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_STAGE,
          boundary:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_BOUNDARY,
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
        consumption_summary_surface_required: true,
        explanation_stabilized_surface_required: true,
        delivery_readiness_summary_required: true,
        package_available: true,
        explanation_available: true,
        consumption_summary_available: true,
        explanation_stabilized_surface_available: true,
        delivery_readiness_summary_available: true,
        bundle_ref_alignment_stable: true,
        bundle_composition_bounded: true,
        bundle_handoff_surface_bounded: true,
        bundle_handoff_readable: true,
        bundle_export_stable: true,
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

export function getGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleSurfaceEntry(
  artifactId
) {
  return (
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_MAP[
      artifactId
    ] ?? null
  );
}

export function listGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleSurfaceEntries() {
  return GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) =>
      getGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleSurfaceEntry(
        artifactId
      )
  );
}

export function exportGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleSurface() {
  return GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_MAP;
}
