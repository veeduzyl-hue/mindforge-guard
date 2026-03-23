import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_STATUS_AVAILABLE,
  assertValidGovernanceCaseReviewDecisionSelectionExplanationProfile,
} from "./governanceCaseReviewDecisionSelectionExplanationProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_VERSION,
  assertValidGovernanceCaseReviewDecisionSelectionExplanationContract,
} from "./governanceCaseReviewDecisionSelectionExplanationContract.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_KIND =
  "governance_case_review_decision_selection_explanation_final_acceptance_boundary";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-selection-explanation-final-acceptance-boundary/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_STAGE =
  "governance_case_review_decision_selection_explanation_final_acceptance_phase3_v5_8_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_BOUNDARY =
  "governance_case_review_decision_selection_explanation_final_acceptance_boundary";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_selection_explanation_final_acceptance";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_READY =
  "release_ready_for_v5_8_0_review";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_selection_explanation_final_acceptance",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "release_target",
    "selection_explanation_profile_ref",
    "selection_explanation_contract_ref",
    "acceptance_scope",
    "final_acceptance_contract",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_READY",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary",
    "validateGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary",
    "assertValidGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeOptionalString(value) {
  return value === undefined || value === null ? null : String(value);
}

export function buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary({
  governanceCaseReviewDecisionSelectionExplanationProfile,
  governanceCaseReviewDecisionSelectionExplanationContract,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionSelectionExplanationProfile(
      governanceCaseReviewDecisionSelectionExplanationProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionSelectionExplanationContract(
      governanceCaseReviewDecisionSelectionExplanationContract
    );
  const payload = profile.governance_case_review_decision_selection_explanation;
  const selectionRef = payload.selection_ref;
  const explanationContext = payload.explanation_context;

  if (
    contract.selection_explanation_profile_ref.case_id !== selectionRef.case_id
  ) {
    throw new Error(
      "governance case review decision selection explanation final acceptance mismatch: contract case_id must match explanation profile"
    );
  }
  if (
    normalizeOptionalString(
      contract.selection_explanation_profile_ref.current_review_decision_id
    ) !== normalizeOptionalString(selectionRef.current_review_decision_id)
  ) {
    throw new Error(
      "governance case review decision selection explanation final acceptance mismatch: contract current_review_decision_id must match explanation profile"
    );
  }
  if (contract.canonical_action_hash !== profile.canonical_action_hash) {
    throw new Error(
      "governance case review decision selection explanation final acceptance mismatch: contract canonical_action_hash must match explanation profile"
    );
  }
  if (
    contract.explanation_status !== explanationContext.explanation_status ||
    contract.current_review_decision_id !==
      explanationContext.current_review_decision_id
  ) {
    throw new Error(
      "governance case review decision selection explanation final acceptance mismatch: contract explanation context must match explanation profile"
    );
  }

  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SCHEMA_ID,
    canonical_action_hash: profile.canonical_action_hash,
    governance_case_review_decision_selection_explanation_final_acceptance: {
      stage:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_BOUNDARY,
      release_target: "v5.8.0",
      selection_explanation_profile_ref: {
        kind: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_KIND,
        version:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_VERSION,
        stage:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_STAGE,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_BOUNDARY,
        source_surface:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONSUMER_SURFACE,
        case_id: selectionRef.case_id,
        selection_status: selectionRef.selection_status,
        current_review_decision_id: selectionRef.current_review_decision_id,
      },
      selection_explanation_contract_ref: {
        kind: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_KIND,
        version:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_VERSION,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_BOUNDARY,
        case_id: selectionRef.case_id,
        selection_status: selectionRef.selection_status,
        current_review_decision_id: selectionRef.current_review_decision_id,
        canonical_action_hash: profile.canonical_action_hash,
      },
      acceptance_scope: {
        case_id: selectionRef.case_id,
        selection_status: selectionRef.selection_status,
        current_review_decision_id: selectionRef.current_review_decision_id,
        explanation_status: explanationContext.explanation_status,
        reason_codes: explanationContext.reason_codes,
        review_decision_sequence:
          explanationContext.review_decision_sequence,
        continuity_mode: explanationContext.continuity_mode,
        supersedes_review_decision_id:
          explanationContext.supersedes_review_decision_id,
        selected_current_selection_required: true,
        explanation_available_only_when_eligible: true,
        supporting_artifact_only: true,
        additive_only: true,
        non_executing: true,
        bounded_reason_codes_only: true,
      },
      final_acceptance_contract: {
        readiness_level:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_READY,
        explanation_phase1_semantics_preserved: true,
        explanation_phase2_hardening_semantics_preserved: true,
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
        freeform_explanation: false,
        ranking_scoring_engine: false,
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

export function validateGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary(
  boundary
) {
  const errors = [];
  if (!isPlainObject(boundary)) {
    return {
      ok: false,
      errors: [
        "governance case review decision selection explanation final acceptance boundary must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(boundary)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision selection explanation final acceptance top-level field order drifted"
    );
  }
  if (
    boundary.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_KIND
  ) {
    errors.push(
      "governance case review decision selection explanation final acceptance kind drifted"
    );
  }
  if (
    boundary.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_VERSION
  ) {
    errors.push(
      "governance case review decision selection explanation final acceptance version drifted"
    );
  }
  if (
    boundary.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SCHEMA_ID
  ) {
    errors.push(
      "governance case review decision selection explanation final acceptance schema drifted"
    );
  }
  if (
    typeof boundary.canonical_action_hash !== "string" ||
    boundary.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision selection explanation final acceptance canonical_action_hash is required"
    );
  }
  if (boundary.deterministic !== true) {
    errors.push(
      "governance case review decision selection explanation final acceptance determinism drifted"
    );
  }
  if (boundary.enforcing !== false) {
    errors.push(
      "governance case review decision selection explanation final acceptance enforcing drifted"
    );
  }

  const payload =
    boundary.governance_case_review_decision_selection_explanation_final_acceptance;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision selection explanation final acceptance payload must be an object"
    );
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision selection explanation final acceptance payload field order drifted"
    );
  }
  if (
    payload.stage !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_STAGE
  ) {
    errors.push(
      "governance case review decision selection explanation final acceptance stage drifted"
    );
  }
  if (
    payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_CONSUMER_SURFACE
  ) {
    errors.push(
      "governance case review decision selection explanation final acceptance consumer surface drifted"
    );
  }
  if (
    payload.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision selection explanation final acceptance boundary drifted"
    );
  }
  if (payload.release_target !== "v5.8.0") {
    errors.push(
      "governance case review decision selection explanation final acceptance release target drifted"
    );
  }
  for (const field of [
    "selection_explanation_profile_ref",
    "selection_explanation_contract_ref",
    "acceptance_scope",
    "final_acceptance_contract",
    "preserved_semantics",
  ]) {
    if (!isPlainObject(payload[field])) {
      errors.push(
        `governance case review decision selection explanation final acceptance ${field} must be an object`
      );
    }
  }
  if (
    isPlainObject(payload.selection_explanation_profile_ref) &&
    isPlainObject(payload.selection_explanation_contract_ref)
  ) {
    if (
      payload.selection_explanation_profile_ref.case_id !==
      payload.selection_explanation_contract_ref.case_id
    ) {
      errors.push(
        "governance case review decision selection explanation final acceptance contract/profile case_id drifted"
      );
    }
    if (
      payload.selection_explanation_profile_ref.selection_status !==
      payload.selection_explanation_contract_ref.selection_status
    ) {
      errors.push(
        "governance case review decision selection explanation final acceptance contract/profile selection_status drifted"
      );
    }
    if (
      normalizeOptionalString(
        payload.selection_explanation_profile_ref.current_review_decision_id
      ) !==
      normalizeOptionalString(
        payload.selection_explanation_contract_ref.current_review_decision_id
      )
    ) {
      errors.push(
        "governance case review decision selection explanation final acceptance contract/profile current_review_decision_id drifted"
      );
    }
    if (
      payload.selection_explanation_contract_ref.canonical_action_hash !==
      boundary.canonical_action_hash
    ) {
      errors.push(
        "governance case review decision selection explanation final acceptance contract/profile canonical_action_hash drifted"
      );
    }
  }
  if (isPlainObject(payload.acceptance_scope)) {
    if (payload.acceptance_scope.selection_status !== "selected") {
      errors.push(
        "governance case review decision selection explanation final acceptance selection_status drifted"
      );
    }
    if (
      payload.acceptance_scope.explanation_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_STATUS_AVAILABLE
    ) {
      errors.push(
        "governance case review decision selection explanation final acceptance explanation_status drifted"
      );
    }
    for (const field of [
      "selected_current_selection_required",
      "explanation_available_only_when_eligible",
      "supporting_artifact_only",
      "additive_only",
      "non_executing",
      "bounded_reason_codes_only",
    ]) {
      if (payload.acceptance_scope[field] !== true) {
        errors.push(
          `governance case review decision selection explanation final acceptance scope field drifted: ${field}`
        );
      }
    }
    if (
      !Array.isArray(payload.acceptance_scope.reason_codes) ||
      payload.acceptance_scope.reason_codes.length === 0
    ) {
      errors.push(
        "governance case review decision selection explanation final acceptance reason_codes are required"
      );
    }
  }
  if (isPlainObject(payload.final_acceptance_contract)) {
    if (
      payload.final_acceptance_contract.readiness_level !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_READY
    ) {
      errors.push(
        "governance case review decision selection explanation final acceptance readiness drifted"
      );
    }
    for (const field of [
      "explanation_phase1_semantics_preserved",
      "explanation_phase2_hardening_semantics_preserved",
      "recommendation_only",
      "additive_only",
      "non_executing",
      "default_off",
    ]) {
      if (payload.final_acceptance_contract[field] !== true) {
        errors.push(
          `governance case review decision selection explanation final acceptance contract field drifted: ${field}`
        );
      }
    }
    for (const field of [
      "freeform_explanation",
      "ranking_scoring_engine",
      "judgment_source_enabled",
      "authority_source_enabled",
      "selection_feedback_enabled",
      "main_path_takeover",
    ]) {
      if (payload.final_acceptance_contract[field] !== false) {
        errors.push(
          `governance case review decision selection explanation final acceptance contract field drifted: ${field}`
        );
      }
    }
  }
  if (isPlainObject(payload.preserved_semantics)) {
    if (payload.preserved_semantics.denied_exit_code_preserved !== 25) {
      errors.push(
        "governance case review decision selection explanation final acceptance denied exit drifted"
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
      if (payload.preserved_semantics[field] !== true) {
        errors.push(
          `governance case review decision selection explanation final acceptance preserved semantics drifted: ${field}`
        );
      }
    }
    for (const field of [
      "authority_scope_expansion",
      "governance_object_addition",
      "risk_integration",
      "ui_control_plane",
    ]) {
      if (payload.preserved_semantics[field] !== false) {
        errors.push(
          `governance case review decision selection explanation final acceptance preserved semantics drifted: ${field}`
        );
      }
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary(
  boundary
) {
  const validation =
    validateGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary(
      boundary
    );
  if (validation.ok) return boundary;

  const err = new Error(
    `governance case review decision selection explanation final acceptance boundary invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
