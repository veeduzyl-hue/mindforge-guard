import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_REVIEW_DECISION_NOT_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_REVIEW_DECISION_PROFILE_PRESENT,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SAME_CASE_BOUNDED,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SELECTED_CURRENT_REVIEW_DECISION,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP,
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
  buildGovernanceCaseReviewDecisionApplicability,
  buildGovernanceCaseReviewDecisionApplicabilityContract,
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
  consumeGovernanceCaseReviewDecisionApplicability,
  validateGovernanceCaseReviewDecisionApplicabilityContract,
  validateGovernanceCaseReviewDecisionApplicabilityProfile,
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
        "sha256:5555aaaabbbb6666cccc7777dddd8888eeee9999ffff0000aaaa1111bbbb2222",
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
        git: { head: "7777777777777777777777777777777777777777", branch: "branch" },
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
    reviewDecisionId: "review-applicability-current",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-applicability-previous",
    supersessionReason: "later bounded review decision",
  });
  const previous = buildReviewDecision(base, {
    reviewDecisionId: "review-applicability-previous",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-applicability-current",
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

  return {
    current,
    previous,
    selectionProfile,
    selectionContract,
    selectionSummary,
    selectionFinalAcceptance,
  };
}

await import("./verify_governance_case_review_decision_current_selection_final_acceptance.mjs");

{
  const fixture = buildSelectedFixture();
  const selectionBefore = stableStringify(fixture.selectionProfile);
  const applicabilityProfile = buildGovernanceCaseReviewDecisionApplicability({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      fixture.selectionFinalAcceptance,
    governanceCaseReviewDecisionProfiles: [fixture.current, fixture.previous],
  });
  const applicabilityContract = buildGovernanceCaseReviewDecisionApplicabilityContract({
    governanceCaseReviewDecisionApplicabilityProfile: applicabilityProfile,
  });
  const consumed = consumeGovernanceCaseReviewDecisionApplicability({
    governanceCaseReviewDecisionApplicabilityProfile: applicabilityProfile,
    governanceCaseReviewDecisionApplicabilityContract: applicabilityContract,
  });
  const payload = applicabilityProfile.governance_case_review_decision_applicability;

  if (stableStringify(fixture.selectionProfile) !== selectionBefore) {
    throw new Error("review decision applicability must not affect current selection");
  }
  if (validateGovernanceCaseReviewDecisionApplicabilityProfile(applicabilityProfile).ok !== true) {
    throw new Error("review decision applicability profile validation failed");
  }
  if (
    validateGovernanceCaseReviewDecisionApplicabilityContract(applicabilityContract).ok !== true
  ) {
    throw new Error("review decision applicability contract validation failed");
  }

  if (
    applicabilityProfile.kind !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_KIND ||
    applicabilityProfile.version !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_VERSION ||
    applicabilityProfile.schema_id !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_SCHEMA_ID ||
    payload.stage !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_STAGE ||
    payload.boundary !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_BOUNDARY ||
    payload.consumer_surface !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONSUMER_SURFACE
  ) {
    throw new Error("review decision applicability profile envelope drifted");
  }

  if (
    payload.applicability_context.applicability_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE ||
    JSON.stringify(payload.applicability_context.applicability_reason_codes) !==
      JSON.stringify([
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SELECTED_CURRENT_REVIEW_DECISION,
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SAME_CASE_BOUNDED,
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED,
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_REVIEW_DECISION_PROFILE_PRESENT,
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_REVIEW_DECISION_NOT_SUPERSEDED,
      ])
  ) {
    throw new Error("review decision applicability bounded reasons drifted");
  }

  for (const field of [
    "current_selection_final_acceptance_available",
    "selected_review_decision_profile_available",
    "export_surface_available",
  ]) {
    if (payload.validation_exports[field] !== true) {
      throw new Error(`review decision applicability validation export drifted: ${field}`);
    }
  }
  for (const field of [
    "supporting_artifact_only",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (payload.preserved_semantics[field] !== true) {
      throw new Error(`review decision applicability preserved semantic drifted: ${field}`);
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "selection_feedback_enabled",
    "main_path_takeover",
    "authority_scope_expansion",
    "governance_object_addition",
    "risk_integration",
    "ui_control_plane",
  ]) {
    if (payload.preserved_semantics[field] !== false) {
      throw new Error(`review decision applicability preserved semantic drifted: ${field}`);
    }
  }

  if (
    applicabilityContract.kind !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONTRACT_KIND ||
    applicabilityContract.version !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONTRACT_VERSION ||
    applicabilityContract.boundary !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONTRACT_BOUNDARY
  ) {
    throw new Error("review decision applicability contract envelope drifted");
  }
  for (const field of [
    "applicability_available",
    "selected_current_review_decision_only",
    "current_selection_final_acceptance_required",
    "selected_review_decision_profile_required",
    "strict_case_id_alignment_required",
    "strict_current_review_decision_id_alignment_required",
    "strict_canonical_action_hash_alignment_required",
    "supporting_artifact_only",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (applicabilityContract[field] !== true) {
      throw new Error(`review decision applicability contract drifted: ${field}`);
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
    if (applicabilityContract[field] !== false) {
      throw new Error(`review decision applicability contract drifted: ${field}`);
    }
  }
  if (
    consumed.supporting_artifact_only !== true ||
    consumed.recommendation_only !== true ||
    consumed.additive_only !== true ||
    consumed.non_executing !== true ||
    consumed.default_off !== true ||
    consumed.judgment_source_enabled !== false ||
    consumed.authority_source_enabled !== false ||
    consumed.selection_feedback_enabled !== false
  ) {
    throw new Error("review decision applicability consumed summary drifted");
  }
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
      return buildGovernanceCaseReviewDecisionApplicability({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          unsupported,
        governanceCaseReviewDecisionProfiles: [fixture.current, fixture.previous],
      });
    },
    "only supports selected",
    "review decision applicability must reject non-selected state"
  );
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionApplicability({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          fixture.selectionFinalAcceptance,
        governanceCaseReviewDecisionProfiles: [fixture.previous],
      }),
    "selected review decision profile is required",
    "review decision applicability must reject missing selected review decision profile"
  );
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const mismatched = cloneJson(fixture.current);
      mismatched.canonical_action_hash =
        "sha256:aaaaaaaa11111111bbbbbbbb22222222cccccccc33333333dddddddd44444444";
      return buildGovernanceCaseReviewDecisionApplicability({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          fixture.selectionFinalAcceptance,
        governanceCaseReviewDecisionProfiles: [mismatched, fixture.previous],
      });
    },
    "selected review decision profile is required",
    "review decision applicability must reject canonical_action_hash mismatch"
  );
}

{
  const fixture = buildSelectedFixture();
  assertRejected(
    () => {
      const superseded = cloneJson(fixture.current);
      superseded.governance_case_review_decision.review_decision_context.superseded_by_review_decision_id =
        "review-other";
      superseded.governance_case_review_decision.review_decision_context.continuity_mode =
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED;
      return buildGovernanceCaseReviewDecisionApplicability({
        governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
          fixture.selectionFinalAcceptance,
        governanceCaseReviewDecisionProfiles: [superseded, fixture.previous],
      });
    },
    "superseded review decisions",
    "review decision applicability must reject superseded selected review decision"
  );
}

{
  const fixture = buildSelectedFixture();
  const applicabilityProfile = buildGovernanceCaseReviewDecisionApplicability({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      fixture.selectionFinalAcceptance,
    governanceCaseReviewDecisionProfiles: [fixture.current, fixture.previous],
  });
  const applicabilityContract = buildGovernanceCaseReviewDecisionApplicabilityContract({
    governanceCaseReviewDecisionApplicabilityProfile: applicabilityProfile,
  });
  assertRejected(
    () => {
      const mismatched = cloneJson(applicabilityContract);
      mismatched.current_review_decision_id = "review-other";
      return consumeGovernanceCaseReviewDecisionApplicability({
        governanceCaseReviewDecisionApplicabilityProfile: applicabilityProfile,
        governanceCaseReviewDecisionApplicabilityContract: mismatched,
      });
    },
    "profile and contract must remain aligned",
    "review decision applicability consumer must reject contract mismatch"
  );
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP
    .governance_case_review_decision_applicability ||
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP
    .governance_case_review_decision_applicability.additive_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP
    .governance_case_review_decision_applicability.default_off !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP
    .governance_case_review_decision_applicability.judgment_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP
    .governance_case_review_decision_applicability.authority_source_enabled !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP
    .governance_case_review_decision_applicability.audit_path_dependency !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP
    .governance_case_review_decision_applicability.main_path_takeover !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP
    .governance_case_review_decision_applicability.executing !== false
) {
  throw new Error("review decision applicability export surface drifted");
}

for (const exportName of [
  "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONTRACT_KIND",
  "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_SURFACE_MAP",
  "buildGovernanceCaseReviewDecisionApplicability",
  "consumeGovernanceCaseReviewDecisionApplicability",
  "exportGovernanceCaseReviewDecisionApplicabilitySurface",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(`review decision applicability permit export missing: ${exportName}`);
  }
}

process.stdout.write(
  "governance case review decision applicability boundary verified\n"
);
