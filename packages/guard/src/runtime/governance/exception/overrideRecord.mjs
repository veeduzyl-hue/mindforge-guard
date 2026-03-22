import {
  GOVERNANCE_EXCEPTION_CONTRACT_BOUNDARY,
  GOVERNANCE_EXCEPTION_CONTRACT_KIND,
  GOVERNANCE_EXCEPTION_CONTRACT_VERSION,
  GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY,
  GOVERNANCE_EXCEPTION_PROFILE_KIND,
  GOVERNANCE_EXCEPTION_PROFILE_VERSION,
  assertValidGovernanceExceptionProfile,
} from "./profile.mjs";

export const GOVERNANCE_OVERRIDE_RECORD_CONTRACT_KIND =
  "governance_override_record_contract";
export const GOVERNANCE_OVERRIDE_RECORD_CONTRACT_VERSION = "v1";
export const GOVERNANCE_OVERRIDE_RECORD_CONTRACT_BOUNDARY =
  "bounded_governance_override_record_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceOverrideRecordContract({
  governanceExceptionProfile,
}) {
  const exceptionProfile = assertValidGovernanceExceptionProfile(
    governanceExceptionProfile
  );

  return {
    kind: GOVERNANCE_OVERRIDE_RECORD_CONTRACT_KIND,
    version: GOVERNANCE_OVERRIDE_RECORD_CONTRACT_VERSION,
    boundary: GOVERNANCE_OVERRIDE_RECORD_CONTRACT_BOUNDARY,
    exception_ref: {
      kind: GOVERNANCE_EXCEPTION_PROFILE_KIND,
      version: GOVERNANCE_EXCEPTION_PROFILE_VERSION,
      boundary: GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY,
    },
    exception_contract_ref: {
      kind: GOVERNANCE_EXCEPTION_CONTRACT_KIND,
      version: GOVERNANCE_EXCEPTION_CONTRACT_VERSION,
      boundary: GOVERNANCE_EXCEPTION_CONTRACT_BOUNDARY,
    },
    override_record_ready: true,
    case_linkage_available: true,
    recommendation_only: true,
    additive_only: true,
    execution_enabled: false,
    override_execution_available: false,
    authority_scope: "review_gate_deny_exit_recommendation_only",
    authority_scope_expansion: false,
    canonical_action_hash: exceptionProfile.canonical_action_hash,
  };
}

export function validateGovernanceOverrideRecordContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: ["governance override record contract must be an object"],
    };
  }
  if (contract.kind !== GOVERNANCE_OVERRIDE_RECORD_CONTRACT_KIND) {
    errors.push("governance override record kind drifted");
  }
  if (contract.version !== GOVERNANCE_OVERRIDE_RECORD_CONTRACT_VERSION) {
    errors.push("governance override record version drifted");
  }
  if (contract.boundary !== GOVERNANCE_OVERRIDE_RECORD_CONTRACT_BOUNDARY) {
    errors.push("governance override record boundary drifted");
  }
  if (!isPlainObject(contract.exception_ref)) {
    errors.push("governance override record exception ref missing");
  } else {
    if (contract.exception_ref.kind !== GOVERNANCE_EXCEPTION_PROFILE_KIND) {
      errors.push("governance override record exception ref kind drifted");
    }
    if (contract.exception_ref.version !== GOVERNANCE_EXCEPTION_PROFILE_VERSION) {
      errors.push("governance override record exception ref version drifted");
    }
    if (contract.exception_ref.boundary !== GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY) {
      errors.push("governance override record exception ref boundary drifted");
    }
  }
  if (!isPlainObject(contract.exception_contract_ref)) {
    errors.push("governance override record exception contract ref missing");
  } else {
    if (contract.exception_contract_ref.kind !== GOVERNANCE_EXCEPTION_CONTRACT_KIND) {
      errors.push("governance override record exception contract kind drifted");
    }
    if (
      contract.exception_contract_ref.version !==
      GOVERNANCE_EXCEPTION_CONTRACT_VERSION
    ) {
      errors.push("governance override record exception contract version drifted");
    }
    if (
      contract.exception_contract_ref.boundary !==
      GOVERNANCE_EXCEPTION_CONTRACT_BOUNDARY
    ) {
      errors.push("governance override record exception contract boundary drifted");
    }
  }
  if (contract.override_record_ready !== true) {
    errors.push("governance override record readiness drifted");
  }
  if (contract.case_linkage_available !== true) {
    errors.push("governance override record case linkage availability drifted");
  }
  if (contract.recommendation_only !== true) {
    errors.push("governance override record recommendation boundary drifted");
  }
  if (contract.additive_only !== true) {
    errors.push("governance override record additive boundary drifted");
  }
  if (contract.execution_enabled !== false) {
    errors.push("governance override record execution boundary drifted");
  }
  if (contract.override_execution_available !== false) {
    errors.push("governance override record execution availability drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance override record authority scope drifted");
  }
  if (contract.authority_scope_expansion !== false) {
    errors.push("governance override record authority expansion drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance override record canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceOverrideRecordContract(contract) {
  const validation = validateGovernanceOverrideRecordContract(contract);
  if (validation.ok) return contract;
  const err = new Error(
    `governance override record contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
