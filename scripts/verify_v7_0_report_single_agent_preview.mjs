import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { runGuard } from "../packages/guard/src/runGuard.mjs";

const REQUIRED_TOP_LEVEL_FIELDS = [
  "object_type",
  "object_version",
  "report_mode",
  "generated_at",
  "agent_identity",
  "capability_boundary",
  "authority_envelope",
  "execution_path_snapshot",
  "proposed_action",
  "policy_evaluation_preview",
  "findings",
  "review_evidence",
  "artifact_provenance",
  "pre_v6_14_capability_foundation",
  "action_summary",
  "intent_summary",
  "authority_summary",
  "evidence_summary",
  "admissibility_summary",
  "risk_summary",
  "drift_summary",
  "guardrail_mapping_summary",
  "transition_summary",
  "procedural_receipt_summary",
  "lineage_summary",
  "review_posture",
  "receipt_refs",
  "deterministic_hash",
  "non_enforcement_boundary"
];

const FORBIDDEN_KEYS = new Set([
  "approval_status",
  "merge_allowed",
  "deployment_allowed",
  "execution_authority_granted",
  "compliance_certified",
  "legal_compliance_result",
  "maturity_certified",
  "safe_to_merge",
  "safe_to_deploy"
]);

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

async function runCli(args) {
  return runGuard({ argv: args });
}

function parseJsonOutput(result, label) {
  try {
    return JSON.parse(result.stdout || "{}");
  } catch (error) {
    fail(`${label} must emit valid JSON (${error.message})`);
  }
}

function walk(value, visit, currentPath = "") {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => walk(entry, visit, `${currentPath}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      const nextPath = currentPath ? `${currentPath}.${key}` : key;
      visit(key, entry, nextPath);
      walk(entry, visit, nextPath);
    }
  }
}

function assertNoForbiddenOutputFields(summary, label) {
  walk(summary, (key, _entry, entryPath) => {
    expect(!FORBIDDEN_KEYS.has(key), `${label} must not contain forbidden key ${entryPath}`);
  });
}

function assertCanonicalReportOutput(output, label) {
  for (const fieldName of REQUIRED_TOP_LEVEL_FIELDS) {
    expect(fieldName in output, `${label} must contain ${fieldName}`);
  }
  expect(output.object_type === "single_agent_governance_report_preview", `${label} object_type mismatch`);
  expect(output.object_version === "v1", `${label} object_version mismatch`);
  expect(output.report_mode === "preview", `${label} report_mode mismatch`);
  expect(Array.isArray(output.findings), `${label} findings must be an array`);
  expect(Array.isArray(output.receipt_refs) && output.receipt_refs.length >= 1, `${label} receipt_refs mismatch`);
  expect(typeof output.deterministic_hash === "string" && output.deterministic_hash.length >= 1, `${label} deterministic_hash mismatch`);
  expect(output.authority_envelope?.approval_granted === false, `${label} authority_envelope.approval_granted mismatch`);
  expect(
    output.authority_envelope?.execution_permission_granted === false,
    `${label} authority_envelope.execution_permission_granted mismatch`
  );
  expect(output.authority_envelope?.blocking_effect === false, `${label} authority_envelope.blocking_effect mismatch`);
  expect(output.authority_envelope?.merge_authority === false, `${label} authority_envelope.merge_authority mismatch`);
  expect(
    output.authority_envelope?.deployment_authority === false,
    `${label} authority_envelope.deployment_authority mismatch`
  );
  expect(
    output.non_enforcement_boundary?.message ===
      "Pack-backed single-agent report preview is evidence-readiness and review output only. It does not approve, block, merge, deploy, certify, or execute.",
    `${label} non_enforcement_boundary message mismatch`
  );
  expect(output.non_enforcement_boundary?.approval_granted === false, `${label} non_enforcement_boundary.approval_granted mismatch`);
  expect(
    output.non_enforcement_boundary?.execution_permission_granted === false,
    `${label} non_enforcement_boundary.execution_permission_granted mismatch`
  );
  expect(
    output.non_enforcement_boundary?.blocking_effect === false,
    `${label} non_enforcement_boundary.blocking_effect mismatch`
  );
  expect(
    output.non_enforcement_boundary?.merge_authority === false,
    `${label} non_enforcement_boundary.merge_authority mismatch`
  );
  expect(
    output.non_enforcement_boundary?.deployment_authority === false,
    `${label} non_enforcement_boundary.deployment_authority mismatch`
  );
  expect(
    output.non_enforcement_boundary?.enforcement_action === "none",
    `${label} non_enforcement_boundary.enforcement_action mismatch`
  );
  expect(
    output.non_enforcement_boundary?.legal_compliance_claim === false,
    `${label} non_enforcement_boundary.legal_compliance_claim mismatch`
  );
  assertNoForbiddenOutputFields(output, label);
}

async function assertVerifierStillPasses(repoRoot, verifierName) {
  const verifierPath = path.join(repoRoot, "scripts", verifierName);
  const originalConsoleLog = console.log;

  try {
    console.log = () => {};
    await import(`${pathToFileURL(verifierPath).href}?report_single_agent_preview_check=1`);
  } catch (error) {
    fail(`${verifierName} must still pass (${error.message})`);
  } finally {
    console.log = originalConsoleLog;
  }
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const validPack = "fixtures/single_agent_governance_pack_parser_preview/valid_pack";
  const limitationPack = "fixtures/single_agent_governance_pack_parser_preview/limitation_recommended_missing_pack";
  const missingFilePack = "fixtures/single_agent_governance_pack_parser_preview/missing_required_file_pack";
  const missingFieldPack = "fixtures/single_agent_governance_pack_parser_preview/missing_required_field_pack";
  const malformedPack = "fixtures/single_agent_governance_pack_parser_preview/malformed_json_pack";
  const examplePack = "examples/single-agent-governance-pack/hr-self-service-agent";

  const exampleResult = await runCli(["report", "single-agent", "--pack", examplePack, "--preview", "--json"]);
  const exampleOutput = parseJsonOutput(exampleResult, "example pack");
  expect(exampleResult.exitCode === 0, "example pack exit code mismatch");
  assertCanonicalReportOutput(exampleOutput, "example pack");

  const validResult = await runCli(["report", "single-agent", "--pack", validPack, "--preview", "--json"]);
  const validOutput = parseJsonOutput(validResult, "valid pack");
  expect(validResult.exitCode === 0, "valid pack exit code mismatch");
  expect(validOutput.review_posture === "ready_for_review", "valid pack review_posture mismatch");
  assertCanonicalReportOutput(validOutput, "valid pack");

  const validRepeatResult = await runCli(["report", "single-agent", "--pack", validPack, "--preview", "--json"]);
  const validRepeatOutput = parseJsonOutput(validRepeatResult, "valid pack repeat");
  expect(
    validOutput.deterministic_hash === validRepeatOutput.deterministic_hash,
    "valid pack deterministic_hash must remain stable"
  );

  const limitationResult = await runCli(["report", "single-agent", "--pack", limitationPack, "--preview", "--json"]);
  const limitationOutput = parseJsonOutput(limitationResult, "limitation pack");
  expect(limitationResult.exitCode === 2, "limitation pack exit code mismatch");
  expect(limitationOutput.review_posture === "needs_human_review", "limitation pack review_posture mismatch");
  assertCanonicalReportOutput(limitationOutput, "limitation pack");
  expect(
    limitationOutput.findings.some((finding) => finding.category === "limitation"),
    "limitation pack must surface limitation findings"
  );

  const missingFileResult = await runCli(["report", "single-agent", "--pack", missingFilePack, "--preview", "--json"]);
  const missingFileOutput = parseJsonOutput(missingFileResult, "missing required file pack");
  expect(missingFileResult.exitCode === 3, "missing required file pack exit code mismatch");
  expect(
    missingFileOutput.review_posture === "insufficient_evidence",
    "missing required file pack review_posture mismatch"
  );
  assertCanonicalReportOutput(missingFileOutput, "missing required file pack");
  expect(
    missingFileOutput.findings.some((finding) => finding.category === "omission"),
    "missing required file pack must surface omission findings"
  );

  const missingFieldResult = await runCli(["report", "single-agent", "--pack", missingFieldPack, "--preview", "--json"]);
  const missingFieldOutput = parseJsonOutput(missingFieldResult, "missing required field pack");
  expect(missingFieldResult.exitCode === 3, "missing required field pack exit code mismatch");
  expect(
    missingFieldOutput.review_posture === "insufficient_evidence",
    "missing required field pack review_posture mismatch"
  );
  assertCanonicalReportOutput(missingFieldOutput, "missing required field pack");
  expect(
    missingFieldOutput.findings.some((finding) => finding.category === "omission"),
    "missing required field pack must surface omission findings"
  );

  const malformedResult = await runCli(["report", "single-agent", "--pack", malformedPack, "--preview", "--json"]);
  const malformedOutput = parseJsonOutput(malformedResult, "malformed pack");
  expect(malformedResult.exitCode === 4, "malformed pack exit code mismatch");
  expect(malformedOutput.ok === false, "malformed pack must emit error JSON");
  expect(
    malformedOutput.error?.kind === "single_agent_report_preview_pack_invalid",
    "malformed pack error kind mismatch"
  );

  await assertVerifierStillPasses(repoRoot, "verify_v7_0_single_agent_governance_report_cli_preview.mjs");
  await assertVerifierStillPasses(repoRoot, "verify_v7_0_cli_pack_validate_preview.mjs");

  console.log("PASS: v7.0 report single-agent preview validated.");
}

await main();
