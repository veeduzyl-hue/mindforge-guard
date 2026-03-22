import {
  GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY,
  GOVERNANCE_RATIONALE_BUNDLE_KIND,
  GOVERNANCE_RATIONALE_BUNDLE_STAGE,
  GOVERNANCE_RATIONALE_BUNDLE_VERSION,
  GOVERNANCE_SNAPSHOT_CONSUMER_COMPATIBLE,
  assertValidGovernanceRationaleBundleProfile,
} from "./rationaleBundle.mjs";
import {
  GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
} from "./profile.mjs";
import {
  GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_BOUNDARY,
  GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND,
  GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_VERSION,
  assertValidGovernanceSnapshotExportCompatibilityContract,
} from "./exportCompatibility.mjs";

export const GOVERNANCE_SNAPSHOT_STABILIZATION_KIND =
  "governance_snapshot_stabilization_profile";
export const GOVERNANCE_SNAPSHOT_STABILIZATION_VERSION = "v1";
export const GOVERNANCE_SNAPSHOT_STABILIZATION_SCHEMA_ID =
  "mindforge/governance-snapshot-stabilization/v1";
export const GOVERNANCE_SNAPSHOT_STABILIZATION_STAGE =
  "governance_snapshot_stabilization_phase3_v1";
export const GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_BOUNDARY =
  "final_governance_snapshot_consumer_contract";
export const GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_READY =
  "final_consumer_ready";
export const GOVERNANCE_SNAPSHOT_STABILIZATION_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_snapshot_stabilization",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_SNAPSHOT_STABILIZATION_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "rationale_bundle_ref",
  "export_compatibility_ref",
  "final_consumer_contract",
  "preserved_semantics",
]);
export const GOVERNANCE_SNAPSHOT_STABILIZATION_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_SNAPSHOT_STABILIZATION_KIND",
  "GOVERNANCE_SNAPSHOT_STABILIZATION_VERSION",
  "GOVERNANCE_SNAPSHOT_STABILIZATION_SCHEMA_ID",
  "GOVERNANCE_SNAPSHOT_STABILIZATION_STAGE",
  "GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_BOUNDARY",
  "GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_READY",
  "GOVERNANCE_SNAPSHOT_STABILIZATION_TOP_LEVEL_FIELDS",
  "GOVERNANCE_SNAPSHOT_STABILIZATION_PAYLOAD_FIELDS",
  "GOVERNANCE_SNAPSHOT_STABILIZATION_STABLE_EXPORT_SET",
  "buildGovernanceSnapshotStabilizationProfile",
  "validateGovernanceSnapshotStabilizationProfile",
  "assertValidGovernanceSnapshotStabilizationProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceSnapshotStabilizationProfile({
  governanceRationaleBundleProfile,
  governanceSnapshotExportCompatibilityContract,
}) {
  const rationaleBundle = assertValidGovernanceRationaleBundleProfile(
    governanceRationaleBundleProfile
  );
  const exportCompatibility =
    assertValidGovernanceSnapshotExportCompatibilityContract(
      governanceSnapshotExportCompatibilityContract
    );

  return {
    kind: GOVERNANCE_SNAPSHOT_STABILIZATION_KIND,
    version: GOVERNANCE_SNAPSHOT_STABILIZATION_VERSION,
    schema_id: GOVERNANCE_SNAPSHOT_STABILIZATION_SCHEMA_ID,
    canonical_action_hash: rationaleBundle.canonical_action_hash,
    governance_snapshot_stabilization: {
      stage: GOVERNANCE_SNAPSHOT_STABILIZATION_STAGE,
      consumer_surface: GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
      boundary: GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_BOUNDARY,
      rationale_bundle_ref: {
        kind: GOVERNANCE_RATIONALE_BUNDLE_KIND,
        version: GOVERNANCE_RATIONALE_BUNDLE_VERSION,
        stage: GOVERNANCE_RATIONALE_BUNDLE_STAGE,
        boundary: GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY,
      },
      export_compatibility_ref: {
        kind: GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND,
        version: GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_VERSION,
        boundary: GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_BOUNDARY,
      },
      final_consumer_contract: {
        acceptance_level: GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_READY,
        recommendation_only: true,
        additive_only: true,
        execution_enabled: false,
        default_on: false,
        review_pack_execution_available: false,
        rationale_bundle_execution_available: false,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        governance_object_addition: false,
      },
      preserved_semantics: {
        snapshot_explainability_semantics_preserved: true,
        review_pack_semantics_preserved: true,
        rationale_bundle_semantics_preserved: true,
        export_compatibility_semantics_preserved: true,
        evidence_semantics_preserved: true,
        policy_semantics_preserved: true,
        enforcement_semantics_preserved: true,
        approval_semantics_preserved: true,
        judgment_semantics_preserved: true,
        permit_gate_semantics_preserved: true,
        consumer_contract_ready:
          rationaleBundle.governance_rationale_bundle.consumer_compatibility.level ===
          GOVERNANCE_SNAPSHOT_CONSUMER_COMPATIBLE,
        review_pack_ready: exportCompatibility.review_pack_ready === true,
        export_compatible: exportCompatibility.export_compatible === true,
        main_path_takeover: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceSnapshotStabilizationProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["governance snapshot stabilization profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_SNAPSHOT_STABILIZATION_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance snapshot stabilization top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_SNAPSHOT_STABILIZATION_KIND) {
    errors.push("governance snapshot stabilization kind drifted");
  }
  if (profile.version !== GOVERNANCE_SNAPSHOT_STABILIZATION_VERSION) {
    errors.push("governance snapshot stabilization version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_SNAPSHOT_STABILIZATION_SCHEMA_ID) {
    errors.push("governance snapshot stabilization schema drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance snapshot stabilization canonical action hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance snapshot stabilization determinism drifted");
  }
  if (profile.enforcing !== false) {
    errors.push("governance snapshot stabilization enforcement drifted");
  }
  const payload = profile.governance_snapshot_stabilization;
  if (!isPlainObject(payload)) {
    errors.push("governance snapshot stabilization payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_SNAPSHOT_STABILIZATION_PAYLOAD_FIELDS)
  ) {
    errors.push("governance snapshot stabilization payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_SNAPSHOT_STABILIZATION_STAGE) {
    errors.push("governance snapshot stabilization stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE) {
    errors.push("governance snapshot stabilization consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_BOUNDARY) {
    errors.push("governance snapshot stabilization boundary drifted");
  }
  if (!isPlainObject(payload.rationale_bundle_ref)) {
    errors.push("governance snapshot stabilization rationale bundle ref missing");
  } else {
    if (payload.rationale_bundle_ref.kind !== GOVERNANCE_RATIONALE_BUNDLE_KIND) {
      errors.push("governance snapshot stabilization rationale bundle kind drifted");
    }
    if (
      payload.rationale_bundle_ref.version !== GOVERNANCE_RATIONALE_BUNDLE_VERSION
    ) {
      errors.push("governance snapshot stabilization rationale bundle version drifted");
    }
    if (payload.rationale_bundle_ref.stage !== GOVERNANCE_RATIONALE_BUNDLE_STAGE) {
      errors.push("governance snapshot stabilization rationale bundle stage drifted");
    }
    if (
      payload.rationale_bundle_ref.boundary !== GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY
    ) {
      errors.push("governance snapshot stabilization rationale bundle boundary drifted");
    }
  }
  if (!isPlainObject(payload.export_compatibility_ref)) {
    errors.push("governance snapshot stabilization export compatibility ref missing");
  } else {
    if (
      payload.export_compatibility_ref.kind !==
      GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND
    ) {
      errors.push("governance snapshot stabilization export compatibility kind drifted");
    }
    if (
      payload.export_compatibility_ref.version !==
      GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_VERSION
    ) {
      errors.push("governance snapshot stabilization export compatibility version drifted");
    }
    if (
      payload.export_compatibility_ref.boundary !==
      GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_BOUNDARY
    ) {
      errors.push("governance snapshot stabilization export compatibility boundary drifted");
    }
  }
  if (!isPlainObject(payload.final_consumer_contract)) {
    errors.push("governance snapshot stabilization final contract missing");
  } else {
    const contract = payload.final_consumer_contract;
    if (contract.acceptance_level !== GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_READY) {
      errors.push("governance snapshot stabilization acceptance level drifted");
    }
    if (contract.recommendation_only !== true) {
      errors.push("governance snapshot stabilization recommendation boundary drifted");
    }
    if (contract.additive_only !== true) {
      errors.push("governance snapshot stabilization additive boundary drifted");
    }
    if (contract.execution_enabled !== false) {
      errors.push("governance snapshot stabilization execution boundary drifted");
    }
    if (contract.default_on !== false) {
      errors.push("governance snapshot stabilization default-on drifted");
    }
    if (contract.review_pack_execution_available !== false) {
      errors.push("governance snapshot stabilization review pack execution drifted");
    }
    if (contract.rationale_bundle_execution_available !== false) {
      errors.push("governance snapshot stabilization rationale bundle execution drifted");
    }
    if (contract.audit_output_preserved !== true) {
      errors.push("governance snapshot stabilization audit output drifted");
    }
    if (contract.audit_verdict_preserved !== true) {
      errors.push("governance snapshot stabilization audit verdict drifted");
    }
    if (contract.actual_exit_code_preserved !== true) {
      errors.push("governance snapshot stabilization actual exit drifted");
    }
    if (contract.denied_exit_code_preserved !== 25) {
      errors.push("governance snapshot stabilization deny exit drifted");
    }
    if (
      contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("governance snapshot stabilization authority scope drifted");
    }
    if (contract.governance_object_addition !== false) {
      errors.push("governance snapshot stabilization governance object drifted");
    }
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance snapshot stabilization preserved semantics missing");
  } else {
    const semantics = payload.preserved_semantics;
    if (semantics.snapshot_explainability_semantics_preserved !== true) {
      errors.push("governance snapshot stabilization explainability semantics drifted");
    }
    if (semantics.review_pack_semantics_preserved !== true) {
      errors.push("governance snapshot stabilization review pack semantics drifted");
    }
    if (semantics.rationale_bundle_semantics_preserved !== true) {
      errors.push("governance snapshot stabilization rationale bundle semantics drifted");
    }
    if (semantics.export_compatibility_semantics_preserved !== true) {
      errors.push("governance snapshot stabilization export compatibility semantics drifted");
    }
    if (semantics.evidence_semantics_preserved !== true) {
      errors.push("governance snapshot stabilization evidence semantics drifted");
    }
    if (semantics.policy_semantics_preserved !== true) {
      errors.push("governance snapshot stabilization policy semantics drifted");
    }
    if (semantics.enforcement_semantics_preserved !== true) {
      errors.push("governance snapshot stabilization enforcement semantics drifted");
    }
    if (semantics.approval_semantics_preserved !== true) {
      errors.push("governance snapshot stabilization approval semantics drifted");
    }
    if (semantics.judgment_semantics_preserved !== true) {
      errors.push("governance snapshot stabilization judgment semantics drifted");
    }
    if (semantics.permit_gate_semantics_preserved !== true) {
      errors.push("governance snapshot stabilization permit gate semantics drifted");
    }
    if (semantics.consumer_contract_ready !== true) {
      errors.push("governance snapshot stabilization consumer readiness drifted");
    }
    if (semantics.review_pack_ready !== true) {
      errors.push("governance snapshot stabilization review pack readiness drifted");
    }
    if (semantics.export_compatible !== true) {
      errors.push("governance snapshot stabilization export compatibility drifted");
    }
    if (semantics.main_path_takeover !== false) {
      errors.push("governance snapshot stabilization main path takeover drifted");
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceSnapshotStabilizationProfile(profile) {
  const validation = validateGovernanceSnapshotStabilizationProfile(profile);
  if (validation.ok) return profile;
  const err = new Error(
    `governance snapshot stabilization profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
