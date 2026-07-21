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

const failures = [];

function expect(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function normalizeType(value) {
  return value.replace(/\s+/g, " ").trim();
}

function isExactSet(actualValues, expectedValues) {
  if (new Set(actualValues).size !== actualValues.length) {
    return false;
  }

  const actual = [...actualValues].sort();
  const expected = [...expectedValues].sort();
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function expectExactSet(actualValues, expectedValues, label) {
  expect(
    new Set(actualValues).size === actualValues.length,
    `${label} must not contain duplicates`
  );

  const actual = [...actualValues].sort();
  const expected = [...expectedValues].sort();
  expect(
    actual.length === expected.length &&
      actual.every((value, index) => value === expected[index]),
    `${label} must contain exactly the approved members`
  );
}

function expectPhrases(source, phrases, message) {
  const normalizedSource = normalizeType(
    source.replace(/^\s*\*+\s?/gm, "")
  ).toLowerCase();
  expect(
    phrases.every((phrase) =>
      normalizedSource.includes(normalizeType(phrase).toLowerCase())
    ),
    message
  );
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
}

function extractInterfaceRange(source, name) {
  const match = new RegExp(`export\\s+interface\\s+${name}\\b`).exec(source);
  if (!match) {
    return null;
  }

  const openingBrace = source.indexOf("{", match.index + match[0].length);
  if (openingBrace < 0) {
    return null;
  }

  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
    } else if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        let end = index + 1;
        let possibleSemicolon = end;
        while (/\s/.test(source[possibleSemicolon] ?? "")) {
          possibleSemicolon += 1;
        }
        if (source[possibleSemicolon] === ";") {
          end = possibleSemicolon + 1;
        }
        return {
          start: match.index,
          end,
          body: source.slice(openingBrace + 1, index),
        };
      }
    }
  }

  return null;
}

function extractInterfaceBody(source, name) {
  return extractInterfaceRange(source, name)?.body ?? "";
}

function extractTypeAliasRange(source, name) {
  const match = new RegExp(`export\\s+type\\s+${name}\\s*=`).exec(source);
  if (!match) {
    return null;
  }

  const end = source.indexOf(";", match.index + match[0].length);
  return end < 0
    ? null
    : {
        start: match.index,
        end: end + 1,
        body: source.slice(match.index + match[0].length, end),
      };
}

function extractTypeAlias(source, name) {
  return extractTypeAliasRange(source, name)?.body ?? "";
}

function extractImportRanges(source) {
  return Array.from(source.matchAll(/^import[\s\S]*?;$/gm), (match) => ({
    start: match.index,
    end: match.index + match[0].length,
    statement: match[0],
  }));
}

function analyzeSourceCoverage(source, ranges) {
  const orderedRanges = [...ranges].sort((left, right) => left.start - right.start);
  const hasInvalidRange = orderedRanges.some(
    ({ start, end }) =>
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 0 ||
      end <= start ||
      end > source.length
  );
  const hasOverlap = orderedRanges.some(
    (range, index) => index > 0 && range.start < orderedRanges[index - 1].end
  );

  let residual = source;
  if (!hasInvalidRange && !hasOverlap) {
    for (const { start, end } of orderedRanges.reverse()) {
      residual =
        residual.slice(0, start) + " ".repeat(end - start) + residual.slice(end);
    }
  }

  return {
    hasInvalidRange,
    hasOverlap,
    residual: residual.trim(),
  };
}

function parseFields(body) {
  const fields = [];
  const ranges = [];

  for (const statement of body.matchAll(/[^;]*;/g)) {
    const field = statement[0].match(
      /^\s*([A-Za-z_][A-Za-z0-9_]*)(\?)?\s*:\s*([\s\S]*?)\s*;\s*$/
    );
    if (!field || normalizeType(field[3]).length === 0) {
      continue;
    }

    fields.push({
      name: field[1],
      optional: field[2] === "?",
      type: normalizeType(field[3]),
    });
    ranges.push({
      start: statement.index,
      end: statement.index + statement[0].length,
    });
  }

  return {
    fields,
    residual: analyzeSourceCoverage(body, ranges).residual,
  };
}

function fieldSignature(field) {
  return `${field.name}|${field.optional ? "optional" : "required"}|${field.type}`;
}

function expectExactFields(source, name, expectedFields) {
  const body = extractInterfaceBody(source, name);
  expect(body.length > 0, `${name} must be an exported interface`);
  if (body.length > 0) {
    const analysis = parseFields(body);
    const actualFields = analysis.fields;
    expect(
      analysis.residual.length === 0,
      `${name} must contain only recognized property signatures`
    );
    expect(
      new Set(actualFields.map((field) => field.name)).size ===
        actualFields.length,
      `${name} must not contain duplicate field names`
    );
    expectExactSet(
      actualFields.map(fieldSignature),
      expectedFields.map(fieldSignature),
      `${name} fields`
    );
  }
  return body;
}

function extractStringLiterals(source) {
  return Array.from(source.matchAll(/"([^"]+)"/g), (match) => match[1]);
}

function parseQuotedStringLiteralMember(member) {
  const normalized = normalizeType(member);
  const match = normalized.match(
    /^(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')$/
  );
  return match ? (match[1] ?? match[2]) : null;
}

function analyzeExactLiteralUnion(alias, expectedLiterals) {
  const members = parseUnionMembers(alias);
  const values = [];
  const invalidMembers = [];

  for (const member of members) {
    const value = parseQuotedStringLiteralMember(member);
    if (value === null) {
      invalidMembers.push(member);
    } else {
      values.push(value);
    }
  }

  return {
    invalidMembers,
    values,
    exact:
      invalidMembers.length === 0 && isExactSet(values, expectedLiterals),
  };
}

function expectExactLiterals(source, name, expectedLiterals) {
  const alias = extractTypeAlias(source, name);
  expect(alias.length > 0, `${name} must be an exported type alias`);
  if (alias.length > 0) {
    const analysis = analyzeExactLiteralUnion(alias, expectedLiterals);
    expect(
      analysis.invalidMembers.length === 0,
      `${name} must contain only quoted string literal members`
    );
    expectExactSet(analysis.values, expectedLiterals, `${name} literal values`);
  }
  return alias;
}

function parseUnionMembers(alias) {
  return alias
    .split("|")
    .map((member) => normalizeType(member))
    .filter(Boolean);
}

function expectExactUnionMembers(source, name, expectedMembers) {
  const alias = extractTypeAlias(source, name);
  expect(alias.length > 0, `${name} must be an exported type alias`);
  if (alias.length > 0) {
    expectExactSet(parseUnionMembers(alias), expectedMembers, `${name} members`);
  }
  return alias;
}

function parseTypeImport(statement) {
  const match = statement.match(
    /^import\s+type\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']\s*;$/
  );
  if (!match) {
    return null;
  }

  return {
    source: match[2],
    names: match[1]
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean),
  };
}

const literalUnionSelfProbes = [
  ['"a" | "b" | string', "string"],
  ['"a" | "b" | number', "number"],
  ['"a" | "b" | OtherAlias', "OtherAlias"],
];
for (const [alias, invalidMember] of literalUnionSelfProbes) {
  const analysis = analyzeExactLiteralUnion(alias, ["a", "b"]);
  expect(
    !analysis.exact && analysis.invalidMembers.includes(invalidMember),
    `literal-union self-probe must reject nonliteral member: ${invalidMember}`
  );
}

const interfaceResidualSelfProbes = [
  ["value: string;\nrun(): void;", "method signature"],
  ["value: string;\n[key: string]: unknown;", "index signature"],
  ["value: string;\n(): void;", "call signature"],
  ["value: string;\nnew (): unknown;", "construct signature"],
  ["value: string,", "comma-separated field"],
];
for (const [body, label] of interfaceResidualSelfProbes) {
  const analysis = parseFields(body);
  expect(
    analysis.residual.length > 0,
    `interface parser self-probe must retain ${label} as residual source`
  );
}

const topLevelProbeSource = [
  'import type { A } from "./a";',
  'export type Probe = "a";',
  "const hiddenRuntime = 1;",
].join("\n");
const topLevelProbeCoverage = analyzeSourceCoverage(topLevelProbeSource, [
  ...extractImportRanges(topLevelProbeSource),
  extractTypeAliasRange(topLevelProbeSource, "Probe"),
].filter(Boolean));
expect(
  topLevelProbeCoverage.residual === "const hiddenRuntime = 1;",
  "top-level source-coverage self-probe must detect appended runtime source"
);

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
const aggregateVerify = packageJson.scripts?.verify;
expect(
  typeof aggregateVerify === "string",
  "aggregate verify script must exist"
);
if (typeof aggregateVerify === "string") {
  expect(
    !aggregateVerify.includes(
      "verify:external-evidence:minimal-service-api-type-contract"
    ),
    "aggregate verify must not include the new package script"
  );
  expect(
    !aggregateVerify.includes(
      "verify_external_evidence_minimal_service_api_type_contract.mjs"
    ),
    "aggregate verify must not invoke the new verifier directly"
  );
}

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
expectPhrases(
  verificationTypesSource,
  [
    "producer-neutral",
    "do not define runtime execution",
    "approval",
    "persistence",
    "billing",
  ],
  "verificationTypes.ts must retain its producer-neutral, non-runtime boundary"
);

expectExactFields(registryTypesCode, "AdapterRegistryMappingSupport", [
  { name: "external_receipt_contract", optional: true, type: "boolean" },
  { name: "normalized_evidence_record", optional: true, type: "boolean" },
  { name: "verification_findings", optional: true, type: "boolean" },
  { name: "report_language", optional: true, type: "boolean" },
]);
expectPhrases(
  registryTypesSource,
  ["not runtime configs", "not trust registry records", "not allowlists"],
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
  const candidateLine = proposalSource
    .split(/\r?\n/)
    .find((line) => line.includes(`\`${name}\``));
  expect(Boolean(candidateLine), `proposal must include candidate ${name}`);
  if (candidateLine) {
    expectPhrases(
      candidateLine,
      ["candidate name", "not implemented or frozen"],
      `proposal must retain the candidate boundary for ${name}`
    );
  }
}
expectPhrases(
  proposalSource,
  ["separate type-only phase"],
  "proposal must identify the separately reviewed type-only phase"
);
expectPhrases(
  proposalSource,
  ["does not authorize runtime implementation"],
  "proposal must not authorize runtime implementation"
);
expect(
  contents.existingVerifier.length > 0,
  "existing external evidence type verifier must exist"
);

const importRanges = extractImportRanges(typeCode);
const imports = importRanges.map(({ statement }) => statement);
expect(imports.length === 2, "type file must contain exactly two imports");
expect(
  imports.every((statement) => /^import\s+type\b/.test(statement)),
  "type file imports must all use import type"
);
const parsedImports = imports.map(parseTypeImport);
expect(
  parsedImports.every(Boolean),
  "type file imports must use named import type syntax"
);
const validImports = parsedImports.filter(Boolean);
expectExactSet(
  validImports.map((entry) => entry.source),
  ["./verificationTypes", "./registryTypes"],
  "type import modules"
);
const expectedImports = new Map([
  [
    "./verificationTypes",
    [
      "AdapterManifest",
      "EvidencePackage",
      "VerificationJob",
      "VerificationRequest",
      "VerificationRequestReference",
    ],
  ],
  ["./registryTypes", ["AdapterRegistryMappingSupport"]],
]);
for (const [source, expectedNames] of expectedImports) {
  const matchingImports = validImports.filter((entry) => entry.source === source);
  expect(
    matchingImports.length === 1,
    `type file must import from ${source} exactly once`
  );
  if (matchingImports.length === 1) {
    expectExactSet(
      matchingImports[0].names,
      expectedNames,
      `type names imported from ${source}`
    );
  }
}
const approvedImportRanges = importRanges.filter((range, index) => {
  const parsed = parsedImports[index];
  const expectedNames = parsed ? expectedImports.get(parsed.source) : null;
  return (
    expectedNames &&
    validImports.filter((entry) => entry.source === parsed.source).length === 1 &&
    isExactSet(parsed.names, expectedNames)
  );
});

const runtimeImplementationPattern =
  /\b(?:function|class|const|let|var|enum|namespace|new|throw|try|if|for|while|switch|await)\b|console\.|=>|\bPromise\b|fetch\s*\(|process\.|child_process|\bfs\.|\bcrypto\.|import\s*\(/;
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
expectExactSet(
  actualDeclarations,
  expectedDeclarations,
  "type file declarations"
);
const expectedInterfaceDeclarations = new Set([
  "VerificationJobSubmissionEnvelope",
  "VerificationServiceProblem",
  "VerificationJobSubmissionResolvedResponse",
  "VerificationJobSubmissionProblemResponse",
]);
const approvedDeclarationRanges = expectedDeclarations
  .map((name) =>
    expectedInterfaceDeclarations.has(name)
      ? extractInterfaceRange(typeCode, name)
      : extractTypeAliasRange(typeCode, name)
  )
  .filter(Boolean);
expect(
  approvedDeclarationRanges.length === expectedDeclarations.length,
  "type file must contain a complete source range for every approved declaration"
);
const typeSourceCoverage = analyzeSourceCoverage(typeCode, [
  ...approvedImportRanges,
  ...approvedDeclarationRanges,
]);
expect(
  !typeSourceCoverage.hasInvalidRange && !typeSourceCoverage.hasOverlap,
  "approved type-only source ranges must be valid and non-overlapping"
);
expect(
  typeSourceCoverage.residual.length === 0,
  "type file must contain only approved import type and export declarations"
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

expectExactUnionMembers(
  typeCode,
  "VerificationSubmissionProblemCategory",
  [
    "VerificationPreAcceptanceProblemCategory",
    '"internal_verification_service_error"',
  ]
);
expectExactUnionMembers(
  typeCode,
  "VerificationServiceProblemCategory",
  [
    "VerificationPreAcceptanceProblemCategory",
    "VerificationArtifactProblemCategory",
  ]
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

expectExactUnionMembers(
  typeCode,
  "VerificationJobSubmissionResponse",
  [
    "VerificationJobSubmissionResolvedResponse",
    "VerificationJobSubmissionProblemResponse",
  ]
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
  parseFields(extractInterfaceBody(typeCode, name)).fields.map(
    (field) => field.name
  )
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

const requiredBoundaryConcepts = [
  ["transport-neutral", "additive-only", "producer-neutral"],
  ["not publicly exported"],
  ["no runtime implementation"],
  ["nonempty candidates", "uniqueness", "selection", "compatibility"],
  ["supplied explicitly by the caller", "does not perform identity validation"],
  ["neither implies execution start or completion"],
  ["no authorization", "tenant hiding", "enumeration protection"],
  ["service problems are not verification findings"],
  ["internal service error", "does not establish", "evidence is invalid"],
  ["does not enforce those equalities"],
  ["any existing status"],
  ["malformed envelope", "request reference"],
  ["no fabricated verification job identity", "job", "disposition"],
];
for (const phrases of requiredBoundaryConcepts) {
  expectPhrases(
    typeSource,
    phrases,
    `type file is missing required boundary concepts: ${phrases.join(", ")}`
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
