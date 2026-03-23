import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_IDENTITY_ALIGNMENT_MODE_STRICT,
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
  buildGovernanceCaseReviewDecisionCurrentSelectionProfile,
  buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile,
  buildGovernanceCaseReviewDecisionProfile,
  buildGovernanceCaseReviewDecisionSelectionExplanation,
  buildGovernanceCaseReviewDecisionSelectionExplanationContract,
  buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary,
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

function buildSelectedFixture() {
  const base = buildBase("would_review");
  const current = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-receipt-hardened-current",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-selection-receipt-hardened-previous",
    supersessionReason: "later bounded review decision",
  });
  const previous = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-receipt-hardened-previous",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-selection-receipt-hardened-current",
    supersessionReason: "superseded by later bounded review decision",
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
  });
  const selectionSummary = buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const selectionFinalAcceptance =
    buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
      governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
      governanceCaseReviewDecisionCurrentSelectionSummaryProfile: selectionSummary,
    });
  const explanationProfile = buildGovernanceCaseReviewDecisionSelectionExplanation({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const explanationContract = buildGovernanceCaseReviewDecisionSelectionExplanationContract({
    governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
  });
  const explanationFinalAcceptance =
    buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary({
      governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
      governanceCaseReviewDecisionSelectionExplanationContract: explanationContract,
    });

  return {
    current,
    previous,
    selectionProfile,
    selectionContract,
    selectionFinalAcceptance,
    explanationProfile,
    explanationContract,
    explanationFinalAcceptance,
  };
}

await import("./verify_governance_case_review_decision_selection_receipt_boundary.mjs");

{
  const fixture = buildSelectedFixture();
  const selectionBefore = stableStringify(fixture.selectionProfile);
  const explanationBefore = stableStringify(fixture.explanationProfile);
  const receiptProfile = buildGovernanceCaseReviewDecisionSelectionReceipt({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      fixture.selectionFinalAcceptance,
    governanceCaseReviewDecisionSelectionExplanationProfile:
      fixture.explanationProfile,
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
      fixture.explanationFinalAcceptance,
  });
  const receiptContract = buildGovernanceCaseReviewDecisionSelectionReceiptContract({
    governanceCaseReviewDecisionSelectionReceiptProfile: receiptProfile,
  });
  const consumed = consumeGovernanceCaseReviewDecisionSelectionReceipt({
    governanceCaseReviewDecisionSelectionReceiptProfile: receiptProfile,
    governanceCaseReviewDecisionSelectionReceiptContract: receiptContract,
  });
  const payload =
    receiptProfile.governance_case_review_decision_selection_receipt;

  if (stableStringify(fixture.selectionProfile) !== selectionBefore) {
    throw new Error("selection receipt hardening must not affect current selection");
  }
  if (stableStringify(fixture.explanationProfile) !== explanationBefore) {
    throw new Error("selection receipt hardening must not affect selection explanation");
  }

  if (
    payload.receipt_context.receipt_inputs.identity_alignment_mode !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_IDENTITY_ALIGNMENT_MODE_STRICT ||
    payload.receipt_context.receipt_inputs.eligibility_hardened !== true ||
    payload.receipt_context.receipt_inputs.supporting_artifacts_complete !== true ||
    payload.validation_exports.identity_alignment_hardened !== true ||
    payload.validation_exports.consumer_stability_hardened !== true
  ) {
    throw new Error("selection receipt hardening input/export support drifted");
  }

  for (const field of [
    "missing_support_ineligible",
    "unsupported_state_ineligible",
    "ambiguity_ineligible",
    "strict_identity_alignment",
    "implicit_alignment_fill_disabled",
  ]) {
    if (payload.preserved_semantics[field] !== true) {
      throw new Error(`selection receipt hardening preserved semantic drifted: ${field}`);
    }
  }

  for (const field of [
    "eligible_selected_current_selection_only",
    "missing_support_ineligible",
    "unsupported_state_ineligible",
    "ambiguity_ineligible",
    "identity_alignment_required",
    "strict_case_id_alignment_required",
    "strict_current_review_decision_id_alignment_required",
    "strict_canonical_action_hash_alignment_required",
    "implicit_alignment_fill_disabled",
  ]) {
    if (receiptContract[field] !== true) {
      throw new Error(`selection receipt hardening contract drifted: ${field}`);
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "selection_feedback_enabled",
    "risk_source_enabled",
    "main_path_takeover",
    "authority_scope_expansion",
    "new_governance_object",
  ]) {
    if (receiptContract[field] !== false) {
      throw new Error(`selection receipt hardening contract drifted: ${field}`);
    }
  }

  if (
    consumed.supporting_artifact_only !== true ||
    consumed.additive_only !== true ||
    consumed.non_executing !== true ||
    consumed.default_off !== true ||
    consumed.identity_alignment_hardened !== true ||
    consumed.judgment_source_enabled !== false ||
    consumed.authority_source_enabled !== false ||
    consumed.selection_feedback_enabled !== false
  ) {
    throw new Error("selection receipt hardening consumed summary drifted");
  }
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const mismatchedExplanation = cloneJson(fixture.explanationProfile);
      mismatchedExplanation.governance_case_review_decision_selection_explanation.selection_ref.case_id =
        "case-mismatch";
      return buildGovernanceCaseReviewDecisionSelectionReceipt({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          fixture.selectionFinalAcceptance,
        governanceCaseReviewDecisionSelectionExplanationProfile:
          mismatchedExplanation,
        governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
          fixture.explanationFinalAcceptance,
      });
    },
    "case_id must remain aligned",
    "selection receipt hardening must reject case_id identity mismatch"
  );
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const mismatchedAcceptance = cloneJson(fixture.explanationFinalAcceptance);
      mismatchedAcceptance.governance_case_review_decision_selection_explanation_final_acceptance.selection_explanation_contract_ref.current_review_decision_id =
        "review-other";
      return buildGovernanceCaseReviewDecisionSelectionReceipt({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          fixture.selectionFinalAcceptance,
        governanceCaseReviewDecisionSelectionExplanationProfile:
          fixture.explanationProfile,
        governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
          mismatchedAcceptance,
      });
    },
    "current_review_decision_id",
    "selection receipt hardening must reject current_review_decision_id identity mismatch"
  );
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const unsupported = cloneJson(fixture.selectionFinalAcceptance);
      unsupported.governance_case_review_decision_current_selection_final_acceptance.acceptance_scope.selection_status =
        "conflict";
      unsupported.governance_case_review_decision_current_selection_final_acceptance.acceptance_scope.current_selection_summary_current_review_decision =
        null;
      return buildGovernanceCaseReviewDecisionSelectionReceipt({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          unsupported,
        governanceCaseReviewDecisionSelectionExplanationProfile:
          fixture.explanationProfile,
        governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
          fixture.explanationFinalAcceptance,
      });
    },
    "unsupported state",
    "selection receipt hardening must reject unsupported selection state"
  );
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const missingSupport = cloneJson(fixture.explanationProfile);
      missingSupport.governance_case_review_decision_selection_explanation.validation_exports.current_selection_contract_available =
        false;
      return buildGovernanceCaseReviewDecisionSelectionReceipt({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          fixture.selectionFinalAcceptance,
        governanceCaseReviewDecisionSelectionExplanationProfile:
          missingSupport,
        governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
          fixture.explanationFinalAcceptance,
      });
    },
    "missing support",
    "selection receipt hardening must reject missing bounded support"
  );
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const ambiguous = cloneJson(fixture.selectionFinalAcceptance);
      ambiguous.governance_case_review_decision_current_selection_final_acceptance.acceptance_scope.unique_terminal_candidate_preserved =
        false;
      return buildGovernanceCaseReviewDecisionSelectionReceipt({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          ambiguous,
        governanceCaseReviewDecisionSelectionExplanationProfile:
          fixture.explanationProfile,
        governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
          fixture.explanationFinalAcceptance,
      });
    },
    "unique_terminal_candidate_preserved",
    "selection receipt hardening must reject ambiguous bounded state"
  );
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt.additive_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt.default_off !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt.eligibility_hardened !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt.strict_identity_alignment !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt.judgment_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt.authority_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt.selection_feedback_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    .governance_case_review_decision_selection_receipt.audit_path_dependency !== false
) {
  throw new Error("selection receipt hardening export surface drifted");
}

if (
  !permitExports.GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_SURFACE_MAP
    ?.governance_case_review_decision_selection_receipt
) {
  throw new Error("selection receipt hardening surface export missing from permit aggregate");
}

process.stdout.write(
  "governance case review decision selection receipt hardening verified\n"
);
