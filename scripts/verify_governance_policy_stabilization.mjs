import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  POLICY_COMPATIBILITY_BOUNDARY,
  POLICY_COMPATIBILITY_KIND,
  POLICY_COMPATIBILITY_STAGE,
  POLICY_COMPATIBILITY_VERSION,
  POLICY_CONSUMER_SURFACE,
  POLICY_FINAL_ACCEPTANCE_BOUNDARY,
  POLICY_FINAL_ACCEPTANCE_READY,
  POLICY_STABILIZATION_KIND,
  POLICY_STABILIZATION_SCHEMA_ID,
  POLICY_STABILIZATION_STAGE,
  POLICY_STABILIZATION_STABLE_EXPORT_SET,
  POLICY_STABILIZATION_VERSION,
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
  buildPolicyStabilizationProfile,
  validatePolicyStabilizationProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:abababababababababababababababababababababababababababababababab",
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

function buildPolicyStabilization(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "8888888888888888888888888888888888888888", branch: "branch" },
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

  return buildPolicyStabilizationProfile({
    policyCompatibilityProfile: policyCompatibility,
  });
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const artifact = buildPolicyStabilization(decision);
  const validation = validatePolicyStabilizationProfile(artifact);
  if (!validation.ok) {
    throw new Error(
      `policy stabilization validation failed: ${validation.errors.join("; ")}`
    );
  }
  if (artifact.kind !== POLICY_STABILIZATION_KIND) {
    throw new Error("policy stabilization kind drifted");
  }
  if (artifact.version !== POLICY_STABILIZATION_VERSION) {
    throw new Error("policy stabilization version drifted");
  }
  if (artifact.schema_id !== POLICY_STABILIZATION_SCHEMA_ID) {
    throw new Error("policy stabilization schema id drifted");
  }
  if (artifact.policy_stabilization.stage !== POLICY_STABILIZATION_STAGE) {
    throw new Error("policy stabilization stage drifted");
  }
  if (
    artifact.policy_stabilization.consumer_surface !== POLICY_CONSUMER_SURFACE
  ) {
    throw new Error("policy stabilization consumer surface drifted");
  }
  if (
    artifact.policy_stabilization.boundary !== POLICY_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    throw new Error("policy stabilization boundary drifted");
  }
  const ref = artifact.policy_stabilization.compatibility_ref;
  if (
    ref.kind !== POLICY_COMPATIBILITY_KIND ||
    ref.version !== POLICY_COMPATIBILITY_VERSION ||
    ref.stage !== POLICY_COMPATIBILITY_STAGE ||
    ref.boundary !== POLICY_COMPATIBILITY_BOUNDARY
  ) {
    throw new Error("policy stabilization compatibility ref drifted");
  }
  const contract = artifact.policy_stabilization.final_consumer_contract;
  if (
    contract.acceptance_level !== POLICY_FINAL_ACCEPTANCE_READY ||
    contract.recommendation_only !== true ||
    contract.additive_only !== true ||
    contract.execution_enabled !== false ||
    contract.default_on !== false ||
    contract.audit_output_preserved !== true ||
    contract.audit_verdict_preserved !== true ||
    contract.actual_exit_code_preserved !== true ||
    contract.denied_exit_code_preserved !== 25 ||
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only" ||
    contract.governance_object_addition !== false
  ) {
    throw new Error("policy stabilization final consumer contract drifted");
  }
}

if (!POLICY_SURFACE_MAP.policy_stabilization) {
  throw new Error("policy stabilization surface entry missing");
}
if (
  POLICY_SURFACE_MAP.policy_stabilization.contract.kind !==
  POLICY_STABILIZATION_KIND
) {
  throw new Error("policy stabilization surface contract kind drifted");
}

for (const exportName of POLICY_STABILIZATION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `policy stabilization export missing from permit index: ${exportName}`
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

process.stdout.write("governance policy stabilization verified\n");
