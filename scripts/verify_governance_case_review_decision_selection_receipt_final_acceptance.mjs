import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_MAP,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_COMPATIBILITY_FREEZE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_COMPATIBILITY_FREEZE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_COMPATIBILITY_FREEZE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_COMPATIBILITY_FREEZE_VERSION,
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
  buildGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary,
  buildGovernanceCaseReviewDecisionSelectionReceiptFinalCompatibilityFreeze,
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
  exportGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceSurface,
  validateGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary,
  validateGovernanceCaseReviewDecisionSelectionReceiptFinalCompatibilityFreeze,
} = permitExports;

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
        "sha256:9999aaaa8888bbbb7777cccc6666dddd5555eeee4444ffff3333aaaa2222bbbb",
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
        git: { head: "5656565656565656565656565656565656565656", branch: "branch" },
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
    reviewDecisionId: "review-selection-receipt-final-current",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-selection-receipt-final-previous",
    supersessionReason: "later bounded review decision",
  });
  const previous = buildReviewDecision(base, {
    reviewDecisionId: "review-selection-receipt-final-previous",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-selection-receipt-final-current",
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
  const receiptProfile = buildGovernanceCaseReviewDecisionSelectionReceipt({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      selectionFinalAcceptance,
    governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
      explanationFinalAcceptance,
  });
  const receiptContract = buildGovernanceCaseReviewDecisionSelectionReceiptContract({
    governanceCaseReviewDecisionSelectionReceiptProfile: receiptProfile,
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
    receiptProfile,
    receiptContract,
  };
}

await import("./verify_governance_case_review_decision_selection_receipt_hardening.mjs");

{
  const fixture = buildSelectedFixture();
  const selectionBefore = stableStringify(fixture.selectionProfile);
  const explanationBefore = stableStringify(fixture.explanationProfile);
  const receiptBefore = stableStringify(fixture.receiptProfile);
  const finalAcceptance =
    buildGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary({
      governanceCaseReviewDecisionSelectionReceiptProfile: fixture.receiptProfile,
      governanceCaseReviewDecisionSelectionReceiptContract: fixture.receiptContract,
    });
  const compatibilityFreeze =
    buildGovernanceCaseReviewDecisionSelectionReceiptFinalCompatibilityFreeze({
      governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary:
        finalAcceptance,
    });
  const exportSurface =
    exportGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceSurface({
      governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary:
        finalAcceptance,
      governanceCaseReviewDecisionSelectionReceiptFinalCompatibilityFreeze:
        compatibilityFreeze,
    });
  const acceptance =
    finalAcceptance.governance_case_review_decision_selection_receipt_final_acceptance;

  if (stableStringify(fixture.selectionProfile) !== selectionBefore) {
    throw new Error("selection receipt final acceptance must not affect current selection");
  }
  if (stableStringify(fixture.explanationProfile) !== explanationBefore) {
    throw new Error("selection receipt final acceptance must not affect selection explanation");
  }
  if (stableStringify(fixture.receiptProfile) !== receiptBefore) {
    throw new Error("selection receipt final acceptance must not mutate receipt profile");
  }

  if (
    validateGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary(
      finalAcceptance
    ).ok !== true
  ) {
    throw new Error("selection receipt final acceptance validation failed");
  }
  if (
    validateGovernanceCaseReviewDecisionSelectionReceiptFinalCompatibilityFreeze(
      compatibilityFreeze
    ).ok !== true
  ) {
    throw new Error("selection receipt final compatibility freeze validation failed");
  }

  if (
    finalAcceptance.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_KIND ||
    finalAcceptance.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_VERSION ||
    finalAcceptance.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SCHEMA_ID ||
    acceptance.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_STAGE ||
    acceptance.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_BOUNDARY ||
    acceptance.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_CONSUMER_SURFACE
  ) {
    throw new Error("selection receipt final acceptance envelope drifted");
  }

  for (const field of [
    "eligible_aligned_bounded_inputs_required",
    "supporting_artifact_only",
    "additive_only",
    "non_executing",
    "default_off",
    "strict_identity_alignment",
  ]) {
    if (acceptance.acceptance_scope[field] !== true) {
      throw new Error(`selection receipt final acceptance scope drifted: ${field}`);
    }
  }
  for (const field of [
    "receipt_phase1_semantics_preserved",
    "receipt_phase2_hardening_semantics_preserved",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (acceptance.final_acceptance_contract[field] !== true) {
      throw new Error(`selection receipt final acceptance contract drifted: ${field}`);
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "selection_feedback_enabled",
    "main_path_takeover",
  ]) {
    if (acceptance.final_acceptance_contract[field] !== false) {
      throw new Error(`selection receipt final acceptance contract drifted: ${field}`);
    }
  }
  if (
    acceptance.final_acceptance_contract.readiness_level !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY
  ) {
    throw new Error("selection receipt final acceptance readiness drifted");
  }
  for (const field of [
    "audit_output_preserved",
    "audit_verdict_preserved",
    "actual_exit_code_preserved",
    "permit_gate_semantics_preserved",
    "enforcement_pilot_semantics_preserved",
    "limited_enforcement_authority_semantics_preserved",
    "classify_semantics_preserved",
  ]) {
    if (acceptance.preserved_semantics[field] !== true) {
      throw new Error(`selection receipt final acceptance preserved semantic drifted: ${field}`);
    }
  }
  if (acceptance.preserved_semantics.denied_exit_code_preserved !== 25) {
    throw new Error("selection receipt final acceptance denied exit code drifted");
  }

  if (
    compatibilityFreeze.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_COMPATIBILITY_FREEZE_KIND ||
    compatibilityFreeze.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_COMPATIBILITY_FREEZE_VERSION ||
    compatibilityFreeze.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_COMPATIBILITY_FREEZE_BOUNDARY
  ) {
    throw new Error("selection receipt final compatibility freeze envelope drifted");
  }
  for (const field of [
    "eligible_aligned_inputs_preserved",
    "eligibility_rejection_hardening_preserved",
    "receipt_supporting_artifact_preserved",
    "one_way_selection_dependency_preserved",
    "one_way_explanation_dependency_preserved",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (compatibilityFreeze[field] !== true) {
      throw new Error(`selection receipt final compatibility freeze drifted: ${field}`);
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "selection_feedback_enabled",
    "execution_takeover",
    "automatic_routing",
    "automatic_case_finalization",
    "workflow_transition_engine",
    "authority_scope_expansion",
    "main_path_takeover",
  ]) {
    if (compatibilityFreeze[field] !== false) {
      throw new Error(`selection receipt final compatibility freeze drifted: ${field}`);
    }
  }
  if (
    exportSurface.release_summary.release_target !== "v5.9.0" ||
    exportSurface.release_summary.readiness !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY ||
    exportSurface.release_summary.additive_only !== true ||
    exportSurface.release_summary.non_executing !== true ||
    exportSurface.release_summary.default_off !== true
  ) {
    throw new Error("selection receipt final acceptance surface summary drifted");
  }
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const mismatched = cloneJson(fixture.receiptContract);
      mismatched.selection_receipt_profile_ref.case_id = "case-mismatch";
      return buildGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary({
        governanceCaseReviewDecisionSelectionReceiptProfile: fixture.receiptProfile,
        governanceCaseReviewDecisionSelectionReceiptContract: mismatched,
      });
    },
    "contract case_id",
    "selection receipt final acceptance must reject case_id mismatch"
  );
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const mismatched = cloneJson(fixture.receiptContract);
      mismatched.selection_receipt_profile_ref.current_review_decision_id =
        "review-other";
      return buildGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary({
        governanceCaseReviewDecisionSelectionReceiptProfile: fixture.receiptProfile,
        governanceCaseReviewDecisionSelectionReceiptContract: mismatched,
      });
    },
    "current_review_decision_id",
    "selection receipt final acceptance must reject current_review_decision_id mismatch"
  );
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const mismatched = cloneJson(fixture.receiptContract);
      mismatched.canonical_action_hash =
        "sha256:0000ffff1111eeee2222dddd3333cccc4444bbbb5555aaaa6666999988887777";
      return buildGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary({
        governanceCaseReviewDecisionSelectionReceiptProfile: fixture.receiptProfile,
        governanceCaseReviewDecisionSelectionReceiptContract: mismatched,
      });
    },
    "canonical_action_hash",
    "selection receipt final acceptance must reject canonical_action_hash mismatch"
  );
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_receipt_final_acceptance ||
  !GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_receipt_final_compatibility_freeze ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_receipt_final_acceptance.additive_only !==
    true ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_receipt_final_acceptance.executing !==
    false ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_receipt_final_acceptance
    .judgment_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_receipt_final_acceptance
    .authority_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_selection_receipt_final_acceptance
    .selection_feedback_enabled !== false
) {
  throw new Error("selection receipt final acceptance export surface drifted");
}

for (const exportName of [
  ...GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_STABLE_EXPORT_SET,
  ...GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_COMPATIBILITY_FREEZE_STABLE_EXPORT_SET,
  ...GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET,
]) {
  if (!(exportName in permitExports)) {
    throw new Error(`selection receipt final acceptance permit export missing: ${exportName}`);
  }
}

process.stdout.write(
  "governance case review decision selection receipt final acceptance verified\n"
);
