import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_DOC_PATH = "docs/product/current/v7_0_first_report.md";

const ALLOWED_CHANGE_PATHS = new Set([
  "docs/product/current/v7_0_first_report.md",
  "scripts/verify_v7_0_report_edition_alignment.mjs"
]);

const GLOBAL_BOUNDARY_TERMS = [
  "recommendation-only",
  "non-executing",
  "non-control-plane",
  "human-review-oriented",
  "does not approve, block, deploy, certify, or control execution"
];

const FORBIDDEN_POSITIVE_CLAIMS = [
  "approval granted",
  "approves changes",
  "blocking enforcement",
  "blocks unsafe changes",
  "safe-to-merge",
  "safe-to-deploy",
  "certifies compliance",
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
  "apps/license-hub/",
  ".github/workflows/",
  "packages/",
  "schemas/",
  "fixtures/",
  "examples/",
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

    expect(!/pricing/i.test(relativePath), `pricing-related path changed: ${relativePath}`);
    expect(!/checkout/i.test(relativePath), `checkout-related path changed: ${relativePath}`);
    expect(!/paddle/i.test(relativePath), `Paddle-related path changed: ${relativePath}`);
    expect(!/license/i.test(relativePath), `license-related path changed: ${relativePath}`);
    expect(!/release[-_ ]?notes/i.test(relativePath), `release-notes-related path changed: ${relativePath}`);
    expect(!/demo/i.test(relativePath), `public demo path changed: ${relativePath}`);
  }
}

function assertForbiddenClaimsAbsent(docText) {
  const blockedSection = extractSection(docText, 2, "Not Included / Not Claimed in v7.0");
  expect(blockedSection.length >= 1, "Not Included / Not Claimed in v7.0 section must exist");

  const outsideBlockedSection = docText.replace(blockedSection, "");
  const lowerOutside = outsideBlockedSection.toLowerCase();

  for (const claim of FORBIDDEN_POSITIVE_CLAIMS) {
    expect(!lowerOutside.includes(claim.toLowerCase()), `forbidden positive claim present outside not-claimed boundary: ${claim}`);
  }
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");
  const docPath = path.join(repoRoot, REQUIRED_DOC_PATH);

  expect(fs.existsSync(docPath), `${REQUIRED_DOC_PATH} must exist`);

  const docText = readText(docPath);
  const editionSection = extractSection(docText, 2, "Report Experience By Edition");
  expect(editionSection.length >= 1, "Report Experience By Edition section must exist");

  const communitySection = extractSection(editionSection, 3, "Community");
  const proSection = extractSection(editionSection, 3, "Pro");
  const proPlusSection = extractSection(editionSection, 3, "Pro+");
  const enterpriseSection = extractSection(editionSection, 3, "Enterprise");

  expect(communitySection.length >= 1, "Community section must exist");
  expect(proSection.length >= 1, "Pro section must exist");
  expect(proPlusSection.length >= 1, "Pro+ section must exist");
  expect(enterpriseSection.length >= 1, "Enterprise section must exist");

  const requiredCommunityTerms = [
    "current-state governance report preview",
    "Evidence Pack",
    "Authority / Permission Boundary",
    "Execution / Behavior Evidence",
    "Missing Evidence / Limitations",
    "Human Review Next Step"
  ];

  for (const term of requiredCommunityTerms) {
    expect(communitySection.includes(term), `Community section must include: ${term}`);
  }

  expect(
    communitySection.includes("It does not promise timeline, compare, or correlate views."),
    "Community section must state that it does not promise timeline / compare / correlate views"
  );

  const communityWithoutNegativeLine = communitySection.replace(
    "It does not promise timeline, compare, or correlate views.",
    ""
  );
  expect(!/\btimeline\b/i.test(communityWithoutNegativeLine), "Community must not positively claim timeline");
  expect(!/\bcompare\b/i.test(communityWithoutNegativeLine), "Community must not positively claim compare");
  expect(!/\bcorrelate\b/i.test(communityWithoutNegativeLine), "Community must not positively claim correlate");

  expect(proSection.includes("everything in Community"), "Pro section must include everything in Community");
  expect(
    proSection.includes("trend / timeline-oriented reading where released commands support it"),
    "Pro section must include trend / timeline-oriented reading where released commands support it"
  );
  expect(
    proSection.includes("It does not promise deep correlation by default."),
    "Pro section must state that deep correlation is not promised by default"
  );

  const proWithoutNegativeLine = proSection.replace("It does not promise deep correlation by default.", "");
  expect(!/deep correlation/i.test(proWithoutNegativeLine), "Pro must not positively claim deep correlation as default");

  expect(proPlusSection.includes("everything in Pro"), "Pro+ section must include everything in Pro");
  expect(
    proPlusSection.includes("compare / correlate / deeper signals where released commands support them"),
    "Pro+ section must include compare / correlate / deeper signals where released commands support them"
  );
  expect(
    proPlusSection.includes("not an approval, blocking, enforcement, or deploy go/no-go output"),
    "Pro+ section must not claim approval / blocking / enforcement / deploy go/no-go authority"
  );

  const lowerProPlus = proPlusSection.toLowerCase();
  for (const forbiddenPhrase of ["approval granted", "approves changes", "blocking enforcement", "safe-to-deploy"]) {
    expect(!lowerProPlus.includes(forbiddenPhrase), `Pro+ section must not contain: ${forbiddenPhrase}`);
  }

  expect(
    enterpriseSection.includes("same runtime entitlement as Pro+ in the current commercial boundary"),
    'Enterprise section must include "same runtime entitlement as Pro+"'
  );
  expect(
    enterpriseSection.includes("no extra runtime authority"),
    'Enterprise section must include "no extra runtime authority"'
  );
  expect(
    enterpriseSection.includes("not a control plane"),
    "Enterprise section must state that it is not a control plane"
  );

  for (const term of GLOBAL_BOUNDARY_TERMS) {
    expect(editionSection.includes(term), `global boundary term missing: ${term}`);
  }

  assertForbiddenClaimsAbsent(docText);
  assertAllowedChangedPaths(collectChangedWorkingTreePaths(repoRoot));

  console.log("PASS: v7.0 report edition alignment verified.");
}

main();
