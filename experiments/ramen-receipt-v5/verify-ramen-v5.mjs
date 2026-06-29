import crypto from "node:crypto";

export const RAMEN_V5_BASELINE_SHA = "db8d7f46275f477286f1bae0c5869cb7f08fe49a";
export const RAMEN_V5_NON_AUTHORITY_STATEMENT =
  "This record is external receipt evidence only. It does not approve, block, deploy, certify, or control execution.";

const REQUIRED_PAYLOAD_FIELDS = [
  "schema_version",
  "kid",
  "id",
  "timestamp",
  "policy_ids",
  "payload_hash",
  "verdict",
  "reasoning",
  "steering",
  "statutory_anchors",
];

function sha256Hex(input) {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

function decodeBase64Url(value) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }

  const padding = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/") + padding;

  try {
    return Buffer.from(normalized, "base64");
  } catch {
    return null;
  }
}

function arraysEqual(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
    return false;
  }

  return left.every((entry, index) => entry === right[index]);
}

function cloneFailure(code, message) {
  return { code, message };
}

function cloneWarning(code, message) {
  return { code, message };
}

function deriveDecisionFromPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (payload.verdict === 0) {
    return "block";
  }

  if (payload.verdict === 1 && typeof payload.steering === "string" && payload.steering.length >= 1) {
    return "steered_allow";
  }

  if (payload.verdict === 1) {
    return "allow";
  }

  return null;
}

function deriveDecisionFromResponse(data) {
  if (!data || typeof data !== "object" || typeof data.allowed !== "boolean") {
    return null;
  }

  if (data.allowed === false) {
    return "block";
  }

  const instruction = data?.results?.find?.(
    (entry) => entry && typeof entry === "object" && typeof entry.instruction === "string" && entry.instruction.length >= 1
  );

  return instruction ? "steered_allow" : "allow";
}

function resolveTrustedKey(trustedKeys, kid) {
  const entry = trustedKeys?.[kid];
  if (!entry) {
    return null;
  }

  if (typeof entry === "string") {
    return {
      spki_der_base64: entry,
      trust_status: "unknown",
    };
  }

  if (typeof entry === "object" && entry !== null && typeof entry.spki_der_base64 === "string") {
    return {
      spki_der_base64: entry.spki_der_base64,
      trust_status: entry.trust_status ?? "unknown",
    };
  }

  return null;
}

function buildInitialResult() {
  return {
    profile: "ramen-receipt-v5",
    baseline_sha: RAMEN_V5_BASELINE_SHA,
    valid: false,
    cryptographic_assurance: "failed",
    decision: null,
    receipt_id: null,
    timestamp: null,
    payload_hash: null,
    policy_ids: [],
    findings: {
      schema_valid: false,
      signature_valid: false,
      input_binding_valid: false,
      envelope_consistent: false,
      response_verdict_consistent: false,
      response_policy_ids_consistent: false,
      response_executed_at_consistent: false,
      policy_uuid_binding_valid: false,
      verdict_binding_valid: false,
      reasoning_binding_valid: false,
      steering_binding_valid: false,
      statutory_anchor_binding_valid: false,
      key_trust_status: "unknown",
      policy_content_immutability: "not_provided",
      execution_binding: "not_provided",
      legal_applicability: "not_verified",
    },
    failures: [],
    warnings: [],
  };
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function validatePayloadShape(payload) {
  if (!isPlainObject(payload)) {
    return false;
  }

  const keys = Object.keys(payload);
  if (keys.length !== REQUIRED_PAYLOAD_FIELDS.length) {
    return false;
  }

  for (const field of REQUIRED_PAYLOAD_FIELDS) {
    if (!(field in payload)) {
      return false;
    }
  }

  return (
    payload.schema_version === "5.0" &&
    typeof payload.kid === "string" &&
    typeof payload.id === "string" &&
    typeof payload.timestamp === "string" &&
    isStringArray(payload.policy_ids) &&
    typeof payload.payload_hash === "string" &&
    /^[0-9a-f]{64}$/.test(payload.payload_hash) &&
    (payload.verdict === 0 || payload.verdict === 1) &&
    typeof payload.reasoning === "string" &&
    typeof payload.steering === "string" &&
    isStringArray(payload.statutory_anchors)
  );
}

export function verifyRamenReceiptV5({ originalInput, response, trustedKeys }) {
  const result = buildInitialResult();

  if (typeof originalInput !== "string") {
    result.failures.push(cloneFailure("invalid_original_input", "originalInput must be a UTF-8 string"));
    return result;
  }

  if (!isPlainObject(response?.data)) {
    result.failures.push(cloneFailure("missing_response_data", "response.data must be present"));
    return result;
  }

  const data = response.data;
  result.decision = deriveDecisionFromResponse(data);
  result.timestamp = typeof data.executed_at === "string" ? data.executed_at : null;
  result.policy_ids = Array.isArray(data.policy_ids) ? [...data.policy_ids] : [];

  if (typeof data.receipt_alert === "string" && isPlainObject(data.receipt)) {
    result.warnings.push(
      cloneWarning("receipt_alert_receipt_conflict", "both receipt_alert and receipt are present; treating cryptographic assurance as absent")
    );
  }

  if (typeof data.receipt_alert === "string" || !isPlainObject(data.receipt)) {
    result.cryptographic_assurance = "absent";

    if (typeof data.receipt_alert === "string") {
      result.warnings.push(
        cloneWarning("receipt_alert_present", "receipt_alert present: evaluation verdict is unsigned / unverifiable")
      );
    }

    if (!isPlainObject(data.receipt)) {
      result.warnings.push(cloneWarning("receipt_absent", "receipt object is absent"));
    }

    return result;
  }

  const receipt = data.receipt;
  result.receipt_id = typeof receipt.id === "string" ? receipt.id : null;

  if (
    typeof receipt.id !== "string" ||
    typeof receipt.schema_version !== "string" ||
    typeof receipt.kid !== "string" ||
    typeof receipt.signature !== "string" ||
    typeof receipt.canonical_payload !== "string"
  ) {
    result.failures.push(cloneFailure("invalid_receipt_shape", "receipt must expose id, schema_version, kid, signature, canonical_payload"));
    return result;
  }

  const trustedKey = resolveTrustedKey(trustedKeys, receipt.kid);
  if (!trustedKey) {
    result.failures.push(cloneFailure("unknown_kid", `Unknown kid: ${receipt.kid}`));
    return result;
  }

  result.findings.key_trust_status = trustedKey.trust_status;

  const signatureBuffer = decodeBase64Url(receipt.signature);
  if (!signatureBuffer) {
    result.failures.push(cloneFailure("invalid_signature_encoding", "signature must be base64url Ed25519 bytes"));
    return result;
  }

  let keyObject;
  try {
    keyObject = crypto.createPublicKey({
      key: Buffer.from(trustedKey.spki_der_base64, "base64"),
      format: "der",
      type: "spki",
    });
  } catch (error) {
    result.failures.push(cloneFailure("invalid_public_key", `unable to import SPKI public key: ${error.message}`));
    return result;
  }

  try {
    result.findings.signature_valid = crypto.verify(
      null,
      Buffer.from(receipt.canonical_payload, "utf8"),
      keyObject,
      signatureBuffer
    );
  } catch (error) {
    result.failures.push(cloneFailure("signature_verify_error", `crypto.verify failed: ${error.message}`));
    return result;
  }

  let payload;
  try {
    payload = JSON.parse(receipt.canonical_payload);
  } catch (error) {
    result.failures.push(cloneFailure("invalid_canonical_payload_json", `canonical_payload is not valid JSON: ${error.message}`));
    return result;
  }

  result.decision = deriveDecisionFromPayload(payload) ?? result.decision;
  result.timestamp = typeof payload.timestamp === "string" ? payload.timestamp : result.timestamp;
  result.payload_hash = typeof payload.payload_hash === "string" ? payload.payload_hash : null;
  result.policy_ids = Array.isArray(payload.policy_ids) ? [...payload.policy_ids] : result.policy_ids;

  const missingPayloadFields = REQUIRED_PAYLOAD_FIELDS.filter((field) => !(field in payload));
  if (missingPayloadFields.length >= 1) {
    result.failures.push(
      cloneFailure("missing_required_payload_field", `canonical_payload missing required field(s): ${missingPayloadFields.join(", ")}`)
    );
  }

  if (payload.schema_version !== "5.0") {
    result.failures.push(
      cloneFailure("unsupported_schema_version", `unsupported payload schema_version: ${String(payload.schema_version)}`)
    );
  }

  if (!(payload.verdict === 0 || payload.verdict === 1)) {
    result.failures.push(
      cloneFailure("invalid_verdict", `payload verdict must be 0 or 1; received ${String(payload.verdict)}`)
    );
  }

  result.findings.schema_valid = validatePayloadShape(payload);
  result.findings.envelope_consistent =
    receipt.id === payload.id &&
    receipt.kid === payload.kid &&
    receipt.schema_version === payload.schema_version;
  result.findings.input_binding_valid = payload.payload_hash === sha256Hex(originalInput);
  result.findings.response_verdict_consistent = typeof data.allowed === "boolean" && data.allowed === (payload.verdict === 1);
  result.findings.response_policy_ids_consistent = arraysEqual(data.policy_ids, payload.policy_ids);
  result.findings.response_executed_at_consistent =
    typeof data.executed_at === "string" && data.executed_at === payload.timestamp;
  result.findings.policy_uuid_binding_valid =
    isStringArray(payload.policy_ids) && result.findings.response_policy_ids_consistent;
  result.findings.verdict_binding_valid =
    (payload.verdict === 0 || payload.verdict === 1) && result.findings.response_verdict_consistent;
  result.findings.reasoning_binding_valid = typeof payload.reasoning === "string";
  result.findings.steering_binding_valid = typeof payload.steering === "string";
  result.findings.statutory_anchor_binding_valid = isStringArray(payload.statutory_anchors);

  if (!result.findings.signature_valid) {
    result.failures.push(
      cloneFailure("signature_invalid", "Signature does not verify over canonical_payload")
    );
  }

  if (!result.findings.schema_valid) {
    result.failures.push(cloneFailure("schema_invalid", "canonical_payload does not satisfy the V5 shape contract"));
  }

  if (!result.findings.envelope_consistent) {
    result.failures.push(
      cloneFailure("envelope_mismatch", "receipt envelope fields do not match signed canonical_payload")
    );
  }

  if (!result.findings.input_binding_valid) {
    result.failures.push(
      cloneFailure("input_binding_invalid", "payload_hash does not match SHA-256 of the provided input")
    );
  }

  if (!result.findings.response_verdict_consistent) {
    result.failures.push(
      cloneFailure("response_verdict_mismatch", "response.data.allowed does not match signed payload verdict")
    );
  }

  if (!result.findings.response_policy_ids_consistent) {
    result.failures.push(
      cloneFailure("response_policy_ids_mismatch", "response.data.policy_ids does not match signed payload policy_ids")
    );
  }

  if (!result.findings.response_executed_at_consistent) {
    result.failures.push(
      cloneFailure("response_executed_at_mismatch", "response.data.executed_at does not match signed payload timestamp")
    );
  }

  result.cryptographic_assurance =
    result.findings.signature_valid && result.findings.input_binding_valid ? "verified" : "failed";

  result.valid =
    result.findings.schema_valid &&
    result.findings.signature_valid &&
    result.findings.input_binding_valid &&
    result.findings.envelope_consistent &&
    result.findings.response_verdict_consistent &&
    result.findings.response_policy_ids_consistent &&
    result.findings.response_executed_at_consistent;

  return result;
}

export function toGuardEvidenceRecord(verificationResult) {
  const findings = verificationResult?.findings ?? {};

  return {
    evidence_type: "external_runtime_decision_receipt",
    source: "ramen",
    source_schema: "ramen-receipt-v5",
    baseline_sha: verificationResult?.baseline_sha ?? RAMEN_V5_BASELINE_SHA,
    receipt_id: verificationResult?.receipt_id ?? null,
    timestamp: verificationResult?.timestamp ?? null,
    decision: verificationResult?.decision ?? null,
    policy_ids: Array.isArray(verificationResult?.policy_ids) ? [...verificationResult.policy_ids] : [],
    payload_hash: verificationResult?.payload_hash ?? null,
    signature_valid: findings.signature_valid === true,
    input_binding_valid: findings.input_binding_valid === true,
    envelope_consistent: findings.envelope_consistent === true,
    response_consistent:
      findings.response_verdict_consistent === true &&
      findings.response_policy_ids_consistent === true &&
      findings.response_executed_at_consistent === true,
    key_trust_status: findings.key_trust_status ?? "unknown",
    signed_fields: {
      verdict_bound: findings.verdict_binding_valid === true,
      reasoning_bound: findings.reasoning_binding_valid === true,
      steering_bound: findings.steering_binding_valid === true,
      statutory_anchors_bound: findings.statutory_anchor_binding_valid === true,
      timestamp_bound: findings.response_executed_at_consistent === true,
      policy_uuid_bound: findings.policy_uuid_binding_valid === true,
    },
    assurance_limits: [
      "policy_content_immutability_not_provided",
      "execution_binding_not_provided",
      "legal_applicability_not_verified",
    ],
    non_authority_statement: RAMEN_V5_NON_AUTHORITY_STATEMENT,
  };
}
