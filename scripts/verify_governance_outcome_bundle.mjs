import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runAudit } from "../packages/guard/src/runAudit.mjs";
import {
  GOVERNANCE_OUTCOME_BUNDLE_KIND,
  GOVERNANCE_OUTCOME_BUNDLE_VERSION,
  GOVERNANCE_OUTCOME_BUNDLE_SCHEMA_ID,
  GOVERNANCE_OUTCOME_BUNDLE_MODE,
  GOVERNANCE_OUTCOME_BUNDLE_BOUNDARY,
  GOVERNANCE_OUTCOME_BUNDLE_CONSUMER_SURFACE,
  GOVERNANCE_OUTCOME_BUNDLE_EMITTER_SURFACE,
  validateGovernanceOutcomeBundle,
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
    id: "governance-outcome-bundle-deny-unknown",
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
const allowOut = path.join(tmp, "mindforge-governance-outcome-bundle-allow.json");
const denyOut = path.join(tmp, "mindforge-governance-outcome-bundle-deny.json");
const allowReceiptOut = path.join(tmp, "mindforge-governance-outcome-bundle-receipt.json");
const allowDecisionOut = path.join(tmp, "mindforge-governance-outcome-bundle-decision.json");
const allowBundleWithLinksOut = path.join(tmp, "mindforge-governance-outcome-bundle-with-links.json");
const invalidBundleDir = path.join(tmp, "mindforge-governance-outcome-bundle-dir");

for (const filePath of [allowOut, denyOut, allowReceiptOut, allowDecisionOut, allowBundleWithLinksOut]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}
fs.mkdirSync(invalidBundleDir, { recursive: true });

const missingFlag = await runAudit({
  argv: [".", "--staged", `--governance-outcome-bundle-out=${allowOut}`],
  policy: basePolicy(),
});

if (!String(missingFlag?.message || "").includes("governance outcome bundle output requires --permit-gate")) {
  throw new Error("governance outcome bundle should require --permit-gate");
}

const invalidOut = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-outcome-bundle-out=${invalidBundleDir}`],
  policy: basePolicy(),
});

if (!String(invalidOut?.message || "").includes("governance bridge or permit gate preparation failed")) {
  throw new Error("governance outcome bundle should fail closed for invalid output paths");
}

const baseline = await runAudit({
  argv: [".", "--staged"],
  policy: basePolicy(),
});

const allow = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-outcome-bundle-out=${allowOut}`],
  policy: basePolicy(),
});

const allowWithLinks = await runAudit({
  argv: [
    ".",
    "--staged",
    "--permit-gate",
    `--governance-receipt-out=${allowReceiptOut}`,
    `--governance-decision-record-out=${allowDecisionOut}`,
    `--governance-outcome-bundle-out=${allowBundleWithLinksOut}`,
  ],
  policy: basePolicy(),
});

const deny = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--governance-outcome-bundle-out=${denyOut}`],
  policy: denyPolicy(),
});

for (const result of [baseline, allow, allowWithLinks, deny]) {
  if (!result?.audit) {
    throw new Error(`governance outcome bundle audit failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(allow.audit))) {
  throw new Error("outcome bundle allow path changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(allowWithLinks.audit))) {
  throw new Error("outcome bundle linked allow path changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(deny.audit))) {
  throw new Error("outcome bundle deny path changed the audit main output");
}

if (allow.exitCode !== 0) {
  throw new Error(`outcome bundle allow path should pass, got exit ${allow.exitCode}`);
}
if (allowWithLinks.exitCode !== 0) {
  throw new Error(`outcome bundle linked allow path should pass, got exit ${allowWithLinks.exitCode}`);
}
if (deny.exitCode !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error(`outcome bundle deny path should exit ${PERMIT_GATE_DENIED_EXIT_CODE}, got ${deny.exitCode}`);
}

const allowBundle = readJson(allowOut);
const allowLinkedBundle = readJson(allowBundleWithLinksOut);
const denyBundle = readJson(denyOut);

for (const bundle of [allowBundle, allowLinkedBundle, denyBundle]) {
  const validation = validateGovernanceOutcomeBundle(bundle);
  if (!validation.ok) {
    throw new Error(`governance outcome bundle validation failed: ${validation.errors.join("; ")}`);
  }
  if (bundle.kind !== GOVERNANCE_OUTCOME_BUNDLE_KIND) {
    throw new Error("governance outcome bundle kind mismatch");
  }
  if (bundle.version !== GOVERNANCE_OUTCOME_BUNDLE_VERSION) {
    throw new Error("governance outcome bundle version mismatch");
  }
  if (bundle.schema_id !== GOVERNANCE_OUTCOME_BUNDLE_SCHEMA_ID) {
    throw new Error("governance outcome bundle schema_id mismatch");
  }
  if (bundle.enforcing !== false) {
    throw new Error("governance outcome bundle must remain non-enforcing");
  }
  if (bundle.bundle.mode !== GOVERNANCE_OUTCOME_BUNDLE_MODE) {
    throw new Error("governance outcome bundle mode mismatch");
  }
  if (bundle.bundle.boundary !== GOVERNANCE_OUTCOME_BUNDLE_BOUNDARY) {
    throw new Error("governance outcome bundle boundary mismatch");
  }
  if (bundle.bundle.consumer_surface !== GOVERNANCE_OUTCOME_BUNDLE_CONSUMER_SURFACE) {
    throw new Error("governance outcome bundle consumer surface mismatch");
  }
  if (bundle.bundle.audit_output_preserved !== true) {
    throw new Error("governance outcome bundle must preserve audit output semantics");
  }
  if (bundle.traceability.emitted_by !== GOVERNANCE_OUTCOME_BUNDLE_EMITTER_SURFACE) {
    throw new Error("governance outcome bundle emitter surface mismatch");
  }
}

if ("governance_receipt_linkage" in allowBundle) {
  throw new Error("outcome bundle should not include receipt linkage when no receipt was emitted");
}
if ("governance_decision_record_linkage" in allowBundle) {
  throw new Error("outcome bundle should not include decision linkage when no decision record was emitted");
}

if (!("governance_receipt_linkage" in allowLinkedBundle)) {
  throw new Error("outcome bundle should include receipt linkage when receipt was emitted");
}
if (!("governance_decision_record_linkage" in allowLinkedBundle)) {
  throw new Error("outcome bundle should include decision linkage when decision record was emitted");
}

if (allowBundle.permit_gate_result.decision !== "allow") {
  throw new Error("outcome bundle allow path permit linkage mismatch");
}
if (allowBundle.bundle.exit_code !== 0) {
  throw new Error("outcome bundle allow path exit code mismatch");
}
if (denyBundle.permit_gate_result.decision !== "deny") {
  throw new Error("outcome bundle deny path permit linkage mismatch");
}
if (denyBundle.bundle.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("outcome bundle deny path exit code mismatch");
}

process.stdout.write("governance outcome bundle verified\n");
