import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  ENFORCEMENT_COMPATIBILITY_BOUNDARY,
  ENFORCEMENT_COMPATIBILITY_KIND,
  ENFORCEMENT_COMPATIBILITY_STAGE,
  ENFORCEMENT_COMPATIBILITY_VERSION,
  ENFORCEMENT_CONSUMER_COMPATIBLE,
  ENFORCEMENT_FINAL_ACCEPTANCE_BOUNDARY,
  ENFORCEMENT_FINAL_ACCEPTANCE_READY,
  ENFORCEMENT_SCOPE_REVIEW_ONLY,
  ENFORCEMENT_STABILIZATION_KIND,
  ENFORCEMENT_STABILIZATION_SCHEMA_ID,
  ENFORCEMENT_STABILIZATION_STAGE,
  ENFORCEMENT_STABILIZATION_STABLE_EXPORT_SET,
  ENFORCEMENT_STABILIZATION_VERSION,
  ENFORCEMENT_SURFACE_MAP,
  ENFORCEMENT_SURFACE_STABLE_EXPORT_SET,
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
  validateEnforcementStabilizationProfile,
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

function buildArtifacts(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: {
          head: "3434343434343434343434343434343434343434",
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

  return {
    enforcementStabilization: buildEnforcementStabilizationProfile({
      enforcementCompatibilityProfile: enforcementCompatibility,
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
  const validation = validateEnforcementStabilizationProfile(
    artifactSet.enforcementStabilization
  );
  if (!validation.ok) {
    throw new Error(
      `enforcement stabilization validation failed: ${validation.errors.join("; ")}`
    );
  }

  const artifact = artifactSet.enforcementStabilization;
  if (artifact.kind !== ENFORCEMENT_STABILIZATION_KIND) {
    throw new Error("enforcement stabilization kind drifted");
  }
  if (artifact.version !== ENFORCEMENT_STABILIZATION_VERSION) {
    throw new Error("enforcement stabilization version drifted");
  }
  if (artifact.schema_id !== ENFORCEMENT_STABILIZATION_SCHEMA_ID) {
    throw new Error("enforcement stabilization schema id drifted");
  }
  if (
    artifact.enforcement_stabilization.stage !== ENFORCEMENT_STABILIZATION_STAGE
  ) {
    throw new Error("enforcement stabilization stage drifted");
  }
  if (
    artifact.enforcement_stabilization.boundary !==
    ENFORCEMENT_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    throw new Error("enforcement stabilization boundary drifted");
  }
  const ref = artifact.enforcement_stabilization.compatibility_ref;
  if (
    ref.kind !== ENFORCEMENT_COMPATIBILITY_KIND ||
    ref.version !== ENFORCEMENT_COMPATIBILITY_VERSION ||
    ref.stage !== ENFORCEMENT_COMPATIBILITY_STAGE ||
    ref.boundary !== ENFORCEMENT_COMPATIBILITY_BOUNDARY
  ) {
    throw new Error("enforcement stabilization compatibility ref drifted");
  }
  const contract = artifact.enforcement_stabilization.final_consumer_contract;
  if (
    contract.acceptance_level !== ENFORCEMENT_FINAL_ACCEPTANCE_READY ||
    contract.recommendation_only !== true ||
    contract.additive_only !== true ||
    contract.execution_enabled !== false ||
    contract.default_on !== false ||
    contract.audit_output_preserved !== true ||
    contract.audit_verdict_preserved !== true ||
    contract.actual_exit_code_preserved !== true ||
    contract.denied_exit_code_preserved !== 25 ||
    contract.authority_scope !== ENFORCEMENT_SCOPE_REVIEW_ONLY ||
    contract.governance_object_addition !== false
  ) {
    throw new Error("enforcement stabilization final consumer contract drifted");
  }
  const semantics = artifact.enforcement_stabilization.preserved_semantics;
  if (
    semantics.permit_gate_semantics_preserved !== true ||
    semantics.enforcement_pilot_semantics_preserved !== true ||
    semantics.limited_authority_semantics_preserved !== true ||
    semantics.approval_semantics_preserved !== true ||
    semantics.enforcement_readiness_semantics_preserved !== true ||
    semantics.enforcement_compatibility_semantics_preserved !== true ||
    semantics.rollback_execution_available !== false ||
    semantics.override_execution_available !== false ||
    semantics.consumer_contract_ready !== true
  ) {
    throw new Error("enforcement stabilization preserved semantics drifted");
  }
}

if (!ENFORCEMENT_SURFACE_MAP.enforcement_stabilization) {
  throw new Error("enforcement stabilization surface entry missing");
}
if (
  ENFORCEMENT_SURFACE_MAP.enforcement_compatibility.contract.kind !==
  "enforcement_compatibility_readiness_profile"
) {
  throw new Error("enforcement compatibility surface drifted");
}

for (const exportName of ENFORCEMENT_STABILIZATION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `enforcement stabilization export missing from permit index: ${exportName}`
    );
  }
}

for (const exportName of ENFORCEMENT_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `enforcement surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance enforcement stabilization verified\n");
