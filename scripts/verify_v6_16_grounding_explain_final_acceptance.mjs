import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
