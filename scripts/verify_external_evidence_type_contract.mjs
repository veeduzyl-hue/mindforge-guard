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
  verificationTypes: path.join(
    repoRoot,
    "packages",
    "guard-core",
    "src",
    "externalEvidence",
    "verificationTypes.ts"
  ),
  doc: path.join(
    repoRoot,
    "docs",
    "external-evidence-adapter-interface-v0.1.md"
  ),
  serviceBoundaryDoc: path.join(
    repoRoot,
    "docs",
    "external-evidence-assurance-service-boundary-contracts-v0.1.md"
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
const verificationTypesSource = requireFile(
  "verificationTypes.ts",
  files.verificationTypes
);
const docSource = requireFile("design doc", files.doc);
const serviceBoundaryDocSource = requireFile(
  "service boundary doc",
  files.serviceBoundaryDoc
);
const indexSource = requireFile("guard-core index", files.index);
const registryTypesCode = stripComments(registryTypesSource);
const verificationTypesCode = stripComments(verificationTypesSource);

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

const verificationForbiddenRuntimeImports = [
  'import fs',
  'import crypto',
  'from "fs"',
  'from "crypto"',
  'from "node:fs"',
  'from "node:crypto"',
  "require(",
];

for (const token of verificationForbiddenRuntimeImports) {
  expectExcludes(
    verificationTypesCode,
    token,
    `verificationTypes.ts must not include runtime import token: ${token}`
  );
}

expectIncludes(
  verificationTypesSource,
  "import type",
  "verificationTypes.ts must use import type for reused contracts"
);

const verificationForbiddenRuntimeImplementationTokens = [
  "function ",
  "=>",
  "new Promise",
  "fetch(",
  "process.",
  "child_process",
  "fs.",
  "crypto.",
];

for (const token of verificationForbiddenRuntimeImplementationTokens) {
  expectExcludes(
    verificationTypesCode,
    token,
    `verificationTypes.ts must not include runtime implementation token: ${token}`
  );
}

const requiredVerificationTypeNames = [
  "EvidencePackage",
  "AdapterManifest",
  "AssuranceProfile",
  "VerificationIdempotencyBoundary",
  "VerificationReplayContext",
  "VerificationRequest",
  "VerificationJobStatus",
  "VerificationJob",
  "VerificationAttempt",
  "VerificationJobResultRecord",
  "VerificationJobTerminalOutcome",
  "AssuranceReport",
  "VerificationUsageRecord",
];

for (const name of requiredVerificationTypeNames) {
  const pattern = new RegExp(`export\\s+(?:type|interface)\\s+${name}\\b`);
  if (!pattern.test(verificationTypesSource)) {
    failures.push(
      `verificationTypes.ts is missing required exported type/interface: ${name}`
    );
  }
}

const requiredVerificationSnippets = [
  "identity: AdapterIdentity",
  "source_type: EvidenceSourceType",
  "declared_limitations: AdapterLimitations",
  "lifecycle_status: AdapterRegistryLifecycleStatus",
  "declared_mapping_capability: AdapterRegistryMappingSupport",
  "idempotency?: VerificationIdempotencyBoundary",
  "replay_context?: VerificationReplayContext",
  "status: VerificationJobStatus",
  "attempts?: VerificationAttemptReference[]",
  "result?: VerificationJobResultRecordReference",
  "verification_status?: VerificationStatus",
  "created_at: string",
  "failure_kind?: VerificationAttemptFailureKind",
  "job_status: VerificationJobResultStatus",
  "normalized_records?: NormalizedEvidenceRecord[]",
  "retention_class?: RetentionClassReference",
  "terminal_outcome?: VerificationJobTerminalOutcome",
  "completion_classification?: VerificationJobResultClassification",
  "deterministic_result?: VerificationJobResultRecordReference",
  "unresolved_findings: VerificationFinding[]",
  "priority?: FindingSeverity",
  'report_schema_version: "0.1"',
  'usage_schema_version: "0.1"',
];

for (const snippet of requiredVerificationSnippets) {
  expectIncludes(
    verificationTypesSource,
    snippet,
    `verificationTypes.ts is missing required snippet: ${snippet}`
  );
}

const verificationStringLiteralMatches = Array.from(
  verificationTypesSource.matchAll(/"([^"]*)"/g),
  (match) => match[1]
);

const forbiddenVerificationLiteralValues = new Set([
  "approved",
  "denied",
  "permitted",
  "blocked",
  "certified",
  "compliant",
  "safe",
  "trusted",
  "deployable",
  "charge",
  "payment",
  "subscription",
  "invoice",
  "checkout",
]);

for (const value of verificationStringLiteralMatches) {
  if (forbiddenVerificationLiteralValues.has(value)) {
    failures.push(
      `verificationTypes.ts must not use forbidden status/billing literal value: "${value}"`
    );
  }
}

const forbiddenVerificationFieldSnippets = [
  "module_path:",
  "loader:",
  "factory:",
  "callback:",
  "network_endpoint:",
  "credential:",
  "key_material:",
  "auto_activation:",
  "privileged:",
  "default_adapter:",
  "trust_decision:",
  "price:",
  "amount:",
  "currency:",
  "fee:",
  "invoice:",
  "payment:",
  "subscription:",
  "checkout:",
  "billing_account:",
  "customer_balance:",
  "customer_id:",
  "account_id:",
  "charge_status:",
  "revenue:",
  "tax:",
  "discount:",
  "credit:",
  "debit:",
  "settlement:",
];

for (const snippet of forbiddenVerificationFieldSnippets) {
  expectExcludes(
    verificationTypesCode,
    snippet,
    `verificationTypes.ts must not include forbidden field snippet: ${snippet}`
  );
}

expectExcludes(
  verificationTypesCode,
  "ramen",
  "verificationTypes.ts must remain producer-neutral and must not include ramen-specific identifiers"
);

expectExcludes(
  verificationTypesSource,
  "export interface VerificationResult {",
  "verificationTypes.ts must not redefine adapter-level VerificationResult"
);

expectExcludes(
  verificationTypesSource,
  "export interface TechnicalUsageRecord",
  "verificationTypes.ts must not introduce a parallel TechnicalUsageRecord schema"
);

expectExcludes(
  verificationTypesSource,
  "export interface TechnicalUsageRecordReference",
  "verificationTypes.ts must not introduce a parallel TechnicalUsageRecordReference schema"
);

expectExcludes(
  verificationTypesSource,
  "export interface BillableUsageEvent",
  "verificationTypes.ts must not introduce a BillableUsageEvent type in this phase"
);

const requiredVerificationBoundaryPhrases = [
  "producer-neutral platform contracts",
  "do not define runtime execution, approval, blocking, certification",
  "dynamic loading, persistence, or billing behavior",
];

for (const phrase of requiredVerificationBoundaryPhrases) {
  expectIncludes(
    verificationTypesSource,
    phrase,
    `verificationTypes.ts is missing required boundary phrase: ${phrase}`
  );
}

const requiredVerificationVersionSnippets = [
  'package_version: "0.1"',
  'contract_version: "0.1"',
  "unresolved_findings: VerificationFinding[]",
  "requested_assurance_profiles:",
  '"deterministic_reexecution"',
  '"analysis_recheck"',
  '"report_integrity_failed"',
  '"bounded_retention"',
];

for (const snippet of requiredVerificationVersionSnippets) {
  expectIncludes(
    verificationTypesSource,
    snippet,
    `verificationTypes.ts is missing required snippet: ${snippet}`
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
  "verificationTypes",
  "AdapterRegistryEntry",
  "AdapterRegistryIndex",
  "AdapterRegistryLifecycleStatus",
  "EvidencePackage",
  "AdapterManifest",
  "AssuranceProfile",
  "VerificationRequest",
  "VerificationJob",
  "AssuranceReport",
  "VerificationUsageRecord",
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

const requiredServiceBoundaryDocSnippets = [
  "VerificationJob remains the logical unit",
  "VerificationAttempt is one execution attempt for that job",
  "`VerificationJobStatus` remains job-scoped only:",
  "VerificationUsageRecord remains the current canonical technical usage record contract",
  "VerificationUsageRecord != future billable usage interpretation != pricing != invoice != payment",
  "They are not independent authoritative retention decisions",
  "VerificationResult in `packages/guard-core/src/externalEvidence/types.ts` remains the adapter-level evidence verification result",
  "This phase does not introduce:",
  "an HTTP API",
  "persistence",
  "authentication",
  "Ramen-specific privilege",
  "approval, blocking, enforcement, certification, or deployment authority",
];

for (const snippet of requiredServiceBoundaryDocSnippets) {
  expectIncludes(
    serviceBoundaryDocSource,
    snippet,
    `service boundary doc is missing required snippet: ${snippet}`
  );
}

const forbiddenServiceBoundaryDocSnippets = [
  "implements a service runtime",
  "deployment authorization",
  "payment processor",
  "service ready",
  "HTTP ready",
  "billing ready",
  "production readiness",
];

for (const snippet of forbiddenServiceBoundaryDocSnippets) {
  expectExcludes(
    serviceBoundaryDocSource,
    snippet,
    `service boundary doc must not include forbidden claim: ${snippet}`
  );
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL: ${failure}`);
  }
  process.exit(1);
}

console.log("PASS: external evidence type-only contract boundary verified");
