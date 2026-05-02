import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..");
const schemaPath = path.join(
  repoRoot,
  "schemas",
  "admissibility",
  "admissibility-explain-preview.schema.json"
);

const EXIT_ERROR_DEFAULT = 30;
const ADMISSIBILITY_EXPLAIN_USAGE = "guard admissibility explain --preview --json --fixture-file <file>";
const ADMISSIBILITY_EXPLAIN_SCHEMA_VERSION = "guard.admissibility_explain_preview.v6_17";
const ADMISSIBILITY_RESULT_RESERVED_SCHEMA_VERSION = "guard.admissibility_result.reserved.v2";
const ALLOWED_PREREQUISITE_STATES = [
  "explanation_ready",
  "explanation_incomplete",
  "explanation_blocked",
  "explanation_unknown",
];
const REQUIRED_BOUNDARY_FLAGS = [
  "v6_17_preview",
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
  "no_permit_gate",
  "no_deployment_gate",
  "no_runtime_enforcement",
  "no_authority_contract_mutation",
];
const FORBIDDEN_FIELDS = [
  "admit",
  "deny",
  "defer",
  "approved",
  "rejected",
  "commit_gate",
  "permit_gate",
  "deployment_gate",
  "runtime_enforcement",
  "requires_human_confirmation",
];
const FORBIDDEN_STRING_VALUES = [
  "admit",
  "deny",
  "defer",
  "approved",
  "rejected",
  "allowed",
  "blocked_by_gate",
  "requires_human_confirmation",
];

function renderAdmissibilityHelp() {
  return [
    "Usage:",
    `  ${ADMISSIBILITY_EXPLAIN_USAGE}`,
    "",
    "Options:",
    "  --preview             Required explicit preview opt-in",
    "  --json                Required JSON output mode",
    "  --fixture-file <file> Required admissibility boundary fixture input",
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

function parseAdmissibilityArgs(args) {
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

function findUnexpectedAdmissibilityArg(args) {
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

  const topLevelRequired = [
    "authority_context",
    "grounding_context",
    "admissibility_input_package",
    "admissibility_prerequisite_matrix",
    "admissibility_explanation",
  ];
  for (const field of topLevelRequired) {
    if (!schema?.required?.includes(field)) issues.push(`schema.required missing ${field}`);
  }

  const stateEnum = schema?.$defs?.prerequisiteState?.enum;
  if (!Array.isArray(stateEnum)) {
    issues.push("schema $defs.prerequisiteState.enum must exist");
  } else {
    for (const value of ALLOWED_PREREQUISITE_STATES) {
      if (!stateEnum.includes(value)) issues.push(`prerequisiteState enum missing ${value}`);
    }
    for (const actual of stateEnum) {
      if (!ALLOWED_PREREQUISITE_STATES.includes(actual)) {
        issues.push(`prerequisiteState enum contains unexpected value ${actual}`);
      }
    }
  }

  return issues;
}

function validateState(value, label, issues) {
  if (!ALLOWED_PREREQUISITE_STATES.includes(value)) {
    issues.push(`${label} must be one of ${ALLOWED_PREREQUISITE_STATES.join(", ")}`);
  }
}

function validateFixture(fixture) {
  const issues = [];

  for (const flag of REQUIRED_BOUNDARY_FLAGS) {
    if (!(flag in fixture)) issues.push(`missing boundary flag ${flag}`);
    else if (fixture[flag] !== true) issues.push(`boundary flag ${flag} must be true`);
  }

  const authorityContext = fixture?.authority_context;
  if (!isPlainObject(authorityContext)) {
    issues.push("authority_context must exist");
  } else {
    for (const field of [
      "authority_explain_receipt_ref",
      "current_state_context_ref",
      "bind_time_validity_ref",
      "summary",
    ]) {
      if (typeof authorityContext[field] !== "string" || authorityContext[field].length === 0) {
        issues.push(`authority_context.${field} must be a non-empty string`);
      }
    }
    validateState(authorityContext.current_state_context_state, "authority_context.current_state_context_state", issues);
    validateState(authorityContext.bind_time_validity_state, "authority_context.bind_time_validity_state", issues);
    if (authorityContext.explanation_only !== true) {
      issues.push("authority_context.explanation_only must be true");
    }
    if (authorityContext.fixture_backed !== true) {
      issues.push("authority_context.fixture_backed must be true");
    }
    if (typeof authorityContext.protected_surfaces_touched !== "boolean") {
      issues.push("authority_context.protected_surfaces_touched must be a boolean");
    }
  }

  const groundingContext = fixture?.grounding_context;
  if (!isPlainObject(groundingContext)) {
    issues.push("grounding_context must exist");
  } else {
    for (const field of [
      "grounding_explain_receipt_ref",
      "current_evidence_package_ref",
      "evidence_adequacy_ref",
      "grounding_state",
      "summary",
    ]) {
      if (typeof groundingContext[field] !== "string" || groundingContext[field].length === 0) {
        issues.push(`grounding_context.${field} must be a non-empty string`);
      }
    }
    validateState(groundingContext.evidence_lineage_state, "grounding_context.evidence_lineage_state", issues);
    if (groundingContext.explanation_only !== true) {
      issues.push("grounding_context.explanation_only must be true");
    }
    if (groundingContext.fixture_backed !== true) {
      issues.push("grounding_context.fixture_backed must be true");
    }
    if (groundingContext.supporting_only !== true) {
      issues.push("grounding_context.supporting_only must be true");
    }
  }

  const inputPackage = fixture?.admissibility_input_package;
  if (!isPlainObject(inputPackage)) {
    issues.push("admissibility_input_package must exist");
  } else {
    for (const field of [
      "authority_explain_receipt_ref",
      "grounding_explain_receipt_ref",
      "current_state_context_ref",
      "bind_time_validity_ref",
      "current_evidence_package_ref",
      "evidence_adequacy_ref",
    ]) {
      if (typeof inputPackage[field] !== "string" || inputPackage[field].length === 0) {
        issues.push(`admissibility_input_package.${field} must be a non-empty string`);
      }
    }
    validateState(inputPackage.input_completeness, "admissibility_input_package.input_completeness", issues);
    validateState(inputPackage.input_consistency, "admissibility_input_package.input_consistency", issues);
  }

  const matrix = fixture?.admissibility_prerequisite_matrix;
  if (!isPlainObject(matrix) || Object.keys(matrix).length === 0) {
    issues.push("admissibility_prerequisite_matrix must be a non-empty object");
  } else {
    for (const [key, entry] of Object.entries(matrix)) {
      if (!isPlainObject(entry)) {
        issues.push(`admissibility_prerequisite_matrix.${key} must be an object`);
        continue;
      }
      validateState(entry.state, `admissibility_prerequisite_matrix.${key}.state`, issues);
      if (entry.explanation_only !== true) {
        issues.push(`admissibility_prerequisite_matrix.${key}.explanation_only must be true`);
      }
      if (entry.decision_effect !== false) {
        issues.push(`admissibility_prerequisite_matrix.${key}.decision_effect must be false`);
      }
      if (typeof entry.basis_ref !== "string" || entry.basis_ref.length === 0) {
        issues.push(`admissibility_prerequisite_matrix.${key}.basis_ref must be a non-empty string`);
      }
      if (typeof entry.reason !== "string" || entry.reason.length === 0) {
        issues.push(`admissibility_prerequisite_matrix.${key}.reason must be a non-empty string`);
      }
    }
  }

  const explanation = fixture?.admissibility_explanation;
  if (!isPlainObject(explanation)) {
    issues.push("admissibility_explanation must exist");
  } else {
    validateState(explanation.readiness_state, "admissibility_explanation.readiness_state", issues);
    if (typeof explanation.summary !== "string" || explanation.summary.length === 0) {
      issues.push("admissibility_explanation.summary must be a non-empty string");
    }
    if (!Array.isArray(explanation.basis) || explanation.basis.length === 0) {
      issues.push("admissibility_explanation.basis must be a non-empty array");
    }
    if (!Array.isArray(explanation.limitations)) {
      issues.push("admissibility_explanation.limitations must be an array");
    }
  }

  if (
    authorityContext &&
    inputPackage &&
    authorityContext.authority_explain_receipt_ref !== inputPackage.authority_explain_receipt_ref
  ) {
    issues.push("authority explain receipt refs must align between authority_context and admissibility_input_package");
  }
  if (authorityContext && inputPackage && authorityContext.current_state_context_ref !== inputPackage.current_state_context_ref) {
    issues.push("current state context refs must align between authority_context and admissibility_input_package");
  }
  if (authorityContext && inputPackage && authorityContext.bind_time_validity_ref !== inputPackage.bind_time_validity_ref) {
    issues.push("bind-time validity refs must align between authority_context and admissibility_input_package");
  }
  if (
    groundingContext &&
    inputPackage &&
    groundingContext.grounding_explain_receipt_ref !== inputPackage.grounding_explain_receipt_ref
  ) {
    issues.push("grounding explain receipt refs must align between grounding_context and admissibility_input_package");
  }
  if (
    groundingContext &&
    inputPackage &&
    groundingContext.current_evidence_package_ref !== inputPackage.current_evidence_package_ref
  ) {
    issues.push("current evidence package refs must align between grounding_context and admissibility_input_package");
  }
  if (groundingContext && inputPackage && groundingContext.evidence_adequacy_ref !== inputPackage.evidence_adequacy_ref) {
    issues.push("evidence adequacy refs must align between grounding_context and admissibility_input_package");
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
  const unexpectedArg = findUnexpectedAdmissibilityArg(args);
  if (unexpectedArg) {
    const message = unexpectedArg.startsWith("--")
      ? `Unknown option: ${unexpectedArg}`
      : `Unexpected argument: ${unexpectedArg}`;
    return { response: usageError(message, ADMISSIBILITY_EXPLAIN_USAGE) };
  }

  const parsed = parseAdmissibilityArgs(args);
  if (parsed.help) return { response: { exitCode: 0, stdout: renderAdmissibilityHelp() + "\n" } };
  if (!parsed.preview) {
    return { response: usageError("Missing required option: --preview", ADMISSIBILITY_EXPLAIN_USAGE) };
  }
  if (!parsed.json) {
    return { response: usageError("Missing required option: --json", ADMISSIBILITY_EXPLAIN_USAGE) };
  }
  if (!parsed.fixtureFile) {
    return { response: usageError("Missing required option: --fixture-file", ADMISSIBILITY_EXPLAIN_USAGE) };
  }
  return { parsed };
}

function loadValidatedAdmissibilityFixture(parsed) {
  const schemaRead = readJson(
    schemaPath,
    "admissibility_preview_schema_missing",
    "admissibility_preview_schema_invalid_json"
  );
  if (schemaRead.error) return schemaRead;

  const fixturePath = path.resolve(process.cwd(), parsed.fixtureFile);
  const fixtureRead = readJson(
    fixturePath,
    "admissibility_preview_fixture_missing",
    "admissibility_preview_fixture_invalid_json"
  );
  if (fixtureRead.error) return fixtureRead;

  const schemaIssues = validateSchema(schemaRead.value);
  if (schemaIssues.length > 0) {
    return {
      error: failure(
        "admissibility_preview_schema_invalid",
        "Admissibility preview schema contract is invalid.",
        { path: schemaPath, issues: schemaIssues }
      ),
    };
  }

  const fixtureIssues = validateFixture(fixtureRead.value);
  if (fixtureIssues.length > 0) {
    return {
      error: failure(
        "admissibility_preview_contract_invalid",
        "Admissibility preview fixture failed contract validation.",
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
    name: "v6.17_admissibility_readiness_explanation_preview_boundary",
    preview_only: fixture.v6_17_preview,
    fixture_backed: fixture.fixture_backed,
    derived_only: fixture.derived_only,
    explanation_only: fixture.explanation_only,
    recommendation_only: fixture.recommendation_only,
    non_enforcing: fixture.non_enforcing,
    default_off: fixture.default_off,
    no_live_repo_state_reading: fixture.no_live_repo_state_reading,
    no_live_source_fetching: fixture.no_live_source_fetching,
    no_admissibility_decision: fixture.no_admissibility_decision,
    no_commit_gate: fixture.no_commit_gate,
    no_permit_gate: fixture.no_permit_gate,
    no_deployment_gate: fixture.no_deployment_gate,
    no_runtime_enforcement: fixture.no_runtime_enforcement,
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

function buildAuthorityContext(fixture) {
  return {
    ...fixture.authority_context,
    decision_effect: false,
  };
}

function buildGroundingContext(fixture) {
  return {
    ...fixture.grounding_context,
    decision_effect: false,
  };
}

function buildAdmissibilityInputPackage(fixture, authorityContext, groundingContext) {
  const inputPackageHash = hashValue({
    authority_explain_receipt_ref: authorityContext.authority_explain_receipt_ref,
    grounding_explain_receipt_ref: groundingContext.grounding_explain_receipt_ref,
    current_state_context_ref: authorityContext.current_state_context_ref,
    bind_time_validity_ref: authorityContext.bind_time_validity_ref,
    current_evidence_package_ref: groundingContext.current_evidence_package_ref,
    evidence_adequacy_ref: groundingContext.evidence_adequacy_ref,
    input_completeness: fixture.admissibility_input_package.input_completeness,
    input_consistency: fixture.admissibility_input_package.input_consistency,
  });

  return {
    authority_explain_receipt_ref: authorityContext.authority_explain_receipt_ref,
    grounding_explain_receipt_ref: groundingContext.grounding_explain_receipt_ref,
    current_state_context_ref: authorityContext.current_state_context_ref,
    bind_time_validity_ref: authorityContext.bind_time_validity_ref,
    current_evidence_package_ref: groundingContext.current_evidence_package_ref,
    evidence_adequacy_ref: groundingContext.evidence_adequacy_ref,
    input_completeness: fixture.admissibility_input_package.input_completeness,
    input_consistency: fixture.admissibility_input_package.input_consistency,
    input_package_hash: inputPackageHash,
  };
}

function buildAdmissibilityResult() {
  return {
    schema_version: ADMISSIBILITY_RESULT_RESERVED_SCHEMA_VERSION,
    status: "reserved",
    evaluated: false,
    result: "not_evaluated",
    decision: null,
    reason: "reserved_for_future_admissibility_decision_boundary",
  };
}

function buildReceiptLinkage(admissibilityInputPackage) {
  return {
    admissibility_explain_receipt_id:
      `${admissibilityInputPackage.authority_explain_receipt_ref}:` +
      `${admissibilityInputPackage.grounding_explain_receipt_ref}:admissibility-explain:v6_17`,
    authority_explain_receipt_ref: admissibilityInputPackage.authority_explain_receipt_ref,
    grounding_explain_receipt_ref: admissibilityInputPackage.grounding_explain_receipt_ref,
    fixture_backed: true,
  };
}

function buildNonEnforcementBoundary() {
  return {
    preview_only: true,
    explanation_only: true,
    enforced: false,
    changes_exit_semantics: false,
    admissibility_decision_evaluated: false,
    permission_granted: false,
    commit_gate_triggered: false,
    permit_gate_triggered: false,
    deployment_gate_triggered: false,
    runtime_enforcement_triggered: false,
    enforcement_effect: "none",
  };
}

function buildAdmissibilityExplainResult(fixturePath, fixture) {
  const boundary = buildBoundary(fixture);
  const inputRef = buildInputRef(fixturePath, fixture);
  const authorityContext = buildAuthorityContext(fixture);
  const groundingContext = buildGroundingContext(fixture);
  const admissibilityInputPackage = buildAdmissibilityInputPackage(
    fixture,
    authorityContext,
    groundingContext
  );
  const admissibilityResult = buildAdmissibilityResult();
  const receiptLinkage = buildReceiptLinkage(admissibilityInputPackage);
  const nonEnforcementBoundary = buildNonEnforcementBoundary();

  const payloadWithoutHash = {
    boundary,
    command: "guard admissibility explain",
    mode: "preview",
    schema_version: ADMISSIBILITY_EXPLAIN_SCHEMA_VERSION,
    input_ref: inputRef,
    authority_context: authorityContext,
    grounding_context: groundingContext,
    admissibility_input_package: admissibilityInputPackage,
    admissibility_prerequisite_matrix: fixture.admissibility_prerequisite_matrix,
    admissibility_explanation: {
      ...fixture.admissibility_explanation,
      decision_effect: false,
    },
    admissibility_result: admissibilityResult,
    receipt_linkage: receiptLinkage,
    non_enforcement_boundary: nonEnforcementBoundary,
  };

  return {
    ...payloadWithoutHash,
    deterministic_hash: hashValue(payloadWithoutHash),
  };
}

export function handleAdmissibilitySubcommand(args) {
  const sub = args[0] || "";
  if (!sub || sub === "--help" || sub === "-h" || sub === "help") {
    return { exitCode: 0, stdout: renderAdmissibilityHelp() + "\n" };
  }

  if (sub !== "explain") {
    return {
      exitCode: 2,
      stderr: `Unknown admissibility command: ${sub}\n\n${renderAdmissibilityHelp()}\n`,
    };
  }

  const argsResult = validateRequiredPreviewArgs(args.slice(1));
  if (argsResult.response) return argsResult.response;

  const loaded = loadValidatedAdmissibilityFixture(argsResult.parsed);
  if (loaded.error) return loaded.error;

  return {
    exitCode: 0,
    stdout: JSON.stringify(buildAdmissibilityExplainResult(loaded.fixturePath, loaded.fixture), null, 2) + "\n",
  };
}
