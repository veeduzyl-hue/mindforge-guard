import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  CANONICAL_EVIDENCE_TYPES,
  ASSURANCE_STATUS_ENUMS,
  validateEvidenceRecordContract,
  validateEvidencePackContract,
  summarizeEvidenceContractValidation,
} from "../experiments/harness-phase-2-external-evidence/evidence-type-contract.mjs";

const NON_AUTHORITY_STATEMENT =
  "This evidence type contract validation is for deterministic review only. It does not approve, block, deploy, certify, or control execution.";

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

function assertNoForbiddenClaims(filePath) {
  const text = sanitizeNegativeContexts(readText(filePath).toLowerCase());
  for (const pattern of FORBIDDEN_POSITIVE_PATTERNS) {
    expect(!pattern.test(text), `${path.basename(filePath)} must not contain forbidden authority claim: ${pattern}`);
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

  const contractModulePath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "evidence-type-contract.mjs"
  );
  const docPath = path.join(repoRoot, "docs", "harness", "phase-2-evidence-type-contract-hardening.md");
  const mixedPackPath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "fixtures",
    "mixed-evidence-pack.json"
  );
  const normalizedGeneratorPath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "normalize-evidence-pack.mjs"
  );
  const normalizedPackPath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "artifacts",
    "normalized-evidence-pack-generated.json"
  );
  const summaryOutputPath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "artifacts",
    "evidence-type-contract-validation-summary.json"
  );

  const invalidRecordFixturePaths = {
    missing_record_type: path.join(
      repoRoot,
      "experiments",
      "harness-phase-2-external-evidence",
      "fixtures",
      "invalid",
      "missing-record-type.json"
    ),
    invalid_assurance_status: path.join(
      repoRoot,
      "experiments",
      "harness-phase-2-external-evidence",
      "fixtures",
      "invalid",
      "invalid-assurance-status.json"
    ),
    forbidden_authority_claim: path.join(
      repoRoot,
      "experiments",
      "harness-phase-2-external-evidence",
      "fixtures",
      "invalid",
      "forbidden-authority-claim.json"
    ),
    malformed_external_signed_receipt: path.join(
      repoRoot,
      "experiments",
      "harness-phase-2-external-evidence",
      "fixtures",
      "invalid",
      "malformed-external-signed-receipt.json"
    ),
  };

  const invalidPackFixturePath = path.join(
    repoRoot,
    "experiments",
    "harness-phase-2-external-evidence",
    "fixtures",
    "invalid",
    "insufficient-evidence-type-coverage.json"
  );

  for (const filePath of [
    contractModulePath,
    docPath,
    mixedPackPath,
    normalizedGeneratorPath,
    ...Object.values(invalidRecordFixturePaths),
    invalidPackFixturePath,
  ]) {
    expect(fs.existsSync(filePath), `required file missing: ${path.relative(repoRoot, filePath)}`);
  }

  expect(CANONICAL_EVIDENCE_TYPES.length >= 6, "canonical evidence type set must include at least 6 entries");
  expect(
    JSON.stringify(CANONICAL_EVIDENCE_TYPES) ===
      JSON.stringify([
        "agent_workflow_artifact",
        "blocked_action",
        "command_result",
        "external_signed_receipt",
        "policy_finding",
        "tool_call_trace",
      ]),
    "canonical evidence type set must preserve the Phase 2 canonical coverage set"
  );

  expect(
    JSON.stringify(Object.keys(ASSURANCE_STATUS_ENUMS)) ===
      JSON.stringify([
        "cryptographic_validity",
        "execution_evidence",
        "policy_completeness",
        "legal_applicability",
        "human_review_status",
      ]),
    "assurance dimensions must remain independently present"
  );

  expect(
    JSON.stringify(ASSURANCE_STATUS_ENUMS.cryptographic_validity) ===
      JSON.stringify(["verified", "failed", "not_applicable", "not_provided"]),
    "cryptographic_validity enum mismatch"
  );
  expect(
    JSON.stringify(ASSURANCE_STATUS_ENUMS.execution_evidence) ===
      JSON.stringify(["provided", "missing", "not_applicable", "not_provided"]),
    "execution_evidence enum mismatch"
  );
  expect(
    JSON.stringify(ASSURANCE_STATUS_ENUMS.policy_completeness) ===
      JSON.stringify(["complete", "partial", "missing", "not_verified"]),
    "policy_completeness enum mismatch"
  );
  expect(
    JSON.stringify(ASSURANCE_STATUS_ENUMS.legal_applicability) ===
      JSON.stringify(["verified", "not_verified", "not_applicable"]),
    "legal_applicability enum mismatch"
  );
  expect(
    JSON.stringify(ASSURANCE_STATUS_ENUMS.human_review_status) ===
      JSON.stringify(["pending", "reviewed", "not_required"]),
    "human_review_status enum mismatch"
  );

  execSync(`node "${normalizedGeneratorPath}"`, { cwd: repoRoot, encoding: "utf8", stdio: "pipe", shell: true });
  expect(fs.existsSync(normalizedPackPath), "normalized evidence pack must exist for contract validation");

  const mixedPack = readJson(mixedPackPath);
  const normalizedPack = readJson(normalizedPackPath);

  const mixedPackResult = validateEvidencePackContract(mixedPack);
  expect(mixedPackResult.valid, "mixed evidence pack contract validation must pass");

  const normalizedPackResult = validateEvidencePackContract(normalizedPack);
  expect(normalizedPackResult.valid, "generated normalized evidence pack contract validation must pass");

  const invalidFixtureExpectations = {
    missing_record_type: "missing_record_type",
    invalid_assurance_status: "invalid_assurance_status",
    forbidden_authority_claim: "forbidden_authority_claim",
    malformed_external_signed_receipt: "missing_summary",
    insufficient_evidence_type_coverage: "insufficient_evidence_type_coverage",
  };

  const invalidFixtureResults = {};
  let invalidFixtureFailuresConfirmed = 0;

  for (const [label, filePath] of Object.entries(invalidRecordFixturePaths)) {
    const recordResult = validateEvidenceRecordContract(readJson(filePath));
    invalidFixtureResults[label] = recordResult;
    expect(recordResult.valid === false, `${label} must fail contract validation`);
    expect(
      recordResult.failures.some((entry) => entry.code === invalidFixtureExpectations[label]),
      `${label} must fail with ${invalidFixtureExpectations[label]}`
    );
    invalidFixtureFailuresConfirmed += 1;
  }

  const invalidPackResult = validateEvidencePackContract(readJson(invalidPackFixturePath));
  invalidFixtureResults.insufficient_evidence_type_coverage = invalidPackResult;
  expect(invalidPackResult.valid === false, "insufficient_evidence_type_coverage must fail contract validation");
  expect(
    invalidPackResult.failures.some((entry) => entry.code === "insufficient_evidence_type_coverage"),
    "insufficient_evidence_type_coverage must fail with the coverage failure code"
  );
  invalidFixtureFailuresConfirmed += 1;

  const docText = readText(docPath);
  expect(
    docText.includes("`ramen-receipt-v5 remains one example only`."),
    "contract hardening doc must state that ramen-receipt-v5 remains one example only"
  );
  expect(
    docText.includes("External signed receipts are review evidence only."),
    "contract hardening doc must preserve review-evidence-only language for external signed receipts"
  );

  const packageJson = JSON.parse(readText(path.join(repoRoot, "package.json")));
  expect(
    packageJson.scripts["verify:harness-phase2:contract"] ===
      "node scripts/verify_harness_phase2_evidence_type_contract_hardening.mjs",
    "package.json must expose verify:harness-phase2:contract as a standalone script"
  );
  expect(
    packageJson.scripts.verify === "npm run verify:core && npm run verify:v612",
    "npm run verify must remain the existing baseline verification path"
  );
  expect(
    !packageJson.scripts.verify.includes("harness-phase2:contract"),
    "npm run verify must not include the Harness Phase 2 contract verifier"
  );
  expect(
    Object.keys(packageJson.scripts).filter((key) => key.includes("ramen")).length === 0,
    "main-bound package.json must not include ramen scripts"
  );

  const summaryArtifact = {
    contract_version: "0.1",
    canonical_evidence_types: [...CANONICAL_EVIDENCE_TYPES],
    assurance_dimensions: Object.keys(ASSURANCE_STATUS_ENUMS),
    valid_fixture_results: {
      mixed_evidence_pack: summarizeEvidenceContractValidation(mixedPack),
      normalized_evidence_pack_generated: summarizeEvidenceContractValidation(normalizedPack),
    },
    invalid_fixture_results: invalidFixtureResults,
    compatible: true,
    runtime_or_authority_drift_detected: false,
    non_authority_statement: NON_AUTHORITY_STATEMENT,
  };

  fs.writeFileSync(summaryOutputPath, `${JSON.stringify(summaryArtifact, null, 2)}\n`, "utf8");
  expect(fs.existsSync(summaryOutputPath), "summary artifact must be generated");

  for (const filePath of [docPath, summaryOutputPath]) {
    assertNoForbiddenClaims(filePath);
  }

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
    canonical_evidence_type_count: CANONICAL_EVIDENCE_TYPES.length,
    positive_fixture_count: 2,
    invalid_fixture_count: 5,
    invalid_fixture_failures_confirmed: invalidFixtureFailuresConfirmed,
    compatible: true,
    runtime_or_authority_drift_detected: false,
  };

  console.log(JSON.stringify(summary, null, 2));
  console.log("PASS: harness phase2 evidence type contract hardening verified.");
}

main();
