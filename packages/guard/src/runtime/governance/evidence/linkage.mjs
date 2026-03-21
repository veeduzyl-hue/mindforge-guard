import {
  GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY,
  GOVERNANCE_EVIDENCE_PROFILE_KIND,
  GOVERNANCE_EVIDENCE_PROFILE_VERSION,
  assertValidGovernanceEvidenceProfile,
} from "./profile.mjs";

export const GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_KIND =
  "governance_artifact_linkage_contract";
export const GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_VERSION = "v1";
export const GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_BOUNDARY =
  "bounded_governance_artifact_linkage_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceArtifactLinkageContract({
  governanceEvidenceProfile,
}) {
  const evidence = assertValidGovernanceEvidenceProfile(governanceEvidenceProfile);

  return {
    kind: GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_KIND,
    version: GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_VERSION,
    boundary: GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_BOUNDARY,
    evidence_ref: {
      kind: GOVERNANCE_EVIDENCE_PROFILE_KIND,
      version: GOVERNANCE_EVIDENCE_PROFILE_VERSION,
      boundary: GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY,
    },
    linkage_ready: true,
    bounded_linkage: true,
    recommendation_only: true,
    additive_only: true,
    execution_enabled: false,
    authority_scope: "review_gate_deny_exit_recommendation_only",
    authority_scope_expansion: false,
    canonical_action_hash: evidence.canonical_action_hash,
  };
}

export function validateGovernanceArtifactLinkageContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return { ok: false, errors: ["governance artifact linkage contract must be an object"] };
  }
  if (contract.kind !== GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_KIND) {
    errors.push("governance artifact linkage kind drifted");
  }
  if (contract.version !== GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_VERSION) {
    errors.push("governance artifact linkage version drifted");
  }
  if (contract.boundary !== GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_BOUNDARY) {
    errors.push("governance artifact linkage boundary drifted");
  }
  if (!isPlainObject(contract.evidence_ref)) {
    errors.push("governance artifact linkage evidence ref missing");
  } else {
    if (contract.evidence_ref.kind !== GOVERNANCE_EVIDENCE_PROFILE_KIND) {
      errors.push("governance artifact linkage evidence kind drifted");
    }
    if (contract.evidence_ref.version !== GOVERNANCE_EVIDENCE_PROFILE_VERSION) {
      errors.push("governance artifact linkage evidence version drifted");
    }
    if (contract.evidence_ref.boundary !== GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY) {
      errors.push("governance artifact linkage evidence boundary drifted");
    }
  }
  if (contract.linkage_ready !== true) {
    errors.push("governance artifact linkage readiness drifted");
  }
  if (contract.bounded_linkage !== true) {
    errors.push("governance artifact linkage boundedness drifted");
  }
  if (contract.recommendation_only !== true) {
    errors.push("governance artifact linkage recommendation boundary drifted");
  }
  if (contract.additive_only !== true) {
    errors.push("governance artifact linkage additive boundary drifted");
  }
  if (contract.execution_enabled !== false) {
    errors.push("governance artifact linkage execution boundary drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance artifact linkage authority scope drifted");
  }
  if (contract.authority_scope_expansion !== false) {
    errors.push("governance artifact linkage authority expansion drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance artifact linkage canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceArtifactLinkageContract(contract) {
  const validation = validateGovernanceArtifactLinkageContract(contract);
  if (validation.ok) return contract;
  const err = new Error(
    `governance artifact linkage contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
