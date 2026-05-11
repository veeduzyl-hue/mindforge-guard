import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REQUIRED_DOCS = [
  "README.md",
  "docs/product/current/v7_0_first_report.md",
  "docs/productization/v7_0_public_commercial_surface_candidate.md"
];

const REQUIRED_PHRASES = [
  "v7.0",
  "internal E2E acceptance",
  "commercial release gate",
  "preview",
  "Evidence Pack",
  "Pack Validate",
  "Report Single-Agent",
  "Human Review",
  "Authority / Permission Boundary",
  "Execution / Behavior Evidence",
  "Risk / Drift / Maturity Signals",
  "guard pack validate --pack <path> --preview --json",
  "guard report single-agent --pack <path> --preview --json"
];

const POSITIVE_FORBIDDEN_CLAIMS = [
  "certifies compliance",
  "compliance certified",
  "legal compliance guaranteed",
  "maturity certified",
  "approval granted",
  "approves changes",
  "blocking enforcement",
  "blocks unsafe changes",
  "safe to merge",
  "safe-to-merge",
  "safe to deploy",
  "safe-to-deploy",
  "runtime control plane",
  "policy engine",
  "GitHub Action launched",
  "Marketplace available",
  "pricing changed",
  "entitlement changed"
];

const FORBIDDEN_SURFACE_PREFIXES = [
  "apps/license-hub/",
  ".github/workflows/",
  "mindforge.run/",
  "examples/",
  "fixtures/",
  "schemas/",
  "packages/",
  "apps/"
];

const FORBIDDEN_EXACT_PATHS = new Set([
  "action.yml",
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock"
]);

const ALLOWED_CHANGE_PATHS = new Set([
  "README.md",
  "docs/product/current/v7_0_first_report.md",
  "scripts/verify_v7_0_readme_docs_candidate.mjs"
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

function isIgnoredUntrackedPath(relativePath) {
  return IGNORED_UNTRACKED_PATTERNS.some((pattern) => pattern.test(relativePath));
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

    const fullPath = path.join(repoRoot, relativePath);

    if (entry.isDirectory()) {
      walkRepoFiles(repoRoot, relativePath, results);
      continue;
    }

    results.push({ relativePath, fullPath });
  }

  return results;
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
    if (indexEntries.has(relativePath) || isIgnoredUntrackedPath(relativePath)) continue;
    changedPaths.add(relativePath);
  }

  return [...changedPaths].sort();
}

function assertAllowedChangedPaths(changedPaths) {
  for (const relativePath of changedPaths) {
    expect(ALLOWED_CHANGE_PATHS.has(relativePath), `unexpected changed path outside allowed set: ${relativePath}`);
    expect(!FORBIDDEN_EXACT_PATHS.has(relativePath), `forbidden exact path changed: ${relativePath}`);
    for (const prefix of FORBIDDEN_SURFACE_PREFIXES) {
      expect(!relativePath.startsWith(prefix), `forbidden surface changed: ${relativePath}`);
    }
    expect(!/pricing/i.test(relativePath), `pricing-related path changed: ${relativePath}`);
    expect(!/release[-_ ]?notes/i.test(relativePath), `release-notes-related path changed: ${relativePath}`);
    expect(!/demo/i.test(relativePath) || relativePath === "README.md", `public demo path changed: ${relativePath}`);
    expect(!/license/i.test(relativePath) || relativePath === "README.md", `license/entitlement path changed: ${relativePath}`);
  }
}

function extractSection(text, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`##\\s+${escapedHeading}\\r?\\n([\\s\\S]*?)(?=\\r?\\n##\\s+|$)`, "i");
  const match = text.match(pattern);
  return match ? match[1] : "";
}

function assertRequiredContent(readmeText, docText) {
  const combinedText = `${readmeText}\n${docText}`;

  for (const phrase of REQUIRED_PHRASES) {
    expect(combinedText.includes(phrase), `README/docs candidate must include required phrase: ${phrase}`);
  }

  expect(
    combinedText.includes("Current commercial release baseline remains `v6.13.1` unless separately approved.") ||
      combinedText.includes("MindForge Guard v6.13.1 remains the current commercial baseline until separately approved otherwise."),
    "README/docs candidate must state the current v6.13.1 commercial baseline"
  );

  expect(
    combinedText.includes("This README section is a candidate entry point, not a public launch.") &&
      combinedText.includes("This PR is a README/docs candidate, not a public launch."),
    "README/docs candidate must clearly state that this PR is not a public launch"
  );

  expect(
    combinedText.includes("examples/single-agent-governance-pack/hr-self-service-agent/"),
    "README/docs candidate must reference the existing HR self-service example evidence pack path"
  );
}

function assertNotClaimedBoundary(docText) {
  const notClaimedSection = extractSection(docText, "Not Included / Not Claimed in v7.0");
  expect(notClaimedSection.length >= 1, "README/docs candidate must include a Not Included / Not Claimed in v7.0 section");

  const requiredNotClaimedTerms = [
    "compliance certification",
    "legal compliance claim",
    "maturity certification",
    "approval",
    "blocking",
    "safe-to-merge",
    "safe-to-deploy",
    "runtime control plane",
    "policy engine",
    "GitHub Action launched",
    "Marketplace available",
    "entitlement changed",
    "pricing changed"
  ];

  for (const term of requiredNotClaimedTerms) {
    expect(notClaimedSection.includes(term), `Not Included / Not Claimed section must include: ${term}`);
  }
}

function assertNoPositiveForbiddenClaims(readmeText, docText) {
  const blockedSection = extractSection(docText, "Not Included / Not Claimed in v7.0");
  const combinedText = `${readmeText}\n${docText}`;
  const outsideBlockedSection = combinedText.replace(blockedSection, "");
  const lowerOutsideBlockedSection = outsideBlockedSection.toLowerCase();

  for (const claim of POSITIVE_FORBIDDEN_CLAIMS) {
    expect(!lowerOutsideBlockedSection.includes(claim.toLowerCase()), `forbidden positive claim present outside not-claimed section: ${claim}`);
  }
}

async function assertVerifierStillPasses(repoRoot, verifierName) {
  const verifierPath = path.join(repoRoot, "scripts", verifierName);
  const originalConsoleLog = console.log;

  try {
    console.log = () => {};
    await import(`${pathToFileURL(verifierPath).href}?v7_0_readme_docs_candidate=1`);
  } catch (error) {
    fail(`${verifierName} must still pass (${error.message})`);
  } finally {
    console.log = originalConsoleLog;
  }
}

function assertDeniedExitCodeStillPresent(repoRoot) {
  const permitGatePath = path.join(repoRoot, "packages/guard/src/runtime/governance/permit/permitGate.mjs");
  expect(fs.existsSync(permitGatePath), "permitGate.mjs must still exist");
  const permitGateText = readText(permitGatePath);
  expect(
    permitGateText.includes("export const PERMIT_GATE_DENIED_EXIT_CODE = 25;"),
    "PERMIT_GATE_DENIED_EXIT_CODE must still exist and remain 25"
  );
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");
  const readmePath = path.join(repoRoot, "README.md");
  const docPath = path.join(repoRoot, "docs/product/current/v7_0_first_report.md");

  const verifierNames = fs
    .readdirSync(path.join(repoRoot, "scripts"))
    .filter((name) => /^verify_v7_0_.*\.mjs$/i.test(name))
    .filter((name) => name !== path.basename(__filename))
    .filter((name) => name !== "verify_v7_0_public_commercial_surface_candidate.mjs")
    .sort();

  for (const verifierName of verifierNames) {
    await assertVerifierStillPasses(repoRoot, verifierName);
  }

  for (const relativePath of REQUIRED_DOCS) {
    expect(fs.existsSync(path.join(repoRoot, relativePath)), `${relativePath} must exist`);
  }

  const readmeText = readText(readmePath);
  const docText = readText(docPath);

  assertRequiredContent(readmeText, docText);
  assertNotClaimedBoundary(docText);
  assertNoPositiveForbiddenClaims(readmeText, docText);

  const changedPaths = collectChangedWorkingTreePaths(repoRoot);
  assertAllowedChangedPaths(changedPaths);
  assertDeniedExitCodeStillPresent(repoRoot);

  console.log("PASS: v7.0 README/docs candidate verified.");
}

await main();
