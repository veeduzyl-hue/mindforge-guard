import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  APPROVAL_ARTIFACT_KIND,
  APPROVAL_SURFACE_MAP,
  buildPermitGateResult,
  buildGovernanceDecisionRecord,
  buildLimitedEnforcementAuthorityResult,
  JUDGMENT_CLASS_ALLOW,
  JUDGMENT_CLASS_DENY_RECOMMENDATION,
  JUDGMENT_CLASS_INSUFFICIENT_SIGNAL,
  JUDGMENT_CLASS_REVIEW_RECOMMENDATION,
  JUDGMENT_COMPATIBILITY_BOUNDARY,
  JUDGMENT_COMPATIBILITY_KIND,
  JUDGMENT_COMPATIBILITY_STAGE,
  JUDGMENT_COMPATIBILITY_VERSION,
  JUDGMENT_FINAL_ACCEPTANCE_BOUNDARY,
  JUDGMENT_FINAL_ACCEPTANCE_READY,
  JUDGMENT_PROFILE_SOURCE_ORDER,
  JUDGMENT_READINESS_CONSUMER_COMPATIBLE,
  JUDGMENT_READINESS_KIND,
  JUDGMENT_READINESS_STAGE,
  JUDGMENT_READINESS_VERSION,
  JUDGMENT_STABILIZATION_KIND,
  JUDGMENT_STABILIZATION_SCHEMA_ID,
  JUDGMENT_STABILIZATION_STAGE,
  JUDGMENT_STABILIZATION_STABLE_EXPORT_SET,
  JUDGMENT_STABILIZATION_VERSION,
  buildJudgmentCompatibilityContract,
  buildJudgmentProfile,
  buildJudgmentReadinessProfile,
  buildJudgmentStabilizationProfile,
  validateJudgmentStabilizationProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:5555555555555555555555555555555555555555555555555555555555555555",
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
          head: "6666666666666666666666666666666666666666",
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
  const profile = buildJudgmentProfile({
    policyPermitBridgeContract: bridge,
    permitGateResult: permit,
    governanceDecisionRecord: governance,
    limitedEnforcementAuthorityResult: authority,
  });
  const readiness = buildJudgmentReadinessProfile({ judgmentProfile: profile });
  const compatibility = buildJudgmentCompatibilityContract({
    judgmentProfile: profile,
    judgmentReadinessProfile: readiness,
  });
  const stabilization = buildJudgmentStabilizationProfile({
    judgmentProfile: profile,
    judgmentReadinessProfile: readiness,
    judgmentCompatibilityContract: compatibility,
  });

  return { profile, readiness, compatibility, stabilization };
}

const insufficient = buildArtifacts("insufficient_signal");
const allow = buildArtifacts("would_allow");
const review = buildArtifacts("would_review");
const deny = buildArtifacts("would_deny");

for (const artifactSet of [insufficient, allow, review, deny]) {
  const validation = validateJudgmentStabilizationProfile(
    artifactSet.stabilization
  );
  if (!validation.ok) {
    throw new Error(
      `judgment stabilization validation failed: ${validation.errors.join("; ")}`
    );
  }
  if (artifactSet.stabilization.kind !== JUDGMENT_STABILIZATION_KIND) {
    throw new Error("judgment stabilization kind drifted");
  }
  if (artifactSet.stabilization.version !== JUDGMENT_STABILIZATION_VERSION) {
    throw new Error("judgment stabilization version drifted");
  }
  if (artifactSet.stabilization.schema_id !== JUDGMENT_STABILIZATION_SCHEMA_ID) {
    throw new Error("judgment stabilization schema id drifted");
  }
  if (
    artifactSet.stabilization.judgment_stabilization.stage !==
    JUDGMENT_STABILIZATION_STAGE
  ) {
    throw new Error("judgment stabilization stage drifted");
  }
  if (
    artifactSet.stabilization.judgment_stabilization.boundary !==
    JUDGMENT_FINAL_ACCEPTANCE_BOUNDARY
  ) {
    throw new Error("judgment stabilization boundary drifted");
  }
  if (
    JSON.stringify(artifactSet.stabilization.judgment_stabilization.source_order) !==
    JSON.stringify(JUDGMENT_PROFILE_SOURCE_ORDER)
  ) {
    throw new Error("judgment stabilization source order drifted");
  }

  const refs = artifactSet.stabilization.judgment_stabilization.contract_refs;
  if (
    refs.judgment_readiness_kind !== JUDGMENT_READINESS_KIND ||
    refs.judgment_readiness_version !== JUDGMENT_READINESS_VERSION ||
    refs.judgment_readiness_stage !== JUDGMENT_READINESS_STAGE
  ) {
    throw new Error("judgment stabilization readiness refs drifted");
  }
  if (
    refs.judgment_compatibility_kind !== JUDGMENT_COMPATIBILITY_KIND ||
    refs.judgment_compatibility_version !== JUDGMENT_COMPATIBILITY_VERSION ||
    refs.judgment_compatibility_stage !== JUDGMENT_COMPATIBILITY_STAGE ||
    refs.judgment_compatibility_boundary !== JUDGMENT_COMPATIBILITY_BOUNDARY
  ) {
    throw new Error("judgment stabilization compatibility refs drifted");
  }

  const finalContract =
    artifactSet.stabilization.judgment_stabilization.final_consumer_contract;
  if (finalContract.acceptance_level !== JUDGMENT_FINAL_ACCEPTANCE_READY) {
    throw new Error("judgment stabilization acceptance level drifted");
  }
  if (
    finalContract.recommendation_only !== true ||
    finalContract.additive_only !== true ||
    finalContract.audit_output_preserved !== true ||
    finalContract.audit_verdict_preserved !== true ||
    finalContract.actual_exit_code_preserved !== true
  ) {
    throw new Error("judgment stabilization final contract drifted");
  }
  if (finalContract.denied_exit_code_preserved !== 25) {
    throw new Error("judgment stabilization deny exit code drifted");
  }
  if (
    finalContract.authority_scope !==
    "review_gate_deny_exit_recommendation_only"
  ) {
    throw new Error("judgment stabilization authority scope drifted");
  }
  if (finalContract.governance_object_addition !== false) {
    throw new Error("judgment stabilization governance object boundary drifted");
  }

  const semantics =
    artifactSet.stabilization.judgment_stabilization.preserved_semantics;
  if (
    semantics.permit_gate_semantics_preserved !== true ||
    semantics.enforcement_pilot_semantics_preserved !== true ||
    semantics.limited_authority_semantics_preserved !== true ||
    semantics.judgment_mapping_stable !== true ||
    semantics.consumer_contract_ready !== true
  ) {
    throw new Error("judgment stabilization preserved semantics drifted");
  }

  if (
    artifactSet.readiness.judgment_readiness.consumer_contract.readiness !==
    JUDGMENT_READINESS_CONSUMER_COMPATIBLE
  ) {
    throw new Error("judgment stabilization consumer readiness prerequisite drifted");
  }
}

if (
  insufficient.profile.judgment_profile.unified_judgment.class !==
  JUDGMENT_CLASS_INSUFFICIENT_SIGNAL
) {
  throw new Error("judgment stabilization insufficient signal mapping drifted");
}
if (allow.profile.judgment_profile.unified_judgment.class !== JUDGMENT_CLASS_ALLOW) {
  throw new Error("judgment stabilization allow mapping drifted");
}
if (
  review.profile.judgment_profile.unified_judgment.class !==
  JUDGMENT_CLASS_REVIEW_RECOMMENDATION
) {
  throw new Error("judgment stabilization review mapping drifted");
}
if (
  deny.profile.judgment_profile.unified_judgment.class !==
  JUDGMENT_CLASS_DENY_RECOMMENDATION
) {
  throw new Error("judgment stabilization deny mapping drifted");
}
if (
  deny.profile.judgment_profile.limited_authority.proposed_audit_exit_code !== 25
) {
  throw new Error("judgment stabilization deny recommendation exit code drifted");
}
if (
  review.profile.judgment_profile.limited_authority.current_audit_exit_code !== null
) {
  throw new Error("judgment stabilization current audit exit preservation drifted");
}

if (APPROVAL_SURFACE_MAP.approval_artifact.contract.kind !== APPROVAL_ARTIFACT_KIND) {
  throw new Error("approval artifact surface contract drifted");
}

for (const exportName of JUDGMENT_STABILIZATION_STABLE_EXPORT_SET) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `judgment stabilization export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("governance judgment stabilization verified\n");
