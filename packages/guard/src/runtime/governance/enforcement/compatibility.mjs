import {
  ENFORCEMENT_CONSUMER_SURFACE,
  ENFORCEMENT_READINESS_BOUNDARY,
  ENFORCEMENT_READINESS_KIND,
  ENFORCEMENT_READINESS_STAGE,
  ENFORCEMENT_READINESS_VERSION,
  assertValidEnforcementReadinessProfile,
} from "./profile.mjs";
import {
  AUTHORITY_PROOF_CONTRACT_BOUNDARY,
  AUTHORITY_PROOF_CONTRACT_KIND,
  AUTHORITY_PROOF_CONTRACT_VERSION,
  validateAuthorityProofContract,
  assertValidAuthorityProofContract,
  buildAuthorityProofContract,
} from "./proof.mjs";
import {
  ROLLBACK_SAFETY_CONTRACT_BOUNDARY,
  ROLLBACK_SAFETY_CONTRACT_KIND,
  ROLLBACK_SAFETY_CONTRACT_VERSION,
  validateRollbackSafetyContract,
  assertValidRollbackSafetyContract,
  buildRollbackSafetyContract,
} from "./rollback.mjs";

export const ENFORCEMENT_COMPATIBILITY_KIND =
  "enforcement_compatibility_readiness_profile";
export const ENFORCEMENT_COMPATIBILITY_VERSION = "v1";
export const ENFORCEMENT_COMPATIBILITY_SCHEMA_ID =
  "mindforge/enforcement-compatibility/v1";
export const ENFORCEMENT_COMPATIBILITY_STAGE =
  "enforcement_compatibility_phase2_v1";
export const ENFORCEMENT_COMPATIBILITY_BOUNDARY =
  "authority_proof_and_rollback_safety_consumer_compatibility";
export const ENFORCEMENT_RECEIPT_READY = "receipt_ready";
export const ENFORCEMENT_CONSUMER_COMPATIBLE = "consumer_compatible";
export const ENFORCEMENT_COMPATIBILITY_LEVELS = Object.freeze([
  ENFORCEMENT_RECEIPT_READY,
  ENFORCEMENT_CONSUMER_COMPATIBLE,
]);
export const ENFORCEMENT_COMPATIBILITY_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "enforcement_compatibility",
  "deterministic",
  "enforcing",
]);
export const ENFORCEMENT_COMPATIBILITY_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "enforcement_ref",
  "authority_proof_contract",
  "rollback_safety_contract",
  "receipt_readiness",
  "consumer_compatibility",
]);
export const ENFORCEMENT_COMPATIBILITY_STABLE_EXPORT_SET = Object.freeze([
  "ENFORCEMENT_COMPATIBILITY_KIND",
  "ENFORCEMENT_COMPATIBILITY_VERSION",
  "ENFORCEMENT_COMPATIBILITY_SCHEMA_ID",
  "ENFORCEMENT_COMPATIBILITY_STAGE",
  "ENFORCEMENT_COMPATIBILITY_BOUNDARY",
  "ENFORCEMENT_RECEIPT_READY",
  "ENFORCEMENT_CONSUMER_COMPATIBLE",
  "ENFORCEMENT_COMPATIBILITY_LEVELS",
  "ENFORCEMENT_COMPATIBILITY_TOP_LEVEL_FIELDS",
  "ENFORCEMENT_COMPATIBILITY_PAYLOAD_FIELDS",
  "ENFORCEMENT_COMPATIBILITY_STABLE_EXPORT_SET",
  "buildEnforcementCompatibilityProfile",
  "validateEnforcementCompatibilityProfile",
  "assertValidEnforcementCompatibilityProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildEnforcementCompatibilityProfile({
  enforcementReadinessProfile,
}) {
  const readiness = assertValidEnforcementReadinessProfile(
    enforcementReadinessProfile
  );
  const authorityProof = assertValidAuthorityProofContract(
    buildAuthorityProofContract({ enforcementReadinessProfile: readiness })
  );
  const rollbackSafety = assertValidRollbackSafetyContract(
    buildRollbackSafetyContract({ enforcementReadinessProfile: readiness })
  );

  return {
    kind: ENFORCEMENT_COMPATIBILITY_KIND,
    version: ENFORCEMENT_COMPATIBILITY_VERSION,
    schema_id: ENFORCEMENT_COMPATIBILITY_SCHEMA_ID,
    canonical_action_hash: readiness.canonical_action_hash,
    enforcement_compatibility: {
      stage: ENFORCEMENT_COMPATIBILITY_STAGE,
      consumer_surface: ENFORCEMENT_CONSUMER_SURFACE,
      boundary: ENFORCEMENT_COMPATIBILITY_BOUNDARY,
      enforcement_ref: {
        kind: ENFORCEMENT_READINESS_KIND,
        version: ENFORCEMENT_READINESS_VERSION,
        stage: ENFORCEMENT_READINESS_STAGE,
        boundary: ENFORCEMENT_READINESS_BOUNDARY,
      },
      authority_proof_contract: authorityProof,
      rollback_safety_contract: rollbackSafety,
      receipt_readiness: {
        level: ENFORCEMENT_RECEIPT_READY,
        proof_ready: authorityProof.proof_ready,
        rollback_safe: rollbackSafety.rollback_safe,
        recommendation_only: true,
      },
      consumer_compatibility: {
        level: ENFORCEMENT_CONSUMER_COMPATIBLE,
        additive_only: true,
        non_executing: true,
        default_off: true,
        authority_scope: authorityProof.authority_scope,
        denied_exit_code_preserved: rollbackSafety.denied_exit_code_preserved,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateEnforcementCompatibilityProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["enforcement compatibility profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(ENFORCEMENT_COMPATIBILITY_TOP_LEVEL_FIELDS)
  ) {
    errors.push("enforcement compatibility top-level field order drifted");
  }
  if (profile.kind !== ENFORCEMENT_COMPATIBILITY_KIND) {
    errors.push("enforcement compatibility kind drifted");
  }
  if (profile.version !== ENFORCEMENT_COMPATIBILITY_VERSION) {
    errors.push("enforcement compatibility version drifted");
  }
  if (profile.schema_id !== ENFORCEMENT_COMPATIBILITY_SCHEMA_ID) {
    errors.push("enforcement compatibility schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("enforcement compatibility canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("enforcement compatibility must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("enforcement compatibility must remain non-enforcing");
  }
  if (!isPlainObject(profile.enforcement_compatibility)) {
    errors.push("enforcement compatibility payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.enforcement_compatibility;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(ENFORCEMENT_COMPATIBILITY_PAYLOAD_FIELDS)
  ) {
    errors.push("enforcement compatibility payload field order drifted");
  }
  if (payload.stage !== ENFORCEMENT_COMPATIBILITY_STAGE) {
    errors.push("enforcement compatibility stage drifted");
  }
  if (payload.consumer_surface !== ENFORCEMENT_CONSUMER_SURFACE) {
    errors.push("enforcement compatibility consumer surface drifted");
  }
  if (payload.boundary !== ENFORCEMENT_COMPATIBILITY_BOUNDARY) {
    errors.push("enforcement compatibility boundary drifted");
  }
  if (!isPlainObject(payload.enforcement_ref)) {
    errors.push("enforcement compatibility ref must be an object");
  } else {
    if (payload.enforcement_ref.kind !== ENFORCEMENT_READINESS_KIND) {
      errors.push("enforcement compatibility ref kind drifted");
    }
    if (payload.enforcement_ref.version !== ENFORCEMENT_READINESS_VERSION) {
      errors.push("enforcement compatibility ref version drifted");
    }
    if (payload.enforcement_ref.stage !== ENFORCEMENT_READINESS_STAGE) {
      errors.push("enforcement compatibility ref stage drifted");
    }
    if (payload.enforcement_ref.boundary !== ENFORCEMENT_READINESS_BOUNDARY) {
      errors.push("enforcement compatibility ref boundary drifted");
    }
  }
  const proofValidation = validateAuthorityProofContract(
    payload.authority_proof_contract
  );
  if (!proofValidation.ok) {
    errors.push(...proofValidation.errors);
  }
  const rollbackValidation = validateRollbackSafetyContract(
    payload.rollback_safety_contract
  );
  if (!rollbackValidation.ok) {
    errors.push(...rollbackValidation.errors);
  }
  if (!isPlainObject(payload.receipt_readiness)) {
    errors.push("enforcement receipt readiness must be an object");
  } else {
    if (payload.receipt_readiness.level !== ENFORCEMENT_RECEIPT_READY) {
      errors.push("enforcement receipt readiness drifted");
    }
    if (payload.receipt_readiness.proof_ready !== true) {
      errors.push("enforcement proof readiness drifted");
    }
    if (payload.receipt_readiness.rollback_safe !== true) {
      errors.push("enforcement rollback safety drifted");
    }
    if (payload.receipt_readiness.recommendation_only !== true) {
      errors.push("enforcement receipt recommendation boundary drifted");
    }
  }
  if (!isPlainObject(payload.consumer_compatibility)) {
    errors.push("enforcement consumer compatibility must be an object");
  } else {
    if (
      payload.consumer_compatibility.level !==
      ENFORCEMENT_CONSUMER_COMPATIBLE
    ) {
      errors.push("enforcement consumer compatibility level drifted");
    }
    if (payload.consumer_compatibility.additive_only !== true) {
      errors.push("enforcement consumer additive boundary drifted");
    }
    if (payload.consumer_compatibility.non_executing !== true) {
      errors.push("enforcement consumer execution boundary drifted");
    }
    if (payload.consumer_compatibility.default_off !== true) {
      errors.push("enforcement consumer default-off boundary drifted");
    }
    if (
      payload.consumer_compatibility.authority_scope !==
      payload.authority_proof_contract.authority_scope
    ) {
      errors.push("enforcement consumer scope drifted");
    }
    if (payload.consumer_compatibility.denied_exit_code_preserved !== 25) {
      errors.push("enforcement consumer deny exit drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidEnforcementCompatibilityProfile(profile) {
  const validation = validateEnforcementCompatibilityProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `enforcement compatibility profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
