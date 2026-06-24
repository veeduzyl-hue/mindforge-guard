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

function pathToFileUrl(filePath) {
  const normalized = normalizePath(path.resolve(filePath));
  return new URL(`file:///${normalized}`);
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
    validateEvidencePack: guardCore.validateEvidencePack,
  };
}

function expectSourceExcludes(source, tokens, label) {
  for (const token of tokens) {
    expect(!source.includes(token), `${label} must not include ${token}.`);
  }
}

function expectSections(output, sections, prefix, label) {
  for (const section of sections) {
    expect(
      output.includes(`${prefix}${section}`),
      `${label} must include the ${section} section.`,
    );
  }
}

function expectReportShape(report, fixtureName) {
  for (const field of [
    "report_id",
    "report_schema_version",
    "source_pack_id",
    "workflow_summary",
    "verdict",
    "evidence_coverage",
    "reason_codes",
    "provenance",
  ]) {
    expect(field in report, `${fixtureName} report must include ${field}.`);
  }

  expect(typeof report.report_id === "string" && report.report_id.length > 0, `${fixtureName} report_id must be populated.`);
  expect(typeof report.report_schema_version === "string" && report.report_schema_version.length > 0, `${fixtureName} report_schema_version must be populated.`);
  expect(typeof report.source_pack_id === "string" && report.source_pack_id.length > 0, `${fixtureName} source_pack_id must be populated.`);
  expect(typeof report.workflow_summary === "object" && report.workflow_summary !== null, `${fixtureName} workflow_summary must be an object.`);
  expect(typeof report.verdict === "object" && report.verdict !== null, `${fixtureName} verdict must be an object.`);
  expect(typeof report.evidence_coverage === "object" && report.evidence_coverage !== null, `${fixtureName} evidence_coverage must be an object.`);
  expect(Array.isArray(report.reason_codes), `${fixtureName} reason_codes must be an array.`);
  expect(typeof report.provenance === "object" && report.provenance !== null, `${fixtureName} provenance must be an object.`);
}

function verifyFixture(
  fixtureName,
  expectedVerdict,
  fixtureJson,
  fixtureText,
  modules,
  sources,
) {
  const {
    generateEvidenceIndex,
    generateGovernanceReport,
    parseEvidencePack,
    renderHtmlReport,
    renderMarkdownReport,
    validateEvidencePack,
  } = modules;

  const parsed = parseEvidencePack(fixtureText);
  expect(parsed.ok === true, `${fixtureName} must parse successfully from JSON text.`);
  expect(parsed.pack.pack_id === fixtureJson.pack_id, `${fixtureName} parse result pack_id mismatch.`);

  const validation = validateEvidencePack(parsed.pack);
  expect(validation.ok === true, `${fixtureName} must validate successfully.`);
  expect(Array.isArray(validation.warnings), `${fixtureName} validation warnings must be an array.`);

  const reportResult = generateGovernanceReport(fixtureText);
  expect(reportResult.ok === true, `${fixtureName} must generate a governance report.`);
  expect(Array.isArray(reportResult.warnings), `${fixtureName} report warnings must be an array.`);

  const report = reportResult.report;
  expectReportShape(report, fixtureName);
  expect(report.source_pack_id === fixtureJson.pack_id, `${fixtureName} report source_pack_id mismatch.`);
  expect(report.workflow_summary.workflow_name === fixtureJson.workflow.workflow_name, `${fixtureName} workflow name mismatch.`);
  expect(report.verdict.value === expectedVerdict, `${fixtureName} expected verdict ${expectedVerdict} but received ${report.verdict.value}.`);

  const markdown = renderMarkdownReport(report);
  expect(typeof markdown === "string" && markdown.trim().length > 0, `${fixtureName} Markdown output must be non-empty.`);
  expect(markdown.includes("# Governance Report:"), `${fixtureName} Markdown output must include the report heading.`);
  expectSections(
    markdown,
    [
      "Executive Summary",
      "Verdict",
      "Workflow",
      "Authority",
      "Evidence Coverage",
      "Missing Evidence",
      "Next Actions",
      "Provenance",
    ],
    "## ",
    `${fixtureName} Markdown output`,
  );

  const html = renderHtmlReport(report);
  expect(typeof html === "string" && html.trim().length > 0, `${fixtureName} HTML output must be non-empty.`);
  expect(html.includes("<!doctype html>"), `${fixtureName} HTML output must include a doctype.`);
  expectSections(
    html,
    [
      "Executive Summary",
      "Verdict",
      "Workflow",
      "Evidence Coverage",
      "Provenance",
    ],
    "<section><h2>",
    `${fixtureName} HTML output`,
  );
  expect(!html.includes("http://"), `${fixtureName} HTML output must not include http:// references.`);
  expect(!html.includes("https://"), `${fixtureName} HTML output must not include https:// references.`);
  expect(!/cdn/i.test(html), `${fixtureName} HTML output must not include CDN references.`);

  const escapedReport = clone(report);
  escapedReport.workflow_summary.workflow_name = '<script>alert("x")</script>';
  const escapedHtml = renderHtmlReport(escapedReport);
  expect(
    !escapedHtml.includes('<script>alert("x")</script>'),
    `${fixtureName} HTML renderer must not emit raw script tags from report content.`,
  );
  expect(
    escapedHtml.includes("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"),
    `${fixtureName} HTML renderer must escape HTML-sensitive text.`,
  );

  const evidenceIndex = generateEvidenceIndex(report);
  expect(typeof JSON.stringify(evidenceIndex) === "string", `${fixtureName} Evidence Index must be JSON-serializable.`);
  expect(evidenceIndex.index_schema_version === "1.0.0", `${fixtureName} Evidence Index schema version mismatch.`);
  expect(evidenceIndex.report_id === report.report_id, `${fixtureName} Evidence Index report_id mismatch.`);
  expect(evidenceIndex.source_pack_id === report.source_pack_id, `${fixtureName} Evidence Index source_pack_id mismatch.`);
  expect(Array.isArray(evidenceIndex.entries), `${fixtureName} Evidence Index entries must be an array.`);
  expect(evidenceIndex.entries.length > 0, `${fixtureName} Evidence Index entries must not be empty.`);

  expectSourceExcludes(
    sources.markdownRendererSource,
    ["parseEvidencePack", "validateEvidencePack", "inspectEvidenceCoverage", "generateGovernanceReport"],
    "Markdown renderer source",
  );
  expectSourceExcludes(
    sources.htmlRendererSource,
    ["parseEvidencePack", "validateEvidencePack", "inspectEvidenceCoverage", "generateGovernanceReport"],
    "HTML renderer source",
  );
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");
  const modules = await loadOutcomeFoundationModules(repoRoot);

  const markdownRendererPath = path.join(repoRoot, "packages", "renderer-md", "src", "renderMarkdownReport.ts");
  const htmlRendererPath = path.join(repoRoot, "packages", "renderer-html", "src", "renderHtmlReport.ts");
  const evidenceIndexPath = path.join(repoRoot, "packages", "guard-core", "src", "generateEvidenceIndex.ts");
  const sources = {
    markdownRendererSource: readSource(markdownRendererPath),
    htmlRendererSource: readSource(htmlRendererPath),
    evidenceIndexSource: readSource(evidenceIndexPath),
  };

  const fixtures = [
    {
      fixtureName: "ai-pr-low-risk-complete",
      expectedVerdict: "allow",
    },
    {
      fixtureName: "ai-pr-missing-tests",
      expectedVerdict: "require_review",
    },
    {
      fixtureName: "dependency-upgrade-breaking-change",
      expectedVerdict: "require_review",
    },
    {
      fixtureName: "release-prep-missing-rollback",
      expectedVerdict: "require_review",
    },
    {
      fixtureName: "cyber-remediation-authorized-patch",
      expectedVerdict: "require_review",
    },
  ];

  for (const fixture of fixtures) {
    const fixturePath = path.join(repoRoot, "fixtures", fixture.fixtureName, "evidence-pack.json");
    const fixtureText = readSource(fixturePath);
    const fixtureJson = loadJson(fixturePath);

    verifyFixture(
      fixture.fixtureName,
      fixture.expectedVerdict,
      fixtureJson,
      fixtureText,
      modules,
      sources,
    );
  }

  expectSourceExcludes(
    sources.evidenceIndexSource,
    ["node:fs", "readFile", "readFileSync", "existsSync", "node:path", "fileURLToPath"],
    "Evidence index source",
  );

  console.log("PASS: outcome foundation positive contract verification passed.");
}

await main();
