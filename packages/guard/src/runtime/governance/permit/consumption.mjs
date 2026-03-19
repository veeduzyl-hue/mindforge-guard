import {
  GOVERNANCE_SURFACE_VERSION,
  GOVERNANCE_SURFACE_STABILITY,
  GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
  GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER,
  GOVERNANCE_SURFACE_ARTIFACT_IDS,
  GOVERNANCE_SURFACE_ARTIFACT_ORDER,
  GOVERNANCE_SURFACE_MAP,
  assertValidGovernanceSurfaceMap,
} from "./surface.mjs";

export const GOVERNANCE_CONSUMPTION_PROFILE_KIND = "governance_consumption_profile";
export const GOVERNANCE_CONSUMPTION_PROFILE_VERSION = "v1";
export const GOVERNANCE_CONSUMPTION_PROFILE_STABILITY = GOVERNANCE_SURFACE_STABILITY;
export const GOVERNANCE_CONSUMPTION_REQUIRED = "required";
export const GOVERNANCE_CONSUMPTION_OPTIONAL = "optional";
export const GOVERNANCE_CONSUMPTION_SUPPORT_ONLY = "support_only";

export const GOVERNANCE_CONSUMPTION_REQUIRED_ARTIFACTS = Object.freeze([
  "permit_gate_result",
  "governance_decision_record",
  "governance_activation_record",
]);

export const GOVERNANCE_CONSUMPTION_OPTIONAL_ARTIFACTS = Object.freeze([
  "governance_outcome_bundle",
  "governance_application_record",
  "governance_disposition",
]);

export const GOVERNANCE_CONSUMPTION_SUPPORT_ONLY_ARTIFACTS = Object.freeze([
  "governance_receipt",
]);

function freezeEntry(entry) {
  return Object.freeze({
    ...entry,
    consumer_safe_linkage_targets: Object.freeze([...entry.consumer_safe_linkage_targets]),
  });
}

export const GOVERNANCE_CONSUMPTION_PROFILE = Object.freeze({
  permit_gate_result: freezeEntry({
    artifact_id: "permit_gate_result",
    requirement: GOVERNANCE_CONSUMPTION_REQUIRED,
    consumer_safe: true,
    surface_tier: GOVERNANCE_SURFACE_MAP.permit_gate_result.tier,
    stability: GOVERNANCE_CONSUMPTION_PROFILE_STABILITY,
    consumer_safe_linkage_targets: [],
  }),
  governance_receipt: freezeEntry({
    artifact_id: "governance_receipt",
    requirement: GOVERNANCE_CONSUMPTION_SUPPORT_ONLY,
    consumer_safe: false,
    surface_tier: GOVERNANCE_SURFACE_MAP.governance_receipt.tier,
    stability: GOVERNANCE_CONSUMPTION_PROFILE_STABILITY,
    consumer_safe_linkage_targets: [],
  }),
  governance_decision_record: freezeEntry({
    artifact_id: "governance_decision_record",
    requirement: GOVERNANCE_CONSUMPTION_REQUIRED,
    consumer_safe: true,
    surface_tier: GOVERNANCE_SURFACE_MAP.governance_decision_record.tier,
    stability: GOVERNANCE_CONSUMPTION_PROFILE_STABILITY,
    consumer_safe_linkage_targets: ["permit_gate_result"],
  }),
  governance_outcome_bundle: freezeEntry({
    artifact_id: "governance_outcome_bundle",
    requirement: GOVERNANCE_CONSUMPTION_OPTIONAL,
    consumer_safe: true,
    surface_tier: GOVERNANCE_SURFACE_MAP.governance_outcome_bundle.tier,
    stability: GOVERNANCE_CONSUMPTION_PROFILE_STABILITY,
    consumer_safe_linkage_targets: ["permit_gate_result", "governance_decision_record"],
  }),
  governance_application_record: freezeEntry({
    artifact_id: "governance_application_record",
    requirement: GOVERNANCE_CONSUMPTION_OPTIONAL,
    consumer_safe: true,
    surface_tier: GOVERNANCE_SURFACE_MAP.governance_application_record.tier,
    stability: GOVERNANCE_CONSUMPTION_PROFILE_STABILITY,
    consumer_safe_linkage_targets: [
      "permit_gate_result",
      "governance_decision_record",
      "governance_outcome_bundle",
    ],
  }),
  governance_disposition: freezeEntry({
    artifact_id: "governance_disposition",
    requirement: GOVERNANCE_CONSUMPTION_OPTIONAL,
    consumer_safe: true,
    surface_tier: GOVERNANCE_SURFACE_MAP.governance_disposition.tier,
    stability: GOVERNANCE_CONSUMPTION_PROFILE_STABILITY,
    consumer_safe_linkage_targets: [
      "permit_gate_result",
      "governance_decision_record",
      "governance_application_record",
    ],
  }),
  governance_activation_record: freezeEntry({
    artifact_id: "governance_activation_record",
    requirement: GOVERNANCE_CONSUMPTION_REQUIRED,
    consumer_safe: true,
    surface_tier: GOVERNANCE_SURFACE_MAP.governance_activation_record.tier,
    stability: GOVERNANCE_CONSUMPTION_PROFILE_STABILITY,
    consumer_safe_linkage_targets: ["permit_gate_result", "governance_decision_record"],
  }),
});

export const GOVERNANCE_CONSUMPTION_ARTIFACT_IDS = GOVERNANCE_SURFACE_ARTIFACT_IDS;

export const GOVERNANCE_CONSUMPTION_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_CONSUMPTION_PROFILE_KIND",
  "GOVERNANCE_CONSUMPTION_PROFILE_VERSION",
  "GOVERNANCE_CONSUMPTION_PROFILE_STABILITY",
  "GOVERNANCE_CONSUMPTION_REQUIRED",
  "GOVERNANCE_CONSUMPTION_OPTIONAL",
  "GOVERNANCE_CONSUMPTION_SUPPORT_ONLY",
  "GOVERNANCE_CONSUMPTION_REQUIRED_ARTIFACTS",
  "GOVERNANCE_CONSUMPTION_OPTIONAL_ARTIFACTS",
  "GOVERNANCE_CONSUMPTION_SUPPORT_ONLY_ARTIFACTS",
  "GOVERNANCE_CONSUMPTION_ARTIFACT_IDS",
  "GOVERNANCE_CONSUMPTION_STABLE_EXPORT_SET",
  "GOVERNANCE_CONSUMPTION_PROFILE",
  "getGovernanceConsumptionEntry",
  "listGovernanceConsumptionEntries",
  "validateGovernanceConsumptionProfile",
  "assertValidGovernanceConsumptionProfile",
]);

export function getGovernanceConsumptionEntry(artifactId) {
  return GOVERNANCE_CONSUMPTION_PROFILE[artifactId] || null;
}

export function listGovernanceConsumptionEntries() {
  return GOVERNANCE_CONSUMPTION_ARTIFACT_IDS.map(
    (artifactId) => GOVERNANCE_CONSUMPTION_PROFILE[artifactId]
  );
}

export function validateGovernanceConsumptionProfile() {
  const errors = [];
  const requiredSet = new Set(GOVERNANCE_CONSUMPTION_REQUIRED_ARTIFACTS);
  const optionalSet = new Set(GOVERNANCE_CONSUMPTION_OPTIONAL_ARTIFACTS);
  const supportOnlySet = new Set(GOVERNANCE_CONSUMPTION_SUPPORT_ONLY_ARTIFACTS);
  const orderedIds = new Map(GOVERNANCE_SURFACE_ARTIFACT_ORDER.map((artifactId, index) => [artifactId, index]));

  assertValidGovernanceSurfaceMap();

  if (GOVERNANCE_SURFACE_VERSION !== "v1") {
    errors.push(`governance consumption profile requires governance surface v1`);
  }

  for (const artifactId of GOVERNANCE_CONSUMPTION_ARTIFACT_IDS) {
    const entry = GOVERNANCE_CONSUMPTION_PROFILE[artifactId];
    if (!entry || entry.artifact_id !== artifactId) {
      errors.push(`governance consumption entry mismatch for ${artifactId}`);
      continue;
    }
    if (entry.stability !== GOVERNANCE_CONSUMPTION_PROFILE_STABILITY) {
      errors.push(`governance consumption entry ${artifactId} has invalid stability`);
    }
    if (![
      GOVERNANCE_CONSUMPTION_REQUIRED,
      GOVERNANCE_CONSUMPTION_OPTIONAL,
      GOVERNANCE_CONSUMPTION_SUPPORT_ONLY,
    ].includes(entry.requirement)) {
      errors.push(`governance consumption entry ${artifactId} has invalid requirement`);
    }
    if (!Array.isArray(entry.consumer_safe_linkage_targets)) {
      errors.push(`governance consumption entry ${artifactId} must declare linkage targets`);
      continue;
    }
    if (new Set(entry.consumer_safe_linkage_targets).size !== entry.consumer_safe_linkage_targets.length) {
      errors.push(`governance consumption entry ${artifactId} contains duplicate linkage targets`);
    }

    const inRequired = requiredSet.has(artifactId);
    const inOptional = optionalSet.has(artifactId);
    const inSupportOnly = supportOnlySet.has(artifactId);
    if ([inRequired, inOptional, inSupportOnly].filter(Boolean).length !== 1) {
      errors.push(`governance consumption artifact ${artifactId} must appear in exactly one profile set`);
    }
    if (inRequired && entry.requirement !== GOVERNANCE_CONSUMPTION_REQUIRED) {
      errors.push(`governance consumption artifact ${artifactId} required profile drifted`);
    }
    if (inOptional && entry.requirement !== GOVERNANCE_CONSUMPTION_OPTIONAL) {
      errors.push(`governance consumption artifact ${artifactId} optional profile drifted`);
    }
    if (inSupportOnly && entry.requirement !== GOVERNANCE_CONSUMPTION_SUPPORT_ONLY) {
      errors.push(`governance consumption artifact ${artifactId} support-only profile drifted`);
    }

    const surfaceEntry = GOVERNANCE_SURFACE_MAP[artifactId];
    if (entry.surface_tier !== surfaceEntry.tier) {
      errors.push(`governance consumption artifact ${artifactId} surface tier drifted`);
    }
    if (entry.consumer_safe && entry.surface_tier !== GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER) {
      errors.push(`governance consumption artifact ${artifactId} must remain on external consumer surface`);
    }
    if (!entry.consumer_safe && entry.surface_tier !== GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER) {
      errors.push(`governance consumption artifact ${artifactId} must remain on internal support surface`);
    }

    for (const target of entry.consumer_safe_linkage_targets) {
      if (!GOVERNANCE_CONSUMPTION_ARTIFACT_IDS.includes(target)) {
        errors.push(`governance consumption artifact ${artifactId} links to unknown target ${target}`);
        continue;
      }
      if (!GOVERNANCE_CONSUMPTION_PROFILE[target]?.consumer_safe) {
        errors.push(`governance consumption artifact ${artifactId} links to non-consumer-safe target ${target}`);
      }
      if (orderedIds.get(target) >= orderedIds.get(artifactId)) {
        errors.push(`governance consumption artifact ${artifactId} links to non-preceding target ${target}`);
      }
    }

    if (entry.requirement === GOVERNANCE_CONSUMPTION_REQUIRED) {
      for (const target of entry.consumer_safe_linkage_targets) {
        if (!requiredSet.has(target)) {
          errors.push(`governance consumption required artifact ${artifactId} depends on non-required target ${target}`);
        }
      }
    }
  }

  if (new Set(GOVERNANCE_CONSUMPTION_STABLE_EXPORT_SET).size !== GOVERNANCE_CONSUMPTION_STABLE_EXPORT_SET.length) {
    errors.push("governance consumption stable export set contains duplicates");
  }

  const covered = new Set([
    ...GOVERNANCE_CONSUMPTION_REQUIRED_ARTIFACTS,
    ...GOVERNANCE_CONSUMPTION_OPTIONAL_ARTIFACTS,
    ...GOVERNANCE_CONSUMPTION_SUPPORT_ONLY_ARTIFACTS,
  ]);
  if (covered.size !== GOVERNANCE_CONSUMPTION_ARTIFACT_IDS.length) {
    errors.push("governance consumption profile must cover all governance artifacts exactly once");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidGovernanceConsumptionProfile() {
  const result = validateGovernanceConsumptionProfile();
  if (result.ok) return GOVERNANCE_CONSUMPTION_PROFILE;

  const err = new Error(`governance consumption profile invalid: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}
