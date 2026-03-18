import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runAudit } from "../packages/guard/src/runAudit.mjs";
import {
  GOVERNANCE_APPLICATION_RECORD_KIND,
  GOVERNANCE_APPLICATION_RECORD_VERSION,
  GOVERNANCE_APPLICATION_RECORD_SCHEMA_ID,
  GOVERNANCE_APPLICATION_RECORD_CONSUMER_SURFACE,
  GOVERNANCE_APPLICATION_RECORD_PRODUCER_SURFACE,
  GOVERNANCE_APPLICATION_RECORD_MODE,
  GOVERNANCE_APPLICATION_RECORD_SOURCE,
  GOVERNANCE_APPLICATION_RECORD_BOUNDARY,
  GOVERNANCE_APPLICATION_RECORD_EMITTER_SURFACE,
  validateGovernanceApplicationRecord,
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
    id: "governance-application-record-deny-unknown",
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
const allowOut = path.join(tmp, "mindforge-governance-application-record-allow.json");
const denyOut = path.join(tmp, "mindforge-governance-application-record-deny.json");
const allowReceiptOut = path.join(tmp, "mindforge-governance-application-record-receipt.json");
const allowDecisionOut = path.join(tmp, "mindforge-governance-application-record-decision.json");
const allowBundleOut = path.join(tmp, "mindforge-governance-application-record-bundle.json");
const allowLinkedOut = path.join(tmp, "mindforge-governance-application-record-linked.json");
const invalidRecordDir = path.join(tmp, "mindforge-governance-application-record-dir");

for (const filePath of [
  allowOut,
  denyOut,
  allowReceiptOut,
  allowDecisionOut,
  allowBundleOut,
  allowLinkedOut,
]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}
fs.mkdirSync(invalidRecordDir, { recursive: true });

const missingFlag = await runAudit({
  argv: [".", "--staged", `--governance-application-record-out=${allowOut}`],
  policy: basePolicy(),
});

if (
  !String(missingFlag?.message || "").includes("governance application record output requires --permit-gate")
) {
  throw new Error("governance application record should require --permit-gate");
}

const missingPath = await runAudit({
  argv: [".", "--staged", "--permit-gate", "--governance-application-record-out"],
  policy: basePolicy(),
});

if (
  !String(missingPath?.message || "").includes("governance application record output requires a file path")
) {
  throw new Error("governance application record should fail closed for missing output paths");
}

const invalidOut = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-application-record-out=${invalidRecordDir}`],
  policy: basePolicy(),
});

if (!String(invalidOut?.message || "").includes("governance bridge or permit gate preparation failed")) {
  throw new Error("governance application record should fail closed for invalid output paths");
}

const baseline = await runAudit({
  argv: [".", "--staged"],
  policy: basePolicy(),
});

const allow = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-application-record-out=${allowOut}`],
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
    `--governance-application-record-out=${allowLinkedOut}`,
  ],
  policy: basePolicy(),
});

const deny = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-application-record-out=${denyOut}`],
  policy: denyPolicy(),
});

for (const result of [baseline, allow, allowWithLinks, deny]) {
  if (!result?.audit) {
    throw new Error(`governance application record audit failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(allow.audit))) {
  throw new Error("application record allow path changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(allowWithLinks.audit))) {
  throw new Error("application record linked allow path changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(deny.audit))) {
  throw new Error("application record deny path changed the audit main output");
}

if (allow.exitCode !== 0) {
  throw new Error(`application record allow path should pass, got exit ${allow.exitCode}`);
}
if (allowWithLinks.exitCode !== 0) {
  throw new Error(`application record linked allow path should pass, got exit ${allowWithLinks.exitCode}`);
}
if (deny.exitCode !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error(
    `application record deny path should exit ${PERMIT_GATE_DENIED_EXIT_CODE}, got ${deny.exitCode}`
  );
}

const allowRecord = readJson(allowOut);
const allowLinkedRecord = readJson(allowLinkedOut);
const denyRecord = readJson(denyOut);

for (const record of [allowRecord, allowLinkedRecord, denyRecord]) {
  const validation = validateGovernanceApplicationRecord(record);
  if (!validation.ok) {
    throw new Error(`governance application record validation failed: ${validation.errors.join("; ")}`);
  }
  if (record.kind !== GOVERNANCE_APPLICATION_RECORD_KIND) {
    throw new Error("governance application record kind mismatch");
  }
  if (record.version !== GOVERNANCE_APPLICATION_RECORD_VERSION) {
    throw new Error("governance application record version mismatch");
  }
  if (record.schema_id !== GOVERNANCE_APPLICATION_RECORD_SCHEMA_ID) {
    throw new Error("governance application record schema id mismatch");
  }
  if (record.enforcing !== false) {
    throw new Error("governance application record must remain non-enforcing");
  }
  if (record.governance_application.consumer_surface !== GOVERNANCE_APPLICATION_RECORD_CONSUMER_SURFACE) {
    throw new Error("governance application record consumer surface mismatch");
  }
  if (record.governance_application.producer_surface !== GOVERNANCE_APPLICATION_RECORD_PRODUCER_SURFACE) {
    throw new Error("governance application record producer surface mismatch");
  }
  if (record.governance_application.application_mode !== GOVERNANCE_APPLICATION_RECORD_MODE) {
    throw new Error("governance application record application mode mismatch");
  }
  if (record.governance_application.application_source !== GOVERNANCE_APPLICATION_RECORD_SOURCE) {
    throw new Error("governance application record application source mismatch");
  }
  if (record.governance_application.result_boundary !== GOVERNANCE_APPLICATION_RECORD_BOUNDARY) {
    throw new Error("governance application record result boundary mismatch");
  }
  if (record.governance_application.audit_output_preserved !== true) {
    throw new Error("governance application record must preserve audit output semantics");
  }
  if (record.traceability.emitted_by !== GOVERNANCE_APPLICATION_RECORD_EMITTER_SURFACE) {
    throw new Error("governance application record emitter surface mismatch");
  }
}

if ("governance_receipt_linkage" in allowRecord) {
  throw new Error("application record should not include receipt linkage when no receipt was emitted");
}
if ("governance_decision_record_linkage" in allowRecord) {
  throw new Error("application record should not include decision record linkage when none was emitted");
}
if ("governance_outcome_bundle_linkage" in allowRecord) {
  throw new Error("application record should not include outcome bundle linkage when none was emitted");
}

if (!("governance_receipt_linkage" in allowLinkedRecord)) {
  throw new Error("application record should include receipt linkage when receipt was emitted");
}
if (!("governance_decision_record_linkage" in allowLinkedRecord)) {
  throw new Error("application record should include decision record linkage when decision record was emitted");
}
if (!("governance_outcome_bundle_linkage" in allowLinkedRecord)) {
  throw new Error("application record should include outcome bundle linkage when bundle was emitted");
}
if (allowLinkedRecord.governance_receipt_linkage.producer_surface !== "guard.audit") {
  throw new Error("application record receipt linkage producer surface mismatch");
}
if (allowLinkedRecord.governance_decision_record_linkage.producer_surface !== "guard.audit") {
  throw new Error("application record decision record linkage producer surface mismatch");
}
if (allowLinkedRecord.governance_decision_record_linkage.decision_source !== "permit_gate") {
  throw new Error("application record decision record linkage source mismatch");
}
if (allowLinkedRecord.governance_outcome_bundle_linkage.consumer_surface !== "guard.audit") {
  throw new Error("application record outcome bundle linkage consumer surface mismatch");
}
if (allowLinkedRecord.governance_outcome_bundle_linkage.producer_surface !== "guard.audit") {
  throw new Error("application record outcome bundle linkage producer surface mismatch");
}
if (allowLinkedRecord.governance_outcome_bundle_linkage.boundary !== "parallel_artifact") {
  throw new Error("application record outcome bundle linkage boundary mismatch");
}

if (allowRecord.governance_application.outcome !== "allow") {
  throw new Error("application record allow path did not produce allow outcome");
}
if (allowRecord.governance_application.applied_outcome !== "allow") {
  throw new Error("application record allow path applied outcome mismatch");
}
if (allowRecord.governance_application.applied_source !== "insufficient_signal") {
  throw new Error("application record allow path applied source mismatch");
}
if (allowRecord.permit_gate_result.decision !== "allow") {
  throw new Error("application record allow path permit linkage mismatch");
}
if (allowRecord.permit_gate_result.audit_output_preserved !== true) {
  throw new Error("application record allow path must preserve audit output semantics");
}

if (denyRecord.governance_application.outcome !== "deny") {
  throw new Error("application record deny path did not produce deny outcome");
}
if (denyRecord.governance_application.applied_outcome !== "deny") {
  throw new Error("application record deny path applied outcome mismatch");
}
if (denyRecord.governance_application.applied_source !== "would_deny") {
  throw new Error("application record deny path applied source mismatch");
}
if (denyRecord.governance_application.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("application record deny path exit code mismatch");
}
if (denyRecord.permit_gate_result.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("application record deny path permit linkage exit code mismatch");
}
if (denyRecord.permit_gate_result.audit_output_preserved !== true) {
  throw new Error("application record deny path must preserve audit output semantics");
}

process.stdout.write("governance application record verified\n");
