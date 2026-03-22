import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE,
  assertValidGovernanceCaseReviewDecisionProfile,
} from "./governanceCaseReviewDecisionProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED,
  assertValidGovernanceCaseReviewDecisionCurrentSelectionProfile,
} from "./governanceCaseReviewDecisionCurrentSelectionProfile.mjs";
import { assertValidGovernanceCaseReviewDecisionCurrentSelectionContract } from "./governanceCaseReviewDecisionCurrentSelectionContract.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_KIND =
  "governance_case_review_decision_current_selection_summary_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-current-selection-summary-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_STAGE =
  "governance_case_review_decision_current_selection_consumption_phase2_v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_current_selection_summary";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_BOUNDARY =
  "governance_case_review_decision_current_selection_summary_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_current_selection_summary",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "selection_ref",
    "summary_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile",
    "validateGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile",
    "assertValidGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getContext(profile) {
  return profile.governance_case_review_decision.review_decision_context;
}

function buildCurrentReviewDecisionSummary(profile) {
  const context = getContext(profile);
  return Object.freeze({
    review_decision_id: context.review_decision_id,
    review_status: context.review_status,
    evidence_sufficiency: context.evidence_sufficiency,
    review_decision_sequence: context.review_decision_sequence ?? 1,
    continuity_mode: context.continuity_mode ?? "standalone",
    consumer_surface: GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE,
  });
}

export function buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile({
  governanceCaseReviewDecisionCurrentSelectionProfile,
  governanceCaseReviewDecisionCurrentSelectionContract,
  governanceCaseReviewDecisionProfiles,
}) {
  const selectionProfile =
    assertValidGovernanceCaseReviewDecisionCurrentSelectionProfile(
      governanceCaseReviewDecisionCurrentSelectionProfile
    );
  const selectionContract =
    assertValidGovernanceCaseReviewDecisionCurrentSelectionContract(
      governanceCaseReviewDecisionCurrentSelectionContract
    );
  if (
    !Array.isArray(governanceCaseReviewDecisionProfiles) ||
    governanceCaseReviewDecisionProfiles.length === 0
  ) {
    throw new Error(
      "governance case review decision current selection summary requires review decision profiles"
    );
  }

  const reviewProfiles = governanceCaseReviewDecisionProfiles.map((profile) =>
    assertValidGovernanceCaseReviewDecisionProfile(profile)
  );
  const selectionContext =
    selectionProfile.governance_case_review_decision_current_selection
      .selection_context;
  const selectionCaseId = selectionContext.case_id;
  const selectionHash = selectionProfile.canonical_action_hash;
  const currentReviewDecisionId = selectionContext.current_review_decision_id;
  const selectionStatus = selectionContext.selection_status;

  let currentReviewDecisionSummary = null;
  if (selectionStatus === GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED) {
    const matches = reviewProfiles.filter((profile) => {
      const context = getContext(profile);
      return (
        context.case_id === selectionCaseId &&
        profile.canonical_action_hash === selectionHash &&
        context.review_decision_id === currentReviewDecisionId
      );
    });
    if (matches.length !== 1) {
      throw new Error(
        "governance case review decision current selection summary mismatch: selected review decision must resolve to exactly one bounded review decision profile"
      );
    }
    currentReviewDecisionSummary = buildCurrentReviewDecisionSummary(matches[0]);
  }

  if (
    selectionContract.selection_status !== selectionStatus ||
    selectionContract.current_review_decision_id !== currentReviewDecisionId ||
    selectionContract.canonical_action_hash !== selectionHash
  ) {
    throw new Error(
      "governance case review decision current selection summary mismatch: selection contract must remain aligned to selection profile"
    );
  }

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_SCHEMA_ID,
    canonical_action_hash: selectionHash,
    governance_case_review_decision_current_selection_summary: {
      stage:
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_BOUNDARY,
      selection_ref: {
        case_id: selectionCaseId,
        selection_status: selectionStatus,
        current_review_decision_id: currentReviewDecisionId,
      },
      summary_context: {
        case_id: selectionCaseId,
        selection_status: selectionStatus,
        conflict_detected:
          selectionStatus ===
          GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT,
        current_review_decision: currentReviewDecisionSummary,
        conflict_review_decision_ids:
          selectionContext.conflict_review_decision_ids,
        candidate_review_decision_ids:
          selectionContext.candidate_review_decision_ids,
      },
      validation_exports: {
        selection_profile_available: true,
        selection_contract_available: true,
        consumer_available: true,
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
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision current selection summary profile must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision current selection summary top-level field order drifted"
    );
  }
  if (
    profile.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_KIND
  ) {
    errors.push(
      "governance case review decision current selection summary kind drifted"
    );
  }
  if (
    profile.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_VERSION
  ) {
    errors.push(
      "governance case review decision current selection summary version drifted"
    );
  }
  if (
    profile.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_SCHEMA_ID
  ) {
    errors.push(
      "governance case review decision current selection summary schema drifted"
    );
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision current selection summary canonical_action_hash is required"
    );
  }
  if (profile.deterministic !== true) {
    errors.push(
      "governance case review decision current selection summary must remain deterministic"
    );
  }
  if (profile.enforcing !== false) {
    errors.push(
      "governance case review decision current selection summary must remain non-enforcing"
    );
  }
  const payload =
    profile.governance_case_review_decision_current_selection_summary;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision current selection summary payload must be an object"
    );
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision current selection summary payload field order drifted"
    );
  }
  if (
    payload.stage !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_STAGE
  ) {
    errors.push(
      "governance case review decision current selection summary stage drifted"
    );
  }
  if (
    payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_CONSUMER_SURFACE
  ) {
    errors.push(
      "governance case review decision current selection summary consumer surface drifted"
    );
  }
  if (
    payload.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision current selection summary boundary drifted"
    );
  }
  if (!isPlainObject(payload.selection_ref)) {
    errors.push(
      "governance case review decision current selection summary selection_ref must be an object"
    );
  }
  const context = payload.summary_context;
  if (!isPlainObject(context)) {
    errors.push(
      "governance case review decision current selection summary context must be an object"
    );
  } else {
    if (typeof context.case_id !== "string" || context.case_id.length === 0) {
      errors.push(
        "governance case review decision current selection summary case_id is required"
      );
    }
    if (
      context.selection_status !==
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED &&
      context.selection_status !==
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT
    ) {
      errors.push(
        "governance case review decision current selection summary selection_status drifted"
      );
    }
    if (
      !Array.isArray(context.conflict_review_decision_ids) ||
      !Array.isArray(context.candidate_review_decision_ids)
    ) {
      errors.push(
        "governance case review decision current selection summary ids must remain arrays"
      );
    }
    if (
      context.selection_status ===
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED &&
      !isPlainObject(context.current_review_decision)
    ) {
      errors.push(
        "governance case review decision current selection summary selected status requires current_review_decision"
      );
    }
    if (
      context.selection_status ===
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT &&
      context.current_review_decision !== null
    ) {
      errors.push(
        "governance case review decision current selection summary conflict status must not expose a current review decision"
      );
    }
  }
  if (!isPlainObject(payload.validation_exports)) {
    errors.push(
      "governance case review decision current selection summary validation exports must be an object"
    );
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push(
      "governance case review decision current selection summary preserved semantics must be an object"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case review decision current selection summary profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
