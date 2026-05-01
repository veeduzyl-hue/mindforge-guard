import { execFileSync } from "node:child_process";
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

async function runGroundingExplain(args) {
  return runGuard({
    argv: ["grounding", "explain", ...args],
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
  await expectPassScript(
    "scripts/verify_v6_15_authority_explain_final_acceptance.mjs",
    "PASS verify_v6_15_authority_explain_final_acceptance\n"
  );
  await expectPassScript(
    "scripts/verify_v6_16_grounding_boundary_fixtures.mjs",
    "PASS verify_v6_16_grounding_boundary_fixtures\n"
  );
  await expectPassScript(
    "scripts/verify_v6_16_grounding_explain_preview.mjs",
    "grounding explain preview verified\n"
  );
  await expectPassScript(
    "scripts/verify_v6_16_grounding_explain_acceptance.mjs",
    "PASS verify_v6_16_grounding_explain_acceptance\n"
  );

  expect(
    changedFilesFor(["packages/guard/src/cli/authority.mjs"]).length === 0,
    "authority.mjs must remain unchanged"
  );
  expect(
    changedFilesFor(["schemas/authority/authority-boundary.schema.json"]).length === 0,
    "authority schema must remain unchanged"
  );
  expect(
    changedFilesFor(["fixtures/authority"]).length === 0,
    "authority fixtures must remain unchanged"
  );
  expect(
    changedFilesFor(["scripts/verify_v6_14_authority_boundary_fixtures.mjs"]).length === 0 &&
      changedFilesFor(["scripts/verify_v6_14_authority_check_preview.mjs"]).length === 0 &&
      changedFilesFor(["scripts/verify_v6_14_authority_preview_acceptance.mjs"]).length === 0,
    "v6.14 verifier scripts must remain unchanged"
  );
  expect(
    changedFilesFor(["scripts/verify_v6_15_authority_explain_preview.mjs"]).length === 0 &&
      changedFilesFor(["scripts/verify_v6_15_authority_explain_acceptance.mjs"]).length === 0 &&
      changedFilesFor(["scripts/verify_v6_15_authority_explain_final_acceptance.mjs"]).length === 0,
    "v6.15 verifier scripts must remain unchanged"
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
    "release, commercial, and production protected paths must remain unchanged"
  );

  const groundedResult = await runGroundingExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/grounding/grounding-boundary.grounded.valid.json",
  ]);
  expect(groundedResult.exitCode === 0, "grounded explain should exit 0");
  expect(groundedResult.exitCode !== 21, "v6.16 preview must not use exit 21");
  expect(groundedResult.exitCode !== 25, "v6.16 preview must not use exit 25");

  const groundedPayload = JSON.parse(groundedResult.stdout);
  expect(groundedPayload.boundary.preview_only === true, "v6.16 must remain preview-only");
  expect(groundedPayload.boundary.fixture_backed === true, "v6.16 must remain fixture-backed");
  expect(groundedPayload.boundary.non_enforcing === true, "v6.16 must remain non-enforcing");
  expect(
    groundedPayload.evidence_adequacy.supporting_only === true &&
      groundedPayload.evidence_adequacy.authoritative === false,
    "v6.16 evidence_adequacy must remain supporting-only and non-authoritative"
  );
  expect(
    groundedPayload.non_enforcement_boundary.preview_only === true &&
      groundedPayload.non_enforcement_boundary.enforced === false &&
      groundedPayload.non_enforcement_boundary.blocks_execution === false &&
      groundedPayload.non_enforcement_boundary.changes_exit_semantics === false,
    "v6.16 non_enforcement_boundary must preserve global exit semantics"
  );

  process.stdout.write("PASS verify_v6_16_grounding_explain_final_acceptance\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
