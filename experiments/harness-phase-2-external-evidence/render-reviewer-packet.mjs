import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const NON_AUTHORITY_STATEMENT =
  "Guard provides deterministic review evidence only. It does not approve, block, deploy, certify, or control execution.";

function sectionLines(title, lines) {
  return [`## ${title}`, "", ...lines, ""];
}

function renderList(values, emptyText) {
  if (!Array.isArray(values) || values.length === 0) {
    return [`- ${emptyText}`];
  }
  return values.map((value) => `- ${value}`);
}

function renderKeyValueLines(entries) {
  return entries.map(([label, value]) => `- ${label}: ${value}`);
}

function normalizeBoolean(value) {
  return value ? "matched" : "drift_detected";
}

function getCoverageLines(contractSummary) {
  const coverage =
    contractSummary?.valid_fixture_results?.mixed_evidence_pack?.canonical_type_coverage ??
    contractSummary?.valid_fixture_results?.normalized_evidence_pack_generated?.canonical_type_coverage ??
    {};

  return Object.keys(coverage)
    .sort((left, right) => left.localeCompare(right))
    .map((type) => `- ${type}: ${coverage[type] ? "covered" : "missing"}`);
}

function getAssuranceDimensionLines(normalizedPack, contractSummary) {
  const dimensions = Array.isArray(contractSummary?.assurance_dimensions) ? contractSummary.assurance_dimensions : [];
  return dimensions.flatMap((dimension) => {
    const summary = normalizedPack?.assurance_summary?.[dimension] ?? {};
    const entries = Object.entries(summary).sort(([left], [right]) => left.localeCompare(right));
    if (entries.length === 0) {
      return [`- ${dimension}: not available`];
    }
    return [`- ${dimension}:`, ...entries.map(([label, count]) => `  - ${label}: ${count}`)];
  });
}

function getExternalSignedReceiptLines(normalizedPack) {
  const receipts = (normalizedPack?.records ?? []).filter((record) => record.type === "external_signed_receipt");
  const receiptLines = renderList(
    receipts.map((record) => `${record.id}: ${record.summary}`),
    "No external signed receipt records were normalized."
  );
  return [...receiptLines, "- external signed receipts are review evidence only", "- ramen-receipt-v5 remains one example only"];
}

export function renderReviewerPacket(inputs) {
  const normalizedPack = inputs?.normalizedPack ?? {};
  const contractSummary = inputs?.contractSummary ?? {};
  const snapshotStatus = inputs?.snapshotStatus ?? {};
  const sourceArtifacts = Array.isArray(inputs?.sourceArtifacts) ? inputs.sourceArtifacts : [];

  const lines = [
    "# Harness Phase 2 Reviewer Packet",
    "",
    ...sectionLines("Review Scope", [
      "- local preview implementation",
      "- deterministic reviewer packet only",
      "- default-off",
      "- verification-only",
      "- human-review-oriented",
      "- not production integration",
      "- not Guard runtime",
      "- not Guard CLI",
      "- not control plane",
      `- normalized evidence pack id: ${normalizedPack.evidence_pack_id ?? "unknown"}`,
      `- source pack id: ${normalizedPack.source_pack_id ?? "unknown"}`,
      `- total normalized records: ${normalizedPack?.record_counts?.total ?? 0}`,
    ]),
    ...sectionLines("Source Artifacts", renderList(sourceArtifacts, "No source artifacts were provided.")),
    ...sectionLines("Evidence Type Coverage", getCoverageLines(contractSummary)),
    ...sectionLines("Assurance Dimensions", getAssuranceDimensionLines(normalizedPack, contractSummary)),
    ...sectionLines("Missing Evidence Review", renderList(normalizedPack.missing_evidence, "No missing evidence was recorded.")),
    ...sectionLines("Assurance Limits Review", renderList(normalizedPack.assurance_limits, "No assurance limits were recorded.")),
    ...sectionLines("External Signed Receipts", getExternalSignedReceiptLines(normalizedPack)),
    ...sectionLines("Snapshot Regression Status", [
      `- normalized evidence pack snapshot: ${normalizeBoolean(snapshotStatus.normalized_pack_snapshot_matched)}`,
      `- review report snapshot: ${normalizeBoolean(snapshotStatus.review_report_snapshot_matched)}`,
      `- contract summary snapshot: ${normalizeBoolean(snapshotStatus.contract_summary_snapshot_matched)}`,
      `- snapshots checked: ${snapshotStatus.snapshots_checked ?? 0}`,
    ]),
    ...sectionLines("Reviewer Checklist", [
      "- [ ] Confirm evidence type coverage is sufficient for human review.",
      "- [ ] Confirm missing evidence has been reviewed.",
      "- [ ] Confirm assurance limits are understood.",
      "- [ ] Confirm external signed receipts are treated as review evidence only.",
      "- [ ] Confirm no runtime authority is inferred from this packet.",
    ]),
    ...sectionLines(
      "Reviewer Questions",
      renderList(normalizedPack.reviewer_questions, "No reviewer questions were recorded.")
    ),
    ...sectionLines("Non-Authority Statement", [NON_AUTHORITY_STATEMENT]),
  ];

  return `${lines.join("\n").trim()}\n`;
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const artifactsRoot = path.join(__dirname, "artifacts");
  const snapshotsRoot = path.join(__dirname, "snapshots");

  const normalizedPack = JSON.parse(
    fs.readFileSync(path.join(artifactsRoot, "normalized-evidence-pack-generated.json"), "utf8")
  );
  const contractSummary = JSON.parse(
    fs.readFileSync(path.join(artifactsRoot, "evidence-type-contract-validation-summary.json"), "utf8")
  );
  const normalizedPackSnapshot = JSON.parse(
    fs.readFileSync(path.join(snapshotsRoot, "normalized-evidence-pack.snapshot.json"), "utf8")
  );
  const reviewReport = fs.readFileSync(path.join(artifactsRoot, "review-report-generated.md"), "utf8");
  const reviewReportSnapshot = fs.readFileSync(path.join(snapshotsRoot, "review-report.snapshot.md"), "utf8");
  const contractSummarySnapshot = JSON.parse(
    fs.readFileSync(path.join(snapshotsRoot, "evidence-type-contract-validation-summary.snapshot.json"), "utf8")
  );

  const packet = renderReviewerPacket({
    normalizedPack,
    reviewReport,
    contractSummary,
    sourceArtifacts: [
      "experiments/harness-phase-2-external-evidence/artifacts/normalized-evidence-pack-generated.json",
      "experiments/harness-phase-2-external-evidence/artifacts/review-report-generated.md",
      "experiments/harness-phase-2-external-evidence/artifacts/evidence-type-contract-validation-summary.json",
      "experiments/harness-phase-2-external-evidence/snapshots/normalized-evidence-pack.snapshot.json",
      "experiments/harness-phase-2-external-evidence/snapshots/review-report.snapshot.md",
      "experiments/harness-phase-2-external-evidence/snapshots/evidence-type-contract-validation-summary.snapshot.json",
    ],
    snapshotStatus: {
      snapshots_checked: 3,
      normalized_pack_snapshot_matched:
        JSON.stringify(normalizedPack) === JSON.stringify(normalizedPackSnapshot),
      review_report_snapshot_matched: reviewReport.replace(/\r\n/g, "\n").trimEnd() ===
        reviewReportSnapshot.replace(/\r\n/g, "\n").trimEnd(),
      contract_summary_snapshot_matched:
        JSON.stringify(contractSummary) === JSON.stringify(contractSummarySnapshot),
    },
  });

  const outputPath = path.join(artifactsRoot, "reviewer-packet-generated.md");
  fs.writeFileSync(outputPath, packet, "utf8");
  console.log(outputPath);
}

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}
