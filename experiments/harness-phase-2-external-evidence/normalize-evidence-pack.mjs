import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FALLBACK_GENERATED_AT = "1970-01-01T00:00:00.000Z";
const NON_AUTHORITY_STATEMENT =
  "This normalized evidence pack is for deterministic review only. It does not approve, block, deploy, certify, or control execution.";

const ASSURANCE_SHAPES = {
  cryptographic_validity: ["verified", "failed", "not_applicable", "not_provided"],
  execution_evidence: ["provided", "missing", "not_applicable", "not_provided"],
  policy_completeness: ["complete", "partial", "missing", "not_verified"],
  legal_applicability: ["verified", "not_verified", "not_applicable"],
  human_review_status: ["pending", "reviewed", "not_required"],
};

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function getSourceRecords(inputPack) {
  for (const key of ["records", "evidence_records", "evidence", "items"]) {
    if (Array.isArray(inputPack?.[key])) {
      return inputPack[key];
    }
  }
  return [];
}

function toStringValue(value, fallback) {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function getAssuranceValue(record, key) {
  const value = record?.assurance?.[key];
  return ASSURANCE_SHAPES[key].includes(value) ? value : ASSURANCE_SHAPES[key][ASSURANCE_SHAPES[key].length - 1];
}

function buildRecordSummary(record) {
  const claims = ensureArray(record.claims)
    .map((claim) => claim?.detail)
    .filter((value) => typeof value === "string" && value.length > 0);
  if (claims.length > 0) {
    return claims[0];
  }
  return `Normalized ${toStringValue(record.evidence_type, "evidence")} from ${toStringValue(record.source, "unknown-source")}.`;
}

function collectCodes(entries, fallbackPrefix) {
  return ensureArray(entries)
    .map((entry, index) => {
      if (typeof entry === "string" && entry.length > 0) {
        return entry;
      }
      if (entry && typeof entry === "object") {
        if (typeof entry.code === "string" && entry.code.length > 0) {
          return entry.code;
        }
        if (typeof entry.detail === "string" && entry.detail.length > 0) {
          return `${fallbackPrefix}_${index + 1}`;
        }
      }
      return null;
    })
    .filter(Boolean);
}

function collectQuestions(record) {
  const questions = [];
  for (const limit of ensureArray(record.limits)) {
    if (limit && typeof limit === "object" && typeof limit.detail === "string" && limit.detail.length > 0) {
      questions.push(`How should reviewers handle ${limit.detail.toLowerCase()}`);
    }
  }
  return questions;
}

function createAssuranceSummary() {
  return Object.fromEntries(
    Object.entries(ASSURANCE_SHAPES).map(([key, values]) => [
      key,
      Object.fromEntries(values.map((value) => [value, 0])),
    ])
  );
}

function sortRecords(records) {
  return [...records].sort((left, right) => {
    const leftType = toStringValue(left.type, "");
    const rightType = toStringValue(right.type, "");
    if (leftType !== rightType) {
      return leftType.localeCompare(rightType);
    }
    return toStringValue(left.id, "").localeCompare(toStringValue(right.id, ""));
  });
}

function uniqueSortedStrings(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function normalizeEvidencePack(inputPack) {
  const sourceRecords = getSourceRecords(inputPack);
  const normalizedRecords = sortRecords(
    sourceRecords.map((record, index) => ({
      id: toStringValue(record.record_id, `record-${index + 1}`),
      type: toStringValue(record.evidence_type, "unknown"),
      source: toStringValue(record.source, "unknown-source"),
      summary: buildRecordSummary(record),
      cryptographic_validity: getAssuranceValue(record, "cryptographic_validity"),
      execution_evidence: getAssuranceValue(record, "execution_evidence"),
      policy_completeness: getAssuranceValue(record, "policy_completeness"),
      legal_applicability: getAssuranceValue(record, "legal_applicability"),
      human_review_status: getAssuranceValue(record, "human_review_status"),
      missing_evidence: collectCodes(record.missing_evidence, "missing_evidence"),
      assurance_limits: collectCodes(record.limits, "assurance_limit"),
      reviewer_questions: collectQuestions(record),
    }))
  );

  const recordCounts = {
    total: normalizedRecords.length,
    by_type: {},
  };

  const assuranceSummary = createAssuranceSummary();
  const aggregatedMissingEvidence = [];
  const aggregatedAssuranceLimits = [];
  const aggregatedReviewerQuestions = [];

  for (const record of normalizedRecords) {
    recordCounts.by_type[record.type] = (recordCounts.by_type[record.type] ?? 0) + 1;
    assuranceSummary.cryptographic_validity[record.cryptographic_validity] += 1;
    assuranceSummary.execution_evidence[record.execution_evidence] += 1;
    assuranceSummary.policy_completeness[record.policy_completeness] += 1;
    assuranceSummary.legal_applicability[record.legal_applicability] += 1;
    assuranceSummary.human_review_status[record.human_review_status] += 1;

    for (const code of record.missing_evidence) {
      aggregatedMissingEvidence.push(code);
    }
    if (record.execution_evidence === "missing" || record.execution_evidence === "not_provided") {
      aggregatedMissingEvidence.push(`missing_execution_evidence_for_${record.id}`);
    }
    if (record.cryptographic_validity === "not_provided") {
      aggregatedMissingEvidence.push(`missing_cryptographic_evidence_for_${record.id}`);
    }

    for (const limit of record.assurance_limits) {
      aggregatedAssuranceLimits.push(limit);
    }
    if (record.legal_applicability === "not_verified") {
      aggregatedAssuranceLimits.push(`legal_applicability_not_verified_for_${record.id}`);
    }
    if (record.policy_completeness === "partial" || record.policy_completeness === "not_verified") {
      aggregatedAssuranceLimits.push(`policy_completeness_${record.policy_completeness}_for_${record.id}`);
    }

    for (const question of record.reviewer_questions) {
      aggregatedReviewerQuestions.push(question);
    }
    if (record.human_review_status === "pending") {
      aggregatedReviewerQuestions.push(`What reviewer follow-up is needed for ${record.id}?`);
    }
  }

  const sourcePackId = toStringValue(inputPack?.pack_id ?? inputPack?.evidence_pack_id, "unknown-source-pack");
  const generatedAt = toStringValue(
    inputPack?.generated_at ?? inputPack?.created_at ?? inputPack?.timestamp,
    FALLBACK_GENERATED_AT
  );

  return {
    normalized_pack_version: "0.1",
    evidence_pack_id: `normalized-${sourcePackId}`,
    generated_at: generatedAt,
    source_pack_id: sourcePackId,
    records: normalizedRecords,
    record_counts: {
      total: recordCounts.total,
      by_type: Object.fromEntries(
        Object.entries(recordCounts.by_type).sort(([left], [right]) => left.localeCompare(right))
      ),
    },
    assurance_summary: assuranceSummary,
    missing_evidence: uniqueSortedStrings(aggregatedMissingEvidence),
    assurance_limits: uniqueSortedStrings(aggregatedAssuranceLimits),
    reviewer_questions: uniqueSortedStrings(aggregatedReviewerQuestions),
    non_authority_statement: NON_AUTHORITY_STATEMENT,
  };
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const inputPath = path.join(__dirname, "fixtures", "mixed-evidence-pack.json");
  const outputPath = path.join(__dirname, "artifacts", "normalized-evidence-pack-generated.json");

  const inputPack = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const normalizedPack = normalizeEvidencePack(inputPack);
  fs.writeFileSync(outputPath, `${JSON.stringify(normalizedPack, null, 2)}\n`, "utf8");
  console.log(outputPath);
}

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}
