import {
  APPROVAL_ARTIFACT_BOUNDARY,
  APPROVAL_ARTIFACT_KIND,
  APPROVAL_ARTIFACT_VERSION,
  APPROVAL_CONSUMER_SURFACE,
  assertValidApprovalArtifactProfile,
} from "./profile.mjs";

export const APPROVAL_READINESS_KIND = "approval_readiness_profile";
export const APPROVAL_READINESS_VERSION = "v1";
export const APPROVAL_READINESS_SCHEMA_ID = "mindforge/approval-readiness/v1";
export const APPROVAL_READINESS_STAGE = "approval_readiness_phase2_v1";
export const APPROVAL_READINESS_BOUNDARY =
  "waiver_override_receipt_readiness_contract";
export const APPROVAL_READINESS_READY = "ready";
export const APPROVAL_READINESS_CONSUMER_COMPATIBLE = "consumer_compatible";
export const APPROVAL_READINESS_LEVELS = Object.freeze([
  APPROVAL_READINESS_READY,
  APPROVAL_READINESS_CONSUMER_COMPATIBLE,
]);
export const APPROVAL_READINESS_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "approval_readiness",
  "deterministic",
  "enforcing",
]);
export const APPROVAL_READINESS_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "approval_ref",
  "waiver_contract",
  "override_record",
  "consumer_contract",
]);
export const APPROVAL_READINESS_STABLE_EXPORT_SET = Object.freeze([
  "APPROVAL_READINESS_KIND",
  "APPROVAL_READINESS_VERSION",
  "APPROVAL_READINESS_SCHEMA_ID",
  "APPROVAL_READINESS_STAGE",
  "APPROVAL_READINESS_BOUNDARY",
  "APPROVAL_READINESS_READY",
  "APPROVAL_READINESS_CONSUMER_COMPATIBLE",
  "APPROVAL_READINESS_LEVELS",
  "APPROVAL_READINESS_TOP_LEVEL_FIELDS",
  "APPROVAL_READINESS_PAYLOAD_FIELDS",
  "APPROVAL_READINESS_STABLE_EXPORT_SET",
  "buildApprovalReadinessProfile",
  "validateApprovalReadinessProfile",
  "assertValidApprovalReadinessProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildApprovalReadinessProfile({ approvalArtifactProfile }) {
  const approval = assertValidApprovalArtifactProfile(approvalArtifactProfile);
  const payload = approval.approval_artifact;

  return {
    kind: APPROVAL_READINESS_KIND,
    version: APPROVAL_READINESS_VERSION,
    schema_id: APPROVAL_READINESS_SCHEMA_ID,
    canonical_action_hash: approval.canonical_action_hash,
    approval_readiness: {
      stage: APPROVAL_READINESS_STAGE,
      consumer_surface: APPROVAL_CONSUMER_SURFACE,
      boundary: APPROVAL_READINESS_BOUNDARY,
      approval_ref: {
        kind: APPROVAL_ARTIFACT_KIND,
        version: APPROVAL_ARTIFACT_VERSION,
        boundary: APPROVAL_ARTIFACT_BOUNDARY,
      },
      waiver_contract: {
        readiness: APPROVAL_READINESS_READY,
        available: payload.approval_profile.waiver_contract_available,
        recommendation_only: true,
        additive_only: true,
        execution_enabled: false,
      },
      override_record: {
        readiness: APPROVAL_READINESS_READY,
        contract_kind: "approval_override_record",
        available: true,
        executing: false,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
      },
      consumer_contract: {
        readiness: APPROVAL_READINESS_CONSUMER_COMPATIBLE,
        exception_contract_available:
          payload.approval_profile.exception_contract_available,
        consumer_ready: payload.approval_profile.consumer_ready,
        override_execution_available:
          payload.approval_profile.override_execution_available,
        denied_exit_code_preserved: 25,
        authority_scope: "review_gate_deny_exit_recommendation_only",
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateApprovalReadinessProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["approval readiness must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(APPROVAL_READINESS_TOP_LEVEL_FIELDS)
  ) {
    errors.push("approval readiness top-level field order drifted");
  }
  if (profile.kind !== APPROVAL_READINESS_KIND) {
    errors.push("approval readiness kind drifted");
  }
  if (profile.version !== APPROVAL_READINESS_VERSION) {
    errors.push("approval readiness version drifted");
  }
  if (profile.schema_id !== APPROVAL_READINESS_SCHEMA_ID) {
    errors.push("approval readiness schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("approval readiness canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("approval readiness must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("approval readiness must remain non-enforcing");
  }
  if (!isPlainObject(profile.approval_readiness)) {
    errors.push("approval readiness payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.approval_readiness;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(APPROVAL_READINESS_PAYLOAD_FIELDS)
  ) {
    errors.push("approval readiness payload field order drifted");
  }
  if (payload.stage !== APPROVAL_READINESS_STAGE) {
    errors.push("approval readiness stage drifted");
  }
  if (payload.consumer_surface !== APPROVAL_CONSUMER_SURFACE) {
    errors.push("approval readiness consumer surface drifted");
  }
  if (payload.boundary !== APPROVAL_READINESS_BOUNDARY) {
    errors.push("approval readiness boundary drifted");
  }
  if (!isPlainObject(payload.approval_ref)) {
    errors.push("approval readiness approval_ref must be an object");
  } else {
    if (payload.approval_ref.kind !== APPROVAL_ARTIFACT_KIND) {
      errors.push("approval readiness approval kind drifted");
    }
    if (payload.approval_ref.version !== APPROVAL_ARTIFACT_VERSION) {
      errors.push("approval readiness approval version drifted");
    }
    if (payload.approval_ref.boundary !== APPROVAL_ARTIFACT_BOUNDARY) {
      errors.push("approval readiness approval boundary drifted");
    }
  }
  if (!isPlainObject(payload.waiver_contract)) {
    errors.push("approval readiness waiver contract must be an object");
  } else {
    if (payload.waiver_contract.readiness !== APPROVAL_READINESS_READY) {
      errors.push("approval readiness waiver readiness drifted");
    }
    if (payload.waiver_contract.available !== true) {
      errors.push("approval readiness waiver availability drifted");
    }
    if (payload.waiver_contract.recommendation_only !== true) {
      errors.push("approval readiness waiver recommendation boundary drifted");
    }
    if (payload.waiver_contract.additive_only !== true) {
      errors.push("approval readiness waiver additive boundary drifted");
    }
    if (payload.waiver_contract.execution_enabled !== false) {
      errors.push("approval readiness waiver execution boundary drifted");
    }
  }
  if (!isPlainObject(payload.override_record)) {
    errors.push("approval readiness override record must be an object");
  } else {
    if (payload.override_record.readiness !== APPROVAL_READINESS_READY) {
      errors.push("approval readiness override readiness drifted");
    }
    if (payload.override_record.contract_kind !== "approval_override_record") {
      errors.push("approval readiness override contract kind drifted");
    }
    if (payload.override_record.available !== true) {
      errors.push("approval readiness override availability drifted");
    }
    if (payload.override_record.executing !== false) {
      errors.push("approval readiness override executing boundary drifted");
    }
    if (payload.override_record.audit_output_preserved !== true) {
      errors.push("approval readiness override audit output boundary drifted");
    }
    if (payload.override_record.audit_verdict_preserved !== true) {
      errors.push("approval readiness override audit verdict boundary drifted");
    }
    if (payload.override_record.actual_exit_code_preserved !== true) {
      errors.push("approval readiness override exit boundary drifted");
    }
  }
  if (!isPlainObject(payload.consumer_contract)) {
    errors.push("approval readiness consumer contract must be an object");
  } else {
    if (
      payload.consumer_contract.readiness !==
      APPROVAL_READINESS_CONSUMER_COMPATIBLE
    ) {
      errors.push("approval readiness consumer compatibility drifted");
    }
    if (payload.consumer_contract.exception_contract_available !== true) {
      errors.push("approval readiness exception availability drifted");
    }
    if (payload.consumer_contract.consumer_ready !== true) {
      errors.push("approval readiness consumer readiness drifted");
    }
    if (payload.consumer_contract.override_execution_available !== false) {
      errors.push("approval readiness override execution drifted");
    }
    if (payload.consumer_contract.denied_exit_code_preserved !== 25) {
      errors.push("approval readiness deny exit code drifted");
    }
    if (
      payload.consumer_contract.authority_scope !==
      "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("approval readiness authority scope drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidApprovalReadinessProfile(profile) {
  const validation = validateApprovalReadinessProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `approval readiness invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
