#!/usr/bin/env node
import fs from "node:fs";

function readPkgVersion() {
  try {
    const pkgPath = new URL("../package.json", import.meta.url);
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    return pkg.version || "unknown";
  } catch {
    return "unknown";
  }
}

const GUARD_VERSION = readPkgVersion();

import path from "node:path";

import { loadPolicy } from "@veeduzyl/mindforge-kernel/src/policy.mjs";
import {
  validatePolicyFile,
  defaultPolicyPath
} from "@veeduzyl/mindforge-kernel/src/validatePolicy.mjs";

// Drift (signal-only)
import { buildDriftStatus } from "./runtime/drift/status.mjs";
import { buildTimeline } from "./runtime/drift/timeline.mjs";
import { buildCompare } from "./runtime/drift/compare.mjs";

// Assoc (signal-only analytics)
import { buildAssociationBundle } from "./runtime/association/index.mjs";

// License (offline, signed v2)
import {
  readLicense,
  removeLicense,
  licenseTier,
  getLicensePath,
} from "./product/license.mjs";

// Product license gating (monetization tiers)
// NOTE: Repo policy edition (guard init --edition) is separate from account/license edition.
const EXIT_LICENSE_REQUIRED = 21;

function tierNumFromEdition(edition) {
  if (edition === "pro+") return 2;
  if (edition === "pro") return 1;
  return 0;
}

function licenseGateResult({ lic, requiredEdition, feature }) {
  const currentEdition = lic && lic.kind === "ok" ? lic.edition : "community";
  const current = tierNumFromEdition(currentEdition);
  const required = requiredEdition === "pro_plus" ? 2 : requiredEdition === "pro" ? 1 : 0;
  if (current >= required) return null;

  const payload = {
    ok: false,
    error: {
      kind: "license_required",
      feature: feature || "",
      required_edition: requiredEdition === "pro_plus" ? "pro+" : requiredEdition,
      current_edition: currentEdition,
      hint: "Install a signed license file: guard license install <file>",
    },
  };
  return { exitCode: EXIT_LICENSE_REQUIRED, stdout: JSON.stringify(payload, null, 2) + "\n" };
}

// DS-EXIT-001: keep stable defaults for packaging failures
const EXIT_ERROR_DEFAULT = 30;

function showLicenseSummaryLocal() {
  const lic = readLicense();
  if (!lic || lic.kind === "missing") return "license: missing";
  if (lic.kind === "invalid") return `license: invalid (${lic.reason || "unknown"})`;
  if (lic.kind === "expired") return `license: expired (${lic.edition || "unknown"}) expires: ${lic.expiry || ""}`;
  if (lic.kind === "not_yet_valid") return `license: not_yet_valid (${lic.edition || "unknown"}) starts: ${lic.not_before || ""}`;
  if (lic.kind === "ok") return `license: ok (${lic.edition}) expires: ${lic.expiry || ""}`;
  return `license: ${lic.kind}`;
}

function renderGuardHelp() {
  return [
    "MindForge Guard - AI Coding Safety Layer",
    "",
    "Usage:",
    "  guard <command> [options]",
    "",
    "Getting started:",
    "  guard status",
    "  guard init",
    "",
    "Core:",
    "  guard validate-policy [--path=<file>]",
    "  guard audit .",
    "  guard snapshot .",
    "",
    "Drift (signal-only; no policy required):",
    "  guard drift status   [--window 7d|14d|30d] [--format text|json] [--pretty] [--out <file>]",
    "  guard drift timeline [--window 7d|14d|30d]",
    "  guard drift compare  [--window 7d|14d|30d]",
    "",
    "Analytics (signal-only; no policy required):",
    "  guard assoc correlate [--window 7d|14d|30d] [--bucket day]",
    "                       [--x drift_density|drift_events|drift_unique_modules]",
    "                       [--y risk_score_avg|risk_score_p95|risk_events]",
    "                       [--lags <n>] [--subsamples <n>]",
    "                       [--eventsPath <file>] [--auditPath <file>]",
    "                       [--pretty]",
    "",
    "License (offline; signed v2):",
    "  guard license status",
    "  guard license show",
    "  guard license install <file>",
    "  guard license remove",
    "",
    "Options:",
    "  --help, -h     Show help",
    "  --version, -v  Show version",
    "",
  ].join("\n");
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFileAtomic(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function getRepoPolicyPath(repoRoot) {
  return path.join(repoRoot, ".mindforge", "config", "policy.json");
}

function policyMissingMessage(policyPath) {
  return (
    "Guard is not initialized for this repo.\n" +
    `Missing policy file: ${policyPath}\n\n` +
    "Run:\n" +
    "  guard init\n"
  );
}

/* -------------------------
 * Policy schema bridge
 * ------------------------- */

/**
 * Legacy policy format (v=1) used by early Guard packaging:
 * {
 *   v: 1,
 *   edition: "community|pro|pro+",
 *   exit_codes: { ok, soft_block, hard_block, error },
 *   limits: { lines_added_soft, files_changed_hard }
 * }
 */
function isLegacyPolicyV1(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    obj.v === 1 &&
    !("policy_version" in obj) &&
    obj.exit_codes &&
    typeof obj.exit_codes === "object"
  );
}

/**
 * Current policy schema expected by kernel validatePolicyFile (Guard Open-core v1.0):
 * {
 *   policy_version: "1.0",
 *   defaults: {},
 *   thresholds: {},
 *   rules: [],
 *   exit_codes: { allow, soft_block, hard_block, error }
 * }
 */
function migrateLegacyPolicyV1ToPolicySchema(legacy) {
  const edition = normalizeEdition(legacy.edition || "community");
  const limits = legacy.limits || {};
  const exit = legacy.exit_codes || {};

  return {
    policy_version: "1.0",
    defaults: {
      edition,
    },
    thresholds: {
      lines_added_soft:
        typeof limits.lines_added_soft === "number" ? limits.lines_added_soft : 900,
      files_changed_hard:
        typeof limits.files_changed_hard === "number" ? limits.files_changed_hard : 16,
    },
    rules: [],
    exit_codes: {
      allow: typeof exit.ok === "number" ? exit.ok : 0,
      soft_block: typeof exit.soft_block === "number" ? exit.soft_block : 10,
      hard_block: typeof exit.hard_block === "number" ? exit.hard_block : 20,
      error: typeof exit.error === "number" ? exit.error : EXIT_ERROR_DEFAULT,
    },
  };
}

function normalizeEdition(e) {
  const s = String(e || "").trim().toLowerCase();
  if (s === "pro_plus" || s === "pro+") return "pro+";
  if (s === "pro") return "pro";
  return "community";
}

function readJsonBestEffort(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeTry(fn, fallback) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

function stableDriftBundle({ window }) {
  return {
    kind: "drift_signal_bundle",
    v: 2,
    window,
    generated_at: new Date().toISOString(),
    trend: "stable",
    signal: {
      density: 0,
      unique_modules: 0,
      events_current: 0,
      events_prev: 0,
      expansion_modules: 0,
      top_modules: [],
    },
    events: [],
  };
}

function tierLabel(t) {
  if (t >= 2) return "pro+";
  if (t === 1) return "pro";
  return "community";
}

function effectiveTier({ policyEdition, licenseTierNum }) {
  const policyTier = tierNumFromEdition(policyEdition);
  const overall = Math.min(policyTier, licenseTierNum);
  // Analytics follows license tier, enforcement follows policy tier
  return {
    enforcement: tierLabel(policyTier),
    analytics: tierLabel(licenseTierNum),
    overall: tierLabel(overall),
  };
}

function licenseStateFromFile() {
  const lic = readLicense();
  if (!lic || lic.kind === "missing") return { state: "missing", note: "" };
  if (lic.kind === "ok") {
    const until = lic.not_after ? `not_after: ${lic.not_after}` : "not_after: none";
    return {
      state: lic.edition,
      note: until,
    };
  }
  if (lic.kind === "expired") {
    return {
      state: `community (expired license)`,
      note: lic.reason ? `reason: ${lic.reason}` : `path: ${lic.path}`,
    };
  }
  if (lic.kind === "not_yet_valid") {
    return {
      state: `community (not yet valid)`,
      note: lic.reason ? `reason: ${lic.reason}` : `path: ${lic.path}`,
    };
  }
  return {
    state: "community (invalid license)",
    note: lic.reason || `path: ${lic.path}`,
  };
}

function renderStatusText({ repoRoot, policyState, driftState, licenseState, effective }) {
  const lines = [];
  lines.push("Guard Status");
  lines.push("------------");
  lines.push(`Policy: ${policyState.kind === "ok" ? "ok" : policyState.kind}`);
  if (policyState.kind === "ok") {
    lines.push(`  edition: ${policyState.edition} (repo)`);
    lines.push(`  path: ${policyState.path}`);
  } else {
    lines.push(`  path: ${policyState.path}`);
    if (policyState.reason) lines.push(`  reason: ${policyState.reason}`);
  }
  lines.push("");
  lines.push(`Drift: ${driftState.trend}`);
  lines.push(`  window: ${driftState.window}`);
  lines.push(`  density: ${driftState.density} events/day`);
  lines.push(`  unique_modules: ${driftState.unique_modules}`);
  lines.push("");
  lines.push(`License: ${licenseState.state}`);
  if (licenseState.note) lines.push(`  note: ${licenseState.note}`);
  lines.push("");
  lines.push("Effective");
  lines.push("---------");
  lines.push(`Enforcement: ${effective.enforcement} (policy)`);
  lines.push(`Analytics:   ${effective.analytics} (license)`);
  lines.push(`Overall:     ${effective.overall} (min)`);
  if (effective.overall !== effective.enforcement) {
    lines.push(
      `note: repo policy edition limits enforcement. you can re-init with: guard init --force --edition ${effective.analytics}`
    );
  }
  lines.push("");
  lines.push(`Repo: ${repoRoot}`);
  lines.push("");
  return lines.join("\n");
}

/* -------------------------
 * CLI parsing helpers
 * ------------------------- */

function parseInitArgs(args) {
  const out = { help: false, force: false, dryRun: false, edition: null };
  for (const a of args) {
    if (a === "--help" || a === "-h") out.help = true;
    else if (a === "--force") out.force = true;
    else if (a === "--dry-run") out.dryRun = true;
    else if (a.startsWith("--edition=")) out.edition = a.split("=", 2)[1];
    else if (a === "--edition") {
      // handled in caller if needed
    }
  }
  // Support: --edition pro+
  const edIdx = args.findIndex((x) => x === "--edition");
  if (edIdx >= 0 && args[edIdx + 1]) out.edition = args[edIdx + 1];
  return out;
}

function renderInitHelp() {
  return [
    "Usage:",
    "  guard init [--force] [--edition community|pro|pro+] [--dry-run]",
    "",
    "Creates .mindforge/config/policy.json in the current repo.",
    "",
    "Examples:",
    "  guard init",
    "  guard init --force",
    "  guard init --force --edition pro+",
    "",
  ].join("\n");
}

function renderLicenseHelp() {
  return [
    "Usage:",
    "  guard license status",
    "  guard license show",
    "  guard license install <file>",
    "  guard license remove",
    "",
  ].join("\n");
}

/* -------------------------
 * Core commands
 * ------------------------- */

async function runAudit({ repoRoot, argv }) {
  // deferred import to keep startup minimal
  const { runAudit } = await import("./runAudit.mjs");
  return runAudit({ repoRoot, argv });
}

async function runSnapshot({ repoRoot, argv }) {
  const { runSnapshot } = await import("./runtime/snapshot.mjs");
  return runSnapshot({ repoRoot, argv });
}

/* -------------------------
 * Main Guard router
 * ------------------------- */

export async function runGuard({ argv }) {
  if (!argv || argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    return { exitCode: 0, stdout: renderGuardHelp() + "\n" };
  }
  if (argv.includes("--version") || argv.includes("-v")) {
    return { exitCode: 0, stdout: `guard ${GUARD_VERSION}\n` };
  }

  const cmd = argv[0];
  const repoRoot = process.cwd();

  // -------------------------
  // status (Day-0 UX)
  // -------------------------
  if (cmd === "status") {
    const policyPath = getRepoPolicyPath(repoRoot);

    // Policy state
    let policyState;
    if (!fs.existsSync(policyPath)) {
      policyState = { kind: "missing", path: policyPath };
    } else {
      const parsed = readJsonBestEffort(policyPath);
      if (parsed && typeof parsed === "object") {
        // Support both legacy v=1 and current schema
        const edition =
          (isLegacyPolicyV1(parsed) && parsed.edition) ||
          (parsed.defaults && parsed.defaults.edition) ||
          parsed.edition ||
          "community";

        policyState = {
          kind: "ok",
          edition: normalizeEdition(edition),
          path: policyPath,
        };
      } else {
        policyState = {
          kind: "error",
          reason: "policy.json is not valid JSON",
          path: policyPath,
        };
      }
    }

    // Drift state (signal-only)
    const driftBundle = safeTry(
      () => buildDriftStatus({ repoRoot, window: "7d" }),
      stableDriftBundle({ window: "7d" })
    );
    const driftState = {
      kind: "ok",
      trend: driftBundle.trend,
      window: driftBundle.window,
      density: driftBundle.signal?.density ?? 0,
      unique_modules: driftBundle.signal?.unique_modules ?? 0,
    };

    // License
    const licenseState = licenseStateFromFile();
    const licObj = readLicense();
    const licTier = licenseTier(licObj);
    const policyEdition = policyState.kind === "ok" ? policyState.edition : "community";
    const eff = effectiveTier({ policyEdition, licenseTierNum: licTier });

    return {
      exitCode: 0,
      stdout: renderStatusText({
        repoRoot,
        policyState,
        driftState,
        licenseState,
        effective: eff,
      }),
    };
  }

  // -------------------------
  // license (offline, signed v2)
  // -------------------------
  if (cmd === "license") {
    const sub = argv[1] || "";
    if (sub === "status") {
      const s = showLicenseSummaryLocal();
      return { exitCode: 0, stdout: s + "\n" };
    }

    if (sub === "show") {
      const lic = readLicense();
      return { exitCode: 0, stdout: JSON.stringify(lic, null, 2) + "\n" };
    }

    if (sub === "install") {
      const src = argv[2];
      if (!src) {
        return {
          exitCode: 2,
          stderr: "Missing license file.\nUsage: guard license install <file>\n",
        };
      }
      const dest = getLicensePath();
      try {
        const buf = fs.readFileSync(src);
        ensureDir(path.dirname(dest));
        fs.writeFileSync(dest, buf);
        const lic = readLicense();
        return {
          exitCode: 0,
          stdout:
            "Installed license file.\n" +
            (lic.kind === "ok" ? `edition: ${lic.edition}\n` : "") +
            (lic.not_before ? `not_before: ${lic.not_before}\n` : "") +
            (lic.not_after ? `not_after: ${lic.not_after}\n` : "") +
            (lic.key_id ? `key_id: ${lic.key_id}\n` : "") +
            (lic.license_id ? `license_id: ${lic.license_id}\n` : "") +
            `path: ${dest}\n`,
        };
      } catch (err) {
        return {
          exitCode: EXIT_ERROR_DEFAULT,
          stderr:
            "License install failed.\n" +
            `error: ${err?.message || String(err)}\n` +
            `path: ${dest}\n`,
        };
      }
    }

    if (sub === "remove") {
      const res = removeLicense();
      return {
        exitCode: 0,
        stdout:
          res.removed
            ? `Removed license file: ${res.path}\n`
            : `No license file found: ${res.path}\n`,
      };
    }

    return { exitCode: 0, stdout: renderLicenseHelp() + "\n" };
  }

  // -------------------------
  // init (Day-0 UX)
  // -------------------------
  if (cmd === "init") {
    const args = parseInitArgs(argv.slice(1));
    if (args.help) return { exitCode: 0, stdout: renderInitHelp() + "\n" };

    const policyPath = getRepoPolicyPath(repoRoot);
    const exists = fs.existsSync(policyPath);

    if (exists && !args.force) {
      // Tip if user has higher license than community
      const lic = readLicense();
      const lt = licenseTier(lic);
      const tip =
        lt > 0
          ? `Tip: you have a ${tierLabel(lt)} license. you can run:\n  guard init --force --edition ${tierLabel(
              lt
            )}\n`
          : `Tip: re-run with --force to overwrite.\n`;

      return {
        exitCode: 0,
        stdout: `Guard already initialized: ${policyPath}\n` + tip,
      };
    }

    let edition = args.edition ? String(args.edition).trim() : null;
    edition = normalizeEdition(edition || "community");

    const policy = defaultPolicyJson({ edition });
    const content = JSON.stringify(policy, null, 2) + "\n";

    if (args.dryRun) {
      return {
        exitCode: 0,
        stdout: `Dry-run: would write policy to ${policyPath}\n\n` + content,
      };
    }

    writeFileAtomic(policyPath, content);
    ensureDir(path.join(repoRoot, ".mindforge", "drift"));
    ensureDir(path.join(repoRoot, ".mindforge", "audit"));

    // Optional: immediately validate to avoid "init succeeded but policy invalid"
    const v = validatePolicyFile(policyPath);
    if (!v.ok) {
      let err = `[mindforge] policy invalid after init: ${policyPath}\n`;
      for (const e of v.errors) err += `- ${e}\n`;
      return { exitCode: 20, stderr: err };
    }

    return {
      exitCode: 0,
      stdout: `Initialized Guard: ${policyPath}\n`,
    };
  }

  // -------------------------
  // validate-policy (no need to load repo policy)
  // -------------------------
  if (cmd === "validate-policy") {
    const args = argv.slice(1);
    const pathArg = args.find((a) => a.startsWith("--path="));
    const p = pathArg ? pathArg.split("=", 2)[1] : getRepoPolicyPath(repoRoot);

    if (!fs.existsSync(p)) {
      return { exitCode: 2, stderr: policyMissingMessage(p) };
    }

    // Support legacy v=1 auto-migrate (in memory) before validating with kernel schema
    const parsed = readJsonBestEffort(p);
    if (parsed && isLegacyPolicyV1(parsed)) {
      const migrated = migrateLegacyPolicyV1ToPolicySchema(parsed);
      // validate migrated JSON via kernel by writing to a temp file? kernel validatePolicyFile wants a path.
      // But we can validate by writing to a sibling temp file and cleaning it up.
      const tmp = p + ".tmp.migrated.json";
      try {
        fs.writeFileSync(tmp, JSON.stringify(migrated, null, 2) + "\n", "utf8");
        const v = validatePolicyFile(tmp);
        fs.unlinkSync(tmp);
        if (!v.ok) {
          let err = `[mindforge] policy invalid: ${p}\n`;
          err += `note: legacy v=1 migrated for validation\n`;
          for (const e of v.errors) err += `- ${e}\n`;
          return { exitCode: 20, stderr: err };
        }
        return { exitCode: 0, stdout: `[mindforge] policy valid: ${p}\n` };
      } catch (err) {
        try { fs.existsSync(tmp) && fs.unlinkSync(tmp); } catch {}
        return {
          exitCode: EXIT_ERROR_DEFAULT,
          stderr: `[mindforge] validate-policy failed: ${p}\nerror: ${err?.message || String(err)}\n`,
        };
      }
    }

    const v = validatePolicyFile(p);
    if (!v.ok) {
      let err = `[mindforge] policy invalid: ${p}\n`;
      for (const e of v.errors) err += `- ${e}\n`;
      return { exitCode: 20, stderr: err };
    }
    return { exitCode: 0, stdout: `[mindforge] policy valid: ${p}\n` };
  }

  // -------------------------
  // audit
  // -------------------------
  if (cmd === "audit") {
    const policyPath = getRepoPolicyPath(repoRoot);
    if (!fs.existsSync(policyPath)) {
      return { exitCode: 2, stderr: policyMissingMessage(policyPath) };
    }

    // ensure policy can be loaded (and auto-migrate legacy v=1 on disk)
    const parsed = readJsonBestEffort(policyPath);
    if (parsed && isLegacyPolicyV1(parsed)) {
      const migrated = migrateLegacyPolicyV1ToPolicySchema(parsed);
      writeFileAtomic(policyPath, JSON.stringify(migrated, null, 2) + "\n");
    }

    return runAudit({ repoRoot, argv: argv.slice(1) });
  }

  // -------------------------
  // snapshot
  // -------------------------
  if (cmd === "snapshot") {
    const policyPath = getRepoPolicyPath(repoRoot);
    if (!fs.existsSync(policyPath)) {
      return { exitCode: 2, stderr: policyMissingMessage(policyPath) };
    }

    // ensure policy can be loaded (and auto-migrate legacy v=1 on disk)
    const parsed = readJsonBestEffort(policyPath);
    if (parsed && isLegacyPolicyV1(parsed)) {
      const migrated = migrateLegacyPolicyV1ToPolicySchema(parsed);
      writeFileAtomic(policyPath, JSON.stringify(migrated, null, 2) + "\n");
    }

    return runSnapshot({ repoRoot, argv: argv.slice(1) });
  }

  // -------------------------
  // drift (signal-only)
  // -------------------------
  if (cmd === "drift") {
    const sub = argv[1] || "status";
    const args = argv.slice(2);

    const windowArg = args.find((a) => a.startsWith("--window"));
    let window = "7d";
    if (windowArg) {
      const parts = windowArg.includes("=") ? windowArg.split("=", 2) : null;
      if (parts && parts[1]) window = parts[1];
      const idx = args.findIndex((x) => x === "--window");
      if (idx >= 0 && args[idx + 1]) window = args[idx + 1];
    }

    if (sub === "status") {
      const fmt =
        args.includes("--format=json") || args.includes("--format") && args[args.indexOf("--format") + 1] === "json"
          ? "json"
          : "text";
      const pretty = args.includes("--pretty");
      const outIdx = args.findIndex((a) => a === "--out");
      const outPath = outIdx >= 0 ? args[outIdx + 1] : null;

      const bundle = safeTry(
        () => buildDriftStatus({ repoRoot, window }),
        stableDriftBundle({ window })
      );

      if (fmt === "json") {
        const payload = pretty ? JSON.stringify(bundle, null, 2) + "\n" : JSON.stringify(bundle) + "\n";
        if (outPath) {
          writeFileAtomic(outPath, payload);
          return { exitCode: 0, stdout: `Wrote: ${outPath}\n` };
        }
        return { exitCode: 0, stdout: payload };
      }

      // text
      const signal = bundle.signal || {};
      const lines = [];
      lines.push("Drift Status");
      lines.push("------------");
      lines.push(`Window: ${bundle.window}`);
      lines.push(`Trend: ${bundle.trend}`);
      lines.push(`Density: ${signal.density ?? 0} events/day`);
      lines.push(`Expansion: +${signal.expansion_modules ?? 0} modules`);
      lines.push(`Unique Modules: ${signal.unique_modules ?? 0}`);
      lines.push(`Events (current): ${signal.events_current ?? 0}`);
      lines.push(`Events (prev): ${signal.events_prev ?? 0}`);
      lines.push("");
      return { exitCode: 0, stdout: lines.join("\n") + "\n" };
    }

    if (sub === "timeline") {
      const bundle = safeTry(() => buildTimeline({ repoRoot, window }), null);
      if (!bundle) {
        return { exitCode: EXIT_ERROR_DEFAULT, stderr: "Failed to build timeline.\n" };
      }
      return { exitCode: 0, stdout: JSON.stringify(bundle, null, 2) + "\n" };
    }

    if (sub === "compare") {
      const bundle = safeTry(() => buildCompare({ repoRoot, window }), null);
      if (!bundle) {
        return { exitCode: EXIT_ERROR_DEFAULT, stderr: "Failed to build compare.\n" };
      }
      return { exitCode: 0, stdout: JSON.stringify(bundle, null, 2) + "\n" };
    }

    return { exitCode: 0, stdout: renderGuardHelp() + "\n" };
  }

  // -------------------------
  // assoc correlate (signal-only analytics)
  // -------------------------
  if (cmd === "assoc") {
    const sub = argv[1] || "";
    if (sub !== "correlate") {
      return { exitCode: 2, stderr: "Usage: guard assoc correlate [options]\n" };
    }

    // Gate by license: assoc is Pro+ analytics
    const lic = readLicense();
    const gate = licenseGateResult({ lic, requiredEdition: "pro_plus", feature: "assoc_correlate" });
    if (gate) return gate;

    const args = argv.slice(2);
    const bundle = buildAssociationBundle({ repoRoot, argv: args });
    return { exitCode: 0, stdout: JSON.stringify(bundle, null, 2) + "\n" };
  }

  // default: unknown
  return { exitCode: 2, stderr: `Unknown command: ${cmd}\n\n` + renderGuardHelp() + "\n" };
}

/* -------------------------
 * Policy defaults
 * ------------------------- */

function defaultPolicyJson({ edition }) {
  const policyPath = defaultPolicyPath();
  // Load kernel defaults if available; fallback to minimal schema.
  // But we keep a deterministic default here.
  const base = safeTry(
    () => loadPolicy(policyPath),
    null
  );

  if (base && typeof base === "object") {
    // ensure defaults.edition is set
    const copy = JSON.parse(JSON.stringify(base));
    copy.defaults = copy.defaults || {};
    copy.defaults.edition = normalizeEdition(edition);
    return copy;
  }

  return {
    policy_version: "1.0",
    defaults: {
      edition: normalizeEdition(edition),
    },
    thresholds: {
      lines_added_soft: 900,
      files_changed_hard: 16,
    },
    rules: [],
    exit_codes: {
      allow: 0,
      soft_block: 10,
      hard_block: 20,
      error: EXIT_ERROR_DEFAULT,
    },
  };
}

/* -------------------------
 * Entry
 * ------------------------- */

async function main() {
  try {
    const argv = process.argv.slice(2);
    const res = await runGuard({ argv });
    if (res?.stdout) process.stdout.write(res.stdout);
    if (res?.stderr) process.stderr.write(res.stderr);
    process.exit(res?.exitCode ?? EXIT_ERROR_DEFAULT);
  } catch (err) {
    process.stderr.write(`Guard crashed.\nerror: ${err?.message || String(err)}\n`);
    process.exit(EXIT_ERROR_DEFAULT);
  }
}

main();