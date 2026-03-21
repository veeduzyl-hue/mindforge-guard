import {
  GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY,
  GOVERNANCE_EVIDENCE_REPLAY_KIND,
  GOVERNANCE_EVIDENCE_REPLAY_VERSION,
  assertValidGovernanceEvidenceReplayProfile,
} from "./replay.mjs";

export const GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND =
  "governance_compare_compatibility_contract";
export const GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION = "v1";
export const GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY =
  "bounded_governance_compare_compatibility_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCompareCompatibilityContract({
  governanceEvidenceReplayProfile,
}) {
  const replay = assertValidGovernanceEvidenceReplayProfile(
    governanceEvidenceReplayProfile
  );

  return {
    kind: GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND,
    version: GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION,
    boundary: GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY,
    replay_ref: {
      kind: GOVERNANCE_EVIDENCE_REPLAY_KIND,
      version: GOVERNANCE_EVIDENCE_REPLAY_VERSION,
      boundary: GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY,
    },
    compare_ready: true,
    replay_ready: true,
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
    canonical_action_hash: replay.canonical_action_hash,
  };
}

export function validateGovernanceCompareCompatibilityContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return { ok: false, errors: ["governance compare compatibility contract must be an object"] };
  }
  if (contract.kind !== GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND) {
    errors.push("governance compare compatibility kind drifted");
  }
  if (contract.version !== GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION) {
    errors.push("governance compare compatibility version drifted");
  }
  if (contract.boundary !== GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY) {
    errors.push("governance compare compatibility boundary drifted");
  }
  if (!isPlainObject(contract.replay_ref)) {
    errors.push("governance compare replay ref missing");
  } else {
    if (contract.replay_ref.kind !== GOVERNANCE_EVIDENCE_REPLAY_KIND) {
      errors.push("governance compare replay kind drifted");
    }
    if (contract.replay_ref.version !== GOVERNANCE_EVIDENCE_REPLAY_VERSION) {
      errors.push("governance compare replay version drifted");
    }
    if (contract.replay_ref.boundary !== GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY) {
      errors.push("governance compare replay boundary drifted");
    }
  }
  if (contract.compare_ready !== true) {
    errors.push("governance compare readiness drifted");
  }
  if (contract.replay_ready !== true) {
    errors.push("governance compare replay readiness drifted");
  }
  if (contract.recommendation_only !== true) {
    errors.push("governance compare recommendation boundary drifted");
  }
  if (contract.additive_only !== true) {
    errors.push("governance compare additive boundary drifted");
  }
  if (contract.execution_enabled !== false) {
    errors.push("governance compare execution boundary drifted");
  }
  if (contract.default_on !== false) {
    errors.push("governance compare default-on drifted");
  }
  if (contract.audit_output_preserved !== true) {
    errors.push("governance compare audit output drifted");
  }
  if (contract.audit_verdict_preserved !== true) {
    errors.push("governance compare audit verdict drifted");
  }
  if (contract.actual_exit_code_preserved !== true) {
    errors.push("governance compare actual exit drifted");
  }
  if (contract.denied_exit_code_preserved !== 25) {
    errors.push("governance compare deny exit drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance compare authority scope drifted");
  }
  if (contract.governance_object_addition !== false) {
    errors.push("governance compare governance object boundary drifted");
  }
  if (contract.main_path_takeover !== false) {
    errors.push("governance compare main path takeover drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance compare canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCompareCompatibilityContract(contract) {
  const validation = validateGovernanceCompareCompatibilityContract(contract);
  if (validation.ok) return contract;
  const err = new Error(
    `governance compare compatibility contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
