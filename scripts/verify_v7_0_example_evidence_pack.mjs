import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function expectString(value, label) {
  expect(typeof value === "string" && value.length >= 1, `${label} must be a non-empty string`);
}

function expectArray(value, label) {
  expect(Array.isArray(value) && value.length >= 1, `${label} must be a non-empty array`);
}

function readText(filePath, label) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    fail(`${label} must be readable (${error.message})`);
  }
}

function readJson(filePath, label) {
  try {
    return JSON.parse(readText(filePath, label));
  } catch (error) {
    fail(`${label} must contain valid JSON (${error.message})`);
  }
}

function listRelativeFiles(rootDir) {
  const entries = [];
  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const nextPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(nextPath);
      } else {
        entries.push(path.relative(rootDir, nextPath).replace(/\\/g, "/"));
      }
    }
  }
  walk(rootDir);
  return entries.sort();
}

function expectFile(rootDir, relativePath) {
  const fullPath = path.join(rootDir, relativePath);
  expect(fs.existsSync(fullPath), `required file ${relativePath} must exist`);
  return fullPath;
}

function expectObject(value, label) {
  expect(value && typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
}

function validateManifest(value) {
  expectObject(value, "manifest.json");
  for (const key of [
    "pack_id",
    "pack_version",
    "pack_type",
    "created_at",
    "updated_at",
    "owner",
    "source_repo",
    "report_target"
  ]) {
    expect(key in value, `manifest.json missing ${key}`);
    expectString(value[key], `manifest.json.${key}`);
  }
  expect(value.pack_version === "v1", "manifest.json.pack_version mismatch");
  expect(value.pack_type === "single_agent_governance_pack_preview", "manifest.json.pack_type mismatch");
  expect(
    value.report_target === "single_agent_governance_report_preview_v1",
    "manifest.json.report_target mismatch"
  );
}

function validateAgentProfile(value) {
  expectObject(value, "agent-profile.json");
  for (const key of [
    "agent_id",
    "agent_name",
    "agent_type",
    "business_owner",
    "technical_owner",
    "review_owner",
    "intended_users",
    "operating_context"
  ]) {
    expect(key in value, `agent-profile.json missing ${key}`);
  }
  expect(value.agent_type === "single_agent", "agent-profile.json.agent_type mismatch");
  expectArray(value.intended_users, "agent-profile.json.intended_users");
}

function validateSampleOutput(value) {
  expectObject(value, "evidence/sample-output.json");
  for (const key of [
    "sample_id",
    "input_summary",
    "output_summary",
    "output_artifact_ref",
    "expected_behavior",
    "observed_behavior",
    "reviewer_note"
  ]) {
    expect(key in value, `evidence/sample-output.json missing ${key}`);
    expectString(value[key], `evidence/sample-output.json.${key}`);
  }
}

function validateRunRecord(value) {
  expectObject(value, "evidence/run-record.json");
  for (const key of [
    "run_id",
    "run_timestamp",
    "environment",
    "input_ref",
    "output_ref",
    "tool_calls_summary",
    "errors_or_warnings",
    "reviewer_observation"
  ]) {
    expect(key in value, `evidence/run-record.json missing ${key}`);
  }
  expect(value.environment === "local_preview", "evidence/run-record.json.environment mismatch");
  expectArray(value.tool_calls_summary, "evidence/run-record.json.tool_calls_summary");
  expect(Array.isArray(value.errors_or_warnings), "evidence/run-record.json.errors_or_warnings must be an array");
  expectString(value.reviewer_observation, "evidence/run-record.json.reviewer_observation");
}

function validateSnapshot(value) {
  expectObject(value, "snapshot.json");
  for (const key of [
    "snapshot_id",
    "version",
    "commit_sha",
    "environment",
    "generated_at",
    "artifact_hashes",
    "comparison_baseline"
  ]) {
    expect(key in value, `snapshot.json missing ${key}`);
  }
  expect(value.environment === "local_preview", "snapshot.json.environment mismatch");
  expect(typeof value.commit_sha === "string" && /^[a-f0-9]{7,40}$/.test(value.commit_sha), "snapshot.json.commit_sha mismatch");
  expectArray(value.artifact_hashes, "snapshot.json.artifact_hashes");
  for (const [index, hash] of value.artifact_hashes.entries()) {
    expect(typeof hash === "string" && /^sha256:[a-f0-9]{64}$/.test(hash), `snapshot.json.artifact_hashes[${index}] mismatch`);
  }
}

function expectYamlKeys(text, label, keys) {
  for (const key of keys) {
    expect(new RegExp(`(^|\\n)${key}:`, "m").test(text), `${label} missing key ${key}`);
  }
}

function expectNonEmpty(filePath, label) {
  const text = readText(filePath, label);
  expect(text.trim().length >= 1, `${label} must be non-empty`);
  return text;
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");
  const exampleDir = path.join(
    repoRoot,
    "examples",
    "single-agent-governance-pack",
    "hr-self-service-agent"
  );

  expect(fs.existsSync(exampleDir), "example evidence pack directory must exist");

  const requiredFiles = [
    "manifest.json",
    "agent-profile.json",
    "task-scope.md",
    "action-boundary.yaml",
    "data-sources.yaml",
    "tools.yaml",
    "review-standards.md",
    "evidence/sample-output.json",
    "evidence/run-record.json",
    "snapshot.json",
    "README.md"
  ];

  for (const relativePath of requiredFiles) {
    expectFile(exampleDir, relativePath);
  }

  const manifest = readJson(path.join(exampleDir, "manifest.json"), "manifest.json");
  const agentProfile = readJson(path.join(exampleDir, "agent-profile.json"), "agent-profile.json");
  const sampleOutput = readJson(
    path.join(exampleDir, "evidence", "sample-output.json"),
    "evidence/sample-output.json"
  );
  const runRecord = readJson(
    path.join(exampleDir, "evidence", "run-record.json"),
    "evidence/run-record.json"
  );
  const snapshot = readJson(path.join(exampleDir, "snapshot.json"), "snapshot.json");

  validateManifest(manifest);
  validateAgentProfile(agentProfile);
  validateSampleOutput(sampleOutput);
  validateRunRecord(runRecord);
  validateSnapshot(snapshot);

  const taskScope = expectNonEmpty(path.join(exampleDir, "task-scope.md"), "task-scope.md");
  const reviewStandards = expectNonEmpty(path.join(exampleDir, "review-standards.md"), "review-standards.md");
  const actionBoundary = readText(path.join(exampleDir, "action-boundary.yaml"), "action-boundary.yaml");
  const dataSources = readText(path.join(exampleDir, "data-sources.yaml"), "data-sources.yaml");
  const tools = readText(path.join(exampleDir, "tools.yaml"), "tools.yaml");
  const readme = readText(path.join(exampleDir, "README.md"), "README.md");

  for (const section of [
    "intended task:",
    "in-scope behavior:",
    "out-of-scope behavior:",
    "success criteria:",
    "known limitations:"
  ]) {
    expect(taskScope.includes(section), `task-scope.md must include section ${section}`);
  }

  for (const section of [
    "review criteria:",
    "acceptance expectations:",
    "known policy references:",
    "reviewer notes:"
  ]) {
    expect(reviewStandards.includes(section), `review-standards.md must include section ${section}`);
  }

  expectYamlKeys(actionBoundary, "action-boundary.yaml", [
    "allowed_actions",
    "prohibited_actions",
    "human_review_required",
    "escalation_required",
    "external_side_effects"
  ]);
  expectYamlKeys(dataSources, "data-sources.yaml", ["data_sources"]);
  expectYamlKeys(tools, "tools.yaml", ["tools"]);

  for (const phrase of [
    "This is a synthetic example pack.",
    "It is for v7.0 Evidence Pack review preparation only.",
    "It does not require production data.",
    "It does not grant authority or approval.",
    "It does not represent legal, HR, compliance, or deployment advice.",
    "It is not wired to CLI behavior in this PR."
  ]) {
    expect(readme.includes(phrase), `README.md must include boundary phrase: ${phrase}`);
  }

  const forbiddenSecrets = [
    "api_key",
    "secret",
    "token",
    "password",
    "private_key"
  ];

  const forbiddenClaims = [
    "approved",
    "blocked",
    "safe-to-merge",
    "safe-to-deploy",
    "compliance certified",
    "legal compliance",
    "maturity certified",
    "production ready",
    "runtime enforcement",
    "control plane"
  ];

  for (const relativePath of listRelativeFiles(exampleDir)) {
    const text = readText(path.join(exampleDir, relativePath), relativePath).toLowerCase();
    for (const phrase of forbiddenSecrets) {
      expect(!text.includes(phrase), `${relativePath} must not include secret-like phrase ${phrase}`);
    }
    for (const phrase of forbiddenClaims) {
      expect(!text.includes(phrase), `${relativePath} must not include authority-expansion phrase ${phrase}`);
    }
  }

  console.log("PASS: v7.0 example evidence pack validated.");
}

main();
