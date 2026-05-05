import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function parseJsonOutput(result, label) {
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`${label} must output valid JSON (${error.message})`);
  }
}

function createTempFixtures(repoRoot) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-authority-drift-preview-"));
  const baseFixture = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "fixtures", "authority_drift", "authority-drift.stable-execution.valid.json"),
      "utf8"
    )
  );

  const malformedPath = path.join(tempRoot, "malformed.json");
  const invalidJsonPath = path.join(tempRoot, "invalid.json");
  const missingFixturePath = path.join(tempRoot, "missing.json");

  const malformedFixture = structuredClone(baseFixture);
  delete malformedFixture.authority_drift;
  writeJson(malformedPath, malformedFixture);
  fs.writeFileSync(invalidJsonPath, "{ invalid json\n", "utf8");

  return { tempRoot, malformedPath, invalidJsonPath, missingFixturePath };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const { runGuard } = await import("../packages/guard/src/runGuard.mjs");

async function main() {
  const stableArgs = [
    "authority",
    "drift",
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority_drift/authority-drift.stable-execution.valid.json",
  ];

  const firstResult = await runGuard({ argv: stableArgs });
  expect(firstResult.exitCode === 0, "stable fixture should exit 0");
  const firstPayload = parseJsonOutput(firstResult, "stable fixture");

  const secondResult = await runGuard({ argv: stableArgs });
  expect(secondResult.exitCode === 0, "repeat stable fixture should exit 0");
  const secondPayload = parseJsonOutput(secondResult, "repeat stable fixture");

  expect(
    firstPayload.deterministic_hash === secondPayload.deterministic_hash,
    "deterministic_hash must be stable across repeated runs"
  );
  expect(
    JSON.stringify(firstPayload) === JSON.stringify(secondPayload),
    "stable payload must remain identical across repeated runs"
  );

  const missingPreview = await runGuard({
    argv: [
      "authority",
      "drift",
      "--json",
      "--fixture-file",
      "fixtures/authority_drift/authority-drift.stable-execution.valid.json",
    ],
  });
  expect(missingPreview.exitCode === 2, "missing --preview should exit 2");
  expect(missingPreview.stderr.includes("Missing required option: --preview"), "missing --preview message mismatch");

  const missingJson = await runGuard({
    argv: [
      "authority",
      "drift",
      "--preview",
      "--fixture-file",
      "fixtures/authority_drift/authority-drift.stable-execution.valid.json",
    ],
  });
  expect(missingJson.exitCode === 2, "missing --json should exit 2");
  expect(missingJson.stderr.includes("Missing required option: --json"), "missing --json message mismatch");

  const missingFixtureFlag = await runGuard({
    argv: ["authority", "drift", "--preview", "--json"],
  });
  expect(missingFixtureFlag.exitCode === 2, "missing --fixture-file should exit 2");
  expect(
    missingFixtureFlag.stderr.includes("Missing required option: --fixture-file"),
    "missing --fixture-file message mismatch"
  );

  const unknownOption = await runGuard({
    argv: [
      "authority",
      "drift",
      "--preview",
      "--json",
      "--fixture-file",
      "fixtures/authority_drift/authority-drift.stable-execution.valid.json",
      "--unknown-option",
    ],
  });
  expect(unknownOption.exitCode === 2, "unknown option should exit 2");
  expect(unknownOption.stderr.includes("Unknown option: --unknown-option"), "unknown option message mismatch");

  const unsupportedSubcommand = await runGuard({
    argv: ["authority", "grant"],
  });
  expect(unsupportedSubcommand.exitCode === 2, "unsupported authority subcommand should exit 2");

  const { tempRoot, malformedPath, invalidJsonPath, missingFixturePath } = createTempFixtures(repoRoot);
  try {
    const missingFixture = await runGuard({
      argv: ["authority", "drift", "--preview", "--json", "--fixture-file", missingFixturePath],
    });
    expect(missingFixture.exitCode === 30, "missing fixture should exit 30");
    expect(
      parseJsonOutput(missingFixture, "missing fixture").error.kind === "authority_drift_preview_fixture_missing",
      "missing fixture error kind mismatch"
    );

    const invalidJson = await runGuard({
      argv: ["authority", "drift", "--preview", "--json", "--fixture-file", invalidJsonPath],
    });
    expect(invalidJson.exitCode === 30, "invalid JSON fixture should exit 30");
    expect(
      parseJsonOutput(invalidJson, "invalid JSON fixture").error.kind === "authority_drift_preview_fixture_invalid_json",
      "invalid JSON error kind mismatch"
    );

    const malformedFixture = await runGuard({
      argv: ["authority", "drift", "--preview", "--json", "--fixture-file", malformedPath],
    });
    expect(malformedFixture.exitCode === 30, "malformed fixture should exit 30");
    expect(
      parseJsonOutput(malformedFixture, "malformed fixture").error.kind === "authority_drift_preview_contract_invalid",
      "malformed fixture error kind mismatch"
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  process.stdout.write("authority drift preview verified\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
