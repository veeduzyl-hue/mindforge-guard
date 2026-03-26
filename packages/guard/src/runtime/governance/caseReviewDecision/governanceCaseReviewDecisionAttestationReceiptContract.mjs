import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionAttestationReceiptProfile,
} from "./governanceCaseReviewDecisionAttestationReceiptProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONTRACT_KIND =
  "governance_case_review_decision_attestation_receipt_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONTRACT_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_attestation_receipt_contract";

export function buildGovernanceCaseReviewDecisionAttestationReceiptContract({
  governanceCaseReviewDecisionAttestationReceiptProfile,
}) {
  const profile = assertValidGovernanceCaseReviewDecisionAttestationReceiptProfile(
    governanceCaseReviewDecisionAttestationReceiptProfile
  );
  const payload =
    profile.governance_case_review_decision_attestation_receipt;
  const receiptRef = payload.attestation_receipt_ref;
  const receiptContext = payload.receipt_context;

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONTRACT_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONTRACT_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONTRACT_BOUNDARY,
    attestation_receipt_profile_ref: {
      kind: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_BOUNDARY,
      receipt_id: receiptRef.receipt_id,
      case_id: receiptRef.case_id,
      review_decision_id: receiptRef.review_decision_id,
      attestation_id: receiptRef.attestation_id,
      attestation_explanation_id: receiptRef.attestation_explanation_id,
    },
    receipt_available: true,
    attestation_required: true,
    attestation_explanation_required: true,
    current_selection_required: true,
    selection_explanation_required: true,
    selection_receipt_required: true,
    applicability_required: true,
    applicability_explanation_required: true,
    selected_current_review_decision_only: true,
    non_superseded_current_attestation_only: true,
    unique_current_attestation_view_required: true,
    attestation_explanation_alignment_required: true,
    continuity_chain_intact_required: true,
    broken_continuity_rejected: true,
    cross_case_binding_rejected: true,
    cross_review_decision_binding_rejected: true,
    cross_canonical_action_hash_binding_rejected: true,
    strict_case_id_alignment_required: true,
    strict_review_decision_id_alignment_required: true,
    strict_canonical_action_hash_alignment_required: true,
    complete_supporting_linkage_required: true,
    linkage_integrity_preserved: true,
    aggregate_export_only: true,
    permit_aggregate_export_only: true,
    derived_only: true,
    supporting_artifact_only: true,
    non_authoritative: true,
    non_authoritative_support_only: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    structured_receipt_only: true,
    judgment_source_enabled: false,
    authority_source_enabled: false,
    execution_binding_enabled: false,
    risk_source_enabled: false,
    selection_feedback_enabled: false,
    permit_lane_consumption: false,
    audit_path_dependency: false,
    main_path_takeover: false,
    authority_scope_expansion: false,
    new_governance_object: false,
    receipt_status: receiptContext.receipt_status,
    receipt_scope: receiptContext.receipt_scope,
    review_decision_id: receiptRef.review_decision_id,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionAttestationReceiptContract(
  contract
) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case review decision attestation receipt contract must be an object",
      ],
    };
  }
  if (
    contract.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONTRACT_KIND ||
    contract.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONTRACT_VERSION ||
    contract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONTRACT_BOUNDARY
  ) {
    errors.push(
      "governance case review decision attestation receipt contract envelope drifted"
    );
  }
  if (!isPlainObject(contract.attestation_receipt_profile_ref)) {
    errors.push(
      "governance case review decision attestation receipt profile ref missing"
    );
  }
  for (const field of [
    "receipt_available",
    "attestation_required",
    "attestation_explanation_required",
    "current_selection_required",
    "selection_explanation_required",
    "selection_receipt_required",
    "applicability_required",
    "applicability_explanation_required",
    "selected_current_review_decision_only",
    "non_superseded_current_attestation_only",
    "unique_current_attestation_view_required",
    "attestation_explanation_alignment_required",
    "continuity_chain_intact_required",
    "broken_continuity_rejected",
    "cross_case_binding_rejected",
    "cross_review_decision_binding_rejected",
    "cross_canonical_action_hash_binding_rejected",
    "strict_case_id_alignment_required",
    "strict_review_decision_id_alignment_required",
    "strict_canonical_action_hash_alignment_required",
    "complete_supporting_linkage_required",
    "linkage_integrity_preserved",
    "aggregate_export_only",
    "permit_aggregate_export_only",
    "derived_only",
    "supporting_artifact_only",
    "non_authoritative",
    "non_authoritative_support_only",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
    "structured_receipt_only",
  ]) {
    if (contract[field] !== true) {
      errors.push(
        `governance case review decision attestation receipt contract field drifted: ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "risk_source_enabled",
    "selection_feedback_enabled",
    "permit_lane_consumption",
    "audit_path_dependency",
    "main_path_takeover",
    "authority_scope_expansion",
    "new_governance_object",
  ]) {
    if (contract[field] !== false) {
      errors.push(
        `governance case review decision attestation receipt contract field drifted: ${field}`
      );
    }
  }
  if (contract.receipt_status !== "recorded") {
    errors.push(
      "governance case review decision attestation receipt status drifted"
    );
  }
  if (
    contract.receipt_scope !== "current_attestation_explanation_receipt_only"
  ) {
    errors.push(
      "governance case review decision attestation receipt scope drifted"
    );
  }
  if (
    typeof contract.review_decision_id !== "string" ||
    contract.review_decision_id.length === 0 ||
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision attestation receipt identity fields are required"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionAttestationReceiptContract(
  contract
) {
  const validation =
    validateGovernanceCaseReviewDecisionAttestationReceiptContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case review decision attestation receipt contract invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
