import {
  GOVERNANCE_CASE_ESCALATION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_CONTRACT_KIND,
  GOVERNANCE_CASE_ESCALATION_CONTRACT_VERSION,
  assertValidGovernanceCaseEscalationContract,
} from "./governanceCaseEscalationContract.mjs";

export const GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_KIND =
  "governance_case_escalation_compatibility_contract";
export const GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_VERSION = "v1";
export const GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_BOUNDARY =
  "bounded_governance_case_escalation_compatibility_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseEscalationCompatibilityContract({
  governanceCaseEscalationContract,
}) {
  const contract = assertValidGovernanceCaseEscalationContract(
    governanceCaseEscalationContract
  );

  return {
    kind: GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_KIND,
    version: GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_VERSION,
    boundary: GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_BOUNDARY,
    escalation_contract_ref: {
      kind: GOVERNANCE_CASE_ESCALATION_CONTRACT_KIND,
      version: GOVERNANCE_CASE_ESCALATION_CONTRACT_VERSION,
      boundary: GOVERNANCE_CASE_ESCALATION_CONTRACT_BOUNDARY,
    },
    consumer_compatible: true,
    escalation_lane_available: true,
    closure_readiness_available: true,
    recommendation_only: true,
    additive_only: true,
    execution_enabled: false,
    default_on: false,
    actual_escalation_execution: false,
    actual_routing: false,
    actual_closure_execution: false,
    audit_output_preserved: true,
    audit_verdict_preserved: true,
    actual_exit_code_preserved: true,
    denied_exit_code_preserved: 25,
    authority_scope: "review_gate_deny_exit_recommendation_only",
    governance_object_addition: false,
    main_path_takeover: false,
    canonical_action_hash: contract.canonical_action_hash,
  };
}

export function validateGovernanceCaseEscalationCompatibilityContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case escalation compatibility contract must be an object",
      ],
    };
  }
  if (contract.kind !== GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_KIND) {
    errors.push("governance case escalation compatibility kind drifted");
  }
  if (
    contract.version !== GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_VERSION
  ) {
    errors.push("governance case escalation compatibility version drifted");
  }
  if (
    contract.boundary !== GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_BOUNDARY
  ) {
    errors.push("governance case escalation compatibility boundary drifted");
  }
  if (!isPlainObject(contract.escalation_contract_ref)) {
    errors.push("governance case escalation compatibility ref missing");
  }
  if (contract.consumer_compatible !== true) {
    errors.push("governance case escalation consumer compatibility drifted");
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
    errors.push("governance case escalation execution drifted");
  }
  if (contract.actual_routing !== false) {
    errors.push("governance case escalation routing drifted");
  }
  if (contract.actual_closure_execution !== false) {
    errors.push("governance case escalation closure execution drifted");
  }
  if (contract.audit_output_preserved !== true) {
    errors.push("governance case escalation audit output drifted");
  }
  if (contract.audit_verdict_preserved !== true) {
    errors.push("governance case escalation audit verdict drifted");
  }
  if (contract.actual_exit_code_preserved !== true) {
    errors.push("governance case escalation actual exit drifted");
  }
  if (contract.denied_exit_code_preserved !== 25) {
    errors.push("governance case escalation deny exit drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance case escalation authority scope drifted");
  }
  if (contract.governance_object_addition !== false) {
    errors.push("governance case escalation governance object boundary drifted");
  }
  if (contract.main_path_takeover !== false) {
    errors.push("governance case escalation main path takeover drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance case escalation canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseEscalationCompatibilityContract(contract) {
  const validation = validateGovernanceCaseEscalationCompatibilityContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case escalation compatibility invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
