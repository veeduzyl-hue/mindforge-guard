import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  AUTHORITY_PROOF_CONTRACT_BOUNDARY,
  AUTHORITY_PROOF_CONTRACT_KIND,
  AUTHORITY_PROOF_CONTRACT_VERSION,
  ENFORCEMENT_COMPATIBILITY_BOUNDARY,
  ENFORCEMENT_COMPATIBILITY_KIND,
  ENFORCEMENT_COMPATIBILITY_SCHEMA_ID,
  ENFORCEMENT_COMPATIBILITY_STAGE,
  ENFORCEMENT_COMPATIBILITY_STABLE_EXPORT_SET,
  ENFORCEMENT_COMPATIBILITY_VERSION,
  ENFORCEMENT_CONSUMER_COMPATIBLE,
  ENFORCEMENT_RECEIPT_READY,
  ENFORCEMENT_SCOPE_REVIEW_ONLY,
  ENFORCEMENT_SURFACE_MAP,
  ENFORCEMENT_SURFACE_STABLE_EXPORT_SET,
  ROLLBACK_SAFETY_CONTRACT_BOUNDARY,
  ROLLBACK_SAFETY_CONTRACT_KIND,
  ROLLBACK_SAFETY_CONTRACT_VERSION,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildApprovalStabilizationProfile,
  buildEnforcementCompatibilityProfile,
  buildEnforcementReadinessProfile,
  buildGovernanceDecisionRecord,
  buildJudgmentCompatibilityContract,
  buildJudgmentProfile,
  buildJudgmentReadinessProfile,
  buildJudgmentStabilizationProfile,
  buildLimitedEnforcementAuthorityResult,
  buildPermitGateResult,
  validateEnforcementCompatibilityProfile,
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

function buildArtifacts(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: {
          head: "1212121212121212121212121212121212121212",
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

  return {
    enforcementCompatibility: buildEnforcementCompatibilityProfile({
      enforcementReadinessProfile: enforcementReadiness,
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
  const validation = validateEnforcementCompatibilityProfile(
    artifactSet.enforcementCompatibility
  );
  if (!validation.ok) {
    throw new Error(
      `enforcement compatibility validation failed: ${validation.errors.join("; ")}`
    );
  }

  const artifact = artifactSet.enforcementCompatibility;
  if (artifact.kind !== ENFORCEMENT_COMPATIBILITY_KIND) {
    throw new Error("enforcement compatibility kind drifted");
  }
  if (artifact.version !== ENFORCEMENT_COMPATIBILITY_VERSION) {
    throw new Error("enforcement compatibility version drifted");
  }
  if (artifact.schema_id !== ENFORCEMENT_COMPATIBILITY_SCHEMA_ID) {
    throw new Error("enforcement compatibility schema id drifted");
  }
  if (
    artifact.enforcement_compatibility.stage !== ENFORCEMENT_COMPATIBILITY_STAGE
  ) {
    throw new Error("enforcement compatibility stage drifted");
  }
  if (
    artifact.enforcement_compatibility.boundary !==
    ENFORCEMENT_COMPATIBILITY_BOUNDARY
  ) {
    throw new Error("enforcement compatibility boundary drifted");
  }

  const proof = artifact.enforcement_compatibility.authority_proof_contract;
  if (
    proof.kind !== AUTHORITY_PROOF_CONTRACT_KIND ||
    proof.version !== AUTHORITY_PROOF_CONTRACT_VERSION ||
    proof.boundary !== AUTHORITY_PROOF_CONTRACT_BOUNDARY ||
    proof.recommendation_only !== true ||
    proof.additive_only !== true ||
    proof.execution_enabled !== false ||
    proof.default_on !== false ||
    proof.authority_scope !== ENFORCEMENT_SCOPE_REVIEW_ONLY ||
    proof.authority_scope_expansion !== false ||
    proof.proof_ready !== true
  ) {
    throw new Error("authority proof contract drifted");
  }

  const rollback = artifact.enforcement_compatibility.rollback_safety_contract;
  if (
    rollback.kind !== ROLLBACK_SAFETY_CONTRACT_KIND ||
    rollback.version !== ROLLBACK_SAFETY_CONTRACT_VERSION ||
    rollback.boundary !== ROLLBACK_SAFETY_CONTRACT_BOUNDARY ||
    rollback.rollback_execution_enabled !== false ||
    rollback.override_execution_enabled !== false ||
    rollback.audit_output_preserved !== true ||
    rollback.audit_verdict_preserved !== true ||
    rollback.actual_exit_code_preserved !== true ||
    rollback.denied_exit_code_preserved !== 25 ||
    rollback.governance_object_addition !== false ||
    rollback.rollback_safe !== true
  ) {
    throw new Error("rollback safety contract drifted");
  }

  const receipt = artifact.enforcement_compatibility.receipt_readiness;
  if (
    receipt.level !== ENFORCEMENT_RECEIPT_READY ||
    receipt.proof_ready !== true ||
    receipt.rollback_safe !== true ||
    receipt.recommendation_only !== true
  ) {
    throw new Error("enforcement receipt readiness drifted");
  }

  const compatibility = artifact.enforcement_compatibility.consumer_compatibility;
  if (
    compatibility.level !== ENFORCEMENT_CONSUMER_COMPATIBLE ||
    compatibility.additive_only !== true ||
    compatibility.non_executing !== true ||
    compatibility.default_off !== true ||
    compatibility.authority_scope !== ENFORCEMENT_SCOPE_REVIEW_ONLY ||
    compatibility.denied_exit_code_preserved !== 25
  ) {
    throw new Error("enforcement consumer compatibility drifted");
  }
}

if (!ENFORCEMENT_SURFACE_MAP.enforcement_compatibility) {
  throw new Error("enforcement compatibility surface entry missing");
}

for (const exportName of ENFORCEMENT_COMPATIBILITY_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `enforcement compatibility export missing from permit index: ${exportName}`
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

process.stdout.write("governance enforcement compatibility verified\n");
