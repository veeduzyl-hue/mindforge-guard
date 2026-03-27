import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SCOPE_CURRENT_ATTESTATION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_STATUS_TRACED,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP,
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
  buildGovernanceCaseReviewDecisionAttestationReceipt,
  buildGovernanceCaseReviewDecisionAttestationTraceability,
  buildGovernanceCaseReviewDecisionAttestationTraceabilityContract,
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
  consumeGovernanceCaseReviewDecisionAttestationTraceability,
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
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "9".repeat(40), branch: "branch" },
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

function buildFixture() {
  const base = buildBase("would_review");
  const current = buildReviewDecision(base, {
    reviewDecisionId: "review-traceability-current",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-traceability-previous",
    supersessionReason: "later bounded review decision",
  });
  const previous = buildReviewDecision(base, {
    reviewDecisionId: "review-traceability-previous",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-traceability-current",
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
  const attestation = buildGovernanceCaseReviewDecisionAttestation({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      selectionFinalAcceptance,
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
      selectionExplanationFinalAcceptance,
    governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary:
      selectionReceiptFinalAcceptance,
    governanceCaseReviewDecisionApplicabilityProfile: applicabilityProfile,
    governanceCaseReviewDecisionApplicabilityExplanationProfile:
      applicabilityExplanation,
    governanceCaseReviewDecisionProfiles: [current, previous],
  });
  const explanation = buildGovernanceCaseReviewDecisionAttestationExplanation({
    governanceCaseReviewDecisionAttestationProfile: attestation,
    governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary:
      selectionExplanationFinalAcceptance,
    governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary:
      selectionReceiptFinalAcceptance,
    governanceCaseReviewDecisionApplicabilityProfile: applicabilityProfile,
    governanceCaseReviewDecisionApplicabilityExplanationProfile:
      applicabilityExplanation,
  });
  const receipt = buildGovernanceCaseReviewDecisionAttestationReceipt({
    governanceCaseReviewDecisionAttestationProfile: attestation,
    governanceCaseReviewDecisionAttestationExplanationProfile: explanation,
  });
  return { attestation, explanation, receipt };
}

await import("./verify_governance_case_review_decision_attestation_receipt_boundary.mjs");

{
  const fixture = buildFixture();
  const profile = buildGovernanceCaseReviewDecisionAttestationTraceability({
    governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
    governanceCaseReviewDecisionAttestationExplanationProfile:
      fixture.explanation,
    governanceCaseReviewDecisionAttestationReceiptProfile: fixture.receipt,
  });
  const contract =
    buildGovernanceCaseReviewDecisionAttestationTraceabilityContract({
      governanceCaseReviewDecisionAttestationTraceabilityProfile: profile,
    });
  const consumed = consumeGovernanceCaseReviewDecisionAttestationTraceability({
    governanceCaseReviewDecisionAttestationTraceabilityProfile: profile,
    governanceCaseReviewDecisionAttestationTraceabilityContract: contract,
  });
  const payload =
    profile.governance_case_review_decision_attestation_traceability;

  if (
    profile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_KIND ||
    profile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_VERSION ||
    profile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_SCHEMA_ID ||
    payload.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_STAGE ||
    payload.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_BOUNDARY ||
    payload.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONSUMER_SURFACE ||
    payload.traceability_context.traceability_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_STATUS_TRACED ||
    payload.traceability_context.traceability_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SCOPE_CURRENT_ATTESTATION
  ) {
    throw new Error("review decision attestation traceability profile envelope drifted");
  }
  if (
    contract.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_KIND ||
    contract.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_VERSION ||
    contract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_BOUNDARY
  ) {
    throw new Error("review decision attestation traceability contract envelope drifted");
  }
  if (
    consumed.derived_only !== true ||
    consumed.supporting_artifact_only !== true ||
    consumed.non_authoritative !== true ||
    consumed.additive_only !== true ||
    consumed.non_executing !== true ||
    consumed.default_off !== true ||
    consumed.judgment_source_enabled !== false ||
    consumed.authority_source_enabled !== false ||
    consumed.execution_binding_enabled !== false ||
    consumed.risk_source_enabled !== false ||
    consumed.main_path_takeover !== false
  ) {
    throw new Error("review decision attestation traceability preserved summary drifted");
  }
}

{
  const fixture = buildFixture();
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionAttestationTraceability({
        governanceCaseReviewDecisionAttestationProfile: null,
        governanceCaseReviewDecisionAttestationExplanationProfile:
          fixture.explanation,
        governanceCaseReviewDecisionAttestationReceiptProfile: fixture.receipt,
      }),
    "profile must be an object",
    "review decision attestation traceability must reject missing attestation"
  );
}

{
  const fixture = buildFixture();
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionAttestationTraceability({
        governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
        governanceCaseReviewDecisionAttestationExplanationProfile: null,
        governanceCaseReviewDecisionAttestationReceiptProfile: fixture.receipt,
      }),
    "profile must be an object",
    "review decision attestation traceability must reject missing attestation explanation"
  );
}

{
  const fixture = buildFixture();
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionAttestationTraceability({
        governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
        governanceCaseReviewDecisionAttestationExplanationProfile:
          fixture.explanation,
        governanceCaseReviewDecisionAttestationReceiptProfile: null,
      }),
    "profile must be an object",
    "review decision attestation traceability must reject missing attestation receipt"
  );
}

{
  const fixture = buildFixture();
  assertRejected(() => {
    const broken = cloneJson(fixture.attestation);
    broken.governance_case_review_decision_attestation.attestation_context.continuity_status =
      "superseded";
    return buildGovernanceCaseReviewDecisionAttestationTraceability({
      governanceCaseReviewDecisionAttestationProfile: broken,
      governanceCaseReviewDecisionAttestationExplanationProfile:
        fixture.explanation,
      governanceCaseReviewDecisionAttestationReceiptProfile: fixture.receipt,
    });
  }, "broken continuity", "review decision attestation traceability must reject broken continuity current attestation");
}

{
  const fixture = buildFixture();
  assertRejected(() => {
    const mismatched = cloneJson(fixture.receipt);
    mismatched.governance_case_review_decision_attestation_receipt.attestation_receipt_ref.case_id =
      "case-other";
    return buildGovernanceCaseReviewDecisionAttestationTraceability({
      governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
      governanceCaseReviewDecisionAttestationExplanationProfile:
        fixture.explanation,
      governanceCaseReviewDecisionAttestationReceiptProfile: mismatched,
    });
  }, "case_id", "review decision attestation traceability must reject cross-case mismatch");
}

{
  const fixture = buildFixture();
  assertRejected(() => {
    const mismatched = cloneJson(fixture.receipt);
    mismatched.governance_case_review_decision_attestation_receipt.attestation_receipt_ref.review_decision_id =
      "review-other";
    return buildGovernanceCaseReviewDecisionAttestationTraceability({
      governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
      governanceCaseReviewDecisionAttestationExplanationProfile:
        fixture.explanation,
      governanceCaseReviewDecisionAttestationReceiptProfile: mismatched,
    });
  }, "review_decision_id", "review decision attestation traceability must reject cross-review-decision mismatch");
}

{
  const fixture = buildFixture();
  assertRejected(() => {
    const mismatched = cloneJson(fixture.receipt);
    mismatched.canonical_action_hash =
      "sha256:other0000bbbb8888cccc9999dddd0000eeee1111ffff2222aaaa3333bbbb4444";
    return buildGovernanceCaseReviewDecisionAttestationTraceability({
      governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
      governanceCaseReviewDecisionAttestationExplanationProfile:
        fixture.explanation,
      governanceCaseReviewDecisionAttestationReceiptProfile: mismatched,
    });
  }, "canonical_action_hash", "review decision attestation traceability must reject cross-canonical-action-hash mismatch");
}

{
  const fixture = buildFixture();
  assertRejected(() => {
    const missing = cloneJson(fixture.receipt);
    missing.governance_case_review_decision_attestation_receipt.receipt_context.receipt_basis.applicability_explanation_aligned =
      false;
    return buildGovernanceCaseReviewDecisionAttestationTraceability({
      governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
      governanceCaseReviewDecisionAttestationExplanationProfile:
        fixture.explanation,
      governanceCaseReviewDecisionAttestationReceiptProfile: missing,
    });
  }, "applicability_explanation_aligned", "review decision attestation traceability must reject missing supporting linkage");
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.derived_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.supporting_artifact_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.non_authoritative !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.additive_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.aggregate_export_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.permit_aggregate_export_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.permit_lane_consumption !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.judgment_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.authority_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.execution_binding_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.risk_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.audit_path_dependency !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.main_path_takeover !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.governance_object_addition !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.ui_control_plane !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP.governance_case_review_decision_attestation_traceability.executing !== false
) {
  throw new Error("review decision attestation traceability export surface drifted");
}

for (const exportName of [
  "buildGovernanceCaseReviewDecisionAttestationTraceability",
  "buildGovernanceCaseReviewDecisionAttestationTraceabilityContract",
  "consumeGovernanceCaseReviewDecisionAttestationTraceability",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SURFACE_MAP",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(`review decision attestation traceability permit export missing: ${exportName}`);
  }
}

process.stdout.write(
  "governance case review decision attestation traceability boundary verified\n"
);
