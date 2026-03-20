import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  APPROVAL_ARTIFACT_BOUNDARY,
  APPROVAL_ARTIFACT_KIND,
  APPROVAL_ARTIFACT_SCHEMA_ID,
  APPROVAL_ARTIFACT_STAGE,
  APPROVAL_ARTIFACT_STABLE_EXPORT_SET,
  APPROVAL_ARTIFACT_VERSION,
  APPROVAL_EXCEPTION_CONTRACT_BOUNDARY,
  APPROVAL_EXCEPTION_CONTRACT_KIND,
  APPROVAL_EXCEPTION_CONTRACT_VERSION,
  APPROVAL_STATUS_APPROVAL_REQUIRED,
  APPROVAL_STATUS_EXCEPTION_POSSIBLE,
  APPROVAL_STATUS_NOT_REQUESTED,
  APPROVAL_SURFACE_ARTIFACT_ORDER,
  APPROVAL_SURFACE_CONSUMER_TIER,
  APPROVAL_SURFACE_STABLE_EXPORT_SET,
  APPROVAL_SURFACE_MAP,
  assertValidApprovalSurface,
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
  validateApprovalArtifactProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:7777777777777777777777777777777777777777777777777777777777777777",
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
          head: "8888888888888888888888888888888888888888",
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
  const readiness = buildJudgmentReadinessProfile({
    judgmentProfile,
  });
  const compatibility = buildJudgmentCompatibilityContract({
    judgmentProfile,
    judgmentReadinessProfile: readiness,
  });
  const stabilization = buildJudgmentStabilizationProfile({
    judgmentProfile,
    judgmentReadinessProfile: readiness,
    judgmentCompatibilityContract: compatibility,
  });
  const approval = buildApprovalArtifactProfile({
    judgmentProfile,
    judgmentStabilizationProfile: stabilization,
  });
  const approvalReadiness = buildApprovalReadinessProfile({
    approvalArtifactProfile: approval,
  });
  const approvalReceipt = buildApprovalReceiptProfile({
    approvalArtifactProfile: approval,
    approvalReadinessProfile: approvalReadiness,
  });
  const approvalStabilization = buildApprovalStabilizationProfile({
    approvalArtifactProfile: approval,
    approvalReadinessProfile: approvalReadiness,
    approvalReceiptProfile: approvalReceipt,
  });

  return { judgmentProfile, approval, approvalStabilization };
}

assertValidApprovalSurface();

if (APPROVAL_SURFACE_CONSUMER_TIER !== "approval_adjacent_surface") {
  throw new Error("approval surface consumer tier drifted");
}
if (
  JSON.stringify(APPROVAL_SURFACE_ARTIFACT_ORDER) !==
  JSON.stringify(["approval_artifact", "approval_readiness", "approval_receipt"])
) {
  throw new Error("approval surface artifact order drifted");
}
if (
  APPROVAL_SURFACE_MAP.approval_artifact.contract.kind !== APPROVAL_ARTIFACT_KIND
) {
  throw new Error("approval surface contract kind drifted");
}
if (APPROVAL_SURFACE_MAP.approval_readiness.contract.kind !== "approval_readiness_profile") {
  throw new Error("approval readiness surface contract drifted");
}
if (APPROVAL_SURFACE_MAP.approval_receipt.contract.kind !== "approval_receipt_profile") {
  throw new Error("approval receipt surface contract drifted");
}

const insufficient = buildArtifacts("insufficient_signal");
const allow = buildArtifacts("would_allow");
const review = buildArtifacts("would_review");
const deny = buildArtifacts("would_deny");

for (const artifactSet of [insufficient, allow, review, deny]) {
  const validation = validateApprovalArtifactProfile(artifactSet.approval);
  if (!validation.ok) {
    throw new Error(
      `approval artifact validation failed: ${validation.errors.join("; ")}`
    );
  }
  if (artifactSet.approval.kind !== APPROVAL_ARTIFACT_KIND) {
    throw new Error("approval artifact kind drifted");
  }
  if (artifactSet.approval.version !== APPROVAL_ARTIFACT_VERSION) {
    throw new Error("approval artifact version drifted");
  }
  if (artifactSet.approval.schema_id !== APPROVAL_ARTIFACT_SCHEMA_ID) {
    throw new Error("approval artifact schema id drifted");
  }
  if (
    artifactSet.approval.approval_artifact.stage !== APPROVAL_ARTIFACT_STAGE
  ) {
    throw new Error("approval artifact stage drifted");
  }
  if (
    artifactSet.approval.approval_artifact.boundary !== APPROVAL_ARTIFACT_BOUNDARY
  ) {
    throw new Error("approval artifact boundary drifted");
  }
  const exceptionContract = artifactSet.approval.approval_artifact.exception_contract;
  if (exceptionContract.kind !== APPROVAL_EXCEPTION_CONTRACT_KIND) {
    throw new Error("approval exception contract kind drifted");
  }
  if (exceptionContract.version !== APPROVAL_EXCEPTION_CONTRACT_VERSION) {
    throw new Error("approval exception contract version drifted");
  }
  if (exceptionContract.boundary !== APPROVAL_EXCEPTION_CONTRACT_BOUNDARY) {
    throw new Error("approval exception contract boundary drifted");
  }
  if (
    exceptionContract.recommendation_only !== true ||
    exceptionContract.additive_only !== true ||
    exceptionContract.actual_authority_execution !== false ||
    exceptionContract.audit_output_preserved !== true ||
    exceptionContract.audit_verdict_preserved !== true ||
    exceptionContract.actual_exit_code_preserved !== true
  ) {
    throw new Error("approval exception contract preservation drifted");
  }
  if (exceptionContract.denied_exit_code_preserved !== 25) {
    throw new Error("approval exception contract deny exit drifted");
  }
  if (
    exceptionContract.authority_scope !==
    "review_gate_deny_exit_recommendation_only"
  ) {
    throw new Error("approval exception contract authority scope drifted");
  }
  const readinessRefs = artifactSet.approval.approval_artifact.readiness_refs;
  if (
    readinessRefs.readiness_profile_available !== true ||
    readinessRefs.approval_receipt_available !== true ||
    readinessRefs.override_record_contract !== "approval_override_record"
  ) {
    throw new Error("approval readiness refs drifted");
  }
  const finalContract =
    artifactSet.approvalStabilization.approval_stabilization.final_consumer_contract;
  if (
    finalContract.acceptance_level !== "final_consumer_ready" ||
    finalContract.recommendation_only !== true ||
    finalContract.additive_only !== true ||
    finalContract.override_execution_available !== false
  ) {
    throw new Error("approval stabilization final contract drifted");
  }
}

if (
  insufficient.approval.approval_artifact.approval_profile.approval_status !==
  APPROVAL_STATUS_EXCEPTION_POSSIBLE
) {
  throw new Error("approval insufficient-signal mapping drifted");
}
if (
  allow.approval.approval_artifact.approval_profile.approval_status !==
  APPROVAL_STATUS_NOT_REQUESTED
) {
  throw new Error("approval allow mapping drifted");
}
if (
  review.approval.approval_artifact.approval_profile.approval_status !==
  APPROVAL_STATUS_APPROVAL_REQUIRED
) {
  throw new Error("approval review mapping drifted");
}
if (
  deny.approval.approval_artifact.approval_profile.approval_status !==
  APPROVAL_STATUS_APPROVAL_REQUIRED
) {
  throw new Error("approval deny mapping drifted");
}

for (const exportName of [
  ...APPROVAL_ARTIFACT_STABLE_EXPORT_SET,
  ...APPROVAL_SURFACE_STABLE_EXPORT_SET,
]) {
  if (!(exportName in permitExports)) {
    throw new Error(`approval export missing from permit index: ${exportName}`);
  }
}

process.stdout.write("governance approval artifact verified\n");
