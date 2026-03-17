import { classifyAction } from "./classify.mjs";
import { hashAction } from "./hashAction.mjs";
import { assertValidCanonicalActionArtifact } from "./validate.mjs";

function buildAuditActionText(audit) {
  const touchedPaths = Array.isArray(audit?.inputs?.paths?.touched_paths)
    ? audit.inputs.paths.touched_paths
    : [];
  const firstPath = touchedPaths.find((value) => typeof value === "string" && value.trim().length > 0) || "";
  const diffSummary = audit?.inputs?.diff_summary || {};
  const linesAdded = Number(diffSummary.lines_added || 0);
  const linesDeleted = Number(diffSummary.lines_deleted || 0);

  if (firstPath) {
    if (linesAdded === 0 && linesDeleted > 0) {
      return `delete file ${firstPath}`;
    }
    return `write file ${firstPath}`;
  }

  return "audit staged change";
}

export function buildCanonicalActionArtifactFromAudit(audit) {
  const classified = classifyAction({ text: buildAuditActionText(audit) });
  const artifact = {
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

  return assertValidCanonicalActionArtifact(artifact);
}
