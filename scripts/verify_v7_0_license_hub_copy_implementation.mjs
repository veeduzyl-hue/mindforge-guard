import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ALLOWED_CHANGED_PATHS = new Set([
  "apps/license-hub/app/page.tsx",
  "apps/license-hub/app/docs/page.tsx",
  "apps/license-hub/app/product/page.tsx",
  "apps/license-hub/app/launchCopy.ts",
  "scripts/verify_v7_0_license_hub_copy_implementation.mjs"
]);

const REQUIRED_FILES = [
  "apps/license-hub/app/page.tsx",
  "apps/license-hub/app/docs/page.tsx",
  "apps/license-hub/app/product/page.tsx",
  "docs/commercial/v7_0_license_hub_copy_candidate.md",
  "docs/commercial/v7_0_download_to_first_report_ux.md"
];

const HOME_REQUIRED_PHRASES = [
  "Generate your first governance report",
  "v7.0.0 is published",
  "@veeduzyl/mindforge-guard@7.0.0",
  "HR self-service",
  "Evidence Pack",
  "pack validate",
  "report single-agent",
  "authority, behavior evidence, and risk/drift signals",
  "v7.0 First Report Candidate doc",
  "HR example Evidence Pack",
  "GitHub Release v7.0.0"
];

const DOCS_REQUIRED_PHRASES = [
  "v7.0.0 First Governance Report",
  "First Governance Report workflow",
  "Download to first report UX",
  "Report Experience by Edition",
  "What Guard does not do"
];

const PRODUCT_REQUIRED_PHRASES = [
  "From Evidence Pack to Governance Report",
  "First Governance Report in 10 Minutes",
  "report experience by edition",
  "recommendation-only",
  "non-executing",
  "non-control-plane"
];

const GLOBAL_REQUIRED_PHRASES = [
  "@veeduzyl/mindforge-guard@7.0.0",
  "GitHub Release v7.0.0",
  "Evidence Pack",
  "pack validate",
  "report single-agent",
  "recommendation-only",
  "non-executing",
  "non-control-plane",
  "human-review-oriented",
  "no extra runtime authority"
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

const FORBIDDEN_CHANGED_PREFIXES = [
  "packages/",
  "schemas/",
  "fixtures/",
  "examples/",
  ".github/workflows/",
  "mindforge.run/"
];

const FORBIDDEN_CHANGED_EXACT = new Set([
  "apps/license-hub/lib/commercialCatalog.ts",
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

function assertAllowedChangedPaths(changedPaths) {
  for (const relativePath of changedPaths) {
    expect(ALLOWED_CHANGED_PATHS.has(relativePath), `unexpected changed path outside allowed set: ${relativePath}`);
    expect(!FORBIDDEN_CHANGED_EXACT.has(relativePath), `forbidden exact path changed: ${relativePath}`);

    for (const prefix of FORBIDDEN_CHANGED_PREFIXES) {
      expect(!relativePath.startsWith(prefix), `forbidden path prefix changed: ${relativePath}`);
    }

    expect(!/commercialCatalog/i.test(relativePath), `commercialCatalog must not change: ${relativePath}`);
    expect(!/paddle/i.test(relativePath), `Paddle-related path must not change: ${relativePath}`);
    expect(!/checkout/i.test(relativePath), `checkout-related path must not change: ${relativePath}`);
    expect(!/entitlement/i.test(relativePath), `entitlement-related path must not change: ${relativePath}`);
    expect(!/api/i.test(relativePath), `license API path must not change: ${relativePath}`);
  }
}

function assertPhrases(text, phrases, label) {
  for (const phrase of phrases) {
    expect(text.includes(phrase), `${label} must include: ${phrase}`);
  }
}

function assertForbiddenPositiveClaimsAbsent(text) {
  const lower = text.toLowerCase();
  for (const claim of FORBIDDEN_POSITIVE_CLAIMS) {
    expect(!lower.includes(claim.toLowerCase()), `forbidden positive claim must be absent: ${claim}`);
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

  for (const relativePath of REQUIRED_FILES) {
    expect(fs.existsSync(path.join(repoRoot, relativePath)), `${relativePath} must exist`);
  }

  const pageText = readText(path.join(repoRoot, "apps/license-hub/app/page.tsx"));
  const docsText = readText(path.join(repoRoot, "apps/license-hub/app/docs/page.tsx"));
  const productText = readText(path.join(repoRoot, "apps/license-hub/app/product/page.tsx"));
  const combinedText = `${pageText}\n${docsText}\n${productText}`;

  assertPhrases(pageText, HOME_REQUIRED_PHRASES, "License Hub home");
  assertPhrases(docsText, DOCS_REQUIRED_PHRASES, "License Hub docs");
  assertPhrases(productText, PRODUCT_REQUIRED_PHRASES, "License Hub product");
  assertPhrases(combinedText, GLOBAL_REQUIRED_PHRASES, "License Hub v7.0 copy implementation");

  expect(combinedText.includes("no extra runtime authority"), "Enterprise boundary must preserve no extra runtime authority");

  assertForbiddenPositiveClaimsAbsent(combinedText);
  assertAllowedChangedPaths(collectChangedPaths(repoRoot));
  assertDeniedExitCodeStillPresent(repoRoot);

  console.log("PASS: v7.0 License Hub copy implementation verified.");
}

main();
