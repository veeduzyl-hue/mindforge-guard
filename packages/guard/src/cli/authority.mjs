import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..");
const schemaPath = path.join(repoRoot, "schemas", "authority", "authority-boundary.schema.json");

const EXIT_ERROR_DEFAULT = 30;
const REQUIRED_POSTURE_FLAGS = [
  "v6_14_preview",
  "recommendation_only",
  "non_executing",
  "default_off",
  "machine_verifiable",
  "no_execution_authority",
  "no_commit_gate_semantics",
  "no_license_gating_semantic_change",
  "no_current_cli_contract_change",
  "no_current_exit_code_semantic_change",
];
const ALLOWED_DECISIONS = [
  "inside_scope",
  "outside_scope",
  "needs_review",
  "insufficient_context",
];
const FORBIDDEN_FIELDS = [
  "approval_authority",
  "commit_gate",
  "deployment_gate",
  "deployment_authority",
];
const AUTHORITY_CHECK_USAGE = "guard authority check --preview --json --fixture-file <file>";
const AUTHORITY_EXPLAIN_USAGE = "guard authority explain --preview --json --fixture-file <file>";
const AUTHORITY_EXPLAIN_SCHEMA_VERSION = "guard.authority_explain_preview.v6_15";
const CONSTRUCTIBLE_CURRENT_STATE_SCHEMA_VERSION = "guard.constructible_current_state.v1";
const BIND_TIME_VALIDITY_SCHEMA_VERSION = "guard.bind_time_validity.v1";
const ADMISSIBILITY_RESULT_RESERVED_SCHEMA_VERSION = "guard.admissibility_result.reserved.v1";
const COMMITMENT_CANDIDATE_RESERVED_SCHEMA_VERSION = "guard.commitment_candidate.reserved.v1";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DETERMINISTIC_TIME_BASE_MS = Date.parse("2026-01-01T00:00:00.000Z");

function renderAuthorityHelp() {
  return [
    "Usage:",
    `  ${AUTHORITY_CHECK_USAGE}`,
    `  ${AUTHORITY_EXPLAIN_USAGE}`,
    "",
    "Options:",
    "  --preview             Required explicit preview opt-in",
    "  --json                Required JSON output mode",
    "  --fixture-file <file> Required authority boundary fixture input",
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

function parseAuthorityArgs(args) {
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

function findUnexpectedAuthorityArg(args) {
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

function deriveDeterministicTimestamp(seed, offsetMs = 0) {
  const digest = crypto.createHash("sha256").update(seed).digest("hex");
  const windowMs = 30 * ONE_DAY_MS;
  const deltaMs = Number.parseInt(digest.slice(0, 12), 16) % windowMs;
  return new Date(DETERMINISTIC_TIME_BASE_MS + deltaMs + offsetMs).toISOString();
}

function containsMarker(candidateValues, marker) {
  const normalizedMarker = marker.toLowerCase();
  return candidateValues.some(
    (value) => typeof value === "string" && value.toLowerCase().includes(normalizedMarker)
  );
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

function validateSchema(schema) {
  const issues = [];

  if (!Array.isArray(schema?.required)) issues.push("schema.required must be an array");
  if (!schema?.properties || typeof schema.properties !== "object") issues.push("schema.properties must exist");

  for (const flag of REQUIRED_POSTURE_FLAGS) {
    if (!schema?.required?.includes(flag)) issues.push(`schema.required missing ${flag}`);
    if (schema?.properties?.[flag]?.const !== true) issues.push(`schema.properties.${flag} must const true`);
  }

  const enumValues = schema?.properties?.decision?.enum;
  if (!Array.isArray(enumValues)) {
    issues.push("schema decision enum must exist");
  } else {
    if (enumValues.length !== ALLOWED_DECISIONS.length) {
      issues.push("schema decision enum must contain exactly four values");
    }
    for (const allowed of ALLOWED_DECISIONS) {
      if (!enumValues.includes(allowed)) issues.push(`schema decision enum missing ${allowed}`);
    }
    for (const actual of enumValues) {
      if (!ALLOWED_DECISIONS.includes(actual)) issues.push(`schema decision enum contains unexpected value ${actual}`);
    }
  }

  return issues;
}

function validateFixture(fixture) {
  const issues = [];

  for (const flag of REQUIRED_POSTURE_FLAGS) {
    if (!(flag in fixture)) issues.push(`missing posture flag ${flag}`);
    else if (fixture[flag] !== true) issues.push(`posture flag ${flag} must be true`);
  }

  if (!ALLOWED_DECISIONS.includes(fixture?.decision)) {
    issues.push(`decision must be one of ${ALLOWED_DECISIONS.join(", ")}`);
  }

  if (!fixture?.authority_receipt || typeof fixture.authority_receipt !== "object") {
    issues.push("authority_receipt must exist");
  } else {
    if (fixture.authority_receipt.recommendation_only !== true) {
      issues.push("authority_receipt.recommendation_only must be true");
    }
    if (fixture.authority_receipt.non_executing !== true) {
      issues.push("authority_receipt.non_executing must be true");
    }
    if (fixture.authority_receipt.default_off !== true) {
      issues.push("authority_receipt.default_off must be true");
    }
    if (fixture.authority_receipt.machine_verifiable !== true) {
      issues.push("authority_receipt.machine_verifiable must be true");
    }
    if (fixture.authority_receipt.execution_authority_granted !== false) {
      issues.push("authority_receipt.execution_authority_granted must be false");
    }
    if (fixture.authority_receipt.enforcement_action !== "none") {
      issues.push('authority_receipt.enforcement_action must be "none"');
    }
    if (fixture.authority_receipt.blocking_effect !== false) {
      issues.push("authority_receipt.blocking_effect must be false");
    }
  }

  if (!fixture?.authority_scope || typeof fixture.authority_scope !== "object") {
    issues.push("authority_scope must exist");
  } else {
    if (fixture.authority_scope.execution_authority_granted !== false) {
      issues.push("authority_scope.execution_authority_granted must be false");
    }
    if (fixture.authority_scope.blocking_implied !== false) {
      issues.push("authority_scope.blocking_implied must be false");
    }
  }

  const stack = [fixture];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      if (FORBIDDEN_FIELDS.includes(key)) {
        issues.push(`forbidden field present: ${key}`);
      }
      if (value && typeof value === "object") {
        stack.push(value);
      }
    }
  }

  return issues;
}

function buildPreviewResult(fixture) {
  return {
    kind: "authority_check_preview",
    preview: true,
    schema_version: fixture.schema_version,
    command: "guard authority check",
    decision: fixture.decision,
    receipt: fixture.authority_receipt,
    recommendation_only: fixture.recommendation_only,
    non_executing: fixture.non_executing,
    default_off: fixture.default_off,
    machine_verifiable: fixture.machine_verifiable,
    no_execution_authority: fixture.no_execution_authority,
    no_commit_gate_semantics: fixture.no_commit_gate_semantics,
    no_license_gating_semantic_change: fixture.no_license_gating_semantic_change,
    no_current_cli_contract_change: fixture.no_current_cli_contract_change,
    no_current_exit_code_semantic_change: fixture.no_current_exit_code_semantic_change,
    enforcement_action: "none",
    blocking_effect: false,
    execution_authority_granted: false,
  };
}

function validateRequiredPreviewArgs(args, usage, options = {}) {
  if (options.strict === true) {
    const unexpectedArg = findUnexpectedAuthorityArg(args);
    if (unexpectedArg) {
      const message = unexpectedArg.startsWith("--")
        ? `Unknown option: ${unexpectedArg}`
        : `Unexpected argument: ${unexpectedArg}`;
      return { response: usageError(message, usage) };
    }
  }

  const parsed = parseAuthorityArgs(args);
  if (parsed.help) return { response: { exitCode: 0, stdout: renderAuthorityHelp() + "\n" } };
  if (!parsed.preview) return { response: usageError("Missing required option: --preview", usage) };
  if (!parsed.json) return { response: usageError("Missing required option: --json", usage) };
  if (!parsed.fixtureFile) {
    return { response: usageError("Missing required option: --fixture-file", usage) };
  }
  return { parsed };
}

function loadValidatedAuthorityFixture(parsed, errorKinds) {
  const schemaRead = readJson(
    schemaPath,
    errorKinds.schemaMissing,
    errorKinds.schemaInvalidJson
  );
  if (schemaRead.error) return schemaRead;

  const fixturePath = path.resolve(process.cwd(), parsed.fixtureFile);
  const fixtureRead = readJson(
    fixturePath,
    errorKinds.fixtureMissing,
    errorKinds.fixtureInvalidJson
  );
  if (fixtureRead.error) return fixtureRead;

  const schemaIssues = validateSchema(schemaRead.value);
  if (schemaIssues.length > 0) {
    return {
      error: failure(
        errorKinds.schemaInvalid,
        "Authority preview schema contract is invalid.",
        { path: schemaPath, issues: schemaIssues }
      ),
    };
  }

  const fixtureIssues = validateFixture(fixtureRead.value);
  if (fixtureIssues.length > 0) {
    return {
      error: failure(
        errorKinds.contractInvalid,
        "Authority preview fixture failed contract validation.",
        { path: fixturePath, issues: fixtureIssues }
      ),
    };
  }

  return { fixturePath, fixture: fixtureRead.value };
}

function buildConstructibleCurrentState(fixture) {
  return {
    schema_version: CONSTRUCTIBLE_CURRENT_STATE_SCHEMA_VERSION,
    constructed_from: "fixture",
    current_authority_state: {
      actor: fixture.actor,
      decision: fixture.decision,
      recommendation_only: fixture.recommendation_only,
      non_executing: fixture.non_executing,
      execution_authority_granted: false,
      authority_receipt_id: fixture.authority_receipt.receipt_id,
    },
    current_action_scope: {
      summary: fixture.intent.summary,
      change_kind: fixture.intent.change_kind,
      target_paths: fixture.intent.target_paths,
      requested_operation: fixture.authority_scope.requested_operation,
      protected_surfaces_touched: fixture.intent.protected_surfaces_touched,
    },
    current_resource_boundary: {
      protected_surface_paths: fixture.context_snapshot.protected_surface_paths,
      protected_surfaces_touched: fixture.context_snapshot.protected_surfaces_touched,
      boundary_summary: fixture.authority_scope.boundary_summary,
      blocking_implied: false,
      execution_authority_granted: false,
    },
    current_policy_version: {
      fixture_schema_version: fixture.schema_version,
      current_release_line: fixture.context_snapshot.current_release_line,
      no_current_cli_contract_change: fixture.no_current_cli_contract_change,
      no_current_exit_code_semantic_change: fixture.no_current_exit_code_semantic_change,
      no_license_gating_semantic_change: fixture.no_license_gating_semantic_change,
    },
    current_evidence_package: {
      authority_receipt_id: fixture.authority_receipt.receipt_id,
      summary: fixture.authority_receipt.summary,
      recommended_next_step: fixture.authority_receipt.recommended_next_step,
      machine_verifiable: fixture.authority_receipt.machine_verifiable,
      evidence_source: "fixture",
    },
    current_execution_context: {
      repository: fixture.context_snapshot.repository,
      branch: fixture.context_snapshot.branch,
      actor_type: fixture.actor.actor_type,
      initiated_by: fixture.actor.initiated_by,
      live_repo_scan: false,
      actor_auto_detected: false,
      context_auto_captured: false,
    },
    current_commit_gate_result: {
      evaluated: false,
      result: "not_evaluated",
      reason: "v6.15 does not implement commit gate",
    },
  };
}

function buildStateValidityAssessment(fixture, constructibleCurrentState) {
  const checks = [];
  const issues = [];

  const protectedSignals = {
    intent: fixture.intent.protected_surfaces_touched === true,
    context: fixture.context_snapshot.protected_surfaces_touched === true,
    authority_scope:
      fixture.authority_scope.requested_operation === "touch_protected_surface" ||
      fixture.authority_scope.requested_operation === "runtime_or_deploy_change",
    commercial_change_kind: fixture.intent.change_kind === "commercial_surface_change",
  };

  const protectedSignalAligned =
    protectedSignals.intent === protectedSignals.context &&
    (!protectedSignals.authority_scope || protectedSignals.intent || protectedSignals.context);
  checks.push({
    name: "protected_surface_signal_alignment",
    ok: protectedSignalAligned,
  });
  if (!protectedSignalAligned) {
    issues.push(
      "Protected-surface indicators across intent, context snapshot, and authority scope do not align."
    );
  }

  const decisionAligned =
    (fixture.decision === "inside_scope" &&
      !protectedSignals.intent &&
      !protectedSignals.context &&
      !protectedSignals.authority_scope &&
      !protectedSignals.commercial_change_kind) ||
    (fixture.decision === "outside_scope" &&
      (protectedSignals.intent ||
        protectedSignals.context ||
        protectedSignals.authority_scope ||
        protectedSignals.commercial_change_kind)) ||
    fixture.decision === "needs_review" ||
    fixture.decision === "insufficient_context";
  checks.push({
    name: "decision_boundary_alignment",
    ok: decisionAligned,
  });
  if (!decisionAligned) {
    issues.push("Decision classification is inconsistent with the constructible current state.");
  }

  const staleDeclared = containsMarker(
    [
      fixture.context_snapshot.branch,
      fixture.authority_receipt.receipt_id,
      fixture.authority_receipt.summary,
      fixture.authority_receipt.recommended_next_step,
    ],
    "stale"
  );
  checks.push({
    name: "freshness_marker_detection",
    ok: true,
    marker_detected: staleDeclared,
  });

  const constructible = constructibleCurrentState.constructed_from === "fixture";
  checks.push({
    name: "constructible_current_state_available",
    ok: constructible,
  });

  let verdict = "valid";
  if (fixture.decision === "insufficient_context") {
    verdict = "unknown";
    issues.push("Insufficient context prevents a stronger bind-time validity conclusion.");
  } else if (staleDeclared) {
    verdict = "stale";
    issues.push("Fixture-declared freshness markers indicate stale bind-time state.");
  } else if (issues.length > 0) {
    verdict = "mismatch";
  }

  const stateHash = hashValue({
    current_authority_state: constructibleCurrentState.current_authority_state,
    current_action_scope: constructibleCurrentState.current_action_scope,
    current_resource_boundary: constructibleCurrentState.current_resource_boundary,
    current_execution_context: constructibleCurrentState.current_execution_context,
  });
  const policyHash = hashValue({
    current_policy_version: constructibleCurrentState.current_policy_version,
    recommendation_only: fixture.recommendation_only,
    non_executing: fixture.non_executing,
    default_off: fixture.default_off,
    machine_verifiable: fixture.machine_verifiable,
  });
  const evidenceHash = fixture.authority_receipt
    ? hashValue({
        current_evidence_package: constructibleCurrentState.current_evidence_package,
      })
    : null;

  const evaluatedAt = deriveDeterministicTimestamp(
    `${fixture.authority_receipt.receipt_id}:${fixture.decision}:${verdict}`
  );
  let expiresAt = null;
  if (verdict === "valid") {
    expiresAt = deriveDeterministicTimestamp(
      `${fixture.authority_receipt.receipt_id}:${fixture.decision}:${verdict}`,
      ONE_DAY_MS
    );
  } else if (verdict === "stale") {
    expiresAt = deriveDeterministicTimestamp(
      `${fixture.authority_receipt.receipt_id}:${fixture.decision}:${verdict}`,
      -ONE_DAY_MS
    );
  }

  return {
    schema_version: BIND_TIME_VALIDITY_SCHEMA_VERSION,
    evaluated: true,
    enforced: false,
    evaluated_at: evaluatedAt,
    expires_at: expiresAt,
    verdict,
    state_hash: stateHash,
    policy_hash: policyHash,
    evidence_hash: evidenceHash,
    replay_guard_preview: {
      evaluated: true,
      enforced: false,
      mode: "fixture_declared_or_derived",
      blocking_effect: false,
    },
    checks,
    issues,
  };
}

function buildAuthorityExplainResult(fixture) {
  const constructibleCurrentState = buildConstructibleCurrentState(fixture);
  const stateValidityAtBindTime = buildStateValidityAssessment(
    fixture,
    constructibleCurrentState
  );
  const authorityCheckRef = {
    kind: "authority_check_preview_ref",
    command: "guard authority check",
    preview: true,
    decision: fixture.decision,
    authority_receipt_ref: fixture.authority_receipt.receipt_id,
    deterministic_hash: hashValue(buildPreviewResult(fixture)),
  };

  const receiptLinkageHash = hashValue({
    authority_receipt_ref: fixture.authority_receipt.receipt_id,
    explain_schema_version: AUTHORITY_EXPLAIN_SCHEMA_VERSION,
    decision: fixture.decision,
    verdict: stateValidityAtBindTime.verdict,
    state_hash: stateValidityAtBindTime.state_hash,
    policy_hash: stateValidityAtBindTime.policy_hash,
    evidence_hash: stateValidityAtBindTime.evidence_hash,
  });

  return {
    kind: "authority_explain_preview",
    schema_version: AUTHORITY_EXPLAIN_SCHEMA_VERSION,
    command: "guard authority explain",
    preview: true,
    coverage_matrix: {
      current_state_context_v1: {
        status: "implemented",
        implemented_as: "constructible_current_state",
        explanation_only: true,
        fixture_backed: true,
        derived_only: true,
      },
      bind_time_validity_v1: {
        status: "implemented",
        implemented_as: "state_validity_at_bind_time",
        enforced: false,
        explanation_only: true,
        fixture_backed: true,
        derived_only: true,
      },
      commitment_candidate_v1: {
        status: "reserved",
        evaluated: false,
        result: "not_evaluated",
      },
      admissibility_result_v1: {
        status: "reserved",
        evaluated: false,
        result: "not_evaluated",
      },
      commitment_receipt_v1: {
        status: "deferred",
        implemented: false,
      },
    },
    authority_check_ref: authorityCheckRef,
    constructible_current_state: constructibleCurrentState,
    state_validity_at_bind_time: stateValidityAtBindTime,
    authority_explanation: {
      schema_version: "guard.authority_explanation.v1",
      summary: `Constructible current state derived from fixture with bind-time validity verdict ${stateValidityAtBindTime.verdict}.`,
      derived_only: true,
      fixture_backed: true,
      explanation_only: true,
      no_live_repo_scan: true,
      no_actor_auto_detection: true,
      no_context_auto_capture: true,
      points: [
        "Admissibility is only valid against a constructible current state.",
        "No constructible current state, no admissibility.",
        "No state validity at bind time, no commit gate.",
        `This preview remains non-enforcing and does not change the authority decision result ${fixture.decision}.`,
      ],
      basis: {
        authority_decision: fixture.decision,
        bind_time_verdict: stateValidityAtBindTime.verdict,
        authority_receipt_ref: fixture.authority_receipt.receipt_id,
      },
    },
    admissibility_result: {
      schema_version: ADMISSIBILITY_RESULT_RESERVED_SCHEMA_VERSION,
      status: "reserved",
      evaluated: false,
      result: "not_evaluated",
      reserved_result_values: [
        "admit",
        "deny",
        "defer",
        "requires_human_confirmation",
      ],
    },
    commitment_candidate: {
      schema_version: COMMITMENT_CANDIDATE_RESERVED_SCHEMA_VERSION,
      status: "reserved",
      evaluated: false,
      result: "not_evaluated",
      commit_decision: "not_evaluated",
    },
    receipt_linkage: {
      authority_explain_receipt_id: `${fixture.authority_receipt.receipt_id}:authority-explain:v6_15`,
      authority_receipt_ref: fixture.authority_receipt.receipt_id,
      deterministic_hash: receiptLinkageHash,
      commitment_receipt: {
        implemented: false,
        deferred_to: "commit_gate_phase",
      },
    },
    non_enforcement_boundary: {
      recommendation_only: true,
      non_executing: true,
      default_off: true,
      enforced: false,
      blocking_effect: false,
      execution_authority_granted: false,
      does_not_create_commit_gate: true,
      does_not_decide_admissibility: true,
      does_not_create_commitment_receipt: true,
    },
  };
}

export function handleAuthoritySubcommand(args) {
  const sub = args[0] || "";
  if (!sub || sub === "--help" || sub === "-h" || sub === "help") {
    return { exitCode: 0, stdout: renderAuthorityHelp() + "\n" };
  }

  if (sub !== "check" && sub !== "explain") {
    return {
      exitCode: 2,
      stderr: `Unknown authority command: ${sub}\n\n${renderAuthorityHelp()}\n`,
    };
  }

  const usage = sub === "check" ? AUTHORITY_CHECK_USAGE : AUTHORITY_EXPLAIN_USAGE;
  const argsResult = validateRequiredPreviewArgs(args.slice(1), usage, {
    strict: sub === "explain",
  });
  if (argsResult.response) return argsResult.response;

  const loaded = loadValidatedAuthorityFixture(argsResult.parsed, {
    schemaMissing:
      sub === "check"
        ? "authority_preview_schema_missing"
        : "authority_explain_preview_schema_missing",
    schemaInvalidJson:
      sub === "check"
        ? "authority_preview_schema_invalid_json"
        : "authority_explain_preview_schema_invalid_json",
    schemaInvalid:
      sub === "check" ? "authority_preview_schema_invalid" : "authority_explain_preview_schema_invalid",
    fixtureMissing:
      sub === "check"
        ? "authority_preview_fixture_missing"
        : "authority_explain_preview_fixture_missing",
    fixtureInvalidJson:
      sub === "check"
        ? "authority_preview_fixture_invalid_json"
        : "authority_explain_preview_fixture_invalid_json",
    contractInvalid:
      sub === "check"
        ? "authority_preview_contract_invalid"
        : "authority_explain_preview_contract_invalid",
  });
  if (loaded.error) return loaded.error;

  return {
    exitCode: 0,
    stdout:
      JSON.stringify(
        sub === "check" ? buildPreviewResult(loaded.fixture) : buildAuthorityExplainResult(loaded.fixture),
        null,
        2
      ) + "\n",
  };
}
