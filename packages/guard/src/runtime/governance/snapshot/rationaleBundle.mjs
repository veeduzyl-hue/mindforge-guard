import {
  GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
  GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY,
  GOVERNANCE_SNAPSHOT_PROFILE_KIND,
  GOVERNANCE_SNAPSHOT_PROFILE_VERSION,
  assertValidGovernanceSnapshotProfile,
} from "./profile.mjs";
import {
  GOVERNANCE_REVIEW_PACK_CONTRACT_BOUNDARY,
  GOVERNANCE_REVIEW_PACK_CONTRACT_KIND,
  GOVERNANCE_REVIEW_PACK_CONTRACT_VERSION,
  buildGovernanceReviewPackContract,
  assertValidGovernanceReviewPackContract,
  validateGovernanceReviewPackContract,
} from "./reviewPack.mjs";

export const GOVERNANCE_RATIONALE_BUNDLE_KIND =
  "governance_rationale_bundle_profile";
export const GOVERNANCE_RATIONALE_BUNDLE_VERSION = "v1";
export const GOVERNANCE_RATIONALE_BUNDLE_SCHEMA_ID =
  "mindforge/governance-rationale-bundle/v1";
export const GOVERNANCE_RATIONALE_BUNDLE_STAGE =
  "governance_review_pack_phase2_v1";
export const GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY =
  "governance_snapshot_receipt_readiness_and_review_pack_boundary";
export const GOVERNANCE_SNAPSHOT_RECEIPT_READY = "review_pack_ready";
export const GOVERNANCE_SNAPSHOT_CONSUMER_COMPATIBLE = "consumer_compatible";
export const GOVERNANCE_RATIONALE_BUNDLE_LEVELS = Object.freeze([
  GOVERNANCE_SNAPSHOT_RECEIPT_READY,
  GOVERNANCE_SNAPSHOT_CONSUMER_COMPATIBLE,
]);
export const GOVERNANCE_RATIONALE_BUNDLE_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_rationale_bundle",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_RATIONALE_BUNDLE_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "snapshot_ref",
  "review_pack_contract",
  "receipt_readiness",
  "consumer_compatibility",
  "stabilization_refs",
]);
export const GOVERNANCE_RATIONALE_BUNDLE_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_RATIONALE_BUNDLE_KIND",
  "GOVERNANCE_RATIONALE_BUNDLE_VERSION",
  "GOVERNANCE_RATIONALE_BUNDLE_SCHEMA_ID",
  "GOVERNANCE_RATIONALE_BUNDLE_STAGE",
  "GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY",
  "GOVERNANCE_SNAPSHOT_RECEIPT_READY",
  "GOVERNANCE_SNAPSHOT_CONSUMER_COMPATIBLE",
  "GOVERNANCE_RATIONALE_BUNDLE_LEVELS",
  "GOVERNANCE_RATIONALE_BUNDLE_TOP_LEVEL_FIELDS",
  "GOVERNANCE_RATIONALE_BUNDLE_PAYLOAD_FIELDS",
  "GOVERNANCE_RATIONALE_BUNDLE_STABLE_EXPORT_SET",
  "buildGovernanceRationaleBundleProfile",
  "validateGovernanceRationaleBundleProfile",
  "assertValidGovernanceRationaleBundleProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceRationaleBundleProfile({
  governanceSnapshotProfile,
}) {
  const snapshot = assertValidGovernanceSnapshotProfile(governanceSnapshotProfile);
  const reviewPack = assertValidGovernanceReviewPackContract(
    buildGovernanceReviewPackContract({ governanceSnapshotProfile: snapshot })
  );

  return {
    kind: GOVERNANCE_RATIONALE_BUNDLE_KIND,
    version: GOVERNANCE_RATIONALE_BUNDLE_VERSION,
    schema_id: GOVERNANCE_RATIONALE_BUNDLE_SCHEMA_ID,
    canonical_action_hash: snapshot.canonical_action_hash,
    governance_rationale_bundle: {
      stage: GOVERNANCE_RATIONALE_BUNDLE_STAGE,
      consumer_surface: GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
      boundary: GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY,
      snapshot_ref: {
        kind: GOVERNANCE_SNAPSHOT_PROFILE_KIND,
        version: GOVERNANCE_SNAPSHOT_PROFILE_VERSION,
        boundary: GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY,
      },
      review_pack_contract: reviewPack,
      receipt_readiness: {
        level: GOVERNANCE_SNAPSHOT_RECEIPT_READY,
        review_pack_ready: true,
        rationale_bundle_ready: true,
        recommendation_only: true,
      },
      consumer_compatibility: {
        level: GOVERNANCE_SNAPSHOT_CONSUMER_COMPATIBLE,
        additive_only: true,
        non_executing: true,
        default_off: true,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        denied_exit_code_preserved: 25,
      },
      stabilization_refs: {
        export_compatibility_contract_available: true,
        stabilization_profile_available: true,
        final_acceptance_boundary_available: true,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceRationaleBundleProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["governance rationale bundle profile must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_RATIONALE_BUNDLE_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance rationale bundle top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_RATIONALE_BUNDLE_KIND) {
    errors.push("governance rationale bundle kind drifted");
  }
  if (profile.version !== GOVERNANCE_RATIONALE_BUNDLE_VERSION) {
    errors.push("governance rationale bundle version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_RATIONALE_BUNDLE_SCHEMA_ID) {
    errors.push("governance rationale bundle schema drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance rationale bundle canonical action hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance rationale bundle determinism drifted");
  }
  if (profile.enforcing !== false) {
    errors.push("governance rationale bundle enforcement drifted");
  }
  const payload = profile.governance_rationale_bundle;
  if (!isPlainObject(payload)) {
    errors.push("governance rationale bundle payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_RATIONALE_BUNDLE_PAYLOAD_FIELDS)
  ) {
    errors.push("governance rationale bundle payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_RATIONALE_BUNDLE_STAGE) {
    errors.push("governance rationale bundle stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE) {
    errors.push("governance rationale bundle consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY) {
    errors.push("governance rationale bundle boundary drifted");
  }
  if (!isPlainObject(payload.snapshot_ref)) {
    errors.push("governance rationale bundle snapshot ref missing");
  } else {
    if (payload.snapshot_ref.kind !== GOVERNANCE_SNAPSHOT_PROFILE_KIND) {
      errors.push("governance rationale bundle snapshot kind drifted");
    }
    if (payload.snapshot_ref.version !== GOVERNANCE_SNAPSHOT_PROFILE_VERSION) {
      errors.push("governance rationale bundle snapshot version drifted");
    }
    if (payload.snapshot_ref.boundary !== GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY) {
      errors.push("governance rationale bundle snapshot boundary drifted");
    }
  }
  const reviewPackValidation = validateGovernanceReviewPackContract(
    payload.review_pack_contract
  );
  if (!reviewPackValidation.ok) {
    errors.push(...reviewPackValidation.errors);
  }
  if (!isPlainObject(payload.receipt_readiness)) {
    errors.push("governance rationale bundle receipt readiness missing");
  } else {
    if (payload.receipt_readiness.level !== GOVERNANCE_SNAPSHOT_RECEIPT_READY) {
      errors.push("governance rationale bundle readiness level drifted");
    }
    if (payload.receipt_readiness.review_pack_ready !== true) {
      errors.push("governance rationale bundle review pack readiness drifted");
    }
    if (payload.receipt_readiness.rationale_bundle_ready !== true) {
      errors.push("governance rationale bundle readiness drifted");
    }
    if (payload.receipt_readiness.recommendation_only !== true) {
      errors.push("governance rationale bundle recommendation boundary drifted");
    }
  }
  if (!isPlainObject(payload.consumer_compatibility)) {
    errors.push("governance rationale bundle consumer compatibility missing");
  } else {
    if (
      payload.consumer_compatibility.level !==
      GOVERNANCE_SNAPSHOT_CONSUMER_COMPATIBLE
    ) {
      errors.push("governance rationale bundle compatibility level drifted");
    }
    if (payload.consumer_compatibility.additive_only !== true) {
      errors.push("governance rationale bundle additive boundary drifted");
    }
    if (payload.consumer_compatibility.non_executing !== true) {
      errors.push("governance rationale bundle execution boundary drifted");
    }
    if (payload.consumer_compatibility.default_off !== true) {
      errors.push("governance rationale bundle default-off drifted");
    }
    if (
      payload.consumer_compatibility.authority_scope !==
      "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("governance rationale bundle authority scope drifted");
    }
    if (payload.consumer_compatibility.denied_exit_code_preserved !== 25) {
      errors.push("governance rationale bundle deny exit drifted");
    }
  }
  if (!isPlainObject(payload.stabilization_refs)) {
    errors.push("governance rationale bundle stabilization refs missing");
  } else {
    if (payload.stabilization_refs.export_compatibility_contract_available !== true) {
      errors.push("governance rationale bundle export compatibility availability drifted");
    }
    if (payload.stabilization_refs.stabilization_profile_available !== true) {
      errors.push("governance rationale bundle stabilization availability drifted");
    }
    if (payload.stabilization_refs.final_acceptance_boundary_available !== true) {
      errors.push("governance rationale bundle final acceptance availability drifted");
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceRationaleBundleProfile(profile) {
  const validation = validateGovernanceRationaleBundleProfile(profile);
  if (validation.ok) return profile;
  const err = new Error(
    `governance rationale bundle profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
