import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TARGETS = {
  readme: "README.md",
  verify: "docs/VERIFY.md",
  closeout: "docs/product/current/v7_1_adoption_readiness_closeout.md",
  trialLaunchPack: "docs/product/current/trial-launch-pack.md",
  exampleReadme: "examples/trial-launch-pack/README.md",
};

const REQUIRED_FILES = Object.values(TARGETS);

const CLOSEOUT_REQUIRED_PHRASES = [
  "v7.1 Adoption Readiness Closeout",
  "External Trial Path",
  "Workflow Selection Scorecard",
  "Bring Your Own Workflow",
  "Evidence Pack Templates",
  "External GitHub Action Workflow",
  "Markdown Report Renderer Plan",
  "Report Handoff Checklist",
  "Security Review Packet v1",
  "Design Partner Trial Kit",
  "Adoption Feedback Form",
  "JSON report is the deterministic source artifact",
  "Markdown is a human-readable handoff layer",
  "does not approve, block, deploy, certify, guarantee legal compliance, or control execution",
  "Enterprise has no extra runtime authority",
];

const TRIAL_LAUNCH_REQUIRED_PHRASES = [
  "Trial Launch Pack",
  "Pick One Workflow",
  "Use The Scorecard",
  "Build Your Evidence Pack",
  "Run Guard Locally",
  "Prepare The Handoff Packet",
  "Share Feedback",
  "guard pack validate --pack my-workflow-pack --preview --json > guard-pack-validate.json",
  "guard report single-agent --pack my-workflow-pack --preview --json > guard-single-agent-report.json",
  "Do not share secrets, credentials, tokens, or private keys",
  "synthetic, redacted, or summary evidence",
  "review evidence, not approval evidence",
  "does not approve, block, deploy, certify, guarantee legal compliance, or control execution",
];

const EXAMPLE_REQUIRED_PHRASES = [
  "trial launch packet",
  "v7_1_adoption_readiness_closeout.md",
  "trial-launch-pack.md",
  "design-partner-trial-kit.md",
  "workflow-selection-scorecard.md",
  "adoption-feedback-form.md",
  "evidence-pack-templates",
  "bring-your-own-governance-report.yml",
  "reports/README.md",
  "not a certification packet",
  "not a deployment packet",
  "not an approval workflow",
  "not a runtime control plane",
];

const README_REQUIRED_PHRASES = [
  "docs/product/current/v7_1_adoption_readiness_closeout.md",
  "docs/product/current/trial-launch-pack.md",
];

const VERIFY_REQUIRED_PHRASES = [
  "node scripts/verify_v7_1_adoption_readiness_closeout.mjs",
  "v7.1 Adoption Readiness Closeout Verification",
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

  assertContainsAll(texts[TARGETS.closeout], CLOSEOUT_REQUIRED_PHRASES, "v7.1 adoption readiness closeout");
  assertContainsAll(texts[TARGETS.trialLaunchPack], TRIAL_LAUNCH_REQUIRED_PHRASES, "Trial launch pack");
  assertContainsAll(texts[TARGETS.exampleReadme], EXAMPLE_REQUIRED_PHRASES, "examples/trial-launch-pack/README.md");
  assertContainsAll(texts[TARGETS.readme], README_REQUIRED_PHRASES, "README.md");
  assertContainsAll(texts[TARGETS.verify], VERIFY_REQUIRED_PHRASES, "docs/VERIFY.md");

  const combinedText = [
    texts[TARGETS.closeout],
    texts[TARGETS.trialLaunchPack],
    texts[TARGETS.exampleReadme],
    texts[TARGETS.readme],
    texts[TARGETS.verify],
  ].join("\n");
  assertNoPositiveBoundaryClaims(combinedText, "v7.1 adoption readiness closeout surface");

  console.log("PASS: v7.1 adoption readiness closeout docs/examples verified.");
}

main();
