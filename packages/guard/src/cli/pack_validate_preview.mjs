import { parseSingleAgentGovernancePackPreview } from "../productization/single_agent_pack_parser_preview.mjs";

const PACK_VALIDATE_USAGE = "guard pack validate --pack <path> --preview --json";
const EXIT_USAGE = 2;
const EXIT_UNEXPECTED = 1;
const EXIT_VALID = 0;
const EXIT_LIMITATIONS = 2;
const EXIT_OMISSIONS = 3;
const EXIT_MALFORMED = 4;

const REQUIRED_FIELDS_CHECKED = [
  "manifest.json: pack_id",
  "manifest.json: pack_version",
  "manifest.json: pack_type",
  "manifest.json: created_at",
  "manifest.json: updated_at",
  "manifest.json: owner",
  "manifest.json: source_repo",
  "manifest.json: report_target",
  "agent-profile.json: agent_id",
  "agent-profile.json: agent_name",
  "agent-profile.json: agent_type",
  "agent-profile.json: business_owner",
  "agent-profile.json: technical_owner",
  "agent-profile.json: review_owner",
  "agent-profile.json: intended_users",
  "agent-profile.json: operating_context",
  "task-scope.md: intended task:",
  "task-scope.md: in-scope behavior:",
  "task-scope.md: out-of-scope behavior:",
  "task-scope.md: success criteria:",
  "task-scope.md: known limitations:",
  "action-boundary.yaml: allowed_actions",
  "action-boundary.yaml: prohibited_actions",
  "action-boundary.yaml: human_review_required",
  "action-boundary.yaml: escalation_required",
  "action-boundary.yaml: external_side_effects",
  "data-sources.yaml: data_sources",
  "data-sources.yaml: data_source_id",
  "data-sources.yaml: data_source_name",
  "data-sources.yaml: data_category",
  "data-sources.yaml: access_mode",
  "data-sources.yaml: sensitivity_level",
  "data-sources.yaml: retention_note",
  "data-sources.yaml: usage_purpose",
  "tools.yaml: tools",
  "tools.yaml: tool_id",
  "tools.yaml: tool_name",
  "tools.yaml: tool_type",
  "tools.yaml: permitted_operations",
  "tools.yaml: prohibited_operations",
  "tools.yaml: requires_human_approval",
  "tools.yaml: side_effect_level",
  "evidence/sample-output.json: sample_id",
  "evidence/sample-output.json: input_summary",
  "evidence/sample-output.json: output_summary",
  "evidence/sample-output.json: output_artifact_ref",
  "evidence/sample-output.json: expected_behavior",
  "evidence/sample-output.json: observed_behavior",
  "evidence/sample-output.json: reviewer_note"
];

function usageError(message) {
  return {
    exitCode: EXIT_USAGE,
    stderr: `${message}\nUsage: ${PACK_VALIDATE_USAGE}\n`
  };
}

function parseArgs(args) {
  const parsed = {
    help: false,
    preview: false,
    json: false,
    packPath: null
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
    } else if (arg === "--preview") {
      parsed.preview = true;
    } else if (arg === "--json") {
      parsed.json = true;
    } else if (arg.startsWith("--pack=")) {
      parsed.packPath = arg.slice("--pack=".length);
    } else if (arg === "--pack" && args[index + 1]) {
      parsed.packPath = args[index + 1];
      index += 1;
    } else {
      return { error: usageError(arg.startsWith("--") ? `Unknown option: ${arg}` : `Unexpected argument: ${arg}`) };
    }
  }

  return { parsed };
}

function buildReviewFocus(summary) {
  const focus = [];
  if (summary.malformed_files.length > 0) {
    focus.push("repair malformed pack input before report preparation");
  }
  if (summary.omissions.length > 0) {
    focus.push("address missing required evidence before report preparation");
  }
  if (summary.limitations.length > 0) {
    focus.push("improve recommended evidence depth for richer review context");
  }
  if (summary.parser_warnings.length > 0) {
    focus.push("inspect parser warnings for suspicious local references or non-critical gaps");
  }
  if (focus.length === 0) {
    focus.push("pack is review-ready for preview validation");
  }
  return focus;
}

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

function determineValidationStatus(summary) {
  if (summary.malformed_files.length > 0) {
    return "invalid_due_to_malformed_input";
  }
  if (summary.omissions.length > 0) {
    return "invalid_due_to_omissions";
  }
  if (summary.limitations.length > 0) {
    return "valid_with_limitations";
  }
  return "valid_with_no_omissions";
}

function determineExitCode(validationStatus) {
  if (validationStatus === "invalid_due_to_malformed_input") return EXIT_MALFORMED;
  if (validationStatus === "invalid_due_to_omissions") return EXIT_OMISSIONS;
  if (validationStatus === "valid_with_limitations") return EXIT_LIMITATIONS;
  return EXIT_VALID;
}

function buildOutput(summary) {
  const validationStatus = determineValidationStatus(summary);
  return {
    command: "pack validate",
    preview: true,
    pack_path: summary.pack_path,
    parser_version: summary.parser_version,
    validation_status: validationStatus,
    omissions: summary.omissions,
    limitations: summary.limitations,
    parser_warnings: summary.parser_warnings,
    deterministic_pack_hash: summary.deterministic_pack_hash,
    files_checked: uniqueSorted([...summary.parsed_files, ...summary.missing_files]),
    required_fields_checked: REQUIRED_FIELDS_CHECKED,
    review_focus: buildReviewFocus(summary),
    non_enforcement_boundary: {
      summary: "Pack validation is evidence-readiness output only. It does not approve, block, merge, deploy, certify, or execute."
    }
  };
}

export function handlePackValidatePreviewSubcommand(args) {
  const { error, parsed } = parseArgs(args);
  if (error) return error;

  if (parsed.help) {
    return { exitCode: 0, stdout: `${PACK_VALIDATE_USAGE}\n` };
  }
  if (!parsed.preview) {
    return usageError("Missing required option: --preview");
  }
  if (!parsed.json) {
    return usageError("Missing required option: --json");
  }
  if (!parsed.packPath) {
    return usageError("Missing required option: --pack");
  }

  try {
    const summary = parseSingleAgentGovernancePackPreview(parsed.packPath);
    const output = buildOutput(summary);
    return {
      exitCode: determineExitCode(output.validation_status),
      stdout: JSON.stringify(output, null, 2) + "\n"
    };
  } catch (errorLike) {
    const message = errorLike?.message || String(errorLike);
    const output = {
      command: "pack validate",
      preview: true,
      pack_path: parsed.packPath,
      parser_version: "single_agent_governance_pack_parser_preview_v1",
      validation_status: "invalid_due_to_malformed_input",
      omissions: [],
      limitations: [],
      parser_warnings: [message],
      deterministic_pack_hash: "",
      files_checked: [],
      required_fields_checked: REQUIRED_FIELDS_CHECKED,
      review_focus: ["repair malformed pack input before report preparation"],
      non_enforcement_boundary: {
        summary: "Pack validation is evidence-readiness output only. It does not approve, block, merge, deploy, certify, or execute."
      }
    };
    return {
      exitCode: EXIT_MALFORMED,
      stdout: JSON.stringify(output, null, 2) + "\n"
    };
  }
}

