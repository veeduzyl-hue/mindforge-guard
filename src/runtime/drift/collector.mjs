import fs from "node:fs";
import path from "node:path";

function safeMkdirp(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {
    // swallow
  }
}

function safeAppendLine(filePath, line) {
  try {
    fs.appendFileSync(filePath, line, "utf8");
  } catch {
    // swallow
  }
}

/**
 * Append-only drift event collector.
 * MUST NEVER throw (zero impact to exit behavior).
 */
export function collectDriftEvent(evt, opts = {}) {
  try {
    const repoRoot = opts.repoRoot || process.cwd();
    const driftDir = path.join(repoRoot, ".mindforge", "drift");
    const outFile = path.join(driftDir, "events.jsonl");

    safeMkdirp(driftDir);

    const payload = {
      kind: "drift_event",
      v: 2,
      ts: new Date().toISOString(),

      // minimal identity
      surface_id: evt?.surface_id ?? "unknown",
      module: evt?.module ?? "unknown",

      // mirror fields (read-only trend inputs; never used to affect exit)
      risk_score: evt?.risk_score ?? null,
      severity: evt?.severity ?? null,
      verdict: evt?.verdict ?? null,
      exit_code: evt?.exit_code ?? null,
      ds_exit_001: evt?.ds_exit_001 ?? null,

      // traceability (optional)
      receipt_id: evt?.receipt_id ?? null,
      snapshot_id: evt?.snapshot_id ?? null
    };

    safeAppendLine(outFile, JSON.stringify(payload) + "\n");
  } catch {
    // absolute safety: swallow everything
  }
}
