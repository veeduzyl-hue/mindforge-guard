import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  buildPermitGateResult,
  buildGovernanceDecisionRecord,
  buildLimitedEnforcementAuthorityResult,
  JUDGMENT_PROFILE_KIND,
  JUDGMENT_PROFILE_VERSION,
  JUDGMENT_PROFILE_SCHEMA_ID,
  JUDGMENT_PROFILE_STAGE,
  JUDGMENT_PROFILE_CONSUMER_SURFACE,
  JUDGMENT_PROFILE_BOUNDARY,
  JUDGMENT_PROFILE_SOURCE_ORDER,
  JUDGMENT_CLASS_INSUFFICIENT_SIGNAL,
  JUDGMENT_CLASS_ALLOW,
  JUDGMENT_CLASS_REVIEW_RECOMMENDATION,
  JUDGMENT_CLASS_DENY_RECOMMENDATION,
  JUDGMENT_PROFILE_STABLE_EXPORT_SET,
  JUDGMENT_SURFACE_STABILITY,
  JUDGMENT_SURFACE_CONSUMER_TIER,
  JUDGMENT_SURFACE_ARTIFACT_ORDER,
  JUDGMENT_SURFACE_MAP,
  JUDGMENT_SURFACE_STABLE_EXPORT_SET,
  assertValidJudgmentSurface,
  buildJudgmentProfile,
  validateJudgmentProfile,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";
import {
  POLICY_PERMIT_BRIDGE_PRODUCER_SURFACE,
  buildPolicyPermitBridgeContract,
} from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function buildBridge(decision) {
  return buildPolicyPermitBridgeContract({
    canonicalActionArtifact: {
      canonical_action_hash:
        "sha256:1111111111111111111111111111111111111111111111111111111111111111",
      action: { action_class: "file.write" },
    },
    policyPreviewArtifact: {
      policy_preview: { preview_verdict: decision === "would_deny" ? "review" : "allow" },
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

function buildProfile(decision) {
  const bridge = buildBridge(decision);
  const permit = buildPermitGateResult({ policyPermitBridgeContract: bridge });
  const governance = buildGovernanceDecisionRecord({
    audit: {
      run: {
        run_id: "run",
        mode: "local",
        git: {
          head: "2222222222222222222222222222222222222222",
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

  return buildJudgmentProfile({
    policyPermitBridgeContract: bridge,
    permitGateResult: permit,
    governanceDecisionRecord: governance,
    limitedEnforcementAuthorityResult: authority,
  });
}

assertValidJudgmentSurface();

if (JUDGMENT_SURFACE_STABILITY !== "stable") {
  throw new Error("judgment surface stability drifted");
}
if (JUDGMENT_SURFACE_CONSUMER_TIER !== "consumer_judgment_surface") {
  throw new Error("judgment surface consumer tier drifted");
}
if (JSON.stringify(JUDGMENT_SURFACE_ARTIFACT_ORDER) !== JSON.stringify(["judgment_profile"])) {
  throw new Error("judgment surface artifact order drifted");
}
if (JUDGMENT_SURFACE_MAP.judgment_profile.consumer_surface !== JUDGMENT_PROFILE_CONSUMER_SURFACE) {
  throw new Error("judgment profile surface consumer surface drifted");
}
if (
  JUDGMENT_SURFACE_MAP.judgment_profile.contract.kind !== JUDGMENT_PROFILE_KIND ||
  JUDGMENT_SURFACE_MAP.judgment_profile.contract.version !== JUDGMENT_PROFILE_VERSION ||
  JUDGMENT_SURFACE_MAP.judgment_profile.contract.schema_id !== JUDGMENT_PROFILE_SCHEMA_ID
) {
  throw new Error("judgment profile surface contract identity drifted");
}
if (JSON.stringify(JUDGMENT_SURFACE_MAP.judgment_profile.source_order) !== JSON.stringify(JUDGMENT_PROFILE_SOURCE_ORDER)) {
  throw new Error("judgment profile source order drifted");
}

const insufficient = buildProfile("insufficient_signal");
const allow = buildProfile("would_allow");
const review = buildProfile("would_review");
const deny = buildProfile("would_deny");

for (const profile of [insufficient, allow, review, deny]) {
  const validation = validateJudgmentProfile(profile);
  if (!validation.ok) {
    throw new Error(`judgment profile validation failed: ${validation.errors.join("; ")}`);
  }
  if (profile.kind !== JUDGMENT_PROFILE_KIND) {
    throw new Error("judgment profile kind drifted");
  }
  if (profile.version !== JUDGMENT_PROFILE_VERSION) {
    throw new Error("judgment profile version drifted");
  }
  if (profile.schema_id !== JUDGMENT_PROFILE_SCHEMA_ID) {
    throw new Error("judgment profile schema id drifted");
  }
  if (profile.judgment_profile.stage !== JUDGMENT_PROFILE_STAGE) {
    throw new Error("judgment profile stage drifted");
  }
  if (profile.judgment_profile.consumer_surface !== JUDGMENT_PROFILE_CONSUMER_SURFACE) {
    throw new Error("judgment profile consumer surface drifted");
  }
  if (profile.judgment_profile.boundary !== JUDGMENT_PROFILE_BOUNDARY) {
    throw new Error("judgment profile boundary drifted");
  }
  if (profile.judgment_profile.signal.producer_surface !== POLICY_PERMIT_BRIDGE_PRODUCER_SURFACE) {
    throw new Error("judgment profile signal producer surface drifted");
  }
  if (profile.judgment_profile.limited_authority.current_audit_exit_code !== null) {
    throw new Error("judgment profile limited authority current exit code drifted");
  }
  if (profile.judgment_profile.unified_judgment.recommendation_only !== true) {
    throw new Error("judgment profile must remain recommendation-only");
  }
  if (profile.judgment_profile.unified_judgment.audit_output_preserved !== true) {
    throw new Error("judgment profile must preserve audit output");
  }
  if (profile.judgment_profile.unified_judgment.audit_verdict_preserved !== true) {
    throw new Error("judgment profile must preserve audit verdict");
  }
  if (profile.judgment_profile.unified_judgment.actual_exit_code_preserved !== true) {
    throw new Error("judgment profile must preserve actual exit code");
  }
}

if (insufficient.judgment_profile.unified_judgment.class !== JUDGMENT_CLASS_INSUFFICIENT_SIGNAL) {
  throw new Error("judgment profile insufficient signal mapping drifted");
}
if (allow.judgment_profile.unified_judgment.class !== JUDGMENT_CLASS_ALLOW) {
  throw new Error("judgment profile allow mapping drifted");
}
if (review.judgment_profile.unified_judgment.class !== JUDGMENT_CLASS_REVIEW_RECOMMENDATION) {
  throw new Error("judgment profile review mapping drifted");
}
if (deny.judgment_profile.unified_judgment.class !== JUDGMENT_CLASS_DENY_RECOMMENDATION) {
  throw new Error("judgment profile deny mapping drifted");
}
if (deny.judgment_profile.limited_authority.proposed_audit_exit_code !== 25) {
  throw new Error("judgment profile deny recommendation exit code drifted");
}
if (review.judgment_profile.limited_authority.proposed_audit_exit_code !== null) {
  throw new Error("judgment profile review recommendation exit code drifted");
}

for (const exportName of [
  ...JUDGMENT_PROFILE_STABLE_EXPORT_SET,
  ...JUDGMENT_SURFACE_STABLE_EXPORT_SET,
]) {
  if (!(exportName in permitExports)) {
    throw new Error(`judgment profile export missing from permit index: ${exportName}`);
  }
}

process.stdout.write("governance judgment profile verified\n");
