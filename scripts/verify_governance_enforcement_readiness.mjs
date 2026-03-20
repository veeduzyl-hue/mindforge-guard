import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  APPROVAL_FINAL_ACCEPTANCE_BOUNDARY,
  ENFORCEMENT_CONSUMER_SURFACE,
  ENFORCEMENT_READINESS_BOUNDARY,
  ENFORCEMENT_READINESS_KIND,
  ENFORCEMENT_READINESS_SCHEMA_ID,
  ENFORCEMENT_READINESS_STAGE,
  ENFORCEMENT_READINESS_STABLE_EXPORT_SET,
  ENFORCEMENT_READINESS_VERSION,
  ENFORCEMENT_SCOPE_REVIEW_ONLY,
  ENFORCEMENT_SURFACE_MAP,
  ENFORCEMENT_SURFACE_STABLE_EXPORT_SET,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildApprovalStabilizationProfile,
  buildEnforcementReadinessProfile,
  buildGovernanceDecisionRecord,
  buildJudgmentCompatibilityContract,
  buildJudgmentProfile,
  buildJudgmentReadinessProfile,
  buildJudgmentStabilizationProfile,
  buildLimitedEnforcementAuthorityResult,
  buildPermitGateResult,
  validateEnforcementReadinessProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
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
          head: "ffffffffffffffffffffffffffffffffffffffff",
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

  return {
    enforcementReadiness: buildEnforcementReadinessProfile({
      approvalStabilizationProfile: approvalStabilization,
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
  const validation = validateEnforcementReadinessProfile(
    artifactSet.enforcementReadiness
  );
  if (!validation.ok) {
    throw new Error(
      `enforcement readiness validation failed: ${validation.errors.join("; ")}`
    );
  }

  const artifact = artifactSet.enforcementReadiness;
  if (artifact.kind !== ENFORCEMENT_READINESS_KIND) {
    throw new Error("enforcement readiness kind drifted");
  }
  if (artifact.version !== ENFORCEMENT_READINESS_VERSION) {
    throw new Error("enforcement readiness version drifted");
  }
  if (artifact.schema_id !== ENFORCEMENT_READINESS_SCHEMA_ID) {
    throw new Error("enforcement readiness schema id drifted");
  }
  if (artifact.enforcement_readiness.stage !== ENFORCEMENT_READINESS_STAGE) {
    throw new Error("enforcement readiness stage drifted");
  }
  if (
    artifact.enforcement_readiness.consumer_surface !==
    ENFORCEMENT_CONSUMER_SURFACE
  ) {
    throw new Error("enforcement readiness consumer surface drifted");
  }
  if (
    artifact.enforcement_readiness.boundary !== ENFORCEMENT_READINESS_BOUNDARY
  ) {
    throw new Error("enforcement readiness boundary drifted");
  }
  if (
    artifact.enforcement_readiness.approval_ref.boundary !==
    APPROVAL_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    throw new Error("enforcement readiness approval boundary drifted");
  }
  const scope = artifact.enforcement_readiness.scope_contract;
  if (
    scope.recommendation_only !== true ||
    scope.additive_only !== true ||
    scope.execution_enabled !== false ||
    scope.default_on !== false ||
    scope.authority_scope !== ENFORCEMENT_SCOPE_REVIEW_ONLY ||
    scope.authority_scope_expansion !== false
  ) {
    throw new Error("enforcement readiness scope contract drifted");
  }
  const preservation = artifact.enforcement_readiness.preservation_contract;
  if (
    preservation.audit_output_preserved !== true ||
    preservation.audit_verdict_preserved !== true ||
    preservation.actual_exit_code_preserved !== true ||
    preservation.permit_gate_semantics_preserved !== true ||
    preservation.enforcement_pilot_semantics_preserved !== true ||
    preservation.limited_authority_semantics_preserved !== true ||
    preservation.approval_semantics_preserved !== true ||
    preservation.governance_object_addition !== false
  ) {
    throw new Error("enforcement readiness preservation contract drifted");
  }
  if (preservation.denied_exit_code_preserved !== 25) {
    throw new Error("enforcement readiness deny exit code drifted");
  }
}

const surfaceEntry = ENFORCEMENT_SURFACE_MAP.bounded_enforcement_readiness;
if (!surfaceEntry) {
  throw new Error("enforcement surface entry missing");
}
if (surfaceEntry.contract.kind !== ENFORCEMENT_READINESS_KIND) {
  throw new Error("enforcement surface contract kind drifted");
}
if (surfaceEntry.scope_contract.boundary !== "bounded_recommendation_only_scope_guard") {
  throw new Error("enforcement surface scope boundary drifted");
}
if (!ENFORCEMENT_SURFACE_MAP.enforcement_compatibility) {
  throw new Error("enforcement compatibility surface entry missing");
}
if (!ENFORCEMENT_SURFACE_MAP.enforcement_stabilization) {
  throw new Error("enforcement stabilization surface entry missing");
}

for (const exportName of ENFORCEMENT_READINESS_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `enforcement readiness export missing from permit index: ${exportName}`
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

process.stdout.write("governance enforcement readiness verified\n");
