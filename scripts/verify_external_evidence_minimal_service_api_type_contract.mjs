import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), "..");

const relativeFiles = {
  typeContract:
    "packages/guard-core/src/externalEvidence/minimalServiceApiTypes.ts",
  verificationTypes:
    "packages/guard-core/src/externalEvidence/verificationTypes.ts",
  registryTypes: "packages/guard-core/src/externalEvidence/registryTypes.ts",
  proposal:
    "docs/external-evidence-assurance-minimal-service-api-proposal-v0.1.md",
  publicIndex: "packages/guard-core/src/index.ts",
  existingVerifier: "scripts/verify_external_evidence_type_contract.mjs",
  packageJson: "package.json",
};

const dedicatedVerifierScript =
  "node scripts/verify_external_evidence_minimal_service_api_type_contract.mjs";
const aggregateVerifyScript =
  "npm run verify:core && npm run verify:v612 && npm run verify:external-evidence:type-contract";

const failures = [];

function expect(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function normalizeType(value) {
  return value.replace(/\s+/g, " ").trim();
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
}

function extractInterfaceBody(source, name) {
  const match = new RegExp(`export\\s+interface\\s+${name}\\b`).exec(source);
  if (!match) {
    return "";
  }

  const openingBrace = source.indexOf("{", match.index + match[0].length);
  if (openingBrace < 0) {
    return "";
  }

  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
    } else if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(openingBrace + 1, index);
      }
    }
  }

  return "";
}

function extractTypeAlias(source, name) {
  const match = new RegExp(`export\\s+type\\s+${name}\\s*=`).exec(source);
  if (!match) {
    return "";
  }

  const end = source.indexOf(";", match.index + match[0].length);
  return end < 0 ? "" : source.slice(match.index + match[0].length, end);
}

function parseFields(body) {
  return Array.from(
    body.matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*)(\?)?:\s*([^;]+);/gm),
    (match) => ({
      name: match[1],
      optional: match[2] === "?",
      type: normalizeType(match[3]),
    })
  );
}

function expectExactFields(source, name, expectedFields) {
  const body = extractInterfaceBody(source, name);
  expect(body.length > 0, `${name} must be an exported interface`);
  if (body.length > 0) {
    expect(
      JSON.stringify(parseFields(body)) === JSON.stringify(expectedFields),
      `${name} fields must match the approved contract exactly`
    );
  }
  return body;
}

function extractStringLiterals(source) {
  return Array.from(source.matchAll(/"([^"]+)"/g), (match) => match[1]);
}

function expectExactLiterals(source, name, expectedLiterals) {
  const alias = extractTypeAlias(source, name);
  expect(alias.length > 0, `${name} must be an exported type alias`);
  if (alias.length > 0) {
    expect(
      JSON.stringify(extractStringLiterals(alias)) ===
        JSON.stringify(expectedLiterals),
      `${name} literal values must match the approved contract exactly`
    );
  }
  return alias;
}

async function readRequired(relativePath) {
  try {
    return await readFile(path.join(repoRoot, relativePath));
  } catch (error) {
    failures.push(`missing required file: ${relativePath} (${error.message})`);
    return Buffer.from("");
  }
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    })
  );
  return nested.flat();
}

const contents = Object.fromEntries(
  await Promise.all(
    Object.entries(relativeFiles).map(async ([key, relativePath]) => [
      key,
      await readRequired(relativePath),
    ])
  )
);

const typeSource = contents.typeContract.toString("utf8");
const typeCode = stripComments(typeSource);
const verificationTypesSource = contents.verificationTypes.toString("utf8");
const verificationTypesCode = stripComments(verificationTypesSource);
const registryTypesSource = contents.registryTypes.toString("utf8");
const registryTypesCode = stripComments(registryTypesSource);
const proposalSource = contents.proposal.toString("utf8");
const publicIndexSource = contents.publicIndex.toString("utf8");

let packageJson = {};
try {
  packageJson = JSON.parse(contents.packageJson.toString("utf8"));
} catch (error) {
  failures.push(`package.json must be valid JSON (${error.message})`);
}

expect(contents.typeContract.length > 0, "new type-only contract file must exist");
expect(
  packageJson.scripts?.[
    "verify:external-evidence:minimal-service-api-type-contract"
  ] === dedicatedVerifierScript,
  "package script must invoke the dedicated verifier exactly"
);
expect(
  packageJson.scripts?.verify === aggregateVerifyScript,
  "aggregate verify script must remain unchanged"
);
expect(
  !packageJson.scripts?.verify?.includes("minimal-service-api-type-contract"),
  "aggregate verify must not include the new verifier"
);

/**
 * Permanent checks validate stable contract semantics. Version-control review
 * is responsible for change scope; this verifier does not inspect repository
 * metadata.
 */
const requiredVerificationArtifactTypes = [
  "VerificationRequest",
  "EvidencePackage",
  "AdapterManifest",
  "VerificationJob",
  "VerificationRequestReference",
];
for (const name of requiredVerificationArtifactTypes) {
  expect(
    new RegExp(`export\\s+(?:type|interface)\\s+${name}\\b`).test(
      verificationTypesCode
    ),
    `verificationTypes.ts must export the reused contract: ${name}`
  );
}

const separatedServiceApiTypes = [
  "VerificationJobSubmissionEnvelope",
  "VerificationJobSubmissionResponse",
  "VerificationArtifactAvailability",
  "VerificationServiceProblem",
];
for (const name of separatedServiceApiTypes) {
  expect(
    !new RegExp(`export\\s+(?:type|interface)\\s+${name}\\b`).test(
      verificationTypesCode
    ),
    `verificationTypes.ts must not define the separated contract: ${name}`
  );
}
expect(
  !verificationTypesCode.includes("minimalServiceApiTypes"),
  "verificationTypes.ts must not import or export minimalServiceApiTypes"
);
for (const phrase of [
  "producer-neutral platform contracts",
  "They do not define runtime execution, approval, blocking, certification",
  "dynamic loading, persistence, or billing behavior",
]) {
  expect(
    verificationTypesSource.includes(phrase),
    `verificationTypes.ts is missing its producer-neutral boundary: ${phrase}`
  );
}

expectExactFields(registryTypesCode, "AdapterRegistryMappingSupport", [
  { name: "external_receipt_contract", optional: true, type: "boolean" },
  { name: "normalized_evidence_record", optional: true, type: "boolean" },
  { name: "verification_findings", optional: true, type: "boolean" },
  { name: "report_language", optional: true, type: "boolean" },
]);
expect(
  registryTypesSource.includes(
    "They are not runtime configs, not trust registry records, or not allowlists."
  ),
  "registryTypes.ts must retain its non-runtime, non-trust boundary"
);

const approvedProposalCandidates = [
  "VerificationJobSubmissionEnvelope",
  "VerificationJobSubmissionDisposition",
  "VerificationJobSubmissionResponse",
  "VerificationArtifactAvailability",
  "VerificationServiceProblem",
];
for (const name of approvedProposalCandidates) {
  expect(
    proposalSource.includes(
      `- \`${name}\` - candidate name only; not implemented or frozen`
    ),
    `proposal must retain the approved candidate marker for ${name}`
  );
}
expect(
  proposalSource.includes(
    "The following names may be evaluated in a separate type-only phase:"
  ),
  "proposal must identify the separately reviewed type-only phase"
);
expect(
  proposalSource.includes("This proposal does not authorize runtime implementation."),
  "proposal must not authorize runtime implementation"
);
expect(
  contents.existingVerifier.length > 0,
  "existing external evidence type verifier must exist"
);

const imports = Array.from(typeCode.matchAll(/^import[\s\S]*?;$/gm), (match) =>
  normalizeType(match[0])
);
expect(imports.length === 2, "type file must contain exactly two imports");
expect(
  imports.every((statement) => statement.startsWith("import type ")),
  "type file imports must all use import type"
);
expect(
  imports.includes(
    'import type { AdapterManifest, EvidencePackage, VerificationJob, VerificationRequest, VerificationRequestReference, } from "./verificationTypes";'
  ),
  "type file must reuse the exact verification artifact contracts"
);
expect(
  imports.includes(
    'import type { AdapterRegistryMappingSupport } from "./registryTypes";'
  ),
  "type file must reuse AdapterRegistryMappingSupport"
);

const runtimeImplementationPattern =
  /\b(?:function|class|const|let|enum|namespace)\b|=>|\bPromise\b|fetch\s*\(|process\.|child_process|\bfs\.|\bcrypto\.|import\s*\(/;
expect(
  !runtimeImplementationPattern.test(typeCode),
  "type file must not contain runtime implementation syntax"
);
expect(
  !/export\s+(?!type\b|interface\b)/.test(typeCode),
  "type file must not contain value exports"
);
expect(
  !/from\s+["'](?:node:|fs|crypto|child_process|http|https|net|database)/.test(
    typeCode
  ),
  "type file must not contain runtime imports"
);

const expectedDeclarations = [
  "VerificationJobSubmissionEnvelope",
  "VerificationJobSubmissionDisposition",
  "VerificationArtifactAvailability",
  "VerificationPreAcceptanceProblemCategory",
  "VerificationArtifactProblemCategory",
  "VerificationSubmissionProblemCategory",
  "VerificationServiceProblemCategory",
  "VerificationServiceProblem",
  "VerificationJobSubmissionResolvedResponse",
  "VerificationJobSubmissionProblemResponse",
  "VerificationJobSubmissionResponse",
];
const actualDeclarations = Array.from(
  typeCode.matchAll(/export\s+(?:type|interface)\s+([A-Za-z_][A-Za-z0-9_]*)/g),
  (match) => match[1]
);
expect(
  JSON.stringify(actualDeclarations) === JSON.stringify(expectedDeclarations),
  "type file must contain exactly the approved main and supporting declarations"
);

expectExactFields(typeCode, "VerificationJobSubmissionEnvelope", [
  { name: "submission_schema_version", optional: false, type: '"0.1"' },
  {
    name: "verification_request",
    optional: false,
    type: "VerificationRequest",
  },
  { name: "evidence_package", optional: false, type: "EvidencePackage" },
  {
    name: "adapter_manifest_candidates",
    optional: false,
    type: "AdapterManifest[]",
  },
  {
    name: "required_mapping_capabilities",
    optional: false,
    type: "(keyof AdapterRegistryMappingSupport)[]",
  },
]);

expectExactLiterals(typeCode, "VerificationJobSubmissionDisposition", [
  "created_new_job",
  "resolved_existing_job",
]);
expectExactLiterals(typeCode, "VerificationArtifactAvailability", [
  "available",
  "not_yet_available",
  "not_produced",
  "not_found",
]);
expectExactLiterals(typeCode, "VerificationPreAcceptanceProblemCategory", [
  "malformed_submission",
  "evidence_binding_mismatch",
  "adapter_selection_failed",
  "unsupported_compatibility",
  "idempotency_conflict",
]);
expectExactLiterals(typeCode, "VerificationArtifactProblemCategory", [
  "resource_not_found",
  "artifact_not_yet_available",
  "artifact_not_produced",
  "internal_verification_service_error",
]);

const submissionProblemAlias = extractTypeAlias(
  typeCode,
  "VerificationSubmissionProblemCategory"
);
expect(
  normalizeType(submissionProblemAlias) ===
    '| VerificationPreAcceptanceProblemCategory | "internal_verification_service_error"',
  "submission problem category must add only the internal service error"
);
const serviceProblemAlias = extractTypeAlias(
  typeCode,
  "VerificationServiceProblemCategory"
);
expect(
  normalizeType(serviceProblemAlias) ===
    "| VerificationPreAcceptanceProblemCategory | VerificationArtifactProblemCategory",
  "service problem category must compose only the approved category aliases"
);

expect(
  /export\s+interface\s+VerificationServiceProblem\s*<\s*TCategory\s+extends\s+VerificationServiceProblemCategory\s*=\s*VerificationServiceProblemCategory\s*>/.test(
    typeCode
  ),
  "VerificationServiceProblem must use the bounded category generic"
);
const serviceProblemBody = expectExactFields(
  typeCode,
  "VerificationServiceProblem",
  [
    { name: "problem_category", optional: false, type: "TCategory" },
    { name: "summary", optional: false, type: "string" },
    { name: "details", optional: true, type: "string[]" },
    { name: "problem_schema_version", optional: false, type: '"0.1"' },
  ]
);
expect(!/\bid\??\s*:/.test(serviceProblemBody), "generic problem must not contain id");

const resolvedBody = expectExactFields(
  typeCode,
  "VerificationJobSubmissionResolvedResponse",
  [
    { name: "response_kind", optional: false, type: '"job"' },
    { name: "response_schema_version", optional: false, type: '"0.1"' },
    {
      name: "request",
      optional: false,
      type: "VerificationRequestReference",
    },
    {
      name: "disposition",
      optional: false,
      type: "VerificationJobSubmissionDisposition",
    },
    { name: "verification_id", optional: false, type: "string" },
    { name: "job", optional: false, type: "VerificationJob" },
  ]
);
expect(
  resolvedBody.includes("verification_id: string") &&
    resolvedBody.includes("job: VerificationJob"),
  "job response must include verification_id and VerificationJob"
);

const problemBody = expectExactFields(
  typeCode,
  "VerificationJobSubmissionProblemResponse",
  [
    { name: "response_kind", optional: false, type: '"problem"' },
    { name: "response_schema_version", optional: false, type: '"0.1"' },
    {
      name: "request",
      optional: true,
      type: "VerificationRequestReference",
    },
    {
      name: "problem",
      optional: false,
      type: "VerificationServiceProblem<VerificationSubmissionProblemCategory>",
    },
  ]
);
for (const forbiddenField of ["verification_id", "job", "disposition"]) {
  expect(
    !new RegExp(`\\b${forbiddenField}\\??\\s*:`).test(problemBody),
    `problem response must not contain ${forbiddenField}`
  );
}

const responseAlias = extractTypeAlias(
  typeCode,
  "VerificationJobSubmissionResponse"
);
expect(
  normalizeType(responseAlias) ===
    "| VerificationJobSubmissionResolvedResponse | VerificationJobSubmissionProblemResponse",
  "submission response must be the exact two-variant union"
);
expect(
  !/export\s+interface\s+VerificationJobSubmissionResponse\b/.test(typeCode),
  "submission response must not be an optional-field catch-all interface"
);

const forbiddenFieldNames = [
  "tenant_id",
  "account_id",
  "auth_context",
  "credential",
  "callback_url",
  "webhook",
  "endpoint",
  "priority",
  "retry_policy",
  "execution_mode",
  "adapter_module",
  "loader",
  "price",
  "amount",
  "currency",
  "invoice",
  "payment",
  "billing",
  "approved",
  "blocked",
  "certified",
  "trusted",
  "deployable",
];
const allInterfaceFields = expectedDeclarations.flatMap((name) =>
  parseFields(extractInterfaceBody(typeCode, name)).map((field) => field.name)
);
for (const forbiddenField of forbiddenFieldNames) {
  expect(
    !allInterfaceFields.includes(forbiddenField),
    `type file must not contain forbidden field: ${forbiddenField}`
  );
}

const forbiddenLiteralValues = new Set([
  "accepted",
  "queued",
  "running",
  "completed",
  "approved",
  "permitted",
  "blocked",
  "rejected",
  "billable",
  "free",
  "denied",
  "hidden",
  "unauthorized",
  "approval_denied",
  "policy_blocked",
  "permit_denied",
  "deployment_failed",
  "untrusted_producer",
  "noncompliant_evidence",
  "payment_required",
  "billing_error",
  "quota_exceeded",
  "tenant_forbidden",
  "http",
  "get",
  "post",
  "put",
  "patch",
  "delete",
]);
for (const literal of extractStringLiterals(typeCode)) {
  expect(
    !forbiddenLiteralValues.has(literal.toLowerCase()),
    `type file must not contain authority, billing, or transport literal: ${literal}`
  );
}

expect(!/ramen/i.test(typeCode), "type file must remain producer-neutral");
const forbiddenOperationNames = [
  /Retry/i,
  /Cancel/i,
  /List/i,
  /Search/i,
  /GetVerificationJobRequest/,
  /GetVerificationJobResponse/,
  /GetVerificationResultRequest/,
  /GetVerificationResultResponse/,
  /GetAssuranceReportRequest/,
  /GetAssuranceReportResponse/,
];
for (const pattern of forbiddenOperationNames) {
  expect(
    !actualDeclarations.some((name) => pattern.test(name)),
    `type file must not add operation wrapper matching ${pattern}`
  );
}

const requiredBoundaryPhrases = [
  "transport-neutral, additive-only, producer-neutral",
  "intentionally not publicly exported",
  "provide no runtime implementation",
  "Array types do not enforce nonempty candidates, uniqueness, selection, or compatibility",
  "Candidates are supplied explicitly by the caller; this type does not perform identity validation",
  "Neither implies execution start or completion",
  "No authorization, tenant hiding, or enumeration protection is implemented",
  "Service problems are not verification findings",
  "an internal service error does not establish that evidence is invalid",
  "this type-only contract does not enforce those equalities",
  "The job may have any existing status",
  "A malformed envelope may prevent formation of a request reference",
  "carries no fabricated verification job identity, job, disposition",
];
const normalizedDocumentation = normalizeType(
  typeSource.replace(/^\s*\*\s?/gm, "")
);
for (const phrase of requiredBoundaryPhrases) {
  expect(
    normalizedDocumentation.includes(normalizeType(phrase)),
    `type file is missing required boundary explanation: ${phrase}`
  );
}

expect(
  !publicIndexSource.includes("minimalServiceApiTypes") &&
    !expectedDeclarations.some((name) => publicIndexSource.includes(name)),
  "guard-core public index must not expose the new contracts"
);

const packageSourceRoot = path.join(repoRoot, "packages", "guard-core", "src");
const packageFiles = await listFiles(packageSourceRoot);
for (const filePath of packageFiles) {
  if (path.resolve(filePath) === path.resolve(repoRoot, relativeFiles.typeContract)) {
    continue;
  }
  const source = await readFile(filePath, "utf8");
  expect(
    !source.includes("minimalServiceApiTypes") &&
      !expectedDeclarations.some((name) => source.includes(name)),
    `${path.relative(repoRoot, filePath)} must not consume the new contracts`
  );
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL: ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    "PASS: external evidence minimal service API type-only contract boundary verified"
  );
}
