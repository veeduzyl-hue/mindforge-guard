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
];

const ALLOWED_CHANGED_PATHS = new Set([
  ...PUBLIC_SURFACES,
  "docs/commercial/v7_0_1_single_agent_governance_positioning.md",
  "scripts/verify_v7_0_1_commercial_positioning_rewrite.mjs",
  "scripts/verify_v7_0_1_public_install_references.mjs",
  "scripts/verify_v7_0_license_hub_copy_implementation.mjs",
  "scripts/verify_v7_0_mindforge_run_implementation_pack.mjs",
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
  "safe to deploy",
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
  expect(text.includes("@veeduzyl/mindforge-guard@7.0.1"), `${label} must reference @veeduzyl/mindforge-guard@7.0.1`);
  expect(text.includes("v7.0.1"), `${label} must reference v7.0.1`);
  expect(
    text.includes("recommended install target") ||
      text.includes("current recommended package") ||
      text.includes("current recommended v7.0.1 package") ||
      text.includes("recommended install target for technical docs"),
    `${label} must explain the v7.0.1 recommended install target`,
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
    "current npm package URL must point to /v/7.0.1",
  );
  expect(
    text.includes("https://github.com/veeduzyl-hue/mindforge-guard/releases/tag/v7.0.1"),
    "current GitHub Release URL must point to v7.0.1",
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
    const escaped = claim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const positivePattern = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, "i");
    const negatedPattern = new RegExp(`(^|[^a-z])(no|not)\\s+${escaped}([^a-z]|$)`, "i");

    if (positivePattern.test(lower) && !negatedPattern.test(lower)) {
      fail(`forbidden claim must be absent: ${claim}`);
    }
  }
}

function assertSecondaryInstallContext(text, label) {
  const sectionIndex = text.indexOf("Secondary technical install");
  const installIndex = text.indexOf("@veeduzyl/mindforge-guard@7.0.1");

  if (sectionIndex >= 0 && installIndex >= 0) {
    expect(installIndex > sectionIndex, `${label} must keep install references inside a secondary technical install context`);
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
  const pageText = readText(path.join(repoRoot, "apps/license-hub/app/page.tsx"));
  const docsText = readText(path.join(repoRoot, "apps/license-hub/app/docs/page.tsx"));
  const productText = readText(path.join(repoRoot, "apps/license-hub/app/product/page.tsx"));

  assertSecondaryInstallContext(pageText, "apps/license-hub/app/page.tsx");
  assertSecondaryInstallContext(docsText, "apps/license-hub/app/docs/page.tsx");
  assertSecondaryInstallContext(productText, "apps/license-hub/app/product/page.tsx");

  assertCurrentLinks(combinedText);
  assertBoundaryTerms(combinedText);
  assertForbiddenClaimsAbsent(combinedText);
  assertDenyExitCodeStillPresent(repoRoot);

  console.log("PASS: v7.0.1 public install references verified.");
}

main();
