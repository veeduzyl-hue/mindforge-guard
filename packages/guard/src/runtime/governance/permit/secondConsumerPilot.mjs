import fs from "node:fs";

import {
  assertValidPermitGateResult,
} from "./permitGate.mjs";
import {
  assertValidGovernanceDecisionRecord,
} from "./governanceDecisionRecord.mjs";
import {
  assertValidGovernanceOutcomeBundle,
} from "./governanceOutcomeBundle.mjs";
import {
  assertValidGovernanceApplicationRecord,
} from "./governanceApplicationRecord.mjs";
import {
  assertValidGovernanceDisposition,
} from "./governanceDisposition.mjs";
import {
  assertValidGovernanceActivationRecord,
} from "./governanceActivationRecord.mjs";
import {
  GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_NEUTRAL_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_MINIMAL_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_READINESS_VERSION,
  assertValidSecondConsumerReadinessProfile,
} from "./readiness.mjs";
import {
  SECOND_CONSUMER_CONTRACT_ID,
  SECOND_CONSUMER_CONTRACT_SURFACE,
  SECOND_CONSUMER_CONTRACT_MODE,
  SECOND_CONSUMER_CONTRACT_REQUIRED_INPUTS,
  SECOND_CONSUMER_CONTRACT_OPTIONAL_INPUTS,
  SECOND_CONSUMER_CONTRACT_EXCLUDED_INPUTS,
  assertValidSecondConsumerContract,
  assertValidSecondConsumerSummary,
  serializeSecondConsumerSummary,
  computeSecondConsumerSummaryHash,
} from "./secondConsumerContract.mjs";

export const SECOND_CONSUMER_PILOT_ID = SECOND_CONSUMER_CONTRACT_ID;
export const SECOND_CONSUMER_PILOT_SURFACE = SECOND_CONSUMER_CONTRACT_SURFACE;
export const SECOND_CONSUMER_PILOT_MODE = SECOND_CONSUMER_CONTRACT_MODE;
export const SECOND_CONSUMER_PILOT_REQUIRED_INPUTS = SECOND_CONSUMER_CONTRACT_REQUIRED_INPUTS;
export const SECOND_CONSUMER_PILOT_OPTIONAL_INPUTS = SECOND_CONSUMER_CONTRACT_OPTIONAL_INPUTS;
export const SECOND_CONSUMER_PILOT_AUDIT_BOUND_EXCLUSIONS =
  SECOND_CONSUMER_CONTRACT_EXCLUDED_INPUTS;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureFilePath(label, filePath) {
  if (typeof filePath !== "string" || filePath.length === 0) {
    throw new Error(`${label} input requires a file path`);
  }
}

function assertMatchingCanonicalActionHash(referenceHash, artifact, label) {
  if (artifact.canonical_action_hash !== referenceHash) {
    throw new Error(`${label} must match canonical_action_hash ${referenceHash}`);
  }
}

function assertMatchingGateOutcome(gateResult, artifact, label, outcome, sourceDecision, exitCode) {
  if (outcome !== gateResult.permit_gate.decision) {
    throw new Error(`${label} must match permit gate decision`);
  }
  if (sourceDecision !== gateResult.permit_gate.source_decision) {
    throw new Error(`${label} must match permit gate source decision`);
  }
  if (exitCode !== gateResult.permit_gate.exit_code) {
    throw new Error(`${label} must match permit gate exit code`);
  }
}

export function loadSecondConsumerPilotInputs({
  permitGateResultPath,
  governanceDecisionRecordPath,
  governanceActivationRecordPath,
  governanceOutcomeBundlePath = null,
  governanceApplicationRecordPath = null,
  governanceDispositionPath = null,
  governanceReceiptPath = null,
}) {
  assertValidSecondConsumerReadinessProfile();
  assertValidSecondConsumerContract();

  if (governanceReceiptPath) {
    throw new Error(
      "governance_receipt is audit-bound and cannot be consumed by the second consumer pilot"
    );
  }

  ensureFilePath("permit_gate_result", permitGateResultPath);
  ensureFilePath("governance_decision_record", governanceDecisionRecordPath);
  ensureFilePath("governance_activation_record", governanceActivationRecordPath);

  const permitGateResult = assertValidPermitGateResult(readJson(permitGateResultPath));
  const governanceDecisionRecord = assertValidGovernanceDecisionRecord(
    readJson(governanceDecisionRecordPath)
  );
  const governanceActivationRecord = assertValidGovernanceActivationRecord(
    readJson(governanceActivationRecordPath)
  );
  const governanceOutcomeBundle = governanceOutcomeBundlePath
    ? assertValidGovernanceOutcomeBundle(readJson(governanceOutcomeBundlePath))
    : null;
  const governanceApplicationRecord = governanceApplicationRecordPath
    ? assertValidGovernanceApplicationRecord(readJson(governanceApplicationRecordPath))
    : null;
  const governanceDisposition = governanceDispositionPath
    ? assertValidGovernanceDisposition(readJson(governanceDispositionPath))
    : null;

  const canonicalActionHash = permitGateResult.canonical_action_hash;
  for (const [label, artifact] of [
    ["governance_decision_record", governanceDecisionRecord],
    ["governance_activation_record", governanceActivationRecord],
    ["governance_outcome_bundle", governanceOutcomeBundle],
    ["governance_application_record", governanceApplicationRecord],
    ["governance_disposition", governanceDisposition],
  ]) {
    if (artifact) {
      assertMatchingCanonicalActionHash(canonicalActionHash, artifact, label);
    }
  }

  assertMatchingGateOutcome(
    permitGateResult,
    governanceDecisionRecord,
    "governance_decision_record",
    governanceDecisionRecord.governance_decision.outcome,
    governanceDecisionRecord.permit_gate_result.source_decision,
    governanceDecisionRecord.governance_decision.exit_code
  );
  assertMatchingGateOutcome(
    permitGateResult,
    governanceActivationRecord,
    "governance_activation_record",
    governanceActivationRecord.governance_activation.outcome,
    governanceActivationRecord.permit_gate_result.source_decision,
    governanceActivationRecord.governance_activation.exit_code
  );

  if (governanceOutcomeBundle) {
    assertMatchingGateOutcome(
      permitGateResult,
      governanceOutcomeBundle,
      "governance_outcome_bundle",
      governanceOutcomeBundle.permit_gate_result.decision,
      governanceOutcomeBundle.permit_gate_result.source_decision,
      governanceOutcomeBundle.bundle.exit_code
    );
  }
  if (governanceApplicationRecord) {
    assertMatchingGateOutcome(
      permitGateResult,
      governanceApplicationRecord,
      "governance_application_record",
      governanceApplicationRecord.governance_application.applied_outcome,
      governanceApplicationRecord.governance_application.applied_source,
      governanceApplicationRecord.governance_application.exit_code
    );
  }
  if (governanceDisposition) {
    assertMatchingGateOutcome(
      permitGateResult,
      governanceDisposition,
      "governance_disposition",
      governanceDisposition.governance_disposition.applied_outcome,
      permitGateResult.permit_gate.source_decision,
      governanceDisposition.governance_disposition.exit_code
    );
  }

  const providedOptionalArtifacts = [];
  if (governanceOutcomeBundle) providedOptionalArtifacts.push("governance_outcome_bundle");
  if (governanceApplicationRecord) providedOptionalArtifacts.push("governance_application_record");
  if (governanceDisposition) providedOptionalArtifacts.push("governance_disposition");

  const enabledGovernancePaths = Array.isArray(
    governanceActivationRecord.governance_activation.enabled_governance_paths
  )
    ? governanceActivationRecord.governance_activation.enabled_governance_paths
    : [];

  for (const optionalArtifact of providedOptionalArtifacts) {
    const activationPath = optionalArtifact;
    if (!enabledGovernancePaths.includes(activationPath)) {
      throw new Error(`${optionalArtifact} must appear in governance activation enabled paths`);
    }
  }

  return {
    permitGateResult,
    governanceDecisionRecord,
    governanceActivationRecord,
    governanceOutcomeBundle,
    governanceApplicationRecord,
    governanceDisposition,
  };
}

export function buildSecondConsumerPilotSummary(inputs) {
  assertValidSecondConsumerReadinessProfile();
  assertValidSecondConsumerContract();

  const {
    permitGateResult,
    governanceDecisionRecord,
    governanceActivationRecord,
    governanceOutcomeBundle = null,
    governanceApplicationRecord = null,
    governanceDisposition = null,
  } = inputs;

  const providedOptionalArtifacts = [];
  if (governanceOutcomeBundle) providedOptionalArtifacts.push("governance_outcome_bundle");
  if (governanceApplicationRecord) providedOptionalArtifacts.push("governance_application_record");
  if (governanceDisposition) providedOptionalArtifacts.push("governance_disposition");

  const enabledPaths = Array.isArray(
    governanceActivationRecord.governance_activation.enabled_governance_paths
  )
    ? [...governanceActivationRecord.governance_activation.enabled_governance_paths]
    : [];
  const auditBoundPathsPresent = enabledPaths.filter((path) =>
    SECOND_CONSUMER_PILOT_AUDIT_BOUND_EXCLUSIONS.includes(path)
  );

  const summary = {
    consumer: {
      consumer_id: SECOND_CONSUMER_PILOT_ID,
      surface: SECOND_CONSUMER_PILOT_SURFACE,
      mode: SECOND_CONSUMER_PILOT_MODE,
      non_audit: true,
    },
    governance: {
      canonical_action_hash: permitGateResult.canonical_action_hash,
      decision: permitGateResult.permit_gate.decision,
      source_decision: permitGateResult.permit_gate.source_decision,
      exit_code: permitGateResult.permit_gate.exit_code,
    },
    readiness: {
      profile_version: GOVERNANCE_SECOND_CONSUMER_READINESS_VERSION,
      required_artifacts: [...GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS],
      optional_artifacts_present: providedOptionalArtifacts,
      neutral_artifacts: [...GOVERNANCE_SECOND_CONSUMER_NEUTRAL_ARTIFACTS],
      audit_bound_artifacts_excluded: [...SECOND_CONSUMER_PILOT_AUDIT_BOUND_EXCLUSIONS],
      minimal_artifacts: [...GOVERNANCE_SECOND_CONSUMER_MINIMAL_ARTIFACTS],
      minimal_ready: true,
      consumer_neutral_only: true,
    },
    dependencies: {
      provided_artifacts: [
        ...SECOND_CONSUMER_PILOT_REQUIRED_INPUTS,
        ...providedOptionalArtifacts,
      ],
      allowed_optional_artifacts: [...GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS],
      activation_enabled_paths: enabledPaths,
      audit_bound_paths_present: auditBoundPathsPresent,
      dependency_rules_checked: true,
    },
    contracts: {
      decision_record_surface: governanceDecisionRecord.governance_decision.consumer_surface,
      activation_record_surface: governanceActivationRecord.governance_activation.consumer_surface,
    },
  };

  return assertValidSecondConsumerSummary(summary);
}

export function renderSecondConsumerPilotSummary(summary, { pretty = false } = {}) {
  return serializeSecondConsumerSummary(summary, { pretty });
}

export function getSecondConsumerPilotSummaryHash(summary, { pretty = false } = {}) {
  return computeSecondConsumerSummaryHash(summary, { pretty });
}
