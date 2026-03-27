import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SURFACE_MAP,
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
  buildGovernanceCaseReviewDecisionAttestation,
  buildGovernanceCaseReviewDecisionAttestationApplicabilityClosure,
  buildGovernanceCaseReviewDecisionAttestationApplicabilityClosureContract,
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
  consumeGovernanceCaseReviewDecisionAttestationApplicabilityClosure,
  validateGovernanceCaseReviewDecisionAttestationApplicabilityClosureContract,
} = permitExports;

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

function buildFixture() {
  const bridge = buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:7777aaaabbbb8888cccc9999dddd0000eeee1111ffff2222aaaa3333bbbb4444",
      action: { action_class: "file.write" },
    },
    policyPreviewArtifact: { policy_preview: { preview_verdict: "allow" } },
    permitPrecheckArtifact: { permit_precheck: { decision: "allow" } },
    executionBridgeArtifact: { execution_bridge: { bridge_verdict: "allow" } },
    executionReadinessArtifact: { execution_readiness: { readiness: "ready" } },
    enforcementAdjacentDecisionArtifact: {
      enforcement_adjacent_decision: { decision: "would_review", reasons: [{ kind: "signal", message: "would_review" }] },
    },
  });
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: { run: { run_id: "run", mode: "local", git: { head: "9".repeat(40), branch: "branch" } } },
    policyPermitBridgeContract: bridge,
    permitGateResult: permit,
  });
  const authority = buildLimitedEnforcementAuthorityResult({
    audit: { evaluation: { verdict: "allow" } },
    canonicalActionArtifact: { canonical_action_hash: bridge.canonical_action_hash },
    executionReadinessArtifact: {
      execution_readiness: { readiness: "ready", bridge_verdict: "allow" },
    },
    enforcementAdjacentDecisionArtifact: {
      enforcement_adjacent_decision: { decision: "would_review", reasons: bridge.policy_permit_bridge.reason_summary },
    },
  });
  const judgmentProfile = buildJudgmentProfile({
    policyPermitBridgeContract: bridge,
    permitGateResult: permit,
    governanceDecisionRecord: governance,
    limitedEnforcementAuthorityResult: authority,
  });
  const judgmentReadiness = buildJudgmentReadinessProfile({ judgmentProfile });
  const judgmentCompatibility = buildJudgmentCompatibilityContract({ judgmentProfile, judgmentReadinessProfile: judgmentReadiness });
  const judgmentStabilization = buildJudgmentStabilizationProfile({ judgmentProfile, judgmentReadinessProfile: judgmentReadiness, judgmentCompatibilityContract: judgmentCompatibility });
  const approvalArtifact = buildApprovalArtifactProfile({ judgmentProfile, judgmentStabilizationProfile: judgmentStabilization });
  const approvalReadiness = buildApprovalReadinessProfile({ approvalArtifactProfile: approvalArtifact });
  const approvalReceipt = buildApprovalReceiptProfile({ approvalArtifactProfile: approvalArtifact, approvalReadinessProfile: approvalReadiness });
  const approvalStabilization = buildApprovalStabilizationProfile({ approvalArtifactProfile: approvalArtifact, approvalReadinessProfile: approvalReadiness, approvalReceiptProfile: approvalReceipt });
  const enforcementReadiness = buildEnforcementReadinessProfile({ approvalStabilizationProfile: approvalStabilization });
  const enforcementCompatibility = buildEnforcementCompatibilityProfile({ enforcementReadinessProfile: enforcementReadiness });
  const enforcementStabilization = buildEnforcementStabilizationProfile({ enforcementCompatibilityProfile: enforcementCompatibility });
  const policyProfile = buildPolicyProfile({ enforcementStabilizationProfile: enforcementStabilization });
  const policyCompatibility = buildPolicyCompatibilityProfile({ policyProfile });
  const policyStabilization = buildPolicyStabilizationProfile({ policyCompatibilityProfile: policyCompatibility });
  const evidenceProfile = buildGovernanceEvidenceProfile({ policyStabilizationProfile: policyStabilization });
  const evidenceReplay = buildGovernanceEvidenceReplayProfile({ governanceEvidenceProfile: evidenceProfile });
  const evidenceCompare = buildGovernanceCompareCompatibilityContract({ governanceEvidenceReplayProfile: evidenceReplay });
  const evidenceStabilization = buildGovernanceEvidenceStabilizationProfile({ governanceEvidenceReplayProfile: evidenceReplay, governanceCompareCompatibilityContract: evidenceCompare });
  const snapshot = buildGovernanceSnapshotProfile({ governanceEvidenceStabilizationProfile: evidenceStabilization });
  const rationaleBundle = buildGovernanceRationaleBundleProfile({ governanceSnapshotProfile: snapshot });
  const exportCompatibility = buildGovernanceSnapshotExportCompatibilityContract({ governanceRationaleBundleProfile: rationaleBundle });
  const snapshotStabilization = buildGovernanceSnapshotStabilizationProfile({ governanceRationaleBundleProfile: rationaleBundle, governanceSnapshotExportCompatibilityContract: exportCompatibility });
  const exceptionProfile = buildGovernanceExceptionProfile({ governanceSnapshotStabilizationProfile: snapshotStabilization });
  buildGovernanceOverrideRecordContract({ governanceExceptionProfile: exceptionProfile });
  const caseLinkage = buildGovernanceCaseLinkageProfile({ governanceExceptionProfile: exceptionProfile });
  const exceptionCompatibility = buildGovernanceExceptionCompatibilityContract({ governanceCaseLinkageProfile: caseLinkage });
  const exceptionStabilization = buildGovernanceExceptionStabilizationProfile({ governanceCaseLinkageProfile: caseLinkage, governanceExceptionCompatibilityContract: exceptionCompatibility });
  const caseId = "case-closure";
  const resolutionProfile = buildGovernanceCaseResolutionProfile({ governanceExceptionStabilizationProfile: exceptionStabilization, caseId, linkedExceptionIds: ["exception"], linkedOverrideRecordIds: ["override"] });
  const resolutionContract = buildGovernanceCaseResolutionContract({ governanceCaseResolutionProfile: resolutionProfile });
  const resolutionCompatibility = buildGovernanceCaseResolutionCompatibilityContract({ governanceCaseResolutionContract: resolutionContract });
  const resolutionStabilization = buildGovernanceCaseResolutionStabilizationProfile({ governanceCaseResolutionProfile: resolutionProfile, governanceCaseResolutionCompatibilityContract: resolutionCompatibility });
  const escalationProfile = buildGovernanceCaseEscalationProfile({ governanceCaseResolutionStabilizationProfile: resolutionStabilization, caseId, linkedExceptionIds: ["exception"], linkedOverrideRecordIds: ["override"], linkedResolutionIds: ["resolution-closure"] });
  const escalationContract = buildGovernanceCaseEscalationContract({ governanceCaseEscalationProfile: escalationProfile });
  const escalationCompatibility = buildGovernanceCaseEscalationCompatibilityContract({ governanceCaseEscalationContract: escalationContract });
  const escalationStabilization = buildGovernanceCaseEscalationStabilizationProfile({ governanceCaseEscalationProfile: escalationProfile, governanceCaseEscalationCompatibilityContract: escalationCompatibility });
  const closureProfile = buildGovernanceCaseClosureProfile({ governanceCaseEscalationStabilizationProfile: escalationStabilization, caseId, linkedExceptionIds: ["exception"], linkedOverrideRecordIds: ["override"], linkedResolutionIds: ["resolution-closure"], linkedEscalationIds: ["escalation-closure"] });
  const closureContract = buildGovernanceCaseClosureContract({ governanceCaseClosureProfile: closureProfile });
  const closureCompatibility = buildGovernanceCaseClosureCompatibilityContract({ governanceCaseClosureContract: closureContract });
  const closureStabilization = buildGovernanceCaseClosureStabilizationProfile({ governanceCaseClosureProfile: closureProfile, governanceCaseClosureCompatibilityContract: closureCompatibility });
  const caseEvidenceProfile = buildGovernanceCaseEvidenceProfile({
    governanceCaseClosureStabilizationProfile: closureStabilization,
    caseId,
    linkedResolutionIds: ["resolution-closure"],
    linkedEscalationIds: ["escalation-closure"],
    linkedClosureIds: ["closure-case-closure"],
    linkedExceptionIds: ["exception"],
    linkedOverrideRecordIds: ["override"],
  });
  buildGovernanceCaseEvidenceContract({ governanceCaseEvidenceProfile: caseEvidenceProfile });
  const current = buildGovernanceCaseReviewDecisionProfile({
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    caseId,
    reviewDecisionId: "review-closure-current",
    linkedEvidenceIds: ["evidence-case-closure"],
    linkedResolutionIds: ["resolution-closure"],
    linkedEscalationIds: ["escalation-closure"],
    linkedClosureIds: ["closure-case-closure"],
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    reviewDecisionSequence: 2,
    supersedesReviewDecisionId: "review-closure-previous",
    supersededByReviewDecisionId: null,
    supersessionReason: "later bounded review decision",
  });
  const previous = buildGovernanceCaseReviewDecisionProfile({
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    caseId,
    reviewDecisionId: "review-closure-previous",
    linkedEvidenceIds: ["evidence-case-closure"],
    linkedResolutionIds: ["resolution-closure"],
    linkedEscalationIds: ["escalation-closure"],
    linkedClosureIds: ["closure-case-closure"],
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    reviewDecisionSequence: 1,
    supersededByReviewDecisionId: "review-closure-current",
    supersedesReviewDecisionId: null,
    supersessionReason: "superseded by later bounded review decision",
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({ governanceCaseReviewDecisionProfiles: [current, previous] });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({ governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile });
  const selectionSummary = buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const selectionFinalAcceptance = buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionCurrentSelectionSummaryProfile: selectionSummary,
  });
  const selectionExplanation = buildGovernanceCaseReviewDecisionSelectionExplanation({
    governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const selectionExplanationContract = buildGovernanceCaseReviewDecisionSelectionExplanationContract({
    governanceCaseReviewDecisionSelectionExplanationProfile: selectionExplanation,
  });
  const selectionExplanationFinalAcceptance = buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary({
    governanceCaseReviewDecisionSelectionExplanationProfile: selectionExplanation,
    governanceCaseReviewDecisionSelectionExplanationContract: selectionExplanationContract,
  });
  const selectionReceipt = buildGovernanceCaseReviewDecisionSelectionReceipt({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary: selectionFinalAcceptance,
    governanceCaseReviewDecisionSelectionExplanationProfile: selectionExplanation,
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary: selectionExplanationFinalAcceptance,
  });
  const selectionReceiptContract = buildGovernanceCaseReviewDecisionSelectionReceiptContract({
    governanceCaseReviewDecisionSelectionReceiptProfile: selectionReceipt,
  });
  const selectionReceiptFinalAcceptance = buildGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary({
    governanceCaseReviewDecisionSelectionReceiptProfile: selectionReceipt,
    governanceCaseReviewDecisionSelectionReceiptContract: selectionReceiptContract,
  });
  const applicabilityProfile = buildGovernanceCaseReviewDecisionApplicability({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary: selectionFinalAcceptance,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const applicabilityExplanation = buildGovernanceCaseReviewDecisionApplicabilityExplanation({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary: selectionFinalAcceptance,
    governanceCaseReviewDecisionApplicabilityProfile: applicabilityProfile,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const attestation = buildGovernanceCaseReviewDecisionAttestation({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary: selectionFinalAcceptance,
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary: selectionExplanationFinalAcceptance,
    governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary: selectionReceiptFinalAcceptance,
    governanceCaseReviewDecisionApplicabilityProfile: applicabilityProfile,
    governanceCaseReviewDecisionApplicabilityExplanationProfile: applicabilityExplanation,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  return { attestation, applicabilityProfile, applicabilityExplanation };
}

await import("./verify_governance_case_review_decision_attestation_applicability_closure_boundary.mjs");

{
  const fixture = buildFixture();
  const profile = buildGovernanceCaseReviewDecisionAttestationApplicabilityClosure({
    governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
    governanceCaseReviewDecisionApplicabilityProfile: fixture.applicabilityProfile,
    governanceCaseReviewDecisionApplicabilityExplanationProfile: fixture.applicabilityExplanation,
  });
  const contract =
    buildGovernanceCaseReviewDecisionAttestationApplicabilityClosureContract({
      governanceCaseReviewDecisionAttestationApplicabilityClosureProfile: profile,
    });
  const validation =
    validateGovernanceCaseReviewDecisionAttestationApplicabilityClosureContract(contract);
  if (!validation.ok) {
    throw new Error(
      `review decision attestation applicability closure hardening contract invalid: ${validation.errors.join("; ")}`
    );
  }
  for (const field of [
    "unique_current_attestation_view_required",
    "current_closure_selected_only",
    "unique_current_closure_required",
    "current_closure_selection_stable",
    "applicability_alignment_required",
    "applicability_explanation_alignment_required",
    "attestation_applicability_binding_unambiguous",
    "applicability_explanation_binding_unambiguous",
    "continuity_lineage_alignment_required",
    "continuity_chain_intact_required",
    "broken_continuity_rejected",
    "complete_supporting_linkage_required",
    "aggregate_export_only",
    "permit_aggregate_export_only",
  ]) {
    if (contract[field] !== true) {
      throw new Error(
        `review decision attestation applicability closure hardening contract drifted: ${field}`
      );
    }
  }
  for (const field of [
    "permit_lane_consumption",
    "audit_path_dependency",
    "main_path_takeover",
    "authority_scope_expansion",
    "new_governance_object",
    "observability_platform_behavior",
  ]) {
    if (contract[field] !== false) {
      throw new Error(
        `review decision attestation applicability closure hardening contract drifted: ${field}`
      );
    }
  }
  if (
    contract.kind !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_KIND ||
    contract.version !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_VERSION ||
    contract.boundary !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONTRACT_BOUNDARY
  ) {
    throw new Error("review decision attestation applicability closure hardening contract envelope drifted");
  }
}

{
  const fixture = buildFixture();
  assertRejected(() => {
    const broken = cloneJson(fixture.attestation);
    broken.governance_case_review_decision_attestation.validation_exports.unique_current_view_required = false;
    return buildGovernanceCaseReviewDecisionAttestationApplicabilityClosure({
      governanceCaseReviewDecisionAttestationProfile: broken,
      governanceCaseReviewDecisionApplicabilityProfile: fixture.applicabilityProfile,
      governanceCaseReviewDecisionApplicabilityExplanationProfile: fixture.applicabilityExplanation,
    });
  }, "unique_current_view_required", "review decision attestation applicability closure must reject non-unique current attestation view");
}

{
  const fixture = buildFixture();
  assertRejected(() => {
    const broken = cloneJson(fixture.applicabilityProfile);
    broken.governance_case_review_decision_applicability.validation_exports.current_selection_final_acceptance_available = false;
    return buildGovernanceCaseReviewDecisionAttestationApplicabilityClosure({
      governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
      governanceCaseReviewDecisionApplicabilityProfile: broken,
      governanceCaseReviewDecisionApplicabilityExplanationProfile: fixture.applicabilityExplanation,
    });
  }, "current_selection_final_acceptance_available", "review decision attestation applicability closure must reject unstable applicability selection context");
}

{
  const fixture = buildFixture();
  assertRejected(() => {
    const broken = cloneJson(fixture.applicabilityExplanation);
    broken.governance_case_review_decision_applicability_explanation.validation_exports.current_selection_final_acceptance_available = false;
    return buildGovernanceCaseReviewDecisionAttestationApplicabilityClosure({
      governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
      governanceCaseReviewDecisionApplicabilityProfile: fixture.applicabilityProfile,
      governanceCaseReviewDecisionApplicabilityExplanationProfile: broken,
    });
  }, "current_selection_final_acceptance_available", "review decision attestation applicability closure must reject unstable applicability explanation selection context");
}

{
  const fixture = buildFixture();
  const profile = buildGovernanceCaseReviewDecisionAttestationApplicabilityClosure({
    governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
    governanceCaseReviewDecisionApplicabilityProfile: fixture.applicabilityProfile,
    governanceCaseReviewDecisionApplicabilityExplanationProfile: fixture.applicabilityExplanation,
  });
  const contract =
    buildGovernanceCaseReviewDecisionAttestationApplicabilityClosureContract({
      governanceCaseReviewDecisionAttestationApplicabilityClosureProfile: profile,
    });
  assertRejected(() => {
    const mismatched = cloneJson(contract);
    mismatched.attestation_applicability_closure_profile_ref.closure_selection_id =
      "selection-other:attestation_applicability_closure";
    return consumeGovernanceCaseReviewDecisionAttestationApplicabilityClosure({
      governanceCaseReviewDecisionAttestationApplicabilityClosureProfile: profile,
      governanceCaseReviewDecisionAttestationApplicabilityClosureContract: mismatched,
    });
  }, "aligned", "review decision attestation applicability closure consumer must reject closure selection mismatch");
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SURFACE_MAP
    .governance_case_review_decision_attestation_applicability_closure.current_closure_selected_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SURFACE_MAP
    .governance_case_review_decision_attestation_applicability_closure.unique_current_closure_required !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SURFACE_MAP
    .governance_case_review_decision_attestation_applicability_closure.current_closure_selection_stable !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SURFACE_MAP
    .governance_case_review_decision_attestation_applicability_closure.attestation_applicability_binding_unambiguous !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SURFACE_MAP
    .governance_case_review_decision_attestation_applicability_closure.applicability_explanation_binding_unambiguous !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SURFACE_MAP
    .governance_case_review_decision_attestation_applicability_closure.continuity_lineage_alignment_required !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SURFACE_MAP
    .governance_case_review_decision_attestation_applicability_closure.permit_lane_consumption !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SURFACE_MAP
    .governance_case_review_decision_attestation_applicability_closure.main_path_takeover !== false
) {
  throw new Error("review decision attestation applicability closure hardening surface drifted");
}

process.stdout.write(
  "governance case review decision attestation applicability closure hardening verified\n"
);
