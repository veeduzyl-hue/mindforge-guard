import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CODE_ALLOWLIST,
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
  buildGovernanceCaseReviewDecisionCurrentSelectionContract,
  buildGovernanceCaseReviewDecisionCurrentSelectionProfile,
  buildGovernanceCaseReviewDecisionProfile,
  buildGovernanceCaseReviewDecisionSelectionExplanation,
  buildGovernanceCaseReviewDecisionSelectionExplanationContract,
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
  consumeGovernanceCaseReviewDecisionSelectionExplanation,
  validateGovernanceCaseReviewDecisionSelectionExplanationContract,
  validateGovernanceCaseReviewDecisionSelectionExplanationProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function stableStringify(value) {
  return JSON.stringify(value);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertRejected(factory, expectedFragment, message) {
  let rejected = false;
  try {
    factory();
  } catch (error) {
    if (String(error.message).includes(expectedFragment)) {
      rejected = true;
    } else {
      throw error;
    }
  }
  if (!rejected) {
    throw new Error(message);
  }
}

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:aaaaaaaa11111111bbbbbbbb22222222cccccccc33333333dddddddd44444444",
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
        reasons: [{ kind: "signal", message: decision }],
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
        git: { head: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", branch: "branch" },
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
  buildGovernanceCaseEvidenceContract({
    governanceCaseEvidenceProfile: caseEvidenceProfile,
  });

  return { caseId, resolutionId, escalationId, closureId, evidenceId, caseEvidenceProfile };
}

function buildReviewDecision(base, overrides = {}) {
  const profile = buildGovernanceCaseReviewDecisionProfile({
    governanceCaseEvidenceProfile: base.caseEvidenceProfile,
    caseId: overrides.caseId ?? base.caseId,
    reviewDecisionId: overrides.reviewDecisionId ?? `review-${base.caseId}`,
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

const base = buildBase("would_review");

{
  const current = buildReviewDecision(base, {
    reviewDecisionId: "review-current",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-previous",
    supersessionReason: "later bounded review decision",
  });
  const previous = buildReviewDecision(base, {
    reviewDecisionId: "review-previous",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-current",
    supersessionReason: "superseded by later bounded review decision",
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current.profile, previous.profile],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  const selectionBefore = stableStringify(selectionProfile);
  const explanationProfile = buildGovernanceCaseReviewDecisionSelectionExplanation({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [current.profile, previous.profile],
  });
  const explanationContract = buildGovernanceCaseReviewDecisionSelectionExplanationContract({
    governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
  });
  const consumed = consumeGovernanceCaseReviewDecisionSelectionExplanation({
    governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
    governanceCaseReviewDecisionSelectionExplanationContract: explanationContract,
  });
  if (stableStringify(selectionProfile) !== selectionBefore) {
    throw new Error("selection explanation must not affect current selection");
  }
  const profileValidation =
    validateGovernanceCaseReviewDecisionSelectionExplanationProfile(explanationProfile);
  const contractValidation =
    validateGovernanceCaseReviewDecisionSelectionExplanationContract(explanationContract);
  if (!profileValidation.ok || !contractValidation.ok) {
    throw new Error("selection explanation hardening validation failed");
  }
  if (
    stableStringify(consumed.reason_codes) !==
      stableStringify(explanationContract.allowlisted_reason_codes) ||
    consumed.judgment_source_enabled !== false ||
    consumed.selection_feedback_enabled !== false ||
    consumed.executing !== false
  ) {
    throw new Error("selection explanation hardening consumption drifted");
  }
}

{
  const a = buildReviewDecision(base, {
    reviewDecisionId: "review-conflict-a",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  });
  const b = buildReviewDecision(base, {
    reviewDecisionId: "review-conflict-b",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [a.profile, b.profile],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  if (
    selectionProfile.governance_case_review_decision_current_selection.selection_context
      .selection_status !== GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT
  ) {
    throw new Error("conflict fixture drifted");
  }
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionSelectionExplanation({
        governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
        governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
        governanceCaseReviewDecisionProfiles: [a.profile, b.profile],
      }),
    "only supports current selection status 'selected'",
    "conflict selections must not produce explanation artifacts"
  );
}

{
  const current = buildReviewDecision(base, {
    reviewDecisionId: "review-ambiguous-current",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current.profile],
  });
  selectionProfile.governance_case_review_decision_current_selection.selection_context.terminal_review_decision_ids =
    ["review-ambiguous-current", "review-ambiguous-other"];
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionSelectionExplanation({
        governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
        governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
        governanceCaseReviewDecisionProfiles: [current.profile],
      }),
    "conflict or ambiguity",
    "ambiguous selection must not produce explanation artifacts"
  );
}

{
  const current = buildReviewDecision(base, {
    reviewDecisionId: "review-insufficient-current",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current.profile],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  const insufficientSupportProfile = buildReviewDecision(base, {
    reviewDecisionId: "review-insufficient-current",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-insufficient-replacement",
    supersessionReason: "superseded support boundary",
  }).profile;
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionSelectionExplanation({
        governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
        governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
        governanceCaseReviewDecisionProfiles: [insufficientSupportProfile],
      }),
    "insufficient support",
    "insufficiently hardened selection inputs must not produce explanation artifacts"
  );
}

{
  const current = buildReviewDecision(base, {
    reviewDecisionId: "review-allowlist-current",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current.profile],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  const explanationProfile = buildGovernanceCaseReviewDecisionSelectionExplanation({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [current.profile],
  });
  const badReasonProfile = cloneJson(explanationProfile);
  badReasonProfile.governance_case_review_decision_selection_explanation.explanation_context.reason_codes.push(
    "unexpected_reason"
  );
  if (
    validateGovernanceCaseReviewDecisionSelectionExplanationProfile(badReasonProfile).ok
  ) {
    throw new Error("reason_codes must remain inside allowlist");
  }
  const badFreeform = cloneJson(explanationProfile);
  badFreeform.governance_case_review_decision_selection_explanation.preserved_semantics.freeform_explanation =
    true;
  if (
    validateGovernanceCaseReviewDecisionSelectionExplanationProfile(badFreeform).ok
  ) {
    throw new Error("freeform explanation must remain prohibited");
  }
  const badRanking = cloneJson(explanationProfile);
  badRanking.governance_case_review_decision_selection_explanation.preserved_semantics.ranking_scoring_engine =
    true;
  if (
    validateGovernanceCaseReviewDecisionSelectionExplanationProfile(badRanking).ok
  ) {
    throw new Error("ranking/scoring must remain prohibited");
  }
}

if (
  stableStringify(GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CODE_ALLOWLIST) !==
  stableStringify(permitExports.GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CODE_ALLOWLIST)
) {
  throw new Error("selection explanation allowlist export drifted");
}

if (
  permitExports.GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_SURFACE_MAP
    ?.governance_case_review_decision_selection_explanation
    ?.additive_only !== true ||
  permitExports.GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_SURFACE_MAP
    ?.governance_case_review_decision_selection_explanation
    ?.executing !== false ||
  permitExports.GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_SURFACE_MAP
    ?.governance_case_review_decision_selection_explanation
    ?.judgment_source_enabled !== false ||
  permitExports.GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_SURFACE_MAP
    ?.governance_case_review_decision_selection_explanation
    ?.selection_feedback_enabled !== false
) {
  throw new Error("selection explanation hardening surface drifted");
}

process.stdout.write(
  "governance case review decision selection explanation hardening verified\n"
);
