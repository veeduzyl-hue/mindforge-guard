import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_SURFACE_MAP,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_COMPATIBILITY_FREEZE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_COMPATIBILITY_FREEZE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_COMPATIBILITY_FREEZE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_COMPATIBILITY_FREEZE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED,
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
  buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary,
  buildGovernanceCaseReviewDecisionCurrentSelectionFinalCompatibilityFreeze,
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
  exportGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceSurface,
  validateGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary,
  validateGovernanceCaseReviewDecisionCurrentSelectionFinalCompatibilityFreeze,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:aaaabbbbccccddddeeeeffff1111222233334444555566667777888899990000",
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
        git: { head: "5757575757575757575757575757575757575757", branch: "branch" },
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
  return buildGovernanceCaseReviewDecisionProfile({
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

const base = buildBase("would_review");
const currentProfile = buildReviewDecision(base, {
  reviewDecisionId: "review-final-current",
  reviewDecisionSequence: 2,
  continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  supersedesReviewDecisionId: "review-final-previous",
  supersessionReason: "later bounded review decision",
});
const previousProfile = buildReviewDecision(base, {
  reviewDecisionId: "review-final-previous",
  reviewDecisionSequence: 1,
  continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  supersededByReviewDecisionId: "review-final-current",
  supersessionReason: "superseded by later bounded review decision",
});
const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
  governanceCaseReviewDecisionProfiles: [currentProfile, previousProfile],
});
const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
  governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
});
const summaryProfile = buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile({
  governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
  governanceCaseReviewDecisionProfiles: [currentProfile, previousProfile],
});
const finalAcceptance =
  buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionCurrentSelectionSummaryProfile: summaryProfile,
  });
const compatibilityFreeze =
  buildGovernanceCaseReviewDecisionCurrentSelectionFinalCompatibilityFreeze({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      finalAcceptance,
  });
const exportSurface =
  exportGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceSurface({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      finalAcceptance,
    governanceCaseReviewDecisionCurrentSelectionFinalCompatibilityFreeze:
      compatibilityFreeze,
  });

const finalValidation =
  validateGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary(
    finalAcceptance
  );
if (!finalValidation.ok) {
  throw new Error(
    `current selection final acceptance validation failed: ${finalValidation.errors.join("; ")}`
  );
}
const freezeValidation =
  validateGovernanceCaseReviewDecisionCurrentSelectionFinalCompatibilityFreeze(
    compatibilityFreeze
  );
if (!freezeValidation.ok) {
  throw new Error(
    `current selection final compatibility freeze validation failed: ${freezeValidation.errors.join("; ")}`
  );
}

if (
  finalAcceptance.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_KIND ||
  finalAcceptance.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_VERSION ||
  finalAcceptance.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_SCHEMA_ID ||
  finalAcceptance.governance_case_review_decision_current_selection_final_acceptance
    .stage !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_STAGE ||
  finalAcceptance.governance_case_review_decision_current_selection_final_acceptance
    .boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_BOUNDARY ||
  finalAcceptance.governance_case_review_decision_current_selection_final_acceptance
    .consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_CONSUMER_SURFACE
) {
  throw new Error("current selection final acceptance envelope drifted");
}

if (
  finalAcceptance.governance_case_review_decision_current_selection_final_acceptance
    .final_acceptance_contract.readiness_level !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY ||
  finalAcceptance.governance_case_review_decision_current_selection_final_acceptance
    .final_acceptance_contract.current_selection_phase1_semantics_preserved !==
    true ||
  finalAcceptance.governance_case_review_decision_current_selection_final_acceptance
    .final_acceptance_contract.current_selection_phase2_summary_semantics_preserved !==
    true ||
  finalAcceptance.governance_case_review_decision_current_selection_final_acceptance
    .final_acceptance_contract.additive_only !== true ||
  finalAcceptance.governance_case_review_decision_current_selection_final_acceptance
    .final_acceptance_contract.non_executing !== true ||
  finalAcceptance.governance_case_review_decision_current_selection_final_acceptance
    .final_acceptance_contract.default_off !== true ||
  finalAcceptance.governance_case_review_decision_current_selection_final_acceptance
    .final_acceptance_contract.execution_takeover !== false
) {
  throw new Error("current selection final acceptance contract drifted");
}

if (
  compatibilityFreeze.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_COMPATIBILITY_FREEZE_KIND ||
  compatibilityFreeze.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_COMPATIBILITY_FREEZE_VERSION ||
  compatibilityFreeze.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_COMPATIBILITY_FREEZE_BOUNDARY ||
  compatibilityFreeze.current_selection_uniqueness_preserved !== true ||
  compatibilityFreeze.current_selection_conflict_explicit_preserved !== true ||
  compatibilityFreeze.summary_current_review_decision_projection_preserved !==
    true ||
  compatibilityFreeze.summary_conflict_state_projection_preserved !== true ||
  compatibilityFreeze.recommendation_only !== true ||
  compatibilityFreeze.additive_only !== true ||
  compatibilityFreeze.non_executing !== true ||
  compatibilityFreeze.default_off !== true ||
  compatibilityFreeze.authority_scope_expansion !== false ||
  compatibilityFreeze.denied_exit_code_preserved !== 25
) {
  throw new Error("current selection final compatibility freeze drifted");
}

if (
  exportSurface.release_summary.release_target !== "v5.7.0" ||
  exportSurface.release_summary.recommendation_only !== true ||
  exportSurface.release_summary.additive_only !== true ||
  exportSurface.release_summary.non_executing !== true ||
  exportSurface.release_summary.default_off !== true
) {
  throw new Error("current selection final acceptance release summary drifted");
}

{
  const conflictBase = buildBase("would_allow");
  const first = buildReviewDecision(conflictBase, {
    reviewDecisionId: "review-final-conflict-a",
    reviewDecisionSequence: 1,
  });
  const second = buildReviewDecision(conflictBase, {
    reviewDecisionId: "review-final-conflict-b",
    reviewDecisionSequence: 2,
  });
  const conflictSelection =
    buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
      governanceCaseReviewDecisionProfiles: [first, second],
    });
  const conflictContract =
    buildGovernanceCaseReviewDecisionCurrentSelectionContract({
      governanceCaseReviewDecisionCurrentSelectionProfile: conflictSelection,
    });
  const conflictSummary =
    buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile({
      governanceCaseReviewDecisionCurrentSelectionProfile: conflictSelection,
      governanceCaseReviewDecisionCurrentSelectionContract: conflictContract,
      governanceCaseReviewDecisionProfiles: [first, second],
    });
  const conflictAcceptance =
    buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary({
      governanceCaseReviewDecisionCurrentSelectionProfile: conflictSelection,
      governanceCaseReviewDecisionCurrentSelectionContract: conflictContract,
      governanceCaseReviewDecisionCurrentSelectionSummaryProfile:
        conflictSummary,
    });
  if (
    conflictAcceptance
      .governance_case_review_decision_current_selection_final_acceptance
      .acceptance_scope.selection_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT ||
    conflictAcceptance
      .governance_case_review_decision_current_selection_final_acceptance
      .acceptance_scope.current_selection_summary_current_review_decision !==
      null
  ) {
    throw new Error("current selection conflict acceptance drifted");
  }
}

assertRejected(
  () => {
    const mismatchedContract = cloneJson(selectionContract);
    mismatchedContract.current_selection_profile_ref.case_id = "case-mismatch";
    return buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary(
      {
        governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
        governanceCaseReviewDecisionCurrentSelectionContract: mismatchedContract,
        governanceCaseReviewDecisionCurrentSelectionSummaryProfile:
          summaryProfile,
      }
    );
  },
  "contract case_id must match",
  "current selection final acceptance must reject mismatched contract case_id"
);

assertRejected(
  () => {
    const mismatchedContract = cloneJson(selectionContract);
    mismatchedContract.canonical_action_hash =
      "sha256:v5.7-final-acceptance-contract-hash-mismatch";
    return buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary(
      {
        governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
        governanceCaseReviewDecisionCurrentSelectionContract: mismatchedContract,
        governanceCaseReviewDecisionCurrentSelectionSummaryProfile:
          summaryProfile,
      }
    );
  },
  "contract canonical_action_hash must match",
  "current selection final acceptance must reject mismatched contract canonical_action_hash"
);

assertRejected(
  () => {
    const mismatchedSummary = cloneJson(summaryProfile);
    mismatchedSummary.governance_case_review_decision_current_selection_summary.selection_ref.current_review_decision_id =
      "review-final-other";
    return buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary(
      {
        governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
        governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
        governanceCaseReviewDecisionCurrentSelectionSummaryProfile:
          mismatchedSummary,
      }
    );
  },
  "summary current_review_decision_id must match",
  "current selection final acceptance must reject mismatched summary current_review_decision_id"
);

assertRejected(
  () => {
    const mismatchedSummary = cloneJson(summaryProfile);
    mismatchedSummary.canonical_action_hash =
      "sha256:v5.7-final-acceptance-summary-hash-mismatch";
    return buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary(
      {
        governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
        governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
        governanceCaseReviewDecisionCurrentSelectionSummaryProfile:
          mismatchedSummary,
      }
    );
  },
  "summary canonical_action_hash must match",
  "current selection final acceptance must reject mismatched summary canonical_action_hash"
);

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_current_selection_final_acceptance
) {
  throw new Error("current selection final acceptance surface entry missing");
}
if (
  !GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_current_selection_final_compatibility_freeze
) {
  throw new Error(
    "current selection final compatibility freeze surface entry missing"
  );
}

for (const exportName of GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `current selection final acceptance export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_COMPATIBILITY_FREEZE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `current selection final compatibility freeze export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `current selection final acceptance surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write(
  "governance case review decision current selection final acceptance verified\n"
);
