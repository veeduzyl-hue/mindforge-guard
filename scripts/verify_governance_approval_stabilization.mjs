import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  APPROVAL_FINAL_ACCEPTANCE_BOUNDARY,
  APPROVAL_FINAL_ACCEPTANCE_READY,
  APPROVAL_STABILIZATION_KIND,
  APPROVAL_STABILIZATION_SCHEMA_ID,
  APPROVAL_STABILIZATION_STAGE,
  APPROVAL_STABILIZATION_STABLE_EXPORT_SET,
  APPROVAL_STABILIZATION_VERSION,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildApprovalStabilizationProfile,
  buildGovernanceDecisionRecord,
  buildJudgmentCompatibilityContract,
  buildJudgmentProfile,
  buildJudgmentReadinessProfile,
  buildJudgmentStabilizationProfile,
  buildLimitedEnforcementAuthorityResult,
  buildPermitGateResult,
  validateApprovalStabilizationProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
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
          head: "cccccccccccccccccccccccccccccccccccccccc",
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

  return { approvalStabilization };
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const artifactSet = buildArtifacts(decision);
  const validation = validateApprovalStabilizationProfile(
    artifactSet.approvalStabilization
  );
  if (!validation.ok) {
    throw new Error(
      `approval stabilization validation failed: ${validation.errors.join("; ")}`
    );
  }
  if (artifactSet.approvalStabilization.kind !== APPROVAL_STABILIZATION_KIND) {
    throw new Error("approval stabilization kind drifted");
  }
  if (
    artifactSet.approvalStabilization.version !== APPROVAL_STABILIZATION_VERSION
  ) {
    throw new Error("approval stabilization version drifted");
  }
  if (
    artifactSet.approvalStabilization.schema_id !==
    APPROVAL_STABILIZATION_SCHEMA_ID
  ) {
    throw new Error("approval stabilization schema id drifted");
  }
  if (
    artifactSet.approvalStabilization.approval_stabilization.stage !==
    APPROVAL_STABILIZATION_STAGE
  ) {
    throw new Error("approval stabilization stage drifted");
  }
  if (
    artifactSet.approvalStabilization.approval_stabilization.boundary !==
    APPROVAL_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    throw new Error("approval stabilization boundary drifted");
  }
  const contract =
    artifactSet.approvalStabilization.approval_stabilization.final_consumer_contract;
  if (
    contract.acceptance_level !== APPROVAL_FINAL_ACCEPTANCE_READY ||
    contract.recommendation_only !== true ||
    contract.additive_only !== true ||
    contract.override_execution_available !== false ||
    contract.audit_output_preserved !== true ||
    contract.audit_verdict_preserved !== true ||
    contract.actual_exit_code_preserved !== true
  ) {
    throw new Error("approval stabilization final consumer contract drifted");
  }
  if (contract.denied_exit_code_preserved !== 25) {
    throw new Error("approval stabilization deny exit code drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    throw new Error("approval stabilization authority scope drifted");
  }
  if (contract.governance_object_addition !== false) {
    throw new Error("approval stabilization governance object boundary drifted");
  }
  const semantics =
    artifactSet.approvalStabilization.approval_stabilization.preserved_semantics;
  if (
    semantics.permit_gate_semantics_preserved !== true ||
    semantics.enforcement_pilot_semantics_preserved !== true ||
    semantics.limited_authority_semantics_preserved !== true ||
    semantics.approval_exception_contract_preserved !== true ||
    semantics.approval_waiver_contract_preserved !== true ||
    semantics.approval_override_record_preserved !== true ||
    semantics.approval_receipt_stable !== true
  ) {
    throw new Error("approval stabilization preserved semantics drifted");
  }
}

for (const exportName of APPROVAL_STABILIZATION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `approval stabilization export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance approval stabilization verified\n");
