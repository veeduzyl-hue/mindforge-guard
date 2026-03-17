import fs from "node:fs";
import path from "node:path";

const EXIT_ERROR_DEFAULT = 30;

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

function findLatestAuditPath(repoRoot) {
  const candidates = [
    path.join(repoRoot, ".mindforge", "artifacts", "local"),
    path.join(repoRoot, ".mindforge", "artifacts", "ci"),
  ];

  let latest = null;
  for (const dirPath of candidates) {
    if (!fs.existsSync(dirPath)) continue;
    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".json") || !entry.name.startsWith("audit.")) continue;
      const filePath = path.join(dirPath, entry.name);
      const stat = fs.statSync(filePath);
      if (!latest || stat.mtimeMs > latest.mtimeMs) latest = { filePath, mtimeMs: stat.mtimeMs };
    }
  }
  return latest?.filePath || null;
}

function buildSnapshotArtifact({ audit, auditPath }) {
  const run = audit.run || {};
  const git = run.git || {};
  const createdAt = new Date().toISOString();
  const snapshotId = `snapshot_${(run.run_id || "unknown").replace(/[^a-zA-Z0-9_-]/g, "_")}`;

  return {
    kind: "snapshot_result",
    v: 1,
    generated_at: createdAt,
    snapshot: {
      snapshot_id: snapshotId,
      created_at: createdAt,
      source_audit: {
        path: auditPath,
        run_id: run.run_id || null,
        head: git.head || null,
        base: git.base || null,
        branch: git.branch || null,
      },
      evaluation: audit.evaluation || {},
      policy: audit.policy || {},
      inputs: audit.inputs || {},
      productization: audit.productization || {},
    },
  };
}

export function runSnapshot({ repoRoot }) {
  const auditPath = findLatestAuditPath(repoRoot);
  if (!auditPath) {
    return {
      exitCode: EXIT_ERROR_DEFAULT,
      stdout: buildErrorJson({
        kind: "missing_required_input",
        message: "snapshot requires an existing audit artifact.",
        details: {
          path: path.join(repoRoot, ".mindforge", "artifacts"),
        },
      }),
    };
  }

  try {
    const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));
    const artifact = buildSnapshotArtifact({ audit, auditPath });
    const outDir = path.join(repoRoot, ".mindforge", "snapshots");
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${artifact.snapshot.snapshot_id}.json`);
    fs.writeFileSync(outPath, JSON.stringify(artifact, null, 2) + "\n", "utf8");
    artifact.artifact = { path: outPath };
    return { exitCode: 0, stdout: JSON.stringify(artifact, null, 2) + "\n" };
  } catch (err) {
    return {
      exitCode: EXIT_ERROR_DEFAULT,
      stdout: buildErrorJson({
        kind: "snapshot_failed",
        message: "snapshot failed.",
        details: {
          path: auditPath,
          reason: err?.message || String(err),
        },
      }),
    };
  }
}
