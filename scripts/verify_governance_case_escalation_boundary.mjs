import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_VERSION,
  GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_ESCALATION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_CONTRACT_KIND,
  GOVERNANCE_CASE_ESCALATION_CONTRACT_VERSION,
  GOVERNANCE_CASE_ESCALATION_CLOSURE_READY,
  GOVERNANCE_CASE_ESCALATION_LANE_REVIEW_COUNCIL,
  GOVERNANCE_CASE_ESCALATION_MODE_RECOMMENDATION_ONLY,
  GOVERNANCE_CASE_ESCALATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_PROFILE_KIND,
  GOVERNANCE_CASE_ESCALATION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_ESCALATION_PROFILE_STAGE,
  GOVERNANCE_CASE_ESCALATION_PROFILE_VERSION,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_READY,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_SCHEMA_ID,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_VERSION,
  GOVERNANCE_CASE_ESCALATION_STATUS_DOCUMENTED,
  GOVERNANCE_CASE_ESCALATION_SURFACE_MAP,
  GOVERNANCE_CASE_ESCALATION_SURFACE_STABLE_EXPORT_SET,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildApprovalStabilizationProfile,
  buildEnforcementCompatibilityProfile,
  buildEnforcementReadinessProfile,
  buildEnforcementStabilizationProfile,
  buildGovernanceCaseEscalationCompatibilityContract,
  buildGovernanceCaseEscalationContract,
  buildGovernanceCaseEscalationProfile,
  buildGovernanceCaseEscalationStabilizationProfile,
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
  consumeGovernanceCaseEscalation,
  validateGovernanceCaseEscalationBundle,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:ddddeeeeddddeeeeddddeeeeddddeeeeddddeeeeddddeeeeddddeeeeddddeeee",
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

function buildCaseEscalation(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "dddddddddddddddddddddddddddddddddddddddd", branch: "branch" },
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
  buildGovernanceOverrideRecordContract({
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
  const resolutionCompatibility = buildGovernanceCaseResolutionCompatibilityContract({
    governanceCaseResolutionContract: resolutionContract,
  });
  const resolutionStabilization = buildGovernanceCaseResolutionStabilizationProfile({
    governanceCaseResolutionProfile: resolutionProfile,
    governanceCaseResolutionCompatibilityContract: resolutionCompatibility,
  });
  const escalationProfile = buildGovernanceCaseEscalationProfile({
    governanceCaseResolutionStabilizationProfile: resolutionStabilization,
    caseId: `case-${decision}`,
    linkedExceptionIds: [`exception-${decision}`],
    linkedOverrideRecordIds: [`override-${decision}`],
    linkedResolutionIds: [`resolution-${decision}`],
  });
  const escalationContract = buildGovernanceCaseEscalationContract({
    governanceCaseEscalationProfile: escalationProfile,
  });
  const escalationCompatibility = buildGovernanceCaseEscalationCompatibilityContract({
    governanceCaseEscalationContract: escalationContract,
  });
  const escalationStabilization = buildGovernanceCaseEscalationStabilizationProfile({
    governanceCaseEscalationProfile: escalationProfile,
    governanceCaseEscalationCompatibilityContract: escalationCompatibility,
  });
  const consumed = consumeGovernanceCaseEscalation({
    governanceCaseEscalationProfile: escalationProfile,
    governanceCaseEscalationCompatibilityContract: escalationCompatibility,
    governanceCaseEscalationStabilizationProfile: escalationStabilization,
  });
  return {
    escalationProfile,
    escalationContract,
    escalationCompatibility,
    escalationStabilization,
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
    escalationProfile,
    escalationContract,
    escalationCompatibility,
    escalationStabilization,
    consumed,
  } = buildCaseEscalation(decision);

  const validation = validateGovernanceCaseEscalationBundle({
    governanceCaseEscalationProfile: escalationProfile,
    governanceCaseEscalationContract: escalationContract,
    governanceCaseEscalationCompatibilityContract: escalationCompatibility,
    governanceCaseEscalationStabilizationProfile: escalationStabilization,
    consumedCaseEscalation: consumed,
  });
  if (!validation.ok) {
    throw new Error(
      `governance case escalation validation failed: ${validation.errors.join("; ")}`
    );
  }

  if (
    escalationProfile.kind !== GOVERNANCE_CASE_ESCALATION_PROFILE_KIND ||
    escalationProfile.version !== GOVERNANCE_CASE_ESCALATION_PROFILE_VERSION ||
    escalationProfile.schema_id !== GOVERNANCE_CASE_ESCALATION_PROFILE_SCHEMA_ID ||
    escalationProfile.governance_case_escalation.stage !==
      GOVERNANCE_CASE_ESCALATION_PROFILE_STAGE ||
    escalationProfile.governance_case_escalation.consumer_surface !==
      GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE ||
    escalationProfile.governance_case_escalation.boundary !==
      GOVERNANCE_CASE_ESCALATION_PROFILE_BOUNDARY
  ) {
    throw new Error("governance case escalation profile envelope drifted");
  }

  const context = escalationProfile.governance_case_escalation.escalation_context;
  if (
    context.escalation_status !== GOVERNANCE_CASE_ESCALATION_STATUS_DOCUMENTED ||
    context.escalation_mode !==
      GOVERNANCE_CASE_ESCALATION_MODE_RECOMMENDATION_ONLY ||
    context.recommended_escalation_lane.lane !==
      GOVERNANCE_CASE_ESCALATION_LANE_REVIEW_COUNCIL ||
    context.recommended_escalation_lane.recommendation_only !== true ||
    context.recommended_escalation_lane.actual_routing !== false ||
    context.closure_readiness.level !== GOVERNANCE_CASE_ESCALATION_CLOSURE_READY
  ) {
    throw new Error("governance case escalation context drifted");
  }

  if (
    escalationContract.kind !== GOVERNANCE_CASE_ESCALATION_CONTRACT_KIND ||
    escalationContract.version !== GOVERNANCE_CASE_ESCALATION_CONTRACT_VERSION ||
    escalationContract.boundary !== GOVERNANCE_CASE_ESCALATION_CONTRACT_BOUNDARY ||
    escalationContract.recommendation_only !== true ||
    escalationContract.additive_only !== true ||
    escalationContract.execution_enabled !== false ||
    escalationContract.default_on !== false ||
    escalationContract.actual_escalation_execution !== false ||
    escalationContract.actual_routing !== false ||
    escalationContract.actual_closure_execution !== false
  ) {
    throw new Error("governance case escalation contract drifted");
  }

  if (
    escalationCompatibility.kind !==
      GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_KIND ||
    escalationCompatibility.version !==
      GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_VERSION ||
    escalationCompatibility.boundary !==
      GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_BOUNDARY ||
    escalationCompatibility.consumer_compatible !== true ||
    escalationCompatibility.escalation_lane_available !== true ||
    escalationCompatibility.closure_readiness_available !== true ||
    escalationCompatibility.recommendation_only !== true ||
    escalationCompatibility.additive_only !== true ||
    escalationCompatibility.execution_enabled !== false ||
    escalationCompatibility.default_on !== false ||
    escalationCompatibility.actual_escalation_execution !== false ||
    escalationCompatibility.actual_routing !== false ||
    escalationCompatibility.actual_closure_execution !== false ||
    escalationCompatibility.audit_output_preserved !== true ||
    escalationCompatibility.audit_verdict_preserved !== true ||
    escalationCompatibility.actual_exit_code_preserved !== true ||
    escalationCompatibility.denied_exit_code_preserved !== 25 ||
    escalationCompatibility.main_path_takeover !== false
  ) {
    throw new Error("governance case escalation compatibility drifted");
  }

  const stabilizationPayload =
    escalationStabilization.governance_case_escalation_stabilization;
  if (
    escalationStabilization.kind !== GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND ||
    escalationStabilization.version !==
      GOVERNANCE_CASE_ESCALATION_STABILIZATION_VERSION ||
    escalationStabilization.schema_id !==
      GOVERNANCE_CASE_ESCALATION_STABILIZATION_SCHEMA_ID ||
    stabilizationPayload.stage !== GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE ||
    stabilizationPayload.boundary !==
      GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY ||
    stabilizationPayload.stabilization_contract.readiness_level !==
      GOVERNANCE_CASE_ESCALATION_STABILIZATION_READY ||
    stabilizationPayload.stabilization_contract.actual_routing !== false
  ) {
    throw new Error("governance case escalation stabilization drifted");
  }

  if (
    consumed.consumer_surface !== GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE ||
    consumed.recommendation_only !== true ||
    consumed.additive_only !== true ||
    consumed.executing !== false ||
    consumed.recommended_escalation_lane.actual_routing !== false
  ) {
    throw new Error("governance case escalation consumer drifted");
  }
}

if (!GOVERNANCE_CASE_ESCALATION_SURFACE_MAP.governance_case_escalation) {
  throw new Error("governance case escalation surface entry missing");
}
if (
  !GOVERNANCE_CASE_ESCALATION_SURFACE_MAP.governance_case_escalation_stabilization
) {
  throw new Error("governance case escalation stabilization surface entry missing");
}

for (const exportName of GOVERNANCE_CASE_ESCALATION_STABILIZATION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case escalation stabilization export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_ESCALATION_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case escalation surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance case escalation boundary verified\n");
