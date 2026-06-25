import {
  exportEvidenceIndexJson,
  exportHtmlReportOutput,
  exportMarkdownReportOutput,
  runStudioSample,
} from "./studioWorkflow.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function fail(message) {
  throw new Error(message);
}

function assertGeneratedOutput(name, value) {
  if (typeof value !== "string" || value.length === 0) {
    fail(`Studio workflow did not produce ${name} output.`);
  }

  return value;
}

export function createStudioGeneratedOutputPayload(outputs) {
  const markdown = assertGeneratedOutput("Markdown", outputs?.markdown);
  const html = assertGeneratedOutput("HTML", outputs?.html);
  const evidenceIndexJson = assertGeneratedOutput(
    "Evidence Index JSON",
    outputs?.evidenceIndexJson,
  );
  const slug = typeof outputs?.slug === "string" && outputs.slug.trim()
    ? outputs.slug.trim()
    : fail("Studio payload slug is required.");

  return [
    "window.setStudioGeneratedOutputs({",
    `  markdown: ${JSON.stringify(markdown)},`,
    `  html: ${JSON.stringify(html)},`,
    `  evidenceIndexJson: ${JSON.stringify(evidenceIndexJson)},`,
    `  slug: ${JSON.stringify(slug)}`,
    "});",
  ].join("\n");
}

export async function createStudioGeneratedOutputPayloadForSample(sampleName) {
  const studioResult = await runStudioSample(sampleName);
  return createStudioGeneratedOutputPayload({
    markdown: exportMarkdownReportOutput(studioResult),
    html: exportHtmlReportOutput(studioResult),
    evidenceIndexJson: exportEvidenceIndexJson(studioResult),
    slug: sampleName,
  });
}

async function main() {
  const sampleName = process.argv[2] ?? "ai-pr-low-risk-complete";
  const payload = await createStudioGeneratedOutputPayloadForSample(sampleName);
  process.stdout.write(`${payload}\n`);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedPath && invokedPath === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}
