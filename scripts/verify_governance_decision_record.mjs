import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runAudit } from "../packages/guard/src/runAudit.mjs";
import {
  GOVERNANCE_DECISION_RECORD_KIND,
  GOVERNANCE_DECISION_RECORD_VERSION,
  GOVERNANCE_DECISION_RECORD_SCHEMA_ID,
  GOVERNANCE_DECISION_RECORD_CONSUMER_SURFACE,
  GOVERNANCE_DECISION_RECORD_PRODUCER_SURFACE,
  GOVERNANCE_DECISION_RECORD_SOURCE,
  GOVERNANCE_DECISION_RECORD_MODE,
  GOVERNANCE_DECISION_RECORD_RESULT_BOUNDARY,
  GOVERNANCE_DECISION_RECORD_EMITTER_SURFACE,
  validateGovernanceDecisionRecord,
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
    id: "governance-decision-record-deny-unknown",
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
const allowOut = path.join(tmp, "mindforge-governance-decision-record-allow.json");
const denyOut = path.join(tmp, "mindforge-governance-decision-record-deny.json");
const allowWithReceiptOut = path.join(tmp, "mindforge-governance-decision-record-allow-with-receipt.json");
const allowReceiptOut = path.join(tmp, "mindforge-governance-decision-record-allow-receipt.json");
const invalidRecordDir = path.join(tmp, "mindforge-governance-decision-record-dir");

for (const filePath of [allowOut, denyOut, allowWithReceiptOut, allowReceiptOut]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}
fs.mkdirSync(invalidRecordDir, { recursive: true });

const missingFlag = await runAudit({
  argv: [".", "--staged", `--governance-decision-record-out=${allowOut}`],
  policy: basePolicy(),
});

if (!String(missingFlag?.message || "").includes("governance decision record output requires --permit-gate")) {
  throw new Error("governance decision record should require --permit-gate");
}

const invalidOut = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-decision-record-out=${invalidRecordDir}`],
  policy: basePolicy(),
});

if (!String(invalidOut?.message || "").includes("governance bridge or permit gate preparation failed")) {
  throw new Error("governance decision record should fail closed for invalid output paths");
}

const baseline = await runAudit({
  argv: [".", "--staged"],
  policy: basePolicy(),
});

const allow = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-decision-record-out=${allowOut}`],
  policy: basePolicy(),
});

const allowWithReceipt = await runAudit({
  argv: [
    ".",
    "--staged",
    "--permit-gate",
    `--governance-receipt-out=${allowReceiptOut}`,
    `--governance-decision-record-out=${allowWithReceiptOut}`,
  ],
  policy: basePolicy(),
});

const deny = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-decision-record-out=${denyOut}`],
  policy: denyPolicy(),
});

for (const result of [baseline, allow, allowWithReceipt, deny]) {
  if (!result?.audit) {
    throw new Error(`governance decision record audit failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(allow.audit))) {
  throw new Error("decision record allow path changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(allowWithReceipt.audit))) {
  throw new Error("decision record receipt-linked allow path changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(deny.audit))) {
  throw new Error("decision record deny path changed the audit main output");
}

if (allow.exitCode !== 0) {
  throw new Error(`decision record allow path should pass, got exit ${allow.exitCode}`);
}
if (allowWithReceipt.exitCode !== 0) {
  throw new Error(`decision record allow+receipt path should pass, got exit ${allowWithReceipt.exitCode}`);
}
if (deny.exitCode !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error(
    `decision record deny path should exit ${PERMIT_GATE_DENIED_EXIT_CODE}, got ${deny.exitCode}`
  );
}

const allowRecord = readJson(allowOut);
const allowWithReceiptRecord = readJson(allowWithReceiptOut);
const denyRecord = readJson(denyOut);

for (const record of [allowRecord, allowWithReceiptRecord, denyRecord]) {
  const validation = validateGovernanceDecisionRecord(record);
  if (!validation.ok) {
    throw new Error(`governance decision record validation failed: ${validation.errors.join("; ")}`);
  }
  if (record.kind !== GOVERNANCE_DECISION_RECORD_KIND) {
    throw new Error("governance decision record kind mismatch");
  }
  if (record.version !== GOVERNANCE_DECISION_RECORD_VERSION) {
    throw new Error("governance decision record version mismatch");
  }
  if (record.schema_id !== GOVERNANCE_DECISION_RECORD_SCHEMA_ID) {
    throw new Error("governance decision record schema_id mismatch");
  }
  if (record.enforcing !== false) {
    throw new Error("governance decision record must remain non-enforcing");
  }
  if (record.governance_decision.consumer_surface !== GOVERNANCE_DECISION_RECORD_CONSUMER_SURFACE) {
    throw new Error("governance decision record consumer surface mismatch");
  }
  if (record.governance_decision.producer_surface !== GOVERNANCE_DECISION_RECORD_PRODUCER_SURFACE) {
    throw new Error("governance decision record producer surface mismatch");
  }
  if (record.governance_decision.decision_source !== GOVERNANCE_DECISION_RECORD_SOURCE) {
    throw new Error("governance decision record source mismatch");
  }
  if (record.governance_decision.decision_mode !== GOVERNANCE_DECISION_RECORD_MODE) {
    throw new Error("governance decision record mode mismatch");
  }
  if (record.governance_decision.result_boundary !== GOVERNANCE_DECISION_RECORD_RESULT_BOUNDARY) {
    throw new Error("governance decision record result boundary mismatch");
  }
  if (record.governance_decision.audit_output_preserved !== true) {
    throw new Error("governance decision record must preserve audit output semantics");
  }
  if (record.traceability.emitted_by !== GOVERNANCE_DECISION_RECORD_EMITTER_SURFACE) {
    throw new Error("governance decision record emitter surface mismatch");
  }
}

if (allowRecord.governance_decision.outcome !== "allow") {
  throw new Error("decision record allow path did not produce allow outcome");
}
if (allowRecord.permit_gate_result.decision !== "allow") {
  throw new Error("decision record allow path permit linkage mismatch");
}
if ("governance_receipt_linkage" in allowRecord) {
  throw new Error("decision record should not include receipt linkage when no receipt was emitted");
}

if (!("governance_receipt_linkage" in allowWithReceiptRecord)) {
  throw new Error("decision record should include receipt linkage when receipt was emitted");
}
if (allowWithReceiptRecord.governance_receipt_linkage.kind !== "governance_receipt") {
  throw new Error("decision record receipt linkage kind mismatch");
}

if (denyRecord.governance_decision.outcome !== "deny") {
  throw new Error("decision record deny path did not produce deny outcome");
}
if (denyRecord.permit_gate_result.decision !== "deny") {
  throw new Error("decision record deny path permit linkage mismatch");
}
if (denyRecord.permit_gate_result.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("decision record deny path exit code mismatch");
}
if (denyRecord.governance_decision.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("decision record deny governance exit code mismatch");
}

process.stdout.write("governance decision record verified\n");
