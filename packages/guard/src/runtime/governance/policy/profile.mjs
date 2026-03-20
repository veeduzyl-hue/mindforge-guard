import {
  ENFORCEMENT_FINAL_ACCEPTANCE_BOUNDARY,
  ENFORCEMENT_STABILIZATION_KIND,
  ENFORCEMENT_STABILIZATION_STAGE,
  ENFORCEMENT_STABILIZATION_VERSION,
  assertValidEnforcementStabilizationProfile,
} from "../enforcement/stabilization.mjs";

export const POLICY_PROFILE_KIND = "policy_profile";
export const POLICY_PROFILE_VERSION = "v1";
export const POLICY_PROFILE_SCHEMA_ID = "mindforge/policy-profile/v1";
export const POLICY_PROFILE_STAGE = "policy_rollout_phase1_v1";
export const POLICY_CONSUMER_SURFACE = "guard.audit.policy_adjacent";
export const POLICY_PROFILE_BOUNDARY =
  "policy_profile_and_rollout_boundary_contract";
export const POLICY_INHERITANCE_CONTRACT_KIND =
  "policy_inheritance_contract";
export const POLICY_INHERITANCE_CONTRACT_VERSION = "v1";
export const POLICY_INHERITANCE_CONTRACT_BOUNDARY =
  "bounded_policy_inheritance_contract";
export const POLICY_ROLLOUT_READINESS_CONTRACT_KIND =
  "policy_rollout_readiness_contract";
export const POLICY_ROLLOUT_READINESS_CONTRACT_VERSION = "v1";
export const POLICY_ROLLOUT_READINESS_CONTRACT_BOUNDARY =
  "bounded_policy_rollout_readiness_contract";
export const POLICY_PROFILE_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "policy_profile",
  "deterministic",
  "enforcing",
]);
export const POLICY_PROFILE_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "enforcement_ref",
  "policy_contract",
  "inheritance_contract",
  "rollout_readiness_contract",
  "preserved_semantics",
]);
export const POLICY_PROFILE_STABLE_EXPORT_SET = Object.freeze([
  "POLICY_PROFILE_KIND",
  "POLICY_PROFILE_VERSION",
  "POLICY_PROFILE_SCHEMA_ID",
  "POLICY_PROFILE_STAGE",
  "POLICY_CONSUMER_SURFACE",
  "POLICY_PROFILE_BOUNDARY",
  "POLICY_INHERITANCE_CONTRACT_KIND",
  "POLICY_INHERITANCE_CONTRACT_VERSION",
  "POLICY_INHERITANCE_CONTRACT_BOUNDARY",
  "POLICY_ROLLOUT_READINESS_CONTRACT_KIND",
  "POLICY_ROLLOUT_READINESS_CONTRACT_VERSION",
  "POLICY_ROLLOUT_READINESS_CONTRACT_BOUNDARY",
  "POLICY_PROFILE_TOP_LEVEL_FIELDS",
  "POLICY_PROFILE_PAYLOAD_FIELDS",
  "POLICY_PROFILE_STABLE_EXPORT_SET",
  "buildPolicyProfile",
  "validatePolicyProfile",
  "assertValidPolicyProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildPolicyProfile({ enforcementStabilizationProfile }) {
  const enforcement = assertValidEnforcementStabilizationProfile(
    enforcementStabilizationProfile
  );

  return {
    kind: POLICY_PROFILE_KIND,
    version: POLICY_PROFILE_VERSION,
    schema_id: POLICY_PROFILE_SCHEMA_ID,
    canonical_action_hash: enforcement.canonical_action_hash,
    policy_profile: {
      stage: POLICY_PROFILE_STAGE,
      consumer_surface: POLICY_CONSUMER_SURFACE,
      boundary: POLICY_PROFILE_BOUNDARY,
      enforcement_ref: {
        kind: ENFORCEMENT_STABILIZATION_KIND,
        version: ENFORCEMENT_STABILIZATION_VERSION,
        stage: ENFORCEMENT_STABILIZATION_STAGE,
        boundary: ENFORCEMENT_FINAL_ACCEPTANCE_BOUNDARY,
      },
      policy_contract: {
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_on: false,
      },
      inheritance_contract: {
        kind: POLICY_INHERITANCE_CONTRACT_KIND,
        version: POLICY_INHERITANCE_CONTRACT_VERSION,
        boundary: POLICY_INHERITANCE_CONTRACT_BOUNDARY,
        bounded_inheritance: true,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        authority_scope_expansion: false,
      },
      rollout_readiness_contract: {
        kind: POLICY_ROLLOUT_READINESS_CONTRACT_KIND,
        version: POLICY_ROLLOUT_READINESS_CONTRACT_VERSION,
        boundary: POLICY_ROLLOUT_READINESS_CONTRACT_BOUNDARY,
        readiness_only: true,
        execution_enabled: false,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        governance_object_addition: false,
      },
      preserved_semantics: {
        permit_gate_semantics_preserved: true,
        enforcement_semantics_preserved: true,
        approval_semantics_preserved: true,
        judgment_semantics_preserved: true,
        policy_rollout_ready: true,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validatePolicyProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["policy profile must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(POLICY_PROFILE_TOP_LEVEL_FIELDS)
  ) {
    errors.push("policy profile top-level field order drifted");
  }
  if (profile.kind !== POLICY_PROFILE_KIND) {
    errors.push("policy profile kind drifted");
  }
  if (profile.version !== POLICY_PROFILE_VERSION) {
    errors.push("policy profile version drifted");
  }
  if (profile.schema_id !== POLICY_PROFILE_SCHEMA_ID) {
    errors.push("policy profile schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("policy profile canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("policy profile must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("policy profile must remain non-enforcing");
  }
  if (!isPlainObject(profile.policy_profile)) {
    errors.push("policy profile payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.policy_profile;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(POLICY_PROFILE_PAYLOAD_FIELDS)
  ) {
    errors.push("policy profile payload field order drifted");
  }
  if (payload.stage !== POLICY_PROFILE_STAGE) {
    errors.push("policy profile stage drifted");
  }
  if (payload.consumer_surface !== POLICY_CONSUMER_SURFACE) {
    errors.push("policy consumer surface drifted");
  }
  if (payload.boundary !== POLICY_PROFILE_BOUNDARY) {
    errors.push("policy profile boundary drifted");
  }
  if (!isPlainObject(payload.enforcement_ref)) {
    errors.push("policy enforcement ref must be an object");
  } else {
    if (payload.enforcement_ref.kind !== ENFORCEMENT_STABILIZATION_KIND) {
      errors.push("policy enforcement ref kind drifted");
    }
    if (
      payload.enforcement_ref.version !== ENFORCEMENT_STABILIZATION_VERSION
    ) {
      errors.push("policy enforcement ref version drifted");
    }
    if (payload.enforcement_ref.stage !== ENFORCEMENT_STABILIZATION_STAGE) {
      errors.push("policy enforcement ref stage drifted");
    }
    if (
      payload.enforcement_ref.boundary !== ENFORCEMENT_FINAL_ACCEPTANCE_BOUNDARY
    ) {
      errors.push("policy enforcement ref boundary drifted");
    }
  }
  if (!isPlainObject(payload.policy_contract)) {
    errors.push("policy contract must be an object");
  } else {
    if (payload.policy_contract.recommendation_only !== true) {
      errors.push("policy contract recommendation boundary drifted");
    }
    if (payload.policy_contract.additive_only !== true) {
      errors.push("policy contract additive boundary drifted");
    }
    if (payload.policy_contract.non_executing !== true) {
      errors.push("policy contract execution boundary drifted");
    }
    if (payload.policy_contract.default_on !== false) {
      errors.push("policy contract default-on boundary drifted");
    }
  }
  if (!isPlainObject(payload.inheritance_contract)) {
    errors.push("policy inheritance contract must be an object");
  } else {
    if (
      payload.inheritance_contract.kind !== POLICY_INHERITANCE_CONTRACT_KIND
    ) {
      errors.push("policy inheritance kind drifted");
    }
    if (
      payload.inheritance_contract.version !==
      POLICY_INHERITANCE_CONTRACT_VERSION
    ) {
      errors.push("policy inheritance version drifted");
    }
    if (
      payload.inheritance_contract.boundary !==
      POLICY_INHERITANCE_CONTRACT_BOUNDARY
    ) {
      errors.push("policy inheritance boundary drifted");
    }
    if (payload.inheritance_contract.bounded_inheritance !== true) {
      errors.push("policy inheritance boundedness drifted");
    }
    if (
      payload.inheritance_contract.authority_scope !==
      "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("policy inheritance authority scope drifted");
    }
    if (payload.inheritance_contract.authority_scope_expansion !== false) {
      errors.push("policy inheritance scope expansion drifted");
    }
  }
  if (!isPlainObject(payload.rollout_readiness_contract)) {
    errors.push("policy rollout readiness contract must be an object");
  } else {
    if (
      payload.rollout_readiness_contract.kind !==
      POLICY_ROLLOUT_READINESS_CONTRACT_KIND
    ) {
      errors.push("policy rollout kind drifted");
    }
    if (
      payload.rollout_readiness_contract.version !==
      POLICY_ROLLOUT_READINESS_CONTRACT_VERSION
    ) {
      errors.push("policy rollout version drifted");
    }
    if (
      payload.rollout_readiness_contract.boundary !==
      POLICY_ROLLOUT_READINESS_CONTRACT_BOUNDARY
    ) {
      errors.push("policy rollout boundary drifted");
    }
    if (payload.rollout_readiness_contract.readiness_only !== true) {
      errors.push("policy rollout readiness drifted");
    }
    if (payload.rollout_readiness_contract.execution_enabled !== false) {
      errors.push("policy rollout execution boundary drifted");
    }
    if (payload.rollout_readiness_contract.audit_output_preserved !== true) {
      errors.push("policy rollout audit output drifted");
    }
    if (payload.rollout_readiness_contract.audit_verdict_preserved !== true) {
      errors.push("policy rollout audit verdict drifted");
    }
    if (
      payload.rollout_readiness_contract.actual_exit_code_preserved !== true
    ) {
      errors.push("policy rollout actual exit drifted");
    }
    if (payload.rollout_readiness_contract.denied_exit_code_preserved !== 25) {
      errors.push("policy rollout deny exit drifted");
    }
    if (
      payload.rollout_readiness_contract.governance_object_addition !== false
    ) {
      errors.push("policy rollout governance object boundary drifted");
    }
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("policy preserved semantics must be an object");
  } else {
    if (payload.preserved_semantics.permit_gate_semantics_preserved !== true) {
      errors.push("policy permit gate semantics drifted");
    }
    if (payload.preserved_semantics.enforcement_semantics_preserved !== true) {
      errors.push("policy enforcement semantics drifted");
    }
    if (payload.preserved_semantics.approval_semantics_preserved !== true) {
      errors.push("policy approval semantics drifted");
    }
    if (payload.preserved_semantics.judgment_semantics_preserved !== true) {
      errors.push("policy judgment semantics drifted");
    }
    if (payload.preserved_semantics.policy_rollout_ready !== true) {
      errors.push("policy rollout readiness drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidPolicyProfile(profile) {
  const validation = validatePolicyProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `policy profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
