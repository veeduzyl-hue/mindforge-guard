import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  POLICY_COMPATIBILITY_BOUNDARY,
  POLICY_COMPATIBILITY_KIND,
  POLICY_COMPATIBILITY_STABLE_EXPORT_SET,
  POLICY_COMPATIBILITY_VERSION,
  POLICY_CONSUMER_COMPATIBLE,
  POLICY_MIGRATION_READINESS_BOUNDARY,
  POLICY_MIGRATION_READINESS_KIND,
  POLICY_MIGRATION_READINESS_VERSION,
  POLICY_MIGRATION_READY,
  POLICY_PINNING_CONTRACT_BOUNDARY,
  POLICY_PINNING_CONTRACT_KIND,
  POLICY_PINNING_CONTRACT_VERSION,
  POLICY_SURFACE_MAP,
  POLICY_SURFACE_STABLE_EXPORT_SET,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildApprovalStabilizationProfile,
  buildEnforcementCompatibilityProfile,
  buildEnforcementReadinessProfile,
  buildEnforcementStabilizationProfile,
  buildGovernanceDecisionRecord,
  buildJudgmentCompatibilityContract,
  buildJudgmentProfile,
  buildJudgmentReadinessProfile,
  buildJudgmentStabilizationProfile,
  buildLimitedEnforcementAuthorityResult,
  buildPermitGateResult,
  buildPolicyCompatibilityProfile,
  buildPolicyProfile,
  validatePolicyCompatibilityProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:cdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd",
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

function buildPolicyCompatibility(decision) {
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

  return buildPolicyCompatibilityProfile({ policyProfile });
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const artifact = buildPolicyCompatibility(decision);
  const validation = validatePolicyCompatibilityProfile(artifact);
  if (!validation.ok) {
    throw new Error(
      `policy compatibility validation failed: ${validation.errors.join("; ")}`
    );
  }
  if (artifact.kind !== POLICY_COMPATIBILITY_KIND) {
    throw new Error("policy compatibility kind drifted");
  }
  if (artifact.version !== POLICY_COMPATIBILITY_VERSION) {
    throw new Error("policy compatibility version drifted");
  }
  if (artifact.policy_compatibility.boundary !== POLICY_COMPATIBILITY_BOUNDARY) {
    throw new Error("policy compatibility boundary drifted");
  }
  const pinning = artifact.policy_compatibility.pinning_contract;
  if (
    pinning.kind !== POLICY_PINNING_CONTRACT_KIND ||
    pinning.version !== POLICY_PINNING_CONTRACT_VERSION ||
    pinning.boundary !== POLICY_PINNING_CONTRACT_BOUNDARY
  ) {
    throw new Error("policy pinning contract drifted");
  }
  const migration = artifact.policy_compatibility.migration_readiness_profile;
  if (
    migration.kind !== POLICY_MIGRATION_READINESS_KIND ||
    migration.version !== POLICY_MIGRATION_READINESS_VERSION ||
    migration.policy_migration_readiness.boundary !==
      POLICY_MIGRATION_READINESS_BOUNDARY
  ) {
    throw new Error("policy migration readiness drifted");
  }
  if (artifact.policy_compatibility.receipt_readiness.level !== POLICY_MIGRATION_READY) {
    throw new Error("policy receipt readiness level drifted");
  }
  if (
    artifact.policy_compatibility.consumer_compatibility.level !==
    POLICY_CONSUMER_COMPATIBLE
  ) {
    throw new Error("policy consumer compatibility level drifted");
  }
}

if (!POLICY_SURFACE_MAP.policy_compatibility) {
  throw new Error("policy compatibility surface entry missing");
}

for (const exportName of POLICY_COMPATIBILITY_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `policy compatibility export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of POLICY_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `policy surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance policy compatibility verified\n");
