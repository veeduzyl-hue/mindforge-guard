import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_EVIDENCE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_EVIDENCE_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_EVIDENCE_CONTRACT_KIND,
  GOVERNANCE_CASE_EVIDENCE_CONTRACT_VERSION,
  GOVERNANCE_CASE_EVIDENCE_MODE_RECOMMENDATION_ONLY,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_KIND,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_STAGE,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_VERSION,
  GOVERNANCE_CASE_EVIDENCE_STATUS_DOCUMENTED,
  GOVERNANCE_CASE_EVIDENCE_SUPPORT_READY,
  GOVERNANCE_CASE_EVIDENCE_SURFACE_MAP,
  GOVERNANCE_CASE_EVIDENCE_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_EVIDENCE_STABLE_EXPORT_SET,
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
  buildGovernanceCaseEvidenceContract,
  buildGovernanceCaseEvidenceProfile,
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
  consumeGovernanceCaseEvidence,
  validateGovernanceCaseEvidenceBundle,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:4444aaaabbbbcccc4444aaaabbbbcccc4444aaaabbbbcccc4444aaaabbbbcccc",
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

function buildCaseEvidence(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "4444444444444444444444444444444444444444", branch: "branch" },
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
  const resolutionId = `resolution-${decision}`;
  const escalationId = `escalation-${decision}`;
  const closureId = `closure-case-${decision}`;
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
    linkedResolutionIds: [resolutionId],
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
    linkedResolutionIds: [resolutionId],
    linkedEscalationIds: [escalationId],
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
  const caseEvidenceProfile = buildGovernanceCaseEvidenceProfile({
    governanceCaseClosureStabilizationProfile: closureStabilization,
    caseId: `case-${decision}`,
    linkedResolutionIds: [resolutionId],
    linkedEscalationIds: [escalationId],
    linkedClosureIds: [closureId],
    linkedExceptionIds: [`exception-${decision}`],
    linkedOverrideRecordIds: [`override-${decision}`],
  });
  const caseEvidenceContract = buildGovernanceCaseEvidenceContract({
    governanceCaseEvidenceProfile: caseEvidenceProfile,
  });
  const consumed = consumeGovernanceCaseEvidence({
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    governanceCaseEvidenceContract: caseEvidenceContract,
  });

  return {
    caseEvidenceProfile,
    caseEvidenceContract,
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
    caseEvidenceProfile,
    caseEvidenceContract,
    closureStabilization,
    consumed,
  } = buildCaseEvidence(decision);

  const validation = validateGovernanceCaseEvidenceBundle({
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    governanceCaseEvidenceContract: caseEvidenceContract,
    governanceCaseClosureStabilizationProfile: closureStabilization,
    consumedCaseEvidence: consumed,
  });
  if (!validation.ok) {
    throw new Error(
      `governance case evidence validation failed: ${validation.errors.join("; ")}`
    );
  }

  if (
    caseEvidenceProfile.kind !== GOVERNANCE_CASE_EVIDENCE_PROFILE_KIND ||
    caseEvidenceProfile.version !== GOVERNANCE_CASE_EVIDENCE_PROFILE_VERSION ||
    caseEvidenceProfile.schema_id !== GOVERNANCE_CASE_EVIDENCE_PROFILE_SCHEMA_ID ||
    caseEvidenceProfile.governance_case_evidence.stage !==
      GOVERNANCE_CASE_EVIDENCE_PROFILE_STAGE ||
    caseEvidenceProfile.governance_case_evidence.consumer_surface !==
      GOVERNANCE_CASE_EVIDENCE_CONSUMER_SURFACE ||
    caseEvidenceProfile.governance_case_evidence.boundary !==
      GOVERNANCE_CASE_EVIDENCE_PROFILE_BOUNDARY
  ) {
    throw new Error("governance case evidence profile envelope drifted");
  }

  const context = caseEvidenceProfile.governance_case_evidence.evidence_context;
  if (
    context.evidence_status !== GOVERNANCE_CASE_EVIDENCE_STATUS_DOCUMENTED ||
    context.evidence_mode !== GOVERNANCE_CASE_EVIDENCE_MODE_RECOMMENDATION_ONLY ||
    context.support_readiness.level !== GOVERNANCE_CASE_EVIDENCE_SUPPORT_READY ||
    context.support_readiness.recommendation_only !== true ||
    context.support_readiness.non_executing !== true ||
    context.support_readiness.default_off !== true ||
    context.support_readiness.actual_execution !== false
  ) {
    throw new Error("governance case evidence context drifted");
  }

  if (
    caseEvidenceContract.kind !== GOVERNANCE_CASE_EVIDENCE_CONTRACT_KIND ||
    caseEvidenceContract.version !== GOVERNANCE_CASE_EVIDENCE_CONTRACT_VERSION ||
    caseEvidenceContract.boundary !== GOVERNANCE_CASE_EVIDENCE_CONTRACT_BOUNDARY ||
    caseEvidenceContract.supporting_artifact_only !== true ||
    caseEvidenceContract.recommendation_only !== true ||
    caseEvidenceContract.additive_only !== true ||
    caseEvidenceContract.non_executing !== true ||
    caseEvidenceContract.default_off !== true ||
    caseEvidenceContract.execution_enabled !== false ||
    caseEvidenceContract.actual_resolution_execution !== false ||
    caseEvidenceContract.actual_escalation_execution !== false ||
    caseEvidenceContract.actual_closure_execution !== false ||
    caseEvidenceContract.automatic_routing !== false ||
    caseEvidenceContract.automatic_case_finalization !== false ||
    caseEvidenceContract.authority_scope_expansion !== false ||
    caseEvidenceContract.main_path_takeover !== false ||
    caseEvidenceContract.new_governance_object !== false
  ) {
    throw new Error("governance case evidence contract drifted");
  }

  if (
    consumed.consumer_surface !== GOVERNANCE_CASE_EVIDENCE_CONSUMER_SURFACE ||
    consumed.supporting_artifact_only !== true ||
    consumed.recommendation_only !== true ||
    consumed.additive_only !== true ||
    consumed.executing !== false
  ) {
    throw new Error("governance case evidence consumer drifted");
  }

  const closureContinuity =
    closureStabilization.governance_case_closure_stabilization.continuity_ref;
  if (
    caseEvidenceProfile.canonical_action_hash !== closureStabilization.canonical_action_hash ||
    context.case_id !== closureContinuity.case_id ||
    JSON.stringify(context.linked_resolution_ids) !==
      JSON.stringify(closureContinuity.linked_resolution_ids) ||
    JSON.stringify(context.linked_escalation_ids) !==
      JSON.stringify(closureContinuity.linked_escalation_ids) ||
    JSON.stringify(context.linked_exception_ids) !==
      JSON.stringify(closureContinuity.linked_exception_ids) ||
    JSON.stringify(context.linked_override_record_ids) !==
      JSON.stringify(closureContinuity.linked_override_record_ids)
  ) {
    throw new Error("governance case evidence continuity linkage drifted");
  }
}

{
  const {
    caseEvidenceProfile,
    caseEvidenceContract,
    closureStabilization,
    consumed,
  } = buildCaseEvidence("would_allow");

  const hashMismatchProfile = cloneJson(caseEvidenceProfile);
  hashMismatchProfile.canonical_action_hash =
    "sha256:mismatched-case-evidence-canonical-action-hash";
  let hashMismatchRejected = false;
  const hashMismatchValidation = validateGovernanceCaseEvidenceBundle({
    governanceCaseEvidenceProfile: hashMismatchProfile,
    governanceCaseEvidenceContract: caseEvidenceContract,
    governanceCaseClosureStabilizationProfile: closureStabilization,
    consumedCaseEvidence: consumed,
  });
  if (
    !hashMismatchValidation.ok &&
    hashMismatchValidation.errors.some((error) =>
      error.includes("canonical_action_hash")
    )
  ) {
    hashMismatchRejected = true;
  }
  if (!hashMismatchRejected) {
    throw new Error("governance case evidence must reject canonical lineage mismatch");
  }

  const caseMismatchProfile = cloneJson(caseEvidenceProfile);
  caseMismatchProfile.governance_case_evidence.evidence_context.case_id =
    "case-mismatch";
  const caseMismatchValidation = validateGovernanceCaseEvidenceBundle({
    governanceCaseEvidenceProfile: caseMismatchProfile,
    governanceCaseEvidenceContract: caseEvidenceContract,
    governanceCaseClosureStabilizationProfile: closureStabilization,
    consumedCaseEvidence: consumed,
  });
  if (
    caseMismatchValidation.ok ||
    !caseMismatchValidation.errors.some((error) => error.includes("case_id"))
  ) {
    throw new Error("governance case evidence must reject case continuity mismatch");
  }

  const resolutionMismatchProfile = cloneJson(caseEvidenceProfile);
  resolutionMismatchProfile.governance_case_evidence.evidence_context.linked_resolution_ids =
    ["resolution-mismatch"];
  const resolutionMismatchValidation = validateGovernanceCaseEvidenceBundle({
    governanceCaseEvidenceProfile: resolutionMismatchProfile,
    governanceCaseEvidenceContract: caseEvidenceContract,
    governanceCaseClosureStabilizationProfile: closureStabilization,
    consumedCaseEvidence: consumed,
  });
  if (
    resolutionMismatchValidation.ok ||
    !resolutionMismatchValidation.errors.some((error) =>
      error.includes("linked_resolution_ids")
    )
  ) {
    throw new Error("governance case evidence must reject linked_resolution_ids mismatch");
  }

  const escalationMismatchProfile = cloneJson(caseEvidenceProfile);
  escalationMismatchProfile.governance_case_evidence.evidence_context.linked_escalation_ids =
    ["escalation-mismatch"];
  const escalationMismatchValidation = validateGovernanceCaseEvidenceBundle({
    governanceCaseEvidenceProfile: escalationMismatchProfile,
    governanceCaseEvidenceContract: caseEvidenceContract,
    governanceCaseClosureStabilizationProfile: closureStabilization,
    consumedCaseEvidence: consumed,
  });
  if (
    escalationMismatchValidation.ok ||
    !escalationMismatchValidation.errors.some((error) =>
      error.includes("linked_escalation_ids")
    )
  ) {
    throw new Error("governance case evidence must reject linked_escalation_ids mismatch");
  }

  const closureMismatchProfile = cloneJson(caseEvidenceProfile);
  closureMismatchProfile.governance_case_evidence.evidence_context.linked_closure_ids =
    ["closure-mismatch"];
  const closureMismatchValidation = validateGovernanceCaseEvidenceBundle({
    governanceCaseEvidenceProfile: closureMismatchProfile,
    governanceCaseEvidenceContract: caseEvidenceContract,
    governanceCaseClosureStabilizationProfile: closureStabilization,
    consumedCaseEvidence: consumed,
  });
  if (
    closureMismatchValidation.ok ||
    !closureMismatchValidation.errors.some((error) =>
      error.includes("linked_closure_ids")
    )
  ) {
    throw new Error("governance case evidence must reject linked_closure_ids mismatch");
  }

  const exceptionMismatchProfile = cloneJson(caseEvidenceProfile);
  exceptionMismatchProfile.governance_case_evidence.evidence_context.linked_exception_ids =
    ["exception-mismatch"];
  const exceptionMismatchValidation = validateGovernanceCaseEvidenceBundle({
    governanceCaseEvidenceProfile: exceptionMismatchProfile,
    governanceCaseEvidenceContract: caseEvidenceContract,
    governanceCaseClosureStabilizationProfile: closureStabilization,
    consumedCaseEvidence: consumed,
  });
  if (
    exceptionMismatchValidation.ok ||
    !exceptionMismatchValidation.errors.some((error) =>
      error.includes("linked_exception_ids")
    )
  ) {
    throw new Error("governance case evidence must reject linked_exception_ids mismatch");
  }

  const overrideMismatchProfile = cloneJson(caseEvidenceProfile);
  overrideMismatchProfile.governance_case_evidence.evidence_context.linked_override_record_ids =
    ["override-mismatch"];
  const overrideMismatchValidation = validateGovernanceCaseEvidenceBundle({
    governanceCaseEvidenceProfile: overrideMismatchProfile,
    governanceCaseEvidenceContract: caseEvidenceContract,
    governanceCaseClosureStabilizationProfile: closureStabilization,
    consumedCaseEvidence: consumed,
  });
  if (
    overrideMismatchValidation.ok ||
    !overrideMismatchValidation.errors.some((error) =>
      error.includes("linked_override_record_ids")
    )
  ) {
    throw new Error(
      "governance case evidence must reject linked_override_record_ids mismatch"
    );
  }
}

if (!GOVERNANCE_CASE_EVIDENCE_SURFACE_MAP.governance_case_evidence) {
  throw new Error("governance case evidence surface entry missing");
}
if (!permitExports.GOVERNANCE_CASE_EVIDENCE_SURFACE_MAP?.governance_case_evidence) {
  throw new Error("governance case evidence surface export missing from permit index");
}

for (const exportName of GOVERNANCE_CASE_EVIDENCE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case evidence export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_EVIDENCE_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case evidence surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance case evidence boundary verified\n");
