import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CURRENT_DOC_TARGETS = [
  "README.md",
  "docs/product/current/edition-value-map.md",
  "docs/product/current/trust-faq.md",
  "docs/product/current/v7_0_1_commercial_baseline.md",
  "docs/product/current/first-governance-report.md",
];

const HISTORICAL_TARGET = "docs/product/current/commercial-baseline-v6.13.md";

const REQUIRED_CURRENT_PHRASES = [
  "v7.0.1 is the current public commercial baseline",
  "deterministic governance evidence layer for single-agent AI workflows",
  "governance evidence depth, not runtime authority",
  "No extra runtime authority",
  "no approval system",
  "no blocking system",
  "non-control-plane",
  "Guard produces review evidence",
  "does not approve, block, deploy, certify, or control execution",
  "@veeduzyl/mindforge-guard@7.0.1",
];

const REQUIRED_HISTORICAL_PHRASES = [
  "historical baseline note",
  "no longer the current public commercial baseline",
  "current public commercial baseline is now v7.0.1",
];

const FORBIDDEN_CURRENT_PHRASES = [
  "v6.13 is the current commercial baseline",
  "v6.13.1 is the current commercial baseline",
  "current stable commercial baseline",
  "current commercial release baseline remains v6.13.1",
  "not a public launch",
  "README/docs candidate",
  "v7.0 First Report Candidate",
  "v7_0_download_to_first_report_ux.md",
  "v7_0_license_hub_copy_candidate.md",
  "safe to deploy",
  "legal compliance guarantee",
  "compliance certification",
  "maturity certification",
  "runtime enforcement",
  "deployment gate",
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

function assertContainsNone(text, phrases, label) {
  const lower = text.toLowerCase();
  for (const phrase of phrases) {
    expect(!lower.includes(phrase.toLowerCase()), `${label} must not include: ${phrase}`);
  }
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const currentDocsText = CURRENT_DOC_TARGETS.map((relativePath) => readText(repoRoot, relativePath)).join("\n");
  const historicalText = readText(repoRoot, HISTORICAL_TARGET);

  assertContainsAll(currentDocsText, REQUIRED_CURRENT_PHRASES, "current docs baseline");
  assertContainsNone(currentDocsText, FORBIDDEN_CURRENT_PHRASES, "current docs baseline");
  assertContainsAll(historicalText, REQUIRED_HISTORICAL_PHRASES, "commercial-baseline-v6.13.md");

  console.log("PASS: v7.0.1 current docs baseline verified.");
}

main();
