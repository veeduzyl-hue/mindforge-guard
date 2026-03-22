import {
  GOVERNANCE_CASE_RESOLUTION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_CONTRACT_KIND,
  GOVERNANCE_CASE_RESOLUTION_CONTRACT_VERSION,
  assertValidGovernanceCaseResolutionContract,
} from "./governanceCaseResolutionContract.mjs";

export const GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_KIND =
  "governance_case_resolution_compatibility_contract";
export const GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_VERSION = "v1";
export const GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_BOUNDARY =
  "bounded_governance_case_resolution_compatibility_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseResolutionCompatibilityContract({
  governanceCaseResolutionContract,
}) {
  const contract = assertValidGovernanceCaseResolutionContract(
    governanceCaseResolutionContract
  );

  return {
    kind: GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_KIND,
    version: GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_VERSION,
    boundary: GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_BOUNDARY,
    resolution_contract_ref: {
      kind: GOVERNANCE_CASE_RESOLUTION_CONTRACT_KIND,
      version: GOVERNANCE_CASE_RESOLUTION_CONTRACT_VERSION,
      boundary: GOVERNANCE_CASE_RESOLUTION_CONTRACT_BOUNDARY,
    },
    consumer_compatible: true,
    closure_readiness_available: true,
    recommendation_only: true,
    additive_only: true,
    execution_enabled: false,
    default_on: false,
    actual_escalation_execution: false,
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

export function validateGovernanceCaseResolutionCompatibilityContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case resolution compatibility contract must be an object",
      ],
    };
  }
  if (contract.kind !== GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_KIND) {
    errors.push("governance case resolution compatibility kind drifted");
  }
  if (
    contract.version !== GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_VERSION
  ) {
    errors.push("governance case resolution compatibility version drifted");
  }
  if (
    contract.boundary !== GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_BOUNDARY
  ) {
    errors.push("governance case resolution compatibility boundary drifted");
  }
  if (!isPlainObject(contract.resolution_contract_ref)) {
    errors.push("governance case resolution compatibility ref missing");
  }
  if (contract.consumer_compatible !== true) {
    errors.push("governance case resolution consumer compatibility drifted");
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
  if (contract.audit_output_preserved !== true) {
    errors.push("governance case resolution audit output drifted");
  }
  if (contract.audit_verdict_preserved !== true) {
    errors.push("governance case resolution audit verdict drifted");
  }
  if (contract.actual_exit_code_preserved !== true) {
    errors.push("governance case resolution actual exit drifted");
  }
  if (contract.denied_exit_code_preserved !== 25) {
    errors.push("governance case resolution deny exit drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance case resolution authority scope drifted");
  }
  if (contract.governance_object_addition !== false) {
    errors.push("governance case resolution governance object boundary drifted");
  }
  if (contract.main_path_takeover !== false) {
    errors.push("governance case resolution main path takeover drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance case resolution canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseResolutionCompatibilityContract(contract) {
  const validation = validateGovernanceCaseResolutionCompatibilityContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case resolution compatibility invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
