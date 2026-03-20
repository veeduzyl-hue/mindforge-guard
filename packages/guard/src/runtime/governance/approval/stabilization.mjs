import {
  APPROVAL_ARTIFACT_BOUNDARY,
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
import {
  APPROVAL_RECEIPT_BOUNDARY,
  APPROVAL_RECEIPT_KIND,
  APPROVAL_RECEIPT_STAGE,
  APPROVAL_RECEIPT_VERSION,
  assertValidApprovalReceiptProfile,
} from "./receipt.mjs";

export const APPROVAL_STABILIZATION_KIND = "approval_stabilization_profile";
export const APPROVAL_STABILIZATION_VERSION = "v1";
export const APPROVAL_STABILIZATION_SCHEMA_ID =
  "mindforge/approval-stabilization/v1";
export const APPROVAL_STABILIZATION_STAGE =
  "approval_stabilization_phase3_v1";
export const APPROVAL_FINAL_ACCEPTANCE_BOUNDARY =
  "final_recommendation_only_approval_consumer_contract";
export const APPROVAL_FINAL_ACCEPTANCE_READY = "final_consumer_ready";
export const APPROVAL_STABILIZATION_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "approval_stabilization",
  "deterministic",
  "enforcing",
]);
export const APPROVAL_STABILIZATION_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "approval_refs",
  "final_consumer_contract",
  "preserved_semantics",
]);
export const APPROVAL_STABILIZATION_STABLE_EXPORT_SET = Object.freeze([
  "APPROVAL_STABILIZATION_KIND",
  "APPROVAL_STABILIZATION_VERSION",
  "APPROVAL_STABILIZATION_SCHEMA_ID",
  "APPROVAL_STABILIZATION_STAGE",
  "APPROVAL_FINAL_ACCEPTANCE_BOUNDARY",
  "APPROVAL_FINAL_ACCEPTANCE_READY",
  "APPROVAL_STABILIZATION_TOP_LEVEL_FIELDS",
  "APPROVAL_STABILIZATION_PAYLOAD_FIELDS",
  "APPROVAL_STABILIZATION_STABLE_EXPORT_SET",
  "buildApprovalStabilizationProfile",
  "validateApprovalStabilizationProfile",
  "assertValidApprovalStabilizationProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildApprovalStabilizationProfile({
  approvalArtifactProfile,
  approvalReadinessProfile,
  approvalReceiptProfile,
}) {
  const artifact = assertValidApprovalArtifactProfile(approvalArtifactProfile);
  const readiness = assertValidApprovalReadinessProfile(approvalReadinessProfile);
  const receipt = assertValidApprovalReceiptProfile(approvalReceiptProfile);

  if (artifact.canonical_action_hash !== readiness.canonical_action_hash) {
    throw new Error(
      "approval stabilization requires matching readiness canonical action hash"
    );
  }
  if (artifact.canonical_action_hash !== receipt.canonical_action_hash) {
    throw new Error(
      "approval stabilization requires matching receipt canonical action hash"
    );
  }

  return {
    kind: APPROVAL_STABILIZATION_KIND,
    version: APPROVAL_STABILIZATION_VERSION,
    schema_id: APPROVAL_STABILIZATION_SCHEMA_ID,
    canonical_action_hash: artifact.canonical_action_hash,
    approval_stabilization: {
      stage: APPROVAL_STABILIZATION_STAGE,
      consumer_surface: APPROVAL_CONSUMER_SURFACE,
      boundary: APPROVAL_FINAL_ACCEPTANCE_BOUNDARY,
      approval_refs: {
        approval_artifact_kind: APPROVAL_ARTIFACT_KIND,
        approval_artifact_version: APPROVAL_ARTIFACT_VERSION,
        approval_artifact_boundary: APPROVAL_ARTIFACT_BOUNDARY,
        approval_readiness_kind: APPROVAL_READINESS_KIND,
        approval_readiness_version: APPROVAL_READINESS_VERSION,
        approval_readiness_stage: APPROVAL_READINESS_STAGE,
        approval_readiness_boundary: APPROVAL_READINESS_BOUNDARY,
        approval_receipt_kind: APPROVAL_RECEIPT_KIND,
        approval_receipt_version: APPROVAL_RECEIPT_VERSION,
        approval_receipt_stage: APPROVAL_RECEIPT_STAGE,
        approval_receipt_boundary: APPROVAL_RECEIPT_BOUNDARY,
      },
      final_consumer_contract: {
        acceptance_level: APPROVAL_FINAL_ACCEPTANCE_READY,
        recommendation_only: true,
        additive_only: true,
        override_execution_available: false,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        governance_object_addition: false,
      },
      preserved_semantics: {
        permit_gate_semantics_preserved: true,
        enforcement_pilot_semantics_preserved: true,
        limited_authority_semantics_preserved: true,
        approval_exception_contract_preserved: true,
        approval_waiver_contract_preserved: true,
        approval_override_record_preserved: true,
        approval_receipt_stable:
          receipt.approval_receipt.receipt_contract.readiness ===
          APPROVAL_READINESS_CONSUMER_COMPATIBLE,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateApprovalStabilizationProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["approval stabilization profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(APPROVAL_STABILIZATION_TOP_LEVEL_FIELDS)
  ) {
    errors.push("approval stabilization top-level field order drifted");
  }
  if (profile.kind !== APPROVAL_STABILIZATION_KIND) {
    errors.push("approval stabilization kind drifted");
  }
  if (profile.version !== APPROVAL_STABILIZATION_VERSION) {
    errors.push("approval stabilization version drifted");
  }
  if (profile.schema_id !== APPROVAL_STABILIZATION_SCHEMA_ID) {
    errors.push("approval stabilization schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("approval stabilization canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("approval stabilization must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("approval stabilization must remain non-enforcing");
  }
  if (!isPlainObject(profile.approval_stabilization)) {
    errors.push("approval stabilization payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.approval_stabilization;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(APPROVAL_STABILIZATION_PAYLOAD_FIELDS)
  ) {
    errors.push("approval stabilization payload field order drifted");
  }
  if (payload.stage !== APPROVAL_STABILIZATION_STAGE) {
    errors.push("approval stabilization stage drifted");
  }
  if (payload.consumer_surface !== APPROVAL_CONSUMER_SURFACE) {
    errors.push("approval stabilization consumer surface drifted");
  }
  if (payload.boundary !== APPROVAL_FINAL_ACCEPTANCE_BOUNDARY) {
    errors.push("approval stabilization boundary drifted");
  }
  if (!isPlainObject(payload.approval_refs)) {
    errors.push("approval stabilization refs must be an object");
  } else {
    if (payload.approval_refs.approval_artifact_kind !== APPROVAL_ARTIFACT_KIND) {
      errors.push("approval stabilization artifact kind drifted");
    }
    if (
      payload.approval_refs.approval_artifact_version !==
      APPROVAL_ARTIFACT_VERSION
    ) {
      errors.push("approval stabilization artifact version drifted");
    }
    if (
      payload.approval_refs.approval_artifact_boundary !==
      APPROVAL_ARTIFACT_BOUNDARY
    ) {
      errors.push("approval stabilization artifact boundary drifted");
    }
    if (
      payload.approval_refs.approval_readiness_kind !== APPROVAL_READINESS_KIND
    ) {
      errors.push("approval stabilization readiness kind drifted");
    }
    if (
      payload.approval_refs.approval_readiness_version !==
      APPROVAL_READINESS_VERSION
    ) {
      errors.push("approval stabilization readiness version drifted");
    }
    if (
      payload.approval_refs.approval_readiness_stage !==
      APPROVAL_READINESS_STAGE
    ) {
      errors.push("approval stabilization readiness stage drifted");
    }
    if (
      payload.approval_refs.approval_readiness_boundary !==
      APPROVAL_READINESS_BOUNDARY
    ) {
      errors.push("approval stabilization readiness boundary drifted");
    }
    if (
      payload.approval_refs.approval_receipt_kind !== APPROVAL_RECEIPT_KIND
    ) {
      errors.push("approval stabilization receipt kind drifted");
    }
    if (
      payload.approval_refs.approval_receipt_version !==
      APPROVAL_RECEIPT_VERSION
    ) {
      errors.push("approval stabilization receipt version drifted");
    }
    if (
      payload.approval_refs.approval_receipt_stage !==
      APPROVAL_RECEIPT_STAGE
    ) {
      errors.push("approval stabilization receipt stage drifted");
    }
    if (
      payload.approval_refs.approval_receipt_boundary !==
      APPROVAL_RECEIPT_BOUNDARY
    ) {
      errors.push("approval stabilization receipt boundary drifted");
    }
  }
  if (!isPlainObject(payload.final_consumer_contract)) {
    errors.push("approval stabilization final consumer contract must be an object");
  } else {
    const contract = payload.final_consumer_contract;
    if (contract.acceptance_level !== APPROVAL_FINAL_ACCEPTANCE_READY) {
      errors.push("approval stabilization acceptance level drifted");
    }
    if (contract.recommendation_only !== true) {
      errors.push("approval stabilization must remain recommendation-only");
    }
    if (contract.additive_only !== true) {
      errors.push("approval stabilization must remain additive-only");
    }
    if (contract.override_execution_available !== false) {
      errors.push("approval stabilization override execution drifted");
    }
    if (contract.audit_output_preserved !== true) {
      errors.push("approval stabilization must preserve audit output");
    }
    if (contract.audit_verdict_preserved !== true) {
      errors.push("approval stabilization must preserve audit verdict");
    }
    if (contract.actual_exit_code_preserved !== true) {
      errors.push("approval stabilization must preserve actual exit code");
    }
    if (contract.denied_exit_code_preserved !== 25) {
      errors.push("approval stabilization deny exit code drifted");
    }
    if (
      contract.authority_scope !==
      "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("approval stabilization authority scope drifted");
    }
    if (contract.governance_object_addition !== false) {
      errors.push("approval stabilization must not add governance objects");
    }
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("approval stabilization preserved semantics must be an object");
  } else {
    const semantics = payload.preserved_semantics;
    if (semantics.permit_gate_semantics_preserved !== true) {
      errors.push("approval stabilization must preserve permit gate semantics");
    }
    if (semantics.enforcement_pilot_semantics_preserved !== true) {
      errors.push(
        "approval stabilization must preserve enforcement pilot semantics"
      );
    }
    if (semantics.limited_authority_semantics_preserved !== true) {
      errors.push(
        "approval stabilization must preserve limited authority semantics"
      );
    }
    if (semantics.approval_exception_contract_preserved !== true) {
      errors.push("approval stabilization exception contract drifted");
    }
    if (semantics.approval_waiver_contract_preserved !== true) {
      errors.push("approval stabilization waiver contract drifted");
    }
    if (semantics.approval_override_record_preserved !== true) {
      errors.push("approval stabilization override record drifted");
    }
    if (semantics.approval_receipt_stable !== true) {
      errors.push("approval stabilization receipt stability drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidApprovalStabilizationProfile(profile) {
  const validation = validateApprovalStabilizationProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `approval stabilization profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
