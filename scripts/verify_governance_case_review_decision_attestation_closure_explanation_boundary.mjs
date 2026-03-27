import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SCOPE_CURRENT_CLOSURE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STATUS_AVAILABLE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SURFACE_MAP,
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
  buildGovernanceCaseReviewDecisionAttestationClosureExplanation,
  buildGovernanceCaseReviewDecisionAttestationClosureExplanationContract,
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
  consumeGovernanceCaseReviewDecisionAttestationClosureExplanation,
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
      enforcement_adjacent_decision: {
        decision: "would_review",
        reasons: [{ kind: "signal", message: "would_review" }],
      },
    },
  });
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
    canonicalActionArtifact: {
      canonical_action_hash: bridge.canonical_action_hash,
    },
    executionReadinessArtifact: {
      execution_readiness: { readiness: "ready", bridge_verdict: "allow" },
    },
    enforcementAdjacentDecisionArtifact: {
      enforcement_adjacent_decision: {
        decision: "would_review",
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
  const policyCompatibility = buildPolicyCompatibilityProfile({
    policyProfile,
  });
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
  const caseId = "case-closure-explanation";
  const resolutionProfile = buildGovernanceCaseResolutionProfile({
    governanceExceptionStabilizationProfile: exceptionStabilization,
    caseId,
    linkedExceptionIds: ["exception"],
    linkedOverrideRecordIds: ["override"],
  });
  const resolutionContract = buildGovernanceCaseResolutionContract({
    governanceCaseResolutionProfile: resolutionProfile,
  });
  const resolutionCompatibility =
    buildGovernanceCaseResolutionCompatibilityContract({
      governanceCaseResolutionContract: resolutionContract,
    });
  const resolutionStabilization =
    buildGovernanceCaseResolutionStabilizationProfile({
      governanceCaseResolutionProfile: resolutionProfile,
      governanceCaseResolutionCompatibilityContract: resolutionCompatibility,
    });
  const escalationProfile = buildGovernanceCaseEscalationProfile({
    governanceCaseResolutionStabilizationProfile: resolutionStabilization,
    caseId,
    linkedExceptionIds: ["exception"],
    linkedOverrideRecordIds: ["override"],
    linkedResolutionIds: ["resolution-closure"],
  });
  const escalationContract = buildGovernanceCaseEscalationContract({
    governanceCaseEscalationProfile: escalationProfile,
  });
  const escalationCompatibility =
    buildGovernanceCaseEscalationCompatibilityContract({
      governanceCaseEscalationContract: escalationContract,
    });
  const escalationStabilization =
    buildGovernanceCaseEscalationStabilizationProfile({
      governanceCaseEscalationProfile: escalationProfile,
      governanceCaseEscalationCompatibilityContract: escalationCompatibility,
    });
  const closureProfile = buildGovernanceCaseClosureProfile({
    governanceCaseEscalationStabilizationProfile: escalationStabilization,
    caseId,
    linkedExceptionIds: ["exception"],
    linkedOverrideRecordIds: ["override"],
    linkedResolutionIds: ["resolution-closure"],
    linkedEscalationIds: ["escalation-closure"],
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
    linkedResolutionIds: ["resolution-closure"],
    linkedEscalationIds: ["escalation-closure"],
    linkedClosureIds: ["closure-case-closure-explanation"],
    linkedExceptionIds: ["exception"],
    linkedOverrideRecordIds: ["override"],
  });
  buildGovernanceCaseEvidenceContract({
    governanceCaseEvidenceProfile: caseEvidenceProfile,
  });
  const current = buildGovernanceCaseReviewDecisionProfile({
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    caseId,
    reviewDecisionId: "review-closure-explanation-current",
    linkedEvidenceIds: ["evidence-case-closure-explanation"],
    linkedResolutionIds: ["resolution-closure"],
    linkedEscalationIds: ["escalation-closure"],
    linkedClosureIds: ["closure-case-closure-explanation"],
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
    reviewDecisionSequence: 2,
    supersedesReviewDecisionId: "review-closure-explanation-previous",
    supersededByReviewDecisionId: null,
    supersessionReason: "later bounded review decision",
  });
  const previous = buildGovernanceCaseReviewDecisionProfile({
    governanceCaseEvidenceProfile: caseEvidenceProfile,
    caseId,
    reviewDecisionId: "review-closure-explanation-previous",
    linkedEvidenceIds: ["evidence-case-closure-explanation"],
    linkedResolutionIds: ["resolution-closure"],
    linkedEscalationIds: ["escalation-closure"],
    linkedClosureIds: ["closure-case-closure-explanation"],
    continuityMode: GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
    reviewDecisionSequence: 1,
    supersedesReviewDecisionId: null,
    supersededByReviewDecisionId: "review-closure-explanation-current",
    supersessionReason: "superseded by later bounded review decision",
  });
  const selectionProfile =
    buildGovernanceCaseReviewDecisionCurrentSelectionProfile({
      governanceCaseReviewDecisionProfiles: [current, previous],
    });
  const selectionContract =
    buildGovernanceCaseReviewDecisionCurrentSelectionContract({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
    });
  const selectionSummary =
    buildGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
      governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
      governanceCaseReviewDecisionProfiles: [current, previous],
    });
  const selectionFinalAcceptance =
    buildGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
      governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
      governanceCaseReviewDecisionCurrentSelectionSummaryProfile:
        selectionSummary,
    });
  const selectionExplanation =
    buildGovernanceCaseReviewDecisionSelectionExplanation({
      governanceCaseReviewDecisionCurrentSelectionProfile: selectionProfile,
      governanceCaseReviewDecisionCurrentSelectionContract: selectionContract,
      governanceCaseReviewDecisionProfiles: [current, previous],
    });
  const selectionExplanationContract =
    buildGovernanceCaseReviewDecisionSelectionExplanationContract({
      governanceCaseReviewDecisionSelectionExplanationProfile:
        selectionExplanation,
    });
  const selectionExplanationFinalAcceptance =
    buildGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary({
      governanceCaseReviewDecisionSelectionExplanationProfile:
        selectionExplanation,
      governanceCaseReviewDecisionSelectionExplanationContract:
        selectionExplanationContract,
    });
  const selectionReceipt = buildGovernanceCaseReviewDecisionSelectionReceipt({
    governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary:
      selectionFinalAcceptance,
    governanceCaseReviewDecisionSelectionExplanationProfile:
      selectionExplanation,
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
      governanceCaseReviewDecisionSelectionReceiptContract:
        selectionReceiptContract,
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
  const closure =
    buildGovernanceCaseReviewDecisionAttestationApplicabilityClosure({
      governanceCaseReviewDecisionAttestationProfile: attestation,
      governanceCaseReviewDecisionApplicabilityProfile: applicabilityProfile,
      governanceCaseReviewDecisionApplicabilityExplanationProfile:
        applicabilityExplanation,
    });
  return {
    attestation,
    applicabilityProfile,
    applicabilityExplanation,
    closure,
  };
}

const fixture = buildFixture();
const profile = buildGovernanceCaseReviewDecisionAttestationClosureExplanation({
  governanceCaseReviewDecisionAttestationApplicabilityClosureProfile:
    fixture.closure,
  governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
  governanceCaseReviewDecisionApplicabilityProfile:
    fixture.applicabilityProfile,
  governanceCaseReviewDecisionApplicabilityExplanationProfile:
    fixture.applicabilityExplanation,
});
const contract =
  buildGovernanceCaseReviewDecisionAttestationClosureExplanationContract({
    governanceCaseReviewDecisionAttestationClosureExplanationProfile: profile,
  });
const consumed = consumeGovernanceCaseReviewDecisionAttestationClosureExplanation(
  {
    governanceCaseReviewDecisionAttestationClosureExplanationProfile: profile,
    governanceCaseReviewDecisionAttestationClosureExplanationContract:
      contract,
  }
);
const payload =
  profile.governance_case_review_decision_attestation_closure_explanation;

if (
  profile.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_KIND ||
  profile.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_VERSION ||
  profile.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_SCHEMA_ID ||
  payload.stage !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_STAGE ||
  payload.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_BOUNDARY ||
  payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONSUMER_SURFACE ||
  payload.explanation_context.explanation_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STATUS_AVAILABLE ||
  payload.explanation_context.explanation_scope !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SCOPE_CURRENT_CLOSURE
) {
  throw new Error(
    "review decision attestation closure explanation profile envelope drifted"
  );
}

if (
  contract.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_KIND ||
  contract.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_VERSION ||
  contract.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_BOUNDARY
) {
  throw new Error(
    "review decision attestation closure explanation contract envelope drifted"
  );
}

if (
  consumed.derived_only !== true ||
  consumed.supporting_artifact_only !== true ||
  consumed.non_authoritative !== true ||
  consumed.additive_only !== true ||
  consumed.non_executing !== true ||
  consumed.default_off !== true
) {
  throw new Error(
    "review decision attestation closure explanation summary drifted"
  );
}

assertRejected(
  () =>
    buildGovernanceCaseReviewDecisionAttestationClosureExplanation({
      governanceCaseReviewDecisionAttestationApplicabilityClosureProfile: null,
      governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
      governanceCaseReviewDecisionApplicabilityProfile:
        fixture.applicabilityProfile,
      governanceCaseReviewDecisionApplicabilityExplanationProfile:
        fixture.applicabilityExplanation,
    }),
  "profile must be an object",
  "review decision attestation closure explanation must reject missing closure"
);

assertRejected(() => {
  const mismatched = cloneJson(fixture.attestation);
  mismatched.governance_case_review_decision_attestation.attestation_ref.case_id =
    "case-other";
  return buildGovernanceCaseReviewDecisionAttestationClosureExplanation({
    governanceCaseReviewDecisionAttestationApplicabilityClosureProfile:
      fixture.closure,
    governanceCaseReviewDecisionAttestationProfile: mismatched,
    governanceCaseReviewDecisionApplicabilityProfile:
      fixture.applicabilityProfile,
    governanceCaseReviewDecisionApplicabilityExplanationProfile:
      fixture.applicabilityExplanation,
  });
}, "case aligned", "review decision attestation closure explanation must reject cross-case mismatch");

assertRejected(() => {
  const mismatched = cloneJson(fixture.applicabilityExplanation);
  mismatched.canonical_action_hash =
    "sha256:other0000bbbb8888cccc9999dddd0000eeee1111ffff2222aaaa3333bbbb4444";
  return buildGovernanceCaseReviewDecisionAttestationClosureExplanation({
    governanceCaseReviewDecisionAttestationApplicabilityClosureProfile:
      fixture.closure,
    governanceCaseReviewDecisionAttestationProfile: fixture.attestation,
    governanceCaseReviewDecisionApplicabilityProfile:
      fixture.applicabilityProfile,
    governanceCaseReviewDecisionApplicabilityExplanationProfile: mismatched,
  });
}, "canonical action hash aligned", "review decision attestation closure explanation must reject cross-canonical-action-hash mismatch");

assertRejected(() => {
  const drifted = cloneJson(profile);
  drifted.governance_case_review_decision_attestation_closure_explanation.preserved_semantics.authority_source_enabled =
    true;
  permitExports.assertValidGovernanceCaseReviewDecisionAttestationClosureExplanationProfile(
    drifted
  );
}, "preserved semantic drifted: authority_source_enabled", "review decision attestation closure explanation profile validator must reject authority drift");

assertRejected(() => {
  const drifted = cloneJson(contract);
  drifted.main_path_takeover = true;
  permitExports.assertValidGovernanceCaseReviewDecisionAttestationClosureExplanationContract(
    drifted
  );
}, "contract field drifted: main_path_takeover", "review decision attestation closure explanation contract validator must reject main-path drift");

if (
  !GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_closure_explanation ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_closure_explanation.derived_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_closure_explanation.supporting_artifact_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_closure_explanation.non_authoritative !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_closure_explanation.aggregate_export_only !== true ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_closure_explanation.permit_lane_consumption !== false ||
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SURFACE_MAP.governance_case_review_decision_attestation_closure_explanation.main_path_takeover !== false
) {
  throw new Error(
    "review decision attestation closure explanation export surface drifted"
  );
}

for (const exportName of [
  "buildGovernanceCaseReviewDecisionAttestationClosureExplanation",
  "buildGovernanceCaseReviewDecisionAttestationClosureExplanationContract",
  "consumeGovernanceCaseReviewDecisionAttestationClosureExplanation",
  "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SURFACE_MAP",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision attestation closure explanation permit export missing: ${exportName}`
    );
  }
}

process.stdout.write(
  "governance case review decision attestation closure explanation boundary verified\n"
);
