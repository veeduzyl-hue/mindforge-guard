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
  registryTypes: path.join(
    repoRoot,
    "packages",
    "guard-core",
    "src",
    "externalEvidence",
    "registryTypes.ts"
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

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
}

const typesSource = requireFile("types.ts", files.types);
const registryTypesSource = requireFile(
  "registryTypes.ts",
  files.registryTypes
);
const docSource = requireFile("design doc", files.doc);
const indexSource = requireFile("guard-core index", files.index);
const registryTypesCode = stripComments(registryTypesSource);

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

const registryForbiddenRuntimeImports = [
  'import fs',
  'import crypto',
  'from "fs"',
  'from "crypto"',
  'from "node:fs"',
  'from "node:crypto"',
  "require(",
];

for (const token of registryForbiddenRuntimeImports) {
  expectExcludes(
    registryTypesCode,
    token,
    `registryTypes.ts must not include runtime import token: ${token}`
  );
}

expectIncludes(
  registryTypesCode,
  "import type",
  "registryTypes.ts must use import type for reused types"
);

const registryForbiddenRuntimeImplementationTokens = [
  "function ",
  "=>",
  "new Promise",
  "fetch(",
  "process.",
  "child_process",
  "fs.",
  "crypto.",
];

for (const token of registryForbiddenRuntimeImplementationTokens) {
  expectExcludes(
    registryTypesCode,
    token,
    `registryTypes.ts must not include runtime implementation token: ${token}`
  );
}

const forbiddenRegistryStatusValues = new Set([
  "approved",
  "blocked",
  "allowed",
  "denied",
  "certified",
  "compliant",
  "safe",
  "unsafe",
  "trusted",
  "production_ready",
  "deployment_ready",
  "authorized",
  "rejected",
]);

const registryStringLiteralMatches = Array.from(
  registryTypesSource.matchAll(/"([^"]*)"/g),
  (match) => match[1]
);

for (const value of registryStringLiteralMatches) {
  if (forbiddenRegistryStatusValues.has(value)) {
    failures.push(
      `registryTypes.ts must not use forbidden status/API literal value: "${value}"`
    );
  }
}

const requiredRegistryTypeNames = [
  "AdapterRegistryLifecycleStatus",
  "AdapterRegistryEvidenceContractLevel",
  "AdapterRegistryReferenceStatus",
  "AdapterRegistryMappingSupport",
  "AdapterRegistryLimitation",
  "AdapterRegistryDocumentationRef",
  "AdapterRegistryEntry",
  "AdapterRegistryIndex",
];

for (const name of requiredRegistryTypeNames) {
  const pattern = new RegExp(`export\\s+(?:type|interface)\\s+${name}\\b`);
  if (!pattern.test(registryTypesSource)) {
    failures.push(
      `registryTypes.ts is missing required exported type/interface: ${name}`
    );
  }
}

const requiredRegistrySnippets = [
  "adapter_id: string",
  "identity: AdapterIdentity",
  "lifecycle_status: AdapterRegistryLifecycleStatus",
  "evidence_contract_level: AdapterRegistryEvidenceContractLevel",
  "mapping_support: AdapterRegistryMappingSupport",
  "limitations: AdapterRegistryLimitation[]",
  "reference_status: AdapterRegistryReferenceStatus",
  "documentation_refs: AdapterRegistryDocumentationRef[]",
  "review_notes: string[]",
  'registry_version: "0.1"',
  "entries: AdapterRegistryEntry[]",
];

for (const snippet of requiredRegistrySnippets) {
  expectIncludes(
    registryTypesSource,
    snippet,
    `registryTypes.ts is missing required snippet: ${snippet}`
  );
}

const requiredRegistryBoundaryPhrases = [
  "documentation/review status only",
  "compatibility for review only",
  "does not imply privilege, approval, certification",
  "not runtime configs",
  "not trust registry records",
  "not allowlists",
];

for (const phrase of requiredRegistryBoundaryPhrases) {
  expectIncludes(
    registryTypesSource,
    phrase,
    `registryTypes.ts is missing required non-authority phrase: ${phrase}`
  );
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
  "registryTypes",
  "AdapterRegistryEntry",
  "AdapterRegistryIndex",
  "AdapterRegistryLifecycleStatus",
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
