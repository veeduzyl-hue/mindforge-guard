import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { runGuard } from "../packages/guard/src/runGuard.mjs";

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
  expect(typeof result.exitCode === "number", `${label} must return an exit code`);
  try {
    return JSON.parse(result.stdout);
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
  const forbiddenKeys = new Set([
    "enforcement_action",
    "approval_status",
    "blocking_effect",
    "merge_allowed",
    "deployment_allowed",
    "execution_authority_granted",
    "compliance_certified",
    "legal_compliance_result",
    "maturity_certified"
  ]);

  walk(summary, (key, _entry, entryPath) => {
    expect(!forbiddenKeys.has(key), `${label} must not contain forbidden key ${entryPath}`);
  });
}

function assertCommonOutputShape(output, label) {
  expect(output.command === "pack validate", `${label} command mismatch`);
  expect(output.preview === true, `${label} preview flag mismatch`);
  expect(typeof output.pack_path === "string" && output.pack_path.length >= 1, `${label} pack_path mismatch`);
  expect(output.parser_version === "single_agent_governance_pack_parser_preview_v1", `${label} parser version mismatch`);
  expect(Array.isArray(output.omissions), `${label} omissions must be an array`);
  expect(Array.isArray(output.limitations), `${label} limitations must be an array`);
  expect(Array.isArray(output.parser_warnings), `${label} parser_warnings must be an array`);
  expect(Array.isArray(output.files_checked), `${label} files_checked must be an array`);
  expect(Array.isArray(output.required_fields_checked), `${label} required_fields_checked must be an array`);
  expect(Array.isArray(output.review_focus), `${label} review_focus must be an array`);
  expect(
    output.non_enforcement_boundary?.summary ===
      "Pack validation is evidence-readiness output only. It does not approve, block, merge, deploy, certify, or execute.",
    `${label} non_enforcement_boundary mismatch`
  );
  assertNoForbiddenOutputFields(output, label);
}

async function assertExistingCliPreviewVerifierStillPasses(repoRoot) {
  const verifierPath = path.join(repoRoot, "scripts", "verify_v7_0_single_agent_governance_report_cli_preview.mjs");
  const originalConsoleLog = console.log;

  try {
    console.log = () => {};
    await import(`${pathToFileURL(verifierPath).href}?cli_pack_validate_preview_check=1`);
  } catch (error) {
    fail(`existing CLI report preview verifier must still pass (${error.message})`);
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

  const validResult = await runCli(["pack", "validate", "--pack", validPack, "--preview", "--json"]);
  const validOutput = parseJsonOutput(validResult, "valid_pack");
  expect(validResult.exitCode === 0, "valid_pack exit code mismatch");
  expect(validOutput.validation_status === "valid_with_no_omissions", "valid_pack validation status mismatch");
  assertCommonOutputShape(validOutput, "valid_pack");
  expect(validOutput.omissions.length === 0, "valid_pack must not report omissions");

  const validRepeatResult = await runCli(["pack", "validate", "--pack", validPack, "--preview", "--json"]);
  const validRepeatOutput = parseJsonOutput(validRepeatResult, "valid_pack repeat");
  expect(
    validOutput.deterministic_pack_hash === validRepeatOutput.deterministic_pack_hash,
    "valid_pack deterministic hash must be stable"
  );

  const limitationResult = await runCli(["pack", "validate", "--pack", limitationPack, "--preview", "--json"]);
  const limitationOutput = parseJsonOutput(limitationResult, "limitation pack");
  expect(limitationResult.exitCode === 2, "limitation pack exit code mismatch");
  expect(
    limitationOutput.validation_status === "valid_with_limitations",
    "limitation pack validation status mismatch"
  );
  assertCommonOutputShape(limitationOutput, "limitation pack");
  expect(limitationOutput.omissions.length === 0, "limitation pack must not report omissions");
  expect(limitationOutput.limitations.length >= 1, "limitation pack must report limitations");

  const missingFileResult = await runCli(["pack", "validate", "--pack", missingFilePack, "--preview", "--json"]);
  const missingFileOutput = parseJsonOutput(missingFileResult, "missing required file pack");
  expect(missingFileResult.exitCode === 3, "missing required file pack exit code mismatch");
  expect(
    missingFileOutput.validation_status === "invalid_due_to_omissions",
    "missing required file pack validation status mismatch"
  );
  assertCommonOutputShape(missingFileOutput, "missing required file pack");

  const missingFieldResult = await runCli(["pack", "validate", "--pack", missingFieldPack, "--preview", "--json"]);
  const missingFieldOutput = parseJsonOutput(missingFieldResult, "missing required field pack");
  expect(missingFieldResult.exitCode === 3, "missing required field pack exit code mismatch");
  expect(
    missingFieldOutput.validation_status === "invalid_due_to_omissions",
    "missing required field pack validation status mismatch"
  );
  assertCommonOutputShape(missingFieldOutput, "missing required field pack");

  const malformedResult = await runCli(["pack", "validate", "--pack", malformedPack, "--preview", "--json"]);
  const malformedOutput = parseJsonOutput(malformedResult, "malformed pack");
  expect(malformedResult.exitCode === 4, "malformed pack exit code mismatch");
  expect(
    malformedOutput.validation_status === "invalid_due_to_malformed_input",
    "malformed pack validation status mismatch"
  );
  assertCommonOutputShape(malformedOutput, "malformed pack");

  const exampleResult = await runCli(["pack", "validate", "--pack", examplePack, "--preview", "--json"]);
  const exampleOutput = parseJsonOutput(exampleResult, "example pack");
  expect(exampleResult.exitCode === 0, "example pack exit code mismatch");
  expect(exampleOutput.validation_status === "valid_with_no_omissions", "example pack validation status mismatch");
  assertCommonOutputShape(exampleOutput, "example pack");

  await assertExistingCliPreviewVerifierStillPasses(repoRoot);

  console.log("PASS: v7.0 CLI pack validate preview validated.");
}

await main();
