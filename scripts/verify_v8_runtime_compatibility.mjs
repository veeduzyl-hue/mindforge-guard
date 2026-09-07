import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const mesrRoot = path.join(repoRoot, "packages", "guard-core", "src", "mesr");
const expectedMesrFiles = [
  "claimBoundaries.ts",
  "corePatternSignature.ts",
  "coreRegistry.ts",
  "eakProjection.ts",
  "moduleManifest.ts",
  "reasonCodeBindings.ts",
  "semanticSnapshot.ts",
  "softwareDomainSeed.ts",
  "supportEvaluator.ts",
  "temporalBasis.ts",
  "types.ts",
];
const directExecutableFiles = [
  "scripts/verify_mesr_registry.mjs",
  "scripts/verify_mesr_reason_bindings.mjs",
  "scripts/verify_mesr_claim_stability.mjs",
  "scripts/verify_mesr_composition.mjs",
  "scripts/verify_mesr_runtime_portability.mjs",
  "scripts/verify_mesr_cross_domain.mjs",
  "scripts/verify_mesr_apaai_crosswalk.mjs",
  "scripts/fixtures/mesr_experiment_3_phase2a_fixtures.mjs",
  "scripts/fixtures/mesr_e3_a1_runtime_portability_fixtures.mjs",
  "scripts/fixtures/mesr_experiment_3_phase2c_fixtures.mjs",
  "scripts/fixtures/mesr_e3_a2_apaai_crosswalk_fixtures.mjs",
];

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function walk(directory, extension) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(entryPath, extension) : entry.name.endsWith(extension) ? [entryPath] : [];
    })
    .sort();
}

function relative(absolutePath) {
  return path.relative(repoRoot, absolutePath).split(path.sep).join("/");
}

function importSpecifiers(source) {
  const results = [];
  const pattern = /(?:from\s+|import\s*\()\s*["']([^"']+)["']/g;
  for (const match of source.matchAll(pattern)) results.push(match[1]);
  return results;
}

function hasExactCase(absolutePath) {
  const parts = path.relative(repoRoot, absolutePath).split(path.sep);
  let cursor = repoRoot;
  for (const part of parts) {
    const names = fs.readdirSync(cursor);
    if (!names.includes(part)) return false;
    cursor = path.join(cursor, part);
  }
  return true;
}

function directTsEdges(files) {
  return files.flatMap((relativePath) => importSpecifiers(read(relativePath))
    .filter((specifier) => specifier.endsWith(".ts"))
    .map((specifier) => `${relativePath}->${specifier}`));
}

const rootPackage = JSON.parse(read("package.json"));
const guardPackage = JSON.parse(read("packages/guard/package.json"));
const guardCorePackage = JSON.parse(read("packages/guard-core/package.json"));

assert.equal(rootPackage.engines.node, ">=18");
assert.equal(guardPackage.engines.node, ">=18");
assert.equal(guardCorePackage.type, "module");
assert.equal(guardCorePackage.main, "src/index.ts");
assert.equal(guardCorePackage.private, true);
assert.equal(rootPackage.scripts["verify:v8:runtime-compatibility"], "node scripts/verify_v8_runtime_compatibility.mjs");
assert.equal(rootPackage.scripts.verify.includes("runtime-compatibility"), false);

assert.deepEqual(fs.readdirSync(mesrRoot).filter((name) => name.endsWith(".ts")).sort(), expectedMesrFiles);
assert.equal(read("packages/guard-core/src/index.ts").includes("mesr"), false);

const phase2Commands = [
  "verify:mesr:registry",
  "verify:mesr:reason-bindings",
  "verify:mesr:claim-stability",
  "verify:mesr:composition",
].map((name) => rootPackage.scripts[name]);
assert.ok(phase2Commands.every((command) => /^node scripts\/verify_mesr_[a-z_]+\.mjs$/.test(command)));
assert.ok(phase2Commands.every((command) => !/tsx|ts-node|--loader|--import/.test(command)));

const expectedDirectEdges = directTsEdges(directExecutableFiles);
assert.ok(expectedDirectEdges.length > 0);

const mesrFiles = walk(mesrRoot, ".ts");
const scannedFiles = [...mesrFiles, ...directExecutableFiles.map((name) => path.join(repoRoot, name))];
const forbiddenSyntax = [
  ["runtime_enum", /\b(?:const\s+)?enum\s+[A-Za-z_$]/],
  ["runtime_namespace", /\bnamespace\s+[A-Za-z_$]/],
  ["parameter_property", /constructor\s*\([^)]*\b(?:public|private|protected|readonly)\s+[A-Za-z_$]/s],
  ["typescript_import_alias", /import\s+[A-Za-z_$][\w$]*\s*=\s*require\s*\(/],
  ["decorator", /^\s*@[A-Za-z_$]/m],
  ["tsconfig_path_alias", /(?:from\s+|import\s*\()\s*["']@[^"']+["']/],
];
const forbiddenPlatformPatterns = [
  ["windows_drive_literal", /["'][A-Za-z]:[\\/]/],
  ["unc_path_literal", /["']\\\\/],
  ["cmd_only", /\bcmd(?:\.exe)?\b/i],
  ["powershell_only", /\bpowershell(?:\.exe)?\b/i],
  ["posix_shell_only", /\/bin\/(?:ba)?sh\b/],
  ["tmp_assumption", /["']\/tmp(?:\/|["'])/],
  ["shell_process", /node:child_process|\bexecSync\b|\bspawnSync\b/],
];

for (const file of scannedFiles) {
  const source = fs.readFileSync(file, "utf8");
  for (const [label, pattern] of forbiddenSyntax) {
    assert.equal(pattern.test(source), false, `${label}:${relative(file)}`);
  }
  for (const [label, pattern] of forbiddenPlatformPatterns) {
    assert.equal(pattern.test(source), false, `${label}:${relative(file)}`);
  }
  for (const specifier of importSpecifiers(source).filter((value) => value.startsWith("."))) {
    const target = path.resolve(path.dirname(file), specifier);
    assert.equal(fs.existsSync(target), true, `unresolved runtime import: ${relative(file)} -> ${specifier}`);
    assert.equal(hasExactCase(target), true, `case-mismatched runtime import: ${relative(file)} -> ${specifier}`);
  }
}

const publicRuntimeFiles = walk(path.join(repoRoot, "packages", "guard", "src"), ".mjs");
const publicTsEdges = publicRuntimeFiles.flatMap((file) => importSpecifiers(fs.readFileSync(file, "utf8"))
  .filter((specifier) => specifier.endsWith(".ts"))
  .map((specifier) => `${relative(file)}->${specifier}`));
assert.deepEqual(publicTsEdges, []);

const [nodeMajor, nodeMinor] = process.versions.node.split(".").map(Number);
const nativeTypeStrippingDefault =
  (nodeMajor === 22 && nodeMinor >= 18) ||
  (nodeMajor === 23 && nodeMinor >= 6) ||
  nodeMajor >= 24;
assert.equal(nativeTypeStrippingDefault, true, "V8 direct-TS development verifier requires default native type stripping");
assert.equal(process.features.typescript, "strip");

console.log("PASS: V8 runtime compatibility boundary verified");
console.log(JSON.stringify({
  outcome: "COMPATIBLE_FOR_V8_DEVELOPMENT_ONLY",
  declared_public_node: ">=18",
  current_runtime: process.version,
  current_platform: process.platform,
  typescript_execution: process.features.typescript,
  mesr_source_language: "TypeScript",
  direct_execution_boundary: "MJS via Node native type stripping",
  direct_mjs_to_ts_edges: expectedDirectEdges.length,
  public_cli_mjs_to_ts_edges: publicTsEdges.length,
  forbidden_ts_constructs: 0,
  platform_specific_constructs: 0,
}));
