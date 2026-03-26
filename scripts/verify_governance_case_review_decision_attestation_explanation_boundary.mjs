import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP,
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
  buildGovernanceCaseReviewDecisionAttestationExplanation,
  buildGovernanceCaseReviewDecisionAttestationExplanationContract,
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
  consumeGovernanceCaseReviewDecisionAttestationExplanation,
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

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:7777aaaabbbb8888cccc9999dddd0000eeee1111ffff2222aaaa3333bbbb4444",
      action: { action_class: "file.write" },
    },
    policyPreviewArtifact: {
      policy_preview: { preview_verdict: decision === "would_deny" ? "review" : "allow" },
    },
    permitPrecheckArtifact: {
      permit_precheck: { decision: decision === "would_deny" ? "deny" : "allow" },
    },
    executionBridgeArtifact: {
      execution_bridge: { bridge_verdict: decision === "would_deny" ? "deny" : "allow" },
    },
    executionReadinessArtifact: { execution_readiness: { readiness: "ready" } },
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
    audit: { run: { run_id: "run", mode: "local", git: { head: "9".repeat(40), branch: "branch" } } },
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
  const caseId = `case-${decision}`;
  const resolutionId = `resolution-${decision}`;
  const escalationId = `escalation-${decision}`;
  const closureId = `closure-${caseId}`;
  const evidenceId = `evidence-${caseId}`;
  const resolutionProfile = buildGovernanceCaseResolutionProfile({ governanceExceptionStabilizationProfile: exceptionStabilization, caseId, linkedExceptionIds: [`exception-${decision}`], linkedOverrideRecordIds: [`override-${decision}`] });
  const resolutionContract = buildGovernanceCaseResolutionContract({ governanceCaseResolutionProfile: resolutionProfile });
  const resolutionCompatibility = buildGovernanceCaseResolutionCompatibilityContract({ governanceCaseResolutionContract: resolutionContract });
  const resolutionStabilization = buildGovernanceCaseResolutionStabilizationProfile({ governanceCaseResolutionProfile: resolutionProfile, governanceCaseResolutionCompatibilityContract: resolutionCompatibility });
  const escalationProfile = buildGovernanceCaseEscalationProfile({ governanceCaseResolutionStabilizationProfile: resolutionStabilization, caseId, linkedExceptionIds: [`exception-${decision}`], linkedOverrideRecordIds: [`override-${decision}`], linkedResolutionIds: [resolutionId] });
  const escalationContract = buildGovernanceCaseEscalationContract({ governanceCaseEscalationProfile: escalationProfile });
  const escalationCompatibility = buildGovernanceCaseEscalationCompatibilityContract({ governanceCaseEscalationContract: escalationContract });
  const escalationStabilization = buildGovernanceCaseEscalationStabilizationProfile({ governanceCaseEscalationProfile: escalationProfile, governanceCaseEscalationCompatibilityContract: escalationCompatibility });
  const closureProfile = buildGovernanceCaseClosureProfile({ governanceCaseEscalationStabilizationProfile: escalationStabilization, caseId, linkedExceptionIds: [`exception-${decision}`], linkedOverrideRecordIds: [`override-${decision}`], linkedResolutionIds: [resolutionId], linkedEscalationIds: [escalationId] });
  const closureContract = buildGovernanceCaseClosureContract({ governanceCaseClosureProfile: closureProfile });
  const closureCompatibility = buildGovernanceCaseClosureCompatibilityContract({ governanceCaseClosureContract: closureContract });
  const closureStabilization = buildGovernanceCaseClosureStabilizationProfile({ governanceCaseClosureProfile: closureProfile, governanceCaseClosureCompatibilityContract: closureCompatibility });
  const caseEvidenceProfile = buildGovernanceCaseEvidenceProfile({ governanceCaseClosureStabilizationProfile: closureStabilization, caseId, linkedResolutionIds: [resolutionId], linkedEscalationIds: [escalationId], linkedClosureIds: [closureId], linkedExceptionIds: [`exception-${decision}`], linkedOverrideRecordIds: [`override-${decision}`] });
  buildGovernanceCaseEvidenceContract({ governanceCaseEvidenceProfile: caseEvidenceProfile });
  return { caseId, resolutionId, escalationId, closureId, evidenceId, caseEvidenceProfile };
}

function buildReviewDecision(base, overrides = {}) {
  return buildGovernanceCaseReviewDecisionProfile({
    governanceCaseEvidenceProfile: base.caseEvidenceProfile,
    caseId: overrides.caseId ?? base.caseId,
    reviewDecisionId: overrides.reviewDecisionId ?? `review-${base.caseId}`,
    linkedEvidenceIds: [base.evidenceId],
    linkedResolutionIds: [base.resolutionId],
    linkedEscalationIds: [base.escalationId],
    linkedClosureIds: [base.closureId],
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
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({ governanceCaseReviewDecisionProfiles: [current, previous] });
  const selectionContract = buildGovernanceCaseReviewDecisionCurrentSelectionContract({ governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile });
  const selectionSummary = buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile({ governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile, governanceCaseReviewDecisionCurrentSelectionContract: selectionContract, governanceCaseReviewDecisionProfiles: [current, previous] });
  const selectionFinalAcceptance = buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary({ governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile, governanceCaseReviewDecisionCurrentSelectionContract: selectionContract, governanceCaseReviewDecisionCurrentSelectionSummaryProfile: selectionSummary });
  const selectionExplanation = buildGovernanceCaseReviewDecisionSelectionExplanation({ governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile, governanceCaseReviewDecisionCurrentSelectionContract: selectionContract, governanceCaseReviewDecisionProfiles: [current, previous] });
  const selectionExplanationContract = buildGovernanceCaseReviewDecisionSelectionExplanationContract({ governanceCaseReviewDecisionSelectionExplanationProfile: selectionExplanation });
  const selectionExplanationFinalAcceptance = buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary({ governanceCaseReviewDecisionSelectionExplanationProfile: selectionExplanation, governanceCaseReviewDecisionSelectionExplanationContract: selectionExplanationContract });
  const selectionReceipt = buildGovernanceCaseReviewDecisionSelectionReceipt({ governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary: selectionFinalAcceptance, governanceCaseReviewDecisionSelectionExplanationProfile: selectionExplanation, governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary: selectionExplanationFinalAcceptance });
  const selectionReceiptContract = buildGovernanceCaseReviewDecisionSelectionReceiptContract({ governanceCaseReviewDecisionSelectionReceiptProfile: selectionReceipt });
  const selectionReceiptFinalAcceptance = buildGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary({ governanceCaseReviewDecisionSelectionReceiptProfile: selectionReceipt, governanceCaseReviewDecisionSelectionReceiptContract: selectionReceiptContract });
  const applicabilityProfile = buildGovernanceCaseReviewDecisionApplicability({ governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary: selectionFinalAcceptance, governanceCaseReviewDecisionProfiles: [current, previous] });
  const applicabilityExplanation = buildGovernanceCaseReviewDecisionApplicabilityExplanation({ governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary: selectionFinalAcceptance, governanceCaseReviewDecisionApplicabilityProfile: applicabilityProfile, governanceCaseReviewDecisionProfiles: [current, previous] });
  const attestationProfile = buildGovernanceCaseReviewDecisionAttestation({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary: selectionFinalAcceptance,
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary: selectionExplanationFinalAcceptance,
    governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary: selectionReceiptFinalAcceptance,
    governanceCaseReviewDecisionApplicabilityProfile: applicabilityProfile,
    governanceCaseReviewDecisionApplicabilityExplanationProfile: applicabilityExplanation,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  return { selectionExplanationFinalAcceptance, selectionReceiptFinalAcceptance, applicabilityProfile, applicabilityExplanation, attestationProfile };
}

await import("./verify_governance_case_review_decision_attestation_boundary.mjs");

{
  const fixture = buildSelectedFixture();
  const profile = buildGovernanceCaseReviewDecisionAttestationExplanation({
    governanceCaseReviewDecisionAttestationProfile: fixture.attestationProfile,
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary: fixture.selectionExplanationFinalAcceptance,
    governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary: fixture.selectionReceiptFinalAcceptance,
    governanceCaseReviewDecisionApplicabilityProfile: fixture.applicabilityProfile,
    governanceCaseReviewDecisionApplicabilityExplanationProfile: fixture.applicabilityExplanation,
  });
  const contract = buildGovernanceCaseReviewDecisionAttestationExplanationContract({
    governanceCaseReviewDecisionAttestationExplanationProfile: profile,
  });
  const consumed = consumeGovernanceCaseReviewDecisionAttestationExplanation({
    governanceCaseReviewDecisionAttestationExplanationProfile: profile,
    governanceCaseReviewDecisionAttestationExplanationContract: contract,
  });
  if (
    consumed.derived_only !== true ||
    consumed.supporting_artifact_only !== true ||
    consumed.non_authoritative !== true ||
    consumed.additive_only !== true ||
    consumed.non_executing !== true ||
    consumed.default_off !== true
  ) {
    throw new Error("review decision attestation explanation preserved summary drifted");
  }
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionAttestationExplanation({
        governanceCaseReviewDecisionAttestationProfile: null,
        governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary: fixture.selectionExplanationFinalAcceptance,
        governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary: fixture.selectionReceiptFinalAcceptance,
        governanceCaseReviewDecisionApplicabilityProfile: fixture.applicabilityProfile,
        governanceCaseReviewDecisionApplicabilityExplanationProfile: fixture.applicabilityExplanation,
      }),
    "profile must be an object",
    "review decision attestation explanation must reject missing attestation"
  );
}

{
  const fixture = buildSelectedFixture();
  assertRejected(() => {
    const broken = cloneJson(fixture.attestationProfile);
    broken.governance_case_review_decision_attestation.attestation_context.continuity_status = "superseded";
    return buildGovernanceCaseReviewDecisionAttestationExplanation({
      governanceCaseReviewDecisionAttestationProfile: broken,
      governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary: fixture.selectionExplanationFinalAcceptance,
      governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary: fixture.selectionReceiptFinalAcceptance,
      governanceCaseReviewDecisionApplicabilityProfile: fixture.applicabilityProfile,
      governanceCaseReviewDecisionApplicabilityExplanationProfile: fixture.applicabilityExplanation,
    });
  }, "broken continuity", "review decision attestation explanation must reject broken continuity current attestation");
}

{
  const fixture = buildSelectedFixture();
  assertRejected(() => {
    const mismatched = cloneJson(fixture.selectionExplanationFinalAcceptance);
    mismatched.governance_case_review_decision_selection_explanation_final_acceptance.selection_explanation_profile_ref.case_id = "case-other";
    return buildGovernanceCaseReviewDecisionAttestationExplanation({
      governanceCaseReviewDecisionAttestationProfile: fixture.attestationProfile,
      governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary: mismatched,
      governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary: fixture.selectionReceiptFinalAcceptance,
      governanceCaseReviewDecisionApplicabilityProfile: fixture.applicabilityProfile,
      governanceCaseReviewDecisionApplicabilityExplanationProfile: fixture.applicabilityExplanation,
    });
  }, "case_id drifted", "review decision attestation explanation must reject selection explanation cross-case mismatch");
}

{
  const fixture = buildSelectedFixture();
  assertRejected(() => {
    const mismatched = cloneJson(fixture.selectionReceiptFinalAcceptance);
    mismatched.governance_case_review_decision_selection_receipt_final_acceptance.selection_receipt_profile_ref.current_review_decision_id = "review-other";
    return buildGovernanceCaseReviewDecisionAttestationExplanation({
      governanceCaseReviewDecisionAttestationProfile: fixture.attestationProfile,
      governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary: fixture.selectionExplanationFinalAcceptance,
      governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary: mismatched,
      governanceCaseReviewDecisionApplicabilityProfile: fixture.applicabilityProfile,
      governanceCaseReviewDecisionApplicabilityExplanationProfile: fixture.applicabilityExplanation,
    });
  }, "identity aligned", "review decision attestation explanation must reject selection receipt cross-review-decision mismatch");
}

{
  const fixture = buildSelectedFixture();
  assertRejected(() => {
    const mismatched = cloneJson(fixture.applicabilityProfile);
    mismatched.canonical_action_hash = "sha256:other0000bbbb8888cccc9999dddd0000eeee1111ffff2222aaaa3333bbbb4444";
    return buildGovernanceCaseReviewDecisionAttestationExplanation({
      governanceCaseReviewDecisionAttestationProfile: fixture.attestationProfile,
      governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary: fixture.selectionExplanationFinalAcceptance,
      governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary: fixture.selectionReceiptFinalAcceptance,
      governanceCaseReviewDecisionApplicabilityProfile: mismatched,
      governanceCaseReviewDecisionApplicabilityExplanationProfile: fixture.applicabilityExplanation,
    });
  }, "canonical_action_hash", "review decision attestation explanation must reject cross-canonical-action-hash mismatch");
}

{
  const fixture = buildSelectedFixture();
  assertRejected(() => {
    const missing = cloneJson(fixture.selectionExplanationFinalAcceptance);
    missing.governance_case_review_decision_selection_explanation_final_acceptance.final_acceptance_contract.readiness_level = "not_ready";
    return buildGovernanceCaseReviewDecisionAttestationExplanation({
      governanceCaseReviewDecisionAttestationProfile: fixture.attestationProfile,
      governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary: missing,
      governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary: fixture.selectionReceiptFinalAcceptance,
      governanceCaseReviewDecisionApplicabilityProfile: fixture.applicabilityProfile,
      governanceCaseReviewDecisionApplicabilityExplanationProfile: fixture.applicabilityExplanation,
    });
  }, "readiness drifted", "review decision attestation explanation must reject missing supporting linkage readiness");
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_explanation ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_explanation.derived_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_explanation.supporting_artifact_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_explanation.non_authoritative !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_explanation.additive_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_explanation.aggregate_export_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_explanation.permit_aggregate_export_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_explanation.permit_lane_consumption !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_explanation.main_path_takeover !== false
) {
  throw new Error("review decision attestation explanation export surface drifted");
}

for (const exportName of [
  "buildGovernanceCaseReviewDecisionAttestationExplanation",
  "buildGovernanceCaseReviewDecisionAttestationExplanationContract",
  "consumeGovernanceCaseReviewDecisionAttestationExplanation",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SURFACE_MAP",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(`review decision attestation explanation permit export missing: ${exportName}`);
  }
}

process.stdout.write(
  "governance case review decision attestation explanation boundary verified\n"
);
