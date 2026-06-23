import type {
  BlockedActionSummaryItem,
  EvidenceReference,
  GovernanceReportModel,
  HumanReviewRequirement,
  MissingEvidenceItem,
  NextAction,
} from "./reportModel.ts";

export const EVIDENCE_INDEX_SCHEMA_VERSION = "1.0.0" as const;

export interface EvidenceIndex {
  index_schema_version: typeof EVIDENCE_INDEX_SCHEMA_VERSION;
  report_id: string;
  source_pack_id: string;
  generated_at: string;
  entries: EvidenceIndexEntry[];
}

export interface EvidenceIndexEntry {
  entry_id: string;
  ref_id?: string;
  source?: string;
  path?: string;
  artifact_id?: string;
  action_id?: string;
  tool_call_id?: string;
  verification_id?: string;
  blocked_action_id?: string;
  reason_codes: string[];
  used_by: string[];
  description?: string;
}

type MutableEvidenceIndexEntry = EvidenceIndexEntry & {
  reason_codes: string[];
  used_by: string[];
};

function addUnique(values: string[], value: string | null | undefined): void {
  if (!value) {
    return;
  }

  if (!values.includes(value)) {
    values.push(value);
  }
}

function createEntryFromReference(reference: EvidenceReference): MutableEvidenceIndexEntry {
  return {
    entry_id: `entry:${reference.ref_id}`,
    ref_id: reference.ref_id,
    source: reference.source,
    path: reference.path ?? undefined,
    artifact_id: reference.artifact_id ?? undefined,
    action_id: reference.action_id ?? undefined,
    tool_call_id: reference.tool_call_id ?? undefined,
    verification_id: reference.verification_id ?? undefined,
    blocked_action_id: reference.blocked_action_id ?? undefined,
    reason_codes: [],
    used_by: ["evidence_refs"],
    description: reference.description ?? undefined,
  };
}

function ensureDerivedEntry(
  entries: MutableEvidenceIndexEntry[],
  entryId: string,
  usedBy: string,
  description: string | undefined,
  reasonCode: string | undefined,
): void {
  const existing = entries.find((entry) => entry.entry_id === entryId);
  if (existing) {
    addUnique(existing.used_by, usedBy);
    addUnique(existing.reason_codes, reasonCode);
    if (!existing.description && description) {
      existing.description = description;
    }
    return;
  }

  entries.push({
    entry_id: entryId,
    reason_codes: reasonCode ? [reasonCode] : [],
    used_by: [usedBy],
    description,
  });
}

function linkReasonCodeToRefs(
  refIds: readonly string[],
  usedBy: string,
  reasonCode: string | undefined,
  entriesByRefId: Map<string, MutableEvidenceIndexEntry>,
  fallback: () => void,
): void {
  if (refIds.length === 0) {
    fallback();
    return;
  }

  let linked = false;
  for (const refId of refIds) {
    const entry = entriesByRefId.get(refId);
    if (!entry) {
      continue;
    }

    addUnique(entry.used_by, usedBy);
    addUnique(entry.reason_codes, reasonCode);
    linked = true;
  }

  if (!linked) {
    fallback();
  }
}

function linkMissingEvidence(
  item: MissingEvidenceItem,
  entries: MutableEvidenceIndexEntry[],
  entriesByRefId: Map<string, MutableEvidenceIndexEntry>,
): void {
  linkReasonCodeToRefs(
    item.evidence_refs,
    `missing_evidence:${item.missing_evidence_id}`,
    item.reason_code,
    entriesByRefId,
    () => ensureDerivedEntry(
      entries,
      `derived:missing_evidence:${item.missing_evidence_id}`,
      `missing_evidence:${item.missing_evidence_id}`,
      item.message,
      item.reason_code,
    ),
  );
}

function linkReviewRequirement(
  item: HumanReviewRequirement,
  entries: MutableEvidenceIndexEntry[],
  entriesByRefId: Map<string, MutableEvidenceIndexEntry>,
): void {
  linkReasonCodeToRefs(
    item.evidence_refs,
    `human_review:${item.review_id}`,
    item.reason_code,
    entriesByRefId,
    () => ensureDerivedEntry(
      entries,
      `derived:human_review:${item.review_id}`,
      `human_review:${item.review_id}`,
      item.message,
      item.reason_code,
    ),
  );
}

function linkBlockedAction(
  item: BlockedActionSummaryItem,
  entries: MutableEvidenceIndexEntry[],
  entriesByRefId: Map<string, MutableEvidenceIndexEntry>,
): void {
  linkReasonCodeToRefs(
    item.evidence_refs,
    `blocked_action:${item.blocked_action_id}`,
    item.reason_code ?? undefined,
    entriesByRefId,
    () => ensureDerivedEntry(
      entries,
      `derived:blocked_action:${item.blocked_action_id}`,
      `blocked_action:${item.blocked_action_id}`,
      item.message ?? item.attempted_action ?? undefined,
      item.reason_code ?? undefined,
    ),
  );
}

function addNextActionEntry(item: NextAction, entries: MutableEvidenceIndexEntry[]): void {
  ensureDerivedEntry(
    entries,
    `derived:next_action:${item.action_id}`,
    `next_action:${item.action_id}`,
    item.message,
    item.reason_code,
  );
}

export function generateEvidenceIndex(report: GovernanceReportModel): EvidenceIndex {
  const entries = report.evidence_refs.map(createEntryFromReference);
  const entriesByRefId = new Map(entries
    .filter((entry) => entry.ref_id)
    .map((entry) => [entry.ref_id as string, entry]));

  for (const item of report.missing_evidence) {
    linkMissingEvidence(item, entries, entriesByRefId);
  }

  for (const item of report.human_review_requirements) {
    linkReviewRequirement(item, entries, entriesByRefId);
  }

  for (const item of report.blocked_actions_summary.items) {
    linkBlockedAction(item, entries, entriesByRefId);
  }

  for (const item of report.next_actions) {
    addNextActionEntry(item, entries);
  }

  ensureDerivedEntry(
    entries,
    "derived:verdict",
    "verdict",
    report.verdict.explanation ?? undefined,
    report.verdict.reason_codes[0],
  );
  const verdictEntry = entries.find((entry) => entry.entry_id === "derived:verdict");
  if (verdictEntry) {
    for (const reasonCode of report.verdict.reason_codes) {
      addUnique(verdictEntry.reason_codes, reasonCode);
    }
  }

  ensureDerivedEntry(
    entries,
    "derived:risk_summary",
    "risk_summary",
    `Risk summary for report ${report.report_id}`,
    report.risk_summary.reason_codes[0],
  );
  const riskEntry = entries.find((entry) => entry.entry_id === "derived:risk_summary");
  if (riskEntry) {
    for (const reasonCode of report.risk_summary.reason_codes) {
      addUnique(riskEntry.reason_codes, reasonCode);
    }
  }

  return {
    index_schema_version: EVIDENCE_INDEX_SCHEMA_VERSION,
    report_id: report.report_id,
    source_pack_id: report.source_pack_id,
    generated_at: report.generated_at,
    entries,
  };
}
