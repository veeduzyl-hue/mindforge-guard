import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_BOUNDARY,
  GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_KIND,
  GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_VERSION,
  GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION,
  GOVERNANCE_EVIDENCE_CONSUMER_COMPATIBLE,
  GOVERNANCE_EVIDENCE_CONSUMER_SURFACE,
  GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY,
  GOVERNANCE_EVIDENCE_PROFILE_KIND,
  GOVERNANCE_EVIDENCE_PROFILE_STAGE,
  GOVERNANCE_EVIDENCE_PROFILE_VERSION,
  GOVERNANCE_EVIDENCE_RECEIPT_READY,
  GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY,
  GOVERNANCE_EVIDENCE_REPLAY_KIND,
  GOVERNANCE_EVIDENCE_REPLAY_SCHEMA_ID,
  GOVERNANCE_EVIDENCE_REPLAY_STAGE,
  GOVERNANCE_EVIDENCE_REPLAY_STABLE_EXPORT_SET,
  GOVERNANCE_EVIDENCE_REPLAY_VERSION,
  GOVERNANCE_EVIDENCE_SURFACE_MAP,
  GOVERNANCE_EVIDENCE_SURFACE_STABLE_EXPORT_SET,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildApprovalStabilizationProfile,
  buildEnforcementCompatibilityProfile,
  buildEnforcementReadinessProfile,
  buildEnforcementStabilizationProfile,
  buildGovernanceCompareCompatibilityContract,
  buildGovernanceDecisionRecord,
  buildGovernanceEvidenceProfile,
  buildGovernanceEvidenceReplayProfile,
  buildJudgmentCompatibilityContract,
  buildJudgmentProfile,
  buildJudgmentReadinessProfile,
  buildJudgmentStabilizationProfile,
  buildLimitedEnforcementAuthorityResult,
  buildPermitGateResult,
  buildPolicyCompatibilityProfile,
  buildPolicyProfile,
  buildPolicyStabilizationProfile,
  validateGovernanceCompareCompatibilityContract,
  validateGovernanceEvidenceReplayProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:efefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefef",
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

function buildReplay(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", branch: "branch" },
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
  const approvalStabilization = buildApprovalStabilizationProfile({
    approvalArtifactProfile: approvalArtifact,
    approvalReadinessProfile: approvalReadiness,
    approvalReceiptProfile: approvalReceipt,
  });
  const enforcementReadiness = buildEnforcementReadinessProfile({
    approvalStabilizationProfile: approvalStabilization,
  });
  const enforcementCompatibility = buildEnforcementCompatibilityProfile({
    enforcementReadinessProfile: enforcementReadiness,
  });
  const enforcementStabilization = buildEnforcementStabilizationProfile({
    enforcementCompatibilityProfile: enforcementCompatibility,
  });
  const policyProfile = buildPolicyProfile({
    enforcementStabilizationProfile: enforcementStabilization,
  });
  const policyCompatibility = buildPolicyCompatibilityProfile({ policyProfile });
  const policyStabilization = buildPolicyStabilizationProfile({
    policyCompatibilityProfile: policyCompatibility,
  });
  const evidenceProfile = buildGovernanceEvidenceProfile({
    policyStabilizationProfile: policyStabilization,
  });
  const replayProfile = buildGovernanceEvidenceReplayProfile({
    governanceEvidenceProfile: evidenceProfile,
  });
  const compareContract = buildGovernanceCompareCompatibilityContract({
    governanceEvidenceReplayProfile: replayProfile,
  });

  return { replayProfile, compareContract };
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const { replayProfile, compareContract } = buildReplay(decision);
  const replayValidation = validateGovernanceEvidenceReplayProfile(replayProfile);
  if (!replayValidation.ok) {
    throw new Error(
      `governance evidence replay validation failed: ${replayValidation.errors.join("; ")}`
    );
  }
  const compareValidation =
    validateGovernanceCompareCompatibilityContract(compareContract);
  if (!compareValidation.ok) {
    throw new Error(
      `governance compare validation failed: ${compareValidation.errors.join("; ")}`
    );
  }
  if (replayProfile.kind !== GOVERNANCE_EVIDENCE_REPLAY_KIND) {
    throw new Error("governance evidence replay kind drifted");
  }
  if (replayProfile.version !== GOVERNANCE_EVIDENCE_REPLAY_VERSION) {
    throw new Error("governance evidence replay version drifted");
  }
  if (replayProfile.schema_id !== GOVERNANCE_EVIDENCE_REPLAY_SCHEMA_ID) {
    throw new Error("governance evidence replay schema drifted");
  }
  if (
    replayProfile.governance_evidence_replay.stage !==
    GOVERNANCE_EVIDENCE_REPLAY_STAGE
  ) {
    throw new Error("governance evidence replay stage drifted");
  }
  if (
    replayProfile.governance_evidence_replay.consumer_surface !==
    GOVERNANCE_EVIDENCE_CONSUMER_SURFACE
  ) {
    throw new Error("governance evidence replay consumer surface drifted");
  }
  if (
    replayProfile.governance_evidence_replay.boundary !==
    GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY
  ) {
    throw new Error("governance evidence replay boundary drifted");
  }
  const linkage = replayProfile.governance_evidence_replay.artifact_linkage_contract;
  if (
    linkage.kind !== GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_KIND ||
    linkage.version !== GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_VERSION ||
    linkage.boundary !== GOVERNANCE_ARTIFACT_LINKAGE_CONTRACT_BOUNDARY ||
    linkage.linkage_ready !== true ||
    linkage.bounded_linkage !== true ||
    linkage.recommendation_only !== true ||
    linkage.additive_only !== true ||
    linkage.execution_enabled !== false ||
    linkage.authority_scope !== "review_gate_deny_exit_recommendation_only" ||
    linkage.authority_scope_expansion !== false
  ) {
    throw new Error("governance evidence linkage contract drifted");
  }
  const receipt = replayProfile.governance_evidence_replay.receipt_readiness;
  if (
    receipt.level !== GOVERNANCE_EVIDENCE_RECEIPT_READY ||
    receipt.replay_ready !== true ||
    receipt.linkage_ready !== true ||
    receipt.recommendation_only !== true
  ) {
    throw new Error("governance evidence receipt readiness drifted");
  }
  const consumer =
    replayProfile.governance_evidence_replay.consumer_compatibility;
  if (
    consumer.level !== GOVERNANCE_EVIDENCE_CONSUMER_COMPATIBLE ||
    consumer.additive_only !== true ||
    consumer.non_executing !== true ||
    consumer.default_off !== true ||
    consumer.authority_scope !== "review_gate_deny_exit_recommendation_only" ||
    consumer.denied_exit_code_preserved !== 25
  ) {
    throw new Error("governance evidence consumer compatibility drifted");
  }
  if (
    compareContract.kind !== GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND ||
    compareContract.version !== GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION ||
    compareContract.boundary !== GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY ||
    compareContract.compare_ready !== true ||
    compareContract.replay_ready !== true ||
    compareContract.recommendation_only !== true ||
    compareContract.additive_only !== true ||
    compareContract.execution_enabled !== false ||
    compareContract.default_on !== false ||
    compareContract.audit_output_preserved !== true ||
    compareContract.audit_verdict_preserved !== true ||
    compareContract.actual_exit_code_preserved !== true ||
    compareContract.denied_exit_code_preserved !== 25 ||
    compareContract.authority_scope !== "review_gate_deny_exit_recommendation_only" ||
    compareContract.governance_object_addition !== false ||
    compareContract.main_path_takeover !== false
  ) {
    throw new Error("governance compare compatibility contract drifted");
  }
}

if (!GOVERNANCE_EVIDENCE_SURFACE_MAP.governance_evidence_replay) {
  throw new Error("governance evidence replay surface entry missing");
}
if (
  GOVERNANCE_EVIDENCE_SURFACE_MAP.governance_evidence_replay.contract.kind !==
  GOVERNANCE_EVIDENCE_REPLAY_KIND
) {
  throw new Error("governance evidence replay surface contract kind drifted");
}

for (const exportName of GOVERNANCE_EVIDENCE_REPLAY_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance evidence replay export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_EVIDENCE_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance evidence surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance evidence replay verified\n");
