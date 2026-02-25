import path from "node:path";
import { appendFileSync } from "node:fs";

import { parseArgs, ensureDir, writeFile, nowIso, uuid } from "@veeduzyl/mindforge-kernel/src/util.mjs";

import {
  getHeadSha,
  getBranchName,
  getRepoRoot,
  diffNumstat,
  diffNameOnly,
} from "@veeduzyl/mindforge-kernel/src/git.mjs";

import { computeSignalsFromNumstat } from "@veeduzyl/mindforge-kernel/src/signals.mjs";
import { evaluateAudit } from "@veeduzyl/mindforge-kernel/src/audit.mjs";

// v0.23 NEW (pure): Risk v1 + Spread
import { computeRiskV1 } from "@veeduzyl/mindforge-kernel/src/risk_v1.mjs";

// productization
import { loadGuardEditionFromLocalLicense } from "./product/license.mjs";
import { applyTierGateToPolicy } from "./product/tier_gate.mjs";
import { LICENSE_KEY_METADATA } from "./product/license_key_metadata.mjs";

// v0.23 NEW (IO, Pro only): Drift analytics
import { readDriftTrendFromAuditJsonl } from "./analytics/drift.mjs";

// v0.25 NEW: Drift Collector (append-only; must not affect exit)
import { collectDriftEvent } from "./runtime/drift/collector.mjs";

// v0.26 NEW: Drift Snapshot Builder (Pro-only context block)
import { buildDriftStatus } from "./runtime/drift/status.mjs";

function deriveActions(verdict, reasons) {
  if (verdict === "hard_block") {
    return [{ type: "block", payload: { reasons_count: reasons.length } }];
  }
  if (verdict === "soft_block") {
    return [{ type: "suggest", payload: { reasons_count: reasons.length } }];
  }
  return [];
}

function renderLicenseLine(p) {
  const edition = p?.edition || "community";
  const status = p?.license_status || "missing";
  const key = p?.key_id || "none";
  const dep = p?.deprecated ? "deprecated" : "active";
  const issuer = p?.issuer || "unknown-issuer";
  return `[mindforge] license: edition=${edition} status=${status} key=${key} (${dep}) issuer="${issuer}"`;
}

// Stable guard-wide jsonl for drift analytics
function getGuardJsonlPath(repoRoot) {
  return path.join(repoRoot, ".mindforge", "artifacts", "guard", "audit.jsonl");
}

function appendAuditJsonlLine(jsonlPath, obj) {
  ensureDir(path.dirname(jsonlPath));
  appendFileSync(jsonlPath, JSON.stringify(obj) + "\n", "utf8");
}

/**
 * v0.27 fallback: compute dominance from modules if dominance is absent.
 * - pure
 * - stable ordering
 * - signal-only
 */
function computeDominanceFallback(modules, metric = "drift_units", topN = 5) {
  if (!Array.isArray(modules) || modules.length === 0) {
    return {
      metric,
      top_n: topN,
      total_contribution: 0,
      top_modules: [],
      dominance_ratio: 0,
      top3_share: 0,
      cross_boundary: { is_cross_boundary: false, boundaries: [], note: "signal-only" },
    };
  }

  const sorted = [...modules].sort((a, b) => {
    const av = Number(a?.[metric] ?? 0);
    const bv = Number(b?.[metric] ?? 0);
    if (bv !== av) return bv - av;
    return String(a?.module ?? "").localeCompare(String(b?.module ?? ""));
  });

  const total = sorted.reduce((sum, m) => sum + Number(m?.[metric] ?? 0), 0);
  const top_modules = sorted.slice(0, topN).map((m, i) => {
    const contribution = Number(m?.[metric] ?? 0);
    return {
      module: m.module,
      contribution,
      share: total > 0 ? contribution / total : 0,
      rank: i + 1,
    };
  });

  const dominance_ratio = top_modules.length > 0 ? top_modules[0].share : 0;
  const top3_share = top_modules.slice(0, 3).reduce((s, m) => s + m.share, 0);

  // Optional boundary aggregation
  const boundaryMap = {};
  for (const m of sorted) {
    const b = m?.boundary;
    if (!b) continue;
    boundaryMap[b] = (boundaryMap[b] || 0) + Number(m?.[metric] ?? 0);
  }
  const boundaries = Object.entries(boundaryMap)
    .map(([boundary, contribution]) => ({
      boundary,
      contribution,
      share: total > 0 ? contribution / total : 0,
    }))
    .sort((a, b) => {
      if (b.contribution !== a.contribution) return b.contribution - a.contribution;
      return String(a.boundary).localeCompare(String(b.boundary));
    });

  return {
    metric,
    top_n: topN,
    total_contribution: total,
    top_modules,
    dominance_ratio,
    top3_share,
    cross_boundary: {
      is_cross_boundary: boundaries.length > 1,
      boundaries,
      note: "signal-only",
    },
  };
}

export async function runAudit({ argv, policy }) {
  const args = parseArgs(argv);
  const mode = args.mode === "ci" ? "ci" : "local";

  const head = args.head || getHeadSha();
  const base = args.base || "";
  const staged = !!args.staged;

  if (mode === "local" && !staged) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "local mode requires --staged",
    };
  }

  const outdir =
    args.outdir ||
    path.join(process.cwd(), ".mindforge", "artifacts", mode === "ci" ? "ci" : "local");

  ensureDir(outdir);

  const repoRoot = getRepoRoot();
  const branch = getBranchName();

  // ---- signals ----
  const numstatLines = diffNumstat({
    staged,
    base: mode === "ci" ? base : undefined,
    head: mode === "ci" ? head : undefined,
  });

  const signals = computeSignalsFromNumstat(numstatLines);

  const touched_paths = diffNameOnly({
    staged,
    base: mode === "ci" ? base : undefined,
    head: mode === "ci" ? head : undefined,
  });

  // ---- license ----
  const lic = loadGuardEditionFromLocalLicense();
  const effectivePolicy = applyTierGateToPolicy(policy, lic.edition);

  // ---- evaluation (MUST NOT CHANGE) ----
  const { verdict, score, reasons } = evaluateAudit({
    policy: effectivePolicy,
    signals,
  });

  const keyId = lic?.key_id || null;
  const meta = keyId ? LICENSE_KEY_METADATA?.[keyId] : null;

  const productization = {
    edition: lic?.edition || "community",
    license_status: lic?.status || "missing",
    key_id: keyId,
    deprecated: !!meta?.deprecated,
    issuer: meta?.issuer || null,
  };

  if (mode === "local" && policy?.defaults?.render_human_summary) {
    console.log(renderLicenseLine(productization));
  }

  const runId = uuid();
  const timestamp = nowIso();

  // ---- Risk v1 (pure; additive) ----
  const risk = computeRiskV1({
    lines_added: signals.lines_added,
    files_changed: signals.files_changed,
    touched_paths,
  });

  // ---- Drift analytics (existing v0.23; remains in risk.drift) ----
  const jsonlPath = getGuardJsonlPath(repoRoot);
  let drift = null;

  if (productization.edition === "pro") {
    drift = readDriftTrendFromAuditJsonl({
      audit_jsonl_path: jsonlPath,
      window: 14,
    });
  }

  // ---- v0.26.1 NEW: Drift Snapshot Context (Pro-only; fail-safe) ----
  // ---- v0.27 NEW: Drift Dominance (Pro-only; additive; fail-safe) ----
  let driftContext = null;

  if (productization.edition === "pro") {
    try {
      const driftBundle = buildDriftStatus({
        repoRoot,
        window: "7d",
      });

      const dominance =
        driftBundle?.dominance ||
        (Array.isArray(driftBundle?.modules)
          ? computeDominanceFallback(driftBundle.modules, "drift_units", 5)
          : undefined);

      driftContext = {
        trend: driftBundle.trend,
        density: driftBundle.signal.density,
        slope: driftBundle.signal.slope,
        expansion: driftBundle.signal.expansion,
        unique_modules: driftBundle.signal.unique_modules,
        window: driftBundle.window,
        generated_at: driftBundle.generated_at,

        // v0.27 additive
        dominance: dominance || undefined,
      };
    } catch {
      driftContext = null; // fail-safe
    }
  }

  const audit = {
    schema_version: "1.0",
    run: {
      run_id: runId,
      mode,
      timestamp,
      repo: { root: repoRoot },
      git: { head, base: base || undefined, branch },
    },
    inputs: {
      diff_summary: {
        files_changed: signals.files_changed,
        lines_added: signals.lines_added,
        lines_deleted: signals.lines_deleted,
      },
      signals,
      paths: {
        touched_paths_count: touched_paths.length,
        touched_paths,
      },
    },
    policy: {
      policy_hash: policy.__policy_hash,
      policy_version: policy.policy_version || "v0.10",
    },
    evaluation: {
      verdict,
      score,
      reasons,
      actions: deriveActions(verdict, reasons),
    },
    risk: {
      ...risk,
      drift: drift || undefined,
    },
    context: driftContext
      ? {
          drift: driftContext,
        }
      : {},
    productization,
    artifacts: {},
  };

  // ---- append analytics series ----
  appendAuditJsonlLine(jsonlPath, {
    ts: timestamp,
    run_id: runId,
    mode,
    git: { head, base: base || undefined, branch },
    risk: { v: risk.v, score: risk.score },
    spread: {
      modules_touched: risk.spread.modules_touched,
      entropy_norm: risk.spread.entropy_norm,
      dominant_module: risk.spread.dominant_module,
      dominant_share: risk.spread.dominant_share,
      cross_boundary: risk.spread.cross_boundary,
    },
    edition: productization.edition,
  });

  const auditJsonPath = path.join(outdir, `audit.${head}.json`);
  writeFile(auditJsonPath, JSON.stringify(audit, null, 2));

  const exitCode =
    verdict === "allow"
      ? policy.exit_codes.allow
      : verdict === "soft_block"
      ? policy.exit_codes.soft_block
      : verdict === "hard_block"
      ? policy.exit_codes.hard_block
      : policy.exit_codes.error;

  // ---- Drift Collector (must never affect exit) ----
  collectDriftEvent(
    {
      surface_id: "audit",
      module: risk?.spread?.dominant_module || "unknown",
      risk_score: risk?.score ?? null,
      severity: null,
      verdict,
      exit_code: exitCode,
      ds_exit_001: "PASS",
      receipt_id: null,
      snapshot_id: null,
    },
    { repoRoot }
  );

  return { exitCode, audit };
}
