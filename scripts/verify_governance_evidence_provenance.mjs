import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  GOVERNANCE_EVIDENCE_CONSUMER_SURFACE,
  GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY,
  GOVERNANCE_EVIDENCE_PROFILE_KIND,
  GOVERNANCE_EVIDENCE_PROFILE_SCHEMA_ID,
  GOVERNANCE_EVIDENCE_PROFILE_STAGE,
  GOVERNANCE_EVIDENCE_PROFILE_VERSION,
  GOVERNANCE_EVIDENCE_STABLE_EXPORT_SET,
  GOVERNANCE_EVIDENCE_SURFACE_MAP,
  GOVERNANCE_EVIDENCE_SURFACE_STABLE_EXPORT_SET,
  GOVERNANCE_LINEAGE_CONTRACT_BOUNDARY,
  GOVERNANCE_LINEAGE_CONTRACT_KIND,
  GOVERNANCE_LINEAGE_CONTRACT_VERSION,
  GOVERNANCE_PROVENANCE_CONTRACT_BOUNDARY,
  GOVERNANCE_PROVENANCE_CONTRACT_KIND,
  GOVERNANCE_PROVENANCE_CONTRACT_VERSION,
  POLICY_CONSUMER_SURFACE,
  POLICY_FINAL_ACCEPTANCE_BOUNDARY,
  POLICY_STABILIZATION_KIND,
  POLICY_STABILIZATION_STAGE,
  POLICY_STABILIZATION_VERSION,
  buildApprovalArtifactProfile,
  buildApprovalReadinessProfile,
  buildApprovalReceiptProfile,
  buildApprovalStabilizationProfile,
  buildEnforcementCompatibilityProfile,
  buildEnforcementReadinessProfile,
  buildEnforcementStabilizationProfile,
  buildGovernanceDecisionRecord,
  buildGovernanceEvidenceProfile,
  buildJudgmentCompatibilityContract,
  buildJudgmentProfile,
  buildJudgmentReadinessProfile,
  buildJudgmentStabilizationProfile,
  buildLimitedEnforcementAuthorityResult,
  buildPermitGateResult,
  buildPolicyCompatibilityProfile,
  buildPolicyProfile,
  buildPolicyStabilizationProfile,
  validateGovernanceEvidenceProfile,
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

function buildEvidence(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: { head: "9999999999999999999999999999999999999999", branch: "branch" },
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

  return buildGovernanceEvidenceProfile({
    policyStabilizationProfile: policyStabilization,
  });
}

for (const decision of [
  "insufficient_signal",
  "would_allow",
  "would_review",
  "would_deny",
]) {
  const artifact = buildEvidence(decision);
  const validation = validateGovernanceEvidenceProfile(artifact);
  if (!validation.ok) {
    throw new Error(
      `governance evidence validation failed: ${validation.errors.join("; ")}`
    );
  }
  if (artifact.kind !== GOVERNANCE_EVIDENCE_PROFILE_KIND) {
    throw new Error("governance evidence kind drifted");
  }
  if (artifact.version !== GOVERNANCE_EVIDENCE_PROFILE_VERSION) {
    throw new Error("governance evidence version drifted");
  }
  if (artifact.schema_id !== GOVERNANCE_EVIDENCE_PROFILE_SCHEMA_ID) {
    throw new Error("governance evidence schema drifted");
  }
  if (
    artifact.governance_evidence.stage !== GOVERNANCE_EVIDENCE_PROFILE_STAGE
  ) {
    throw new Error("governance evidence stage drifted");
  }
  if (
    artifact.governance_evidence.consumer_surface !==
    GOVERNANCE_EVIDENCE_CONSUMER_SURFACE
  ) {
    throw new Error("governance evidence consumer surface drifted");
  }
  if (
    artifact.governance_evidence.boundary !== GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY
  ) {
    throw new Error("governance evidence boundary drifted");
  }
  const ref = artifact.governance_evidence.policy_ref;
  if (
    ref.kind !== POLICY_STABILIZATION_KIND ||
    ref.version !== POLICY_STABILIZATION_VERSION ||
    ref.stage !== POLICY_STABILIZATION_STAGE ||
    ref.boundary !== POLICY_FINAL_ACCEPTANCE_BOUNDARY ||
    ref.source_surface !== POLICY_CONSUMER_SURFACE
  ) {
    throw new Error("governance evidence policy ref drifted");
  }
  const evidenceContract = artifact.governance_evidence.evidence_contract;
  if (
    evidenceContract.recommendation_only !== true ||
    evidenceContract.additive_only !== true ||
    evidenceContract.non_executing !== true ||
    evidenceContract.default_on !== false
  ) {
    throw new Error("governance evidence contract drifted");
  }
  const provenance = artifact.governance_evidence.provenance_contract;
  if (
    provenance.kind !== GOVERNANCE_PROVENANCE_CONTRACT_KIND ||
    provenance.version !== GOVERNANCE_PROVENANCE_CONTRACT_VERSION ||
    provenance.boundary !== GOVERNANCE_PROVENANCE_CONTRACT_BOUNDARY ||
    provenance.provenance_preserved !== true ||
    provenance.source_profile_kind !== POLICY_STABILIZATION_KIND ||
    provenance.canonical_lineage_preserved !== true
  ) {
    throw new Error("governance provenance contract drifted");
  }
  const lineage = artifact.governance_evidence.lineage_contract;
  if (
    lineage.kind !== GOVERNANCE_LINEAGE_CONTRACT_KIND ||
    lineage.version !== GOVERNANCE_LINEAGE_CONTRACT_VERSION ||
    lineage.boundary !== GOVERNANCE_LINEAGE_CONTRACT_BOUNDARY ||
    lineage.bounded_lineage !== true ||
    lineage.authority_scope !== "review_gate_deny_exit_recommendation_only" ||
    lineage.authority_scope_expansion !== false
  ) {
    throw new Error("governance lineage contract drifted");
  }
  const semantics = artifact.governance_evidence.preserved_semantics;
  if (
    semantics.policy_semantics_preserved !== true ||
    semantics.enforcement_semantics_preserved !== true ||
    semantics.approval_semantics_preserved !== true ||
    semantics.judgment_semantics_preserved !== true ||
    semantics.permit_gate_semantics_preserved !== true ||
    semantics.audit_output_preserved !== true ||
    semantics.audit_verdict_preserved !== true ||
    semantics.actual_exit_code_preserved !== true ||
    semantics.denied_exit_code_preserved !== 25 ||
    semantics.governance_object_addition !== false ||
    semantics.main_path_takeover !== false
  ) {
    throw new Error("governance evidence preserved semantics drifted");
  }
}

if (!GOVERNANCE_EVIDENCE_SURFACE_MAP.governance_evidence) {
  throw new Error("governance evidence surface entry missing");
}
if (
  GOVERNANCE_EVIDENCE_SURFACE_MAP.governance_evidence.contract.kind !==
  GOVERNANCE_EVIDENCE_PROFILE_KIND
) {
  throw new Error("governance evidence surface contract kind drifted");
}

for (const exportName of GOVERNANCE_EVIDENCE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance evidence export missing from permit index: ${exportName}`
    );
  }
}
for (const exportName of GOVERNANCE_EVIDENCE_SURFACE_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `governance evidence surface export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance evidence provenance verified\n");
