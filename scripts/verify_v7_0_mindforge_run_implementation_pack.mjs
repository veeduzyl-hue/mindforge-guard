import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const IMPLEMENTATION_PACK = "docs/commercial/v7_0_mindforge_run_implementation_pack.md";

const ALLOWED_CHANGED_PATHS = new Set([
  "apps/license-hub/app/page.tsx",
  "apps/license-hub/app/docs/page.tsx",
  "apps/license-hub/app/product/page.tsx",
  "docs/commercial/v7_0_license_hub_copy_candidate.md",
  "docs/commercial/v7_0_mindforge_run_copy_candidate.md",
  "docs/commercial/v7_0_download_to_first_report_ux.md",
  IMPLEMENTATION_PACK,
  "docs/commercial/v7_0_1_single_agent_governance_positioning.md",
  "scripts/verify_v7_0_1_commercial_positioning_rewrite.mjs",
  "scripts/verify_v7_0_1_public_install_references.mjs",
  "scripts/verify_v7_0_license_hub_copy_implementation.mjs",
  "scripts/verify_v7_0_mindforge_run_implementation_pack.mjs",
]);

const REQUIRED_PAGE_MODULES = [
  "Hero",
  "Why Reviewable Evidence Matters",
  "Use Cases",
  "Review Your First Single-Agent Action With Evidence",
  "From Evidence Pack to Governance Report",
  "Editions by Customer Outcome",
  "Secondary Technical Install",
  "Boundary / What Guard Does Not Do",
  "CTA to License Hub",
];

const REQUIRED_LINKS = [
  "https://www.npmjs.com/package/@veeduzyl/mindforge-guard/v/7.0.1",
  "https://github.com/veeduzyl-hue/mindforge-guard/releases/tag/v7.0.1",
  "existing production `Open License Hub` URL",
  "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/commercial/v7_0_1_single_agent_governance_positioning.md",
  "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/v7_0_first_report.md",
  "https://github.com/veeduzyl-hue/mindforge-guard/tree/main/examples/single-agent-governance-pack/hr-self-service-agent",
];

const REQUIRED_REFERENCES = [
  "Lovable Prompt",
  "implementation pack",
  "not a production deployment",
  "Make AI-assisted work reviewable before it becomes trusted.",
  "MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows.",
  "review bundle behind an AI-assisted action",
  "AI coding agents",
  "Support agents",
  "Operations agents",
  "Internal workflow agents",
  "secondary technical install",
  "@veeduzyl/mindforge-guard@7.0.1",
  "no extra runtime authority",
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
  "no safe-to-deploy claim",
  "no legal compliance guarantee",
  "no compliance certification",
  "no maturity certification",
  "no pricing change",
  "no entitlement change",
];

const DESIGN_CONSTRAINTS = [
  "Do not overfill the page.",
  "Keep copy short and buyer-readable.",
  "Avoid dense technical paragraphs.",
  "Use compact cards / CTA blocks.",
  "Preserve current homepage commercial tone.",
  "Avoid legal or compliance overclaiming.",
];

const ACCEPTANCE_CHECKS = [
  "single-agent governance evidence is the primary public story",
  "AI-assisted work and single-agent AI workflows are visible",
  "Evidence Pack is explained as an evidence bundle or review bundle",
  "the first workflow path is visible",
  "use cases are visible",
  "edition experience is visible",
  "boundary is visible",
  "technical install references are secondary",
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
    const escaped = claim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const positivePattern = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, "i");
    const negatedPattern = new RegExp(`(^|[^a-z])(no|not)\\s+${escaped}([^a-z]|$)`, "i");

    if (positivePattern.test(lower) && !negatedPattern.test(lower)) {
      fail(`forbidden positive claim must be absent: ${claim}`);
    }
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
  expect(
    packText.includes("synthetic sample evidence bundle for local validation"),
    "implementation pack must downgrade any sample to synthetic sample evidence bundle for local validation",
  );
  expect(
    packText.includes("Keep version, npm package, and GitHub Release references in a secondary technical install/docs module."),
    "implementation pack must keep version and release references in a secondary technical install/docs module",
  );

  assertForbiddenPositiveClaimsAbsent(packText);
  assertChangedPathsAllowed(collectChangedPaths(repoRoot));
  assertDenyExitCodeStillPresent(repoRoot);

  console.log("PASS: v7.0 mindforge.run implementation pack verified.");
}

main();
