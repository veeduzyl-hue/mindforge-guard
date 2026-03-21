import {
  POLICY_INHERITANCE_CONTRACT_BOUNDARY,
  POLICY_PROFILE_BOUNDARY,
  POLICY_PROFILE_KIND,
  POLICY_PROFILE_STAGE,
  POLICY_PROFILE_VERSION,
  assertValidPolicyProfile,
} from "./profile.mjs";

export const POLICY_PINNING_CONTRACT_KIND = "policy_pinning_contract";
export const POLICY_PINNING_CONTRACT_VERSION = "v1";
export const POLICY_PINNING_CONTRACT_BOUNDARY =
  "bounded_policy_pinning_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildPolicyPinningContract({ policyProfile }) {
  const profile = assertValidPolicyProfile(policyProfile);

  return {
    kind: POLICY_PINNING_CONTRACT_KIND,
    version: POLICY_PINNING_CONTRACT_VERSION,
    boundary: POLICY_PINNING_CONTRACT_BOUNDARY,
    policy_ref: {
      kind: POLICY_PROFILE_KIND,
      version: POLICY_PROFILE_VERSION,
      stage: POLICY_PROFILE_STAGE,
      boundary: POLICY_PROFILE_BOUNDARY,
    },
    inheritance_boundary: POLICY_INHERITANCE_CONTRACT_BOUNDARY,
    recommendation_only: true,
    additive_only: true,
    execution_enabled: false,
    default_on: false,
    authority_scope: "review_gate_deny_exit_recommendation_only",
    authority_scope_expansion: false,
    bounded_pinning: true,
  };
}

export function validatePolicyPinningContract(contract) {
  const errors = [];

  if (!isPlainObject(contract)) {
    return { ok: false, errors: ["policy pinning contract must be an object"] };
  }
  if (contract.kind !== POLICY_PINNING_CONTRACT_KIND) {
    errors.push("policy pinning contract kind drifted");
  }
  if (contract.version !== POLICY_PINNING_CONTRACT_VERSION) {
    errors.push("policy pinning contract version drifted");
  }
  if (contract.boundary !== POLICY_PINNING_CONTRACT_BOUNDARY) {
    errors.push("policy pinning contract boundary drifted");
  }
  if (!isPlainObject(contract.policy_ref)) {
    errors.push("policy pinning contract ref must be an object");
  } else {
    if (contract.policy_ref.kind !== POLICY_PROFILE_KIND) {
      errors.push("policy pinning ref kind drifted");
    }
    if (contract.policy_ref.version !== POLICY_PROFILE_VERSION) {
      errors.push("policy pinning ref version drifted");
    }
    if (contract.policy_ref.stage !== POLICY_PROFILE_STAGE) {
      errors.push("policy pinning ref stage drifted");
    }
    if (contract.policy_ref.boundary !== POLICY_PROFILE_BOUNDARY) {
      errors.push("policy pinning ref boundary drifted");
    }
  }
  if (contract.inheritance_boundary !== POLICY_INHERITANCE_CONTRACT_BOUNDARY) {
    errors.push("policy pinning inheritance boundary drifted");
  }
  if (contract.recommendation_only !== true) {
    errors.push("policy pinning recommendation boundary drifted");
  }
  if (contract.additive_only !== true) {
    errors.push("policy pinning additive boundary drifted");
  }
  if (contract.execution_enabled !== false) {
    errors.push("policy pinning execution boundary drifted");
  }
  if (contract.default_on !== false) {
    errors.push("policy pinning default-on boundary drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("policy pinning authority scope drifted");
  }
  if (contract.authority_scope_expansion !== false) {
    errors.push("policy pinning authority scope expansion drifted");
  }
  if (contract.bounded_pinning !== true) {
    errors.push("policy pinning boundedness drifted");
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidPolicyPinningContract(contract) {
  const validation = validatePolicyPinningContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `policy pinning contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
