import {
  GOVERNANCE_CASE_ESCALATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_PROFILE_KIND,
  GOVERNANCE_CASE_ESCALATION_PROFILE_VERSION,
  assertValidGovernanceCaseEscalationProfile,
} from "./governanceCaseEscalationProfile.mjs";

export const GOVERNANCE_CASE_ESCALATION_CONTRACT_KIND =
  "governance_case_escalation_contract";
export const GOVERNANCE_CASE_ESCALATION_CONTRACT_VERSION = "v1";
export const GOVERNANCE_CASE_ESCALATION_CONTRACT_BOUNDARY =
  "bounded_governance_case_escalation_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseEscalationContract({
  governanceCaseEscalationProfile,
}) {
  const profile = assertValidGovernanceCaseEscalationProfile(
    governanceCaseEscalationProfile
  );

  return {
    kind: GOVERNANCE_CASE_ESCALATION_CONTRACT_KIND,
    version: GOVERNANCE_CASE_ESCALATION_CONTRACT_VERSION,
    boundary: GOVERNANCE_CASE_ESCALATION_CONTRACT_BOUNDARY,
    escalation_profile_ref: {
      kind: GOVERNANCE_CASE_ESCALATION_PROFILE_KIND,
      version: GOVERNANCE_CASE_ESCALATION_PROFILE_VERSION,
      boundary: GOVERNANCE_CASE_ESCALATION_PROFILE_BOUNDARY,
    },
    case_escalation_available: true,
    escalation_lane_available: true,
    closure_readiness_available: true,
    recommendation_only: true,
    additive_only: true,
    execution_enabled: false,
    default_on: false,
    actual_escalation_execution: false,
    actual_routing: false,
    actual_closure_execution: false,
    authority_scope: "review_gate_deny_exit_recommendation_only",
    authority_scope_expansion: false,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseEscalationContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: ["governance case escalation contract must be an object"],
    };
  }
  if (contract.kind !== GOVERNANCE_CASE_ESCALATION_CONTRACT_KIND) {
    errors.push("governance case escalation contract kind drifted");
  }
  if (contract.version !== GOVERNANCE_CASE_ESCALATION_CONTRACT_VERSION) {
    errors.push("governance case escalation contract version drifted");
  }
  if (contract.boundary !== GOVERNANCE_CASE_ESCALATION_CONTRACT_BOUNDARY) {
    errors.push("governance case escalation contract boundary drifted");
  }
  if (!isPlainObject(contract.escalation_profile_ref)) {
    errors.push("governance case escalation contract profile ref missing");
  }
  if (contract.case_escalation_available !== true) {
    errors.push("governance case escalation availability drifted");
  }
  if (contract.escalation_lane_available !== true) {
    errors.push("governance case escalation lane availability drifted");
  }
  if (contract.closure_readiness_available !== true) {
    errors.push("governance case escalation closure readiness drifted");
  }
  if (contract.recommendation_only !== true) {
    errors.push("governance case escalation recommendation boundary drifted");
  }
  if (contract.additive_only !== true) {
    errors.push("governance case escalation additive boundary drifted");
  }
  if (contract.execution_enabled !== false) {
    errors.push("governance case escalation execution boundary drifted");
  }
  if (contract.default_on !== false) {
    errors.push("governance case escalation default-on drifted");
  }
  if (contract.actual_escalation_execution !== false) {
    errors.push("governance case escalation execution availability drifted");
  }
  if (contract.actual_routing !== false) {
    errors.push("governance case escalation routing availability drifted");
  }
  if (contract.actual_closure_execution !== false) {
    errors.push("governance case escalation closure execution drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance case escalation authority scope drifted");
  }
  if (contract.authority_scope_expansion !== false) {
    errors.push("governance case escalation authority expansion drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance case escalation canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseEscalationContract(contract) {
  const validation = validateGovernanceCaseEscalationContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case escalation contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
