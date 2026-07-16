import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { runAudit } from "../packages/guard/src/runAudit.mjs";
import { buildCanonicalActionArtifactFromAudit } from "../packages/guard/src/runtime/actions/fromAudit.mjs";
import {
  PERMIT_GATE_RESULT_KIND,
  PERMIT_GATE_RESULT_VERSION,
  PERMIT_GATE_RESULT_SCHEMA_ID,
  PERMIT_GATE_MODE,
  PERMIT_GATE_CONSUMER_SURFACE,
  PERMIT_GATE_DENIED_EXIT_CODE,
  GOVERNANCE_RECEIPT_KIND,
  validatePermitGateResult,
  validateGovernanceReceipt,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceRepoRoot = path.resolve(__dirname, "..");
const runGuardPath = path.join(sourceRepoRoot, "packages/guard/src/runGuard.mjs");
const launchCwd = process.cwd();
const INTERNAL_CALLER_REPO_PROBE_ARG = "--internal-caller-repo-probe";
const legacySkipEnvVarName = [
  "MINDFORGE",
  "GUARD",
  "SKIP",
  "EXTERNAL",
  "CALLER",
  "REPOS",
].join("_");
const verifierArgs = process.argv.slice(2);

if (
  verifierArgs.length > 1 ||
  (verifierArgs.length === 1 &&
    verifierArgs[0] !== INTERNAL_CALLER_REPO_PROBE_ARG)
) {
  throw new Error(`unsupported verifier arguments: ${verifierArgs.join(" ")}`);
}

const isInternalCallerRepoProbe =
  verifierArgs.includes(INTERNAL_CALLER_REPO_PROBE_ARG);
const shouldRunLegacyEnvRegression =
  !isInternalCallerRepoProbe && launchCwd === sourceRepoRoot;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeAudit(audit) {
  const copy = clone(audit);
  if (copy?.run) {
    copy.run.run_id = "<run_id>";
    copy.run.timestamp = "<timestamp>";
  }
  if (copy?.context?.drift) {
    copy.context.drift.generated_at = "<generated_at>";
  }
  return copy;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function captureAuditHistory(historyPath) {
  if (!fs.existsSync(historyPath)) {
    return { exists: false, content: null };
  }
  return {
    exists: true,
    content: fs.readFileSync(historyPath, "utf8"),
  };
}

function restoreAuditHistory(historyPath, snapshot) {
  if (snapshot.exists) {
    fs.mkdirSync(path.dirname(historyPath), { recursive: true });
    fs.writeFileSync(historyPath, snapshot.content, "utf8");
    return;
  }

  try {
    fs.unlinkSync(historyPath);
  } catch {}
}

function restoreHistoryBaselines(entries) {
  for (const entry of entries) {
    restoreAuditHistory(entry.path, entry.snapshot);
  }
}

async function runAuditWithHistoryBaseline({ argv, policy, historyEntries }) {
  restoreHistoryBaselines(historyEntries);
  return runAudit({ argv, policy });
}

function basePolicy() {
  return {
    policy_version: "1.0",
    defaults: {},
    thresholds: {},
    rules: [],
    exit_codes: {
      allow: 0,
      soft_block: 10,
      hard_block: 20,
      error: 1,
    },
  };
}

function denyPolicy() {
  const policy = basePolicy();
  policy.rules.push({
    id: "permit-gate-deny-unknown",
    enabled: true,
    severity: "hard_block",
    message: "deny unknown action classes at the permit gate",
    when: {
      any_of: [{ metric: "lines_added", op: ">", value: 999999 }],
    },
    preview_when: {
      action_classes: ["unknown"],
    },
  });
  return policy;
}

function gitOutput(repoPath, args) {
  return execFileSync("git", args, {
    cwd: repoPath,
    encoding: "utf8",
  });
}

function assertCleanGitStatus(repoPath, label) {
  const status = gitOutput(repoPath, ["status", "--short"]);
  if (status.trim().length > 0) {
    throw new Error(`${label} should be clean, got:\n${status}`);
  }
}

function initializeCleanGitRepository(repoPath) {
  fs.mkdirSync(repoPath, { recursive: true });
  execFileSync("git", ["init"], { cwd: repoPath, stdio: "ignore" });
  execFileSync("git", ["config", "user.email", "codex@example.com"], {
    cwd: repoPath,
    stdio: "ignore",
  });
  execFileSync("git", ["config", "user.name", "Codex"], {
    cwd: repoPath,
    stdio: "ignore",
  });

  fs.writeFileSync(
    path.join(repoPath, "baseline.txt"),
    "permit gate verifier baseline\n",
    "utf8"
  );

  execFileSync("git", ["add", "baseline.txt"], {
    cwd: repoPath,
    stdio: "ignore",
  });
  execFileSync(
    "git",
    ["commit", "-m", "initialize permit gate verifier fixture"],
    {
      cwd: repoPath,
      stdio: "ignore",
    }
  );
}

function createHistoryEntries(repoPath) {
  const auditHistoryPath = path.join(
    repoPath,
    ".mindforge",
    "artifacts",
    "guard",
    "audit.jsonl"
  );
  const driftEventsPath = path.join(
    repoPath,
    ".mindforge",
    "drift",
    "events.jsonl"
  );
  return [
    {
      path: auditHistoryPath,
      snapshot: captureAuditHistory(auditHistoryPath),
    },
    {
      path: driftEventsPath,
      snapshot: captureAuditHistory(driftEventsPath),
    },
  ];
}

async function withWorkingDirectory(directory, callback) {
  const previousDirectory = process.cwd();
  process.chdir(directory);

  try {
    return await callback();
  } finally {
    process.chdir(previousDirectory);
  }
}

function snapshotCallerRepository(repoPath) {
  return {
    status: gitOutput(repoPath, ["status", "--short"]),
    stagedNames: gitOutput(repoPath, ["diff", "--cached", "--name-only"]),
    cachedDiff: gitOutput(repoPath, ["diff", "--cached", "--binary"]),
    workingTreeDiff: gitOutput(repoPath, ["diff", "--binary"]),
    hasMindforge: fs.existsSync(path.join(repoPath, ".mindforge")),
  };
}

function assertCallerRepositoryUnchanged(label, before, after) {
  if (before.status !== after.status) {
    throw new Error(`${label} status changed unexpectedly`);
  }
  if (before.stagedNames !== after.stagedNames) {
    throw new Error(`${label} staged file list changed unexpectedly`);
  }
  if (before.cachedDiff !== after.cachedDiff) {
    throw new Error(`${label} cached diff changed unexpectedly`);
  }
  if (before.workingTreeDiff !== after.workingTreeDiff) {
    throw new Error(`${label} working tree diff changed unexpectedly`);
  }
  if (before.hasMindforge !== after.hasMindforge) {
    throw new Error(`${label} .mindforge existence changed unexpectedly`);
  }
  if (after.hasMindforge) {
    throw new Error(`${label} should not create caller .mindforge artifacts`);
  }
}

function runVerifierFromCallerRepository(repoPath, label) {
  const before = snapshotCallerRepository(repoPath);
  const verifierRun = spawnSync(
    process.execPath,
    [__filename, INTERNAL_CALLER_REPO_PROBE_ARG],
    {
      cwd: repoPath,
      encoding: "utf8",
      env: process.env,
    }
  );
  const after = snapshotCallerRepository(repoPath);

  if (verifierRun.status !== 0) {
    throw new Error(
      `${label} verifier run failed with exit ${verifierRun.status}\nstdout:\n${verifierRun.stdout}\nstderr:\n${verifierRun.stderr}`
    );
  }

  assertCallerRepositoryUnchanged(label, before, after);
}

function runVerifierTopLevelFromRepository(repoPath, label, envOverrides = {}) {
  const before = snapshotCallerRepository(repoPath);
  const verifierRun = spawnSync(process.execPath, [__filename], {
    cwd: repoPath,
    encoding: "utf8",
    env: {
      ...process.env,
      ...envOverrides,
    },
  });
  const after = snapshotCallerRepository(repoPath);

  if (verifierRun.status !== 0) {
    throw new Error(
      `${label} verifier run failed with exit ${verifierRun.status}\nstdout:\n${verifierRun.stdout}\nstderr:\n${verifierRun.stderr}`
    );
  }

  assertCallerRepositoryUnchanged(label, before, after);
}

function initializeCallerRepository(repoPath) {
  initializeCleanGitRepository(repoPath);
  if (fs.existsSync(path.join(repoPath, ".mindforge"))) {
    throw new Error("caller repository should not start with .mindforge artifacts");
  }
}

function stageFile(repoPath, relativePath, content) {
  const filePath = path.join(repoPath, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  execFileSync("git", ["add", relativePath], {
    cwd: repoPath,
    stdio: "ignore",
  });
}

const tempRoot = fs.mkdtempSync(
  path.join(os.tmpdir(), "mindforge-guard-permit-gate-")
);
const allowOut = path.join(tempRoot, "allow.json");
const denyOut = path.join(tempRoot, "deny.json");
const allowReceiptOut = path.join(tempRoot, "allow-receipt.json");
const denyReceiptOut = path.join(tempRoot, "deny-receipt.json");

try {
  const directAuditRepo = path.join(tempRoot, "direct-audit-repo");
  initializeCleanGitRepository(directAuditRepo);
  assertCleanGitStatus(directAuditRepo, "direct audit repository");
  const historyEntries = createHistoryEntries(directAuditRepo);

  let baseline;
  let allow;
  let deny;

  await withWorkingDirectory(directAuditRepo, async () => {
    baseline = await runAuditWithHistoryBaseline({
      argv: [".", "--staged"],
      policy: basePolicy(),
      historyEntries,
    });

    allow = await runAuditWithHistoryBaseline({
      argv: [
        ".",
        "--staged",
        "--permit-gate",
        `--permit-gate-out=${allowOut}`,
        `--governance-receipt-out=${allowReceiptOut}`,
      ],
      policy: basePolicy(),
      historyEntries,
    });

    deny = await runAuditWithHistoryBaseline({
      argv: [
        ".",
        "--staged",
        "--permit-gate",
        `--permit-gate-out=${denyOut}`,
        `--governance-receipt-out=${denyReceiptOut}`,
      ],
      policy: denyPolicy(),
      historyEntries,
    });
  });

  for (const result of [baseline, allow, deny]) {
    if (!result?.audit) {
      throw new Error(`permit gate audit failed: ${result?.message || "unknown"}`);
    }
  }

  const canonicalActionArtifact = buildCanonicalActionArtifactFromAudit(
    baseline.audit
  );
  if (canonicalActionArtifact?.action?.action_class !== "unknown") {
    throw new Error(
      `isolated clean direct audit should classify as unknown, got ${canonicalActionArtifact?.action?.action_class || "missing"}`
    );
  }

  const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
  if (normalizedBaseline !== JSON.stringify(normalizeAudit(allow.audit))) {
    throw new Error("permit gate allow path changed the audit main output");
  }
  if (normalizedBaseline !== JSON.stringify(normalizeAudit(deny.audit))) {
    throw new Error("permit gate deny path changed the audit main output");
  }

  if (allow.exitCode !== 0) {
    throw new Error(`permit gate allow path should pass, got exit ${allow.exitCode}`);
  }
  if (deny.exitCode !== PERMIT_GATE_DENIED_EXIT_CODE) {
    throw new Error(
      `permit gate deny path should exit ${PERMIT_GATE_DENIED_EXIT_CODE}, got ${deny.exitCode}`
    );
  }

  const allowArtifact = readJson(allowOut);
  const denyArtifact = readJson(denyOut);
  const allowReceipt = readJson(allowReceiptOut);
  const denyReceipt = readJson(denyReceiptOut);

  for (const artifact of [allowArtifact, denyArtifact]) {
    const validation = validatePermitGateResult(artifact);
    if (!validation.ok) {
      throw new Error(
        `permit gate validation failed: ${validation.errors.join("; ")}`
      );
    }
  }

  for (const receipt of [allowReceipt, denyReceipt]) {
    const validation = validateGovernanceReceipt(receipt);
    if (!validation.ok) {
      throw new Error(
        `governance receipt validation failed: ${validation.errors.join("; ")}`
      );
    }
    if (receipt.kind !== GOVERNANCE_RECEIPT_KIND) {
      throw new Error("permit gate receipt kind mismatch");
    }
    if (receipt.governance_receipt.audit_output_preserved !== true) {
      throw new Error(
        "permit gate receipt must preserve audit output semantics"
      );
    }
  }

  for (const artifact of [allowArtifact, denyArtifact]) {
    if (artifact.kind !== PERMIT_GATE_RESULT_KIND) {
      throw new Error("permit gate result kind mismatch");
    }
    if (artifact.version !== PERMIT_GATE_RESULT_VERSION) {
      throw new Error("permit gate result version mismatch");
    }
    if (artifact.schema_id !== PERMIT_GATE_RESULT_SCHEMA_ID) {
      throw new Error("permit gate result schema_id mismatch");
    }
    if (artifact.enforcing !== false) {
      throw new Error("permit gate result must remain non-enforcing");
    }
    if (artifact?.permit_gate?.mode !== PERMIT_GATE_MODE) {
      throw new Error("permit gate mode mismatch");
    }
    if (artifact?.permit_gate?.consumer_surface !== PERMIT_GATE_CONSUMER_SURFACE) {
      throw new Error("permit gate consumer surface mismatch");
    }
    if (artifact?.permit_gate?.audit_output_preserved !== true) {
      throw new Error("permit gate must preserve audit output semantics");
    }
  }

  if (allowArtifact.permit_gate.decision !== "allow") {
    throw new Error("permit gate allow path did not produce an allow decision");
  }
  if (allowArtifact.permit_gate.source_decision !== "insufficient_signal") {
    throw new Error(
      "permit gate allow path should be sourced from insufficient_signal"
    );
  }
  if (allowArtifact.permit_gate.exit_code !== 0) {
    throw new Error("permit gate allow path should keep exit code 0");
  }
  if (denyArtifact.permit_gate.decision !== "deny") {
    throw new Error("permit gate deny path did not produce a deny decision");
  }
  if (denyArtifact.permit_gate.source_decision !== "would_deny") {
    throw new Error(
      "permit gate deny path should be sourced from would_deny"
    );
  }
  if (denyArtifact.permit_gate.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
    throw new Error("permit gate deny path exit code mismatch");
  }

  const denyRepo = path.join(tempRoot, "deny-repo");
  fs.mkdirSync(path.join(denyRepo, ".mindforge", "config"), {
    recursive: true,
  });
  fs.writeFileSync(
    path.join(denyRepo, ".mindforge", "config", "policy.json"),
    JSON.stringify(denyPolicy(), null, 2)
  );
  execFileSync("git", ["init"], { cwd: denyRepo, stdio: "ignore" });
  execFileSync("git", ["config", "user.email", "codex@example.com"], {
    cwd: denyRepo,
    stdio: "ignore",
  });
  execFileSync("git", ["config", "user.name", "Codex"], {
    cwd: denyRepo,
    stdio: "ignore",
  });
  execFileSync("git", ["add", "."], { cwd: denyRepo, stdio: "ignore" });
  execFileSync("git", ["commit", "-m", "init"], {
    cwd: denyRepo,
    stdio: "ignore",
  });
  assertCleanGitStatus(denyRepo, "CLI deny repository");

  const denyRunGuard = spawnSync(
    process.execPath,
    [
      runGuardPath,
      "audit",
      ".",
      "--staged",
      "--permit-gate",
      `--governance-receipt-out=${path.join(denyRepo, "deny-receipt.json")}`,
    ],
    {
      cwd: denyRepo,
      encoding: "utf8",
    }
  );

  if (denyRunGuard.status !== PERMIT_GATE_DENIED_EXIT_CODE) {
    throw new Error(
      `runGuard deny path exit code mismatch\nstdout:\n${denyRunGuard.stdout}\nstderr:\n${denyRunGuard.stderr}`
    );
  }

  const denyStdout = JSON.parse(denyRunGuard.stdout);
  if (denyStdout.kind !== PERMIT_GATE_RESULT_KIND) {
    throw new Error("runGuard deny path should emit permit_gate_result");
  }
  if (denyStdout?.permit_gate?.decision !== "deny") {
    throw new Error("runGuard deny path should emit deny decision");
  }
  if (denyStdout?.permit_gate?.audit_output_preserved !== true) {
    throw new Error(
      "runGuard deny path should keep audit output boundary preserved"
    );
  }

  const denyRunGuardReceipt = readJson(path.join(denyRepo, "deny-receipt.json"));
  if (denyRunGuardReceipt.kind !== GOVERNANCE_RECEIPT_KIND) {
    throw new Error("runGuard deny path should write governance receipt");
  }
  if (denyRunGuardReceipt.governance_receipt.outcome !== "deny") {
    throw new Error("runGuard deny path receipt should emit deny outcome");
  }
  if (
    denyRunGuardReceipt.governance_receipt.exit_code !==
    PERMIT_GATE_DENIED_EXIT_CODE
  ) {
    throw new Error("runGuard deny path receipt exit code mismatch");
  }

  if (!isInternalCallerRepoProbe) {
    const callerRepoA = path.join(tempRoot, "caller-repo-a");
    initializeCallerRepository(callerRepoA);
    stageFile(callerRepoA, "notes.txt", "caller repo a staged note\n");
    runVerifierFromCallerRepository(callerRepoA, "caller repo A");

    const callerRepoB = path.join(tempRoot, "caller-repo-b");
    initializeCallerRepository(callerRepoB);
    stageFile(
      callerRepoB,
      "package.json",
      '{\n  "name": "caller-repo-b"\n}\n'
    );
    stageFile(
      callerRepoB,
      path.join(
        "packages",
        "guard-core",
        "src",
        "externalEvidence",
        "caller-probe.mjs"
      ),
      "export const callerProbe = true;\n"
    );
    runVerifierFromCallerRepository(callerRepoB, "caller repo B");

    if (shouldRunLegacyEnvRegression) {
      const legacyEnvRepo = path.join(tempRoot, "legacy-env-caller-repo");
      initializeCallerRepository(legacyEnvRepo);
      stageFile(legacyEnvRepo, "legacy-env.txt", "legacy env probe\n");
      runVerifierTopLevelFromRepository(
        legacyEnvRepo,
        "legacy env caller repo",
        {
          [legacySkipEnvVarName]: "1",
        }
      );
    }
  }

  if (process.cwd() !== launchCwd) {
    throw new Error("verifier must restore process.cwd() before completion");
  }

  process.stdout.write("audit permit gate verified\n");
} finally {
  if (process.cwd() !== launchCwd) {
    try {
      process.chdir(launchCwd);
    } catch {}
  }
  try {
    fs.rmSync(tempRoot, {
      recursive: true,
      force: true,
      maxRetries: 20,
      retryDelay: 100,
    });
  } catch {}
}
