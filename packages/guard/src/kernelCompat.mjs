async function importFirst(specifiers) {
  let lastError = null;
  for (const specifier of specifiers) {
    try {
      return await import(specifier);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

const kernel = await importFirst([
  "@veeduzyl/mindforge-kernel",
  "./vendor/kernel/index.mjs",
  "../../kernel/src/index.mjs",
]);

const riskModule = await importFirst([
  "@veeduzyl/mindforge-kernel/src/risk_v1.mjs",
  "./vendor/kernel/risk_v1.mjs",
  "../../kernel/src/risk_v1.mjs",
]);

export const {
  loadPolicy,
  validatePolicyFile,
  defaultPolicyPath,
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
} = kernel;

export const { computeRiskV1 } = riskModule;
