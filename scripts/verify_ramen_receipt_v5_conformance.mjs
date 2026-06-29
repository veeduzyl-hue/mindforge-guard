import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  RAMEN_V5_BASELINE_SHA,
  verifyRamenReceiptV5,
} from "../experiments/ramen-receipt-v5/verify-ramen-v5.mjs";

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hasFailure(result, code) {
  return Array.isArray(result.failures) && result.failures.some((entry) => entry && entry.code === code);
}

function summarizeCase(id, result) {
  return {
    valid: result.valid,
    cryptographic_assurance: result.cryptographic_assurance,
    decision: result.decision,
    receipt_id: result.receipt_id,
    key_trust_status: result.findings.key_trust_status,
    failure_codes: result.failures.map((entry) => entry.code),
  };
}

function createRuntimeSignedPayloadCase({ payload, responseData, originalInput, expectedFailure, expectedAssurance, trustedKeys }) {
  return {
    originalInput,
    response: {
      success: true,
      data: responseData,
    },
    expectedFailure,
    expectedAssurance,
    trustedKeys,
  };
}

function buildGuardSideNegatives(fixture) {
  const vector1 = fixture.provider_vectors.find((entry) => entry.id === "vector_1_allowed_valid");
  expect(vector1, "fixture must include vector_1_allowed_valid");

  const baseResponse = vector1.response;
  const cases = [];
  const runtimeKeyPair = crypto.generateKeyPairSync("ed25519");
  const runtimeTrustedKeys = {
    ...fixture.trusted_keys,
    ramen_runtime_review_test: {
      spki_der_base64: runtimeKeyPair.publicKey.export({ type: "spki", format: "der" }).toString("base64"),
      trust_status: "ephemeral_test_key",
      source: "local_review_stage_negative_test",
    },
  };

  function signCanonicalPayload(payload) {
    const canonicalPayload = JSON.stringify(payload);
    const signature = crypto
      .sign(null, Buffer.from(canonicalPayload, "utf8"), runtimeKeyPair.privateKey)
      .toString("base64url");

    return {
      id: payload.id,
      schema_version: payload.schema_version,
      kid: payload.kid,
      signature,
      canonical_payload: canonicalPayload,
      statutory_anchors: Array.isArray(payload.statutory_anchors) ? [...payload.statutory_anchors] : [],
    };
  }

  function buildSignedResponseData(payload, overrides = {}) {
    const receipt = signCanonicalPayload(payload);

    return {
      allowed: payload.verdict === 1,
      policy_ids: [...payload.policy_ids],
      executed_at: payload.timestamp,
      receipt,
      ...overrides,
    };
  }

  const unknownKid = deepClone(baseResponse);
  unknownKid.data.receipt.kid = "ramen_unknown_test";
  cases.push({
    id: "guard_unknown_kid",
    originalInput: vector1.original_input,
    response: unknownKid,
    expectedFailure: "unknown_kid",
    expectedAssurance: "failed",
  });

  const idMismatch = deepClone(baseResponse);
  idMismatch.data.receipt.id = "99999999-9999-4999-8999-999999999999";
  cases.push({
    id: "guard_envelope_id_mismatch",
    originalInput: vector1.original_input,
    response: idMismatch,
    expectedFailure: "envelope_mismatch",
    expectedAssurance: "verified",
  });

  const kidMismatch = deepClone(baseResponse);
  kidMismatch.data.receipt.kid = "ramen_pk_ephemeral_alias";
  cases.push({
    id: "guard_envelope_kid_mismatch",
    originalInput: vector1.original_input,
    response: kidMismatch,
    expectedFailure: "envelope_mismatch",
    expectedAssurance: "verified",
  });

  const schemaMismatch = deepClone(baseResponse);
  schemaMismatch.data.receipt.schema_version = "5.1";
  cases.push({
    id: "guard_envelope_schema_mismatch",
    originalInput: vector1.original_input,
    response: schemaMismatch,
    expectedFailure: "envelope_mismatch",
    expectedAssurance: "verified",
  });

  const verdictMismatch = deepClone(baseResponse);
  verdictMismatch.data.allowed = false;
  cases.push({
    id: "guard_response_verdict_mismatch",
    originalInput: vector1.original_input,
    response: verdictMismatch,
    expectedFailure: "response_verdict_mismatch",
    expectedAssurance: "verified",
  });

  const policyIdsMismatch = deepClone(baseResponse);
  policyIdsMismatch.data.policy_ids = ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"];
  cases.push({
    id: "guard_response_policy_ids_mismatch",
    originalInput: vector1.original_input,
    response: policyIdsMismatch,
    expectedFailure: "response_policy_ids_mismatch",
    expectedAssurance: "verified",
  });

  const executedAtMismatchPayload = {
    schema_version: "5.0",
    kid: "ramen_runtime_review_test",
    id: "44444444-4444-4444-8444-444444444444",
    timestamp: "2026-06-20T09:10:00.000Z",
    policy_ids: ["f47ac10b-58cc-4372-a567-0e02b2c3d479"],
    payload_hash: "adb09112ff437c97a89b17e2dcba478b0c1ebbf2331fa4e5d216f10085eeff21",
    verdict: 1,
    reasoning: "",
    steering: "",
    statutory_anchors: ["FCA COBS 4.2.1"],
  };
  cases.push({
    id: "guard_response_executed_at_mismatch",
    ...createRuntimeSignedPayloadCase({
      payload: executedAtMismatchPayload,
      originalInput: vector1.original_input,
      responseData: buildSignedResponseData(executedAtMismatchPayload, {
        executed_at: "2026-06-20T09:10:01.000Z",
      }),
      expectedFailure: "response_executed_at_mismatch",
      expectedAssurance: "verified",
      trustedKeys: runtimeTrustedKeys,
    }),
  });

  const malformedCanonicalPayload = deepClone(baseResponse);
  malformedCanonicalPayload.data.receipt.canonical_payload = "{";
  cases.push({
    id: "guard_malformed_canonical_payload",
    originalInput: vector1.original_input,
    response: malformedCanonicalPayload,
    expectedFailure: "invalid_canonical_payload_json",
    expectedAssurance: "failed",
  });

  const unsupportedSchemaPayload = {
    schema_version: "4.0",
    kid: "ramen_runtime_review_test",
    id: "55555555-5555-4555-8555-555555555555",
    timestamp: "2026-06-20T09:11:00.000Z",
    policy_ids: ["f47ac10b-58cc-4372-a567-0e02b2c3d479"],
    payload_hash: "adb09112ff437c97a89b17e2dcba478b0c1ebbf2331fa4e5d216f10085eeff21",
    verdict: 1,
    reasoning: "",
    steering: "",
    statutory_anchors: ["FCA COBS 4.2.1"],
  };
  cases.push({
    id: "guard_unsupported_schema_version",
    ...createRuntimeSignedPayloadCase({
      payload: unsupportedSchemaPayload,
      originalInput: vector1.original_input,
      responseData: buildSignedResponseData(unsupportedSchemaPayload),
      expectedFailure: "unsupported_schema_version",
      expectedAssurance: "verified",
      trustedKeys: runtimeTrustedKeys,
    }),
  });

  const invalidVerdictPayload = {
    schema_version: "5.0",
    kid: "ramen_runtime_review_test",
    id: "66666666-6666-4666-8666-666666666666",
    timestamp: "2026-06-20T09:12:00.000Z",
    policy_ids: ["f47ac10b-58cc-4372-a567-0e02b2c3d479"],
    payload_hash: "adb09112ff437c97a89b17e2dcba478b0c1ebbf2331fa4e5d216f10085eeff21",
    verdict: 2,
    reasoning: "",
    steering: "",
    statutory_anchors: ["FCA COBS 4.2.1"],
  };
  cases.push({
    id: "guard_invalid_verdict",
    ...createRuntimeSignedPayloadCase({
      payload: invalidVerdictPayload,
      originalInput: vector1.original_input,
      responseData: buildSignedResponseData(invalidVerdictPayload, {
        allowed: true,
      }),
      expectedFailure: "invalid_verdict",
      expectedAssurance: "verified",
      trustedKeys: runtimeTrustedKeys,
    }),
  });

  const missingFieldPayload = {
    schema_version: "5.0",
    kid: "ramen_runtime_review_test",
    id: "77777777-7777-4777-8777-777777777777",
    timestamp: "2026-06-20T09:13:00.000Z",
    policy_ids: ["f47ac10b-58cc-4372-a567-0e02b2c3d479"],
    payload_hash: "adb09112ff437c97a89b17e2dcba478b0c1ebbf2331fa4e5d216f10085eeff21",
    verdict: 1,
    reasoning: "",
    statutory_anchors: ["FCA COBS 4.2.1"],
  };
  cases.push({
    id: "guard_missing_required_payload_field",
    ...createRuntimeSignedPayloadCase({
      payload: missingFieldPayload,
      originalInput: vector1.original_input,
      responseData: buildSignedResponseData(missingFieldPayload, {
        allowed: true,
      }),
      expectedFailure: "missing_required_payload_field",
      expectedAssurance: "verified",
      trustedKeys: runtimeTrustedKeys,
    }),
  });

  const conflictingReceiptAlert = deepClone(baseResponse);
  conflictingReceiptAlert.data.receipt_alert =
    "RECEIPT_SIGNING_FAILED: conflicting receipt and receipt_alert review-stage test";
  cases.push({
    id: "guard_conflicting_receipt_alert_and_receipt",
    originalInput: vector1.original_input,
    response: conflictingReceiptAlert,
    expectedWarning: "receipt_alert_receipt_conflict",
    expectedAssurance: "absent",
  });

  return cases;
}

function verifySpecificationDocuments(repoRoot) {
  const specPath = path.join(repoRoot, "docs", "adapters", "ramen-receipt-v5-adapter-spec.md");
  const readmePath = path.join(repoRoot, "experiments", "ramen-receipt-v5", "README.md");

  expect(fs.existsSync(specPath), "adapter spec document must exist");
  expect(fs.existsSync(readmePath), "experiment README must exist");

  const specText = readText(specPath);
  const readmeText = readText(readmePath);

  for (const phrase of [
    "independent assurance layer",
    "runtime semantic firewall / decision receipt issuer",
    "decision-and-steering receipt",
    "does not:",
    "does not prove:",
    "policy content immutability",
    "downstream execution",
    "legal applicability",
    "does not change `audit`, `permit`, or `classify`",
    "Verification Flow",
    "Findings Schema",
    "Negative Tests",
    "Evidence Pack Mapping",
    "Acceptance Criteria",
    "Assurance Limits",
    "Future Compatibility Notes",
  ]) {
    expect(specText.includes(phrase), `adapter spec must include phrase: ${phrase}`);
  }

  for (const phrase of [
    "independently verify Ramen V5 signed receipts",
    "recommendation only",
    "non-executing",
    "ramen_pk_ephemeral_test",
    "ramen_pk_ephemeral_alias",
    "npm run verify:ramen-v5",
  ]) {
    expect(readmeText.includes(phrase), `experiment README must include phrase: ${phrase}`);
  }
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const fixturePath = path.join(
    repoRoot,
    "experiments",
    "ramen-receipt-v5",
    "fixtures",
    "ramen-v5-conformance.json"
  );

  verifySpecificationDocuments(repoRoot);
  expect(fs.existsSync(fixturePath), "Ramen V5 fixture must exist");

  const fixture = readJson(fixturePath);
  expect(fixture.profile === "ramen-receipt-v5-conformance", "fixture profile mismatch");
  expect(fixture.baseline_sha === RAMEN_V5_BASELINE_SHA, "fixture baseline SHA mismatch");

  const providerSummaries = {};
  for (const vector of fixture.provider_vectors) {
    const result = verifyRamenReceiptV5({
      originalInput: vector.original_input,
      response: vector.response,
      trustedKeys: fixture.trusted_keys,
    });

    providerSummaries[vector.id] = summarizeCase(vector.id, result);

    expect(result.valid === vector.expected.valid, `${vector.id} valid mismatch`);
    expect(
      result.cryptographic_assurance === vector.expected.cryptographic_assurance,
      `${vector.id} cryptographic assurance mismatch`
    );
    expect(result.decision === vector.expected.decision, `${vector.id} decision mismatch`);

    if (vector.expected.valid) {
      expect(result.findings.signature_valid === true, `${vector.id} signature should verify`);
      expect(result.findings.input_binding_valid === true, `${vector.id} input binding should verify`);
      expect(result.findings.envelope_consistent === true, `${vector.id} envelope must be consistent`);
      expect(result.findings.response_verdict_consistent === true, `${vector.id} response verdict must match`);
      expect(result.findings.response_policy_ids_consistent === true, `${vector.id} response policy_ids must match`);
      expect(result.findings.response_executed_at_consistent === true, `${vector.id} response executed_at must match`);
      expect(result.findings.key_trust_status === "ephemeral_test_key", `${vector.id} key trust status mismatch`);
    } else if (vector.expected.cryptographic_assurance === "absent") {
      expect(result.failures.length === 0, `${vector.id} absent receipt should not throw validation failures`);
      expect(result.warnings.length >= 1, `${vector.id} absent receipt should emit warning(s)`);
    } else {
      expect(hasFailure(result, vector.expected.failure_code), `${vector.id} missing expected failure code`);
    }
  }

  const guardNegativeSummaries = {};
  for (const testCase of buildGuardSideNegatives(fixture)) {
    const result = verifyRamenReceiptV5({
      originalInput: testCase.originalInput,
      response: testCase.response,
      trustedKeys: testCase.trustedKeys ?? fixture.trusted_keys,
    });

    guardNegativeSummaries[testCase.id] = summarizeCase(testCase.id, result);

    if (testCase.expectedWarning) {
      expect(result.valid === false, `${testCase.id} must fail safely`);
      expect(
        result.cryptographic_assurance === testCase.expectedAssurance,
        `${testCase.id} cryptographic assurance mismatch`
      );
      expect(
        Array.isArray(result.warnings) && result.warnings.some((entry) => entry?.code === testCase.expectedWarning),
        `${testCase.id} missing warning ${testCase.expectedWarning}`
      );
      expect(result.failures.length === 0, `${testCase.id} should not emit hard validation failures`);
      continue;
    }

    expect(result.valid === false, `${testCase.id} must fail safely`);
    expect(
      result.cryptographic_assurance === testCase.expectedAssurance,
      `${testCase.id} cryptographic assurance mismatch`
    );
    expect(hasFailure(result, testCase.expectedFailure), `${testCase.id} missing ${testCase.expectedFailure}`);

    if (
      !["guard_unknown_kid", "guard_malformed_canonical_payload"].includes(testCase.id)
    ) {
      expect(result.findings.signature_valid === true, `${testCase.id} should keep signature verification valid`);
      expect(result.findings.input_binding_valid === true, `${testCase.id} should keep input binding valid`);
    }
  }

  const output = {
    provider_vectors: providerSummaries,
    guard_side_negatives: guardNegativeSummaries,
  };

  console.log(JSON.stringify(output, null, 2));
  console.log("PASS: ramen receipt v5 conformance verified.");
}

main();
