import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REQUIRED_REPORT_HEADINGS = [
  "# Harness Phase 2 Evidence Review Report",
  "## Evidence Pack Summary",
  "## Record Counts",
  "## Cryptographic Evidence",
  "## Execution Evidence",
  "## Policy Findings",
  "## External Signed Receipts",
  "## Missing Evidence",
  "## Assurance Limits",
  "## Human Reviewer Questions",
  "## Non-Authority Statement",
];

const REQUIRED_REPORT_STATEMENTS = [
  "Guard provides deterministic review evidence only. It does not approve, block, deploy, certify, or control execution.",
  "ramen-receipt-v5 remains one example only",
];

const REQUIRED_NORMALIZED_PACK_KEYS = [
  "normalized_pack_version",
  "evidence_pack_id",
  "generated_at",
  "source_pack_id",
  "records",
  "record_counts",
  "assurance_summary",
  "missing_evidence",
  "assurance_limits",
  "reviewer_questions",
  "non_authority_statement",
];

const REQUIRED_ASSURANCE_DIMENSIONS = [
  "cryptographic_validity",
  "execution_evidence",
  "policy_completeness",
  "legal_applicability",
  "human_review_status",
];

const REQUIRED_CONTRACT_SUMMARY_KEYS = [
  "contract_version",
  "canonical_evidence_types",
  "assurance_dimensions",
  "valid_fixture_results",
  "invalid_fixture_results",
  "compatible",
  "runtime_or_authority_drift_detected",
  "non_authority_statement",
];

const FORBIDDEN_POSITIVE_PATTERNS = [
  /\bguard approves\b/i,
  /\bguard blocks\b/i,
  /\bguard deploys\b/i,
  /\bguard certifies\b/i,
  /\bguard controls execution\b/i,
  /\bproduction ready\b/i,
  /\bproduction integration ready\b/i,
  /\bproduction integration is enabled\b/i,
  /\bruntime enforcement enabled\b/i,
  /\benables runtime enforcement\b/i,
  /\bcontrol-plane integration\b/i,
  /\bapproval authority\b/i,
  /\bdeployment authority\b/i,
  /\bcertification authority\b/i,
];

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function sanitizeNegativeContexts(text) {
  return text
    .replaceAll("does not approve", "")
    .replaceAll("does not block", "")
    .replaceAll("does not deploy", "")
    .replaceAll("does not certify", "")
    .replaceAll("does not control execution", "")
    .replaceAll("not production integration", "")
    .replaceAll("not control-plane", "")
    .replaceAll("not control plane", "")
    .replaceAll("not approval authority", "")
    .replaceAll("not blocking authority", "")
    .replaceAll("not deployment authority", "")
    .replaceAll("not certification authority", "");
}

function assertNoForbiddenClaims(text, label) {
  const sanitized = sanitizeNegativeContexts(text.toLowerCase());
  for (const pattern of FORBIDDEN_POSITIVE_PATTERNS) {
    expect(!pattern.test(sanitized), `${label} must not contain forbidden authority claim: ${pattern}`);
  }
}

function normalizeMarkdown(text) {
  return text.replace(/\r\n/g, "\n").trimEnd();
}

function sortValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => sortValue(entry));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort((left, right) => left.localeCompare(right))
        .map((key) => [key, sortValue(value[key])])
    );
  }
  return value;
}

function canonicalJson(value) {
  return `${JSON.stringify(sortValue(value), null, 2)}\n`;
}

function getGitChangedFiles(repoRoot, pathspec) {
  const quotedPathspec = pathspec.replace(/'/g, "''");
  const diffCommand = `git diff --name-only -- '${quotedPathspec}'`;
  const untrackedCommand = `git ls-files --others --exclude-standard -- '${quotedPathspec}'`;
  const diffOutput = execSync(diffCommand, { cwd: repoRoot, encoding: "utf8", shell: true }).trim();
  const untrackedOutput = execSync(untrackedCommand, { cwd: repoRoot, encoding: "utf8", shell: true }).trim();
  return [...diffOutput.split(/\r?\n/), ...untrackedOutput.split(/\r?\n/)].filter(Boolean);
}

function getAllChangedFiles(repoRoot) {
  const diffOutput = execSync("git diff --name-only", { cwd: repoRoot, encoding: "utf8", shell: true }).trim();
  const untrackedOutput = execSync("git ls-files --others --exclude-standard", {
    cwd: repoRoot,
    encoding: "utf8",
    shell: true,
  }).trim();
  return [...diffOutput.split(/\r?\n/), ...untrackedOutput.split(/\r?\n/)].filter(Boolean);
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const experimentsRoot = path.join(repoRoot, "experiments", "harness-phase-2-external-evidence");
  const artifactsRoot = path.join(experimentsRoot, "artifacts");
  const snapshotsRoot = path.join(experimentsRoot, "snapshots");

  const normalizerPath = path.join(experimentsRoot, "normalize-evidence-pack.mjs");
  const rendererPath = path.join(experimentsRoot, "render-review-report.mjs");
  const contractVerifierPath = path.join(repoRoot, "scripts", "verify_harness_phase2_evidence_type_contract_hardening.mjs");
  const docPath = path.join(repoRoot, "docs", "harness", "phase-2-review-report-snapshot-regression.md");
  const packageJsonPath = path.join(repoRoot, "package.json");

  const normalizedPackPath = path.join(artifactsRoot, "normalized-evidence-pack-generated.json");
  const reviewReportPath = path.join(artifactsRoot, "review-report-generated.md");
  const contractSummaryPath = path.join(artifactsRoot, "evidence-type-contract-validation-summary.json");

  const normalizedPackSnapshotPath = path.join(snapshotsRoot, "normalized-evidence-pack.snapshot.json");
  const reviewReportSnapshotPath = path.join(snapshotsRoot, "review-report.snapshot.md");
  const contractSummarySnapshotPath = path.join(snapshotsRoot, "evidence-type-contract-validation-summary.snapshot.json");

  for (const filePath of [
    normalizerPath,
    rendererPath,
    contractVerifierPath,
    docPath,
    packageJsonPath,
    normalizedPackSnapshotPath,
    reviewReportSnapshotPath,
    contractSummarySnapshotPath,
  ]) {
    expect(fs.existsSync(filePath), `required file missing: ${path.relative(repoRoot, filePath)}`);
  }

  execSync(`node "${normalizerPath}"`, { cwd: repoRoot, encoding: "utf8", stdio: "pipe", shell: true });
  execSync(`node "${rendererPath}"`, { cwd: repoRoot, encoding: "utf8", stdio: "pipe", shell: true });
  execSync(`node "${contractVerifierPath}"`, { cwd: repoRoot, encoding: "utf8", stdio: "pipe", shell: true });

  const normalizedPack = readJson(normalizedPackPath);
  const normalizedPackSnapshot = readJson(normalizedPackSnapshotPath);
  const reviewReport = readText(reviewReportPath);
  const reviewReportSnapshot = readText(reviewReportSnapshotPath);
  const contractSummary = readJson(contractSummaryPath);
  const contractSummarySnapshot = readJson(contractSummarySnapshotPath);

  for (const key of REQUIRED_NORMALIZED_PACK_KEYS) {
    expect(key in normalizedPack, `normalized pack missing ${key}`);
    expect(key in normalizedPackSnapshot, `normalized pack snapshot missing ${key}`);
  }
  for (const key of REQUIRED_ASSURANCE_DIMENSIONS) {
    expect(key in normalizedPack.assurance_summary, `normalized pack assurance_summary missing ${key}`);
    expect(key in normalizedPackSnapshot.assurance_summary, `normalized pack snapshot assurance_summary missing ${key}`);
  }

  for (const key of REQUIRED_CONTRACT_SUMMARY_KEYS) {
    expect(key in contractSummary, `contract summary missing ${key}`);
    expect(key in contractSummarySnapshot, `contract summary snapshot missing ${key}`);
  }

  const normalizedPackSnapshotMatched = canonicalJson(normalizedPack) === canonicalJson(normalizedPackSnapshot);
  expect(normalizedPackSnapshotMatched, "normalized evidence pack does not match its snapshot");

  const reviewReportSnapshotMatched = normalizeMarkdown(reviewReport) === normalizeMarkdown(reviewReportSnapshot);
  expect(reviewReportSnapshotMatched, "review report does not match its snapshot");

  const contractSummarySnapshotMatched = canonicalJson(contractSummary) === canonicalJson(contractSummarySnapshot);
  expect(contractSummarySnapshotMatched, "contract summary does not match its snapshot");

  for (const heading of REQUIRED_REPORT_HEADINGS) {
    expect(reviewReport.includes(heading), `review report missing heading: ${heading}`);
    expect(reviewReportSnapshot.includes(heading), `review report snapshot missing heading: ${heading}`);
  }
  for (const statement of REQUIRED_REPORT_STATEMENTS) {
    expect(reviewReport.includes(statement), `review report missing statement: ${statement}`);
    expect(reviewReportSnapshot.includes(statement), `review report snapshot missing statement: ${statement}`);
  }

  assertNoForbiddenClaims(reviewReport, "review report");
  assertNoForbiddenClaims(reviewReportSnapshot, "review report snapshot");
  assertNoForbiddenClaims(JSON.stringify(normalizedPack), "normalized pack");
  assertNoForbiddenClaims(JSON.stringify(normalizedPackSnapshot), "normalized pack snapshot");
  assertNoForbiddenClaims(JSON.stringify(contractSummary), "contract summary");
  assertNoForbiddenClaims(JSON.stringify(contractSummarySnapshot), "contract summary snapshot");
  assertNoForbiddenClaims(readText(docPath), "snapshot regression doc");

  const packageJson = readJson(packageJsonPath);
  expect(
    packageJson.scripts["verify:harness-phase2:snapshots"] ===
      "node scripts/verify_harness_phase2_review_report_snapshots.mjs",
    "package.json must expose verify:harness-phase2:snapshots as a standalone script"
  );
  expect(
    packageJson.scripts.verify === "npm run verify:core && npm run verify:v612",
    "npm run verify must remain the existing baseline verification path"
  );
  expect(
    !packageJson.scripts.verify.includes("harness-phase2:snapshots"),
    "npm run verify must not include the snapshot verifier"
  );
  expect(
    Object.keys(packageJson.scripts).filter((key) => key.includes("ramen")).length === 0,
    "main-bound package.json must not include ramen scripts"
  );

  const packagesGuardChanges = getGitChangedFiles(repoRoot, "packages/guard");
  expect(packagesGuardChanges.length === 0, "packages/guard/** must remain unchanged");

  const readmeChanges = getGitChangedFiles(repoRoot, "README.md");
  expect(readmeChanges.length === 0, "README.md must remain unchanged");

  const runtimeSemanticChanges = getAllChangedFiles(repoRoot).filter((filePath) => {
    const normalizedPath = filePath.replace(/\\/g, "/");
    return normalizedPath.startsWith("packages/guard/") && /audit|permit|classify/i.test(normalizedPath);
  });
  expect(runtimeSemanticChanges.length === 0, "audit/permit/classify runtime files must remain unchanged");

  const summary = {
    snapshots_checked: 3,
    normalized_pack_snapshot_matched: normalizedPackSnapshotMatched,
    review_report_snapshot_matched: reviewReportSnapshotMatched,
    contract_summary_snapshot_matched: contractSummarySnapshotMatched,
    required_sections_checked: REQUIRED_REPORT_HEADINGS.length,
    compatible: true,
    runtime_or_authority_drift_detected: false,
  };

  console.log(JSON.stringify(summary, null, 2));
  console.log("PASS: harness phase2 review report snapshots verified.");
}

main();
