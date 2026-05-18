import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TARGETS = {
  readme: "README.md",
  verify: "docs/VERIFY.md",
  trialKit: "docs/product/current/design-partner-trial-kit.md",
  scorecard: "docs/product/current/workflow-selection-scorecard.md",
  feedbackForm: "docs/product/current/adoption-feedback-form.md",
  exampleReadme: "examples/design-partner-trial/README.md",
};

const REQUIRED_FILES = Object.values(TARGETS);

const TRIAL_KIT_REQUIRED_PHRASES = [
  "Design Partner Trial Kit",
  "adoption feedback",
  "JSON report is the deterministic source artifact",
  "synthetic, redacted, or summary evidence",
  "Do not share secrets, credentials, tokens, or private keys",
  "does not approve, block, deploy, certify, guarantee legal compliance, or control execution",
];

const SCORECARD_REQUIRED_PHRASES = [
  "Workflow Selection Scorecard",
  "Good First Workflow Criteria",
  "Poor First Workflow Criteria",
  "scorecard does not represent approval",
  "does not judge safe-to-deploy",
  "trial workflow",
];

const FEEDBACK_FORM_REQUIRED_PHRASES = [
  "time to first Evidence Pack",
  "time to first report",
  "Was the Evidence Pack easy to fill?",
  "Was the JSON report useful?",
  "Was the Markdown handoff useful?",
  "What would block adoption?",
  "review evidence, not approval evidence",
];

const EXAMPLE_REQUIRED_PHRASES = [
  "design-partner-trial",
  "design-partner-trial-kit.md",
  "workflow-selection-scorecard.md",
  "adoption-feedback-form.md",
  "bring-your-own-workflow.md",
  "report-handoff-checklist.md",
  "not a certification packet",
  "not a deployment packet",
  "not an approval workflow",
];

const README_REQUIRED_PHRASES = [
  "docs/product/current/design-partner-trial-kit.md",
  "docs/product/current/workflow-selection-scorecard.md",
  "docs/product/current/adoption-feedback-form.md",
];

const VERIFY_REQUIRED_PHRASES = [
  "node scripts/verify_v7_1_design_partner_trial_kit.mjs",
  "Design Partner Trial Kit",
  "does not change runtime behavior, pricing values, checkout behavior, Paddle behavior, license signing, entitlement, CLI semantics, License Hub production behavior, or Vercel production deployment settings",
];

const FORBIDDEN_POSITIVE_CLAIMS = [
  "safe to deploy",
  "approval system",
  "approval gate",
  "blocker",
  "blocking system",
  "blocks",
  "approves",
  "certifies",
  "deployment gate",
  "deployment control",
  "compliance certification",
  "legal compliance guarantee",
  "maturity certification",
  "runtime enforcement",
  "runtime control plane",
  "control plane",
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
  const fullPath = path.join(repoRoot, relativePath);
  expect(fs.existsSync(fullPath), `missing required file: ${relativePath}`);
  return fs.readFileSync(fullPath, "utf8");
}

function assertContainsAll(text, phrases, label) {
  for (const phrase of phrases) {
    expect(text.includes(phrase), `${label} must include: ${phrase}`);
  }
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "[-\\s]+");
}

function isNegatedNearby(text, index) {
  const windowStart = Math.max(0, index - 260);
  const prefix = text.slice(windowStart, index).toLowerCase();
  return (
    /\b(no|not|does not|do not|must not|doesn't|is not|are not|never|without)\b[\s\S]{0,120}$/.test(prefix) ||
    /\b(does not become|do not become|does not add|do not add|is not a|not a)\b[\s\S]{0,220}$/.test(prefix) ||
    /\bnon[-\s]*$/.test(prefix)
  );
}

function assertNoPositiveBoundaryClaims(text, label) {
  for (const claim of FORBIDDEN_POSITIVE_CLAIMS) {
    const pattern = new RegExp(escapeRegex(claim), "gi");
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const index = match.index ?? 0;
      if (!isNegatedNearby(text, index)) {
        fail(`${label} must not make positive boundary claim: ${claim}`);
      }
    }
  }
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const texts = {};
  for (const file of REQUIRED_FILES) {
    texts[file] = readText(repoRoot, file);
  }

  assertContainsAll(texts[TARGETS.trialKit], TRIAL_KIT_REQUIRED_PHRASES, "Design Partner Trial Kit");
  assertContainsAll(texts[TARGETS.scorecard], SCORECARD_REQUIRED_PHRASES, "Workflow Selection Scorecard");
  assertContainsAll(texts[TARGETS.feedbackForm], FEEDBACK_FORM_REQUIRED_PHRASES, "Adoption Feedback Form");
  assertContainsAll(texts[TARGETS.exampleReadme], EXAMPLE_REQUIRED_PHRASES, "design-partner-trial README");
  assertContainsAll(texts[TARGETS.readme], README_REQUIRED_PHRASES, "README.md");
  assertContainsAll(texts[TARGETS.verify], VERIFY_REQUIRED_PHRASES, "docs/VERIFY.md");

  const combinedText = [
    texts[TARGETS.trialKit],
    texts[TARGETS.scorecard],
    texts[TARGETS.feedbackForm],
    texts[TARGETS.exampleReadme],
    texts[TARGETS.readme],
    texts[TARGETS.verify],
  ].join("\n");
  assertNoPositiveBoundaryClaims(combinedText, "v7.1 design partner trial-kit surface");

  console.log("PASS: v7.1 design partner trial kit docs/examples verified.");
}

main();
