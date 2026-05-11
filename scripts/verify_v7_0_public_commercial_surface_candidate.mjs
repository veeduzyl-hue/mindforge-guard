import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const EXISTING_VERIFIERS = [
  "verify_v7_0_single_agent_governance_report_preview.mjs",
  "verify_v7_0_single_agent_governance_report_cli_preview.mjs",
  "verify_v7_0_single_agent_governance_report_final_acceptance.mjs",
  "verify_v7_0_single_agent_governance_pack_preview.mjs",
  "verify_v7_0_example_evidence_pack.mjs",
  "verify_v7_0_pack_parser_preview.mjs",
  "verify_v7_0_cli_pack_validate_preview.mjs",
  "verify_v7_0_report_single_agent_preview.mjs",
  "verify_v7_0_e2e_acceptance.mjs",
  "verify_v7_0_commercial_release_gate_review.mjs"
];

const EXPECTED_BASELINE =
  "MindForge Guard v6.13.1 remains the current commercial baseline until separately changed.";
const EXPECTED_STATUS =
  "v7.0 is ready for public/commercial surface candidate preparation, but this PR does not launch it.";
const EXPECTED_DECISION = "prepare_readme_docs_candidate";

const FORBIDDEN_SURFACE_PATTERNS = [
  /^README(\..*)?$/i,
  /^docs\/product\/current\//i,
  /^apps\/license-hub\//i,
  /^\.github\/workflows\//i,
  /^action\.yml$/i,
  /pricing/i,
  /release[-_ ]?notes/i,
  /^public[-_/ ].*demo/i,
  /mindforge\.run/i
];

const BLOCKED_CLAIMS = [
  "compliance certified",
  "legally compliant",
  "maturity certified",
  "approved for deployment",
  "safe to merge",
  "safe to deploy",
  "automatic blocking",
  "required ci gate",
  "github action launched",
  "marketplace available",
  "enterprise control plane",
  "orchestrator",
  "autonomous enforcement",
  "production runtime monitoring",
  "entitlement changed",
  "pricing changed"
];

const IGNORED_LOCAL_SURFACE_PATHS = [
  /^apps\/license-hub\/\.env($|\.)/i,
  /^apps\/license-hub\/.*\.tsbuildinfo$/i
];

const IGNORED_GENERATED_DIRECTORIES = new Set([
  ".next",
  "node_modules",
  "dist",
  "build",
  "coverage"
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

async function assertVerifierStillPasses(repoRoot, verifierName) {
  const verifierPath = path.join(repoRoot, "scripts", verifierName);
  const originalConsoleLog = console.log;

  try {
    console.log = () => {};
    await import(`${pathToFileURL(verifierPath).href}?v7_0_public_commercial_surface_candidate=1`);
  } catch (error) {
    fail(`${verifierName} must still pass (${error.message})`);
  } finally {
    console.log = originalConsoleLog;
  }
}

function getSection(text, heading) {
  const normalizedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sectionPattern = new RegExp(`##\\s+${normalizedHeading}\\r?\\n([\\s\\S]*?)(?=\\r?\\n##\\s+|$)`, "i");
  const match = text.match(sectionPattern);
  return match ? match[1] : "";
}

function assertBlockedClaimsSection(blockedSection) {
  expect(blockedSection.length >= 1, "blocked claims section must exist");

  const lowerBlockedSection = blockedSection.toLowerCase();
  for (const claim of BLOCKED_CLAIMS) {
    expect(lowerBlockedSection.includes(claim), `blocked claims section must include: ${claim}`);
  }
}

function assertNoPositiveForbiddenClaims(fullText, blockedSection) {
  const lowerFullText = fullText.toLowerCase();
  const lowerBlockedSection = blockedSection.toLowerCase();
  const docOutsideBlockedSection = lowerFullText.replace(lowerBlockedSection, "");

  const positiveOnlyClaims = [
    "compliance certified",
    "legally compliant",
    "maturity certified",
    "approved for deployment",
    "safe to merge",
    "safe to deploy",
    "automatic blocking",
    "required ci gate",
    "github action launched",
    "marketplace available",
    "enterprise control plane",
    "autonomous enforcement",
    "production runtime monitoring"
  ];

  for (const claim of positiveOnlyClaims) {
    expect(!docOutsideBlockedSection.includes(claim), `forbidden positive claim must not appear outside blocked claims section: ${claim}`);
  }
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
      oid: buffer.subarray(offset + 40, offset + 60).toString("hex"),
      mtimeSeconds: buffer.readUInt32BE(offset + 8),
      mtimeNanoseconds: buffer.readUInt32BE(offset + 12),
      size: buffer.readUInt32BE(offset + 36)
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

function matchesForbiddenSurface(relativePath) {
  return FORBIDDEN_SURFACE_PATTERNS.some((pattern) => pattern.test(relativePath));
}

function isIgnoredLocalSurfacePath(relativePath) {
  return IGNORED_LOCAL_SURFACE_PATHS.some((pattern) => pattern.test(relativePath));
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

    const fullPath = path.join(repoRoot, relativePath);

    if (entry.isDirectory()) {
      walkRepoFiles(repoRoot, relativePath, results);
      continue;
    }

    results.push({ relativePath, fullPath });
  }

  return results;
}

function walkRelativePath(repoRoot, relativePath, results = []) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) return results;

  const stat = fs.statSync(fullPath);
  if (stat.isFile()) {
    results.push({ relativePath: relativePath.replace(/\\/g, "/"), fullPath });
    return results;
  }

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  for (const entry of entries) {
    const childRelativePath = `${relativePath}/${entry.name}`.replace(/\\/g, "/");
    if (entry.isDirectory()) {
      if (IGNORED_GENERATED_DIRECTORIES.has(entry.name)) continue;
      walkRelativePath(repoRoot, childRelativePath, results);
      continue;
    }
    results.push({ relativePath: childRelativePath, fullPath: path.join(repoRoot, childRelativePath) });
  }

  return results;
}

function collectCandidateSurfaceFiles(repoRoot) {
  const results = [];
  const rootEntries = fs.readdirSync(repoRoot, { withFileTypes: true });

  for (const entry of rootEntries) {
    const rootName = entry.name;
    if (/^README(\..*)?$/i.test(rootName) || /^action\.yml$/i.test(rootName)) {
      walkRelativePath(repoRoot, rootName, results);
      continue;
    }

    if (/pricing/i.test(rootName) || /release[-_ ]?notes/i.test(rootName) || /mindforge\.run/i.test(rootName) || /public[-_ ]?demo/i.test(rootName)) {
      walkRelativePath(repoRoot, rootName, results);
    }
  }

  for (const explicitRoot of [
    "docs/product/current",
    "apps/license-hub",
    ".github/workflows"
  ]) {
    walkRelativePath(repoRoot, explicitRoot, results);
  }

  return results;
}

function assertNoRealSurfaceChanges(repoRoot) {
  const indexEntries = parseGitIndex(repoRoot);

  for (const [relativePath, indexEntry] of indexEntries.entries()) {
    if (!matchesForbiddenSurface(relativePath)) continue;

    const fullPath = path.join(repoRoot, relativePath);
    expect(fs.existsSync(fullPath), `tracked forbidden surface file must still exist: ${relativePath}`);
    const fileStat = fs.statSync(fullPath);
    const workingTreeMtimeSeconds = Math.floor(fileStat.mtimeMs / 1000);
    const workingTreeMtimeNanoseconds = Math.floor((fileStat.mtimeMs % 1000) * 1_000_000);

    expect(
      fileStat.size === indexEntry.size &&
        workingTreeMtimeSeconds === indexEntry.mtimeSeconds &&
        Math.abs(workingTreeMtimeNanoseconds - indexEntry.mtimeNanoseconds) < 1_000_000,
      `forbidden public/commercial surface changed in branch: ${relativePath}`
    );
  }

  const candidateSurfaceFiles = collectCandidateSurfaceFiles(repoRoot);
  for (const { relativePath } of candidateSurfaceFiles) {
    if (!matchesForbiddenSurface(relativePath) || isIgnoredLocalSurfacePath(relativePath)) continue;
    if (indexEntries.has(relativePath)) continue;

    fail(`new forbidden public/commercial surface file present in branch: ${relativePath}`);
  }

  for (const relativePath of [
    ".github/workflows",
    "action.yml"
  ]) {
    const fullPath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(fullPath)) continue;

    if (fs.statSync(fullPath).isDirectory()) {
      const nestedFiles = walkRepoFiles(repoRoot, relativePath);
      if (nestedFiles.length >= 1) {
        fail(`forbidden public/commercial surface changed in branch: ${relativePath}`);
      }
      continue;
    }

    for (const pattern of FORBIDDEN_SURFACE_PATTERNS) {
      if (pattern.test(relativePath)) {
        fail(`forbidden public/commercial surface changed in branch: ${relativePath}`);
      }
    }
  }
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");
  const candidatePath = path.join(repoRoot, "docs/productization/v7_0_public_commercial_surface_candidate.md");

  for (const verifierName of EXISTING_VERIFIERS) {
    await assertVerifierStillPasses(repoRoot, verifierName);
  }

  expect(fs.existsSync(candidatePath), "docs/productization/v7_0_public_commercial_surface_candidate.md must exist");
  const candidateText = readText(candidatePath);

  expect(candidateText.includes(EXPECTED_BASELINE), "candidate document must contain the exact current commercial baseline phrase");
  expect(candidateText.includes(EXPECTED_STATUS), "candidate document must state that v7.0 is not launched by this PR");
  expect(
    candidateText.includes("Recommended:\r\n- prepare_readme_docs_candidate") ||
      candidateText.includes("Recommended:\n- prepare_readme_docs_candidate"),
    `candidate document must recommend ${EXPECTED_DECISION}`
  );

  const blockedClaimsSection = getSection(candidateText, "7. Candidate Public Claims Blocked");
  assertBlockedClaimsSection(blockedClaimsSection);
  assertNoPositiveForbiddenClaims(candidateText, blockedClaimsSection);

  assertNoRealSurfaceChanges(repoRoot);

  console.log("PASS: v7.0 public/commercial surface candidate verified.");
}

await main();
