import { assertValidEnforcementReadinessProfile } from "./profile.mjs";

export const ROLLBACK_SAFETY_CONTRACT_KIND = "rollback_safety_contract";
export const ROLLBACK_SAFETY_CONTRACT_VERSION = "v1";
export const ROLLBACK_SAFETY_CONTRACT_BOUNDARY =
  "bounded_non_executing_rollback_safety";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildRollbackSafetyContract({ enforcementReadinessProfile }) {
  const readiness = assertValidEnforcementReadinessProfile(
    enforcementReadinessProfile
  );
  const preservation = readiness.enforcement_readiness.preservation_contract;

  return {
    kind: ROLLBACK_SAFETY_CONTRACT_KIND,
    version: ROLLBACK_SAFETY_CONTRACT_VERSION,
    boundary: ROLLBACK_SAFETY_CONTRACT_BOUNDARY,
    rollback_execution_enabled: false,
    override_execution_enabled: false,
    audit_output_preserved: preservation.audit_output_preserved,
    audit_verdict_preserved: preservation.audit_verdict_preserved,
    actual_exit_code_preserved: preservation.actual_exit_code_preserved,
    denied_exit_code_preserved: preservation.denied_exit_code_preserved,
    governance_object_addition: preservation.governance_object_addition,
    rollback_safe: true,
  };
}

export function validateRollbackSafetyContract(contract) {
  const errors = [];

  if (!isPlainObject(contract)) {
    return { ok: false, errors: ["rollback safety contract must be an object"] };
  }
  if (contract.kind !== ROLLBACK_SAFETY_CONTRACT_KIND) {
    errors.push("rollback safety contract kind drifted");
  }
  if (contract.version !== ROLLBACK_SAFETY_CONTRACT_VERSION) {
    errors.push("rollback safety contract version drifted");
  }
  if (contract.boundary !== ROLLBACK_SAFETY_CONTRACT_BOUNDARY) {
    errors.push("rollback safety contract boundary drifted");
  }
  if (contract.rollback_execution_enabled !== false) {
    errors.push("rollback execution boundary drifted");
  }
  if (contract.override_execution_enabled !== false) {
    errors.push("override execution boundary drifted");
  }
  if (contract.audit_output_preserved !== true) {
    errors.push("rollback safety audit output boundary drifted");
  }
  if (contract.audit_verdict_preserved !== true) {
    errors.push("rollback safety audit verdict boundary drifted");
  }
  if (contract.actual_exit_code_preserved !== true) {
    errors.push("rollback safety actual exit boundary drifted");
  }
  if (contract.denied_exit_code_preserved !== 25) {
    errors.push("rollback safety deny exit drifted");
  }
  if (contract.governance_object_addition !== false) {
    errors.push("rollback safety governance object boundary drifted");
  }
  if (contract.rollback_safe !== true) {
    errors.push("rollback safety readiness drifted");
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidRollbackSafetyContract(contract) {
  const validation = validateRollbackSafetyContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `rollback safety contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
