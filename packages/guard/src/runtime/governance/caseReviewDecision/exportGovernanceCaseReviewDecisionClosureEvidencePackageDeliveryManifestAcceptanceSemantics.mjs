import {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_VERSION,
} from "./governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_STABILITY =
  "stable";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_CONSUMER_TIER =
  "governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics_surface";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_ARTIFACT_ORDER =
  Object.freeze([
    "governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_META_EXPORTS =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_STABILITY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_CONSUMER_TIER",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_ARTIFACT_ORDER",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_META_EXPORTS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_STABLE_EXPORT_SET",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_MAP",
    "getGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsSurfaceEntry",
    "listGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsSurfaceEntries",
    "exportGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsSurface",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([
    ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_META_EXPORTS,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_MAP =
  Object.freeze({
    governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics:
      Object.freeze({
        artifact_id:
          "governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics",
        consumer_surface:
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_CONSUMER_SURFACE,
        contract: Object.freeze({
          kind:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_KIND,
          version:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_VERSION,
          schema_id:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_SCHEMA_ID,
          stage:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_STAGE,
          boundary:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_BOUNDARY,
        }),
        derived_only: true,
        supporting_artifact_only: true,
        non_authoritative: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
        aggregate_export_only: true,
        permit_aggregate_export_only: true,
        bundle_surface_required: true,
        manifest_surface_required: true,
        package_surface_required: true,
        explanation_surface_required: true,
        consumption_summary_surface_required: true,
        bundle_available: true,
        manifest_available: true,
        package_available: true,
        explanation_available: true,
        consumption_summary_available: true,
        bundle_manifest_semantic_linkage_finalized: true,
        bundle_manifest_acceptance_semantics_linkage_stable: true,
        acceptance_semantics_finalized: true,
        finalized_acceptance_readability_bounded: true,
        acceptance_readability_consistency_stable: true,
        finalized_cross_surface_consistency_bounded: true,
        cross_surface_alignment_stable: true,
        finalized_export_stable: true,
        export_consistency_stable: true,
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

export function getGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsSurfaceEntry(
  artifactId
) {
  return (
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_MAP[
      artifactId
    ] ?? null
  );
}

export function listGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsSurfaceEntries() {
  return GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) =>
      getGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsSurfaceEntry(
        artifactId
      )
  );
}

export function exportGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsSurface() {
  return GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_MAP;
}
