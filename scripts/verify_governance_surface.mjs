import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_SURFACE_VERSION,
  GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
  GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER,
  GOVERNANCE_SURFACE_RUNTIME_ONLY_TIER,
  GOVERNANCE_SURFACE_TIERS,
  GOVERNANCE_SURFACE_ARTIFACT_ORDER,
  GOVERNANCE_EXTERNAL_CONSUMER_ARTIFACTS,
  GOVERNANCE_INTERNAL_SUPPORT_ARTIFACTS,
  GOVERNANCE_RUNTIME_ONLY_SUPPORT_ARTIFACTS,
  GOVERNANCE_SURFACE_ARTIFACT_IDS,
  GOVERNANCE_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_SURFACE_META_EXPORTS,
  GOVERNANCE_SURFACE_MAP,
  listGovernanceSurfaceEntries,
  assertValidGovernanceSurfaceMap,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";

if (GOVERNANCE_SURFACE_VERSION !== "v1") {
  throw new Error("governance surface version mismatch");
}

assertValidGovernanceSurfaceMap();

const expectedArtifactIds = [
  "permit_gate_result",
  "governance_receipt",
  "governance_decision_record",
  "governance_outcome_bundle",
  "governance_application_record",
  "governance_disposition",
  "governance_activation_record",
];

if (JSON.stringify(GOVERNANCE_SURFACE_ARTIFACT_ORDER) !== JSON.stringify(expectedArtifactIds)) {
  throw new Error("governance surface artifact order drifted");
}

if (JSON.stringify(GOVERNANCE_SURFACE_ARTIFACT_IDS) !== JSON.stringify(expectedArtifactIds)) {
  throw new Error("governance surface artifact ids drifted");
}

if (
  JSON.stringify(GOVERNANCE_SURFACE_TIERS) !==
  JSON.stringify([
    "external_consumer_surface",
    "internal_support_surface",
    "runtime_only_support",
  ])
) {
  throw new Error("governance surface tier list drifted");
}

if (
  JSON.stringify(GOVERNANCE_EXTERNAL_CONSUMER_ARTIFACTS) !==
  JSON.stringify([
    "permit_gate_result",
    "governance_decision_record",
    "governance_outcome_bundle",
    "governance_application_record",
    "governance_disposition",
    "governance_activation_record",
  ])
) {
  throw new Error("governance external consumer surface drifted");
}

if (JSON.stringify(GOVERNANCE_INTERNAL_SUPPORT_ARTIFACTS) !== JSON.stringify(["governance_receipt"])) {
  throw new Error("governance internal support surface drifted");
}

if (JSON.stringify(GOVERNANCE_RUNTIME_ONLY_SUPPORT_ARTIFACTS) !== JSON.stringify([])) {
  throw new Error("governance runtime-only support surface drifted");
}

const entries = listGovernanceSurfaceEntries();
if (entries.length !== expectedArtifactIds.length) {
  throw new Error("governance surface entry count mismatch");
}

for (const entry of entries) {
  if (entry.stability !== "stable") {
    throw new Error(`governance surface entry ${entry.artifact_id} must remain stable`);
  }
  if (!Array.isArray(entry.stable_exports) || entry.stable_exports.length === 0) {
    throw new Error(`governance surface entry ${entry.artifact_id} is missing stable exports`);
  }
  if (!entry.contract?.kind || !entry.contract?.version || !entry.contract?.schema_id) {
    throw new Error(`governance surface entry ${entry.artifact_id} contract identity is incomplete`);
  }
  if (typeof entry.consumer_surface !== "string" || entry.consumer_surface.length === 0) {
    throw new Error(`governance surface entry ${entry.artifact_id} consumer surface is missing`);
  }
  if (typeof entry.boundary !== "string" || entry.boundary.length === 0) {
    throw new Error(`governance surface entry ${entry.artifact_id} boundary is missing`);
  }
}

if (
  GOVERNANCE_SURFACE_MAP.permit_gate_result.tier !== GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER
) {
  throw new Error("permit gate result tier mismatch");
}
if (
  GOVERNANCE_SURFACE_MAP.governance_receipt.tier !== GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER
) {
  throw new Error("governance receipt tier mismatch");
}
for (const artifactId of [
  "governance_decision_record",
  "governance_outcome_bundle",
  "governance_application_record",
  "governance_disposition",
  "governance_activation_record",
]) {
  if (GOVERNANCE_SURFACE_MAP[artifactId].tier !== GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER) {
    throw new Error(`${artifactId} tier mismatch`);
  }
}

if (
  GOVERNANCE_SURFACE_META_EXPORTS.includes("PERMIT_GATE_RESULT_KIND") ||
  GOVERNANCE_SURFACE_STABLE_EXPORT_SET.includes("GOVERNANCE_SURFACE_MAP")
) {
  throw new Error("governance surface export partition drifted");
}

if (new Set(GOVERNANCE_SURFACE_STABLE_EXPORT_SET).size !== GOVERNANCE_SURFACE_STABLE_EXPORT_SET.length) {
  throw new Error("governance stable export set contains duplicates");
}
if (new Set(GOVERNANCE_SURFACE_META_EXPORTS).size !== GOVERNANCE_SURFACE_META_EXPORTS.length) {
  throw new Error("governance surface meta export set contains duplicates");
}

for (const exportName of [...GOVERNANCE_SURFACE_STABLE_EXPORT_SET, ...GOVERNANCE_SURFACE_META_EXPORTS]) {
  if (!(exportName in permitExports)) {
    throw new Error(`governance surface export ${exportName} is missing from permit index`);
  }
}

for (const artifactId of GOVERNANCE_SURFACE_ARTIFACT_IDS) {
  const entry = GOVERNANCE_SURFACE_MAP[artifactId];
  for (const exportName of entry.stable_exports) {
    if (!GOVERNANCE_SURFACE_STABLE_EXPORT_SET.includes(exportName)) {
      throw new Error(`governance surface stable export set is missing ${exportName}`);
    }
  }
}

if (GOVERNANCE_SURFACE_RUNTIME_ONLY_TIER !== "runtime_only_support") {
  throw new Error("governance runtime-only tier label mismatch");
}

process.stdout.write("governance surface verified\n");
