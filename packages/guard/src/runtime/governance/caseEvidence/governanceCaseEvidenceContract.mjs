import {
  GOVERNANCE_CASE_EVIDENCE_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_KIND,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_VERSION,
  assertValidGovernanceCaseEvidenceProfile,
} from "./governanceCaseEvidenceProfile.mjs";

export const GOVERNANCE_CASE_EVIDENCE_CONTRACT_KIND =
  "governance_case_evidence_contract";
export const GOVERNANCE_CASE_EVIDENCE_CONTRACT_VERSION = "v1";
export const GOVERNANCE_CASE_EVIDENCE_CONTRACT_BOUNDARY =
  "bounded_governance_case_evidence_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseEvidenceContract({
  governanceCaseEvidenceProfile,
}) {
  const profile = assertValidGovernanceCaseEvidenceProfile(
    governanceCaseEvidenceProfile
  );

  return {
    kind: GOVERNANCE_CASE_EVIDENCE_CONTRACT_KIND,
    version: GOVERNANCE_CASE_EVIDENCE_CONTRACT_VERSION,
    boundary: GOVERNANCE_CASE_EVIDENCE_CONTRACT_BOUNDARY,
    evidence_profile_ref: {
      kind: GOVERNANCE_CASE_EVIDENCE_PROFILE_KIND,
      version: GOVERNANCE_CASE_EVIDENCE_PROFILE_VERSION,
      boundary: GOVERNANCE_CASE_EVIDENCE_PROFILE_BOUNDARY,
    },
    case_evidence_available: true,
    supporting_artifact_only: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    execution_enabled: false,
    actual_resolution_execution: false,
    actual_escalation_execution: false,
    actual_closure_execution: false,
    automatic_routing: false,
    automatic_case_finalization: false,
    authority_scope: "review_gate_deny_exit_recommendation_only",
    authority_scope_expansion: false,
    main_path_takeover: false,
    new_governance_object: false,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseEvidenceContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: ["governance case evidence contract must be an object"],
    };
  }
  if (contract.kind !== GOVERNANCE_CASE_EVIDENCE_CONTRACT_KIND) {
    errors.push("governance case evidence contract kind drifted");
  }
  if (contract.version !== GOVERNANCE_CASE_EVIDENCE_CONTRACT_VERSION) {
    errors.push("governance case evidence contract version drifted");
  }
  if (contract.boundary !== GOVERNANCE_CASE_EVIDENCE_CONTRACT_BOUNDARY) {
    errors.push("governance case evidence contract boundary drifted");
  }
  if (!isPlainObject(contract.evidence_profile_ref)) {
    errors.push("governance case evidence contract profile ref missing");
  }
  if (contract.case_evidence_available !== true) {
    errors.push("governance case evidence availability drifted");
  }
  if (contract.supporting_artifact_only !== true) {
    errors.push("governance case evidence supporting-artifact boundary drifted");
  }
  if (contract.recommendation_only !== true) {
    errors.push("governance case evidence recommendation boundary drifted");
  }
  if (contract.additive_only !== true) {
    errors.push("governance case evidence additive boundary drifted");
  }
  if (contract.non_executing !== true) {
    errors.push("governance case evidence non-executing boundary drifted");
  }
  if (contract.default_off !== true) {
    errors.push("governance case evidence default-off boundary drifted");
  }
  if (contract.execution_enabled !== false) {
    errors.push("governance case evidence execution boundary drifted");
  }
  if (contract.actual_resolution_execution !== false) {
    errors.push("governance case evidence resolution execution drifted");
  }
  if (contract.actual_escalation_execution !== false) {
    errors.push("governance case evidence escalation execution drifted");
  }
  if (contract.actual_closure_execution !== false) {
    errors.push("governance case evidence closure execution drifted");
  }
  if (contract.automatic_routing !== false) {
    errors.push("governance case evidence routing boundary drifted");
  }
  if (contract.automatic_case_finalization !== false) {
    errors.push("governance case evidence finalization boundary drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance case evidence authority scope drifted");
  }
  if (contract.authority_scope_expansion !== false) {
    errors.push("governance case evidence authority expansion drifted");
  }
  if (contract.main_path_takeover !== false) {
    errors.push("governance case evidence main path takeover drifted");
  }
  if (contract.new_governance_object !== false) {
    errors.push("governance case evidence governance object boundary drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance case evidence canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseEvidenceContract(contract) {
  const validation = validateGovernanceCaseEvidenceContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case evidence contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
