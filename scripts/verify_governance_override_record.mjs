import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_CASE_LINKAGE_BOUNDARY,
  GOVERNANCE_CASE_LINKAGE_KIND,
  GOVERNANCE_CASE_LINKAGE_SCHEMA_ID,
  GOVERNANCE_CASE_LINKAGE_STAGE,
  GOVERNANCE_CASE_LINKAGE_STABLE_EXPORT_SET,
  GOVERNANCE_CASE_LINKAGE_VERSION,
  GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_VERSION,
  GOVERNANCE_EXCEPTION_CONSUMER_COMPATIBLE,
  GOVERNANCE_EXCEPTION_CONSUMER_SURFACE,
  GOVERNANCE_EXCEPTION_RECEIPT_READY,
  GOVERNANCE_EXCEPTION_SURFACE_MAP,
  GOVERNANCE_EXCEPTION_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_OVERRIDE_RECORD_CONTRACT_BOUNDARY,
  GOVERNANCE_OVERRIDE_RECORD_CONTRACT_KIND,
  GOVERNANCE_OVERRIDE_RECORD_CONTRACT_VERSION,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildApprovalStabilizationProfile,
  buildEnforcementCompatibilityProfile,
  buildEnforcementReadinessProfile,
  buildEnforcementStabilizationProfile,
  buildGovernanceCaseLinkageProfile,
  buildGovernanceCompareCompatibilityContract,
  buildGovernanceDecisionRecord,
  buildGovernanceEvidenceProfile,
  buildGovernanceEvidenceReplayProfile,
  buildGovernanceEvidenceStabilizationProfile,
  buildGovernanceExceptionCompatibilityContract,
  buildGovernanceExceptionProfile,
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
  validateGovernanceCaseLinkageProfile,
  validateGovernanceExceptionCompatibilityContract,
  validateGovernanceOverrideRecordContract,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
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

function buildOverrideArtifacts(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "dddddddddddddddddddddddddddddddddddddddd", branch: "branch" },
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
  const overrideRecord = buildGovernanceOverrideRecordContract({
    governanceExceptionProfile: exceptionProfile,
  });
  const caseLinkage = buildGovernanceCaseLinkageProfile({
    governanceExceptionProfile: exceptionProfile,
  });
  const compatibility = buildGovernanceExceptionCompatibilityContract({
    governanceCaseLinkageProfile: caseLinkage,
  });
  return { overrideRecord, caseLinkage, compatibility };
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const { overrideRecord, caseLinkage, compatibility } =
    buildOverrideArtifacts(decision);

  const overrideValidation =
    validateGovernanceOverrideRecordContract(overrideRecord);
  if (!overrideValidation.ok) {
    throw new Error(
      `governance override record validation failed: ${overrideValidation.errors.join("; ")}`
    );
  }
  const linkageValidation = validateGovernanceCaseLinkageProfile(caseLinkage);
  if (!linkageValidation.ok) {
    throw new Error(
      `governance case linkage validation failed: ${linkageValidation.errors.join("; ")}`
    );
  }
  const compatibilityValidation =
    validateGovernanceExceptionCompatibilityContract(compatibility);
  if (!compatibilityValidation.ok) {
    throw new Error(
      `governance exception compatibility validation failed: ${compatibilityValidation.errors.join("; ")}`
    );
  }

  if (
    overrideRecord.kind !== GOVERNANCE_OVERRIDE_RECORD_CONTRACT_KIND ||
    overrideRecord.version !== GOVERNANCE_OVERRIDE_RECORD_CONTRACT_VERSION ||
    overrideRecord.boundary !== GOVERNANCE_OVERRIDE_RECORD_CONTRACT_BOUNDARY ||
    overrideRecord.override_record_ready !== true ||
    overrideRecord.case_linkage_available !== true ||
    overrideRecord.recommendation_only !== true ||
    overrideRecord.additive_only !== true ||
    overrideRecord.execution_enabled !== false ||
    overrideRecord.override_execution_available !== false ||
    overrideRecord.authority_scope !==
      "review_gate_deny_exit_recommendation_only" ||
    overrideRecord.authority_scope_expansion !== false
  ) {
    throw new Error("governance override record contract drifted");
  }

  if (
    caseLinkage.kind !== GOVERNANCE_CASE_LINKAGE_KIND ||
    caseLinkage.version !== GOVERNANCE_CASE_LINKAGE_VERSION ||
    caseLinkage.schema_id !== GOVERNANCE_CASE_LINKAGE_SCHEMA_ID ||
    caseLinkage.governance_case_linkage.stage !== GOVERNANCE_CASE_LINKAGE_STAGE ||
    caseLinkage.governance_case_linkage.consumer_surface !==
      GOVERNANCE_EXCEPTION_CONSUMER_SURFACE ||
    caseLinkage.governance_case_linkage.boundary !==
      GOVERNANCE_CASE_LINKAGE_BOUNDARY
  ) {
    throw new Error("governance case linkage envelope drifted");
  }
  const receiptReadiness = caseLinkage.governance_case_linkage.receipt_readiness;
  if (
    receiptReadiness.level !== GOVERNANCE_EXCEPTION_RECEIPT_READY ||
    receiptReadiness.override_record_ready !== true ||
    receiptReadiness.case_linkage_ready !== true ||
    receiptReadiness.recommendation_only !== true
  ) {
    throw new Error("governance case linkage receipt readiness drifted");
  }
  const consumerCompatibility =
    caseLinkage.governance_case_linkage.consumer_compatibility;
  if (
    consumerCompatibility.level !== GOVERNANCE_EXCEPTION_CONSUMER_COMPATIBLE ||
    consumerCompatibility.additive_only !== true ||
    consumerCompatibility.non_executing !== true ||
    consumerCompatibility.default_off !== true ||
    consumerCompatibility.authority_scope !==
      "review_gate_deny_exit_recommendation_only" ||
    consumerCompatibility.denied_exit_code_preserved !== 25
  ) {
    throw new Error("governance case linkage consumer compatibility drifted");
  }

  if (
    compatibility.kind !== GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_KIND ||
    compatibility.version !== GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_VERSION ||
    compatibility.boundary !== GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_BOUNDARY ||
    compatibility.consumer_compatible !== true ||
    compatibility.override_record_ready !== true ||
    compatibility.recommendation_only !== true ||
    compatibility.additive_only !== true ||
    compatibility.execution_enabled !== false ||
    compatibility.default_on !== false ||
    compatibility.audit_output_preserved !== true ||
    compatibility.audit_verdict_preserved !== true ||
    compatibility.actual_exit_code_preserved !== true ||
    compatibility.denied_exit_code_preserved !== 25 ||
    compatibility.authority_scope !==
      "review_gate_deny_exit_recommendation_only" ||
    compatibility.governance_object_addition !== false ||
    compatibility.main_path_takeover !== false
  ) {
    throw new Error("governance exception compatibility contract drifted");
  }
}

if (!GOVERNANCE_EXCEPTION_SURFACE_MAP.governance_exception_override_record) {
  throw new Error("governance exception override surface entry missing");
}
if (
  GOVERNANCE_EXCEPTION_SURFACE_MAP.governance_exception_override_record.contract.kind !==
  GOVERNANCE_CASE_LINKAGE_KIND
) {
  throw new Error("governance exception override surface contract kind drifted");
}

for (const exportName of GOVERNANCE_CASE_LINKAGE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance case linkage export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_EXCEPTION_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance exception surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance override record verified\n");
