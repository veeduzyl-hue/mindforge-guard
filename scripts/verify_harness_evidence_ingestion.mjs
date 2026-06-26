import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeHarnessEvidenceIngestSummary } from "../experiments/harness-evidence-ingestion/normalize-harness-ingest-summary.mjs";

const REQUIRED_TOP_LEVEL_FIELDS = [
  "schema_version",
  "pack_id",
  "pack_type",
  "created_at",
  "producer",
  "workflow",
  "authority",
  "runtime",
  "intent",
  "scope",
  "actions",
  "tool_calls",
  "blocked_actions",
  "artifacts",
  "verification",
  "risk_signals",
  "provenance",
  "manifest",
];

const FORBIDDEN_GOVERNANCE_OUTPUT_KEYS = new Set([
  "verdict",
  "reason_codes",
  "risk_summary",
  "evidence_coverage",
  "governance_report",
  "evidence_index",
]);

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function expectPlainObject(value, label) {
  expect(value && typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
}

function expectArray(value, label) {
  expect(Array.isArray(value), `${label} must be an array`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`${filePath} must contain valid JSON (${error.message})`);
  }
}

function readText(filePath, label) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    fail(`${label} must be readable (${error.message})`);
  }
}

function walkKeys(value, visit, currentPath = "$") {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => walkKeys(entry, visit, `${currentPath}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      const nextPath = `${currentPath}.${key}`;
      visit(key, entry, nextPath);
      walkKeys(entry, visit, nextPath);
    }
  }
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function validateRequiredTopLevelFields(pack, label) {
  expectPlainObject(pack, `${label} evidence pack`);
  for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
    expect(field in pack, `${label} missing required top-level field ${field}`);
  }
}

function validateProducerBoundary(pack, label) {
  expectPlainObject(pack.authority, `${label} authority`);
  expect(pack.authority.boundary === "producer_only", `${label} authority.boundary mismatch`);
  expect(
    pack.authority.consumer_authority === "mindforge-guard-core",
    `${label} authority.consumer_authority mismatch`
  );
  expect(
    pack.authority.governance_outputs_emitted === false,
    `${label} authority.governance_outputs_emitted must be false`
  );
  expect(
    pack.authority.execution_authority_granted === false,
    `${label} authority.execution_authority_granted must be false`
  );
}

function validateNoForbiddenGovernanceOutputs(pack, label) {
  walkKeys(pack, (key, _entry, entryPath) => {
    expect(
      !FORBIDDEN_GOVERNANCE_OUTPUT_KEYS.has(key),
      `${label} must not expose Guard-native governance output field ${entryPath}`
    );
  });
}

function validateManifestConsistency(pack, fixtureDir, label) {
  expectPlainObject(pack.manifest, `${label} manifest`);
  expectArray(pack.manifest.files, `${label} manifest.files`);
  expectArray(pack.artifacts, `${label} artifacts`);

  const manifestEntries = new Map();
  for (const entry of pack.manifest.files) {
    expectPlainObject(entry, `${label} manifest file entry`);
    expect(typeof entry.path === "string" && entry.path.length >= 1, `${label} manifest path must be non-empty`);
    manifestEntries.set(entry.path, entry);
  }

  expect(manifestEntries.has("evidence-pack.json"), `${label} manifest must include evidence-pack.json`);

  for (const artifact of pack.artifacts) {
    expectPlainObject(artifact, `${label} artifact`);
    expect(typeof artifact.path === "string" && artifact.path.length >= 1, `${label} artifact.path must be non-empty`);
    const artifactPath = path.join(fixtureDir, artifact.path);
    const existsOnDisk = fs.existsSync(artifactPath);
    const isOptional = artifact.optional === true;

    if (!existsOnDisk) {
      expect(isOptional, `${label} missing artifact ${artifact.path} must be explicitly optional`);
      continue;
    }

    expect(
      manifestEntries.has(artifact.path),
      `${label} required artifact ${artifact.path} must appear in manifest.files`
    );
  }

  for (const [relativePath, entry] of manifestEntries) {
    const filePath = path.join(fixtureDir, relativePath);
    expect(fs.existsSync(filePath), `${label} manifest file ${relativePath} must exist on disk`);

    if (typeof entry.sha256 === "string") {
      expect(
        entry.sha256 === sha256File(filePath),
        `${label} manifest hash mismatch for ${relativePath}`
      );
    }

    if (typeof entry.size_bytes === "number") {
      expect(
        entry.size_bytes === fs.statSync(filePath).size,
        `${label} manifest size mismatch for ${relativePath}`
      );
    }
  }
}

function validateSafeFixture(pack) {
  expectArray(pack.actions, "safe actions");
  expectArray(pack.tool_calls, "safe tool_calls");
  expect(pack.actions.length >= 1, "safe fixture must preserve completed actions");
  expect(pack.tool_calls.length >= 1, "safe fixture must preserve completed tool calls");
  expect(pack.blocked_actions.length === 0, "safe fixture must not report blocked actions");

  for (const [index, action] of pack.actions.entries()) {
    expectPlainObject(action, `safe actions[${index}]`);
    expect(action.status === "completed", `safe action ${index} must be completed`);
  }

  for (const [index, toolCall] of pack.tool_calls.entries()) {
    expectPlainObject(toolCall, `safe tool_calls[${index}]`);
    expect(toolCall.status === "completed", `safe tool call ${index} must be completed`);
  }
}

function validateUnsafeFixture(pack) {
  expectArray(pack.blocked_actions, "unsafe blocked_actions");
  expect(pack.blocked_actions.length >= 1, "unsafe fixture must preserve blocked actions");

  const completedActionCommands = pack.actions
    .filter((entry) => entry && typeof entry === "object" && entry.status === "completed")
    .map((entry) => entry.command)
    .filter((value) => typeof value === "string");

  const completedToolCallCommands = pack.tool_calls
    .filter((entry) => entry && typeof entry === "object" && entry.status === "completed")
    .map((entry) => entry.command)
    .filter((value) => typeof value === "string");

  const completedToolCallOutputs = pack.tool_calls
    .filter((entry) => entry && typeof entry === "object" && entry.status === "completed")
    .map((entry) => entry.output_summary)
    .filter((value) => typeof value === "string");

  for (const [index, blockedAction] of pack.blocked_actions.entries()) {
    expectPlainObject(blockedAction, `unsafe blocked_actions[${index}]`);
    expect(blockedAction.execution_result_present === false, `unsafe blocked action ${index} must not expose execution results`);
    expect(
      typeof blockedAction.attempted_command === "string" && blockedAction.attempted_command.length >= 1,
      `unsafe blocked action ${index} must preserve attempted_command`
    );
    expect(
      !completedActionCommands.includes(blockedAction.attempted_command),
      `unsafe blocked command must not appear as a completed action command (${blockedAction.attempted_command})`
    );
    expect(
      !completedToolCallCommands.includes(blockedAction.attempted_command),
      `unsafe blocked command must not appear as a completed tool call command (${blockedAction.attempted_command})`
    );
    expect(
      !completedToolCallOutputs.some((value) => value.includes(blockedAction.attempted_command)),
      `unsafe blocked command must not appear inside completed tool call output (${blockedAction.attempted_command})`
    );
  }
}

function validateIngestSummary(summary, pack, fixtureName) {
  expect(summary.profile === "harness-evidence-ingest-summary", `${fixtureName} summary profile mismatch`);
  expect(summary.schema_version === "0.1-preview", `${fixtureName} summary schema version mismatch`);
  expect(summary.consumer.authority === "mindforge-guard-core", `${fixtureName} summary consumer.authority mismatch`);
  expect(summary.consumer.summary_owner === "mindforge-guard", `${fixtureName} summary consumer.summary_owner mismatch`);
  expect(summary.source_pack.pack_type === pack.pack_type, `${fixtureName} summary source pack type mismatch`);
  expect(summary.governance_non_claims.verdict === "not_computed", `${fixtureName} summary verdict non-claim mismatch`);
  expect(summary.governance_non_claims.reason_codes === "not_computed", `${fixtureName} summary reason_codes non-claim mismatch`);
  expect(summary.governance_non_claims.risk_summary === "not_computed", `${fixtureName} summary risk_summary non-claim mismatch`);
  expect(summary.governance_non_claims.evidence_coverage === "not_scored", `${fixtureName} summary evidence_coverage non-claim mismatch`);
  expect(summary.governance_non_claims.governance_report === "not_generated", `${fixtureName} summary governance_report non-claim mismatch`);
  expect(summary.governance_non_claims.evidence_index === "not_generated", `${fixtureName} summary evidence_index non-claim mismatch`);
  expect(summary.governance_non_claims.execution_authority === "not_granted", `${fixtureName} summary execution_authority non-claim mismatch`);
  expect(summary.producer.boundary === "producer_only", `${fixtureName} summary producer boundary mismatch`);
  expect(summary.source_pack.id === pack.pack_id, `${fixtureName} summary source pack id mismatch`);
  expect(summary.ingest_validation.valid === true, `${fixtureName} summary ingest_validation.valid mismatch`);
  expect(Array.isArray(summary.ingest_validation.failures) && summary.ingest_validation.failures.length === 0, `${fixtureName} summary failures must be empty`);
  expect(Array.isArray(summary.ingest_validation.warnings), `${fixtureName} summary warnings must be an array`);
}

function summarizeFixture(pack, fixtureName) {
  return {
    fixture: fixtureName,
    pack_id: pack.pack_id,
    pack_type: pack.pack_type,
    completed_action_count: pack.actions.filter((entry) => entry.status === "completed").length,
    completed_tool_call_count: pack.tool_calls.filter((entry) => entry.status === "completed").length,
    blocked_action_count: pack.blocked_actions.length,
    manifest_file_count: pack.manifest.files.length,
    manifest_completeness: pack.manifest.completeness,
    consumer_side_only:
      pack.authority.boundary === "producer_only" &&
      pack.authority.consumer_authority === "mindforge-guard-core" &&
      pack.authority.governance_outputs_emitted === false &&
      pack.authority.execution_authority_granted === false,
  };
}

function validateFixture(repoRoot, fixtureName, mode) {
  const fixtureDir = path.join(repoRoot, "fixtures", "harness_evidence_ingestion_spike", fixtureName);
  const evidencePackPath = path.join(fixtureDir, "evidence-pack.json");
  expect(fs.existsSync(evidencePackPath), `${fixtureName} evidence-pack.json must exist`);

  const pack = readJson(evidencePackPath);

  validateRequiredTopLevelFields(pack, fixtureName);
  validateProducerBoundary(pack, fixtureName);
  validateNoForbiddenGovernanceOutputs(pack, fixtureName);
  validateManifestConsistency(pack, fixtureDir, fixtureName);

  if (mode === "safe") {
    validateSafeFixture(pack);
  } else {
    validateUnsafeFixture(pack);
  }

  const validationResult = {
    valid: true,
    failures: [],
    warnings: [],
  };

  const ingestSummary = normalizeHarnessEvidenceIngestSummary({
    evidencePack: pack,
    validationResult,
    fixtureDir,
    fixtureName,
  });

  validateIngestSummary(ingestSummary, pack, fixtureName);

  return {
    summary: summarizeFixture(pack, fixtureName),
    ingestSummary,
  };
}

function validateSpecDocument(repoRoot) {
  const specPath = path.join(
    repoRoot,
    "docs",
    "adapters",
    "harness-evidence-ingest-summary-bridge.md"
  );
  expect(fs.existsSync(specPath), "adapter spec document must exist");

  const specText = readText(specPath, "adapter spec document");
  for (const phrase of [
    "harness-evidence-ingest-summary",
    "0.1-preview",
    "producer_only",
    "mindforge-guard-core",
    "not_computed",
    "not_scored",
    "not_generated",
    "not_granted",
    "does not compute final governance verdicts",
    "does not compute Guard reason codes",
    "does not compute risk summaries",
    "does not score evidence coverage",
    "does not generate governance reports",
    "does not generate stable evidence indexes",
    "does not approve, block, deploy, rollback, merge, commit, execute, or control runtime behavior",
    "does not change audit, permit, or classify",
  ]) {
    expect(specText.includes(phrase), `adapter spec document must include phrase: ${phrase}`);
  }
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");
  const emitIngestSummary = process.argv.includes("--summary");

  validateSpecDocument(repoRoot);

  const safeFixture = validateFixture(repoRoot, "safe", "safe");
  const unsafeFixture = validateFixture(repoRoot, "unsafe", "unsafe");

  const output = {
    safe_fixture: safeFixture.summary,
    unsafe_fixture: unsafeFixture.summary,
  };

  if (emitIngestSummary) {
    output.safe_ingest_summary = safeFixture.ingestSummary;
    output.unsafe_ingest_summary = unsafeFixture.ingestSummary;
  }

  console.log(
    JSON.stringify(
      output,
      null,
      2
    )
  );
  console.log("PASS: harness evidence ingestion spike verified.");
}

main();
