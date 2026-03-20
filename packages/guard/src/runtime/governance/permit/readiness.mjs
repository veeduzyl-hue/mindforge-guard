import {
  GOVERNANCE_SURFACE_STABILITY,
  GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
  GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER,
  GOVERNANCE_SURFACE_ARTIFACT_IDS,
  GOVERNANCE_SURFACE_MAP,
  assertValidGovernanceSurfaceMap,
} from "./surface.mjs";
import {
  GOVERNANCE_CONSUMPTION_ARTIFACT_ORDER,
  GOVERNANCE_CONSUMPTION_REQUIRED_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_OPTIONAL_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_SUPPORT_ONLY_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_CONSUMER_SAFE_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_PROFILE,
  assertValidGovernanceConsumptionProfile,
} from "./consumption.mjs";

export const GOVERNANCE_SECOND_CONSUMER_READINESS_KIND =
  "governance_second_consumer_readiness_profile";
export const GOVERNANCE_SECOND_CONSUMER_READINESS_VERSION = "v1";
export const GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY = GOVERNANCE_SURFACE_STABILITY;
export const GOVERNANCE_SECOND_CONSUMER_NEUTRAL_REQUIRED = "consumer_neutral_required";
export const GOVERNANCE_SECOND_CONSUMER_NEUTRAL_OPTIONAL = "consumer_neutral_optional";
export const GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_SUPPORT = "audit_bound_support";
export const GOVERNANCE_SECOND_CONSUMER_READINESS_LEVELS = Object.freeze([
  GOVERNANCE_SECOND_CONSUMER_NEUTRAL_REQUIRED,
  GOVERNANCE_SECOND_CONSUMER_NEUTRAL_OPTIONAL,
  GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_SUPPORT,
]);
export const GOVERNANCE_SECOND_CONSUMER_ARTIFACT_ORDER = GOVERNANCE_CONSUMPTION_ARTIFACT_ORDER;

export const GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS = Object.freeze([
  "permit_gate_result",
  "governance_decision_record",
  "governance_activation_record",
]);

export const GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS = Object.freeze([
  "governance_outcome_bundle",
  "governance_application_record",
  "governance_disposition",
  "limited_enforcement_authority_result",
]);

export const GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_ARTIFACTS = Object.freeze([
  "governance_receipt",
]);
export const GOVERNANCE_SECOND_CONSUMER_MINIMAL_ARTIFACTS = Object.freeze([
  ...GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS,
]);

export const GOVERNANCE_SECOND_CONSUMER_NEUTRAL_ARTIFACTS = Object.freeze([
  ...GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS,
  ...GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS,
]);

function freezeEntry(entry) {
  return Object.freeze({
    ...entry,
    allowed_dependency_targets: Object.freeze([...entry.allowed_dependency_targets]),
  });
}

export const GOVERNANCE_SECOND_CONSUMER_READINESS_PROFILE = Object.freeze({
  permit_gate_result: freezeEntry({
    artifact_id: "permit_gate_result",
    readiness: GOVERNANCE_SECOND_CONSUMER_NEUTRAL_REQUIRED,
    consumer_neutral: true,
    audit_bound: false,
    minimal_for_second_consumer: true,
    surface_tier: GOVERNANCE_SURFACE_MAP.permit_gate_result.tier,
    consumption_requirement: GOVERNANCE_CONSUMPTION_PROFILE.permit_gate_result.requirement,
    stability: GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY,
    allowed_dependency_targets: [],
  }),
  governance_receipt: freezeEntry({
    artifact_id: "governance_receipt",
    readiness: GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_SUPPORT,
    consumer_neutral: false,
    audit_bound: true,
    minimal_for_second_consumer: false,
    surface_tier: GOVERNANCE_SURFACE_MAP.governance_receipt.tier,
    consumption_requirement: GOVERNANCE_CONSUMPTION_PROFILE.governance_receipt.requirement,
    stability: GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY,
    allowed_dependency_targets: [],
  }),
  governance_decision_record: freezeEntry({
    artifact_id: "governance_decision_record",
    readiness: GOVERNANCE_SECOND_CONSUMER_NEUTRAL_REQUIRED,
    consumer_neutral: true,
    audit_bound: false,
    minimal_for_second_consumer: true,
    surface_tier: GOVERNANCE_SURFACE_MAP.governance_decision_record.tier,
    consumption_requirement: GOVERNANCE_CONSUMPTION_PROFILE.governance_decision_record.requirement,
    stability: GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY,
    allowed_dependency_targets: ["permit_gate_result"],
  }),
  governance_outcome_bundle: freezeEntry({
    artifact_id: "governance_outcome_bundle",
    readiness: GOVERNANCE_SECOND_CONSUMER_NEUTRAL_OPTIONAL,
    consumer_neutral: true,
    audit_bound: false,
    minimal_for_second_consumer: false,
    surface_tier: GOVERNANCE_SURFACE_MAP.governance_outcome_bundle.tier,
    consumption_requirement: GOVERNANCE_CONSUMPTION_PROFILE.governance_outcome_bundle.requirement,
    stability: GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY,
    allowed_dependency_targets: ["permit_gate_result", "governance_decision_record"],
  }),
  governance_application_record: freezeEntry({
    artifact_id: "governance_application_record",
    readiness: GOVERNANCE_SECOND_CONSUMER_NEUTRAL_OPTIONAL,
    consumer_neutral: true,
    audit_bound: false,
    minimal_for_second_consumer: false,
    surface_tier: GOVERNANCE_SURFACE_MAP.governance_application_record.tier,
    consumption_requirement: GOVERNANCE_CONSUMPTION_PROFILE.governance_application_record.requirement,
    stability: GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY,
    allowed_dependency_targets: [
      "permit_gate_result",
      "governance_decision_record",
      "governance_outcome_bundle",
    ],
  }),
  governance_disposition: freezeEntry({
    artifact_id: "governance_disposition",
    readiness: GOVERNANCE_SECOND_CONSUMER_NEUTRAL_OPTIONAL,
    consumer_neutral: true,
    audit_bound: false,
    minimal_for_second_consumer: false,
    surface_tier: GOVERNANCE_SURFACE_MAP.governance_disposition.tier,
    consumption_requirement: GOVERNANCE_CONSUMPTION_PROFILE.governance_disposition.requirement,
    stability: GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY,
    allowed_dependency_targets: [
      "permit_gate_result",
      "governance_decision_record",
      "governance_application_record",
    ],
  }),
  governance_activation_record: freezeEntry({
    artifact_id: "governance_activation_record",
    readiness: GOVERNANCE_SECOND_CONSUMER_NEUTRAL_REQUIRED,
    consumer_neutral: true,
    audit_bound: false,
    minimal_for_second_consumer: true,
    surface_tier: GOVERNANCE_SURFACE_MAP.governance_activation_record.tier,
    consumption_requirement: GOVERNANCE_CONSUMPTION_PROFILE.governance_activation_record.requirement,
    stability: GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY,
    allowed_dependency_targets: ["permit_gate_result", "governance_decision_record"],
  }),
  limited_enforcement_authority_result: freezeEntry({
    artifact_id: "limited_enforcement_authority_result",
    readiness: GOVERNANCE_SECOND_CONSUMER_NEUTRAL_OPTIONAL,
    consumer_neutral: true,
    audit_bound: false,
    minimal_for_second_consumer: false,
    surface_tier: GOVERNANCE_SURFACE_MAP.limited_enforcement_authority_result.tier,
    consumption_requirement:
      GOVERNANCE_CONSUMPTION_PROFILE.limited_enforcement_authority_result.requirement,
    stability: GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY,
    allowed_dependency_targets: [
      "permit_gate_result",
      "governance_decision_record",
      "governance_activation_record",
    ],
  }),
});

export const GOVERNANCE_SECOND_CONSUMER_ARTIFACT_IDS = GOVERNANCE_SURFACE_ARTIFACT_IDS;

export const GOVERNANCE_SECOND_CONSUMER_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_SECOND_CONSUMER_READINESS_KIND",
  "GOVERNANCE_SECOND_CONSUMER_READINESS_VERSION",
  "GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY",
  "GOVERNANCE_SECOND_CONSUMER_NEUTRAL_REQUIRED",
  "GOVERNANCE_SECOND_CONSUMER_NEUTRAL_OPTIONAL",
  "GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_SUPPORT",
  "GOVERNANCE_SECOND_CONSUMER_READINESS_LEVELS",
  "GOVERNANCE_SECOND_CONSUMER_ARTIFACT_ORDER",
  "GOVERNANCE_SECOND_CONSUMER_MINIMAL_ARTIFACTS",
  "GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS",
  "GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS",
  "GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_ARTIFACTS",
  "GOVERNANCE_SECOND_CONSUMER_NEUTRAL_ARTIFACTS",
  "GOVERNANCE_SECOND_CONSUMER_ARTIFACT_IDS",
  "GOVERNANCE_SECOND_CONSUMER_STABLE_EXPORT_SET",
  "GOVERNANCE_SECOND_CONSUMER_READINESS_PROFILE",
  "getSecondConsumerReadinessEntry",
  "listSecondConsumerReadinessEntries",
  "validateSecondConsumerReadinessProfile",
  "assertValidSecondConsumerReadinessProfile",
]);

export function getSecondConsumerReadinessEntry(artifactId) {
  return GOVERNANCE_SECOND_CONSUMER_READINESS_PROFILE[artifactId] || null;
}

export function listSecondConsumerReadinessEntries() {
  return GOVERNANCE_SECOND_CONSUMER_ARTIFACT_IDS.map(
    (artifactId) => GOVERNANCE_SECOND_CONSUMER_READINESS_PROFILE[artifactId]
  );
}

export function validateSecondConsumerReadinessProfile() {
  const errors = [];
  const requiredSet = new Set(GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS);
  const optionalSet = new Set(GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS);
  const auditBoundSet = new Set(GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_ARTIFACTS);
  const neutralSet = new Set(GOVERNANCE_SECOND_CONSUMER_NEUTRAL_ARTIFACTS);
  const minimalSet = new Set(GOVERNANCE_SECOND_CONSUMER_MINIMAL_ARTIFACTS);
  const orderedIds = new Map(
    GOVERNANCE_SECOND_CONSUMER_ARTIFACT_ORDER.map((artifactId, index) => [artifactId, index])
  );

  assertValidGovernanceSurfaceMap();
  assertValidGovernanceConsumptionProfile();

  if (
    JSON.stringify(GOVERNANCE_SECOND_CONSUMER_ARTIFACT_ORDER) !==
    JSON.stringify(GOVERNANCE_CONSUMPTION_ARTIFACT_ORDER)
  ) {
    errors.push("second consumer readiness artifact order drifted from governance consumption");
  }
  if (
    JSON.stringify(GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS) !==
    JSON.stringify(GOVERNANCE_CONSUMPTION_REQUIRED_ARTIFACTS)
  ) {
    errors.push("second consumer readiness required artifacts drifted from governance consumption");
  }
  if (
    JSON.stringify(GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS) !==
    JSON.stringify(GOVERNANCE_CONSUMPTION_OPTIONAL_ARTIFACTS)
  ) {
    errors.push("second consumer readiness optional artifacts drifted from governance consumption");
  }
  if (
    JSON.stringify(GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_ARTIFACTS) !==
    JSON.stringify(GOVERNANCE_CONSUMPTION_SUPPORT_ONLY_ARTIFACTS)
  ) {
    errors.push("second consumer readiness audit-bound artifacts drifted from governance consumption");
  }
  if (
    JSON.stringify(GOVERNANCE_SECOND_CONSUMER_NEUTRAL_ARTIFACTS) !==
    JSON.stringify(GOVERNANCE_CONSUMPTION_CONSUMER_SAFE_ARTIFACTS)
  ) {
    errors.push("second consumer readiness neutral artifacts drifted from governance consumption");
  }
  if (
    JSON.stringify(GOVERNANCE_SECOND_CONSUMER_MINIMAL_ARTIFACTS) !==
    JSON.stringify(GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS)
  ) {
    errors.push("second consumer readiness minimal artifacts drifted from required artifacts");
  }

  for (const group of [
    GOVERNANCE_SECOND_CONSUMER_MINIMAL_ARTIFACTS,
    GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS,
    GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS,
    GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_ARTIFACTS,
    GOVERNANCE_SECOND_CONSUMER_NEUTRAL_ARTIFACTS,
  ]) {
    if (new Set(group).size !== group.length) {
      errors.push("second consumer readiness artifact group contains duplicates");
    }
  }

  const covered = new Set([
    ...GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS,
    ...GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS,
    ...GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_ARTIFACTS,
  ]);
  if (covered.size !== GOVERNANCE_SECOND_CONSUMER_ARTIFACT_IDS.length) {
    errors.push("second consumer readiness profile must cover all governance artifacts exactly once");
  }

  for (const artifactId of GOVERNANCE_SECOND_CONSUMER_ARTIFACT_IDS) {
    const entry = GOVERNANCE_SECOND_CONSUMER_READINESS_PROFILE[artifactId];
    if (!entry || entry.artifact_id !== artifactId) {
      errors.push(`second consumer readiness entry mismatch for ${artifactId}`);
      continue;
    }
    if (entry.stability !== GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY) {
      errors.push(`second consumer readiness entry ${artifactId} has invalid stability`);
    }
    if (!GOVERNANCE_SECOND_CONSUMER_READINESS_LEVELS.includes(entry.readiness)) {
      errors.push(`second consumer readiness entry ${artifactId} has invalid readiness level`);
    }
    if (typeof entry.consumer_neutral !== "boolean") {
      errors.push(`second consumer readiness entry ${artifactId} must declare consumer_neutral boolean`);
    }
    if (typeof entry.audit_bound !== "boolean") {
      errors.push(`second consumer readiness entry ${artifactId} must declare audit_bound boolean`);
    }
    if (typeof entry.minimal_for_second_consumer !== "boolean") {
      errors.push(
        `second consumer readiness entry ${artifactId} must declare minimal_for_second_consumer boolean`
      );
    }
    if (!Array.isArray(entry.allowed_dependency_targets)) {
      errors.push(`second consumer readiness entry ${artifactId} must declare dependency targets`);
      continue;
    }
    if (new Set(entry.allowed_dependency_targets).size !== entry.allowed_dependency_targets.length) {
      errors.push(`second consumer readiness entry ${artifactId} contains duplicate dependency targets`);
    }

    const inRequired = requiredSet.has(artifactId);
    const inOptional = optionalSet.has(artifactId);
    const inAuditBound = auditBoundSet.has(artifactId);
    if ([inRequired, inOptional, inAuditBound].filter(Boolean).length !== 1) {
      errors.push(`second consumer readiness artifact ${artifactId} must appear in exactly one readiness set`);
    }

    const expectedRequirement = GOVERNANCE_CONSUMPTION_PROFILE[artifactId]?.requirement;
    if (entry.consumption_requirement !== expectedRequirement) {
      errors.push(`second consumer readiness artifact ${artifactId} consumption requirement drifted`);
    }

    if (entry.consumer_neutral !== neutralSet.has(artifactId)) {
      errors.push(`second consumer readiness artifact ${artifactId} consumer-neutral classification drifted`);
    }
    if (entry.audit_bound !== auditBoundSet.has(artifactId)) {
      errors.push(`second consumer readiness artifact ${artifactId} audit-bound classification drifted`);
    }
    if (entry.minimal_for_second_consumer !== minimalSet.has(artifactId)) {
      errors.push(`second consumer readiness artifact ${artifactId} minimal profile drifted`);
    }
    if (entry.consumer_neutral === entry.audit_bound) {
      errors.push(`second consumer readiness artifact ${artifactId} must be exactly one of neutral or audit-bound`);
    }
    if (
      entry.readiness === GOVERNANCE_SECOND_CONSUMER_NEUTRAL_REQUIRED &&
      (!entry.consumer_neutral || entry.audit_bound)
    ) {
      errors.push(`second consumer readiness artifact ${artifactId} required neutrality flags drifted`);
    }
    if (
      entry.readiness === GOVERNANCE_SECOND_CONSUMER_NEUTRAL_OPTIONAL &&
      (!entry.consumer_neutral || entry.audit_bound)
    ) {
      errors.push(`second consumer readiness artifact ${artifactId} optional neutrality flags drifted`);
    }
    if (
      entry.readiness === GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_SUPPORT &&
      (entry.consumer_neutral || !entry.audit_bound)
    ) {
      errors.push(`second consumer readiness artifact ${artifactId} audit-bound flags drifted`);
    }
    if (entry.audit_bound && entry.allowed_dependency_targets.length !== 0) {
      errors.push(`second consumer readiness artifact ${artifactId} audit-bound dependency set must remain empty`);
    }

    const surfaceEntry = GOVERNANCE_SURFACE_MAP[artifactId];
    if (entry.surface_tier !== surfaceEntry.tier) {
      errors.push(`second consumer readiness artifact ${artifactId} surface tier drifted`);
    }
    if (entry.consumer_neutral && entry.surface_tier !== GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER) {
      errors.push(`second consumer readiness artifact ${artifactId} must remain on external consumer surface`);
    }
    if (entry.audit_bound && entry.surface_tier !== GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER) {
      errors.push(`second consumer readiness artifact ${artifactId} must remain on internal support surface`);
    }

    for (const target of entry.allowed_dependency_targets) {
      if (!GOVERNANCE_SECOND_CONSUMER_ARTIFACT_IDS.includes(target)) {
        errors.push(`second consumer readiness artifact ${artifactId} links to unknown target ${target}`);
        continue;
      }
      if (!GOVERNANCE_SECOND_CONSUMER_READINESS_PROFILE[target]?.consumer_neutral) {
        errors.push(`second consumer readiness artifact ${artifactId} links to non-neutral target ${target}`);
      }
      if (orderedIds.get(target) >= orderedIds.get(artifactId)) {
        errors.push(`second consumer readiness artifact ${artifactId} links to non-preceding target ${target}`);
      }
    }

    if (entry.readiness === GOVERNANCE_SECOND_CONSUMER_NEUTRAL_REQUIRED) {
      for (const target of entry.allowed_dependency_targets) {
        if (!requiredSet.has(target)) {
          errors.push(
            `second consumer required artifact ${artifactId} depends on non-required target ${target}`
          );
        }
      }
    }
  }

  if (
    new Set(GOVERNANCE_SECOND_CONSUMER_STABLE_EXPORT_SET).size !==
    GOVERNANCE_SECOND_CONSUMER_STABLE_EXPORT_SET.length
  ) {
    errors.push("second consumer readiness stable export set contains duplicates");
  }
  for (const exportName of GOVERNANCE_SECOND_CONSUMER_STABLE_EXPORT_SET) {
    if (typeof exportName !== "string" || exportName.length === 0) {
      errors.push("second consumer readiness stable export set contains invalid export names");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidSecondConsumerReadinessProfile() {
  const result = validateSecondConsumerReadinessProfile();
  if (result.ok) return GOVERNANCE_SECOND_CONSUMER_READINESS_PROFILE;

  const err = new Error(`second consumer readiness profile invalid: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}
