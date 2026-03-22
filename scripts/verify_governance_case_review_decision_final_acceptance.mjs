import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_READY,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_SURFACE_MAP,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_COMPATIBILITY_FREEZE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_COMPATIBILITY_FREEZE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_COMPATIBILITY_FREEZE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_REVIEW_DECISION_FINAL_COMPATIBILITY_FREEZE_VERSION,
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
  buildGovernanceCaseReviewDecisionFinalAcceptanceBoundary,
  buildGovernanceCaseReviewDecisionFinalCompatibilityFreeze,
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
  exportGovernanceCaseReviewDecisionFinalAcceptanceSurface,
  validateGovernanceCaseReviewDecisionBundle,
  validateGovernanceCaseReviewDecisionFinalAcceptanceBoundary,
  validateGovernanceCaseReviewDecisionFinalCompatibilityFreeze,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
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

function buildBaseArtifacts(decision) {
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
  const caseEvidenceContract = buildGovernanceCaseEvidenceContract({
    governanceCaseEvidenceProfile: caseEvidenceProfile,
  });
  return {
    caseId,
    evidenceId,
    resolutionId,
    escalationId,
    closureId,
    canonicalActionHash: caseEvidenceProfile.canonical_action_hash,
    caseEvidenceProfile,
    caseEvidenceContract,
    bridge,
    permit,
  };
}

function buildReviewDecisionArtifacts(base, overrides = {}) {
  const profile = buildGovernanceCaseReviewDecisionProfile({
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
    supersedesReviewDecisionId: overrides.supersedesReviewDecisionId ?? null,
    supersededByReviewDecisionId: overrides.supersededByReviewDecisionId ?? null,
    reviewDecisionSequence: overrides.reviewDecisionSequence ?? 1,
    continuityMode: overrides.continuityMode,
    supersessionReason: overrides.supersessionReason ?? null,
  });
  const contract = buildGovernanceCaseReviewDecisionContract({
    governanceCaseReviewDecisionProfile: profile,
  });
  const consumed = consumeGovernanceCaseReviewDecision({
    governanceCaseReviewDecisionProfile: profile,
    governanceCaseReviewDecisionContract: contract,
  });
  return { profile, contract, consumed };
}

function assertBundleValid({
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

for (const decision of ["insufficient_signal", "would_allow", "would_review", "would_deny"]) {
  const base = buildBaseArtifacts(decision);
  const standalone = buildReviewDecisionArtifacts(base);
  assertBundleValid({
    profile: standalone.profile,
    contract: standalone.contract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: standalone.consumed,
    message: "standalone review decision bundle must validate under final acceptance bundle",
  });

  const legacyProfile = cloneJson(standalone.profile);
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
  const legacyContract = cloneJson(standalone.contract);
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
  assertBundleValid({
    profile: legacyProfile,
    contract: legacyContract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: legacyConsumed,
    message: "legacy review decision artifact compatibility must remain valid",
  });
  if (
    legacyConsumed.continuity_mode !==
      GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE ||
    legacyConsumed.review_decision_sequence !== 1 ||
    legacyConsumed.current_effective_decision !== true
  ) {
    throw new Error("legacy review decision default continuity behavior drifted");
  }

  const predecessor = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: `review-${decision}-1`,
    reviewDecisionSequence: 1,
  });
  const successor = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: `review-${decision}-2`,
    reviewDecisionSequence: 2,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    supersedesReviewDecisionId: `review-${decision}-1`,
    supersessionReason: "new evidence continuity chain",
  });
  const superseded = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: `review-${decision}-1`,
    reviewDecisionSequence: 1,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    supersededByReviewDecisionId: `review-${decision}-2`,
    supersessionReason: "superseded by later review decision",
  });
  assertBundleValid({
    profile: successor.profile,
    contract: successor.contract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: successor.consumed,
    relatedProfiles: [predecessor.profile],
    message: "superseding review decision bundle must validate under final acceptance bundle",
  });
  assertBundleValid({
    profile: superseded.profile,
    contract: superseded.contract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: superseded.consumed,
    relatedProfiles: [successor.profile],
    message: "superseded review decision bundle must validate under final acceptance bundle",
  });
  if (superseded.consumed.current_effective_decision !== false) {
    throw new Error("superseded review decision must not remain current/effective");
  }

  const parallelA = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: `review-${decision}-parallel-a`,
    reviewDecisionSequence: 3,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
    supersessionReason: "bounded peer review split",
  });
  const parallelB = buildReviewDecisionArtifacts(base, {
    reviewDecisionId: `review-${decision}-parallel-b`,
    reviewDecisionSequence: 3,
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
    supersessionReason: "bounded peer review split",
  });
  assertBundleValid({
    profile: parallelA.profile,
    contract: parallelA.contract,
    evidenceProfile: base.caseEvidenceProfile,
    consumed: parallelA.consumed,
    relatedProfiles: [parallelB.profile],
    message: "bounded parallel review decision bundle must validate under final acceptance bundle",
  });

  const finalAcceptance =
    buildGovernanceCaseReviewDecisionFinalAcceptanceBoundary({
      governanceCaseReviewDecisionProfile: successor.profile,
      governanceCaseReviewDecisionContract: successor.contract,
    });
  const compatibilityFreeze =
    buildGovernanceCaseReviewDecisionFinalCompatibilityFreeze({
      governanceCaseReviewDecisionFinalAcceptanceBoundary: finalAcceptance,
    });
  const exportSurface = exportGovernanceCaseReviewDecisionFinalAcceptanceSurface({
    governanceCaseReviewDecisionFinalAcceptanceBoundary: finalAcceptance,
    governanceCaseReviewDecisionFinalCompatibilityFreeze: compatibilityFreeze,
  });

  const finalAcceptanceValidation =
    validateGovernanceCaseReviewDecisionFinalAcceptanceBoundary(finalAcceptance);
  if (!finalAcceptanceValidation.ok) {
    throw new Error(
      `review decision final acceptance validation failed: ${finalAcceptanceValidation.errors.join("; ")}`
    );
  }
  const compatibilityFreezeValidation =
    validateGovernanceCaseReviewDecisionFinalCompatibilityFreeze(
      compatibilityFreeze
    );
  if (!compatibilityFreezeValidation.ok) {
    throw new Error(
      `review decision final compatibility freeze validation failed: ${compatibilityFreezeValidation.errors.join("; ")}`
    );
  }

  if (
    finalAcceptance.kind !== GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_KIND ||
    finalAcceptance.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_VERSION ||
    finalAcceptance.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_SCHEMA_ID ||
    finalAcceptance.governance_case_review_decision_final_acceptance.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_STAGE ||
    finalAcceptance.governance_case_review_decision_final_acceptance.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_BOUNDARY ||
    finalAcceptance.governance_case_review_decision_final_acceptance
      .consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_CONSUMER_SURFACE
  ) {
    throw new Error("review decision final acceptance envelope drifted");
  }
  if (
    finalAcceptance.governance_case_review_decision_final_acceptance
      .final_acceptance_contract.readiness_level !==
      GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_READY ||
    finalAcceptance.governance_case_review_decision_final_acceptance
      .final_acceptance_contract.additive_only !== true ||
    finalAcceptance.governance_case_review_decision_final_acceptance
      .final_acceptance_contract.recommendation_only !== true ||
    finalAcceptance.governance_case_review_decision_final_acceptance
      .final_acceptance_contract.non_executing !== true ||
    finalAcceptance.governance_case_review_decision_final_acceptance
      .final_acceptance_contract.default_off !== true ||
    finalAcceptance.governance_case_review_decision_final_acceptance
      .final_acceptance_contract.execution_takeover !== false ||
    finalAcceptance.governance_case_review_decision_final_acceptance
      .preserved_semantics.audit_output_preserved !== true ||
    finalAcceptance.governance_case_review_decision_final_acceptance
      .preserved_semantics.enforcement_pilot_semantics_preserved !== true ||
    finalAcceptance.governance_case_review_decision_final_acceptance
      .preserved_semantics.classify_semantics_preserved !== true
  ) {
    throw new Error("review decision final acceptance contract drifted");
  }

  if (
    compatibilityFreeze.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_FINAL_COMPATIBILITY_FREEZE_KIND ||
    compatibilityFreeze.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_FINAL_COMPATIBILITY_FREEZE_VERSION ||
    compatibilityFreeze.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_FINAL_COMPATIBILITY_FREEZE_BOUNDARY ||
    compatibilityFreeze.continuity_mode_semantics_frozen !== true ||
    compatibilityFreeze.review_decision_sequence_defaults_preserved !== true ||
    compatibilityFreeze.supersession_linkage_invariants_frozen !== true ||
    compatibilityFreeze.old_artifact_compatibility_defaults_preserved !== true ||
    compatibilityFreeze.consume_surface_minimal_additive !== true ||
    compatibilityFreeze.export_surface_minimal_additive !== true ||
    compatibilityFreeze.recommendation_only !== true ||
    compatibilityFreeze.additive_only !== true ||
    compatibilityFreeze.non_executing !== true ||
    compatibilityFreeze.default_off !== true ||
    compatibilityFreeze.execution_takeover !== false ||
    compatibilityFreeze.workflow_transition_engine !== false ||
    compatibilityFreeze.authority_scope_expansion !== false ||
    compatibilityFreeze.audit_output_preserved !== true ||
    compatibilityFreeze.denied_exit_code_preserved !== 25 ||
    compatibilityFreeze.classify_semantics_preserved !== true
  ) {
    throw new Error("review decision final compatibility freeze drifted");
  }

  if (
    exportSurface.release_summary.release_target !== "v5.6.0" ||
    exportSurface.release_summary.recommendation_only !== true ||
    exportSurface.release_summary.additive_only !== true ||
    exportSurface.release_summary.non_executing !== true ||
    exportSurface.release_summary.default_off !== true
  ) {
    throw new Error("review decision final acceptance release summary drifted");
  }

  let contractIdentityMismatchRejected = false;
  try {
    buildGovernanceCaseReviewDecisionFinalAcceptanceBoundary({
      governanceCaseReviewDecisionProfile: successor.profile,
      governanceCaseReviewDecisionContract: predecessor.contract,
    });
  } catch (error) {
    if (String(error.message).includes("contract review_decision_id must match")) {
      contractIdentityMismatchRejected = true;
    }
  }
  if (!contractIdentityMismatchRejected) {
    throw new Error(
      "review decision final acceptance must reject mismatched contract/profile review_decision_id pairing"
    );
  }

  const mismatchedHashContract = cloneJson(successor.contract);
  mismatchedHashContract.canonical_action_hash =
    "sha256:review-decision-final-acceptance-contract-hash-mismatch";
  let contractHashMismatchRejected = false;
  try {
    buildGovernanceCaseReviewDecisionFinalAcceptanceBoundary({
      governanceCaseReviewDecisionProfile: successor.profile,
      governanceCaseReviewDecisionContract: mismatchedHashContract,
    });
  } catch (error) {
    if (
      String(error.message).includes(
        "contract canonical_action_hash must match"
      )
    ) {
      contractHashMismatchRejected = true;
    }
  }
  if (!contractHashMismatchRejected) {
    throw new Error(
      "review decision final acceptance must reject mismatched contract/profile canonical_action_hash pairing"
    );
  }
}

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_final_acceptance
) {
  throw new Error("review decision final acceptance surface entry missing");
}
if (
  !GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_review_decision_final_compatibility_freeze
) {
  throw new Error("review decision final compatibility freeze surface entry missing");
}

for (const exportName of GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision final acceptance export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_REVIEW_DECISION_FINAL_COMPATIBILITY_FREEZE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision final compatibility freeze export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_REVIEW_DECISION_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision final acceptance surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write(
  "governance case review decision final acceptance and compatibility freeze verified\n"
);
