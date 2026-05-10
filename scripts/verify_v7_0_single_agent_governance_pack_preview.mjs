import crypto from "node:crypto";
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
  expect(Array.isArray(value), `${label} must be an array`);
}

function expectObject(value, label) {
  expect(value && typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
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

function readJsonYaml(filePath, label) {
  try {
    return JSON.parse(readText(filePath, label));
  } catch (error) {
    fail(`${label} must contain JSON-compatible YAML (${error.message})`);
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

function stableSerialize(value) {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function stableHashForPack(packDir) {
  const files = listRelativeFiles(packDir);
  const hash = crypto.createHash("sha256");
  for (const relativePath of files) {
    const fullPath = path.join(packDir, relativePath);
    hash.update(relativePath);
    hash.update("\n");
    hash.update(readText(fullPath, relativePath));
    hash.update("\n");
  }
  return `sha256:${hash.digest("hex")}`;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const schemaDir = path.join(repoRoot, "schemas", "single_agent_governance_pack_preview", "v1");
const fixtureRoot = path.join(repoRoot, "fixtures", "single_agent_governance_pack_preview");

const expectedSchemaFiles = [
  "manifest.schema.json",
  "agent-profile.schema.json",
  "action-boundary.schema.json",
  "data-sources.schema.json",
  "tools.schema.json",
  "sample-output.schema.json",
  "run-record.schema.json",
  "snapshot.schema.json"
];

const expectedFixtureDirs = [
  "valid_minimal_pack",
  "missing_required_file_pack",
  "missing_required_field_pack",
  "limitation_optional_missing_pack"
];

const requiredFiles = [
  "manifest.json",
  "agent-profile.json",
  "task-scope.md",
  "action-boundary.yaml",
  "data-sources.yaml",
  "tools.yaml",
  "evidence/sample-output.json"
];

const recommendedFiles = [
  "review-standards.md",
  "evidence/run-record.json"
];

const optionalFiles = [
  "snapshot.json"
];

const forbiddenFieldKeys = new Set([
  "approval_authority",
  "blocking_authority",
  "merge_authority",
  "deployment_authority",
  "execution_authority",
  "runtime_enforcement",
  "enforcement_action",
  "approval_result",
  "blocking_effect",
  "deployment_status",
  "merge_status",
  "permit_result",
  "commit_result"
]);

const schemaExpectations = {
  "manifest.schema.json": {
    required: [
      "pack_id",
      "pack_version",
      "pack_type",
      "created_at",
      "updated_at",
      "owner",
      "source_repo",
      "report_target"
    ]
  },
  "agent-profile.schema.json": {
    required: [
      "agent_id",
      "agent_name",
      "agent_type",
      "business_owner",
      "technical_owner",
      "review_owner",
      "intended_users",
      "operating_context"
    ]
  },
  "action-boundary.schema.json": {
    required: [
      "allowed_actions",
      "prohibited_actions",
      "human_review_required",
      "escalation_required",
      "external_side_effects"
    ]
  },
  "data-sources.schema.json": {
    required: [
      "data_sources"
    ]
  },
  "tools.schema.json": {
    required: [
      "tools"
    ]
  },
  "sample-output.schema.json": {
    required: [
      "sample_id",
      "input_summary",
      "output_summary",
      "output_artifact_ref",
      "expected_behavior",
      "observed_behavior",
      "reviewer_note"
    ]
  },
  "run-record.schema.json": {
    required: [
      "run_id",
      "run_timestamp",
      "environment",
      "input_ref",
      "output_ref",
      "tool_calls_summary",
      "errors_or_warnings",
      "reviewer_observation"
    ]
  },
  "snapshot.schema.json": {
    required: [
      "snapshot_id",
      "version",
      "commit_sha",
      "environment",
      "generated_at",
      "artifact_hashes",
      "comparison_baseline"
    ]
  }
};

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

function assertNoForbiddenSemantics(value, label) {
  walk(value, (key, entry, entryPath) => {
    expect(!forbiddenFieldKeys.has(key), `${label} must not define forbidden field ${entryPath}`);
    if (typeof entry === "string") {
      expect(!/approval authority/i.test(entry), `${label} must not mention approval authority at ${entryPath}`);
      expect(!/blocking authority/i.test(entry), `${label} must not mention blocking authority at ${entryPath}`);
      expect(!/merge authority/i.test(entry), `${label} must not mention merge authority at ${entryPath}`);
      expect(!/deployment authority/i.test(entry), `${label} must not mention deployment authority at ${entryPath}`);
      expect(!/execution authority/i.test(entry), `${label} must not mention execution authority at ${entryPath}`);
      expect(!/runtime enforcement/i.test(entry), `${label} must not mention runtime enforcement at ${entryPath}`);
    }
  });
}

function validateSchemaFile(fileName) {
  const schemaPath = path.join(schemaDir, fileName);
  expect(fs.existsSync(schemaPath), `schema ${fileName} must exist`);
  const schema = readJson(schemaPath, `schema ${fileName}`);
  expect(schema.type === "object", `schema ${fileName} type mismatch`);
  expect(schema.additionalProperties === false, `schema ${fileName} must set additionalProperties false`);
  expectArray(schema.required, `schema ${fileName}.required`);
  expect(
    JSON.stringify([...schema.required].sort()) === JSON.stringify([...schemaExpectations[fileName].required].sort()),
    `schema ${fileName} required fields mismatch`
  );
  assertNoForbiddenSemantics(schema, `schema ${fileName}`);
}

function validateTaskScope(text, label) {
  for (const section of [
    "intended task:",
    "in-scope behavior:",
    "out-of-scope behavior:",
    "success criteria:",
    "known limitations:"
  ]) {
    expect(text.includes(section), `${label} must include section ${section}`);
  }
}

function validateReviewStandards(text, label) {
  for (const section of [
    "review criteria:",
    "acceptance expectations:",
    "known policy references:",
    "reviewer notes:"
  ]) {
    expect(text.includes(section), `${label} must include section ${section}`);
  }
}

function validateManifest(value, label) {
  expectObject(value, label);
  for (const key of schemaExpectations["manifest.schema.json"].required) {
    expect(key in value, `${label} missing ${key}`);
  }
  expect(value.pack_version === "v1", `${label}.pack_version mismatch`);
  expect(value.pack_type === "single_agent_governance_pack_preview", `${label}.pack_type mismatch`);
  expect(value.report_target === "single_agent_governance_report_preview_v1", `${label}.report_target mismatch`);
}

function validateAgentProfile(value, label) {
  expectObject(value, label);
  for (const key of schemaExpectations["agent-profile.schema.json"].required) {
    expect(key in value, `${label} missing ${key}`);
  }
  expect(value.agent_type === "single_agent", `${label}.agent_type mismatch`);
  expectArray(value.intended_users, `${label}.intended_users`);
  expect(value.intended_users.length >= 1, `${label}.intended_users must be non-empty`);
}

function validateActionBoundary(value, label) {
  expectObject(value, label);
  for (const key of schemaExpectations["action-boundary.schema.json"].required) {
    expect(key in value, `${label} missing ${key}`);
  }
  expectArray(value.allowed_actions, `${label}.allowed_actions`);
  expectArray(value.prohibited_actions, `${label}.prohibited_actions`);
  expect(value.allowed_actions.length >= 1, `${label}.allowed_actions must be non-empty`);
  expect(value.prohibited_actions.length >= 1, `${label}.prohibited_actions must be non-empty`);
  expect(typeof value.human_review_required === "boolean", `${label}.human_review_required must be boolean`);
  expect(typeof value.escalation_required === "boolean", `${label}.escalation_required must be boolean`);
}

function validateDataSources(value, label) {
  expectObject(value, label);
  expectArray(value.data_sources, `${label}.data_sources`);
  expect(value.data_sources.length >= 1, `${label}.data_sources must be non-empty`);
  value.data_sources.forEach((entry, index) => {
    const itemLabel = `${label}.data_sources[${index}]`;
    for (const key of [
      "data_source_id",
      "data_source_name",
      "data_category",
      "access_mode",
      "sensitivity_level",
      "retention_note",
      "usage_purpose"
    ]) {
      expect(key in entry, `${itemLabel} missing ${key}`);
      expectString(entry[key], `${itemLabel}.${key}`);
    }
  });
}

function validateTools(value, label) {
  expectObject(value, label);
  expectArray(value.tools, `${label}.tools`);
  expect(value.tools.length >= 1, `${label}.tools must be non-empty`);
  value.tools.forEach((entry, index) => {
    const itemLabel = `${label}.tools[${index}]`;
    for (const key of [
      "tool_id",
      "tool_name",
      "tool_type",
      "permitted_operations",
      "prohibited_operations",
      "requires_human_approval",
      "side_effect_level"
    ]) {
      expect(key in entry, `${itemLabel} missing ${key}`);
    }
    expectArray(entry.permitted_operations, `${itemLabel}.permitted_operations`);
    expectArray(entry.prohibited_operations, `${itemLabel}.prohibited_operations`);
    expect(typeof entry.requires_human_approval === "boolean", `${itemLabel}.requires_human_approval must be boolean`);
  });
}

function validateSampleOutput(value, label) {
  expectObject(value, label);
  for (const key of schemaExpectations["sample-output.schema.json"].required) {
    expect(key in value, `${label} missing ${key}`);
    expectString(value[key], `${label}.${key}`);
  }
}

function validateRunRecord(value, label) {
  expectObject(value, label);
  for (const key of schemaExpectations["run-record.schema.json"].required) {
    expect(key in value, `${label} missing ${key}`);
  }
  expectArray(value.tool_calls_summary, `${label}.tool_calls_summary`);
  expectArray(value.errors_or_warnings, `${label}.errors_or_warnings`);
}

function validateSnapshot(value, label) {
  expectObject(value, label);
  for (const key of schemaExpectations["snapshot.schema.json"].required) {
    expect(key in value, `${label} missing ${key}`);
  }
  expectArray(value.artifact_hashes, `${label}.artifact_hashes`);
  expect(value.artifact_hashes.length >= 1, `${label}.artifact_hashes must be non-empty`);
}

function validatePack(packName) {
  const packDir = path.join(fixtureRoot, packName);
  expect(fs.existsSync(packDir), `fixture ${packName} must exist`);

  const omissions = [];
  const limitations = [];

  for (const relativePath of requiredFiles) {
    if (!fs.existsSync(path.join(packDir, relativePath))) {
      omissions.push(`missing required file: ${relativePath}`);
    }
  }

  for (const relativePath of recommendedFiles) {
    if (!fs.existsSync(path.join(packDir, relativePath))) {
      limitations.push(`missing recommended file: ${relativePath}`);
    }
  }

  for (const relativePath of optionalFiles) {
    if (!fs.existsSync(path.join(packDir, relativePath))) {
      limitations.push(`missing optional file: ${relativePath}`);
    }
  }

  if (!omissions.length) {
    const manifest = readJson(path.join(packDir, "manifest.json"), `${packName}/manifest.json`);
    const agentProfile = readJson(path.join(packDir, "agent-profile.json"), `${packName}/agent-profile.json`);
    const sampleOutput = readJson(
      path.join(packDir, "evidence", "sample-output.json"),
      `${packName}/evidence/sample-output.json`
    );
    const actionBoundary = readJsonYaml(
      path.join(packDir, "action-boundary.yaml"),
      `${packName}/action-boundary.yaml`
    );
    const dataSources = readJsonYaml(
      path.join(packDir, "data-sources.yaml"),
      `${packName}/data-sources.yaml`
    );
    const tools = readJsonYaml(
      path.join(packDir, "tools.yaml"),
      `${packName}/tools.yaml`
    );
    const taskScopeText = readText(path.join(packDir, "task-scope.md"), `${packName}/task-scope.md`);

    try {
      validateManifest(manifest, `${packName}/manifest.json`);
      validateAgentProfile(agentProfile, `${packName}/agent-profile.json`);
      validateActionBoundary(actionBoundary, `${packName}/action-boundary.yaml`);
      validateDataSources(dataSources, `${packName}/data-sources.yaml`);
      validateTools(tools, `${packName}/tools.yaml`);
      validateSampleOutput(sampleOutput, `${packName}/evidence/sample-output.json`);
      validateTaskScope(taskScopeText, `${packName}/task-scope.md`);
      assertNoForbiddenSemantics(manifest, `${packName}/manifest.json`);
      assertNoForbiddenSemantics(agentProfile, `${packName}/agent-profile.json`);
      assertNoForbiddenSemantics(actionBoundary, `${packName}/action-boundary.yaml`);
      assertNoForbiddenSemantics(dataSources, `${packName}/data-sources.yaml`);
      assertNoForbiddenSemantics(tools, `${packName}/tools.yaml`);
      assertNoForbiddenSemantics(sampleOutput, `${packName}/evidence/sample-output.json`);
    } catch (error) {
      omissions.push(error.message);
    }

    if (fs.existsSync(path.join(packDir, "review-standards.md"))) {
      const reviewStandardsText = readText(
        path.join(packDir, "review-standards.md"),
        `${packName}/review-standards.md`
      );
      try {
        validateReviewStandards(reviewStandardsText, `${packName}/review-standards.md`);
      } catch (error) {
        omissions.push(error.message);
      }
    }

    if (fs.existsSync(path.join(packDir, "evidence", "run-record.json"))) {
      try {
        const runRecord = readJson(
          path.join(packDir, "evidence", "run-record.json"),
          `${packName}/evidence/run-record.json`
        );
        validateRunRecord(runRecord, `${packName}/evidence/run-record.json`);
        assertNoForbiddenSemantics(runRecord, `${packName}/evidence/run-record.json`);
      } catch (error) {
        omissions.push(error.message);
      }
    }

    if (fs.existsSync(path.join(packDir, "snapshot.json"))) {
      try {
        const snapshot = readJson(path.join(packDir, "snapshot.json"), `${packName}/snapshot.json`);
        validateSnapshot(snapshot, `${packName}/snapshot.json`);
        assertNoForbiddenSemantics(snapshot, `${packName}/snapshot.json`);
      } catch (error) {
        omissions.push(error.message);
      }
    }
  }

  const hashA = stableHashForPack(packDir);
  const hashB = stableHashForPack(packDir);
  expect(hashA === hashB, `${packName} must produce a deterministic hash`);

  return {
    status: omissions.length ? "fail" : "pass",
    omissions,
    limitations,
    deterministic_hash: hashA
  };
}

function main() {
  expect(fs.existsSync(schemaDir), "schema preview directory must exist");
  expect(fs.existsSync(fixtureRoot), "fixture preview directory must exist");

  for (const fileName of expectedSchemaFiles) {
    validateSchemaFile(fileName);
  }

  for (const dirName of expectedFixtureDirs) {
    expect(fs.existsSync(path.join(fixtureRoot, dirName)), `fixture directory ${dirName} must exist`);
  }

  const validPack = validatePack("valid_minimal_pack");
  expect(validPack.status === "pass", "valid_minimal_pack must pass");
  expect(validPack.omissions.length === 0, "valid_minimal_pack must not report omissions");

  const missingRequiredFilePack = validatePack("missing_required_file_pack");
  expect(missingRequiredFilePack.status === "fail", "missing_required_file_pack must fail");
  expect(
    missingRequiredFilePack.omissions.some((entry) => entry.includes("missing required file")),
    "missing_required_file_pack must classify the failure as omission"
  );

  const missingRequiredFieldPack = validatePack("missing_required_field_pack");
  expect(missingRequiredFieldPack.status === "fail", "missing_required_field_pack must fail");
  expect(
    missingRequiredFieldPack.omissions.length >= 1,
    "missing_required_field_pack must classify the failure as omission"
  );

  const limitationPack = validatePack("limitation_optional_missing_pack");
  expect(limitationPack.status === "pass", "limitation_optional_missing_pack must pass");
  expect(
    limitationPack.limitations.some((entry) => entry.includes("missing recommended file")) ||
      limitationPack.limitations.some((entry) => entry.includes("missing optional file")),
    "limitation_optional_missing_pack must produce limitation classification"
  );

  console.log("PASS: v7.0 single_agent_governance_pack_preview schemas and fixtures validated.");
}

main();
