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
    await import(`${pathToFileURL(absolutePath).href}?acceptance=${Date.now()}-${Math.random()}`);
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

async function main() {
  await expectPassScript(
    "scripts/verify_v6_18_authority_drift_boundary_fixtures.mjs",
    "PASS verify_v6_18_authority_drift_boundary_fixtures\n"
  );
  await expectPassScript(
    "scripts/verify_v6_18_authority_drift_preview.mjs",
    "authority drift preview verified\n"
  );

  const authorityCheck = await runGuard({
    argv: [
      "authority",
      "check",
      "--preview",
      "--json",
      "--fixture-file",
      "fixtures/authority/authority-boundary.inside-scope.valid.json",
    ],
  });
  expect(authorityCheck.exitCode === 0, "v6.14 authority check should still exit 0");
  expect(JSON.parse(authorityCheck.stdout).command === "guard authority check", "v6.14 authority check command mismatch");

  const authorityExplain = await runGuard({
    argv: [
      "authority",
      "explain",
      "--preview",
      "--json",
      "--fixture-file",
      "fixtures/authority/authority-boundary.inside-scope.valid.json",
    ],
  });
  expect(authorityExplain.exitCode === 0, "v6.15 authority explain should still exit 0");
  expect(JSON.parse(authorityExplain.stdout).command === "guard authority explain", "v6.15 authority explain command mismatch");

  const groundingExplain = await runGuard({
    argv: [
      "grounding",
      "explain",
      "--preview",
      "--json",
      "--fixture-file",
      "fixtures/grounding/grounding-boundary.grounded.valid.json",
    ],
  });
  expect(groundingExplain.exitCode === 0, "v6.16 grounding explain should still exit 0");
  expect(JSON.parse(groundingExplain.stdout).command === "guard grounding explain", "v6.16 grounding explain command mismatch");

  const admissibilityExplain = await runGuard({
    argv: [
      "admissibility",
      "explain",
      "--preview",
      "--json",
      "--fixture-file",
      "fixtures/admissibility/admissibility-boundary.constructible-grounded.valid.json",
    ],
  });
  expect(admissibilityExplain.exitCode === 0, "v6.17 admissibility explain should still exit 0");
  expect(
    JSON.parse(admissibilityExplain.stdout).command === "guard admissibility explain",
    "v6.17 admissibility explain command mismatch"
  );

  const stableResult = await runGuard({
    argv: [
      "authority",
      "drift",
      "--preview",
      "--json",
      "--fixture-file",
      "fixtures/authority_drift/authority-drift.stable-execution.valid.json",
    ],
  });
  expect(stableResult.exitCode === 0, "stable authority drift fixture should exit 0");
  expect(stableResult.exitCode !== 21, "stable authority drift fixture must not use exit 21");
  expect(stableResult.exitCode !== 25, "stable authority drift fixture must not use exit 25");

  process.stdout.write("PASS verify_v6_18_authority_drift_acceptance\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
