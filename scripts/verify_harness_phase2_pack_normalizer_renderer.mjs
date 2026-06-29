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

const REQUIRED_NON_AUTHORITY_STATEMENT =
  "Guard provides deterministic review evidence only. It does not approve, block, deploy, certify, or control execution.";

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

function assertNoForbiddenClaims(filePath) {
  const rawText = readText(filePath);
  const lowered = rawText.toLowerCase();

  const sanitized = lowered
    .replaceAll("does not approve", "")
    .replaceAll("does not block", "")
    .replaceAll("does not deploy", "")
    .replaceAll("does not certify", "")
    .replaceAll("does not control execution", "")
    .replaceAll("not production integration", "")
    .replaceAll("not control plane", "")
    .replaceAll("not approval authority", "")
    .replaceAll("not deployment authority", "")
    .replaceAll("not certification authority", "");

  for (const pattern of FORBIDDEN_POSITIVE_PATTERNS) {
    expect(!pattern.test(sanitized), `${path.basename(filePath)} must not contain forbidden authority claim: ${pattern}`);
  }
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const normalizerPath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "normalize-evidence-pack.mjs"
  );
  const rendererPath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "render-review-report.mjs"
  );
  const docPath = path.join(repoRoot, "docs", "harness", "phase-2-pack-normalizer-renderer.md");
  const fixturePath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "fixtures",
    "mixed-evidence-pack.json"
  );
  const normalizedOutputPath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "artifacts",
    "normalized-evidence-pack-generated.json"
  );
  const reportOutputPath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "artifacts",
    "review-report-generated.md"
  );

  for (const filePath of [normalizerPath, rendererPath, docPath, fixturePath]) {
    expect(fs.existsSync(filePath), `required file missing: ${path.relative(repoRoot, filePath)}`);
  }

  execSync(`node "${normalizerPath}"`, { cwd: repoRoot, encoding: "utf8", stdio: "pipe", shell: true });
  execSync(`node "${rendererPath}"`, { cwd: repoRoot, encoding: "utf8", stdio: "pipe", shell: true });

  expect(fs.existsSync(normalizedOutputPath), "normalized-evidence-pack-generated.json must be generated");
  expect(fs.existsSync(reportOutputPath), "review-report-generated.md must be generated");

  const normalizedPack = readJson(normalizedOutputPath);
  for (const key of [
    "normalized_pack_version",
    "records",
    "record_counts",
    "assurance_summary",
    "missing_evidence",
    "assurance_limits",
    "reviewer_questions",
    "non_authority_statement",
  ]) {
    expect(key in normalizedPack, `normalized-evidence-pack-generated.json missing ${key}`);
  }

  expect(normalizedPack.normalized_pack_version === "0.1", "normalized_pack_version must equal 0.1");
  expect(Array.isArray(normalizedPack.records), "normalized records must be an array");
  expect(normalizedPack.records.length >= 6, "normalized records must include at least 6 records");
  expect(normalizedPack.record_counts.total === normalizedPack.records.length, "record_counts.total must match records length");

  const evidenceTypes = new Set(normalizedPack.records.map((record) => record.type));
  expect(evidenceTypes.size >= 6, "normalized pack must include at least 6 distinct evidence types");

  for (const record of normalizedPack.records) {
    for (const key of [
      "id",
      "type",
      "source",
      "summary",
      "cryptographic_validity",
      "execution_evidence",
      "policy_completeness",
      "legal_applicability",
      "human_review_status",
      "missing_evidence",
      "assurance_limits",
      "reviewer_questions",
    ]) {
      expect(key in record, `normalized record missing ${key}`);
    }
  }

  const reportText = readText(reportOutputPath);
  for (const heading of REQUIRED_REPORT_HEADINGS) {
    expect(reportText.includes(heading), `review-report-generated.md missing heading: ${heading}`);
  }
  expect(reportText.includes(REQUIRED_NON_AUTHORITY_STATEMENT), "review-report-generated.md missing non-authority statement");
  expect(
    reportText.includes("ramen-receipt-v5 remains one example only"),
    "review-report-generated.md must state that ramen-receipt-v5 remains one example only"
  );

  const docText = readText(docPath);
  expect(
    docText.includes("`ramen-receipt-v5 remains one example only`."),
    "phase-2-pack-normalizer-renderer.md must preserve the ramen example-only statement"
  );

  const packagesGuardChanges = getGitChangedFiles(repoRoot, "packages/guard");
  expect(packagesGuardChanges.length === 0, "packages/guard/** must remain unchanged");

  const readmeChanges = getGitChangedFiles(repoRoot, "README.md");
  expect(readmeChanges.length === 0, "README.md must remain unchanged");

  const changedFiles = getAllChangedFiles(repoRoot);
  const runtimeSemanticChanges = changedFiles.filter((filePath) => {
    const normalizedPath = filePath.replace(/\\/g, "/");
    if (normalizedPath.startsWith("packages/guard/")) {
      return /audit|permit|classify/i.test(normalizedPath);
    }
    return false;
  });
  expect(runtimeSemanticChanges.length === 0, "no audit/permit/classify runtime files may be modified");

  for (const filePath of [docPath, normalizedOutputPath, reportOutputPath]) {
    assertNoForbiddenClaims(filePath);
  }

  const summary = {
    normalized_pack: path.relative(repoRoot, normalizedOutputPath).replace(/\\/g, "/"),
    review_report: path.relative(repoRoot, reportOutputPath).replace(/\\/g, "/"),
    record_count: normalizedPack.records.length,
    evidence_type_count: evidenceTypes.size,
    compatible: true,
    runtime_or_authority_drift_detected: false,
  };

  console.log(JSON.stringify(summary, null, 2));
  console.log("PASS: harness phase2 pack normalizer + renderer verified.");
}

main();
