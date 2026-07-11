/**
 * External Evidence Assurance Platform v0.1 type-only contracts.
 *
 * These types describe producer-neutral platform contracts for evidence
 * packages, adapter manifests, assurance profiles, verification requests,
 * verification jobs, assurance reports, and verification usage records.
 *
 * They do not define runtime execution, approval, blocking, certification,
 * deployment control, dynamic loading, persistence, or billing behavior.
 */

import type {
  AdapterIdentity,
  AdapterLimitations,
  EvidenceSourceType,
  FindingSeverity,
  NormalizedEvidenceRecord,
  VerificationFinding,
  VerificationStatus,
} from "./types";
import type {
  AdapterRegistryLifecycleStatus,
  AdapterRegistryMappingSupport,
} from "./registryTypes";

export type ExternalEvidenceMetadataValue = string | number | boolean | null;

export interface EvidenceProducerReference {
  producer_id?: string;
  producer_name?: string;
  source_type: EvidenceSourceType;
  external_reference?: string;
}

export interface EvidenceIntegrityReference {
  digest?: string;
  digest_algorithm?: string;
  integrity_ref?: string;
}

export interface EvidencePackageRecord {
  record_id: string;
  record_type: string;
  source_type: EvidenceSourceType;
  schema_version?: string;
  issued_at?: string;
  raw_evidence?: unknown;
  raw_evidence_ref?: string;
  metadata?: Record<string, ExternalEvidenceMetadataValue>;
}

export interface EvidencePackage {
  package_id: string;
  package_version: "0.1";
  producer: EvidenceProducerReference;
  evidence_records?: EvidencePackageRecord[];
  raw_evidence_refs?: string[];
  issued_at?: string;
  received_at: string;
  integrity?: EvidenceIntegrityReference;
  source_schema_version: string;
  declared_metadata?: Record<string, ExternalEvidenceMetadataValue>;
  limitations?: string[];
  ingestion_notes?: string[];
}

export interface EvidencePackageReference {
  package_id: string;
  package_version?: string;
  digest?: string;
  integrity_ref?: string;
}

export interface AdapterManifestReference {
  adapter_id: string;
  adapter_version: string;
}

export interface AssuranceProfileReference {
  profile_id: string;
  profile_version: string;
}

export interface AdapterManifest {
  adapter_id: string;
  identity: AdapterIdentity;
  lifecycle_status: AdapterRegistryLifecycleStatus;
  supported_source_schema_versions: string[];
  supported_assurance_profiles: AssuranceProfileReference[];
  declared_mapping_capability: AdapterRegistryMappingSupport;
  declared_limitations: AdapterLimitations;
}

export type AssuranceCheckType =
  | "structural_validity"
  | "required_field_completeness"
  | "payload_binding"
  | "digest_integrity"
  | "signature_validity"
  | "temporal_consistency"
  | "provenance_completeness"
  | "evidence_chain_completeness";

export interface AssuranceProfile {
  profile_id: string;
  profile_version: string;
  title: string;
  description?: string;
  declared_checks: AssuranceCheckType[];
  applicable_evidence_categories: EvidenceSourceType[];
  limitations?: string[];
  deterministic_expectations?: string[];
  execution_constraints?: string[];
}

export interface VerificationRequestHumanReviewContext {
  requested?: boolean;
  requested_by?: string;
  notes?: string[];
}

export interface VerificationRequest {
  request_id: string;
  caller_reference?: string;
  evidence_package: EvidencePackageReference;
  adapter: AdapterManifestReference;
  requested_assurance_profiles: AssuranceProfileReference[];
  requested_at: string;
  human_review_context?: VerificationRequestHumanReviewContext;
  customer_reference?: string;
  request_metadata?: Record<string, ExternalEvidenceMetadataValue>;
}

export interface VerificationRequestReference {
  request_id: string;
  caller_reference?: string;
}

export type VerificationJobStatus =
  | "pending"
  | "ready"
  | "completed"
  | "completed_with_findings"
  | "unsupported"
  | "invalid_input"
  | "verification_error";

export interface VerificationUsageRecordReference {
  usage_record_id: string;
}

export interface AssuranceReportReference {
  report_id: string;
}

export interface VerificationJob {
  verification_id: string;
  request: VerificationRequestReference;
  evidence_package: EvidencePackageReference;
  adapter: AdapterManifestReference;
  assurance_profiles: AssuranceProfileReference[];
  contract_version: "0.1";
  engine_version: string;
  status: VerificationJobStatus;
  verification_status?: VerificationStatus;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  normalized_records?: NormalizedEvidenceRecord[];
  findings?: VerificationFinding[];
  limitations?: string[];
  usage_record?: VerificationUsageRecordReference;
  assurance_report?: AssuranceReportReference;
}

export type AssuranceCheckExecutionStatus =
  | "verified"
  | "failed"
  | "not_run"
  | "unsupported"
  | "partially_verified";

export interface AssuranceCheckSummary {
  check_type: AssuranceCheckType;
  status: AssuranceCheckExecutionStatus;
  summary: string;
  evidence_refs?: string[];
}

export interface VerificationClaim {
  claim_id: string;
  claim_type: string;
  summary: string;
  evidence_refs?: string[];
}

export interface MissingEvidenceReference {
  missing_evidence_id: string;
  description: string;
  evidence_refs?: string[];
}

export interface HumanReviewRecommendation {
  recommendation_id: string;
  summary: string;
  priority?: FindingSeverity;
  evidence_refs?: string[];
}

export interface AssuranceReport {
  report_id: string;
  verification_id: string;
  evidence_package: EvidencePackageReference;
  producer: EvidenceProducerReference;
  adapter: AdapterManifestReference;
  assurance_profiles: AssuranceProfileReference[];
  executed_checks: AssuranceCheckSummary[];
  verified_claims: VerificationClaim[];
  failed_checks: AssuranceCheckSummary[];
  unresolved_findings: VerificationFinding[];
  missing_evidence: MissingEvidenceReference[];
  scope_limitations: string[];
  human_review_recommendations: HumanReviewRecommendation[];
  engine_version: string;
  report_schema_version: "0.1";
  generated_at: string;
  report_integrity?: EvidenceIntegrityReference;
  verification_summary?: string;
}

export interface VerificationUsageRecord {
  usage_record_id: string;
  verification_id: string;
  evidence_package_count: number;
  evidence_record_count: number;
  assurance_profile_count: number;
  verification_check_count: number;
  cryptographic_operation_count?: number;
  evidence_chain_depth?: number;
  report_count: number;
  retention_tier_ref?: string;
  human_review_requested?: boolean;
  recorded_at: string;
  usage_schema_version: "0.1";
}
