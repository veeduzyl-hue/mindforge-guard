import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const schemaPath = path.join(repoRoot, "schemas", "authority", "authority-boundary.schema.json");
const insideFixturePath = path.join(
  repoRoot,
  "fixtures",
  "authority",
  "authority-boundary.inside-scope.valid.json"
);
const outsideFixturePath = path.join(
  repoRoot,
  "fixtures",
  "authority",
  "authority-boundary.outside-scope.valid.json"
);

const REQUIRED_POSTURE_FLAGS = [
  "v6_14_preview",
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

const ALLOWED_DECISIONS = [
  "inside_scope",
  "outside_scope",
  "needs_review",
  "insufficient_context",
];

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function readJson(filePath) {
  let raw;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch (error) {
    fail(`missing required file: ${path.relative(repoRoot, filePath)} (${error.message})`);
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    fail(`invalid JSON: ${path.relative(repoRoot, filePath)} (${error.message})`);
  }
}

function validateSchemaFlagShape(schema) {
  expect(Array.isArray(schema.required), "schema.required must be an array");
  expect(schema.properties && typeof schema.properties === "object", "schema.properties must exist");

  for (const flag of REQUIRED_POSTURE_FLAGS) {
    expect(schema.required.includes(flag), `schema.required missing ${flag}`);
    const property = schema.properties[flag];
    expect(property && typeof property === "object", `schema.properties missing ${flag}`);
    expect(property.const === true, `schema property ${flag} must const true`);
  }
}

function validateFixtureFlags(name, fixture) {
  for (const flag of REQUIRED_POSTURE_FLAGS) {
    expect(flag in fixture, `${name} missing posture flag ${flag}`);
    expect(fixture[flag] === true, `${name} posture flag ${flag} must be true`);
  }
}

function validateDecisionEnum(schema) {
  const decision = schema.properties?.decision;
  expect(decision && Array.isArray(decision.enum), "schema decision enum must exist");
  expect(
    decision.enum.length === ALLOWED_DECISIONS.length,
    "schema decision enum must contain exactly four values"
  );

  for (const allowed of ALLOWED_DECISIONS) {
    expect(decision.enum.includes(allowed), `schema decision enum missing ${allowed}`);
  }

  for (const actual of decision.enum) {
    expect(ALLOWED_DECISIONS.includes(actual), `schema decision enum contains unexpected value ${actual}`);
  }
}

function validateDecisionValue(name, fixture, expectedDecision) {
  expect(ALLOWED_DECISIONS.includes(fixture.decision), `${name} decision must be allowed`);
  expect(fixture.decision === expectedDecision, `${name} decision must be ${expectedDecision}`);
}

function validateNonEnforcingFixture(name, fixture) {
  expect(fixture.no_execution_authority === true, `${name} must preserve no_execution_authority`);
  expect(fixture.no_commit_gate_semantics === true, `${name} must preserve no_commit_gate_semantics`);
  expect(
    fixture.no_license_gating_semantic_change === true,
    `${name} must preserve no_license_gating_semantic_change`
  );
  expect(
    fixture.no_current_cli_contract_change === true,
    `${name} must preserve no_current_cli_contract_change`
  );
  expect(
    fixture.no_current_exit_code_semantic_change === true,
    `${name} must preserve no_current_exit_code_semantic_change`
  );

  const scope = fixture.authority_scope;
  expect(scope && typeof scope === "object", `${name} authority_scope must exist`);
  expect(scope.blocking_implied === false, `${name} must not imply blocking`);
  expect(scope.execution_authority_granted === false, `${name} must not grant execution authority`);

  const receipt = fixture.authority_receipt;
  expect(receipt && typeof receipt === "object", `${name} authority_receipt must exist`);
  expect(receipt.recommendation_only === true, `${name} receipt must be recommendation_only`);
  expect(receipt.non_executing === true, `${name} receipt must be non_executing`);
  expect(receipt.default_off === true, `${name} receipt must be default_off`);
  expect(receipt.machine_verifiable === true, `${name} receipt must be machine_verifiable`);
  expect(receipt.execution_authority_granted === false, `${name} receipt must not grant execution authority`);
  expect(receipt.enforcement_action === "none", `${name} receipt must not imply enforcement`);
  expect(receipt.blocking_effect === false, `${name} receipt must not imply blocking`);

  const forbiddenFields = [
    "approval_authority",
    "commit_gate",
    "deployment_gate",
    "deployment_authority",
  ];

  const stack = [fixture];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      expect(!forbiddenFields.includes(key), `${name} must not define forbidden field ${key}`);
      if (value && typeof value === "object") {
        stack.push(value);
      }
    }
  }
}

function main() {
  const schema = readJson(schemaPath);
  const insideFixture = readJson(insideFixturePath);
  const outsideFixture = readJson(outsideFixturePath);

  validateSchemaFlagShape(schema);
  validateDecisionEnum(schema);

  validateFixtureFlags("inside fixture", insideFixture);
  validateFixtureFlags("outside fixture", outsideFixture);

  validateDecisionValue("inside fixture", insideFixture, "inside_scope");
  validateDecisionValue("outside fixture", outsideFixture, "outside_scope");

  validateNonEnforcingFixture("inside fixture", insideFixture);
  validateNonEnforcingFixture("outside fixture", outsideFixture);

  process.stdout.write("PASS verify_v6_14_authority_boundary_fixtures\n");
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
