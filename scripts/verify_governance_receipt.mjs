import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runAudit } from "../packages/guard/src/runAudit.mjs";
import {
  GOVERNANCE_RECEIPT_KIND,
  GOVERNANCE_RECEIPT_VERSION,
  GOVERNANCE_RECEIPT_SCHEMA_ID,
  GOVERNANCE_RECEIPT_EMITTER_SURFACE,
  GOVERNANCE_RECEIPT_CONSUMER_SURFACE,
  GOVERNANCE_RECEIPT_EMISSION_MODE,
  GOVERNANCE_RECEIPT_RESULT_BOUNDARY,
  validateGovernanceReceipt,
  PERMIT_GATE_DENIED_EXIT_CODE,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeAudit(audit) {
  const copy = clone(audit);
  if (copy?.run) {
    copy.run.run_id = "<run_id>";
    copy.run.timestamp = "<timestamp>";
  }
  return copy;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function basePolicy() {
  return {
    policy_version: "1.0",
    defaults: {},
    thresholds: {},
    rules: [],
    exit_codes: {
      allow: 0,
      soft_block: 10,
      hard_block: 20,
      error: 1,
    },
  };
}

function denyPolicy() {
  const policy = basePolicy();
  policy.rules.push({
    id: "governance-receipt-deny-unknown",
    enabled: true,
    severity: "hard_block",
    message: "deny unknown action classes at the permit gate",
    when: {
      any_of: [{ metric: "lines_added", op: ">", value: 999999 }],
    },
    preview_when: {
      action_classes: ["unknown"],
    },
  });
  return policy;
}

const tmp = os.tmpdir();
const allowOut = path.join(tmp, "mindforge-governance-receipt-allow.json");
const denyOut = path.join(tmp, "mindforge-governance-receipt-deny.json");
const invalidReceiptDir = path.join(tmp, "mindforge-governance-receipt-dir");

for (const filePath of [allowOut, denyOut]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}
fs.mkdirSync(invalidReceiptDir, { recursive: true });

const missingFlag = await runAudit({
  argv: [".", "--staged", `--governance-receipt-out=${allowOut}`],
  policy: basePolicy(),
});

if (!String(missingFlag?.message || "").includes("governance receipt output requires --permit-gate")) {
  throw new Error("governance receipt should require --permit-gate");
}

const invalidOut = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-receipt-out=${invalidReceiptDir}`],
  policy: basePolicy(),
});

if (!String(invalidOut?.message || "").includes("governance bridge or permit gate preparation failed")) {
  throw new Error("governance receipt should fail closed for invalid output paths");
}

const baseline = await runAudit({
  argv: [".", "--staged"],
  policy: basePolicy(),
});

const allow = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-receipt-out=${allowOut}`],
  policy: basePolicy(),
});

const deny = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-receipt-out=${denyOut}`],
  policy: denyPolicy(),
});

for (const result of [baseline, allow, deny]) {
  if (!result?.audit) {
    throw new Error(`governance receipt audit failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(allow.audit))) {
  throw new Error("governance receipt allow path changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(deny.audit))) {
  throw new Error("governance receipt deny path changed the audit main output");
}

if (allow.exitCode !== 0) {
  throw new Error(`governance receipt allow path should pass, got exit ${allow.exitCode}`);
}
if (deny.exitCode !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error(
    `governance receipt deny path should exit ${PERMIT_GATE_DENIED_EXIT_CODE}, got ${deny.exitCode}`
  );
}

const allowReceipt = readJson(allowOut);
const denyReceipt = readJson(denyOut);

for (const receipt of [allowReceipt, denyReceipt]) {
  const validation = validateGovernanceReceipt(receipt);
  if (!validation.ok) {
    throw new Error(`governance receipt validation failed: ${validation.errors.join("; ")}`);
  }
  if (receipt.kind !== GOVERNANCE_RECEIPT_KIND) {
    throw new Error("governance receipt kind mismatch");
  }
  if (receipt.version !== GOVERNANCE_RECEIPT_VERSION) {
    throw new Error("governance receipt version mismatch");
  }
  if (receipt.schema_id !== GOVERNANCE_RECEIPT_SCHEMA_ID) {
    throw new Error("governance receipt schema_id mismatch");
  }
  if (receipt.enforcing !== false) {
    throw new Error("governance receipt must remain non-enforcing");
  }
  if (receipt.governance_receipt.consumer_surface !== "guard.audit") {
    throw new Error("governance receipt consumer surface mismatch");
  }
  if (receipt.governance_receipt.consumer_surface !== GOVERNANCE_RECEIPT_CONSUMER_SURFACE) {
    throw new Error("governance receipt consumer surface constant mismatch");
  }
  if (receipt.governance_receipt.producer_surface !== GOVERNANCE_RECEIPT_EMITTER_SURFACE) {
    throw new Error("governance receipt producer surface mismatch");
  }
  if (receipt.governance_receipt.emission_mode !== GOVERNANCE_RECEIPT_EMISSION_MODE) {
    throw new Error("governance receipt emission mode mismatch");
  }
  if (receipt.governance_receipt.result_boundary !== GOVERNANCE_RECEIPT_RESULT_BOUNDARY) {
    throw new Error("governance receipt result boundary mismatch");
  }
  if (receipt.governance_receipt.audit_output_preserved !== true) {
    throw new Error("governance receipt must preserve audit output semantics");
  }
  if (receipt.governance_receipt.traceability.emitted_by !== GOVERNANCE_RECEIPT_EMITTER_SURFACE) {
    throw new Error("governance receipt emitter surface mismatch");
  }
  if (typeof receipt.governance_receipt.traceability.run_id !== "string") {
    throw new Error("governance receipt run_id must be present");
  }
  if (receipt.governance_receipt.traceability.audit_mode !== "local") {
    throw new Error("governance receipt audit mode mismatch");
  }
  if (typeof receipt.governance_receipt.traceability.git_head !== "string") {
    throw new Error("governance receipt git head must be present");
  }
  if (typeof receipt.governance_receipt.traceability.git_branch !== "string") {
    throw new Error("governance receipt git branch must be present");
  }
}

if (allowReceipt.governance_receipt.outcome !== "allow") {
  throw new Error("governance receipt allow path did not produce allow outcome");
}
if (allowReceipt.permit_gate_result.decision !== "allow") {
  throw new Error("governance receipt allow path permit linkage mismatch");
}
if (allowReceipt.permit_gate_result.source_decision !== "insufficient_signal") {
  throw new Error("governance receipt allow path source decision mismatch");
}
if (allowReceipt.governance_receipt.exit_code !== 0) {
  throw new Error("governance receipt allow path exit code mismatch");
}
if (denyReceipt.governance_receipt.outcome !== "deny") {
  throw new Error("governance receipt deny path did not produce deny outcome");
}
if (denyReceipt.permit_gate_result.decision !== "deny") {
  throw new Error("governance receipt deny path permit linkage mismatch");
}
if (denyReceipt.permit_gate_result.source_decision !== "would_deny") {
  throw new Error("governance receipt deny path source decision mismatch");
}
if (denyReceipt.governance_receipt.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("governance receipt deny path exit code mismatch");
}
if (allowReceipt.canonical_action_hash !== denyReceipt.canonical_action_hash) {
  throw new Error("governance receipt canonical hashes should remain stable for identical input");
}
if (
  allowReceipt.governance_receipt.traceability.git_branch !==
  denyReceipt.governance_receipt.traceability.git_branch
) {
  throw new Error("governance receipt git branch should remain stable for identical input");
}

process.stdout.write("governance receipt verified\n");
