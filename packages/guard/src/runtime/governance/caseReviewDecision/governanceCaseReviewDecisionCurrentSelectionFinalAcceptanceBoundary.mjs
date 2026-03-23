import {
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED,
  assertValidGovernanceCaseReviewDecisionCurrentSelectionProfile,
} from "./governanceCaseReviewDecisionCurrentSelectionProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_VERSION,
  assertValidGovernanceCaseReviewDecisionCurrentSelectionContract,
} from "./governanceCaseReviewDecisionCurrentSelectionContract.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile,
} from "./governanceCaseReviewDecisionCurrentSelectionSummaryProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_KIND =
  "governance_case_review_decision_current_selection_final_acceptance_boundary";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-current-selection-final-acceptance-boundary/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_STAGE =
  "governance_case_review_decision_current_selection_final_acceptance_phase3_v5_7_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_BOUNDARY =
  "governance_case_review_decision_current_selection_final_acceptance_boundary";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_current_selection_final_acceptance";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY =
  "release_ready_for_v5_7_0_review";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_current_selection_final_acceptance",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "release_target",
    "current_selection_profile_ref",
    "current_selection_contract_ref",
    "current_selection_summary_ref",
    "acceptance_scope",
    "final_acceptance_contract",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary",
    "validateGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary",
    "assertValidGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeOptionalString(value) {
  return value === undefined || value === null ? null : String(value);
}

function assertSelectionContractMatchesProfile(profile, contract) {
  const profileContext =
    profile.governance_case_review_decision_current_selection.selection_context;
  const contractRef = contract.current_selection_profile_ref;
  if (normalizeOptionalString(contractRef?.case_id) !== profileContext.case_id) {
    throw new Error(
      "governance case review decision current selection final acceptance mismatch: contract case_id must match the supplied current selection profile"
    );
  }
  if (contract.selection_status !== profileContext.selection_status) {
    throw new Error(
      "governance case review decision current selection final acceptance mismatch: contract selection_status must match the supplied current selection profile"
    );
  }
  if (
    normalizeOptionalString(contract.current_review_decision_id) !==
    normalizeOptionalString(profileContext.current_review_decision_id)
  ) {
    throw new Error(
      "governance case review decision current selection final acceptance mismatch: contract current_review_decision_id must match the supplied current selection profile"
    );
  }
  if (contract.canonical_action_hash !== profile.canonical_action_hash) {
    throw new Error(
      "governance case review decision current selection final acceptance mismatch: contract canonical_action_hash must match the supplied current selection profile"
    );
  }
}

function assertSummaryMatchesSelectionProfile(profile, summary) {
  const profileContext =
    profile.governance_case_review_decision_current_selection.selection_context;
  const summaryPayload =
    summary.governance_case_review_decision_current_selection_summary;
  const summaryRef = summaryPayload.selection_ref;
  const summaryContext = summaryPayload.summary_context;

  if (normalizeOptionalString(summaryRef.case_id) !== profileContext.case_id) {
    throw new Error(
      "governance case review decision current selection final acceptance mismatch: summary case_id must match the supplied current selection profile"
    );
  }
  if (summaryRef.selection_status !== profileContext.selection_status) {
    throw new Error(
      "governance case review decision current selection final acceptance mismatch: summary selection_status must match the supplied current selection profile"
    );
  }
  if (
    normalizeOptionalString(summaryRef.current_review_decision_id) !==
    normalizeOptionalString(profileContext.current_review_decision_id)
  ) {
    throw new Error(
      "governance case review decision current selection final acceptance mismatch: summary current_review_decision_id must match the supplied current selection profile"
    );
  }
  if (summary.canonical_action_hash !== profile.canonical_action_hash) {
    throw new Error(
      "governance case review decision current selection final acceptance mismatch: summary canonical_action_hash must match the supplied current selection profile"
    );
  }
  if (
    JSON.stringify(summaryContext.candidate_review_decision_ids) !==
    JSON.stringify(profileContext.candidate_review_decision_ids)
  ) {
    throw new Error(
      "governance case review decision current selection final acceptance mismatch: summary candidate ids must match the supplied current selection profile"
    );
  }
  if (
    JSON.stringify(summaryContext.conflict_review_decision_ids) !==
    JSON.stringify(profileContext.conflict_review_decision_ids)
  ) {
    throw new Error(
      "governance case review decision current selection final acceptance mismatch: summary conflict ids must match the supplied current selection profile"
    );
  }
}

export function buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary({
  governanceCaseReviewDecisionCurrentSelectionProfile,
  governanceCaseReviewDecisionCurrentSelectionContract,
  governanceCaseReviewDecisionCurrentSelectionSummaryProfile,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionCurrentSelectionProfile(
      governanceCaseReviewDecisionCurrentSelectionProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionCurrentSelectionContract(
      governanceCaseReviewDecisionCurrentSelectionContract
    );
  const summary =
    assertValidGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile(
      governanceCaseReviewDecisionCurrentSelectionSummaryProfile
    );
  assertSelectionContractMatchesProfile(profile, contract);
  assertSummaryMatchesSelectionProfile(profile, summary);

  const selectionContext =
    profile.governance_case_review_decision_current_selection.selection_context;
  const summaryContext =
    summary.governance_case_review_decision_current_selection_summary
      .summary_context;
  const selected =
    selectionContext.selection_status ===
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED;

  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_SCHEMA_ID,
    canonical_action_hash: profile.canonical_action_hash,
    governance_case_review_decision_current_selection_final_acceptance: {
      stage:
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_BOUNDARY,
      release_target: "v5.7.0",
      current_selection_profile_ref: {
        kind: GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_KIND,
        version:
          GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_VERSION,
        stage: GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_STAGE,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_BOUNDARY,
        source_surface:
          GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONSUMER_SURFACE,
        case_id: selectionContext.case_id,
        selection_status: selectionContext.selection_status,
        current_review_decision_id: selectionContext.current_review_decision_id,
      },
      current_selection_contract_ref: {
        kind: GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_KIND,
        version:
          GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_VERSION,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_BOUNDARY,
        case_id: selectionContext.case_id,
        selection_status: selectionContext.selection_status,
        current_review_decision_id: selectionContext.current_review_decision_id,
        canonical_action_hash: profile.canonical_action_hash,
      },
      current_selection_summary_ref: {
        kind:
          GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_KIND,
        version:
          GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_VERSION,
        stage:
          GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_STAGE,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_BOUNDARY,
        source_surface:
          GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_CONSUMER_SURFACE,
        case_id: selectionContext.case_id,
        selection_status: selectionContext.selection_status,
        current_review_decision_id: selectionContext.current_review_decision_id,
      },
      acceptance_scope: {
        case_id: selectionContext.case_id,
        selection_status: selectionContext.selection_status,
        current_review_decision_id: selectionContext.current_review_decision_id,
        conflict_review_decision_ids: selectionContext.conflict_review_decision_ids,
        current_selection_boundary_present: true,
        current_selection_summary_boundary_present: true,
        same_case_id_preserved: true,
        same_canonical_action_hash_preserved: true,
        superseded_exclusion_preserved: true,
        unique_terminal_candidate_preserved: true,
        explicit_conflict_preserved: true,
        deterministic_output_preserved: true,
        consumer_safe_summary_preserved: true,
        selected_state_supported:
          selected === true ||
          selectionContext.selection_status ===
            GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT,
        conflict_state_supported:
          summaryContext.conflict_detected === true || selected === true,
        current_selection_summary_current_review_decision:
          summaryContext.current_review_decision,
      },
      final_acceptance_contract: {
        readiness_level:
          GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
        current_selection_phase1_semantics_preserved: true,
        current_selection_phase2_summary_semantics_preserved: true,
        additive_only: true,
        recommendation_only: true,
        non_executing: true,
        default_off: true,
        execution_takeover: false,
        authority_scope_expansion: false,
        workflow_engine_emergence: false,
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
        main_path_takeover: false,
        governance_object_addition: false,
        risk_integration: false,
        ui_control_plane: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary(
  boundary
) {
  const errors = [];
  if (!isPlainObject(boundary)) {
    return {
      ok: false,
      errors: [
        "governance case review decision current selection final acceptance boundary must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(boundary)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision current selection final acceptance top-level field order drifted"
    );
  }
  if (
    boundary.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_KIND
  ) {
    errors.push(
      "governance case review decision current selection final acceptance kind drifted"
    );
  }
  if (
    boundary.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_VERSION
  ) {
    errors.push(
      "governance case review decision current selection final acceptance version drifted"
    );
  }
  if (
    boundary.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_SCHEMA_ID
  ) {
    errors.push(
      "governance case review decision current selection final acceptance schema drifted"
    );
  }
  if (
    typeof boundary.canonical_action_hash !== "string" ||
    boundary.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision current selection final acceptance canonical_action_hash is required"
    );
  }
  if (boundary.deterministic !== true) {
    errors.push(
      "governance case review decision current selection final acceptance determinism drifted"
    );
  }
  if (boundary.enforcing !== false) {
    errors.push(
      "governance case review decision current selection final acceptance enforcing drifted"
    );
  }

  const payload =
    boundary.governance_case_review_decision_current_selection_final_acceptance;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision current selection final acceptance payload must be an object"
    );
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision current selection final acceptance payload field order drifted"
    );
  }
  if (
    payload.stage !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_STAGE
  ) {
    errors.push(
      "governance case review decision current selection final acceptance stage drifted"
    );
  }
  if (
    payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_CONSUMER_SURFACE
  ) {
    errors.push(
      "governance case review decision current selection final acceptance consumer surface drifted"
    );
  }
  if (
    payload.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision current selection final acceptance boundary drifted"
    );
  }
  if (payload.release_target !== "v5.7.0") {
    errors.push(
      "governance case review decision current selection final acceptance release target drifted"
    );
  }
  for (const field of [
    "current_selection_profile_ref",
    "current_selection_contract_ref",
    "current_selection_summary_ref",
    "acceptance_scope",
    "final_acceptance_contract",
    "preserved_semantics",
  ]) {
    if (!isPlainObject(payload[field])) {
      errors.push(
        `governance case review decision current selection final acceptance ${field} must be an object`
      );
    }
  }
  if (
    isPlainObject(payload.current_selection_profile_ref) &&
    isPlainObject(payload.current_selection_contract_ref)
  ) {
    if (
      payload.current_selection_profile_ref.case_id !==
      payload.current_selection_contract_ref.case_id
    ) {
      errors.push(
        "governance case review decision current selection final acceptance contract/profile case_id drifted"
      );
    }
    if (
      payload.current_selection_profile_ref.selection_status !==
      payload.current_selection_contract_ref.selection_status
    ) {
      errors.push(
        "governance case review decision current selection final acceptance contract/profile selection_status drifted"
      );
    }
    if (
      normalizeOptionalString(
        payload.current_selection_profile_ref.current_review_decision_id
      ) !==
      normalizeOptionalString(
        payload.current_selection_contract_ref.current_review_decision_id
      )
    ) {
      errors.push(
        "governance case review decision current selection final acceptance contract/profile current_review_decision_id drifted"
      );
    }
    if (
      payload.current_selection_contract_ref.canonical_action_hash !==
      boundary.canonical_action_hash
    ) {
      errors.push(
        "governance case review decision current selection final acceptance contract/profile canonical_action_hash drifted"
      );
    }
  }
  if (
    isPlainObject(payload.current_selection_profile_ref) &&
    isPlainObject(payload.current_selection_summary_ref)
  ) {
    if (
      payload.current_selection_profile_ref.case_id !==
      payload.current_selection_summary_ref.case_id
    ) {
      errors.push(
        "governance case review decision current selection final acceptance summary/profile case_id drifted"
      );
    }
    if (
      payload.current_selection_profile_ref.selection_status !==
      payload.current_selection_summary_ref.selection_status
    ) {
      errors.push(
        "governance case review decision current selection final acceptance summary/profile selection_status drifted"
      );
    }
    if (
      normalizeOptionalString(
        payload.current_selection_profile_ref.current_review_decision_id
      ) !==
      normalizeOptionalString(
        payload.current_selection_summary_ref.current_review_decision_id
      )
    ) {
      errors.push(
        "governance case review decision current selection final acceptance summary/profile current_review_decision_id drifted"
      );
    }
  }
  if (isPlainObject(payload.acceptance_scope)) {
    const status = payload.acceptance_scope.selection_status;
    if (
      status !== GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED &&
      status !== GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT
    ) {
      errors.push(
        "governance case review decision current selection final acceptance selection_status drifted"
      );
    }
    for (const field of [
      "current_selection_boundary_present",
      "current_selection_summary_boundary_present",
      "same_case_id_preserved",
      "same_canonical_action_hash_preserved",
      "superseded_exclusion_preserved",
      "unique_terminal_candidate_preserved",
      "explicit_conflict_preserved",
      "deterministic_output_preserved",
      "consumer_safe_summary_preserved",
    ]) {
      if (payload.acceptance_scope[field] !== true) {
        errors.push(
          `governance case review decision current selection final acceptance scope field drifted: ${field}`
        );
      }
    }
    if (
      status === GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED &&
      !isPlainObject(
        payload.acceptance_scope.current_selection_summary_current_review_decision
      )
    ) {
      errors.push(
        "governance case review decision current selection final acceptance selected state requires current review decision summary"
      );
    }
    if (
      status === GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT &&
      payload.acceptance_scope.current_selection_summary_current_review_decision !==
        null
    ) {
      errors.push(
        "governance case review decision current selection final acceptance conflict state must not expose current review decision summary"
      );
    }
  }
  if (isPlainObject(payload.final_acceptance_contract)) {
    if (
      payload.final_acceptance_contract.readiness_level !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY
    ) {
      errors.push(
        "governance case review decision current selection final acceptance readiness drifted"
      );
    }
    for (const field of [
      "current_selection_phase1_semantics_preserved",
      "current_selection_phase2_summary_semantics_preserved",
      "additive_only",
      "recommendation_only",
      "non_executing",
      "default_off",
    ]) {
      if (payload.final_acceptance_contract[field] !== true) {
        errors.push(
          `governance case review decision current selection final acceptance contract field drifted: ${field}`
        );
      }
    }
    for (const field of [
      "execution_takeover",
      "authority_scope_expansion",
      "workflow_engine_emergence",
    ]) {
      if (payload.final_acceptance_contract[field] !== false) {
        errors.push(
          `governance case review decision current selection final acceptance contract field drifted: ${field}`
        );
      }
    }
  }
  if (isPlainObject(payload.preserved_semantics)) {
    if (payload.preserved_semantics.denied_exit_code_preserved !== 25) {
      errors.push(
        "governance case review decision current selection final acceptance denied exit drifted"
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
          `governance case review decision current selection final acceptance preserved semantics drifted: ${field}`
        );
      }
    }
    for (const field of [
      "main_path_takeover",
      "governance_object_addition",
      "risk_integration",
      "ui_control_plane",
    ]) {
      if (payload.preserved_semantics[field] !== false) {
        errors.push(
          `governance case review decision current selection final acceptance preserved semantics drifted: ${field}`
        );
      }
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary(
  boundary
) {
  const validation =
    validateGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary(
      boundary
    );
  if (validation.ok) return boundary;

  const err = new Error(
    `governance case review decision current selection final acceptance boundary invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
