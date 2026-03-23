import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_STATUS_AVAILABLE,
  assertValidGovernanceCaseReviewDecisionSelectionExplanationProfile,
} from "./governanceCaseReviewDecisionSelectionExplanationProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_READY,
  assertValidGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary,
} from "./governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
  assertValidGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary,
} from "./governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_KIND =
  "governance_case_review_decision_selection_receipt_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-selection-receipt-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_STAGE =
  "governance_case_review_decision_selection_receipt_boundary_phase1_v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_selection_receipt";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_BOUNDARY =
  "governance_case_review_decision_selection_receipt_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_STATUS_RECORDED =
  "recorded";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_selection_receipt",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "selection_receipt_ref",
    "receipt_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_STATUS_RECORDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionSelectionReceiptProfile",
    "validateGovernanceCaseReviewDecisionSelectionReceiptProfile",
    "assertValidGovernanceCaseReviewDecisionSelectionReceiptProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeOptionalString(value) {
  return value === undefined || value === null ? null : String(value);
}

function hasUniqueStrings(values) {
  return Array.isArray(values) && new Set(values).size === values.length;
}

function assertBoundedInputAlignment(
  currentSelectionFinalAcceptanceBoundary,
  selectionExplanationProfile,
  selectionExplanationFinalAcceptanceBoundary
) {
  const currentAcceptance =
    currentSelectionFinalAcceptanceBoundary.governance_case_review_decision_current_selection_final_acceptance;
  const explanationPayload =
    selectionExplanationProfile.governance_case_review_decision_selection_explanation;
  const explanationAcceptance =
    selectionExplanationFinalAcceptanceBoundary.governance_case_review_decision_selection_explanation_final_acceptance;

  const currentSelectionRef = currentAcceptance.current_selection_profile_ref;
  const explanationSelectionRef = explanationPayload.selection_ref;
  const explanationAcceptanceRef =
    explanationAcceptance.selection_explanation_profile_ref;
  const explanationContractRef =
    explanationAcceptance.selection_explanation_contract_ref;

  if (currentAcceptance.final_acceptance_contract.readiness_level !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY) {
    throw new Error(
      "governance case review decision selection receipt requires current selection final acceptance readiness"
    );
  }
  if (explanationAcceptance.final_acceptance_contract.readiness_level !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_READY) {
    throw new Error(
      "governance case review decision selection receipt requires selection explanation final acceptance readiness"
    );
  }
  if (
    explanationPayload.explanation_context.explanation_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_STATUS_AVAILABLE
  ) {
    throw new Error(
      "governance case review decision selection receipt requires available selection explanation"
    );
  }
  if (
    currentSelectionRef.selection_status !== "selected" ||
    explanationSelectionRef.selection_status !== "selected" ||
    explanationAcceptanceRef.selection_status !== "selected" ||
    explanationContractRef.selection_status !== "selected"
  ) {
    throw new Error(
      "governance case review decision selection receipt only supports selected current selection"
    );
  }

  if (
    currentSelectionRef.case_id !== explanationSelectionRef.case_id ||
    currentSelectionRef.case_id !== explanationAcceptanceRef.case_id ||
    currentSelectionRef.case_id !== explanationContractRef.case_id
  ) {
    throw new Error(
      "governance case review decision selection receipt mismatch: case_id must remain aligned across bounded inputs"
    );
  }
  if (
    normalizeOptionalString(currentSelectionRef.current_review_decision_id) !==
      normalizeOptionalString(explanationSelectionRef.current_review_decision_id) ||
    normalizeOptionalString(currentSelectionRef.current_review_decision_id) !==
      normalizeOptionalString(explanationAcceptanceRef.current_review_decision_id) ||
    normalizeOptionalString(currentSelectionRef.current_review_decision_id) !==
      normalizeOptionalString(explanationContractRef.current_review_decision_id)
  ) {
    throw new Error(
      "governance case review decision selection receipt mismatch: current_review_decision_id must remain aligned across bounded inputs"
    );
  }
  if (
    currentSelectionFinalAcceptanceBoundary.canonical_action_hash !==
      selectionExplanationProfile.canonical_action_hash ||
    currentSelectionFinalAcceptanceBoundary.canonical_action_hash !==
      selectionExplanationFinalAcceptanceBoundary.canonical_action_hash ||
    explanationContractRef.canonical_action_hash !==
      selectionExplanationProfile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision selection receipt mismatch: canonical_action_hash must remain aligned across bounded inputs"
    );
  }
}

export function buildGovernanceCaseReviewDecisionSelectionReceiptProfile({
  governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary,
  governanceCaseReviewDecisionSelectionExplanationProfile,
  governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary,
}) {
  const currentSelectionFinalAcceptance =
    assertValidGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary(
      governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary
    );
  const selectionExplanationProfile =
    assertValidGovernanceCaseReviewDecisionSelectionExplanationProfile(
      governanceCaseReviewDecisionSelectionExplanationProfile
    );
  const selectionExplanationFinalAcceptance =
    assertValidGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary(
      governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary
    );

  assertBoundedInputAlignment(
    currentSelectionFinalAcceptance,
    selectionExplanationProfile,
    selectionExplanationFinalAcceptance
  );

  const currentAcceptance =
    currentSelectionFinalAcceptance.governance_case_review_decision_current_selection_final_acceptance;
  const explanationPayload =
    selectionExplanationProfile.governance_case_review_decision_selection_explanation;
  const explanationContext = explanationPayload.explanation_context;
  const selectionRef = explanationPayload.selection_ref;

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_SCHEMA_ID,
    canonical_action_hash: selectionExplanationProfile.canonical_action_hash,
    governance_case_review_decision_selection_receipt: {
      stage: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_BOUNDARY,
      selection_receipt_ref: {
        case_id: selectionRef.case_id,
        selection_status: selectionRef.selection_status,
        current_review_decision_id: selectionRef.current_review_decision_id,
      },
      receipt_context: {
        receipt_status:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_STATUS_RECORDED,
        current_review_decision_id: selectionRef.current_review_decision_id,
        review_decision_sequence:
          explanationContext.review_decision_sequence,
        continuity_mode: explanationContext.continuity_mode,
        supersedes_review_decision_id:
          explanationContext.supersedes_review_decision_id,
        reason_codes: Object.freeze([...explanationContext.reason_codes]),
        receipt_inputs: Object.freeze({
          current_selection_final_acceptance_ready:
            currentAcceptance.final_acceptance_contract.readiness_level ===
            GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
          selection_explanation_available: true,
          selection_explanation_final_acceptance_ready: true,
        }),
      },
      validation_exports: {
        current_selection_final_acceptance_available: true,
        selection_explanation_profile_available: true,
        selection_explanation_final_acceptance_available: true,
        export_surface_available: true,
      },
      preserved_semantics: {
        supporting_artifact_only: true,
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
        judgment_source_enabled: false,
        authority_source_enabled: false,
        selection_feedback_enabled: false,
        main_path_takeover: false,
        authority_scope_expansion: false,
        governance_object_addition: false,
        risk_integration: false,
        ui_control_plane: false,
        freeform_narrative_receipt: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseReviewDecisionSelectionReceiptProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision selection receipt profile must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision selection receipt top-level field order drifted"
    );
  }
  if (profile.kind !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_KIND) {
    errors.push("governance case review decision selection receipt kind drifted");
  }
  if (profile.version !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_VERSION) {
    errors.push(
      "governance case review decision selection receipt version drifted"
    );
  }
  if (profile.schema_id !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_SCHEMA_ID) {
    errors.push(
      "governance case review decision selection receipt schema drifted"
    );
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision selection receipt canonical_action_hash is required"
    );
  }
  if (profile.deterministic !== true) {
    errors.push(
      "governance case review decision selection receipt must remain deterministic"
    );
  }
  if (profile.enforcing !== false) {
    errors.push(
      "governance case review decision selection receipt must remain non-enforcing"
    );
  }

  const payload = profile.governance_case_review_decision_selection_receipt;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision selection receipt payload must be an object"
    );
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision selection receipt payload field order drifted"
    );
  }
  if (payload.stage !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_STAGE) {
    errors.push(
      "governance case review decision selection receipt stage drifted"
    );
  }
  if (
    payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONSUMER_SURFACE
  ) {
    errors.push(
      "governance case review decision selection receipt consumer surface drifted"
    );
  }
  if (
    payload.boundary !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision selection receipt boundary drifted"
    );
  }
  if (!isPlainObject(payload.selection_receipt_ref)) {
    errors.push(
      "governance case review decision selection receipt selection_receipt_ref must be an object"
    );
  } else if (payload.selection_receipt_ref.selection_status !== "selected") {
    errors.push(
      "governance case review decision selection receipt only supports selected current selection"
    );
  }
  if (!isPlainObject(payload.receipt_context)) {
    errors.push(
      "governance case review decision selection receipt context must be an object"
    );
  } else {
    if (
      payload.receipt_context.receipt_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_STATUS_RECORDED
    ) {
      errors.push(
        "governance case review decision selection receipt status drifted"
      );
    }
    if (
      typeof payload.receipt_context.current_review_decision_id !== "string" ||
      payload.receipt_context.current_review_decision_id.length === 0
    ) {
      errors.push(
        "governance case review decision selection receipt current_review_decision_id is required"
      );
    }
    if (
      typeof payload.receipt_context.review_decision_sequence !== "number" ||
      !Number.isInteger(payload.receipt_context.review_decision_sequence) ||
      payload.receipt_context.review_decision_sequence < 1
    ) {
      errors.push(
        "governance case review decision selection receipt review_decision_sequence must be a positive integer"
      );
    }
    if (
      typeof payload.receipt_context.continuity_mode !== "string" ||
      payload.receipt_context.continuity_mode.length === 0
    ) {
      errors.push(
        "governance case review decision selection receipt continuity_mode is required"
      );
    }
    if (
      !Array.isArray(payload.receipt_context.reason_codes) ||
      payload.receipt_context.reason_codes.length === 0 ||
      !hasUniqueStrings(payload.receipt_context.reason_codes)
    ) {
      errors.push(
        "governance case review decision selection receipt reason_codes are required and must remain unique"
      );
    }
    if (!isPlainObject(payload.receipt_context.receipt_inputs)) {
      errors.push(
        "governance case review decision selection receipt receipt_inputs must be an object"
      );
    }
  }
  if (!isPlainObject(payload.validation_exports)) {
    errors.push(
      "governance case review decision selection receipt validation_exports must be an object"
    );
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push(
      "governance case review decision selection receipt preserved_semantics must be an object"
    );
  } else {
    for (const field of [
      "supporting_artifact_only",
      "recommendation_only",
      "additive_only",
      "non_executing",
      "default_off",
    ]) {
      if (payload.preserved_semantics[field] !== true) {
        errors.push(
          `governance case review decision selection receipt preserved semantic drifted: ${field}`
        );
      }
    }
    for (const field of [
      "judgment_source_enabled",
      "authority_source_enabled",
      "selection_feedback_enabled",
      "main_path_takeover",
      "authority_scope_expansion",
      "governance_object_addition",
      "risk_integration",
      "ui_control_plane",
      "freeform_narrative_receipt",
    ]) {
      if (payload.preserved_semantics[field] !== false) {
        errors.push(
          `governance case review decision selection receipt preserved semantic drifted: ${field}`
        );
      }
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionSelectionReceiptProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionSelectionReceiptProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case review decision selection receipt profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
