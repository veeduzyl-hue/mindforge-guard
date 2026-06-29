import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const NON_AUTHORITY_RECORD =
  "This evidence record is for review only. It does not approve, block, deploy, certify, or control execution.";
const NON_AUTHORITY_PACK =
  "This evidence pack is for deterministic review only. It does not approve, block, deploy, certify, or control execution.";

const EVIDENCE_TYPES = new Set([
  "agent_workflow_artifact",
  "tool_call_trace",
  "blocked_action",
  "command_result",
  "policy_finding",
  "external_signed_receipt",
]);

const ASSURANCE_ENUMS = {
  cryptographic_validity: new Set(["verified", "failed", "not_applicable", "not_provided"]),
  input_binding: new Set(["verified", "failed", "not_applicable", "not_provided"]),
  execution_evidence: new Set(["provided", "missing", "not_applicable", "not_provided"]),
  policy_completeness: new Set(["complete", "partial", "missing", "not_verified"]),
  legal_applicability: new Set(["verified", "not_verified", "not_applicable"]),
  human_review_status: new Set(["pending", "reviewed", "not_required"]),
};

const POSITIVE_DRIFT_PHRASES = [
  "grants execution authority",
  "automatically deploys",
  "certifies production readiness",
  "runtime enforcement enabled",
  "production integration ready",
  "is a control plane",
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

function expectArray(value, label) {
  expect(Array.isArray(value), `${label} must be an array`);
}

function expectObject(value, label) {
  expect(value && typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
}

function validateAssurance(assurance, label) {
  expectObject(assurance, `${label} assurance`);
  for (const [key, allowedValues] of Object.entries(ASSURANCE_ENUMS)) {
    expect(key in assurance, `${label} assurance missing ${key}`);
    expect(allowedValues.has(assurance[key]), `${label} assurance.${key} has invalid value ${assurance[key]}`);
  }
}

function validateRecord(record, label) {
  expectObject(record, `${label} record`);
  for (const key of [
    "record_version",
    "record_id",
    "evidence_type",
    "source",
    "source_schema",
    "source_id",
    "timestamp",
    "subject",
    "assurance",
    "claims",
    "limits",
    "raw_reference",
    "non_authority_statement",
  ]) {
    expect(key in record, `${label} missing ${key}`);
  }

  expect(record.record_version === "0.1", `${label} record_version must be 0.1`);
  expect(EVIDENCE_TYPES.has(record.evidence_type), `${label} evidence_type invalid: ${record.evidence_type}`);
  expectObject(record.subject, `${label} subject`);
  validateAssurance(record.assurance, label);
  expectArray(record.claims, `${label} claims`);
  expectArray(record.limits, `${label} limits`);
  expectObject(record.raw_reference, `${label} raw_reference`);
  expect(
    record.non_authority_statement === NON_AUTHORITY_RECORD,
    `${label} non_authority_statement must match the required boundary text`
  );
}

function validatePositiveDriftAbsence(files) {
  for (const filePath of files) {
    const text = readText(filePath).toLowerCase();
    for (const phrase of POSITIVE_DRIFT_PHRASES) {
      expect(!text.includes(phrase), `${path.basename(filePath)} must not include positive drift phrase: ${phrase}`);
    }
  }
}

function getGitChangedFiles(repoRoot, pathspec) {
  const quotedPathspec = pathspec.replace(/'/g, "''");
  const diffCommand = `git diff --name-only -- '${quotedPathspec}'`;
  const untrackedCommand = `git ls-files --others --exclude-standard -- '${quotedPathspec}'`;
  const diffOutput = execSync(diffCommand, { cwd: repoRoot, encoding: "utf8", shell: true }).trim();
  const untrackedOutput = execSync(untrackedCommand, { cwd: repoRoot, encoding: "utf8", shell: true }).trim();
  return [...diffOutput.split(/\r?\n/), ...untrackedOutput.split(/\r?\n/)].filter(Boolean);
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const requiredFiles = [
    path.join(repoRoot, "docs", "harness", "phase-2-external-evidence-record-schema.md"),
    path.join(repoRoot, "docs", "harness", "phase-2-external-evidence-verification-contract.md"),
    path.join(repoRoot, "experiments", "harness-phase-2-external-evidence", "README.md"),
    path.join(repoRoot, "experiments", "harness-phase-2-external-evidence", "fixtures", "agent-workflow-artifact.json"),
    path.join(repoRoot, "experiments", "harness-phase-2-external-evidence", "fixtures", "tool-call-trace.json"),
    path.join(repoRoot, "experiments", "harness-phase-2-external-evidence", "fixtures", "blocked-action.json"),
    path.join(repoRoot, "experiments", "harness-phase-2-external-evidence", "fixtures", "command-result.json"),
    path.join(repoRoot, "experiments", "harness-phase-2-external-evidence", "fixtures", "policy-finding.json"),
    path.join(repoRoot, "experiments", "harness-phase-2-external-evidence", "fixtures", "external-signed-receipt-ramen-example.json"),
    path.join(repoRoot, "experiments", "harness-phase-2-external-evidence", "fixtures", "mixed-evidence-pack.json"),
    path.join(repoRoot, "experiments", "harness-phase-2-external-evidence", "artifacts", "normalized-evidence-pack-sample.json"),
    path.join(repoRoot, "experiments", "harness-phase-2-external-evidence", "artifacts", "sample-review-report-section.md"),
    path.join(repoRoot, "scripts", "verify_harness_phase2_external_evidence_schema.mjs"),
  ];

  for (const filePath of requiredFiles) {
    expect(fs.existsSync(filePath), `required file missing: ${path.relative(repoRoot, filePath)}`);
  }

  const fixturePaths = requiredFiles.filter((filePath) => filePath.includes(`${path.sep}fixtures${path.sep}`) && filePath.endsWith(".json"));
  const fixtures = fixturePaths
    .filter((filePath) => !filePath.endsWith("mixed-evidence-pack.json"))
    .map((filePath) => ({ filePath, data: readJson(filePath) }));

  for (const { filePath, data } of fixtures) {
    validateRecord(data, path.relative(repoRoot, filePath));
  }

  const mixedPackPath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "fixtures",
    "mixed-evidence-pack.json"
  );
  const mixedPack = readJson(mixedPackPath);
  expect(mixedPack.pack_version === "0.1", "mixed-evidence-pack.json pack_version must be 0.1");
  expectArray(mixedPack.records, "mixed-evidence-pack.json records");
  expect(mixedPack.records.length >= 6, "mixed-evidence-pack.json must include at least 6 records");
  expect(
    mixedPack.non_authority_statement === NON_AUTHORITY_PACK,
    "mixed-evidence-pack.json non_authority_statement must match the required boundary text"
  );

  const mixedTypes = new Set();
  for (const [index, record] of mixedPack.records.entries()) {
    validateRecord(record, `mixed-evidence-pack.json records[${index}]`);
    mixedTypes.add(record.evidence_type);
  }
  expect(mixedTypes.size >= 6, "mixed-evidence-pack.json must include at least 6 distinct evidence types");

  const normalizedPackPath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "artifacts",
    "normalized-evidence-pack-sample.json"
  );
  const normalizedPack = readJson(normalizedPackPath);
  for (const key of [
    "evidence_pack_id",
    "generated_at",
    "records",
    "missing_evidence",
    "assurance_limits",
    "reviewer_questions",
    "non_authority_statement",
  ]) {
    expect(key in normalizedPack, `normalized-evidence-pack-sample.json missing ${key}`);
  }
  expectArray(normalizedPack.records, "normalized-evidence-pack-sample.json records");
  expectArray(normalizedPack.missing_evidence, "normalized-evidence-pack-sample.json missing_evidence");
  expectArray(normalizedPack.assurance_limits, "normalized-evidence-pack-sample.json assurance_limits");
  expectArray(normalizedPack.reviewer_questions, "normalized-evidence-pack-sample.json reviewer_questions");
  expect(
    normalizedPack.non_authority_statement === NON_AUTHORITY_PACK,
    "normalized-evidence-pack-sample.json non_authority_statement must match the required boundary text"
  );

  const reportPath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "artifacts",
    "sample-review-report-section.md"
  );
  const reportText = readText(reportPath);
  for (const heading of [
    "## 1. Evidence Summary",
    "## 2. Cryptographic Evidence",
    "## 3. Execution Evidence",
    "## 4. Policy Findings",
    "## 5. External Signed Receipts",
    "## 6. Missing Evidence",
    "## 7. Assurance Limits",
    "## 8. Human Reviewer Questions",
    "## 9. Non-Authority Statement",
  ]) {
    expect(reportText.includes(heading), `sample-review-report-section.md missing heading: ${heading}`);
  }
  expect(
    reportText.includes("Guard provides deterministic review evidence only."),
    "sample-review-report-section.md must include the deterministic review evidence statement"
  );
  expect(
    reportText.includes("It does not approve, block, deploy, certify, or control execution."),
    "sample-review-report-section.md must include the non-authority statement"
  );

  const ramenFixture = readJson(
    path.join(
      repoRoot,
      "experiments",
      "harness-phase-2-external-evidence",
      "fixtures",
      "external-signed-receipt-ramen-example.json"
    )
  );
  expect(ramenFixture.source === "ramen", "external-signed-receipt-ramen-example.json source must equal ramen");

  const schemaDocPath = path.join(repoRoot, "docs", "harness", "phase-2-external-evidence-record-schema.md");
  const contractDocPath = path.join(repoRoot, "docs", "harness", "phase-2-external-evidence-verification-contract.md");
  const readmePath = path.join(repoRoot, "experiments", "harness-phase-2-external-evidence", "README.md");
  const schemaDoc = readText(schemaDocPath);
  const contractDoc = readText(contractDocPath);
  const readme = readText(readmePath);
  expect(schemaDoc.includes("Ramen is one example only."), "schema document must state that Ramen is one example only.");
  expect(contractDoc.includes("Ramen is one example only."), "verification contract must state that Ramen is one example only.");
  expect(readme.includes("Ramen is one example only."), "README must state that Ramen is one example only.");

  validatePositiveDriftAbsence([
    schemaDocPath,
    contractDocPath,
    readmePath,
    reportPath,
    normalizedPackPath,
    mixedPackPath,
    ...fixturePaths,
  ]);

  const packagesGuardChanges = getGitChangedFiles(repoRoot, "packages/guard");
  expect(packagesGuardChanges.length === 0, "packages/guard/** must remain unchanged");

  const readmeChanges = getGitChangedFiles(repoRoot, "README.md");
  expect(readmeChanges.length === 0, "README.md must remain unchanged");

  const summary = {
    required_files_checked: requiredFiles.length,
    fixture_records_checked: fixtures.length,
    mixed_pack_record_count: mixedPack.records.length,
    distinct_evidence_types: mixedTypes.size,
    normalized_missing_evidence_count: normalizedPack.missing_evidence.length,
    normalized_assurance_limits_count: normalizedPack.assurance_limits.length,
    packages_guard_changes_detected: packagesGuardChanges.length,
    readme_changes_detected: readmeChanges.length,
  };

  console.log(JSON.stringify(summary, null, 2));
  console.log("PASS: harness phase 2 external evidence schema verified.");
}

main();
