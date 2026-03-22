import {
  GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY,
  GOVERNANCE_RATIONALE_BUNDLE_KIND,
  GOVERNANCE_RATIONALE_BUNDLE_VERSION,
  assertValidGovernanceRationaleBundleProfile,
} from "./rationaleBundle.mjs";

export const GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND =
  "governance_snapshot_export_compatibility_contract";
export const GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_VERSION = "v1";
export const GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_BOUNDARY =
  "bounded_governance_snapshot_export_compatibility_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceSnapshotExportCompatibilityContract({
  governanceRationaleBundleProfile,
}) {
  const bundle = assertValidGovernanceRationaleBundleProfile(
    governanceRationaleBundleProfile
  );

  return {
    kind: GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND,
    version: GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_VERSION,
    boundary: GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_BOUNDARY,
    rationale_bundle_ref: {
      kind: GOVERNANCE_RATIONALE_BUNDLE_KIND,
      version: GOVERNANCE_RATIONALE_BUNDLE_VERSION,
      boundary: GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY,
    },
    export_compatible: true,
    review_pack_ready: true,
    recommendation_only: true,
    additive_only: true,
    execution_enabled: false,
    default_on: false,
    rationale_bundle_execution_available: false,
    audit_output_preserved: true,
    audit_verdict_preserved: true,
    actual_exit_code_preserved: true,
    denied_exit_code_preserved: 25,
    authority_scope: "review_gate_deny_exit_recommendation_only",
    governance_object_addition: false,
    main_path_takeover: false,
    canonical_action_hash: bundle.canonical_action_hash,
  };
}

export function validateGovernanceSnapshotExportCompatibilityContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: ["governance snapshot export compatibility contract must be an object"],
    };
  }
  if (contract.kind !== GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND) {
    errors.push("governance snapshot export compatibility kind drifted");
  }
  if (contract.version !== GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_VERSION) {
    errors.push("governance snapshot export compatibility version drifted");
  }
  if (contract.boundary !== GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_BOUNDARY) {
    errors.push("governance snapshot export compatibility boundary drifted");
  }
  if (!isPlainObject(contract.rationale_bundle_ref)) {
    errors.push("governance snapshot export bundle ref missing");
  } else {
    if (contract.rationale_bundle_ref.kind !== GOVERNANCE_RATIONALE_BUNDLE_KIND) {
      errors.push("governance snapshot export bundle kind drifted");
    }
    if (
      contract.rationale_bundle_ref.version !== GOVERNANCE_RATIONALE_BUNDLE_VERSION
    ) {
      errors.push("governance snapshot export bundle version drifted");
    }
    if (
      contract.rationale_bundle_ref.boundary !== GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY
    ) {
      errors.push("governance snapshot export bundle boundary drifted");
    }
  }
  if (contract.export_compatible !== true) {
    errors.push("governance snapshot export compatibility drifted");
  }
  if (contract.review_pack_ready !== true) {
    errors.push("governance snapshot export review pack readiness drifted");
  }
  if (contract.recommendation_only !== true) {
    errors.push("governance snapshot export recommendation boundary drifted");
  }
  if (contract.additive_only !== true) {
    errors.push("governance snapshot export additive boundary drifted");
  }
  if (contract.execution_enabled !== false) {
    errors.push("governance snapshot export execution boundary drifted");
  }
  if (contract.default_on !== false) {
    errors.push("governance snapshot export default-on drifted");
  }
  if (contract.rationale_bundle_execution_available !== false) {
    errors.push("governance snapshot export rationale execution drifted");
  }
  if (contract.audit_output_preserved !== true) {
    errors.push("governance snapshot export audit output drifted");
  }
  if (contract.audit_verdict_preserved !== true) {
    errors.push("governance snapshot export audit verdict drifted");
  }
  if (contract.actual_exit_code_preserved !== true) {
    errors.push("governance snapshot export actual exit drifted");
  }
  if (contract.denied_exit_code_preserved !== 25) {
    errors.push("governance snapshot export deny exit drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance snapshot export authority scope drifted");
  }
  if (contract.governance_object_addition !== false) {
    errors.push("governance snapshot export governance object boundary drifted");
  }
  if (contract.main_path_takeover !== false) {
    errors.push("governance snapshot export main path takeover drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance snapshot export canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceSnapshotExportCompatibilityContract(contract) {
  const validation = validateGovernanceSnapshotExportCompatibilityContract(contract);
  if (validation.ok) return contract;
  const err = new Error(
    `governance snapshot export compatibility contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
