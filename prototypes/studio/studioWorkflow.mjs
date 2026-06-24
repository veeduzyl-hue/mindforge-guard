import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const STUDIO_SAMPLES = {
  "ai-pr-low-risk-complete": "fixtures/ai-pr-low-risk-complete/evidence-pack.json",
  "ai-pr-missing-tests": "fixtures/ai-pr-missing-tests/evidence-pack.json",
  "release-prep-missing-rollback": "fixtures/release-prep-missing-rollback/evidence-pack.json",
};

function fail(message) {
  throw new Error(message);
}

function normalizePath(value) {
  return value.replace(/\\/g, "/");
}

function pathToFileUrl(filePath) {
  const normalized = normalizePath(path.resolve(filePath));
  return new URL(`file:///${normalized}`);
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

    const transpiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.ES2022,
        target: ts.ScriptTarget.ES2022,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
      },
      fileName: sourcePath,
    });

    fs.writeFileSync(outputPath, rewriteTsSpecifiersToMjs(transpiled.outputText), "utf8");
  }
}

async function loadStudioDependencies(repoRoot) {
  const tsModulePath = path.join(repoRoot, "node_modules", "typescript", "lib", "typescript.js");
  if (!fs.existsSync(tsModulePath)) {
    fail("Local TypeScript runtime must be available for the Studio prototype workflow.");
  }

  const ts = await import(pathToFileUrl(tsModulePath).href);
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mindforge-studio-prototype-"));
  const targets = [
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

  for (const target of targets) {
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
    cleanup() {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    },
    generateEvidenceIndex: guardCore.generateEvidenceIndex,
    generateGovernanceReport: guardCore.generateGovernanceReport,
    parseEvidencePack: guardCore.parseEvidencePack,
    renderHtmlReport: rendererHtml.renderHtmlReport,
    renderMarkdownReport: rendererMd.renderMarkdownReport,
    validateEvidencePack: guardCore.validateEvidencePack,
  };
}

function buildValidationSummary(validation) {
  if (validation.ok) {
    return {
      ok: true,
      warnings: validation.warnings,
      error_count: 0,
      warning_count: validation.warnings.length,
    };
  }

  return {
    ok: false,
    errors: validation.errors,
    warnings: validation.warnings,
    error_count: validation.errors.length,
    warning_count: validation.warnings.length,
  };
}

function buildStudioResult({
  sampleName,
  relativePath,
  parseResult,
  validation,
  reportResult,
  markdown,
  html,
  evidenceIndex,
}) {
  return {
    studio_surface_version: "studio-prototype-v1",
    source: {
      mode: "sample",
      sample_name: sampleName,
      input_path: relativePath,
    },
    evidence_pack_status: {
      loaded: true,
      parse_ok: parseResult.ok,
      pack_id: parseResult.ok && typeof parseResult.pack.pack_id === "string"
        ? parseResult.pack.pack_id
        : null,
      schema_version: parseResult.ok && typeof parseResult.pack.schema_version === "string"
        ? parseResult.pack.schema_version
        : null,
      error_count: parseResult.ok ? 0 : parseResult.errors.length,
      errors: parseResult.ok ? [] : parseResult.errors,
    },
    validation_result: buildValidationSummary(validation),
    governance_report: reportResult.ok
      ? {
          ok: true,
          report_id: reportResult.report.report_id,
          verdict: reportResult.report.verdict,
          reason_codes: reportResult.report.reason_codes,
          missing_evidence: reportResult.report.missing_evidence,
          human_review_requirements: reportResult.report.human_review_requirements,
          warnings: reportResult.warnings,
        }
      : {
          ok: false,
          errors: reportResult.errors,
          warnings: reportResult.warnings,
        },
    markdown_preview: markdown,
    html_preview: html,
    evidence_index: evidenceIndex,
    export_actions: {
      markdown_ready: typeof markdown === "string",
      html_ready: typeof html === "string",
      evidence_index_ready: evidenceIndex !== null,
    },
  };
}

export async function runStudioInput(input, options = {}) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..", "..");
  const dependencies = await loadStudioDependencies(repoRoot);

  try {
    const parseResult = dependencies.parseEvidencePack(input);
    if (!parseResult.ok) {
      return buildStudioResult({
        sampleName: options.sampleName ?? null,
        relativePath: options.relativePath ?? null,
        parseResult,
        validation: { ok: false, errors: parseResult.errors, warnings: [] },
        reportResult: { ok: false, errors: parseResult.errors, warnings: [] },
        markdown: null,
        html: null,
        evidenceIndex: null,
      });
    }

    const validation = dependencies.validateEvidencePack(parseResult.pack);
    if (!validation.ok) {
      return buildStudioResult({
        sampleName: options.sampleName ?? null,
        relativePath: options.relativePath ?? null,
        parseResult,
        validation,
        reportResult: { ok: false, errors: validation.errors, warnings: validation.warnings },
        markdown: null,
        html: null,
        evidenceIndex: null,
      });
    }

    const reportResult = dependencies.generateGovernanceReport(input);
    if (!reportResult.ok) {
      return buildStudioResult({
        sampleName: options.sampleName ?? null,
        relativePath: options.relativePath ?? null,
        parseResult,
        validation,
        reportResult,
        markdown: null,
        html: null,
        evidenceIndex: null,
      });
    }

    const markdown = dependencies.renderMarkdownReport(reportResult.report);
    const html = dependencies.renderHtmlReport(reportResult.report);
    const evidenceIndex = dependencies.generateEvidenceIndex(reportResult.report);

    return buildStudioResult({
      sampleName: options.sampleName ?? null,
      relativePath: options.relativePath ?? null,
      parseResult,
      validation,
      reportResult,
      markdown,
      html,
      evidenceIndex,
    });
  } finally {
    dependencies.cleanup();
  }
}

export async function runStudioSample(sampleName) {
  const relativePath = STUDIO_SAMPLES[sampleName];
  if (!relativePath) {
    fail(`Unknown Studio sample '${sampleName}'.`);
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..", "..");
  const samplePath = path.join(repoRoot, relativePath);
  const input = fs.readFileSync(samplePath, "utf8");

  return runStudioInput(input, { sampleName, relativePath });
}

async function main() {
  const sampleName = process.argv[2] ?? "ai-pr-low-risk-complete";
  const result = await runStudioSample(sampleName);
  console.log(JSON.stringify(result, null, 2));
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedPath && invokedPath === fileURLToPath(import.meta.url)) {
  await main();
}
