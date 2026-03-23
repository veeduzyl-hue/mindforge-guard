import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_STATUS_RECORDED,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP,
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
  buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary,
  buildGovernanceCaseReviewDecisionCurrentSelectionFinalCompatibilityFreeze,
  buildGovernanceCaseReviewDecisionCurrentSelectionProfile,
  buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile,
  buildGovernanceCaseReviewDecisionProfile,
  buildGovernanceCaseReviewDecisionSelectionExplanation,
  buildGovernanceCaseReviewDecisionSelectionExplanationContract,
  buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary,
  buildGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze,
  buildGovernanceCaseReviewDecisionSelectionReceipt,
  buildGovernanceCaseReviewDecisionSelectionReceiptContract,
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
  consumeGovernanceCaseReviewDecisionSelectionReceipt,
  validateGovernanceCaseReviewDecisionSelectionReceiptContract,
  validateGovernanceCaseReviewDecisionSelectionReceiptProfile,
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
  if (!rejected) throw new Error(message);
}

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:1111aaaabbbb2222cccc3333dddd4444eeee5555ffff6666aaaa7777bbbb8888",
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
        git: { head: "abababababababababababababababababababab", branch: "branch" },
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
    reviewDecisionId: "review-selection-receipt-current",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-selection-receipt-previous",
    supersessionReason: "later bounded review decision",
  });
  const previous = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-receipt-previous",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-selection-receipt-current",
    supersessionReason: "superseded by later bounded review decision",
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  const currentSelectionFinalAcceptance =
    buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
      governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
      governanceCaseReviewDecisionCurrentSelectionSummaryProfile:
        buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile({
          governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
          governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
          governanceCaseReviewDecisionProfiles: [current, previous],
        }),
    });
  buildGovernanceCaseReviewDecisionCurrentSelectionFinalCompatibilityFreeze({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      currentSelectionFinalAcceptance,
  });
  const selectionBefore = stableStringify(selectionProfile);
  const explanationProfile = buildGovernanceCaseReviewDecisionSelectionExplanation({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const explanationBefore = stableStringify(explanationProfile);
  const explanationContract = buildGovernanceCaseReviewDecisionSelectionExplanationContract({
    governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
  });
  const explanationFinalAcceptance =
    buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary({
      governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
      governanceCaseReviewDecisionSelectionExplanationContract: explanationContract,
    });
  buildGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze({
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
      explanationFinalAcceptance,
  });
  const receiptProfile = buildGovernanceCaseReviewDecisionSelectionReceipt({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      currentSelectionFinalAcceptance,
    governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
      explanationFinalAcceptance,
  });
  const receiptContract = buildGovernanceCaseReviewDecisionSelectionReceiptContract({
    governanceCaseReviewDecisionSelectionReceiptProfile: receiptProfile,
  });
  const consumed = consumeGovernanceCaseReviewDecisionSelectionReceipt({
    governanceCaseReviewDecisionSelectionReceiptProfile: receiptProfile,
    governanceCaseReviewDecisionSelectionReceiptContract: receiptContract,
  });
  const profileValidation =
    validateGovernanceCaseReviewDecisionSelectionReceiptProfile(receiptProfile);
  const contractValidation =
    validateGovernanceCaseReviewDecisionSelectionReceiptContract(receiptContract);
  if (!profileValidation.ok || !contractValidation.ok) {
    throw new Error("selection receipt profile/contract validation failed");
  }
  if (stableStringify(selectionProfile) !== selectionBefore) {
    throw new Error("selection receipt must not affect current selection");
  }
  if (stableStringify(explanationProfile) !== explanationBefore) {
    throw new Error("selection receipt must not affect selection explanation");
  }
  if (
    receiptProfile.kind !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_KIND ||
    receiptProfile.version !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_VERSION ||
    receiptProfile.schema_id !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_SCHEMA_ID ||
    receiptProfile.governance_case_review_decision_selection_receipt.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_STAGE ||
    receiptProfile.governance_case_review_decision_selection_receipt.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONSUMER_SURFACE ||
    receiptProfile.governance_case_review_decision_selection_receipt.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_BOUNDARY ||
    receiptProfile.governance_case_review_decision_selection_receipt.receipt_context.receipt_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_STATUS_RECORDED
  ) {
    throw new Error("selection receipt profile envelope drifted");
  }
  if (
    receiptContract.kind !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_KIND ||
    receiptContract.version !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_VERSION ||
    receiptContract.boundary !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_BOUNDARY ||
    receiptContract.supporting_artifact_only !== true ||
    receiptContract.additive_only !== true ||
    receiptContract.non_executing !== true ||
    receiptContract.default_off !== true ||
    receiptContract.judgment_source_enabled !== false ||
    receiptContract.authority_source_enabled !== false ||
    receiptContract.selection_feedback_enabled !== false ||
    receiptContract.risk_source_enabled !== false
  ) {
    throw new Error("selection receipt contract drifted");
  }
  if (
    consumed.supporting_artifact_only !== true ||
    consumed.recommendation_only !== true ||
    consumed.additive_only !== true ||
    consumed.judgment_source_enabled !== false ||
    consumed.authority_source_enabled !== false ||
    consumed.selection_feedback_enabled !== false ||
    consumed.executing !== false
  ) {
    throw new Error("selection receipt consumed summary drifted");
  }
}

{
  const current = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-receipt-mismatch",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-selection-receipt-next",
    supersessionReason: "superseded support boundary",
  });
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
        governanceCaseReviewDecisionProfiles: [current],
      }),
    "superseded decisions must reference an available successor review decision",
    "selection receipt prerequisites should stay bounded to valid current selection final acceptance"
  );
}

{
  const current = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-receipt-aligned",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-selection-receipt-aligned-prev",
    supersessionReason: "later bounded review decision",
  });
  const previous = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-receipt-aligned-prev",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-selection-receipt-aligned",
    supersessionReason: "superseded by later bounded review decision",
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  const explanationProfile = buildGovernanceCaseReviewDecisionSelectionExplanation({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const explanationContract = buildGovernanceCaseReviewDecisionSelectionExplanationContract({
    governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
  });
  const currentSelectionFinalAcceptance =
    buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
      governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
      governanceCaseReviewDecisionCurrentSelectionSummaryProfile:
        buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile({
          governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
          governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
          governanceCaseReviewDecisionProfiles: [current, previous],
        }),
    });
  const explanationFinalAcceptance =
    buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary({
      governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
      governanceCaseReviewDecisionSelectionExplanationContract: explanationContract,
    });

  assertRejected(
    () => {
      const mismatchedExplanation = cloneJson(explanationProfile);
      mismatchedExplanation.governance_case_review_decision_selection_explanation.selection_ref.case_id =
        "case-mismatch";
      return buildGovernanceCaseReviewDecisionSelectionReceipt({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          currentSelectionFinalAcceptance,
        governanceCaseReviewDecisionSelectionExplanationProfile: mismatchedExplanation,
        governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
          explanationFinalAcceptance,
      });
    },
    "case_id must remain aligned",
    "selection receipt must reject mismatched case_id across bounded inputs"
  );

  assertRejected(
    () => {
      const mismatchedExplanationFinalAcceptance = cloneJson(
        explanationFinalAcceptance
      );
      mismatchedExplanationFinalAcceptance.governance_case_review_decision_selection_explanation_final_acceptance.selection_explanation_contract_ref.current_review_decision_id =
        "review-other";
      return buildGovernanceCaseReviewDecisionSelectionReceipt({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          currentSelectionFinalAcceptance,
        governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
        governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
          mismatchedExplanationFinalAcceptance,
      });
    },
    "current_review_decision_id",
    "selection receipt must reject mismatched current_review_decision_id across bounded inputs"
  );
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt.additive_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt.executing !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt.judgment_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt.authority_source_enabled !== false
) {
  throw new Error("selection receipt additive export surface drifted");
}

if (
  !permitExports.GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    ?.governance_case_review_decision_selection_receipt
) {
  throw new Error("selection receipt surface export missing from permit aggregate");
}

if (
  !(
    "buildGovernanceCaseReviewDecisionSelectionReceipt" in permitExports &&
    "buildGovernanceCaseReviewDecisionSelectionReceiptContract" in permitExports &&
    "consumeGovernanceCaseReviewDecisionSelectionReceipt" in permitExports
  )
) {
  throw new Error("selection receipt exports missing from permit aggregate");
}

process.stdout.write(
  "governance case review decision selection receipt boundary verified\n"
);
