import {
  GOVERNANCE_CASE_RESOLUTION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_KIND,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_VERSION,
  assertValidGovernanceCaseResolutionProfile,
} from "./governanceCaseResolutionProfile.mjs";

export const GOVERNANCE_CASE_RESOLUTION_CONTRACT_KIND =
  "governance_case_resolution_contract";
export const GOVERNANCE_CASE_RESOLUTION_CONTRACT_VERSION = "v1";
export const GOVERNANCE_CASE_RESOLUTION_CONTRACT_BOUNDARY =
  "bounded_governance_case_resolution_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseResolutionContract({
  governanceCaseResolutionProfile,
}) {
  const profile = assertValidGovernanceCaseResolutionProfile(
    governanceCaseResolutionProfile
  );

  return {
    kind: GOVERNANCE_CASE_RESOLUTION_CONTRACT_KIND,
    version: GOVERNANCE_CASE_RESOLUTION_CONTRACT_VERSION,
    boundary: GOVERNANCE_CASE_RESOLUTION_CONTRACT_BOUNDARY,
    resolution_profile_ref: {
      kind: GOVERNANCE_CASE_RESOLUTION_PROFILE_KIND,
      version: GOVERNANCE_CASE_RESOLUTION_PROFILE_VERSION,
      boundary: GOVERNANCE_CASE_RESOLUTION_PROFILE_BOUNDARY,
    },
    case_resolution_available: true,
    closure_readiness_available: true,
    recommendation_only: true,
    additive_only: true,
    execution_enabled: false,
    default_on: false,
    actual_escalation_execution: false,
    actual_closure_execution: false,
    authority_scope: "review_gate_deny_exit_recommendation_only",
    authority_scope_expansion: false,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseResolutionContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: ["governance case resolution contract must be an object"],
    };
  }
  if (contract.kind !== GOVERNANCE_CASE_RESOLUTION_CONTRACT_KIND) {
    errors.push("governance case resolution contract kind drifted");
  }
  if (contract.version !== GOVERNANCE_CASE_RESOLUTION_CONTRACT_VERSION) {
    errors.push("governance case resolution contract version drifted");
  }
  if (contract.boundary !== GOVERNANCE_CASE_RESOLUTION_CONTRACT_BOUNDARY) {
    errors.push("governance case resolution contract boundary drifted");
  }
  if (!isPlainObject(contract.resolution_profile_ref)) {
    errors.push("governance case resolution contract profile ref missing");
  }
  if (contract.case_resolution_available !== true) {
    errors.push("governance case resolution availability drifted");
  }
  if (contract.closure_readiness_available !== true) {
    errors.push("governance case resolution closure readiness drifted");
  }
  if (contract.recommendation_only !== true) {
    errors.push("governance case resolution recommendation boundary drifted");
  }
  if (contract.additive_only !== true) {
    errors.push("governance case resolution additive boundary drifted");
  }
  if (contract.execution_enabled !== false) {
    errors.push("governance case resolution execution boundary drifted");
  }
  if (contract.default_on !== false) {
    errors.push("governance case resolution default-on drifted");
  }
  if (contract.actual_escalation_execution !== false) {
    errors.push("governance case resolution escalation execution drifted");
  }
  if (contract.actual_closure_execution !== false) {
    errors.push("governance case resolution closure execution drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance case resolution authority scope drifted");
  }
  if (contract.authority_scope_expansion !== false) {
    errors.push("governance case resolution authority expansion drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance case resolution canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseResolutionContract(contract) {
  const validation = validateGovernanceCaseResolutionContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case resolution contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
