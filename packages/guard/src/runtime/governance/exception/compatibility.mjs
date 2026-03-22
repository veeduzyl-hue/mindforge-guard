import {
  GOVERNANCE_CASE_LINKAGE_BOUNDARY,
  GOVERNANCE_CASE_LINKAGE_KIND,
  GOVERNANCE_CASE_LINKAGE_VERSION,
  assertValidGovernanceCaseLinkageProfile,
} from "./caseLinkage.mjs";

export const GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_KIND =
  "governance_exception_compatibility_contract";
export const GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_VERSION = "v1";
export const GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_BOUNDARY =
  "bounded_governance_exception_compatibility_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceExceptionCompatibilityContract({
  governanceCaseLinkageProfile,
}) {
  const caseLinkage = assertValidGovernanceCaseLinkageProfile(
    governanceCaseLinkageProfile
  );

  return {
    kind: GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_KIND,
    version: GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_VERSION,
    boundary: GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_BOUNDARY,
    case_linkage_ref: {
      kind: GOVERNANCE_CASE_LINKAGE_KIND,
      version: GOVERNANCE_CASE_LINKAGE_VERSION,
      boundary: GOVERNANCE_CASE_LINKAGE_BOUNDARY,
    },
    consumer_compatible: true,
    override_record_ready: true,
    recommendation_only: true,
    additive_only: true,
    execution_enabled: false,
    default_on: false,
    audit_output_preserved: true,
    audit_verdict_preserved: true,
    actual_exit_code_preserved: true,
    denied_exit_code_preserved: 25,
    authority_scope: "review_gate_deny_exit_recommendation_only",
    governance_object_addition: false,
    main_path_takeover: false,
    canonical_action_hash: caseLinkage.canonical_action_hash,
  };
}

export function validateGovernanceExceptionCompatibilityContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance exception compatibility contract must be an object",
      ],
    };
  }
  if (contract.kind !== GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_KIND) {
    errors.push("governance exception compatibility kind drifted");
  }
  if (contract.version !== GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_VERSION) {
    errors.push("governance exception compatibility version drifted");
  }
  if (contract.boundary !== GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_BOUNDARY) {
    errors.push("governance exception compatibility boundary drifted");
  }
  if (!isPlainObject(contract.case_linkage_ref)) {
    errors.push("governance exception compatibility case linkage ref missing");
  } else {
    if (contract.case_linkage_ref.kind !== GOVERNANCE_CASE_LINKAGE_KIND) {
      errors.push("governance exception compatibility case linkage kind drifted");
    }
    if (contract.case_linkage_ref.version !== GOVERNANCE_CASE_LINKAGE_VERSION) {
      errors.push("governance exception compatibility case linkage version drifted");
    }
    if (contract.case_linkage_ref.boundary !== GOVERNANCE_CASE_LINKAGE_BOUNDARY) {
      errors.push("governance exception compatibility case linkage boundary drifted");
    }
  }
  if (contract.consumer_compatible !== true) {
    errors.push("governance exception compatibility readiness drifted");
  }
  if (contract.override_record_ready !== true) {
    errors.push("governance exception compatibility override readiness drifted");
  }
  if (contract.recommendation_only !== true) {
    errors.push("governance exception compatibility recommendation boundary drifted");
  }
  if (contract.additive_only !== true) {
    errors.push("governance exception compatibility additive boundary drifted");
  }
  if (contract.execution_enabled !== false) {
    errors.push("governance exception compatibility execution boundary drifted");
  }
  if (contract.default_on !== false) {
    errors.push("governance exception compatibility default-on drifted");
  }
  if (contract.audit_output_preserved !== true) {
    errors.push("governance exception compatibility audit output drifted");
  }
  if (contract.audit_verdict_preserved !== true) {
    errors.push("governance exception compatibility audit verdict drifted");
  }
  if (contract.actual_exit_code_preserved !== true) {
    errors.push("governance exception compatibility actual exit drifted");
  }
  if (contract.denied_exit_code_preserved !== 25) {
    errors.push("governance exception compatibility deny exit drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance exception compatibility authority scope drifted");
  }
  if (contract.governance_object_addition !== false) {
    errors.push("governance exception compatibility governance object boundary drifted");
  }
  if (contract.main_path_takeover !== false) {
    errors.push("governance exception compatibility main path takeover drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance exception compatibility canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceExceptionCompatibilityContract(contract) {
  const validation = validateGovernanceExceptionCompatibilityContract(contract);
  if (validation.ok) return contract;
  const err = new Error(
    `governance exception compatibility contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
