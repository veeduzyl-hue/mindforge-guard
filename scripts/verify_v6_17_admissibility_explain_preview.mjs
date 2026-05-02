import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const ALLOWED_PREREQUISITE_STATES = new Set([
  "explanation_ready",
  "explanation_incomplete",
  "explanation_blocked",
  "explanation_unknown",
]);
const FORBIDDEN_KEYS = new Set([
  "admit",
  "deny",
  "defer",
  "approved",
  "rejected",
  "commit_gate",
  "permit_gate",
  "deployment_gate",
  "runtime_enforcement",
  "requires_human_confirmation",
]);
const FORBIDDEN_VALUES = new Set([
  "admit",
  "deny",
  "defer",
  "approved",
  "rejected",
  "allowed",
  "blocked_by_gate",
  "requires_human_confirmation",
]);

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
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
    await import(`${pathToFileURL(absolutePath).href}?preview=${Date.now()}-${Math.random()}`);
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

function parseJsonOutput(result, label) {
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    fail(`${label} must output valid JSON (${error.message})`);
  }
}

function expectExactKeys(actual, expectedKeys, label) {
  const actualKeys = Object.keys(actual).sort();
  const expectedSorted = [...expectedKeys].sort();
  expect(
    JSON.stringify(actualKeys) === JSON.stringify(expectedSorted),
    `${label} keys mismatch: expected ${expectedSorted.join(", ")} got ${actualKeys.join(", ")}`
  );
}

function expectAllowedState(value, label) {
  expect(ALLOWED_PREREQUISITE_STATES.has(value), `${label} must be an allowed prerequisite state`);
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

function expectNoForbiddenFields(value, label) {
  walk(value, (entry) => {
    if (typeof entry === "string" && FORBIDDEN_VALUES.has(entry)) {
      throw new Error(`${label} contains forbidden string value ${entry}`);
    }
    if (typeof entry === "string" && FORBIDDEN_KEYS.has(entry)) {
      throw new Error(`${label} contains forbidden field ${entry}`);
    }
  });
}

function expectPayload(payload, expectedReadinessState, label) {
  expectExactKeys(
    payload,
    [
      "boundary",
      "command",
      "mode",
      "schema_version",
      "input_ref",
      "authority_context",
      "grounding_context",
      "admissibility_input_package",
      "admissibility_prerequisite_matrix",
      "admissibility_explanation",
      "admissibility_result",
      "receipt_linkage",
      "non_enforcement_boundary",
      "deterministic_hash",
    ],
    `${label} top-level`
  );
  expect(payload.command === "guard admissibility explain", `${label} command mismatch`);
  expect(payload.mode === "preview", `${label} mode mismatch`);
  expect(payload.schema_version === "guard.admissibility_explain_preview.v6_17", `${label} schema version mismatch`);
  expect(payload.input_ref.kind === "fixture_file", `${label} input_ref.kind mismatch`);
  expect(payload.boundary.preview_only === true, `${label} boundary.preview_only mismatch`);
  expect(payload.boundary.no_admissibility_decision === true, `${label} boundary.no_admissibility_decision mismatch`);
  expect(payload.boundary.no_commit_gate === true, `${label} boundary.no_commit_gate mismatch`);
  expect(payload.boundary.no_permit_gate === true, `${label} boundary.no_permit_gate mismatch`);
  expect(payload.boundary.no_deployment_gate === true, `${label} boundary.no_deployment_gate mismatch`);
  expect(payload.boundary.no_runtime_enforcement === true, `${label} boundary.no_runtime_enforcement mismatch`);

  expectAllowedState(payload.authority_context.current_state_context_state, `${label} authority current state`);
  expectAllowedState(payload.authority_context.bind_time_validity_state, `${label} authority bind-time state`);
  expectAllowedState(payload.grounding_context.evidence_lineage_state, `${label} grounding evidence lineage`);
  expectAllowedState(payload.admissibility_input_package.input_completeness, `${label} input completeness`);
  expectAllowedState(payload.admissibility_input_package.input_consistency, `${label} input consistency`);
  expectAllowedState(payload.admissibility_explanation.readiness_state, `${label} explanation readiness`);
  expect(
    payload.admissibility_explanation.readiness_state === expectedReadinessState,
    `${label} explanation readiness mismatch`
  );
  for (const [key, entry] of Object.entries(payload.admissibility_prerequisite_matrix)) {
    expectAllowedState(entry.state, `${label} matrix ${key}`);
    expect(entry.explanation_only === true, `${label} matrix ${key} explanation_only mismatch`);
    expect(entry.decision_effect === false, `${label} matrix ${key} decision_effect mismatch`);
  }

  expectExactKeys(
    payload.admissibility_result,
    ["schema_version", "status", "evaluated", "result", "decision", "reason"],
    `${label} admissibility_result`
  );
  expect(payload.admissibility_result.schema_version === "guard.admissibility_result.reserved.v2", `${label} result schema mismatch`);
  expect(payload.admissibility_result.status === "reserved", `${label} result status mismatch`);
  expect(payload.admissibility_result.evaluated === false, `${label} result evaluated mismatch`);
  expect(payload.admissibility_result.result === "not_evaluated", `${label} result mismatch`);
  expect(payload.admissibility_result.decision === null, `${label} result decision mismatch`);
  expect(
    payload.admissibility_result.reason === "reserved_for_future_admissibility_decision_boundary",
    `${label} result reason mismatch`
  );

  expect(payload.non_enforcement_boundary.admissibility_decision_evaluated === false, `${label} non-enforcement evaluated mismatch`);
  expect(payload.non_enforcement_boundary.permission_granted === false, `${label} non-enforcement permission mismatch`);
  expect(payload.non_enforcement_boundary.commit_gate_triggered === false, `${label} commit gate trigger mismatch`);
  expect(payload.non_enforcement_boundary.permit_gate_triggered === false, `${label} permit gate trigger mismatch`);
  expect(payload.non_enforcement_boundary.deployment_gate_triggered === false, `${label} deployment gate trigger mismatch`);
  expect(payload.non_enforcement_boundary.runtime_enforcement_triggered === false, `${label} runtime enforcement mismatch`);
  expect(payload.non_enforcement_boundary.enforcement_effect === "none", `${label} enforcement effect mismatch`);
  expect(
    typeof payload.admissibility_input_package.input_package_hash === "string" &&
      payload.admissibility_input_package.input_package_hash.startsWith("sha256:"),
    `${label} input_package_hash mismatch`
  );
  expect(
    typeof payload.deterministic_hash === "string" && payload.deterministic_hash.startsWith("sha256:"),
    `${label} deterministic_hash mismatch`
  );
  expectNoForbiddenFields(payload, `${label} payload`);
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function createTempFixtures() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-admissibility-preview-"));
  const readyFixture = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "fixtures", "admissibility", "admissibility-boundary.constructible-grounded.valid.json"),
      "utf8"
    )
  );

  const blockedPath = path.join(tempRoot, "blocked.json");
  const unknownPath = path.join(tempRoot, "unknown.json");
  const malformedPath = path.join(tempRoot, "malformed.json");
  const invalidJsonPath = path.join(tempRoot, "invalid.json");

  const blockedFixture = structuredClone(readyFixture);
  blockedFixture.authority_context.bind_time_validity_state = "explanation_blocked";
  blockedFixture.admissibility_input_package.input_consistency = "explanation_blocked";
  blockedFixture.admissibility_prerequisite_matrix.bind_time_validity_v1.state = "explanation_blocked";
  blockedFixture.admissibility_prerequisite_matrix.bind_time_validity_v1.reason =
    "Fixture declares the bind-time explanation path blocked without creating any gate or deny behavior.";
  blockedFixture.admissibility_prerequisite_matrix.input_package_v1.state = "explanation_blocked";
  blockedFixture.admissibility_prerequisite_matrix.input_package_v1.reason =
    "The combined explanation package is blocked from becoming complete, but remains non-decisional.";
  blockedFixture.admissibility_explanation.readiness_state = "explanation_blocked";
  blockedFixture.admissibility_explanation.summary =
    "The admissibility explanation path is blocked by incomplete fixture-backed basis information, without implying any decision or enforcement effect.";
  blockedFixture.admissibility_explanation.basis[1] =
    "Bind-time validity is explicitly blocked at the explanation layer only.";
  writeJson(blockedPath, blockedFixture);

  const unknownFixture = structuredClone(readyFixture);
  unknownFixture.authority_context.current_state_context_state = "explanation_unknown";
  unknownFixture.authority_context.bind_time_validity_state = "explanation_unknown";
  unknownFixture.grounding_context.evidence_lineage_state = "explanation_unknown";
  unknownFixture.admissibility_input_package.input_completeness = "explanation_unknown";
  unknownFixture.admissibility_input_package.input_consistency = "explanation_unknown";
  for (const entry of Object.values(unknownFixture.admissibility_prerequisite_matrix)) {
    entry.state = "explanation_unknown";
    entry.reason = "Fixture declares this explanation prerequisite unknown without emitting a decision surface.";
  }
  unknownFixture.admissibility_explanation.readiness_state = "explanation_unknown";
  unknownFixture.admissibility_explanation.summary =
    "The admissibility explanation package remains unknown because fixture-backed prerequisite certainty is intentionally unresolved.";
  writeJson(unknownPath, unknownFixture);

  const malformedFixture = structuredClone(readyFixture);
  delete malformedFixture.admissibility_explanation;
  writeJson(malformedPath, malformedFixture);
  fs.writeFileSync(invalidJsonPath, "{ invalid json\n", "utf8");

  return { tempRoot, blockedPath, unknownPath, malformedPath, invalidJsonPath };
}

const { runGuard } = await import("../packages/guard/src/runGuard.mjs");

async function runAuthorityCheck(args) {
  return runGuard({
    argv: ["authority", "check", ...args],
  });
}

async function runAuthorityExplain(args) {
  return runGuard({
    argv: ["authority", "explain", ...args],
  });
}

async function runGroundingExplain(args) {
  return runGuard({
    argv: ["grounding", "explain", ...args],
  });
}

async function runAdmissibilityExplain(args) {
  return runGuard({
    argv: ["admissibility", "explain", ...args],
  });
}

async function main() {
  await expectPassScript(
    "scripts/verify_v6_17_admissibility_boundary_fixtures.mjs",
    "PASS verify_v6_17_admissibility_boundary_fixtures\n"
  );

  const authorityCheck = await runAuthorityCheck([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.inside-scope.valid.json",
  ]);
  expect(authorityCheck.exitCode === 0, "v6.14 authority check should still pass");
  expect(parseJsonOutput(authorityCheck, "authority check").command === "guard authority check", "v6.14 command mismatch");

  const authorityExplain = await runAuthorityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.inside-scope.valid.json",
  ]);
  expect(authorityExplain.exitCode === 0, "v6.15 authority explain should still pass");
  expect(parseJsonOutput(authorityExplain, "authority explain").command === "guard authority explain", "v6.15 command mismatch");

  const groundingExplain = await runGroundingExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/grounding/grounding-boundary.grounded.valid.json",
  ]);
  expect(groundingExplain.exitCode === 0, "v6.16 grounding explain should still pass");
  expect(parseJsonOutput(groundingExplain, "grounding explain").command === "guard grounding explain", "v6.16 command mismatch");

  const readyFirst = await runAdmissibilityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/admissibility/admissibility-boundary.constructible-grounded.valid.json",
  ]);
  expect(readyFirst.exitCode === 0, "ready fixture should exit 0");
  expect(readyFirst.exitCode !== 21, "ready fixture must not use exit 21");
  expect(readyFirst.exitCode !== 25, "ready fixture must not use exit 25");
  const readyFirstPayload = parseJsonOutput(readyFirst, "ready fixture");
  expectPayload(readyFirstPayload, "explanation_ready", "ready fixture");

  const readySecond = await runAdmissibilityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/admissibility/admissibility-boundary.constructible-grounded.valid.json",
  ]);
  expect(readySecond.exitCode === 0, "repeat ready fixture should exit 0");
  const readySecondPayload = parseJsonOutput(readySecond, "repeat ready fixture");
  expect(
    readyFirstPayload.deterministic_hash === readySecondPayload.deterministic_hash,
    "deterministic_hash must be stable across repeated runs"
  );
  expect(
    JSON.stringify(readyFirstPayload) === JSON.stringify(readySecondPayload),
    "ready payload must be stable across repeated runs"
  );

  const partialResult = await runAdmissibilityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/admissibility/admissibility-boundary.partial-basis.valid.json",
  ]);
  expect(partialResult.exitCode === 0, "partial fixture should exit 0");
  expect(partialResult.exitCode !== 21, "partial fixture must not use exit 21");
  expect(partialResult.exitCode !== 25, "partial fixture must not use exit 25");
  expectPayload(parseJsonOutput(partialResult, "partial fixture"), "explanation_incomplete", "partial fixture");

  const missingPreview = await runAdmissibilityExplain([
    "--json",
    "--fixture-file",
    "fixtures/admissibility/admissibility-boundary.constructible-grounded.valid.json",
  ]);
  expect(missingPreview.exitCode === 2, "missing preview should exit 2");

  const missingJson = await runAdmissibilityExplain([
    "--preview",
    "--fixture-file",
    "fixtures/admissibility/admissibility-boundary.constructible-grounded.valid.json",
  ]);
  expect(missingJson.exitCode === 2, "missing json should exit 2");

  const missingFixture = await runAdmissibilityExplain([
    "--preview",
    "--json",
  ]);
  expect(missingFixture.exitCode === 2, "missing fixture should exit 2");

  const unknownOption = await runAdmissibilityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/admissibility/admissibility-boundary.constructible-grounded.valid.json",
    "--unknown-option",
  ]);
  expect(unknownOption.exitCode === 2, "unknown option should exit 2");

  const { tempRoot, blockedPath, unknownPath, malformedPath, invalidJsonPath } = createTempFixtures();
  try {
    const blockedResult = await runAdmissibilityExplain([
      "--preview",
      "--json",
      "--fixture-file",
      blockedPath,
    ]);
    expect(blockedResult.exitCode === 0, "blocked fixture should exit 0");
    expect(blockedResult.exitCode !== 21, "blocked fixture must not use exit 21");
    expect(blockedResult.exitCode !== 25, "blocked fixture must not use exit 25");
    expectPayload(parseJsonOutput(blockedResult, "blocked fixture"), "explanation_blocked", "blocked fixture");

    const unknownResult = await runAdmissibilityExplain([
      "--preview",
      "--json",
      "--fixture-file",
      unknownPath,
    ]);
    expect(unknownResult.exitCode === 0, "unknown fixture should exit 0");
    expect(unknownResult.exitCode !== 21, "unknown fixture must not use exit 21");
    expect(unknownResult.exitCode !== 25, "unknown fixture must not use exit 25");
    expectPayload(parseJsonOutput(unknownResult, "unknown fixture"), "explanation_unknown", "unknown fixture");

    const malformedResult = await runAdmissibilityExplain([
      "--preview",
      "--json",
      "--fixture-file",
      malformedPath,
    ]);
    expect(malformedResult.exitCode === 30, "malformed fixture should exit 30");

    const invalidJsonResult = await runAdmissibilityExplain([
      "--preview",
      "--json",
      "--fixture-file",
      invalidJsonPath,
    ]);
    expect(invalidJsonResult.exitCode === 30, "invalid JSON fixture should exit 30");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  expect(changedFilesFor(["packages/guard/src/cli/authority.mjs"]).length === 0, "authority.mjs must remain unchanged");
  expect(changedFilesFor(["packages/guard/src/cli/grounding.mjs"]).length === 0, "grounding.mjs must remain unchanged");
  expect(changedFilesFor(["schemas/authority"]).length === 0, "authority schemas must remain unchanged");
  expect(changedFilesFor(["schemas/grounding"]).length === 0, "grounding schemas must remain unchanged");
  expect(changedFilesFor(["fixtures/authority"]).length === 0, "authority fixtures must remain unchanged");
  expect(changedFilesFor(["fixtures/grounding"]).length === 0, "grounding fixtures must remain unchanged");
  expect(
    changedFilesFor([
      "scripts/verify_v6_14_authority_boundary_fixtures.mjs",
      "scripts/verify_v6_14_authority_check_preview.mjs",
      "scripts/verify_v6_14_authority_preview_acceptance.mjs",
      "scripts/verify_v6_15_authority_explain_preview.mjs",
      "scripts/verify_v6_15_authority_explain_acceptance.mjs",
      "scripts/verify_v6_15_authority_explain_final_acceptance.mjs",
      "scripts/verify_v6_16_grounding_boundary_fixtures.mjs",
      "scripts/verify_v6_16_grounding_explain_preview.mjs",
      "scripts/verify_v6_16_grounding_explain_acceptance.mjs",
      "scripts/verify_v6_16_grounding_explain_final_acceptance.mjs",
    ]).length === 0,
    "v6.14-v6.16 verifier scripts must remain unchanged"
  );
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
    ]).length === 0,
    "protected commercial and production paths must remain unchanged"
  );

  process.stdout.write("admissibility explain preview verified\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
