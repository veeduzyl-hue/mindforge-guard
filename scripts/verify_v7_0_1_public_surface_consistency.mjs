import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_ROOT_README_PHRASES = [
  "**Deterministic governance evidence layer for single-agent AI workflows.**",
  "MindForge Guard helps teams make AI-assisted work reviewable before it becomes trusted.",
  "> Not an approval system. Not a blocker. Not a control plane.",
  "## Install",
  "npm install -g @veeduzyl/mindforge-guard@7.0.1",
  "guard --version",
  "guard --help",
  "authority boundaries",
  "execution evidence",
  "missing evidence",
  "risk/drift signals",
  "## Editions",
  "MindForge Guard editions differ by governance evidence depth, not runtime authority.",
  "Community | See current governance evidence for one local single-agent workflow",
  "Pro | Track governance signals over time for AI-assisted work",
  "Pro+ | Compare evidence states and uncover deeper governance signals",
  "Enterprise | Standardize procurement, rollout, and review packets around the same bounded runtime posture",
  "Commercial entitlement aligned with Pro+. No hosted control plane. No extra runtime authority.",
  "Editions do not add approval authority.",
  "Editions do not add blocking authority.",
  "## Demo Paths",
  "Use the current demos to understand how Guard's evidence layer appears in different review situations.",
  "Current product demos",
  "Recommended demo order:",
  "Demos are explanatory paths. They do not approve, block, deploy, certify, or control execution.",
  "## Common CLI Surface",
  "guard status",
  "guard validate-policy",
  "guard audit . --staged",
  "guard snapshot .",
  "guard action classify --text \"write file README.md\"",
  "guard drift status --format json",
  "guard drift timeline",
  "guard drift compare",
  "guard assoc correlate",
  "guard license verify --file downloaded-license.json",
  "guard license install --file downloaded-license.json",
  "guard license status",
  "guard license show",
  "guard license remove",
  "These commands remain local CLI surfaces. Guard produces review evidence and does not approve, block, deploy, certify, or control execution.",
];

const REQUIRED_PUBLIC_GUIDE_PHRASES = [
  "MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows.",
  "## Verify The CLI",
  "guard --version",
  "guard --help",
  "Confirm the packaged CLI entrypoint is available before validating the Evidence Pack.",
  "guard pack validate --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json",
  "guard report single-agent --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json",
  "Guard produces review evidence. The final human review decision remains outside Guard.",
];

const REQUIRED_SUPERSEDED_POINTER_PHRASES = [
  "This page has been superseded by the current public guide:",
  "[First Governance Report](./first-governance-report.md)",
];

const REQUIRED_LINK_PHRASES = [
  "docs/product/current/first-governance-report.md",
  "https://www.npmjs.com/package/@veeduzyl/mindforge-guard/v/7.0.1",
  "https://github.com/veeduzyl-hue/mindforge-guard/releases/tag/v7.0.1",
  "Deterministic governance evidence layer for single-agent AI workflows (CLI)",
];

const FORBIDDEN_PUBLIC_SURFACE_PHRASES = [
  "v7.0 First Report Candidate",
  "Not a public launch",
  "current commercial baseline remains v6.13.1",
  "current commercial release baseline remains",
  "v7_0_download_to_first_report_ux.md",
  "v7_0_license_hub_copy_candidate.md",
];

const ALLOWED_CHANGED_PATHS = new Set([
  "README.md",
  "packages/guard/package.json",
  "packages/guard/README.md",
  "docs/first-10-minutes.md",
  "docs/product/current/first-governance-report.md",
  "docs/product/current/v7_0_first_report.md",
  "apps/license-hub/app/page.tsx",
  "apps/license-hub/app/docs/page.tsx",
  "apps/license-hub/app/product/page.tsx",
  "scripts/verify_v7_0_1_public_surface_consistency.mjs",
  "docs/VERIFY.md",
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
    entries.set(entryPath, {
      size: buffer.readUInt32BE(offset + 36),
      mtimeSeconds: buffer.readUInt32BE(offset + 8),
      mtimeNanoseconds: buffer.readUInt32BE(offset + 12),
    });

    const pathLength = (flags & 0x0fff) === 0x0fff ? pathEnd - pathStart : flags & 0x0fff;
    const entryLength = 62 + pathLength + 1;
    offset = entryStart + entryLength;
    while ((offset - entryStart) % 8 !== 0) {
      offset += 1;
    }
  }

  return entries;
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

  return [...changedPaths].sort();
}

function assertContainsAll(text, phrases, label) {
  for (const phrase of phrases) {
    expect(text.includes(phrase), `${label} must include: ${phrase}`);
  }
}

function assertForbiddenClaimsAbsent(text) {
  const lower = text.toLowerCase();

  for (const phrase of FORBIDDEN_PUBLIC_SURFACE_PHRASES) {
    expect(!lower.includes(phrase.toLowerCase()), `forbidden public-surface phrase present: ${phrase}`);
  }
}

function assertNoApprovalOrBlockingClaims(text) {
  const checks = [
    { claim: "approval granted", message: "public surface must not claim approval granted" },
    { claim: "approves changes", message: "public surface must not claim approves changes" },
    { claim: "blocking enforcement", message: "public surface must not claim blocking enforcement" },
    { claim: "blocks unsafe changes", message: "public surface must not claim blocks unsafe changes" },
    { claim: "safe to deploy", message: "public surface must not claim safe to deploy" },
    { claim: "legal compliance guarantee", message: "public surface must not claim legal compliance guarantee" },
    { claim: "legal compliance guaranteed", message: "public surface must not claim legal compliance guarantee" },
    { claim: "compliance certification", message: "public surface must not claim compliance certification" },
    { claim: "maturity certification", message: "public surface must not claim maturity certification" },
  ];

  for (const { claim, message } of checks) {
    const escaped = claim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "[- ]");
    const positivePattern = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, "i");
    const negatedPattern = new RegExp(`(^|[^a-z])(no|not|does not|do not)\\s+([a-z]+\\s+){0,6}${escaped}([^a-z]|$)`, "i");

    if (positivePattern.test(text) && !negatedPattern.test(text)) {
      fail(message);
    }
  }
}

function assertAllowedChangedPaths(repoRoot) {
  for (const relativePath of collectChangedPaths(repoRoot)) {
    expect(ALLOWED_CHANGED_PATHS.has(relativePath), `unexpected changed path outside public surface consistency scope: ${relativePath}`);
  }
}

function assertDenyExitCodeStillPresent(repoRoot) {
  const permitGateText = readText(path.join(repoRoot, "packages/guard/src/runtime/governance/permit/permitGate.mjs"));
  expect(
    permitGateText.includes("export const PERMIT_GATE_DENIED_EXIT_CODE = 25;"),
    "deny exit code 25 must remain unchanged",
  );
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  assertAllowedChangedPaths(repoRoot);

  const rootReadme = readText(path.join(repoRoot, "README.md"));
  const packageJson = readText(path.join(repoRoot, "packages/guard/package.json"));
  const packageReadme = readText(path.join(repoRoot, "packages/guard/README.md"));
  const firstGuide = readText(path.join(repoRoot, "docs/product/current/first-governance-report.md"));
  const supersededGuide = readText(path.join(repoRoot, "docs/product/current/v7_0_first_report.md"));
  const licenseHubHome = readText(path.join(repoRoot, "apps/license-hub/app/page.tsx"));
  const licenseHubDocs = readText(path.join(repoRoot, "apps/license-hub/app/docs/page.tsx"));
  const licenseHubProduct = readText(path.join(repoRoot, "apps/license-hub/app/product/page.tsx"));

  assertContainsAll(rootReadme, REQUIRED_ROOT_README_PHRASES, "README.md");
  assertContainsAll(packageReadme, ["guard --version", "guard --help"], "packages/guard/README.md");
  assertContainsAll(firstGuide, REQUIRED_PUBLIC_GUIDE_PHRASES, "first-governance-report.md");
  assertContainsAll(supersededGuide, REQUIRED_SUPERSEDED_POINTER_PHRASES, "v7_0_first_report.md");
  assertContainsAll(
    `${rootReadme}\n${packageJson}\n${packageReadme}\n${licenseHubHome}\n${licenseHubDocs}\n${licenseHubProduct}`,
    REQUIRED_LINK_PHRASES,
    "public surfaces",
  );

  expect(
    licenseHubHome.includes("docs/product/current/first-governance-report.md"),
    "License Hub home must link to the current first governance report guide",
  );
  expect(
    licenseHubDocs.includes("docs/product/current/first-governance-report.md"),
    "License Hub docs must link to the current first governance report guide",
  );
  expect(
    licenseHubProduct.includes("docs/product/current/first-governance-report.md"),
    "License Hub product page must link to the current first governance report guide",
  );
  expect(
    !licenseHubProduct.includes("docs/product/current/v7_0_first_report.md"),
    "License Hub product page must not link to the superseded v7_0_first_report.md guide",
  );
  expect(
    !licenseHubHome.includes("v7_0_download_to_first_report_ux.md") &&
      !licenseHubDocs.includes("v7_0_download_to_first_report_ux.md") &&
      !licenseHubProduct.includes("v7_0_download_to_first_report_ux.md"),
    "License Hub public surfaces must not link to v7_0_download_to_first_report_ux.md",
  );
  expect(
    !licenseHubHome.includes("v7_0_license_hub_copy_candidate.md") &&
      !licenseHubDocs.includes("v7_0_license_hub_copy_candidate.md") &&
      !licenseHubProduct.includes("v7_0_license_hub_copy_candidate.md"),
    "License Hub public surfaces must not link to v7_0_license_hub_copy_candidate.md",
  );

  assertForbiddenClaimsAbsent(
    `${rootReadme}\n${packageReadme}\n${firstGuide}\n${supersededGuide}\n${licenseHubHome}\n${licenseHubDocs}\n${licenseHubProduct}`,
  );
  assertNoApprovalOrBlockingClaims(
    `${rootReadme}\n${packageReadme}\n${firstGuide}\n${supersededGuide}\n${licenseHubHome}\n${licenseHubDocs}\n${licenseHubProduct}`,
  );
  assertDenyExitCodeStillPresent(repoRoot);

  console.log("PASS: v7.0.1 public surface consistency verified.");
}

main();
