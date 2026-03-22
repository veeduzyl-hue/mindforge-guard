import {
  GOVERNANCE_CASE_EVIDENCE_CONSUMER_SURFACE,
} from "../caseEvidence/governanceCaseEvidenceProfile.mjs";
import {
  GOVERNANCE_CASE_EVIDENCE_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_KIND,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_STAGE,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_VERSION,
  assertValidGovernanceCaseEvidenceProfile,
} from "../caseEvidence/governanceCaseEvidenceProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_KIND =
  "governance_case_review_decision_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_VERSION = "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_STAGE =
  "governance_case_review_decision_boundary_phase1_v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision";
export const GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_BOUNDARY =
  "governance_case_review_decision_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_STATUS_ACCEPTED = "accepted";
export const GOVERNANCE_CASE_REVIEW_DECISION_STATUS_REJECTED = "rejected";
export const GOVERNANCE_CASE_REVIEW_DECISION_STATUS_NEEDS_MORE_EVIDENCE =
  "needs_more_evidence";
export const GOVERNANCE_CASE_REVIEW_DECISION_STATUS_MAINTAIN_ESCALATION =
  "maintain_escalation";
export const GOVERNANCE_CASE_REVIEW_DECISION_STATUSES = Object.freeze([
  GOVERNANCE_CASE_REVIEW_DECISION_STATUS_ACCEPTED,
  GOVERNANCE_CASE_REVIEW_DECISION_STATUS_REJECTED,
  GOVERNANCE_CASE_REVIEW_DECISION_STATUS_NEEDS_MORE_EVIDENCE,
  GOVERNANCE_CASE_REVIEW_DECISION_STATUS_MAINTAIN_ESCALATION,
]);
export const GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_SUFFICIENT = "sufficient";
export const GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_INSUFFICIENT =
  "insufficient";
export const GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_INCONCLUSIVE =
  "inconclusive";
export const GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_SUFFICIENCY_LEVELS =
  Object.freeze([
    GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_SUFFICIENT,
    GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_INSUFFICIENT,
    GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_INCONCLUSIVE,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_case_review_decision",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_CASE_REVIEW_DECISION_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "evidence_ref",
  "review_decision_context",
  "validation_exports",
  "preserved_semantics",
]);
export const GOVERNANCE_CASE_REVIEW_DECISION_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_VERSION",
  "GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_SCHEMA_ID",
  "GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_STAGE",
  "GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE",
  "GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_BOUNDARY",
  "GOVERNANCE_CASE_REVIEW_DECISION_STATUS_ACCEPTED",
  "GOVERNANCE_CASE_REVIEW_DECISION_STATUS_REJECTED",
  "GOVERNANCE_CASE_REVIEW_DECISION_STATUS_NEEDS_MORE_EVIDENCE",
  "GOVERNANCE_CASE_REVIEW_DECISION_STATUS_MAINTAIN_ESCALATION",
  "GOVERNANCE_CASE_REVIEW_DECISION_STATUSES",
  "GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_SUFFICIENT",
  "GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_INSUFFICIENT",
  "GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_INCONCLUSIVE",
  "GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_SUFFICIENCY_LEVELS",
  "GOVERNANCE_CASE_REVIEW_DECISION_TOP_LEVEL_FIELDS",
  "GOVERNANCE_CASE_REVIEW_DECISION_PAYLOAD_FIELDS",
  "GOVERNANCE_CASE_REVIEW_DECISION_STABLE_EXPORT_SET",
  "buildGovernanceCaseReviewDecisionProfile",
  "validateGovernanceCaseReviewDecisionProfile",
  "assertValidGovernanceCaseReviewDecisionProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeStringArray(values, fallback) {
  if (!Array.isArray(values) || values.length === 0) return [fallback];
  return values.map((value) => String(value));
}

export function buildGovernanceCaseReviewDecisionProfile({
  governanceCaseEvidenceProfile,
  caseId,
  reviewDecisionId,
  reviewStatus = GOVERNANCE_CASE_REVIEW_DECISION_STATUS_NEEDS_MORE_EVIDENCE,
  evidenceSufficiency = GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_INCONCLUSIVE,
  reviewDecisionRationale = "review decision boundary documented without execution or workflow takeover",
  linkedEvidenceIds,
  linkedResolutionIds,
  linkedEscalationIds,
  linkedClosureIds,
  reviewDecisionRecordedAt = "2026-03-23T00:00:00.000Z",
  reviewDecisionRecordedBy = "governance_case_review_decision_reviewer",
} = {}) {
  const evidence = assertValidGovernanceCaseEvidenceProfile(
    governanceCaseEvidenceProfile
  );
  const context = evidence.governance_case_evidence.evidence_context;
  const normalizedCaseId = caseId ?? context.case_id;
  const normalizedReviewDecisionId =
    reviewDecisionId ?? `review-decision-${normalizedCaseId}`;

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_VERSION,
    schema_id: GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_SCHEMA_ID,
    canonical_action_hash: evidence.canonical_action_hash,
    governance_case_review_decision: {
      stage: GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_STAGE,
      consumer_surface: GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE,
      boundary: GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_BOUNDARY,
      evidence_ref: {
        kind: GOVERNANCE_CASE_EVIDENCE_PROFILE_KIND,
        version: GOVERNANCE_CASE_EVIDENCE_PROFILE_VERSION,
        stage: GOVERNANCE_CASE_EVIDENCE_PROFILE_STAGE,
        boundary: GOVERNANCE_CASE_EVIDENCE_PROFILE_BOUNDARY,
        source_surface: GOVERNANCE_CASE_EVIDENCE_CONSUMER_SURFACE,
      },
      review_decision_context: {
        case_id: normalizedCaseId,
        review_decision_id: normalizedReviewDecisionId,
        review_status: reviewStatus,
        evidence_sufficiency: evidenceSufficiency,
        review_decision_rationale: reviewDecisionRationale,
        linked_evidence_ids: Object.freeze(
          normalizeStringArray(linkedEvidenceIds, `evidence-${normalizedCaseId}`)
        ),
        linked_resolution_ids: Object.freeze(
          normalizeStringArray(
            linkedResolutionIds,
            context.linked_resolution_ids[0]
          )
        ),
        linked_escalation_ids: Object.freeze(
          normalizeStringArray(
            linkedEscalationIds,
            context.linked_escalation_ids[0]
          )
        ),
        linked_closure_ids: Object.freeze(
          normalizeStringArray(
            linkedClosureIds,
            context.linked_closure_ids[0]
          )
        ),
        review_decision_recorded_at: reviewDecisionRecordedAt,
        review_decision_recorded_by: reviewDecisionRecordedBy,
      },
      validation_exports: {
        consumer_available: true,
        validator_available: true,
        export_surface_available: true,
      },
      preserved_semantics: {
        review_decision_supporting_artifact_only: true,
        evidence_semantics_preserved: true,
        closure_semantics_preserved: true,
        escalation_semantics_preserved: true,
        resolution_semantics_preserved: true,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope_expansion: false,
        governance_object_addition: false,
        main_path_takeover: false,
        risk_integration: false,
        ui_control_plane: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseReviewDecisionProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["governance case review decision profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_CASE_REVIEW_DECISION_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance case review decision top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_KIND) {
    errors.push("governance case review decision kind drifted");
  }
  if (profile.version !== GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_VERSION) {
    errors.push("governance case review decision version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_SCHEMA_ID) {
    errors.push("governance case review decision schema drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance case review decision canonical action hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance case review decision must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("governance case review decision must remain non-enforcing");
  }
  const payload = profile.governance_case_review_decision;
  if (!isPlainObject(payload)) {
    errors.push("governance case review decision payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_CASE_REVIEW_DECISION_PAYLOAD_FIELDS)
  ) {
    errors.push("governance case review decision payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_STAGE) {
    errors.push("governance case review decision stage drifted");
  }
  if (
    payload.consumer_surface !== GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE
  ) {
    errors.push("governance case review decision consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_BOUNDARY) {
    errors.push("governance case review decision boundary drifted");
  }
  if (!isPlainObject(payload.evidence_ref)) {
    errors.push("governance case review decision evidence ref must be an object");
  }
  const context = payload.review_decision_context;
  if (!isPlainObject(context)) {
    errors.push("governance case review decision context must be an object");
  } else {
    if (typeof context.case_id !== "string" || context.case_id.length === 0) {
      errors.push("governance case review decision case_id is required");
    }
    if (
      typeof context.review_decision_id !== "string" ||
      context.review_decision_id.length === 0
    ) {
      errors.push("governance case review decision id is required");
    }
    if (!GOVERNANCE_CASE_REVIEW_DECISION_STATUSES.includes(context.review_status)) {
      errors.push("governance case review decision review_status drifted");
    }
    if (
      !GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_SUFFICIENCY_LEVELS.includes(
        context.evidence_sufficiency
      )
    ) {
      errors.push(
        "governance case review decision evidence_sufficiency drifted"
      );
    }
    if (
      typeof context.review_decision_rationale !== "string" ||
      context.review_decision_rationale.length === 0
    ) {
      errors.push("governance case review decision rationale is required");
    }
    if (
      !Array.isArray(context.linked_evidence_ids) ||
      context.linked_evidence_ids.length === 0
    ) {
      errors.push("governance case review decision linked evidence ids are required");
    }
    if (
      !Array.isArray(context.linked_resolution_ids) ||
      context.linked_resolution_ids.length === 0
    ) {
      errors.push("governance case review decision linked resolution ids are required");
    }
    if (
      !Array.isArray(context.linked_escalation_ids) ||
      context.linked_escalation_ids.length === 0
    ) {
      errors.push("governance case review decision linked escalation ids are required");
    }
    if (
      !Array.isArray(context.linked_closure_ids) ||
      context.linked_closure_ids.length === 0
    ) {
      errors.push("governance case review decision linked closure ids are required");
    }
    if (
      typeof context.review_decision_recorded_at !== "string" ||
      context.review_decision_recorded_at.length === 0
    ) {
      errors.push("governance case review decision recorded_at is required");
    }
    if (
      typeof context.review_decision_recorded_by !== "string" ||
      context.review_decision_recorded_by.length === 0
    ) {
      errors.push("governance case review decision recorded_by is required");
    }
  }
  if (!isPlainObject(payload.validation_exports)) {
    errors.push(
      "governance case review decision validation exports must be an object"
    );
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push(
      "governance case review decision preserved semantics must be an object"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionProfile(profile) {
  const validation = validateGovernanceCaseReviewDecisionProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case review decision profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
