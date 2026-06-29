import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { renderReviewerPacket } from "../experiments/harness-phase-2-external-evidence/render-reviewer-packet.mjs";

const REQUIRED_HEADINGS = [
  "# Harness Phase 2 Reviewer Packet",
  "## Review Scope",
  "## Source Artifacts",
  "## Evidence Type Coverage",
  "## Assurance Dimensions",
  "## Missing Evidence Review",
  "## Assurance Limits Review",
  "## External Signed Receipts",
  "## Snapshot Regression Status",
  "## Reviewer Checklist",
  "## Reviewer Questions",
  "## Non-Authority Statement",
];

const REQUIRED_CHECKLIST_ITEMS = [
  "- [ ] Confirm evidence type coverage is sufficient for human review.",
  "- [ ] Confirm missing evidence has been reviewed.",
  "- [ ] Confirm assurance limits are understood.",
  "- [ ] Confirm external signed receipts are treated as review evidence only.",
  "- [ ] Confirm no runtime authority is inferred from this packet.",
];

const REQUIRED_STATEMENTS = [
  "Guard provides deterministic review evidence only. It does not approve, block, deploy, certify, or control execution.",
  "ramen-receipt-v5 remains one example only",
];

const FORBIDDEN_POSITIVE_PATTERNS = [
  /\bguard approves\b/i,
  /\bguard blocks\b/i,
  /\bguard deploys\b/i,
  /\bguard certifies\b/i,
  /\bguard controls execution\b/i,
  /\bgrant authority\b/i,
  /\bblock deployment\b/i,
  /\bcertify receipt\b/i,
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
    .replaceAll("not certification authority", "")
    .replaceAll("no runtime authority is inferred from this packet", "");
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

  const reviewerPacketRendererPath = path.join(experimentsRoot, "render-reviewer-packet.mjs");
  const reviewerPacketDocPath = path.join(repoRoot, "docs", "harness", "phase-2-reviewer-packet.md");
  const packageJsonPath = path.join(repoRoot, "package.json");

  const normalizedPackPath = path.join(artifactsRoot, "normalized-evidence-pack-generated.json");
  const reviewReportPath = path.join(artifactsRoot, "review-report-generated.md");
  const contractSummaryPath = path.join(artifactsRoot, "evidence-type-contract-validation-summary.json");
  const reviewerPacketPath = path.join(artifactsRoot, "reviewer-packet-generated.md");

  const normalizedPackSnapshotPath = path.join(snapshotsRoot, "normalized-evidence-pack.snapshot.json");
  const reviewReportSnapshotPath = path.join(snapshotsRoot, "review-report.snapshot.md");
  const contractSummarySnapshotPath = path.join(snapshotsRoot, "evidence-type-contract-validation-summary.snapshot.json");

  for (const filePath of [
    reviewerPacketRendererPath,
    reviewerPacketDocPath,
    packageJsonPath,
    normalizedPackPath,
    reviewReportPath,
    contractSummaryPath,
    normalizedPackSnapshotPath,
    reviewReportSnapshotPath,
    contractSummarySnapshotPath,
  ]) {
    expect(fs.existsSync(filePath), `required file missing: ${path.relative(repoRoot, filePath)}`);
  }

  const normalizedPack = readJson(normalizedPackPath);
  const reviewReport = readText(reviewReportPath);
  const contractSummary = readJson(contractSummaryPath);
  const normalizedPackSnapshot = readJson(normalizedPackSnapshotPath);
  const reviewReportSnapshot = readText(reviewReportSnapshotPath);
  const contractSummarySnapshot = readJson(contractSummarySnapshotPath);

  const snapshotStatus = {
    snapshots_checked: 3,
    normalized_pack_snapshot_matched: canonicalJson(normalizedPack) === canonicalJson(normalizedPackSnapshot),
    review_report_snapshot_matched: normalizeMarkdown(reviewReport) === normalizeMarkdown(reviewReportSnapshot),
    contract_summary_snapshot_matched: canonicalJson(contractSummary) === canonicalJson(contractSummarySnapshot),
  };

  const reviewerPacket = renderReviewerPacket({
    normalizedPack,
    reviewReport,
    contractSummary,
    sourceArtifacts: [
      "experiments/harness-phase-2-external-evidence/artifacts/normalized-evidence-pack-generated.json",
      "experiments/harness-phase-2-external-evidence/artifacts/review-report-generated.md",
      "experiments/harness-phase-2-external-evidence/artifacts/evidence-type-contract-validation-summary.json",
      "experiments/harness-phase-2-external-evidence/snapshots/normalized-evidence-pack.snapshot.json",
      "experiments/harness-phase-2-external-evidence/snapshots/review-report.snapshot.md",
      "experiments/harness-phase-2-external-evidence/snapshots/evidence-type-contract-validation-summary.snapshot.json",
    ],
    snapshotStatus,
  });

  fs.writeFileSync(reviewerPacketPath, reviewerPacket, "utf8");
  expect(fs.existsSync(reviewerPacketPath), "reviewer packet must be generated");

  const reviewerPacketText = readText(reviewerPacketPath);
  for (const heading of REQUIRED_HEADINGS) {
    expect(reviewerPacketText.includes(heading), `reviewer packet missing heading: ${heading}`);
  }
  for (const item of REQUIRED_CHECKLIST_ITEMS) {
    expect(reviewerPacketText.includes(item), `reviewer packet missing checklist item: ${item}`);
  }
  for (const statement of REQUIRED_STATEMENTS) {
    expect(reviewerPacketText.includes(statement), `reviewer packet missing statement: ${statement}`);
  }

  for (const code of normalizedPack.missing_evidence) {
    expect(reviewerPacketText.includes(code), `reviewer packet missing missing-evidence code: ${code}`);
  }
  for (const limit of normalizedPack.assurance_limits) {
    expect(reviewerPacketText.includes(limit), `reviewer packet missing assurance-limit code: ${limit}`);
  }
  for (const question of normalizedPack.reviewer_questions) {
    expect(reviewerPacketText.includes(question), `reviewer packet missing reviewer question: ${question}`);
  }

  expect(
    reviewerPacketText.includes("normalized evidence pack snapshot: matched"),
    "reviewer packet must include normalized snapshot status"
  );
  expect(
    reviewerPacketText.includes("review report snapshot: matched"),
    "reviewer packet must include review-report snapshot status"
  );
  expect(
    reviewerPacketText.includes("contract summary snapshot: matched"),
    "reviewer packet must include contract-summary snapshot status"
  );

  assertNoForbiddenClaims(reviewerPacketText, "reviewer packet");
  assertNoForbiddenClaims(readText(reviewerPacketDocPath), "reviewer packet doc");

  const packageJson = readJson(packageJsonPath);
  expect(
    packageJson.scripts["verify:harness-phase2:reviewer-packet"] ===
      "node scripts/verify_harness_phase2_reviewer_packet.mjs",
    "package.json must expose verify:harness-phase2:reviewer-packet as a standalone script"
  );
  expect(
    packageJson.scripts.verify === "npm run verify:core && npm run verify:v612",
    "npm run verify must remain the existing baseline verification path"
  );
  expect(
    !packageJson.scripts.verify.includes("harness-phase2:reviewer-packet"),
    "npm run verify must not include the reviewer-packet verifier"
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
    reviewer_packet: path.relative(repoRoot, reviewerPacketPath).replace(/\\/g, "/"),
    required_sections_checked: REQUIRED_HEADINGS.length - 1,
    checklist_items_checked: REQUIRED_CHECKLIST_ITEMS.length,
    compatible: true,
    runtime_or_authority_drift_detected: false,
  };

  console.log(JSON.stringify(summary, null, 2));
  console.log("PASS: harness phase2 reviewer packet verified.");
}

main();
