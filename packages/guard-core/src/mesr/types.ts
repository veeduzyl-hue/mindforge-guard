import type { GuardReasonCode } from "../reasonCodes.ts";

export const MESR_CORE_VERSION = "0.1.0" as const;

export const MESR_SUPPORT_RELATIONS = {
  SUPPORTS: "supports",
  PARTIALLY_SUPPORTS: "partially_supports",
  CONTRADICTS: "contradicts",
  DOES_NOT_SUPPORT: "does_not_support",
  INDETERMINATE: "indeterminate",
} as const;

export type MesrSupportRelation =
  (typeof MESR_SUPPORT_RELATIONS)[keyof typeof MESR_SUPPORT_RELATIONS];

export type MesrSemanticStatus = "draft" | "active" | "deprecated" | "superseded";

export interface MesrSemanticEntry {
  semantic_id: string;
  namespace: string;
  version: string;
  definition: string;
  status: MesrSemanticStatus;
  supports: readonly string[];
  does_not_support: readonly string[];
  stronger_than: readonly string[];
  weaker_than: readonly string[];
  conflicts_with: readonly string[];
  required_bindings: readonly string[];
  provenance: readonly string[];
  supersedes: readonly string[];
  deprecated_by: string | null;
}

export interface MesrValidationIssue {
  code: string;
  subject: string;
  field: string;
  detail: string;
}

export interface MesrValidationResult {
  valid: boolean;
  issues: MesrValidationIssue[];
}

export interface MesrClaimBoundary {
  boundary_id: string;
  evidence_or_state: string;
  evidence_or_state_id: string;
  does_not_support: string;
  required_additional_bindings: readonly string[];
  example: string;
  counterexample: string;
  relation: "does_not_support";
  compatible_core_version: typeof MESR_CORE_VERSION;
  provenance: readonly string[];
}

export interface MesrReasonCodeBinding {
  reason_code: GuardReasonCode;
  core_semantic_id: string;
  domain_semantic_id: string | null;
  supported_claim: string;
  explicit_non_claims: readonly string[];
  binding_status: "active";
  required: true;
}

export const MESR_TEMPORAL_BASIS_STATUSES = [
  "current",
  "stale",
  "revoked",
  "superseded",
  "unresolvable",
] as const;

export type MesrTemporalBasisStatus = (typeof MESR_TEMPORAL_BASIS_STATUSES)[number];

export interface MesrTemporalBasis {
  evidence_ref: string;
  claim_ref: string;
  subject_ref: string;
  observed_at: string | null;
  verified_at: string | null;
  valid_from: string | null;
  valid_until: string | null;
  basis_valid_at: string;
  basis_status: MesrTemporalBasisStatus;
  status_reason: string;
  revocation_ref: string | null;
  superseded_by: string | null;
  subject_binding_hash: string | null;
  evaluated_subject_hash: string | null;
  provenance_refs: readonly string[];
}

export interface MesrClaimSupportRequest {
  claim_id: string;
  semantic_ids: readonly string[];
  provided_bindings: Readonly<Record<string, unknown>>;
  required_bindings: readonly string[];
  supported_claim_parts?: readonly string[];
  required_claim_parts?: readonly string[];
  contradicted_claims?: readonly string[];
  evidence_refs?: readonly string[];
  evaluator_version?: string;
}

export interface MesrClaimSupportResult {
  claim_id: string;
  relation: MesrSupportRelation;
  semantic_ids: string[];
  claim_boundaries_applied: string[];
  explicit_non_claims: string[];
  satisfied_bindings: string[];
  missing_bindings: string[];
  evidence_refs: string[];
  rationale_code: string;
  evaluator_version: string;
}

export type MesrModuleType = "core" | "domain_pack" | "crosswalk" | "institutional_profile";

export interface MesrModuleDependency {
  module_id: string;
  version: string;
}

export interface MesrCrosswalkMapping {
  external_concept: string;
  target_semantic_id: string;
  mapping_relation: "maps_to";
  source_version: string;
  provenance: readonly string[];
  limitations: readonly string[];
}

export interface MesrSemanticOverrideAttempt {
  left: string;
  right: string;
}

export interface MesrModuleManifest {
  module_id: string;
  module_type: MesrModuleType;
  version: string;
  semantic_namespace: string;
  core_compatibility: string;
  dependencies: readonly MesrModuleDependency[];
  added_semantics: readonly MesrSemanticEntry[];
  mappings: readonly MesrCrosswalkMapping[];
  external_references: readonly string[];
  prohibited_overrides: readonly string[];
  conformance_requirements: readonly string[];
  presentation?: Readonly<Record<string, unknown>>;
  semantic_overrides?: readonly MesrSemanticOverrideAttempt[];
}

export interface MesrModuleValidationResult extends MesrValidationResult {
  module_id: string;
  status: "VALID_MODULE" | "INVALID_MODULE";
  loaded_semantic_count: number;
}

export interface MesrComposition {
  status: "VALID_COMPOSITION" | "INVALID_COMPOSITION";
  modules: readonly MesrModuleManifest[];
  semantic_entries: readonly MesrSemanticEntry[];
  mappings: readonly MesrCrosswalkMapping[];
  profiles: readonly MesrModuleManifest[];
  issues: readonly MesrValidationIssue[];
}

export interface MesrSemanticProjection {
  semantic_ids: readonly string[];
  claim_support_relations: readonly MesrClaimSupportResult[];
  claim_boundaries_applied: readonly string[];
  explicit_non_claims: readonly string[];
  semantic_provenance: readonly string[];
  subject_effect_bindings?: readonly MesrSemanticBinding[];
  reason_code_bindings?: readonly MesrReasonCodeBinding[];
  presentation?: Readonly<Record<string, unknown>>;
  external_references?: readonly string[];
}

export interface MesrSemanticBinding {
  semantic_id: string;
  binding: string;
  value: string | boolean | readonly string[] | null;
}

export interface CanonicalSemanticSnapshot {
  core_semantic_ids: string[];
  support_relations: Array<{
    claim_id: string;
    relation: MesrSupportRelation;
    semantic_ids: string[];
    satisfied_bindings: string[];
    missing_bindings: string[];
  }>;
  claim_boundaries: string[];
  binding_statuses: Array<{
    reason_code: GuardReasonCode;
    binding_status: "active";
    required: true;
  }>;
  explicit_non_claims: string[];
  subject_effect_bindings: Array<{
    semantic_id: string;
    binding: string;
    value: string | boolean | string[] | null;
  }>;
}
