import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY,
  GOVERNANCE_RATIONALE_BUNDLE_KIND,
  GOVERNANCE_RATIONALE_BUNDLE_STAGE,
  GOVERNANCE_RATIONALE_BUNDLE_VERSION,
  GOVERNANCE_SNAPSHOT_CONSUMER_COMPATIBLE,
  GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
  GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_BOUNDARY,
  GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND,
  GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_VERSION,
  GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_READY,
  GOVERNANCE_SNAPSHOT_STABILIZATION_KIND,
  GOVERNANCE_SNAPSHOT_STABILIZATION_SCHEMA_ID,
  GOVERNANCE_SNAPSHOT_STABILIZATION_STAGE,
  GOVERNANCE_SNAPSHOT_STABILIZATION_STABLE_EXPORT_SET,
  GOVERNANCE_SNAPSHOT_STABILIZATION_VERSION,
  GOVERNANCE_SNAPSHOT_SURFACE_MAP,
  GOVERNANCE_SNAPSHOT_SURFACE_STABLE_EXPORT_SET,
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
  buildGovernanceRationaleBundleProfile,
  buildGovernanceReviewPackContract,
  buildGovernanceSnapshotExportCompatibilityContract,
  buildGovernanceSnapshotProfile,
  buildGovernanceSnapshotStabilizationProfile,
  buildJudgmentCompatibilityContract,
  buildJudgmentProfile,
  buildJudgmentReadinessProfile,
  buildJudgmentStabilizationProfile,
  buildLimitedEnforcementAuthorityResult,
  buildPermitGateResult,
  buildPolicyCompatibilityProfile,
  buildPolicyProfile,
  buildPolicyStabilizationProfile,
  validateGovernanceSnapshotStabilizationProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:ddddababddddababddddababddddababddddababddddababddddababddddabab",
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

function buildSnapshotStabilization(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", branch: "branch" },
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
  const evidenceStabilization = buildGovernanceEvidenceStabilizationProfile({
    governanceEvidenceReplayProfile: evidenceReplay,
    governanceCompareCompatibilityContract: evidenceCompare,
  });
  const snapshot = buildGovernanceSnapshotProfile({
    governanceEvidenceStabilizationProfile: evidenceStabilization,
  });
  const rationaleBundle = buildGovernanceRationaleBundleProfile({
    governanceSnapshotProfile: snapshot,
  });
  const exportCompatibility = buildGovernanceSnapshotExportCompatibilityContract({
    governanceRationaleBundleProfile: rationaleBundle,
  });
  return buildGovernanceSnapshotStabilizationProfile({
    governanceRationaleBundleProfile: rationaleBundle,
    governanceSnapshotExportCompatibilityContract: exportCompatibility,
  });
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const artifact = buildSnapshotStabilization(decision);
  const validation = validateGovernanceSnapshotStabilizationProfile(artifact);
  if (!validation.ok) {
    throw new Error(
      `governance snapshot stabilization validation failed: ${validation.errors.join("; ")}`
    );
  }
  if (artifact.kind !== GOVERNANCE_SNAPSHOT_STABILIZATION_KIND) {
    throw new Error("governance snapshot stabilization kind drifted");
  }
  if (artifact.version !== GOVERNANCE_SNAPSHOT_STABILIZATION_VERSION) {
    throw new Error("governance snapshot stabilization version drifted");
  }
  if (artifact.schema_id !== GOVERNANCE_SNAPSHOT_STABILIZATION_SCHEMA_ID) {
    throw new Error("governance snapshot stabilization schema drifted");
  }
  if (
    artifact.governance_snapshot_stabilization.stage !==
    GOVERNANCE_SNAPSHOT_STABILIZATION_STAGE
  ) {
    throw new Error("governance snapshot stabilization stage drifted");
  }
  if (
    artifact.governance_snapshot_stabilization.consumer_surface !==
    GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE
  ) {
    throw new Error("governance snapshot stabilization consumer surface drifted");
  }
  if (
    artifact.governance_snapshot_stabilization.boundary !==
    GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    throw new Error("governance snapshot stabilization boundary drifted");
  }
  const rationaleRef =
    artifact.governance_snapshot_stabilization.rationale_bundle_ref;
  if (
    rationaleRef.kind !== GOVERNANCE_RATIONALE_BUNDLE_KIND ||
    rationaleRef.version !== GOVERNANCE_RATIONALE_BUNDLE_VERSION ||
    rationaleRef.stage !== GOVERNANCE_RATIONALE_BUNDLE_STAGE ||
    rationaleRef.boundary !== GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY
  ) {
    throw new Error("governance snapshot stabilization rationale ref drifted");
  }
  const exportRef =
    artifact.governance_snapshot_stabilization.export_compatibility_ref;
  if (
    exportRef.kind !== GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND ||
    exportRef.version !== GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_VERSION ||
    exportRef.boundary !== GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_BOUNDARY
  ) {
    throw new Error("governance snapshot stabilization export ref drifted");
  }
  const contract =
    artifact.governance_snapshot_stabilization.final_consumer_contract;
  if (
    contract.acceptance_level !== GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_READY ||
    contract.recommendation_only !== true ||
    contract.additive_only !== true ||
    contract.execution_enabled !== false ||
    contract.default_on !== false ||
    contract.review_pack_execution_available !== false ||
    contract.rationale_bundle_execution_available !== false ||
    contract.audit_output_preserved !== true ||
    contract.audit_verdict_preserved !== true ||
    contract.actual_exit_code_preserved !== true ||
    contract.denied_exit_code_preserved !== 25 ||
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only" ||
    contract.governance_object_addition !== false
  ) {
    throw new Error("governance snapshot stabilization final contract drifted");
  }
  const semantics = artifact.governance_snapshot_stabilization.preserved_semantics;
  if (
    semantics.snapshot_explainability_semantics_preserved !== true ||
    semantics.review_pack_semantics_preserved !== true ||
    semantics.rationale_bundle_semantics_preserved !== true ||
    semantics.export_compatibility_semantics_preserved !== true ||
    semantics.evidence_semantics_preserved !== true ||
    semantics.policy_semantics_preserved !== true ||
    semantics.enforcement_semantics_preserved !== true ||
    semantics.approval_semantics_preserved !== true ||
    semantics.judgment_semantics_preserved !== true ||
    semantics.permit_gate_semantics_preserved !== true ||
    semantics.consumer_contract_ready !== true ||
    semantics.review_pack_ready !== true ||
    semantics.export_compatible !== true ||
    semantics.main_path_takeover !== false
  ) {
    throw new Error("governance snapshot stabilization preserved semantics drifted");
  }
}

if (!GOVERNANCE_SNAPSHOT_SURFACE_MAP.governance_snapshot_stabilization) {
  throw new Error("governance snapshot stabilization surface entry missing");
}
if (
  GOVERNANCE_SNAPSHOT_SURFACE_MAP.governance_snapshot_stabilization.contract.kind !==
  GOVERNANCE_SNAPSHOT_STABILIZATION_KIND
) {
  throw new Error("governance snapshot stabilization surface contract kind drifted");
}

for (const exportName of GOVERNANCE_SNAPSHOT_STABILIZATION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance snapshot stabilization export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_SNAPSHOT_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance snapshot surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance snapshot stabilization verified\n");
