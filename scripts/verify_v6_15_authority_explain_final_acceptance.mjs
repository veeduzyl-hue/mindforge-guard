import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

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

function parseJsonOutput(result, label) {
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    fail(`${label} must output valid JSON (${error.message})`);
  }
}

function buildExpectedCheckPayload(fixture) {
  return {
    kind: "authority_check_preview",
    preview: true,
    schema_version: fixture.schema_version,
    command: "guard authority check",
    decision: fixture.decision,
    receipt: fixture.authority_receipt,
    recommendation_only: fixture.recommendation_only,
    non_executing: fixture.non_executing,
    default_off: fixture.default_off,
    machine_verifiable: fixture.machine_verifiable,
    no_execution_authority: fixture.no_execution_authority,
    no_commit_gate_semantics: fixture.no_commit_gate_semantics,
    no_license_gating_semantic_change: fixture.no_license_gating_semantic_change,
    no_current_cli_contract_change: fixture.no_current_cli_contract_change,
    no_current_exit_code_semantic_change: fixture.no_current_exit_code_semantic_change,
    enforcement_action: "none",
    blocking_effect: false,
    execution_authority_granted: false,
  };
}

function expectExactKeys(actual, expectedKeys, label) {
  const actualKeys = Object.keys(actual).sort();
  const expectedSorted = [...expectedKeys].sort();
  expect(
    JSON.stringify(actualKeys) === JSON.stringify(expectedSorted),
    `${label} keys mismatch: expected ${expectedSorted.join(", ")} got ${actualKeys.join(", ")}`
  );
}

function expectCoverageMatrix(payload, label) {
  const matrix = payload.coverage_matrix;
  expect(matrix?.current_state_context_v1?.status === "implemented", `${label} current_state_context_v1.status mismatch`);
  expect(
    matrix?.current_state_context_v1?.implemented_as === "constructible_current_state",
    `${label} current_state_context_v1.implemented_as mismatch`
  );
  expect(matrix?.bind_time_validity_v1?.status === "implemented", `${label} bind_time_validity_v1.status mismatch`);
  expect(
    matrix?.bind_time_validity_v1?.implemented_as === "state_validity_at_bind_time",
    `${label} bind_time_validity_v1.implemented_as mismatch`
  );
  expect(matrix?.bind_time_validity_v1?.enforced === false, `${label} bind_time_validity_v1.enforced mismatch`);
  expect(matrix?.commitment_candidate_v1?.status === "reserved", `${label} commitment_candidate_v1.status mismatch`);
  expect(matrix?.commitment_candidate_v1?.evaluated === false, `${label} commitment_candidate_v1.evaluated mismatch`);
  expect(
    matrix?.commitment_candidate_v1?.result === "not_evaluated",
    `${label} commitment_candidate_v1.result mismatch`
  );
  expect(matrix?.admissibility_result_v1?.status === "reserved", `${label} admissibility_result_v1.status mismatch`);
  expect(matrix?.admissibility_result_v1?.evaluated === false, `${label} admissibility_result_v1.evaluated mismatch`);
  expect(
    matrix?.admissibility_result_v1?.result === "not_evaluated",
    `${label} admissibility_result_v1.result mismatch`
  );
  expect(matrix?.commitment_receipt_v1?.status === "deferred", `${label} commitment_receipt_v1.status mismatch`);
  expect(matrix?.commitment_receipt_v1?.implemented === false, `${label} commitment_receipt_v1.implemented mismatch`);
}

function expectExplainPayload(payload, expectedDecision, expectedVerdict, label) {
  expect(payload.kind === "authority_explain_preview", `${label} kind mismatch`);
  expect(payload.schema_version === "guard.authority_explain_preview.v6_15", `${label} schema_version mismatch`);
  expect(payload.command === "guard authority explain", `${label} command mismatch`);
  expect(payload.preview === true, `${label} preview mismatch`);
  expect(payload.authority_check_ref?.decision === expectedDecision, `${label} decision mismatch`);
  expect(payload.constructible_current_state?.constructed_from === "fixture", `${label} constructed_from mismatch`);
  expect(payload.authority_explanation?.fixture_backed === true, `${label} fixture_backed mismatch`);
  expect(payload.authority_explanation?.derived_only === true, `${label} derived_only mismatch`);
  expect(payload.authority_explanation?.explanation_only === true, `${label} explanation_only mismatch`);
  expect(payload.non_enforcement_boundary?.enforced === false, `${label} enforced mismatch`);
  expect(payload.non_enforcement_boundary?.recommendation_only === true, `${label} recommendation_only mismatch`);
  expect(payload.non_enforcement_boundary?.non_executing === true, `${label} non_executing mismatch`);
  expect(payload.non_enforcement_boundary?.default_off === true, `${label} default_off mismatch`);
  expect(payload.non_enforcement_boundary?.blocking_effect === false, `${label} blocking_effect mismatch`);
  expect(
    payload.non_enforcement_boundary?.execution_authority_granted === false,
    `${label} execution_authority_granted mismatch`
  );
  expect(
    payload.non_enforcement_boundary?.does_not_create_commit_gate === true,
    `${label} does_not_create_commit_gate mismatch`
  );
  expect(
    payload.non_enforcement_boundary?.does_not_decide_admissibility === true,
    `${label} does_not_decide_admissibility mismatch`
  );
  expect(
    payload.non_enforcement_boundary?.does_not_create_commitment_receipt === true,
    `${label} does_not_create_commitment_receipt mismatch`
  );

  expectCoverageMatrix(payload, label);

  const bindTime = payload.state_validity_at_bind_time;
  expect(bindTime?.schema_version === "guard.bind_time_validity.v1", `${label} bind-time schema mismatch`);
  expect(bindTime?.evaluated === true, `${label} bind-time evaluated mismatch`);
  expect(bindTime?.enforced === false, `${label} bind-time enforced mismatch`);
  expect(typeof bindTime?.evaluated_at === "string" && bindTime.evaluated_at.length > 0, `${label} evaluated_at missing`);
  expect("expires_at" in bindTime, `${label} expires_at missing`);
  expect(bindTime?.verdict === expectedVerdict, `${label} verdict mismatch`);
  expect(typeof bindTime?.state_hash === "string" && bindTime.state_hash.startsWith("sha256:"), `${label} state_hash mismatch`);
  expect(typeof bindTime?.policy_hash === "string" && bindTime.policy_hash.startsWith("sha256:"), `${label} policy_hash mismatch`);
  expect(
    bindTime?.evidence_hash === null ||
      (typeof bindTime?.evidence_hash === "string" && bindTime.evidence_hash.startsWith("sha256:")),
    `${label} evidence_hash mismatch`
  );
  expect(bindTime?.replay_guard_preview?.evaluated === true, `${label} replay_guard_preview.evaluated mismatch`);
  expect(bindTime?.replay_guard_preview?.enforced === false, `${label} replay_guard_preview.enforced mismatch`);
  expect(
    bindTime?.replay_guard_preview?.blocking_effect === false,
    `${label} replay_guard_preview.blocking_effect mismatch`
  );

  expect(payload.admissibility_result?.status === "reserved", `${label} admissibility_result.status mismatch`);
  expect(payload.admissibility_result?.evaluated === false, `${label} admissibility_result.evaluated mismatch`);
  expect(payload.admissibility_result?.result === "not_evaluated", `${label} admissibility_result.result mismatch`);
  expect(
    !["admit", "deny", "defer", "requires_human_confirmation"].includes(payload.admissibility_result?.result),
    `${label} admissibility_result must remain reserved`
  );
  expectExactKeys(
    payload.admissibility_result,
    ["schema_version", "status", "evaluated", "result", "reserved_result_values"],
    `${label} admissibility_result`
  );

  expect(payload.commitment_candidate?.status === "reserved", `${label} commitment_candidate.status mismatch`);
  expect(payload.commitment_candidate?.evaluated === false, `${label} commitment_candidate.evaluated mismatch`);
  expect(payload.commitment_candidate?.result === "not_evaluated", `${label} commitment_candidate.result mismatch`);
  expect(
    payload.commitment_candidate?.commit_decision === "not_evaluated",
    `${label} commitment_candidate.commit_decision mismatch`
  );
  expect(
    !["allowed", "blocked", "approved", "denied"].includes(payload.commitment_candidate?.commit_decision),
    `${label} commitment_candidate must not emit a real commit decision`
  );
  expectExactKeys(
    payload.commitment_candidate,
    ["schema_version", "status", "evaluated", "result", "commit_decision"],
    `${label} commitment_candidate`
  );

  expect(!("commitment_receipt" in payload), `${label} must not create a top-level commitment_receipt object`);
  expect(
    payload.receipt_linkage?.commitment_receipt?.implemented === false,
    `${label} commitment_receipt.implemented mismatch`
  );
  expect(
    payload.receipt_linkage?.commitment_receipt?.deferred_to === "commit_gate_phase",
    `${label} commitment_receipt.deferred_to mismatch`
  );
}

function expectDeterministicStability(firstPayload, secondPayload, label) {
  expect(
    firstPayload.state_validity_at_bind_time.state_hash === secondPayload.state_validity_at_bind_time.state_hash,
    `${label} state_hash mismatch`
  );
  expect(
    firstPayload.state_validity_at_bind_time.policy_hash === secondPayload.state_validity_at_bind_time.policy_hash,
    `${label} policy_hash mismatch`
  );
  expect(
    firstPayload.state_validity_at_bind_time.evidence_hash === secondPayload.state_validity_at_bind_time.evidence_hash,
    `${label} evidence_hash mismatch`
  );
  expect(
    firstPayload.receipt_linkage.deterministic_hash === secondPayload.receipt_linkage.deterministic_hash,
    `${label} deterministic_hash mismatch`
  );
  expect(
    firstPayload.receipt_linkage.authority_explain_receipt_id ===
      secondPayload.receipt_linkage.authority_explain_receipt_id,
    `${label} authority_explain_receipt_id mismatch`
  );
  expect(
    JSON.stringify(firstPayload.coverage_matrix) === JSON.stringify(secondPayload.coverage_matrix),
    `${label} coverage_matrix mismatch`
  );
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function createTempFixtures() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-authority-final-acceptance-"));
  const staleFixturePath = path.join(tempRoot, "stale.json");
  const mismatchFixturePath = path.join(tempRoot, "mismatch.json");
  const unknownFixturePath = path.join(tempRoot, "unknown.json");
  const malformedFixturePath = path.join(tempRoot, "malformed.json");

  const insideFixture = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "fixtures", "authority", "authority-boundary.inside-scope.valid.json"), "utf8")
  );

  const staleFixture = structuredClone(insideFixture);
  staleFixture.context_snapshot.branch = "stale/final-acceptance";
  writeJson(staleFixturePath, staleFixture);

  const mismatchFixture = structuredClone(insideFixture);
  mismatchFixture.intent.protected_surfaces_touched = true;
  mismatchFixture.context_snapshot.protected_surfaces_touched = true;
  mismatchFixture.authority_scope.requested_operation = "touch_protected_surface";
  writeJson(mismatchFixturePath, mismatchFixture);

  const unknownFixture = structuredClone(insideFixture);
  unknownFixture.decision = "insufficient_context";
  writeJson(unknownFixturePath, unknownFixture);

  const malformedFixture = structuredClone(insideFixture);
  delete malformedFixture.authority_receipt;
  writeJson(malformedFixturePath, malformedFixture);

  return {
    tempRoot,
    staleFixturePath,
    mismatchFixturePath,
    unknownFixturePath,
    malformedFixturePath,
    insideFixture,
  };
}

function changedFilesFor(paths) {
  const mergeBase = runGit(["merge-base", "main", "HEAD"]);
  const committed = runGit(["diff", "--name-only", `${mergeBase}...HEAD`, "--", ...paths]);
  const unstaged = runGit(["diff", "--name-only", "--", ...paths]);
  const staged = runGit(["diff", "--cached", "--name-only", "--", ...paths]);
  return [committed, unstaged, staged]
    .flatMap((chunk) => chunk.split(/\r?\n/))
    .map((value) => value.trim())
    .filter(Boolean);
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
    await import(`${pathToFileURL(absolutePath).href}?finalAcceptance=${Date.now()}-${Math.random()}`);
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

async function main() {
  await expectPassScript(
    "scripts/verify_v6_14_authority_boundary_fixtures.mjs",
    "PASS verify_v6_14_authority_boundary_fixtures\n"
  );
  await expectPassScript(
    "scripts/verify_v6_14_authority_check_preview.mjs",
    "authority check preview verified\n"
  );
  await expectPassScript(
    "scripts/verify_v6_14_authority_preview_acceptance.mjs",
    "PASS verify_v6_14_authority_preview_acceptance\n"
  );
  await expectPassScript(
    "scripts/verify_v6_15_authority_explain_preview.mjs",
    "authority explain preview verified\n"
  );
  await expectPassScript(
    "scripts/verify_v6_15_authority_explain_acceptance.mjs",
    "PASS verify_v6_15_authority_explain_acceptance\n"
  );

  const outsideCheck = await runAuthorityCheck([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.outside-scope.valid.json",
  ]);
  expect(outsideCheck.exitCode === 0, "v6.14 outside_scope check should still exit 0");
  const outsideCheckFixture = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "fixtures", "authority", "authority-boundary.outside-scope.valid.json"), "utf8")
  );
  expect(
    JSON.stringify(parseJsonOutput(outsideCheck, "outside check")) ===
      JSON.stringify(buildExpectedCheckPayload(outsideCheckFixture)),
    "guard authority check behavior changed"
  );

  const insideExplain = await runAuthorityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.inside-scope.valid.json",
  ]);
  expect(insideExplain.exitCode === 0, "inside explain should exit 0");
  const insidePayload = parseJsonOutput(insideExplain, "inside explain");
  expectExplainPayload(insidePayload, "inside_scope", "valid", "inside explain");

  const insideExplainRepeat = await runAuthorityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.inside-scope.valid.json",
  ]);
  expect(insideExplainRepeat.exitCode === 0, "repeat inside explain should exit 0");
  const insideRepeatPayload = parseJsonOutput(insideExplainRepeat, "repeat inside explain");
  expectDeterministicStability(insidePayload, insideRepeatPayload, "inside explain");

  const outsideExplain = await runAuthorityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.outside-scope.valid.json",
  ]);
  expect(outsideExplain.exitCode === 0, "outside explain should exit 0");
  expect(outsideExplain.exitCode !== 21, "outside explain must not use exit 21");
  expect(outsideExplain.exitCode !== 25, "outside explain must not use exit 25");
  const outsidePayload = parseJsonOutput(outsideExplain, "outside explain");
  expectExplainPayload(outsidePayload, "outside_scope", "valid", "outside explain");

  const unknownOption = await runAuthorityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority/authority-boundary.inside-scope.valid.json",
    "--unknown-option",
  ]);
  expect(unknownOption.exitCode === 2, "unknown option should exit 2");

  const { tempRoot, staleFixturePath, mismatchFixturePath, unknownFixturePath, malformedFixturePath } =
    createTempFixtures();

  try {
    const staleExplain = await runAuthorityExplain([
      "--preview",
      "--json",
      "--fixture-file",
      staleFixturePath,
    ]);
    expect(staleExplain.exitCode === 0, "stale explain should exit 0");
    expectExplainPayload(parseJsonOutput(staleExplain, "stale explain"), "inside_scope", "stale", "stale explain");

    const mismatchExplain = await runAuthorityExplain([
      "--preview",
      "--json",
      "--fixture-file",
      mismatchFixturePath,
    ]);
    expect(mismatchExplain.exitCode === 0, "mismatch explain should exit 0");
    expectExplainPayload(
      parseJsonOutput(mismatchExplain, "mismatch explain"),
      "inside_scope",
      "mismatch",
      "mismatch explain"
    );

    const unknownExplain = await runAuthorityExplain([
      "--preview",
      "--json",
      "--fixture-file",
      unknownFixturePath,
    ]);
    expect(unknownExplain.exitCode === 0, "unknown explain should exit 0");
    expectExplainPayload(
      parseJsonOutput(unknownExplain, "unknown explain"),
      "insufficient_context",
      "unknown",
      "unknown explain"
    );

    const malformedExplain = await runAuthorityExplain([
      "--preview",
      "--json",
      "--fixture-file",
      malformedFixturePath,
    ]);
    expect(malformedExplain.exitCode === 30, "malformed fixture should exit 30");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  expect(
    changedFilesFor([
      "README.md",
      "docs/product/current",
      "docs/demos/current",
      "docs/first-10-minutes.md",
      "docs/trust/safety-boundary.md",
      "apps/license-hub",
      "vercel.json",
    ]).length === 0,
    "commercial baseline protected paths must remain unchanged"
  );

  process.stdout.write("PASS verify_v6_15_authority_explain_final_acceptance\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
