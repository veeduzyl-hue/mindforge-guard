import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_EXCEPTION_CONSUMER_SURFACE,
  GOVERNANCE_EXCEPTION_CONTRACT_BOUNDARY,
  GOVERNANCE_EXCEPTION_CONTRACT_KIND,
  GOVERNANCE_EXCEPTION_CONTRACT_VERSION,
  GOVERNANCE_EXCEPTION_PAYLOAD_FIELDS,
  GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY,
  GOVERNANCE_EXCEPTION_PROFILE_KIND,
  GOVERNANCE_EXCEPTION_PROFILE_SCHEMA_ID,
  GOVERNANCE_EXCEPTION_PROFILE_STAGE,
  GOVERNANCE_EXCEPTION_PROFILE_VERSION,
  GOVERNANCE_EXCEPTION_STABLE_EXPORT_SET,
  GOVERNANCE_EXCEPTION_SURFACE_MAP,
  GOVERNANCE_EXCEPTION_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_EXCEPTION_TOP_LEVEL_FIELDS,
  GOVERNANCE_WAIVER_CONTRACT_BOUNDARY,
  GOVERNANCE_WAIVER_CONTRACT_KIND,
  GOVERNANCE_WAIVER_CONTRACT_VERSION,
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
  buildGovernanceExceptionProfile,
  buildGovernanceRationaleBundleProfile,
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
  validateGovernanceExceptionProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
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

function buildException(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "ffffffffffffffffffffffffffffffffffffffff", branch: "branch" },
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
  const snapshotStabilization = buildGovernanceSnapshotStabilizationProfile({
    governanceRationaleBundleProfile: rationaleBundle,
    governanceSnapshotExportCompatibilityContract: exportCompatibility,
  });
  return buildGovernanceExceptionProfile({
    governanceSnapshotStabilizationProfile: snapshotStabilization,
  });
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const artifact = buildException(decision);
  const validation = validateGovernanceExceptionProfile(artifact);
  if (!validation.ok) {
    throw new Error(
      `governance exception validation failed: ${validation.errors.join("; ")}`
    );
  }
  if (
    JSON.stringify(Object.keys(artifact)) !==
    JSON.stringify(GOVERNANCE_EXCEPTION_TOP_LEVEL_FIELDS)
  ) {
    throw new Error("governance exception top-level field order drifted");
  }
  if (
    JSON.stringify(Object.keys(artifact.governance_exception)) !==
    JSON.stringify(GOVERNANCE_EXCEPTION_PAYLOAD_FIELDS)
  ) {
    throw new Error("governance exception payload field order drifted");
  }
  if (artifact.kind !== GOVERNANCE_EXCEPTION_PROFILE_KIND) {
    throw new Error("governance exception kind drifted");
  }
  if (artifact.version !== GOVERNANCE_EXCEPTION_PROFILE_VERSION) {
    throw new Error("governance exception version drifted");
  }
  if (artifact.schema_id !== GOVERNANCE_EXCEPTION_PROFILE_SCHEMA_ID) {
    throw new Error("governance exception schema drifted");
  }
  const payload = artifact.governance_exception;
  if (payload.stage !== GOVERNANCE_EXCEPTION_PROFILE_STAGE) {
    throw new Error("governance exception stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_EXCEPTION_CONSUMER_SURFACE) {
    throw new Error("governance exception consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY) {
    throw new Error("governance exception boundary drifted");
  }
  if (
    payload.exception_contract.kind !== GOVERNANCE_EXCEPTION_CONTRACT_KIND ||
    payload.exception_contract.version !== GOVERNANCE_EXCEPTION_CONTRACT_VERSION ||
    payload.exception_contract.boundary !== GOVERNANCE_EXCEPTION_CONTRACT_BOUNDARY ||
    payload.exception_contract.recommendation_only !== true ||
    payload.exception_contract.additive_only !== true ||
    payload.exception_contract.non_executing !== true ||
    payload.exception_contract.default_on !== false ||
    payload.exception_contract.exception_record_available !== true
  ) {
    throw new Error("governance exception contract drifted");
  }
  if (
    payload.waiver_contract.kind !== GOVERNANCE_WAIVER_CONTRACT_KIND ||
    payload.waiver_contract.version !== GOVERNANCE_WAIVER_CONTRACT_VERSION ||
    payload.waiver_contract.boundary !== GOVERNANCE_WAIVER_CONTRACT_BOUNDARY ||
    payload.waiver_contract.waiver_available !== true ||
    payload.waiver_contract.descriptive_only !== true ||
    payload.waiver_contract.bounded_waiver !== true
  ) {
    throw new Error("governance waiver contract drifted");
  }
  if (
    payload.validation_exports.surface_available !== true ||
    payload.validation_exports.validation_available !== true ||
    payload.validation_exports.permit_chain_export_available !== true
  ) {
    throw new Error("governance exception validation export drifted");
  }
  const semantics = payload.preserved_semantics;
  if (
    semantics.snapshot_semantics_preserved !== true ||
    semantics.evidence_semantics_preserved !== true ||
    semantics.policy_semantics_preserved !== true ||
    semantics.enforcement_semantics_preserved !== true ||
    semantics.approval_semantics_preserved !== true ||
    semantics.judgment_semantics_preserved !== true ||
    semantics.permit_gate_semantics_preserved !== true ||
    semantics.audit_output_preserved !== true ||
    semantics.audit_verdict_preserved !== true ||
    semantics.actual_exit_code_preserved !== true ||
    semantics.denied_exit_code_preserved !== 25 ||
    semantics.authority_scope !== "review_gate_deny_exit_recommendation_only" ||
    semantics.authority_scope_expansion !== false ||
    semantics.governance_object_addition !== false ||
    semantics.main_path_takeover !== false
  ) {
    throw new Error("governance exception preserved semantics drifted");
  }
}

if (!GOVERNANCE_EXCEPTION_SURFACE_MAP.governance_exception) {
  throw new Error("governance exception surface entry missing");
}
if (!permitExports.GOVERNANCE_EXCEPTION_SURFACE_MAP?.governance_exception_stabilization) {
  throw new Error("governance exception stabilization surface entry missing");
}
if (!permitExports.GOVERNANCE_EXCEPTION_SURFACE_MAP?.governance_exception_override_record) {
  throw new Error("governance exception override surface entry missing");
}
if (
  GOVERNANCE_EXCEPTION_SURFACE_MAP.governance_exception.contract.kind !==
  GOVERNANCE_EXCEPTION_PROFILE_KIND
) {
  throw new Error("governance exception surface contract kind drifted");
}

for (const exportName of GOVERNANCE_EXCEPTION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance exception export missing from permit index: ${exportName}`
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

process.stdout.write("governance exception waiver verified\n");
