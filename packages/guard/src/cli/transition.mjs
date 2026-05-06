import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const EXIT_ERROR_DEFAULT = 30;
const TRANSITION_EXPLAIN_USAGE = "guard transition explain --preview --json --fixture-file <file>";
const TRANSITION_VALIDITY_SCHEMA_VERSION = "guard.execution_bound_transition_validity_preview.v1";
const REQUIRED_FIXTURE_FLAGS = [
  "preview",
  "explanation_only",
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
const ALLOWED_TRANSITION_STATUS = [
  "preserved",
  "changed",
  "partially_preserved",
  "not_applicable",
  "unknown",
];
const ALLOWED_FINDING_TYPES = [
  "prerequisite_preserved",
  "prerequisite_changed",
  "prerequisite_partially_preserved",
  "insufficient_transition_evidence",
  "not_applicable_to_transition",
];
const ALLOWED_VERIFICATION_SURFACES = [
  "fixture_declared",
  "receipt_ref_declared",
  "symbolic_mapping_ref_declared",
  "external_system_required",
  "human_review_required",
  "not_preview_determinable",
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
  "execution_permission",
  "state_equivalence_proof",
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
  "execution_permission",
  "state_equivalence_proof",
]);

function renderTransitionHelp() {
  return [
    "Usage:",
    `  ${TRANSITION_EXPLAIN_USAGE}`,
    "",
    "Options:",
    "  --preview             Required explicit preview opt-in",
    "  --json                Required JSON output mode",
    "  --fixture-file <file> Required transition validity fixture input",
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

function parseTransitionArgs(args) {
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

function findUnexpectedTransitionArg(args) {
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

function validateDeclaredTransition(declaredTransition, issues) {
  if (!isPlainObject(declaredTransition)) {
    issues.push("declared_transition must be an object");
    return;
  }

  for (const field of [
    "transition_set_id",
    "transition_summary",
    "comparison_mode",
  ]) {
    if (typeof declaredTransition[field] !== "string" || declaredTransition[field].length === 0) {
      issues.push(`declared_transition.${field} must be a non-empty string`);
    }
  }

  if (declaredTransition.fixture_backed !== true) {
    issues.push("declared_transition.fixture_backed must be true");
  }
  if (declaredTransition.comparison_mode !== "deterministic_summary_only") {
    issues.push("declared_transition.comparison_mode must be deterministic_summary_only");
  }
  if (!Array.isArray(declaredTransition.compared_summary_sources) || declaredTransition.compared_summary_sources.length === 0) {
    issues.push("declared_transition.compared_summary_sources must be a non-empty array");
  } else {
    for (const [index, source] of declaredTransition.compared_summary_sources.entries()) {
      if (typeof source !== "string" || source.length === 0) {
        issues.push(`declared_transition.compared_summary_sources[${index}] must be a non-empty string`);
      }
    }
  }
}

function validateCase(entry, issues, seenCaseIds, index) {
  if (!isPlainObject(entry)) {
    issues.push(`cases[${index}] must be an object`);
    return;
  }

  const requiredFields = [
    "case_id",
    "transition_id",
    "transition_status",
    "finding_type",
    "verification_surface",
    "prerequisite_ref",
    "source_version",
    "source_receipt_ref",
    "supporting_refs",
    "finding_summary",
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

  for (const field of [
    "transition_id",
    "prerequisite_ref",
    "source_version",
    "source_receipt_ref",
    "finding_summary",
  ]) {
    if (typeof entry[field] !== "string" || entry[field].length === 0) {
      issues.push(`cases[${index}].${field} must be a non-empty string`);
    }
  }

  if (!ALLOWED_TRANSITION_STATUS.includes(entry.transition_status)) {
    issues.push(`cases[${index}].transition_status must be allowed`);
  }
  if (!ALLOWED_FINDING_TYPES.includes(entry.finding_type)) {
    issues.push(`cases[${index}].finding_type must be allowed`);
  }
  if (!ALLOWED_VERIFICATION_SURFACES.includes(entry.verification_surface)) {
    issues.push(`cases[${index}].verification_surface must be allowed`);
  }

  if (!Array.isArray(entry.supporting_refs)) {
    issues.push(`cases[${index}].supporting_refs must be an array`);
  } else {
    for (const [supportIndex, supportRef] of entry.supporting_refs.entries()) {
      if (typeof supportRef !== "string" || supportRef.length === 0) {
        issues.push(`cases[${index}].supporting_refs[${supportIndex}] must be a non-empty string`);
      }
    }
    if (
      (entry.transition_status === "preserved" || entry.transition_status === "changed" || entry.transition_status === "partially_preserved") &&
      entry.supporting_refs.length === 0
    ) {
      issues.push(`cases[${index}] must include supporting_refs for ${entry.transition_status}`);
    }
  }

  if (
    "evidence_gap_summary" in entry &&
    entry.evidence_gap_summary !== null &&
    (typeof entry.evidence_gap_summary !== "string" || entry.evidence_gap_summary.length === 0)
  ) {
    issues.push(`cases[${index}].evidence_gap_summary must be null or a non-empty string`);
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

  validateDeclaredTransition(fixture.declared_transition, issues);

  if (!Array.isArray(fixture.cases) || fixture.cases.length === 0) {
    issues.push("fixture.cases must be a non-empty array");
  } else {
    const seenCaseIds = new Set();
    for (const [index, entry] of fixture.cases.entries()) {
      validateCase(entry, issues, seenCaseIds, index);
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
  const counts = Object.fromEntries(ALLOWED_TRANSITION_STATUS.map((status) => [status, 0]));
  for (const entry of fixture.cases) {
    counts[entry.transition_status] += 1;
  }
  return {
    case_count: fixture.cases.length,
    transition_status_counts: counts,
    prerequisite_ref_count: buildPrerequisiteRefs(fixture).length,
    fixture_backed: true,
    no_live_repo_state_reading: true,
    no_live_source_fetching: true,
    no_external_calls: true,
  };
}

function buildDeclaredTransition(fixture) {
  return {
    transition_set_id: fixture.declared_transition.transition_set_id,
    transition_summary: fixture.declared_transition.transition_summary,
    compared_summary_sources: [...fixture.declared_transition.compared_summary_sources],
    fixture_backed: true,
    comparison_mode: "deterministic_summary_only",
  };
}

function buildPrerequisiteRefs(fixture) {
  const seen = new Set();
  const refs = [];

  for (const entry of fixture.cases) {
    const key = `${entry.prerequisite_ref}::${entry.source_version}`;
    if (seen.has(key)) continue;
    seen.add(key);
    refs.push({
      prerequisite_ref: entry.prerequisite_ref,
      source_version: entry.source_version,
      source_receipt_ref: entry.source_receipt_ref,
      verification_surface: entry.verification_surface,
    });
  }

  return refs;
}

function buildTransitionFindings(fixture) {
  return fixture.cases.map((entry) => ({
    case_id: entry.case_id,
    transition_id: entry.transition_id,
    transition_status: entry.transition_status,
    finding_type: entry.finding_type,
    verification_surface: entry.verification_surface,
    prerequisite_ref: entry.prerequisite_ref,
    source_version: entry.source_version,
    source_receipt_ref: entry.source_receipt_ref,
    supporting_refs: [...entry.supporting_refs],
    finding_summary: entry.finding_summary,
    evidence_gap_summary: entry.evidence_gap_summary ?? null,
  }));
}

function buildPreservationSummary(fixture) {
  const counts = Object.fromEntries(ALLOWED_TRANSITION_STATUS.map((status) => [status, 0]));
  let humanReviewCaseCount = 0;
  let externalSystemCaseCount = 0;

  for (const entry of fixture.cases) {
    counts[entry.transition_status] += 1;
    if (entry.verification_surface === "human_review_required") humanReviewCaseCount += 1;
    if (entry.verification_surface === "external_system_required") externalSystemCaseCount += 1;
  }

  return {
    transition_status_counts: counts,
    human_review_case_count: humanReviewCaseCount,
    external_system_case_count: externalSystemCaseCount,
    deterministic_preview_only: true,
  };
}

function buildNonEnforcementBoundary() {
  return {
    explanation_only: true,
    enforcement_action: "none",
    blocking_effect: false,
    execution_authority_granted: false,
    does_not_grant_execution_permission: true,
    does_not_create_commit_gate: true,
    does_not_create_permit_gate: true,
    does_not_create_deployment_gate: true,
    does_not_create_runtime_enforcement: true,
    does_not_prove_state_equivalence: true,
  };
}

function buildPreviewPayload(fixturePath, fixture) {
  const payloadWithoutHash = {
    schema_version: TRANSITION_VALIDITY_SCHEMA_VERSION,
    preview: true,
    explanation_only: true,
    recommendation_only: true,
    non_executing: true,
    additive_only: true,
    enforcement_action: "none",
    blocking_effect: false,
    execution_authority_granted: false,
    input_ref: buildInputRef(fixturePath, fixture),
    input_summary: buildInputSummary(fixture),
    declared_transition: buildDeclaredTransition(fixture),
    prerequisite_refs: buildPrerequisiteRefs(fixture),
    transition_findings: buildTransitionFindings(fixture),
    preservation_summary: buildPreservationSummary(fixture),
    non_enforcement_boundary: buildNonEnforcementBoundary(),
  };

  return {
    ...payloadWithoutHash,
    deterministic_hash: hashValue(payloadWithoutHash),
  };
}

function validateRequiredPreviewArgs(args) {
  const unexpectedArg = findUnexpectedTransitionArg(args);
  if (unexpectedArg) {
    const message = unexpectedArg.startsWith("--")
      ? `Unknown option: ${unexpectedArg}`
      : `Unexpected argument: ${unexpectedArg}`;
    return { response: usageError(message, TRANSITION_EXPLAIN_USAGE) };
  }

  const parsed = parseTransitionArgs(args);
  if (parsed.help) return { response: { exitCode: 0, stdout: renderTransitionHelp() + "\n" } };
  if (!parsed.preview) {
    return { response: usageError("Missing required option: --preview", TRANSITION_EXPLAIN_USAGE) };
  }
  if (!parsed.json) {
    return { response: usageError("Missing required option: --json", TRANSITION_EXPLAIN_USAGE) };
  }
  if (!parsed.fixtureFile) {
    return { response: usageError("Missing required option: --fixture-file", TRANSITION_EXPLAIN_USAGE) };
  }
  return { parsed };
}

export function handleTransitionSubcommand(args) {
  const sub = args[0] || "";
  if (sub !== "explain") {
    return {
      exitCode: 2,
      stderr: `Unknown transition command: ${sub}\n\n${renderTransitionHelp()}\n`,
    };
  }

  const argsResult = validateRequiredPreviewArgs(args.slice(1));
  if (argsResult.response) return argsResult.response;

  const { parsed } = argsResult;
  const readResult = readJson(
    parsed.fixtureFile,
    "transition_validity_preview_fixture_missing",
    "transition_validity_preview_fixture_invalid_json"
  );
  if (readResult.error) return readResult.error;

  const fixture = readResult.value;
  const issues = validateFixture(fixture);
  if (issues.length > 0) {
    return failure(
      "transition_validity_preview_contract_invalid",
      "Fixture does not satisfy the execution-bound transition validity preview contract.",
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
