import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..");
const schemaPath = path.join(repoRoot, "schemas", "grounding", "grounding-boundary.schema.json");

const EXIT_ERROR_DEFAULT = 30;
const GROUNDING_EXPLAIN_USAGE = "guard grounding explain --preview --json --fixture-file <file>";
const GROUNDING_EXPLAIN_SCHEMA_VERSION = "guard.grounding_explain_preview.v6_16";
const REQUIRED_BOUNDARY_FLAGS = [
  "v6_16_preview",
  "fixture_backed",
  "derived_only",
  "explanation_only",
  "recommendation_only",
  "non_enforcing",
  "default_off",
  "no_live_repo_state_reading",
  "no_live_source_fetching",
  "no_admissibility_decision",
  "no_commit_gate",
  "no_authority_contract_mutation",
];
const ALLOWED_ORIGIN_TYPES = [
  "human_authored",
  "ai_generated",
  "ai_assisted",
  "machine_transformed",
  "mixed",
  "unknown",
];
const ALLOWED_GROUNDING_STATES = [
  "grounded",
  "partially_grounded",
  "ungrounded",
  "unknown",
];
const ALLOWED_FRESHNESS_STATES = [
  "fresh",
  "stale",
  "expired",
  "unknown",
];
const ALLOWED_VERIFICATION_STATUSES = [
  "verified_by_fixture",
  "declared_only",
  "unverifiable",
  "unknown",
];
const FORBIDDEN_FIELDS = [
  "admit",
  "deny",
  "defer",
  "commitment_candidate",
  "commitment_receipt",
  "commit_gate",
  "deployment_gate",
  "deployment_approval",
  "permit_gate",
  "risk_acceptance",
  "regulatory_reporting",
  "means_motive_opportunity",
  "insider_threat",
  "runtime_enforcement",
];
const FORBIDDEN_STRING_VALUES = ["admit", "deny", "defer"];

function renderGroundingHelp() {
  return [
    "Usage:",
    `  ${GROUNDING_EXPLAIN_USAGE}`,
    "",
    "Options:",
    "  --preview             Required explicit preview opt-in",
    "  --json                Required JSON output mode",
    "  --fixture-file <file> Required grounding boundary fixture input",
    "  --help, -h            Show help",
    "",
  ].join("\n");
}

function buildErrorJson({ kind, message, details = {} }) {
  return (
    JSON.stringify(
      {
        ok: false,
        error: {
          kind,
          message,
          ...details,
        },
      },
      null,
      2
    ) + "\n"
  );
}

function usageError(message, usage) {
  return {
    exitCode: 2,
    stderr: `${message}\nUsage: ${usage}\n`,
  };
}

function failure(kind, message, details = {}) {
  return {
    exitCode: EXIT_ERROR_DEFAULT,
    stdout: buildErrorJson({ kind, message, details }),
  };
}

function parseGroundingArgs(args) {
  const parsed = {
    help: false,
    preview: false,
    json: false,
    fixtureFile: null,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
    } else if (arg === "--preview") {
      parsed.preview = true;
    } else if (arg === "--json") {
      parsed.json = true;
    } else if (arg.startsWith("--fixture-file=")) {
      parsed.fixtureFile = arg.slice("--fixture-file=".length);
    } else if (arg === "--fixture-file" && args[i + 1]) {
      parsed.fixtureFile = args[i + 1];
      i += 1;
    }
  }

  return parsed;
}

function findUnexpectedGroundingArg(args) {
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h" || arg === "--preview" || arg === "--json") {
      continue;
    }
    if (arg.startsWith("--fixture-file=")) {
      continue;
    }
    if (arg === "--fixture-file") {
      const next = args[i + 1];
      if (next && !next.startsWith("--")) {
        i += 1;
      }
      continue;
    }
    return arg;
  }

  return null;
}

function stableSerialize(value) {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`);
    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(value);
}

function hashValue(value) {
  return `sha256:${crypto.createHash("sha256").update(stableSerialize(value)).digest("hex")}`;
}

function readJson(filePath, missingKind, invalidKind) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    return {
      error: failure(
        missingKind,
        `Required file could not be read: ${filePath}`,
        { path: filePath, reason: error?.message || String(error) }
      ),
    };
  }

  try {
    return { value: JSON.parse(raw) };
  } catch (error) {
    return {
      error: failure(
        invalidKind,
        `File is not valid JSON: ${filePath}`,
        { path: filePath, reason: error?.message || String(error) }
      ),
    };
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateSchema(schema) {
  const issues = [];

  if (!Array.isArray(schema?.required)) issues.push("schema.required must be an array");
  if (!schema?.properties || typeof schema.properties !== "object") issues.push("schema.properties must exist");

  for (const flag of REQUIRED_BOUNDARY_FLAGS) {
    if (!schema?.required?.includes(flag)) issues.push(`schema.required missing ${flag}`);
    if (schema?.properties?.[flag]?.const !== true) issues.push(`schema.properties.${flag} must const true`);
  }

  const originEnum =
    schema?.$defs?.provenanceClassification?.properties?.origin_type?.enum;
  if (!Array.isArray(originEnum)) {
    issues.push("origin_type enum must exist");
  } else {
    for (const value of ALLOWED_ORIGIN_TYPES) {
      if (!originEnum.includes(value)) issues.push(`origin_type enum missing ${value}`);
    }
  }

  const verificationEnum =
    schema?.$defs?.provenanceClassification?.properties?.verification_status?.enum;
  if (!Array.isArray(verificationEnum)) {
    issues.push("verification_status enum must exist");
  } else {
    for (const value of ALLOWED_VERIFICATION_STATUSES) {
      if (!verificationEnum.includes(value)) issues.push(`verification_status enum missing ${value}`);
    }
  }

  const groundingEnum =
    schema?.$defs?.groundingStatus?.properties?.grounding_state?.enum;
  if (!Array.isArray(groundingEnum)) {
    issues.push("grounding_state enum must exist");
  } else {
    for (const value of ALLOWED_GROUNDING_STATES) {
      if (!groundingEnum.includes(value)) issues.push(`grounding_state enum missing ${value}`);
    }
  }

  const freshnessEnum =
    schema?.$defs?.groundingStatus?.properties?.freshness_state?.enum;
  if (!Array.isArray(freshnessEnum)) {
    issues.push("grounding_status.freshness_state enum must exist");
  } else {
    for (const value of ALLOWED_FRESHNESS_STATES) {
      if (!freshnessEnum.includes(value)) issues.push(`grounding_status.freshness_state enum missing ${value}`);
    }
  }

  const declaredFreshnessEnum =
    schema?.$defs?.declaredFreshness?.properties?.freshness_state?.enum;
  if (!Array.isArray(declaredFreshnessEnum)) {
    issues.push("declared_freshness.freshness_state enum must exist");
  } else {
    for (const value of ALLOWED_FRESHNESS_STATES) {
      if (!declaredFreshnessEnum.includes(value)) issues.push(`declared_freshness.freshness_state enum missing ${value}`);
    }
  }

  return issues;
}

function validateFixture(fixture) {
  const issues = [];

  for (const flag of REQUIRED_BOUNDARY_FLAGS) {
    if (!(flag in fixture)) issues.push(`missing boundary flag ${flag}`);
    else if (fixture[flag] !== true) issues.push(`boundary flag ${flag} must be true`);
  }

  const evidencePackage = fixture?.current_evidence_package;
  if (!isPlainObject(evidencePackage)) {
    issues.push("current_evidence_package must exist");
  } else {
    if (typeof evidencePackage.evidence_package_id !== "string" || evidencePackage.evidence_package_id.length === 0) {
      issues.push("current_evidence_package.evidence_package_id must be a non-empty string");
    }
    if (!Array.isArray(evidencePackage.evidence_items) || evidencePackage.evidence_items.length === 0) {
      issues.push("current_evidence_package.evidence_items must be a non-empty array");
    }
    if (!Array.isArray(evidencePackage.source_refs)) {
      issues.push("current_evidence_package.source_refs must be an array");
    }
    if (!Array.isArray(evidencePackage.source_of_truth_refs)) {
      issues.push("current_evidence_package.source_of_truth_refs must be an array");
    }
    if (!isPlainObject(evidencePackage.declared_freshness)) {
      issues.push("current_evidence_package.declared_freshness must exist");
    } else {
      if (!ALLOWED_FRESHNESS_STATES.includes(evidencePackage.declared_freshness.freshness_state)) {
        issues.push("current_evidence_package.declared_freshness.freshness_state is invalid");
      }
      if (
        typeof evidencePackage.declared_freshness.basis !== "string" ||
        evidencePackage.declared_freshness.basis.length === 0
      ) {
        issues.push("current_evidence_package.declared_freshness.basis must be a non-empty string");
      }
    }
    if (!Array.isArray(evidencePackage.transform_chain)) {
      issues.push("current_evidence_package.transform_chain must be an array");
    }
    if (
      !(
        evidencePackage.authority_explain_receipt_ref === null ||
        typeof evidencePackage.authority_explain_receipt_ref === "string"
      )
    ) {
      issues.push("current_evidence_package.authority_explain_receipt_ref must be a string or null");
    }
  }

  const provenance = fixture?.provenance_classification;
  if (!isPlainObject(provenance)) {
    issues.push("provenance_classification must exist");
  } else {
    if (!ALLOWED_ORIGIN_TYPES.includes(provenance.origin_type)) {
      issues.push("provenance_classification.origin_type is invalid");
    }
    if (!Number.isInteger(provenance.source_depth) || provenance.source_depth < 0) {
      issues.push("provenance_classification.source_depth must be a non-negative integer");
    }
    if (!Number.isInteger(provenance.generation_count) || provenance.generation_count < 0) {
      issues.push("provenance_classification.generation_count must be a non-negative integer");
    }
    if (!Array.isArray(provenance.transform_chain)) {
      issues.push("provenance_classification.transform_chain must be an array");
    }
    if (typeof provenance.primary_source_available !== "boolean") {
      issues.push("provenance_classification.primary_source_available must be a boolean");
    }
    if (!ALLOWED_VERIFICATION_STATUSES.includes(provenance.verification_status)) {
      issues.push("provenance_classification.verification_status is invalid");
    }
  }

  const groundingStatus = fixture?.grounding_status;
  if (!isPlainObject(groundingStatus)) {
    issues.push("grounding_status must exist");
  } else {
    if (!ALLOWED_GROUNDING_STATES.includes(groundingStatus.grounding_state)) {
      issues.push("grounding_status.grounding_state is invalid");
    }
    if (typeof groundingStatus.source_available !== "boolean") {
      issues.push("grounding_status.source_available must be a boolean");
    }
    if (!(groundingStatus.source_of_truth_ref === null || typeof groundingStatus.source_of_truth_ref === "string")) {
      issues.push("grounding_status.source_of_truth_ref must be a string or null");
    }
    if (!(groundingStatus.primary_source_ref === null || typeof groundingStatus.primary_source_ref === "string")) {
      issues.push("grounding_status.primary_source_ref must be a string or null");
    }
    if (!ALLOWED_FRESHNESS_STATES.includes(groundingStatus.freshness_state)) {
      issues.push("grounding_status.freshness_state is invalid");
    }
  }

  const explanation = fixture?.grounding_explanation;
  if (!isPlainObject(explanation)) {
    issues.push("grounding_explanation must exist");
  } else {
    if (typeof explanation.summary !== "string" || explanation.summary.length === 0) {
      issues.push("grounding_explanation.summary must be a non-empty string");
    }
    if (!Array.isArray(explanation.basis) || explanation.basis.length === 0) {
      issues.push("grounding_explanation.basis must be a non-empty array");
    }
    if (!Array.isArray(explanation.limitations)) {
      issues.push("grounding_explanation.limitations must be an array");
    }
  }

  const evidenceAdequacy = fixture?.evidence_adequacy;
  if (!isPlainObject(evidenceAdequacy)) {
    issues.push("evidence_adequacy must exist");
  } else {
    for (const [field, expectedValue] of [
      ["supporting_only", true],
      ["authoritative", false],
      ["creates_permission", false],
      ["changes_authority", false],
      ["changes_exit_semantics", false],
      ["evidence_records_explicit", true],
    ]) {
      if (evidenceAdequacy[field] !== expectedValue) {
        issues.push(`evidence_adequacy.${field} must be ${expectedValue}`);
      }
    }
    if (!Array.isArray(evidenceAdequacy.omissions)) {
      issues.push("evidence_adequacy.omissions must be an array");
    } else {
      for (const [index, omission] of evidenceAdequacy.omissions.entries()) {
        if (!isPlainObject(omission)) {
          issues.push(`evidence_adequacy.omissions[${index}] must be an object`);
          continue;
        }
        if (typeof omission.reason !== "string" || omission.reason.length === 0) {
          issues.push(`evidence_adequacy.omissions[${index}].reason must be a non-empty string`);
        }
      }
    }
    if (!Array.isArray(evidenceAdequacy.uncertainty_notes)) {
      issues.push("evidence_adequacy.uncertainty_notes must be an array");
    } else {
      for (const [index, note] of evidenceAdequacy.uncertainty_notes.entries()) {
        if (!isPlainObject(note)) {
          issues.push(`evidence_adequacy.uncertainty_notes[${index}] must be an object`);
          continue;
        }
        if (note.supporting_metadata_only !== true) {
          issues.push(
            `evidence_adequacy.uncertainty_notes[${index}].supporting_metadata_only must be true`
          );
        }
      }
    }
    if (!Array.isArray(evidenceAdequacy.contrary_artifact_refs)) {
      issues.push("evidence_adequacy.contrary_artifact_refs must be an array");
    } else {
      for (const [index, artifactRef] of evidenceAdequacy.contrary_artifact_refs.entries()) {
        if (!isPlainObject(artifactRef)) {
          issues.push(`evidence_adequacy.contrary_artifact_refs[${index}] must be an object`);
          continue;
        }
        if (artifactRef.supporting_artifact_only !== true) {
          issues.push(
            `evidence_adequacy.contrary_artifact_refs[${index}].supporting_artifact_only must be true`
          );
        }
      }
    }
    if (
      typeof evidenceAdequacy.adequacy_explanation !== "string" ||
      evidenceAdequacy.adequacy_explanation.length === 0
    ) {
      issues.push("evidence_adequacy.adequacy_explanation must be a non-empty string");
    }
  }

  if (
    evidencePackage?.declared_freshness?.freshness_state &&
    groundingStatus?.freshness_state &&
    evidencePackage.declared_freshness.freshness_state !== groundingStatus.freshness_state
  ) {
    issues.push("declared freshness must align with grounding_status.freshness_state");
  }

  if (groundingStatus?.grounding_state === "grounded") {
    if (groundingStatus.source_available !== true) {
      issues.push("grounded fixtures must keep grounding_status.source_available true");
    }
    if (!groundingStatus.source_of_truth_ref || !groundingStatus.primary_source_ref) {
      issues.push("grounded fixtures must declare source_of_truth_ref and primary_source_ref");
    }
  }

  if (groundingStatus?.grounding_state === "partially_grounded") {
    if (groundingStatus.source_available !== true) {
      issues.push("partially_grounded fixtures must keep grounding_status.source_available true");
    }
    if (!groundingStatus.source_of_truth_ref && !groundingStatus.primary_source_ref) {
      issues.push("partially_grounded fixtures must retain at least one grounding reference");
    }
  }

  if (groundingStatus?.grounding_state === "ungrounded") {
    if (groundingStatus.source_available !== false) {
      issues.push("ungrounded fixtures must keep grounding_status.source_available false");
    }
    if (groundingStatus.source_of_truth_ref !== null || groundingStatus.primary_source_ref !== null) {
      issues.push("ungrounded fixtures must not declare grounding refs");
    }
  }

  if (provenance?.primary_source_available === true && !groundingStatus?.primary_source_ref) {
    issues.push("primary_source_available requires grounding_status.primary_source_ref");
  }

  const stack = [fixture];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;

    for (const [key, value] of Object.entries(current)) {
      if (FORBIDDEN_FIELDS.includes(key)) {
        issues.push(`forbidden field present: ${key}`);
      }
      if (typeof value === "string" && FORBIDDEN_STRING_VALUES.includes(value)) {
        issues.push(`forbidden string value present: ${value}`);
      }
      if (value && typeof value === "object") {
        stack.push(value);
      }
    }
  }

  return issues;
}

function validateRequiredPreviewArgs(args) {
  const unexpectedArg = findUnexpectedGroundingArg(args);
  if (unexpectedArg) {
    const message = unexpectedArg.startsWith("--")
      ? `Unknown option: ${unexpectedArg}`
      : `Unexpected argument: ${unexpectedArg}`;
    return { response: usageError(message, GROUNDING_EXPLAIN_USAGE) };
  }

  const parsed = parseGroundingArgs(args);
  if (parsed.help) return { response: { exitCode: 0, stdout: renderGroundingHelp() + "\n" } };
  if (!parsed.preview) return { response: usageError("Missing required option: --preview", GROUNDING_EXPLAIN_USAGE) };
  if (!parsed.json) return { response: usageError("Missing required option: --json", GROUNDING_EXPLAIN_USAGE) };
  if (!parsed.fixtureFile) {
    return { response: usageError("Missing required option: --fixture-file", GROUNDING_EXPLAIN_USAGE) };
  }
  return { parsed };
}

function loadValidatedGroundingFixture(parsed) {
  const schemaRead = readJson(
    schemaPath,
    "grounding_preview_schema_missing",
    "grounding_preview_schema_invalid_json"
  );
  if (schemaRead.error) return schemaRead;

  const fixturePath = path.resolve(process.cwd(), parsed.fixtureFile);
  const fixtureRead = readJson(
    fixturePath,
    "grounding_preview_fixture_missing",
    "grounding_preview_fixture_invalid_json"
  );
  if (fixtureRead.error) return fixtureRead;

  const schemaIssues = validateSchema(schemaRead.value);
  if (schemaIssues.length > 0) {
    return {
      error: failure(
        "grounding_preview_schema_invalid",
        "Grounding preview schema contract is invalid.",
        { path: schemaPath, issues: schemaIssues }
      ),
    };
  }

  const fixtureIssues = validateFixture(fixtureRead.value);
  if (fixtureIssues.length > 0) {
    return {
      error: failure(
        "grounding_preview_contract_invalid",
        "Grounding preview fixture failed contract validation.",
        { path: fixturePath, issues: fixtureIssues }
      ),
    };
  }

  return { fixturePath, fixture: fixtureRead.value };
}

function normalizeInputPath(rawFixtureFile) {
  const absolutePath = path.resolve(process.cwd(), rawFixtureFile);
  const relativePath = path.relative(process.cwd(), absolutePath);
  if (relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath)) {
    return relativePath.split(path.sep).join("/");
  }
  return `external-fixture/${path.basename(absolutePath)}`;
}

function buildBoundary(fixture) {
  return {
    name: "v6.16_grounding_provenance_preview_boundary",
    preview_only: fixture.v6_16_preview,
    fixture_backed: fixture.fixture_backed,
    derived_only: fixture.derived_only,
    explanation_only: fixture.explanation_only,
    recommendation_only: fixture.recommendation_only,
    non_enforcing: fixture.non_enforcing,
    default_off: fixture.default_off,
    no_live_repo_state_reading: fixture.no_live_repo_state_reading,
    no_live_source_fetching: fixture.no_live_source_fetching,
    no_authority_contract_mutation: fixture.no_authority_contract_mutation,
  };
}

function buildInputRef(fixturePath, fixture) {
  return {
    kind: "fixture_file",
    fixture_file: normalizeInputPath(fixturePath),
    fixture_schema_version: fixture.schema_version,
    fixture_backed: true,
  };
}

function buildAdmissibilityReadiness() {
  return {
    reserved: true,
    evaluated: false,
    decision: null,
    reason: "reserved_for_future_admissibility_boundary",
  };
}

function buildEvidenceAdequacy(fixture) {
  return fixture.evidence_adequacy;
}

function buildNonEnforcementBoundary() {
  return {
    preview_only: true,
    enforced: false,
    blocks_execution: false,
    changes_exit_semantics: false,
  };
}

function buildReceiptLinkage(fixture) {
  return {
    grounding_explain_receipt_id: `${fixture.current_evidence_package.evidence_package_id}:grounding-explain:v6_16`,
    authority_explain_receipt_ref:
      fixture.current_evidence_package.authority_explain_receipt_ref ?? null,
    fixture_backed: true,
  };
}

function buildHashes(
  fixture,
  boundary,
  admissibilityReadiness,
  evidenceAdequacy,
  receiptLinkage,
  nonEnforcementBoundary
) {
  const evidenceHash = hashValue({
    evidence_items: fixture.current_evidence_package.evidence_items,
  });
  const sourceHash = hashValue({
    source_refs: fixture.current_evidence_package.source_refs,
    source_of_truth_refs: fixture.current_evidence_package.source_of_truth_refs,
  });
  const provenanceHash = hashValue({
    origin_type: fixture.provenance_classification.origin_type,
    source_depth: fixture.provenance_classification.source_depth,
    generation_count: fixture.provenance_classification.generation_count,
    transform_chain: fixture.provenance_classification.transform_chain,
    primary_source_available: fixture.provenance_classification.primary_source_available,
    verification_status: fixture.provenance_classification.verification_status,
  });
  const deterministicHash = hashValue({
    boundary,
    schema_version: GROUNDING_EXPLAIN_SCHEMA_VERSION,
    current_evidence_package: fixture.current_evidence_package,
    provenance_classification: fixture.provenance_classification,
    grounding_status: fixture.grounding_status,
    grounding_explanation: fixture.grounding_explanation,
    evidence_adequacy: evidenceAdequacy,
    admissibility_readiness: admissibilityReadiness,
    receipt_linkage: receiptLinkage,
    non_enforcement_boundary: nonEnforcementBoundary,
    evidence_hash: evidenceHash,
    source_hash: sourceHash,
    provenance_hash: provenanceHash,
  });

  return {
    evidence_hash: evidenceHash,
    source_hash: sourceHash,
    provenance_hash: provenanceHash,
    deterministic_hash: deterministicHash,
  };
}

function buildGroundingExplainResult(fixturePath, fixture) {
  const boundary = buildBoundary(fixture);
  const inputRef = buildInputRef(fixturePath, fixture);
  const admissibilityReadiness = buildAdmissibilityReadiness();
  const evidenceAdequacy = buildEvidenceAdequacy(fixture);
  const receiptLinkage = buildReceiptLinkage(fixture);
  const nonEnforcementBoundary = buildNonEnforcementBoundary();
  const hashes = buildHashes(
    fixture,
    boundary,
    admissibilityReadiness,
    evidenceAdequacy,
    receiptLinkage,
    nonEnforcementBoundary
  );

  return {
    boundary,
    command: "guard grounding explain",
    mode: "preview",
    schema_version: GROUNDING_EXPLAIN_SCHEMA_VERSION,
    input_ref: inputRef,
    current_evidence_package: {
      ...fixture.current_evidence_package,
      authority_explain_receipt_ref:
        fixture.current_evidence_package.authority_explain_receipt_ref ?? null,
    },
    provenance_classification: fixture.provenance_classification,
    grounding_status: fixture.grounding_status,
    grounding_explanation: fixture.grounding_explanation,
    evidence_adequacy: evidenceAdequacy,
    hashes,
    admissibility_readiness: admissibilityReadiness,
    receipt_linkage: receiptLinkage,
    non_enforcement_boundary: nonEnforcementBoundary,
  };
}

export function handleGroundingSubcommand(args) {
  const sub = args[0] || "";
  if (!sub || sub === "--help" || sub === "-h" || sub === "help") {
    return { exitCode: 0, stdout: renderGroundingHelp() + "\n" };
  }

  if (sub !== "explain") {
    return {
      exitCode: 2,
      stderr: `Unknown grounding command: ${sub}\n\n${renderGroundingHelp()}\n`,
    };
  }

  const argsResult = validateRequiredPreviewArgs(args.slice(1));
  if (argsResult.response) return argsResult.response;

  const loaded = loadValidatedGroundingFixture(argsResult.parsed);
  if (loaded.error) return loaded.error;

  return {
    exitCode: 0,
    stdout: JSON.stringify(buildGroundingExplainResult(loaded.fixturePath, loaded.fixture), null, 2) + "\n",
  };
}
