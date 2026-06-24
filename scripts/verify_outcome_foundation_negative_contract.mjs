import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

function normalizePath(value) {
  return value.replace(/\\/g, "/");
}

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function expectErrorCode(result, expectedCode, label) {
  expect(result && result.ok === false, `${label} must fail.`);
  expect(
    result.errors.some((error) => error.code === expectedCode),
    `${label} must include error code ${expectedCode}.`,
  );
}

function expectAnyErrorCode(result, expectedCodes, label) {
  expect(result && result.ok === false, `${label} must fail.`);
  expect(
    result.errors.some((error) => expectedCodes.includes(error.code)),
    `${label} must include one of: ${expectedCodes.join(", ")}.`,
  );
}

function clone(value) {
  return structuredClone(value);
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readSource(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function listRelativeFiles(rootDir) {
  const entries = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const nextPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(nextPath);
        continue;
      }

      entries.push(path.relative(rootDir, nextPath));
    }
  }

  walk(rootDir);
  return entries.sort();
}

function rewriteTsSpecifiersToMjs(source) {
  return source.replace(/((?:from\s+|import\s*\()\s*["'])([^"']+)\.ts(["'])/g, "$1$2.mjs$3");
}

function transpileDirectory(ts, sourceRootDir, outputRootDir) {
  for (const relativePath of listRelativeFiles(sourceRootDir)) {
    const sourcePath = path.join(sourceRootDir, relativePath);
    const outputRelativePath = relativePath.endsWith(".ts")
      ? relativePath.replace(/\.ts$/u, ".mjs")
      : relativePath;
    const outputPath = path.join(outputRootDir, outputRelativePath);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    if (!relativePath.endsWith(".ts")) {
      fs.copyFileSync(sourcePath, outputPath);
      continue;
    }

    const transpiled = ts.transpileModule(readSource(sourcePath), {
      compilerOptions: {
        module: ts.ModuleKind.ES2022,
        target: ts.ScriptTarget.ES2022,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
      },
      fileName: sourcePath,
    });

    fs.writeFileSync(
      outputPath,
      rewriteTsSpecifiersToMjs(transpiled.outputText),
      "utf8",
    );
  }
}

async function loadOutcomeFoundationModules(repoRoot) {
  const tsModulePath = path.join(repoRoot, "node_modules", "typescript", "lib", "typescript.js");
  expect(fs.existsSync(tsModulePath), "local TypeScript runtime must be available.");
  const ts = await import(pathToFileUrl(tsModulePath).href);

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mindforge-outcome-foundation-"));
  const transpileTargets = [
    {
      source: path.join(repoRoot, "packages", "guard-core", "src"),
      output: path.join(tempRoot, "packages", "guard-core", "src"),
    },
    {
      source: path.join(repoRoot, "packages", "renderer-md", "src"),
      output: path.join(tempRoot, "packages", "renderer-md", "src"),
    },
    {
      source: path.join(repoRoot, "packages", "renderer-html", "src"),
      output: path.join(tempRoot, "packages", "renderer-html", "src"),
    },
  ];

  for (const target of transpileTargets) {
    transpileDirectory(ts, target.source, target.output);
  }

  const guardCore = await import(
    pathToFileUrl(path.join(tempRoot, "packages", "guard-core", "src", "index.mjs")).href
  );
  const rendererMd = await import(
    pathToFileUrl(path.join(tempRoot, "packages", "renderer-md", "src", "index.mjs")).href
  );
  const rendererHtml = await import(
    pathToFileUrl(path.join(tempRoot, "packages", "renderer-html", "src", "index.mjs")).href
  );

  return {
    generateEvidenceIndex: guardCore.generateEvidenceIndex,
    generateGovernanceReport: guardCore.generateGovernanceReport,
    parseEvidencePack: guardCore.parseEvidencePack,
    renderHtmlReport: rendererHtml.renderHtmlReport,
    renderMarkdownReport: rendererMd.renderMarkdownReport,
    tempRoot,
    validateEvidencePack: guardCore.validateEvidencePack,
  };
}

function pathToFileUrl(filePath) {
  const normalized = normalizePath(path.resolve(filePath));
  return new URL(`file:///${normalized}`);
}

function expectSourceExcludes(source, tokens, label) {
  for (const token of tokens) {
    expect(!source.includes(token), `${label} must not include ${token}.`);
  }
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");
  const {
    generateEvidenceIndex,
    generateGovernanceReport,
    parseEvidencePack,
    renderHtmlReport,
    renderMarkdownReport,
    validateEvidencePack,
  } = await loadOutcomeFoundationModules(repoRoot);

  const validPackPath = path.join(repoRoot, "fixtures", "ai-pr-low-risk-complete", "evidence-pack.json");
  const markdownRendererPath = path.join(repoRoot, "packages", "renderer-md", "src", "renderMarkdownReport.ts");
  const htmlRendererPath = path.join(repoRoot, "packages", "renderer-html", "src", "renderHtmlReport.ts");
  const evidenceIndexPath = path.join(repoRoot, "packages", "guard-core", "src", "generateEvidenceIndex.ts");

  const validPack = loadJson(validPackPath);
  const validPackText = JSON.stringify(validPack);

  const invalidJsonResult = parseEvidencePack("{");
  expectErrorCode(invalidJsonResult, "INVALID_JSON", "invalid JSON parse");

  const invalidInputTypeResult = parseEvidencePack(42);
  expectErrorCode(invalidInputTypeResult, "INVALID_INPUT_TYPE", "invalid input type parse");

  const missingSchemaVersionPack = clone(validPack);
  delete missingSchemaVersionPack.schema_version;
  const missingSchemaVersionParse = parseEvidencePack(missingSchemaVersionPack);
  expect(missingSchemaVersionParse.ok === true, "missing schema_version object should still parse as an object.");
  const missingSchemaVersionValidation = validateEvidencePack(missingSchemaVersionPack);
  expectErrorCode(
    missingSchemaVersionValidation,
    "MISSING_REQUIRED_FIELD",
    "missing schema_version validation",
  );

  const invalidSchemaVersionPack = clone(validPack);
  invalidSchemaVersionPack.schema_version = "2.0.0";
  const invalidSchemaVersionValidation = validateEvidencePack(invalidSchemaVersionPack);
  expectErrorCode(
    invalidSchemaVersionValidation,
    "INVALID_SCHEMA_VERSION",
    "invalid schema_version validation",
  );

  const invalidPackTypePack = clone(validPack);
  invalidPackTypePack.pack_type = "unsupported_pack_type";
  const invalidPackTypeValidation = validateEvidencePack(invalidPackTypePack);
  expectErrorCode(invalidPackTypeValidation, "INVALID_PACK_TYPE", "invalid pack_type validation");

  const missingTopLevelFieldPack = clone(validPack);
  delete missingTopLevelFieldPack.workflow;
  const missingTopLevelFieldValidation = validateEvidencePack(missingTopLevelFieldPack);
  expectErrorCode(
    missingTopLevelFieldValidation,
    "MISSING_REQUIRED_FIELD",
    "missing required top-level field validation",
  );

  const invalidArrayFieldPack = clone(validPack);
  invalidArrayFieldPack.actions = "not-an-array";
  const invalidArrayFieldValidation = validateEvidencePack(invalidArrayFieldPack);
  expectAnyErrorCode(
    invalidArrayFieldValidation,
    ["INVALID_ARRAY_FIELD", "INVALID_FIELD_TYPE"],
    "invalid array field validation",
  );

  const invalidObjectFieldPack = clone(validPack);
  invalidObjectFieldPack.producer = "not-an-object";
  const invalidObjectFieldValidation = validateEvidencePack(invalidObjectFieldPack);
  expectAnyErrorCode(
    invalidObjectFieldValidation,
    ["INVALID_OBJECT_FIELD", "INVALID_FIELD_TYPE"],
    "invalid object field validation",
  );

  const emptyRiskSignalsPack = clone(validPack);
  emptyRiskSignalsPack.risk_signals = [];
  const emptyRiskSignalsValidation = validateEvidencePack(emptyRiskSignalsPack);
  expect(
    emptyRiskSignalsValidation.ok === true,
    "risk_signals: [] must remain structurally valid.",
  );

  const invalidReportResult = generateGovernanceReport(missingTopLevelFieldPack);
  expect(invalidReportResult.ok === false, "report generation must reject structurally invalid pack input.");
  expect(
    !("report" in invalidReportResult),
    "invalid report generation result must not include a report payload.",
  );
  expectErrorCode(
    invalidReportResult,
    "MISSING_REQUIRED_FIELD",
    "report generation invalid-pack rejection",
  );

  const validReportResult = generateGovernanceReport(validPackText);
  expect(validReportResult.ok === true, "valid fixture must produce a governance report.");
  const report = validReportResult.report;

  const markdown = renderMarkdownReport(report);
  expect(typeof markdown === "string" && markdown.trim().length > 0, "Markdown renderer must return a non-empty string.");
  expect(markdown.includes("# Governance Report:"), "Markdown output must include the report heading.");
  expect(markdown.includes("## Verdict"), "Markdown output must include the Verdict section.");
  expect(markdown.includes("## Evidence References"), "Markdown output must include the Evidence References section.");

  const markdownRendererSource = readSource(markdownRendererPath);
  expectSourceExcludes(
    markdownRendererSource,
    ["parseEvidencePack", "validateEvidencePack", "inspectEvidenceCoverage", "generateGovernanceReport"],
    "Markdown renderer source",
  );

  const html = renderHtmlReport(report);
  expect(typeof html === "string" && html.trim().length > 0, "HTML renderer must return a non-empty string.");
  expect(html.includes("<!doctype html>"), "HTML output must include a doctype.");
  expect(html.includes("<section><h2>Verdict</h2>"), "HTML output must include the Verdict section.");
  expect(html.includes("Evidence References"), "HTML output must include the Evidence References section.");
  expect(!html.includes("http://"), "HTML output must stay local-first and avoid http:// references.");
  expect(!html.includes("https://"), "HTML output must stay local-first and avoid https:// references.");
  expect(!/cdn/i.test(html), "HTML output must stay local-first and avoid CDN references.");

  const htmlRendererSource = readSource(htmlRendererPath);
  expectSourceExcludes(
    htmlRendererSource,
    ["parseEvidencePack", "validateEvidencePack", "inspectEvidenceCoverage", "generateGovernanceReport"],
    "HTML renderer source",
  );

  const escapedReport = clone(report);
  escapedReport.workflow_summary.workflow_name = '<script>alert("x")</script>';
  const escapedHtml = renderHtmlReport(escapedReport);
  expect(
    !escapedHtml.includes('<script>alert("x")</script>'),
    "HTML renderer must not emit raw script tags from report content.",
  );
  expect(
    escapedHtml.includes("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"),
    "HTML renderer must escape HTML-sensitive report content.",
  );

  const reportWithUnresolvablePaths = clone(report);
  reportWithUnresolvablePaths.evidence_refs = reportWithUnresolvablePaths.evidence_refs.map((reference, index) => ({
    ...reference,
    path: reference.path === null ? null : `Z:/nonexistent/outcome-foundation/${index}/${path.basename(reference.path)}`,
  }));
  const evidenceIndex = generateEvidenceIndex(reportWithUnresolvablePaths);
  expect(typeof JSON.stringify(evidenceIndex) === "string", "Evidence index must be JSON-serializable.");
  expect(typeof evidenceIndex === "object" && evidenceIndex !== null, "Evidence index must be an object.");
  expect(evidenceIndex.index_schema_version === "1.0.0", "Evidence index schema version mismatch.");
  expect(evidenceIndex.report_id === report.report_id, "Evidence index report_id mismatch.");
  expect(evidenceIndex.source_pack_id === report.source_pack_id, "Evidence index source_pack_id mismatch.");
  expect(Array.isArray(evidenceIndex.entries), "Evidence index entries must be an array.");
  expect(evidenceIndex.entries.length > 0, "Evidence index entries must not be empty for the valid fixture.");

  const evidenceIndexSource = readSource(evidenceIndexPath);
  expectSourceExcludes(
    evidenceIndexSource,
    ["node:fs", "readFile", "readFileSync", "existsSync", "node:path", "fileURLToPath"],
    "Evidence index source",
  );

  console.log("PASS: outcome foundation negative contract verification passed.");
}

await main();
