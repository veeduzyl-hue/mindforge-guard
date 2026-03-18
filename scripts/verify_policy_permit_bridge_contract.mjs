import {
  POLICY_PERMIT_BRIDGE_KIND,
  POLICY_PERMIT_BRIDGE_VERSION,
  POLICY_PERMIT_BRIDGE_SCHEMA_ID,
  POLICY_PERMIT_BRIDGE_PRODUCER_SURFACE,
  POLICY_PERMIT_BRIDGE_NORMALIZATION,
  buildPolicyPermitBridgeContract,
  validatePolicyPermitBridgeContract,
} from "../packages/guard/src/runtime/governance/bridge/index.mjs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const artifact = buildPolicyPermitBridgeContract({
  canonicalActionArtifact: {
    canonical_action_hash: "sha256:1111111111111111111111111111111111111111111111111111111111111111",
    action: { action_class: "file.write" },
  },
  policyPreviewArtifact: {
    policy_preview: { preview_verdict: "review" },
  },
  permitPrecheckArtifact: {
    permit_precheck: { decision: "review" },
  },
  executionBridgeArtifact: {
    execution_bridge: { bridge_verdict: "review" },
  },
  executionReadinessArtifact: {
    execution_readiness: { readiness: "not_ready" },
  },
  enforcementAdjacentDecisionArtifact: {
    enforcement_adjacent_decision: {
      decision: "would_review",
      reasons: [{ kind: "rule", message: "policy preview requires review", rule_id: "rule.preview.review" }],
    },
  },
});

const valid = validatePolicyPermitBridgeContract(artifact);
assert(valid.ok, `expected valid bridge contract, got: ${valid.errors.join("; ")}`);
assert(artifact.kind === POLICY_PERMIT_BRIDGE_KIND, "bridge kind mismatch");
assert(artifact.version === POLICY_PERMIT_BRIDGE_VERSION, "bridge version mismatch");
assert(artifact.schema_id === POLICY_PERMIT_BRIDGE_SCHEMA_ID, "bridge schema_id mismatch");
assert(artifact.producer?.surface === POLICY_PERMIT_BRIDGE_PRODUCER_SURFACE, "bridge producer surface mismatch");
assert(
  artifact.producer?.normalization === POLICY_PERMIT_BRIDGE_NORMALIZATION,
  "bridge normalization metadata mismatch"
);

const missingSchemaId = clone(artifact);
delete missingSchemaId.schema_id;
const missingSchemaIdValidation = validatePolicyPermitBridgeContract(missingSchemaId);
assert(
  !missingSchemaIdValidation.ok && missingSchemaIdValidation.errors.some((error) => error.includes("schema_id")),
  "bridge validator should reject missing schema_id"
);

const wrongVersion = clone(artifact);
wrongVersion.version = "v2";
const wrongVersionValidation = validatePolicyPermitBridgeContract(wrongVersion);
assert(
  !wrongVersionValidation.ok && wrongVersionValidation.errors.some((error) => error.includes("version")),
  "bridge validator should reject wrong version"
);

const wrongNormalization = clone(artifact);
wrongNormalization.producer.normalization = "unstable";
const wrongNormalizationValidation = validatePolicyPermitBridgeContract(wrongNormalization);
assert(
  !wrongNormalizationValidation.ok &&
    wrongNormalizationValidation.errors.some((error) => error.includes("producer.normalization")),
  "bridge validator should reject wrong normalization metadata"
);

const extraPayloadField = clone(artifact);
extraPayloadField.policy_permit_bridge.unexpected = true;
const extraPayloadValidation = validatePolicyPermitBridgeContract(extraPayloadField);
assert(
  !extraPayloadValidation.ok &&
    extraPayloadValidation.errors.some((error) => error.includes("policy_permit_bridge.unexpected")),
  "bridge validator should reject unexpected payload fields"
);

process.stdout.write("policy-to-permit bridge contract verified\n");
