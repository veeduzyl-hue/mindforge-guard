import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const PUBLIC_SURFACES = [
  "apps/license-hub/app/page.tsx",
  "apps/license-hub/app/docs/page.tsx",
  "apps/license-hub/app/product/page.tsx",
  "docs/commercial/v7_0_license_hub_copy_candidate.md",
  "docs/commercial/v7_0_mindforge_run_copy_candidate.md",
  "docs/commercial/v7_0_download_to_first_report_ux.md",
  "docs/commercial/v7_0_mindforge_run_implementation_pack.md",
];

const ALLOWED_CHANGED_PATHS = new Set([
  ...PUBLIC_SURFACES,
  "scripts/verify_v7_0_1_public_install_references.mjs",
]);

const HISTORICAL_RELEASE_RECORDS = [
  "docs/release/v7_0_release_notes_candidate.md",
  "docs/release/v7_0_github_release_candidate.md",
  "docs/release/v7_0_npm_pack_dry_run_review.md",
  "docs/release/v7_0_final_main_verification_decision.md",
  "docs/release/v7_0_final_tag_package_approval_packet.md",
];

const BOUNDARY_TERMS = [
  "recommendation-only",
  "non-executing",
  "non-control-plane",
  "human-review-oriented",
];

const FORBIDDEN_CLAIMS = [
  "approval granted",
  "approves changes",
  "blocking enforcement",
  "blocks unsafe changes",
  "safe-to-deploy",
  "certifies compliance",
  "legal compliance guaranteed",
  "runtime control plane",
  "policy engine",
];

const FORBIDDEN_CHANGED_PREFIXES = [
  "packages/",
  "schemas/",
  "fixtures/",
  "examples/",
  ".github/workflows/",
];

const FORBIDDEN_CHANGED_EXACT = new Set([
  "action.yml",
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
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
    stdio: ["ignore", "pipe", "pipe"],
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
    expect(ALLOWED_CHANGED_PATHS.has(relativePath), `unexpected changed path outside allowed public install update: ${relativePath}`);
    expect(!FORBIDDEN_CHANGED_EXACT.has(relativePath), `forbidden exact path changed: ${relativePath}`);

    for (const prefix of FORBIDDEN_CHANGED_PREFIXES) {
      expect(!relativePath.startsWith(prefix), `forbidden path prefix changed: ${relativePath}`);
    }

    expect(!/pricing/i.test(relativePath), `pricing-related path changed: ${relativePath}`);
    expect(!/checkout/i.test(relativePath), `checkout-related path changed: ${relativePath}`);
    expect(!/paddle/i.test(relativePath), `Paddle-related path changed: ${relativePath}`);
    expect(!/entitlement/i.test(relativePath), `entitlement-related path changed: ${relativePath}`);
    expect(!/license[_-]?api/i.test(relativePath), `license API path changed: ${relativePath}`);
  }
}

function assertHistoricalReleaseRecordsUnchanged(repoRoot, changedPaths) {
  for (const relativePath of HISTORICAL_RELEASE_RECORDS) {
    expect(!changedPaths.includes(relativePath), `historical release record must not be rewritten: ${relativePath}`);
    expect(fs.existsSync(path.join(repoRoot, relativePath)), `historical release record must still exist: ${relativePath}`);
  }
}

function assertCurrentInstallReferences(text, label) {
  expect(
    text.includes("@veeduzyl/mindforge-guard@7.0.1"),
    `${label} must reference @veeduzyl/mindforge-guard@7.0.1`
  );
  expect(text.includes("v7.0.1"), `${label} must reference v7.0.1`);
  expect(
    text.includes("recommended install target") || text.includes("recommended for the First Governance Report"),
    `${label} must explain the v7.0.1 recommended install target`
  );
}

function assertNoCurrentV700InstallRecommendation(text, label) {
  const forbiddenPatterns = [
    /npm\s+install\s+-g\s+@veeduzyl\/mindforge-guard@7\.0\.0/i,
    /Install\s+Guard\s+v7\.0\.0/i,
    /Install\s+v7\.0\.0/i,
    /Install\s+@veeduzyl\/mindforge-guard@7\.0\.0/i,
    /Start\s+from\s+the\s+published\s+package\s+<code>@veeduzyl\/mindforge-guard@7\.0\.0<\/code>/i,
  ];

  for (const pattern of forbiddenPatterns) {
    expect(!pattern.test(text), `${label} must not recommend v7.0.0 as the current install target`);
  }
}

function assertCurrentLinks(text) {
  expect(
    text.includes("https://www.npmjs.com/package/@veeduzyl/mindforge-guard/v/7.0.1"),
    "current npm package URL must point to /v/7.0.1"
  );
  expect(
    text.includes("https://github.com/veeduzyl-hue/mindforge-guard/releases/tag/v7.0.1"),
    "current GitHub Release URL must point to v7.0.1"
  );
}

function assertBoundaryTerms(text) {
  const lower = text.toLowerCase();

  for (const term of BOUNDARY_TERMS) {
    expect(lower.includes(term.toLowerCase()), `boundary term must remain present: ${term}`);
  }
}

function assertForbiddenClaimsAbsent(text) {
  const lower = text.toLowerCase();

  for (const claim of FORBIDDEN_CLAIMS) {
    expect(!lower.includes(claim.toLowerCase()), `forbidden claim must be absent: ${claim}`);
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
  const changedPaths = collectChangedPaths(repoRoot);

  assertAllowedChangedPaths(changedPaths);
  assertHistoricalReleaseRecordsUnchanged(repoRoot, changedPaths);

  const surfaceTexts = PUBLIC_SURFACES.map((relativePath) => {
    const fullPath = path.join(repoRoot, relativePath);
    expect(fs.existsSync(fullPath), `${relativePath} must exist`);
    return { relativePath, text: readText(fullPath) };
  });

  for (const { relativePath, text } of surfaceTexts) {
    assertCurrentInstallReferences(text, relativePath);
    assertNoCurrentV700InstallRecommendation(text, relativePath);
  }

  const combinedText = surfaceTexts.map(({ text }) => text).join("\n");

  assertCurrentLinks(combinedText);
  assertBoundaryTerms(combinedText);
  assertForbiddenClaimsAbsent(combinedText);
  assertDeniedExitCodeStillPresent(repoRoot);

  console.log("PASS: v7.0.1 public install references verified.");
}

main();
