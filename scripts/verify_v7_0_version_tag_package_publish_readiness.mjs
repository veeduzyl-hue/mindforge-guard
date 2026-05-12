import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_DOC_PATH = "docs/release/v7_0_version_tag_package_publish_readiness.md";

const ALLOWED_CHANGE_PATHS = new Set([
  "docs/release/v7_0_version_tag_package_publish_readiness.md",
  "scripts/verify_v7_0_version_tag_package_publish_readiness.mjs"
]);

const REQUIRED_STATUS_PHRASES = [
  "Wave 3 readiness-only",
  "no tag created by this PR",
  "no package published by this PR",
  "no package version changed by this PR",
  "current commercial baseline remains v6.13.1 unless separately approved",
  "Wave 4 License Hub / mindforge.run copy candidate requires explicit approval"
];

const REQUIRED_COMPLETION_REFERENCES = [
  "Wave 1 README/docs candidate complete",
  "Wave 1-S report edition alignment complete",
  "Wave 2 release notes / GitHub release candidate complete"
];

const REQUIRED_VERIFIER_COMMANDS = [
  "node scripts/verify_v7_0_release_notes_candidate.mjs",
  "node scripts/verify_v7_0_readme_docs_candidate.mjs",
  "node scripts/verify_v7_0_report_edition_alignment.mjs",
  "node scripts/verify_v7_0_single_agent_governance_report_preview.mjs",
  "node scripts/verify_v7_0_single_agent_governance_report_cli_preview.mjs",
  "node scripts/verify_v7_0_single_agent_governance_report_final_acceptance.mjs",
  "node scripts/verify_v7_0_single_agent_governance_pack_preview.mjs",
  "node scripts/verify_v7_0_example_evidence_pack.mjs",
  "node scripts/verify_v7_0_pack_parser_preview.mjs",
  "node scripts/verify_v7_0_cli_pack_validate_preview.mjs",
  "node scripts/verify_v7_0_report_single_agent_preview.mjs",
  "node scripts/verify_v7_0_e2e_acceptance.mjs",
  "node scripts/verify_v7_0_commercial_release_gate_review.mjs"
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

const FORBIDDEN_PATH_PREFIXES = [
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
  /^.*\.tgz$/i,
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

    for (const prefix of FORBIDDEN_PATH_PREFIXES) {
      expect(!relativePath.startsWith(prefix), `forbidden path prefix changed: ${relativePath}`);
    }
  }
}

function assertForbiddenClaimsAbsent(docText, blockedSections) {
  let outsideBlockedSections = docText;
  for (const section of blockedSections) {
    outsideBlockedSections = outsideBlockedSections.replace(section, "");
  }

  const lowerOutsideBlockedSections = outsideBlockedSections.toLowerCase();

  for (const claim of FORBIDDEN_POSITIVE_CLAIMS) {
    expect(
      !lowerOutsideBlockedSections.includes(claim.toLowerCase()),
      `forbidden positive claim present outside not-claimed boundary: ${claim}`
    );
  }
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");
  const docPath = path.join(repoRoot, REQUIRED_DOC_PATH);

  expect(fs.existsSync(docPath), `${REQUIRED_DOC_PATH} must exist`);

  const docText = readText(docPath);

  for (const phrase of REQUIRED_STATUS_PHRASES) {
    expect(docText.includes(phrase), `required Wave 3 readiness phrase missing: ${phrase}`);
  }

  for (const phrase of REQUIRED_COMPLETION_REFERENCES) {
    expect(docText.includes(phrase), `required completion reference missing: ${phrase}`);
  }

  expect(docText.includes("candidate tag name under consideration: `v7.0.0`"), "candidate tag language must exist");
  expect(docText.includes("the candidate tag is under consideration only and has not been created"), "candidate tag language must not imply tag creation");
  expect(docText.includes("tag creation requires explicit approval"), "tag creation approval gate must exist");
  expect(docText.includes("release publication requires explicit approval"), "release publication approval gate must exist");
  expect(docText.includes("package publication requires explicit approval"), "package publication approval gate must exist");

  for (const command of REQUIRED_VERIFIER_COMMANDS) {
    expect(docText.includes(command), `required v7.0 verifier command missing: ${command}`);
  }

  for (const term of REQUIRED_BOUNDARY_TERMS) {
    expect(docText.includes(term), `required boundary term missing: ${term}`);
  }

  const notClaimedSection = extractSection(docText, 2, "Not Included / Not Claimed in v7.0");
  const boundariesSection = extractSection(docText, 2, "Boundaries");

  expect(notClaimedSection.length >= 1, "Not Included / Not Claimed in v7.0 section must exist");
  expect(boundariesSection.length >= 1, "Boundaries section must exist");

  assertForbiddenClaimsAbsent(docText, [notClaimedSection, boundariesSection]);
  assertAllowedChangedPaths(collectChangedWorkingTreePaths(repoRoot));

  console.log("PASS: v7.0 version/tag/package publish readiness verified.");
}

main();
