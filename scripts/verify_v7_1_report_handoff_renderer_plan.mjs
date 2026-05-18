import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TARGETS = {
  readme: "README.md",
  verify: "docs/VERIFY.md",
  rendererPlan: "docs/product/current/markdown-report-renderer-plan.md",
  handoffChecklist: "docs/product/current/report-handoff-checklist.md",
  reportsReadme: "examples/reports/README.md",
  readableReport: "examples/reports/single-agent-governance-report-readable.md",
};

const REQUIRED_FILES = Object.values(TARGETS);

const RENDERER_PLAN_REQUIRED_PHRASES = [
  "JSON report remains the deterministic source artifact",
  "Markdown report is a human-readable handoff layer",
  "does not replace the JSON report",
  "does not change report schema",
  "does not change Evidence Pack schema",
  "does not add runtime authority",
  "future additive renderer",
  "separate additive PR with separate verification and acceptance",
  "must not:",
  "approve, block, deploy, certify, guarantee legal compliance, or control execution",
];

const HANDOFF_CHECKLIST_REQUIRED_PHRASES = [
  "Evidence Pack folder",
  "guard-pack-validate.json",
  "guard-single-agent-report.json",
  "optional Markdown summary",
  "known missing evidence",
  "security review notes",
  "Do not share secrets, credentials, tokens, or private keys",
  "human reviewer decision remains outside Guard",
  "does not approve, block, deploy, certify, guarantee legal compliance, or control execution",
];

const REPORTS_README_REQUIRED_PHRASES = [
  "single-agent-governance-report-readable.md",
  "markdown-report-renderer-plan.md",
  "bring-your-own-workflow.md",
  "JSON report is the deterministic source artifact",
  "Markdown sample is a readable handoff sample",
  "human review",
];

const README_REQUIRED_PHRASES = [
  "docs/product/current/markdown-report-renderer-plan.md",
  "docs/product/current/report-handoff-checklist.md",
  "examples/reports/README.md",
];

const VERIFY_REQUIRED_PHRASES = [
  "node scripts/verify_v7_1_report_handoff_renderer_plan.mjs",
  "Markdown renderer plan",
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

  assertContainsAll(
    texts[TARGETS.rendererPlan],
    RENDERER_PLAN_REQUIRED_PHRASES,
    "Markdown report renderer plan",
  );
  assertContainsAll(
    texts[TARGETS.handoffChecklist],
    HANDOFF_CHECKLIST_REQUIRED_PHRASES,
    "Report handoff checklist",
  );
  assertContainsAll(texts[TARGETS.reportsReadme], REPORTS_README_REQUIRED_PHRASES, "Report examples README");
  assertContainsAll(texts[TARGETS.readme], README_REQUIRED_PHRASES, "README.md");
  assertContainsAll(texts[TARGETS.verify], VERIFY_REQUIRED_PHRASES, "docs/VERIFY.md");

  const combinedText = [
    texts[TARGETS.rendererPlan],
    texts[TARGETS.handoffChecklist],
    texts[TARGETS.reportsReadme],
    texts[TARGETS.readableReport],
    texts[TARGETS.readme],
    texts[TARGETS.verify],
  ].join("\n");
  assertNoPositiveBoundaryClaims(combinedText, "v7.1 report handoff renderer-plan surface");

  console.log("PASS: v7.1 report handoff renderer plan docs/examples verified.");
}

main();
