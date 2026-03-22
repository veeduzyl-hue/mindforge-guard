import {
  GOVERNANCE_CASE_CLOSURE_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_CLOSURE_CONTRACT_KIND,
  GOVERNANCE_CASE_CLOSURE_CONTRACT_VERSION,
  assertValidGovernanceCaseClosureContract,
} from "./governanceCaseClosureContract.mjs";

export const GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_KIND =
  "governance_case_closure_compatibility_contract";
export const GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_VERSION = "v1";
export const GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_BOUNDARY =
  "bounded_governance_case_closure_compatibility_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseClosureCompatibilityContract({
  governanceCaseClosureContract,
}) {
  const contract = assertValidGovernanceCaseClosureContract(
    governanceCaseClosureContract
  );

  return {
    kind: GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_KIND,
    version: GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_VERSION,
    boundary: GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_BOUNDARY,
    closure_contract_ref: {
      kind: GOVERNANCE_CASE_CLOSURE_CONTRACT_KIND,
      version: GOVERNANCE_CASE_CLOSURE_CONTRACT_VERSION,
      boundary: GOVERNANCE_CASE_CLOSURE_CONTRACT_BOUNDARY,
    },
    consumer_compatible: true,
    closure_readiness_available: true,
    post_closure_observation_readiness_available: true,
    recommendation_only: true,
    additive_only: true,
    execution_enabled: false,
    default_on: false,
    actual_closure_execution: false,
    actual_routing: false,
    workflow_transition: false,
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

export function validateGovernanceCaseClosureCompatibilityContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: ["governance case closure compatibility contract must be an object"],
    };
  }
  if (contract.kind !== GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_KIND) {
    errors.push("governance case closure compatibility kind drifted");
  }
  if (
    contract.version !== GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_VERSION
  ) {
    errors.push("governance case closure compatibility version drifted");
  }
  if (
    contract.boundary !== GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_BOUNDARY
  ) {
    errors.push("governance case closure compatibility boundary drifted");
  }
  if (!isPlainObject(contract.closure_contract_ref)) {
    errors.push("governance case closure compatibility ref missing");
  }
  if (contract.consumer_compatible !== true) {
    errors.push("governance case closure consumer compatibility drifted");
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
    errors.push("governance case closure execution drifted");
  }
  if (contract.actual_routing !== false) {
    errors.push("governance case closure routing drifted");
  }
  if (contract.workflow_transition !== false) {
    errors.push("governance case closure workflow transition drifted");
  }
  if (contract.audit_output_preserved !== true) {
    errors.push("governance case closure audit output drifted");
  }
  if (contract.audit_verdict_preserved !== true) {
    errors.push("governance case closure audit verdict drifted");
  }
  if (contract.actual_exit_code_preserved !== true) {
    errors.push("governance case closure actual exit drifted");
  }
  if (contract.denied_exit_code_preserved !== 25) {
    errors.push("governance case closure deny exit drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance case closure authority scope drifted");
  }
  if (contract.governance_object_addition !== false) {
    errors.push("governance case closure governance object boundary drifted");
  }
  if (contract.main_path_takeover !== false) {
    errors.push("governance case closure main path takeover drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance case closure canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseClosureCompatibilityContract(contract) {
  const validation = validateGovernanceCaseClosureCompatibilityContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case closure compatibility invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
