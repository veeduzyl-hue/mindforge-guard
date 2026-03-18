import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runAudit } from "../packages/guard/src/runAudit.mjs";
import {
  GOVERNANCE_ACTIVATION_RECORD_KIND,
  GOVERNANCE_ACTIVATION_RECORD_VERSION,
  GOVERNANCE_ACTIVATION_RECORD_SCHEMA_ID,
  GOVERNANCE_ACTIVATION_RECORD_CONSUMER_SURFACE,
  GOVERNANCE_ACTIVATION_RECORD_PRODUCER_SURFACE,
  GOVERNANCE_ACTIVATION_RECORD_MODE,
  GOVERNANCE_ACTIVATION_RECORD_SOURCE,
  GOVERNANCE_ACTIVATION_RECORD_BOUNDARY,
  GOVERNANCE_ACTIVATION_RECORD_EMITTER_SURFACE,
  validateGovernanceActivationRecord,
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
    id: "governance-activation-record-deny-unknown",
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
const allowOut = path.join(tmp, "mindforge-governance-activation-record-allow.json");
const denyOut = path.join(tmp, "mindforge-governance-activation-record-deny.json");
const allowReceiptOut = path.join(tmp, "mindforge-governance-activation-record-receipt.json");
const allowDecisionOut = path.join(tmp, "mindforge-governance-activation-record-decision.json");
const allowBundleOut = path.join(tmp, "mindforge-governance-activation-record-bundle.json");
const allowApplicationOut = path.join(tmp, "mindforge-governance-activation-record-application.json");
const allowDispositionOut = path.join(tmp, "mindforge-governance-activation-record-disposition.json");
const allowLinkedOut = path.join(tmp, "mindforge-governance-activation-record-linked.json");
const invalidActivationDir = path.join(tmp, "mindforge-governance-activation-record-dir");

for (const filePath of [
  allowOut,
  denyOut,
  allowReceiptOut,
  allowDecisionOut,
  allowBundleOut,
  allowApplicationOut,
  allowDispositionOut,
  allowLinkedOut,
]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}
fs.mkdirSync(invalidActivationDir, { recursive: true });

const missingFlag = await runAudit({
  argv: [".", "--staged", `--governance-activation-record-out=${allowOut}`],
  policy: basePolicy(),
});

if (
  !String(missingFlag?.message || "").includes("governance activation record output requires --permit-gate")
) {
  throw new Error("governance activation record should require --permit-gate");
}

const missingPath = await runAudit({
  argv: [".", "--staged", "--permit-gate", "--governance-activation-record-out"],
  policy: basePolicy(),
});

if (
  !String(missingPath?.message || "").includes("governance activation record output requires a file path")
) {
  throw new Error("governance activation record should fail closed for missing output paths");
}

const invalidOut = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-activation-record-out=${invalidActivationDir}`],
  policy: basePolicy(),
});

if (!String(invalidOut?.message || "").includes("governance bridge or permit gate preparation failed")) {
  throw new Error("governance activation record should fail closed for invalid output paths");
}

const baseline = await runAudit({
  argv: [".", "--staged"],
  policy: basePolicy(),
});

const allow = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-activation-record-out=${allowOut}`],
  policy: basePolicy(),
});

const allowWithLinks = await runAudit({
  argv: [
    ".",
    "--staged",
    "--permit-gate",
    `--governance-receipt-out=${allowReceiptOut}`,
    `--governance-decision-record-out=${allowDecisionOut}`,
    `--governance-outcome-bundle-out=${allowBundleOut}`,
    `--governance-application-record-out=${allowApplicationOut}`,
    `--governance-disposition-out=${allowDispositionOut}`,
    `--governance-activation-record-out=${allowLinkedOut}`,
  ],
  policy: basePolicy(),
});

const deny = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-activation-record-out=${denyOut}`],
  policy: denyPolicy(),
});

for (const result of [baseline, allow, allowWithLinks, deny]) {
  if (!result?.audit) {
    throw new Error(`governance activation record audit failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(allow.audit))) {
  throw new Error("activation record allow path changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(allowWithLinks.audit))) {
  throw new Error("activation record linked allow path changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(deny.audit))) {
  throw new Error("activation record deny path changed the audit main output");
}

if (allow.exitCode !== 0) {
  throw new Error(`activation record allow path should pass, got exit ${allow.exitCode}`);
}
if (allowWithLinks.exitCode !== 0) {
  throw new Error(`activation record linked allow path should pass, got exit ${allowWithLinks.exitCode}`);
}
if (deny.exitCode !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error(
    `activation record deny path should exit ${PERMIT_GATE_DENIED_EXIT_CODE}, got ${deny.exitCode}`
  );
}

const allowRecord = readJson(allowOut);
const allowLinkedRecord = readJson(allowLinkedOut);
const denyRecord = readJson(denyOut);
const allowDisposition = readJson(allowDispositionOut);

for (const record of [allowRecord, allowLinkedRecord, denyRecord]) {
  const validation = validateGovernanceActivationRecord(record);
  if (!validation.ok) {
    throw new Error(`governance activation record validation failed: ${validation.errors.join("; ")}`);
  }
  if (record.kind !== GOVERNANCE_ACTIVATION_RECORD_KIND) {
    throw new Error("governance activation record kind mismatch");
  }
  if (record.version !== GOVERNANCE_ACTIVATION_RECORD_VERSION) {
    throw new Error("governance activation record version mismatch");
  }
  if (record.schema_id !== GOVERNANCE_ACTIVATION_RECORD_SCHEMA_ID) {
    throw new Error("governance activation record schema id mismatch");
  }
  if (record.enforcing !== false) {
    throw new Error("governance activation record must remain non-enforcing");
  }
  if (record.governance_activation.consumer_surface !== GOVERNANCE_ACTIVATION_RECORD_CONSUMER_SURFACE) {
    throw new Error("governance activation record consumer surface mismatch");
  }
  if (record.governance_activation.producer_surface !== GOVERNANCE_ACTIVATION_RECORD_PRODUCER_SURFACE) {
    throw new Error("governance activation record producer surface mismatch");
  }
  if (record.governance_activation.activation_mode !== GOVERNANCE_ACTIVATION_RECORD_MODE) {
    throw new Error("governance activation record mode mismatch");
  }
  if (record.governance_activation.activation_source !== GOVERNANCE_ACTIVATION_RECORD_SOURCE) {
    throw new Error("governance activation record source mismatch");
  }
  if (record.governance_activation.result_boundary !== GOVERNANCE_ACTIVATION_RECORD_BOUNDARY) {
    throw new Error("governance activation record boundary mismatch");
  }
  if (record.governance_activation.audit_output_preserved !== true) {
    throw new Error("governance activation record must preserve audit output semantics");
  }
  if (record.traceability.emitted_by !== GOVERNANCE_ACTIVATION_RECORD_EMITTER_SURFACE) {
    throw new Error("governance activation record emitter surface mismatch");
  }
}

if ("governance_receipt_linkage" in allowRecord) {
  throw new Error("activation record should not include receipt linkage when no receipt was emitted");
}
if ("governance_decision_record_linkage" in allowRecord) {
  throw new Error("activation record should not include decision linkage when no decision record was emitted");
}
if ("governance_outcome_bundle_linkage" in allowRecord) {
  throw new Error("activation record should not include outcome bundle linkage when no bundle was emitted");
}
if ("governance_application_record_linkage" in allowRecord) {
  throw new Error("activation record should not include application linkage when no application record was emitted");
}
if ("governance_disposition_linkage" in allowRecord) {
  throw new Error("activation record should not include disposition linkage when no disposition was emitted");
}

for (const key of [
  "governance_receipt_linkage",
  "governance_decision_record_linkage",
  "governance_outcome_bundle_linkage",
  "governance_application_record_linkage",
  "governance_disposition_linkage",
]) {
  if (!(key in allowLinkedRecord)) {
    throw new Error(`activation record should include ${key} when linked artifacts were emitted`);
  }
}

if (!allowRecord.governance_activation.enabled_governance_paths.includes("permit_gate")) {
  throw new Error("activation record should always include permit_gate in enabled paths");
}
if (allowRecord.governance_activation.enabled_governance_paths.length !== 1) {
  throw new Error("activation record should only include permit_gate when no optional artifacts were emitted");
}

for (const pathName of [
  "permit_gate",
  "governance_receipt",
  "governance_decision_record",
  "governance_outcome_bundle",
  "governance_application_record",
  "governance_disposition",
]) {
  if (!allowLinkedRecord.governance_activation.enabled_governance_paths.includes(pathName)) {
    throw new Error(`activation record should include ${pathName} in enabled paths when emitted`);
  }
}

if (allowLinkedRecord.governance_disposition_linkage.consumer_surface !== "guard.audit") {
  throw new Error("activation record disposition linkage consumer surface mismatch");
}
if (allowLinkedRecord.governance_disposition_linkage.disposition_source !== "permit_gate_application") {
  throw new Error("activation record disposition linkage source mismatch");
}
if (allowLinkedRecord.canonical_action_hash !== allowDisposition.canonical_action_hash) {
  throw new Error("activation record disposition linkage canonical action mismatch");
}

if (allowRecord.governance_activation.outcome !== "allow") {
  throw new Error("activation record allow path did not produce allow outcome");
}
if (allowRecord.permit_gate_result.decision !== "allow") {
  throw new Error("activation record allow path permit linkage mismatch");
}

if (denyRecord.governance_activation.outcome !== "deny") {
  throw new Error("activation record deny path did not produce deny outcome");
}
if (denyRecord.governance_activation.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("activation record deny path exit code mismatch");
}
if (denyRecord.permit_gate_result.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("activation record deny path permit linkage exit code mismatch");
}

process.stdout.write("governance activation record verified\n");
