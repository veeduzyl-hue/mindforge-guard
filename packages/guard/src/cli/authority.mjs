import fs from "node:fs";
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

function renderAuthorityHelp() {
  return [
    "Usage:",
    "  guard authority check --preview --json --fixture-file <file>",
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

function usageError(message) {
  return {
    exitCode: 2,
    stderr: `${message}\nUsage: guard authority check --preview --json --fixture-file <file>\n`,
  };
}

function failure(kind, message, details = {}) {
  return {
    exitCode: EXIT_ERROR_DEFAULT,
    stdout: buildErrorJson({ kind, message, details }),
  };
}

function parseAuthorityCheckArgs(args) {
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

export function handleAuthoritySubcommand(args) {
  const sub = args[0] || "";
  if (!sub || sub === "--help" || sub === "-h" || sub === "help") {
    return { exitCode: 0, stdout: renderAuthorityHelp() + "\n" };
  }

  if (sub !== "check") {
    return {
      exitCode: 2,
      stderr: `Unknown authority command: ${sub}\n\n${renderAuthorityHelp()}\n`,
    };
  }

  const parsed = parseAuthorityCheckArgs(args.slice(1));
  if (parsed.help) return { exitCode: 0, stdout: renderAuthorityHelp() + "\n" };
  if (!parsed.preview) return usageError("Missing required option: --preview");
  if (!parsed.json) return usageError("Missing required option: --json");
  if (!parsed.fixtureFile) return usageError("Missing required option: --fixture-file");

  const schemaRead = readJson(
    schemaPath,
    "authority_preview_schema_missing",
    "authority_preview_schema_invalid_json"
  );
  if (schemaRead.error) return schemaRead.error;

  const fixturePath = path.resolve(process.cwd(), parsed.fixtureFile);
  const fixtureRead = readJson(
    fixturePath,
    "authority_preview_fixture_missing",
    "authority_preview_fixture_invalid_json"
  );
  if (fixtureRead.error) return fixtureRead.error;

  const schemaIssues = validateSchema(schemaRead.value);
  if (schemaIssues.length > 0) {
    return failure(
      "authority_preview_schema_invalid",
      "Authority preview schema contract is invalid.",
      { path: schemaPath, issues: schemaIssues }
    );
  }

  const fixtureIssues = validateFixture(fixtureRead.value);
  if (fixtureIssues.length > 0) {
    return failure(
      "authority_preview_contract_invalid",
      "Authority preview fixture failed contract validation.",
      { path: fixturePath, issues: fixtureIssues }
    );
  }

  return {
    exitCode: 0,
    stdout: JSON.stringify(buildPreviewResult(fixtureRead.value), null, 2) + "\n",
  };
}
