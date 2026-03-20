import {
  ENFORCEMENT_SCOPE_CONTRACT_BOUNDARY,
  ENFORCEMENT_SCOPE_CONTRACT_KIND,
  ENFORCEMENT_SCOPE_CONTRACT_VERSION,
  ENFORCEMENT_SCOPE_REVIEW_ONLY,
  assertValidEnforcementReadinessProfile,
} from "./profile.mjs";

export const AUTHORITY_PROOF_CONTRACT_KIND = "authority_proof_contract";
export const AUTHORITY_PROOF_CONTRACT_VERSION = "v1";
export const AUTHORITY_PROOF_CONTRACT_BOUNDARY =
  "bounded_non_executing_authority_proof";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildAuthorityProofContract({ enforcementReadinessProfile }) {
  const readiness = assertValidEnforcementReadinessProfile(
    enforcementReadinessProfile
  );
  const scope = readiness.enforcement_readiness.scope_contract;

  return {
    kind: AUTHORITY_PROOF_CONTRACT_KIND,
    version: AUTHORITY_PROOF_CONTRACT_VERSION,
    boundary: AUTHORITY_PROOF_CONTRACT_BOUNDARY,
    source_contract: {
      kind: ENFORCEMENT_SCOPE_CONTRACT_KIND,
      version: ENFORCEMENT_SCOPE_CONTRACT_VERSION,
      boundary: ENFORCEMENT_SCOPE_CONTRACT_BOUNDARY,
    },
    recommendation_only: scope.recommendation_only,
    additive_only: scope.additive_only,
    execution_enabled: scope.execution_enabled,
    default_on: scope.default_on,
    authority_scope: scope.authority_scope,
    authority_scope_expansion: scope.authority_scope_expansion,
    proof_ready: scope.authority_scope === ENFORCEMENT_SCOPE_REVIEW_ONLY,
    non_executing: true,
  };
}

export function validateAuthorityProofContract(contract) {
  const errors = [];

  if (!isPlainObject(contract)) {
    return { ok: false, errors: ["authority proof contract must be an object"] };
  }
  if (contract.kind !== AUTHORITY_PROOF_CONTRACT_KIND) {
    errors.push("authority proof contract kind drifted");
  }
  if (contract.version !== AUTHORITY_PROOF_CONTRACT_VERSION) {
    errors.push("authority proof contract version drifted");
  }
  if (contract.boundary !== AUTHORITY_PROOF_CONTRACT_BOUNDARY) {
    errors.push("authority proof contract boundary drifted");
  }
  if (!isPlainObject(contract.source_contract)) {
    errors.push("authority proof source contract must be an object");
  } else {
    if (contract.source_contract.kind !== ENFORCEMENT_SCOPE_CONTRACT_KIND) {
      errors.push("authority proof source kind drifted");
    }
    if (
      contract.source_contract.version !== ENFORCEMENT_SCOPE_CONTRACT_VERSION
    ) {
      errors.push("authority proof source version drifted");
    }
    if (
      contract.source_contract.boundary !== ENFORCEMENT_SCOPE_CONTRACT_BOUNDARY
    ) {
      errors.push("authority proof source boundary drifted");
    }
  }
  if (contract.recommendation_only !== true) {
    errors.push("authority proof must remain recommendation-only");
  }
  if (contract.additive_only !== true) {
    errors.push("authority proof must remain additive-only");
  }
  if (contract.execution_enabled !== false) {
    errors.push("authority proof must remain non-executing");
  }
  if (contract.default_on !== false) {
    errors.push("authority proof must remain default-off");
  }
  if (contract.authority_scope !== ENFORCEMENT_SCOPE_REVIEW_ONLY) {
    errors.push("authority proof scope drifted");
  }
  if (contract.authority_scope_expansion !== false) {
    errors.push("authority proof scope expansion drifted");
  }
  if (contract.proof_ready !== true) {
    errors.push("authority proof readiness drifted");
  }
  if (contract.non_executing !== true) {
    errors.push("authority proof non-executing boundary drifted");
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidAuthorityProofContract(contract) {
  const validation = validateAuthorityProofContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `authority proof contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
