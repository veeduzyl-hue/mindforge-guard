// .mindforge/runtime/lib/snapshot.mjs
import fs from "node:fs";
import path from "node:path";

import { parseArgs, ensureDir, nowIso, uuid, readJson, writeFileAtomic } from "./util.mjs";
import { renderSnapshotMarkdown } from "./snapshotRender.mjs";

/**
 * mf snapshot create
 *   --from=<path>           required; audit json path
 *   --intent="<text>"       optional
 *   --outdir=<path>         optional; default .mindforge/snapshots
 *   --allow-overwrite       optional; default false
 */
export function runSnapshot({ argv, policy }) {
  // COMPAT:
  // Some dispatchers pass: ["snapshot","create","--from=..."]
  // Others pass: ["create","--from=..."]
  const a = normalizeSnapshotArgv(argv);

  const action = a[0]; // "create" | "help" | ...
  if (!action || ["-h", "--help", "help"].includes(action)) {
    return ok(0, snapshotHelp());
  }

  if (action !== "create") {
    return fail(policy, `Unknown snapshot action: ${action}`);
  }

  // parseArgs expects --k=v; only parse params portion (exclude action)
  const args = parseArgs(a.slice(1));

  const from = args.from;
  if (!from) return fail(policy, "Missing --from=<path> (audit json).");
  if (!fs.existsSync(from)) return fail(policy, `Input not found: ${from}`);

  const outBase = args.outdir || ".mindforge/snapshots";
  const allowOverwrite = args["allow-overwrite"] === true;

  let audit;
  try {
    audit = readJson(from);
  } catch (e) {
    return fail(policy, `Failed to parse JSON: ${from} (${e?.message || e})`);
  }

  // Minimal shape check: we only support your v0.10 audit schema here
  const shape = detectAuditShape(audit);
  if (shape !== "mindforge_audit_v1") {
    return fail(policy, `Unsupported input schema (expected MindForge audit v1.0).`);
  }

  const createdAtIso = nowIso();
  const bucket = createdAtIso.slice(0, 7); // YYYY-MM
  const snapshotId = `ds_${compactTs(createdAtIso)}_${uuid().slice(0, 8)}`;

  const outDir = path.join(outBase, bucket);
  ensureDir(outDir);

  const jsonPath = path.join(outDir, `${snapshotId}.json`);
  const mdPath = path.join(outDir, `${snapshotId}.md`);

  if (!allowOverwrite && fs.existsSync(jsonPath)) {
    return fail(policy, `snapshot exists: ${jsonPath}`);
  }

  const snapshot = buildSnapshotFromAudit({
    snapshotId,
    createdAtIso,
    audit,
    fromPath: from,
    intentOverride: typeof args.intent === "string" ? args.intent : "",
  });

  const v = validateSnapshotMinimal(snapshot);
  if (!v.ok) return fail(policy, `snapshot invalid: ${v.reason}`);

  const md = renderSnapshotMarkdown(snapshot);

  writeFileAtomic(jsonPath, JSON.stringify(snapshot, null, 2) + "\n");
  writeFileAtomic(mdPath, md);

  // v0.11: append queryable index (dual-write: global + monthly)
  try {
    appendSnapshotIndexDualWrite({
      snapshot,
      snapshotId,
      createdAtIso,
      bucket,
      fromPath: from,
      outBase,
      outDir,
      jsonPath,
      mdPath,
    });
  } catch {
    // Index is helpful but must not break snapshot creation.
  }

  return ok(
    0,
    `[mindforge] snapshot created\n` +
      `- id: ${snapshotId}\n` +
      `- dir: ${outDir}\n` +
      `- json: ${jsonPath}\n` +
      `- md: ${mdPath}\n`
  );
}

function normalizeSnapshotArgv(argv) {
  const list = Array.isArray(argv) ? argv.slice() : [];
  if (list.length >= 2 && list[0] === "snapshot") {
    return list.slice(1); // drop leading "snapshot"
  }
  return list;
}

function snapshotHelp() {
  return `MindForge v0.11 snapshot

Usage:
  mf snapshot create --from=<audit.json> [--intent="..."] [--outdir=...]

Options:
  --from=<path>           required; input MindForge audit json
  --intent="<text>"       optional; attaches user intent to snapshot
  --outdir=<path>         optional; default .mindforge/snapshots
  --allow-overwrite       optional; default false
`;
}

function detectAuditShape(x) {
  // Your audit schema: { schema_version: "1.0", run: {...}, inputs: {...}, policy: {...}, evaluation: {...} }
  if (!x || typeof x !== "object") return "unknown";
  if (x.schema_version === "1.0" && x.run && x.inputs && x.policy && x.evaluation) return "mindforge_audit_v1";
  return "unknown";
}

function buildSnapshotFromAudit({ snapshotId, createdAtIso, audit, fromPath, intentOverride }) {
  const run = audit.run || {};
  const git = run.git || {};
  const inputs = audit.inputs || {};
  const evaln = audit.evaluation || {};
  const pol = audit.policy || {};

  const signals = inputs.signals || {};
  const diffSummary = inputs.diff_summary || {};

  const verdict = String(evaln.verdict || "");
  const actions = Array.isArray(evaln.actions) ? evaln.actions : [];
  const reasons = Array.isArray(evaln.reasons) ? evaln.reasons : [];

  // v0.11 minimal: infer "blocking" from verdict
  const blocking = verdict === "hard_block";

  // primary reason: first reason.message if present
  const primaryReason =
    reasons.length > 0 ? String(reasons[0]?.message || reasons[0]?.code || "") : "";

  // cluster_id: first reason.code (your rule id)
  const clusterId = reasons.length > 0 ? (reasons[0]?.code || null) : null;

  // severity: map verdict to human label (optional)
  const severity = verdict === "hard_block" ? "high" : verdict === "soft_block" ? "medium" : "none";

  // Note: audit does not carry intent; we attach from CLI
  const intentRaw = String(intentOverride || "");

  return {
    snapshot_version: "0.11",
    snapshot_id: snapshotId,

    context: {
      mode: run.mode || "local",
      trigger: "audit",
      repo: run.repo?.root || null,
      branch: git.branch || null,
      commit: git.head || null,
      base: git.base || null,
    },

    intent: {
      raw: intentRaw,
      normalized: normalizeIntent(intentRaw),
    },

    signals: {
      ...sanitizeSignals(signals),
      diff_files_changed: diffSummary.files_changed ?? signals.files_changed ?? null,
      diff_lines_added: diffSummary.lines_added ?? signals.lines_added ?? null,
      diff_lines_deleted: diffSummary.lines_deleted ?? signals.lines_deleted ?? null,
    },

    assessment: {
      cluster_id: clusterId,
      score: evaln.score ?? null,
      severity,
      primary_reason: primaryReason,
      reasons,
    },

    enforcement: {
      verdict,
      action: blocking ? "BLOCK" : verdict === "soft_block" ? "SUGGEST" : "ALLOW",
      blocking,
      actions,
    },

    outcome: {
      final_action: "UNKNOWN",
      actor: "user",
      override: { reason: null, approved_by: null },
    },

    audit_ref: {
      input_path: fromPath,
      policy_hash: pol.policy_hash || null,
      policy_version: pol.policy_version || null,
      run_id: run.run_id || null,
      head: git.head || null,
      base: git.base || null,
      artifact_hint: `audit.${git.head || "HEAD"}.(json|md)`,
    },

    raw: audit,

    timestamps: { created_at: createdAtIso },
  };
}

function normalizeIntent(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

function sanitizeSignals(signals) {
  if (!signals || typeof signals !== "object") return {};
  const out = {};
  for (const [k, v] of Object.entries(signals)) {
    if (v === null || typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      out[k] = v;
    } else if (Array.isArray(v)) {
      out[k] = v.slice(0, 100);
    } else if (typeof v === "object") {
      out[k] = v;
    }
  }
  return out;
}

function validateSnapshotMinimal(s) {
  if (!s || typeof s !== "object") return { ok: false, reason: "not an object" };
  if (!s.snapshot_version) return { ok: false, reason: "missing snapshot_version" };
  if (!s.snapshot_id) return { ok: false, reason: "missing snapshot_id" };
  if (!s.timestamps?.created_at) return { ok: false, reason: "missing timestamps.created_at" };
  if (!s.context) return { ok: false, reason: "missing context" };
  if (!s.enforcement) return { ok: false, reason: "missing enforcement" };
  if (!s.assessment) return { ok: false, reason: "missing assessment" };
  if (!s.audit_ref) return { ok: false, reason: "missing audit_ref" };
  return { ok: true };
}

function compactTs(iso) {
  // "2026-01-22T08:12:33.000Z" -> "20260122T081233Z"
  return String(iso).replace(/[-:]/g, "").replace(".000Z", "Z");
}

/**
 * v0.11 index dual-write
 * - Global index:  .mindforge/snapshots/index.jsonl
 * - Monthly index: .mindforge/snapshots/YYYY-MM/index.jsonl
 */
function appendSnapshotIndexDualWrite({
  snapshot,
  snapshotId,
  createdAtIso,
  bucket,
  fromPath,
  outBase,
  outDir,
  jsonPath,
  mdPath,
}) {
  const row = buildIndexRow({
    snapshot,
    snapshotId,
    createdAtIso,
    fromPath,
    outBase,
    outDir,
    jsonPath,
    mdPath,
    bucket,
  });

  // 1) Global index
  const globalIndexPath = path.join(".mindforge", "snapshots", "index.jsonl");
  ensureDir(path.dirname(globalIndexPath));
  fs.appendFileSync(globalIndexPath, JSON.stringify(row) + "\n", "utf8");

  // 2) Monthly index
  const monthlyIndexPath = path.join(".mindforge", "snapshots", bucket, "index.jsonl");
  ensureDir(path.dirname(monthlyIndexPath));
  fs.appendFileSync(monthlyIndexPath, JSON.stringify(row) + "\n", "utf8");
}

function buildIndexRow({ snapshot, snapshotId, createdAtIso, fromPath, outBase, outDir, jsonPath, mdPath, bucket }) {
  return {
    id: snapshotId,
    created_at: createdAtIso,
    bucket,

    verdict: snapshot?.enforcement?.verdict ?? null,
    action: snapshot?.enforcement?.action ?? null,
    blocking: snapshot?.enforcement?.blocking ?? null,

    cluster_id: snapshot?.assessment?.cluster_id ?? null,
    severity: snapshot?.assessment?.severity ?? null,
    score: snapshot?.assessment?.score ?? null,

    intent: snapshot?.intent?.normalized ?? "",

    commit: snapshot?.context?.commit ?? null,
    branch: snapshot?.context?.branch ?? null,

    from: toRepoRelative(fromPath),

    out: {
      base: toRepoRelative(outBase),
      dir: toRepoRelative(outDir),
      json: toRepoRelative(jsonPath),
      md: toRepoRelative(mdPath),
    },
  };
}

function toRepoRelative(p) {
  if (!p) return null;
  try {
    const abs = path.resolve(p);
    const rel = path.relative(process.cwd(), abs);
    const out = rel.startsWith("..") ? p : rel;
    return String(out).replace(/\\/g, "/");
  } catch {
    return String(p).replace(/\\/g, "/");
  }
}

function ok(code, stdout) {
  return { exitCode: code, stdout, stderr: "" };
}

function fail(policy, msg) {
  return {
    exitCode: policy?.exit_codes?.error ?? 30,
    stdout: "",
    stderr: msg.startsWith("[mindforge]") ? msg : `[mindforge] ${msg}`,
  };
}
