import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const REQUIRED_FLAGS = [
  "recommendation_only",
  "non_executing",
  "default_off",
  "machine_verifiable",
  "no_execution_authority",
  "no_commit_gate_semantics",
  "no_license_gating_semantic_change",
  "no_current_cli_contract_change",
  "no_current_exit_code_semantic_change",
];

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

async function expectPassScript(scriptPath, expectedStdout) {
  const absolutePath = path.join(repoRoot, scriptPath);
  const originalStdoutWrite = process.stdout.write.bind(process.stdout);
  const originalStderrWrite = process.stderr.write.bind(process.stderr);
  const originalExit = process.exit;

  let stdout = "";
  let stderr = "";

  process.stdout.write = ((chunk, encoding, callback) => {
    stdout += typeof chunk === "string" ? chunk : chunk.toString(encoding);
    if (typeof callback === "function") callback();
    return true;
  });
  process.stderr.write = ((chunk, encoding, callback) => {
    stderr += typeof chunk === "string" ? chunk : chunk.toString(encoding);
    if (typeof callback === "function") callback();
    return true;
  });
  process.exit = ((code) => {
    throw new Error(`__PROCESS_EXIT__${code ?? 0}`);
  });

  try {
    await import(`${pathToFileURL(absolutePath).href}?acceptance=${Date.now()}-${Math.random()}`);
  } catch (error) {
    if (typeof error?.message === "string" && error.message.startsWith("__PROCESS_EXIT__")) {
      fail(`${scriptPath} should not call process.exit on success`);
    }
    fail(`${scriptPath} failed: ${stderr || error.message}`);
  } finally {
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;
    process.exit = originalExit;
  }

  expect(stdout === expectedStdout, `${scriptPath} stdout mismatch`);
}

const { runGuard } = await import("../packages/guard/src/runGuard.mjs");

async function runAuthorityCheck(extraArgs) {
  return runGuard({
    argv: ["authority", "check", ...extraArgs],
  });
}

function parseJsonOutput(result, label) {
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    fail(`${label} must output valid JSON (${error.message})`);
  }
}

function expectFlagSet(payload, label) {
  for (const flag of REQUIRED_FLAGS) {
    expect(payload[flag] === true, `${label} ${flag} must be true`);
  }
}

function expectDecisionOnly(payload, label) {
  expect(payload.enforcement_action === "none", `${label} enforcement_action must be none`);
  expect(payload.blocking_effect === false, `${label} blocking_effect must be false`);
  expect(
    payload.execution_authority_granted === false,
    `${label} execution_authority_granted must be false`
  );
  expect(payload.no_execution_authority === true, `${label} no_execution_authority must be true`);
  expect(payload.no_commit_gate_semantics === true, `${label} no_commit_gate_semantics must be true`);
}

function expectPreviewSuccess(payload, expectedDecision, label) {
  expect(payload.kind === "authority_check_preview", `${label} kind mismatch`);
  expect(payload.preview === true, `${label} preview must be true`);
  expect(payload.command === "guard authority check", `${label} command mismatch`);
  expect(payload.decision === expectedDecision, `${label} decision mismatch`);
  expect(payload.receipt && typeof payload.receipt === "object", `${label} receipt must exist`);
  expectFlagSet(payload, label);
  expectDecisionOnly(payload, label);
}

function expectUsageError(result, missingFlag) {
  expect(result.exitCode === 2, `${missingFlag} should exit 2`);
  expect(
    result.stderr.includes(`Missing required option: ${missingFlag}`),
    `${missingFlag} usage message mismatch`
  );
}

function expectValidationError(result, expectedKind, label) {
  expect(result.exitCode === 30, `${label} should exit 30`);
  const payload = parseJsonOutput(result, label);
  expect(payload?.ok === false, `${label} error payload must set ok=false`);
  expect(payload?.error?.kind === expectedKind, `${label} error kind mismatch`);
}

function createTempFixtures() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-authority-acceptance-"));
  const invalidJsonPath = path.join(tempRoot, "invalid.json");
  const malformedFixturePath = path.join(tempRoot, "malformed.json");
  const missingFixturePath = path.join(tempRoot, "missing.json");

  fs.writeFileSync(invalidJsonPath, "{invalid-json", "utf8");
  fs.writeFileSync(
    malformedFixturePath,
    JSON.stringify(
      {
        schema_version: "v6.14-preview",
        v6_14_preview: true,
        recommendation_only: true,
        non_executing: true,
        default_off: true,
        machine_verifiable: true,
        no_execution_authority: true,
        no_commit_gate_semantics: true,
        no_license_gating_semantic_change: true,
        no_current_cli_contract_change: true,
        no_current_exit_code_semantic_change: true,
        decision: "outside_scope",
        authority_scope: {
          execution_authority_granted: false,
          blocking_implied: false,
        },
      },
      null,
      2
    ) + "\n",
    "utf8"
  );

  return { tempRoot, invalidJsonPath, malformedFixturePath, missingFixturePath };
}

function cleanupTempFixtures(tempRoot) {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

async function main() {
  await expectPassScript(
    "scripts/verify_v6_14_authority_boundary_fixtures.mjs",
    "PASS verify_v6_14_authority_boundary_fixtures\n"
  );
  await expectPassScript(
    "scripts/verify_v6_14_authority_check_preview.mjs",
    "authority check preview verified\n"
  );

  const insideResult = await runAuthorityCheck([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.inside-scope.valid.json",
  ]);
  expect(insideResult.exitCode === 0, "inside fixture should exit 0");
  const insidePayload = parseJsonOutput(insideResult, "inside fixture");
  expectPreviewSuccess(insidePayload, "inside_scope", "inside fixture");

  const outsideResult = await runAuthorityCheck([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.outside-scope.valid.json",
  ]);
  expect(outsideResult.exitCode === 0, "outside fixture should exit 0");
  const outsidePayload = parseJsonOutput(outsideResult, "outside fixture");
  expectPreviewSuccess(outsidePayload, "outside_scope", "outside fixture");

  const missingPreview = await runAuthorityCheck([
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.inside-scope.valid.json",
  ]);
  expectUsageError(missingPreview, "--preview");

  const missingJson = await runAuthorityCheck([
    "--preview",
    "--fixture-file",
    "fixtures/authority/authority-boundary.inside-scope.valid.json",
  ]);
  expectUsageError(missingJson, "--json");

  const missingFixtureFlag = await runAuthorityCheck(["--preview", "--json"]);
  expectUsageError(missingFixtureFlag, "--fixture-file");

  const { tempRoot, invalidJsonPath, malformedFixturePath, missingFixturePath } = createTempFixtures();
  try {
    const missingFixture = await runAuthorityCheck([
      "--preview",
      "--json",
      "--fixture-file",
      missingFixturePath,
    ]);
    expectValidationError(
      missingFixture,
      "authority_preview_fixture_missing",
      "missing fixture file"
    );

    const invalidJson = await runAuthorityCheck([
      "--preview",
      "--json",
      "--fixture-file",
      invalidJsonPath,
    ]);
    expectValidationError(
      invalidJson,
      "authority_preview_fixture_invalid_json",
      "invalid fixture json"
    );

    const malformedFixture = await runAuthorityCheck([
      "--preview",
      "--json",
      "--fixture-file",
      malformedFixturePath,
    ]);
    expectValidationError(
      malformedFixture,
      "authority_preview_contract_invalid",
      "malformed fixture"
    );
  } finally {
    cleanupTempFixtures(tempRoot);
  }

  process.stdout.write("PASS verify_v6_14_authority_preview_acceptance\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
