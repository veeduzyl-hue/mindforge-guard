import {
  JUDGMENT_CLASS_ALLOW,
  JUDGMENT_CLASS_DENY_RECOMMENDATION,
  JUDGMENT_CLASS_INSUFFICIENT_SIGNAL,
  JUDGMENT_CLASS_REVIEW_RECOMMENDATION,
  JUDGMENT_PROFILE_CONSUMER_SURFACE,
  assertValidJudgmentProfile,
} from "../judgment/profile.mjs";
import {
  JUDGMENT_FINAL_ACCEPTANCE_BOUNDARY,
  assertValidJudgmentStabilizationProfile,
} from "../judgment/stabilization.mjs";

export const APPROVAL_ARTIFACT_KIND = "approval_artifact_profile";
export const APPROVAL_ARTIFACT_VERSION = "v1";
export const APPROVAL_ARTIFACT_SCHEMA_ID = "mindforge/approval-artifact/v1";
export const APPROVAL_ARTIFACT_STAGE = "approval_artifact_phase1_v1";
export const APPROVAL_CONSUMER_SURFACE = "guard.audit.approval_adjacent";
export const APPROVAL_ARTIFACT_BOUNDARY =
  "approval_adjacent_exception_contract_only";
export const APPROVAL_EXCEPTION_CONTRACT_KIND = "approval_exception_contract";
export const APPROVAL_EXCEPTION_CONTRACT_VERSION = "v1";
export const APPROVAL_EXCEPTION_CONTRACT_BOUNDARY =
  "non_executing_recommendation_only_exception_contract";
export const APPROVAL_STATUS_NOT_REQUESTED = "not_requested";
export const APPROVAL_STATUS_EXCEPTION_POSSIBLE = "exception_possible";
export const APPROVAL_STATUS_APPROVAL_REQUIRED = "approval_required";
export const APPROVAL_STATUSES = Object.freeze([
  APPROVAL_STATUS_NOT_REQUESTED,
  APPROVAL_STATUS_EXCEPTION_POSSIBLE,
  APPROVAL_STATUS_APPROVAL_REQUIRED,
]);
export const APPROVAL_ARTIFACT_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "approval_artifact",
  "deterministic",
  "enforcing",
]);
export const APPROVAL_ARTIFACT_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "source_surface",
  "judgment_refs",
  "approval_profile",
  "exception_contract",
  "readiness_refs",
]);
export const APPROVAL_ARTIFACT_STABLE_EXPORT_SET = Object.freeze([
  "APPROVAL_ARTIFACT_KIND",
  "APPROVAL_ARTIFACT_VERSION",
  "APPROVAL_ARTIFACT_SCHEMA_ID",
  "APPROVAL_ARTIFACT_STAGE",
  "APPROVAL_CONSUMER_SURFACE",
  "APPROVAL_ARTIFACT_BOUNDARY",
  "APPROVAL_EXCEPTION_CONTRACT_KIND",
  "APPROVAL_EXCEPTION_CONTRACT_VERSION",
  "APPROVAL_EXCEPTION_CONTRACT_BOUNDARY",
  "APPROVAL_STATUS_NOT_REQUESTED",
  "APPROVAL_STATUS_EXCEPTION_POSSIBLE",
  "APPROVAL_STATUS_APPROVAL_REQUIRED",
  "APPROVAL_STATUSES",
  "APPROVAL_ARTIFACT_TOP_LEVEL_FIELDS",
  "APPROVAL_ARTIFACT_PAYLOAD_FIELDS",
  "APPROVAL_ARTIFACT_STABLE_EXPORT_SET",
  "buildApprovalArtifactProfile",
  "validateApprovalArtifactProfile",
  "assertValidApprovalArtifactProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function toApprovalStatus(judgmentClass) {
  switch (judgmentClass) {
    case JUDGMENT_CLASS_ALLOW:
      return APPROVAL_STATUS_NOT_REQUESTED;
    case JUDGMENT_CLASS_REVIEW_RECOMMENDATION:
    case JUDGMENT_CLASS_DENY_RECOMMENDATION:
      return APPROVAL_STATUS_APPROVAL_REQUIRED;
    default:
      return APPROVAL_STATUS_EXCEPTION_POSSIBLE;
  }
}

export function buildApprovalArtifactProfile({
  judgmentProfile,
  judgmentStabilizationProfile,
}) {
  const profile = assertValidJudgmentProfile(judgmentProfile);
  const stabilization = assertValidJudgmentStabilizationProfile(
    judgmentStabilizationProfile
  );

  if (profile.canonical_action_hash !== stabilization.canonical_action_hash) {
    throw new Error(
      "approval artifact requires matching canonical action hashes"
    );
  }

  const unifiedClass = profile.judgment_profile.unified_judgment.class;

  return {
    kind: APPROVAL_ARTIFACT_KIND,
    version: APPROVAL_ARTIFACT_VERSION,
    schema_id: APPROVAL_ARTIFACT_SCHEMA_ID,
    canonical_action_hash: profile.canonical_action_hash,
    approval_artifact: {
      stage: APPROVAL_ARTIFACT_STAGE,
      consumer_surface: APPROVAL_CONSUMER_SURFACE,
      boundary: APPROVAL_ARTIFACT_BOUNDARY,
      source_surface: JUDGMENT_PROFILE_CONSUMER_SURFACE,
      judgment_refs: {
        judgment_class: unifiedClass,
        judgment_final_acceptance_boundary: JUDGMENT_FINAL_ACCEPTANCE_BOUNDARY,
        recommendation_only:
          stabilization.judgment_stabilization.final_consumer_contract
            .recommendation_only,
      },
      approval_profile: {
        approval_status: toApprovalStatus(unifiedClass),
        consumer_ready: true,
        exception_contract_available: true,
        waiver_contract_available: true,
        override_execution_available: false,
      },
      exception_contract: {
        kind: APPROVAL_EXCEPTION_CONTRACT_KIND,
        version: APPROVAL_EXCEPTION_CONTRACT_VERSION,
        boundary: APPROVAL_EXCEPTION_CONTRACT_BOUNDARY,
        recommendation_only: true,
        additive_only: true,
        actual_authority_execution: false,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope: "review_gate_deny_exit_recommendation_only",
      },
      readiness_refs: {
        readiness_profile_available: true,
        approval_receipt_available: true,
        override_record_contract: "approval_override_record",
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateApprovalArtifactProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["approval artifact must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(APPROVAL_ARTIFACT_TOP_LEVEL_FIELDS)
  ) {
    errors.push("approval artifact top-level field order drifted");
  }
  if (profile.kind !== APPROVAL_ARTIFACT_KIND) {
    errors.push("approval artifact kind drifted");
  }
  if (profile.version !== APPROVAL_ARTIFACT_VERSION) {
    errors.push("approval artifact version drifted");
  }
  if (profile.schema_id !== APPROVAL_ARTIFACT_SCHEMA_ID) {
    errors.push("approval artifact schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("approval artifact canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("approval artifact must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("approval artifact must remain non-enforcing");
  }
  if (!isPlainObject(profile.approval_artifact)) {
    errors.push("approval artifact payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.approval_artifact;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(APPROVAL_ARTIFACT_PAYLOAD_FIELDS)
  ) {
    errors.push("approval artifact payload field order drifted");
  }
  if (payload.stage !== APPROVAL_ARTIFACT_STAGE) {
    errors.push("approval artifact stage drifted");
  }
  if (payload.consumer_surface !== APPROVAL_CONSUMER_SURFACE) {
    errors.push("approval consumer surface drifted");
  }
  if (payload.boundary !== APPROVAL_ARTIFACT_BOUNDARY) {
    errors.push("approval artifact boundary drifted");
  }
  if (payload.source_surface !== JUDGMENT_PROFILE_CONSUMER_SURFACE) {
    errors.push("approval source surface drifted");
  }
  if (!isPlainObject(payload.judgment_refs)) {
    errors.push("approval judgment refs must be an object");
  } else {
    if (!APPROVAL_STATUSES.includes(toApprovalStatus(payload.judgment_refs.judgment_class))) {
      errors.push("approval judgment class mapping drifted");
    }
    if (
      payload.judgment_refs.judgment_final_acceptance_boundary !==
      JUDGMENT_FINAL_ACCEPTANCE_BOUNDARY
    ) {
      errors.push("approval final acceptance boundary drifted");
    }
    if (payload.judgment_refs.recommendation_only !== true) {
      errors.push("approval must remain recommendation-only");
    }
  }
  if (!isPlainObject(payload.approval_profile)) {
    errors.push("approval profile section must be an object");
  } else {
    if (!APPROVAL_STATUSES.includes(payload.approval_profile.approval_status)) {
      errors.push("approval status drifted");
    }
    if (payload.approval_profile.consumer_ready !== true) {
      errors.push("approval consumer readiness drifted");
    }
    if (payload.approval_profile.exception_contract_available !== true) {
      errors.push("approval exception contract availability drifted");
    }
    if (payload.approval_profile.waiver_contract_available !== true) {
      errors.push("approval waiver contract availability drifted");
    }
    if (payload.approval_profile.override_execution_available !== false) {
      errors.push("approval override execution availability drifted");
    }
  }
  if (!isPlainObject(payload.exception_contract)) {
    errors.push("approval exception contract must be an object");
  } else {
    if (payload.exception_contract.kind !== APPROVAL_EXCEPTION_CONTRACT_KIND) {
      errors.push("approval exception contract kind drifted");
    }
    if (
      payload.exception_contract.version !== APPROVAL_EXCEPTION_CONTRACT_VERSION
    ) {
      errors.push("approval exception contract version drifted");
    }
    if (
      payload.exception_contract.boundary !==
      APPROVAL_EXCEPTION_CONTRACT_BOUNDARY
    ) {
      errors.push("approval exception contract boundary drifted");
    }
    if (payload.exception_contract.recommendation_only !== true) {
      errors.push("approval exception contract must remain recommendation-only");
    }
    if (payload.exception_contract.additive_only !== true) {
      errors.push("approval exception contract must remain additive-only");
    }
    if (payload.exception_contract.actual_authority_execution !== false) {
      errors.push("approval exception contract must remain non-executing");
    }
    if (payload.exception_contract.audit_output_preserved !== true) {
      errors.push("approval exception contract must preserve audit output");
    }
    if (payload.exception_contract.audit_verdict_preserved !== true) {
      errors.push("approval exception contract must preserve audit verdict");
    }
    if (payload.exception_contract.actual_exit_code_preserved !== true) {
      errors.push("approval exception contract must preserve actual exit code");
    }
    if (payload.exception_contract.denied_exit_code_preserved !== 25) {
      errors.push("approval exception contract deny exit code drifted");
    }
    if (
      payload.exception_contract.authority_scope !==
      "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("approval exception contract authority scope drifted");
    }
  }
  if (!isPlainObject(payload.readiness_refs)) {
    errors.push("approval readiness refs must be an object");
  } else {
    if (payload.readiness_refs.readiness_profile_available !== true) {
      errors.push("approval readiness profile availability drifted");
    }
    if (payload.readiness_refs.approval_receipt_available !== true) {
      errors.push("approval receipt availability drifted");
    }
    if (
      payload.readiness_refs.override_record_contract !==
      "approval_override_record"
    ) {
      errors.push("approval override record contract drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidApprovalArtifactProfile(profile) {
  const validation = validateApprovalArtifactProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `approval artifact invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
