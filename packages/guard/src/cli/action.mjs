import {
  classifyAction,
  hashAction,
  validateCanonicalActionArtifact,
} from "../runtime/actions/index.mjs";

function renderActionHelp() {
  return [
    "Usage:",
    "  guard action classify --text \"<string>\"",
    "",
    "Options:",
    "  --text <string>  Input text to classify",
    "  --help, -h       Show help",
    "",
  ].join("\n");
}

function parseActionArgs(args) {
  const parsed = { help: false, text: null };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") parsed.help = true;
    else if (arg.startsWith("--text=")) parsed.text = arg.slice("--text=".length);
    else if (arg === "--text" && args[i + 1]) {
      parsed.text = args[i + 1];
      i += 1;
    }
  }
  return parsed;
}

export function handleActionSubcommand(args) {
  const sub = args[0] || "";
  if (!sub || sub === "--help" || sub === "-h" || sub === "help") {
    return { exitCode: 0, stdout: renderActionHelp() + "\n" };
  }

  if (sub !== "classify") {
    return {
      exitCode: 2,
      stderr: `Unknown action command: ${sub}\n\n${renderActionHelp()}\n`,
    };
  }

  const parsed = parseActionArgs(args.slice(1));
  if (parsed.help) return { exitCode: 0, stdout: renderActionHelp() + "\n" };
  if (!parsed.text) {
    return {
      exitCode: 2,
      stderr: "Missing required option: --text\n",
    };
  }

  const action = classifyAction({ text: parsed.text });
  const artifact = {
    kind: "canonical_action",
    version: "v1",
    input: {
      text: action.input.text,
    },
    action: action.action,
    canonical_action_hash: hashAction(action.action),
    deterministic: true,
    side_effect_free: true,
  };

  const validation = validateCanonicalActionArtifact(artifact);
  if (!validation.ok) {
    return {
      exitCode: 30,
      stdout:
        JSON.stringify(
          {
            ok: false,
            error: {
              kind: "canonical_action_contract_invalid",
              message: "canonical_action artifact failed local validation",
              schema_id: validation.schemaId,
              issues: validation.errors,
            },
          },
          null,
          2
        ) + "\n",
    };
  }

  return { exitCode: 0, stdout: JSON.stringify(artifact, null, 2) + "\n" };
}
