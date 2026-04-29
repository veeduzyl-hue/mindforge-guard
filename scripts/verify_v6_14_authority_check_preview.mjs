import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function expectFlagSet(payload) {
  const flags = [
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

  for (const flag of flags) {
    expect(payload[flag] === true, `${flag} must be true`);
  }
}

function expectNonEnforcing(payload) {
  expect(payload.enforcement_action === "none", "enforcement_action must be none");
  expect(payload.blocking_effect === false, "blocking_effect must be false");
  expect(payload.execution_authority_granted === false, "execution_authority_granted must be false");

  const serialized = JSON.stringify(payload);
  expect(!serialized.includes('"approval_authority"'), "payload must not imply approval authority");
  expect(!serialized.includes('"commit_gate"'), "payload must not imply commit gate");
  expect(!serialized.includes('"deployment_gate"'), "payload must not imply deployment gate");
  expect(!serialized.includes('"deployment_authority"'), "payload must not imply deployment authority");
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-authority-preview-"));
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

const { runGuard } = await import("../packages/guard/src/runGuard.mjs");

const insideResult = await runGuard({
  argv: [
    "authority",
    "check",
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.inside-scope.valid.json",
  ],
});
expect(insideResult.exitCode === 0, "inside fixture should succeed");
const insidePayload = JSON.parse(insideResult.stdout);
expect(insidePayload.kind === "authority_check_preview", "inside result kind mismatch");
expect(insidePayload.preview === true, "inside result preview mismatch");
expect(insidePayload.command === "guard authority check", "inside command mismatch");
expect(insidePayload.decision === "inside_scope", "inside decision mismatch");
expectFlagSet(insidePayload);
expectNonEnforcing(insidePayload);

const outsideResult = await runGuard({
  argv: [
    "authority",
    "check",
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.outside-scope.valid.json",
  ],
});
expect(outsideResult.exitCode === 0, "outside fixture should succeed");
const outsidePayload = JSON.parse(outsideResult.stdout);
expect(outsidePayload.decision === "outside_scope", "outside decision mismatch");
expectFlagSet(outsidePayload);
expectNonEnforcing(outsidePayload);

const missingPreview = await runGuard({
  argv: [
    "authority",
    "check",
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.inside-scope.valid.json",
  ],
});
expect(missingPreview.exitCode === 2, "missing --preview should be a usage error");
expect(missingPreview.stderr.includes("Missing required option: --preview"), "missing --preview message mismatch");

const missingJson = await runGuard({
  argv: [
    "authority",
    "check",
    "--preview",
    "--fixture-file",
    "fixtures/authority/authority-boundary.inside-scope.valid.json",
  ],
});
expect(missingJson.exitCode === 2, "missing --json should be a usage error");
expect(missingJson.stderr.includes("Missing required option: --json"), "missing --json message mismatch");

const missingFixtureFlag = await runGuard({
  argv: [
    "authority",
    "check",
    "--preview",
    "--json",
  ],
});
expect(missingFixtureFlag.exitCode === 2, "missing --fixture-file should be a usage error");
expect(
  missingFixtureFlag.stderr.includes("Missing required option: --fixture-file"),
  "missing --fixture-file message mismatch"
);

const missingFixture = await runGuard({
  argv: [
    "authority",
    "check",
    "--preview",
    "--json",
    "--fixture-file",
    missingFixturePath,
  ],
});
expect(missingFixture.exitCode === 30, "missing fixture file should exit 30");
expect(
  JSON.parse(missingFixture.stdout).error.kind === "authority_preview_fixture_missing",
  "missing fixture error kind mismatch"
);

const invalidJson = await runGuard({
  argv: [
    "authority",
    "check",
    "--preview",
    "--json",
    "--fixture-file",
    invalidJsonPath,
  ],
});
expect(invalidJson.exitCode === 30, "invalid fixture JSON should exit 30");
expect(
  JSON.parse(invalidJson.stdout).error.kind === "authority_preview_fixture_invalid_json",
  "invalid fixture JSON error kind mismatch"
);

const malformedFixture = await runGuard({
  argv: [
    "authority",
    "check",
    "--preview",
    "--json",
    "--fixture-file",
    malformedFixturePath,
  ],
});
expect(malformedFixture.exitCode === 30, "malformed fixture should exit 30");
expect(
  JSON.parse(malformedFixture.stdout).error.kind === "authority_preview_contract_invalid",
  "malformed fixture error kind mismatch"
);

process.stdout.write("authority check preview verified\n");
