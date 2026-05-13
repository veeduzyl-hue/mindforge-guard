import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ALLOWED_CHANGE_PATHS = new Set([
  "docs/release/v7_0_1_cli_entrypoint_hotfix.md",
  "packages/guard/README.md",
  "packages/guard/bin/guard.mjs",
  "packages/guard/package.json",
  "scripts/verify_v7_0_1_cli_entrypoint_hotfix.mjs",
]);

const FORBIDDEN_CLAIMS = [
  "approval granted",
  "approves changes",
  "blocking enforcement",
  "blocks unsafe changes",
  "safe-to-merge",
  "safe to merge",
  "safe-to-deploy",
  "safe to deploy",
  "certifies compliance",
  "compliance certified",
  "legal compliance guaranteed",
  "maturity certified",
  "runtime control plane",
  "policy engine",
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
    expect(ALLOWED_CHANGE_PATHS.has(relativePath), `unexpected changed path outside allowed hotfix set: ${relativePath}`);
  }
}

function assertCliEntrypoint(repoRoot) {
  const entrypointPath = path.join(repoRoot, "packages/guard/bin/guard.mjs");
  expect(fs.existsSync(entrypointPath), "packages/guard/bin/guard.mjs must exist");

  const text = readText(entrypointPath);

  expect(text.includes('import { runGuard } from "../src/runGuard.mjs";'), "guard.mjs must import runGuard");
  expect(
    text.includes("const result = await runGuard({ argv: process.argv.slice(2) });"),
    "guard.mjs must call runGuard with process.argv.slice(2)"
  );
  expect(text.includes("if (result?.stdout) process.stdout.write(result.stdout);"), "guard.mjs must write stdout");
  expect(text.includes("if (result?.stderr) process.stderr.write(result.stderr);"), "guard.mjs must write stderr");
  expect(
    text.includes("process.exitCode = Number.isInteger(result?.exitCode) ? result.exitCode : 0;"),
    "guard.mjs must set process.exitCode"
  );
}

function assertPackageManifest(repoRoot) {
  const manifestPath = path.join(repoRoot, "packages/guard/package.json");
  const manifest = JSON.parse(readText(manifestPath));

  expect(manifest.version === "7.0.1", "packages/guard/package.json version must be exactly 7.0.1");
  expect(manifest.license === "Apache-2.0", "packages/guard/package.json license must remain Apache-2.0");
  expect(manifest.name === "@veeduzyl/mindforge-guard", "packages/guard/package.json name must remain @veeduzyl/mindforge-guard");
  expect(manifest?.bin?.guard === "bin/guard.mjs", 'packages/guard/package.json bin.guard must be exactly "bin/guard.mjs"');
  expect(manifest?.bin?.guard !== "./bin/guard.mjs", 'packages/guard/package.json bin.guard must not be "./bin/guard.mjs"');
  expect(
    JSON.stringify(manifest.files) === JSON.stringify(["bin/", "src/", "README.md", "EDITIONS.md", "LICENSE"]),
    "packages/guard/package.json files whitelist must remain unchanged"
  );
}

function assertPackageReadme(repoRoot) {
  const readmePath = path.join(repoRoot, "packages/guard/README.md");
  const text = readText(readmePath);

  expect(text.includes("The current package release is `v7.0.1`."), "packages/guard/README.md must state v7.0.1 as the current package release");
  expect(text.includes("veeduzyl-mindforge-guard-7.0.1.tgz"), "packages/guard/README.md must reference the v7.0.1 fallback tarball");
  expect(
    !text.includes("The current package release is `v7.0.0`."),
    "packages/guard/README.md must not reference v7.0.0 as the current package release"
  );
}

function assertForbiddenClaimsAbsent(repoRoot) {
  const filePaths = [
    path.join(repoRoot, "packages/guard/README.md"),
    path.join(repoRoot, "docs/release/v7_0_1_cli_entrypoint_hotfix.md"),
  ];

  const combined = filePaths.map((filePath) => readText(filePath).toLowerCase()).join("\n");

  for (const claim of FORBIDDEN_CLAIMS) {
    expect(!combined.includes(claim.toLowerCase()), `forbidden claim must not appear in hotfix docs: ${claim}`);
  }
}

function assertDenyExitCodeUnchanged(repoRoot) {
  const permitGatePath = path.join(repoRoot, "packages/guard/src/runtime/governance/permit/permitGate.mjs");
  const text = readText(permitGatePath);

  expect(text.includes("export const PERMIT_GATE_DENIED_EXIT_CODE = 25;"), "deny exit code 25 must remain unchanged");
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  assertAllowedChangedPaths(collectChangedPaths(repoRoot));
  assertCliEntrypoint(repoRoot);
  assertPackageManifest(repoRoot);
  assertPackageReadme(repoRoot);
  assertForbiddenClaimsAbsent(repoRoot);
  assertDenyExitCodeUnchanged(repoRoot);

  console.log("PASS: v7.0.1 CLI entrypoint hotfix verified.");
}

main();
