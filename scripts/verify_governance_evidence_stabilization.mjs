import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION,
  GOVERNANCE_EVIDENCE_CONSUMER_COMPATIBLE,
  GOVERNANCE_EVIDENCE_CONSUMER_SURFACE,
  GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_READY,
  GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY,
  GOVERNANCE_EVIDENCE_REPLAY_KIND,
  GOVERNANCE_EVIDENCE_REPLAY_STAGE,
  GOVERNANCE_EVIDENCE_REPLAY_VERSION,
  GOVERNANCE_EVIDENCE_STABILIZATION_KIND,
  GOVERNANCE_EVIDENCE_STABILIZATION_SCHEMA_ID,
  GOVERNANCE_EVIDENCE_STABILIZATION_STAGE,
  GOVERNANCE_EVIDENCE_STABILIZATION_STABLE_EXPORT_SET,
  GOVERNANCE_EVIDENCE_STABILIZATION_VERSION,
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
  buildGovernanceEvidenceStabilizationProfile,
  buildJudgmentCompatibilityContract,
  buildJudgmentProfile,
  buildJudgmentReadinessProfile,
  buildJudgmentStabilizationProfile,
  buildLimitedEnforcementAuthorityResult,
  buildPermitGateResult,
  buildPolicyCompatibilityProfile,
  buildPolicyProfile,
  buildPolicyStabilizationProfile,
  validateGovernanceEvidenceStabilizationProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:ababefefababefefababefefababefefababefefababefefababefefababefef",
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

function buildEvidenceStabilization(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", branch: "branch" },
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
  const evidenceReplay = buildGovernanceEvidenceReplayProfile({
    governanceEvidenceProfile: evidenceProfile,
  });
  const evidenceCompare = buildGovernanceCompareCompatibilityContract({
    governanceEvidenceReplayProfile: evidenceReplay,
  });

  return buildGovernanceEvidenceStabilizationProfile({
    governanceEvidenceReplayProfile: evidenceReplay,
    governanceCompareCompatibilityContract: evidenceCompare,
  });
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const artifact = buildEvidenceStabilization(decision);
  const validation = validateGovernanceEvidenceStabilizationProfile(artifact);
  if (!validation.ok) {
    throw new Error(
      `governance evidence stabilization validation failed: ${validation.errors.join("; ")}`
    );
  }
  if (artifact.kind !== GOVERNANCE_EVIDENCE_STABILIZATION_KIND) {
    throw new Error("governance evidence stabilization kind drifted");
  }
  if (artifact.version !== GOVERNANCE_EVIDENCE_STABILIZATION_VERSION) {
    throw new Error("governance evidence stabilization version drifted");
  }
  if (artifact.schema_id !== GOVERNANCE_EVIDENCE_STABILIZATION_SCHEMA_ID) {
    throw new Error("governance evidence stabilization schema drifted");
  }
  if (
    artifact.governance_evidence_stabilization.stage !==
    GOVERNANCE_EVIDENCE_STABILIZATION_STAGE
  ) {
    throw new Error("governance evidence stabilization stage drifted");
  }
  if (
    artifact.governance_evidence_stabilization.consumer_surface !==
    GOVERNANCE_EVIDENCE_CONSUMER_SURFACE
  ) {
    throw new Error("governance evidence stabilization consumer surface drifted");
  }
  if (
    artifact.governance_evidence_stabilization.boundary !==
    GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    throw new Error("governance evidence stabilization boundary drifted");
  }
  const replayRef = artifact.governance_evidence_stabilization.replay_ref;
  if (
    replayRef.kind !== GOVERNANCE_EVIDENCE_REPLAY_KIND ||
    replayRef.version !== GOVERNANCE_EVIDENCE_REPLAY_VERSION ||
    replayRef.stage !== GOVERNANCE_EVIDENCE_REPLAY_STAGE ||
    replayRef.boundary !== GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY
  ) {
    throw new Error("governance evidence stabilization replay ref drifted");
  }
  const compareRef = artifact.governance_evidence_stabilization.compare_ref;
  if (
    compareRef.kind !== GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND ||
    compareRef.version !== GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION ||
    compareRef.boundary !== GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY
  ) {
    throw new Error("governance evidence stabilization compare ref drifted");
  }
  const contract = artifact.governance_evidence_stabilization.final_consumer_contract;
  if (
    contract.acceptance_level !== GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_READY ||
    contract.recommendation_only !== true ||
    contract.additive_only !== true ||
    contract.execution_enabled !== false ||
    contract.default_on !== false ||
    contract.replay_execution_available !== false ||
    contract.compare_execution_available !== false ||
    contract.audit_output_preserved !== true ||
    contract.audit_verdict_preserved !== true ||
    contract.actual_exit_code_preserved !== true ||
    contract.denied_exit_code_preserved !== 25 ||
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only" ||
    contract.governance_object_addition !== false
  ) {
    throw new Error("governance evidence stabilization final contract drifted");
  }
  const semantics = artifact.governance_evidence_stabilization.preserved_semantics;
  if (
    semantics.evidence_provenance_semantics_preserved !== true ||
    semantics.evidence_replay_semantics_preserved !== true ||
    semantics.policy_semantics_preserved !== true ||
    semantics.enforcement_semantics_preserved !== true ||
    semantics.approval_semantics_preserved !== true ||
    semantics.judgment_semantics_preserved !== true ||
    semantics.permit_gate_semantics_preserved !== true ||
    semantics.consumer_contract_ready !== true ||
    semantics.replay_ready !== true ||
    semantics.compare_ready !== true ||
    semantics.main_path_takeover !== false
  ) {
    throw new Error("governance evidence stabilization preserved semantics drifted");
  }
}

if (!GOVERNANCE_EVIDENCE_SURFACE_MAP.governance_evidence_stabilization) {
  throw new Error("governance evidence stabilization surface entry missing");
}
if (
  GOVERNANCE_EVIDENCE_SURFACE_MAP.governance_evidence_stabilization.contract.kind !==
  GOVERNANCE_EVIDENCE_STABILIZATION_KIND
) {
  throw new Error("governance evidence stabilization surface contract kind drifted");
}

for (const exportName of GOVERNANCE_EVIDENCE_STABILIZATION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance evidence stabilization export missing from permit index: ${exportName}`
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

process.stdout.write("governance evidence stabilization verified\n");
