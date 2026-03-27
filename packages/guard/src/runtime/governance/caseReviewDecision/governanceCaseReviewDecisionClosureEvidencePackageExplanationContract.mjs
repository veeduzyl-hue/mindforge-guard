import {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_KIND =
  "governance_case_review_decision_closure_evidence_package_explanation_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_closure_evidence_package_explanation_contract";

export function buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract({
  governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
      governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile
    );
  const payload =
    profile.governance_case_review_decision_closure_evidence_package_explanation;
  const ref = payload.closure_evidence_package_explanation_ref;
  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_BOUNDARY,
    closure_evidence_package_explanation_profile_ref: {
      kind:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_BOUNDARY,
      narrative_id: ref.narrative_id,
      package_id: ref.package_id,
      receipt_id: ref.receipt_id,
      explanation_id: ref.explanation_id,
      closure_id: ref.closure_id,
      case_id: ref.case_id,
      review_decision_id: ref.review_decision_id,
      attestation_id: ref.attestation_id,
    },
    package_required: true,
    package_manifest_complete: true,
    package_composition_bounded: true,
    package_export_stable: true,
    package_linkage_only: true,
    supporting_evidence_bounded: true,
    closure_conclusion_bounded: true,
    selection_basis_bounded: true,
    explanation_summary_bounded: true,
    interpretation_surface_bounded: true,
    narrative_sections_complete: true,
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

export function validateGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract(
  contract
) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case review decision closure evidence package explanation contract must be an object",
      ],
    };
  }
  if (
    contract.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_KIND ||
    contract.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_VERSION ||
    contract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_BOUNDARY
  ) {
    errors.push(
      "governance case review decision closure evidence package explanation contract envelope drifted"
    );
  }
  for (const field of [
    "package_required",
    "package_manifest_complete",
    "package_composition_bounded",
    "package_export_stable",
    "package_linkage_only",
    "supporting_evidence_bounded",
    "closure_conclusion_bounded",
    "selection_basis_bounded",
    "explanation_summary_bounded",
    "interpretation_surface_bounded",
    "narrative_sections_complete",
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
        `governance case review decision closure evidence package explanation contract field drifted: ${field}`
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
        `governance case review decision closure evidence package explanation contract field drifted: ${field}`
      );
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract(
  contract
) {
  const validation =
    validateGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract(
      contract
    );
  if (validation.ok) return contract;
  const err = new Error(
    `governance case review decision closure evidence package explanation contract invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
