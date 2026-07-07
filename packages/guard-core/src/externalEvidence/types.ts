/**
 * External Evidence Framework v0.1 type-only contracts.
 *
 * These types describe verification-oriented review artifacts.
 * They do not define runtime approval, blocking, execution,
 * certification, deployment control, or policy authority.
 */

export type EvidenceSourceType =
  | "runtime_receipt"
  | "evidence_pack"
  | "ci_cd_evidence"
  | "agent_action_evidence"
  | "policy_decision_artifact"
  | "external_verifier_output"
  | "runtime_provenance_record"
  | "unknown";

export interface AdapterIdentity {
  adapter_name: string;
  adapter_version: string;
  source_type: EvidenceSourceType;
}

export type ParseStatus = "parsed" | "parse_error";

export type ContractValidationStatus =
  | "contract_parseable"
  | "contract_not_parseable"
  | "contract_partially_parseable";

export type VerificationStatus =
  | "verified"
  | "not_verified"
  | "partially_verified"
  | "verification_not_performed"
  | "verification_error";

export type CompletenessStatus =
  | "complete"
  | "incomplete"
  | "partial"
  | "redacted"
  | "confidential_labeled"
  | "unknown";

export type AdapterDiagnosticStage =
  | "parse"
  | "validate"
  | "verify"
  | "normalize"
  | "emit_findings";

export type DiagnosticSeverity =
  | "info"
  | "low"
  | "medium"
  | "high"
  | "critical";

/**
 * Diagnostics are review artifacts that preserve what the adapter observed
 * while parsing, validating, verifying, normalizing, or emitting findings.
 * They are not approval, blocking, or deployment decisions.
 *
 * Severity indicates reviewer attention level only.
 * It is not a runtime gate or enforcement signal.
 */
export interface AdapterDiagnostic {
  diagnostic_id: string;
  stage: AdapterDiagnosticStage;
  code: string;
  field?: string;
  message: string;
  evidence_ref?: string;
  severity?: DiagnosticSeverity;
}

export interface AdapterLimitations {
  raw_payload_available?: boolean;
  issuer_key_available?: boolean;
  unsupported_algorithm?: boolean;
  unsupported_receipt_version?: boolean;
  redacted_evidence?: boolean;
  confidential_evidence?: boolean;
  limitations: string[];
}

export interface ParsedExternalEvidence {
  raw: unknown;
  receipt_id?: string;
  issuer?: string;
  subject?: string;
  evidence_timestamp?: string;
  payload_hash?: string;
  hash_algorithm?: string;
  signature?: string;
  signature_algorithm?: string;
  public_key_ref?: string;
  policy_ref?: string;
  evidence_refs?: string[];
  receipt_version?: string;
  source_system?: string;
}

export interface ParseResult {
  status: ParseStatus;
  parsed?: ParsedExternalEvidence;
  diagnostics: AdapterDiagnostic[];
  limitations?: AdapterLimitations;
}

export interface ContractValidationResult {
  status: ContractValidationStatus;
  required_fields_present: boolean;
  missing_required_fields: string[];
  diagnostics: AdapterDiagnostic[];
  limitations?: AdapterLimitations;
}

export type PayloadHashStatus =
  | "match"
  | "mismatch"
  | "unavailable"
  | "not_checked"
  | "unsupported_algorithm";

export type SignatureStatus =
  | "valid"
  | "invalid"
  | "missing"
  | "unsupported_algorithm"
  | "key_unavailable"
  | "not_checked";

export type TimestampStatus =
  | "valid"
  | "missing"
  | "stale"
  | "malformed"
  | "not_checked";

export interface IntegrityVerificationResult {
  payload_hash?: string;
  hash_algorithm?: string;
  raw_payload_available?: boolean;
  payload_hash_status: PayloadHashStatus;
}

export interface SignatureVerificationResult {
  signature_present?: boolean;
  signature_algorithm?: string;
  signature_status: SignatureStatus;
  public_key_ref?: string;
  issuer_key_available?: boolean;
}

export interface TimestampVerificationResult {
  evidence_timestamp?: string;
  timestamp_status: TimestampStatus;
  freshness_window?: unknown;
  observed_at?: string;
}

export interface VerificationResult {
  status: VerificationStatus;
  integrity?: IntegrityVerificationResult;
  signature?: SignatureVerificationResult;
  timestamp?: TimestampVerificationResult;
  diagnostics: AdapterDiagnostic[];
  limitations?: AdapterLimitations;
}

export type FindingSeverity =
  | "info"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type FindingCategory =
  | "identity"
  | "integrity"
  | "signature"
  | "timestamp"
  | "policy_reference"
  | "evidence_completeness"
  | "adapter"
  | "compatibility"
  | "review";

/**
 * Findings are evidence-interpretation artifacts.
 * They are not runtime decisions.
 */
export interface VerificationFinding {
  finding_id: string;
  finding_type: string;
  category: FindingCategory;
  severity: FindingSeverity;
  field?: string;
  message: string;
  evidence_ref?: string;
  recommendation?: string;
  verification_stage?: AdapterDiagnosticStage;
  source_adapter?: string;
}

/**
 * AdapterContext supplies explicit review-oriented dependencies only.
 * It does not provide runtime execution authority, approval authority,
 * deployment control, or policy mutation authority.
 *
 * `policy_reference_resolver` may be used for visibility and review context
 * only. It is not a policy authority surface.
 */
export interface AdapterContext {
  adapter_run_id: string;
  observed_at: string;
  raw_payload_lookup?: unknown;
  issuer_key_lookup?: unknown;
  freshness_window?: unknown;
  policy_reference_resolver?: unknown;
  redaction_mode?: "preserve" | "label_only";
  review_mode?: "standard" | "strict";
}

export type TrustStatus = "known" | "unknown" | "not_checked";

/**
 * Stable normalized record target for type-only Phase 2 work.
 *
 * `adapter.limitations` is the stable carrying location for merged adapter
 * limitations. Individual result types may carry limitations transiently,
 * but normalization should preserve them here.
 *
 * `diagnostics` preserves parse / validate / verify diagnostics on the record
 * so they are not lost before or after finding emission.
 */
export interface NormalizedEvidenceRecord {
  record: {
    record_id: string;
    record_version: "0.1";
    generated_at: string;
  };
  adapter: AdapterIdentity & {
    limitations?: AdapterLimitations;
  };
  source: {
    source_system?: string;
    source_type: EvidenceSourceType;
    issuer?: string;
    issuer_key_ref?: string;
    trust_status?: TrustStatus;
  };
  receipt: {
    receipt_id?: string;
    receipt_version?: string;
    raw_receipt_ref?: string;
  };
  subject: {
    subject?: string;
    subject_type?: string;
    action_summary?: string;
  };
  verification: VerificationResult;
  contract_validation: ContractValidationResult;
  evidence: {
    evidence_refs?: string[];
    raw_payload_ref?: string;
    external_report_uri?: string;
    completeness_status?: CompletenessStatus;
  };
  diagnostics: AdapterDiagnostic[];
  findings: VerificationFinding[];
}

export interface EvidenceSourceAdapter {
  identity: AdapterIdentity;

  parse(input: unknown, context?: AdapterContext): ParseResult;

  validate(
    parsed: ParsedExternalEvidence,
    context?: AdapterContext
  ): ContractValidationResult;

  verify(
    parsed: ParsedExternalEvidence,
    validation: ContractValidationResult,
    context?: AdapterContext
  ): VerificationResult;

  normalize(
    parsed: ParsedExternalEvidence,
    validation: ContractValidationResult,
    verification: VerificationResult,
    context?: AdapterContext
  ): NormalizedEvidenceRecord;

  emitFindings(
    record: NormalizedEvidenceRecord,
    diagnostics?: AdapterDiagnostic[],
    context?: AdapterContext
  ): VerificationFinding[];
}
