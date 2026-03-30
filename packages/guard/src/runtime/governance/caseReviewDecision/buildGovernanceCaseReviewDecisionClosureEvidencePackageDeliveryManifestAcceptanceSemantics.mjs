import { assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsContract } from "./governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsProfile,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsProfile as buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemantics,
};

export function consumeGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemantics(
  {
    governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsProfile,
    governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsContract,
  }
) {
  const profile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsProfile(
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsContract(
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsContract
    );
  const payload =
    profile.governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics;
  const ref =
    payload.closure_evidence_package_delivery_manifest_acceptance_semantics_ref;
  const semantics =
    payload.acceptance_semantics_context.finalized_acceptance_semantics;

  if (
    contract.closure_evidence_package_delivery_manifest_acceptance_semantics_profile_ref.acceptance_semantics_id !==
      ref.acceptance_semantics_id ||
    contract.closure_evidence_package_delivery_manifest_acceptance_semantics_profile_ref.manifest_id !==
      ref.manifest_id ||
    contract.closure_evidence_package_delivery_manifest_acceptance_semantics_profile_ref.bundle_id !==
      ref.bundle_id ||
    contract.closure_evidence_package_delivery_manifest_acceptance_semantics_profile_ref.package_id !==
      ref.package_id ||
    contract.closure_evidence_package_delivery_manifest_acceptance_semantics_profile_ref.explanation_id !==
      ref.explanation_id ||
    contract.closure_evidence_package_delivery_manifest_acceptance_semantics_profile_ref.summary_id !==
      ref.summary_id ||
    contract.review_decision_id !== ref.review_decision_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision closure evidence package delivery manifest acceptance semantics consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    acceptance_semantics_id: ref.acceptance_semantics_id,
    manifest_id: ref.manifest_id,
    bundle_id: ref.bundle_id,
    package_id: ref.package_id,
    explanation_id: ref.explanation_id,
    summary_id: ref.summary_id,
    narrative_id: ref.narrative_id,
    narrative_selection_id: ref.narrative_selection_id,
    receipt_id: ref.receipt_id,
    closure_id: ref.closure_id,
    case_id: ref.case_id,
    review_decision_id: ref.review_decision_id,
    attestation_id: ref.attestation_id,
    semantics_status: payload.acceptance_semantics_context.semantics_status,
    semantics_scope: payload.acceptance_semantics_context.semantics_scope,
    finalization_state: semantics.finalization_state,
    readability_state: semantics.readability_state,
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
    aggregate_export_only: true,
    permit_aggregate_export_only: true,
    derived_only: true,
    supporting_artifact_only: true,
    non_authoritative: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    judgment_source_enabled: false,
    authority_source_enabled: false,
    execution_binding_enabled: false,
    risk_source_enabled: false,
    permit_lane_consumption: false,
    audit_path_dependency: false,
    main_path_takeover: false,
    executing: false,
  });
}
