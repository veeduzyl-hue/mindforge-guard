import {
  GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_VERSION,
  assertValidGovernanceCaseResolutionCompatibilityContract,
} from "./governanceCaseResolutionCompatibilityContract.mjs";
import {
  GOVERNANCE_CASE_RESOLUTION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_RESOLUTION_CLOSURE_READY,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_KIND,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_STAGE,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_VERSION,
  assertValidGovernanceCaseResolutionProfile,
} from "./governanceCaseResolutionProfile.mjs";

export const GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND =
  "governance_case_resolution_stabilization_profile";
export const GOVERNANCE_CASE_RESOLUTION_STABILIZATION_VERSION = "v1";
export const GOVERNANCE_CASE_RESOLUTION_STABILIZATION_SCHEMA_ID =
  "mindforge/governance-case-resolution-stabilization/v1";
export const GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE =
  "governance_case_resolution_boundary_phase1_stabilization_v1";
export const GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY =
  "governance_case_resolution_stabilization_boundary";
export const GOVERNANCE_CASE_RESOLUTION_STABILIZATION_READY =
  "stabilized_for_consumer_review";
export const GOVERNANCE_CASE_RESOLUTION_STABILIZATION_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_resolution_stabilization",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_RESOLUTION_STABILIZATION_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "resolution_profile_ref",
    "compatibility_ref",
    "stabilization_contract",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND",
    "GOVERNANCE_CASE_RESOLUTION_STABILIZATION_VERSION",
    "GOVERNANCE_CASE_RESOLUTION_STABILIZATION_SCHEMA_ID",
    "GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE",
    "GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY",
    "GOVERNANCE_CASE_RESOLUTION_STABILIZATION_READY",
    "GOVERNANCE_CASE_RESOLUTION_STABILIZATION_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_RESOLUTION_STABILIZATION_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STABLE_EXPORT_SET",
    "buildGovernanceCaseResolutionStabilizationProfile",
    "validateGovernanceCaseResolutionStabilizationProfile",
    "assertValidGovernanceCaseResolutionStabilizationProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseResolutionStabilizationProfile({
  governanceCaseResolutionProfile,
  governanceCaseResolutionCompatibilityContract,
}) {
  const profile = assertValidGovernanceCaseResolutionProfile(
    governanceCaseResolutionProfile
  );
  const compatibility = assertValidGovernanceCaseResolutionCompatibilityContract(
    governanceCaseResolutionCompatibilityContract
  );

  return {
    kind: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND,
    version: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_VERSION,
    schema_id: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_SCHEMA_ID,
    canonical_action_hash: profile.canonical_action_hash,
    governance_case_resolution_stabilization: {
      stage: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE,
      consumer_surface: GOVERNANCE_CASE_RESOLUTION_CONSUMER_SURFACE,
      boundary: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY,
      resolution_profile_ref: {
        kind: GOVERNANCE_CASE_RESOLUTION_PROFILE_KIND,
        version: GOVERNANCE_CASE_RESOLUTION_PROFILE_VERSION,
        stage: GOVERNANCE_CASE_RESOLUTION_PROFILE_STAGE,
        boundary: GOVERNANCE_CASE_RESOLUTION_PROFILE_BOUNDARY,
      },
      compatibility_ref: {
        kind: GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_KIND,
        version: GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_VERSION,
        boundary: GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_BOUNDARY,
      },
      stabilization_contract: {
        readiness_level: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_READY,
        closure_readiness_level: GOVERNANCE_CASE_RESOLUTION_CLOSURE_READY,
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
        actual_escalation_execution: false,
        actual_closure_execution: false,
      },
      preserved_semantics: {
        resolution_boundary_preserved: true,
        compatibility_boundary_preserved: true,
        closure_readiness_preserved: true,
        exception_semantics_preserved: true,
        snapshot_semantics_preserved: true,
        evidence_semantics_preserved: true,
        policy_semantics_preserved: true,
        enforcement_semantics_preserved: true,
        approval_semantics_preserved: true,
        judgment_semantics_preserved: true,
        permit_gate_semantics_preserved: true,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope_expansion: false,
        governance_object_addition: false,
        main_path_takeover: false,
        consumer_compatible: compatibility.consumer_compatible === true,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseResolutionStabilizationProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["governance case resolution stabilization profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_CASE_RESOLUTION_STABILIZATION_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance case resolution stabilization top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND) {
    errors.push("governance case resolution stabilization kind drifted");
  }
  if (profile.version !== GOVERNANCE_CASE_RESOLUTION_STABILIZATION_VERSION) {
    errors.push("governance case resolution stabilization version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_CASE_RESOLUTION_STABILIZATION_SCHEMA_ID) {
    errors.push("governance case resolution stabilization schema drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance case resolution stabilization canonical action hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance case resolution stabilization determinism drifted");
  }
  if (profile.enforcing !== false) {
    errors.push("governance case resolution stabilization enforcement drifted");
  }
  const payload = profile.governance_case_resolution_stabilization;
  if (!isPlainObject(payload)) {
    errors.push("governance case resolution stabilization payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_CASE_RESOLUTION_STABILIZATION_PAYLOAD_FIELDS)
  ) {
    errors.push("governance case resolution stabilization payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE) {
    errors.push("governance case resolution stabilization stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_CASE_RESOLUTION_CONSUMER_SURFACE) {
    errors.push("governance case resolution stabilization consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY) {
    errors.push("governance case resolution stabilization boundary drifted");
  }
  if (!isPlainObject(payload.resolution_profile_ref)) {
    errors.push("governance case resolution stabilization profile ref missing");
  }
  if (!isPlainObject(payload.compatibility_ref)) {
    errors.push("governance case resolution stabilization compatibility ref missing");
  }
  if (!isPlainObject(payload.stabilization_contract)) {
    errors.push("governance case resolution stabilization contract missing");
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance case resolution stabilization preserved semantics missing");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseResolutionStabilizationProfile(profile) {
  const validation = validateGovernanceCaseResolutionStabilizationProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case resolution stabilization invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
