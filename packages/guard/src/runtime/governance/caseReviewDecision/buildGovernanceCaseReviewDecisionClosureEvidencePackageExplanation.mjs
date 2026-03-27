import { assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract } from "./governanceCaseReviewDecisionClosureEvidencePackageExplanationContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile as buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanation,
};

export function consumeGovernanceCaseReviewDecisionClosureEvidencePackageExplanation({
  governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile,
  governanceCaseReviewDecisionClosureEvidencePackageExplanationContract,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
      governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract(
      governanceCaseReviewDecisionClosureEvidencePackageExplanationContract
    );
  const payload =
    profile.governance_case_review_decision_closure_evidence_package_explanation;
  const ref = payload.closure_evidence_package_explanation_ref;
  const sectionIds =
    payload.explanation_context.narrative_structure.narrative_section_ids;

  if (
    contract.closure_evidence_package_explanation_profile_ref.narrative_id !==
      ref.narrative_id ||
    contract.closure_evidence_package_explanation_profile_ref
      .narrative_selection_id !== ref.narrative_selection_id ||
    contract.closure_evidence_package_explanation_profile_ref.package_id !==
      ref.package_id ||
    contract.closure_evidence_package_explanation_profile_ref.receipt_id !==
      ref.receipt_id ||
    contract.closure_evidence_package_explanation_profile_ref.explanation_id !==
      ref.explanation_id ||
    contract.closure_evidence_package_explanation_profile_ref.closure_id !==
      ref.closure_id ||
    contract.review_decision_id !== ref.review_decision_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision closure evidence package explanation consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    narrative_id: ref.narrative_id,
    narrative_selection_id: ref.narrative_selection_id,
    package_id: ref.package_id,
    receipt_id: ref.receipt_id,
    explanation_id: ref.explanation_id,
    closure_id: ref.closure_id,
    case_id: ref.case_id,
    review_decision_id: ref.review_decision_id,
    attestation_id: ref.attestation_id,
    explanation_status: payload.explanation_context.explanation_status,
    explanation_scope: payload.explanation_context.explanation_scope,
    narrative_selection_mode:
      payload.explanation_context.narrative_structure.narrative_selection_mode,
    narrative_section_ids: Object.freeze([...sectionIds]),
    current_narrative_selected: true,
    current_narrative_selection_stable: true,
    package_manifest_complete: true,
    package_composition_bounded: true,
    package_export_stable: true,
    interpretation_surface_bounded: true,
    narrative_sections_complete: true,
    narrative_section_alignment_stable: true,
    section_artifact_binding_stable: true,
    section_consumer_consistency_stable: true,
    cross_surface_alignment_stable: true,
    package_linkage_only: true,
    consumption_boundary_bounded: true,
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
