import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const files = {
  types: path.join(
    repoRoot,
    "packages",
    "guard-core",
    "src",
    "externalEvidence",
    "types.ts"
  ),
  doc: path.join(
    repoRoot,
    "docs",
    "external-evidence-adapter-interface-v0.1.md"
  ),
  index: path.join(repoRoot, "packages", "guard-core", "src", "index.ts"),
};

const failures = [];

function requireFile(label, filePath) {
  if (!fs.existsSync(filePath)) {
    failures.push(`missing required file: ${label} (${filePath})`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function expectIncludes(haystack, snippet, message) {
  if (!haystack.includes(snippet)) {
    failures.push(message);
  }
}

function expectExcludes(haystack, snippet, message) {
  if (haystack.includes(snippet)) {
    failures.push(message);
  }
}

const typesSource = requireFile("types.ts", files.types);
const docSource = requireFile("design doc", files.doc);
const indexSource = requireFile("guard-core index", files.index);

const forbiddenRuntimeImports = [
  'import fs',
  'import crypto',
  'import child_process',
  'from "fs"',
  'from "crypto"',
  'from "node:fs"',
  'from "node:crypto"',
  "require(",
];

for (const token of forbiddenRuntimeImports) {
  expectExcludes(
    typesSource,
    token,
    `types.ts must not include runtime import token: ${token}`
  );
}

const forbiddenRuntimeImplementationTokens = [
  "function ",
  "=>",
  "new Promise",
  "fetch(",
  "process.",
  "child_process",
  "fs.",
  "crypto.",
];

for (const token of forbiddenRuntimeImplementationTokens) {
  expectExcludes(
    typesSource,
    token,
    `types.ts must not include runtime implementation token: ${token}`
  );
}

const forbiddenStatusValues = new Set([
  "approved",
  "blocked",
  "allowed",
  "denied",
  "certified",
  "compliant",
  "safe",
  "unsafe",
  "production_ready",
  "deployment_ready",
  "authorized",
  "rejected",
]);

const stringLiteralMatches = Array.from(
  typesSource.matchAll(/"([^"]*)"/g),
  (match) => match[1]
);

for (const value of stringLiteralMatches) {
  if (forbiddenStatusValues.has(value)) {
    failures.push(
      `types.ts must not use forbidden status/API literal value: "${value}"`
    );
  }
}

const requiredTypeNames = [
  "EvidenceSourceType",
  "AdapterIdentity",
  "ParseStatus",
  "ContractValidationStatus",
  "VerificationStatus",
  "CompletenessStatus",
  "AdapterDiagnostic",
  "AdapterLimitations",
  "ParseResult",
  "ContractValidationResult",
  "VerificationResult",
  "ParsedExternalEvidence",
  "NormalizedEvidenceRecord",
  "VerificationFinding",
  "AdapterContext",
  "EvidenceSourceAdapter",
];

for (const name of requiredTypeNames) {
  const pattern = new RegExp(`export\\s+(?:type|interface)\\s+${name}\\b`);
  if (!pattern.test(typesSource)) {
    failures.push(`types.ts is missing required exported type/interface: ${name}`);
  }
}

const requiredTypeSnippets = [
  "identity: AdapterIdentity",
  "verify(",
  "validation: ContractValidationResult",
  "normalize(",
  "verification: VerificationResult",
  "emitFindings(",
  "diagnostics?: AdapterDiagnostic[]",
];

for (const snippet of requiredTypeSnippets) {
  expectIncludes(
    typesSource,
    snippet,
    `types.ts is missing required interface signature snippet: ${snippet}`
  );
}

const requiredNormalizedRecordSnippets = [
  "contract_validation: ContractValidationResult",
  "limitations?: AdapterLimitations",
];

for (const snippet of requiredNormalizedRecordSnippets) {
  expectIncludes(
    typesSource,
    snippet,
    `types.ts is missing NormalizedEvidenceRecord snippet: ${snippet}`
  );
}

expectIncludes(
  typesSource,
  "policy_reference_resolver",
  "types.ts must include policy_reference_resolver in AdapterContext"
);

if (
  !typesSource.includes("not a policy authority") &&
  !typesSource.includes("does not provide policy authority")
) {
  failures.push(
    "types.ts must state that policy_reference_resolver is not a policy authority surface"
  );
}

const forbiddenIndexExports = [
  "externalEvidence",
  "EvidenceSourceAdapter",
  "NormalizedEvidenceRecord",
  "VerificationFinding",
];

for (const token of forbiddenIndexExports) {
  expectExcludes(
    indexSource,
    token,
    `packages/guard-core/src/index.ts must not export or reference boundary token: ${token}`
  );
}

const requiredDocSnippets = [
  "identity: AdapterIdentity",
  "verify(",
  "validation: ContractValidationResult",
  "normalize(",
  "diagnostics?: AdapterDiagnostic[]",
];

for (const snippet of requiredDocSnippets) {
  expectIncludes(
    docSource,
    snippet,
    `design doc is missing aligned pseudo-interface snippet: ${snippet}`
  );
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL: ${failure}`);
  }
  process.exit(1);
}

console.log("PASS: external evidence type-only contract boundary verified");
