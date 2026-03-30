import {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_KIND =
  "governance_case_review_decision_closure_evidence_package_consumption_summary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_closure_evidence_package_consumption_summary_contract";

export function buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract({
  governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile(
      governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile
    );
  const payload =
    profile.governance_case_review_decision_closure_evidence_package_consumption_summary;
  const ref = payload.closure_evidence_package_consumption_summary_ref;
  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_BOUNDARY,
    closure_evidence_package_consumption_summary_profile_ref: {
      kind:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_BOUNDARY,
      summary_id: ref.summary_id,
      package_id: ref.package_id,
      narrative_id: ref.narrative_id,
      narrative_selection_id: ref.narrative_selection_id,
      receipt_id: ref.receipt_id,
      explanation_id: ref.explanation_id,
      closure_id: ref.closure_id,
      case_id: ref.case_id,
      review_decision_id: ref.review_decision_id,
      attestation_id: ref.attestation_id,
    },
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
    authority_scope_expansion: false,
    new_governance_authority_object: false,
    review_decision_id: ref.review_decision_id,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract(
  contract
) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case review decision closure evidence package consumption summary contract must be an object",
      ],
    };
  }
  if (
    contract.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_KIND ||
    contract.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_VERSION ||
    contract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_BOUNDARY
  ) {
    errors.push(
      "governance case review decision closure evidence package consumption summary contract envelope drifted"
    );
  }
  for (const field of [
    "package_surface_required",
    "explanation_surface_required",
    "explanation_stabilized_surface_required",
    "summary_ref_alignment_stable",
    "explanation_stabilized_surface_semantics_stable",
    "current_narrative_selected_only",
    "current_narrative_selection_stable",
    "narrative_section_alignment_stable",
    "section_artifact_binding_stable",
    "section_consumer_consistency_stable",
    "cross_surface_alignment_stable",
    "delivery_readiness_interpretation_stable",
    "delivery_readiness_consumer_consistency_stable",
    "delivery_readiness_summary_bounded",
    "delivery_readiness_readable",
    "consumer_reading_surface_bounded",
    "summary_export_stable",
    "consumption_boundary_bounded",
    "aggregate_export_only",
    "permit_aggregate_export_only",
    "derived_only",
    "supporting_artifact_only",
    "non_authoritative",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (contract[field] !== true) {
      errors.push(
        `governance case review decision closure evidence package consumption summary contract field drifted: ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "risk_source_enabled",
    "permit_lane_consumption",
    "audit_path_dependency",
    "main_path_takeover",
    "authority_scope_expansion",
    "new_governance_authority_object",
  ]) {
    if (contract[field] !== false) {
      errors.push(
        `governance case review decision closure evidence package consumption summary contract field drifted: ${field}`
      );
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract(
  contract
) {
  const validation =
    validateGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract(
      contract
    );
  if (validation.ok) return contract;
  const err = new Error(
    `governance case review decision closure evidence package consumption summary contract invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
