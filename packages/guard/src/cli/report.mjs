import { handleReportSingleAgentPreviewSubcommand } from "./report_single_agent_preview.mjs";
import { handleSingleAgentGovernanceReportSubcommand } from "./single_agent_governance_report.mjs";

function hasPackArg(args) {
  return args.some((arg) => arg === "--pack" || arg.startsWith("--pack="));
}

export function handleReportSubcommand(args) {
  const sub = args[0] || "";
  if (sub === "single-agent" && hasPackArg(args.slice(1))) {
    return handleReportSingleAgentPreviewSubcommand(args.slice(1));
  }
  return handleSingleAgentGovernanceReportSubcommand(args);
}
