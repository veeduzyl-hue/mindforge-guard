import { handlePackValidatePreviewSubcommand } from "./pack_validate_preview.mjs";

function renderPackHelp() {
  return [
    "Usage:",
    "  guard pack validate --pack <path> --preview --json",
    ""
  ].join("\n");
}

export function handlePackSubcommand(args) {
  const sub = args[0] || "";
  if (!sub || sub === "--help" || sub === "-h") {
    return { exitCode: 0, stdout: renderPackHelp() };
  }
  if (sub !== "validate") {
    return {
      exitCode: 2,
      stderr: `Unknown pack command: ${sub}\n\n${renderPackHelp()}\n`
    };
  }
  return handlePackValidatePreviewSubcommand(args.slice(1));
}

