import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  POLICY_CONSUMER_SURFACE,
  POLICY_INHERITANCE_CONTRACT_BOUNDARY,
  POLICY_INHERITANCE_CONTRACT_KIND,
  POLICY_INHERITANCE_CONTRACT_VERSION,
  POLICY_PROFILE_BOUNDARY,
  POLICY_PROFILE_KIND,
  POLICY_PROFILE_SCHEMA_ID,
  POLICY_PROFILE_STAGE,
  POLICY_PROFILE_STABLE_EXPORT_SET,
  POLICY_PROFILE_VERSION,
  POLICY_ROLLOUT_READINESS_CONTRACT_BOUNDARY,
  POLICY_ROLLOUT_READINESS_CONTRACT_KIND,
  POLICY_ROLLOUT_READINESS_CONTRACT_VERSION,
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
  buildPolicyProfile,
  validatePolicyProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:efefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefef",
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

function buildArtifacts(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: {
          head: "5656565656565656565656565656565656565656",
          branch: "branch",
        },
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

  return {
    policyProfile: buildPolicyProfile({
      enforcementStabilizationProfile: enforcementStabilization,
    }),
  };
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const artifactSet = buildArtifacts(decision);
  const validation = validatePolicyProfile(artifactSet.policyProfile);
  if (!validation.ok) {
    throw new Error(
      `policy profile validation failed: ${validation.errors.join("; ")}`
    );
  }
  const artifact = artifactSet.policyProfile;
  if (artifact.kind !== POLICY_PROFILE_KIND) {
    throw new Error("policy profile kind drifted");
  }
  if (artifact.version !== POLICY_PROFILE_VERSION) {
    throw new Error("policy profile version drifted");
  }
  if (artifact.schema_id !== POLICY_PROFILE_SCHEMA_ID) {
    throw new Error("policy profile schema id drifted");
  }
  if (artifact.policy_profile.stage !== POLICY_PROFILE_STAGE) {
    throw new Error("policy profile stage drifted");
  }
  if (artifact.policy_profile.consumer_surface !== POLICY_CONSUMER_SURFACE) {
    throw new Error("policy consumer surface drifted");
  }
  if (artifact.policy_profile.boundary !== POLICY_PROFILE_BOUNDARY) {
    throw new Error("policy profile boundary drifted");
  }
  const inheritance = artifact.policy_profile.inheritance_contract;
  if (
    inheritance.kind !== POLICY_INHERITANCE_CONTRACT_KIND ||
    inheritance.version !== POLICY_INHERITANCE_CONTRACT_VERSION ||
    inheritance.boundary !== POLICY_INHERITANCE_CONTRACT_BOUNDARY ||
    inheritance.bounded_inheritance !== true ||
    inheritance.authority_scope !== "review_gate_deny_exit_recommendation_only" ||
    inheritance.authority_scope_expansion !== false
  ) {
    throw new Error("policy inheritance contract drifted");
  }
  const rollout = artifact.policy_profile.rollout_readiness_contract;
  if (
    rollout.kind !== POLICY_ROLLOUT_READINESS_CONTRACT_KIND ||
    rollout.version !== POLICY_ROLLOUT_READINESS_CONTRACT_VERSION ||
    rollout.boundary !== POLICY_ROLLOUT_READINESS_CONTRACT_BOUNDARY ||
    rollout.readiness_only !== true ||
    rollout.execution_enabled !== false ||
    rollout.audit_output_preserved !== true ||
    rollout.audit_verdict_preserved !== true ||
    rollout.actual_exit_code_preserved !== true ||
    rollout.denied_exit_code_preserved !== 25 ||
    rollout.governance_object_addition !== false
  ) {
    throw new Error("policy rollout readiness contract drifted");
  }
}

if (!POLICY_SURFACE_MAP.policy_profile) {
  throw new Error("policy surface entry missing");
}
if (POLICY_SURFACE_MAP.policy_profile.contract.kind !== POLICY_PROFILE_KIND) {
  throw new Error("policy surface contract kind drifted");
}

for (const exportName of POLICY_PROFILE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `policy profile export missing from permit index: ${exportName}`
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

process.stdout.write("governance policy rollout verified\n");
