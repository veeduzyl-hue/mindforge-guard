import type {
  GuardReasonCategory,
  GuardReasonCode,
  GuardReasonSeverityHint,
} from "./reasonCodes.ts";

export const GOVERNANCE_REPORT_SCHEMA_VERSION = "1.0.0" as const;

export const GOVERNANCE_VERDICT_VALUES = {
  ALLOW: "allow",
  REQUIRE_REVIEW: "require_review",
  BLOCK: "block",
  INCONCLUSIVE: "inconclusive",
} as const;

export type GovernanceVerdictValue =
  (typeof GOVERNANCE_VERDICT_VALUES)[keyof typeof GOVERNANCE_VERDICT_VALUES];

export const REPORT_CONFIDENCE_VALUES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  UNKNOWN: "unknown",
} as const;

export type ReportConfidenceValue =
  (typeof REPORT_CONFIDENCE_VALUES)[keyof typeof REPORT_CONFIDENCE_VALUES];

export const REPORT_COMPLETENESS_VALUES = {
  COMPLETE: "complete",
  PARTIAL: "partial",
  INCOMPLETE: "incomplete",
  UNKNOWN: "unknown",
} as const;

export type ReportCompletenessValue =
  (typeof REPORT_COMPLETENESS_VALUES)[keyof typeof REPORT_COMPLETENESS_VALUES];

export const RISK_SEVERITY_VALUES = {
  NONE: "none",
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
  UNKNOWN: "unknown",
} as const;

export type RiskSeverityValue =
  (typeof RISK_SEVERITY_VALUES)[keyof typeof RISK_SEVERITY_VALUES];

export const REPORT_PRIORITY_VALUES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export type ReportPriorityValue =
  (typeof REPORT_PRIORITY_VALUES)[keyof typeof REPORT_PRIORITY_VALUES];

export const EVIDENCE_REFERENCE_SOURCES = {
  PACK: "pack",
  ARTIFACT: "artifact",
  ACTION: "action",
  TOOL_CALL: "tool_call",
  VERIFICATION: "verification",
  BLOCKED_ACTION: "blocked_action",
  DERIVED_SUMMARY: "derived_summary",
} as const;

export type EvidenceReferenceSource =
  (typeof EVIDENCE_REFERENCE_SOURCES)[keyof typeof EVIDENCE_REFERENCE_SOURCES];

export const MISSING_EVIDENCE_CATEGORIES = {
  AUTHORITY: "authority",
  SCOPE: "scope",
  VERIFICATION: "verification",
  ROLLBACK: "rollback",
  PROVENANCE: "provenance",
  ARTIFACT: "artifact",
  MANIFEST: "manifest",
  REVIEW: "review",
  OTHER: "other",
} as const;

export type MissingEvidenceCategory =
  (typeof MISSING_EVIDENCE_CATEGORIES)[keyof typeof MISSING_EVIDENCE_CATEGORIES];

export const HUMAN_REVIEWER_ROLES = {
  SECURITY: "security",
  OWNER: "owner",
  RELEASE: "release",
  CUSTOMER: "customer",
  OPERATOR: "operator",
  REVIEWER: "reviewer",
  OTHER: "other",
} as const;

export type HumanReviewerRole =
  (typeof HUMAN_REVIEWER_ROLES)[keyof typeof HUMAN_REVIEWER_ROLES];

export const NEXT_ACTION_TYPES = {
  COLLECT_EVIDENCE: "collect_evidence",
  REQUEST_REVIEW: "request_review",
  CLARIFY_SCOPE: "clarify_scope",
  CLARIFY_AUTHORITY: "clarify_authority",
  RERUN_VERIFICATION: "rerun_verification",
  DOCUMENT_ROLLBACK: "document_rollback",
  PROVIDE_PROVENANCE: "provide_provenance",
  UPDATE_REPORT_INPUTS: "update_report_inputs",
  OTHER: "other",
} as const;

export type NextActionType =
  (typeof NEXT_ACTION_TYPES)[keyof typeof NEXT_ACTION_TYPES];

export interface GovernanceReportModel {
  report_id: string;
  report_schema_version: typeof GOVERNANCE_REPORT_SCHEMA_VERSION;
  generated_at: string;
  source_pack_id: string;
  source_schema_version: string;
  workflow_summary: WorkflowSummary;
  verdict: GovernanceVerdictSummary;
  authority_summary: AuthoritySummary;
  scope_summary: ScopeSummary;
  evidence_coverage: EvidenceCoverageSummary;
  risk_summary: RiskSummary;
  blocked_actions_summary: BlockedActionsSummary;
  verification_summary: VerificationSummary;
  missing_evidence: MissingEvidenceItem[];
  human_review_requirements: HumanReviewRequirement[];
  next_actions: NextAction[];
  evidence_refs: EvidenceReference[];
  reason_codes: GuardReasonCode[];
  provenance: ReportProvenance;
}

export interface GovernanceVerdictSummary {
  value: GovernanceVerdictValue;
  reason_codes: GuardReasonCode[];
  explanation: string | null;
  confidence: ReportConfidenceValue;
}

export interface WorkflowSummary {
  workflow_id: string;
  workflow_name: string;
  workflow_type: string;
  pack_type: string;
  environment: string;
  repository: WorkflowRepositorySummary | null;
}

export interface WorkflowRepositorySummary {
  provider: string | null;
  repo_name: string | null;
  remote_url: string | null;
  default_branch: string | null;
  branch: string | null;
  base_ref: string | null;
  head_ref: string | null;
  commit_sha: string | null;
  pr_number: string | null;
}

export interface AuthoritySummary {
  authorization_status: string;
  requested_by: string | null;
  owner: string | null;
  reviewers: string[];
  time_window: AuthorityTimeWindowSummary | null;
  reason_codes: GuardReasonCode[];
}

export interface AuthorityTimeWindowSummary {
  start_at: string | null;
  end_at: string | null;
}

export interface ScopeSummary {
  in_scope_count: number;
  out_of_scope_count: number;
  touched_resource_count: number;
  changed_file_count: number;
  data_sensitivity: string | null;
  reason_codes: GuardReasonCode[];
}

export interface EvidenceCoverageSummary {
  completeness: ReportCompletenessValue;
  manifest_completeness: ReportCompletenessValue;
  artifact_count: number;
  action_count: number;
  tool_call_count: number;
  verification_count: number;
  blocked_action_count: number;
  missing_evidence_count: number;
  reason_codes: GuardReasonCode[];
}

export interface RiskSummary {
  max_severity: RiskSeverityValue;
  risk_count: number;
  risk_categories: GuardReasonCategory[];
  reason_codes: GuardReasonCode[];
}

export interface BlockedActionsSummary {
  count: number;
  critical_count: number;
  high_count: number;
  items: BlockedActionSummaryItem[];
  reason_codes: GuardReasonCode[];
}

export interface BlockedActionSummaryItem {
  blocked_action_id: string;
  attempted_action: string | null;
  severity: RiskSeverityValue;
  reason_code: GuardReasonCode | null;
  message: string | null;
  evidence_refs: string[];
}

export interface VerificationSummary {
  total_count: number;
  passed_count: number;
  failed_count: number;
  not_run_count: number;
  inconclusive_count: number;
  reason_codes: GuardReasonCode[];
}

export interface MissingEvidenceItem {
  missing_evidence_id: string;
  category: MissingEvidenceCategory;
  message: string;
  reason_code: GuardReasonCode;
  severity_hint: GuardReasonSeverityHint;
  evidence_refs: string[];
  recommended_fix: string | null;
}

export interface HumanReviewRequirement {
  review_id: string;
  reviewer_role: HumanReviewerRole;
  reason_code: GuardReasonCode;
  message: string;
  required: boolean;
  evidence_refs: string[];
}

export interface NextAction {
  action_id: string;
  action_type: NextActionType;
  message: string;
  reason_code: GuardReasonCode;
  owner_role: HumanReviewerRole | "developer" | "operator" | "other";
  priority: ReportPriorityValue;
}

export interface EvidenceReference {
  ref_id: string;
  source: EvidenceReferenceSource;
  path: string | null;
  artifact_id: string | null;
  action_id: string | null;
  tool_call_id: string | null;
  verification_id: string | null;
  blocked_action_id: string | null;
  description: string | null;
}

export interface ReportProvenance {
  generated_by: string;
  generator_version: string;
  deterministic: boolean;
  source_pack_hash: string;
  reason_code_version: string;
}
