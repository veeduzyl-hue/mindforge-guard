import {
  GOVERNANCE_EVIDENCE_CONSUMER_SURFACE,
  GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY,
  GOVERNANCE_EVIDENCE_PROFILE_KIND,
  GOVERNANCE_EVIDENCE_PROFILE_VERSION,
  assertValidGovernanceEvidenceProfile,
} from "./profile.mjs";
import {
  GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_BOUNDARY,
  GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_KIND,
  GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_VERSION,
  buildGovernanceArtifactLinkageContract,
  assertValidGovernanceArtifactLinkageContract,
  validateGovernanceArtifactLinkageContract,
} from "./linkage.mjs";

export const GOVERNANCE_EVIDENCE_REPLAY_KIND =
  "governance_evidence_replay_readiness_profile";
export const GOVERNANCE_EVIDENCE_REPLAY_VERSION = "v1";
export const GOVERNANCE_EVIDENCE_REPLAY_SCHEMA_ID =
  "mindforge/governance-evidence-replay/v1";
export const GOVERNANCE_EVIDENCE_REPLAY_STAGE =
  "governance_evidence_replay_phase2_v1";
export const GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY =
  "governance_evidence_receipt_readiness_and_replay_boundary";
export const GOVERNANCE_EVIDENCE_RECEIPT_READY = "replay_ready";
export const GOVERNANCE_EVIDENCE_CONSUMER_COMPATIBLE = "consumer_compatible";
export const GOVERNANCE_EVIDENCE_REPLAY_LEVELS = Object.freeze([
  GOVERNANCE_EVIDENCE_RECEIPT_READY,
  GOVERNANCE_EVIDENCE_CONSUMER_COMPATIBLE,
]);
export const GOVERNANCE_EVIDENCE_REPLAY_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_evidence_replay",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_EVIDENCE_REPLAY_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "evidence_ref",
  "artifact_linkage_contract",
  "receipt_readiness",
  "consumer_compatibility",
  "stabilization_refs",
]);
export const GOVERNANCE_EVIDENCE_REPLAY_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_EVIDENCE_REPLAY_KIND",
  "GOVERNANCE_EVIDENCE_REPLAY_VERSION",
  "GOVERNANCE_EVIDENCE_REPLAY_SCHEMA_ID",
  "GOVERNANCE_EVIDENCE_REPLAY_STAGE",
  "GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY",
  "GOVERNANCE_EVIDENCE_RECEIPT_READY",
  "GOVERNANCE_EVIDENCE_CONSUMER_COMPATIBLE",
  "GOVERNANCE_EVIDENCE_REPLAY_LEVELS",
  "GOVERNANCE_EVIDENCE_REPLAY_TOP_LEVEL_FIELDS",
  "GOVERNANCE_EVIDENCE_REPLAY_PAYLOAD_FIELDS",
  "GOVERNANCE_EVIDENCE_REPLAY_STABLE_EXPORT_SET",
  "buildGovernanceEvidenceReplayProfile",
  "validateGovernanceEvidenceReplayProfile",
  "assertValidGovernanceEvidenceReplayProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceEvidenceReplayProfile({ governanceEvidenceProfile }) {
  const evidence = assertValidGovernanceEvidenceProfile(governanceEvidenceProfile);
  const linkage = assertValidGovernanceArtifactLinkageContract(
    buildGovernanceArtifactLinkageContract({ governanceEvidenceProfile: evidence })
  );

  return {
    kind: GOVERNANCE_EVIDENCE_REPLAY_KIND,
    version: GOVERNANCE_EVIDENCE_REPLAY_VERSION,
    schema_id: GOVERNANCE_EVIDENCE_REPLAY_SCHEMA_ID,
    canonical_action_hash: evidence.canonical_action_hash,
    governance_evidence_replay: {
      stage: GOVERNANCE_EVIDENCE_REPLAY_STAGE,
      consumer_surface: GOVERNANCE_EVIDENCE_CONSUMER_SURFACE,
      boundary: GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY,
      evidence_ref: {
        kind: GOVERNANCE_EVIDENCE_PROFILE_KIND,
        version: GOVERNANCE_EVIDENCE_PROFILE_VERSION,
        boundary: GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY,
      },
      artifact_linkage_contract: linkage,
      receipt_readiness: {
        level: GOVERNANCE_EVIDENCE_RECEIPT_READY,
        replay_ready: true,
        linkage_ready: true,
        recommendation_only: true,
      },
      consumer_compatibility: {
        level: GOVERNANCE_EVIDENCE_CONSUMER_COMPATIBLE,
        additive_only: true,
        non_executing: true,
        default_off: true,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        denied_exit_code_preserved: 25,
      },
      stabilization_refs: {
        stabilization_profile_available: true,
        final_acceptance_boundary_available: true,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceEvidenceReplayProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["governance evidence replay profile must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_EVIDENCE_REPLAY_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance evidence replay top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_EVIDENCE_REPLAY_KIND) {
    errors.push("governance evidence replay kind drifted");
  }
  if (profile.version !== GOVERNANCE_EVIDENCE_REPLAY_VERSION) {
    errors.push("governance evidence replay version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_EVIDENCE_REPLAY_SCHEMA_ID) {
    errors.push("governance evidence replay schema drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance evidence replay canonical action hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance evidence replay determinism drifted");
  }
  if (profile.enforcing !== false) {
    errors.push("governance evidence replay enforcement drifted");
  }
  const payload = profile.governance_evidence_replay;
  if (!isPlainObject(payload)) {
    errors.push("governance evidence replay payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_EVIDENCE_REPLAY_PAYLOAD_FIELDS)
  ) {
    errors.push("governance evidence replay payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_EVIDENCE_REPLAY_STAGE) {
    errors.push("governance evidence replay stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_EVIDENCE_CONSUMER_SURFACE) {
    errors.push("governance evidence replay consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY) {
    errors.push("governance evidence replay boundary drifted");
  }
  if (!isPlainObject(payload.evidence_ref)) {
    errors.push("governance evidence replay evidence ref missing");
  } else {
    if (payload.evidence_ref.kind !== GOVERNANCE_EVIDENCE_PROFILE_KIND) {
      errors.push("governance evidence replay evidence kind drifted");
    }
    if (payload.evidence_ref.version !== GOVERNANCE_EVIDENCE_PROFILE_VERSION) {
      errors.push("governance evidence replay evidence version drifted");
    }
    if (payload.evidence_ref.boundary !== GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY) {
      errors.push("governance evidence replay evidence boundary drifted");
    }
  }
  const linkageValidation = validateGovernanceArtifactLinkageContract(
    payload.artifact_linkage_contract
  );
  if (!linkageValidation.ok) {
    errors.push(...linkageValidation.errors);
  }
  if (!isPlainObject(payload.receipt_readiness)) {
    errors.push("governance evidence replay receipt readiness missing");
  } else {
    if (payload.receipt_readiness.level !== GOVERNANCE_EVIDENCE_RECEIPT_READY) {
      errors.push("governance evidence replay readiness level drifted");
    }
    if (payload.receipt_readiness.replay_ready !== true) {
      errors.push("governance evidence replay readiness drifted");
    }
    if (payload.receipt_readiness.linkage_ready !== true) {
      errors.push("governance evidence linkage readiness drifted");
    }
    if (payload.receipt_readiness.recommendation_only !== true) {
      errors.push("governance evidence receipt recommendation boundary drifted");
    }
  }
  if (!isPlainObject(payload.consumer_compatibility)) {
    errors.push("governance evidence replay consumer compatibility missing");
  } else {
    if (
      payload.consumer_compatibility.level !==
      GOVERNANCE_EVIDENCE_CONSUMER_COMPATIBLE
    ) {
      errors.push("governance evidence consumer compatibility level drifted");
    }
    if (payload.consumer_compatibility.additive_only !== true) {
      errors.push("governance evidence consumer additive boundary drifted");
    }
    if (payload.consumer_compatibility.non_executing !== true) {
      errors.push("governance evidence consumer execution boundary drifted");
    }
    if (payload.consumer_compatibility.default_off !== true) {
      errors.push("governance evidence consumer default-off drifted");
    }
    if (
      payload.consumer_compatibility.authority_scope !==
      "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("governance evidence consumer authority scope drifted");
    }
    if (payload.consumer_compatibility.denied_exit_code_preserved !== 25) {
      errors.push("governance evidence consumer deny exit drifted");
    }
  }
  if (!isPlainObject(payload.stabilization_refs)) {
    errors.push("governance evidence replay stabilization refs missing");
  } else {
    if (payload.stabilization_refs.stabilization_profile_available !== true) {
      errors.push("governance evidence replay stabilization availability drifted");
    }
    if (
      payload.stabilization_refs.final_acceptance_boundary_available !== true
    ) {
      errors.push("governance evidence replay final acceptance availability drifted");
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceEvidenceReplayProfile(profile) {
  const validation = validateGovernanceEvidenceReplayProfile(profile);
  if (validation.ok) return profile;
  const err = new Error(
    `governance evidence replay profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
