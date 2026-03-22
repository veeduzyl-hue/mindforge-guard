import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_EVIDENCE_STABILIZATION_KIND,
  GOVERNANCE_EVIDENCE_STABILIZATION_STAGE,
  GOVERNANCE_EVIDENCE_STABILIZATION_VERSION,
  GOVERNANCE_EXPLAINABILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_EXPLAINABILITY_CONTRACT_KIND,
  GOVERNANCE_EXPLAINABILITY_CONTRACT_VERSION,
  GOVERNANCE_RATIONALE_CONTRACT_BOUNDARY,
  GOVERNANCE_RATIONALE_CONTRACT_KIND,
  GOVERNANCE_RATIONALE_CONTRACT_VERSION,
  GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
  GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY,
  GOVERNANCE_SNAPSHOT_PROFILE_KIND,
  GOVERNANCE_SNAPSHOT_PROFILE_SCHEMA_ID,
  GOVERNANCE_SNAPSHOT_PROFILE_STAGE,
  GOVERNANCE_SNAPSHOT_PROFILE_VERSION,
  GOVERNANCE_SNAPSHOT_STABLE_EXPORT_SET,
  GOVERNANCE_SNAPSHOT_SURFACE_MAP,
  GOVERNANCE_SNAPSHOT_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_RATIONALE_BUNDLE_KIND,
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
  validateGovernanceSnapshotProfile,
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

function buildSnapshot(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", branch: "branch" },
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

  return buildGovernanceSnapshotProfile({
    governanceEvidenceStabilizationProfile: evidenceStabilization,
  });
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const artifact = buildSnapshot(decision);
  const validation = validateGovernanceSnapshotProfile(artifact);
  if (!validation.ok) {
    throw new Error(
      `governance snapshot validation failed: ${validation.errors.join("; ")}`
    );
  }
  if (artifact.kind !== GOVERNANCE_SNAPSHOT_PROFILE_KIND) {
    throw new Error("governance snapshot kind drifted");
  }
  if (artifact.version !== GOVERNANCE_SNAPSHOT_PROFILE_VERSION) {
    throw new Error("governance snapshot version drifted");
  }
  if (artifact.schema_id !== GOVERNANCE_SNAPSHOT_PROFILE_SCHEMA_ID) {
    throw new Error("governance snapshot schema drifted");
  }
  if (artifact.governance_snapshot.stage !== GOVERNANCE_SNAPSHOT_PROFILE_STAGE) {
    throw new Error("governance snapshot stage drifted");
  }
  if (
    artifact.governance_snapshot.consumer_surface !== GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE
  ) {
    throw new Error("governance snapshot consumer surface drifted");
  }
  if (artifact.governance_snapshot.boundary !== GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY) {
    throw new Error("governance snapshot boundary drifted");
  }
  const evidenceRef = artifact.governance_snapshot.evidence_ref;
  if (
    evidenceRef.kind !== GOVERNANCE_EVIDENCE_STABILIZATION_KIND ||
    evidenceRef.version !== GOVERNANCE_EVIDENCE_STABILIZATION_VERSION ||
    evidenceRef.stage !== GOVERNANCE_EVIDENCE_STABILIZATION_STAGE ||
    evidenceRef.boundary !== GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    throw new Error("governance snapshot evidence ref drifted");
  }
  const snapshotContract = artifact.governance_snapshot.snapshot_contract;
  if (
    snapshotContract.recommendation_only !== true ||
    snapshotContract.additive_only !== true ||
    snapshotContract.non_executing !== true ||
    snapshotContract.default_on !== false
  ) {
    throw new Error("governance snapshot contract drifted");
  }
  const explainabilityContract = artifact.governance_snapshot.explainability_contract;
  if (
    explainabilityContract.kind !== GOVERNANCE_EXPLAINABILITY_CONTRACT_KIND ||
    explainabilityContract.version !== GOVERNANCE_EXPLAINABILITY_CONTRACT_VERSION ||
    explainabilityContract.boundary !== GOVERNANCE_EXPLAINABILITY_CONTRACT_BOUNDARY ||
    explainabilityContract.explainability_available !== true ||
    explainabilityContract.descriptive_only !== true ||
    explainabilityContract.bounded_snapshot !== true
  ) {
    throw new Error("governance explainability contract drifted");
  }
  const rationaleContract = artifact.governance_snapshot.rationale_contract;
  if (
    rationaleContract.kind !== GOVERNANCE_RATIONALE_CONTRACT_KIND ||
    rationaleContract.version !== GOVERNANCE_RATIONALE_CONTRACT_VERSION ||
    rationaleContract.boundary !== GOVERNANCE_RATIONALE_CONTRACT_BOUNDARY ||
    rationaleContract.rationale_available !== true ||
    rationaleContract.descriptive_only !== true ||
    rationaleContract.canonical_rationale_preserved !== true
  ) {
    throw new Error("governance rationale contract drifted");
  }
  const semantics = artifact.governance_snapshot.preserved_semantics;
  if (
    semantics.evidence_semantics_preserved !== true ||
    semantics.policy_semantics_preserved !== true ||
    semantics.enforcement_semantics_preserved !== true ||
    semantics.approval_semantics_preserved !== true ||
    semantics.judgment_semantics_preserved !== true ||
    semantics.permit_gate_semantics_preserved !== true ||
    semantics.audit_output_preserved !== true ||
    semantics.audit_verdict_preserved !== true ||
    semantics.actual_exit_code_preserved !== true ||
    semantics.denied_exit_code_preserved !== 25 ||
    semantics.authority_scope !== "review_gate_deny_exit_recommendation_only" ||
    semantics.authority_scope_expansion !== false ||
    semantics.governance_object_addition !== false ||
    semantics.main_path_takeover !== false
  ) {
    throw new Error("governance snapshot preserved semantics drifted");
  }
}

if (!GOVERNANCE_SNAPSHOT_SURFACE_MAP.governance_snapshot) {
  throw new Error("governance snapshot surface entry missing");
}
if (!GOVERNANCE_SNAPSHOT_SURFACE_MAP.governance_snapshot_review_pack) {
  throw new Error("governance snapshot review pack surface entry missing");
}
if (!GOVERNANCE_SNAPSHOT_SURFACE_MAP.governance_snapshot_stabilization) {
  throw new Error("governance snapshot stabilization surface entry missing");
}
if (
  GOVERNANCE_SNAPSHOT_SURFACE_MAP.governance_snapshot.contract.kind !==
  GOVERNANCE_SNAPSHOT_PROFILE_KIND
) {
  throw new Error("governance snapshot surface contract kind drifted");
}
if (
  GOVERNANCE_SNAPSHOT_SURFACE_MAP.governance_snapshot_review_pack.contract.kind !==
  GOVERNANCE_RATIONALE_BUNDLE_KIND
) {
  throw new Error("governance snapshot review pack surface contract kind drifted");
}

for (const exportName of GOVERNANCE_SNAPSHOT_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance snapshot export missing from permit index: ${exportName}`
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

process.stdout.write("governance snapshot explainability verified\n");
