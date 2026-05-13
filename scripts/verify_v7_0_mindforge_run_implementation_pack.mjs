import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const IMPLEMENTATION_PACK = "docs/commercial/v7_0_mindforge_run_implementation_pack.md";

const ALLOWED_CHANGED_PATHS = new Set([
  IMPLEMENTATION_PACK,
  "scripts/verify_v7_0_mindforge_run_implementation_pack.mjs"
]);

const REQUIRED_PAGE_MODULES = [
  "Hero",
  "Why v7.0.0 matters",
  "First Governance Report in 10 Minutes",
  "From Evidence Pack to Governance Report",
  "Report Experience by Edition",
  "Boundary / What Guard does not do",
  "CTA to npm package",
  "CTA to GitHub Release",
  "CTA to License Hub"
];

const REQUIRED_LINKS = [
  "https://www.npmjs.com/package/@veeduzyl/mindforge-guard/v/7.0.0",
  "https://github.com/veeduzyl-hue/mindforge-guard/releases/tag/v7.0.0",
  "existing production `Open License Hub` URL",
  "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/v7_0_first_report.md",
  "https://github.com/veeduzyl-hue/mindforge-guard/tree/main/examples/single-agent-governance-pack/hr-self-service-agent"
];

const REQUIRED_REFERENCES = [
  "Lovable Prompt",
  "implementation pack",
  "not a production deployment",
  "v7.0.0 is published",
  "@veeduzyl/mindforge-guard@7.0.0",
  "GitHub Release: `v7.0.0`",
  "License Hub",
  "First Governance Report",
  "Evidence Pack",
  "Report Experience by Edition",
  "pack validate",
  "report single-agent"
];

const BOUNDARY_TERMS = [
  "recommendation-only",
  "additive-only",
  "non-executing",
  "default-off where applicable",
  "non-control-plane",
  "human-review-oriented",
  "deterministic",
  "local-first where applicable",
  "no extra runtime authority for Enterprise",
  "no approval system",
  "no blocking system",
  "no merge-safety promise",
  "no deployment-safety promise",
  "no legal compliance guarantee",
  "no compliance certification",
  "no maturity certification",
  "No GitHub Action launched",
  "No Marketplace available",
  "no pricing change",
  "no entitlement change"
];

const DESIGN_CONSTRAINTS = [
  "Do not overfill the page",
  "Keep copy short and buyer-readable",
  "Avoid dense technical paragraphs",
  "Use compact cards / CTA blocks",
  "Preserve current homepage commercial tone",
  "Avoid legal or compliance overclaiming"
];

const ACCEPTANCE_CHECKS = [
  "v7.0.0 published status is visible",
  "install CTA is visible",
  "first report path is visible",
  "edition experience is visible",
  "boundary is visible",
  "no compliance certification claim appears",
  "no pricing or entitlement change is implied",
  "License Hub link still works",
  "GitHub Release link works",
  "npm package link works"
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
  "apps/license-hub/",
  "mindforge.run/",
  "packages/",
  "schemas/",
  "fixtures/",
  "examples/",
  ".github/workflows/"
];

const FORBIDDEN_CHANGED_EXACT = new Set([
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
    expect(!FORBIDDEN_CHANGED_EXACT.has(relativePath), `forbidden exact path changed: ${relativePath}`);

    for (const prefix of FORBIDDEN_CHANGED_PREFIXES) {
      expect(!relativePath.startsWith(prefix), `forbidden path prefix changed: ${relativePath}`);
    }

    expect(!/pricing/i.test(relativePath), `pricing-related path changed: ${relativePath}`);
    expect(!/checkout/i.test(relativePath), `checkout-related path changed: ${relativePath}`);
    expect(!/paddle/i.test(relativePath), `Paddle-related path changed: ${relativePath}`);
    expect(!/entitlement/i.test(relativePath), `entitlement-related path changed: ${relativePath}`);
    expect(!/marketplace/i.test(relativePath), `Marketplace-related path changed: ${relativePath}`);
  }
}

function assertContainsAll(text, phrases, label) {
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
  const packPath = path.join(repoRoot, IMPLEMENTATION_PACK);

  expect(fs.existsSync(packPath), `${IMPLEMENTATION_PACK} must exist`);

  const packText = readText(packPath);
  assertContainsAll(packText, REQUIRED_PAGE_MODULES, "implementation pack page modules");
  assertContainsAll(packText, REQUIRED_LINKS, "implementation pack links");
  assertContainsAll(packText, REQUIRED_REFERENCES, "implementation pack references");
  assertContainsAll(packText, BOUNDARY_TERMS, "implementation pack boundary");
  assertContainsAll(packText, DESIGN_CONSTRAINTS, "implementation pack design constraints");
  assertContainsAll(packText, ACCEPTANCE_CHECKS, "implementation pack acceptance checklist");

  expect(packText.includes("externally hosted and Lovable-managed"), "implementation pack must state Lovable hosting");
  expect(packText.includes("Copy this prompt into Lovable"), "Lovable prompt must be copyable");

  assertForbiddenPositiveClaimsAbsent(packText);
  assertChangedPathsAllowed(collectChangedPaths(repoRoot));
  assertDeniedExitCodeStillPresent(repoRoot);

  console.log("PASS: v7.0 mindforge.run implementation pack verified.");
}

main();
