import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_APPLICABILITY_EXPLANATION_LINKED,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_APPLICABILITY_LINKED,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CONTINUITY_GROUNDED,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CURRENT_SELECTION_READY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_NON_SUPERSEDED_CURRENT_VIEW,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SELECTION_EXPLANATION_LINKED,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SELECTION_RECEIPT_LINKED,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SUPERSESSION_GROUNDED,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP,
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
  buildGovernanceCaseReviewDecisionApplicability,
  buildGovernanceCaseReviewDecisionApplicabilityExplanation,
  buildGovernanceCaseReviewDecisionApplicabilityExplanationContract,
  buildGovernanceCaseReviewDecisionAttestation,
  buildGovernanceCaseReviewDecisionAttestationContract,
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
  consumeGovernanceCaseReviewDecisionAttestation,
  validateGovernanceCaseReviewDecisionAttestationContract,
  validateGovernanceCaseReviewDecisionAttestationProfile,
} = permitExports;

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
        "sha256:7777aaaabbbb8888cccc9999dddd0000eeee1111ffff2222aaaa3333bbbb4444",
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
        git: { head: "9999999999999999999999999999999999999999", branch: "branch" },
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
    reviewDecisionId: "review-attestation-current",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-attestation-previous",
    supersessionReason: "later bounded review decision",
  });
  const previous = buildReviewDecision(base, {
    reviewDecisionId: "review-attestation-previous",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-attestation-current",
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
  const selectionExplanation = buildGovernanceCaseReviewDecisionSelectionExplanation({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const selectionExplanationContract =
    buildGovernanceCaseReviewDecisionSelectionExplanationContract({
      governanceCaseReviewDecisionSelectionExplanationProfile: selectionExplanation,
    });
  const selectionExplanationFinalAcceptance =
    buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary({
      governanceCaseReviewDecisionSelectionExplanationProfile: selectionExplanation,
      governanceCaseReviewDecisionSelectionExplanationContract:
        selectionExplanationContract,
    });
  const selectionReceipt = buildGovernanceCaseReviewDecisionSelectionReceipt({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      selectionFinalAcceptance,
    governanceCaseReviewDecisionSelectionExplanationProfile: selectionExplanation,
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
      selectionExplanationFinalAcceptance,
  });
  const selectionReceiptContract =
    buildGovernanceCaseReviewDecisionSelectionReceiptContract({
      governanceCaseReviewDecisionSelectionReceiptProfile: selectionReceipt,
    });
  const selectionReceiptFinalAcceptance =
    buildGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary({
      governanceCaseReviewDecisionSelectionReceiptProfile: selectionReceipt,
      governanceCaseReviewDecisionSelectionReceiptContract: selectionReceiptContract,
    });
  const applicabilityProfile = buildGovernanceCaseReviewDecisionApplicability({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      selectionFinalAcceptance,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const applicabilityExplanation =
    buildGovernanceCaseReviewDecisionApplicabilityExplanation({
      governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
        selectionFinalAcceptance,
      governanceCaseReviewDecisionApplicabilityProfile: applicabilityProfile,
      governanceCaseReviewDecisionProfiles: [current, previous],
    });
  buildGovernanceCaseReviewDecisionApplicabilityExplanationContract({
    governanceCaseReviewDecisionApplicabilityExplanationProfile:
      applicabilityExplanation,
  });

  return {
    current,
    previous,
    selectionProfile,
    selectionFinalAcceptance,
    selectionExplanationFinalAcceptance,
    selectionReceiptFinalAcceptance,
    applicabilityProfile,
    applicabilityExplanation,
  };
}

await import("./verify_governance_case_review_decision_applicability_explanation_boundary.mjs");

{
  const fixture = buildSelectedFixture();
  const selectionBefore = stableStringify(fixture.selectionProfile);
  const applicabilityExplanationBefore = stableStringify(
    fixture.applicabilityExplanation
  );
  const attestationProfile = buildGovernanceCaseReviewDecisionAttestation({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      fixture.selectionFinalAcceptance,
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
      fixture.selectionExplanationFinalAcceptance,
    governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary:
      fixture.selectionReceiptFinalAcceptance,
    governanceCaseReviewDecisionApplicabilityProfile: fixture.applicabilityProfile,
    governanceCaseReviewDecisionApplicabilityExplanationProfile:
      fixture.applicabilityExplanation,
    governanceCaseReviewDecisionProfiles: [fixture.current, fixture.previous],
  });
  const attestationContract = buildGovernanceCaseReviewDecisionAttestationContract({
    governanceCaseReviewDecisionAttestationProfile: attestationProfile,
  });
  const consumed = consumeGovernanceCaseReviewDecisionAttestation({
    governanceCaseReviewDecisionAttestationProfile: attestationProfile,
    governanceCaseReviewDecisionAttestationContract: attestationContract,
  });
  const payload = attestationProfile.governance_case_review_decision_attestation;

  if (stableStringify(fixture.selectionProfile) !== selectionBefore) {
    throw new Error("review decision attestation must not affect current selection");
  }
  if (
    stableStringify(fixture.applicabilityExplanation) !==
    applicabilityExplanationBefore
  ) {
    throw new Error(
      "review decision attestation must not affect applicability explanation"
    );
  }
  if (
    validateGovernanceCaseReviewDecisionAttestationProfile(attestationProfile).ok !==
    true
  ) {
    throw new Error("review decision attestation profile validation failed");
  }
  if (
    validateGovernanceCaseReviewDecisionAttestationContract(attestationContract).ok !==
    true
  ) {
    throw new Error("review decision attestation contract validation failed");
  }
  if (
    attestationProfile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_KIND ||
    attestationProfile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_VERSION ||
    attestationProfile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_SCHEMA_ID ||
    payload.stage !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_STAGE ||
    payload.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_BOUNDARY ||
    payload.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONSUMER_SURFACE
  ) {
    throw new Error("review decision attestation profile envelope drifted");
  }
  if (
    payload.attestation_context.attestation_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED ||
    JSON.stringify(
      payload.attestation_context.attestation_basis.attestation_reason_codes
    ) !==
      JSON.stringify([
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CURRENT_SELECTION_READY,
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SELECTION_EXPLANATION_LINKED,
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SELECTION_RECEIPT_LINKED,
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_APPLICABILITY_LINKED,
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_APPLICABILITY_EXPLANATION_LINKED,
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CONTINUITY_GROUNDED,
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SUPERSESSION_GROUNDED,
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_NON_SUPERSEDED_CURRENT_VIEW,
      ])
  ) {
    throw new Error("review decision attestation bounded reasons drifted");
  }
  for (const field of [
    "current_selection_final_acceptance_available",
    "selection_receipt_final_acceptance_available",
    "selection_explanation_final_acceptance_available",
    "applicability_profile_available",
    "applicability_explanation_profile_available",
    "selected_review_decision_profile_available",
    "export_surface_available",
  ]) {
    if (payload.validation_exports[field] !== true) {
      throw new Error(
        `review decision attestation validation export drifted: ${field}`
      );
    }
  }
  for (const field of [
    "derived_only",
    "supporting_artifact_only",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (payload.preserved_semantics[field] !== true) {
      throw new Error(
        `review decision attestation preserved semantic drifted: ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "selection_feedback_enabled",
    "main_path_takeover",
    "authority_scope_expansion",
    "governance_object_addition",
    "risk_integration",
    "ui_control_plane",
  ]) {
    if (payload.preserved_semantics[field] !== false) {
      throw new Error(
        `review decision attestation preserved semantic drifted: ${field}`
      );
    }
  }
  if (
    attestationContract.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_KIND ||
    attestationContract.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_VERSION ||
    attestationContract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_BOUNDARY
  ) {
    throw new Error("review decision attestation contract envelope drifted");
  }
  for (const field of [
    "attestation_available",
    "selected_current_review_decision_only",
    "current_selection_final_acceptance_required",
    "selection_receipt_final_acceptance_required",
    "selection_explanation_final_acceptance_required",
    "applicability_profile_required",
    "applicability_explanation_profile_required",
    "selected_review_decision_profile_required",
    "non_superseded_review_decision_required",
    "strict_case_id_alignment_required",
    "strict_review_decision_id_alignment_required",
    "strict_canonical_action_hash_alignment_required",
    "continuity_supersession_basis_required",
    "derived_only",
    "supporting_artifact_only",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (attestationContract[field] !== true) {
      throw new Error(`review decision attestation contract drifted: ${field}`);
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "selection_feedback_enabled",
    "risk_source_enabled",
    "main_path_takeover",
    "authority_scope_expansion",
    "new_governance_object",
  ]) {
    if (attestationContract[field] !== false) {
      throw new Error(`review decision attestation contract drifted: ${field}`);
    }
  }
  if (
    consumed.derived_only !== true ||
    consumed.supporting_artifact_only !== true ||
    consumed.recommendation_only !== true ||
    consumed.additive_only !== true ||
    consumed.non_executing !== true ||
    consumed.default_off !== true ||
    consumed.judgment_source_enabled !== false ||
    consumed.authority_source_enabled !== false ||
    consumed.execution_binding_enabled !== false ||
    consumed.selection_feedback_enabled !== false
  ) {
    throw new Error("review decision attestation consumed summary drifted");
  }
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const unsupported = cloneJson(fixture.selectionFinalAcceptance);
      unsupported.governance_case_review_decision_current_selection_final_acceptance.acceptance_scope.selection_status =
        "conflict";
      unsupported.governance_case_review_decision_current_selection_final_acceptance.acceptance_scope.unique_terminal_candidate_preserved =
        false;
      return buildGovernanceCaseReviewDecisionAttestation({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          unsupported,
        governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
          fixture.selectionExplanationFinalAcceptance,
        governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary:
          fixture.selectionReceiptFinalAcceptance,
        governanceCaseReviewDecisionApplicabilityProfile:
          fixture.applicabilityProfile,
        governanceCaseReviewDecisionApplicabilityExplanationProfile:
          fixture.applicabilityExplanation,
        governanceCaseReviewDecisionProfiles: [fixture.current, fixture.previous],
      });
    },
    "current selection final acceptance boundary invalid",
    "review decision attestation must reject non-selected current selection"
  );
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP
    .governance_case_review_decision_attestation ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP
    .governance_case_review_decision_attestation.derived_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP
    .governance_case_review_decision_attestation.additive_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP
    .governance_case_review_decision_attestation.default_off !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP
    .governance_case_review_decision_attestation.judgment_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP
    .governance_case_review_decision_attestation.authority_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP
    .governance_case_review_decision_attestation.audit_path_dependency !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP
    .governance_case_review_decision_attestation.main_path_takeover !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP
    .governance_case_review_decision_attestation.executing !== false
) {
  throw new Error("review decision attestation export surface drifted");
}

for (const exportName of [
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_SURFACE_MAP",
  "buildGovernanceCaseReviewDecisionAttestation",
  "consumeGovernanceCaseReviewDecisionAttestation",
  "exportGovernanceCaseReviewDecisionAttestationSurface",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision attestation permit export missing: ${exportName}`
    );
  }
}

process.stdout.write(
  "governance case review decision attestation boundary verified\n"
);

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const superseded = cloneJson(fixture.current);
      superseded.governance_case_review_decision.review_decision_context.superseded_by_review_decision_id =
        "review-other";
      superseded.governance_case_review_decision.review_decision_context.continuity_mode =
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED;
      return buildGovernanceCaseReviewDecisionAttestation({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          fixture.selectionFinalAcceptance,
        governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
          fixture.selectionExplanationFinalAcceptance,
        governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary:
          fixture.selectionReceiptFinalAcceptance,
        governanceCaseReviewDecisionApplicabilityProfile:
          fixture.applicabilityProfile,
        governanceCaseReviewDecisionApplicabilityExplanationProfile:
          fixture.applicabilityExplanation,
        governanceCaseReviewDecisionProfiles: [superseded, fixture.previous],
      });
    },
    "superseded review decision cannot be attested",
    "review decision attestation must reject superseded selected review decision"
  );
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const mismatched = cloneJson(fixture.selectionReceiptFinalAcceptance);
      mismatched.governance_case_review_decision_selection_receipt_final_acceptance.selection_receipt_profile_ref.current_review_decision_id =
        "review-other";
      return buildGovernanceCaseReviewDecisionAttestation({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          fixture.selectionFinalAcceptance,
        governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
          fixture.selectionExplanationFinalAcceptance,
        governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary:
          mismatched,
        governanceCaseReviewDecisionApplicabilityProfile:
          fixture.applicabilityProfile,
        governanceCaseReviewDecisionApplicabilityExplanationProfile:
          fixture.applicabilityExplanation,
        governanceCaseReviewDecisionProfiles: [fixture.current, fixture.previous],
      });
    },
    "must remain identity aligned",
    "review decision attestation must reject selection receipt linkage mismatch"
  );
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const mismatched = cloneJson(fixture.applicabilityExplanation);
      mismatched.governance_case_review_decision_applicability_explanation.applicability_explanation_ref.current_review_decision_id =
        "review-other";
      return buildGovernanceCaseReviewDecisionAttestation({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          fixture.selectionFinalAcceptance,
        governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
          fixture.selectionExplanationFinalAcceptance,
        governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary:
          fixture.selectionReceiptFinalAcceptance,
        governanceCaseReviewDecisionApplicabilityProfile:
          fixture.applicabilityProfile,
        governanceCaseReviewDecisionApplicabilityExplanationProfile: mismatched,
        governanceCaseReviewDecisionProfiles: [fixture.current, fixture.previous],
      });
    },
    "must remain identity aligned",
    "review decision attestation must reject missing applicability explanation linkage"
  );
}

{
  const fixture = buildSelectedFixture();
  const attestationProfile = buildGovernanceCaseReviewDecisionAttestation({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      fixture.selectionFinalAcceptance,
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
      fixture.selectionExplanationFinalAcceptance,
    governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary:
      fixture.selectionReceiptFinalAcceptance,
    governanceCaseReviewDecisionApplicabilityProfile: fixture.applicabilityProfile,
    governanceCaseReviewDecisionApplicabilityExplanationProfile:
      fixture.applicabilityExplanation,
    governanceCaseReviewDecisionProfiles: [fixture.current, fixture.previous],
  });
  const attestationContract = buildGovernanceCaseReviewDecisionAttestationContract({
    governanceCaseReviewDecisionAttestationProfile: attestationProfile,
  });
  assertRejected(
    () => {
      const mismatched = cloneJson(attestationContract);
      mismatched.review_decision_id = "review-other";
      return consumeGovernanceCaseReviewDecisionAttestation({
        governanceCaseReviewDecisionAttestationProfile: attestationProfile,
        governanceCaseReviewDecisionAttestationContract: mismatched,
      });
    },
    "profile and contract must remain aligned",
    "review decision attestation consumer must reject contract mismatch"
  );
}
