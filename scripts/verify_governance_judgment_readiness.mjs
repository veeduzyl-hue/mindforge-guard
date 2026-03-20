import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  buildPermitGateResult,
  buildGovernanceDecisionRecord,
  buildLimitedEnforcementAuthorityResult,
  JUDGMENT_CLASS_ALLOW,
  JUDGMENT_CLASS_DENY_RECOMMENDATION,
  JUDGMENT_CLASS_INSUFFICIENT_SIGNAL,
  JUDGMENT_CLASS_REVIEW_RECOMMENDATION,
  JUDGMENT_COMPATIBILITY_BOUNDARY,
  JUDGMENT_COMPATIBILITY_KIND,
  JUDGMENT_COMPATIBILITY_SCHEMA_ID,
  JUDGMENT_COMPATIBILITY_STAGE,
  JUDGMENT_COMPATIBILITY_STABLE_EXPORT_SET,
  JUDGMENT_COMPATIBILITY_VERSION,
  JUDGMENT_PROFILE_SOURCE_ORDER,
  JUDGMENT_READINESS_BOUNDARY,
  JUDGMENT_READINESS_CONSUMER_COMPATIBLE,
  JUDGMENT_READINESS_KIND,
  JUDGMENT_READINESS_LEVELS,
  JUDGMENT_READINESS_READY,
  JUDGMENT_READINESS_SCHEMA_ID,
  JUDGMENT_READINESS_SOURCE_ORDER,
  JUDGMENT_READINESS_STAGE,
  JUDGMENT_READINESS_STABLE_EXPORT_SET,
  JUDGMENT_READINESS_VERSION,
  buildJudgmentCompatibilityContract,
  buildJudgmentProfile,
  buildJudgmentReadinessProfile,
  validateJudgmentCompatibilityContract,
  validateJudgmentReadinessProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import { buildPolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:3333333333333333333333333333333333333333333333333333333333333333",
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
          head: "4444444444444444444444444444444444444444",
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

  return { profile, readiness, compatibility };
}

if (
  JSON.stringify(JUDGMENT_READINESS_LEVELS) !==
  JSON.stringify([JUDGMENT_READINESS_READY, JUDGMENT_READINESS_CONSUMER_COMPATIBLE])
) {
  throw new Error("judgment readiness levels drifted");
}
if (
  JSON.stringify(JUDGMENT_READINESS_SOURCE_ORDER) !==
  JSON.stringify(JUDGMENT_PROFILE_SOURCE_ORDER)
) {
  throw new Error("judgment readiness source order drifted");
}

const insufficient = buildArtifacts("insufficient_signal");
const allow = buildArtifacts("would_allow");
const review = buildArtifacts("would_review");
const deny = buildArtifacts("would_deny");

for (const artifactSet of [insufficient, allow, review, deny]) {
  const readinessValidation = validateJudgmentReadinessProfile(artifactSet.readiness);
  if (!readinessValidation.ok) {
    throw new Error(
      `judgment readiness validation failed: ${readinessValidation.errors.join("; ")}`
    );
  }
  const compatibilityValidation = validateJudgmentCompatibilityContract(
    artifactSet.compatibility
  );
  if (!compatibilityValidation.ok) {
    throw new Error(
      `judgment compatibility validation failed: ${compatibilityValidation.errors.join("; ")}`
    );
  }
  if (artifactSet.readiness.kind !== JUDGMENT_READINESS_KIND) {
    throw new Error("judgment readiness kind drifted");
  }
  if (artifactSet.readiness.version !== JUDGMENT_READINESS_VERSION) {
    throw new Error("judgment readiness version drifted");
  }
  if (artifactSet.readiness.schema_id !== JUDGMENT_READINESS_SCHEMA_ID) {
    throw new Error("judgment readiness schema id drifted");
  }
  if (
    artifactSet.readiness.judgment_readiness.stage !== JUDGMENT_READINESS_STAGE
  ) {
    throw new Error("judgment readiness stage drifted");
  }
  if (
    artifactSet.readiness.judgment_readiness.boundary !==
    JUDGMENT_READINESS_BOUNDARY
  ) {
    throw new Error("judgment readiness boundary drifted");
  }
  if (
    artifactSet.readiness.judgment_readiness.consumer_contract.readiness !==
    JUDGMENT_READINESS_CONSUMER_COMPATIBLE
  ) {
    throw new Error("judgment readiness consumer compatibility drifted");
  }
  if (
    artifactSet.compatibility.kind !== JUDGMENT_COMPATIBILITY_KIND ||
    artifactSet.compatibility.version !== JUDGMENT_COMPATIBILITY_VERSION ||
    artifactSet.compatibility.schema_id !== JUDGMENT_COMPATIBILITY_SCHEMA_ID
  ) {
    throw new Error("judgment compatibility contract identity drifted");
  }
  if (
    artifactSet.compatibility.judgment_compatibility.stage !==
    JUDGMENT_COMPATIBILITY_STAGE
  ) {
    throw new Error("judgment compatibility stage drifted");
  }
  if (
    artifactSet.compatibility.judgment_compatibility.boundary !==
    JUDGMENT_COMPATIBILITY_BOUNDARY
  ) {
    throw new Error("judgment compatibility boundary drifted");
  }
  if (
    JSON.stringify(artifactSet.compatibility.judgment_compatibility.source_order) !==
    JSON.stringify(JUDGMENT_PROFILE_SOURCE_ORDER)
  ) {
    throw new Error("judgment compatibility source order drifted");
  }
  const preservation =
    artifactSet.compatibility.judgment_compatibility.contract_preservation;
  if (
    preservation.recommendation_only !== true ||
    preservation.additive_only !== true ||
    preservation.permit_gate_semantics_preserved !== true ||
    preservation.enforcement_pilot_semantics_preserved !== true ||
    preservation.limited_authority_semantics_preserved !== true ||
    preservation.audit_output_preserved !== true ||
    preservation.audit_verdict_preserved !== true ||
    preservation.actual_exit_code_preserved !== true
  ) {
    throw new Error("judgment compatibility preservation contract drifted");
  }
  if (preservation.denied_exit_code_preserved !== 25) {
    throw new Error("judgment compatibility deny exit code drifted");
  }
  if (preservation.authority_scope !== "review_gate_deny_exit_recommendation_only") {
    throw new Error("judgment compatibility authority scope drifted");
  }
  if (preservation.governance_object_addition !== false) {
    throw new Error("judgment compatibility governance object boundary drifted");
  }
}

if (
  insufficient.readiness.judgment_readiness.signal.judgment_class !==
  JUDGMENT_CLASS_INSUFFICIENT_SIGNAL
) {
  throw new Error("judgment readiness insufficient signal mapping drifted");
}
if (
  allow.readiness.judgment_readiness.permit.judgment_class !==
  JUDGMENT_CLASS_ALLOW
) {
  throw new Error("judgment readiness allow mapping drifted");
}
if (
  review.readiness.judgment_readiness.limited_authority.judgment_class !==
  JUDGMENT_CLASS_REVIEW_RECOMMENDATION
) {
  throw new Error("judgment readiness review mapping drifted");
}
if (
  deny.readiness.judgment_readiness.limited_authority.judgment_class !==
  JUDGMENT_CLASS_DENY_RECOMMENDATION
) {
  throw new Error("judgment readiness deny mapping drifted");
}
if (
  deny.readiness.judgment_readiness.limited_authority.proposed_audit_exit_code !== 25
) {
  throw new Error("judgment readiness deny exit recommendation drifted");
}
if (
  review.readiness.judgment_readiness.limited_authority.current_audit_exit_code !== null
) {
  throw new Error("judgment readiness current audit exit preservation drifted");
}

for (const exportName of [
  ...JUDGMENT_READINESS_STABLE_EXPORT_SET,
  ...JUDGMENT_COMPATIBILITY_STABLE_EXPORT_SET,
]) {
  if (!(exportName in permitExports)) {
    throw new Error(`judgment readiness export missing from permit index: ${exportName}`);
  }
}

process.stdout.write("governance judgment readiness verified\n");
