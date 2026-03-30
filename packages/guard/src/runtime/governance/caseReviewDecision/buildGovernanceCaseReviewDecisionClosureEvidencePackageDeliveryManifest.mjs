import { assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestContract } from "./governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile as buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifest,
};

export function consumeGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifest({
  governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile,
  governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestContract,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile(
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestContract(
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestContract
    );
  const payload =
    profile.governance_case_review_decision_closure_evidence_package_delivery_manifest;
  const ref = payload.closure_evidence_package_delivery_manifest_ref;
  const manifest = payload.manifest_context.delivery_manifest;

  if (
    contract.closure_evidence_package_delivery_manifest_profile_ref.manifest_id !==
      ref.manifest_id ||
    contract.closure_evidence_package_delivery_manifest_profile_ref.bundle_id !==
      ref.bundle_id ||
    contract.closure_evidence_package_delivery_manifest_profile_ref.package_id !==
      ref.package_id ||
    contract.closure_evidence_package_delivery_manifest_profile_ref.explanation_id !==
      ref.explanation_id ||
    contract.closure_evidence_package_delivery_manifest_profile_ref.summary_id !==
      ref.summary_id ||
    contract.closure_evidence_package_delivery_manifest_profile_ref.narrative_id !==
      ref.narrative_id ||
    contract.closure_evidence_package_delivery_manifest_profile_ref
      .narrative_selection_id !== ref.narrative_selection_id ||
    contract.closure_evidence_package_delivery_manifest_profile_ref.receipt_id !==
      ref.receipt_id ||
    contract.closure_evidence_package_delivery_manifest_profile_ref.closure_id !==
      ref.closure_id ||
    contract.review_decision_id !== ref.review_decision_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision closure evidence package delivery manifest consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
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
    manifest_status: payload.manifest_context.manifest_status,
    manifest_scope: payload.manifest_context.manifest_scope,
    acceptance_state: manifest.acceptance_state,
    completeness_state: manifest.completeness_state,
    delivery_package_item_count: manifest.delivery_package_item_count,
    bundle_available: true,
    package_available: true,
    explanation_available: true,
    consumption_summary_available: true,
    manifest_ref_alignment_stable: true,
    manifest_listing_deterministic: true,
    manifest_composition_bounded: true,
    manifest_completeness_bounded: true,
    manifest_acceptance_surface_bounded: true,
    acceptance_readability_stable: true,
    manifest_export_stable: true,
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
