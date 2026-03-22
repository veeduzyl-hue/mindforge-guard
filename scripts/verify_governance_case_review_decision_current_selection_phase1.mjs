import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SURFACE_MAP,
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
  selectGovernanceCaseReviewDecisionCurrent,
  validateGovernanceCaseReviewDecisionCurrentSelectionContract,
  validateGovernanceCaseReviewDecisionCurrentSelectionProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function stableStringify(value) {
  return JSON.stringify(value);
}

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:7777aaaabbbbcccc7777aaaabbbbcccc7777aaaabbbbcccc7777aaaabbbbcccc",
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

  return {
    caseId,
    resolutionId,
    escalationId,
    closureId,
    evidenceId,
    canonicalActionHash: caseEvidenceProfile.canonical_action_hash,
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

const base = buildBaseReviewDecisionArtifacts("would_review");

{
  const current = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-current",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-previous",
    supersessionReason: "later bounded review decision",
  });
  const previous = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-previous",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-current",
    supersessionReason: "superseded by later bounded review decision",
  });
  const selection = selectGovernanceCaseReviewDecisionCurrent({
    governanceCaseReviewDecisionProfiles: [current.profile, previous.profile],
  });
  if (
    selection.selection_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_SELECTED ||
    selection.current_review_decision_id !== "review-current" ||
    stableStringify(selection.terminal_review_decision_ids) !==
      stableStringify(["review-current"]) ||
    selection.deterministic !== true
  ) {
    throw new Error("single-chain current selection drifted");
  }
  const selectionProfile = buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
    governanceCaseReviewDecisionProfiles: [current.profile, previous.profile],
  });
  const selectionContract =
    buildGovernanceCaseReviewDecisionCurrentSelectionContract({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    });
  const profileValidation =
    validateGovernanceCaseReviewDecisionCurrentSelectionProfile(selectionProfile);
  const contractValidation =
    validateGovernanceCaseReviewDecisionCurrentSelectionContract(
      selectionContract
    );
  if (!profileValidation.ok || !contractValidation.ok) {
    throw new Error(
      `current selection profile/contract validation failed: ${[
        ...profileValidation.errors,
        ...contractValidation.errors,
      ].join("; ")}`
    );
  }
  if (
    selectionProfile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_KIND ||
    selectionProfile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_VERSION ||
    selectionProfile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_SCHEMA_ID ||
    selectionProfile.governance_case_review_decision_current_selection.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_STAGE ||
    selectionProfile.governance_case_review_decision_current_selection
      .consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONSUMER_SURFACE ||
    selectionProfile.governance_case_review_decision_current_selection
      .boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_BOUNDARY
  ) {
    throw new Error("current selection profile envelope drifted");
  }
  if (
    selectionContract.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_KIND ||
    selectionContract.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_VERSION ||
    selectionContract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_BOUNDARY ||
    selectionContract.supporting_artifact_only !== true ||
    selectionContract.recommendation_only !== true ||
    selectionContract.additive_only !== true ||
    selectionContract.non_executing !== true ||
    selectionContract.default_off !== true ||
    selectionContract.main_path_takeover !== false ||
    selectionContract.authority_scope_expansion !== false ||
    selectionContract.new_governance_object !== false
  ) {
    throw new Error("current selection contract drifted");
  }
}

{
  const terminalA = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-terminal-a",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  });
  const terminalB = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-terminal-b",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  });
  const conflict = selectGovernanceCaseReviewDecisionCurrent({
    governanceCaseReviewDecisionProfiles: [terminalA.profile, terminalB.profile],
  });
  if (
    conflict.selection_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_STATUS_CONFLICT ||
    conflict.current_review_decision_id !== null ||
    stableStringify(conflict.conflict_review_decision_ids) !==
      stableStringify(["review-terminal-a", "review-terminal-b"])
  ) {
    throw new Error("multiple terminal candidates must remain explicit conflict");
  }
}

{
  const current = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-deterministic-current",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-deterministic-previous",
    supersessionReason: "deterministic chain",
  });
  const previous = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-deterministic-previous",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-deterministic-current",
    supersessionReason: "deterministic chain",
  });
  const leftToRight = selectGovernanceCaseReviewDecisionCurrent({
    governanceCaseReviewDecisionProfiles: [previous.profile, current.profile],
  });
  const rightToLeft = selectGovernanceCaseReviewDecisionCurrent({
    governanceCaseReviewDecisionProfiles: [current.profile, previous.profile],
  });
  if (stableStringify(leftToRight) !== stableStringify(rightToLeft)) {
    throw new Error("current selection output must remain deterministic");
  }
}

{
  const otherBase = buildBaseReviewDecisionArtifacts("would_allow");
  const sameCase = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-same-case",
    reviewDecisionSequence: 1,
  });
  const otherCase = buildReviewDecisionArtifacts(otherBase, {
    reviewDecisionId: "review-other-case",
    reviewDecisionSequence: 2,
  });
  assertRejected(
    () =>
      selectGovernanceCaseReviewDecisionCurrent({
        governanceCaseReviewDecisionProfiles: [sameCase.profile, otherCase.profile],
      }),
    "case_id",
    "cross-case selection must be rejected"
  );
}

{
  const one = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-hash-a",
    reviewDecisionSequence: 1,
  });
  const two = cloneJson(
    buildReviewDecisionArtifacts(base, {
      reviewDecisionId: "review-hash-b",
      reviewDecisionSequence: 2,
    }).profile
  );
  two.canonical_action_hash = "sha256:selection-hash-mismatch";
  assertRejected(
    () =>
      selectGovernanceCaseReviewDecisionCurrent({
        governanceCaseReviewDecisionProfiles: [one.profile, two],
      }),
    "canonical_action_hash",
    "cross-hash selection must be rejected"
  );
}

{
  const current = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-regressed-current",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-regressed-previous",
    supersessionReason: "sequence regression",
  });
  const previous = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-regressed-previous",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-regressed-current",
    supersessionReason: "sequence regression",
  });
  assertRejected(
    () =>
      selectGovernanceCaseReviewDecisionCurrent({
        governanceCaseReviewDecisionProfiles: [current.profile, previous.profile],
      }),
    "review_decision_sequence",
    "sequence regression must be rejected"
  );
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SURFACE_MAP
    .governance_case_review_decision_current_selection ||
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SURFACE_MAP
    .governance_case_review_decision_current_selection.additive_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SURFACE_MAP
    .governance_case_review_decision_current_selection.executing !== false
) {
  throw new Error("current selection additive export surface drifted");
}

if (
  !permitExports.GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_SURFACE_MAP
    ?.governance_case_review_decision_current_selection
) {
  throw new Error(
    "current selection surface export missing from permit aggregate"
  );
}

if (
  !(
    "buildGovernanceCaseReviewDecisionCurrentSelectionProfile" in permitExports &&
    "buildGovernanceCaseReviewDecisionCurrentSelectionContract" in permitExports &&
    "selectGovernanceCaseReviewDecisionCurrent" in permitExports
  )
) {
  throw new Error("current selection exports missing from permit aggregate");
}

if (
  GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE !==
  "guard.audit.governance_case_review_decision"
) {
  throw new Error("review decision consumer surface drifted unexpectedly");
}

process.stdout.write(
  "governance case review decision current selection phase 1 verified\n"
);
