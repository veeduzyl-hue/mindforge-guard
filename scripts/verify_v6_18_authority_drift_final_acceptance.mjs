import fs from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const EXPECTED_VERIFY_LINES = [
  "node scripts/verify_v6_18_authority_drift_boundary_fixtures.mjs",
  "node scripts/verify_v6_18_authority_drift_preview.mjs",
  "node scripts/verify_v6_18_authority_drift_acceptance.mjs",
  "node scripts/verify_v6_18_authority_drift_final_acceptance.mjs",
];

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
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

function expectNoTimeDependency(value, label) {
  walk(value, (entry) => {
    if (typeof entry === "string" && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(entry)) {
      throw new Error(`${label} unexpectedly contains a timestamp-like value`);
    }
  });
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

async function main() {
  await expectPassScript(
    "scripts/verify_v6_18_authority_drift_boundary_fixtures.mjs",
    "PASS verify_v6_18_authority_drift_boundary_fixtures\n"
  );
  await expectPassScript(
    "scripts/verify_v6_18_authority_drift_preview.mjs",
    "authority drift preview verified\n"
  );
  await expectPassScript(
    "scripts/verify_v6_18_authority_drift_acceptance.mjs",
    "PASS verify_v6_18_authority_drift_acceptance\n"
  );

  const stableArgs = [
    "authority",
    "drift",
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/authority_drift/authority-drift.stable-execution.valid.json",
  ];
  const stableFirst = await runGuard({ argv: stableArgs });
  const stableSecond = await runGuard({ argv: stableArgs });
  expect(stableFirst.exitCode === 0, "stable fixture should exit 0");
  expect(stableSecond.exitCode === 0, "repeat stable fixture should exit 0");

  const stableFirstPayload = JSON.parse(stableFirst.stdout);
  const stableSecondPayload = JSON.parse(stableSecond.stdout);
  expect(
    stableFirstPayload.deterministic_hash === stableSecondPayload.deterministic_hash,
    "stable deterministic_hash must remain unchanged across repeated runs"
  );
  expect(
    JSON.stringify(stableFirstPayload) === JSON.stringify(stableSecondPayload),
    "stable payload must remain identical across repeated runs"
  );
  expectNoTimeDependency(stableFirstPayload, "stable payload");

  const verifyDoc = fs.readFileSync(path.join(repoRoot, "docs", "VERIFY.md"), "utf8");
  for (const line of EXPECTED_VERIFY_LINES) {
    expect(verifyDoc.includes(line), `docs/VERIFY.md must include ${line}`);
  }

  const finalAcceptanceDoc = fs.readFileSync(
    path.join(repoRoot, "docs", "governance", "v6_18_authority_drift_final_acceptance.md"),
    "utf8"
  );
  expect(finalAcceptanceDoc.includes("RC-frozen"), "final acceptance doc must record RC freeze");
  expect(finalAcceptanceDoc.includes("v6.13.1"), "final acceptance doc must preserve the commercial baseline statement");

  process.stdout.write("PASS verify_v6_18_authority_drift_final_acceptance\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
