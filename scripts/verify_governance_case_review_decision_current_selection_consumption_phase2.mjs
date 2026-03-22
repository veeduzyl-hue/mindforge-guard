import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CONSUMPTION_PROFILE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_SURFACE_MAP,
  GOVERNANCE_SURFACE_MAP,
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
  buildGovernanceCaseEvidenceProfile,
  buildGovernanceCaseLinkageProfile,
  buildGovernanceCaseResolutionCompatibilityContract,
  buildGovernanceCaseResolutionContract,
  buildGovernanceCaseResolutionProfile,
  buildGovernanceCaseResolutionStabilizationProfile,
  buildGovernanceCaseReviewDecisionContract,
  buildGovernanceCaseReviewDecisionCurrentSelectionContract,
  buildGovernanceCaseReviewDecisionCurrentSelectionProfile,
  buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile,
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
  consumeGovernanceCaseReviewDecisionCurrentSelection,
  validateGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:8888aaaabbbbcccc8888aaaabbbbcccc8888aaaabbbbcccc8888aaaabbbbcccc",
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

function buildBase(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "8888888888888888888888888888888888888888", branch: "branch" },
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
  return { caseId, resolutionId, escalationId, closureId, evidenceId, caseEvidenceProfile };
}

function buildReviewDecision(base, overrides = {}) {
  const profile = buildGovernanceCaseReviewDecisionProfile({
    governanceCaseEvidenceProfile: base.caseEvidenceProfile,
    caseId: overrides.caseId ?? base.caseId,
    reviewDecisionId:
      overrides.reviewDecisionId ?? `review-decision-${base.caseId}-1`,
    linkedEvidenceIds: overrides.linkedEvidenceIds ?? [base.evidenceId],
    linkedResolutionIds: overrides.linkedResolutionIds ?? [base.resolutionId],
    linkedEscalationIds: overrides.linkedEscalationIds ?? [base.escalationId],
    linkedClosureIds: overrides.linkedClosureIds ?? [base.closureId],
    continuityMode: overrides.continuityMode,
    reviewDecisionSequence: overrides.reviewDecisionSequence,
    supersedesReviewDecisionId: overrides.supersedesReviewDecisionId ?? null,
    supersededByReviewDecisionId: overrides.supersededByReviewDecisionId ?? null,
    supersessionReason: overrides.supersessionReason ?? null,
  });
  const contract = buildGovernanceCaseReviewDecisionContract({
    governanceCaseReviewDecisionProfile: profile,
  });
  return { profile, contract };
}

{
  const base = buildBase("would_review");
  const current = buildReviewDecision(base, {
    reviewDecisionId: "review-summary-current",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-summary-previous",
    supersessionReason: "new bounded review decision",
  });
  const previous = buildReviewDecision(base, {
    reviewDecisionId: "review-summary-previous",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-summary-current",
    supersessionReason: "superseded by current bounded review decision",
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current.profile, previous.profile],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  const summaryProfile = buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [current.profile, previous.profile],
  });
  const consumed = consumeGovernanceCaseReviewDecisionCurrentSelection({
    governanceCaseReviewDecisionCurrentSelectionSummaryProfile: summaryProfile,
  });
  const validation =
    validateGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile(
      summaryProfile
    );
  if (!validation.ok) {
    throw new Error(
      `current selection summary validation failed: ${validation.errors.join("; ")}`
    );
  }
  if (
    summaryProfile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_KIND ||
    summaryProfile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_VERSION ||
    summaryProfile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_SCHEMA_ID ||
    summaryProfile.governance_case_review_decision_current_selection_summary
      .stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_STAGE ||
    summaryProfile.governance_case_review_decision_current_selection_summary
      .consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_CONSUMER_SURFACE ||
    summaryProfile.governance_case_review_decision_current_selection_summary
      .boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_PROFILE_BOUNDARY
  ) {
    throw new Error("current selection summary profile envelope drifted");
  }
  if (
    consumed.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_CONSUMER_SURFACE ||
    consumed.selection_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED ||
    consumed.conflict_detected !== false ||
    consumed.current_review_decision?.review_decision_id !== "review-summary-current" ||
    consumed.supporting_artifact_only !== true ||
    consumed.recommendation_only !== true ||
    consumed.additive_only !== true ||
    consumed.executing !== false
  ) {
    throw new Error("current selection consumed summary drifted");
  }
}

{
  const base = buildBase("would_allow");
  const first = buildReviewDecision(base, {
    reviewDecisionId: "review-conflict-a",
    reviewDecisionSequence: 1,
  });
  const second = buildReviewDecision(base, {
    reviewDecisionId: "review-conflict-b",
    reviewDecisionSequence: 2,
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [first.profile, second.profile],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  const summaryProfile = buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [first.profile, second.profile],
  });
  const consumed = consumeGovernanceCaseReviewDecisionCurrentSelection({
    governanceCaseReviewDecisionCurrentSelectionSummaryProfile: summaryProfile,
  });
  if (
    summaryProfile.governance_case_review_decision_current_selection_summary
      .summary_context.selection_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT ||
    consumed.conflict_detected !== true ||
    consumed.current_review_decision !== null ||
    consumed.conflict_review_decision_ids.length !== 2
  ) {
    throw new Error("current selection conflict summary drifted");
  }
}

{
  const base = buildBase("would_deny");
  const selected = buildReviewDecision(base, {
    reviewDecisionId: "review-missing-selected",
    reviewDecisionSequence: 1,
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [selected.profile],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  const wrong = cloneJson(selected.profile);
  wrong.governance_case_review_decision.review_decision_context.review_decision_id =
    "review-missing-other";
  let rejected = false;
  try {
    buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
      governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
      governanceCaseReviewDecisionProfiles: [wrong],
    });
  } catch (error) {
    if (String(error.message).includes("selected review decision")) {
      rejected = true;
    } else {
      throw error;
    }
  }
  if (!rejected) {
    throw new Error("current selection summary must reject missing selected review decision");
  }
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_SURFACE_MAP
    .governance_case_review_decision_current_selection_summary ||
  !permitExports.GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SUMMARY_SURFACE_MAP
    ?.governance_case_review_decision_current_selection_summary
) {
  throw new Error("current selection summary surface missing from aggregate exports");
}

if (
  !GOVERNANCE_SURFACE_MAP.governance_case_review_decision_current_selection_summary ||
  GOVERNANCE_SURFACE_MAP.governance_case_review_decision_current_selection_summary
    .tier !== "external_consumer_surface"
) {
  throw new Error("current selection summary governance surface entry drifted");
}

if (
  !GOVERNANCE_CONSUMPTION_PROFILE
    .governance_case_review_decision_current_selection_summary ||
  GOVERNANCE_CONSUMPTION_PROFILE
    .governance_case_review_decision_current_selection_summary.requirement !==
    "optional" ||
  GOVERNANCE_CONSUMPTION_PROFILE
    .governance_case_review_decision_current_selection_summary.consumer_safe !==
    true
) {
  throw new Error("current selection summary governance consumption entry drifted");
}

process.stdout.write(
  "governance case review decision current selection consumption phase 2 verified\n"
);
