import {
  GOVERNANCE_CASE_CLOSURE_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_CLOSURE_PROFILE_KIND,
  GOVERNANCE_CASE_CLOSURE_PROFILE_VERSION,
  assertValidGovernanceCaseClosureProfile,
} from "./governanceCaseClosureProfile.mjs";

export const GOVERNANCE_CASE_CLOSURE_CONTRACT_KIND =
  "governance_case_closure_contract";
export const GOVERNANCE_CASE_CLOSURE_CONTRACT_VERSION = "v1";
export const GOVERNANCE_CASE_CLOSURE_CONTRACT_BOUNDARY =
  "bounded_governance_case_closure_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseClosureContract({
  governanceCaseClosureProfile,
}) {
  const profile = assertValidGovernanceCaseClosureProfile(
    governanceCaseClosureProfile
  );

  return {
    kind: GOVERNANCE_CASE_CLOSURE_CONTRACT_KIND,
    version: GOVERNANCE_CASE_CLOSURE_CONTRACT_VERSION,
    boundary: GOVERNANCE_CASE_CLOSURE_CONTRACT_BOUNDARY,
    closure_profile_ref: {
      kind: GOVERNANCE_CASE_CLOSURE_PROFILE_KIND,
      version: GOVERNANCE_CASE_CLOSURE_PROFILE_VERSION,
      boundary: GOVERNANCE_CASE_CLOSURE_PROFILE_BOUNDARY,
    },
    case_closure_available: true,
    closure_readiness_available: true,
    post_closure_observation_readiness_available: true,
    recommendation_only: true,
    additive_only: true,
    execution_enabled: false,
    default_on: false,
    actual_closure_execution: false,
    actual_routing: false,
    workflow_transition: false,
    authority_scope: "review_gate_deny_exit_recommendation_only",
    authority_scope_expansion: false,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseClosureContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: ["governance case closure contract must be an object"],
    };
  }
  if (contract.kind !== GOVERNANCE_CASE_CLOSURE_CONTRACT_KIND) {
    errors.push("governance case closure contract kind drifted");
  }
  if (contract.version !== GOVERNANCE_CASE_CLOSURE_CONTRACT_VERSION) {
    errors.push("governance case closure contract version drifted");
  }
  if (contract.boundary !== GOVERNANCE_CASE_CLOSURE_CONTRACT_BOUNDARY) {
    errors.push("governance case closure contract boundary drifted");
  }
  if (!isPlainObject(contract.closure_profile_ref)) {
    errors.push("governance case closure contract profile ref missing");
  }
  if (contract.case_closure_available !== true) {
    errors.push("governance case closure availability drifted");
  }
  if (contract.closure_readiness_available !== true) {
    errors.push("governance case closure readiness availability drifted");
  }
  if (contract.post_closure_observation_readiness_available !== true) {
    errors.push("governance case closure post observation availability drifted");
  }
  if (contract.recommendation_only !== true) {
    errors.push("governance case closure recommendation boundary drifted");
  }
  if (contract.additive_only !== true) {
    errors.push("governance case closure additive boundary drifted");
  }
  if (contract.execution_enabled !== false) {
    errors.push("governance case closure execution boundary drifted");
  }
  if (contract.default_on !== false) {
    errors.push("governance case closure default-on drifted");
  }
  if (contract.actual_closure_execution !== false) {
    errors.push("governance case closure execution availability drifted");
  }
  if (contract.actual_routing !== false) {
    errors.push("governance case closure routing availability drifted");
  }
  if (contract.workflow_transition !== false) {
    errors.push("governance case closure workflow transition drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance case closure authority scope drifted");
  }
  if (contract.authority_scope_expansion !== false) {
    errors.push("governance case closure authority expansion drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance case closure canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseClosureContract(contract) {
  const validation = validateGovernanceCaseClosureContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case closure contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
