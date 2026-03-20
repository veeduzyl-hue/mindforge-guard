import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_SURFACE_MAP,
  GOVERNANCE_SURFACE_ARTIFACT_IDS,
  GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
  GOVERNANCE_CONSUMPTION_PROFILE,
  GOVERNANCE_CONSUMPTION_OPTIONAL,
  GOVERNANCE_CONSUMPTION_CONSUMER_SAFE_ARTIFACTS,
  assertValidGovernanceSurfaceMap,
  assertValidGovernanceConsumptionProfile,
  LIMITED_ENFORCEMENT_AUTHORITY_RESULT_KIND,
  LIMITED_ENFORCEMENT_AUTHORITY_RESULT_VERSION,
  LIMITED_ENFORCEMENT_AUTHORITY_RESULT_SCHEMA_ID,
  LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE,
  LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE_BOUNDARY,
  LIMITED_ENFORCEMENT_AUTHORITY_PUBLIC_EXPORT_SET,
  validateLimitedEnforcementAuthoritySurface,
  buildLimitedEnforcementAuthorityResult,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";

assertValidGovernanceSurfaceMap();
assertValidGovernanceConsumptionProfile();

const surfaceEntry = GOVERNANCE_SURFACE_MAP.limited_enforcement_authority_result;
if (!surfaceEntry) {
  throw new Error("limited enforcement authority result missing from governance surface");
}
if (!GOVERNANCE_SURFACE_ARTIFACT_IDS.includes("limited_enforcement_authority_result")) {
  throw new Error("limited enforcement authority result missing from surface artifact ids");
}
if (surfaceEntry.tier !== GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER) {
  throw new Error("limited enforcement authority result must remain on external consumer surface");
}
if (surfaceEntry.contract.kind !== LIMITED_ENFORCEMENT_AUTHORITY_RESULT_KIND) {
  throw new Error("limited enforcement authority surface kind drifted");
}
if (surfaceEntry.contract.version !== LIMITED_ENFORCEMENT_AUTHORITY_RESULT_VERSION) {
  throw new Error("limited enforcement authority surface version drifted");
}
if (surfaceEntry.contract.schema_id !== LIMITED_ENFORCEMENT_AUTHORITY_RESULT_SCHEMA_ID) {
  throw new Error("limited enforcement authority surface schema id drifted");
}
if (surfaceEntry.consumer_surface !== LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE) {
  throw new Error("limited enforcement authority surface consumer surface drifted");
}
if (surfaceEntry.boundary !== LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE_BOUNDARY) {
  throw new Error("limited enforcement authority surface boundary drifted");
}
if (
  JSON.stringify(surfaceEntry.stable_exports) !==
  JSON.stringify(LIMITED_ENFORCEMENT_AUTHORITY_PUBLIC_EXPORT_SET)
) {
  throw new Error("limited enforcement authority surface export boundary drifted");
}

const consumptionEntry = GOVERNANCE_CONSUMPTION_PROFILE.limited_enforcement_authority_result;
if (!consumptionEntry) {
  throw new Error("limited enforcement authority result missing from governance consumption profile");
}
if (consumptionEntry.requirement !== GOVERNANCE_CONSUMPTION_OPTIONAL) {
  throw new Error("limited enforcement authority consumption requirement drifted");
}
if (consumptionEntry.consumer_safe !== true) {
  throw new Error("limited enforcement authority consumption consumer_safe drifted");
}
if (
  !GOVERNANCE_CONSUMPTION_CONSUMER_SAFE_ARTIFACTS.includes(
    "limited_enforcement_authority_result"
  )
) {
  throw new Error("limited enforcement authority result missing from consumer-safe artifacts");
}
if (
  JSON.stringify(consumptionEntry.consumer_safe_linkage_targets) !==
  JSON.stringify([
    "permit_gate_result",
    "governance_decision_record",
    "governance_activation_record",
  ])
) {
  throw new Error("limited enforcement authority consumption linkage drifted");
}

const sample = buildLimitedEnforcementAuthorityResult({
  audit: { evaluation: { verdict: "allow" } },
  canonicalActionArtifact: { canonical_action_hash: "sha256:test" },
  executionReadinessArtifact: {
    execution_readiness: { readiness: "ready", bridge_verdict: "allow" },
  },
  enforcementAdjacentDecisionArtifact: {
    enforcement_adjacent_decision: { decision: "would_review", reasons: [] },
  },
});

const validation = validateLimitedEnforcementAuthoritySurface(sample);
if (!validation.ok) {
  throw new Error(`limited enforcement authority surface validation failed: ${validation.errors.join("; ")}`);
}

for (const exportName of LIMITED_ENFORCEMENT_AUTHORITY_PUBLIC_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `limited enforcement authority surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance limited authority surface verified\n");
