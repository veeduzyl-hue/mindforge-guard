import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_KIND,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_KIND,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_READY,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_SCHEMA_ID,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_STAGE,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_MAP,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_VERSION,
  GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_BOUNDARY,
  GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_KIND,
  GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_VERSION,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND,
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
  buildGovernanceCaseFinalAcceptanceBoundary,
  buildGovernanceCaseFinalCompatibilityFreeze,
  buildGovernanceCaseLinkageProfile,
  buildGovernanceCaseResolutionCompatibilityContract,
  buildGovernanceCaseResolutionContract,
  buildGovernanceCaseResolutionProfile,
  buildGovernanceCaseResolutionStabilizationProfile,
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
  exportGovernanceCaseFinalAcceptanceSurface,
  validateGovernanceCaseFinalAcceptanceBoundary,
  validateGovernanceCaseFinalCompatibilityFreeze,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:ffff1111ffff1111ffff1111ffff1111ffff1111ffff1111ffff1111ffff1111",
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

function buildFinalAcceptance(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "ffffffffffffffffffffffffffffffffffffffff", branch: "branch" },
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
  const resolutionProfile = buildGovernanceCaseResolutionProfile({
    governanceExceptionStabilizationProfile: exceptionStabilization,
    caseId: `case-${decision}`,
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
    caseId: `case-${decision}`,
    linkedExceptionIds: [`exception-${decision}`],
    linkedOverrideRecordIds: [`override-${decision}`],
    linkedResolutionIds: [`resolution-${decision}`],
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
    caseId: `case-${decision}`,
    linkedExceptionIds: [`exception-${decision}`],
    linkedOverrideRecordIds: [`override-${decision}`],
    linkedResolutionIds: [`resolution-${decision}`],
    linkedEscalationIds: [`escalation-${decision}`],
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
  const finalAcceptance = buildGovernanceCaseFinalAcceptanceBoundary({
    governanceCaseResolutionStabilizationProfile: resolutionStabilization,
    governanceCaseEscalationStabilizationProfile: escalationStabilization,
    governanceCaseClosureStabilizationProfile: closureStabilization,
  });
  const compatibilityFreeze = buildGovernanceCaseFinalCompatibilityFreeze({
    governanceCaseFinalAcceptanceBoundary: finalAcceptance,
  });
  const exportSurface = exportGovernanceCaseFinalAcceptanceSurface({
    governanceCaseFinalAcceptanceBoundary: finalAcceptance,
    governanceCaseFinalCompatibilityFreeze: compatibilityFreeze,
  });
  return {
    finalAcceptance,
    compatibilityFreeze,
    exportSurface,
  };
}

for (const decision of ["insufficient_signal", "would_allow", "would_review", "would_deny"]) {
  const { finalAcceptance, compatibilityFreeze, exportSurface } =
    buildFinalAcceptance(decision);

  const finalAcceptanceValidation =
    validateGovernanceCaseFinalAcceptanceBoundary(finalAcceptance);
  if (!finalAcceptanceValidation.ok) {
    throw new Error(
      `governance case final acceptance validation failed: ${finalAcceptanceValidation.errors.join("; ")}`
    );
  }
  const freezeValidation =
    validateGovernanceCaseFinalCompatibilityFreeze(compatibilityFreeze);
  if (!freezeValidation.ok) {
    throw new Error(
      `governance case final compatibility freeze validation failed: ${freezeValidation.errors.join("; ")}`
    );
  }

  if (
    finalAcceptance.kind !== GOVERNANCE_CASE_FINAL_ACCEPTANCE_KIND ||
    finalAcceptance.version !== GOVERNANCE_CASE_FINAL_ACCEPTANCE_VERSION ||
    finalAcceptance.schema_id !== GOVERNANCE_CASE_FINAL_ACCEPTANCE_SCHEMA_ID ||
    finalAcceptance.governance_case_final_acceptance.stage !==
      GOVERNANCE_CASE_FINAL_ACCEPTANCE_STAGE ||
    finalAcceptance.governance_case_final_acceptance.boundary !==
      GOVERNANCE_CASE_FINAL_ACCEPTANCE_BOUNDARY ||
    finalAcceptance.governance_case_final_acceptance.consumer_surface !==
      GOVERNANCE_CASE_FINAL_ACCEPTANCE_CONSUMER_SURFACE
  ) {
    throw new Error("governance case final acceptance envelope drifted");
  }

  const payload = finalAcceptance.governance_case_final_acceptance;
  if (
    payload.final_acceptance_contract.readiness_level !==
      GOVERNANCE_CASE_FINAL_ACCEPTANCE_READY ||
    payload.final_acceptance_contract.resolution_boundary_present !== true ||
    payload.final_acceptance_contract.escalation_boundary_present !== true ||
    payload.final_acceptance_contract.closure_boundary_present !== true ||
    payload.final_acceptance_contract.execution_takeover !== false ||
    payload.final_acceptance_contract.authority_scope_expansion !== false ||
    payload.final_acceptance_contract.workflow_engine_emergence !== false ||
    payload.resolution_ref.kind !== GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND ||
    payload.escalation_ref.kind !== GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND ||
    payload.closure_ref.kind !== GOVERNANCE_CASE_CLOSURE_STABILIZATION_KIND ||
    payload.continuity.case_linkage_continuity !== true ||
    payload.continuity.exception_override_compatibility_continuity !== true ||
    payload.continuity.additive_only_continuity !== true ||
    payload.continuity.recommendation_only_continuity !== true ||
    payload.continuity.non_executing_continuity !== true ||
    payload.continuity.default_off_continuity !== true
  ) {
    throw new Error("governance case final acceptance contract drifted");
  }

  if (
    compatibilityFreeze.kind !== GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_KIND ||
    compatibilityFreeze.version !==
      GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_VERSION ||
    compatibilityFreeze.boundary !==
      GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_BOUNDARY ||
    compatibilityFreeze.actual_resolution_execution !== false ||
    compatibilityFreeze.actual_escalation_execution !== false ||
    compatibilityFreeze.actual_closure_execution !== false ||
    compatibilityFreeze.automatic_routing !== false ||
    compatibilityFreeze.automatic_case_finalization !== false ||
    compatibilityFreeze.workflow_transition_engine !== false ||
    compatibilityFreeze.authority_scope_expansion !== false ||
    compatibilityFreeze.audit_output_preserved !== true ||
    compatibilityFreeze.audit_verdict_preserved !== true ||
    compatibilityFreeze.actual_exit_code_preserved !== true ||
    compatibilityFreeze.denied_exit_code_preserved !== 25
  ) {
    throw new Error("governance case final compatibility freeze drifted");
  }

  if (
    exportSurface.release_summary.release_target !== "v5.3.0" ||
    exportSurface.release_summary.recommendation_only !== true ||
    exportSurface.release_summary.additive_only !== true ||
    exportSurface.release_summary.non_executing !== true ||
    exportSurface.release_summary.default_off !== true
  ) {
    throw new Error("governance case final acceptance release summary drifted");
  }

  const mismatchHashResolution = cloneJson(
    buildFinalAcceptance(decision).finalAcceptance
  );
  const mismatchHashEscalation = cloneJson(
    buildFinalAcceptance(decision).finalAcceptance
  );
  const mismatchHashClosure = cloneJson(
    buildFinalAcceptance(decision).finalAcceptance
  );
  void mismatchHashResolution;
  void mismatchHashEscalation;
  void mismatchHashClosure;
}

{
  const bridge = buildBridge("would_allow");
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "negative-run",
        mode: "local",
        git: { head: "ffffffffffffffffffffffffffffffffffffffff", branch: "branch" },
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
        decision: "would_allow",
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
  const resolutionProfile = buildGovernanceCaseResolutionProfile({
    governanceExceptionStabilizationProfile: exceptionStabilization,
    caseId: "case-negative",
    linkedExceptionIds: ["exception-negative"],
    linkedOverrideRecordIds: ["override-negative"],
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
    caseId: "case-negative",
    linkedExceptionIds: ["exception-negative"],
    linkedOverrideRecordIds: ["override-negative"],
    linkedResolutionIds: ["resolution-negative"],
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
    caseId: "case-negative",
    linkedExceptionIds: ["exception-negative"],
    linkedOverrideRecordIds: ["override-negative"],
    linkedResolutionIds: ["resolution-negative"],
    linkedEscalationIds: ["escalation-negative"],
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

  const mismatchedHashResolution = cloneJson(resolutionStabilization);
  mismatchedHashResolution.canonical_action_hash =
    "sha256:mismatch-resolution-canonical-action-hash";
  let hashMismatchRejected = false;
  try {
    buildGovernanceCaseFinalAcceptanceBoundary({
      governanceCaseResolutionStabilizationProfile: mismatchedHashResolution,
      governanceCaseEscalationStabilizationProfile: escalationStabilization,
      governanceCaseClosureStabilizationProfile: closureStabilization,
    });
  } catch (error) {
    if (String(error.message).includes("canonical lineage mismatch")) {
      hashMismatchRejected = true;
    }
  }
  if (!hashMismatchRejected) {
    throw new Error("governance case final acceptance must reject canonical lineage mismatch");
  }

  const mismatchedCaseClosure = cloneJson(closureStabilization);
  mismatchedCaseClosure.governance_case_closure_stabilization.continuity_ref.case_id =
    "case-negative-mismatch";
  let caseMismatchRejected = false;
  try {
    buildGovernanceCaseFinalAcceptanceBoundary({
      governanceCaseResolutionStabilizationProfile: resolutionStabilization,
      governanceCaseEscalationStabilizationProfile: escalationStabilization,
      governanceCaseClosureStabilizationProfile: mismatchedCaseClosure,
    });
  } catch (error) {
    if (String(error.message).includes("case continuity mismatch")) {
      caseMismatchRejected = true;
    }
  }
  if (!caseMismatchRejected) {
    throw new Error("governance case final acceptance must reject case continuity mismatch");
  }

  const mismatchedOverrideEscalation = cloneJson(escalationStabilization);
  mismatchedOverrideEscalation.governance_case_escalation_stabilization.continuity_ref.linked_override_record_ids =
    ["override-mismatch"];
  let overrideMismatchRejected = false;
  try {
    buildGovernanceCaseFinalAcceptanceBoundary({
      governanceCaseResolutionStabilizationProfile: resolutionStabilization,
      governanceCaseEscalationStabilizationProfile: mismatchedOverrideEscalation,
      governanceCaseClosureStabilizationProfile: closureStabilization,
    });
  } catch (error) {
    if (
      String(error.message).includes("override continuity mismatch") ||
      String(error.message).includes("exception continuity mismatch")
    ) {
      overrideMismatchRejected = true;
    }
  }
  if (!overrideMismatchRejected) {
    throw new Error(
      "governance case final acceptance must reject exception or override continuity basis mismatch"
    );
  }
}

if (
  !GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_MAP.governance_case_final_acceptance
) {
  throw new Error("governance case final acceptance surface entry missing");
}
if (
  !GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_MAP
    .governance_case_final_compatibility_freeze
) {
  throw new Error("governance case final compatibility freeze surface entry missing");
}

for (const exportName of GOVERNANCE_CASE_FINAL_ACCEPTANCE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case final acceptance export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case final compatibility freeze export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case final acceptance surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance case final acceptance verified\n");
