import {
  GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_EVIDENCE_STABILIZATION_KIND,
  GOVERNANCE_EVIDENCE_STABILIZATION_STAGE,
  GOVERNANCE_EVIDENCE_STABILIZATION_VERSION,
  assertValidGovernanceEvidenceStabilizationProfile,
} from "../evidence/stabilization.mjs";
import { GOVERNANCE_EVIDENCE_CONSUMER_SURFACE } from "../evidence/profile.mjs";

export const GOVERNANCE_SNAPSHOT_PROFILE_KIND = "governance_snapshot_profile";
export const GOVERNANCE_SNAPSHOT_PROFILE_VERSION = "v1";
export const GOVERNANCE_SNAPSHOT_PROFILE_SCHEMA_ID =
  "mindforge/governance-snapshot-profile/v1";
export const GOVERNANCE_SNAPSHOT_PROFILE_STAGE =
  "governance_snapshot_phase1_v1";
export const GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE =
  "guard.audit.governance_snapshot";
export const GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY =
  "governance_snapshot_and_explainability_boundary_contract";
export const GOVERNANCE_EXPLAINABILITY_CONTRACT_KIND =
  "governance_explainability_contract";
export const GOVERNANCE_EXPLAINABILITY_CONTRACT_VERSION = "v1";
export const GOVERNANCE_EXPLAINABILITY_CONTRACT_BOUNDARY =
  "bounded_governance_explainability_contract";
export const GOVERNANCE_RATIONALE_CONTRACT_KIND =
  "governance_rationale_contract";
export const GOVERNANCE_RATIONALE_CONTRACT_VERSION = "v1";
export const GOVERNANCE_RATIONALE_CONTRACT_BOUNDARY =
  "bounded_governance_rationale_contract";
export const GOVERNANCE_SNAPSHOT_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_snapshot",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_SNAPSHOT_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "evidence_ref",
  "snapshot_contract",
  "explainability_contract",
  "rationale_contract",
  "compatibility_refs",
  "preserved_semantics",
]);
export const GOVERNANCE_SNAPSHOT_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_SNAPSHOT_PROFILE_KIND",
  "GOVERNANCE_SNAPSHOT_PROFILE_VERSION",
  "GOVERNANCE_SNAPSHOT_PROFILE_SCHEMA_ID",
  "GOVERNANCE_SNAPSHOT_PROFILE_STAGE",
  "GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE",
  "GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY",
  "GOVERNANCE_EXPLAINABILITY_CONTRACT_KIND",
  "GOVERNANCE_EXPLAINABILITY_CONTRACT_VERSION",
  "GOVERNANCE_EXPLAINABILITY_CONTRACT_BOUNDARY",
  "GOVERNANCE_RATIONALE_CONTRACT_KIND",
  "GOVERNANCE_RATIONALE_CONTRACT_VERSION",
  "GOVERNANCE_RATIONALE_CONTRACT_BOUNDARY",
  "GOVERNANCE_SNAPSHOT_TOP_LEVEL_FIELDS",
  "GOVERNANCE_SNAPSHOT_PAYLOAD_FIELDS",
  "GOVERNANCE_SNAPSHOT_STABLE_EXPORT_SET",
  "buildGovernanceSnapshotProfile",
  "validateGovernanceSnapshotProfile",
  "assertValidGovernanceSnapshotProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceSnapshotProfile({
  governanceEvidenceStabilizationProfile,
}) {
  const evidence = assertValidGovernanceEvidenceStabilizationProfile(
    governanceEvidenceStabilizationProfile
  );

  return {
    kind: GOVERNANCE_SNAPSHOT_PROFILE_KIND,
    version: GOVERNANCE_SNAPSHOT_PROFILE_VERSION,
    schema_id: GOVERNANCE_SNAPSHOT_PROFILE_SCHEMA_ID,
    canonical_action_hash: evidence.canonical_action_hash,
    governance_snapshot: {
      stage: GOVERNANCE_SNAPSHOT_PROFILE_STAGE,
      consumer_surface: GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
      boundary: GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY,
      evidence_ref: {
        kind: GOVERNANCE_EVIDENCE_STABILIZATION_KIND,
        version: GOVERNANCE_EVIDENCE_STABILIZATION_VERSION,
        stage: GOVERNANCE_EVIDENCE_STABILIZATION_STAGE,
        boundary: GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY,
        source_surface: GOVERNANCE_EVIDENCE_CONSUMER_SURFACE,
      },
      snapshot_contract: {
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_on: false,
      },
      explainability_contract: {
        kind: GOVERNANCE_EXPLAINABILITY_CONTRACT_KIND,
        version: GOVERNANCE_EXPLAINABILITY_CONTRACT_VERSION,
        boundary: GOVERNANCE_EXPLAINABILITY_CONTRACT_BOUNDARY,
        explainability_available: true,
        descriptive_only: true,
        bounded_snapshot: true,
      },
      rationale_contract: {
        kind: GOVERNANCE_RATIONALE_CONTRACT_KIND,
        version: GOVERNANCE_RATIONALE_CONTRACT_VERSION,
        boundary: GOVERNANCE_RATIONALE_CONTRACT_BOUNDARY,
        rationale_available: true,
        descriptive_only: true,
        canonical_rationale_preserved: true,
      },
      compatibility_refs: {
        review_pack_contract_available: true,
        rationale_bundle_profile_available: true,
        export_compatibility_contract_available: true,
        stabilization_profile_available: true,
        final_acceptance_boundary_available: true,
      },
      preserved_semantics: {
        evidence_semantics_preserved: true,
        policy_semantics_preserved: true,
        enforcement_semantics_preserved: true,
        approval_semantics_preserved: true,
        judgment_semantics_preserved: true,
        permit_gate_semantics_preserved: true,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        authority_scope_expansion: false,
        governance_object_addition: false,
        main_path_takeover: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceSnapshotProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["governance snapshot profile must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_SNAPSHOT_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance snapshot top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_SNAPSHOT_PROFILE_KIND) {
    errors.push("governance snapshot kind drifted");
  }
  if (profile.version !== GOVERNANCE_SNAPSHOT_PROFILE_VERSION) {
    errors.push("governance snapshot version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_SNAPSHOT_PROFILE_SCHEMA_ID) {
    errors.push("governance snapshot schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance snapshot canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance snapshot must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("governance snapshot must remain non-enforcing");
  }

  const payload = profile.governance_snapshot;
  if (!isPlainObject(payload)) {
    errors.push("governance snapshot payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_SNAPSHOT_PAYLOAD_FIELDS)
  ) {
    errors.push("governance snapshot payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_SNAPSHOT_PROFILE_STAGE) {
    errors.push("governance snapshot stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE) {
    errors.push("governance snapshot consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY) {
    errors.push("governance snapshot boundary drifted");
  }
  if (!isPlainObject(payload.evidence_ref)) {
    errors.push("governance snapshot evidence ref must be an object");
  } else {
    if (payload.evidence_ref.kind !== GOVERNANCE_EVIDENCE_STABILIZATION_KIND) {
      errors.push("governance snapshot evidence ref kind drifted");
    }
    if (
      payload.evidence_ref.version !== GOVERNANCE_EVIDENCE_STABILIZATION_VERSION
    ) {
      errors.push("governance snapshot evidence ref version drifted");
    }
    if (payload.evidence_ref.stage !== GOVERNANCE_EVIDENCE_STABILIZATION_STAGE) {
      errors.push("governance snapshot evidence ref stage drifted");
    }
    if (
      payload.evidence_ref.boundary !== GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY
    ) {
      errors.push("governance snapshot evidence ref boundary drifted");
    }
    if (payload.evidence_ref.source_surface !== GOVERNANCE_EVIDENCE_CONSUMER_SURFACE) {
      errors.push("governance snapshot evidence ref source surface drifted");
    }
  }
  if (!isPlainObject(payload.snapshot_contract)) {
    errors.push("governance snapshot contract must be an object");
  } else {
    if (payload.snapshot_contract.recommendation_only !== true) {
      errors.push("governance snapshot recommendation boundary drifted");
    }
    if (payload.snapshot_contract.additive_only !== true) {
      errors.push("governance snapshot additive boundary drifted");
    }
    if (payload.snapshot_contract.non_executing !== true) {
      errors.push("governance snapshot execution boundary drifted");
    }
    if (payload.snapshot_contract.default_on !== false) {
      errors.push("governance snapshot default-on boundary drifted");
    }
  }
  if (!isPlainObject(payload.explainability_contract)) {
    errors.push("governance explainability contract must be an object");
  } else {
    if (
      payload.explainability_contract.kind !==
      GOVERNANCE_EXPLAINABILITY_CONTRACT_KIND
    ) {
      errors.push("governance explainability kind drifted");
    }
    if (
      payload.explainability_contract.version !==
      GOVERNANCE_EXPLAINABILITY_CONTRACT_VERSION
    ) {
      errors.push("governance explainability version drifted");
    }
    if (
      payload.explainability_contract.boundary !==
      GOVERNANCE_EXPLAINABILITY_CONTRACT_BOUNDARY
    ) {
      errors.push("governance explainability boundary drifted");
    }
    if (payload.explainability_contract.explainability_available !== true) {
      errors.push("governance explainability availability drifted");
    }
    if (payload.explainability_contract.descriptive_only !== true) {
      errors.push("governance explainability descriptive boundary drifted");
    }
    if (payload.explainability_contract.bounded_snapshot !== true) {
      errors.push("governance explainability bounded snapshot drifted");
    }
  }
  if (!isPlainObject(payload.rationale_contract)) {
    errors.push("governance rationale contract must be an object");
  } else {
    if (payload.rationale_contract.kind !== GOVERNANCE_RATIONALE_CONTRACT_KIND) {
      errors.push("governance rationale kind drifted");
    }
    if (
      payload.rationale_contract.version !== GOVERNANCE_RATIONALE_CONTRACT_VERSION
    ) {
      errors.push("governance rationale version drifted");
    }
    if (
      payload.rationale_contract.boundary !== GOVERNANCE_RATIONALE_CONTRACT_BOUNDARY
    ) {
      errors.push("governance rationale boundary drifted");
    }
    if (payload.rationale_contract.rationale_available !== true) {
      errors.push("governance rationale availability drifted");
    }
    if (payload.rationale_contract.descriptive_only !== true) {
      errors.push("governance rationale descriptive boundary drifted");
    }
    if (payload.rationale_contract.canonical_rationale_preserved !== true) {
      errors.push("governance rationale canonical preservation drifted");
    }
  }
  if (!isPlainObject(payload.compatibility_refs)) {
    errors.push("governance snapshot compatibility refs must be an object");
  } else {
    if (payload.compatibility_refs.review_pack_contract_available !== true) {
      errors.push("governance snapshot review pack availability drifted");
    }
    if (payload.compatibility_refs.rationale_bundle_profile_available !== true) {
      errors.push("governance snapshot rationale bundle availability drifted");
    }
    if (payload.compatibility_refs.export_compatibility_contract_available !== true) {
      errors.push("governance snapshot export compatibility availability drifted");
    }
    if (payload.compatibility_refs.stabilization_profile_available !== true) {
      errors.push("governance snapshot stabilization availability drifted");
    }
    if (payload.compatibility_refs.final_acceptance_boundary_available !== true) {
      errors.push("governance snapshot final acceptance availability drifted");
    }
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance snapshot preserved semantics must be an object");
  } else {
    const semantics = payload.preserved_semantics;
    if (semantics.evidence_semantics_preserved !== true) {
      errors.push("governance snapshot evidence semantics drifted");
    }
    if (semantics.policy_semantics_preserved !== true) {
      errors.push("governance snapshot policy semantics drifted");
    }
    if (semantics.enforcement_semantics_preserved !== true) {
      errors.push("governance snapshot enforcement semantics drifted");
    }
    if (semantics.approval_semantics_preserved !== true) {
      errors.push("governance snapshot approval semantics drifted");
    }
    if (semantics.judgment_semantics_preserved !== true) {
      errors.push("governance snapshot judgment semantics drifted");
    }
    if (semantics.permit_gate_semantics_preserved !== true) {
      errors.push("governance snapshot permit gate semantics drifted");
    }
    if (semantics.audit_output_preserved !== true) {
      errors.push("governance snapshot audit output drifted");
    }
    if (semantics.audit_verdict_preserved !== true) {
      errors.push("governance snapshot audit verdict drifted");
    }
    if (semantics.actual_exit_code_preserved !== true) {
      errors.push("governance snapshot actual exit drifted");
    }
    if (semantics.denied_exit_code_preserved !== 25) {
      errors.push("governance snapshot deny exit drifted");
    }
    if (
      semantics.authority_scope !== "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("governance snapshot authority scope drifted");
    }
    if (semantics.authority_scope_expansion !== false) {
      errors.push("governance snapshot authority expansion drifted");
    }
    if (semantics.governance_object_addition !== false) {
      errors.push("governance snapshot governance object boundary drifted");
    }
    if (semantics.main_path_takeover !== false) {
      errors.push("governance snapshot main path takeover drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceSnapshotProfile(profile) {
  const validation = validateGovernanceSnapshotProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance snapshot profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
