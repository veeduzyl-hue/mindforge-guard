import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_INCONCLUSIVE,
  GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_STATUS_NEEDS_MORE_EVIDENCE,
  GOVERNANCE_CASE_REVIEW_DECISION_SURFACE_MAP,
  GOVERNANCE_CASE_REVIEW_DECISION_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_STABLE_EXPORT_SET,
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
  buildGovernanceCaseReviewDecisionContract,
  buildGovernanceCaseReviewDecisionProfile,
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
  consumeGovernanceCaseReviewDecision,
  validateGovernanceCaseReviewDecisionBundle,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:5555aaaabbbbcccc5555aaaabbbbcccc5555aaaabbbbcccc5555aaaabbbbcccc",
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

function buildCaseReviewDecision(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "5555555555555555555555555555555555555555", branch: "branch" },
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
  const caseId = `case-${decision}`;
  const resolutionId = `resolution-${decision}`;
  const escalationId = `escalation-${decision}`;
  const closureId = `closure-${caseId}`;
  const evidenceId = `evidence-${caseId}`;
  const resolutionProfile = buildGovernanceCaseResolutionProfile({
    governanceExceptionStabilizationProfile: exceptionStabilization,
    caseId,
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
    caseId,
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
    caseId,
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
    caseId,
    linkedResolutionIds: [resolutionId],
    linkedEscalationIds: [escalationId],
    linkedClosureIds: [closureId],
    linkedExceptionIds: [`exception-${decision}`],
    linkedOverrideRecordIds: [`override-${decision}`],
  });
  const caseEvidenceContract = buildGovernanceCaseEvidenceContract({
    governanceCaseEvidenceProfile: caseEvidenceProfile,
  });
  const caseReviewDecisionProfile = buildGovernanceCaseReviewDecisionProfile({
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    caseId,
    reviewDecisionId: `review-decision-${decision}`,
    reviewStatus: GOVERNANCE_CASE_REVIEW_DECISION_STATUS_NEEDS_MORE_EVIDENCE,
    evidenceSufficiency: GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_INCONCLUSIVE,
    linkedEvidenceIds: [evidenceId],
    linkedResolutionIds: [resolutionId],
    linkedEscalationIds: [escalationId],
    linkedClosureIds: [closureId],
  });
  const caseReviewDecisionContract = buildGovernanceCaseReviewDecisionContract({
    governanceCaseReviewDecisionProfile: caseReviewDecisionProfile,
  });
  const consumed = consumeGovernanceCaseReviewDecision({
    governanceCaseReviewDecisionProfile: caseReviewDecisionProfile,
    governanceCaseReviewDecisionContract: caseReviewDecisionContract,
  });

  return {
    caseReviewDecisionProfile,
    caseReviewDecisionContract,
    caseEvidenceProfile,
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
    caseReviewDecisionProfile,
    caseReviewDecisionContract,
    caseEvidenceProfile,
    consumed,
  } = buildCaseReviewDecision(decision);

  const validation = validateGovernanceCaseReviewDecisionBundle({
    governanceCaseReviewDecisionProfile: caseReviewDecisionProfile,
    governanceCaseReviewDecisionContract: caseReviewDecisionContract,
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    consumedCaseReviewDecision: consumed,
  });
  if (!validation.ok) {
    throw new Error(
      `governance case review decision validation failed: ${validation.errors.join("; ")}`
    );
  }

  if (
    caseReviewDecisionProfile.kind !== GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_KIND ||
    caseReviewDecisionProfile.version !== GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_VERSION ||
    caseReviewDecisionProfile.schema_id !== GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_SCHEMA_ID ||
    caseReviewDecisionProfile.governance_case_review_decision.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_STAGE ||
    caseReviewDecisionProfile.governance_case_review_decision.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE ||
    caseReviewDecisionProfile.governance_case_review_decision.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_BOUNDARY
  ) {
    throw new Error("governance case review decision profile envelope drifted");
  }

  const context =
    caseReviewDecisionProfile.governance_case_review_decision.review_decision_context;
  if (
    context.review_status !== GOVERNANCE_CASE_REVIEW_DECISION_STATUS_NEEDS_MORE_EVIDENCE ||
    context.evidence_sufficiency !==
      GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_INCONCLUSIVE
  ) {
    throw new Error("governance case review decision bounded values drifted");
  }

  if (
    caseReviewDecisionContract.kind !== GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_KIND ||
    caseReviewDecisionContract.version !== GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_VERSION ||
    caseReviewDecisionContract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_BOUNDARY ||
    caseReviewDecisionContract.supporting_artifact_only !== true ||
    caseReviewDecisionContract.recommendation_only !== true ||
    caseReviewDecisionContract.additive_only !== true ||
    caseReviewDecisionContract.non_executing !== true ||
    caseReviewDecisionContract.default_off !== true ||
    caseReviewDecisionContract.execution_enabled !== false ||
    caseReviewDecisionContract.actual_resolution_execution !== false ||
    caseReviewDecisionContract.actual_escalation_execution !== false ||
    caseReviewDecisionContract.actual_closure_execution !== false ||
    caseReviewDecisionContract.automatic_routing !== false ||
    caseReviewDecisionContract.automatic_case_finalization !== false ||
    caseReviewDecisionContract.authority_scope_expansion !== false ||
    caseReviewDecisionContract.main_path_takeover !== false ||
    caseReviewDecisionContract.new_governance_object !== false
  ) {
    throw new Error("governance case review decision contract drifted");
  }

  if (
    consumed.consumer_surface !== GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE ||
    consumed.supporting_artifact_only !== true ||
    consumed.recommendation_only !== true ||
    consumed.additive_only !== true ||
    consumed.executing !== false
  ) {
    throw new Error("governance case review decision consumer drifted");
  }

  const evidenceContext =
    caseEvidenceProfile.governance_case_evidence.evidence_context;
  if (
    caseReviewDecisionProfile.canonical_action_hash !==
      caseEvidenceProfile.canonical_action_hash ||
    context.case_id !== evidenceContext.case_id ||
    JSON.stringify(context.linked_resolution_ids) !==
      JSON.stringify(evidenceContext.linked_resolution_ids) ||
    JSON.stringify(context.linked_escalation_ids) !==
      JSON.stringify(evidenceContext.linked_escalation_ids) ||
    JSON.stringify(context.linked_closure_ids) !==
      JSON.stringify(evidenceContext.linked_closure_ids)
  ) {
    throw new Error("governance case review decision continuity linkage drifted");
  }
}

{
  const {
    caseReviewDecisionProfile,
    caseReviewDecisionContract,
    caseEvidenceProfile,
    consumed,
  } = buildCaseReviewDecision("would_allow");

  const hashMismatchProfile = cloneJson(caseReviewDecisionProfile);
  hashMismatchProfile.canonical_action_hash =
    "sha256:mismatched-case-review-decision-canonical-action-hash";
  const hashMismatchValidation = validateGovernanceCaseReviewDecisionBundle({
    governanceCaseReviewDecisionProfile: hashMismatchProfile,
    governanceCaseReviewDecisionContract: caseReviewDecisionContract,
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    consumedCaseReviewDecision: consumed,
  });
  if (
    hashMismatchValidation.ok ||
    !hashMismatchValidation.errors.some((error) =>
      error.includes("canonical_action_hash")
    )
  ) {
    throw new Error(
      "governance case review decision must reject canonical lineage mismatch"
    );
  }

  const caseMismatchProfile = cloneJson(caseReviewDecisionProfile);
  caseMismatchProfile.governance_case_review_decision.review_decision_context.case_id =
    "case-mismatch";
  const caseMismatchValidation = validateGovernanceCaseReviewDecisionBundle({
    governanceCaseReviewDecisionProfile: caseMismatchProfile,
    governanceCaseReviewDecisionContract: caseReviewDecisionContract,
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    consumedCaseReviewDecision: consumed,
  });
  if (
    caseMismatchValidation.ok ||
    !caseMismatchValidation.errors.some((error) => error.includes("case_id"))
  ) {
    throw new Error("governance case review decision must reject case continuity mismatch");
  }

  const evidenceMismatchProfile = cloneJson(caseReviewDecisionProfile);
  evidenceMismatchProfile.governance_case_review_decision.review_decision_context.linked_evidence_ids =
    ["evidence-mismatch"];
  const evidenceMismatchValidation = validateGovernanceCaseReviewDecisionBundle({
    governanceCaseReviewDecisionProfile: evidenceMismatchProfile,
    governanceCaseReviewDecisionContract: caseReviewDecisionContract,
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    consumedCaseReviewDecision: consumed,
  });
  if (
    evidenceMismatchValidation.ok ||
    !evidenceMismatchValidation.errors.some((error) =>
      error.includes("linked_evidence_ids")
    )
  ) {
    throw new Error(
      "governance case review decision must reject linked_evidence_ids mismatch"
    );
  }

  const statusMismatchProfile = cloneJson(caseReviewDecisionProfile);
  statusMismatchProfile.governance_case_review_decision.review_decision_context.review_status =
    "invalid_status";
  const statusMismatchValidation = validateGovernanceCaseReviewDecisionBundle({
    governanceCaseReviewDecisionProfile: statusMismatchProfile,
    governanceCaseReviewDecisionContract: caseReviewDecisionContract,
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    consumedCaseReviewDecision: consumed,
  });
  if (
    statusMismatchValidation.ok ||
    !statusMismatchValidation.errors.some((error) =>
      error.includes("review_status")
    )
  ) {
    throw new Error(
      "governance case review decision must reject invalid review_status values"
    );
  }

  const sufficiencyMismatchProfile = cloneJson(caseReviewDecisionProfile);
  sufficiencyMismatchProfile.governance_case_review_decision.review_decision_context.evidence_sufficiency =
    "invalid_sufficiency";
  const sufficiencyMismatchValidation = validateGovernanceCaseReviewDecisionBundle({
    governanceCaseReviewDecisionProfile: sufficiencyMismatchProfile,
    governanceCaseReviewDecisionContract: caseReviewDecisionContract,
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    consumedCaseReviewDecision: consumed,
  });
  if (
    sufficiencyMismatchValidation.ok ||
    !sufficiencyMismatchValidation.errors.some((error) =>
      error.includes("evidence_sufficiency")
    )
  ) {
    throw new Error(
      "governance case review decision must reject invalid evidence_sufficiency values"
    );
  }
}

if (!GOVERNANCE_CASE_REVIEW_DECISION_SURFACE_MAP.governance_case_review_decision) {
  throw new Error("governance case review decision surface entry missing");
}
if (
  !permitExports.GOVERNANCE_CASE_REVIEW_DECISION_SURFACE_MAP
    ?.governance_case_review_decision
) {
  throw new Error(
    "governance case review decision surface export missing from permit index"
  );
}

for (const exportName of GOVERNANCE_CASE_REVIEW_DECISION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case review decision export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_REVIEW_DECISION_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case review decision surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance case review decision boundary verified\n");
