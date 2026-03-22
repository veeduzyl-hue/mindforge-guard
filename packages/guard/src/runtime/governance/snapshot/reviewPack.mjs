import {
  GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY,
  GOVERNANCE_SNAPSHOT_PROFILE_KIND,
  GOVERNANCE_SNAPSHOT_PROFILE_VERSION,
  assertValidGovernanceSnapshotProfile,
} from "./profile.mjs";

export const GOVERNANCE_REVIEW_PACK_CONTRACT_KIND =
  "governance_review_pack_contract";
export const GOVERNANCE_REVIEW_PACK_CONTRACT_VERSION = "v1";
export const GOVERNANCE_REVIEW_PACK_CONTRACT_BOUNDARY =
  "bounded_governance_review_pack_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceReviewPackContract({
  governanceSnapshotProfile,
}) {
  const snapshot = assertValidGovernanceSnapshotProfile(governanceSnapshotProfile);

  return {
    kind: GOVERNANCE_REVIEW_PACK_CONTRACT_KIND,
    version: GOVERNANCE_REVIEW_PACK_CONTRACT_VERSION,
    boundary: GOVERNANCE_REVIEW_PACK_CONTRACT_BOUNDARY,
    snapshot_ref: {
      kind: GOVERNANCE_SNAPSHOT_PROFILE_KIND,
      version: GOVERNANCE_SNAPSHOT_PROFILE_VERSION,
      boundary: GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY,
    },
    review_pack_ready: true,
    rationale_bundle_available: true,
    recommendation_only: true,
    additive_only: true,
    execution_enabled: false,
    review_pack_execution_available: false,
    authority_scope: "review_gate_deny_exit_recommendation_only",
    authority_scope_expansion: false,
    canonical_action_hash: snapshot.canonical_action_hash,
  };
}

export function validateGovernanceReviewPackContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return { ok: false, errors: ["governance review pack contract must be an object"] };
  }
  if (contract.kind !== GOVERNANCE_REVIEW_PACK_CONTRACT_KIND) {
    errors.push("governance review pack kind drifted");
  }
  if (contract.version !== GOVERNANCE_REVIEW_PACK_CONTRACT_VERSION) {
    errors.push("governance review pack version drifted");
  }
  if (contract.boundary !== GOVERNANCE_REVIEW_PACK_CONTRACT_BOUNDARY) {
    errors.push("governance review pack boundary drifted");
  }
  if (!isPlainObject(contract.snapshot_ref)) {
    errors.push("governance review pack snapshot ref missing");
  } else {
    if (contract.snapshot_ref.kind !== GOVERNANCE_SNAPSHOT_PROFILE_KIND) {
      errors.push("governance review pack snapshot kind drifted");
    }
    if (contract.snapshot_ref.version !== GOVERNANCE_SNAPSHOT_PROFILE_VERSION) {
      errors.push("governance review pack snapshot version drifted");
    }
    if (contract.snapshot_ref.boundary !== GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY) {
      errors.push("governance review pack snapshot boundary drifted");
    }
  }
  if (contract.review_pack_ready !== true) {
    errors.push("governance review pack readiness drifted");
  }
  if (contract.rationale_bundle_available !== true) {
    errors.push("governance review pack bundle availability drifted");
  }
  if (contract.recommendation_only !== true) {
    errors.push("governance review pack recommendation boundary drifted");
  }
  if (contract.additive_only !== true) {
    errors.push("governance review pack additive boundary drifted");
  }
  if (contract.execution_enabled !== false) {
    errors.push("governance review pack execution boundary drifted");
  }
  if (contract.review_pack_execution_available !== false) {
    errors.push("governance review pack execution availability drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance review pack authority scope drifted");
  }
  if (contract.authority_scope_expansion !== false) {
    errors.push("governance review pack authority expansion drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance review pack canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceReviewPackContract(contract) {
  const validation = validateGovernanceReviewPackContract(contract);
  if (validation.ok) return contract;
  const err = new Error(
    `governance review pack contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
