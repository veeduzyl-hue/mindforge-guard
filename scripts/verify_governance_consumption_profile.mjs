import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_SURFACE_ARTIFACT_IDS,
  GOVERNANCE_SURFACE_MAP,
  GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
  GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER,
  assertValidGovernanceSurfaceMap,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CONSUMPTION_PROFILE_KIND,
  GOVERNANCE_CONSUMPTION_PROFILE_VERSION,
  GOVERNANCE_CONSUMPTION_PROFILE_STABILITY,
  GOVERNANCE_CONSUMPTION_REQUIRED,
  GOVERNANCE_CONSUMPTION_OPTIONAL,
  GOVERNANCE_CONSUMPTION_SUPPORT_ONLY,
  GOVERNANCE_CONSUMPTION_REQUIREMENT_LEVELS,
  GOVERNANCE_CONSUMPTION_ARTIFACT_ORDER,
  GOVERNANCE_CONSUMPTION_REQUIRED_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_OPTIONAL_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_SUPPORT_ONLY_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_CONSUMER_SAFE_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_ARTIFACT_IDS,
  GOVERNANCE_CONSUMPTION_STABLE_EXPORT_SET,
  GOVERNANCE_CONSUMPTION_PROFILE,
  listGovernanceConsumptionEntries,
  assertValidGovernanceConsumptionProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";

if (GOVERNANCE_CONSUMPTION_PROFILE_KIND !== "governance_consumption_profile") {
  throw new Error("governance consumption profile kind mismatch");
}

if (GOVERNANCE_CONSUMPTION_PROFILE_VERSION !== "v1") {
  throw new Error("governance consumption profile version mismatch");
}

if (GOVERNANCE_CONSUMPTION_PROFILE_STABILITY !== "stable") {
  throw new Error("governance consumption profile stability mismatch");
}
if (
  JSON.stringify(GOVERNANCE_CONSUMPTION_REQUIREMENT_LEVELS) !==
  JSON.stringify(["required", "optional", "support_only"])
) {
  throw new Error("governance consumption requirement levels drifted");
}

assertValidGovernanceSurfaceMap();
assertValidGovernanceConsumptionProfile();

const expectedRequired = [
  "permit_gate_result",
  "governance_decision_record",
  "governance_activation_record",
];
const expectedOptional = [
  "governance_outcome_bundle",
  "governance_application_record",
  "governance_disposition",
  "limited_enforcement_authority_result",
  "governance_case_review_decision_current_selection_summary",
  "governance_case_review_decision_closure_evidence_package_delivery_bundle",
  "governance_case_review_decision_closure_evidence_package_delivery_manifest",
];
const expectedSupportOnly = ["governance_receipt"];
const expectedConsumerSafe = [
  "permit_gate_result",
  "governance_decision_record",
  "governance_activation_record",
  "governance_outcome_bundle",
  "governance_application_record",
  "governance_disposition",
  "limited_enforcement_authority_result",
  "governance_case_review_decision_current_selection_summary",
  "governance_case_review_decision_closure_evidence_package_delivery_bundle",
  "governance_case_review_decision_closure_evidence_package_delivery_manifest",
];

if (JSON.stringify(GOVERNANCE_CONSUMPTION_REQUIRED_ARTIFACTS) !== JSON.stringify(expectedRequired)) {
  throw new Error("governance consumption required artifact profile drifted");
}
if (JSON.stringify(GOVERNANCE_CONSUMPTION_OPTIONAL_ARTIFACTS) !== JSON.stringify(expectedOptional)) {
  throw new Error("governance consumption optional artifact profile drifted");
}
if (JSON.stringify(GOVERNANCE_CONSUMPTION_SUPPORT_ONLY_ARTIFACTS) !== JSON.stringify(expectedSupportOnly)) {
  throw new Error("governance consumption support-only artifact profile drifted");
}
if (JSON.stringify(GOVERNANCE_CONSUMPTION_CONSUMER_SAFE_ARTIFACTS) !== JSON.stringify(expectedConsumerSafe)) {
  throw new Error("governance consumption consumer-safe artifact profile drifted");
}
if (JSON.stringify(GOVERNANCE_CONSUMPTION_ARTIFACT_IDS) !== JSON.stringify(GOVERNANCE_SURFACE_ARTIFACT_IDS)) {
  throw new Error("governance consumption artifact ids drifted from governance surface");
}
if (JSON.stringify(GOVERNANCE_CONSUMPTION_ARTIFACT_ORDER) !== JSON.stringify(GOVERNANCE_SURFACE_ARTIFACT_IDS)) {
  throw new Error("governance consumption artifact order drifted");
}

for (const artifactGroup of [
  GOVERNANCE_CONSUMPTION_REQUIRED_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_OPTIONAL_ARTIFACTS,
  GOVERNANCE_CONSUMPTION_SUPPORT_ONLY_ARTIFACTS,
]) {
  if (new Set(artifactGroup).size !== artifactGroup.length) {
    throw new Error("governance consumption artifact group contains duplicates");
  }
}

const entries = listGovernanceConsumptionEntries();
if (entries.length !== GOVERNANCE_SURFACE_ARTIFACT_IDS.length) {
  throw new Error("governance consumption entry count mismatch");
}

for (const entry of entries) {
  if (!GOVERNANCE_SURFACE_MAP[entry.artifact_id]) {
    throw new Error(`governance consumption entry ${entry.artifact_id} is missing from surface map`);
  }
  if (entry.surface_tier !== GOVERNANCE_SURFACE_MAP[entry.artifact_id].tier) {
    throw new Error(`governance consumption entry ${entry.artifact_id} tier mismatch`);
  }
  if (entry.requirement === GOVERNANCE_CONSUMPTION_REQUIRED && !entry.consumer_safe) {
    throw new Error(`required governance consumption entry ${entry.artifact_id} must remain consumer-safe`);
  }
  if (entry.requirement === GOVERNANCE_CONSUMPTION_OPTIONAL && !entry.consumer_safe) {
    throw new Error(`optional governance consumption entry ${entry.artifact_id} must remain consumer-safe`);
  }
  if (entry.requirement === GOVERNANCE_CONSUMPTION_SUPPORT_ONLY && entry.consumer_safe) {
    throw new Error(`support-only governance consumption entry ${entry.artifact_id} cannot become consumer-safe`);
  }
  if (entry.consumer_safe !== GOVERNANCE_CONSUMPTION_CONSUMER_SAFE_ARTIFACTS.includes(entry.artifact_id)) {
    throw new Error(`governance consumption entry ${entry.artifact_id} consumer-safe flag drifted`);
  }
  if (entry.consumer_safe && entry.surface_tier !== GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER) {
    throw new Error(`consumer-safe governance consumption entry ${entry.artifact_id} must stay external`);
  }
  if (!entry.consumer_safe && entry.surface_tier !== GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER) {
    throw new Error(`non-consumer-safe governance consumption entry ${entry.artifact_id} must stay internal`);
  }
}

if (JSON.stringify(GOVERNANCE_CONSUMPTION_PROFILE.permit_gate_result.consumer_safe_linkage_targets) !== JSON.stringify([])) {
  throw new Error("permit gate result consumption linkage drifted");
}
if (
  JSON.stringify(GOVERNANCE_CONSUMPTION_PROFILE.governance_decision_record.consumer_safe_linkage_targets) !==
  JSON.stringify(["permit_gate_result"])
) {
  throw new Error("governance decision record consumption linkage drifted");
}
if (
  JSON.stringify(GOVERNANCE_CONSUMPTION_PROFILE.governance_activation_record.consumer_safe_linkage_targets) !==
  JSON.stringify(["permit_gate_result", "governance_decision_record"])
) {
  throw new Error("governance activation record consumption linkage drifted");
}
if (
  JSON.stringify(GOVERNANCE_CONSUMPTION_PROFILE.governance_application_record.consumer_safe_linkage_targets) !==
  JSON.stringify(["permit_gate_result", "governance_decision_record", "governance_outcome_bundle"])
) {
  throw new Error("governance application record consumption linkage drifted");
}
if (
  JSON.stringify(GOVERNANCE_CONSUMPTION_PROFILE.governance_disposition.consumer_safe_linkage_targets) !==
  JSON.stringify(["permit_gate_result", "governance_decision_record", "governance_application_record"])
) {
  throw new Error("governance disposition consumption linkage drifted");
}
if (
  JSON.stringify(
    GOVERNANCE_CONSUMPTION_PROFILE.limited_enforcement_authority_result
      .consumer_safe_linkage_targets
  ) !==
  JSON.stringify([
    "permit_gate_result",
    "governance_decision_record",
    "governance_activation_record",
  ])
) {
  throw new Error("limited enforcement authority consumption linkage drifted");
}
if (
  JSON.stringify(GOVERNANCE_CONSUMPTION_PROFILE.governance_outcome_bundle.consumer_safe_linkage_targets) !==
  JSON.stringify(["permit_gate_result", "governance_decision_record"])
) {
  throw new Error("governance outcome bundle consumption linkage drifted");
}
if (
  JSON.stringify(
    GOVERNANCE_CONSUMPTION_PROFILE
      .governance_case_review_decision_current_selection_summary
      .consumer_safe_linkage_targets
  ) !== JSON.stringify([])
) {
  throw new Error(
    "governance case review decision current selection summary consumption linkage drifted"
  );
}
if (
  JSON.stringify(
    GOVERNANCE_CONSUMPTION_PROFILE
      .governance_case_review_decision_closure_evidence_package_delivery_bundle
      .consumer_safe_linkage_targets
  ) !== JSON.stringify([])
) {
  throw new Error(
    "governance case review decision closure evidence package delivery bundle consumption linkage drifted"
  );
}
if (
  JSON.stringify(
    GOVERNANCE_CONSUMPTION_PROFILE
      .governance_case_review_decision_closure_evidence_package_delivery_manifest
      .consumer_safe_linkage_targets
  ) !== JSON.stringify([])
) {
  throw new Error(
    "governance case review decision closure evidence package delivery manifest consumption linkage drifted"
  );
}

for (const exportName of GOVERNANCE_CONSUMPTION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(`governance consumption export ${exportName} is missing from permit index`);
  }
}

if (new Set(GOVERNANCE_CONSUMPTION_STABLE_EXPORT_SET).size !== GOVERNANCE_CONSUMPTION_STABLE_EXPORT_SET.length) {
  throw new Error("governance consumption stable export set contains duplicates");
}

process.stdout.write("governance consumption profile verified\n");
