import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_VERSION,
  assertValidGovernanceCaseReviewDecisionContract,
} from "./governanceCaseReviewDecisionContract.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODES,
  GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionProfile,
} from "./governanceCaseReviewDecisionProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_KIND =
  "governance_case_review_decision_final_acceptance_boundary";
export const GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_VERSION = "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-final-acceptance-boundary/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_STAGE =
  "governance_case_review_decision_final_acceptance_phase3_v5_6_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_BOUNDARY =
  "governance_case_review_decision_final_acceptance_boundary";
export const GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_final_acceptance";
export const GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_READY =
  "release_ready_for_v5_6_0_review";
export const GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_final_acceptance",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "release_target",
    "review_decision_profile_ref",
    "review_decision_contract_ref",
    "continuity_acceptance",
    "final_acceptance_contract",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_READY",
    "GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionFinalAcceptanceBoundary",
    "validateGovernanceCaseReviewDecisionFinalAcceptanceBoundary",
    "assertValidGovernanceCaseReviewDecisionFinalAcceptanceBoundary",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeOptionalString(value) {
  return value === undefined || value === null ? null : String(value);
}

export function buildGovernanceCaseReviewDecisionFinalAcceptanceBoundary({
  governanceCaseReviewDecisionProfile,
  governanceCaseReviewDecisionContract,
}) {
  const profile = assertValidGovernanceCaseReviewDecisionProfile(
    governanceCaseReviewDecisionProfile
  );
  const contract = assertValidGovernanceCaseReviewDecisionContract(
    governanceCaseReviewDecisionContract
  );
  const context = profile.governance_case_review_decision.review_decision_context;
  const continuityMode =
    context.continuity_mode ??
    GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE;
  const reviewDecisionSequence =
    context.review_decision_sequence === undefined
      ? 1
      : context.review_decision_sequence;
  const supersedesReviewDecisionId = normalizeOptionalString(
    context.supersedes_review_decision_id
  );
  const supersededByReviewDecisionId = normalizeOptionalString(
    context.superseded_by_review_decision_id
  );
  const currentEffectiveDecision =
    contract.current_effective_decision ??
    (continuityMode !== GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED &&
      supersededByReviewDecisionId === null);

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_VERSION,
    schema_id: GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_SCHEMA_ID,
    canonical_action_hash: profile.canonical_action_hash,
    governance_case_review_decision_final_acceptance: {
      stage: GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
      boundary: GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_BOUNDARY,
      release_target: "v5.6.0",
      review_decision_profile_ref: {
        kind: GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_KIND,
        version: GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_VERSION,
        stage: GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_STAGE,
        boundary: GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_BOUNDARY,
        source_surface: GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE,
        review_decision_id: context.review_decision_id,
      },
      review_decision_contract_ref: {
        kind: GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_KIND,
        version: GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_VERSION,
        boundary: GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_BOUNDARY,
      },
      continuity_acceptance: {
        case_id: context.case_id,
        review_decision_id: context.review_decision_id,
        continuity_mode: continuityMode,
        review_decision_sequence: reviewDecisionSequence,
        supersedes_review_decision_id: supersedesReviewDecisionId,
        superseded_by_review_decision_id: supersededByReviewDecisionId,
        current_effective_decision: currentEffectiveDecision,
        linked_evidence_ids: context.linked_evidence_ids,
        linked_resolution_ids: context.linked_resolution_ids,
        linked_escalation_ids: context.linked_escalation_ids,
        linked_closure_ids: context.linked_closure_ids,
        old_artifact_compatibility_preserved: true,
        bounded_continuity_mode_semantics: true,
        bounded_supersession_invariants: true,
        additive_only_continuity: true,
        recommendation_only_continuity: true,
        non_executing_continuity: true,
        default_off_continuity: true,
      },
      final_acceptance_contract: {
        readiness_level: GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_READY,
        review_decision_boundary_present: true,
        continuity_phase1_semantics_preserved: true,
        continuity_phase2_stabilization_preserved: true,
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

export function validateGovernanceCaseReviewDecisionFinalAcceptanceBoundary(
  boundary
) {
  const errors = [];
  if (!isPlainObject(boundary)) {
    return {
      ok: false,
      errors: [
        "governance case review decision final acceptance boundary must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(boundary)) !==
    JSON.stringify(GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS)
  ) {
    errors.push(
      "governance case review decision final acceptance top-level field order drifted"
    );
  }
  if (boundary.kind !== GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_KIND) {
    errors.push("governance case review decision final acceptance kind drifted");
  }
  if (
    boundary.version !== GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_VERSION
  ) {
    errors.push(
      "governance case review decision final acceptance version drifted"
    );
  }
  if (
    boundary.schema_id !== GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_SCHEMA_ID
  ) {
    errors.push("governance case review decision final acceptance schema drifted");
  }
  if (
    typeof boundary.canonical_action_hash !== "string" ||
    boundary.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision final acceptance canonical action hash is required"
    );
  }
  if (boundary.deterministic !== true) {
    errors.push(
      "governance case review decision final acceptance determinism drifted"
    );
  }
  if (boundary.enforcing !== false) {
    errors.push(
      "governance case review decision final acceptance enforcing drifted"
    );
  }

  const payload = boundary.governance_case_review_decision_final_acceptance;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision final acceptance payload must be an object"
    );
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision final acceptance payload field order drifted"
    );
  }
  if (payload.stage !== GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_STAGE) {
    errors.push("governance case review decision final acceptance stage drifted");
  }
  if (
    payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_CONSUMER_SURFACE
  ) {
    errors.push(
      "governance case review decision final acceptance consumer surface drifted"
    );
  }
  if (
    payload.boundary !== GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision final acceptance boundary drifted"
    );
  }
  if (payload.release_target !== "v5.6.0") {
    errors.push(
      "governance case review decision final acceptance release target drifted"
    );
  }
  if (!isPlainObject(payload.review_decision_profile_ref)) {
    errors.push(
      "governance case review decision final acceptance profile ref missing"
    );
  }
  if (!isPlainObject(payload.review_decision_contract_ref)) {
    errors.push(
      "governance case review decision final acceptance contract ref missing"
    );
  }
  if (!isPlainObject(payload.continuity_acceptance)) {
    errors.push(
      "governance case review decision final acceptance continuity acceptance missing"
    );
  } else {
    if (
      typeof payload.continuity_acceptance.case_id !== "string" ||
      payload.continuity_acceptance.case_id.length === 0
    ) {
      errors.push(
        "governance case review decision final acceptance case_id is required"
      );
    }
    if (
      typeof payload.continuity_acceptance.review_decision_id !== "string" ||
      payload.continuity_acceptance.review_decision_id.length === 0
    ) {
      errors.push(
        "governance case review decision final acceptance review_decision_id is required"
      );
    }
    if (
      !GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODES.includes(
        payload.continuity_acceptance.continuity_mode
      )
    ) {
      errors.push(
        "governance case review decision final acceptance continuity_mode drifted"
      );
    }
    if (
      !Number.isInteger(payload.continuity_acceptance.review_decision_sequence) ||
      payload.continuity_acceptance.review_decision_sequence < 1
    ) {
      errors.push(
        "governance case review decision final acceptance review_decision_sequence drifted"
      );
    }
    for (const field of [
      "linked_evidence_ids",
      "linked_resolution_ids",
      "linked_escalation_ids",
      "linked_closure_ids",
    ]) {
      if (
        !Array.isArray(payload.continuity_acceptance[field]) ||
        payload.continuity_acceptance[field].length === 0
      ) {
        errors.push(
          `governance case review decision final acceptance ${field} are required`
        );
      }
    }
    for (const field of [
      "old_artifact_compatibility_preserved",
      "bounded_continuity_mode_semantics",
      "bounded_supersession_invariants",
      "additive_only_continuity",
      "recommendation_only_continuity",
      "non_executing_continuity",
      "default_off_continuity",
    ]) {
      if (payload.continuity_acceptance[field] !== true) {
        errors.push(
          `governance case review decision final acceptance continuity field drifted: ${field}`
        );
      }
    }
    if (
      payload.continuity_acceptance.continuity_mode ===
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING &&
      payload.continuity_acceptance.supersedes_review_decision_id === null
    ) {
      errors.push(
        "governance case review decision final acceptance superseding linkage drifted"
      );
    }
    if (
      payload.continuity_acceptance.continuity_mode ===
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED &&
      payload.continuity_acceptance.current_effective_decision !== false
    ) {
      errors.push(
        "governance case review decision final acceptance superseded current/effective drifted"
      );
    }
    if (
      payload.continuity_acceptance.continuity_mode ===
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL &&
      payload.continuity_acceptance.current_effective_decision !== true
    ) {
      errors.push(
        "governance case review decision final acceptance parallel current/effective drifted"
      );
    }
  }
  if (!isPlainObject(payload.final_acceptance_contract)) {
    errors.push(
      "governance case review decision final acceptance contract must be an object"
    );
  } else {
    if (
      payload.final_acceptance_contract.readiness_level !==
      GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_READY
    ) {
      errors.push(
        "governance case review decision final acceptance readiness drifted"
      );
    }
    for (const field of [
      "review_decision_boundary_present",
      "continuity_phase1_semantics_preserved",
      "continuity_phase2_stabilization_preserved",
      "additive_only",
      "recommendation_only",
      "non_executing",
      "default_off",
    ]) {
      if (payload.final_acceptance_contract[field] !== true) {
        errors.push(
          `governance case review decision final acceptance contract field drifted: ${field}`
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
          `governance case review decision final acceptance contract field drifted: ${field}`
        );
      }
    }
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push(
      "governance case review decision final acceptance preserved semantics must be an object"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionFinalAcceptanceBoundary(
  boundary
) {
  const validation =
    validateGovernanceCaseReviewDecisionFinalAcceptanceBoundary(boundary);
  if (validation.ok) return boundary;

  const err = new Error(
    `governance case review decision final acceptance boundary invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
