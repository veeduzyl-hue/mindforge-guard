import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_SURFACE_ARTIFACT_IDS,
  GOVERNANCE_SURFACE_MAP,
  GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
  GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER,
  assertValidGovernanceSurfaceMap,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CONSUMPTION_REQUIRED_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_OPTIONAL_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_SUPPORT_ONLY_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_CONSUMER_SAFE_ARTIFACTS,
  assertValidGovernanceConsumptionProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_SECOND_CONSUMER_READINESS_KIND,
  GOVERNANCE_SECOND_CONSUMER_READINESS_VERSION,
  GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY,
  GOVERNANCE_SECOND_CONSUMER_NEUTRAL_REQUIRED,
  GOVERNANCE_SECOND_CONSUMER_NEUTRAL_OPTIONAL,
  GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_SUPPORT,
  GOVERNANCE_SECOND_CONSUMER_READINESS_LEVELS,
  GOVERNANCE_SECOND_CONSUMER_ARTIFACT_ORDER,
  GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_NEUTRAL_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_ARTIFACT_IDS,
  GOVERNANCE_SECOND_CONSUMER_STABLE_EXPORT_SET,
  GOVERNANCE_SECOND_CONSUMER_READINESS_PROFILE,
  listSecondConsumerReadinessEntries,
  assertValidSecondConsumerReadinessProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";

if (GOVERNANCE_SECOND_CONSUMER_READINESS_KIND !== "governance_second_consumer_readiness_profile") {
  throw new Error("second consumer readiness kind mismatch");
}
if (GOVERNANCE_SECOND_CONSUMER_READINESS_VERSION !== "v1") {
  throw new Error("second consumer readiness version mismatch");
}
if (GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY !== "stable") {
  throw new Error("second consumer readiness stability mismatch");
}
if (
  JSON.stringify(GOVERNANCE_SECOND_CONSUMER_READINESS_LEVELS) !==
  JSON.stringify([
    GOVERNANCE_SECOND_CONSUMER_NEUTRAL_REQUIRED,
    GOVERNANCE_SECOND_CONSUMER_NEUTRAL_OPTIONAL,
    GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_SUPPORT,
  ])
) {
  throw new Error("second consumer readiness levels drifted");
}

assertValidGovernanceSurfaceMap();
assertValidGovernanceConsumptionProfile();
assertValidSecondConsumerReadinessProfile();

if (JSON.stringify(GOVERNANCE_SECOND_CONSUMER_ARTIFACT_IDS) !== JSON.stringify(GOVERNANCE_SURFACE_ARTIFACT_IDS)) {
  throw new Error("second consumer readiness artifact ids drifted from governance surface");
}
if (
  JSON.stringify(GOVERNANCE_SECOND_CONSUMER_ARTIFACT_ORDER) !==
  JSON.stringify(GOVERNANCE_SURFACE_ARTIFACT_IDS)
) {
  throw new Error("second consumer readiness artifact order drifted");
}
if (
  JSON.stringify(GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS) !==
  JSON.stringify(GOVERNANCE_CONSUMPTION_REQUIRED_ARTIFACTS)
) {
  throw new Error("second consumer readiness required profile drifted");
}
if (
  JSON.stringify(GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS) !==
  JSON.stringify(GOVERNANCE_CONSUMPTION_OPTIONAL_ARTIFACTS)
) {
  throw new Error("second consumer readiness optional profile drifted");
}
if (
  JSON.stringify(GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_ARTIFACTS) !==
  JSON.stringify(GOVERNANCE_CONSUMPTION_SUPPORT_ONLY_ARTIFACTS)
) {
  throw new Error("second consumer readiness audit-bound profile drifted");
}
if (
  JSON.stringify(GOVERNANCE_SECOND_CONSUMER_NEUTRAL_ARTIFACTS) !==
  JSON.stringify(GOVERNANCE_CONSUMPTION_CONSUMER_SAFE_ARTIFACTS)
) {
  throw new Error("second consumer readiness neutral profile drifted");
}

const entries = listSecondConsumerReadinessEntries();
if (entries.length !== GOVERNANCE_SURFACE_ARTIFACT_IDS.length) {
  throw new Error("second consumer readiness entry count mismatch");
}

for (const entry of entries) {
  if (!GOVERNANCE_SURFACE_MAP[entry.artifact_id]) {
    throw new Error(`second consumer readiness entry ${entry.artifact_id} is missing from surface map`);
  }
  if (entry.surface_tier !== GOVERNANCE_SURFACE_MAP[entry.artifact_id].tier) {
    throw new Error(`second consumer readiness entry ${entry.artifact_id} tier mismatch`);
  }
  if (entry.consumer_neutral && entry.audit_bound) {
    throw new Error(`second consumer readiness entry ${entry.artifact_id} cannot be both neutral and audit-bound`);
  }
  if (entry.readiness === GOVERNANCE_SECOND_CONSUMER_NEUTRAL_REQUIRED && !entry.minimal_for_second_consumer) {
    throw new Error(`second consumer readiness required entry ${entry.artifact_id} must remain minimal`);
  }
  if (entry.readiness !== GOVERNANCE_SECOND_CONSUMER_NEUTRAL_REQUIRED && entry.minimal_for_second_consumer) {
    throw new Error(`second consumer readiness non-required entry ${entry.artifact_id} cannot become minimal`);
  }
  if (entry.consumer_neutral && entry.surface_tier !== GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER) {
    throw new Error(`second consumer readiness entry ${entry.artifact_id} must stay external`);
  }
  if (entry.audit_bound && entry.surface_tier !== GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER) {
    throw new Error(`second consumer readiness entry ${entry.artifact_id} must stay internal`);
  }
}

if (
  JSON.stringify(GOVERNANCE_SECOND_CONSUMER_READINESS_PROFILE.permit_gate_result.allowed_dependency_targets) !==
  JSON.stringify([])
) {
  throw new Error("second consumer permit gate dependency profile drifted");
}
if (
  JSON.stringify(GOVERNANCE_SECOND_CONSUMER_READINESS_PROFILE.governance_decision_record.allowed_dependency_targets) !==
  JSON.stringify(["permit_gate_result"])
) {
  throw new Error("second consumer decision record dependency profile drifted");
}
if (
  JSON.stringify(GOVERNANCE_SECOND_CONSUMER_READINESS_PROFILE.governance_activation_record.allowed_dependency_targets) !==
  JSON.stringify(["permit_gate_result", "governance_decision_record"])
) {
  throw new Error("second consumer activation dependency profile drifted");
}
if (
  JSON.stringify(GOVERNANCE_SECOND_CONSUMER_READINESS_PROFILE.governance_receipt.allowed_dependency_targets) !==
  JSON.stringify([])
) {
  throw new Error("second consumer audit-bound receipt dependency profile drifted");
}

for (const exportName of GOVERNANCE_SECOND_CONSUMER_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(`second consumer readiness export ${exportName} is missing from permit index`);
  }
}

if (
  new Set(GOVERNANCE_SECOND_CONSUMER_STABLE_EXPORT_SET).size !==
  GOVERNANCE_SECOND_CONSUMER_STABLE_EXPORT_SET.length
) {
  throw new Error("second consumer readiness stable export set contains duplicates");
}

process.stdout.write("second consumer readiness verified\n");
