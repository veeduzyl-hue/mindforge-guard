import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_LINKAGE_BOUNDARY,
  GOVERNANCE_CASE_LINKAGE_KIND,
  GOVERNANCE_CASE_LINKAGE_STAGE,
  GOVERNANCE_CASE_LINKAGE_VERSION,
  GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_VERSION,
  GOVERNANCE_EXCEPTION_CONSUMER_SURFACE,
  GOVERNANCE_EXCEPTION_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_EXCEPTION_FINAL_ACCEPTANCE_READY,
  GOVERNANCE_EXCEPTION_STABILIZATION_KIND,
  GOVERNANCE_EXCEPTION_STABILIZATION_SCHEMA_ID,
  GOVERNANCE_EXCEPTION_STABILIZATION_STAGE,
  GOVERNANCE_EXCEPTION_STABILIZATION_STABLE_EXPORT_SET,
  GOVERNANCE_EXCEPTION_STABILIZATION_VERSION,
  GOVERNANCE_EXCEPTION_SURFACE_MAP,
  GOVERNANCE_EXCEPTION_SURFACE_STABLE_EXPORT_SET,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildApprovalStabilizationProfile,
  buildEnforcementCompatibilityProfile,
  buildEnforcementReadinessProfile,
  buildEnforcementStabilizationProfile,
  buildGovernanceCaseLinkageProfile,
  buildGovernanceCompareCompatibilityContract,
  buildGovernanceDecisionRecord,
  buildGovernanceEvidenceProfile,
  buildGovernanceEvidenceReplayProfile,
  buildGovernanceEvidenceStabilizationProfile,
  buildGovernanceExceptionCompatibilityContract,
  buildGovernanceExceptionProfile,
  buildGovernanceExceptionStabilizationProfile,
  buildGovernanceOverrideRecordContract,
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
  validateGovernanceExceptionStabilizationProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:bbbbccccbbbbccccbbbbccccbbbbccccbbbbccccbbbbccccbbbbccccbbbbcccc",
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

function buildExceptionStabilization(decision) {
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
  const evidenceStabilization = buildGovernanceEvidenceStabilizationProfile({
    governanceEvidenceReplayProfile: evidenceReplay,
    governanceCompareCompatibilityContract: evidenceCompare,
  });
  const snapshot = buildGovernanceSnapshotProfile({
    governanceEvidenceStabilizationProfile: evidenceStabilization,
  });
  const reviewPack = buildGovernanceReviewPackContract({
    governanceSnapshotProfile: snapshot,
  });
  const rationaleBundle = buildGovernanceRationaleBundleProfile({
    governanceSnapshotProfile: snapshot,
  });
  const exportCompatibility = buildGovernanceSnapshotExportCompatibilityContract({
    governanceRationaleBundleProfile: rationaleBundle,
  });
  const snapshotStabilization = buildGovernanceSnapshotStabilizationProfile({
    governanceRationaleBundleProfile: rationaleBundle,
    governanceSnapshotExportCompatibilityContract: exportCompatibility,
  });
  const exceptionProfile = buildGovernanceExceptionProfile({
    governanceSnapshotStabilizationProfile: snapshotStabilization,
  });
  const overrideRecord = buildGovernanceOverrideRecordContract({
    governanceExceptionProfile: exceptionProfile,
  });
  const caseLinkage = buildGovernanceCaseLinkageProfile({
    governanceExceptionProfile: exceptionProfile,
  });
  const compatibility = buildGovernanceExceptionCompatibilityContract({
    governanceCaseLinkageProfile: caseLinkage,
  });
  return buildGovernanceExceptionStabilizationProfile({
    governanceCaseLinkageProfile: caseLinkage,
    governanceExceptionCompatibilityContract: compatibility,
  });
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const artifact = buildExceptionStabilization(decision);
  const validation = validateGovernanceExceptionStabilizationProfile(artifact);
  if (!validation.ok) {
    throw new Error(
      `governance exception stabilization validation failed: ${validation.errors.join("; ")}`
    );
  }
  if (artifact.kind !== GOVERNANCE_EXCEPTION_STABILIZATION_KIND) {
    throw new Error("governance exception stabilization kind drifted");
  }
  if (artifact.version !== GOVERNANCE_EXCEPTION_STABILIZATION_VERSION) {
    throw new Error("governance exception stabilization version drifted");
  }
  if (artifact.schema_id !== GOVERNANCE_EXCEPTION_STABILIZATION_SCHEMA_ID) {
    throw new Error("governance exception stabilization schema drifted");
  }
  if (
    artifact.governance_exception_stabilization.stage !==
    GOVERNANCE_EXCEPTION_STABILIZATION_STAGE
  ) {
    throw new Error("governance exception stabilization stage drifted");
  }
  if (
    artifact.governance_exception_stabilization.consumer_surface !==
    GOVERNANCE_EXCEPTION_CONSUMER_SURFACE
  ) {
    throw new Error("governance exception stabilization consumer surface drifted");
  }
  if (
    artifact.governance_exception_stabilization.boundary !==
    GOVERNANCE_EXCEPTION_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    throw new Error("governance exception stabilization boundary drifted");
  }
  const caseLinkageRef = artifact.governance_exception_stabilization.case_linkage_ref;
  if (
    caseLinkageRef.kind !== GOVERNANCE_CASE_LINKAGE_KIND ||
    caseLinkageRef.version !== GOVERNANCE_CASE_LINKAGE_VERSION ||
    caseLinkageRef.stage !== GOVERNANCE_CASE_LINKAGE_STAGE ||
    caseLinkageRef.boundary !== GOVERNANCE_CASE_LINKAGE_BOUNDARY
  ) {
    throw new Error("governance exception stabilization case linkage ref drifted");
  }
  const compatibilityRef =
    artifact.governance_exception_stabilization.compatibility_ref;
  if (
    compatibilityRef.kind !== GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_KIND ||
    compatibilityRef.version !== GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_VERSION ||
    compatibilityRef.boundary !==
      GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_BOUNDARY
  ) {
    throw new Error("governance exception stabilization compatibility ref drifted");
  }
  const contract =
    artifact.governance_exception_stabilization.final_consumer_contract;
  if (
    contract.acceptance_level !== GOVERNANCE_EXCEPTION_FINAL_ACCEPTANCE_READY ||
    contract.recommendation_only !== true ||
    contract.additive_only !== true ||
    contract.execution_enabled !== false ||
    contract.default_on !== false ||
    contract.override_execution_available !== false ||
    contract.waiver_execution_available !== false ||
    contract.audit_output_preserved !== true ||
    contract.audit_verdict_preserved !== true ||
    contract.actual_exit_code_preserved !== true ||
    contract.denied_exit_code_preserved !== 25 ||
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only" ||
    contract.governance_object_addition !== false
  ) {
    throw new Error("governance exception stabilization final contract drifted");
  }
  const semantics = artifact.governance_exception_stabilization.preserved_semantics;
  if (
    semantics.exception_waiver_semantics_preserved !== true ||
    semantics.override_record_semantics_preserved !== true ||
    semantics.case_linkage_semantics_preserved !== true ||
    semantics.exception_compatibility_semantics_preserved !== true ||
    semantics.snapshot_semantics_preserved !== true ||
    semantics.evidence_semantics_preserved !== true ||
    semantics.policy_semantics_preserved !== true ||
    semantics.enforcement_semantics_preserved !== true ||
    semantics.approval_semantics_preserved !== true ||
    semantics.judgment_semantics_preserved !== true ||
    semantics.permit_gate_semantics_preserved !== true ||
    semantics.consumer_contract_ready !== true ||
    semantics.override_record_ready !== true ||
    semantics.consumer_compatible !== true ||
    semantics.main_path_takeover !== false
  ) {
    throw new Error("governance exception stabilization preserved semantics drifted");
  }
}

if (!GOVERNANCE_EXCEPTION_SURFACE_MAP.governance_exception_stabilization) {
  throw new Error("governance exception stabilization surface entry missing");
}
if (
  GOVERNANCE_EXCEPTION_SURFACE_MAP.governance_exception_stabilization.contract.kind !==
  GOVERNANCE_EXCEPTION_STABILIZATION_KIND
) {
  throw new Error("governance exception stabilization surface contract kind drifted");
}

for (const exportName of GOVERNANCE_EXCEPTION_STABILIZATION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance exception stabilization export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_EXCEPTION_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance exception surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance exception stabilization verified\n");
