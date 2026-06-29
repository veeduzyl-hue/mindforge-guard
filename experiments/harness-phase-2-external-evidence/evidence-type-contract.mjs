const NON_AUTHORITY_STATEMENT =
  "This evidence type contract validation is for deterministic review only. It does not approve, block, deploy, certify, or control execution.";

export const CANONICAL_EVIDENCE_TYPES = [
  "agent_workflow_artifact",
  "blocked_action",
  "command_result",
  "external_signed_receipt",
  "policy_finding",
  "tool_call_trace",
];

export const ASSURANCE_STATUS_ENUMS = {
  cryptographic_validity: ["verified", "failed", "not_applicable", "not_provided"],
  execution_evidence: ["provided", "missing", "not_applicable", "not_provided"],
  policy_completeness: ["complete", "partial", "missing", "not_verified"],
  legal_applicability: ["verified", "not_verified", "not_applicable"],
  human_review_status: ["pending", "reviewed", "not_required"],
};

const FORBIDDEN_POSITIVE_PATTERNS = [
  /\bguard approves\b/i,
  /\bguard blocks\b/i,
  /\bguard deploys\b/i,
  /\bguard certifies\b/i,
  /\bguard controls execution\b/i,
  /\bproduction ready\b/i,
  /\bproduction integration ready\b/i,
  /\bproduction integration is enabled\b/i,
  /\bruntime enforcement enabled\b/i,
  /\benables runtime enforcement\b/i,
  /\bcontrol-plane integration\b/i,
  /\bapproval authority\b/i,
  /\bdeployment authority\b/i,
  /\bcertification authority\b/i,
];

const EXTERNAL_SIGNED_RECEIPT_CENTER_PATTERNS = [
  /\bmainline capability\b/i,
  /\bmain-path capability\b/i,
  /\bprimary adapter\b/i,
  /\bcore adapter\b/i,
  /\bproduction adapter\b/i,
  /\bruntime dependency\b/i,
  /\bcenter of phase 2\b/i,
];

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function toNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function sanitizeNegativeContexts(text) {
  return text
    .replaceAll("does not approve", "")
    .replaceAll("does not block", "")
    .replaceAll("does not deploy", "")
    .replaceAll("does not certify", "")
    .replaceAll("does not control execution", "")
    .replaceAll("not production integration", "")
    .replaceAll("not control-plane", "")
    .replaceAll("not control plane", "")
    .replaceAll("not approval authority", "")
    .replaceAll("not blocking authority", "")
    .replaceAll("not deployment authority", "")
    .replaceAll("not certification authority", "");
}

function collectClaimDetails(record) {
  return ensureArray(record.claims)
    .map((claim) => claim?.detail)
    .filter((value) => typeof value === "string" && value.trim().length > 0);
}

function normalizeSummary(record) {
  const direct = toNonEmptyString(record.summary);
  if (direct) {
    return direct;
  }
  const claimDetail = collectClaimDetails(record)[0];
  return toNonEmptyString(claimDetail);
}

function normalizeArrayField(record, preferredKey, fallbackKey) {
  const preferred = record?.[preferredKey];
  if (preferred === undefined && fallbackKey) {
    return record?.[fallbackKey];
  }
  return preferred;
}

function normalizeCodes(entries) {
  return ensureArray(entries)
    .map((entry) => {
      if (typeof entry === "string" && entry.trim().length > 0) {
        return entry.trim();
      }
      if (isPlainObject(entry)) {
        return toNonEmptyString(entry.code) ?? toNonEmptyString(entry.detail);
      }
      return null;
    })
    .filter(Boolean);
}

function deriveAssurance(record) {
  const hasAssuranceObject = isPlainObject(record.assurance);
  const source = hasAssuranceObject ? record.assurance : record;

  const normalized = {};
  const warnings = [];

  if (!hasAssuranceObject) {
    warnings.push({
      code: "assurance_shape_compatibility_mode",
      message: "Record uses compatibility assurance field paths instead of the normalized nested assurance object.",
    });
  }

  for (const [dimension, allowedValues] of Object.entries(ASSURANCE_STATUS_ENUMS)) {
    const value = toNonEmptyString(source?.[dimension]);
    if (!value) {
      normalized[dimension] = dimension === "legal_applicability" ? "not_verified" : "not_provided";
      warnings.push({
        code: `missing_${dimension}_defaulted`,
        message: `Missing ${dimension} was defaulted for compatibility validation.`,
      });
      continue;
    }
    normalized[dimension] = value;
    if (!allowedValues.includes(value)) {
      warnings.push({
        code: `invalid_${dimension}_candidate`,
        message: `Candidate value ${value} for ${dimension} is outside the canonical enum.`,
      });
    }
  }

  return { normalized, warnings, hasAssuranceObject };
}

function collectAuthorityText(record, normalizedRecord) {
  const parts = [
    normalizedRecord.summary,
    toNonEmptyString(record.non_authority_statement),
    ...collectClaimDetails(record),
    ...ensureArray(record.reviewer_questions).filter((value) => typeof value === "string"),
    ...ensureArray(normalizedRecord.reviewer_questions),
    ...ensureArray(normalizedRecord.assurance_limits),
  ].filter((value) => typeof value === "string" && value.length > 0);

  return sanitizeNegativeContexts(parts.join("\n").toLowerCase());
}

function normalizeRecord(record) {
  const id = toNonEmptyString(record.id) ?? toNonEmptyString(record.record_id);
  const type = toNonEmptyString(record.type) ?? toNonEmptyString(record.evidence_type);
  const summary = normalizeSummary(record);
  const { normalized: assurance, warnings: assuranceWarnings } = deriveAssurance(record);
  const missingEvidenceSource = normalizeArrayField(record, "missing_evidence");
  const assuranceLimitsSource = normalizeArrayField(record, "assurance_limits", "limits");
  const reviewerQuestionsSource = normalizeArrayField(record, "reviewer_questions");

  return {
    id,
    type,
    summary,
    assurance,
    missing_evidence: normalizeCodes(missingEvidenceSource),
    assurance_limits: normalizeCodes(assuranceLimitsSource),
    reviewer_questions: ensureArray(reviewerQuestionsSource).filter((value) => typeof value === "string"),
    warnings: assuranceWarnings,
  };
}

function detectForbiddenAuthorityClaims(text) {
  return FORBIDDEN_POSITIVE_PATTERNS.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

export function validateEvidenceRecordContract(record) {
  const normalized = normalizeRecord(record);
  const failures = [];
  const warnings = [...normalized.warnings];

  if (!normalized.id) {
    failures.push({
      code: "missing_record_id",
      message: "Evidence record must include a record id.",
    });
  }

  if (!normalized.type) {
    failures.push({
      code: "missing_record_type",
      message: "Evidence record must include a canonical evidence type.",
    });
  } else if (!CANONICAL_EVIDENCE_TYPES.includes(normalized.type)) {
    failures.push({
      code: "invalid_record_type",
      message: `Evidence record type ${normalized.type} is not part of the canonical evidence type set.`,
    });
  }

  if (!normalized.summary) {
    failures.push({
      code: "missing_summary",
      message: "Evidence record must include a non-empty summary or derivable claim detail.",
    });
  }

  for (const [dimension, allowedValues] of Object.entries(ASSURANCE_STATUS_ENUMS)) {
    const value = normalized.assurance[dimension];
    if (!allowedValues.includes(value)) {
      failures.push({
        code: "invalid_assurance_status",
        message: `Assurance dimension ${dimension} has invalid value ${value}.`,
      });
    }
  }

  for (const [key, value] of [
    ["missing_evidence", record.missing_evidence],
    ["assurance_limits", record.assurance_limits ?? record.limits],
    ["reviewer_questions", record.reviewer_questions],
  ]) {
    if (value !== undefined && !Array.isArray(value)) {
      failures.push({
        code: `invalid_${key}_array`,
        message: `${key} must be an array when present.`,
      });
    }
  }

  const authorityText = collectAuthorityText(record, normalized);
  const authorityMatches = detectForbiddenAuthorityClaims(authorityText);
  if (authorityMatches.length > 0) {
    failures.push({
      code: "forbidden_authority_claim",
      message: `Evidence record contains a forbidden positive authority claim (${authorityMatches.join(", ")}).`,
    });
  }

  if (
    normalized.type === "external_signed_receipt" &&
    EXTERNAL_SIGNED_RECEIPT_CENTER_PATTERNS.some((pattern) => pattern.test(authorityText))
  ) {
    failures.push({
      code: "external_signed_receipt_center_drift",
      message: "External signed receipt evidence must remain one evidence type only and not a main-path center capability.",
    });
  }

  return {
    valid: failures.length === 0,
    record_id: normalized.id ?? "unknown-record",
    record_type: normalized.type ?? "unknown-type",
    failures,
    warnings,
  };
}

function getPackRecords(pack) {
  for (const key of ["records", "evidence_records", "evidence", "items"]) {
    if (Array.isArray(pack?.[key])) {
      return pack[key];
    }
  }
  return [];
}

function buildCanonicalCoverage(records) {
  const seen = new Set(
    records
      .map((record) => toNonEmptyString(record.type) ?? toNonEmptyString(record.evidence_type))
      .filter(Boolean)
  );

  return Object.fromEntries(CANONICAL_EVIDENCE_TYPES.map((type) => [type, seen.has(type)]));
}

function collectPackAuthorityText(pack) {
  return sanitizeNegativeContexts(JSON.stringify(pack).toLowerCase());
}

export function validateEvidencePackContract(pack) {
  const records = getPackRecords(pack);
  const recordResults = records.map((record) => validateEvidenceRecordContract(record));
  const failures = [];
  const warnings = [];

  if (!Array.isArray(records) || records.length === 0) {
    failures.push({
      code: "missing_pack_records",
      message: "Evidence pack must expose records through records, evidence_records, evidence, or items.",
    });
  }

  for (const result of recordResults) {
    if (!result.valid) {
      failures.push({
        code: "invalid_record_contract",
        message: `Evidence record ${result.record_id} failed contract validation.`,
      });
    }
    for (const warning of result.warnings) {
      warnings.push({
        code: warning.code,
        message: `${result.record_id}: ${warning.message}`,
      });
    }
  }

  const packAuthorityMatches = detectForbiddenAuthorityClaims(collectPackAuthorityText(pack));
  if (packAuthorityMatches.length > 0) {
    failures.push({
      code: "forbidden_pack_authority_claim",
      message: `Evidence pack contains a forbidden positive authority claim (${packAuthorityMatches.join(", ")}).`,
    });
  }

  const canonicalTypeCoverage = buildCanonicalCoverage(records);
  const evidenceTypeCount = Object.values(canonicalTypeCoverage).filter(Boolean).length;
  if (evidenceTypeCount < CANONICAL_EVIDENCE_TYPES.length) {
    failures.push({
      code: "insufficient_evidence_type_coverage",
      message: `Evidence pack covers ${evidenceTypeCount} canonical evidence types; at least ${CANONICAL_EVIDENCE_TYPES.length} are required.`,
    });
  }

  return {
    valid: failures.length === 0,
    failures,
    warnings,
    record_results: recordResults,
    evidence_type_count: evidenceTypeCount,
    canonical_type_coverage: canonicalTypeCoverage,
  };
}

export function summarizeEvidenceContractValidation(pack) {
  const result = validateEvidencePackContract(pack);
  return {
    contract_version: "0.1",
    canonical_evidence_types: [...CANONICAL_EVIDENCE_TYPES],
    assurance_dimensions: Object.keys(ASSURANCE_STATUS_ENUMS),
    valid: result.valid,
    failures: result.failures,
    warnings: result.warnings,
    evidence_type_count: result.evidence_type_count,
    canonical_type_coverage: result.canonical_type_coverage,
    non_authority_statement: NON_AUTHORITY_STATEMENT,
  };
}
