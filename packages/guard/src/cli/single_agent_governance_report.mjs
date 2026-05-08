import fs from "node:fs";

const EXIT_ERROR_DEFAULT = 30;
const REPORT_USAGE = "guard report single-agent --preview --json --fixture-file <file>";
const ALLOWED_REVIEW_POSTURES = [
  "ready_for_review",
  "needs_human_review",
  "insufficient_evidence",
  "out_of_scope",
  "unknown",
];
const REQUIRED_TOP_LEVEL_FIELDS = [
  "object_type",
  "object_version",
  "report_mode",
  "generated_at",
  "agent_identity",
  "capability_boundary",
  "authority_envelope",
  "execution_path_snapshot",
  "proposed_action",
  "policy_evaluation_preview",
  "findings",
  "review_evidence",
  "artifact_provenance",
  "pre_v6_14_capability_foundation",
  "action_summary",
  "intent_summary",
  "authority_summary",
  "evidence_summary",
  "admissibility_summary",
  "risk_summary",
  "drift_summary",
  "guardrail_mapping_summary",
  "transition_summary",
  "procedural_receipt_summary",
  "lineage_summary",
  "review_posture",
  "receipt_refs",
  "deterministic_hash",
  "non_enforcement_boundary",
];
const FORBIDDEN_TOP_LEVEL_FIELDS = [
  "readiness_verdict",
  "approval_result",
  "decision",
  "enforcement_result",
  "compliance_status",
  "merge_status",
  "deployment_status",
  "permit_result",
  "commit_result",
  "block_result",
];
const FOUNDATION_KEYS = [
  "status_validate_policy",
  "audit",
  "snapshot",
  "action_classify",
  "drift",
  "assoc_correlate",
  "risk",
  "license_edition_gate",
  "verification_chain",
];
const FOUNDATION_REF_KEYS = {
  status_validate_policy: "artifact_refs",
  audit: "evidence_refs",
  snapshot: "snapshot_refs",
  action_classify: "artifact_refs",
  drift: "drift_refs",
  assoc_correlate: "correlation_refs",
  risk: "risk_refs",
  license_edition_gate: "artifact_refs",
  verification_chain: "verifier_refs",
};
const REQUIRED_NON_ENFORCEMENT_VALUES = {
  recommendation_only: true,
  non_executing: true,
  approval_granted: false,
  execution_permission_granted: false,
  blocking_effect: false,
  deployment_authority: false,
  merge_authority: false,
  enforcement_action: "none",
  legal_compliance_claim: false,
};

function renderReportHelp() {
  return [
    "Usage:",
    `  ${REPORT_USAGE}`,
    "",
    "Options:",
    "  --preview             Required explicit preview opt-in",
    "  --json                Required JSON output mode",
    "  --fixture-file <file> Required single-agent report fixture input",
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

function usageError(message) {
  return {
    exitCode: 2,
    stderr: `${message}\nUsage: ${REPORT_USAGE}\n`,
  };
}

function failure(kind, message, details = {}) {
  return {
    exitCode: EXIT_ERROR_DEFAULT,
    stdout: buildErrorJson({ kind, message, details }),
  };
}

function parseReportArgs(args) {
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

function findUnexpectedReportArg(args) {
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h" || arg === "--preview" || arg === "--json") continue;
    if (arg.startsWith("--fixture-file=")) continue;
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

function readJson(filePath, missingKind, invalidKind) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    return {
      error: failure(
        missingKind,
        "Required preview fixture could not be read.",
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
        "Preview fixture is not valid JSON.",
        { path: filePath, reason: error?.message || String(error) }
      ),
    };
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateRequiredPreviewArgs(args) {
  const unexpectedArg = findUnexpectedReportArg(args);
  if (unexpectedArg) {
    const message = unexpectedArg.startsWith("--")
      ? `Unknown option: ${unexpectedArg}`
      : `Unexpected argument: ${unexpectedArg}`;
    return { response: usageError(message) };
  }

  const parsed = parseReportArgs(args);
  if (parsed.help) return { response: { exitCode: 0, stdout: renderReportHelp() + "\n" } };
  if (!parsed.preview) return { response: usageError("Missing required option: --preview") };
  if (!parsed.json) return { response: usageError("Missing required option: --json") };
  if (!parsed.fixtureFile) return { response: usageError("Missing required option: --fixture-file") };
  return { parsed };
}

function validateFoundationEntry(entry, refKey, issues, label) {
  if (!isPlainObject(entry)) {
    issues.push(`${label} must be an object`);
    return;
  }
  if (entry.contract_preserved !== true) {
    issues.push(`${label}.contract_preserved must be true`);
  }
  if (!Array.isArray(entry.contributes_to) || entry.contributes_to.length === 0) {
    issues.push(`${label}.contributes_to must be a non-empty array`);
  }
  if (!Array.isArray(entry[refKey]) || entry[refKey].length === 0) {
    issues.push(`${label}.${refKey} must be a non-empty array`);
  }
}

function validatePreviewFixture(report) {
  const issues = [];

  if (!isPlainObject(report)) {
    issues.push("report must be a JSON object");
    return issues;
  }

  for (const key of REQUIRED_TOP_LEVEL_FIELDS) {
    if (!(key in report)) issues.push(`missing required top-level field ${key}`);
  }

  if (report.object_type !== "single_agent_governance_report_preview") {
    issues.push("object_type must be single_agent_governance_report_preview");
  }
  if (report.object_version !== "v1") {
    issues.push("object_version must be v1");
  }
  if (report.report_mode !== "preview") {
    issues.push("report_mode must be preview");
  }
  if (!ALLOWED_REVIEW_POSTURES.includes(report.review_posture)) {
    issues.push("review_posture must use an allowed preview value");
  }

  if ("readiness_verdict" in report) {
    issues.push("unsupported top-level readiness field present");
  }

  for (const field of FORBIDDEN_TOP_LEVEL_FIELDS) {
    if (field in report) {
      issues.push("unsupported top-level decision or enforcement field present");
    }
  }

  if (!Array.isArray(report.receipt_refs) || report.receipt_refs.length === 0) {
    issues.push("receipt_refs must be a non-empty array");
  }
  if (typeof report.deterministic_hash !== "string" || report.deterministic_hash.length === 0) {
    issues.push("deterministic_hash must be a non-empty string");
  }

  const nonEnforcement = report.non_enforcement_boundary;
  if (!isPlainObject(nonEnforcement)) {
    issues.push("non_enforcement_boundary must be an object");
  } else {
    for (const [key, expectedValue] of Object.entries(REQUIRED_NON_ENFORCEMENT_VALUES)) {
      if (nonEnforcement[key] !== expectedValue) {
        issues.push(`non_enforcement_boundary.${key} must be ${expectedValue}`);
      }
    }
  }

  const policyPreview = report.policy_evaluation_preview;
  if (!isPlainObject(policyPreview)) {
    issues.push("policy_evaluation_preview must be an object");
  } else {
    if (policyPreview.probability_scoring !== false) {
      issues.push("policy_evaluation_preview.probability_scoring must be false");
    }
    if (policyPreview.legal_compliance_scoring !== false) {
      issues.push("policy_evaluation_preview.legal_compliance_scoring must be false");
    }
  }

  const foundation = report.pre_v6_14_capability_foundation;
  if (!isPlainObject(foundation)) {
    issues.push("pre_v6_14_capability_foundation must be an object");
  } else {
    for (const key of FOUNDATION_KEYS) {
      if (!(key in foundation)) {
        issues.push(`missing pre_v6_14 capability entry ${key}`);
        continue;
      }
      validateFoundationEntry(foundation[key], FOUNDATION_REF_KEYS[key], issues, `pre_v6_14_capability_foundation.${key}`);
    }
    if (
      isPlainObject(foundation.license_edition_gate) &&
      foundation.license_edition_gate.entitlement_changed !== false
    ) {
      issues.push("pre_v6_14_capability_foundation.license_edition_gate.entitlement_changed must be false");
    }
  }

  return issues;
}

export function handleSingleAgentGovernanceReportSubcommand(args) {
  const sub = args[0] || "";
  if (sub !== "single-agent") {
    return {
      exitCode: 2,
      stderr: `Unknown report command: ${sub}\n\n${renderReportHelp()}\n`,
    };
  }

  const argsResult = validateRequiredPreviewArgs(args.slice(1));
  if (argsResult.response) return argsResult.response;

  const { parsed } = argsResult;
  const readResult = readJson(
    parsed.fixtureFile,
    "single_agent_governance_report_preview_fixture_missing",
    "single_agent_governance_report_preview_fixture_invalid_json"
  );
  if (readResult.error) return readResult.error;

  const report = readResult.value;
  const issues = validatePreviewFixture(report);
  if (issues.length > 0) {
    return failure(
      "single_agent_governance_report_preview_contract_invalid",
      "Fixture does not satisfy the single-agent governance report preview contract.",
      {
        path: parsed.fixtureFile,
        issues,
      }
    );
  }

  return {
    exitCode: 0,
    stdout: JSON.stringify(report, null, 2) + "\n",
  };
}
