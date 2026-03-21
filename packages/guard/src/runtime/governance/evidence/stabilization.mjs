import {
  GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION,
  assertValidGovernanceCompareCompatibilityContract,
} from "./compare.mjs";
import {
  GOVERNANCE_EVIDENCE_CONSUMER_COMPATIBLE,
  GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY,
  GOVERNANCE_EVIDENCE_REPLAY_KIND,
  GOVERNANCE_EVIDENCE_REPLAY_STAGE,
  GOVERNANCE_EVIDENCE_REPLAY_VERSION,
  assertValidGovernanceEvidenceReplayProfile,
} from "./replay.mjs";
import { GOVERNANCE_EVIDENCE_CONSUMER_SURFACE } from "./profile.mjs";

export const GOVERNANCE_EVIDENCE_STABILIZATION_KIND =
  "governance_evidence_stabilization_profile";
export const GOVERNANCE_EVIDENCE_STABILIZATION_VERSION = "v1";
export const GOVERNANCE_EVIDENCE_STABILIZATION_SCHEMA_ID =
  "mindforge/governance-evidence-stabilization/v1";
export const GOVERNANCE_EVIDENCE_STABILIZATION_STAGE =
  "governance_evidence_stabilization_phase3_v1";
export const GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY =
  "final_governance_evidence_consumer_contract";
export const GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_READY =
  "final_consumer_ready";
export const GOVERNANCE_EVIDENCE_STABILIZATION_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_evidence_stabilization",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_EVIDENCE_STABILIZATION_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "replay_ref",
  "compare_ref",
  "final_consumer_contract",
  "preserved_semantics",
]);
export const GOVERNANCE_EVIDENCE_STABILIZATION_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_EVIDENCE_STABILIZATION_KIND",
  "GOVERNANCE_EVIDENCE_STABILIZATION_VERSION",
  "GOVERNANCE_EVIDENCE_STABILIZATION_SCHEMA_ID",
  "GOVERNANCE_EVIDENCE_STABILIZATION_STAGE",
  "GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY",
  "GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_READY",
  "GOVERNANCE_EVIDENCE_STABILIZATION_TOP_LEVEL_FIELDS",
  "GOVERNANCE_EVIDENCE_STABILIZATION_PAYLOAD_FIELDS",
  "GOVERNANCE_EVIDENCE_STABILIZATION_STABLE_EXPORT_SET",
  "buildGovernanceEvidenceStabilizationProfile",
  "validateGovernanceEvidenceStabilizationProfile",
  "assertValidGovernanceEvidenceStabilizationProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceEvidenceStabilizationProfile({
  governanceEvidenceReplayProfile,
  governanceCompareCompatibilityContract,
}) {
  const replay = assertValidGovernanceEvidenceReplayProfile(
    governanceEvidenceReplayProfile
  );
  const compare = assertValidGovernanceCompareCompatibilityContract(
    governanceCompareCompatibilityContract
  );

  return {
    kind: GOVERNANCE_EVIDENCE_STABILIZATION_KIND,
    version: GOVERNANCE_EVIDENCE_STABILIZATION_VERSION,
    schema_id: GOVERNANCE_EVIDENCE_STABILIZATION_SCHEMA_ID,
    canonical_action_hash: replay.canonical_action_hash,
    governance_evidence_stabilization: {
      stage: GOVERNANCE_EVIDENCE_STABILIZATION_STAGE,
      consumer_surface: GOVERNANCE_EVIDENCE_CONSUMER_SURFACE,
      boundary: GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY,
      replay_ref: {
        kind: GOVERNANCE_EVIDENCE_REPLAY_KIND,
        version: GOVERNANCE_EVIDENCE_REPLAY_VERSION,
        stage: GOVERNANCE_EVIDENCE_REPLAY_STAGE,
        boundary: GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY,
      },
      compare_ref: {
        kind: GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND,
        version: GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION,
        boundary: GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY,
      },
      final_consumer_contract: {
        acceptance_level: GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_READY,
        recommendation_only: true,
        additive_only: true,
        execution_enabled: false,
        default_on: false,
        replay_execution_available: false,
        compare_execution_available: false,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        governance_object_addition: false,
      },
      preserved_semantics: {
        evidence_provenance_semantics_preserved: true,
        evidence_replay_semantics_preserved: true,
        policy_semantics_preserved: true,
        enforcement_semantics_preserved: true,
        approval_semantics_preserved: true,
        judgment_semantics_preserved: true,
        permit_gate_semantics_preserved: true,
        consumer_contract_ready:
          replay.governance_evidence_replay.consumer_compatibility.level ===
          GOVERNANCE_EVIDENCE_CONSUMER_COMPATIBLE,
        replay_ready: compare.replay_ready === true,
        compare_ready: compare.compare_ready === true,
        main_path_takeover: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceEvidenceStabilizationProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["governance evidence stabilization profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_EVIDENCE_STABILIZATION_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance evidence stabilization top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_EVIDENCE_STABILIZATION_KIND) {
    errors.push("governance evidence stabilization kind drifted");
  }
  if (profile.version !== GOVERNANCE_EVIDENCE_STABILIZATION_VERSION) {
    errors.push("governance evidence stabilization version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_EVIDENCE_STABILIZATION_SCHEMA_ID) {
    errors.push("governance evidence stabilization schema drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance evidence stabilization canonical action hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance evidence stabilization determinism drifted");
  }
  if (profile.enforcing !== false) {
    errors.push("governance evidence stabilization enforcement drifted");
  }
  const payload = profile.governance_evidence_stabilization;
  if (!isPlainObject(payload)) {
    errors.push("governance evidence stabilization payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_EVIDENCE_STABILIZATION_PAYLOAD_FIELDS)
  ) {
    errors.push("governance evidence stabilization payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_EVIDENCE_STABILIZATION_STAGE) {
    errors.push("governance evidence stabilization stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_EVIDENCE_CONSUMER_SURFACE) {
    errors.push("governance evidence stabilization consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY) {
    errors.push("governance evidence stabilization boundary drifted");
  }
  if (!isPlainObject(payload.replay_ref)) {
    errors.push("governance evidence stabilization replay ref missing");
  } else {
    if (payload.replay_ref.kind !== GOVERNANCE_EVIDENCE_REPLAY_KIND) {
      errors.push("governance evidence stabilization replay kind drifted");
    }
    if (payload.replay_ref.version !== GOVERNANCE_EVIDENCE_REPLAY_VERSION) {
      errors.push("governance evidence stabilization replay version drifted");
    }
    if (payload.replay_ref.stage !== GOVERNANCE_EVIDENCE_REPLAY_STAGE) {
      errors.push("governance evidence stabilization replay stage drifted");
    }
    if (payload.replay_ref.boundary !== GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY) {
      errors.push("governance evidence stabilization replay boundary drifted");
    }
  }
  if (!isPlainObject(payload.compare_ref)) {
    errors.push("governance evidence stabilization compare ref missing");
  } else {
    if (
      payload.compare_ref.kind !== GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND
    ) {
      errors.push("governance evidence stabilization compare kind drifted");
    }
    if (
      payload.compare_ref.version !==
      GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION
    ) {
      errors.push("governance evidence stabilization compare version drifted");
    }
    if (
      payload.compare_ref.boundary !==
      GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY
    ) {
      errors.push("governance evidence stabilization compare boundary drifted");
    }
  }
  if (!isPlainObject(payload.final_consumer_contract)) {
    errors.push("governance evidence stabilization final contract missing");
  } else {
    const contract = payload.final_consumer_contract;
    if (contract.acceptance_level !== GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_READY) {
      errors.push("governance evidence stabilization acceptance level drifted");
    }
    if (contract.recommendation_only !== true) {
      errors.push("governance evidence stabilization recommendation boundary drifted");
    }
    if (contract.additive_only !== true) {
      errors.push("governance evidence stabilization additive boundary drifted");
    }
    if (contract.execution_enabled !== false) {
      errors.push("governance evidence stabilization execution boundary drifted");
    }
    if (contract.default_on !== false) {
      errors.push("governance evidence stabilization default-on drifted");
    }
    if (contract.replay_execution_available !== false) {
      errors.push("governance evidence stabilization replay execution drifted");
    }
    if (contract.compare_execution_available !== false) {
      errors.push("governance evidence stabilization compare execution drifted");
    }
    if (contract.audit_output_preserved !== true) {
      errors.push("governance evidence stabilization audit output drifted");
    }
    if (contract.audit_verdict_preserved !== true) {
      errors.push("governance evidence stabilization audit verdict drifted");
    }
    if (contract.actual_exit_code_preserved !== true) {
      errors.push("governance evidence stabilization actual exit drifted");
    }
    if (contract.denied_exit_code_preserved !== 25) {
      errors.push("governance evidence stabilization deny exit drifted");
    }
    if (
      contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("governance evidence stabilization authority scope drifted");
    }
    if (contract.governance_object_addition !== false) {
      errors.push("governance evidence stabilization governance object drifted");
    }
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance evidence stabilization preserved semantics missing");
  } else {
    const semantics = payload.preserved_semantics;
    if (semantics.evidence_provenance_semantics_preserved !== true) {
      errors.push("governance evidence stabilization provenance semantics drifted");
    }
    if (semantics.evidence_replay_semantics_preserved !== true) {
      errors.push("governance evidence stabilization replay semantics drifted");
    }
    if (semantics.policy_semantics_preserved !== true) {
      errors.push("governance evidence stabilization policy semantics drifted");
    }
    if (semantics.enforcement_semantics_preserved !== true) {
      errors.push("governance evidence stabilization enforcement semantics drifted");
    }
    if (semantics.approval_semantics_preserved !== true) {
      errors.push("governance evidence stabilization approval semantics drifted");
    }
    if (semantics.judgment_semantics_preserved !== true) {
      errors.push("governance evidence stabilization judgment semantics drifted");
    }
    if (semantics.permit_gate_semantics_preserved !== true) {
      errors.push("governance evidence stabilization permit gate semantics drifted");
    }
    if (semantics.consumer_contract_ready !== true) {
      errors.push("governance evidence stabilization consumer readiness drifted");
    }
    if (semantics.replay_ready !== true) {
      errors.push("governance evidence stabilization replay readiness drifted");
    }
    if (semantics.compare_ready !== true) {
      errors.push("governance evidence stabilization compare readiness drifted");
    }
    if (semantics.main_path_takeover !== false) {
      errors.push("governance evidence stabilization main path takeover drifted");
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceEvidenceStabilizationProfile(profile) {
  const validation = validateGovernanceEvidenceStabilizationProfile(profile);
  if (validation.ok) return profile;
  const err = new Error(
    `governance evidence stabilization profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
