import {
  classifyAction,
  hashAction,
  validateCanonicalActionArtifact,
} from "../packages/guard/src/runtime/actions/index.mjs";

function buildArtifact(text) {
  const classified = classifyAction({ text });
  const parsed = {
    kind: "canonical_action",
    version: "v1",
    input: {
      text: classified.input.text,
    },
    action: classified.action,
    canonical_action_hash: hashAction(classified.action),
    deterministic: true,
    side_effect_free: true,
  };
  const validation = validateCanonicalActionArtifact(parsed);
  if (!validation.ok) {
    throw new Error(`schema validation failed: ${validation.errors.join("; ")}`);
  }
  return parsed;
}

const first = buildArtifact("write file README.md");
const second = buildArtifact("write file README.md");
const normalized = buildArtifact("   write   file   README.md   ");

if (first.kind !== "canonical_action") {
  throw new Error(`unexpected kind: ${first.kind}`);
}

if (JSON.stringify(first) !== JSON.stringify(second)) {
  throw new Error("same input produced different canonical_action artifacts");
}

if (JSON.stringify(first) !== JSON.stringify(normalized)) {
  throw new Error("normalized equivalent input produced a different canonical_action artifact");
}

process.stdout.write("canonical_action contract verified\n");
