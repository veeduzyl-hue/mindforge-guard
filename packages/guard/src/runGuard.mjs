#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import {
  loadPolicy,
  validatePolicyFile,
  defaultPolicyPath,
} from "./kernelCompat.mjs";
import { buildDriftStatus } from "./runtime/drift/status.mjs";
import { buildTimeline } from "./runtime/drift/timeline.mjs";
import { buildCompare } from "./runtime/drift/compare.mjs";
import { buildAssociationBundle } from "./runtime/association/index.mjs";
import {
  readLicense,
  removeLicense,
  licenseTier,
  getLicensePath,
} from "./product/license.mjs";
import { normalizeEdition } from "./product/edition.mjs";

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
const EXIT_LICENSE_REQUIRED = 21;
const EXIT_ERROR_DEFAULT = 30;

function tierNumFromEdition(edition) {
  const normalized = normalizeEdition(edition);
  if (normalized === "enterprise") return 3;
  if (normalized === "pro_plus") return 2;
  if (normalized === "pro") return 1;
  return 0;
}

function tierLabel(tier) {
  if (tier >= 3) return "enterprise";
  if (tier === 2) return "pro_plus";
  if (tier === 1) return "pro";
  return "community";
}

function licenseGateResult({ lic, requiredEdition, feature }) {
  const currentEdition = normalizeEdition(lic && lic.kind === "ok" ? lic.edition : "community");
  if (tierNumFromEdition(currentEdition) >= tierNumFromEdition(requiredEdition)) return null;

  return {
    exitCode: EXIT_LICENSE_REQUIRED,
    stdout:
      JSON.stringify(
        {
          ok: false,
          error: {
            kind: "license_required",
            feature: feature || "",
            required_edition: normalizeEdition(requiredEdition),
            current_edition: currentEdition,
            hint: "Install a signed license file: guard license install <file>",
          },
        },
        null,
        2
      ) + "\n",
  };
}

function showLicenseSummaryLocal() {
  const lic = readLicense();
  if (!lic || lic.kind === "missing") return "license: missing";
  if (lic.kind === "invalid") return `license: invalid (${lic.reason || "unknown"})`;
  if (lic.kind === "expired") return `license: expired (${lic.edition || "unknown"}) expires: ${lic.not_after || ""}`;
  if (lic.kind === "not_yet_valid") return `license: not_yet_valid (${lic.edition || "unknown"}) starts: ${lic.not_before || ""}`;
  if (lic.kind === "ok") return `license: ok (${lic.edition}) expires: ${lic.not_after || ""}`;
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
    "  guard audit . --staged",
    "  guard snapshot .",
    "",
    "Drift (signal-only; no policy required):",
    "  guard drift status   [--window 7d|14d|30d] [--format text|json] [--pretty] [--out <file>]",
    "  guard drift timeline [--window 7d|14d|30d]   (license: pro)",
    "  guard drift compare  [--window 7d|14d|30d]   (license: pro_plus)",
    "",
    "Analytics (signal-only; no policy required):",
    "  guard assoc correlate [--window 7d|14d|30d] [--bucket day] (license: pro_plus)",
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

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileAtomic(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function getRepoPolicyPath(repoRoot) {
  return path.join(repoRoot, ".mindforge", "config", "policy.json");
}

function getDriftEventsPath(repoRoot) {
  return path.join(repoRoot, ".mindforge", "drift", "events.jsonl");
}

function policyMissingMessage(policyPath) {
  return (
    "Guard is not initialized for this repo.\n" +
    `Missing policy file: ${policyPath}\n\n` +
    "Run:\n" +
    "  guard init\n"
  );
}

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

function readJsonBestEffort(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
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
      slope: 0,
      expansion: 0,
      unique_modules: 0,
    },
    explain: {
      events: 0,
      events_prev: 0,
    },
    modules: [],
    dominance: {
      metric: "drift_units",
      top_n: 5,
      total_contribution: 0,
      top_modules: [],
      dominance_ratio: 0,
      top3_share: 0,
      cross_boundary: {
        is_cross_boundary: false,
        boundaries: [],
        note: "signal-only",
      },
    },
    policy: {
      affects_exit: false,
      affects_risk_v1: false,
    },
  };
}

function effectiveTier({ policyEdition, licenseTierNum }) {
  const policyTier = tierNumFromEdition(policyEdition);
  const overall = Math.min(policyTier, licenseTierNum);
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
    return {
      state: lic.edition,
      note: lic.not_after ? `not_after: ${lic.not_after}` : "not_after: none",
    };
  }
  if (lic.kind === "expired") {
    return {
      state: "community (expired license)",
      note: lic.reason ? `reason: ${lic.reason}` : `path: ${lic.path}`,
    };
  }
  if (lic.kind === "not_yet_valid") {
    return {
      state: "community (not yet valid)",
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

function parseInitArgs(args) {
  const out = { help: false, force: false, dryRun: false, edition: null };
  for (const arg of args) {
    if (arg === "--help" || arg === "-h") out.help = true;
    else if (arg === "--force") out.force = true;
    else if (arg === "--dry-run") out.dryRun = true;
    else if (arg.startsWith("--edition=")) out.edition = arg.split("=", 2)[1];
  }
  const editionIndex = args.findIndex((value) => value === "--edition");
  if (editionIndex >= 0 && args[editionIndex + 1]) out.edition = args[editionIndex + 1];
  return out;
}

function renderInitHelp() {
  return [
    "Usage:",
    "  guard init [--force] [--edition community|pro|pro_plus|enterprise] [--dry-run]",
    "",
    "Creates .mindforge/config/policy.json in the current repo.",
    "",
    "Examples:",
    "  guard init",
    "  guard init --force",
    "  guard init --force --edition pro_plus",
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

function missingDataError({ feature, filePath }) {
  return {
    exitCode: EXIT_ERROR_DEFAULT,
    stdout: buildErrorJson({
      kind: "missing_required_input",
      message: `${feature} requires drift event data.`,
      details: {
        feature,
        path: filePath,
      },
    }),
  };
}

async function runAuditCommand({ repoRoot, argv }) {
  const { runAudit } = await import("./runAudit.mjs");
  const policyPath = getRepoPolicyPath(repoRoot);
  const policy = await loadPolicy({ policyPath, repoRoot });
  const result = await runAudit({ repoRoot, argv, policy });
  if (result?.audit) {
    return { exitCode: result.exitCode, stdout: JSON.stringify(result.audit, null, 2) + "\n" };
  }
  return {
    exitCode: result?.exitCode ?? EXIT_ERROR_DEFAULT,
    stdout: buildErrorJson({
      kind: "audit_failed",
      message: result?.message || "Audit failed.",
    }),
  };
}

async function runSnapshotCommand({ repoRoot, argv }) {
  const { runSnapshot } = await import("./runtime/snapshot.mjs");
  return runSnapshot({ repoRoot, argv });
}

export async function runGuard({ argv }) {
  if (!argv || argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    return { exitCode: 0, stdout: renderGuardHelp() + "\n" };
  }
  if (argv.includes("--version") || argv.includes("-v")) {
    return { exitCode: 0, stdout: `guard ${GUARD_VERSION}\n` };
  }

  const cmd = argv[0];
  const repoRoot = process.cwd();

  if (cmd === "status") {
    const policyPath = getRepoPolicyPath(repoRoot);
    let policyState;
    if (!fs.existsSync(policyPath)) {
      policyState = { kind: "missing", path: policyPath };
    } else {
      const parsed = readJsonBestEffort(policyPath);
      if (parsed && typeof parsed === "object") {
        const edition =
          (isLegacyPolicyV1(parsed) && parsed.edition) ||
          parsed.defaults?.edition ||
          parsed.edition ||
          "community";
        policyState = { kind: "ok", edition: normalizeEdition(edition), path: policyPath };
      } else {
        policyState = { kind: "error", reason: "policy.json is not valid JSON", path: policyPath };
      }
    }

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

    const licenseState = licenseStateFromFile();
    const eff = effectiveTier({
      policyEdition: policyState.kind === "ok" ? policyState.edition : "community",
      licenseTierNum: licenseTier(readLicense()),
    });

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

  if (cmd === "license") {
    const sub = argv[1] || "";
    if (sub === "status") return { exitCode: 0, stdout: showLicenseSummaryLocal() + "\n" };
    if (sub === "show") return { exitCode: 0, stdout: JSON.stringify(readLicense(), null, 2) + "\n" };
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
        if (lic.kind !== "ok") {
          return {
            exitCode: EXIT_ERROR_DEFAULT,
            stdout: buildErrorJson({
              kind: "license_install_invalid",
              message: "License install failed validation.",
              details: {
                state: lic.kind,
                path: dest,
                reason: lic.reason,
              },
            }),
          };
        }
        return {
          exitCode: 0,
          stdout:
            JSON.stringify(
              {
                ok: true,
                license: {
                  edition: lic.edition,
                  not_before: lic.not_before,
                  not_after: lic.not_after,
                  key_id: lic.key_id,
                  license_id: lic.license_id,
                  path: dest,
                },
              },
              null,
              2
            ) + "\n",
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
        exitCode: res.ok === false ? EXIT_ERROR_DEFAULT : 0,
        stdout:
          JSON.stringify(
            {
              ok: res.ok !== false,
              removed: !!res.removed,
              path: res.path,
              error: res.error || null,
            },
            null,
            2
          ) + "\n",
      };
    }
    return { exitCode: 0, stdout: renderLicenseHelp() + "\n" };
  }

  if (cmd === "init") {
    const args = parseInitArgs(argv.slice(1));
    if (args.help) return { exitCode: 0, stdout: renderInitHelp() + "\n" };

    const policyPath = getRepoPolicyPath(repoRoot);
    if (fs.existsSync(policyPath) && !args.force) {
      const lt = licenseTier(readLicense());
      const tip =
        lt > 0
          ? `Tip: you have a ${tierLabel(lt)} license. you can run:\n  guard init --force --edition ${tierLabel(lt)}\n`
          : "Tip: re-run with --force to overwrite.\n";
      return { exitCode: 0, stdout: `Guard already initialized: ${policyPath}\n${tip}` };
    }

    const edition = normalizeEdition(args.edition || "community");
    const policy = defaultPolicyJson({ edition });
    const content = JSON.stringify(policy, null, 2) + "\n";

    if (args.dryRun) {
      return { exitCode: 0, stdout: `Dry-run: would write policy to ${policyPath}\n\n${content}` };
    }

    writeFileAtomic(policyPath, content);
    ensureDir(path.join(repoRoot, ".mindforge", "drift"));
    ensureDir(path.join(repoRoot, ".mindforge", "audit"));

    const validation = validatePolicyFile(policyPath);
    if (!validation.ok) {
      let err = `[mindforge] policy invalid after init: ${policyPath}\n`;
      for (const item of validation.errors) err += `- ${item}\n`;
      return { exitCode: 20, stderr: err };
    }
    return { exitCode: 0, stdout: `Initialized Guard: ${policyPath}\n` };
  }

  if (cmd === "validate-policy") {
    const args = argv.slice(1);
    const pathArg = args.find((value) => value.startsWith("--path="));
    const policyPath = pathArg ? pathArg.split("=", 2)[1] : getRepoPolicyPath(repoRoot);
    if (!fs.existsSync(policyPath)) return { exitCode: 2, stderr: policyMissingMessage(policyPath) };

    const parsed = readJsonBestEffort(policyPath);
    if (parsed && isLegacyPolicyV1(parsed)) {
      const migrated = migrateLegacyPolicyV1ToPolicySchema(parsed);
      const tmpPath = policyPath + ".tmp.migrated.json";
      try {
        fs.writeFileSync(tmpPath, JSON.stringify(migrated, null, 2) + "\n", "utf8");
        const validation = validatePolicyFile(tmpPath);
        fs.unlinkSync(tmpPath);
        if (!validation.ok) {
          let err = `[mindforge] policy invalid: ${policyPath}\n`;
          err += "note: legacy v=1 migrated for validation\n";
          for (const item of validation.errors) err += `- ${item}\n`;
          return { exitCode: 20, stderr: err };
        }
        return { exitCode: 0, stdout: `[mindforge] policy valid: ${policyPath}\n` };
      } catch (err) {
        try {
          if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
        } catch {}
        return {
          exitCode: EXIT_ERROR_DEFAULT,
          stderr: `[mindforge] validate-policy failed: ${policyPath}\nerror: ${err?.message || String(err)}\n`,
        };
      }
    }

    const validation = validatePolicyFile(policyPath);
    if (!validation.ok) {
      let err = `[mindforge] policy invalid: ${policyPath}\n`;
      for (const item of validation.errors) err += `- ${item}\n`;
      return { exitCode: 20, stderr: err };
    }
    return { exitCode: 0, stdout: `[mindforge] policy valid: ${policyPath}\n` };
  }

  if (cmd === "audit" || cmd === "snapshot") {
    const policyPath = getRepoPolicyPath(repoRoot);
    if (!fs.existsSync(policyPath)) return { exitCode: 2, stderr: policyMissingMessage(policyPath) };

    const parsed = readJsonBestEffort(policyPath);
    if (parsed && isLegacyPolicyV1(parsed)) {
      const migrated = migrateLegacyPolicyV1ToPolicySchema(parsed);
      writeFileAtomic(policyPath, JSON.stringify(migrated, null, 2) + "\n");
    }

    if (cmd === "audit") return runAuditCommand({ repoRoot, argv: argv.slice(1) });
    return runSnapshotCommand({ repoRoot, argv: argv.slice(1) });
  }

  if (cmd === "drift") {
    const sub = argv[1] || "status";
    const args = argv.slice(2);

    let window = "7d";
    const windowArg = args.find((value) => value.startsWith("--window"));
    if (windowArg) {
      const parts = windowArg.includes("=") ? windowArg.split("=", 2) : null;
      if (parts?.[1]) window = parts[1];
      const index = args.findIndex((value) => value === "--window");
      if (index >= 0 && args[index + 1]) window = args[index + 1];
    }

    if (sub === "status") {
      const jsonFormat =
        args.includes("--format=json") ||
        (args.includes("--format") && args[args.indexOf("--format") + 1] === "json");
      const pretty = args.includes("--pretty");
      const outIndex = args.findIndex((value) => value === "--out");
      const outPath = outIndex >= 0 ? args[outIndex + 1] : null;
      const bundle = safeTry(
        () => buildDriftStatus({ repoRoot, window }),
        stableDriftBundle({ window })
      );

      if (jsonFormat) {
        const payload = pretty ? JSON.stringify(bundle, null, 2) + "\n" : JSON.stringify(bundle) + "\n";
        if (outPath) {
          writeFileAtomic(outPath, payload);
          return { exitCode: 0, stdout: `Wrote: ${outPath}\n` };
        }
        return { exitCode: 0, stdout: payload };
      }

      const lines = [];
      lines.push("Drift Status");
      lines.push("------------");
      lines.push(`Window: ${bundle.window}`);
      lines.push(`Trend: ${bundle.trend}`);
      lines.push(`Density: ${bundle.signal?.density ?? 0} events/day`);
      lines.push(`Expansion: +${bundle.signal?.expansion ?? 0} modules`);
      lines.push(`Unique Modules: ${bundle.signal?.unique_modules ?? 0}`);
      lines.push(`Events (current): ${bundle.explain?.events ?? 0}`);
      lines.push(`Events (prev): ${bundle.explain?.events_prev ?? 0}`);
      lines.push("");
      return { exitCode: 0, stdout: lines.join("\n") + "\n" };
    }

    if (sub === "timeline" || sub === "compare") {
      const lic = readLicense();
      const gate = licenseGateResult({
        lic,
        requiredEdition: sub === "timeline" ? "pro" : "pro_plus",
        feature: sub === "timeline" ? "drift_timeline" : "drift_compare",
      });
      if (gate) return gate;

      const eventsPath = getDriftEventsPath(repoRoot);
      if (!fs.existsSync(eventsPath)) {
        return missingDataError({
          feature: sub === "timeline" ? "drift_timeline" : "drift_compare",
          filePath: eventsPath,
        });
      }

      const builder = sub === "timeline" ? buildTimeline : buildCompare;
      const bundle = safeTry(() => builder({ eventsPath, window }), null);
      if (!bundle) {
        return {
          exitCode: EXIT_ERROR_DEFAULT,
          stdout: buildErrorJson({
            kind: sub === "timeline" ? "timeline_build_failed" : "compare_build_failed",
            message: `Failed to build drift ${sub}.`,
          }),
        };
      }
      return { exitCode: 0, stdout: JSON.stringify(bundle, null, 2) + "\n" };
    }

    return { exitCode: 0, stdout: renderGuardHelp() + "\n" };
  }

  if (cmd === "assoc") {
    const sub = argv[1] || "";
    if (sub !== "correlate") return { exitCode: 2, stderr: "Usage: guard assoc correlate [options]\n" };

    const gate = licenseGateResult({
      lic: readLicense(),
      requiredEdition: "pro_plus",
      feature: "assoc_correlate",
    });
    if (gate) return gate;

    const args = argv.slice(2);
    const bundle = buildAssociationBundle({ repoRoot, argv: args });
    return { exitCode: 0, stdout: JSON.stringify(bundle, null, 2) + "\n" };
  }

  return { exitCode: 2, stderr: `Unknown command: ${cmd}\n\n${renderGuardHelp()}\n` };
}

function defaultPolicyJson({ edition }) {
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

async function main() {
  try {
    const res = await runGuard({ argv: process.argv.slice(2) });
    if (res?.stdout) process.stdout.write(res.stdout);
    if (res?.stderr) process.stderr.write(res.stderr);
    process.exit(res?.exitCode ?? EXIT_ERROR_DEFAULT);
  } catch (err) {
    process.stderr.write(`Guard crashed.\nerror: ${err?.message || String(err)}\n`);
    process.exit(EXIT_ERROR_DEFAULT);
  }
}

main();
