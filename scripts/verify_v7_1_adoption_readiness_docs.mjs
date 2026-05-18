import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TARGETS = {
  readme: "README.md",
  verify: "docs/VERIFY.md",
  byoGuide: "docs/product/current/bring-your-own-workflow.md",
  designPartner: "docs/product/current/design-partner-workflow-walkthrough.md",
  securityPacket: "docs/product/current/security-review-packet-v1.md",
  templatesReadme: "examples/evidence-pack-templates/README.md",
  aiCodingTemplate: "examples/evidence-pack-templates/ai-coding-pr.md",
  supportTemplate: "examples/evidence-pack-templates/support-agent.md",
  opsTemplate: "examples/evidence-pack-templates/ops-agent.md",
  internalTemplate: "examples/evidence-pack-templates/internal-workflow-agent.md",
  actionWorkflow: "examples/github-actions/bring-your-own-governance-report.yml",
  readableReport: "examples/reports/single-agent-governance-report-readable.md",
};

const REQUIRED_FILES = Object.values(TARGETS);

const BYO_REQUIRED_PHRASES = [
  "Use this guide after the first sample report works locally.",
  "Evidence Pack Minimum Shape",
  "guard pack validate --pack my-workflow-pack --preview --json > guard-pack-validate.json",
  "guard report single-agent --pack my-workflow-pack --preview --json > guard-single-agent-report.json",
  "examples/evidence-pack-templates/ai-coding-pr.md",
  "examples/evidence-pack-templates/support-agent.md",
  "examples/evidence-pack-templates/ops-agent.md",
  "examples/evidence-pack-templates/internal-workflow-agent.md",
  "examples/github-actions/bring-your-own-governance-report.yml",
  "Security Review Packet v1",
  "Design Partner Workflow Walkthrough",
];

const TEMPLATE_REQUIRED_PHRASES = [
  "AI Coding PR",
  "Support Agent",
  "Ops Agent",
  "Internal Workflow Agent",
  "guard pack validate --pack my-workflow-pack --preview --json > guard-pack-validate.json",
  "guard report single-agent --pack my-workflow-pack --preview --json > guard-single-agent-report.json",
  "MindForge Guard does not approve, block, deploy, certify, or control execution.",
];

const TEMPLATE_FILE_REQUIRED_PHRASES = [
  "manifest.json",
  "agent-profile.json",
  "task-scope.md",
  "action-boundary.yaml",
  "tools.yaml",
  "data-sources.yaml",
  "review-standards.md",
  "snapshot.json",
  "evidence/",
  "guard report single-agent --pack my-workflow-pack --preview --json > guard-single-agent-report.json",
];

const WORKFLOW_REQUIRED_PHRASES = [
  "workflow_dispatch",
  "pack_path",
  "guard_version",
  "@veeduzyl/mindforge-guard@${{ inputs.guard_version }}",
  "guard pack validate --pack \"${{ inputs.pack_path }}\" --preview --json > guard-artifacts/guard-pack-validate.json",
  "guard report single-agent --pack \"${{ inputs.pack_path }}\" --preview --json > guard-artifacts/guard-single-agent-report.json",
  "actions/upload-artifact@v4",
  "contents: read",
  "review artifacts for human inspection only",
];

const READABLE_REPORT_REQUIRED_PHRASES = [
  "The JSON report remains the deterministic source artifact.",
  "Authority Boundary",
  "Evidence Coverage",
  "Risk And Drift Signals",
  "Handoff Packet",
  "does not approve, block, deploy, certify, guarantee legal compliance, or control execution",
];

const SECURITY_PACKET_REQUIRED_PHRASES = [
  "Security Review Packet v1",
  "Enterprise does not receive extra runtime authority.",
  "workflow_dispatch",
  "contents: read",
  "It is not attached to `push`, `pull_request`, or `pull_request_target` by default.",
  "This adoption-readiness line does not change:",
  "pricing",
  "checkout",
  "license signing",
  "entitlement",
  "runtime authority",
];

const README_REQUIRED_PHRASES = [
  "docs/product/current/bring-your-own-workflow.md",
  "examples/evidence-pack-templates/README.md",
  "examples/github-actions/bring-your-own-governance-report.yml",
  "docs/product/current/security-review-packet-v1.md",
];

const VERIFY_REQUIRED_PHRASES = [
  "## 16. v7.1 Adoption Readiness Docs Verification",
  "node scripts/verify_v7_1_adoption_readiness_docs.mjs",
  "does not change runtime behavior, pricing values, checkout behavior, Paddle behavior, license signing, entitlement, CLI semantics, License Hub production behavior, or Vercel production deployment settings",
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

const FORBIDDEN_POSITIVE_CLAIMS = [
  "safe to deploy",
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
  const fullPath = path.join(repoRoot, relativePath);
  expect(fs.existsSync(fullPath), `missing required file: ${relativePath}`);
  return fs.readFileSync(fullPath, "utf8");
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
  const windowStart = Math.max(0, index - 260);
  const prefix = text.slice(windowStart, index).toLowerCase();
  return (
    /\b(no|not|does not|do not|doesn't|is not|are not|never|without)\b[\s\S]{0,90}$/.test(prefix) ||
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

function assertWorkflowDispatchOnly(workflowText) {
  expect(workflowText.includes("workflow_dispatch"), "workflow must include workflow_dispatch");
  expect(!/^\s*push\s*:/m.test(workflowText), "workflow must not be triggered by push");
  expect(!/^\s*pull_request\s*:/m.test(workflowText), "workflow must not be triggered by pull_request");
  expect(!/^\s*pull_request_target\s*:/m.test(workflowText), "workflow must not be triggered by pull_request_target");
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const texts = {};
  for (const file of REQUIRED_FILES) {
    texts[file] = readText(repoRoot, file);
  }

  assertContainsAll(texts[TARGETS.byoGuide], BYO_REQUIRED_PHRASES, "Bring Your Own Workflow guide");
  assertContainsAll(texts[TARGETS.templatesReadme], TEMPLATE_REQUIRED_PHRASES, "Evidence Pack templates README");

  for (const file of [
    TARGETS.aiCodingTemplate,
    TARGETS.supportTemplate,
    TARGETS.opsTemplate,
    TARGETS.internalTemplate,
  ]) {
    assertContainsAll(texts[file], TEMPLATE_FILE_REQUIRED_PHRASES, file);
  }

  assertWorkflowDispatchOnly(texts[TARGETS.actionWorkflow]);
  assertContainsAll(texts[TARGETS.actionWorkflow], WORKFLOW_REQUIRED_PHRASES, "BYO GitHub Action workflow");
  assertMatchesNone(texts[TARGETS.actionWorkflow], WORKFLOW_FORBIDDEN_PATTERNS, "BYO GitHub Action workflow");

  assertContainsAll(texts[TARGETS.readableReport], READABLE_REPORT_REQUIRED_PHRASES, "human-readable report sample");
  assertContainsAll(texts[TARGETS.securityPacket], SECURITY_PACKET_REQUIRED_PHRASES, "Security Review Packet v1");
  assertContainsAll(texts[TARGETS.readme], README_REQUIRED_PHRASES, "README.md");
  assertContainsAll(texts[TARGETS.verify], VERIFY_REQUIRED_PHRASES, "docs/VERIFY.md");

  const combinedText = Object.entries(texts)
    .filter(([file]) => file !== TARGETS.actionWorkflow)
    .map(([, text]) => text)
    .join("\n");
  assertNoPositiveBoundaryClaims(combinedText, "v7.1 adoption readiness docs/examples surface");

  console.log("PASS: v7.1 adoption readiness docs/examples verified.");
}

main();
