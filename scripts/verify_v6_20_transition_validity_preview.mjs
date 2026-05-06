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

function walk(value, visit) {
  visit(value);
  if (Array.isArray(value)) {
    for (const entry of value) walk(entry, visit);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      visit(key);
      walk(entry, visit);
    }
  }
}

function expectNoForbiddenDecisionSemantics(value, label) {
  const forbiddenFields = new Set([
    "admit",
    "deny",
    "defer",
    "allow",
    "block",
    "pass",
    "fail",
    "guardrail_passed",
    "guardrail_failed",
    "permit",
    "commit",
    "deploy",
    "enforcement_decision",
    "policy_decision",
    "execution_permission",
    "state_equivalence_proof",
  ]);
  const forbiddenValues = new Set([...forbiddenFields]);

  walk(value, (entry) => {
    if (typeof entry === "string" && forbiddenFields.has(entry)) {
      throw new Error(`${label} contains forbidden field ${entry}`);
    }
    if (typeof entry === "string" && forbiddenValues.has(entry.toLowerCase())) {
      throw new Error(`${label} contains forbidden value ${entry}`);
    }
  });
}

function createTempFixtures(repoRoot) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-transition-preview-"));
  const baseFixture = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "fixtures", "transition_validity", "execution-bound-transition-validity.cases.valid.json"),
      "utf8"
    )
  );

  const malformedPath = path.join(tempRoot, "malformed.json");
  const invalidJsonPath = path.join(tempRoot, "invalid.json");
  const missingFixturePath = path.join(tempRoot, "missing.json");

  const malformedFixture = structuredClone(baseFixture);
  delete malformedFixture.cases;
  writeJson(malformedPath, malformedFixture);
  fs.writeFileSync(invalidJsonPath, "{ invalid json\n", "utf8");

  return { tempRoot, malformedPath, invalidJsonPath, missingFixturePath };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const { runGuard } = await import("../packages/guard/src/runGuard.mjs");

async function main() {
  const baseArgs = [
    "transition",
    "explain",
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/transition_validity/execution-bound-transition-validity.cases.valid.json",
  ];

  const firstResult = await runGuard({ argv: baseArgs });
  expect(firstResult.exitCode === 0, "preview fixture should exit 0");
  expect(firstResult.exitCode !== 21, "preview fixture must not use exit 21");
  expect(firstResult.exitCode !== 25, "preview fixture must not use exit 25");
  const firstPayload = parseJsonOutput(firstResult, "preview fixture");

  const secondResult = await runGuard({ argv: baseArgs });
  expect(secondResult.exitCode === 0, "repeat preview fixture should exit 0");
  const secondPayload = parseJsonOutput(secondResult, "repeat preview fixture");

  expect(
    firstPayload.deterministic_hash === secondPayload.deterministic_hash,
    "deterministic_hash must be stable across repeated runs"
  );
  expect(
    JSON.stringify(firstPayload) === JSON.stringify(secondPayload),
    "preview payload must remain identical across repeated runs"
  );

  expect(
    firstPayload.schema_version === "guard.execution_bound_transition_validity_preview.v1",
    "schema version mismatch"
  );
  expect(firstPayload.preview === true, "preview flag mismatch");
  expect(firstPayload.explanation_only === true, "explanation_only mismatch");
  expect(firstPayload.enforcement_action === "none", "enforcement_action mismatch");
  expect(firstPayload.blocking_effect === false, "blocking_effect mismatch");
  expect(firstPayload.execution_authority_granted === false, "execution_authority_granted mismatch");
  expect(firstPayload.declared_transition.fixture_backed === true, "declared_transition.fixture_backed mismatch");
  expect(Array.isArray(firstPayload.prerequisite_refs) && firstPayload.prerequisite_refs.length >= 1, "prerequisite_refs must be populated");
  expect(Array.isArray(firstPayload.transition_findings) && firstPayload.transition_findings.length === 5, "transition_findings length mismatch");

  const statuses = new Set(firstPayload.transition_findings.map((entry) => entry.transition_status));
  for (const status of ["preserved", "changed", "partially_preserved", "not_applicable", "unknown"]) {
    expect(statuses.has(status), `transition status ${status} must be present`);
  }

  const findingTypes = new Set(firstPayload.transition_findings.map((entry) => entry.finding_type));
  for (const findingType of [
    "prerequisite_preserved",
    "prerequisite_changed",
    "prerequisite_partially_preserved",
    "insufficient_transition_evidence",
    "not_applicable_to_transition",
  ]) {
    expect(findingTypes.has(findingType), `finding type ${findingType} must be present`);
  }

  expect(firstPayload.input_summary.case_count === 5, "case_count mismatch");
  expect(firstPayload.input_summary.transition_status_counts.preserved === 1, "preserved count mismatch");
  expect(firstPayload.input_summary.transition_status_counts.changed === 1, "changed count mismatch");
  expect(firstPayload.input_summary.transition_status_counts.partially_preserved === 1, "partially_preserved count mismatch");
  expect(firstPayload.input_summary.transition_status_counts.not_applicable === 1, "not_applicable count mismatch");
  expect(firstPayload.input_summary.transition_status_counts.unknown === 1, "unknown count mismatch");

  const boundary = firstPayload.non_enforcement_boundary;
  expect(boundary.explanation_only === true, "non_enforcement_boundary.explanation_only mismatch");
  expect(boundary.enforcement_action === "none", "non_enforcement_boundary.enforcement_action mismatch");
  expect(boundary.blocking_effect === false, "non_enforcement_boundary.blocking_effect mismatch");
  expect(boundary.execution_authority_granted === false, "non_enforcement_boundary.execution_authority_granted mismatch");
  expect(boundary.does_not_grant_execution_permission === true, "does_not_grant_execution_permission mismatch");
  expect(boundary.does_not_create_commit_gate === true, "does_not_create_commit_gate mismatch");
  expect(boundary.does_not_create_permit_gate === true, "does_not_create_permit_gate mismatch");
  expect(boundary.does_not_create_deployment_gate === true, "does_not_create_deployment_gate mismatch");
  expect(boundary.does_not_create_runtime_enforcement === true, "does_not_create_runtime_enforcement mismatch");
  expect(boundary.does_not_prove_state_equivalence === true, "does_not_prove_state_equivalence mismatch");

  expectNoForbiddenDecisionSemantics(firstPayload, "preview payload");

  const missingPreview = await runGuard({
    argv: ["transition", "explain", "--json", "--fixture-file", "fixtures/transition_validity/execution-bound-transition-validity.cases.valid.json"],
  });
  expect(missingPreview.exitCode === 2, "missing --preview should exit 2");
  expect(missingPreview.stderr.includes("Missing required option: --preview"), "missing --preview message mismatch");

  const missingJson = await runGuard({
    argv: ["transition", "explain", "--preview", "--fixture-file", "fixtures/transition_validity/execution-bound-transition-validity.cases.valid.json"],
  });
  expect(missingJson.exitCode === 2, "missing --json should exit 2");
  expect(missingJson.stderr.includes("Missing required option: --json"), "missing --json message mismatch");

  const missingFixture = await runGuard({
    argv: ["transition", "explain", "--preview", "--json"],
  });
  expect(missingFixture.exitCode === 2, "missing --fixture-file should exit 2");
  expect(missingFixture.stderr.includes("Missing required option: --fixture-file"), "missing --fixture-file message mismatch");

  const unknownOption = await runGuard({
    argv: [
      "transition",
      "explain",
      "--preview",
      "--json",
      "--fixture-file",
      "fixtures/transition_validity/execution-bound-transition-validity.cases.valid.json",
      "--unknown-option",
    ],
  });
  expect(unknownOption.exitCode === 2, "unknown option should exit 2");
  expect(unknownOption.stderr.includes("Unknown option: --unknown-option"), "unknown option message mismatch");

  const unsupportedSubcommand = await runGuard({
    argv: ["transition", "permit"],
  });
  expect(unsupportedSubcommand.exitCode === 2, "unsupported transition subcommand should exit 2");

  const { tempRoot, malformedPath, invalidJsonPath, missingFixturePath } = createTempFixtures(repoRoot);
  try {
    const missingFixtureResult = await runGuard({
      argv: ["transition", "explain", "--preview", "--json", "--fixture-file", missingFixturePath],
    });
    expect(missingFixtureResult.exitCode === 30, "missing fixture should exit 30");
    expect(
      parseJsonOutput(missingFixtureResult, "missing fixture").error.kind === "transition_validity_preview_fixture_missing",
      "missing fixture error kind mismatch"
    );

    const invalidJsonResult = await runGuard({
      argv: ["transition", "explain", "--preview", "--json", "--fixture-file", invalidJsonPath],
    });
    expect(invalidJsonResult.exitCode === 30, "invalid JSON fixture should exit 30");
    expect(
      parseJsonOutput(invalidJsonResult, "invalid JSON fixture").error.kind === "transition_validity_preview_fixture_invalid_json",
      "invalid JSON error kind mismatch"
    );

    const malformedResult = await runGuard({
      argv: ["transition", "explain", "--preview", "--json", "--fixture-file", malformedPath],
    });
    expect(malformedResult.exitCode === 30, "malformed fixture should exit 30");
    expect(
      parseJsonOutput(malformedResult, "malformed fixture").error.kind === "transition_validity_preview_contract_invalid",
      "malformed fixture error kind mismatch"
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  process.stdout.write("transition validity preview verified\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
