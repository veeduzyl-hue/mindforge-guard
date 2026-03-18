import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runAudit } from "../packages/guard/src/runAudit.mjs";
import {
  GOVERNANCE_DISPOSITION_KIND,
  GOVERNANCE_DISPOSITION_VERSION,
  GOVERNANCE_DISPOSITION_SCHEMA_ID,
  GOVERNANCE_DISPOSITION_CONSUMER_SURFACE,
  GOVERNANCE_DISPOSITION_PRODUCER_SURFACE,
  GOVERNANCE_DISPOSITION_MODE,
  GOVERNANCE_DISPOSITION_SOURCE,
  GOVERNANCE_DISPOSITION_BOUNDARY,
  GOVERNANCE_DISPOSITION_EMITTER_SURFACE,
  validateGovernanceDisposition,
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
    id: "governance-disposition-deny-unknown",
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
const allowOut = path.join(tmp, "mindforge-governance-disposition-allow.json");
const denyOut = path.join(tmp, "mindforge-governance-disposition-deny.json");
const allowReceiptOut = path.join(tmp, "mindforge-governance-disposition-receipt.json");
const allowDecisionOut = path.join(tmp, "mindforge-governance-disposition-decision.json");
const allowBundleOut = path.join(tmp, "mindforge-governance-disposition-bundle.json");
const allowApplicationOut = path.join(tmp, "mindforge-governance-disposition-application.json");
const allowLinkedOut = path.join(tmp, "mindforge-governance-disposition-linked.json");
const invalidDispositionDir = path.join(tmp, "mindforge-governance-disposition-dir");

for (const filePath of [
  allowOut,
  denyOut,
  allowReceiptOut,
  allowDecisionOut,
  allowBundleOut,
  allowApplicationOut,
  allowLinkedOut,
]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}
fs.mkdirSync(invalidDispositionDir, { recursive: true });

const missingFlag = await runAudit({
  argv: [".", "--staged", `--governance-disposition-out=${allowOut}`],
  policy: basePolicy(),
});

if (!String(missingFlag?.message || "").includes("governance disposition output requires --permit-gate")) {
  throw new Error("governance disposition should require --permit-gate");
}

const missingPath = await runAudit({
  argv: [".", "--staged", "--permit-gate", "--governance-disposition-out"],
  policy: basePolicy(),
});

if (!String(missingPath?.message || "").includes("governance disposition output requires a file path")) {
  throw new Error("governance disposition should fail closed for missing output paths");
}

const invalidOut = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-disposition-out=${invalidDispositionDir}`],
  policy: basePolicy(),
});

if (!String(invalidOut?.message || "").includes("governance bridge or permit gate preparation failed")) {
  throw new Error("governance disposition should fail closed for invalid output paths");
}

const baseline = await runAudit({
  argv: [".", "--staged"],
  policy: basePolicy(),
});

const allow = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-disposition-out=${allowOut}`],
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
    `--governance-disposition-out=${allowLinkedOut}`,
  ],
  policy: basePolicy(),
});

const deny = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-disposition-out=${denyOut}`],
  policy: denyPolicy(),
});

for (const result of [baseline, allow, allowWithLinks, deny]) {
  if (!result?.audit) {
    throw new Error(`governance disposition audit failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(allow.audit))) {
  throw new Error("governance disposition allow path changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(allowWithLinks.audit))) {
  throw new Error("governance disposition linked allow path changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(deny.audit))) {
  throw new Error("governance disposition deny path changed the audit main output");
}

if (allow.exitCode !== 0) {
  throw new Error(`governance disposition allow path should pass, got exit ${allow.exitCode}`);
}
if (allowWithLinks.exitCode !== 0) {
  throw new Error(`governance disposition linked allow path should pass, got exit ${allowWithLinks.exitCode}`);
}
if (deny.exitCode !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error(`governance disposition deny path should exit ${PERMIT_GATE_DENIED_EXIT_CODE}, got ${deny.exitCode}`);
}

const allowDisposition = readJson(allowOut);
const allowLinkedDisposition = readJson(allowLinkedOut);
const denyDisposition = readJson(denyOut);
const allowReceipt = readJson(allowReceiptOut);
const allowDecisionRecord = readJson(allowDecisionOut);
const allowOutcomeBundle = readJson(allowBundleOut);
const allowApplicationRecord = readJson(allowApplicationOut);

for (const disposition of [allowDisposition, allowLinkedDisposition, denyDisposition]) {
  const validation = validateGovernanceDisposition(disposition);
  if (!validation.ok) {
    throw new Error(`governance disposition validation failed: ${validation.errors.join("; ")}`);
  }
  if (disposition.kind !== GOVERNANCE_DISPOSITION_KIND) {
    throw new Error("governance disposition kind mismatch");
  }
  if (disposition.version !== GOVERNANCE_DISPOSITION_VERSION) {
    throw new Error("governance disposition version mismatch");
  }
  if (disposition.schema_id !== GOVERNANCE_DISPOSITION_SCHEMA_ID) {
    throw new Error("governance disposition schema_id mismatch");
  }
  if (disposition.enforcing !== false) {
    throw new Error("governance disposition must remain non-enforcing");
  }
  if (disposition.governance_disposition.consumer_surface !== GOVERNANCE_DISPOSITION_CONSUMER_SURFACE) {
    throw new Error("governance disposition consumer surface mismatch");
  }
  if (disposition.governance_disposition.producer_surface !== GOVERNANCE_DISPOSITION_PRODUCER_SURFACE) {
    throw new Error("governance disposition producer surface mismatch");
  }
  if (disposition.governance_disposition.disposition_mode !== GOVERNANCE_DISPOSITION_MODE) {
    throw new Error("governance disposition mode mismatch");
  }
  if (disposition.governance_disposition.disposition_source !== GOVERNANCE_DISPOSITION_SOURCE) {
    throw new Error("governance disposition source mismatch");
  }
  if (disposition.governance_disposition.result_boundary !== GOVERNANCE_DISPOSITION_BOUNDARY) {
    throw new Error("governance disposition result boundary mismatch");
  }
  if (disposition.governance_disposition.audit_output_preserved !== true) {
    throw new Error("governance disposition must preserve audit output semantics");
  }
  if (disposition.traceability.emitted_by !== GOVERNANCE_DISPOSITION_EMITTER_SURFACE) {
    throw new Error("governance disposition emitter surface mismatch");
  }
}

if ("governance_receipt_linkage" in allowDisposition) {
  throw new Error("governance disposition should not include receipt linkage when no receipt was emitted");
}
if ("governance_decision_record_linkage" in allowDisposition) {
  throw new Error("governance disposition should not include decision linkage when no decision record was emitted");
}
if ("governance_outcome_bundle_linkage" in allowDisposition) {
  throw new Error("governance disposition should not include outcome bundle linkage when no outcome bundle was emitted");
}
if ("governance_application_record_linkage" in allowDisposition) {
  throw new Error("governance disposition should not include application linkage when no application record was emitted");
}

if (!("governance_receipt_linkage" in allowLinkedDisposition)) {
  throw new Error("governance disposition should include receipt linkage when receipt was emitted");
}
if (!("governance_decision_record_linkage" in allowLinkedDisposition)) {
  throw new Error("governance disposition should include decision linkage when decision record was emitted");
}
if (!("governance_outcome_bundle_linkage" in allowLinkedDisposition)) {
  throw new Error("governance disposition should include outcome bundle linkage when outcome bundle was emitted");
}
if (!("governance_application_record_linkage" in allowLinkedDisposition)) {
  throw new Error("governance disposition should include application linkage when application record was emitted");
}

if (allowLinkedDisposition.canonical_action_hash !== allowReceipt.canonical_action_hash) {
  throw new Error("governance disposition receipt linkage should preserve canonical action identity");
}
if (allowLinkedDisposition.canonical_action_hash !== allowDecisionRecord.canonical_action_hash) {
  throw new Error("governance disposition decision linkage should preserve canonical action identity");
}
if (allowLinkedDisposition.canonical_action_hash !== allowOutcomeBundle.canonical_action_hash) {
  throw new Error("governance disposition outcome bundle linkage should preserve canonical action identity");
}
if (allowLinkedDisposition.canonical_action_hash !== allowApplicationRecord.canonical_action_hash) {
  throw new Error("governance disposition application linkage should preserve canonical action identity");
}

if (
  allowLinkedDisposition.governance_receipt_linkage.consumer_surface !==
  allowReceipt.governance_receipt.consumer_surface
) {
  throw new Error("governance disposition receipt linkage consumer surface mismatch");
}

if (
  allowLinkedDisposition.governance_decision_record_linkage.consumer_surface !==
  allowDecisionRecord.governance_decision.consumer_surface
) {
  throw new Error("governance disposition decision record linkage consumer surface mismatch");
}

if (
  allowLinkedDisposition.governance_application_record_linkage.consumer_surface !==
  allowApplicationRecord.governance_application.consumer_surface
) {
  throw new Error("governance disposition application linkage consumer surface mismatch");
}

if (
  allowLinkedDisposition.governance_application_record_linkage.applied_source !==
  allowApplicationRecord.governance_application.applied_source
) {
  throw new Error("governance disposition application linkage applied source mismatch");
}

if (
  allowLinkedDisposition.permit_gate_result.source_decision !==
  allowOutcomeBundle.permit_gate_result.source_decision
) {
  throw new Error("governance disposition outcome bundle linkage source decision mismatch");
}

if (allowDisposition.governance_disposition.outcome !== "allow") {
  throw new Error("governance disposition allow path did not produce allow outcome");
}
if (allowDisposition.governance_disposition.applied_outcome !== "allow") {
  throw new Error("governance disposition allow path applied outcome mismatch");
}
if (allowDisposition.permit_gate_result.decision !== "allow") {
  throw new Error("governance disposition allow path permit linkage mismatch");
}

if (denyDisposition.governance_disposition.outcome !== "deny") {
  throw new Error("governance disposition deny path did not produce deny outcome");
}
if (denyDisposition.governance_disposition.applied_outcome !== "deny") {
  throw new Error("governance disposition deny path applied outcome mismatch");
}
if (denyDisposition.governance_disposition.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("governance disposition deny path exit code mismatch");
}
if (denyDisposition.permit_gate_result.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("governance disposition deny path permit linkage exit code mismatch");
}
if (denyDisposition.governance_disposition.audit_output_preserved !== true) {
  throw new Error("governance disposition deny path must preserve audit output semantics");
}

process.stdout.write("governance disposition verified\n");
