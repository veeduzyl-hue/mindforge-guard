import { selectGovernanceCaseReviewDecisionCurrent } from "./selectGovernanceCaseReviewDecisionCurrent.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_KIND =
  "governance_case_review_decision_current_selection_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-current-selection-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_STAGE =
  "governance_case_review_decision_current_selection_boundary_phase1_v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_current_selection";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_BOUNDARY =
  "governance_case_review_decision_current_selection_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED =
  "selected";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT =
  "conflict";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUSES =
  Object.freeze([
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED,
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_current_selection",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "selection_scope",
    "selection_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUSES",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionCurrentSelectionProfile",
    "validateGovernanceCaseReviewDecisionCurrentSelectionProfile",
    "assertValidGovernanceCaseReviewDecisionCurrentSelectionProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
  governanceCaseReviewDecisionProfiles,
}) {
  const selection = selectGovernanceCaseReviewDecisionCurrent({
    governanceCaseReviewDecisionProfiles,
  });

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_SCHEMA_ID,
    canonical_action_hash: selection.canonical_action_hash,
    governance_case_review_decision_current_selection: {
      stage: GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_BOUNDARY,
      selection_scope: {
        case_id_bounded: true,
        canonical_action_hash_bounded: true,
        superseded_excluded: true,
        unique_terminal_candidate_required: true,
        deterministic_output_required: true,
      },
      selection_context: {
        case_id: selection.case_id,
        selection_status: selection.selection_status,
        candidate_review_decision_ids: selection.candidate_review_decision_ids,
        terminal_review_decision_ids: selection.terminal_review_decision_ids,
        current_review_decision_id: selection.current_review_decision_id,
        conflict_review_decision_ids: selection.conflict_review_decision_ids,
      },
      validation_exports: {
        selector_available: true,
        contract_available: true,
        export_surface_available: true,
      },
      preserved_semantics: {
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
        authority_scope_expansion: false,
        main_path_takeover: false,
        governance_object_addition: false,
        risk_integration: false,
        ui_control_plane: false,
      },
    },
    deterministic: selection.deterministic === true,
    enforcing: false,
  };
}

export function validateGovernanceCaseReviewDecisionCurrentSelectionProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision current selection profile must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision current selection top-level field order drifted"
    );
  }
  if (profile.kind !== GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_KIND) {
    errors.push("governance case review decision current selection kind drifted");
  }
  if (
    profile.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_VERSION
  ) {
    errors.push(
      "governance case review decision current selection version drifted"
    );
  }
  if (
    profile.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_SCHEMA_ID
  ) {
    errors.push(
      "governance case review decision current selection schema drifted"
    );
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision current selection canonical_action_hash is required"
    );
  }
  if (profile.deterministic !== true) {
    errors.push(
      "governance case review decision current selection must remain deterministic"
    );
  }
  if (profile.enforcing !== false) {
    errors.push(
      "governance case review decision current selection must remain non-enforcing"
    );
  }

  const payload = profile.governance_case_review_decision_current_selection;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision current selection payload must be an object"
    );
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision current selection payload field order drifted"
    );
  }
  if (
    payload.stage !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_STAGE
  ) {
    errors.push(
      "governance case review decision current selection stage drifted"
    );
  }
  if (
    payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONSUMER_SURFACE
  ) {
    errors.push(
      "governance case review decision current selection consumer surface drifted"
    );
  }
  if (
    payload.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision current selection boundary drifted"
    );
  }
  if (!isPlainObject(payload.selection_scope)) {
    errors.push(
      "governance case review decision current selection scope must be an object"
    );
  }
  const context = payload.selection_context;
  if (!isPlainObject(context)) {
    errors.push(
      "governance case review decision current selection context must be an object"
    );
  } else {
    if (typeof context.case_id !== "string" || context.case_id.length === 0) {
      errors.push(
        "governance case review decision current selection case_id is required"
      );
    }
    if (
      !GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUSES.includes(
        context.selection_status
      )
    ) {
      errors.push(
        "governance case review decision current selection status drifted"
      );
    }
    if (
      !Array.isArray(context.candidate_review_decision_ids) ||
      context.candidate_review_decision_ids.length === 0
    ) {
      errors.push(
        "governance case review decision current selection candidate ids are required"
      );
    }
    if (!Array.isArray(context.terminal_review_decision_ids)) {
      errors.push(
        "governance case review decision current selection terminal ids must be an array"
      );
    }
    if (!Array.isArray(context.conflict_review_decision_ids)) {
      errors.push(
        "governance case review decision current selection conflict ids must be an array"
      );
    }
    if (
      context.selection_status ===
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED &&
      (typeof context.current_review_decision_id !== "string" ||
        context.current_review_decision_id.length === 0)
    ) {
      errors.push(
        "governance case review decision current selection selected status requires current_review_decision_id"
      );
    }
    if (
      context.selection_status ===
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT &&
      context.current_review_decision_id !== null
    ) {
      errors.push(
        "governance case review decision current selection conflict status must not choose a current decision"
      );
    }
  }
  if (!isPlainObject(payload.validation_exports)) {
    errors.push(
      "governance case review decision current selection validation exports must be an object"
    );
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push(
      "governance case review decision current selection preserved semantics must be an object"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionCurrentSelectionProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionCurrentSelectionProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case review decision current selection profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
