import path from "node:path";
import { appendFileSync } from "node:fs";

import {
  parseArgs,
  ensureDir,
  writeFile,
  nowIso,
  uuid,
  getHeadSha,
  getBranchName,
  getRepoRoot,
  diffNumstat,
  diffNameOnly,
  computeSignalsFromNumstat,
  evaluateAudit,
  computeRiskV1,
} from "./kernelCompat.mjs";

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
import {
  buildPolicyPermitBridgeContract,
  assertValidPolicyPermitBridgeContract,
} from "./runtime/governance/bridge/index.mjs";
import {
  buildPermitGateResult,
  assertValidPermitGateResult,
  PERMIT_GATE_DENIED_EXIT_CODE,
  buildGovernanceReceipt,
  assertValidGovernanceReceipt,
  buildGovernanceDecisionRecord,
  assertValidGovernanceDecisionRecord,
  buildGovernanceOutcomeBundle,
  assertValidGovernanceOutcomeBundle,
  buildGovernanceApplicationRecord,
  assertValidGovernanceApplicationRecord,
  buildGovernanceDisposition,
  assertValidGovernanceDisposition,
} from "./runtime/governance/permit/index.mjs";
import {
  buildCanonicalActionArtifactFromAudit,
  buildEnforcementAdjacentDecisionRecord,
  buildExecutionBridgePreview,
  buildExecutionReadinessJudgment,
  buildCanonicalActionPolicyPreview,
  buildPermitPrecheckPreview,
  assertValidEnforcementAdjacentDecisionRecord,
  assertValidExecutionBridgePreview,
  assertValidExecutionReadinessJudgment,
  assertValidCanonicalActionPolicyPreview,
  assertValidPermitPrecheckPreview,
} from "./runtime/actions/index.mjs";

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

function readShadowOptions(argv) {
  const emitCanonicalAction = argv.includes("--emit-canonical-action");
  const emitPolicyPreview = argv.includes("--emit-policy-preview");
  const emitPermitPrecheckPreview = argv.includes("--emit-permit-precheck-preview");
  const emitExecutionBridgePreview = argv.includes("--emit-execution-bridge-preview");
  const emitExecutionReadiness = argv.includes("--emit-execution-readiness");
  const emitEnforcementAdjacentDecision = argv.includes("--emit-enforcement-adjacent-decision");
  const emitPolicyPermitBridge = argv.includes("--emit-policy-permit-bridge");
  let canonicalActionOut = null;
  let policyPreviewOut = null;
  let permitPrecheckOut = null;
  let executionBridgeOut = null;
  let executionReadinessOut = null;
  let enforcementAdjacentDecisionOut = null;
  let policyPermitBridgeOut = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--canonical-action-out=")) {
      canonicalActionOut = arg.slice("--canonical-action-out=".length);
    } else if (arg === "--canonical-action-out" && argv[i + 1]) {
      canonicalActionOut = argv[i + 1];
      i += 1;
    } else if (arg.startsWith("--policy-preview-out=")) {
      policyPreviewOut = arg.slice("--policy-preview-out=".length);
    } else if (arg === "--policy-preview-out" && argv[i + 1]) {
      policyPreviewOut = argv[i + 1];
      i += 1;
    } else if (arg.startsWith("--permit-precheck-out=")) {
      permitPrecheckOut = arg.slice("--permit-precheck-out=".length);
    } else if (arg === "--permit-precheck-out" && argv[i + 1]) {
      permitPrecheckOut = argv[i + 1];
      i += 1;
    } else if (arg.startsWith("--execution-bridge-out=")) {
      executionBridgeOut = arg.slice("--execution-bridge-out=".length);
    } else if (arg === "--execution-bridge-out" && argv[i + 1]) {
      executionBridgeOut = argv[i + 1];
      i += 1;
    } else if (arg.startsWith("--execution-readiness-out=")) {
      executionReadinessOut = arg.slice("--execution-readiness-out=".length);
    } else if (arg === "--execution-readiness-out" && argv[i + 1]) {
      executionReadinessOut = argv[i + 1];
      i += 1;
    } else if (arg.startsWith("--enforcement-adjacent-decision-out=")) {
      enforcementAdjacentDecisionOut = arg.slice("--enforcement-adjacent-decision-out=".length);
    } else if (arg === "--enforcement-adjacent-decision-out" && argv[i + 1]) {
      enforcementAdjacentDecisionOut = argv[i + 1];
      i += 1;
    } else if (arg.startsWith("--policy-permit-bridge-out=")) {
      policyPermitBridgeOut = arg.slice("--policy-permit-bridge-out=".length);
    } else if (arg === "--policy-permit-bridge-out" && argv[i + 1]) {
      policyPermitBridgeOut = argv[i + 1];
      i += 1;
    }
  }

  return {
    emitCanonicalAction,
    canonicalActionOut,
    emitPolicyPreview,
    policyPreviewOut,
    emitPermitPrecheckPreview,
    permitPrecheckOut,
    emitExecutionBridgePreview,
    executionBridgeOut,
    emitExecutionReadiness,
    executionReadinessOut,
    emitEnforcementAdjacentDecision,
    enforcementAdjacentDecisionOut,
    emitPolicyPermitBridge,
    policyPermitBridgeOut,
  };
}

function readPermitGateOptions(argv) {
  const enabled = argv.includes("--permit-gate");
  let out = null;
  let governanceReceiptOut = null;
  let governanceDecisionRecordOut = null;
  let governanceOutcomeBundleOut = null;
  let governanceApplicationRecordOut = null;
  let governanceDispositionOut = null;
  let governanceOutcomeBundleOutRequested = false;
  let governanceApplicationRecordOutRequested = false;
  let governanceDispositionOutRequested = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--permit-gate-out=")) {
      out = arg.slice("--permit-gate-out=".length);
    } else if (arg === "--permit-gate-out" && argv[i + 1]) {
      out = argv[i + 1];
      i += 1;
    } else if (arg.startsWith("--governance-receipt-out=")) {
      governanceReceiptOut = arg.slice("--governance-receipt-out=".length);
    } else if (arg === "--governance-receipt-out" && argv[i + 1]) {
      governanceReceiptOut = argv[i + 1];
      i += 1;
    } else if (arg.startsWith("--governance-decision-record-out=")) {
      governanceDecisionRecordOut = arg.slice("--governance-decision-record-out=".length);
    } else if (arg === "--governance-decision-record-out" && argv[i + 1]) {
      governanceDecisionRecordOut = argv[i + 1];
      i += 1;
    } else if (arg.startsWith("--governance-outcome-bundle-out=")) {
      governanceOutcomeBundleOutRequested = true;
      governanceOutcomeBundleOut = arg.slice("--governance-outcome-bundle-out=".length);
    } else if (arg === "--governance-outcome-bundle-out" && argv[i + 1]) {
      governanceOutcomeBundleOutRequested = true;
      governanceOutcomeBundleOut = argv[i + 1];
      i += 1;
    } else if (arg === "--governance-outcome-bundle-out") {
      governanceOutcomeBundleOutRequested = true;
    } else if (arg.startsWith("--governance-application-record-out=")) {
      governanceApplicationRecordOutRequested = true;
      governanceApplicationRecordOut = arg.slice("--governance-application-record-out=".length);
    } else if (arg === "--governance-application-record-out" && argv[i + 1]) {
      governanceApplicationRecordOutRequested = true;
      governanceApplicationRecordOut = argv[i + 1];
      i += 1;
    } else if (arg === "--governance-application-record-out") {
      governanceApplicationRecordOutRequested = true;
    } else if (arg.startsWith("--governance-disposition-out=")) {
      governanceDispositionOutRequested = true;
      governanceDispositionOut = arg.slice("--governance-disposition-out=".length);
    } else if (arg === "--governance-disposition-out" && argv[i + 1]) {
      governanceDispositionOutRequested = true;
      governanceDispositionOut = argv[i + 1];
      i += 1;
    } else if (arg === "--governance-disposition-out") {
      governanceDispositionOutRequested = true;
    }
  }

  return {
    enabled,
    out,
    governanceReceiptOut,
    governanceDecisionRecordOut,
    governanceOutcomeBundleOut,
    governanceOutcomeBundleOutRequested,
    governanceApplicationRecordOut,
    governanceApplicationRecordOutRequested,
    governanceDispositionOut,
    governanceDispositionOutRequested,
  };
}

function buildGovernanceArtifacts({ audit, effectivePolicy }) {
  const canonicalActionArtifact = buildCanonicalActionArtifactFromAudit(audit);
  const policyPreviewArtifact = assertValidCanonicalActionPolicyPreview(
    buildCanonicalActionPolicyPreview({
      canonicalActionArtifact,
      policy: effectivePolicy,
    })
  );
  const permitPrecheckArtifact = assertValidPermitPrecheckPreview(
    buildPermitPrecheckPreview({
      canonicalActionArtifact,
      policyPreviewArtifact,
    })
  );
  const executionBridgeArtifact = assertValidExecutionBridgePreview(
    buildExecutionBridgePreview({
      canonicalActionArtifact,
      policyPreviewArtifact,
      permitPrecheckArtifact,
    })
  );
  const executionReadinessArtifact = assertValidExecutionReadinessJudgment(
    buildExecutionReadinessJudgment({
      canonicalActionArtifact,
      executionBridgeArtifact,
    })
  );
  const enforcementAdjacentDecisionArtifact = assertValidEnforcementAdjacentDecisionRecord(
    buildEnforcementAdjacentDecisionRecord({
      canonicalActionArtifact,
      executionReadinessArtifact,
    })
  );
  const policyPermitBridgeArtifact = assertValidPolicyPermitBridgeContract(
    buildPolicyPermitBridgeContract({
      canonicalActionArtifact,
      policyPreviewArtifact,
      permitPrecheckArtifact,
      executionBridgeArtifact,
      executionReadinessArtifact,
      enforcementAdjacentDecisionArtifact,
    })
  );

  return {
    canonicalActionArtifact,
    policyPreviewArtifact,
    permitPrecheckArtifact,
    executionBridgeArtifact,
    executionReadinessArtifact,
    enforcementAdjacentDecisionArtifact,
    policyPermitBridgeArtifact,
  };
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
  const shadow = readShadowOptions(argv);
  const permitGate = readPermitGateOptions(argv);
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

  if (shadow.emitCanonicalAction && !shadow.canonicalActionOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "canonical action shadow output requires --canonical-action-out <file>",
    };
  }

  if (!shadow.emitCanonicalAction && shadow.canonicalActionOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "canonical action shadow output requires --emit-canonical-action",
    };
  }

  if (shadow.emitPolicyPreview && !shadow.emitCanonicalAction) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "policy preview output requires --emit-canonical-action",
    };
  }

  if (shadow.emitPolicyPreview && !shadow.policyPreviewOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "policy preview output requires --policy-preview-out <file>",
    };
  }

  if (!shadow.emitPolicyPreview && shadow.policyPreviewOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "policy preview output requires --emit-policy-preview",
    };
  }

  if (shadow.emitPermitPrecheckPreview && !shadow.emitPolicyPreview) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "permit precheck preview requires --emit-policy-preview",
    };
  }

  if (shadow.emitPermitPrecheckPreview && !shadow.permitPrecheckOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "permit precheck preview requires --permit-precheck-out <file>",
    };
  }

  if (!shadow.emitPermitPrecheckPreview && shadow.permitPrecheckOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "permit precheck preview requires --emit-permit-precheck-preview",
    };
  }

  if (shadow.emitExecutionBridgePreview && !shadow.emitPermitPrecheckPreview) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "execution bridge preview requires --emit-permit-precheck-preview",
    };
  }

  if (shadow.emitExecutionBridgePreview && !shadow.executionBridgeOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "execution bridge preview requires --execution-bridge-out <file>",
    };
  }

  if (!shadow.emitExecutionBridgePreview && shadow.executionBridgeOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "execution bridge preview requires --emit-execution-bridge-preview",
    };
  }

  if (shadow.emitExecutionReadiness && !shadow.emitExecutionBridgePreview) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "execution readiness judgment requires --emit-execution-bridge-preview",
    };
  }

  if (shadow.emitExecutionReadiness && !shadow.executionReadinessOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "execution readiness judgment requires --execution-readiness-out <file>",
    };
  }

  if (!shadow.emitExecutionReadiness && shadow.executionReadinessOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "execution readiness judgment requires --emit-execution-readiness",
    };
  }

  if (shadow.emitEnforcementAdjacentDecision && !shadow.emitExecutionReadiness) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "enforcement-adjacent decision record requires --emit-execution-readiness",
    };
  }

  if (shadow.emitEnforcementAdjacentDecision && !shadow.enforcementAdjacentDecisionOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "enforcement-adjacent decision record requires --enforcement-adjacent-decision-out <file>",
    };
  }

  if (!shadow.emitEnforcementAdjacentDecision && shadow.enforcementAdjacentDecisionOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "enforcement-adjacent decision record requires --emit-enforcement-adjacent-decision",
    };
  }

  if (shadow.emitPolicyPermitBridge && !shadow.emitEnforcementAdjacentDecision) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "policy-to-permit bridge contract requires --emit-enforcement-adjacent-decision",
    };
  }

  if (shadow.emitPolicyPermitBridge && !shadow.policyPermitBridgeOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "policy-to-permit bridge contract requires --policy-permit-bridge-out <file>",
    };
  }

  if (!shadow.emitPolicyPermitBridge && shadow.policyPermitBridgeOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "policy-to-permit bridge contract requires --emit-policy-permit-bridge",
    };
  }

  if (permitGate.enabled && mode !== "local") {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "permit gate phase 1 currently supports local audit mode only",
    };
  }

  if (!permitGate.enabled && permitGate.out) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "permit gate output requires --permit-gate",
    };
  }

  if (!permitGate.enabled && permitGate.governanceReceiptOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "governance receipt output requires --permit-gate",
    };
  }

  if (!permitGate.enabled && permitGate.governanceDecisionRecordOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "governance decision record output requires --permit-gate",
    };
  }

  if (!permitGate.enabled && permitGate.governanceOutcomeBundleOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "governance outcome bundle output requires --permit-gate",
    };
  }

  if (!permitGate.enabled && permitGate.governanceApplicationRecordOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "governance application record output requires --permit-gate",
    };
  }

  if (!permitGate.enabled && permitGate.governanceDispositionOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "governance disposition output requires --permit-gate",
    };
  }

  if (permitGate.governanceOutcomeBundleOutRequested && !permitGate.governanceOutcomeBundleOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "governance outcome bundle output requires a file path",
    };
  }

  if (
    permitGate.governanceApplicationRecordOutRequested &&
    !permitGate.governanceApplicationRecordOut
  ) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "governance application record output requires a file path",
    };
  }

  if (permitGate.governanceDispositionOutRequested && !permitGate.governanceDispositionOut) {
    return {
      exitCode: policy.exit_codes.error ?? 30,
      audit: null,
      message: "governance disposition output requires a file path",
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

  if (productization.edition !== "community") {
    drift = readDriftTrendFromAuditJsonl({
      audit_jsonl_path: jsonlPath,
      window: 14,
    });
  }

  // ---- v0.26.1 NEW: Drift Snapshot Context (Pro-only; fail-safe) ----
  // ---- v0.27 NEW: Drift Dominance (Pro-only; additive; fail-safe) ----
  let driftContext = null;

  if (productization.edition !== "community") {
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

  let governanceArtifacts = null;
  let permitGateResult = null;
  let governanceReceipt = null;
  let governanceDecisionRecord = null;
  let governanceOutcomeBundle = null;
  let governanceApplicationRecord = null;
  let governanceDisposition = null;

  if (shadow.emitCanonicalAction || permitGate.enabled) {
    try {
      governanceArtifacts = buildGovernanceArtifacts({
        audit,
        effectivePolicy,
      });

      if (shadow.emitCanonicalAction) {
        const canonicalActionOutPath = path.resolve(process.cwd(), shadow.canonicalActionOut);
        writeFile(
          canonicalActionOutPath,
          JSON.stringify(governanceArtifacts.canonicalActionArtifact, null, 2)
        );
      }

      if (shadow.emitPolicyPreview) {
        const policyPreviewOutPath = path.resolve(process.cwd(), shadow.policyPreviewOut);
        writeFile(
          policyPreviewOutPath,
          JSON.stringify(governanceArtifacts.policyPreviewArtifact, null, 2)
        );
      }

      if (shadow.emitPermitPrecheckPreview) {
        const permitPrecheckOutPath = path.resolve(process.cwd(), shadow.permitPrecheckOut);
        writeFile(
          permitPrecheckOutPath,
          JSON.stringify(governanceArtifacts.permitPrecheckArtifact, null, 2)
        );
      }

      if (shadow.emitExecutionBridgePreview) {
        const executionBridgeOutPath = path.resolve(process.cwd(), shadow.executionBridgeOut);
        writeFile(
          executionBridgeOutPath,
          JSON.stringify(governanceArtifacts.executionBridgeArtifact, null, 2)
        );
      }

      if (shadow.emitExecutionReadiness) {
        const executionReadinessOutPath = path.resolve(process.cwd(), shadow.executionReadinessOut);
        writeFile(
          executionReadinessOutPath,
          JSON.stringify(governanceArtifacts.executionReadinessArtifact, null, 2)
        );
      }

      if (shadow.emitEnforcementAdjacentDecision) {
        const enforcementAdjacentDecisionOutPath = path.resolve(
          process.cwd(),
          shadow.enforcementAdjacentDecisionOut
        );
        writeFile(
          enforcementAdjacentDecisionOutPath,
          JSON.stringify(governanceArtifacts.enforcementAdjacentDecisionArtifact, null, 2)
        );
      }

      if (shadow.emitPolicyPermitBridge) {
        const policyPermitBridgeOutPath = path.resolve(process.cwd(), shadow.policyPermitBridgeOut);
        writeFile(
          policyPermitBridgeOutPath,
          JSON.stringify(governanceArtifacts.policyPermitBridgeArtifact, null, 2)
        );
      }

      if (permitGate.enabled) {
        permitGateResult = assertValidPermitGateResult(
          buildPermitGateResult({
            policyPermitBridgeContract: governanceArtifacts.policyPermitBridgeArtifact,
          })
        );
        if (permitGate.out) {
          const permitGateOutPath = path.resolve(process.cwd(), permitGate.out);
          writeFile(permitGateOutPath, JSON.stringify(permitGateResult, null, 2));
        }
        if (permitGate.governanceReceiptOut) {
          governanceReceipt = assertValidGovernanceReceipt(
            buildGovernanceReceipt({
              audit,
              policyPermitBridgeContract: governanceArtifacts.policyPermitBridgeArtifact,
              permitGateResult,
            })
          );
          const governanceReceiptOutPath = path.resolve(process.cwd(), permitGate.governanceReceiptOut);
          writeFile(governanceReceiptOutPath, JSON.stringify(governanceReceipt, null, 2));
        }
        if (permitGate.governanceDecisionRecordOut) {
          governanceDecisionRecord = assertValidGovernanceDecisionRecord(
            buildGovernanceDecisionRecord({
              audit,
              policyPermitBridgeContract: governanceArtifacts.policyPermitBridgeArtifact,
              permitGateResult,
              governanceReceipt,
            })
          );
          const governanceDecisionRecordOutPath = path.resolve(
            process.cwd(),
            permitGate.governanceDecisionRecordOut
          );
          writeFile(
            governanceDecisionRecordOutPath,
            JSON.stringify(governanceDecisionRecord, null, 2)
          );
        }
        if (permitGate.governanceOutcomeBundleOut) {
          governanceOutcomeBundle = assertValidGovernanceOutcomeBundle(
            buildGovernanceOutcomeBundle({
              audit,
              policyPermitBridgeContract: governanceArtifacts.policyPermitBridgeArtifact,
              permitGateResult,
              governanceReceipt,
              governanceDecisionRecord,
            })
          );
          const governanceOutcomeBundleOutPath = path.resolve(
            process.cwd(),
            permitGate.governanceOutcomeBundleOut
          );
          writeFile(
            governanceOutcomeBundleOutPath,
            JSON.stringify(governanceOutcomeBundle, null, 2)
          );
        }
        if (permitGate.governanceApplicationRecordOut) {
          governanceApplicationRecord = assertValidGovernanceApplicationRecord(
            buildGovernanceApplicationRecord({
              audit,
              policyPermitBridgeContract: governanceArtifacts.policyPermitBridgeArtifact,
              permitGateResult,
              governanceReceipt,
              governanceDecisionRecord,
              governanceOutcomeBundle,
            })
          );
          const governanceApplicationRecordOutPath = path.resolve(
            process.cwd(),
            permitGate.governanceApplicationRecordOut
          );
          writeFile(
            governanceApplicationRecordOutPath,
            JSON.stringify(governanceApplicationRecord, null, 2)
          );
        }
        if (permitGate.governanceDispositionOut) {
          governanceDisposition = assertValidGovernanceDisposition(
            buildGovernanceDisposition({
              audit,
              policyPermitBridgeContract: governanceArtifacts.policyPermitBridgeArtifact,
              permitGateResult,
              governanceReceipt,
              governanceDecisionRecord,
              governanceOutcomeBundle,
              governanceApplicationRecord,
            })
          );
          const governanceDispositionOutPath = path.resolve(
            process.cwd(),
            permitGate.governanceDispositionOut
          );
          writeFile(
            governanceDispositionOutPath,
            JSON.stringify(governanceDisposition, null, 2)
          );
        }
      }
    } catch (err) {
      return {
        exitCode: policy.exit_codes.error ?? 30,
        audit: null,
        message: `governance bridge or permit gate preparation failed: ${err?.message || String(err)}`,
      };
    }
  }

  let exitCode =
    verdict === "allow"
      ? policy.exit_codes.allow
      : verdict === "soft_block"
      ? policy.exit_codes.soft_block
      : verdict === "hard_block"
      ? policy.exit_codes.hard_block
      : policy.exit_codes.error;

  if (permitGateResult?.permit_gate?.decision === "deny") {
    exitCode = permitGateResult?.permit_gate?.exit_code ?? PERMIT_GATE_DENIED_EXIT_CODE;
  }

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

  return {
    exitCode,
    audit,
    permitGateResult,
    governanceReceipt,
    governanceDecisionRecord,
    governanceOutcomeBundle,
    governanceApplicationRecord,
    governanceDisposition,
  };
}
