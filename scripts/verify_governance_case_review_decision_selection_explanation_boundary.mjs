import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CONTINUITY_CHAIN_RESOLVED,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_DETERMINISTIC_SELECTION_PRESERVED,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SAME_CASE_BOUNDED,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SEQUENCE_CONTINUITY_PRESERVED,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SUPERSEDED_EXCLUDED,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_UNIQUE_TERMINAL_SELECTED,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_STATUS_AVAILABLE,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_SURFACE_MAP,
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
  consumeGovernanceCaseReviewDecisionSelectionExplanation,
  validateGovernanceCaseReviewDecisionSelectionExplanationContract,
  validateGovernanceCaseReviewDecisionSelectionExplanationProfile,
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
        "sha256:9999aaaabbbbcccc9999aaaabbbbcccc9999aaaabbbbcccc9999aaaabbbbcccc",
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

function buildBaseReviewDecisionArtifacts(decision) {
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

  return {
    caseId,
    resolutionId,
    escalationId,
    closureId,
    evidenceId,
    caseEvidenceProfile,
  };
}

function buildReviewDecisionArtifacts(base, overrides = {}) {
  const profile = buildGovernanceCaseReviewDecisionProfile({
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
  const contract = buildGovernanceCaseReviewDecisionContract({
    governanceCaseReviewDecisionProfile: profile,
  });
  return { profile, contract };
}

const base = buildBaseReviewDecisionArtifacts("would_review");

{
  const current = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-explanation-current",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-explanation-previous",
    supersessionReason: "later bounded review decision",
  });
  const previous = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-explanation-previous",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-explanation-current",
    supersessionReason: "superseded by later bounded review decision",
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current.profile, previous.profile],
  });
  const selectionContract =
    buildGovernanceCaseReviewDecisionCurrentSelectionContract({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    });
  const explanationProfile =
    buildGovernanceCaseReviewDecisionSelectionExplanation({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
      governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
      governanceCaseReviewDecisionProfiles: [current.profile, previous.profile],
    });
  const explanationContract =
    buildGovernanceCaseReviewDecisionSelectionExplanationContract({
      governanceCaseReviewDecisionSelectionExplanationProfile:
        explanationProfile,
    });
  const consumed = consumeGovernanceCaseReviewDecisionSelectionExplanation({
    governanceCaseReviewDecisionSelectionExplanationProfile: explanationProfile,
    governanceCaseReviewDecisionSelectionExplanationContract:
      explanationContract,
  });
  const profileValidation =
    validateGovernanceCaseReviewDecisionSelectionExplanationProfile(
      explanationProfile
    );
  const contractValidation =
    validateGovernanceCaseReviewDecisionSelectionExplanationContract(
      explanationContract
    );
  if (!profileValidation.ok || !contractValidation.ok) {
    throw new Error(
      `selection explanation profile/contract validation failed: ${[
        ...profileValidation.errors,
        ...contractValidation.errors,
      ].join("; ")}`
    );
  }
  if (
    explanationProfile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_KIND ||
    explanationProfile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_VERSION ||
    explanationProfile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_SCHEMA_ID ||
    explanationProfile.governance_case_review_decision_selection_explanation
      .stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_STAGE ||
    explanationProfile.governance_case_review_decision_selection_explanation
      .consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONSUMER_SURFACE ||
    explanationProfile.governance_case_review_decision_selection_explanation
      .boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_BOUNDARY
  ) {
    throw new Error("selection explanation profile envelope drifted");
  }
  if (
    explanationContract.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_KIND ||
    explanationContract.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_VERSION ||
    explanationContract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_BOUNDARY ||
    explanationContract.supporting_artifact_only !== true ||
    explanationContract.recommendation_only !== true ||
    explanationContract.additive_only !== true ||
    explanationContract.non_executing !== true ||
    explanationContract.default_off !== true ||
    explanationContract.freeform_explanation !== false ||
    explanationContract.ranking_scoring_engine !== false ||
    explanationContract.main_path_takeover !== false ||
    explanationContract.authority_scope_expansion !== false ||
    explanationContract.new_governance_object !== false
  ) {
    throw new Error("selection explanation contract drifted");
  }
  if (
    consumed.explanation_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_STATUS_AVAILABLE ||
    consumed.selection_status !== "selected" ||
    consumed.current_review_decision_id !== "review-explanation-current" ||
    consumed.supporting_artifact_only !== true ||
    consumed.recommendation_only !== true ||
    consumed.additive_only !== true ||
    consumed.executing !== false
  ) {
    throw new Error("selection explanation consumed summary drifted");
  }
  const expectedReasonCodes = [
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SAME_CASE_BOUNDED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SUPERSEDED_EXCLUDED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_UNIQUE_TERMINAL_SELECTED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_SEQUENCE_CONTINUITY_PRESERVED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_DETERMINISTIC_SELECTION_PRESERVED,
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_REASON_CONTINUITY_CHAIN_RESOLVED,
  ];
  if (
    stableStringify(consumed.reason_codes) !== stableStringify(expectedReasonCodes)
  ) {
    throw new Error("selection explanation reason codes drifted");
  }
}

{
  const current = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-standalone-current",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current.profile],
  });
  const selectionContract =
    buildGovernanceCaseReviewDecisionCurrentSelectionContract({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    });
  const explanationProfile =
    buildGovernanceCaseReviewDecisionSelectionExplanation({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
      governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
      governanceCaseReviewDecisionProfiles: [current.profile],
    });
  if (
    !explanationProfile.governance_case_review_decision_selection_explanation.explanation_context.reason_codes.includes(
      "standalone_selection_confirmed"
    )
  ) {
    throw new Error("standalone selection explanation reason drifted");
  }
}

{
  const a = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-conflict-a",
    reviewDecisionSequence: 1,
  });
  const b = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-conflict-b",
    reviewDecisionSequence: 2,
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [a.profile, b.profile],
  });
  if (
    selectionProfile.governance_case_review_decision_current_selection
      .selection_context.selection_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT
  ) {
    throw new Error("selection conflict fixture drifted");
  }
  const selectionContract =
    buildGovernanceCaseReviewDecisionCurrentSelectionContract({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    });
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionSelectionExplanation({
        governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
        governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
        governanceCaseReviewDecisionProfiles: [a.profile, b.profile],
      }),
    "only supports current selection status 'selected'",
    "selection explanation must only apply to current selected review decisions"
  );
}

{
  const current = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-aligned-current",
    reviewDecisionSequence: 1,
  });
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current.profile],
  });
  const selectionContract =
    buildGovernanceCaseReviewDecisionCurrentSelectionContract({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    });
  const wrongProfile = cloneJson(current.profile);
  wrongProfile.governance_case_review_decision.review_decision_context.review_decision_id =
    "review-other";
  assertRejected(
    () =>
      buildGovernanceCaseReviewDecisionSelectionExplanation({
        governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
        governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
        governanceCaseReviewDecisionProfiles: [wrongProfile],
      }),
    "current selected review decision profile is required",
    "selection explanation must stay bounded to existing review decision and current selection inputs"
  );
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_SURFACE_MAP
    .governance_case_review_decision_selection_explanation ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_SURFACE_MAP
    .governance_case_review_decision_selection_explanation.additive_only !==
    true ||
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_SURFACE_MAP
    .governance_case_review_decision_selection_explanation.executing !== false
) {
  throw new Error("selection explanation additive export surface drifted");
}

if (
  !permitExports.GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_SURFACE_MAP
    ?.governance_case_review_decision_selection_explanation
) {
  throw new Error(
    "selection explanation surface export missing from permit aggregate"
  );
}

if (
  !(
    "buildGovernanceCaseReviewDecisionSelectionExplanation" in permitExports &&
    "buildGovernanceCaseReviewDecisionSelectionExplanationContract" in
      permitExports &&
    "consumeGovernanceCaseReviewDecisionSelectionExplanation" in permitExports
  )
) {
  throw new Error("selection explanation exports missing from permit aggregate");
}

process.stdout.write(
  "governance case review decision selection explanation boundary verified\n"
);
