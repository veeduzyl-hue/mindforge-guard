import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY,
  GOVERNANCE_RATIONALE_BUNDLE_KIND,
  GOVERNANCE_RATIONALE_BUNDLE_SCHEMA_ID,
  GOVERNANCE_RATIONALE_BUNDLE_STAGE,
  GOVERNANCE_RATIONALE_BUNDLE_STABLE_EXPORT_SET,
  GOVERNANCE_RATIONALE_BUNDLE_VERSION,
  GOVERNANCE_REVIEW_PACK_CONTRACT_BOUNDARY,
  GOVERNANCE_REVIEW_PACK_CONTRACT_KIND,
  GOVERNANCE_REVIEW_PACK_CONTRACT_VERSION,
  GOVERNANCE_SNAPSHOT_CONSUMER_COMPATIBLE,
  GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
  GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_BOUNDARY,
  GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND,
  GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_VERSION,
  GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY,
  GOVERNANCE_SNAPSHOT_PROFILE_KIND,
  GOVERNANCE_SNAPSHOT_PROFILE_VERSION,
  GOVERNANCE_SNAPSHOT_RECEIPT_READY,
  GOVERNANCE_SNAPSHOT_SURFACE_MAP,
  GOVERNANCE_SNAPSHOT_SURFACE_STABLE_EXPORT_SET,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildApprovalStabilizationProfile,
  buildEnforcementCompatibilityProfile,
  buildEnforcementReadinessProfile,
  buildEnforcementStabilizationProfile,
  buildGovernanceCompareCompatibilityContract,
  buildGovernanceDecisionRecord,
  buildGovernanceEvidenceProfile,
  buildGovernanceEvidenceReplayProfile,
  buildGovernanceEvidenceStabilizationProfile,
  buildGovernanceRationaleBundleProfile,
  buildGovernanceReviewPackContract,
  buildGovernanceSnapshotExportCompatibilityContract,
  buildGovernanceSnapshotProfile,
  buildJudgmentCompatibilityContract,
  buildJudgmentProfile,
  buildJudgmentReadinessProfile,
  buildJudgmentStabilizationProfile,
  buildLimitedEnforcementAuthorityResult,
  buildPermitGateResult,
  buildPolicyCompatibilityProfile,
  buildPolicyProfile,
  buildPolicyStabilizationProfile,
  validateGovernanceRationaleBundleProfile,
  validateGovernanceReviewPackContract,
  validateGovernanceSnapshotExportCompatibilityContract,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:ababcdcdababcdcdababcdcdababcdcdababcdcdababcdcdababcdcdababcdcd",
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

function buildReviewPackArtifacts(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "cccccccccccccccccccccccccccccccccccccccc", branch: "branch" },
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
  const reviewPack = buildGovernanceReviewPackContract({
    governanceSnapshotProfile: snapshot,
  });
  const rationaleBundle = buildGovernanceRationaleBundleProfile({
    governanceSnapshotProfile: snapshot,
  });
  const exportCompatibility = buildGovernanceSnapshotExportCompatibilityContract({
    governanceRationaleBundleProfile: rationaleBundle,
  });
  return { reviewPack, rationaleBundle, exportCompatibility };
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const { reviewPack, rationaleBundle, exportCompatibility } =
    buildReviewPackArtifacts(decision);

  const reviewValidation = validateGovernanceReviewPackContract(reviewPack);
  if (!reviewValidation.ok) {
    throw new Error(
      `governance review pack validation failed: ${reviewValidation.errors.join("; ")}`
    );
  }
  const bundleValidation = validateGovernanceRationaleBundleProfile(rationaleBundle);
  if (!bundleValidation.ok) {
    throw new Error(
      `governance rationale bundle validation failed: ${bundleValidation.errors.join("; ")}`
    );
  }
  const exportValidation =
    validateGovernanceSnapshotExportCompatibilityContract(exportCompatibility);
  if (!exportValidation.ok) {
    throw new Error(
      `governance snapshot export compatibility validation failed: ${exportValidation.errors.join("; ")}`
    );
  }

  if (
    reviewPack.kind !== GOVERNANCE_REVIEW_PACK_CONTRACT_KIND ||
    reviewPack.version !== GOVERNANCE_REVIEW_PACK_CONTRACT_VERSION ||
    reviewPack.boundary !== GOVERNANCE_REVIEW_PACK_CONTRACT_BOUNDARY ||
    reviewPack.review_pack_ready !== true ||
    reviewPack.rationale_bundle_available !== true ||
    reviewPack.recommendation_only !== true ||
    reviewPack.additive_only !== true ||
    reviewPack.execution_enabled !== false ||
    reviewPack.authority_scope !== "review_gate_deny_exit_recommendation_only" ||
    reviewPack.authority_scope_expansion !== false
  ) {
    throw new Error("governance review pack contract drifted");
  }

  if (
    rationaleBundle.kind !== GOVERNANCE_RATIONALE_BUNDLE_KIND ||
    rationaleBundle.version !== GOVERNANCE_RATIONALE_BUNDLE_VERSION ||
    rationaleBundle.schema_id !== GOVERNANCE_RATIONALE_BUNDLE_SCHEMA_ID ||
    rationaleBundle.governance_rationale_bundle.stage !== GOVERNANCE_RATIONALE_BUNDLE_STAGE ||
    rationaleBundle.governance_rationale_bundle.consumer_surface !==
      GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE ||
    rationaleBundle.governance_rationale_bundle.boundary !==
      GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY
  ) {
    throw new Error("governance rationale bundle envelope drifted");
  }
  const snapshotRef = rationaleBundle.governance_rationale_bundle.snapshot_ref;
  if (
    snapshotRef.kind !== GOVERNANCE_SNAPSHOT_PROFILE_KIND ||
    snapshotRef.version !== GOVERNANCE_SNAPSHOT_PROFILE_VERSION ||
    snapshotRef.boundary !== GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY
  ) {
    throw new Error("governance rationale bundle snapshot ref drifted");
  }
  const receiptReadiness =
    rationaleBundle.governance_rationale_bundle.receipt_readiness;
  if (
    receiptReadiness.level !== GOVERNANCE_SNAPSHOT_RECEIPT_READY ||
    receiptReadiness.review_pack_ready !== true ||
    receiptReadiness.rationale_bundle_ready !== true ||
    receiptReadiness.recommendation_only !== true
  ) {
    throw new Error("governance rationale bundle receipt readiness drifted");
  }
  const consumerCompatibility =
    rationaleBundle.governance_rationale_bundle.consumer_compatibility;
  if (
    consumerCompatibility.level !== GOVERNANCE_SNAPSHOT_CONSUMER_COMPATIBLE ||
    consumerCompatibility.additive_only !== true ||
    consumerCompatibility.non_executing !== true ||
    consumerCompatibility.default_off !== true ||
    consumerCompatibility.authority_scope !==
      "review_gate_deny_exit_recommendation_only" ||
    consumerCompatibility.denied_exit_code_preserved !== 25
  ) {
    throw new Error("governance rationale bundle consumer compatibility drifted");
  }

  if (
    exportCompatibility.kind !== GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND ||
    exportCompatibility.version !==
      GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_VERSION ||
    exportCompatibility.boundary !==
      GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_BOUNDARY ||
    exportCompatibility.export_compatible !== true ||
    exportCompatibility.review_pack_ready !== true ||
    exportCompatibility.recommendation_only !== true ||
    exportCompatibility.additive_only !== true ||
    exportCompatibility.execution_enabled !== false ||
    exportCompatibility.default_on !== false ||
    exportCompatibility.audit_output_preserved !== true ||
    exportCompatibility.audit_verdict_preserved !== true ||
    exportCompatibility.actual_exit_code_preserved !== true ||
    exportCompatibility.denied_exit_code_preserved !== 25 ||
    exportCompatibility.authority_scope !==
      "review_gate_deny_exit_recommendation_only" ||
    exportCompatibility.governance_object_addition !== false ||
    exportCompatibility.main_path_takeover !== false
  ) {
    throw new Error("governance snapshot export compatibility drifted");
  }
}

if (!GOVERNANCE_SNAPSHOT_SURFACE_MAP.governance_snapshot_review_pack) {
  throw new Error("governance snapshot review pack surface entry missing");
}
if (
  GOVERNANCE_SNAPSHOT_SURFACE_MAP.governance_snapshot_review_pack.contract.kind !==
  GOVERNANCE_RATIONALE_BUNDLE_KIND
) {
  throw new Error("governance snapshot review pack surface contract kind drifted");
}

for (const exportName of GOVERNANCE_RATIONALE_BUNDLE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance rationale bundle export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_SNAPSHOT_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance snapshot surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance review pack verified\n");
