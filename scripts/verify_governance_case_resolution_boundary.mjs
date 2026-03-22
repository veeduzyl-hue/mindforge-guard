import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_VERSION,
  GOVERNANCE_CASE_RESOLUTION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_RESOLUTION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_CONTRACT_KIND,
  GOVERNANCE_CASE_RESOLUTION_CONTRACT_VERSION,
  GOVERNANCE_CASE_RESOLUTION_CLOSURE_READY,
  GOVERNANCE_CASE_RESOLUTION_MODE_RECOMMENDATION_ONLY,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_KIND,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_STAGE,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_VERSION,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_SCHEMA_ID,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_VERSION,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_READY,
  GOVERNANCE_CASE_RESOLUTION_STATUS_DOCUMENTED,
  GOVERNANCE_CASE_RESOLUTION_SURFACE_MAP,
  GOVERNANCE_CASE_RESOLUTION_SURFACE_STABLE_EXPORT_SET,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildApprovalStabilizationProfile,
  buildEnforcementCompatibilityProfile,
  buildEnforcementReadinessProfile,
  buildEnforcementStabilizationProfile,
  buildGovernanceCaseLinkageProfile,
  buildGovernanceCaseResolutionCompatibilityContract,
  buildGovernanceCaseResolutionContract,
  buildGovernanceCaseResolutionProfile,
  buildGovernanceCaseResolutionStabilizationProfile,
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
  consumeGovernanceCaseResolution,
  validateGovernanceCaseResolutionBundle,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:ccccddddccccddddccccddddccccddddccccddddccccddddccccddddccccdddd",
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

function buildCaseResolution(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "cccccccccccccccccccccccccccccccccccccccc", branch: "branch" },
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
  const exceptionProfile = buildGovernanceExceptionProfile({
    governanceSnapshotStabilizationProfile: snapshotStabilization,
  });
  const overrideRecord = buildGovernanceOverrideRecordContract({
    governanceExceptionProfile: exceptionProfile,
  });
  const caseLinkage = buildGovernanceCaseLinkageProfile({
    governanceExceptionProfile: exceptionProfile,
  });
  const exceptionCompatibility = buildGovernanceExceptionCompatibilityContract({
    governanceCaseLinkageProfile: caseLinkage,
  });
  const exceptionStabilization = buildGovernanceExceptionStabilizationProfile({
    governanceCaseLinkageProfile: caseLinkage,
    governanceExceptionCompatibilityContract: exceptionCompatibility,
  });
  const resolutionProfile = buildGovernanceCaseResolutionProfile({
    governanceExceptionStabilizationProfile: exceptionStabilization,
    caseId: `case-${decision}`,
    linkedExceptionIds: [`exception-${decision}`],
    linkedOverrideRecordIds: [`override-${decision}`],
  });
  const resolutionContract = buildGovernanceCaseResolutionContract({
    governanceCaseResolutionProfile: resolutionProfile,
  });
  const compatibility = buildGovernanceCaseResolutionCompatibilityContract({
    governanceCaseResolutionContract: resolutionContract,
  });
  const stabilization = buildGovernanceCaseResolutionStabilizationProfile({
    governanceCaseResolutionProfile: resolutionProfile,
    governanceCaseResolutionCompatibilityContract: compatibility,
  });
  const consumed = consumeGovernanceCaseResolution({
    governanceCaseResolutionProfile: resolutionProfile,
    governanceCaseResolutionCompatibilityContract: compatibility,
    governanceCaseResolutionStabilizationProfile: stabilization,
  });
  return {
    resolutionProfile,
    resolutionContract,
    compatibility,
    stabilization,
    consumed,
  };
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const {
    resolutionProfile,
    resolutionContract,
    compatibility,
    stabilization,
    consumed,
  } = buildCaseResolution(decision);

  const validation = validateGovernanceCaseResolutionBundle({
    governanceCaseResolutionProfile: resolutionProfile,
    governanceCaseResolutionContract: resolutionContract,
    governanceCaseResolutionCompatibilityContract: compatibility,
    governanceCaseResolutionStabilizationProfile: stabilization,
    consumedCaseResolution: consumed,
  });
  if (!validation.ok) {
    throw new Error(
      `governance case resolution validation failed: ${validation.errors.join("; ")}`
    );
  }

  if (
    resolutionProfile.kind !== GOVERNANCE_CASE_RESOLUTION_PROFILE_KIND ||
    resolutionProfile.version !== GOVERNANCE_CASE_RESOLUTION_PROFILE_VERSION ||
    resolutionProfile.schema_id !== GOVERNANCE_CASE_RESOLUTION_PROFILE_SCHEMA_ID ||
    resolutionProfile.governance_case_resolution.stage !==
      GOVERNANCE_CASE_RESOLUTION_PROFILE_STAGE ||
    resolutionProfile.governance_case_resolution.consumer_surface !==
      GOVERNANCE_CASE_RESOLUTION_CONSUMER_SURFACE ||
    resolutionProfile.governance_case_resolution.boundary !==
      GOVERNANCE_CASE_RESOLUTION_PROFILE_BOUNDARY
  ) {
    throw new Error("governance case resolution profile envelope drifted");
  }

  const context = resolutionProfile.governance_case_resolution.resolution_context;
  if (
    context.resolution_status !== GOVERNANCE_CASE_RESOLUTION_STATUS_DOCUMENTED ||
    context.resolution_mode !== GOVERNANCE_CASE_RESOLUTION_MODE_RECOMMENDATION_ONLY ||
    context.closure_readiness.level !== GOVERNANCE_CASE_RESOLUTION_CLOSURE_READY
  ) {
    throw new Error("governance case resolution context drifted");
  }

  if (
    resolutionContract.kind !== GOVERNANCE_CASE_RESOLUTION_CONTRACT_KIND ||
    resolutionContract.version !== GOVERNANCE_CASE_RESOLUTION_CONTRACT_VERSION ||
    resolutionContract.boundary !== GOVERNANCE_CASE_RESOLUTION_CONTRACT_BOUNDARY ||
    resolutionContract.recommendation_only !== true ||
    resolutionContract.additive_only !== true ||
    resolutionContract.execution_enabled !== false ||
    resolutionContract.default_on !== false ||
    resolutionContract.actual_escalation_execution !== false ||
    resolutionContract.actual_closure_execution !== false
  ) {
    throw new Error("governance case resolution contract drifted");
  }

  if (
    compatibility.kind !== GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_KIND ||
    compatibility.version !==
      GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_VERSION ||
    compatibility.boundary !==
      GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_BOUNDARY ||
    compatibility.consumer_compatible !== true ||
    compatibility.closure_readiness_available !== true ||
    compatibility.recommendation_only !== true ||
    compatibility.additive_only !== true ||
    compatibility.execution_enabled !== false ||
    compatibility.default_on !== false ||
    compatibility.actual_escalation_execution !== false ||
    compatibility.actual_closure_execution !== false ||
    compatibility.audit_output_preserved !== true ||
    compatibility.audit_verdict_preserved !== true ||
    compatibility.actual_exit_code_preserved !== true ||
    compatibility.denied_exit_code_preserved !== 25 ||
    compatibility.main_path_takeover !== false
  ) {
    throw new Error("governance case resolution compatibility drifted");
  }

  const stabilizationPayload =
    stabilization.governance_case_resolution_stabilization;
  if (
    stabilization.kind !== GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND ||
    stabilization.version !== GOVERNANCE_CASE_RESOLUTION_STABILIZATION_VERSION ||
    stabilization.schema_id !== GOVERNANCE_CASE_RESOLUTION_STABILIZATION_SCHEMA_ID ||
    stabilizationPayload.stage !== GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE ||
    stabilizationPayload.boundary !== GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY ||
    stabilizationPayload.stabilization_contract.readiness_level !==
      GOVERNANCE_CASE_RESOLUTION_STABILIZATION_READY
  ) {
    throw new Error("governance case resolution stabilization drifted");
  }

  if (
    consumed.consumer_surface !== GOVERNANCE_CASE_RESOLUTION_CONSUMER_SURFACE ||
    consumed.recommendation_only !== true ||
    consumed.additive_only !== true ||
    consumed.executing !== false
  ) {
    throw new Error("governance case resolution consumer drifted");
  }
}

if (!GOVERNANCE_CASE_RESOLUTION_SURFACE_MAP.governance_case_resolution) {
  throw new Error("governance case resolution surface entry missing");
}
if (
  !GOVERNANCE_CASE_RESOLUTION_SURFACE_MAP.governance_case_resolution_stabilization
) {
  throw new Error("governance case resolution stabilization surface entry missing");
}
if (!permitExports.GOVERNANCE_CASE_ESCALATION_SURFACE_MAP?.governance_case_escalation) {
  throw new Error("governance case escalation downstream surface entry missing");
}

for (const exportName of GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case resolution stabilization export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_RESOLUTION_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case resolution surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance case resolution boundary verified\n");
