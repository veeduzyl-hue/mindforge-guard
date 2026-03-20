import {
  PERMIT_GATE_RESULT_KIND,
  PERMIT_GATE_RESULT_VERSION,
  PERMIT_GATE_RESULT_SCHEMA_ID,
  PERMIT_GATE_MODE,
  PERMIT_GATE_CONSUMER_SURFACE,
} from "./permitGate.mjs";
import {
  GOVERNANCE_RECEIPT_KIND,
  GOVERNANCE_RECEIPT_VERSION,
  GOVERNANCE_RECEIPT_SCHEMA_ID,
  GOVERNANCE_RECEIPT_CONSUMER_SURFACE,
  GOVERNANCE_RECEIPT_EMISSION_MODE,
  GOVERNANCE_RECEIPT_RESULT_BOUNDARY,
  GOVERNANCE_RECEIPT_EMITTER_SURFACE,
} from "./governanceReceipt.mjs";
import {
  GOVERNANCE_DECISION_RECORD_KIND,
  GOVERNANCE_DECISION_RECORD_VERSION,
  GOVERNANCE_DECISION_RECORD_SCHEMA_ID,
  GOVERNANCE_DECISION_RECORD_CONSUMER_SURFACE,
  GOVERNANCE_DECISION_RECORD_PRODUCER_SURFACE,
  GOVERNANCE_DECISION_RECORD_SOURCE,
  GOVERNANCE_DECISION_RECORD_MODE,
  GOVERNANCE_DECISION_RECORD_RESULT_BOUNDARY,
  GOVERNANCE_DECISION_RECORD_EMITTER_SURFACE,
} from "./governanceDecisionRecord.mjs";
import {
  GOVERNANCE_OUTCOME_BUNDLE_KIND,
  GOVERNANCE_OUTCOME_BUNDLE_VERSION,
  GOVERNANCE_OUTCOME_BUNDLE_SCHEMA_ID,
  GOVERNANCE_OUTCOME_BUNDLE_MODE,
  GOVERNANCE_OUTCOME_BUNDLE_BOUNDARY,
  GOVERNANCE_OUTCOME_BUNDLE_CONSUMER_SURFACE,
  GOVERNANCE_OUTCOME_BUNDLE_PRODUCER_SURFACE,
  GOVERNANCE_OUTCOME_BUNDLE_EMITTER_SURFACE,
} from "./governanceOutcomeBundle.mjs";
import {
  GOVERNANCE_APPLICATION_RECORD_KIND,
  GOVERNANCE_APPLICATION_RECORD_VERSION,
  GOVERNANCE_APPLICATION_RECORD_SCHEMA_ID,
  GOVERNANCE_APPLICATION_RECORD_CONSUMER_SURFACE,
  GOVERNANCE_APPLICATION_RECORD_PRODUCER_SURFACE,
  GOVERNANCE_APPLICATION_RECORD_MODE,
  GOVERNANCE_APPLICATION_RECORD_SOURCE,
  GOVERNANCE_APPLICATION_RECORD_BOUNDARY,
  GOVERNANCE_APPLICATION_RECORD_EMITTER_SURFACE,
} from "./governanceApplicationRecord.mjs";
import {
  GOVERNANCE_DISPOSITION_KIND,
  GOVERNANCE_DISPOSITION_VERSION,
  GOVERNANCE_DISPOSITION_SCHEMA_ID,
  GOVERNANCE_DISPOSITION_CONSUMER_SURFACE,
  GOVERNANCE_DISPOSITION_PRODUCER_SURFACE,
  GOVERNANCE_DISPOSITION_MODE,
  GOVERNANCE_DISPOSITION_SOURCE,
  GOVERNANCE_DISPOSITION_BOUNDARY,
  GOVERNANCE_DISPOSITION_EMITTER_SURFACE,
} from "./governanceDisposition.mjs";
import {
  GOVERNANCE_ACTIVATION_RECORD_KIND,
  GOVERNANCE_ACTIVATION_RECORD_VERSION,
  GOVERNANCE_ACTIVATION_RECORD_SCHEMA_ID,
  GOVERNANCE_ACTIVATION_RECORD_CONSUMER_SURFACE,
  GOVERNANCE_ACTIVATION_RECORD_PRODUCER_SURFACE,
  GOVERNANCE_ACTIVATION_RECORD_MODE,
  GOVERNANCE_ACTIVATION_RECORD_SOURCE,
  GOVERNANCE_ACTIVATION_RECORD_BOUNDARY,
  GOVERNANCE_ACTIVATION_RECORD_EMITTER_SURFACE,
} from "./governanceActivationRecord.mjs";
import {
  LIMITED_ENFORCEMENT_AUTHORITY_RESULT_KIND,
  LIMITED_ENFORCEMENT_AUTHORITY_RESULT_VERSION,
  LIMITED_ENFORCEMENT_AUTHORITY_RESULT_SCHEMA_ID,
  LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE,
  LIMITED_ENFORCEMENT_AUTHORITY_MODE,
  LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE_BOUNDARY,
  LIMITED_ENFORCEMENT_AUTHORITY_PUBLIC_EXPORT_SET,
} from "./enforcementPilot.mjs";

export const GOVERNANCE_SURFACE_VERSION = "v1";
export const GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER = "external_consumer_surface";
export const GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER = "internal_support_surface";
export const GOVERNANCE_SURFACE_RUNTIME_ONLY_TIER = "runtime_only_support";
export const GOVERNANCE_SURFACE_STABILITY = "stable";
export const GOVERNANCE_SURFACE_TIERS = Object.freeze([
  GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
  GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER,
  GOVERNANCE_SURFACE_RUNTIME_ONLY_TIER,
]);
export const GOVERNANCE_SURFACE_ARTIFACT_ORDER = Object.freeze([
  "permit_gate_result",
  "governance_receipt",
  "governance_decision_record",
  "governance_outcome_bundle",
  "governance_application_record",
  "governance_disposition",
  "governance_activation_record",
  "limited_enforcement_authority_result",
]);

export const GOVERNANCE_EXTERNAL_CONSUMER_ARTIFACTS = Object.freeze([
  "permit_gate_result",
  "governance_decision_record",
  "governance_outcome_bundle",
  "governance_application_record",
  "governance_disposition",
  "governance_activation_record",
  "limited_enforcement_authority_result",
]);

export const GOVERNANCE_INTERNAL_SUPPORT_ARTIFACTS = Object.freeze(["governance_receipt"]);
export const GOVERNANCE_RUNTIME_ONLY_SUPPORT_ARTIFACTS = Object.freeze([]);

function freezeEntry(entry) {
  return Object.freeze({
    ...entry,
    stable_exports: Object.freeze([...entry.stable_exports]),
  });
}

export const GOVERNANCE_SURFACE_MAP = Object.freeze({
  permit_gate_result: freezeEntry({
    artifact_id: "permit_gate_result",
    tier: GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
    stability: GOVERNANCE_SURFACE_STABILITY,
    contract: {
      kind: PERMIT_GATE_RESULT_KIND,
      version: PERMIT_GATE_RESULT_VERSION,
      schema_id: PERMIT_GATE_RESULT_SCHEMA_ID,
    },
    consumer_surface: PERMIT_GATE_CONSUMER_SURFACE,
    mode: PERMIT_GATE_MODE,
    boundary: "gate_result_surface",
    stable_exports: [
      "PERMIT_GATE_RESULT_KIND",
      "PERMIT_GATE_RESULT_VERSION",
      "PERMIT_GATE_RESULT_SCHEMA_ID",
      "PERMIT_GATE_MODE",
      "PERMIT_GATE_CONSUMER_SURFACE",
      "PERMIT_GATE_DENIED_EXIT_CODE",
      "buildPermitGateResult",
      "validatePermitGateResult",
      "assertValidPermitGateResult",
    ],
  }),
  governance_receipt: freezeEntry({
    artifact_id: "governance_receipt",
    tier: GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER,
    stability: GOVERNANCE_SURFACE_STABILITY,
    contract: {
      kind: GOVERNANCE_RECEIPT_KIND,
      version: GOVERNANCE_RECEIPT_VERSION,
      schema_id: GOVERNANCE_RECEIPT_SCHEMA_ID,
    },
    consumer_surface: GOVERNANCE_RECEIPT_CONSUMER_SURFACE,
    producer_surface: GOVERNANCE_RECEIPT_EMITTER_SURFACE,
    mode: GOVERNANCE_RECEIPT_EMISSION_MODE,
    boundary: GOVERNANCE_RECEIPT_RESULT_BOUNDARY,
    stable_exports: [
      "GOVERNANCE_RECEIPT_KIND",
      "GOVERNANCE_RECEIPT_VERSION",
      "GOVERNANCE_RECEIPT_SCHEMA_ID",
      "GOVERNANCE_RECEIPT_EMITTER_SURFACE",
      "GOVERNANCE_RECEIPT_CONSUMER_SURFACE",
      "GOVERNANCE_RECEIPT_EMISSION_MODE",
      "GOVERNANCE_RECEIPT_RESULT_BOUNDARY",
      "buildGovernanceReceipt",
      "validateGovernanceReceipt",
      "assertValidGovernanceReceipt",
    ],
  }),
  governance_decision_record: freezeEntry({
    artifact_id: "governance_decision_record",
    tier: GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
    stability: GOVERNANCE_SURFACE_STABILITY,
    contract: {
      kind: GOVERNANCE_DECISION_RECORD_KIND,
      version: GOVERNANCE_DECISION_RECORD_VERSION,
      schema_id: GOVERNANCE_DECISION_RECORD_SCHEMA_ID,
    },
    consumer_surface: GOVERNANCE_DECISION_RECORD_CONSUMER_SURFACE,
    producer_surface: GOVERNANCE_DECISION_RECORD_PRODUCER_SURFACE,
    mode: GOVERNANCE_DECISION_RECORD_MODE,
    source: GOVERNANCE_DECISION_RECORD_SOURCE,
    boundary: GOVERNANCE_DECISION_RECORD_RESULT_BOUNDARY,
    stable_exports: [
      "GOVERNANCE_DECISION_RECORD_KIND",
      "GOVERNANCE_DECISION_RECORD_VERSION",
      "GOVERNANCE_DECISION_RECORD_SCHEMA_ID",
      "GOVERNANCE_DECISION_RECORD_CONSUMER_SURFACE",
      "GOVERNANCE_DECISION_RECORD_PRODUCER_SURFACE",
      "GOVERNANCE_DECISION_RECORD_SOURCE",
      "GOVERNANCE_DECISION_RECORD_MODE",
      "GOVERNANCE_DECISION_RECORD_RESULT_BOUNDARY",
      "GOVERNANCE_DECISION_RECORD_EMITTER_SURFACE",
      "buildGovernanceDecisionRecord",
      "validateGovernanceDecisionRecord",
      "assertValidGovernanceDecisionRecord",
    ],
  }),
  governance_outcome_bundle: freezeEntry({
    artifact_id: "governance_outcome_bundle",
    tier: GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
    stability: GOVERNANCE_SURFACE_STABILITY,
    contract: {
      kind: GOVERNANCE_OUTCOME_BUNDLE_KIND,
      version: GOVERNANCE_OUTCOME_BUNDLE_VERSION,
      schema_id: GOVERNANCE_OUTCOME_BUNDLE_SCHEMA_ID,
    },
    consumer_surface: GOVERNANCE_OUTCOME_BUNDLE_CONSUMER_SURFACE,
    producer_surface: GOVERNANCE_OUTCOME_BUNDLE_PRODUCER_SURFACE,
    mode: GOVERNANCE_OUTCOME_BUNDLE_MODE,
    boundary: GOVERNANCE_OUTCOME_BUNDLE_BOUNDARY,
    stable_exports: [
      "GOVERNANCE_OUTCOME_BUNDLE_KIND",
      "GOVERNANCE_OUTCOME_BUNDLE_VERSION",
      "GOVERNANCE_OUTCOME_BUNDLE_SCHEMA_ID",
      "GOVERNANCE_OUTCOME_BUNDLE_MODE",
      "GOVERNANCE_OUTCOME_BUNDLE_BOUNDARY",
      "GOVERNANCE_OUTCOME_BUNDLE_CONSUMER_SURFACE",
      "GOVERNANCE_OUTCOME_BUNDLE_PRODUCER_SURFACE",
      "GOVERNANCE_OUTCOME_BUNDLE_EMITTER_SURFACE",
      "buildGovernanceOutcomeBundle",
      "validateGovernanceOutcomeBundle",
      "assertValidGovernanceOutcomeBundle",
    ],
  }),
  governance_application_record: freezeEntry({
    artifact_id: "governance_application_record",
    tier: GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
    stability: GOVERNANCE_SURFACE_STABILITY,
    contract: {
      kind: GOVERNANCE_APPLICATION_RECORD_KIND,
      version: GOVERNANCE_APPLICATION_RECORD_VERSION,
      schema_id: GOVERNANCE_APPLICATION_RECORD_SCHEMA_ID,
    },
    consumer_surface: GOVERNANCE_APPLICATION_RECORD_CONSUMER_SURFACE,
    producer_surface: GOVERNANCE_APPLICATION_RECORD_PRODUCER_SURFACE,
    mode: GOVERNANCE_APPLICATION_RECORD_MODE,
    source: GOVERNANCE_APPLICATION_RECORD_SOURCE,
    boundary: GOVERNANCE_APPLICATION_RECORD_BOUNDARY,
    stable_exports: [
      "GOVERNANCE_APPLICATION_RECORD_KIND",
      "GOVERNANCE_APPLICATION_RECORD_VERSION",
      "GOVERNANCE_APPLICATION_RECORD_SCHEMA_ID",
      "GOVERNANCE_APPLICATION_RECORD_CONSUMER_SURFACE",
      "GOVERNANCE_APPLICATION_RECORD_PRODUCER_SURFACE",
      "GOVERNANCE_APPLICATION_RECORD_MODE",
      "GOVERNANCE_APPLICATION_RECORD_SOURCE",
      "GOVERNANCE_APPLICATION_RECORD_BOUNDARY",
      "GOVERNANCE_APPLICATION_RECORD_EMITTER_SURFACE",
      "buildGovernanceApplicationRecord",
      "validateGovernanceApplicationRecord",
      "assertValidGovernanceApplicationRecord",
    ],
  }),
  governance_disposition: freezeEntry({
    artifact_id: "governance_disposition",
    tier: GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
    stability: GOVERNANCE_SURFACE_STABILITY,
    contract: {
      kind: GOVERNANCE_DISPOSITION_KIND,
      version: GOVERNANCE_DISPOSITION_VERSION,
      schema_id: GOVERNANCE_DISPOSITION_SCHEMA_ID,
    },
    consumer_surface: GOVERNANCE_DISPOSITION_CONSUMER_SURFACE,
    producer_surface: GOVERNANCE_DISPOSITION_PRODUCER_SURFACE,
    mode: GOVERNANCE_DISPOSITION_MODE,
    source: GOVERNANCE_DISPOSITION_SOURCE,
    boundary: GOVERNANCE_DISPOSITION_BOUNDARY,
    stable_exports: [
      "GOVERNANCE_DISPOSITION_KIND",
      "GOVERNANCE_DISPOSITION_VERSION",
      "GOVERNANCE_DISPOSITION_SCHEMA_ID",
      "GOVERNANCE_DISPOSITION_CONSUMER_SURFACE",
      "GOVERNANCE_DISPOSITION_PRODUCER_SURFACE",
      "GOVERNANCE_DISPOSITION_MODE",
      "GOVERNANCE_DISPOSITION_SOURCE",
      "GOVERNANCE_DISPOSITION_BOUNDARY",
      "GOVERNANCE_DISPOSITION_EMITTER_SURFACE",
      "buildGovernanceDisposition",
      "validateGovernanceDisposition",
      "assertValidGovernanceDisposition",
    ],
  }),
  governance_activation_record: freezeEntry({
    artifact_id: "governance_activation_record",
    tier: GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
    stability: GOVERNANCE_SURFACE_STABILITY,
    contract: {
      kind: GOVERNANCE_ACTIVATION_RECORD_KIND,
      version: GOVERNANCE_ACTIVATION_RECORD_VERSION,
      schema_id: GOVERNANCE_ACTIVATION_RECORD_SCHEMA_ID,
    },
    consumer_surface: GOVERNANCE_ACTIVATION_RECORD_CONSUMER_SURFACE,
    producer_surface: GOVERNANCE_ACTIVATION_RECORD_PRODUCER_SURFACE,
    mode: GOVERNANCE_ACTIVATION_RECORD_MODE,
    source: GOVERNANCE_ACTIVATION_RECORD_SOURCE,
    boundary: GOVERNANCE_ACTIVATION_RECORD_BOUNDARY,
    stable_exports: [
      "GOVERNANCE_ACTIVATION_RECORD_KIND",
      "GOVERNANCE_ACTIVATION_RECORD_VERSION",
      "GOVERNANCE_ACTIVATION_RECORD_SCHEMA_ID",
      "GOVERNANCE_ACTIVATION_RECORD_CONSUMER_SURFACE",
      "GOVERNANCE_ACTIVATION_RECORD_PRODUCER_SURFACE",
      "GOVERNANCE_ACTIVATION_RECORD_MODE",
      "GOVERNANCE_ACTIVATION_RECORD_SOURCE",
      "GOVERNANCE_ACTIVATION_RECORD_BOUNDARY",
      "GOVERNANCE_ACTIVATION_RECORD_EMITTER_SURFACE",
      "buildGovernanceActivationRecord",
      "validateGovernanceActivationRecord",
      "assertValidGovernanceActivationRecord",
    ],
  }),
  limited_enforcement_authority_result: freezeEntry({
    artifact_id: "limited_enforcement_authority_result",
    tier: GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER,
    stability: GOVERNANCE_SURFACE_STABILITY,
    contract: {
      kind: LIMITED_ENFORCEMENT_AUTHORITY_RESULT_KIND,
      version: LIMITED_ENFORCEMENT_AUTHORITY_RESULT_VERSION,
      schema_id: LIMITED_ENFORCEMENT_AUTHORITY_RESULT_SCHEMA_ID,
    },
    consumer_surface: LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE,
    mode: LIMITED_ENFORCEMENT_AUTHORITY_MODE,
    boundary: LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE_BOUNDARY,
    stable_exports: LIMITED_ENFORCEMENT_AUTHORITY_PUBLIC_EXPORT_SET,
  }),
});

export const GOVERNANCE_SURFACE_ARTIFACT_IDS = GOVERNANCE_SURFACE_ARTIFACT_ORDER;

export const GOVERNANCE_SURFACE_STABLE_EXPORT_SET = Object.freeze([
  ...new Set(
    GOVERNANCE_SURFACE_ARTIFACT_IDS.flatMap(
      (artifactId) => GOVERNANCE_SURFACE_MAP[artifactId].stable_exports
    )
  ),
]);

export const GOVERNANCE_SURFACE_META_EXPORTS = Object.freeze([
  "GOVERNANCE_SURFACE_VERSION",
  "GOVERNANCE_SURFACE_EXTERNAL_CONSUMER_TIER",
  "GOVERNANCE_SURFACE_INTERNAL_SUPPORT_TIER",
  "GOVERNANCE_SURFACE_RUNTIME_ONLY_TIER",
  "GOVERNANCE_SURFACE_STABILITY",
  "GOVERNANCE_SURFACE_TIERS",
  "GOVERNANCE_SURFACE_ARTIFACT_ORDER",
  "GOVERNANCE_EXTERNAL_CONSUMER_ARTIFACTS",
  "GOVERNANCE_INTERNAL_SUPPORT_ARTIFACTS",
  "GOVERNANCE_RUNTIME_ONLY_SUPPORT_ARTIFACTS",
  "GOVERNANCE_SURFACE_ARTIFACT_IDS",
  "GOVERNANCE_SURFACE_STABLE_EXPORT_SET",
  "GOVERNANCE_SURFACE_META_EXPORTS",
  "GOVERNANCE_SURFACE_MAP",
  "getGovernanceSurfaceEntry",
  "listGovernanceSurfaceEntries",
  "validateGovernanceSurfaceMap",
  "assertValidGovernanceSurfaceMap",
]);

export function getGovernanceSurfaceEntry(artifactId) {
  return GOVERNANCE_SURFACE_MAP[artifactId] || null;
}

export function listGovernanceSurfaceEntries() {
  return GOVERNANCE_SURFACE_ARTIFACT_IDS.map((artifactId) => GOVERNANCE_SURFACE_MAP[artifactId]);
}

export function validateGovernanceSurfaceMap() {
  const errors = [];
  const artifactIds = new Set(GOVERNANCE_SURFACE_ARTIFACT_IDS);
  const seen = new Set();
  const stableExportSet = new Set(GOVERNANCE_SURFACE_STABLE_EXPORT_SET);
  const metaExportSet = new Set(GOVERNANCE_SURFACE_META_EXPORTS);

  for (const tierList of [
    GOVERNANCE_EXTERNAL_CONSUMER_ARTIFACTS,
    GOVERNANCE_INTERNAL_SUPPORT_ARTIFACTS,
    GOVERNANCE_RUNTIME_ONLY_SUPPORT_ARTIFACTS,
  ]) {
    for (const artifactId of tierList) {
      if (!artifactIds.has(artifactId)) {
        errors.push(`unknown governance surface artifact ${artifactId}`);
      }
      if (seen.has(artifactId)) {
        errors.push(`governance surface artifact ${artifactId} appears in multiple tiers`);
      }
      seen.add(artifactId);
    }
  }

  for (const artifactId of GOVERNANCE_SURFACE_ARTIFACT_IDS) {
    const entry = GOVERNANCE_SURFACE_MAP[artifactId];
    if (!entry || entry.artifact_id !== artifactId) {
      errors.push(`governance surface entry mismatch for ${artifactId}`);
      continue;
    }
    if (!GOVERNANCE_SURFACE_TIERS.includes(entry.tier)) {
      errors.push(`governance surface entry ${artifactId} has invalid tier ${entry.tier}`);
    }
    if (entry.stability !== GOVERNANCE_SURFACE_STABILITY) {
      errors.push(`governance surface entry ${artifactId} has invalid stability ${entry.stability}`);
    }
    if (typeof entry.consumer_surface !== "string" || entry.consumer_surface.length === 0) {
      errors.push(`governance surface entry ${artifactId} must declare consumer surface`);
    }
    if (typeof entry.boundary !== "string" || entry.boundary.length === 0) {
      errors.push(`governance surface entry ${artifactId} must declare boundary`);
    }
    if (!entry.contract?.kind || !entry.contract?.version || !entry.contract?.schema_id) {
      errors.push(`governance surface entry ${artifactId} must declare contract identity`);
    }
    if (!Array.isArray(entry.stable_exports) || entry.stable_exports.length === 0) {
      errors.push(`governance surface entry ${artifactId} must declare stable exports`);
      continue;
    }
    if (new Set(entry.stable_exports).size !== entry.stable_exports.length) {
      errors.push(`governance surface entry ${artifactId} contains duplicate stable exports`);
    }
    for (const exportName of entry.stable_exports) {
      if (!stableExportSet.has(exportName)) {
        errors.push(
          `governance surface entry ${artifactId} stable export ${exportName} is missing from stable export set`
        );
      }
      if (metaExportSet.has(exportName)) {
        errors.push(
          `governance surface entry ${artifactId} stable export ${exportName} overlaps with meta exports`
        );
      }
    }
  }

  if (seen.size !== GOVERNANCE_SURFACE_ARTIFACT_IDS.length) {
    errors.push("governance surface tier assignment must cover all declared artifacts exactly once");
  }

  for (const exportName of GOVERNANCE_SURFACE_META_EXPORTS) {
    if (stableExportSet.has(exportName)) {
      errors.push(`governance surface meta export ${exportName} overlaps with stable export set`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidGovernanceSurfaceMap() {
  const result = validateGovernanceSurfaceMap();
  if (result.ok) return GOVERNANCE_SURFACE_MAP;

  const err = new Error(`governance surface map invalid: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}
