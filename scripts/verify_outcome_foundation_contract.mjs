import { readFileSync } from "node:fs";
import { parseEvidencePack } from "../packages/guard-core/src/parseEvidencePack.ts";
import { validateEvidencePack } from "../packages/guard-core/src/validateEvidencePack.ts";
import { generateGovernanceReport } from "../packages/guard-core/src/generateGovernanceReport.ts";
import { generateEvidenceIndex } from "../packages/guard-core/src/generateEvidenceIndex.ts";
import { renderMarkdownReport } from "../packages/renderer-md/src/renderMarkdownReport.ts";
import { renderHtmlReport } from "../packages/renderer-html/src/renderHtmlReport.ts";

const FIXTURE_CASES = [
  {
    id: "ai-pr-low-risk-complete",
    fixturePath: "fixtures/ai-pr-low-risk-complete/evidence-pack.json",
    expectedVerdict: "allow",
  },
  {
    id: "ai-pr-missing-tests",
    fixturePath: "fixtures/ai-pr-missing-tests/evidence-pack.json",
    expectedVerdict: "require_review",
  },
  {
    id: "dependency-upgrade-breaking-change",
    fixturePath: "fixtures/dependency-upgrade-breaking-change/evidence-pack.json",
    expectedVerdict: "require_review",
  },
  {
    id: "release-prep-missing-rollback",
    fixturePath: "fixtures/release-prep-missing-rollback/evidence-pack.json",
    expectedVerdict: "require_review",
  },
  {
    id: "cyber-remediation-authorized-patch",
    fixturePath: "fixtures/cyber-remediation-authorized-patch/evidence-pack.json",
    expectedVerdict: "require_review",
  },
];

const REQUIRED_REPORT_KEYS = [
  "report_id",
  "report_schema_version",
  "source_pack_id",
  "workflow_summary",
  "verdict",
  "evidence_coverage",
  "reason_codes",
  "provenance",
];

const REQUIRED_MARKDOWN_HEADINGS = [
  "Executive Summary",
  "Verdict",
  "Workflow",
  "Authority",
  "Evidence Coverage",
  "Missing Evidence",
  "Next Actions",
  "Provenance",
];

const REQUIRED_HTML_SNIPPETS = [
  "<!doctype html>",
  "Verdict",
  "Workflow",
  "Evidence Coverage",
  "Provenance",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(haystack, needle, label) {
  assert(haystack.includes(needle), `${label} is missing '${needle}'`);
}

function verifyReportShape(report, caseId) {
  for (const key of REQUIRED_REPORT_KEYS) {
    assert(report[key], `${caseId}: report is missing ${key}`);
  }
}

function verifyMarkdown(markdown, caseId) {
  assert(typeof markdown === "string" && markdown.trim().length > 0, `${caseId}: markdown output is empty`);

  for (const heading of REQUIRED_MARKDOWN_HEADINGS) {
    assertIncludes(markdown, heading, `${caseId}: markdown output`);
  }
}

function verifyHtml(html, caseId) {
  assert(typeof html === "string" && html.trim().length > 0, `${caseId}: html output is empty`);

  for (const snippet of REQUIRED_HTML_SNIPPETS) {
    assertIncludes(html, snippet, `${caseId}: html output`);
  }

  assert(!html.includes("http://"), `${caseId}: html output includes http://`);
  assert(!html.includes("https://"), `${caseId}: html output includes https://`);
  assert(!html.toLowerCase().includes("cdn"), `${caseId}: html output includes cdn`);
}

function verifyEvidenceIndex(index, report, caseId) {
  assert(index && typeof index === "object" && !Array.isArray(index), `${caseId}: evidence index is not an object`);
  assert(index.index_schema_version === "1.0.0", `${caseId}: evidence index schema version mismatch`);
  assert(index.report_id === report.report_id, `${caseId}: evidence index report_id mismatch`);
  assert(index.source_pack_id === report.source_pack_id, `${caseId}: evidence index source_pack_id mismatch`);
  assert(Array.isArray(index.entries), `${caseId}: evidence index entries is not an array`);

  const json = JSON.stringify(index.entries);
  assert(typeof json === "string" && json.length > 0, `${caseId}: evidence index entries are not JSON-serializable`);
}

function verifyFixtureCase(fixtureCase) {
  const input = readFileSync(fixtureCase.fixturePath, "utf8");

  const parsed = parseEvidencePack(input);
  assert(parsed.ok, `${fixtureCase.id}: parseEvidencePack returned errors`);

  const validation = validateEvidencePack(parsed.pack);
  assert(validation.ok, `${fixtureCase.id}: validateEvidencePack returned errors`);

  const reportResult = generateGovernanceReport(input);
  assert(reportResult.ok, `${fixtureCase.id}: generateGovernanceReport returned errors`);

  const { report } = reportResult;
  verifyReportShape(report, fixtureCase.id);
  assert(
    report.verdict?.value === fixtureCase.expectedVerdict,
    `${fixtureCase.id}: expected verdict ${fixtureCase.expectedVerdict} but received ${report.verdict?.value}`,
  );

  const markdown = renderMarkdownReport(report);
  verifyMarkdown(markdown, fixtureCase.id);

  const html = renderHtmlReport(report);
  verifyHtml(html, fixtureCase.id);

  const evidenceIndex = generateEvidenceIndex(report);
  verifyEvidenceIndex(evidenceIndex, report, fixtureCase.id);

  return {
    caseId: fixtureCase.id,
    verdict: report.verdict.value,
    warningCount: validation.warnings.length + reportResult.warnings.length,
    evidenceIndexEntries: evidenceIndex.entries.length,
  };
}

const results = FIXTURE_CASES.map(verifyFixtureCase);

for (const result of results) {
  process.stdout.write(
    `${result.caseId}: verdict=${result.verdict}; warnings=${result.warningCount}; indexEntries=${result.evidenceIndexEntries}\n`,
  );
}

process.stdout.write("outcome foundation contract verified\n");
