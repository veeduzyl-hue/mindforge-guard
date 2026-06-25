import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStudioGeneratedOutputPayloadForSample } from "./createGeneratedOutputPayload.mjs";
import { runStudioSample } from "./studioWorkflow.mjs";

const REQUIRED_SAMPLES = Object.freeze([
  "ai-pr-low-risk-complete",
  "ai-pr-missing-tests",
]);

function text(...parts) {
  return parts.join("");
}

const FORBIDDEN_GENERATED_FILE_NAMES = Object.freeze([
  "studio-output-report.md",
  "studio-output-report.html",
  "studio-output-evidence-index.json",
  "studio-output-payload.js",
  ...REQUIRED_SAMPLES.flatMap((sampleName) => ([
    `${sampleName}-report.md`,
    `${sampleName}-report.html`,
    `${sampleName}-evidence-index.json`,
    `${sampleName}-payload.js`,
  ])),
]);

const INDEX_FORBIDDEN_PATTERNS = Object.freeze([
  { label: text("markdown", "Output"), pattern: text("markdown", "Output") },
  { label: text("html", "Output"), pattern: text("html", "Output") },
  { label: text("index", "Output"), pattern: text("index", "Output") },
  { label: text("generate", "Evidence", "Index"), pattern: text("generate", "Evidence", "Index") },
  { label: text("parse", "Evidence", "Pack"), pattern: text("parse", "Evidence", "Pack") },
  { label: text("validate", "Evidence", "Pack"), pattern: text("validate", "Evidence", "Pack") },
  { label: text("generate", "Governance", "Report"), pattern: text("generate", "Governance", "Report") },
  { label: text("compute", "Verdict"), pattern: text("compute", "Verdict") },
  { label: text("compute", "Risk"), pattern: text("compute", "Risk") },
  { label: text("compute", "Coverage"), pattern: text("compute", "Coverage") },
  { label: text("select", "Reason"), pattern: text("select", "Reason") },
  { label: "reasonCodes assignment", pattern: text("reason", "Codes", " =") },
  { label: text("fe", "tch"), pattern: text("fe", "tch") },
  { label: text("ax", "ios"), pattern: text("ax", "ios") },
  { label: text("XML", "Http", "Request"), pattern: text("XML", "Http", "Request") },
  { label: text("Web", "Socket"), pattern: text("Web", "Socket") },
  { label: text("open", "ai"), pattern: text("open", "ai") },
  { label: text("anth", "ropic"), pattern: text("anth", "ropic") },
  { label: text("allow", "-scripts"), pattern: text("allow", "-scripts") },
  { label: text("allow", "-forms"), pattern: text("allow", "-forms") },
  { label: text("allow", "-same-origin"), pattern: text("allow", "-same-origin") },
  { label: text("allow", "-popups"), pattern: text("allow", "-popups") },
  { label: text("http", "://"), pattern: text("http", "://") },
  { label: text("https", "://"), pattern: text("https", "://") },
  { label: text("c", "dn"), pattern: text("c", "dn") },
]);

const PROTOTYPE_DOC_REQUIREMENTS = Object.freeze([
  { label: "local-first", pattern: "local-first review workspace" },
  { label: "downstream-only", pattern: "downstream-only" },
  { label: "Guard Core source of truth", pattern: "Guard Core remains the governance source of truth" },
  { label: "does not compute verdicts", pattern: "compute verdicts" },
  { label: "does not compute reason codes", pattern: "compute reason codes" },
  { label: "does not compute risk", pattern: "compute risk" },
  { label: "does not compute coverage", pattern: "compute coverage" },
  { label: "does not parse packs outside Guard Core", pattern: "parse packs outside Guard Core" },
  { label: "does not validate packs outside Guard Core", pattern: "validate packs outside Guard Core" },
  { label: "does not generate reports in browser", pattern: "generate governance reports or Evidence Index JSON in browser-side JavaScript" },
  { label: "no pack action running", pattern: "run Evidence Pack actions" },
  { label: "does not inspect artifact files", pattern: "inspect artifact file contents" },
  { label: "no off-device transfer", pattern: "does not send pack input off-device" },
  { label: "does not keep hosted persistence", pattern: "does not keep pack input in hosted persistence" },
]);

const DOCS_DOC_REQUIREMENTS = Object.freeze([
  { label: "local-first", pattern: "local-first review workspace" },
  { label: "downstream-only", pattern: "downstream-only" },
  { label: "Guard Core source of truth", pattern: "Guard Core remains the only governance source of truth" },
  { label: "does not compute verdicts", pattern: "Studio does not independently compute governance logic" },
  { label: "does not compute reason codes", pattern: "does not compute reason codes, verdicts, risk, coverage, or reports" },
  { label: "does not parse", pattern: "Evidence Pack parsing" },
  { label: "does not validate", pattern: "Evidence Pack validation" },
  { label: "no pack action running", pattern: "Studio does not run pack actions during import" },
  { label: "does not inspect artifact files", pattern: "Studio does not inspect artifact files referenced by a pack" },
  { label: "no off-device transfer", pattern: "Studio does not send pack input off-device" },
  { label: "does not keep hosted persistence", pattern: "Studio does not keep pack input in hosted persistence" },
]);

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

async function readRepoFile(relativePath) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.resolve(__dirname, relativePath);
  return fs.readFile(filePath, "utf8");
}

async function verifyStudioWorkflow() {
  for (const sampleName of REQUIRED_SAMPLES) {
    const result = await runStudioSample(sampleName);
    assert(result?.source?.sample_name === sampleName, `Workflow sample mismatch for ${sampleName}.`);
    assert(result?.governance_report?.ok === true, `Workflow report was not ok for ${sampleName}.`);
    assert(typeof result?.markdown_preview === "string" && result.markdown_preview.length > 0, `Workflow Markdown missing for ${sampleName}.`);
    assert(typeof result?.html_preview === "string" && result.html_preview.length > 0, `Workflow HTML missing for ${sampleName}.`);
    assert(result?.evidence_index && Array.isArray(result.evidence_index.entries), `Workflow Evidence Index missing for ${sampleName}.`);
  }
}

async function verifyPayloadHelper() {
  for (const sampleName of REQUIRED_SAMPLES) {
    const payload = await createStudioGeneratedOutputPayloadForSample(sampleName);
    assert(typeof payload === "string" && payload.trim().length > 0, `Payload was empty for ${sampleName}.`);
    for (const requiredFragment of [
      "window.setStudioGeneratedOutputs",
      "markdown:",
      "html:",
      "evidenceIndexJson:",
      "slug:",
    ]) {
      assert(
        payload.includes(requiredFragment),
        `Payload for ${sampleName} is missing '${requiredFragment}'.`,
      );
    }
  }
}

function verifyForbiddenPatterns(source, patterns, label) {
  for (const entry of patterns) {
    assert(!source.includes(entry.pattern), `${label} contains forbidden pattern '${entry.label}'.`);
  }
}

function verifyRequiredPatterns(source, patterns, label) {
  for (const entry of patterns) {
    assert(source.includes(entry.pattern), `${label} is missing required boundary text for '${entry.label}'.`);
  }
}

async function verifyStaticPrototypeBoundary() {
  const indexHtml = await readRepoFile("./index.html");
  verifyForbiddenPatterns(indexHtml, INDEX_FORBIDDEN_PATTERNS, "prototypes/studio/index.html");
}

async function verifyNoCommittedGeneratedArtifacts() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const studioFiles = await fs.readdir(__dirname);

  for (const fileName of FORBIDDEN_GENERATED_FILE_NAMES) {
    assert(
      !studioFiles.includes(fileName),
      `Forbidden generated artifact is present in prototypes/studio: ${fileName}`,
    );
  }
}

async function verifyDocsBoundary() {
  const prototypeDoc = await readRepoFile("./studio-prototype.md");
  const docsDoc = await readRepoFile("../../docs/studio-prototype.md");
  verifyRequiredPatterns(
    prototypeDoc,
    PROTOTYPE_DOC_REQUIREMENTS,
    "prototypes/studio/studio-prototype.md",
  );
  verifyRequiredPatterns(
    docsDoc,
    DOCS_DOC_REQUIREMENTS,
    "docs/studio-prototype.md",
  );
}

async function main() {
  await verifyStudioWorkflow();
  await verifyPayloadHelper();
  await verifyStaticPrototypeBoundary();
  await verifyNoCommittedGeneratedArtifacts();
  await verifyDocsBoundary();

  console.log("PASS: Studio prototype smoke verification passed.");
  console.log("Checked workflow samples, payload helper output, static browser boundary, docs boundary, and absence of committed generated artifacts.");
  console.log("No generated artifacts were written.");
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`FAIL: ${message}\n`);
  process.exitCode = 1;
}
