import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const schemaPath = path.join(
  repoRoot,
  "schemas",
  "guardrail_mapping",
  "symbolic-guardrail-mapping-preview.schema.json"
);
const fixturePath = path.join(
  repoRoot,
  "fixtures",
  "guardrail_mapping",
  "symbolic-guardrail-mapping.cases.valid.json"
);
const boundaryDocPath = path.join(
  repoRoot,
  "docs",
  "governance",
  "v6_19_symbolic_guardrail_mapping_boundary.md"
);
const finalAcceptanceDocPath = path.join(
  repoRoot,
  "docs",
  "governance",
  "v6_19_symbolic_guardrail_mapping_final_acceptance.md"
);

const EXPECTED_GUARDRAIL_TYPES = [
  "schema_constraint",
  "api_validation",
  "state_check",
  "evidence_check",
  "capability_check",
  "context_check",
  "confirmation_required",
];
const EXPECTED_MAPPING_STATUS = [
  "mapped",
  "partially_mapped",
  "unmapped",
  "out_of_scope",
  "unknown",
];
const EXPECTED_VERIFICATION_SURFACES = [
  "fixture_declared",
  "schema_declared",
  "external_system_required",
  "human_review_required",
  "not_symbolically_mappable",
];
const ALLOWED_EXIT_CODES = new Set([0, 2, 30]);
const FORBIDDEN_FIELDS = new Set([
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
]);
const FORBIDDEN_VALUES = new Set([...FORBIDDEN_FIELDS]);

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function expectFileExists(filePath, label) {
  expect(fs.existsSync(filePath), `${label} must exist at ${path.relative(repoRoot, filePath)}`);
}

function parseJsonOutput(result, label) {
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    fail(`${label} must output valid JSON (${error.message})`);
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
  walk(value, (entry) => {
    if (typeof entry === "string" && FORBIDDEN_FIELDS.has(entry)) {
      throw new Error(`${label} contains forbidden field ${entry}`);
    }
    if (typeof entry === "string" && FORBIDDEN_VALUES.has(entry.toLowerCase())) {
      throw new Error(`${label} contains forbidden value ${entry}`);
    }
  });
}

function expectPassScript(scriptPath, expectedStdout) {
  try {
    const stdout = execFileSync(process.execPath, [scriptPath], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    expect(stdout === expectedStdout, `${scriptPath} stdout mismatch`);
  } catch (error) {
    const stderr = error?.stderr?.toString?.() || error?.message || String(error);
    fail(`${scriptPath} failed: ${stderr}`);
  }
}

function expectExactArray(actual, expected, label) {
  expect(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${label} mismatch: expected ${JSON.stringify(expected)} got ${JSON.stringify(actual)}`
  );
}

function changedFilesFor(paths) {
  const mergeBase = execFileSync("git", ["merge-base", "main", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
  const committed = execFileSync("git", ["diff", "--name-only", `${mergeBase}...HEAD`, "--", ...paths], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  const unstaged = execFileSync("git", ["diff", "--name-only", "--", ...paths], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  const staged = execFileSync("git", ["diff", "--cached", "--name-only", "--", ...paths], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  return [...new Set(
    [committed, unstaged, staged]
      .flatMap((chunk) => chunk.split(/\r?\n/))
      .map((value) => value.trim())
      .filter(Boolean)
  )];
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function createTempFixtures() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-guardrail-final-"));
  const baseFixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const malformedPath = path.join(tempRoot, "malformed.json");
  const invalidJsonPath = path.join(tempRoot, "invalid.json");
  const missingFixturePath = path.join(tempRoot, "missing.json");

  const malformedFixture = structuredClone(baseFixture);
  delete malformedFixture.cases;
  writeJson(malformedPath, malformedFixture);
  fs.writeFileSync(invalidJsonPath, "{ invalid json\n", "utf8");

  return { tempRoot, malformedPath, invalidJsonPath, missingFixturePath };
}

function expectObservedExitCodes(observedExitCodes) {
  expect(!observedExitCodes.has(21), "v6.19 preview must not use exit 21");
  expect(!observedExitCodes.has(25), "v6.19 preview must not use exit 25");
  for (const exitCode of observedExitCodes) {
    expect(ALLOWED_EXIT_CODES.has(exitCode), `unexpected exit code observed: ${exitCode}`);
  }
}

function expectBoundaryDoc(boundaryDoc) {
  expect(boundaryDoc.includes("Mapping, not enforcement"), "boundary doc must include the narrative 'Mapping, not enforcement'");
  expect(boundaryDoc.includes("mapping-only"), "boundary doc must preserve mapping-only language");
  expect(boundaryDoc.includes("non-enforcing"), "boundary doc must preserve non-enforcing language");
  const notIncludedIndex = boundaryDoc.indexOf("## Not Included");
  expect(notIncludedIndex >= 0, "boundary doc must include a Not Included section");
  const notIncludedSection = boundaryDoc.slice(notIncludedIndex);
  for (const phrase of [
    "enforcement behavior",
    "commit gate behavior",
    "permit gate behavior",
    "deployment gate behavior",
    "policy-engine behavior",
    "commercial entitlement change",
  ]) {
    expect(notIncludedSection.includes(phrase), `boundary doc Not Included section must include ${phrase}`);
  }
}

function expectFinalAcceptanceDoc(finalAcceptanceDoc) {
  for (const phrase of [
    "v6.19 — Symbolic Guardrail Mapping Boundary",
    "internally final accepted / RC-frozen",
    "Mapping, not enforcement",
    "guard guardrail map --preview --json --fixture-file <file>",
    "preview: true",
    "mapping_only: true",
    "enforcement_action: \"none\"",
    "blocking_effect: false",
    "execution_authority_granted: false",
    "non_enforcement_boundary",
    "deterministic_hash",
    "no release",
    "no README/current docs change",
    "no License Hub change",
    "no pricing change",
    "no commercial edition change",
    "no demo change",
    "no mindforge.run change",
  ]) {
    expect(finalAcceptanceDoc.includes(phrase), `final acceptance doc must include ${phrase}`);
  }
}

const { runGuard } = await import("../packages/guard/src/runGuard.mjs");

async function main() {
  expectPassScript(
    "scripts/verify_v6_19_symbolic_guardrail_mapping_preview.mjs",
    "symbolic guardrail mapping preview verified\n"
  );

  expectFileExists(schemaPath, "v6.19 schema");
  expectFileExists(fixturePath, "v6.19 fixture bundle");
  expectFileExists(boundaryDocPath, "v6.19 boundary doc");
  expectFileExists(finalAcceptanceDocPath, "v6.19 final acceptance doc");

  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  expectExactArray(schema.$defs.guardrailType.enum, EXPECTED_GUARDRAIL_TYPES, "guardrail_type enum");
  expectExactArray(schema.$defs.mappingStatus.enum, EXPECTED_MAPPING_STATUS, "mapping_status enum");
  expectExactArray(
    schema.$defs.verificationSurface.enum,
    EXPECTED_VERIFICATION_SURFACES,
    "verification_surface enum"
  );

  const boundaryDoc = fs.readFileSync(boundaryDocPath, "utf8");
  expectBoundaryDoc(boundaryDoc);

  const finalAcceptanceDoc = fs.readFileSync(finalAcceptanceDocPath, "utf8");
  expectFinalAcceptanceDoc(finalAcceptanceDoc);

  const observedExitCodes = new Set();
  const recordExit = (result) => {
    observedExitCodes.add(result.exitCode);
    return result;
  };

  const baseArgs = [
    "guardrail",
    "map",
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/guardrail_mapping/symbolic-guardrail-mapping.cases.valid.json",
  ];

  const firstResult = recordExit(await runGuard({ argv: baseArgs }));
  expect(firstResult.exitCode === 0, "valid fixture should exit 0");
  const firstPayload = parseJsonOutput(firstResult, "valid fixture");

  const secondResult = recordExit(await runGuard({ argv: baseArgs }));
  expect(secondResult.exitCode === 0, "repeat valid fixture should exit 0");
  const secondPayload = parseJsonOutput(secondResult, "repeat valid fixture");

  expect(firstPayload.schema_version === "guard.symbolic_guardrail_mapping.v1", "schema_version mismatch");
  expect(firstPayload.preview === true, "preview mismatch");
  expect(firstPayload.mapping_only === true, "mapping_only mismatch");
  expect(firstPayload.enforcement_action === "none", "enforcement_action mismatch");
  expect(firstPayload.blocking_effect === false, "blocking_effect mismatch");
  expect(firstPayload.execution_authority_granted === false, "execution_authority_granted mismatch");
  expect(firstPayload.non_enforcement_boundary, "non_enforcement_boundary must exist");
  expect(
    typeof firstPayload.deterministic_hash === "string" && firstPayload.deterministic_hash.startsWith("sha256:"),
    "deterministic_hash must exist"
  );
  expect(
    JSON.stringify(firstPayload) === JSON.stringify(secondPayload),
    "preview output must remain deterministic across repeated runs"
  );
  expect(
    firstPayload.deterministic_hash === secondPayload.deterministic_hash,
    "deterministic_hash must remain stable across repeated runs"
  );

  const statuses = new Set(firstPayload.mappings.map((entry) => entry.mapping_status));
  for (const status of EXPECTED_MAPPING_STATUS) {
    expect(statuses.has(status), `mapping status ${status} must be represented`);
  }

  expect(firstPayload.input_summary.mapping_status_counts.mapped === 1, "mapped count mismatch");
  expect(firstPayload.input_summary.mapping_status_counts.partially_mapped === 1, "partially_mapped count mismatch");
  expect(firstPayload.input_summary.mapping_status_counts.unmapped === 1, "unmapped count mismatch");
  expect(firstPayload.input_summary.mapping_status_counts.out_of_scope === 1, "out_of_scope count mismatch");
  expect(firstPayload.input_summary.mapping_status_counts.unknown === 1, "unknown count mismatch");

  const payloadGuardrailTypes = [...new Set(firstPayload.mappings.map((entry) => entry.guardrail_type))].sort();
  expect(
    payloadGuardrailTypes.every((value) => EXPECTED_GUARDRAIL_TYPES.includes(value)),
    "payload guardrail_type values must remain bounded"
  );
  const payloadVerificationSurfaces = [...new Set(firstPayload.mappings.map((entry) => entry.verification_surface))].sort();
  expect(
    payloadVerificationSurfaces.every((value) => EXPECTED_VERIFICATION_SURFACES.includes(value)),
    "payload verification_surface values must remain bounded"
  );

  const boundary = firstPayload.non_enforcement_boundary;
  expect(boundary.mapping_only === true, "non_enforcement_boundary.mapping_only mismatch");
  expect(boundary.enforcement_action === "none", "non_enforcement_boundary.enforcement_action mismatch");
  expect(boundary.blocking_effect === false, "non_enforcement_boundary.blocking_effect mismatch");
  expect(
    boundary.execution_authority_granted === false,
    "non_enforcement_boundary.execution_authority_granted mismatch"
  );
  expect(
    boundary.does_not_evaluate_guardrail_result === true,
    "does_not_evaluate_guardrail_result mismatch"
  );
  expect(boundary.does_not_create_policy_engine === true, "does_not_create_policy_engine mismatch");
  expect(boundary.does_not_create_commit_gate === true, "does_not_create_commit_gate mismatch");
  expect(boundary.does_not_create_permit_gate === true, "does_not_create_permit_gate mismatch");
  expect(boundary.does_not_create_deployment_gate === true, "does_not_create_deployment_gate mismatch");

  expectNoForbiddenDecisionSemantics(firstPayload, "v6.19 preview payload");

  const missingPreview = recordExit(
    await runGuard({
      argv: ["guardrail", "map", "--json", "--fixture-file", "fixtures/guardrail_mapping/symbolic-guardrail-mapping.cases.valid.json"],
    })
  );
  expect(missingPreview.exitCode === 2, "missing --preview should exit 2");

  const missingJson = recordExit(
    await runGuard({
      argv: ["guardrail", "map", "--preview", "--fixture-file", "fixtures/guardrail_mapping/symbolic-guardrail-mapping.cases.valid.json"],
    })
  );
  expect(missingJson.exitCode === 2, "missing --json should exit 2");

  const missingFixture = recordExit(await runGuard({ argv: ["guardrail", "map", "--preview", "--json"] }));
  expect(missingFixture.exitCode === 2, "missing --fixture-file should exit 2");

  const unsupportedSubcommand = recordExit(await runGuard({ argv: ["guardrail", "enforce"] }));
  expect(unsupportedSubcommand.exitCode === 2, "unsupported guardrail subcommand should exit 2");

  const { tempRoot, malformedPath, invalidJsonPath, missingFixturePath } = createTempFixtures();
  try {
    const missingFixtureResult = recordExit(
      await runGuard({
        argv: ["guardrail", "map", "--preview", "--json", "--fixture-file", missingFixturePath],
      })
    );
    expect(missingFixtureResult.exitCode === 30, "missing fixture should exit 30");

    const invalidJsonResult = recordExit(
      await runGuard({
        argv: ["guardrail", "map", "--preview", "--json", "--fixture-file", invalidJsonPath],
      })
    );
    expect(invalidJsonResult.exitCode === 30, "invalid JSON fixture should exit 30");

    const malformedResult = recordExit(
      await runGuard({
        argv: ["guardrail", "map", "--preview", "--json", "--fixture-file", malformedPath],
      })
    );
    expect(malformedResult.exitCode === 30, "malformed fixture should exit 30");
    expect(
      parseJsonOutput(malformedResult, "malformed fixture").error.kind === "guardrail_mapping_preview_contract_invalid",
      "malformed fixture error kind mismatch"
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  expectObservedExitCodes(observedExitCodes);

  expect(
    changedFilesFor([
      "README.md",
      "RELEASE.md",
      "docs/product/current",
      "docs/demos/current",
      "docs/first-10-minutes.md",
      "docs/trust/safety-boundary.md",
      "apps/license-hub",
      "vercel.json",
      "packages/guard/src/product",
      "checkout",
      "pricing",
      "Paddle",
      "mindforge.run",
    ]).length === 0,
    "commercial and production protected paths must remain unchanged"
  );

  process.stdout.write("PASS verify_v6_19_symbolic_guardrail_mapping_final_acceptance\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
