import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TARGETS = {
  workflow: ".github/workflows/guard-first-governance-report.yml",
  guide: "docs/product/current/github-action-first-report.md",
  readme: "README.md",
  verify: "docs/VERIFY.md",
};

const WORKFLOW_REQUIRED_PHRASES = [
  "workflow_dispatch",
  "@veeduzyl/mindforge-guard@7.0.1",
  "guard --version",
  "guard --help",
  "guard pack validate --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json > guard-pack-validate.json",
  "guard report single-agent --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json > guard-single-agent-report.json",
  "guard-pack-validate.json",
  "guard-single-agent-report.json",
  "actions/upload-artifact@v4",
];

const DOC_REQUIRED_PHRASES = [
  "manually triggered",
  "non-blocking",
  "review artifact",
  "The report is a review artifact. Final review decisions happen outside Guard.",
  "does not approve, block, deploy, certify, or control execution",
];

const README_REQUIRED_PHRASES = [
  "## GitHub Action Demo",
  "docs/product/current/github-action-first-report.md",
];

const WORKFLOW_FORBIDDEN_PATTERNS = [
  /^\s*push\s*:/m,
  /^\s*pull_request\s*:/m,
  /^\s*pull_request_target\s*:/m,
  /^\s*environment\s*:/m,
  /deploy/i,
  /publish/i,
  /release/i,
  /approval/i,
  /gate/i,
  /required check/i,
  /required status check/i,
  /merge gate/i,
];

const POSITIVE_CLAIMS = [
  "safe to deploy",
  "deployment gate",
  "approval gate",
  "approval system",
  "blocking system",
  "runtime control plane",
  "control plane",
  "runtime enforcement",
  "blocker",
  "blocks",
  "approves",
  "certifies",
  "deployment control",
  "deployment-control authority",
  "compliance certification",
  "legal compliance guarantee",
  "maturity certification",
  "required check",
  "required status check",
  "merge gate",
];

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function readText(repoRoot, relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function assertContainsAll(text, phrases, label) {
  for (const phrase of phrases) {
    expect(text.includes(phrase), `${label} must include: ${phrase}`);
  }
}

function assertMatchesNone(text, patterns, label) {
  for (const pattern of patterns) {
    expect(!pattern.test(text), `${label} must not include pattern: ${pattern}`);
  }
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "[-\\s]+");
}

function isNegatedNearby(text, index) {
  const windowStart = Math.max(0, index - 240);
  const prefix = text.slice(windowStart, index).toLowerCase();
  return (
    /\b(no|not|does not|do not|doesn't|is not|are not|never|without)\b[\s\S]{0,80}$/.test(prefix) ||
    /\b(does not become|do not become)\b[\s\S]{0,200}$/.test(prefix) ||
    /\bnon[-\s]*$/.test(prefix)
  );
}

function assertNoPositiveBoundaryClaims(text, label) {
  for (const claim of POSITIVE_CLAIMS) {
    const pattern = new RegExp(escapeRegex(claim), "gi");
    const matches = [...text.matchAll(pattern)];

    for (const match of matches) {
      const index = match.index ?? 0;
      if (!isNegatedNearby(text, index)) {
        fail(`${label} must not make positive claim: ${claim}`);
      }
    }
  }
}

function assertWorkflowDispatchOnly(workflowText) {
  expect(workflowText.includes("workflow_dispatch"), "workflow must include workflow_dispatch");
  expect(!/^\s*push\s*:/m.test(workflowText), "workflow must not be triggered by push");
  expect(!/^\s*pull_request\s*:/m.test(workflowText), "workflow must not be triggered by pull_request");
  expect(!/^\s*pull_request_target\s*:/m.test(workflowText), "workflow must not be triggered by pull_request_target");
}

function assertArtifactsUploaded(workflowText) {
  expect(workflowText.includes("actions/upload-artifact"), "workflow must use upload-artifact");
  expect(workflowText.includes("guard-pack-validate.json"), "workflow must upload guard-pack-validate.json");
  expect(workflowText.includes("guard-single-agent-report.json"), "workflow must upload guard-single-agent-report.json");
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const workflowText = readText(repoRoot, TARGETS.workflow);
  const guideText = readText(repoRoot, TARGETS.guide);
  const readmeText = readText(repoRoot, TARGETS.readme);
  const verifyText = readText(repoRoot, TARGETS.verify);
  const combinedText = `${workflowText}\n${guideText}\n${readmeText}\n${verifyText}`;

  assertWorkflowDispatchOnly(workflowText);
  assertArtifactsUploaded(workflowText);
  assertContainsAll(workflowText, WORKFLOW_REQUIRED_PHRASES, "GitHub Action workflow");
  assertContainsAll(guideText, DOC_REQUIRED_PHRASES, "GitHub Action guide");
  assertContainsAll(readmeText, README_REQUIRED_PHRASES, "README.md");
  assertMatchesNone(workflowText, WORKFLOW_FORBIDDEN_PATTERNS, "GitHub Action workflow");

  expect(
    workflowText.includes("name: MindForge Guard First Governance Report") ||
      workflowText.includes("name: MindForge Guard First Governance Report Demo"),
    "workflow name must clearly identify the first governance report demo",
  );
  expect(
    verifyText.includes("## 15. v7.0.1 GitHub Action First Report Verification") &&
      verifyText.includes("node scripts/verify_v7_0_1_github_action_first_report.mjs"),
    "docs/VERIFY.md must include the v7.0.1 GitHub Action first report verification command",
  );

  assertNoPositiveBoundaryClaims(combinedText, "v7.0.1 GitHub Action first report surface");

  console.log("PASS: v7.0.1 GitHub Action first report verified.");
}

main();
