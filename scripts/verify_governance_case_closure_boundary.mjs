import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_VERSION,
  GOVERNANCE_CASE_CLOSURE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_CLOSURE_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_CLOSURE_CONTRACT_KIND,
  GOVERNANCE_CASE_CLOSURE_CONTRACT_VERSION,
  GOVERNANCE_CASE_CLOSURE_MODE_RECOMMENDATION_ONLY,
  GOVERNANCE_CASE_CLOSURE_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_CLOSURE_PROFILE_KIND,
  GOVERNANCE_CASE_CLOSURE_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_CLOSURE_PROFILE_STAGE,
  GOVERNANCE_CASE_CLOSURE_PROFILE_VERSION,
  GOVERNANCE_CASE_POST_CLOSURE_OBSERVATION_READY,
  GOVERNANCE_CASE_CLOSURE_READY,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_BOUNDARY,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_KIND,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_READY,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_SCHEMA_ID,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_STAGE,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_VERSION,
  GOVERNANCE_CASE_CLOSURE_STATUS_DOCUMENTED,
  GOVERNANCE_CASE_CLOSURE_SURFACE_MAP,
  GOVERNANCE_CASE_CLOSURE_SURFACE_STABLE_EXPORT_SET,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildApprovalStabilizationProfile,
  buildEnforcementCompatibilityProfile,
  buildEnforcementReadinessProfile,
  buildEnforcementStabilizationProfile,
  buildGovernanceCaseClosureCompatibilityContract,
  buildGovernanceCaseClosureContract,
  buildGovernanceCaseClosureProfile,
  buildGovernanceCaseClosureStabilizationProfile,
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
  consumeGovernanceCaseClosure,
  validateGovernanceCaseClosureBundle,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:eeeeffffeeeeffffeeeeffffeeeeffffeeeeffffeeeeffffeeeeffffeeeeffff",
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

function buildCaseClosure(decision) {
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
  const closureProfile = buildGovernanceCaseClosureProfile({
    governanceCaseEscalationStabilizationProfile: escalationStabilization,
    caseId: `case-${decision}`,
    linkedExceptionIds: [`exception-${decision}`],
    linkedOverrideRecordIds: [`override-${decision}`],
    linkedResolutionIds: [`resolution-${decision}`],
    linkedEscalationIds: [`escalation-${decision}`],
  });
  const closureContract = buildGovernanceCaseClosureContract({
    governanceCaseClosureProfile: closureProfile,
  });
  const closureCompatibility = buildGovernanceCaseClosureCompatibilityContract({
    governanceCaseClosureContract: closureContract,
  });
  const closureStabilization = buildGovernanceCaseClosureStabilizationProfile({
    governanceCaseClosureProfile: closureProfile,
    governanceCaseClosureCompatibilityContract: closureCompatibility,
  });
  const consumed = consumeGovernanceCaseClosure({
    governanceCaseClosureProfile: closureProfile,
    governanceCaseClosureCompatibilityContract: closureCompatibility,
    governanceCaseClosureStabilizationProfile: closureStabilization,
  });
  return {
    closureProfile,
    closureContract,
    closureCompatibility,
    closureStabilization,
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
    closureProfile,
    closureContract,
    closureCompatibility,
    closureStabilization,
    consumed,
  } = buildCaseClosure(decision);

  const validation = validateGovernanceCaseClosureBundle({
    governanceCaseClosureProfile: closureProfile,
    governanceCaseClosureContract: closureContract,
    governanceCaseClosureCompatibilityContract: closureCompatibility,
    governanceCaseClosureStabilizationProfile: closureStabilization,
    consumedCaseClosure: consumed,
  });
  if (!validation.ok) {
    throw new Error(
      `governance case closure validation failed: ${validation.errors.join("; ")}`
    );
  }

  if (
    closureProfile.kind !== GOVERNANCE_CASE_CLOSURE_PROFILE_KIND ||
    closureProfile.version !== GOVERNANCE_CASE_CLOSURE_PROFILE_VERSION ||
    closureProfile.schema_id !== GOVERNANCE_CASE_CLOSURE_PROFILE_SCHEMA_ID ||
    closureProfile.governance_case_closure.stage !==
      GOVERNANCE_CASE_CLOSURE_PROFILE_STAGE ||
    closureProfile.governance_case_closure.consumer_surface !==
      GOVERNANCE_CASE_CLOSURE_CONSUMER_SURFACE ||
    closureProfile.governance_case_closure.boundary !==
      GOVERNANCE_CASE_CLOSURE_PROFILE_BOUNDARY
  ) {
    throw new Error("governance case closure profile envelope drifted");
  }

  const context = closureProfile.governance_case_closure.closure_context;
  if (
    context.closure_status !== GOVERNANCE_CASE_CLOSURE_STATUS_DOCUMENTED ||
    context.closure_mode !== GOVERNANCE_CASE_CLOSURE_MODE_RECOMMENDATION_ONLY ||
    context.closure_readiness.level !== GOVERNANCE_CASE_CLOSURE_READY ||
    context.closure_readiness.recommendation_only !== true ||
    context.closure_readiness.actual_closure_execution !== false ||
    context.closure_readiness.workflow_transition !== false ||
    context.post_closure_observation_readiness.level !==
      GOVERNANCE_CASE_POST_CLOSURE_OBSERVATION_READY
  ) {
    throw new Error("governance case closure context drifted");
  }

  if (
    closureContract.kind !== GOVERNANCE_CASE_CLOSURE_CONTRACT_KIND ||
    closureContract.version !== GOVERNANCE_CASE_CLOSURE_CONTRACT_VERSION ||
    closureContract.boundary !== GOVERNANCE_CASE_CLOSURE_CONTRACT_BOUNDARY ||
    closureContract.recommendation_only !== true ||
    closureContract.additive_only !== true ||
    closureContract.execution_enabled !== false ||
    closureContract.default_on !== false ||
    closureContract.actual_closure_execution !== false ||
    closureContract.actual_routing !== false ||
    closureContract.workflow_transition !== false
  ) {
    throw new Error("governance case closure contract drifted");
  }

  if (
    closureCompatibility.kind !==
      GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_KIND ||
    closureCompatibility.version !==
      GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_VERSION ||
    closureCompatibility.boundary !==
      GOVERNANCE_CASE_CLOSURE_COMPATIBILITY_CONTRACT_BOUNDARY ||
    closureCompatibility.consumer_compatible !== true ||
    closureCompatibility.closure_readiness_available !== true ||
    closureCompatibility.post_closure_observation_readiness_available !== true ||
    closureCompatibility.recommendation_only !== true ||
    closureCompatibility.additive_only !== true ||
    closureCompatibility.execution_enabled !== false ||
    closureCompatibility.default_on !== false ||
    closureCompatibility.actual_closure_execution !== false ||
    closureCompatibility.actual_routing !== false ||
    closureCompatibility.workflow_transition !== false ||
    closureCompatibility.audit_output_preserved !== true ||
    closureCompatibility.audit_verdict_preserved !== true ||
    closureCompatibility.actual_exit_code_preserved !== true ||
    closureCompatibility.denied_exit_code_preserved !== 25 ||
    closureCompatibility.main_path_takeover !== false
  ) {
    throw new Error("governance case closure compatibility drifted");
  }

  const stabilizationPayload =
    closureStabilization.governance_case_closure_stabilization;
  if (
    closureStabilization.kind !== GOVERNANCE_CASE_CLOSURE_STABILIZATION_KIND ||
    closureStabilization.version !==
      GOVERNANCE_CASE_CLOSURE_STABILIZATION_VERSION ||
    closureStabilization.schema_id !==
      GOVERNANCE_CASE_CLOSURE_STABILIZATION_SCHEMA_ID ||
    stabilizationPayload.stage !== GOVERNANCE_CASE_CLOSURE_STABILIZATION_STAGE ||
    stabilizationPayload.boundary !==
      GOVERNANCE_CASE_CLOSURE_STABILIZATION_BOUNDARY ||
    stabilizationPayload.stabilization_contract.readiness_level !==
      GOVERNANCE_CASE_CLOSURE_STABILIZATION_READY ||
    stabilizationPayload.stabilization_contract.actual_closure_execution !== false ||
    stabilizationPayload.stabilization_contract.actual_routing !== false ||
    stabilizationPayload.stabilization_contract.workflow_transition !== false
  ) {
    throw new Error("governance case closure stabilization drifted");
  }

  if (
    consumed.consumer_surface !== GOVERNANCE_CASE_CLOSURE_CONSUMER_SURFACE ||
    consumed.recommendation_only !== true ||
    consumed.additive_only !== true ||
    consumed.executing !== false ||
    consumed.closure_readiness.actual_closure_execution !== false
  ) {
    throw new Error("governance case closure consumer drifted");
  }
}

if (!GOVERNANCE_CASE_CLOSURE_SURFACE_MAP.governance_case_closure) {
  throw new Error("governance case closure surface entry missing");
}
if (
  !GOVERNANCE_CASE_CLOSURE_SURFACE_MAP.governance_case_closure_stabilization
) {
  throw new Error("governance case closure stabilization surface entry missing");
}
if (
  !permitExports.GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_MAP
    ?.governance_case_final_acceptance
) {
  throw new Error("governance case final acceptance downstream surface entry missing");
}

for (const exportName of GOVERNANCE_CASE_CLOSURE_STABILIZATION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case closure stabilization export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_CLOSURE_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case closure surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance case closure boundary verified\n");
