import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REQUIRED_PRODUCTIZATION_ARTIFACTS = [
  "docs/productization/v7_0_report_edition_projection_plan.md",
  "docs/productization/v7_0_onboarding_evidence_pack_plan.md",
  "docs/productization/v7_0_single_agent_governance_pack_contract.md",
  "docs/productization/v7_0_policy_aligned_report_reading_view.md",
  "docs/productization/v7_0_report_reading_guide.md",
  "docs/productization/v7_0_first_report_flow.md",
  "docs/productization/v7_0_ci_readiness_plan.md",
  "docs/productization/v7_0_pack_parser_plan.md",
  "docs/productization/v7_0_cli_pack_validate_plan.md",
  "docs/productization/v7_0_report_single_agent_preview_plan.md",
  "docs/governance/v7_0_e2e_acceptance.md"
];

const REQUIRED_IMPLEMENTATION_ARTIFACTS = [
  "examples/single-agent-governance-pack/hr-self-service-agent/README.md",
  "packages/guard/src/productization/single_agent_pack_parser_preview.mjs",
  "packages/guard/src/productization/single_agent_report_preview_mapper.mjs",
  "packages/guard/src/cli/pack_validate_preview.mjs",
  "packages/guard/src/cli/report_single_agent_preview.mjs"
];

const EXISTING_VERIFIERS = [
  "verify_v7_0_single_agent_governance_report_preview.mjs",
  "verify_v7_0_single_agent_governance_report_cli_preview.mjs",
  "verify_v7_0_single_agent_governance_report_final_acceptance.mjs",
  "verify_v7_0_single_agent_governance_pack_preview.mjs",
  "verify_v7_0_example_evidence_pack.mjs",
  "verify_v7_0_pack_parser_preview.mjs",
  "verify_v7_0_cli_pack_validate_preview.mjs",
  "verify_v7_0_report_single_agent_preview.mjs",
  "verify_v7_0_e2e_acceptance.mjs"
];

const FORBIDDEN_CLAIMS = [
  "compliance certified",
  "legal compliance certified",
  "maturity certified",
  "approved for deployment",
  "safe to merge",
  "safe to deploy",
  "deployment allowed",
  "merge allowed",
  "runtime control plane",
  "autonomous enforcement",
  "policy enforcement engine"
];

const ALLOWED_DECISIONS = new Set([
  "hold_v7_0_release",
  "prepare_public_surface_candidate",
  "prepare_github_action_readiness_plan",
  "prepare_limited_internal_rc"
]);

const EXPECTED_DECISION = "prepare_public_surface_candidate";
const EXPECTED_BASELINE =
  "MindForge Guard v6.13.1 remains the current commercial baseline until separately changed.";
const EXPECTED_STATUS =
  "v7.0 is E2E-accepted internally and ready for commercial surface candidate preparation, but not publicly launched by this PR.";

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

async function assertVerifierStillPasses(repoRoot, verifierName) {
  const verifierPath = path.join(repoRoot, "scripts", verifierName);
  const originalConsoleLog = console.log;

  try {
    console.log = () => {};
    await import(`${pathToFileURL(verifierPath).href}?v7_0_commercial_release_gate_review=1`);
  } catch (error) {
    fail(`${verifierName} must still pass (${error.message})`);
  } finally {
    console.log = originalConsoleLog;
  }
}

function assertFileExists(repoRoot, relativePath) {
  expect(fs.existsSync(path.join(repoRoot, relativePath)), `${relativePath} must exist`);
}

function assertNoProhibitedBranchArtifacts(repoRoot) {
  expect(!fs.existsSync(path.join(repoRoot, ".github", "workflows")), ".github/workflows must not exist");
  expect(!fs.existsSync(path.join(repoRoot, "action.yml")), "action.yml must not exist");
}

function extractRecommendedDecisionValue(text) {
  const recommendedMatch = text.match(
    /Recommended:\s*(?:\r?\n)+-\s+`?(hold_v7_0_release|prepare_public_surface_candidate|prepare_github_action_readiness_plan|prepare_limited_internal_rc)`?/i
  );
  return recommendedMatch ? recommendedMatch[1] : null;
}

function assertNoPositiveForbiddenClaims(text) {
  for (const claim of FORBIDDEN_CLAIMS) {
    const escaped = claim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const positivePattern = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, "i");
    const negatedPattern = new RegExp(`(^|[^a-z])(no|not)\\s+${escaped}([^a-z]|$)`, "i");

    if (positivePattern.test(text) && !negatedPattern.test(text)) {
      fail(`forbidden positive claim present in release gate review document: ${claim}`);
    }
  }
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");
  const reviewPath = path.join(repoRoot, "docs/governance/v7_0_commercial_release_gate_review.md");

  for (const verifierName of EXISTING_VERIFIERS) {
    await assertVerifierStillPasses(repoRoot, verifierName);
  }

  for (const relativePath of REQUIRED_PRODUCTIZATION_ARTIFACTS) {
    assertFileExists(repoRoot, relativePath);
  }
  for (const relativePath of REQUIRED_IMPLEMENTATION_ARTIFACTS) {
    assertFileExists(repoRoot, relativePath);
  }

  assertNoProhibitedBranchArtifacts(repoRoot);

  expect(fs.existsSync(reviewPath), "docs/governance/v7_0_commercial_release_gate_review.md must exist");
  const reviewText = readText(reviewPath);
  const lowerReviewText = reviewText.toLowerCase();

  assertNoPositiveForbiddenClaims(lowerReviewText);

  const decisionValue = extractRecommendedDecisionValue(reviewText);
  expect(decisionValue !== null, "release gate review document must contain a decision value");
  expect(ALLOWED_DECISIONS.has(decisionValue), "release gate review document must use an allowed decision value");
  expect(decisionValue === EXPECTED_DECISION, `release gate review document must recommend ${EXPECTED_DECISION}`);

  expect(reviewText.includes(EXPECTED_BASELINE), "release gate review document must state the current commercial baseline exactly");
  expect(reviewText.includes(EXPECTED_STATUS), "release gate review document must state the current v7.0 internal status exactly");

  console.log("PASS: v7.0 commercial release gate review verified.");
}

await main();
