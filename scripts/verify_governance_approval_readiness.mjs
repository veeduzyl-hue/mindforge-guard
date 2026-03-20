import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  APPROVAL_READINESS_BOUNDARY,
  APPROVAL_READINESS_CONSUMER_COMPATIBLE,
  APPROVAL_READINESS_KIND,
  APPROVAL_READINESS_LEVELS,
  APPROVAL_READINESS_READY,
  APPROVAL_READINESS_SCHEMA_ID,
  APPROVAL_READINESS_STAGE,
  APPROVAL_READINESS_STABLE_EXPORT_SET,
  APPROVAL_READINESS_VERSION,
  APPROVAL_RECEIPT_BOUNDARY,
  APPROVAL_RECEIPT_KIND,
  APPROVAL_RECEIPT_SCHEMA_ID,
  APPROVAL_RECEIPT_STAGE,
  APPROVAL_RECEIPT_STABLE_EXPORT_SET,
  APPROVAL_RECEIPT_VERSION,
  APPROVAL_STATUS_APPROVAL_REQUIRED,
  APPROVAL_STATUS_EXCEPTION_POSSIBLE,
  APPROVAL_STATUS_NOT_REQUESTED,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildGovernanceDecisionRecord,
  buildJudgmentCompatibilityContract,
  buildJudgmentProfile,
  buildJudgmentReadinessProfile,
  buildJudgmentStabilizationProfile,
  buildLimitedEnforcementAuthorityResult,
  buildPermitGateResult,
  validateApprovalReadinessProfile,
  validateApprovalReceiptProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:9999999999999999999999999999999999999999999999999999999999999999",
      action: { action_class: "file.write" },
    },
    policyPreviewArtifact: {
      policy_preview: {
        preview_verdict: decision === "would_deny" ? "review" : "allow",
      },
    },
    permitPrecheckArtifact: {
      permit_precheck: { decision: decision === "would_deny" ? "deny" : "allow" },
    },
    executionBridgeArtifact: {
      execution_bridge: { bridge_verdict: decision === "would_deny" ? "deny" : "allow" },
    },
    executionReadinessArtifact: {
      execution_readiness: { readiness: "ready" },
    },
    enforcementAdjacentDecisionArtifact: {
      enforcement_adjacent_decision: {
        decision,
        reasons: decision === "insufficient_signal" ? [] : [{ kind: "signal", message: decision }],
      },
    },
  });
}

function buildArtifacts(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: {
          head: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          branch: "branch",
        },
      },
    },
    policyPermitBridgeContract: bridge,
    permitGateResult: permit,
  });
  const authority = buildLimitedEnforcementAuthorityResult({
    audit: { evaluation: { verdict: "allow" } },
    canonicalActionArtifact: { canonical_action_hash: bridge.canonical_action_hash },
    executionReadinessArtifact: {
      execution_readiness: {
        readiness: bridge.policy_permit_bridge.execution_readiness,
        bridge_verdict: bridge.policy_permit_bridge.execution_bridge_verdict,
      },
    },
    enforcementAdjacentDecisionArtifact: {
      enforcement_adjacent_decision: {
        decision,
        reasons: bridge.policy_permit_bridge.reason_summary,
      },
    },
  });
  const judgmentProfile = buildJudgmentProfile({
    policyPermitBridgeContract: bridge,
    permitGateResult: permit,
    governanceDecisionRecord: governance,
    limitedEnforcementAuthorityResult: authority,
  });
  const judgmentReadiness = buildJudgmentReadinessProfile({ judgmentProfile });
  const judgmentCompatibility = buildJudgmentCompatibilityContract({
    judgmentProfile,
    judgmentReadinessProfile: judgmentReadiness,
  });
  const judgmentStabilization = buildJudgmentStabilizationProfile({
    judgmentProfile,
    judgmentReadinessProfile: judgmentReadiness,
    judgmentCompatibilityContract: judgmentCompatibility,
  });
  const approvalArtifact = buildApprovalArtifactProfile({
    judgmentProfile,
    judgmentStabilizationProfile: judgmentStabilization,
  });
  const approvalReadiness = buildApprovalReadinessProfile({
    approvalArtifactProfile: approvalArtifact,
  });
  const approvalReceipt = buildApprovalReceiptProfile({
    approvalArtifactProfile: approvalArtifact,
    approvalReadinessProfile: approvalReadiness,
  });

  return { approvalArtifact, approvalReadiness, approvalReceipt };
}

if (
  JSON.stringify(APPROVAL_READINESS_LEVELS) !==
  JSON.stringify([
    APPROVAL_READINESS_READY,
    APPROVAL_READINESS_CONSUMER_COMPATIBLE,
  ])
) {
  throw new Error("approval readiness levels drifted");
}

const insufficient = buildArtifacts("insufficient_signal");
const allow = buildArtifacts("would_allow");
const review = buildArtifacts("would_review");
const deny = buildArtifacts("would_deny");

for (const artifactSet of [insufficient, allow, review, deny]) {
  const readinessValidation = validateApprovalReadinessProfile(
    artifactSet.approvalReadiness
  );
  if (!readinessValidation.ok) {
    throw new Error(
      `approval readiness validation failed: ${readinessValidation.errors.join("; ")}`
    );
  }
  const receiptValidation = validateApprovalReceiptProfile(
    artifactSet.approvalReceipt
  );
  if (!receiptValidation.ok) {
    throw new Error(
      `approval receipt validation failed: ${receiptValidation.errors.join("; ")}`
    );
  }
  if (artifactSet.approvalReadiness.kind !== APPROVAL_READINESS_KIND) {
    throw new Error("approval readiness kind drifted");
  }
  if (artifactSet.approvalReadiness.version !== APPROVAL_READINESS_VERSION) {
    throw new Error("approval readiness version drifted");
  }
  if (artifactSet.approvalReadiness.schema_id !== APPROVAL_READINESS_SCHEMA_ID) {
    throw new Error("approval readiness schema id drifted");
  }
  if (
    artifactSet.approvalReadiness.approval_readiness.stage !==
    APPROVAL_READINESS_STAGE
  ) {
    throw new Error("approval readiness stage drifted");
  }
  if (
    artifactSet.approvalReadiness.approval_readiness.boundary !==
    APPROVAL_READINESS_BOUNDARY
  ) {
    throw new Error("approval readiness boundary drifted");
  }
  if (
    artifactSet.approvalReceipt.kind !== APPROVAL_RECEIPT_KIND ||
    artifactSet.approvalReceipt.version !== APPROVAL_RECEIPT_VERSION ||
    artifactSet.approvalReceipt.schema_id !== APPROVAL_RECEIPT_SCHEMA_ID
  ) {
    throw new Error("approval receipt contract identity drifted");
  }
  if (
    artifactSet.approvalReceipt.approval_receipt.stage !==
    APPROVAL_RECEIPT_STAGE
  ) {
    throw new Error("approval receipt stage drifted");
  }
  if (
    artifactSet.approvalReceipt.approval_receipt.boundary !==
    APPROVAL_RECEIPT_BOUNDARY
  ) {
    throw new Error("approval receipt boundary drifted");
  }
  const waiver = artifactSet.approvalReadiness.approval_readiness.waiver_contract;
  if (
    waiver.readiness !== APPROVAL_READINESS_READY ||
    waiver.available !== true ||
    waiver.recommendation_only !== true ||
    waiver.additive_only !== true ||
    waiver.execution_enabled !== false
  ) {
    throw new Error("approval waiver contract drifted");
  }
  const overrideRecord =
    artifactSet.approvalReadiness.approval_readiness.override_record;
  if (
    overrideRecord.readiness !== APPROVAL_READINESS_READY ||
    overrideRecord.contract_kind !== "approval_override_record" ||
    overrideRecord.available !== true ||
    overrideRecord.executing !== false ||
    overrideRecord.audit_output_preserved !== true ||
    overrideRecord.audit_verdict_preserved !== true ||
    overrideRecord.actual_exit_code_preserved !== true
  ) {
    throw new Error("approval override record drifted");
  }
  const consumer =
    artifactSet.approvalReadiness.approval_readiness.consumer_contract;
  if (
    consumer.readiness !== APPROVAL_READINESS_CONSUMER_COMPATIBLE ||
    consumer.exception_contract_available !== true ||
    consumer.consumer_ready !== true ||
    consumer.override_execution_available !== false ||
    consumer.denied_exit_code_preserved !== 25 ||
    consumer.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    throw new Error("approval readiness consumer contract drifted");
  }
  const receipt = artifactSet.approvalReceipt.approval_receipt;
  if (
    receipt.waiver_record.available !== true ||
    receipt.waiver_record.recommendation_only !== true ||
    receipt.waiver_record.additive_only !== true ||
    receipt.waiver_record.execution_enabled !== false
  ) {
    throw new Error("approval receipt waiver record drifted");
  }
  if (
    receipt.override_record.available !== true ||
    receipt.override_record.contract_kind !== "approval_override_record" ||
    receipt.override_record.executing !== false
  ) {
    throw new Error("approval receipt override record drifted");
  }
  if (
    receipt.receipt_contract.readiness !== APPROVAL_READINESS_CONSUMER_COMPATIBLE ||
    receipt.receipt_contract.audit_output_preserved !== true ||
    receipt.receipt_contract.audit_verdict_preserved !== true ||
    receipt.receipt_contract.actual_exit_code_preserved !== true ||
    receipt.receipt_contract.denied_exit_code_preserved !== 25 ||
    receipt.receipt_contract.authority_scope !==
      "review_gate_deny_exit_recommendation_only" ||
    receipt.receipt_contract.governance_object_addition !== false
  ) {
    throw new Error("approval receipt contract drifted");
  }
}

if (
  insufficient.approvalArtifact.approval_artifact.approval_profile
    .approval_status !== APPROVAL_STATUS_EXCEPTION_POSSIBLE
) {
  throw new Error("approval readiness insufficient-signal mapping drifted");
}
if (
  allow.approvalArtifact.approval_artifact.approval_profile.approval_status !==
  APPROVAL_STATUS_NOT_REQUESTED
) {
  throw new Error("approval readiness allow mapping drifted");
}
if (
  review.approvalArtifact.approval_artifact.approval_profile.approval_status !==
  APPROVAL_STATUS_APPROVAL_REQUIRED
) {
  throw new Error("approval readiness review mapping drifted");
}
if (
  deny.approvalArtifact.approval_artifact.approval_profile.approval_status !==
  APPROVAL_STATUS_APPROVAL_REQUIRED
) {
  throw new Error("approval readiness deny mapping drifted");
}

for (const exportName of [
  ...APPROVAL_READINESS_STABLE_EXPORT_SET,
  ...APPROVAL_RECEIPT_STABLE_EXPORT_SET,
]) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `approval readiness export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance approval readiness verified\n");
