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
  "transition_validity",
  "execution-bound-transition-validity-preview.schema.json"
);
const fixturePath = path.join(
  repoRoot,
  "fixtures",
  "transition_validity",
  "execution-bound-transition-validity.cases.valid.json"
);
const scopeCardPath = path.join(
  repoRoot,
  "docs",
  "governance",
  "v6_20_execution_bound_transition_validity_scope_card.md"
);
const boundaryDocPath = path.join(
  repoRoot,
  "docs",
  "governance",
  "v6_20_execution_bound_transition_validity_boundary.md"
);
const finalAcceptanceDocPath = path.join(
  repoRoot,
  "docs",
  "governance",
  "v6_20_execution_bound_transition_validity_final_acceptance.md"
);

const EXPECTED_TRANSITION_STATUS = [
  "preserved",
  "changed",
  "partially_preserved",
  "not_applicable",
  "unknown",
];
const EXPECTED_FINDING_TYPES = [
  "prerequisite_preserved",
  "prerequisite_changed",
  "prerequisite_partially_preserved",
  "insufficient_transition_evidence",
  "not_applicable_to_transition",
];
const EXPECTED_VERIFICATION_SURFACES = [
  "fixture_declared",
  "receipt_ref_declared",
  "symbolic_mapping_ref_declared",
  "external_system_required",
  "human_review_required",
  "not_preview_determinable",
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
  "execution_permission",
  "state_equivalence_proof",
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

function runGit(args) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
}

function changedFilesFor(paths) {
  const mergeBase = runGit(["merge-base", "main", "HEAD"]);
  const committed = runGit(["diff", "--name-only", `${mergeBase}...HEAD`, "--", ...paths]);
  const unstaged = runGit(["diff", "--name-only", "--", ...paths]);
  const staged = runGit(["diff", "--cached", "--name-only", "--", ...paths]);
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
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-transition-final-"));
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
  expect(!observedExitCodes.has(21), "v6.20 preview must not use exit 21");
  expect(!observedExitCodes.has(25), "v6.20 preview must not use exit 25");
  for (const exitCode of observedExitCodes) {
    expect(ALLOWED_EXIT_CODES.has(exitCode), `unexpected exit code observed: ${exitCode}`);
  }
}

function expectBoundaryDoc(boundaryDoc) {
  expect(
    boundaryDoc.includes("Transition explanation, not execution permission"),
    "boundary doc must include the narrative 'Transition explanation, not execution permission'"
  );
  const notIncludedIndex = boundaryDoc.indexOf("## Not Included");
  expect(notIncludedIndex >= 0, "boundary doc must include a Not Included section");
  const notIncludedSection = boundaryDoc.slice(notIncludedIndex);
  for (const phrase of [
    "execution permission grant",
    "commit gate behavior",
    "permit gate behavior",
    "deployment gate behavior",
    "runtime enforcement",
    "formal state equivalence proof",
    "commercial entitlement change",
  ]) {
    expect(notIncludedSection.includes(phrase), `boundary doc Not Included section must include ${phrase}`);
  }
}

function expectScopeCard(scopeCard) {
  for (const phrase of [
    "Scope card only. Not implemented.",
    "Transition explanation, not execution permission.",
    "no commit gate",
    "no permit gate",
    "no deployment gate",
    "no runtime enforcement",
    "no live repo reads",
    "no live source fetching",
    "no external API calls",
    "no formal proof of state equivalence",
  ]) {
    expect(scopeCard.includes(phrase), `scope card must include ${phrase}`);
  }
}

function expectFinalAcceptanceDoc(finalAcceptanceDoc) {
  for (const phrase of [
    "Execution-Bound Transition Validity Preview",
    "internally final accepted / RC-frozen",
    "Transition explanation, not execution permission",
    "guard transition explain --preview --json --fixture-file <file>",
    "preview: true",
    "explanation_only: true",
    "enforcement_action: \"none\"",
    "blocking_effect: false",
    "execution_authority_granted: false",
    "input_ref",
    "input_summary",
    "declared_transition",
    "prerequisite_refs",
    "transition_findings[]",
    "preservation_summary",
    "non_enforcement_boundary",
    "deterministic_hash",
    "no execution permission",
    "no state equivalence proof",
    "no commit gate",
    "no permit gate",
    "no deployment gate",
    "no runtime enforcement",
    "no policy engine",
    "no full symbolic runtime",
    "no commercial entitlement change",
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
    "scripts/verify_v6_20_transition_validity_preview.mjs",
    "transition validity preview verified\n"
  );

  expectFileExists(schemaPath, "v6.20 schema");
  expectFileExists(fixturePath, "v6.20 fixture bundle");
  expectFileExists(scopeCardPath, "v6.20 scope card");
  expectFileExists(boundaryDocPath, "v6.20 boundary doc");
  expectFileExists(finalAcceptanceDocPath, "v6.20 final acceptance doc");

  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  expectExactArray(schema.$defs.transitionStatus.enum, EXPECTED_TRANSITION_STATUS, "transition_status enum");
  expectExactArray(schema.$defs.findingType.enum, EXPECTED_FINDING_TYPES, "finding_type enum");
  expectExactArray(
    schema.$defs.verificationSurface.enum,
    EXPECTED_VERIFICATION_SURFACES,
    "verification_surface enum"
  );

  const scopeCard = fs.readFileSync(scopeCardPath, "utf8");
  expectScopeCard(scopeCard);

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
    "transition",
    "explain",
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/transition_validity/execution-bound-transition-validity.cases.valid.json",
  ];

  const firstResult = recordExit(await runGuard({ argv: baseArgs }));
  expect(firstResult.exitCode === 0, "valid fixture should exit 0");
  const firstPayload = parseJsonOutput(firstResult, "valid fixture");

  const secondResult = recordExit(await runGuard({ argv: baseArgs }));
  expect(secondResult.exitCode === 0, "repeat valid fixture should exit 0");
  const secondPayload = parseJsonOutput(secondResult, "repeat valid fixture");

  expect(
    firstPayload.schema_version === "guard.execution_bound_transition_validity_preview.v1",
    "schema_version mismatch"
  );
  expect(firstPayload.preview === true, "preview mismatch");
  expect(firstPayload.explanation_only === true, "explanation_only mismatch");
  expect(firstPayload.enforcement_action === "none", "enforcement_action mismatch");
  expect(firstPayload.blocking_effect === false, "blocking_effect mismatch");
  expect(firstPayload.execution_authority_granted === false, "execution_authority_granted mismatch");
  expect(firstPayload.input_ref, "input_ref must exist");
  expect(firstPayload.input_summary, "input_summary must exist");
  expect(firstPayload.declared_transition, "declared_transition must exist");
  expect(Array.isArray(firstPayload.prerequisite_refs), "prerequisite_refs must exist");
  expect(Array.isArray(firstPayload.transition_findings), "transition_findings must exist");
  expect(firstPayload.preservation_summary, "preservation_summary must exist");
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

  const statuses = new Set(firstPayload.transition_findings.map((entry) => entry.transition_status));
  for (const status of EXPECTED_TRANSITION_STATUS) {
    expect(statuses.has(status), `transition status ${status} must be represented`);
  }

  const payloadFindingTypes = [...new Set(firstPayload.transition_findings.map((entry) => entry.finding_type))].sort();
  expect(
    payloadFindingTypes.every((value) => EXPECTED_FINDING_TYPES.includes(value)),
    "payload finding_type values must remain bounded"
  );
  const payloadVerificationSurfaces = [...new Set(firstPayload.transition_findings.map((entry) => entry.verification_surface))].sort();
  expect(
    payloadVerificationSurfaces.every((value) => EXPECTED_VERIFICATION_SURFACES.includes(value)),
    "payload verification_surface values must remain bounded"
  );

  expect(firstPayload.input_summary.transition_status_counts.preserved === 1, "preserved count mismatch");
  expect(firstPayload.input_summary.transition_status_counts.changed === 1, "changed count mismatch");
  expect(
    firstPayload.input_summary.transition_status_counts.partially_preserved === 1,
    "partially_preserved count mismatch"
  );
  expect(
    firstPayload.input_summary.transition_status_counts.not_applicable === 1,
    "not_applicable count mismatch"
  );
  expect(firstPayload.input_summary.transition_status_counts.unknown === 1, "unknown count mismatch");

  const boundary = firstPayload.non_enforcement_boundary;
  expect(boundary.explanation_only === true, "non_enforcement_boundary.explanation_only mismatch");
  expect(boundary.enforcement_action === "none", "non_enforcement_boundary.enforcement_action mismatch");
  expect(boundary.blocking_effect === false, "non_enforcement_boundary.blocking_effect mismatch");
  expect(
    boundary.execution_authority_granted === false,
    "non_enforcement_boundary.execution_authority_granted mismatch"
  );
  expect(
    boundary.does_not_grant_execution_permission === true,
    "does_not_grant_execution_permission mismatch"
  );
  expect(boundary.does_not_create_commit_gate === true, "does_not_create_commit_gate mismatch");
  expect(boundary.does_not_create_permit_gate === true, "does_not_create_permit_gate mismatch");
  expect(boundary.does_not_create_deployment_gate === true, "does_not_create_deployment_gate mismatch");
  expect(
    boundary.does_not_create_runtime_enforcement === true,
    "does_not_create_runtime_enforcement mismatch"
  );
  expect(
    boundary.does_not_prove_state_equivalence === true,
    "does_not_prove_state_equivalence mismatch"
  );

  expectNoForbiddenDecisionSemantics(firstPayload, "v6.20 preview payload");

  const missingPreview = recordExit(
    await runGuard({
      argv: ["transition", "explain", "--json", "--fixture-file", "fixtures/transition_validity/execution-bound-transition-validity.cases.valid.json"],
    })
  );
  expect(missingPreview.exitCode === 2, "missing --preview should exit 2");

  const missingJson = recordExit(
    await runGuard({
      argv: ["transition", "explain", "--preview", "--fixture-file", "fixtures/transition_validity/execution-bound-transition-validity.cases.valid.json"],
    })
  );
  expect(missingJson.exitCode === 2, "missing --json should exit 2");

  const missingFixture = recordExit(await runGuard({ argv: ["transition", "explain", "--preview", "--json"] }));
  expect(missingFixture.exitCode === 2, "missing --fixture-file should exit 2");

  const unsupportedSubcommand = recordExit(await runGuard({ argv: ["transition", "permit"] }));
  expect(unsupportedSubcommand.exitCode === 2, "unsupported transition subcommand should exit 2");

  const { tempRoot, malformedPath, invalidJsonPath, missingFixturePath } = createTempFixtures();
  try {
    const missingFixtureResult = recordExit(
      await runGuard({
        argv: ["transition", "explain", "--preview", "--json", "--fixture-file", missingFixturePath],
      })
    );
    expect(missingFixtureResult.exitCode === 30, "missing fixture should exit 30");

    const invalidJsonResult = recordExit(
      await runGuard({
        argv: ["transition", "explain", "--preview", "--json", "--fixture-file", invalidJsonPath],
      })
    );
    expect(invalidJsonResult.exitCode === 30, "invalid JSON fixture should exit 30");

    const malformedResult = recordExit(
      await runGuard({
        argv: ["transition", "explain", "--preview", "--json", "--fixture-file", malformedPath],
      })
    );
    expect(malformedResult.exitCode === 30, "malformed fixture should exit 30");
    expect(
      parseJsonOutput(malformedResult, "malformed fixture").error.kind === "transition_validity_preview_contract_invalid",
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

  process.stdout.write("PASS verify_v6_20_transition_validity_final_acceptance\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
