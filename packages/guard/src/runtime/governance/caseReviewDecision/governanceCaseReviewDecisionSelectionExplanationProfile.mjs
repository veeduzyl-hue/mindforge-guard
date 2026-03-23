import {
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED,
  assertValidGovernanceCaseReviewDecisionCurrentSelectionProfile,
} from "./governanceCaseReviewDecisionCurrentSelectionProfile.mjs";
import { assertValidGovernanceCaseReviewDecisionCurrentSelectionContract } from "./governanceCaseReviewDecisionCurrentSelectionContract.mjs";
import { assertValidGovernanceCaseReviewDecisionProfile } from "./governanceCaseReviewDecisionProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_KIND =
  "governance_case_review_decision_selection_explanation_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-selection-explanation-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_STAGE =
  "governance_case_review_decision_selection_explanation_boundary_phase1_v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_selection_explanation";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_BOUNDARY =
  "governance_case_review_decision_selection_explanation_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_STATUS_AVAILABLE =
  "available";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SAME_CASE_BOUNDED =
  "same_case_id_bounded";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED =
  "same_canonical_action_hash_bounded";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SUPERSEDED_EXCLUDED =
  "superseded_decisions_excluded";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_UNIQUE_TERMINAL_SELECTED =
  "unique_terminal_candidate_selected";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SEQUENCE_CONTINUITY_PRESERVED =
  "sequence_continuity_preserved";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_DETERMINISTIC_SELECTION_PRESERVED =
  "deterministic_selection_preserved";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CONTINUITY_CHAIN_RESOLVED =
  "continuity_chain_resolved";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_STANDALONE_SELECTION_CONFIRMED =
  "standalone_selection_confirmed";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CODES =
  Object.freeze([
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SAME_CASE_BOUNDED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SUPERSEDED_EXCLUDED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_UNIQUE_TERMINAL_SELECTED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SEQUENCE_CONTINUITY_PRESERVED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_DETERMINISTIC_SELECTION_PRESERVED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CONTINUITY_CHAIN_RESOLVED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_STANDALONE_SELECTION_CONFIRMED,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_selection_explanation",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "selection_ref",
    "explanation_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_STATUS_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SAME_CASE_BOUNDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SUPERSEDED_EXCLUDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_UNIQUE_TERMINAL_SELECTED",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SEQUENCE_CONTINUITY_PRESERVED",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_DETERMINISTIC_SELECTION_PRESERVED",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CONTINUITY_CHAIN_RESOLVED",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_STANDALONE_SELECTION_CONFIRMED",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionSelectionExplanationProfile",
    "validateGovernanceCaseReviewDecisionSelectionExplanationProfile",
    "assertValidGovernanceCaseReviewDecisionSelectionExplanationProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasUniqueStrings(values) {
  return Array.isArray(values) && new Set(values).size === values.length;
}

function ensureAllReasonCodesKnown(reasonCodes) {
  return (
    Array.isArray(reasonCodes) &&
    reasonCodes.every((code) =>
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CODES.includes(
        code
      )
    )
  );
}

function ensureSelectionExplanationSupport(selectionProfile, selectionContract) {
  const selectionContext =
    selectionProfile.governance_case_review_decision_current_selection
      .selection_context;

  if (selectionProfile.deterministic !== true || selectionProfile.enforcing !== false) {
    throw new Error(
      "governance case review decision selection explanation insufficient support: current selection profile must remain deterministic and non-enforcing"
    );
  }
  if (
    selectionContract.deterministic_output_required !== true ||
    selectionContract.same_case_required !== true ||
    selectionContract.same_canonical_action_hash_required !== true ||
    selectionContract.superseded_excluded !== true ||
    selectionContract.unique_terminal_candidate_required !== true ||
    selectionContract.explicit_conflict_required !== true ||
    selectionContract.sequence_continuity_required !== true ||
    selectionContract.continuity_supported !== true
  ) {
    throw new Error(
      "governance case review decision selection explanation insufficient support: current selection contract must remain fully hardened"
    );
  }
  if (
    !Array.isArray(selectionContext.candidate_review_decision_ids) ||
    !selectionContext.candidate_review_decision_ids.includes(
      selectionContext.current_review_decision_id
    )
  ) {
    throw new Error(
      "governance case review decision selection explanation insufficient support: selected review decision must remain within candidate scope"
    );
  }
  if (
    !Array.isArray(selectionContext.terminal_review_decision_ids) ||
    selectionContext.terminal_review_decision_ids.length !== 1 ||
    selectionContext.terminal_review_decision_ids[0] !==
      selectionContext.current_review_decision_id
  ) {
    throw new Error(
      "governance case review decision selection explanation conflict or ambiguity: selected review decision must remain the unique terminal candidate"
    );
  }
}

export function buildGovernanceCaseReviewDecisionSelectionExplanationProfile({
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
      "governance case review decision selection explanation requires review decision profiles"
    );
  }

  const reviewProfiles = governanceCaseReviewDecisionProfiles.map((profile) =>
    assertValidGovernanceCaseReviewDecisionProfile(profile)
  );
  const selectionContext =
    selectionProfile.governance_case_review_decision_current_selection
      .selection_context;

  if (
    selectionContext.selection_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED
  ) {
    throw new Error(
      "governance case review decision selection explanation only supports current selection status 'selected'"
    );
  }
  if (
    selectionContract.selection_status !== selectionContext.selection_status ||
    selectionContract.current_review_decision_id !==
      selectionContext.current_review_decision_id ||
    selectionContract.canonical_action_hash !==
      selectionProfile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision selection explanation mismatch: selection contract must remain aligned to selection profile"
    );
  }
  ensureSelectionExplanationSupport(selectionProfile, selectionContract);

  const currentProfile = reviewProfiles.find((profile) => {
    const context = profile.governance_case_review_decision.review_decision_context;
    return (
      context.case_id === selectionContext.case_id &&
      profile.canonical_action_hash === selectionProfile.canonical_action_hash &&
      context.review_decision_id === selectionContext.current_review_decision_id
    );
  });

  if (!currentProfile) {
    throw new Error(
      "governance case review decision selection explanation mismatch: current selected review decision profile is required"
    );
  }

  const currentContext =
    currentProfile.governance_case_review_decision.review_decision_context;
  if (
    currentContext.continuity_mode === "superseded" ||
    currentContext.superseded_by_review_decision_id !== null
  ) {
    throw new Error(
      "governance case review decision selection explanation insufficient support: superseded decisions must never receive explanation artifacts"
    );
  }
  const reasonCodes = [
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SAME_CASE_BOUNDED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SUPERSEDED_EXCLUDED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_UNIQUE_TERMINAL_SELECTED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SEQUENCE_CONTINUITY_PRESERVED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_DETERMINISTIC_SELECTION_PRESERVED,
  ];
  if (
    currentContext.continuity_mode === "superseding" ||
    currentContext.continuity_mode === "superseded"
  ) {
    reasonCodes.push(
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CONTINUITY_CHAIN_RESOLVED
    );
  } else {
    reasonCodes.push(
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_STANDALONE_SELECTION_CONFIRMED
    );
  }
  const orderedReasonCodes =
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CODE_ALLOWLIST.filter(
      (code) => reasonCodes.includes(code)
    );

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_SCHEMA_ID,
    canonical_action_hash: selectionProfile.canonical_action_hash,
    governance_case_review_decision_selection_explanation: {
      stage:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_BOUNDARY,
      selection_ref: {
        case_id: selectionContext.case_id,
        selection_status: selectionContext.selection_status,
        current_review_decision_id: selectionContext.current_review_decision_id,
      },
      explanation_context: {
        explanation_status:
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_STATUS_AVAILABLE,
        current_review_decision_id: currentContext.review_decision_id,
        review_decision_sequence: currentContext.review_decision_sequence ?? 1,
        continuity_mode: currentContext.continuity_mode ?? "standalone",
        supersedes_review_decision_id:
          currentContext.supersedes_review_decision_id ?? null,
        reason_codes: Object.freeze(orderedReasonCodes),
      },
      validation_exports: {
        current_selection_profile_available: true,
        current_selection_contract_available: true,
        review_decision_profile_available: true,
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
        freeform_explanation: false,
        ranking_scoring_engine: false,
        judgment_source_enabled: false,
        selection_feedback_enabled: false,
      },
    },
    deterministic: selectionProfile.deterministic === true,
    enforcing: false,
  };
}

export function validateGovernanceCaseReviewDecisionSelectionExplanationProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision selection explanation profile must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision selection explanation top-level field order drifted"
    );
  }
  if (
    profile.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_KIND
  ) {
    errors.push(
      "governance case review decision selection explanation kind drifted"
    );
  }
  if (
    profile.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_VERSION
  ) {
    errors.push(
      "governance case review decision selection explanation version drifted"
    );
  }
  if (
    profile.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_SCHEMA_ID
  ) {
    errors.push(
      "governance case review decision selection explanation schema drifted"
    );
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision selection explanation canonical_action_hash is required"
    );
  }
  if (profile.deterministic !== true) {
    errors.push(
      "governance case review decision selection explanation must remain deterministic"
    );
  }
  if (profile.enforcing !== false) {
    errors.push(
      "governance case review decision selection explanation must remain non-enforcing"
    );
  }

  const payload = profile.governance_case_review_decision_selection_explanation;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision selection explanation payload must be an object"
    );
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision selection explanation payload field order drifted"
    );
  }
  if (
    payload.stage !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_STAGE
  ) {
    errors.push(
      "governance case review decision selection explanation stage drifted"
    );
  }
  if (
    payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONSUMER_SURFACE
  ) {
    errors.push(
      "governance case review decision selection explanation consumer surface drifted"
    );
  }
  if (
    payload.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision selection explanation boundary drifted"
    );
  }
  if (!isPlainObject(payload.selection_ref)) {
    errors.push(
      "governance case review decision selection explanation selection_ref must be an object"
    );
  } else if (
    payload.selection_ref.selection_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED
  ) {
    errors.push(
      "governance case review decision selection explanation only supports selected current selection"
    );
  }
  if (!isPlainObject(payload.explanation_context)) {
    errors.push(
      "governance case review decision selection explanation context must be an object"
    );
  } else {
    if (
      payload.explanation_context.explanation_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_STATUS_AVAILABLE
    ) {
      errors.push(
        "governance case review decision selection explanation status drifted"
      );
    }
    if (
      typeof payload.explanation_context.current_review_decision_id !== "string" ||
      payload.explanation_context.current_review_decision_id.length === 0
    ) {
      errors.push(
        "governance case review decision selection explanation current_review_decision_id is required"
      );
    }
    if (
      typeof payload.explanation_context.review_decision_sequence !== "number" ||
      !Number.isInteger(payload.explanation_context.review_decision_sequence) ||
      payload.explanation_context.review_decision_sequence < 1
    ) {
      errors.push(
        "governance case review decision selection explanation review_decision_sequence must be a positive integer"
      );
    }
    if (
      typeof payload.explanation_context.continuity_mode !== "string" ||
      payload.explanation_context.continuity_mode.length === 0
    ) {
      errors.push(
        "governance case review decision selection explanation continuity_mode is required"
      );
    }
    if (
      !ensureAllReasonCodesKnown(payload.explanation_context.reason_codes) ||
      !hasUniqueStrings(payload.explanation_context.reason_codes) ||
      JSON.stringify(payload.explanation_context.reason_codes) !==
        JSON.stringify(
          GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CODE_ALLOWLIST.filter(
            (code) =>
              payload.explanation_context.reason_codes.includes(code)
          )
        )
    ) {
      errors.push(
        "governance case review decision selection explanation reason codes drifted"
      );
    }
  }
  if (!isPlainObject(payload.validation_exports)) {
    errors.push(
      "governance case review decision selection explanation validation exports must be an object"
    );
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push(
      "governance case review decision selection explanation preserved semantics must be an object"
    );
  } else {
    if (payload.preserved_semantics.freeform_explanation !== false) {
      errors.push(
        "governance case review decision selection explanation must remain non-freeform"
      );
    }
    if (payload.preserved_semantics.ranking_scoring_engine !== false) {
      errors.push(
        "governance case review decision selection explanation must not introduce ranking or scoring"
      );
    }
    if (payload.preserved_semantics.judgment_source_enabled !== false) {
      errors.push(
        "governance case review decision selection explanation must not become a judgment source"
      );
    }
    if (payload.preserved_semantics.selection_feedback_enabled !== false) {
      errors.push(
        "governance case review decision selection explanation must not feed back into current selection"
      );
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionSelectionExplanationProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionSelectionExplanationProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case review decision selection explanation profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
