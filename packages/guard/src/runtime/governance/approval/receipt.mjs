import {
  APPROVAL_ARTIFACT_KIND,
  APPROVAL_ARTIFACT_VERSION,
  APPROVAL_CONSUMER_SURFACE,
  assertValidApprovalArtifactProfile,
} from "./profile.mjs";
import {
  APPROVAL_READINESS_BOUNDARY,
  APPROVAL_READINESS_CONSUMER_COMPATIBLE,
  APPROVAL_READINESS_KIND,
  APPROVAL_READINESS_STAGE,
  APPROVAL_READINESS_VERSION,
  assertValidApprovalReadinessProfile,
} from "./readiness.mjs";

export const APPROVAL_RECEIPT_KIND = "approval_receipt_profile";
export const APPROVAL_RECEIPT_VERSION = "v1";
export const APPROVAL_RECEIPT_SCHEMA_ID = "mindforge/approval-receipt/v1";
export const APPROVAL_RECEIPT_STAGE = "approval_receipt_phase2_v1";
export const APPROVAL_RECEIPT_BOUNDARY =
  "non_executing_approval_receipt_record";
export const APPROVAL_RECEIPT_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "approval_receipt",
  "deterministic",
  "enforcing",
]);
export const APPROVAL_RECEIPT_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "approval_refs",
  "waiver_record",
  "override_record",
  "receipt_contract",
]);
export const APPROVAL_RECEIPT_STABLE_EXPORT_SET = Object.freeze([
  "APPROVAL_RECEIPT_KIND",
  "APPROVAL_RECEIPT_VERSION",
  "APPROVAL_RECEIPT_SCHEMA_ID",
  "APPROVAL_RECEIPT_STAGE",
  "APPROVAL_RECEIPT_BOUNDARY",
  "APPROVAL_RECEIPT_TOP_LEVEL_FIELDS",
  "APPROVAL_RECEIPT_PAYLOAD_FIELDS",
  "APPROVAL_RECEIPT_STABLE_EXPORT_SET",
  "buildApprovalReceiptProfile",
  "validateApprovalReceiptProfile",
  "assertValidApprovalReceiptProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildApprovalReceiptProfile({
  approvalArtifactProfile,
  approvalReadinessProfile,
}) {
  const approval = assertValidApprovalArtifactProfile(approvalArtifactProfile);
  const readiness = assertValidApprovalReadinessProfile(approvalReadinessProfile);

  if (approval.canonical_action_hash !== readiness.canonical_action_hash) {
    throw new Error(
      "approval receipt requires matching canonical action hashes"
    );
  }

  return {
    kind: APPROVAL_RECEIPT_KIND,
    version: APPROVAL_RECEIPT_VERSION,
    schema_id: APPROVAL_RECEIPT_SCHEMA_ID,
    canonical_action_hash: approval.canonical_action_hash,
    approval_receipt: {
      stage: APPROVAL_RECEIPT_STAGE,
      consumer_surface: APPROVAL_CONSUMER_SURFACE,
      boundary: APPROVAL_RECEIPT_BOUNDARY,
      approval_refs: {
        approval_artifact_kind: APPROVAL_ARTIFACT_KIND,
        approval_artifact_version: APPROVAL_ARTIFACT_VERSION,
        approval_readiness_kind: APPROVAL_READINESS_KIND,
        approval_readiness_version: APPROVAL_READINESS_VERSION,
        approval_readiness_stage: APPROVAL_READINESS_STAGE,
        approval_readiness_boundary: APPROVAL_READINESS_BOUNDARY,
      },
      waiver_record: {
        available: true,
        recommendation_only: true,
        additive_only: true,
        execution_enabled: false,
      },
      override_record: {
        available: true,
        contract_kind: "approval_override_record",
        executing: false,
      },
      receipt_contract: {
        readiness: APPROVAL_READINESS_CONSUMER_COMPATIBLE,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        governance_object_addition: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateApprovalReceiptProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["approval receipt must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(APPROVAL_RECEIPT_TOP_LEVEL_FIELDS)
  ) {
    errors.push("approval receipt top-level field order drifted");
  }
  if (profile.kind !== APPROVAL_RECEIPT_KIND) {
    errors.push("approval receipt kind drifted");
  }
  if (profile.version !== APPROVAL_RECEIPT_VERSION) {
    errors.push("approval receipt version drifted");
  }
  if (profile.schema_id !== APPROVAL_RECEIPT_SCHEMA_ID) {
    errors.push("approval receipt schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("approval receipt canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("approval receipt must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("approval receipt must remain non-enforcing");
  }
  if (!isPlainObject(profile.approval_receipt)) {
    errors.push("approval receipt payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.approval_receipt;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(APPROVAL_RECEIPT_PAYLOAD_FIELDS)
  ) {
    errors.push("approval receipt payload field order drifted");
  }
  if (payload.stage !== APPROVAL_RECEIPT_STAGE) {
    errors.push("approval receipt stage drifted");
  }
  if (payload.consumer_surface !== APPROVAL_CONSUMER_SURFACE) {
    errors.push("approval receipt consumer surface drifted");
  }
  if (payload.boundary !== APPROVAL_RECEIPT_BOUNDARY) {
    errors.push("approval receipt boundary drifted");
  }
  if (!isPlainObject(payload.approval_refs)) {
    errors.push("approval receipt refs must be an object");
  } else {
    if (payload.approval_refs.approval_artifact_kind !== APPROVAL_ARTIFACT_KIND) {
      errors.push("approval receipt artifact kind drifted");
    }
    if (
      payload.approval_refs.approval_artifact_version !==
      APPROVAL_ARTIFACT_VERSION
    ) {
      errors.push("approval receipt artifact version drifted");
    }
    if (
      payload.approval_refs.approval_readiness_kind !== APPROVAL_READINESS_KIND
    ) {
      errors.push("approval receipt readiness kind drifted");
    }
    if (
      payload.approval_refs.approval_readiness_version !==
      APPROVAL_READINESS_VERSION
    ) {
      errors.push("approval receipt readiness version drifted");
    }
    if (
      payload.approval_refs.approval_readiness_stage !==
      APPROVAL_READINESS_STAGE
    ) {
      errors.push("approval receipt readiness stage drifted");
    }
    if (
      payload.approval_refs.approval_readiness_boundary !==
      APPROVAL_READINESS_BOUNDARY
    ) {
      errors.push("approval receipt readiness boundary drifted");
    }
  }
  if (!isPlainObject(payload.waiver_record)) {
    errors.push("approval receipt waiver record must be an object");
  } else {
    if (payload.waiver_record.available !== true) {
      errors.push("approval receipt waiver availability drifted");
    }
    if (payload.waiver_record.recommendation_only !== true) {
      errors.push("approval receipt waiver recommendation drifted");
    }
    if (payload.waiver_record.additive_only !== true) {
      errors.push("approval receipt waiver additive drifted");
    }
    if (payload.waiver_record.execution_enabled !== false) {
      errors.push("approval receipt waiver execution drifted");
    }
  }
  if (!isPlainObject(payload.override_record)) {
    errors.push("approval receipt override record must be an object");
  } else {
    if (payload.override_record.available !== true) {
      errors.push("approval receipt override availability drifted");
    }
    if (payload.override_record.contract_kind !== "approval_override_record") {
      errors.push("approval receipt override contract kind drifted");
    }
    if (payload.override_record.executing !== false) {
      errors.push("approval receipt override execution drifted");
    }
  }
  if (!isPlainObject(payload.receipt_contract)) {
    errors.push("approval receipt contract must be an object");
  } else {
    if (
      payload.receipt_contract.readiness !==
      APPROVAL_READINESS_CONSUMER_COMPATIBLE
    ) {
      errors.push("approval receipt readiness drifted");
    }
    if (payload.receipt_contract.audit_output_preserved !== true) {
      errors.push("approval receipt audit output drifted");
    }
    if (payload.receipt_contract.audit_verdict_preserved !== true) {
      errors.push("approval receipt audit verdict drifted");
    }
    if (payload.receipt_contract.actual_exit_code_preserved !== true) {
      errors.push("approval receipt actual exit drifted");
    }
    if (payload.receipt_contract.denied_exit_code_preserved !== 25) {
      errors.push("approval receipt deny exit drifted");
    }
    if (
      payload.receipt_contract.authority_scope !==
      "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("approval receipt authority scope drifted");
    }
    if (payload.receipt_contract.governance_object_addition !== false) {
      errors.push("approval receipt governance object boundary drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidApprovalReceiptProfile(profile) {
  const validation = validateApprovalReceiptProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `approval receipt invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
