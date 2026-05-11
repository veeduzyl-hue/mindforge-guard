import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { runGuard } from "../packages/guard/src/runGuard.mjs";
import { parseSingleAgentGovernancePackPreview } from "../packages/guard/src/productization/single_agent_pack_parser_preview.mjs";

const REPORT_REQUIRED_FIELDS = [
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

const FORBIDDEN_TOP_LEVEL_KEYS = new Set([
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

const EXISTING_VERIFIERS = [
  "verify_v7_0_single_agent_governance_report_preview.mjs",
  "verify_v7_0_single_agent_governance_report_cli_preview.mjs",
  "verify_v7_0_single_agent_governance_report_final_acceptance.mjs",
  "verify_v7_0_single_agent_governance_pack_preview.mjs",
  "verify_v7_0_example_evidence_pack.mjs",
  "verify_v7_0_pack_parser_preview.mjs",
  "verify_v7_0_cli_pack_validate_preview.mjs",
  "verify_v7_0_report_single_agent_preview.mjs"
];

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

function assertNoPackValidateForbiddenKeys(output, label) {
  const forbiddenKeys = new Set([
    "enforcement_action",
    "approval_status",
    "blocking_effect",
    "merge_allowed",
    "deployment_allowed",
    "execution_authority_granted",
    "compliance_certified",
    "legal_compliance_result",
    "maturity_certified",
    "safe_to_merge",
    "safe_to_deploy"
  ]);

  walk(output, (key, _entry, entryPath) => {
    expect(!forbiddenKeys.has(key), `${label} must not contain forbidden key ${entryPath}`);
  });
}

function assertNoReportForbiddenKeys(output, label) {
  walk(output, (key, entry, entryPath) => {
    if (!FORBIDDEN_TOP_LEVEL_KEYS.has(key)) return;
    fail(`${label} must not contain forbidden key ${entryPath}`);
  });

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
}

function assertPackValidateOutput(output, label) {
  expect(output.command === "pack validate", `${label} command mismatch`);
  expect(output.preview === true, `${label} preview mismatch`);
  expect(typeof output.pack_path === "string" && output.pack_path.length >= 1, `${label} pack_path mismatch`);
  expect(typeof output.deterministic_pack_hash === "string", `${label} deterministic_pack_hash mismatch`);
  expect(Array.isArray(output.omissions), `${label} omissions must be an array`);
  expect(Array.isArray(output.limitations), `${label} limitations must be an array`);
  expect(Array.isArray(output.files_checked), `${label} files_checked must be an array`);
  expect(
    output.non_enforcement_boundary?.summary ===
      "Pack validation is evidence-readiness output only. It does not approve, block, merge, deploy, certify, or execute.",
    `${label} non_enforcement_boundary mismatch`
  );
  assertNoPackValidateForbiddenKeys(output, label);
}

function assertReportOutput(output, label) {
  for (const fieldName of REPORT_REQUIRED_FIELDS) {
    expect(fieldName in output, `${label} must contain ${fieldName}`);
  }
  expect(output.object_type === "single_agent_governance_report_preview", `${label} object_type mismatch`);
  expect(output.object_version === "v1", `${label} object_version mismatch`);
  expect(output.report_mode === "preview", `${label} report_mode mismatch`);
  expect(typeof output.deterministic_hash === "string" && output.deterministic_hash.length >= 1, `${label} deterministic_hash mismatch`);
  expect(Array.isArray(output.findings), `${label} findings must be an array`);
  expect(
    output.non_enforcement_boundary?.message ===
      "Pack-backed single-agent report preview is evidence-readiness and review output only. It does not approve, block, merge, deploy, certify, or execute.",
    `${label} non_enforcement_boundary mismatch`
  );
  assertNoReportForbiddenKeys(output, label);
}

async function assertVerifierStillPasses(repoRoot, verifierName) {
  const verifierPath = path.join(repoRoot, "scripts", verifierName);
  const originalConsoleLog = console.log;

  try {
    console.log = () => {};
    await import(`${pathToFileURL(verifierPath).href}?v7_0_e2e_acceptance=1`);
  } catch (error) {
    fail(`${verifierName} must still pass (${error.message})`);
  } finally {
    console.log = originalConsoleLog;
  }
}

function ensurePathAbsent(repoRoot, relativePath) {
  expect(!fs.existsSync(path.join(repoRoot, relativePath)), `${relativePath} must not exist`);
}

function makeTempPackWithSpaces(repoRoot, sourceRelativePath) {
  const sourcePath = path.join(repoRoot, sourceRelativePath);
  const targetPath = path.join(
    os.tmpdir(),
    `mindforge guard temp ${process.pid} ${Date.now()}`,
    "hr self service agent pack"
  );
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.cpSync(sourcePath, targetPath, { recursive: true });
  return targetPath;
}

function cleanupTempPath(targetPath) {
  try {
    fs.rmSync(path.dirname(targetPath), { recursive: true, force: true });
  } catch {}
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  for (const verifierName of EXISTING_VERIFIERS) {
    await assertVerifierStillPasses(repoRoot, verifierName);
  }

  const examplePack = "examples/single-agent-governance-pack/hr-self-service-agent";
  const validPack = "fixtures/single_agent_governance_pack_parser_preview/valid_pack";
  const limitationPack = "fixtures/single_agent_governance_pack_parser_preview/limitation_recommended_missing_pack";
  const missingFilePack = "fixtures/single_agent_governance_pack_parser_preview/missing_required_file_pack";
  const missingFieldPack = "fixtures/single_agent_governance_pack_parser_preview/missing_required_field_pack";
  const malformedPack = "fixtures/single_agent_governance_pack_parser_preview/malformed_json_pack";

  const parserSummary = parseSingleAgentGovernancePackPreview(examplePack);
  expect(parserSummary.omissions.length === 0, "example pack parser preview must have no omissions");

  const validateExampleResult = await runCli(["pack", "validate", "--pack", examplePack, "--preview", "--json"]);
  const validateExampleOutput = parseJsonOutput(validateExampleResult, "example pack validate");
  expect(validateExampleResult.exitCode === 0, "example pack validate exit code mismatch");
  assertPackValidateOutput(validateExampleOutput, "example pack validate");

  const reportExampleResult = await runCli(["report", "single-agent", "--pack", examplePack, "--preview", "--json"]);
  const reportExampleOutput = parseJsonOutput(reportExampleResult, "example report");
  expect(reportExampleResult.exitCode === 0, "example report exit code mismatch");
  assertReportOutput(reportExampleOutput, "example report");
  expect(
    reportExampleOutput.deterministic_hash === validateExampleOutput.deterministic_pack_hash,
    "example report deterministic_hash must align with pack validate deterministic_pack_hash"
  );

  const reportExampleRepeatResult = await runCli(["report", "single-agent", "--pack", examplePack, "--preview", "--json"]);
  const reportExampleRepeatOutput = parseJsonOutput(reportExampleRepeatResult, "example report repeat");
  expect(
    reportExampleOutput.deterministic_hash === reportExampleRepeatOutput.deterministic_hash,
    "example report deterministic_hash must remain stable across repeated runs"
  );

  const validateMissingPreview = await runCli(["pack", "validate", "--pack", validPack, "--json"]);
  expect(validateMissingPreview.exitCode === 2, "pack validate without --preview must exit 2");
  expect((validateMissingPreview.stderr || "").includes("--preview"), "pack validate without --preview must mention --preview");

  const validateMissingJson = await runCli(["pack", "validate", "--pack", validPack, "--preview"]);
  expect(validateMissingJson.exitCode === 2, "pack validate without --json must exit 2");
  expect((validateMissingJson.stderr || "").includes("--json"), "pack validate without --json must mention --json");

  const reportMissingPreview = await runCli(["report", "single-agent", "--pack", validPack, "--json"]);
  expect(reportMissingPreview.exitCode === 2, "report single-agent without --preview must exit 2");
  expect((reportMissingPreview.stderr || "").includes("--preview"), "report single-agent without --preview must mention --preview");

  const reportMissingJson = await runCli(["report", "single-agent", "--pack", validPack, "--preview"]);
  expect(reportMissingJson.exitCode === 2, "report single-agent without --json must exit 2");
  expect((reportMissingJson.stderr || "").includes("--json"), "report single-agent without --json must mention --json");

  const reportMissingPack = await runCli(["report", "single-agent", "--pack=", "--preview", "--json"]);
  expect(reportMissingPack.exitCode === 2, "report single-agent without --pack must exit 2");
  expect((reportMissingPack.stderr || "").includes("--pack"), "report single-agent without --pack must mention --pack");

  const validValidateResult = await runCli(["pack", "validate", "--pack", validPack, "--preview", "--json"]);
  const validValidateOutput = parseJsonOutput(validValidateResult, "valid pack validate");
  expect(validValidateResult.exitCode === 0, "valid pack validate exit code mismatch");
  assertPackValidateOutput(validValidateOutput, "valid pack validate");

  const validReportResult = await runCli(["report", "single-agent", "--pack", validPack, "--preview", "--json"]);
  const validReportOutput = parseJsonOutput(validReportResult, "valid report");
  expect(validReportResult.exitCode === 0, "valid report exit code mismatch");
  assertReportOutput(validReportOutput, "valid report");

  const limitationValidateResult = await runCli(["pack", "validate", "--pack", limitationPack, "--preview", "--json"]);
  const limitationValidateOutput = parseJsonOutput(limitationValidateResult, "limitation pack validate");
  expect(limitationValidateResult.exitCode === 2, "limitation pack validate exit code mismatch");
  expect(limitationValidateOutput.limitations.length >= 1, "limitation pack validate must report limitations");

  const limitationReportResult = await runCli(["report", "single-agent", "--pack", limitationPack, "--preview", "--json"]);
  const limitationReportOutput = parseJsonOutput(limitationReportResult, "limitation report");
  expect(limitationReportResult.exitCode === 2, "limitation report exit code mismatch");
  assertReportOutput(limitationReportOutput, "limitation report");
  expect(limitationReportOutput.review_posture === "needs_human_review", "limitation report review_posture mismatch");

  const missingFileValidateResult = await runCli(["pack", "validate", "--pack", missingFilePack, "--preview", "--json"]);
  const missingFileValidateOutput = parseJsonOutput(missingFileValidateResult, "missing required file validate");
  expect(missingFileValidateResult.exitCode === 3, "missing required file validate exit code mismatch");
  expect(missingFileValidateOutput.omissions.length >= 1, "missing required file validate must report omissions");

  const missingFileReportResult = await runCli(["report", "single-agent", "--pack", missingFilePack, "--preview", "--json"]);
  const missingFileReportOutput = parseJsonOutput(missingFileReportResult, "missing required file report");
  expect(missingFileReportResult.exitCode === 3, "missing required file report exit code mismatch");
  assertReportOutput(missingFileReportOutput, "missing required file report");
  expect(missingFileReportOutput.review_posture === "insufficient_evidence", "missing required file report review_posture mismatch");

  const missingFieldValidateResult = await runCli(["pack", "validate", "--pack", missingFieldPack, "--preview", "--json"]);
  const missingFieldValidateOutput = parseJsonOutput(missingFieldValidateResult, "missing required field validate");
  expect(missingFieldValidateResult.exitCode === 3, "missing required field validate exit code mismatch");
  expect(missingFieldValidateOutput.omissions.length >= 1, "missing required field validate must report omissions");

  const missingFieldReportResult = await runCli(["report", "single-agent", "--pack", missingFieldPack, "--preview", "--json"]);
  const missingFieldReportOutput = parseJsonOutput(missingFieldReportResult, "missing required field report");
  expect(missingFieldReportResult.exitCode === 3, "missing required field report exit code mismatch");
  assertReportOutput(missingFieldReportOutput, "missing required field report");
  expect(missingFieldReportOutput.review_posture === "insufficient_evidence", "missing required field report review_posture mismatch");

  const malformedValidateResult = await runCli(["pack", "validate", "--pack", malformedPack, "--preview", "--json"]);
  const malformedValidateOutput = parseJsonOutput(malformedValidateResult, "malformed validate");
  expect(malformedValidateResult.exitCode === 4, "malformed validate exit code mismatch");
  expect(
    malformedValidateOutput.validation_status === "invalid_due_to_malformed_input",
    "malformed validate validation_status mismatch"
  );

  const malformedReportResult = await runCli(["report", "single-agent", "--pack", malformedPack, "--preview", "--json"]);
  const malformedReportOutput = parseJsonOutput(malformedReportResult, "malformed report");
  expect(malformedReportResult.exitCode === 4, "malformed report exit code mismatch");
  expect(malformedReportOutput.ok === false, "malformed report must emit error JSON");

  expect(validateExampleResult.exitCode !== 25, "pack validate preview must not reuse deny exit code 25");
  expect(reportExampleResult.exitCode !== 25, "report preview must not reuse deny exit code 25");

  ensurePathAbsent(repoRoot, ".github/workflows");
  ensurePathAbsent(repoRoot, "action.yml");

  const tempPackPath = makeTempPackWithSpaces(repoRoot, examplePack);
  try {
    const spacedValidateResult = await runCli(["pack", "validate", "--pack", tempPackPath, "--preview", "--json"]);
    const spacedValidateOutput = parseJsonOutput(spacedValidateResult, "spaced path validate");
    expect(spacedValidateResult.exitCode === 0, "spaced path validate exit code mismatch");
    assertPackValidateOutput(spacedValidateOutput, "spaced path validate");

    const spacedReportResult = await runCli(["report", "single-agent", "--pack", tempPackPath, "--preview", "--json"]);
    const spacedReportOutput = parseJsonOutput(spacedReportResult, "spaced path report");
    expect(spacedReportResult.exitCode === 0, "spaced path report exit code mismatch");
    assertReportOutput(spacedReportOutput, "spaced path report");
  } finally {
    cleanupTempPath(tempPackPath);
  }

  console.log("PASS: v7.0 E2E acceptance verified.");
}

await main();
