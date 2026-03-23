import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_READY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SURFACE_MAP,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_VERSION,
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
  buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary,
  buildGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze,
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
  exportGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceSurface,
  validateGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary,
  validateGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function stableStringify(value) {
  return JSON.stringify(value);
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
        "sha256:dddd1111eeee2222ffff3333aaaa4444bbbb5555cccc6666dddd7777eeee8888",
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
        git: { head: "1212121212121212121212121212121212121212", branch: "branch" },
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
  return buildGovernanceCaseReviewDecisionProfile({
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
}

const base = buildBase("would_review");

{
  const current = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-explanation-current",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-selection-explanation-previous",
    supersessionReason: "later bounded review decision",
  });
  const previous = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-explanation-previous",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-selection-explanation-current",
    supersessionReason: "superseded by later bounded review decision",
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  const selectionBefore = stableStringify(selectionProfile);
  const explanationProfile = buildGovernanceCaseReviewDecisionSelectionExplanation({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const explanationContract = buildGovernanceCaseReviewDecisionSelectionExplanationContract({
    governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
  });
  const finalAcceptance =
    buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary({
      governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
      governanceCaseReviewDecisionSelectionExplanationContract: explanationContract,
    });
  const compatibilityFreeze =
    buildGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze({
      governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
        finalAcceptance,
    });
  const exportSurface =
    exportGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceSurface({
      governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
        finalAcceptance,
      governanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze:
        compatibilityFreeze,
    });

  if (stableStringify(selectionProfile) !== selectionBefore) {
    throw new Error("selection explanation final acceptance must not affect current selection");
  }
  const finalValidation =
    validateGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary(
      finalAcceptance
    );
  const freezeValidation =
    validateGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze(
      compatibilityFreeze
    );
  if (!finalValidation.ok || !freezeValidation.ok) {
    throw new Error("selection explanation final acceptance validation failed");
  }
  if (
    finalAcceptance.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_KIND ||
    finalAcceptance.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_VERSION ||
    finalAcceptance.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SCHEMA_ID ||
    finalAcceptance.governance_case_review_decision_selection_explanation_final_acceptance
      .stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_STAGE ||
    finalAcceptance.governance_case_review_decision_selection_explanation_final_acceptance
      .boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_BOUNDARY ||
    finalAcceptance.governance_case_review_decision_selection_explanation_final_acceptance
      .consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_CONSUMER_SURFACE
  ) {
    throw new Error("selection explanation final acceptance envelope drifted");
  }
  if (
    finalAcceptance.governance_case_review_decision_selection_explanation_final_acceptance
      .final_acceptance_contract.readiness_level !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_READY ||
    finalAcceptance.governance_case_review_decision_selection_explanation_final_acceptance
      .final_acceptance_contract.freeform_explanation !== false ||
    finalAcceptance.governance_case_review_decision_selection_explanation_final_acceptance
      .final_acceptance_contract.ranking_scoring_engine !== false ||
    finalAcceptance.governance_case_review_decision_selection_explanation_final_acceptance
      .final_acceptance_contract.judgment_source_enabled !== false ||
    finalAcceptance.governance_case_review_decision_selection_explanation_final_acceptance
      .final_acceptance_contract.authority_source_enabled !== false ||
    finalAcceptance.governance_case_review_decision_selection_explanation_final_acceptance
      .final_acceptance_contract.selection_feedback_enabled !== false ||
    finalAcceptance.governance_case_review_decision_selection_explanation_final_acceptance
      .final_acceptance_contract.main_path_takeover !== false
  ) {
    throw new Error("selection explanation final acceptance contract drifted");
  }
  if (
    compatibilityFreeze.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_KIND ||
    compatibilityFreeze.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_VERSION ||
    compatibilityFreeze.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_BOUNDARY ||
    compatibilityFreeze.selected_only_preserved !== true ||
    compatibilityFreeze.eligibility_rejection_hardening_preserved !== true ||
    compatibilityFreeze.bounded_reason_codes_preserved !== true ||
    compatibilityFreeze.explanation_supporting_artifact_preserved !== true ||
    compatibilityFreeze.one_way_selection_dependency_preserved !== true ||
    compatibilityFreeze.judgment_source_enabled !== false ||
    compatibilityFreeze.authority_source_enabled !== false ||
    compatibilityFreeze.selection_feedback_enabled !== false ||
    compatibilityFreeze.denied_exit_code_preserved !== 25
  ) {
    throw new Error("selection explanation final compatibility freeze drifted");
  }
  if (
    exportSurface.release_summary.release_target !== "v5.8.0" ||
    exportSurface.release_summary.recommendation_only !== true ||
    exportSurface.release_summary.additive_only !== true ||
    exportSurface.release_summary.non_executing !== true ||
    exportSurface.release_summary.default_off !== true
  ) {
    throw new Error("selection explanation final acceptance release summary drifted");
  }
}

{
  const a = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-explanation-conflict-a",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  });
  const b = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-explanation-conflict-b",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [a, b],
  });
  if (
    selectionProfile.governance_case_review_decision_current_selection.selection_context
      .selection_status !== GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT
  ) {
    throw new Error("selection explanation conflict fixture drifted");
  }
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionSelectionExplanation({
        governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
        governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
        governanceCaseReviewDecisionProfiles: [a, b],
      }),
    "only supports current selection status 'selected'",
    "selection explanation final acceptance must preserve selected-only explanation generation"
  );
}

{
  const current = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-explanation-insufficient",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  const superseded = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-explanation-insufficient",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-selection-explanation-replacement",
    supersessionReason: "superseded support boundary",
  });
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionSelectionExplanation({
        governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
        governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
        governanceCaseReviewDecisionProfiles: [superseded],
      }),
    "insufficient support",
    "selection explanation final acceptance must preserve insufficient support rejection"
  );
}

{
  const current = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-explanation-mismatch",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  const explanationProfile = buildGovernanceCaseReviewDecisionSelectionExplanation({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [current],
  });
  const explanationContract = buildGovernanceCaseReviewDecisionSelectionExplanationContract({
    governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
  });
  assertRejected(
    () => {
      const mismatchedContract = cloneJson(explanationContract);
      mismatchedContract.selection_explanation_profile_ref.case_id = "case-mismatch";
      return buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary({
        governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
        governanceCaseReviewDecisionSelectionExplanationContract: mismatchedContract,
      });
    },
    "contract case_id must match explanation profile",
    "selection explanation final acceptance must reject mismatched contract case_id"
  );
  assertRejected(
    () => {
      const mismatchedContract = cloneJson(explanationContract);
      mismatchedContract.canonical_action_hash = "sha256:selection-explanation-final-acceptance-mismatch";
      return buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary({
        governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
        governanceCaseReviewDecisionSelectionExplanationContract: mismatchedContract,
      });
    },
    "contract canonical_action_hash must match explanation profile",
    "selection explanation final acceptance must reject mismatched contract canonical_action_hash"
  );
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_explanation_final_acceptance ||
  !GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_explanation_final_compatibility_freeze
) {
  throw new Error("selection explanation final acceptance surface entries missing");
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_explanation_final_acceptance
    .judgment_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_explanation_final_acceptance
    .authority_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_explanation_final_acceptance
    .selection_feedback_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_explanation_final_acceptance
    .additive_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_explanation_final_acceptance
    .executing !== false
) {
  throw new Error("selection explanation final acceptance surface drifted");
}

for (const exportName of GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `selection explanation final acceptance export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `selection explanation final compatibility freeze export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `selection explanation final acceptance surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write(
  "governance case review decision selection explanation final acceptance verified\n"
);
