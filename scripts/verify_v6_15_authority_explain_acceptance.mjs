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

async function main() {
  // Phase 2 hardening must continue to prove the full frozen v6.14 baseline
  // before asserting any v6.15 authority explain preview behavior.
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

  process.stdout.write("PASS verify_v6_15_authority_explain_acceptance\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
