/**
 * External Evidence Adapter Registry Entry v0.1 type-only contracts.
 *
 * These types describe documentation/review-layer registry entries.
 * They do not define a runtime registry, dynamic loading, adapter execution,
 * package export, approval authority, blocking authority, certification,
 * deployment control, trust registry, or policy authority.
 */

import type { AdapterIdentity } from "./types";

/**
 * `lifecycle_status` is documentation/review status only.
 * It is not approval status, certification status, or deployment readiness.
 */
export type AdapterRegistryLifecycleStatus =
  | "draft"
  | "spike"
  | "review_stage"
  | "reference"
  | "deprecated";

/**
 * `evidence_contract_level` is compatibility for review only.
 * It does not authorize runtime use or imply that an underlying action is approved.
 */
export type AdapterRegistryEvidenceContractLevel =
  | "contract_parseable"
  | "integrity_verifiable"
  | "review_ready"
  | "not_compatible"
  | "unknown";

/**
 * `reference_status` does not imply privilege, approval, certification,
 * or deployment readiness.
 */
export type AdapterRegistryReferenceStatus =
  | "non_privileged_reference"
  | "candidate_reference"
  | "not_reference"
  | "deprecated_reference";

export interface AdapterRegistryMappingSupport {
  external_receipt_contract?: boolean;
  normalized_evidence_record?: boolean;
  verification_findings?: boolean;
  report_language?: boolean;
}

export interface AdapterRegistryLimitation {
  limitation_id: string;
  message: string;
  evidence_ref?: string;
  review_note?: string;
}

export interface AdapterRegistryDocumentationRef {
  label: string;
  path: string;
  description?: string;
}

/**
 * Registry entries are documentation/review artifacts only.
 * They are not runtime configs, not trust registry records, or not allowlists.
 */
export interface AdapterRegistryEntry {
  adapter_id: string;
  identity: AdapterIdentity;
  lifecycle_status: AdapterRegistryLifecycleStatus;
  evidence_contract_level: AdapterRegistryEvidenceContractLevel;
  mapping_support: AdapterRegistryMappingSupport;
  limitations: AdapterRegistryLimitation[];
  reference_status: AdapterRegistryReferenceStatus;
  documentation_refs: AdapterRegistryDocumentationRef[];
  review_notes: string[];
}

/**
 * Registry indices are review snapshots only.
 * They do not create runtime authority or package consumer surfaces.
 */
export interface AdapterRegistryIndex {
  registry_version: "0.1";
  generated_for_review_at?: string;
  entries: AdapterRegistryEntry[];
}
