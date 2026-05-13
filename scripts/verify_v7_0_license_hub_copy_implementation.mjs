import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ALLOWED_CHANGED_PATHS = new Set([
  "apps/license-hub/app/page.tsx",
  "apps/license-hub/app/docs/page.tsx",
  "apps/license-hub/app/product/page.tsx",
  "docs/commercial/v7_0_license_hub_copy_candidate.md",
  "docs/commercial/v7_0_download_to_first_report_ux.md",
  "docs/commercial/v7_0_mindforge_run_copy_candidate.md",
  "docs/commercial/v7_0_mindforge_run_implementation_pack.md",
  "docs/commercial/v7_0_1_single_agent_governance_positioning.md",
  "scripts/verify_v7_0_1_commercial_positioning_rewrite.mjs",
  "scripts/verify_v7_0_1_public_install_references.mjs",
  "scripts/verify_v7_0_license_hub_copy_implementation.mjs",
  "scripts/verify_v7_0_mindforge_run_implementation_pack.mjs",
]);

const REQUIRED_FILES = [
  "apps/license-hub/app/page.tsx",
  "apps/license-hub/app/docs/page.tsx",
  "apps/license-hub/app/product/page.tsx",
  "docs/commercial/v7_0_license_hub_copy_candidate.md",
  "docs/commercial/v7_0_download_to_first_report_ux.md",
];

const HOME_REQUIRED_PHRASES = [
  "Generate a governance report for a single-agent workflow",
  "AI-assisted action",
  "Review your first single-agent action with evidence",
  "authority boundary",
  "execution evidence",
  "missing evidence",
  "risk/drift signals",
];

const DOCS_REQUIRED_PHRASES = [
  "Single-agent governance report docs",
  "review bundle behind an AI-assisted action",
  "Secondary technical install",
];

const PRODUCT_REQUIRED_PHRASES = [
  "Make AI-assisted work reviewable before it becomes trusted.",
  "Single-agent governance evidence for human review",
  "Not an approval system. Not a blocker. Not a control plane.",
  "recommendation-only",
  "non-executing",
  "non-control-plane",
];

const GLOBAL_REQUIRED_PHRASES = [
  "single-agent AI workflows",
  "AI-assisted work",
  "reviewable governance evidence",
  "sample agent action",
  "review bundle behind an AI-assisted action",
  "authority boundary",
  "execution evidence",
  "missing evidence",
  "risk/drift signals",
  "recommendation-only",
  "non-executing",
  "non-control-plane",
  "human-review-oriented",
  "@veeduzyl/mindforge-guard@7.0.1",
];

const FORBIDDEN_POSITIVE_CLAIMS = [
  "approval granted",
  "approves changes",
  "blocking enforcement",
  "blocks unsafe changes",
  "safe-to-merge",
  "safe-to-deploy",
  "safe to deploy",
  "certifies compliance",
  "compliance certified",
  "legal compliance guaranteed",
  "maturity certified",
  "runtime control plane",
  "policy engine",
];

const FORBIDDEN_USER_FACING_PHRASES = [
  "public commercial headline",
  "install/docs surfaces",
  "copy candidate",
  "implementation pack",
  "verifier",
  "pr",
];

const FORBIDDEN_CHANGED_PREFIXES = [
  "packages/",
  "schemas/",
  "fixtures/",
  "examples/",
  ".github/workflows/",
  "mindforge.run/",
];

const FORBIDDEN_CHANGED_EXACT = new Set([
  "apps/license-hub/lib/commercialCatalog.ts",
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
    const escaped = claim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const positivePattern = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, "i");
    const negatedPattern = new RegExp(`(^|[^a-z])(no|not)\\s+${escaped}([^a-z]|$)`, "i");

    if (positivePattern.test(lower) && !negatedPattern.test(lower)) {
      fail(`forbidden positive claim must be absent: ${claim}`);
    }
  }
}

function assertForbiddenUserFacingPhrasesAbsent(text, label) {
  const lower = text.toLowerCase();
  for (const phrase of FORBIDDEN_USER_FACING_PHRASES) {
    if (phrase.toLowerCase() === "pr") {
      expect(!/\bPR\b/.test(text), `${label} must not include internal-facing phrase: ${phrase}`);
      continue;
    }
    expect(!lower.includes(phrase.toLowerCase()), `${label} must not include internal-facing phrase: ${phrase}`);
  }
}

function assertSecondaryInstallContext(text, label) {
  const sectionIndex = text.indexOf("Secondary technical install");
  const installIndex = text.indexOf("@veeduzyl/mindforge-guard@7.0.1");

  expect(sectionIndex >= 0, `${label} must include a secondary technical install section`);
  expect(installIndex > sectionIndex, `${label} must keep @veeduzyl/mindforge-guard@7.0.1 inside the secondary technical install context`);
}

function assertNoHrPrimaryPath(text, label) {
  expect(!text.includes("HR self-service"), `${label} must not position HR self-service as the public path`);
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
  assertPhrases(combinedText, GLOBAL_REQUIRED_PHRASES, "License Hub commercial implementation");

  expect(combinedText.includes("no extra runtime authority"), "Enterprise boundary must preserve no extra runtime authority");

  assertSecondaryInstallContext(pageText, "License Hub home");
  assertSecondaryInstallContext(docsText, "License Hub docs");
  assertSecondaryInstallContext(productText, "License Hub product");

  assertForbiddenUserFacingPhrasesAbsent(pageText, "License Hub home");
  assertForbiddenUserFacingPhrasesAbsent(docsText, "License Hub docs");
  assertForbiddenUserFacingPhrasesAbsent(productText, "License Hub product");
  assertNoHrPrimaryPath(pageText, "License Hub home");
  assertNoHrPrimaryPath(docsText, "License Hub docs");
  assertNoHrPrimaryPath(productText, "License Hub product");

  assertForbiddenPositiveClaimsAbsent(combinedText);
  assertAllowedChangedPaths(collectChangedPaths(repoRoot));
  assertDenyExitCodeStillPresent(repoRoot);

  console.log("PASS: v7.0 License Hub copy implementation verified.");
}

main();
