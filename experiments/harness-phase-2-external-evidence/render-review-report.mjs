import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const NON_AUTHORITY_STATEMENT =
  "Guard provides deterministic review evidence only. It does not approve, block, deploy, certify, or control execution.";

function sectionLines(title, lines) {
  return [`## ${title}`, "", ...lines, ""];
}

function renderKeyValueLines(entries) {
  return entries.map(([label, value]) => `- ${label}: ${value}`);
}

function renderList(values, emptyText) {
  if (!Array.isArray(values) || values.length === 0) {
    return [`- ${emptyText}`];
  }
  return values.map((value) => `- ${value}`);
}

export function renderReviewReport(normalizedPack) {
  const byType = normalizedPack?.record_counts?.by_type ?? {};
  const total = normalizedPack?.record_counts?.total ?? 0;
  const cryptographic = normalizedPack?.assurance_summary?.cryptographic_validity ?? {};
  const execution = normalizedPack?.assurance_summary?.execution_evidence ?? {};
  const policyFindings = (normalizedPack?.records ?? []).filter((record) => record.type === "policy_finding");
  const externalSignedReceipts = (normalizedPack?.records ?? []).filter(
    (record) => record.type === "external_signed_receipt"
  );

  const lines = [
    "# Harness Phase 2 Evidence Review Report",
    "",
    ...sectionLines("Evidence Pack Summary", [
      `- normalized pack id: ${normalizedPack.evidence_pack_id}`,
      `- source pack id: ${normalizedPack.source_pack_id}`,
      `- generated at: ${normalizedPack.generated_at}`,
      `- total normalized records: ${total}`,
      "- local preview implementation",
      "- default-off",
      "- verification-only",
      "- human-review-oriented",
      "- not production integration",
      "- not Guard runtime",
      "- not Guard CLI",
      "- not control plane",
      "- external signed receipts are ingested only as review evidence",
    ]),
    ...sectionLines("Record Counts", renderKeyValueLines(Object.entries(byType))),
    ...sectionLines("Cryptographic Evidence", renderKeyValueLines(Object.entries(cryptographic))),
    ...sectionLines("Execution Evidence", renderKeyValueLines(Object.entries(execution))),
    ...sectionLines(
      "Policy Findings",
      renderList(
        policyFindings.map((record) => `${record.id}: ${record.summary}`),
        "No policy finding records were normalized."
      )
    ),
    ...sectionLines(
      "External Signed Receipts",
      [
        ...renderList(
          externalSignedReceipts.map((record) => `${record.id}: ${record.summary}`),
          "No external signed receipt records were normalized."
        ),
        "- ramen-receipt-v5 remains one example only",
      ]
    ),
    ...sectionLines("Missing Evidence", renderList(normalizedPack.missing_evidence, "No missing evidence was recorded.")),
    ...sectionLines("Assurance Limits", renderList(normalizedPack.assurance_limits, "No assurance limits were recorded.")),
    ...sectionLines(
      "Human Reviewer Questions",
      renderList(normalizedPack.reviewer_questions, "No reviewer questions were recorded.")
    ),
    ...sectionLines("Non-Authority Statement", [NON_AUTHORITY_STATEMENT]),
  ];

  return `${lines.join("\n").trim()}\n`;
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const inputPath = path.join(__dirname, "artifacts", "normalized-evidence-pack-generated.json");
  const outputPath = path.join(__dirname, "artifacts", "review-report-generated.md");

  const normalizedPack = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const report = renderReviewReport(normalizedPack);
  fs.writeFileSync(outputPath, report, "utf8");
  console.log(outputPath);
}

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}
