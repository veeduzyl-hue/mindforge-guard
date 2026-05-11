import { handlePackValidatePreviewSubcommand } from "./pack_validate_preview.mjs";
import { parseSingleAgentGovernancePackPreview } from "../productization/single_agent_pack_parser_preview.mjs";
import { buildSingleAgentReportPreview } from "../productization/single_agent_report_preview_mapper.mjs";

const REPORT_PREVIEW_USAGE = "guard report single-agent --pack <path> --preview --json";
const EXIT_USAGE = 2;
const EXIT_UNEXPECTED = 1;
const EXIT_VALID = 0;
const EXIT_LIMITATIONS = 2;
const EXIT_OMISSIONS = 3;
const EXIT_MALFORMED = 4;

function usageError(message) {
  return {
    exitCode: EXIT_USAGE,
    stderr: `${message}\nUsage: ${REPORT_PREVIEW_USAGE}\n`
  };
}

function buildErrorJson({ kind, message, details = {} }) {
  return (
    JSON.stringify(
      {
        ok: false,
        error: {
          kind,
          message,
          ...details
        }
      },
      null,
      2
    ) + "\n"
  );
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

function parseValidationResult(response) {
  try {
    return JSON.parse(response.stdout || "{}");
  } catch (error) {
    throw new Error(`pack validate preview returned invalid JSON: ${error.message}`);
  }
}

function determineExitCode(validationStatus) {
  if (validationStatus === "invalid_due_to_malformed_input") return EXIT_MALFORMED;
  if (validationStatus === "invalid_due_to_omissions") return EXIT_OMISSIONS;
  if (validationStatus === "valid_with_limitations") return EXIT_LIMITATIONS;
  return EXIT_VALID;
}

export function handleReportSingleAgentPreviewSubcommand(args) {
  const { error, parsed } = parseArgs(args);
  if (error) return error;

  if (parsed.help) {
    return { exitCode: 0, stdout: `${REPORT_PREVIEW_USAGE}\n` };
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
    const validationResponse = handlePackValidatePreviewSubcommand([
      "--pack",
      parsed.packPath,
      "--preview",
      "--json"
    ]);

    if (validationResponse.stderr) {
      return validationResponse;
    }

    const packValidation = parseValidationResult(validationResponse);
    if (packValidation.validation_status === "invalid_due_to_malformed_input") {
      return {
        exitCode: EXIT_MALFORMED,
        stdout: buildErrorJson({
          kind: "single_agent_report_preview_pack_invalid",
          message: "Pack-backed report preview could not be generated because the pack input is malformed or unreadable.",
          details: {
            pack_path: parsed.packPath,
            validation_status: packValidation.validation_status,
            parser_warnings: packValidation.parser_warnings || []
          }
        })
      };
    }

    const parserSummary = parseSingleAgentGovernancePackPreview(parsed.packPath);
    const report = buildSingleAgentReportPreview({
      packRoot: parsed.packPath,
      parserSummary,
      packValidation
    });

    return {
      exitCode: determineExitCode(packValidation.validation_status),
      stdout: JSON.stringify(report, null, 2) + "\n"
    };
  } catch (errorLike) {
    return {
      exitCode: EXIT_UNEXPECTED,
      stdout: buildErrorJson({
        kind: "single_agent_report_preview_unexpected_error",
        message: "Pack-backed report preview encountered an unexpected error.",
        details: {
          reason: errorLike?.message || String(errorLike)
        }
      })
    };
  }
}
