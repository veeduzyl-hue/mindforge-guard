import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_STATUS_RECORDED,
  assertValidGovernanceCaseReviewDecisionSelectionReceiptProfile,
} from "./governanceCaseReviewDecisionSelectionReceiptProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_VERSION,
  assertValidGovernanceCaseReviewDecisionSelectionReceiptContract,
} from "./governanceCaseReviewDecisionSelectionReceiptContract.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_KIND =
  "governance_case_review_decision_selection_receipt_final_acceptance_boundary";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-selection-receipt-final-acceptance-boundary/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_STAGE =
  "governance_case_review_decision_selection_receipt_final_acceptance_phase3_v5_9_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_BOUNDARY =
  "governance_case_review_decision_selection_receipt_final_acceptance_boundary";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_selection_receipt_final_acceptance";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY =
  "release_ready_for_v5_9_0_review";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_selection_receipt_final_acceptance",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "release_target",
    "selection_receipt_profile_ref",
    "selection_receipt_contract_ref",
    "acceptance_scope",
    "final_acceptance_contract",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary",
    "validateGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary",
    "assertValidGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeOptionalString(value) {
  return value === undefined || value === null ? null : String(value);
}

export function buildGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary({
  governanceCaseReviewDecisionSelectionReceiptProfile,
  governanceCaseReviewDecisionSelectionReceiptContract,
}) {
  const profile = assertValidGovernanceCaseReviewDecisionSelectionReceiptProfile(
    governanceCaseReviewDecisionSelectionReceiptProfile
  );
  const contract =
    assertValidGovernanceCaseReviewDecisionSelectionReceiptContract(
      governanceCaseReviewDecisionSelectionReceiptContract
    );
  const payload = profile.governance_case_review_decision_selection_receipt;
  const receiptRef = payload.selection_receipt_ref;
  const receiptContext = payload.receipt_context;

  if (contract.selection_receipt_profile_ref.case_id !== receiptRef.case_id) {
    throw new Error(
      "governance case review decision selection receipt final acceptance mismatch: contract case_id must match receipt profile"
    );
  }
  if (
    normalizeOptionalString(
      contract.selection_receipt_profile_ref.current_review_decision_id
    ) !== normalizeOptionalString(receiptRef.current_review_decision_id)
  ) {
    throw new Error(
      "governance case review decision selection receipt final acceptance mismatch: contract current_review_decision_id must match receipt profile"
    );
  }
  if (contract.canonical_action_hash !== profile.canonical_action_hash) {
    throw new Error(
      "governance case review decision selection receipt final acceptance mismatch: contract canonical_action_hash must match receipt profile"
    );
  }
  if (
    contract.receipt_status !== receiptContext.receipt_status ||
    contract.current_review_decision_id !==
      receiptContext.current_review_decision_id
  ) {
    throw new Error(
      "governance case review decision selection receipt final acceptance mismatch: contract receipt context must match receipt profile"
    );
  }

  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SCHEMA_ID,
    canonical_action_hash: profile.canonical_action_hash,
    governance_case_review_decision_selection_receipt_final_acceptance: {
      stage:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_BOUNDARY,
      release_target: "v5.9.0",
      selection_receipt_profile_ref: {
        kind: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_KIND,
        version: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_VERSION,
        stage: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_STAGE,
        boundary: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_BOUNDARY,
        source_surface: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONSUMER_SURFACE,
        case_id: receiptRef.case_id,
        selection_status: receiptRef.selection_status,
        current_review_decision_id: receiptRef.current_review_decision_id,
      },
      selection_receipt_contract_ref: {
        kind: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_KIND,
        version: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_VERSION,
        boundary: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_BOUNDARY,
        case_id: receiptRef.case_id,
        selection_status: receiptRef.selection_status,
        current_review_decision_id: receiptRef.current_review_decision_id,
        canonical_action_hash: profile.canonical_action_hash,
      },
      acceptance_scope: {
        case_id: receiptRef.case_id,
        selection_status: receiptRef.selection_status,
        current_review_decision_id: receiptRef.current_review_decision_id,
        receipt_status: receiptContext.receipt_status,
        reason_codes: receiptContext.reason_codes,
        review_decision_sequence: receiptContext.review_decision_sequence,
        continuity_mode: receiptContext.continuity_mode,
        supersedes_review_decision_id:
          receiptContext.supersedes_review_decision_id,
        eligible_aligned_bounded_inputs_required: true,
        supporting_artifact_only: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
        strict_identity_alignment: true,
      },
      final_acceptance_contract: {
        readiness_level:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY,
        receipt_phase1_semantics_preserved: true,
        receipt_phase2_hardening_semantics_preserved: true,
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
        judgment_source_enabled: false,
        authority_source_enabled: false,
        selection_feedback_enabled: false,
        main_path_takeover: false,
      },
      preserved_semantics: {
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        permit_gate_semantics_preserved: true,
        enforcement_pilot_semantics_preserved: true,
        limited_enforcement_authority_semantics_preserved: true,
        classify_semantics_preserved: true,
        authority_scope_expansion: false,
        governance_object_addition: false,
        risk_integration: false,
        ui_control_plane: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary(
  boundary
) {
  const errors = [];
  if (!isPlainObject(boundary)) {
    return {
      ok: false,
      errors: [
        "governance case review decision selection receipt final acceptance boundary must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(boundary)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance top-level field order drifted"
    );
  }
  if (
    boundary.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_KIND
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance kind drifted"
    );
  }
  if (
    boundary.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_VERSION
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance version drifted"
    );
  }
  if (
    boundary.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SCHEMA_ID
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance schema drifted"
    );
  }
  if (
    typeof boundary.canonical_action_hash !== "string" ||
    boundary.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance canonical_action_hash is required"
    );
  }
  if (boundary.deterministic !== true || boundary.enforcing !== false) {
    errors.push(
      "governance case review decision selection receipt final acceptance execution flags drifted"
    );
  }
  const payload =
    boundary.governance_case_review_decision_selection_receipt_final_acceptance;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision selection receipt final acceptance payload missing"
    );
    return { ok: false, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance payload field order drifted"
    );
  }
  if (
    payload.stage !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_STAGE
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance stage drifted"
    );
  }
  if (
    payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_CONSUMER_SURFACE
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance consumer surface drifted"
    );
  }
  if (
    payload.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance boundary drifted"
    );
  }
  if (payload.release_target !== "v5.9.0") {
    errors.push(
      "governance case review decision selection receipt final acceptance release target drifted"
    );
  }
  if (!isPlainObject(payload.selection_receipt_profile_ref)) {
    errors.push(
      "governance case review decision selection receipt final acceptance profile ref missing"
    );
  }
  if (!isPlainObject(payload.selection_receipt_contract_ref)) {
    errors.push(
      "governance case review decision selection receipt final acceptance contract ref missing"
    );
  }
  if (!isPlainObject(payload.acceptance_scope)) {
    errors.push(
      "governance case review decision selection receipt final acceptance scope missing"
    );
  }
  if (!isPlainObject(payload.final_acceptance_contract)) {
    errors.push(
      "governance case review decision selection receipt final acceptance contract missing"
    );
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push(
      "governance case review decision selection receipt final acceptance preserved semantics missing"
    );
  }
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  const scope = payload.acceptance_scope;
  const finalContract = payload.final_acceptance_contract;
  const preservedSemantics = payload.preserved_semantics;

  if (
    payload.selection_receipt_profile_ref.case_id !==
      payload.selection_receipt_contract_ref.case_id ||
    normalizeOptionalString(
      payload.selection_receipt_profile_ref.current_review_decision_id
    ) !==
      normalizeOptionalString(
        payload.selection_receipt_contract_ref.current_review_decision_id
      ) ||
    payload.selection_receipt_contract_ref.canonical_action_hash !==
      boundary.canonical_action_hash
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance refs must remain identity aligned"
    );
  }
  if (
    scope.case_id !== payload.selection_receipt_profile_ref.case_id ||
    normalizeOptionalString(scope.current_review_decision_id) !==
      normalizeOptionalString(
        payload.selection_receipt_profile_ref.current_review_decision_id
      )
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance scope must remain aligned with receipt refs"
    );
  }
  if (scope.selection_status !== "selected") {
    errors.push(
      "governance case review decision selection receipt final acceptance selection status drifted"
    );
  }
  if (
    scope.receipt_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_STATUS_RECORDED
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance receipt status drifted"
    );
  }
  if (!Array.isArray(scope.reason_codes) || scope.reason_codes.length === 0) {
    errors.push(
      "governance case review decision selection receipt final acceptance reason_codes are required"
    );
  }
  for (const field of [
    "eligible_aligned_bounded_inputs_required",
    "supporting_artifact_only",
    "additive_only",
    "non_executing",
    "default_off",
    "strict_identity_alignment",
  ]) {
    if (scope[field] !== true) {
      errors.push(
        `governance case review decision selection receipt final acceptance scope drifted: ${field}`
      );
    }
  }
  for (const field of [
    "receipt_phase1_semantics_preserved",
    "receipt_phase2_hardening_semantics_preserved",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (finalContract[field] !== true) {
      errors.push(
        `governance case review decision selection receipt final acceptance contract drifted: ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "selection_feedback_enabled",
    "main_path_takeover",
  ]) {
    if (finalContract[field] !== false) {
      errors.push(
        `governance case review decision selection receipt final acceptance contract drifted: ${field}`
      );
    }
  }
  if (
    finalContract.readiness_level !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY
  ) {
    errors.push(
      "governance case review decision selection receipt final acceptance readiness drifted"
    );
  }
  for (const field of [
    "audit_output_preserved",
    "audit_verdict_preserved",
    "actual_exit_code_preserved",
    "permit_gate_semantics_preserved",
    "enforcement_pilot_semantics_preserved",
    "limited_enforcement_authority_semantics_preserved",
    "classify_semantics_preserved",
  ]) {
    if (preservedSemantics[field] !== true) {
      errors.push(
        `governance case review decision selection receipt final acceptance preserved semantic drifted: ${field}`
      );
    }
  }
  for (const field of [
    "authority_scope_expansion",
    "governance_object_addition",
    "risk_integration",
    "ui_control_plane",
  ]) {
    if (preservedSemantics[field] !== false) {
      errors.push(
        `governance case review decision selection receipt final acceptance preserved semantic drifted: ${field}`
      );
    }
  }
  if (preservedSemantics.denied_exit_code_preserved !== 25) {
    errors.push(
      "governance case review decision selection receipt final acceptance denied exit drifted"
    );
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary(
  boundary
) {
  const validation =
    validateGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary(
      boundary
    );
  if (validation.ok) return boundary;

  const err = new Error(
    `governance case review decision selection receipt final acceptance boundary invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
