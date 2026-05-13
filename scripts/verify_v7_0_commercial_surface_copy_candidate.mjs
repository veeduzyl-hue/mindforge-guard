import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REQUIRED_DOCS = [
  "docs/commercial/v7_0_license_hub_copy_candidate.md",
  "docs/commercial/v7_0_mindforge_run_copy_candidate.md",
  "docs/commercial/v7_0_download_to_first_report_ux.md"
];

const ALLOWED_CHANGED_PATHS = new Set([
  ...REQUIRED_DOCS,
  "scripts/verify_v7_0_commercial_surface_copy_candidate.mjs"
]);

const REQUIRED_PHRASES = [
  "v7.0.0 is published",
  "@veeduzyl/mindforge-guard@7.0.0",
  "GitHub Release: `v7.0.0`",
  "No change to pricing or entitlement in this copy candidate",
  "First Governance Report workflow",
  "Evidence Pack",
  "pack validate",
  "report single-agent",
  "Authority / Permission Boundary",
  "Execution / Behavior Evidence",
  "Risk / Drift / Maturity Signals",
  "Community",
  "current-state governance report preview",
  "Pro",
  "timeline / trend-oriented report reading where released commands support it",
  "Pro+",
  "compare / correlate / deeper signals where released commands support them",
  "Enterprise",
  "same runtime entitlement as Pro+",
  "no extra runtime authority",
  "recommendation-only",
  "non-executing",
  "non-control-plane",
  "local-first where applicable",
  "deterministic",
  "human-review-oriented",
  "no pricing change",
  "no entitlement change"
];

const LICENSE_HUB_MODULES = [
  "After Purchase: Generate Your First Governance Report",
  "Start With The v7.0.0 First Report Workflow",
  "Use The HR Self-Service Example Evidence Pack",
  "Understand Your Edition's Report Experience",
  "What Guard Does Not Do"
];

const MINDFORGE_RUN_MODULES = [
  "Hero / CTA Language For v7.0.0",
  "From Evidence Pack To Governance Report",
  "First Governance Report In 10 Minutes",
  "Report Experience By Edition",
  "Boundary: Not Approval, Not Blocking, Not Compliance Certification"
];

const UX_FLOW_PHRASES = [
  "User arrives from `mindforge.run` or License Hub",
  "User installs package",
  "User verifies CLI availability",
  "User downloads or installs a license if applicable",
  "User opens the example Evidence Pack",
  "User runs pack validate",
  "User runs report single-agent",
  "User reads the report through the three report layers",
  "User decides the next human review action outside Guard"
];

const FORBIDDEN_POSITIVE_CLAIMS = [
  "approval granted",
  "approves changes",
  "blocking enforcement",
  "blocks unsafe changes",
  "safe-to-merge",
  "safe-to-deploy",
  "certifies compliance",
  "compliance certified",
  "legal compliance guaranteed",
  "maturity certified",
  "runtime control plane",
  "policy engine"
];

const FORBIDDEN_PATH_PREFIXES = [
  "apps/license-hub/",
  "mindforge.run/",
  "packages/",
  "schemas/",
  "fixtures/",
  "examples/",
  ".github/workflows/"
];

const FORBIDDEN_EXACT_PATHS = new Set([
  "action.yml",
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock"
]);

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function normalizeGitPath(value) {
  return value.trim().replace(/\\/g, "/");
}

function runGit(repoRoot, args) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function collectChangedPaths(repoRoot) {
  const changed = new Set();

  for (const line of runGit(repoRoot, ["diff", "--name-only", "HEAD"]).split(/\r?\n/)) {
    const normalized = normalizeGitPath(line);
    if (normalized) changed.add(normalized);
  }

  for (const line of runGit(repoRoot, ["ls-files", "--others", "--exclude-standard"]).split(/\r?\n/)) {
    const normalized = normalizeGitPath(line);
    if (normalized) changed.add(normalized);
  }

  return [...changed].sort();
}

function assertChangedPathsAllowed(changedPaths) {
  for (const relativePath of changedPaths) {
    expect(ALLOWED_CHANGED_PATHS.has(relativePath), `unexpected changed path outside allowed set: ${relativePath}`);
    expect(!FORBIDDEN_EXACT_PATHS.has(relativePath), `forbidden exact path changed: ${relativePath}`);

    for (const prefix of FORBIDDEN_PATH_PREFIXES) {
      expect(!relativePath.startsWith(prefix), `forbidden path prefix changed: ${relativePath}`);
    }

    expect(!/pricing/i.test(relativePath), `pricing-related path changed: ${relativePath}`);
    expect(!/checkout/i.test(relativePath), `checkout-related path changed: ${relativePath}`);
    expect(!/paddle/i.test(relativePath), `Paddle-related path changed: ${relativePath}`);
    expect(!/entitlement/i.test(relativePath), `entitlement-related path changed: ${relativePath}`);
    expect(!/marketplace/i.test(relativePath), `Marketplace-related path changed: ${relativePath}`);
  }
}

function assertRequiredPhrases(text) {
  for (const phrase of REQUIRED_PHRASES) {
    expect(text.includes(phrase), `copy candidate must include required phrase: ${phrase}`);
  }
}

function assertRequiredModules(text, modules, label) {
  for (const moduleName of modules) {
    expect(text.includes(moduleName), `${label} must include suggested module: ${moduleName}`);
  }
}

function assertForbiddenPositiveClaimsAbsent(text) {
  const lower = text.toLowerCase();
  for (const claim of FORBIDDEN_POSITIVE_CLAIMS) {
    expect(!lower.includes(claim.toLowerCase()), `forbidden positive claim phrase must be absent: ${claim}`);
  }
}

function assertDeniedExitCodeStillPresent(repoRoot) {
  const permitGatePath = path.join(repoRoot, "packages/guard/src/runtime/governance/permit/permitGate.mjs");
  expect(fs.existsSync(permitGatePath), "permitGate.mjs must still exist");
  const permitGateText = readText(permitGatePath);
  expect(
    permitGateText.includes("export const PERMIT_GATE_DENIED_EXIT_CODE = 25;"),
    "deny exit code 25 must remain unchanged"
  );
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  for (const relativePath of REQUIRED_DOCS) {
    expect(fs.existsSync(path.join(repoRoot, relativePath)), `${relativePath} must exist`);
  }

  const licenseHubText = readText(path.join(repoRoot, REQUIRED_DOCS[0]));
  const mindforgeRunText = readText(path.join(repoRoot, REQUIRED_DOCS[1]));
  const uxText = readText(path.join(repoRoot, REQUIRED_DOCS[2]));
  const combinedText = `${licenseHubText}\n${mindforgeRunText}\n${uxText}`;

  assertRequiredPhrases(combinedText);
  assertRequiredModules(licenseHubText, LICENSE_HUB_MODULES, "License Hub copy candidate");
  assertRequiredModules(mindforgeRunText, MINDFORGE_RUN_MODULES, "mindforge.run copy candidate");

  for (const phrase of UX_FLOW_PHRASES) {
    expect(uxText.includes(phrase), `download-to-first-report UX must include: ${phrase}`);
  }

  expect(
    combinedText.includes("No License Hub production page is changed") ||
      combinedText.includes("No License Hub TSX page is changed"),
    "candidate must confirm no License Hub production page change"
  );
  expect(
    combinedText.includes("No `mindforge.run` production page is changed") ||
      combinedText.includes("No `mindforge.run` production file is changed"),
    "candidate must confirm no mindforge.run production page change"
  );
  expect(
    combinedText.includes("No GitHub Action is launched") &&
      combinedText.includes("No Marketplace listing"),
    "candidate must confirm no GitHub Action or Marketplace launch"
  );

  assertForbiddenPositiveClaimsAbsent(combinedText);
  assertChangedPathsAllowed(collectChangedPaths(repoRoot));
  assertDeniedExitCodeStillPresent(repoRoot);

  console.log("PASS: v7.0 commercial surface copy candidate verified.");
}

main();
