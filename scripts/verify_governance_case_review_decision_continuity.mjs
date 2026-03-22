import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_SURFACE_MAP,
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
  consumeGovernanceCaseReviewDecision,
  validateGovernanceCaseReviewDecisionBundle,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:6666aaaabbbbcccc6666aaaabbbbcccc6666aaaabbbbcccc6666aaaabbbbcccc",
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
        git: { head: "6666666666666666666666666666666666666666", branch: "branch" },
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
  const caseEvidenceContract = buildGovernanceCaseEvidenceContract({
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
    caseEvidenceContract,
  };
}

function buildReviewDecisionArtifacts(base, overrides = {}) {
  const caseReviewDecisionProfile = buildGovernanceCaseReviewDecisionProfile({
    governanceCaseEvidenceProfile: base.caseEvidenceProfile,
    caseId: overrides.caseId ?? base.caseId,
    reviewDecisionId:
      overrides.reviewDecisionId ?? `review-decision-${base.caseId}-1`,
    reviewStatus: overrides.reviewStatus,
    evidenceSufficiency: overrides.evidenceSufficiency,
    linkedEvidenceIds: overrides.linkedEvidenceIds ?? [base.evidenceId],
    linkedResolutionIds: overrides.linkedResolutionIds ?? [base.resolutionId],
    linkedEscalationIds: overrides.linkedEscalationIds ?? [base.escalationId],
    linkedClosureIds: overrides.linkedClosureIds ?? [base.closureId],
    supersedesReviewDecisionId:
      overrides.supersedesReviewDecisionId ?? null,
    supersededByReviewDecisionId:
      overrides.supersededByReviewDecisionId ?? null,
    reviewDecisionSequence: overrides.reviewDecisionSequence ?? 1,
    continuityMode: overrides.continuityMode,
    supersessionReason: overrides.supersessionReason ?? null,
  });
  const caseReviewDecisionContract = buildGovernanceCaseReviewDecisionContract({
    governanceCaseReviewDecisionProfile: caseReviewDecisionProfile,
  });
  const consumed = consumeGovernanceCaseReviewDecision({
    governanceCaseReviewDecisionProfile: caseReviewDecisionProfile,
    governanceCaseReviewDecisionContract: caseReviewDecisionContract,
  });
  return {
    caseReviewDecisionProfile,
    caseReviewDecisionContract,
    consumed,
  };
}

function assertValidBundle({
  profile,
  contract,
  evidenceProfile,
  consumed,
  relatedProfiles = [],
  message,
}) {
  const validation = validateGovernanceCaseReviewDecisionBundle({
    governanceCaseReviewDecisionProfile: profile,
    governanceCaseReviewDecisionContract: contract,
    governanceCaseEvidenceProfile: evidenceProfile,
    consumedCaseReviewDecision: consumed,
    relatedGovernanceCaseReviewDecisionProfiles: relatedProfiles,
  });
  if (!validation.ok) {
    throw new Error(`${message}: ${validation.errors.join("; ")}`);
  }
}

function assertRejected({
  profile,
  contract,
  evidenceProfile,
  consumed,
  relatedProfiles = [],
  expectedFragment,
  message,
}) {
  const validation = validateGovernanceCaseReviewDecisionBundle({
    governanceCaseReviewDecisionProfile: profile,
    governanceCaseReviewDecisionContract: contract,
    governanceCaseEvidenceProfile: evidenceProfile,
    consumedCaseReviewDecision: consumed,
    relatedGovernanceCaseReviewDecisionProfiles: relatedProfiles,
  });
  if (
    validation.ok ||
    !validation.errors.some((error) => error.includes(expectedFragment))
  ) {
    throw new Error(message);
  }
}

function assertBuildRejected(factory, expectedFragment, message) {
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

const base = buildBaseReviewDecisionArtifacts("would_review");

{
  const standalone = buildReviewDecisionArtifacts(base);
  assertValidBundle({
    profile: standalone.caseReviewDecisionProfile,
    contract: standalone.caseReviewDecisionContract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: standalone.consumed,
    message: "standalone review decision must validate",
  });
  const context =
    standalone.caseReviewDecisionProfile.governance_case_review_decision
      .review_decision_context;
  if (
    context.continuity_mode !==
      GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE ||
    context.review_decision_sequence !== 1 ||
    context.supersedes_review_decision_id !== null ||
    context.superseded_by_review_decision_id !== null
  ) {
    throw new Error("old artifact compatibility drifted for standalone defaults");
  }
  if (
    standalone.consumed.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_CONSUMER_SURFACE ||
    standalone.consumed.recommendation_only !== true ||
    standalone.consumed.additive_only !== true ||
    standalone.consumed.executing !== false ||
    standalone.consumed.current_effective_decision !== true
  ) {
    throw new Error("standalone consumer surface drifted");
  }

  const legacyProfile = cloneJson(standalone.caseReviewDecisionProfile);
  delete legacyProfile.governance_case_review_decision.review_decision_context
    .supersedes_review_decision_id;
  delete legacyProfile.governance_case_review_decision.review_decision_context
    .superseded_by_review_decision_id;
  delete legacyProfile.governance_case_review_decision.review_decision_context
    .review_decision_sequence;
  delete legacyProfile.governance_case_review_decision.review_decision_context
    .continuity_mode;
  delete legacyProfile.governance_case_review_decision.review_decision_context
    .supersession_reason;
  const legacyContract = cloneJson(standalone.caseReviewDecisionContract);
  delete legacyContract.review_decision_profile_ref.review_decision_id;
  delete legacyContract.continuity_supported;
  delete legacyContract.supersession_supported;
  delete legacyContract.continuity_mode;
  delete legacyContract.supersedes_review_decision_id;
  delete legacyContract.superseded_by_review_decision_id;
  delete legacyContract.review_decision_sequence;
  delete legacyContract.supersession_reason;
  delete legacyContract.current_effective_decision;
  const legacyConsumed = consumeGovernanceCaseReviewDecision({
    governanceCaseReviewDecisionProfile: legacyProfile,
    governanceCaseReviewDecisionContract: legacyContract,
  });
  assertValidBundle({
    profile: legacyProfile,
    contract: legacyContract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: legacyConsumed,
    message: "legacy review decision artifacts without continuity fields must remain valid",
  });
  if (
    legacyConsumed.continuity_mode !==
      GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE ||
    legacyConsumed.review_decision_sequence !== 1 ||
    legacyConsumed.current_effective_decision !== true
  ) {
    throw new Error("legacy review decision default continuity behavior drifted");
  }
}

{
  const predecessor = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-1",
    reviewDecisionSequence: 1,
  });
  const successor = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-2",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-1",
    supersessionReason: "new evidence continuity chain",
  });
  const supersededPredecessor = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-1",
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: "review-2",
    supersessionReason: "superseded by later review decision",
  });
  assertValidBundle({
    profile: successor.caseReviewDecisionProfile,
    contract: successor.caseReviewDecisionContract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: successor.consumed,
    relatedProfiles: [predecessor.caseReviewDecisionProfile],
    message: "single supersession chain must validate",
  });
  assertValidBundle({
    profile: supersededPredecessor.caseReviewDecisionProfile,
    contract: supersededPredecessor.caseReviewDecisionContract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: supersededPredecessor.consumed,
    relatedProfiles: [successor.caseReviewDecisionProfile],
    message: "superseded predecessor must validate when successor is bounded",
  });
  if (supersededPredecessor.consumed.current_effective_decision !== false) {
    throw new Error("superseded decisions must not remain current/effective");
  }
}

{
  assertBuildRejected(
    () =>
      buildReviewDecisionArtifacts(base, {
        reviewDecisionId: "review-self",
        reviewDecisionSequence: 2,
        continuityMode:
          GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
        supersedesReviewDecisionId: "review-self",
        supersessionReason: "invalid self reference",
      }),
    "self-reference",
    "self supersession must be rejected"
  );
}

{
  const a = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-a",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-b",
    supersessionReason: "cycle a",
  });
  const b = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-b",
    reviewDecisionSequence: 3,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-a",
    supersessionReason: "cycle b",
  });
  assertRejected({
    profile: a.caseReviewDecisionProfile,
    contract: a.caseReviewDecisionContract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: a.consumed,
    relatedProfiles: [b.caseReviewDecisionProfile],
    expectedFragment: "cycle",
    message: "cyclic supersession chain must be rejected",
  });
}

{
  const predecessor = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-shared",
    reviewDecisionSequence: 1,
  });
  const successor = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-successor-a",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-shared",
    supersessionReason: "candidate a",
  });
  const competing = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-successor-b",
    reviewDecisionSequence: 3,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-shared",
    supersessionReason: "candidate b",
  });
  assertRejected({
    profile: successor.caseReviewDecisionProfile,
    contract: successor.caseReviewDecisionContract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: successor.consumed,
    relatedProfiles: [
      predecessor.caseReviewDecisionProfile,
      competing.caseReviewDecisionProfile,
    ],
    expectedFragment: "competing supersession",
    message: "competing supersession of the same predecessor must be rejected",
  });
}

{
  const predecessor = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-prev",
    reviewDecisionSequence: 3,
  });
  const regressed = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-regressed",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-prev",
    supersessionReason: "sequence regression",
  });
  assertRejected({
    profile: regressed.caseReviewDecisionProfile,
    contract: regressed.caseReviewDecisionContract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: regressed.consumed,
    relatedProfiles: [predecessor.caseReviewDecisionProfile],
    expectedFragment: "must not regress",
    message: "review decision sequence regression must be rejected",
  });
}

{
  const parallelA = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-parallel-a",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
    supersessionReason: "bounded peer review split",
  });
  const parallelB = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-parallel-b",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
    supersessionReason: "bounded peer review split",
  });
  assertValidBundle({
    profile: parallelA.caseReviewDecisionProfile,
    contract: parallelA.caseReviewDecisionContract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: parallelA.consumed,
    relatedProfiles: [parallelB.caseReviewDecisionProfile],
    message: "bounded parallel review decision must validate",
  });
  assertBuildRejected(
    () =>
      buildReviewDecisionArtifacts(base, {
        reviewDecisionId: "review-parallel-invalid",
        reviewDecisionSequence: 2,
        continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
      }),
    "parallel continuity must remain purely explanatory",
    "unbounded parallel review decision must be rejected"
  );
}

{
  const brokenHash = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-hash-break",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-hash-prev",
    supersessionReason: "hash mismatch",
  });
  const brokenHashProfile = cloneJson(brokenHash.caseReviewDecisionProfile);
  brokenHashProfile.canonical_action_hash =
    "sha256:continuity-hash-mismatch";
  assertRejected({
    profile: brokenHashProfile,
    contract: brokenHash.caseReviewDecisionContract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: brokenHash.consumed,
    expectedFragment: "canonical_action_hash",
    message: "canonical action hash mismatch must be rejected",
  });
}

{
  const otherBase = buildBaseReviewDecisionArtifacts("would_allow");
  const predecessor = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-cross-case-prev",
    reviewDecisionSequence: 1,
  });
  const crossCase = buildReviewDecisionArtifacts(otherBase, {
    reviewDecisionId: "review-cross-case-next",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-cross-case-prev",
    supersessionReason: "cross case drift",
  });
  assertRejected({
    profile: crossCase.caseReviewDecisionProfile,
    contract: crossCase.caseReviewDecisionContract,
    evidenceProfile: otherBase.caseEvidenceProfile,
    consumed: crossCase.consumed,
    relatedProfiles: [predecessor.caseReviewDecisionProfile],
    expectedFragment: "case_id",
    message: "cross-case supersession must be rejected",
  });
}

{
  const predecessor = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-cross-hash-prev",
    reviewDecisionSequence: 1,
  });
  const crossHash = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-cross-hash-next",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: "review-cross-hash-prev",
    supersessionReason: "cross hash drift",
  });
  const predecessorWithDifferentHash = cloneJson(predecessor.caseReviewDecisionProfile);
  predecessorWithDifferentHash.canonical_action_hash =
    "sha256:cross-hash-predecessor-mismatch";
  assertRejected({
    profile: crossHash.caseReviewDecisionProfile,
    contract: crossHash.caseReviewDecisionContract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: crossHash.consumed,
    relatedProfiles: [predecessorWithDifferentHash],
    expectedFragment: "canonical_action_hash",
    message: "cross-canonical_action_hash supersession must be rejected",
  });
}

{
  const illegalParallel = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-parallel-linked",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
    supersedesReviewDecisionId: "review-1",
    supersessionReason: "parallel must stay link free",
  });
  const peer = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: "review-parallel-peer",
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
    supersessionReason: "bounded peer review split",
  });
  assertRejected({
    profile: illegalParallel.caseReviewDecisionProfile,
    contract: illegalParallel.caseReviewDecisionContract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: illegalParallel.consumed,
    relatedProfiles: [peer.caseReviewDecisionProfile],
    expectedFragment: "parallel mode must not include supersession links",
    message: "parallel decisions with supersession links must be rejected",
  });
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_SURFACE_MAP.governance_case_review_decision ||
  GOVERNANCE_CASE_REVIEW_DECISION_SURFACE_MAP.governance_case_review_decision
    .continuity_supported !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_SURFACE_MAP.governance_case_review_decision
    .supersession_supported !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_SURFACE_MAP.governance_case_review_decision
    .executing !== false
) {
  throw new Error("review decision continuity additive surface drifted");
}

if (
  !permitExports.GOVERNANCE_CASE_REVIEW_DECISION_SURFACE_MAP
    ?.governance_case_review_decision
) {
  throw new Error(
    "review decision continuity surface export missing from permit aggregate"
  );
}

process.stdout.write(
  "governance case review decision continuity and supersession verified\n"
);
