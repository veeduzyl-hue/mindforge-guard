import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const EXIT_ERROR_DEFAULT = 30;
const GUARDRAIL_MAP_USAGE = "guard guardrail map --preview --json --fixture-file <file>";
const GUARDRAIL_MAPPING_SCHEMA_VERSION = "guard.symbolic_guardrail_mapping.v1";
const REQUIRED_FIXTURE_FLAGS = [
  "preview",
  "mapping_only",
  "recommendation_only",
  "non_executing",
  "additive_only",
  "fixture_backed",
  "derived_only",
  "no_live_repo_state_reading",
  "no_live_source_fetching",
  "no_external_calls",
  "no_runtime_enforcement",
  "no_authority_expansion",
];
const ALLOWED_GUARDRAIL_TYPES = [
  "schema_constraint",
  "api_validation",
  "state_check",
  "evidence_check",
  "capability_check",
  "context_check",
  "confirmation_required",
];
const ALLOWED_MAPPING_STATUS = [
  "mapped",
  "partially_mapped",
  "unmapped",
  "out_of_scope",
  "unknown",
];
const ALLOWED_VERIFICATION_SURFACES = [
  "fixture_declared",
  "schema_declared",
  "external_system_required",
  "human_review_required",
  "not_symbolically_mappable",
];
const FORBIDDEN_FIELDS = new Set([
  "admit",
  "deny",
  "defer",
  "allow",
  "block",
  "pass",
  "fail",
  "guardrail_passed",
  "guardrail_failed",
  "permit",
  "commit",
  "deploy",
  "enforcement_decision",
  "policy_decision",
]);
const FORBIDDEN_VALUES = new Set([
  "admit",
  "deny",
  "defer",
  "allow",
  "block",
  "pass",
  "fail",
  "guardrail_passed",
  "guardrail_failed",
  "permit",
  "commit",
  "deploy",
  "enforcement_decision",
  "policy_decision",
]);

function renderGuardrailHelp() {
  return [
    "Usage:",
    `  ${GUARDRAIL_MAP_USAGE}`,
    "",
    "Options:",
    "  --preview             Required explicit preview opt-in",
    "  --json                Required JSON output mode",
    "  --fixture-file <file> Required symbolic mapping fixture input",
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

function parseGuardrailArgs(args) {
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

function findUnexpectedGuardrailArg(args) {
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

function walk(value, visit) {
  visit(value);
  if (Array.isArray(value)) {
    for (const entry of value) walk(entry, visit);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      visit(key);
      walk(entry, visit);
    }
  }
}

function validateNoForbiddenDecisionSemantics(value, issues, label) {
  walk(value, (entry) => {
    if (typeof entry === "string" && FORBIDDEN_FIELDS.has(entry)) {
      issues.push(`${label} contains forbidden field ${entry}`);
    }
    if (typeof entry === "string" && FORBIDDEN_VALUES.has(entry.toLowerCase())) {
      issues.push(`${label} contains forbidden value ${entry}`);
    }
  });
}

function normalizeInputPath(rawFixtureFile) {
  const absolutePath = path.resolve(process.cwd(), rawFixtureFile);
  const relativePath = path.relative(process.cwd(), absolutePath);
  if (relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath)) {
    return relativePath.split(path.sep).join("/");
  }
  return absolutePath.split(path.sep).join("/");
}

function validateCase(entry, issues, seenCaseIds, seenRequirementIds, index) {
  if (!isPlainObject(entry)) {
    issues.push(`cases[${index}] must be an object`);
    return;
  }

  const requiredFields = [
    "case_id",
    "requirement_id",
    "requirement_text",
    "guardrail_type",
    "mapping_status",
    "verification_surface",
    "symbolic_surfaces",
    "mapping_explanation",
  ];
  for (const field of requiredFields) {
    if (!(field in entry)) issues.push(`cases[${index}] missing ${field}`);
  }

  if (typeof entry.case_id !== "string" || entry.case_id.length === 0) {
    issues.push(`cases[${index}].case_id must be a non-empty string`);
  } else if (seenCaseIds.has(entry.case_id)) {
    issues.push(`duplicate case_id ${entry.case_id}`);
  } else {
    seenCaseIds.add(entry.case_id);
  }

  if (typeof entry.requirement_id !== "string" || entry.requirement_id.length === 0) {
    issues.push(`cases[${index}].requirement_id must be a non-empty string`);
  } else if (seenRequirementIds.has(entry.requirement_id)) {
    issues.push(`duplicate requirement_id ${entry.requirement_id}`);
  } else {
    seenRequirementIds.add(entry.requirement_id);
  }

  if (typeof entry.requirement_text !== "string" || entry.requirement_text.length === 0) {
    issues.push(`cases[${index}].requirement_text must be a non-empty string`);
  }
  if (!ALLOWED_GUARDRAIL_TYPES.includes(entry.guardrail_type)) {
    issues.push(`cases[${index}].guardrail_type must be allowed`);
  }
  if (!ALLOWED_MAPPING_STATUS.includes(entry.mapping_status)) {
    issues.push(`cases[${index}].mapping_status must be allowed`);
  }
  if (!ALLOWED_VERIFICATION_SURFACES.includes(entry.verification_surface)) {
    issues.push(`cases[${index}].verification_surface must be allowed`);
  }
  if (!Array.isArray(entry.symbolic_surfaces)) {
    issues.push(`cases[${index}].symbolic_surfaces must be an array`);
  } else {
    for (const [surfaceIndex, surface] of entry.symbolic_surfaces.entries()) {
      if (typeof surface !== "string" || surface.length === 0) {
        issues.push(`cases[${index}].symbolic_surfaces[${surfaceIndex}] must be a non-empty string`);
      }
    }
    if (
      (entry.mapping_status === "mapped" || entry.mapping_status === "partially_mapped") &&
      entry.symbolic_surfaces.length === 0
    ) {
      issues.push(`cases[${index}] must include symbolic surfaces for ${entry.mapping_status}`);
    }
  }
  if (typeof entry.mapping_explanation !== "string" || entry.mapping_explanation.length === 0) {
    issues.push(`cases[${index}].mapping_explanation must be a non-empty string`);
  }
  if (
    "coverage_gap_summary" in entry &&
    entry.coverage_gap_summary !== null &&
    (typeof entry.coverage_gap_summary !== "string" || entry.coverage_gap_summary.length === 0)
  ) {
    issues.push(`cases[${index}].coverage_gap_summary must be null or a non-empty string`);
  }
}

function validateFixture(fixture) {
  const issues = [];
  if (!isPlainObject(fixture)) {
    issues.push("fixture must be a JSON object");
    return issues;
  }

  if (typeof fixture.schema_version !== "string" || fixture.schema_version.length === 0) {
    issues.push("fixture.schema_version must be a non-empty string");
  }

  for (const flag of REQUIRED_FIXTURE_FLAGS) {
    if (!(flag in fixture)) {
      issues.push(`missing boundary flag ${flag}`);
    } else if (fixture[flag] !== true) {
      issues.push(`boundary flag ${flag} must be true`);
    }
  }

  if (!Array.isArray(fixture.cases) || fixture.cases.length === 0) {
    issues.push("fixture.cases must be a non-empty array");
  } else {
    const seenCaseIds = new Set();
    const seenRequirementIds = new Set();
    for (const [index, entry] of fixture.cases.entries()) {
      validateCase(entry, issues, seenCaseIds, seenRequirementIds, index);
    }
  }

  validateNoForbiddenDecisionSemantics(fixture, issues, "fixture");
  return issues;
}

function buildInputRef(fixturePath, fixture) {
  return {
    kind: "fixture_file",
    fixture_file: normalizeInputPath(fixturePath),
    fixture_schema_version: fixture.schema_version,
    fixture_backed: true,
  };
}

function buildInputSummary(fixture) {
  const counts = Object.fromEntries(ALLOWED_MAPPING_STATUS.map((status) => [status, 0]));
  for (const entry of fixture.cases) {
    counts[entry.mapping_status] += 1;
  }
  return {
    case_count: fixture.cases.length,
    requirement_count: fixture.cases.length,
    mapping_status_counts: counts,
    fixture_backed: true,
    no_live_repo_state_reading: true,
    no_live_source_fetching: true,
    no_external_calls: true,
  };
}

function buildRequirements(fixture) {
  return fixture.cases.map((entry) => ({
    case_id: entry.case_id,
    requirement_id: entry.requirement_id,
    requirement_text: entry.requirement_text,
    guardrail_type: entry.guardrail_type,
  }));
}

function buildMappings(fixture) {
  return fixture.cases.map((entry) => ({
    case_id: entry.case_id,
    requirement_id: entry.requirement_id,
    guardrail_type: entry.guardrail_type,
    mapping_status: entry.mapping_status,
    verification_surface: entry.verification_surface,
    symbolic_surfaces: [...entry.symbolic_surfaces],
    mapping_explanation: entry.mapping_explanation,
    coverage_gap_summary: entry.coverage_gap_summary ?? null,
  }));
}

function buildUnmappedRequirements(fixture) {
  return fixture.cases
    .filter((entry) => entry.mapping_status === "unmapped")
    .map((entry) => ({
      requirement_id: entry.requirement_id,
      requirement_text: entry.requirement_text,
      verification_surface: entry.verification_surface,
      mapping_explanation: entry.mapping_explanation,
    }));
}

function buildNonEnforcementBoundary() {
  return {
    mapping_only: true,
    enforcement_action: "none",
    blocking_effect: false,
    execution_authority_granted: false,
    does_not_evaluate_guardrail_result: true,
    does_not_create_policy_engine: true,
    does_not_create_commit_gate: true,
    does_not_create_permit_gate: true,
    does_not_create_deployment_gate: true,
  };
}

function buildPreviewPayload(fixturePath, fixture) {
  const payloadWithoutHash = {
    schema_version: GUARDRAIL_MAPPING_SCHEMA_VERSION,
    preview: true,
    mapping_only: true,
    recommendation_only: true,
    non_executing: true,
    additive_only: true,
    enforcement_action: "none",
    blocking_effect: false,
    execution_authority_granted: false,
    input_ref: buildInputRef(fixturePath, fixture),
    input_summary: buildInputSummary(fixture),
    requirements: buildRequirements(fixture),
    mappings: buildMappings(fixture),
    unmapped_requirements: buildUnmappedRequirements(fixture),
    non_enforcement_boundary: buildNonEnforcementBoundary(),
  };

  return {
    ...payloadWithoutHash,
    deterministic_hash: hashValue(payloadWithoutHash),
  };
}

function validateRequiredPreviewArgs(args) {
  const unexpectedArg = findUnexpectedGuardrailArg(args);
  if (unexpectedArg) {
    const message = unexpectedArg.startsWith("--")
      ? `Unknown option: ${unexpectedArg}`
      : `Unexpected argument: ${unexpectedArg}`;
    return { response: usageError(message, GUARDRAIL_MAP_USAGE) };
  }

  const parsed = parseGuardrailArgs(args);
  if (parsed.help) return { response: { exitCode: 0, stdout: renderGuardrailHelp() + "\n" } };
  if (!parsed.preview) {
    return { response: usageError("Missing required option: --preview", GUARDRAIL_MAP_USAGE) };
  }
  if (!parsed.json) {
    return { response: usageError("Missing required option: --json", GUARDRAIL_MAP_USAGE) };
  }
  if (!parsed.fixtureFile) {
    return { response: usageError("Missing required option: --fixture-file", GUARDRAIL_MAP_USAGE) };
  }
  return { parsed };
}

export function handleGuardrailSubcommand(args) {
  const sub = args[0] || "";
  if (sub !== "map") {
    return {
      exitCode: 2,
      stderr: `Unknown guardrail command: ${sub}\n\n${renderGuardrailHelp()}\n`,
    };
  }

  const argsResult = validateRequiredPreviewArgs(args.slice(1));
  if (argsResult.response) return argsResult.response;

  const { parsed } = argsResult;
  const readResult = readJson(
    parsed.fixtureFile,
    "guardrail_mapping_preview_fixture_missing",
    "guardrail_mapping_preview_fixture_invalid_json"
  );
  if (readResult.error) return readResult.error;

  const fixture = readResult.value;
  const issues = validateFixture(fixture);
  if (issues.length > 0) {
    return failure(
      "guardrail_mapping_preview_contract_invalid",
      "Fixture does not satisfy the symbolic guardrail mapping preview contract.",
      {
        path: parsed.fixtureFile,
        issues,
      }
    );
  }

  const payload = buildPreviewPayload(parsed.fixtureFile, fixture);
  return {
    exitCode: 0,
    stdout: JSON.stringify(payload, null, 2) + "\n",
  };
}
