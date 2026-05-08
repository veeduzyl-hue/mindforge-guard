import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { runGuard } from "../packages/guard/src/runGuard.mjs";

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const requiredDocs = [
  "docs/productization/v7_0_single_agent_governance_report_prd.md",
  "docs/governance/v7_0_single_agent_governance_report_preview_acceptance.md",
  "docs/governance/v7_0_single_agent_governance_report_preview_closeout.md",
  "docs/governance/v7_0_single_agent_governance_report_cli_preview_acceptance.md",
  "docs/governance/v7_0_single_agent_governance_report_cli_preview_closeout.md",
  "docs/governance/v7_0_single_agent_governance_report_final_acceptance.md",
];

const requiredPhase2AContractFiles = [
  "schemas/single_agent_governance_report/preview_v1.schema.json",
  "fixtures/single_agent_governance_report/ready_for_review.json",
  "fixtures/single_agent_governance_report/needs_human_review.json",
  "fixtures/single_agent_governance_report/insufficient_evidence.json",
  "fixtures/single_agent_governance_report/out_of_scope.json",
  "fixtures/single_agent_governance_report/unknown.json",
  "scripts/verify_v7_0_single_agent_governance_report_preview.mjs",
];

const requiredPhase2BFiles = [
  "packages/guard/src/cli/single_agent_governance_report.mjs",
  "scripts/verify_v7_0_single_agent_governance_report_cli_preview.mjs",
  "docs/governance/v7_0_single_agent_governance_report_cli_preview_acceptance.md",
  "docs/governance/v7_0_single_agent_governance_report_cli_preview_closeout.md",
];

const requiredFoundationEntries = [
  "status_validate_policy",
  "audit",
  "snapshot",
  "action_classify",
  "drift",
  "assoc_correlate",
  "risk",
  "license_edition_gate",
  "verification_chain",
];

const forbiddenTopLevelFields = [
  "readiness_verdict",
  "approval_result",
  "decision",
  "enforcement_result",
  "compliance_status",
  "merge_status",
  "deployment_status",
  "permit_result",
  "commit_result",
  "block_result",
];

const expectedBoundary = {
  recommendation_only: true,
  non_executing: true,
  approval_granted: false,
  execution_permission_granted: false,
  blocking_effect: false,
  deployment_authority: false,
  merge_authority: false,
  enforcement_action: "none",
  legal_compliance_claim: false,
};

function expectFileExists(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  expect(fs.existsSync(absolutePath), `${relativePath} must exist`);
}

async function runVerifierModule(relativePath) {
  const moduleUrl = pathToFileURL(path.join(repoRoot, relativePath)).href;
  await import(`${moduleUrl}?ts=${Date.now()}`);
}

function readText(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  try {
    return fs.readFileSync(absolutePath, "utf8");
  } catch (error) {
    fail(`unable to read ${relativePath} (${error.message})`);
  }
}

function validateFinalAcceptanceDoc() {
  const docPath = "docs/governance/v7_0_single_agent_governance_report_final_acceptance.md";
  const text = readText(docPath);
  const requiredSnippets = [
    "# v7.0 Single-Agent Governance Report Final Acceptance",
    "This is Phase 3 internal final acceptance / RC freeze only.",
    "PR #203",
    "PR #204",
    "PR #205",
    "PR #206",
    "PR #207",
    "PR #208",
    "`edc4741`",
    "node scripts/verify_v7_0_single_agent_governance_report_preview.mjs",
    "PASS: v7.0 single_agent_governance_report_preview schema and fixtures validated.",
    "node scripts/verify_v7_0_single_agent_governance_report_cli_preview.mjs",
    "PASS: v7.0 single_agent_governance_report CLI preview validated.",
    "node scripts/verify_v7_0_single_agent_governance_report_final_acceptance.mjs",
    "PASS: v7.0 single_agent_governance_report final acceptance verified.",
    "node packages/guard/src/runGuard.mjs report single-agent --preview --json --fixture-file <file>",
    "does not create commercial launch",
    "does not create GitHub Action implementation",
    "does not create `action.yml`",
    "does not create workflow files",
    "does not create repo scaffolding",
    "does not create Marketplace launch surface",
    "does not start Multi-Agent work",
    "does not alter entitlement logic",
    "does not change `audit` / `permit` / `classify` / `drift` / `license` semantics",
    "does not change deny exit code `25`",
    "`review_posture` remains the only readiness vocabulary",
    "`readiness_verdict` was intentionally not introduced",
    "v7.0 Single-Agent Governance Report is internally accepted as a preview-only, fixture-backed, JSON-first, non-enforcing governance report capability.",
    "v7.0 Phase 4 - 10-minute demo path",
    "Phase 4 must not begin until explicitly approved.",
    "no GitHub Action implementation",
    "no Marketplace",
    "no Multi-Agent",
  ];

  for (const snippet of requiredSnippets) {
    expect(text.includes(snippet), `final acceptance doc must include: ${snippet}`);
  }
}

function validateReportOutput(report) {
  expect(report && typeof report === "object" && !Array.isArray(report), "CLI output must be a JSON object");
  expect(
    report.object_type === "single_agent_governance_report_preview",
    "CLI output object_type mismatch"
  );
  expect(report.object_version === "v1", "CLI output object_version mismatch");
  expect(report.report_mode === "preview", "CLI output report_mode mismatch");
  expect(typeof report.review_posture === "string" && report.review_posture.length >= 1, "CLI output review_posture missing");
  expect(report.pre_v6_14_capability_foundation, "CLI output must preserve pre_v6_14_capability_foundation");
  expect(report.non_enforcement_boundary, "CLI output must preserve non_enforcement_boundary");

  for (const field of forbiddenTopLevelFields) {
    expect(!(field in report), `CLI output must not contain ${field}`);
  }

  for (const [key, expectedValue] of Object.entries(expectedBoundary)) {
    expect(
      report.non_enforcement_boundary[key] === expectedValue,
      `CLI output non_enforcement_boundary.${key} must be ${expectedValue}`
    );
  }

  const foundation = report.pre_v6_14_capability_foundation;
  expect(foundation && typeof foundation === "object" && !Array.isArray(foundation), "pre_v6_14_capability_foundation must be an object");
  for (const key of requiredFoundationEntries) {
    expect(key in foundation, `pre_v6_14_capability_foundation.${key} must exist`);
    expect(
      foundation[key] && typeof foundation[key] === "object" && !Array.isArray(foundation[key]),
      `pre_v6_14_capability_foundation.${key} must be an object`
    );
    expect(
      foundation[key].contract_preserved === true,
      `pre_v6_14_capability_foundation.${key}.contract_preserved must be true`
    );
  }
  expect(
    foundation.license_edition_gate.entitlement_changed === false,
    "pre_v6_14_capability_foundation.license_edition_gate.entitlement_changed must be false"
  );
}

async function validateAcceptedCliPath() {
  const fixturePath = path.join(
    repoRoot,
    "fixtures",
    "single_agent_governance_report",
    "ready_for_review.json"
  );

  const result = await runGuard({
    argv: [
      "report",
      "single-agent",
      "--preview",
      "--json",
      "--fixture-file",
      fixturePath,
    ],
  });

  expect(result.exitCode === 0, "accepted CLI preview command must exit 0");
  expect((result.stderr || "") === "", "accepted CLI preview command stderr must be empty");

  let parsed;
  try {
    parsed = JSON.parse(result.stdout || "");
  } catch (error) {
    fail(`accepted CLI preview command stdout must parse as JSON (${error.message})`);
  }

  validateReportOutput(parsed);
}

async function main() {
  await runVerifierModule("scripts/verify_v7_0_single_agent_governance_report_preview.mjs");
  await runVerifierModule("scripts/verify_v7_0_single_agent_governance_report_cli_preview.mjs");

  for (const relativePath of requiredDocs) expectFileExists(relativePath);
  for (const relativePath of requiredPhase2AContractFiles) expectFileExists(relativePath);
  for (const relativePath of requiredPhase2BFiles) expectFileExists(relativePath);

  validateFinalAcceptanceDoc();
  await validateAcceptedCliPath();

  console.log("PASS: v7.0 single_agent_governance_report final acceptance verified.");
}

await main();
