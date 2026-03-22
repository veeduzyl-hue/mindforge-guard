import {
  GOVERNANCE_EXCEPTION_CONSUMER_SURFACE,
  GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY,
  GOVERNANCE_EXCEPTION_PROFILE_KIND,
  GOVERNANCE_EXCEPTION_PROFILE_VERSION,
  assertValidGovernanceExceptionProfile,
} from "./profile.mjs";
import {
  GOVERNANCE_OVERRIDE_RECORD_CONTRACT_BOUNDARY,
  GOVERNANCE_OVERRIDE_RECORD_CONTRACT_KIND,
  GOVERNANCE_OVERRIDE_RECORD_CONTRACT_VERSION,
  buildGovernanceOverrideRecordContract,
  assertValidGovernanceOverrideRecordContract,
  validateGovernanceOverrideRecordContract,
} from "./overrideRecord.mjs";

export const GOVERNANCE_CASE_LINKAGE_KIND =
  "governance_case_linkage_profile";
export const GOVERNANCE_CASE_LINKAGE_VERSION = "v1";
export const GOVERNANCE_CASE_LINKAGE_SCHEMA_ID =
  "mindforge/governance-case-linkage/v1";
export const GOVERNANCE_CASE_LINKAGE_STAGE =
  "governance_override_record_phase2_v1";
export const GOVERNANCE_CASE_LINKAGE_BOUNDARY =
  "governance_exception_receipt_readiness_and_case_linkage_boundary";
export const GOVERNANCE_EXCEPTION_RECEIPT_READY = "override_record_ready";
export const GOVERNANCE_EXCEPTION_CONSUMER_COMPATIBLE = "consumer_compatible";
export const GOVERNANCE_CASE_LINKAGE_LEVELS = Object.freeze([
  GOVERNANCE_EXCEPTION_RECEIPT_READY,
  GOVERNANCE_EXCEPTION_CONSUMER_COMPATIBLE,
]);
export const GOVERNANCE_CASE_LINKAGE_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_case_linkage",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_CASE_LINKAGE_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "exception_ref",
  "override_record_contract",
  "receipt_readiness",
  "consumer_compatibility",
  "stabilization_refs",
]);
export const GOVERNANCE_CASE_LINKAGE_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_CASE_LINKAGE_KIND",
  "GOVERNANCE_CASE_LINKAGE_VERSION",
  "GOVERNANCE_CASE_LINKAGE_SCHEMA_ID",
  "GOVERNANCE_CASE_LINKAGE_STAGE",
  "GOVERNANCE_CASE_LINKAGE_BOUNDARY",
  "GOVERNANCE_EXCEPTION_RECEIPT_READY",
  "GOVERNANCE_EXCEPTION_CONSUMER_COMPATIBLE",
  "GOVERNANCE_CASE_LINKAGE_LEVELS",
  "GOVERNANCE_CASE_LINKAGE_TOP_LEVEL_FIELDS",
  "GOVERNANCE_CASE_LINKAGE_PAYLOAD_FIELDS",
  "GOVERNANCE_CASE_LINKAGE_STABLE_EXPORT_SET",
  "buildGovernanceCaseLinkageProfile",
  "validateGovernanceCaseLinkageProfile",
  "assertValidGovernanceCaseLinkageProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseLinkageProfile({
  governanceExceptionProfile,
}) {
  const exceptionProfile = assertValidGovernanceExceptionProfile(
    governanceExceptionProfile
  );
  const overrideRecord = assertValidGovernanceOverrideRecordContract(
    buildGovernanceOverrideRecordContract({
      governanceExceptionProfile: exceptionProfile,
    })
  );

  return {
    kind: GOVERNANCE_CASE_LINKAGE_KIND,
    version: GOVERNANCE_CASE_LINKAGE_VERSION,
    schema_id: GOVERNANCE_CASE_LINKAGE_SCHEMA_ID,
    canonical_action_hash: exceptionProfile.canonical_action_hash,
    governance_case_linkage: {
      stage: GOVERNANCE_CASE_LINKAGE_STAGE,
      consumer_surface: GOVERNANCE_EXCEPTION_CONSUMER_SURFACE,
      boundary: GOVERNANCE_CASE_LINKAGE_BOUNDARY,
      exception_ref: {
        kind: GOVERNANCE_EXCEPTION_PROFILE_KIND,
        version: GOVERNANCE_EXCEPTION_PROFILE_VERSION,
        boundary: GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY,
      },
      override_record_contract: overrideRecord,
      receipt_readiness: {
        level: GOVERNANCE_EXCEPTION_RECEIPT_READY,
        override_record_ready: true,
        case_linkage_ready: true,
        recommendation_only: true,
      },
      consumer_compatibility: {
        level: GOVERNANCE_EXCEPTION_CONSUMER_COMPATIBLE,
        additive_only: true,
        non_executing: true,
        default_off: true,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        denied_exit_code_preserved: 25,
      },
      stabilization_refs: {
        compatibility_contract_available: true,
        stabilization_profile_available: true,
        final_acceptance_boundary_available: true,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseLinkageProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["governance case linkage profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_CASE_LINKAGE_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance case linkage top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_CASE_LINKAGE_KIND) {
    errors.push("governance case linkage kind drifted");
  }
  if (profile.version !== GOVERNANCE_CASE_LINKAGE_VERSION) {
    errors.push("governance case linkage version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_CASE_LINKAGE_SCHEMA_ID) {
    errors.push("governance case linkage schema drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance case linkage canonical action hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance case linkage determinism drifted");
  }
  if (profile.enforcing !== false) {
    errors.push("governance case linkage enforcement drifted");
  }
  const payload = profile.governance_case_linkage;
  if (!isPlainObject(payload)) {
    errors.push("governance case linkage payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_CASE_LINKAGE_PAYLOAD_FIELDS)
  ) {
    errors.push("governance case linkage payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_CASE_LINKAGE_STAGE) {
    errors.push("governance case linkage stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_EXCEPTION_CONSUMER_SURFACE) {
    errors.push("governance case linkage consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_CASE_LINKAGE_BOUNDARY) {
    errors.push("governance case linkage boundary drifted");
  }
  if (!isPlainObject(payload.exception_ref)) {
    errors.push("governance case linkage exception ref missing");
  } else {
    if (payload.exception_ref.kind !== GOVERNANCE_EXCEPTION_PROFILE_KIND) {
      errors.push("governance case linkage exception ref kind drifted");
    }
    if (payload.exception_ref.version !== GOVERNANCE_EXCEPTION_PROFILE_VERSION) {
      errors.push("governance case linkage exception ref version drifted");
    }
    if (payload.exception_ref.boundary !== GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY) {
      errors.push("governance case linkage exception ref boundary drifted");
    }
  }
  const overrideValidation = validateGovernanceOverrideRecordContract(
    payload.override_record_contract
  );
  if (!overrideValidation.ok) {
    errors.push(...overrideValidation.errors);
  }
  if (!isPlainObject(payload.receipt_readiness)) {
    errors.push("governance case linkage receipt readiness missing");
  } else {
    if (payload.receipt_readiness.level !== GOVERNANCE_EXCEPTION_RECEIPT_READY) {
      errors.push("governance case linkage readiness level drifted");
    }
    if (payload.receipt_readiness.override_record_ready !== true) {
      errors.push("governance case linkage override readiness drifted");
    }
    if (payload.receipt_readiness.case_linkage_ready !== true) {
      errors.push("governance case linkage readiness drifted");
    }
    if (payload.receipt_readiness.recommendation_only !== true) {
      errors.push("governance case linkage recommendation boundary drifted");
    }
  }
  if (!isPlainObject(payload.consumer_compatibility)) {
    errors.push("governance case linkage consumer compatibility missing");
  } else {
    if (
      payload.consumer_compatibility.level !==
      GOVERNANCE_EXCEPTION_CONSUMER_COMPATIBLE
    ) {
      errors.push("governance case linkage compatibility level drifted");
    }
    if (payload.consumer_compatibility.additive_only !== true) {
      errors.push("governance case linkage additive boundary drifted");
    }
    if (payload.consumer_compatibility.non_executing !== true) {
      errors.push("governance case linkage execution boundary drifted");
    }
    if (payload.consumer_compatibility.default_off !== true) {
      errors.push("governance case linkage default-off drifted");
    }
    if (
      payload.consumer_compatibility.authority_scope !==
      "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("governance case linkage authority scope drifted");
    }
    if (payload.consumer_compatibility.denied_exit_code_preserved !== 25) {
      errors.push("governance case linkage deny exit drifted");
    }
  }
  if (!isPlainObject(payload.stabilization_refs)) {
    errors.push("governance case linkage stabilization refs missing");
  } else {
    if (payload.stabilization_refs.compatibility_contract_available !== true) {
      errors.push("governance case linkage compatibility availability drifted");
    }
    if (payload.stabilization_refs.stabilization_profile_available !== true) {
      errors.push("governance case linkage stabilization availability drifted");
    }
    if (payload.stabilization_refs.final_acceptance_boundary_available !== true) {
      errors.push("governance case linkage final acceptance availability drifted");
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseLinkageProfile(profile) {
  const validation = validateGovernanceCaseLinkageProfile(profile);
  if (validation.ok) return profile;
  const err = new Error(
    `governance case linkage profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
