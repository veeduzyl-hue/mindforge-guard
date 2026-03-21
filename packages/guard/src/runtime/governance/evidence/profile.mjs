import {
  POLICY_FINAL_ACCEPTANCE_BOUNDARY,
  POLICY_STABILIZATION_KIND,
  POLICY_STABILIZATION_STAGE,
  POLICY_STABILIZATION_VERSION,
  assertValidPolicyStabilizationProfile,
} from "../policy/stabilization.mjs";
import { POLICY_CONSUMER_SURFACE } from "../policy/profile.mjs";

export const GOVERNANCE_EVIDENCE_PROFILE_KIND = "governance_evidence_profile";
export const GOVERNANCE_EVIDENCE_PROFILE_VERSION = "v1";
export const GOVERNANCE_EVIDENCE_PROFILE_SCHEMA_ID =
  "mindforge/governance-evidence-profile/v1";
export const GOVERNANCE_EVIDENCE_PROFILE_STAGE =
  "governance_evidence_phase1_v1";
export const GOVERNANCE_EVIDENCE_CONSUMER_SURFACE =
  "guard.audit.governance_evidence";
export const GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY =
  "governance_evidence_and_provenance_boundary_contract";
export const GOVERNANCE_PROVENANCE_CONTRACT_KIND =
  "governance_provenance_contract";
export const GOVERNANCE_PROVENANCE_CONTRACT_VERSION = "v1";
export const GOVERNANCE_PROVENANCE_CONTRACT_BOUNDARY =
  "bounded_governance_provenance_contract";
export const GOVERNANCE_LINEAGE_CONTRACT_KIND = "governance_lineage_contract";
export const GOVERNANCE_LINEAGE_CONTRACT_VERSION = "v1";
export const GOVERNANCE_LINEAGE_CONTRACT_BOUNDARY =
  "bounded_governance_lineage_contract";
export const GOVERNANCE_EVIDENCE_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_evidence",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_EVIDENCE_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "policy_ref",
  "evidence_contract",
  "provenance_contract",
  "lineage_contract",
  "preserved_semantics",
]);
export const GOVERNANCE_EVIDENCE_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_EVIDENCE_PROFILE_KIND",
  "GOVERNANCE_EVIDENCE_PROFILE_VERSION",
  "GOVERNANCE_EVIDENCE_PROFILE_SCHEMA_ID",
  "GOVERNANCE_EVIDENCE_PROFILE_STAGE",
  "GOVERNANCE_EVIDENCE_CONSUMER_SURFACE",
  "GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY",
  "GOVERNANCE_PROVENANCE_CONTRACT_KIND",
  "GOVERNANCE_PROVENANCE_CONTRACT_VERSION",
  "GOVERNANCE_PROVENANCE_CONTRACT_BOUNDARY",
  "GOVERNANCE_LINEAGE_CONTRACT_KIND",
  "GOVERNANCE_LINEAGE_CONTRACT_VERSION",
  "GOVERNANCE_LINEAGE_CONTRACT_BOUNDARY",
  "GOVERNANCE_EVIDENCE_TOP_LEVEL_FIELDS",
  "GOVERNANCE_EVIDENCE_PAYLOAD_FIELDS",
  "GOVERNANCE_EVIDENCE_STABLE_EXPORT_SET",
  "buildGovernanceEvidenceProfile",
  "validateGovernanceEvidenceProfile",
  "assertValidGovernanceEvidenceProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceEvidenceProfile({ policyStabilizationProfile }) {
  const policy = assertValidPolicyStabilizationProfile(policyStabilizationProfile);

  return {
    kind: GOVERNANCE_EVIDENCE_PROFILE_KIND,
    version: GOVERNANCE_EVIDENCE_PROFILE_VERSION,
    schema_id: GOVERNANCE_EVIDENCE_PROFILE_SCHEMA_ID,
    canonical_action_hash: policy.canonical_action_hash,
    governance_evidence: {
      stage: GOVERNANCE_EVIDENCE_PROFILE_STAGE,
      consumer_surface: GOVERNANCE_EVIDENCE_CONSUMER_SURFACE,
      boundary: GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY,
      policy_ref: {
        kind: POLICY_STABILIZATION_KIND,
        version: POLICY_STABILIZATION_VERSION,
        stage: POLICY_STABILIZATION_STAGE,
        boundary: POLICY_FINAL_ACCEPTANCE_BOUNDARY,
        source_surface: POLICY_CONSUMER_SURFACE,
      },
      evidence_contract: {
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_on: false,
      },
      provenance_contract: {
        kind: GOVERNANCE_PROVENANCE_CONTRACT_KIND,
        version: GOVERNANCE_PROVENANCE_CONTRACT_VERSION,
        boundary: GOVERNANCE_PROVENANCE_CONTRACT_BOUNDARY,
        provenance_preserved: true,
        source_profile_kind: POLICY_STABILIZATION_KIND,
        canonical_lineage_preserved: true,
      },
      lineage_contract: {
        kind: GOVERNANCE_LINEAGE_CONTRACT_KIND,
        version: GOVERNANCE_LINEAGE_CONTRACT_VERSION,
        boundary: GOVERNANCE_LINEAGE_CONTRACT_BOUNDARY,
        bounded_lineage: true,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        authority_scope_expansion: false,
      },
      preserved_semantics: {
        policy_semantics_preserved: true,
        enforcement_semantics_preserved: true,
        approval_semantics_preserved: true,
        judgment_semantics_preserved: true,
        permit_gate_semantics_preserved: true,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        governance_object_addition: false,
        main_path_takeover: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceEvidenceProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["governance evidence profile must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_EVIDENCE_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance evidence top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_EVIDENCE_PROFILE_KIND) {
    errors.push("governance evidence kind drifted");
  }
  if (profile.version !== GOVERNANCE_EVIDENCE_PROFILE_VERSION) {
    errors.push("governance evidence version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_EVIDENCE_PROFILE_SCHEMA_ID) {
    errors.push("governance evidence schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance evidence canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance evidence must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("governance evidence must remain non-enforcing");
  }
  if (!isPlainObject(profile.governance_evidence)) {
    errors.push("governance evidence payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.governance_evidence;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_EVIDENCE_PAYLOAD_FIELDS)
  ) {
    errors.push("governance evidence payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_EVIDENCE_PROFILE_STAGE) {
    errors.push("governance evidence stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_EVIDENCE_CONSUMER_SURFACE) {
    errors.push("governance evidence consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY) {
    errors.push("governance evidence boundary drifted");
  }
  if (!isPlainObject(payload.policy_ref)) {
    errors.push("governance evidence policy ref must be an object");
  } else {
    if (payload.policy_ref.kind !== POLICY_STABILIZATION_KIND) {
      errors.push("governance evidence policy ref kind drifted");
    }
    if (payload.policy_ref.version !== POLICY_STABILIZATION_VERSION) {
      errors.push("governance evidence policy ref version drifted");
    }
    if (payload.policy_ref.stage !== POLICY_STABILIZATION_STAGE) {
      errors.push("governance evidence policy ref stage drifted");
    }
    if (payload.policy_ref.boundary !== POLICY_FINAL_ACCEPTANCE_BOUNDARY) {
      errors.push("governance evidence policy ref boundary drifted");
    }
    if (payload.policy_ref.source_surface !== POLICY_CONSUMER_SURFACE) {
      errors.push("governance evidence policy ref surface drifted");
    }
  }
  if (!isPlainObject(payload.evidence_contract)) {
    errors.push("governance evidence contract must be an object");
  } else {
    if (payload.evidence_contract.recommendation_only !== true) {
      errors.push("governance evidence recommendation boundary drifted");
    }
    if (payload.evidence_contract.additive_only !== true) {
      errors.push("governance evidence additive boundary drifted");
    }
    if (payload.evidence_contract.non_executing !== true) {
      errors.push("governance evidence execution boundary drifted");
    }
    if (payload.evidence_contract.default_on !== false) {
      errors.push("governance evidence default-on boundary drifted");
    }
  }
  if (!isPlainObject(payload.provenance_contract)) {
    errors.push("governance provenance contract must be an object");
  } else {
    if (payload.provenance_contract.kind !== GOVERNANCE_PROVENANCE_CONTRACT_KIND) {
      errors.push("governance provenance kind drifted");
    }
    if (
      payload.provenance_contract.version !==
      GOVERNANCE_PROVENANCE_CONTRACT_VERSION
    ) {
      errors.push("governance provenance version drifted");
    }
    if (
      payload.provenance_contract.boundary !==
      GOVERNANCE_PROVENANCE_CONTRACT_BOUNDARY
    ) {
      errors.push("governance provenance boundary drifted");
    }
    if (payload.provenance_contract.provenance_preserved !== true) {
      errors.push("governance provenance preservation drifted");
    }
    if (payload.provenance_contract.source_profile_kind !== POLICY_STABILIZATION_KIND) {
      errors.push("governance provenance source profile drifted");
    }
    if (payload.provenance_contract.canonical_lineage_preserved !== true) {
      errors.push("governance provenance lineage drifted");
    }
  }
  if (!isPlainObject(payload.lineage_contract)) {
    errors.push("governance lineage contract must be an object");
  } else {
    if (payload.lineage_contract.kind !== GOVERNANCE_LINEAGE_CONTRACT_KIND) {
      errors.push("governance lineage kind drifted");
    }
    if (payload.lineage_contract.version !== GOVERNANCE_LINEAGE_CONTRACT_VERSION) {
      errors.push("governance lineage version drifted");
    }
    if (
      payload.lineage_contract.boundary !== GOVERNANCE_LINEAGE_CONTRACT_BOUNDARY
    ) {
      errors.push("governance lineage boundary drifted");
    }
    if (payload.lineage_contract.bounded_lineage !== true) {
      errors.push("governance lineage boundedness drifted");
    }
    if (
      payload.lineage_contract.authority_scope !==
      "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("governance lineage authority scope drifted");
    }
    if (payload.lineage_contract.authority_scope_expansion !== false) {
      errors.push("governance lineage authority expansion drifted");
    }
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance evidence preserved semantics must be an object");
  } else {
    const semantics = payload.preserved_semantics;
    if (semantics.policy_semantics_preserved !== true) {
      errors.push("governance evidence policy semantics drifted");
    }
    if (semantics.enforcement_semantics_preserved !== true) {
      errors.push("governance evidence enforcement semantics drifted");
    }
    if (semantics.approval_semantics_preserved !== true) {
      errors.push("governance evidence approval semantics drifted");
    }
    if (semantics.judgment_semantics_preserved !== true) {
      errors.push("governance evidence judgment semantics drifted");
    }
    if (semantics.permit_gate_semantics_preserved !== true) {
      errors.push("governance evidence permit gate semantics drifted");
    }
    if (semantics.audit_output_preserved !== true) {
      errors.push("governance evidence audit output drifted");
    }
    if (semantics.audit_verdict_preserved !== true) {
      errors.push("governance evidence audit verdict drifted");
    }
    if (semantics.actual_exit_code_preserved !== true) {
      errors.push("governance evidence actual exit drifted");
    }
    if (semantics.denied_exit_code_preserved !== 25) {
      errors.push("governance evidence deny exit drifted");
    }
    if (semantics.governance_object_addition !== false) {
      errors.push("governance evidence governance object boundary drifted");
    }
    if (semantics.main_path_takeover !== false) {
      errors.push("governance evidence main path takeover drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceEvidenceProfile(profile) {
  const validation = validateGovernanceEvidenceProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance evidence profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
