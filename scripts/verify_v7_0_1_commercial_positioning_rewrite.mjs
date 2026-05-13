import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PUBLIC_SURFACES = [
  "apps/license-hub/app/page.tsx",
  "apps/license-hub/app/docs/page.tsx",
  "apps/license-hub/app/product/page.tsx",
  "docs/commercial/v7_0_license_hub_copy_candidate.md",
  "docs/commercial/v7_0_mindforge_run_copy_candidate.md",
  "docs/commercial/v7_0_download_to_first_report_ux.md",
  "docs/commercial/v7_0_mindforge_run_implementation_pack.md",
  "docs/commercial/v7_0_1_single_agent_governance_positioning.md",
];

const ALLOWED_CHANGED_PATHS = new Set([
  ...PUBLIC_SURFACES,
  "scripts/verify_v7_0_1_commercial_positioning_rewrite.mjs",
  "scripts/verify_v7_0_1_public_install_references.mjs",
  "scripts/verify_v7_0_license_hub_copy_implementation.mjs",
  "scripts/verify_v7_0_mindforge_run_implementation_pack.mjs",
]);

const REQUIRED_GLOBAL_PHRASES = [
  "Make AI-assisted work reviewable before it becomes trusted.",
  "MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows.",
  "AI-assisted work",
  "single-agent AI workflows",
  "An Evidence Pack is the review bundle behind an AI-assisted action:",
  "authority boundary",
  "execution evidence",
  "missing evidence",
  "risk/drift signals",
  "AI coding agents",
  "Support agents",
  "Operations agents",
  "Internal workflow agents",
  "Review evidence behind AI-generated code changes before merge or release decisions.",
  "Community: See the current governance evidence for one agent workflow.",
  "Pro: Track governance signals over time.",
  "Pro+: Compare evidence states and uncover deeper signals.",
  "Enterprise: Standardize adoption, review packets, and procurement around the same bounded runtime posture. No extra runtime authority.",
  "recommendation-only",
  "non-executing",
  "non-control-plane",
  "human-review-oriented",
  "deterministic",
  "local-first where applicable",
  "no extra runtime authority",
];

const REQUIRED_HOME_PHRASES = [
  "Generate a governance report for a single-agent workflow",
  "Review your first single-agent action with evidence",
];

const REQUIRED_PRODUCT_PHRASES = [
  "Not an approval system. Not a blocker. Not a control plane.",
  "Secondary technical install",
];

const REQUIRED_DOCS_PHRASES = [
  "Single-agent governance report docs",
  "Secondary technical install",
];

const USER_FACING_INTERNAL_PHRASES = [
  "public commercial headline",
  "install/docs surfaces",
  "copy candidate",
  "implementation pack",
  "verifier",
  "pr",
];

const BOUNDARY_PHRASES = [
  "no approval system",
  "no blocking system",
  "no safe-to-deploy claim",
  "no legal compliance guarantee",
  "no compliance certification",
  "no maturity certification",
  "no pricing change",
  "no entitlement change",
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

function resolveGitDir(repoRoot) {
  const dotGitPath = path.join(repoRoot, ".git");
  const stat = fs.statSync(dotGitPath);

  if (stat.isDirectory()) {
    return dotGitPath;
  }

  const pointerText = readText(dotGitPath).trim();
  const match = pointerText.match(/^gitdir:\s*(.+)$/i);
  expect(match, ".git pointer file must contain a gitdir reference");

  return path.resolve(repoRoot, match[1]);
}

function parseGitIndex(repoRoot) {
  const gitDir = resolveGitDir(repoRoot);
  const indexPath = path.join(gitDir, "index");
  const buffer = fs.readFileSync(indexPath);

  expect(buffer.subarray(0, 4).toString("utf8") === "DIRC", ".git/index must have DIRC signature");

  const entryCount = buffer.readUInt32BE(8);
  const entries = new Map();
  let offset = 12;

  for (let index = 0; index < entryCount; index += 1) {
    const entryStart = offset;
    const flags = buffer.readUInt16BE(offset + 60);
    const pathStart = offset + 62;
    let pathEnd = pathStart;

    while (pathEnd < buffer.length && buffer[pathEnd] !== 0) {
      pathEnd += 1;
    }

    const entryPath = buffer.subarray(pathStart, pathEnd).toString("utf8").replace(/\\/g, "/");
    const entry = {
      size: buffer.readUInt32BE(offset + 36),
      mtimeSeconds: buffer.readUInt32BE(offset + 8),
      mtimeNanoseconds: buffer.readUInt32BE(offset + 12),
    };

    entries.set(entryPath, entry);

    const pathLength = (flags & 0x0fff) === 0x0fff ? pathEnd - pathStart : flags & 0x0fff;
    const entryLength = 62 + pathLength + 1;
    offset = entryStart + entryLength;
    while ((offset - entryStart) % 8 !== 0) {
      offset += 1;
    }
  }

  return entries;
}

function walkRepoFiles(repoRoot, currentRelativePath = "", results = []) {
  const currentPath = path.join(repoRoot, currentRelativePath);
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = currentRelativePath
      ? `${currentRelativePath}/${entry.name}`.replace(/\\/g, "/")
      : entry.name.replace(/\\/g, "/");

    if (relativePath === ".git" || relativePath.startsWith(".git/")) continue;
    if (relativePath === "node_modules" || relativePath.startsWith("node_modules/")) continue;
    if (relativePath === ".mindforge" || relativePath.startsWith(".mindforge/")) continue;
    if (entry.isDirectory() && entry.name === "node_modules") continue;
    if (entry.isDirectory() && (entry.name === ".next" || entry.name === "dist" || entry.name === "build" || entry.name === "coverage")) {
      continue;
    }

    if (entry.isDirectory()) {
      walkRepoFiles(repoRoot, relativePath, results);
      continue;
    }

    results.push({ relativePath, fullPath: path.join(repoRoot, relativePath) });
  }

  return results;
}

function isIgnoredUntrackedPath(relativePath) {
  return (
    /^\.git\//i.test(relativePath) ||
    /^node_modules\//i.test(relativePath) ||
    /^\.mindforge\//i.test(relativePath) ||
    /(^|\/)\.mindforge\//i.test(relativePath) ||
    /^license-hub-dev\.log$/i.test(relativePath) ||
    /^.*\.tgz$/i.test(relativePath) ||
    /^packages\/[^/]+\/generated\//i.test(relativePath) ||
    /^apps\/license-hub\/\.env($|\.)/i.test(relativePath) ||
    /^apps\/license-hub\/\.next\//i.test(relativePath) ||
    /^apps\/license-hub\/.*\.tsbuildinfo$/i.test(relativePath)
  );
}

function collectChangedPaths(repoRoot) {
  const indexEntries = parseGitIndex(repoRoot);
  const changedPaths = new Set();

  for (const [relativePath, entry] of indexEntries.entries()) {
    const fullPath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(fullPath)) {
      changedPaths.add(relativePath);
      continue;
    }

    const stat = fs.statSync(fullPath);
    const workingTreeMtimeSeconds = Math.floor(stat.mtimeMs / 1000);
    const workingTreeMtimeNanoseconds = Math.floor((stat.mtimeMs % 1000) * 1_000_000);

    const sameStat =
      stat.size === entry.size &&
      workingTreeMtimeSeconds === entry.mtimeSeconds &&
      Math.abs(workingTreeMtimeNanoseconds - entry.mtimeNanoseconds) < 1_000_000;

    if (!sameStat) {
      changedPaths.add(relativePath);
    }
  }

  for (const { relativePath } of walkRepoFiles(repoRoot)) {
    if (isIgnoredUntrackedPath(relativePath)) continue;
    if (indexEntries.has(relativePath)) continue;
    changedPaths.add(relativePath);
  }

  return [...changedPaths].sort();
}

function assertAllowedChangedPaths(changedPaths) {
  for (const relativePath of changedPaths) {
    expect(ALLOWED_CHANGED_PATHS.has(relativePath), `unexpected changed path outside positioning rewrite set: ${relativePath}`);
    expect(!FORBIDDEN_CHANGED_EXACT.has(relativePath), `forbidden exact path changed: ${relativePath}`);

    for (const prefix of FORBIDDEN_CHANGED_PREFIXES) {
      expect(!relativePath.startsWith(prefix), `forbidden path prefix changed: ${relativePath}`);
    }

    expect(!/pricing/i.test(relativePath), `pricing-related path changed: ${relativePath}`);
    expect(!/checkout/i.test(relativePath), `checkout-related path changed: ${relativePath}`);
    expect(!/paddle/i.test(relativePath), `Paddle-related path changed: ${relativePath}`);
    expect(!/entitlement/i.test(relativePath), `entitlement-related path changed: ${relativePath}`);
    expect(!/license[_-]?api/i.test(relativePath), `license API path changed: ${relativePath}`);
    expect(!/runtime/i.test(relativePath), `runtime-related path changed: ${relativePath}`);
  }
}

function assertContainsAll(text, phrases, label) {
  for (const phrase of phrases) {
    expect(text.includes(phrase), `${label} must include: ${phrase}`);
  }
}

function assertForbiddenClaimsAbsent(text) {
  const lower = text.toLowerCase();

  for (const claim of FORBIDDEN_CLAIMS) {
    const escaped = claim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const positivePattern = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, "i");
    const negatedPattern = new RegExp(`(^|[^a-z])(no|not)\\s+${escaped}([^a-z]|$)`, "i");

    if (positivePattern.test(lower) && !negatedPattern.test(lower)) {
      fail(`forbidden claim must be absent: ${claim}`);
    }
  }
}

function assertSecondaryTechnicalInstall(surfaceText, label) {
  const sectionIndex = surfaceText.indexOf("Secondary technical install");
  const installIndex = surfaceText.indexOf("@veeduzyl/mindforge-guard@7.0.1");

  expect(sectionIndex >= 0, `${label} must include a secondary technical install section`);
  expect(installIndex > sectionIndex, `${label} must keep install references inside the secondary technical install section`);
}

function assertNoPrimaryHrHero(surfaceText, label) {
  expect(!surfaceText.includes("HR self-service"), `${label} must not use HR self-service as the primary public hero path`);
}

function assertHeroNotVersionLed(surfaceText, label) {
  expect(!surfaceText.includes("GitHub Release"), `${label} must not use GitHub Release as hero copy`);
}

function assertNoInternalPhrases(surfaceText, label) {
  const lower = surfaceText.toLowerCase();
  for (const phrase of USER_FACING_INTERNAL_PHRASES) {
    if (phrase.toLowerCase() === "pr") {
      expect(!/\bPR\b/.test(surfaceText), `${label} must not expose internal phrase: ${phrase}`);
      continue;
    }
    expect(!lower.includes(phrase.toLowerCase()), `${label} must not expose internal phrase: ${phrase}`);
  }
}

function assertDenyExitCodeStillPresent(repoRoot) {
  const permitGatePath = path.join(repoRoot, "packages/guard/src/runtime/governance/permit/permitGate.mjs");
  expect(fs.existsSync(permitGatePath), "permitGate.mjs must still exist");
  const permitGateText = readText(permitGatePath);
  expect(
    permitGateText.includes("export const PERMIT_GATE_DENIED_EXIT_CODE = 25;"),
    "deny exit code 25 must remain unchanged",
  );
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");
  const changedPaths = collectChangedPaths(repoRoot);

  assertAllowedChangedPaths(changedPaths);

  const surfaceTexts = PUBLIC_SURFACES.map((relativePath) => {
    const fullPath = path.join(repoRoot, relativePath);
    expect(fs.existsSync(fullPath), `${relativePath} must exist`);
    return {
      relativePath,
      text: readText(fullPath),
    };
  });

  const combinedText = surfaceTexts.map(({ text }) => text).join("\n");
  const homeText = readText(path.join(repoRoot, "apps/license-hub/app/page.tsx"));
  const docsText = readText(path.join(repoRoot, "apps/license-hub/app/docs/page.tsx"));
  const productText = readText(path.join(repoRoot, "apps/license-hub/app/product/page.tsx"));

  assertContainsAll(combinedText, REQUIRED_GLOBAL_PHRASES, "commercial positioning rewrite");
  assertContainsAll(combinedText, BOUNDARY_PHRASES, "commercial positioning boundary");
  assertContainsAll(homeText, REQUIRED_HOME_PHRASES, "License Hub home");
  assertContainsAll(docsText, REQUIRED_DOCS_PHRASES, "License Hub docs");
  assertContainsAll(productText, REQUIRED_PRODUCT_PHRASES, "License Hub product");

  assertSecondaryTechnicalInstall(homeText, "License Hub home");
  assertSecondaryTechnicalInstall(productText, "License Hub product");
  assertSecondaryTechnicalInstall(docsText, "License Hub docs");

  assertNoPrimaryHrHero(homeText, "License Hub home");
  assertNoPrimaryHrHero(productText, "License Hub product");
  assertNoPrimaryHrHero(docsText, "License Hub docs");

  assertHeroNotVersionLed(homeText, "License Hub home");
  assertHeroNotVersionLed(productText, "License Hub product");
  assertNoInternalPhrases(homeText, "License Hub home");
  assertNoInternalPhrases(productText, "License Hub product");
  assertNoInternalPhrases(docsText, "License Hub docs");

  expect(
    combinedText.includes("synthetic sample evidence bundle for local validation"),
    "sample workflow references must be downgraded to synthetic sample evidence bundle for local validation",
  );

  assertForbiddenClaimsAbsent(combinedText);
  assertDenyExitCodeStillPresent(repoRoot);

  console.log("PASS: v7.0.1 commercial positioning rewrite verified.");
}

main();
