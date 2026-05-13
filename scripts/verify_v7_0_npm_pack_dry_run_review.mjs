import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_DOC_PATH = "docs/release/v7_0_npm_pack_dry_run_review.md";
const PACKAGE_MANIFEST_PATH = "packages/guard/package.json";
const PERMIT_GATE_PATH = "packages/guard/src/runtime/governance/permit/permitGate.mjs";

const ALLOWED_CHANGE_PATHS = new Set([
  "docs/release/v7_0_npm_pack_dry_run_review.md",
  "scripts/verify_v7_0_npm_pack_dry_run_review.mjs"
]);

const REQUIRED_STATUS_PHRASES = [
  "npm pack dry-run review",
  "no tag created by this PR",
  "no GitHub Release published by this PR",
  "no package published by this PR",
  "no package version changed by this PR",
  "npm publish still requires explicit approval"
];

const REQUIRED_PACKAGE_TARGET_PHRASES = [
  "package path: `packages/guard`",
  "package name: `@veeduzyl/mindforge-guard`",
  "package version: `7.0.0`",
  "package license: `Apache-2.0`"
];

const REQUIRED_COMMANDS = ["`cd packages/guard`", "`npm pack --dry-run`"];

const REQUIRED_INCLUDED_CONTENT = ["`package.json`", "`README.md`", "`EDITIONS.md`", "`LICENSE`", "`bin/`", "`src/`"];

const REQUIRED_EXCLUDED_CONTENT = [
  "repo root `README.md`",
  "`docs/`",
  "`schemas/`",
  "`fixtures/`",
  "`examples/`",
  "`apps/`",
  "`.github/`",
  "env files",
  "logs",
  "generated tgz artifacts"
];

const REQUIRED_BOUNDARY_TERMS = [
  "recommendation-only",
  "non-executing",
  "non-control-plane",
  "deterministic",
  "human-review-oriented",
  "no extra runtime authority"
];

const FORBIDDEN_POSITIVE_CLAIMS = [
  "approval granted",
  "approves changes",
  "blocking enforcement",
  "blocks unsafe changes",
  "safe to merge",
  "safe-to-merge",
  "safe to deploy",
  "safe-to-deploy",
  "certifies compliance",
  "compliance certified",
  "legal compliance guaranteed",
  "maturity certified",
  "runtime control plane",
  "policy engine",
  "GitHub Action launched",
  "Marketplace available",
  "pricing changed",
  "entitlement changed"
];

const FORBIDDEN_PREFIX_PATHS = [
  "README.md",
  "apps/license-hub/",
  "packages/",
  "schemas/",
  "fixtures/",
  "examples/",
  ".github/workflows/",
  "mindforge.run/"
];

const FORBIDDEN_EXACT_PATHS = new Set([
  "README.md",
  "action.yml",
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock"
]);

const IGNORED_UNTRACKED_PATTERNS = [
  /^\.git\//i,
  /^node_modules\//i,
  /^\.mindforge\//i,
  /(^|\/)\.mindforge\//i,
  /^license-hub-dev\.log$/i,
  /^packages\/[^/]+\/generated\//i,
  /^apps\/license-hub\/\.env($|\.)/i,
  /^apps\/license-hub\/\.next\//i,
  /^apps\/license-hub\/.*\.tsbuildinfo$/i
];

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractSection(text, headingLevel, heading) {
  const headingMarker = "#".repeat(headingLevel);
  const nextHeadingMarker = headingLevel === 2 ? "##" : "###";
  const pattern = new RegExp(
    `${escapeRegExp(headingMarker)}\\s+${escapeRegExp(heading)}\\r?\\n([\\s\\S]*?)(?=\\r?\\n${escapeRegExp(nextHeadingMarker)}\\s+|$)`,
    "i"
  );
  const match = text.match(pattern);
  return match ? match[1] : "";
}

function resolveGitDir(repoRoot) {
  const dotGitPath = path.join(repoRoot, ".git");
  const stat = fs.statSync(dotGitPath);

  if (stat.isDirectory()) {
    return dotGitPath;
  }

  const pointerText = readText(dotGitPath).trim();
  const match = pointerText.match(/^gitdir:\s*(.+)$/i);
  if (!match) {
    fail(".git pointer file must contain a gitdir reference");
  }

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
      mtimeNanoseconds: buffer.readUInt32BE(offset + 12)
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
  return IGNORED_UNTRACKED_PATTERNS.some((pattern) => pattern.test(relativePath));
}

function collectChangedWorkingTreePaths(repoRoot) {
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
    expect(ALLOWED_CHANGE_PATHS.has(relativePath), `unexpected changed path outside allowed set: ${relativePath}`);
    expect(!FORBIDDEN_EXACT_PATHS.has(relativePath), `forbidden exact path changed: ${relativePath}`);

    for (const prefix of FORBIDDEN_PREFIX_PATHS) {
      expect(!relativePath.startsWith(prefix), `forbidden path prefix changed: ${relativePath}`);
    }

    expect(!/\.tgz$/i.test(relativePath), `tgz artifact must not be committed or left in repo: ${relativePath}`);
    expect(!/demo/i.test(relativePath), `public demo path changed: ${relativePath}`);
    expect(!/publish/i.test(relativePath), `publish artifact path changed: ${relativePath}`);
    expect(!/tag/i.test(relativePath), `tag-related path changed: ${relativePath}`);
  }
}

function assertForbiddenClaimsAbsent(docText, blockedSections) {
  let outsideBlockedSections = docText;
  for (const section of blockedSections) {
    outsideBlockedSections = outsideBlockedSections.replace(section, "");
  }

  const lowerOutside = outsideBlockedSections.toLowerCase();

  for (const claim of FORBIDDEN_POSITIVE_CLAIMS) {
    expect(!lowerOutside.includes(claim.toLowerCase()), `forbidden positive claim present outside boundary context: ${claim}`);
  }
}

function assertDoc(repoRoot) {
  const docPath = path.join(repoRoot, REQUIRED_DOC_PATH);
  expect(fs.existsSync(docPath), `${REQUIRED_DOC_PATH} must exist`);

  const docText = readText(docPath);

  for (const phrase of REQUIRED_STATUS_PHRASES) {
    expect(docText.includes(phrase), `required status phrase missing: ${phrase}`);
  }

  for (const phrase of REQUIRED_PACKAGE_TARGET_PHRASES) {
    expect(docText.includes(phrase), `required package target phrase missing: ${phrase}`);
  }

  for (const command of REQUIRED_COMMANDS) {
    expect(docText.includes(command), `required dry-run command missing: ${command}`);
  }

  for (const item of REQUIRED_INCLUDED_CONTENT) {
    expect(docText.includes(item), `required included content item missing: ${item}`);
  }

  for (const item of REQUIRED_EXCLUDED_CONTENT) {
    expect(docText.includes(item), `required excluded content item missing: ${item}`);
  }

  for (const term of REQUIRED_BOUNDARY_TERMS) {
    expect(docText.includes(term), `required boundary term missing: ${term}`);
  }

  const notIncludedSection = extractSection(docText, 2, "Not Included");
  const boundarySection = extractSection(docText, 2, "Boundary");

  expect(notIncludedSection.length >= 1, "Not Included section must exist");
  expect(boundarySection.length >= 1, "Boundary section must exist");

  assertForbiddenClaimsAbsent(docText, [notIncludedSection, boundarySection]);
}

function assertPackageMetadata(repoRoot) {
  const packagePath = path.join(repoRoot, PACKAGE_MANIFEST_PATH);
  expect(fs.existsSync(packagePath), `${PACKAGE_MANIFEST_PATH} must exist`);
  const manifest = JSON.parse(readText(packagePath));
  expect(manifest.name === "@veeduzyl/mindforge-guard", "package name must remain @veeduzyl/mindforge-guard");
  expect(manifest.version === "7.0.0", "package version must remain 7.0.0");
  expect(manifest.license === "Apache-2.0", "package license must remain Apache-2.0");
}

function assertDeniedExitCodeStillPresent(repoRoot) {
  const permitGatePath = path.join(repoRoot, PERMIT_GATE_PATH);
  expect(fs.existsSync(permitGatePath), `${PERMIT_GATE_PATH} must exist`);
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

  assertDoc(repoRoot);
  assertPackageMetadata(repoRoot);
  assertDeniedExitCodeStillPresent(repoRoot);
  assertAllowedChangedPaths(collectChangedWorkingTreePaths(repoRoot));

  console.log("PASS: v7.0 npm pack dry-run review verified.");
}

main();
