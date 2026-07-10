import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  RAMEN_RECEIPT_V5_LOCAL_SPIKE_ID,
  createRamenReceiptV5LocalSpikeAdapter,
} from "../packages/guard-core/src/externalEvidence/referenceAdapters/ramenReceiptV5/localSpike.mjs";

const VERIFIER_SELF_ID = "verify_ramen_receipt_v5_local_spike";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const files = {
  index: path.join(repoRoot, "packages", "guard-core", "src", "index.ts"),
  localSpike: path.join(
    repoRoot,
    "packages",
    "guard-core",
    "src",
    "externalEvidence",
    "referenceAdapters",
    "ramenReceiptV5",
    "localSpike.mjs"
  ),
};

assert.equal(
  VERIFIER_SELF_ID,
  "verify_ramen_receipt_v5_local_spike",
  "verifier self identifier must remain stable"
);

const adapter = createRamenReceiptV5LocalSpikeAdapter();
const sample = {
  sample_kind: "documentation_only",
  receipt_id: "ramen-receipt-v5-sample-001",
  receipt_version: "5.0",
  issuer: "ramen-docs-sample",
  subject: "sample-order-123",
  issued_at: "2026-07-10T00:00:00.000Z",
  signature: "sig-doc-sample-001",
  signing_algorithm: "Ed25519",
  payload_hash: "sha256:doc-sample-payload-hash",
  policy_reference: "policy://ramen/sample/v5",
  evidence_references: ["evidence://ramen/sample/receipt/001"],
  raw_payload_available: true,
};

const parseResult = adapter.parse(sample);
const validationResult = adapter.validate(parseResult);
const verificationResult = adapter.verify(parseResult, validationResult);
const record = adapter.normalize(
  parseResult,
  validationResult,
  verificationResult
);
const findings = adapter.emitFindings(record, [
  ...parseResult.diagnostics,
  ...validationResult.diagnostics,
  ...verificationResult.diagnostics,
]);

assert.equal(
  RAMEN_RECEIPT_V5_LOCAL_SPIKE_ID,
  "ramen-receipt-v5-local-spike",
  "adapter id must remain stable"
);
assert.equal(
  adapter.identity.reference_status,
  "non_privileged_reference",
  "reference status must remain non-privileged"
);
assert.match(
  adapter.identity.boundary,
  /ramen issues\. Guard verifies\./,
  "boundary phrase must remain visible"
);

assert.equal(parseResult.status, "parsed", "parse must succeed on sample input");
assert.ok(parseResult.parsed, "parse must produce parsed data");

assert.ok(
  ["valid", "partial"].includes(validationResult.status),
  "validate must remain valid or partial on sample input"
);

assert.equal(
  verificationResult.status,
  "partially_verified",
  "verify must remain partially verified"
);
assert.equal(
  verificationResult.signature.cryptographic_verification_performed,
  false,
  "cryptographic verification must remain disabled"
);
assert.equal(
  verificationResult.integrity.payload_hash_verified,
  false,
  "payload hash verification must remain disabled"
);
assert.match(
  verificationResult.signature.reason,
  /cryptographic verification not performed/,
  "signature limitation must remain visible"
);

assert.ok(record.contract_validation, "normalized record must include contract_validation");
assert.ok(record.adapter.limitations, "normalized record must include adapter limitations");
assert.equal(
  record.review.boundary,
  "ramen issues. Guard verifies.",
  "normalized record must preserve the boundary phrase"
);

const findingTypes = new Set(findings.map((finding) => finding.finding_type));
assert.ok(
  findingTypes.has("signature_not_cryptographically_verified"),
  "findings must include signature limitation"
);
assert.ok(
  findingTypes.has("payload_hash_not_computed"),
  "findings must include payload hash limitation"
);
assert.ok(
  findingTypes.has("human_review_required"),
  "findings must require human review"
);

const forbiddenFindingTerms = [
  "approve",
  "approved",
  "block",
  "blocked",
  "certify",
  "certified",
  "deploy",
  "deployment decision",
];

for (const finding of findings) {
  const combinedText = [
    finding.finding_type,
    finding.message,
    finding.recommendation,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const term of forbiddenFindingTerms) {
    assert.equal(
      combinedText.includes(term),
      false,
      `finding text must not include runtime-like term: ${term}`
    );
  }
}

const indexSource = fs.readFileSync(files.index, "utf8");
assert.equal(
  /ramenReceiptV5|localSpike/.test(indexSource),
  false,
  "package index must not reference the local spike"
);

const localSpikeSource = fs.readFileSync(files.localSpike, "utf8").toLowerCase();
const forbiddenSourceTerms = [
  "approve",
  "approved",
  "block",
  "blocked",
  "certify",
  "certified",
  "deploy",
  "deployment decision",
  "runtime registry",
  "dynamic loading",
  "allowlist",
  "trust registry",
];

for (const term of forbiddenSourceTerms) {
  assert.equal(
    localSpikeSource.includes(term),
    false,
    `local spike source must not include forbidden term: ${term}`
  );
}

console.log("PASS: ramen receipt v5 local adapter spike verified");
