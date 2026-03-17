// .mindforge/runtime/lib/snapshotRender.mjs

export function renderSnapshotMarkdown(s) {
    const c = s.context || {};
    const i = s.intent || {};
    const sig = s.signals || {};
    const a = s.assessment || {};
    const e = s.enforcement || {};
    const t = s.trace || {};
    const ts = s.timestamps || {};
  
    const lines = [];
    lines.push(`# Decision Snapshot`);
    lines.push(`ID: ${s.snapshot_id}`);
    lines.push(`Date: ${ts.created_at || "n/a"}`);
    lines.push("");
  
    lines.push(`## Context`);
    lines.push(`- mode: ${c.mode ?? "n/a"}`);
    lines.push(`- trigger: ${c.trigger ?? "n/a"}`);
    if (c.repo) lines.push(`- repo: ${c.repo}`);
    if (c.branch) lines.push(`- branch: ${c.branch}`);
    if (c.commit) lines.push(`- commit: ${c.commit}`);
    lines.push("");
  
    lines.push(`## Intent`);
    lines.push(`> ${(i.raw || "").trim()}`);
    lines.push("");
    lines.push(`- normalized: ${i.normalized || ""}`);
    lines.push("");
  
    lines.push(`## Key Signals`);
    const entries = Object.entries(sig);
    if (entries.length === 0) {
      lines.push(`- (none)`);
    } else {
      for (const [k, v] of entries) lines.push(`- ${k}: ${fmt(v)}`);
    }
    lines.push("");
  
    lines.push(`## Assessment`);
    lines.push(`- cluster_id: ${a.cluster_id ?? "n/a"}`);
    lines.push(`- severity: ${a.severity ?? "n/a"}`);
    lines.push(`- score: ${a.score ?? "n/a"}`);
    lines.push(`- primary_reason: ${a.primary_reason ? a.primary_reason : "(none)"}`);
    lines.push("");
  
    lines.push(`## Enforcement`);
    lines.push(`- verdict: ${e.verdict ?? "n/a"}`);
    lines.push(`- action: ${e.action ?? "n/a"}`);
    lines.push(`- blocking: ${e.blocking ? "Yes" : "No"}`);
    lines.push("");
  
    lines.push(`## Outcome`);
    const o = s.outcome || {};
    lines.push(`- final_action: ${o.final_action ?? "UNKNOWN"}`);
    lines.push(`- actor: ${o.actor ?? "n/a"}`);
    const ov = o.override || {};
    lines.push(`- override: ${ov.reason ? "Yes" : "No"}`);
    if (ov.reason) lines.push(`  - reason: ${ov.reason}`);
    if (ov.approved_by) lines.push(`  - approved_by: ${ov.approved_by}`);
    lines.push("");
  
    lines.push(`## Trace`);
    lines.push(`- pack_id: ${t.pack_id ?? "n/a"}`);
    lines.push(`- pack_hash: ${t.pack_hash ?? "n/a"}`);
    lines.push("");
  
    return lines.join("\n") + "\n";
  }
  
  function fmt(v) {
    if (v === null) return "null";
    if (typeof v === "string") return JSON.stringify(v);
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  