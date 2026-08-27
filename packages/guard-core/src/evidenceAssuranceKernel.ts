import crypto from "node:crypto";

import type { EvidencePackV1 } from "./parseEvidencePack.ts";
import { inspectEvidenceCoverage } from "./inspectEvidenceCoverage.ts";
import type { NormalizedEvidenceRecord } from "./externalEvidence/types.ts";
import type {
  AssuranceCheckSummary,
  AssuranceReport,
} from "./externalEvidence/verificationTypes.ts";

export const EVIDENCE_ASSURANCE_KERNEL_VERSION = "0.1.0-poc" as const;
export const PRODUCTION_EVIDENCE_READINESS_PROFILE_ID =
  "production_evidence_readiness" as const;
export const PRODUCTION_EVIDENCE_READINESS_PROFILE_VERSION = "0.1" as const;

export const EVIDENCE_APPLICABILITY_VALUES = {
  REQUIRED: "required",
  CONDITIONALLY_REQUIRED: "conditionally_required",
  OPTIONAL: "optional",
  NOT_APPLICABLE: "not_applicable",
} as const;

export type EvidenceApplicabilityValue =
  (typeof EVIDENCE_APPLICABILITY_VALUES)[keyof typeof EVIDENCE_APPLICABILITY_VALUES];

export const VERIFICATION_REQUIREMENT_VALUES = {
  NONE: "none",
  DECLARATION_ALLOWED: "declaration_allowed",
  VERIFICATION_RECOMMENDED: "verification_recommended",
  INDEPENDENT_VERIFICATION_REQUIRED: "independent_verification_required",
} as const;

export type VerificationRequirementValue =
  (typeof VERIFICATION_REQUIREMENT_VALUES)[keyof typeof VERIFICATION_REQUIREMENT_VALUES];

export const KERNEL_FINDING_STATUS_VALUES = {
  SUPPORTED: "supported",
  UNSUPPORTED: "unsupported",
  CONTRADICTED: "contradicted",
  INSUFFICIENT_EVIDENCE: "insufficient_evidence",
  INADMISSIBLE: "inadmissible",
} as const;

export type KernelFindingStatusValue =
  (typeof KERNEL_FINDING_STATUS_VALUES)[keyof typeof KERNEL_FINDING_STATUS_VALUES];

export const PROFILE_ADMISSIBILITY_VALUES = {
  ADMISSIBLE: "admissible",
  INADMISSIBLE: "inadmissible",
  NOT_APPLICABLE: "not_applicable",
} as const;

export type ProfileAdmissibilityValue =
  (typeof PROFILE_ADMISSIBILITY_VALUES)[keyof typeof PROFILE_ADMISSIBILITY_VALUES];

export const ORIGIN_POSTURE_VALUES = {
  DECLARED: "declared",
  PRODUCER_EMITTED: "producer_emitted",
  EXTERNALLY_EMITTED: "externally_emitted",
} as const;

export type OriginPostureValue =
  (typeof ORIGIN_POSTURE_VALUES)[keyof typeof ORIGIN_POSTURE_VALUES];

export const VERIFICATION_POSTURE_VALUES = {
  NOT_VERIFIED: "not_verified",
  PARTIALLY_VERIFIED: "partially_verified",
  VERIFIED: "verified",
} as const;

export type VerificationPostureValue =
  (typeof VERIFICATION_POSTURE_VALUES)[keyof typeof VERIFICATION_POSTURE_VALUES];

export const INTEGRITY_POSTURE_VALUES = {
  NOT_CHECKED: "not_checked",
  BOUND: "bound",
  MISMATCH: "mismatch",
  UNAVAILABLE: "unavailable",
} as const;

export type IntegrityPostureValue =
  (typeof INTEGRITY_POSTURE_VALUES)[keyof typeof INTEGRITY_POSTURE_VALUES];

export const CORROBORATION_POSTURE_VALUES = {
  SINGLE_SOURCE: "single_source",
  CROSS_SOURCE: "cross_source",
  NOT_APPLICABLE: "not_applicable",
} as const;

export type CorroborationPostureValue =
  (typeof CORROBORATION_POSTURE_VALUES)[keyof typeof CORROBORATION_POSTURE_VALUES];

export const INDEPENDENCE_POSTURE_VALUES = {
  DECLARED_ONLY: "declared_only",
  SAME_PRODUCER_VERIFICATION: "same_producer_verification",
  VERIFIER_IDENTITY_MISSING: "verifier_identity_missing",
  INDEPENDENTLY_VERIFIED: "independently_verified",
  CROSS_SOURCE_CORROBORATED: "cross_source_corroborated",
  NOT_APPLICABLE: "not_applicable",
} as const;

export type IndependencePostureValue =
  (typeof INDEPENDENCE_POSTURE_VALUES)[keyof typeof INDEPENDENCE_POSTURE_VALUES];

export interface ProductionEvidenceReadinessReviewScope {
  third_party_responsibility_material?: boolean;
  runtime_behavior_in_scope?: boolean;
  material_production_change?: boolean;
  model_change_material?: boolean;
  security_sensitive?: boolean;
  tools_in_scope?: boolean;
  release_review?: boolean;
  outcome_verification_expected?: boolean;
}

export interface EvidenceAssuranceKernelInput {
  pack: EvidencePackV1;
  normalized_records?: NormalizedEvidenceRecord[];
  external_assurance_reports?: AssuranceReport[];
  review_scope?: ProductionEvidenceReadinessReviewScope;
}

export interface EvidenceAssuranceSubject {
  subject_id: string;
  subject_type: string;
  workflow_id: string | null;
  workflow_name: string | null;
}

export interface EvidenceAssuranceProfileReference {
  profile_id: typeof PRODUCTION_EVIDENCE_READINESS_PROFILE_ID;
  profile_version: typeof PRODUCTION_EVIDENCE_READINESS_PROFILE_VERSION;
  purpose: string;
}

export interface EvidenceAssuranceSource {
  source_id: string;
  source_type: string;
  producer_id: string | null;
  producer_name: string | null;
  raw_trace_refs: string[];
}

export interface EvidenceAssuranceClaim {
  claim_id: string;
  claim_type: string;
  summary: string;
  source_id: string;
  evidence_refs: string[];
}

export interface EvidenceAssuranceObservation {
  observation_id: string;
  observation_type: string;
  summary: string;
  source_id: string;
  evidence_refs: string[];
}

export interface EvidenceAssuranceVerifier {
  verifier_id: string;
  verifier_name: string;
  verification_method: string;
  verification_scope: string;
  verification_limitations: string[];
}

export interface EvidenceAssuranceVerification {
  verification_id: string;
  source_id: string;
  status: VerificationPostureValue;
  verifier: EvidenceAssuranceVerifier;
  evidence_refs: string[];
}

export interface EvidenceAssuranceEvidenceItem {
  evidence_item_id: string;
  family_id: string;
  summary: string;
  source_id: string;
  claim_ids: string[];
  observation_ids: string[];
  verification_ids: string[];
  evidence_refs: string[];
  origin_posture: OriginPostureValue;
  verification_posture: VerificationPostureValue;
  integrity_posture: IntegrityPostureValue;
  corroboration_posture: CorroborationPostureValue;
  profile_admissibility: ProfileAdmissibilityValue;
  independence_posture: IndependencePostureValue;
}

export interface EvidenceFamilyRequirement {
  family_id: string;
  title: string;
  applicability: EvidenceApplicabilityValue;
  verification_requirement: VerificationRequirementValue;
  applicability_basis: string;
  required_for_conclusions: string[];
}

export interface EvidenceAssuranceSupportability {
  conclusion_id: string;
  summary: string;
  supportability: KernelFindingStatusValue;
  profile_admissibility: ProfileAdmissibilityValue;
  evidence_refs: string[];
  contradiction_ids: string[];
  missing_evidence_ids: string[];
  residual_uncertainty_ids: string[];
  rationale: string;
}

export interface EvidenceAssuranceMissingEvidence {
  missing_evidence_id: string;
  kind: "structural_missing_evidence" | "conclusion_specific_missing_evidence";
  family_id: string;
  conclusion_id: string | null;
  summary: string;
  evidence_refs: string[];
}

export interface EvidenceAssuranceContradiction {
  contradiction_id: string;
  family_id: string;
  summary: string;
  left_summary: string;
  right_summary: string;
  evidence_refs: string[];
}

export interface EvidenceAssuranceResidualUncertainty {
  uncertainty_id: string;
  family_id: string;
  summary: string;
  evidence_refs: string[];
}

export interface EvidenceAssuranceHumanReviewItem {
  review_item_id: string;
  priority: "low" | "medium" | "high";
  summary: string;
  evidence_refs: string[];
}

export interface EvidenceAssuranceDeterminismMetadata {
  deterministic: true;
  canonicalization_version: "stable-json-v1";
  input_hash: string;
}

export interface EvidenceAssuranceVersionMetadata {
  kernel_version: typeof EVIDENCE_ASSURANCE_KERNEL_VERSION;
  profile_version: typeof PRODUCTION_EVIDENCE_READINESS_PROFILE_VERSION;
  verifier_versions: string[];
}

export interface EvidenceAssuranceResult {
  subject: EvidenceAssuranceSubject;
  profile: EvidenceAssuranceProfileReference;
  review_scope: Required<ProductionEvidenceReadinessReviewScope>;
  sources: EvidenceAssuranceSource[];
  claims: EvidenceAssuranceClaim[];
  observations: EvidenceAssuranceObservation[];
  evidence_items: EvidenceAssuranceEvidenceItem[];
  verifications: EvidenceAssuranceVerification[];
  family_requirements: EvidenceFamilyRequirement[];
  supportability: EvidenceAssuranceSupportability[];
  contradictions: EvidenceAssuranceContradiction[];
  structural_missing_evidence: EvidenceAssuranceMissingEvidence[];
  conclusion_specific_missing_evidence: EvidenceAssuranceMissingEvidence[];
  residual_uncertainty: EvidenceAssuranceResidualUncertainty[];
  human_review_items: EvidenceAssuranceHumanReviewItem[];
  provenance: {
    source_pack_id: string;
    source_pack_hash: string | null;
    evidence_refs: string[];
  };
  integrity: {
    result_hash: string;
  };
  determinism_metadata: EvidenceAssuranceDeterminismMetadata;
  version_metadata: EvidenceAssuranceVersionMetadata;
}

export interface LocalGovernanceMappingPreview {
  mapping_id: string;
  default_off: true;
  public_contract_changed: false;
  governance_reasoning_inputs: {
    reason_codes: string[];
    missing_evidence: {
      category: string;
      message: string;
      evidence_refs: string[];
    }[];
    human_review_requirements: {
      summary: string;
      evidence_refs: string[];
    }[];
    decision_notes: string[];
  };
}

export interface ProductionEvidenceReadinessReviewPreview {
  review_subject: EvidenceAssuranceSubject;
  review_scope: Required<ProductionEvidenceReadinessReviewScope>;
  profile: EvidenceAssuranceProfileReference;
  evidence_inventory: {
    evidence_item_id: string;
    family_id: string;
    summary: string;
    source_id: string;
    evidence_refs: string[];
  }[];
  source_map: EvidenceAssuranceSource[];
  verification_posture: EvidenceAssuranceVerification[];
  supportability: EvidenceAssuranceSupportability[];
  missing_evidence: EvidenceAssuranceMissingEvidence[];
  contradictions: EvidenceAssuranceContradiction[];
  residual_uncertainty: EvidenceAssuranceResidualUncertainty[];
  human_review_items: EvidenceAssuranceHumanReviewItem[];
  provenance: EvidenceAssuranceResult["provenance"];
  integrity: EvidenceAssuranceResult["integrity"];
}

type UnknownRecord = Record<string, unknown>;

interface FamilyEvaluation {
  family_id: string;
  supported: boolean;
  contradictory: boolean;
  rationale: string;
  evidence_refs: string[];
  structural_missing_summary: string | null;
  conclusion_missing_summary: string | null;
  residual_uncertainty: string[];
  profile_admissibility: ProfileAdmissibilityValue;
}

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function sortStrings(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value as UnknownRecord)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function hashValue(value: unknown): string {
  return `sha256:${crypto.createHash("sha256").update(stableSerialize(value)).digest("hex")}`;
}

function pickStringList(values: unknown[]): string[] {
  return sortStrings(
    values.filter((value): value is string => typeof value === "string" && value.length > 0),
  );
}

function hasVerificationStatus(
  verificationItems: UnknownRecord[],
  verificationType: string,
  statuses: string[],
): boolean {
  return verificationItems.some(
    (item) =>
      item.verification_type === verificationType &&
      typeof item.status === "string" &&
      statuses.includes(item.status),
  );
}

function hasVerificationType(verificationItems: UnknownRecord[], verificationType: string): boolean {
  return verificationItems.some((item) => item.verification_type === verificationType);
}

function collectVerificationRefs(
  verificationItems: UnknownRecord[],
  verificationTypes: string[],
): string[] {
  return sortStrings(
    verificationItems
      .filter((item) =>
        typeof item.verification_type === "string" &&
        verificationTypes.includes(item.verification_type),
      )
      .flatMap((item) => {
        const refs = pickStringList(asArray(item.artifact_refs));
        const verificationId = asString(item.verification_id);
        return verificationId ? [verificationId, ...refs] : refs;
      }),
  );
}

function normalizeReviewScope(
  pack: EvidencePackV1,
  reviewScope: ProductionEvidenceReadinessReviewScope | undefined,
): Required<ProductionEvidenceReadinessReviewScope> {
  const workflow = asRecord(pack.workflow);
  const runtime = asRecord(pack.runtime);
  const scope = asRecord(pack.scope);
  const workflowType = asString(workflow.workflow_type) ?? "generic";
  const environment = asString(workflow.environment) ?? "unknown";
  const dataSensitivity = asString(scope.data_sensitivity) ?? "unknown";
  const tools = asArray(runtime.tools);

  return {
    third_party_responsibility_material:
      reviewScope?.third_party_responsibility_material ?? false,
    runtime_behavior_in_scope:
      reviewScope?.runtime_behavior_in_scope ??
      ["staging", "pilot", "production"].includes(environment),
    material_production_change:
      reviewScope?.material_production_change ??
      (workflowType === "release" || environment === "production"),
    model_change_material:
      reviewScope?.model_change_material ??
      (Boolean(asRecord(runtime.model).model_name) &&
        ["staging", "pilot", "production"].includes(environment)),
    security_sensitive:
      reviewScope?.security_sensitive ??
      (pack.pack_type === "cyber_remediation" ||
        workflowType === "security_patch" ||
        ["high", "critical"].includes(dataSensitivity)),
    tools_in_scope:
      reviewScope?.tools_in_scope ??
      (tools.length > 0 || asArray(pack.tool_calls).length > 0),
    release_review:
      reviewScope?.release_review ?? (workflowType === "release"),
    outcome_verification_expected:
      reviewScope?.outcome_verification_expected ?? false,
  };
}

export function buildProductionEvidenceReadinessProfileV1(
  pack: EvidencePackV1,
  reviewScope?: ProductionEvidenceReadinessReviewScope,
): {
  profile: EvidenceAssuranceProfileReference;
  review_scope: Required<ProductionEvidenceReadinessReviewScope>;
  family_requirements: EvidenceFamilyRequirement[];
} {
  const normalizedScope = normalizeReviewScope(pack, reviewScope);
  const familyRequirements: EvidenceFamilyRequirement[] = [
    {
      family_id: "identity_actor",
      title: "Identity / actor",
      applicability: normalizedScope.third_party_responsibility_material
        ? EVIDENCE_APPLICABILITY_VALUES.CONDITIONALLY_REQUIRED
        : EVIDENCE_APPLICABILITY_VALUES.OPTIONAL,
      verification_requirement:
        VERIFICATION_REQUIREMENT_VALUES.VERIFICATION_RECOMMENDED,
      applicability_basis: normalizedScope.third_party_responsibility_material
        ? "third-party responsibility is material to this review"
        : "first-party workflow review does not require extra actor proof by default",
      required_for_conclusions: ["authority_scope", "overall_production_evidence_readiness"],
    },
    {
      family_id: "authority_scope",
      title: "Authority / scope",
      applicability: EVIDENCE_APPLICABILITY_VALUES.REQUIRED,
      verification_requirement:
        VERIFICATION_REQUIREMENT_VALUES.VERIFICATION_RECOMMENDED,
      applicability_basis: "the review must bind to a declared owner, requester, and scope boundary",
      required_for_conclusions: ["authority_scope", "overall_production_evidence_readiness"],
    },
    {
      family_id: "workflow_identity",
      title: "Workflow / version",
      applicability: EVIDENCE_APPLICABILITY_VALUES.REQUIRED,
      verification_requirement:
        VERIFICATION_REQUIREMENT_VALUES.DECLARATION_ALLOWED,
      applicability_basis: "the review must bind to a concrete workflow and change set",
      required_for_conclusions: ["workflow_identity", "overall_production_evidence_readiness"],
    },
    {
      family_id: "tooling_surface",
      title: "Tools",
      applicability: normalizedScope.tools_in_scope
        ? EVIDENCE_APPLICABILITY_VALUES.REQUIRED
        : EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE,
      verification_requirement:
        VERIFICATION_REQUIREMENT_VALUES.DECLARATION_ALLOWED,
      applicability_basis: normalizedScope.tools_in_scope
        ? "the workflow uses tools or recorded tool calls"
        : "no tool activity is in scope for this review",
      required_for_conclusions: ["tooling_surface", "overall_production_evidence_readiness"],
    },
    {
      family_id: "model_configuration",
      title: "Model / configuration",
      applicability: normalizedScope.model_change_material
        ? EVIDENCE_APPLICABILITY_VALUES.CONDITIONALLY_REQUIRED
        : EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE,
      verification_requirement:
        VERIFICATION_REQUIREMENT_VALUES.VERIFICATION_RECOMMENDED,
      applicability_basis: normalizedScope.model_change_material
        ? "model or runtime configuration can materially affect this review"
        : "model or runtime configuration is not a material conclusion driver",
      required_for_conclusions: ["model_configuration", "overall_production_evidence_readiness"],
    },
    {
      family_id: "tests_evaluations",
      title: "Tests / evaluations",
      applicability: EVIDENCE_APPLICABILITY_VALUES.REQUIRED,
      verification_requirement:
        VERIFICATION_REQUIREMENT_VALUES.VERIFICATION_RECOMMENDED,
      applicability_basis: "test and build evidence is core production-readiness material",
      required_for_conclusions: ["tests_evaluations", "overall_production_evidence_readiness"],
    },
    {
      family_id: "runtime_behavior",
      title: "Runtime evidence",
      applicability: normalizedScope.runtime_behavior_in_scope
        ? EVIDENCE_APPLICABILITY_VALUES.CONDITIONALLY_REQUIRED
        : EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE,
      verification_requirement:
        VERIFICATION_REQUIREMENT_VALUES.INDEPENDENT_VERIFICATION_REQUIRED,
      applicability_basis: normalizedScope.runtime_behavior_in_scope
        ? "staging, pilot, or runtime behavior is inside the current review scope"
        : "runtime behavior is outside the current review scope",
      required_for_conclusions: ["runtime_behavior", "overall_production_evidence_readiness"],
    },
    {
      family_id: "security_safety",
      title: "Security / safety evidence",
      applicability: normalizedScope.security_sensitive
        ? EVIDENCE_APPLICABILITY_VALUES.CONDITIONALLY_REQUIRED
        : EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE,
      verification_requirement:
        VERIFICATION_REQUIREMENT_VALUES.VERIFICATION_RECOMMENDED,
      applicability_basis: normalizedScope.security_sensitive
        ? "the workflow is security-sensitive or handles higher-risk material"
        : "security or safety evidence is not a material differentiator for this review",
      required_for_conclusions: ["security_safety", "overall_production_evidence_readiness"],
    },
    {
      family_id: "rollback_recovery",
      title: "Rollback / recovery evidence",
      applicability:
        normalizedScope.release_review || normalizedScope.material_production_change
          ? EVIDENCE_APPLICABILITY_VALUES.CONDITIONALLY_REQUIRED
          : EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE,
      verification_requirement:
        VERIFICATION_REQUIREMENT_VALUES.VERIFICATION_RECOMMENDED,
      applicability_basis:
        normalizedScope.release_review || normalizedScope.material_production_change
          ? "release-oriented or material production change review requires rollback and recovery context"
          : "rollback and recovery are outside the current review scope",
      required_for_conclusions: ["rollback_recovery", "overall_production_evidence_readiness"],
    },
    {
      family_id: "provenance_integrity",
      title: "Provenance / integrity",
      applicability: EVIDENCE_APPLICABILITY_VALUES.REQUIRED,
      verification_requirement:
        VERIFICATION_REQUIREMENT_VALUES.VERIFICATION_RECOMMENDED,
      applicability_basis: "traceability and artifact binding are required for bounded assurance",
      required_for_conclusions: ["provenance_integrity", "overall_production_evidence_readiness"],
    },
    {
      family_id: "outcome_verification",
      title: "Outcome verification",
      applicability: normalizedScope.outcome_verification_expected
        ? EVIDENCE_APPLICABILITY_VALUES.CONDITIONALLY_REQUIRED
        : EVIDENCE_APPLICABILITY_VALUES.OPTIONAL,
      verification_requirement:
        VERIFICATION_REQUIREMENT_VALUES.INDEPENDENT_VERIFICATION_REQUIRED,
      applicability_basis: normalizedScope.outcome_verification_expected
        ? "the review expects downstream outcome evidence"
        : "outcome verification remains optional in v0.1",
      required_for_conclusions: ["overall_production_evidence_readiness"],
    },
  ];

  return {
    profile: {
      profile_id: PRODUCTION_EVIDENCE_READINESS_PROFILE_ID,
      profile_version: PRODUCTION_EVIDENCE_READINESS_PROFILE_VERSION,
      purpose:
        "determine what evidence is structurally present, supportable, contradictory, or still missing for a bounded production evidence readiness review",
    },
    review_scope: normalizedScope,
    family_requirements: familyRequirements,
  };
}

function collectExternalVerifierVersions(
  normalizedRecords: NormalizedEvidenceRecord[],
  reports: AssuranceReport[],
): string[] {
  return sortStrings([
    ...normalizedRecords.map((record) => `${record.adapter.adapter_name}@${record.adapter.adapter_version}`),
    ...reports.map((report) => report.engine_version),
  ]);
}

function buildSources(
  pack: EvidencePackV1,
  normalizedRecords: NormalizedEvidenceRecord[],
  reports: AssuranceReport[],
): EvidenceAssuranceSource[] {
  const packArtifacts = asArray<UnknownRecord>(pack.artifacts);
  const packArtifactRefs = sortStrings(
    packArtifacts
      .map((artifact) => asString(artifact.artifact_id))
      .filter((value): value is string => value !== null),
  );

  const sources: EvidenceAssuranceSource[] = [
    {
      source_id: `source:${pack.pack_id}`,
      source_type: "evidence_pack",
      producer_id: asString(asRecord(pack.producer).producer_id),
      producer_name: asString(asRecord(pack.producer).producer_name),
      raw_trace_refs: packArtifactRefs,
    },
  ];

  for (const record of normalizedRecords) {
    sources.push({
      source_id: `source:${record.record.record_id}`,
      source_type: record.source.source_type,
      producer_id: record.source.issuer ?? null,
      producer_name: record.source.source_system ?? null,
      raw_trace_refs: sortStrings([
        record.receipt.raw_receipt_ref ?? "",
        record.evidence.raw_payload_ref ?? "",
        ...(record.evidence.evidence_refs ?? []),
      ].filter(Boolean)),
    });
  }

  for (const report of reports) {
    sources.push({
      source_id: `source:${report.report_id}`,
      source_type: report.producer.source_type,
      producer_id: report.producer.producer_id ?? null,
      producer_name: report.producer.producer_name ?? null,
      raw_trace_refs: sortStrings([
        report.evidence_package.package_id,
        ...(report.missing_evidence.flatMap((item) => item.evidence_refs ?? [])),
        ...(report.executed_checks.flatMap((item) => item.evidence_refs ?? [])),
      ]),
    });
  }

  return sources.sort((left, right) => left.source_id.localeCompare(right.source_id));
}

function buildClaims(pack: EvidencePackV1, reports: AssuranceReport[]): EvidenceAssuranceClaim[] {
  const packSourceId = `source:${pack.pack_id}`;
  const authority = asRecord(pack.authority);
  const workflow = asRecord(pack.workflow);
  const claims: EvidenceAssuranceClaim[] = [
    {
      claim_id: `claim:${pack.pack_id}:authority_scope`,
      claim_type: "authority_scope",
      summary: `authorization_status=${asString(authority.authorization_status) ?? "unknown"}`,
      source_id: packSourceId,
      evidence_refs: pickStringList(asArray(authority.authorization_evidence)),
    },
    {
      claim_id: `claim:${pack.pack_id}:workflow_identity`,
      claim_type: "workflow_identity",
      summary:
        asString(workflow.workflow_name) ??
        asString(workflow.workflow_id) ??
        "workflow identity declared in the submitted pack",
      source_id: packSourceId,
      evidence_refs: [pack.pack_id],
    },
  ];

  for (const report of reports) {
    for (const claim of report.verified_claims) {
      claims.push({
        claim_id: `claim:${report.report_id}:${claim.claim_id}`,
        claim_type: claim.claim_type,
        summary: claim.summary,
        source_id: `source:${report.report_id}`,
        evidence_refs: sortStrings(claim.evidence_refs ?? []),
      });
    }
  }

  return claims.sort((left, right) => left.claim_id.localeCompare(right.claim_id));
}

function buildObservations(
  pack: EvidencePackV1,
  coverageReasonCodes: string[],
  reports: AssuranceReport[],
): EvidenceAssuranceObservation[] {
  const observations: EvidenceAssuranceObservation[] = coverageReasonCodes.map((reasonCode) => ({
    observation_id: `observation:${pack.pack_id}:${reasonCode.toLowerCase()}`,
    observation_type: "coverage_reason_code",
    summary: reasonCode,
    source_id: `source:${pack.pack_id}`,
    evidence_refs: [pack.pack_id],
  }));

  for (const report of reports) {
    for (const finding of report.unresolved_findings) {
      observations.push({
        observation_id: `observation:${report.report_id}:${finding.finding_id}`,
        observation_type: finding.finding_type,
        summary: finding.message,
        source_id: `source:${report.report_id}`,
        evidence_refs: sortStrings([
          finding.evidence_ref ?? "",
          ...(report.failed_checks.flatMap((entry) => entry.evidence_refs ?? [])),
        ].filter(Boolean)),
      });
    }
  }

  return observations.sort((left, right) => left.observation_id.localeCompare(right.observation_id));
}

function buildVerifications(
  pack: EvidencePackV1,
  reports: AssuranceReport[],
): EvidenceAssuranceVerification[] {
  const packVerificationItems = asArray<UnknownRecord>(pack.verification);
  const verifications: EvidenceAssuranceVerification[] = [];

  for (const item of packVerificationItems) {
    const verificationId = asString(item.verification_id);
    const verificationType = asString(item.verification_type);
    if (!verificationId || !verificationType) {
      continue;
    }

    const status =
      asString(item.status) === "passed"
        ? VERIFICATION_POSTURE_VALUES.VERIFIED
        : asString(item.status) === "failed"
          ? VERIFICATION_POSTURE_VALUES.PARTIALLY_VERIFIED
          : VERIFICATION_POSTURE_VALUES.NOT_VERIFIED;

    verifications.push({
      verification_id: verificationId,
      source_id: `source:${pack.pack_id}`,
      status,
      verifier: {
        verifier_id: `verifier:${verificationId}`,
        verifier_name: verificationType,
        verification_method: verificationType,
        verification_scope: asString(item.coverage_note) ?? "pack-bounded verification entry",
        verification_limitations: [
          "pack verification entries remain producer-provided unless corroborated by separate verifier evidence",
        ],
      },
      evidence_refs: sortStrings([
        verificationId,
        ...pickStringList(asArray(item.artifact_refs)),
      ]),
    });
  }

  for (const report of reports) {
    const verifiedChecks = report.executed_checks.filter(
      (entry) => entry.status === "verified" || entry.status === "partially_verified",
    );
    if (verifiedChecks.length === 0) {
      continue;
    }

    verifications.push({
      verification_id: `verification:${report.report_id}`,
      source_id: `source:${report.report_id}`,
      status: verifiedChecks.every((entry) => entry.status === "verified")
        ? VERIFICATION_POSTURE_VALUES.VERIFIED
        : VERIFICATION_POSTURE_VALUES.PARTIALLY_VERIFIED,
      verifier: {
        verifier_id: `verifier:${report.adapter.adapter_id}:${report.engine_version}`,
        verifier_name: report.adapter.adapter_id,
        verification_method: "external_assurance_report",
        verification_scope: report.assurance_profiles
          .map((entry) => `${entry.profile_id}@${entry.profile_version}`)
          .join(", "),
        verification_limitations: report.scope_limitations,
      },
      evidence_refs: sortStrings([
        report.report_id,
        ...verifiedChecks.flatMap((entry) => entry.evidence_refs ?? []),
      ]),
    });
  }

  return verifications.sort((left, right) => left.verification_id.localeCompare(right.verification_id));
}

function buildEvidenceItems(
  pack: EvidencePackV1,
  normalizedRecords: NormalizedEvidenceRecord[],
  reports: AssuranceReport[],
  claims: EvidenceAssuranceClaim[],
  observations: EvidenceAssuranceObservation[],
  verifications: EvidenceAssuranceVerification[],
): EvidenceAssuranceEvidenceItem[] {
  const authority = asRecord(pack.authority);
  const workflow = asRecord(pack.workflow);
  const runtime = asRecord(pack.runtime);
  const scope = asRecord(pack.scope);
  const packSourceId = `source:${pack.pack_id}`;
  const claimIdsByType = new Map(
    claims.map((claim) => [claim.claim_type, claim.claim_id] as const),
  );
  const observationIdsByType = new Map(
    observations.map((observation) => [observation.observation_type, observation.observation_id] as const),
  );
  const verificationIdsBySource = new Map(
    verifications.map((verification) => [verification.source_id, verification.verification_id] as const),
  );

  const items: EvidenceAssuranceEvidenceItem[] = [
    {
      evidence_item_id: `evidence:${pack.pack_id}:authority_scope`,
      family_id: "authority_scope",
      summary: "submitted authority material",
      source_id: packSourceId,
      claim_ids: [claimIdsByType.get("authority_scope")].filter(
        (value): value is string => typeof value === "string",
      ),
      observation_ids: [],
      verification_ids: [verificationIdsBySource.get(packSourceId)].filter(
        (value): value is string => typeof value === "string",
      ),
      evidence_refs: pickStringList(asArray(authority.authorization_evidence)),
      origin_posture:
        asString(authority.authorization_status) === "declared"
          ? ORIGIN_POSTURE_VALUES.DECLARED
          : ORIGIN_POSTURE_VALUES.PRODUCER_EMITTED,
      verification_posture:
        asString(authority.authorization_status) === "provided"
          ? VERIFICATION_POSTURE_VALUES.PARTIALLY_VERIFIED
          : VERIFICATION_POSTURE_VALUES.NOT_VERIFIED,
      integrity_posture: INTEGRITY_POSTURE_VALUES.UNAVAILABLE,
      corroboration_posture: CORROBORATION_POSTURE_VALUES.SINGLE_SOURCE,
      profile_admissibility: PROFILE_ADMISSIBILITY_VALUES.ADMISSIBLE,
      independence_posture:
        asString(authority.authorization_status) === "declared"
          ? INDEPENDENCE_POSTURE_VALUES.DECLARED_ONLY
          : INDEPENDENCE_POSTURE_VALUES.SAME_PRODUCER_VERIFICATION,
    },
    {
      evidence_item_id: `evidence:${pack.pack_id}:workflow_identity`,
      family_id: "workflow_identity",
      summary: "submitted workflow identity",
      source_id: packSourceId,
      claim_ids: [claimIdsByType.get("workflow_identity")].filter(
        (value): value is string => typeof value === "string",
      ),
      observation_ids: [],
      verification_ids: [],
      evidence_refs: sortStrings([
        asString(asRecord(workflow.repository).commit_sha) ?? "",
        pack.pack_id,
      ].filter(Boolean)),
      origin_posture: ORIGIN_POSTURE_VALUES.PRODUCER_EMITTED,
      verification_posture: VERIFICATION_POSTURE_VALUES.NOT_VERIFIED,
      integrity_posture: INTEGRITY_POSTURE_VALUES.BOUND,
      corroboration_posture: CORROBORATION_POSTURE_VALUES.SINGLE_SOURCE,
      profile_admissibility: PROFILE_ADMISSIBILITY_VALUES.ADMISSIBLE,
      independence_posture: INDEPENDENCE_POSTURE_VALUES.NOT_APPLICABLE,
    },
    {
      evidence_item_id: `evidence:${pack.pack_id}:tooling_surface`,
      family_id: "tooling_surface",
      summary: "declared tool and tool-call surface",
      source_id: packSourceId,
      claim_ids: [],
      observation_ids: [],
      verification_ids: [],
      evidence_refs: sortStrings([
        ...asArray<UnknownRecord>(runtime.tools)
          .map((tool) => asString(tool.tool_name))
          .filter((value): value is string => value !== null),
        ...asArray<UnknownRecord>(pack.tool_calls)
          .map((toolCall) => asString(toolCall.tool_call_id))
          .filter((value): value is string => value !== null),
      ]),
      origin_posture: ORIGIN_POSTURE_VALUES.PRODUCER_EMITTED,
      verification_posture: VERIFICATION_POSTURE_VALUES.NOT_VERIFIED,
      integrity_posture: INTEGRITY_POSTURE_VALUES.UNAVAILABLE,
      corroboration_posture: CORROBORATION_POSTURE_VALUES.SINGLE_SOURCE,
      profile_admissibility: PROFILE_ADMISSIBILITY_VALUES.ADMISSIBLE,
      independence_posture: INDEPENDENCE_POSTURE_VALUES.NOT_APPLICABLE,
    },
    {
      evidence_item_id: `evidence:${pack.pack_id}:tests_evaluations`,
      family_id: "tests_evaluations",
      summary: "submitted test and build verification entries",
      source_id: packSourceId,
      claim_ids: [],
      observation_ids: [observationIdsByType.get("coverage_reason_code")].filter(
        (value): value is string => typeof value === "string",
      ),
      verification_ids: verifications
        .filter((verification) => verification.source_id === packSourceId)
        .map((verification) => verification.verification_id),
      evidence_refs: collectVerificationRefs(
        asArray<UnknownRecord>(pack.verification),
        ["unit_test", "integration_test", "build"],
      ),
      origin_posture: ORIGIN_POSTURE_VALUES.PRODUCER_EMITTED,
      verification_posture:
        hasVerificationStatus(asArray<UnknownRecord>(pack.verification), "build", ["passed"]) &&
        (hasVerificationStatus(asArray<UnknownRecord>(pack.verification), "unit_test", ["passed"]) ||
          hasVerificationStatus(asArray<UnknownRecord>(pack.verification), "integration_test", ["passed"]))
          ? VERIFICATION_POSTURE_VALUES.VERIFIED
          : VERIFICATION_POSTURE_VALUES.PARTIALLY_VERIFIED,
      integrity_posture: INTEGRITY_POSTURE_VALUES.BOUND,
      corroboration_posture:
        reports.length > 0
          ? CORROBORATION_POSTURE_VALUES.CROSS_SOURCE
          : CORROBORATION_POSTURE_VALUES.SINGLE_SOURCE,
      profile_admissibility: PROFILE_ADMISSIBILITY_VALUES.ADMISSIBLE,
      independence_posture:
        reports.some((report) => report.executed_checks.length > 0)
          ? INDEPENDENCE_POSTURE_VALUES.CROSS_SOURCE_CORROBORATED
          : INDEPENDENCE_POSTURE_VALUES.SAME_PRODUCER_VERIFICATION,
    },
    {
      evidence_item_id: `evidence:${pack.pack_id}:provenance_integrity`,
      family_id: "provenance_integrity",
      summary: "submitted provenance and artifact binding",
      source_id: packSourceId,
      claim_ids: [],
      observation_ids: [],
      verification_ids: [],
      evidence_refs: sortStrings([
        asString(asRecord(pack.provenance).source_pack_hash) ?? "",
        ...asArray<UnknownRecord>(pack.artifacts)
          .map((artifact) => asString(artifact.artifact_id))
          .filter((value): value is string => value !== null),
      ].filter(Boolean)),
      origin_posture: ORIGIN_POSTURE_VALUES.PRODUCER_EMITTED,
      verification_posture: VERIFICATION_POSTURE_VALUES.PARTIALLY_VERIFIED,
      integrity_posture:
        asString(asRecord(pack.provenance).source_pack_hash) &&
        asArray<UnknownRecord>(pack.artifacts).every((artifact) => Boolean(asString(artifact.sha256)))
          ? INTEGRITY_POSTURE_VALUES.BOUND
          : INTEGRITY_POSTURE_VALUES.UNAVAILABLE,
      corroboration_posture:
        reports.length > 0 || normalizedRecords.length > 0
          ? CORROBORATION_POSTURE_VALUES.CROSS_SOURCE
          : CORROBORATION_POSTURE_VALUES.SINGLE_SOURCE,
      profile_admissibility: PROFILE_ADMISSIBILITY_VALUES.ADMISSIBLE,
      independence_posture:
        reports.length > 0 || normalizedRecords.length > 0
          ? INDEPENDENCE_POSTURE_VALUES.CROSS_SOURCE_CORROBORATED
          : INDEPENDENCE_POSTURE_VALUES.SAME_PRODUCER_VERIFICATION,
    },
  ];

  if (asRecord(runtime.model).model_name) {
    items.push({
      evidence_item_id: `evidence:${pack.pack_id}:model_configuration`,
      family_id: "model_configuration",
      summary: "declared runtime model and configuration",
      source_id: packSourceId,
      claim_ids: [],
      observation_ids: [],
      verification_ids: [],
      evidence_refs: sortStrings([
        asString(asRecord(runtime.model).model_name) ?? "",
        asString(asRecord(runtime.model).model_version) ?? "",
      ].filter(Boolean)),
      origin_posture: ORIGIN_POSTURE_VALUES.PRODUCER_EMITTED,
      verification_posture: VERIFICATION_POSTURE_VALUES.NOT_VERIFIED,
      integrity_posture: INTEGRITY_POSTURE_VALUES.UNAVAILABLE,
      corroboration_posture: CORROBORATION_POSTURE_VALUES.SINGLE_SOURCE,
      profile_admissibility: PROFILE_ADMISSIBILITY_VALUES.ADMISSIBLE,
      independence_posture: INDEPENDENCE_POSTURE_VALUES.SAME_PRODUCER_VERIFICATION,
    });
  }

  if (asArray(runtime.tools).length > 0 || asArray(pack.tool_calls).length > 0) {
    const changedFiles = pickStringList(asArray(scope.changed_files));
    items.push({
      evidence_item_id: `evidence:${pack.pack_id}:workflow_scope`,
      family_id: "identity_actor",
      summary: "submitted actor, owner, and changed-file context",
      source_id: packSourceId,
      claim_ids: [],
      observation_ids: [],
      verification_ids: [],
      evidence_refs: sortStrings([
        asString(asRecord(pack.authority).requested_by) ?? "",
        asString(asRecord(pack.authority).owner) ?? "",
        ...changedFiles,
      ].filter(Boolean)),
      origin_posture: ORIGIN_POSTURE_VALUES.PRODUCER_EMITTED,
      verification_posture: VERIFICATION_POSTURE_VALUES.NOT_VERIFIED,
      integrity_posture: INTEGRITY_POSTURE_VALUES.UNAVAILABLE,
      corroboration_posture: CORROBORATION_POSTURE_VALUES.SINGLE_SOURCE,
      profile_admissibility: PROFILE_ADMISSIBILITY_VALUES.ADMISSIBLE,
      independence_posture: INDEPENDENCE_POSTURE_VALUES.SAME_PRODUCER_VERIFICATION,
    });
  }

  for (const record of normalizedRecords) {
    items.push({
      evidence_item_id: `evidence:${record.record.record_id}:runtime_behavior`,
      family_id:
        record.source.source_type === "runtime_provenance_record" ||
        record.source.source_type === "runtime_receipt"
          ? "runtime_behavior"
          : "provenance_integrity",
      summary: `normalized external evidence record ${record.record.record_id}`,
      source_id: `source:${record.record.record_id}`,
      claim_ids: [],
      observation_ids: [],
      verification_ids: [],
      evidence_refs: sortStrings([
        record.record.record_id,
        ...(record.evidence.evidence_refs ?? []),
      ]),
      origin_posture: ORIGIN_POSTURE_VALUES.EXTERNALLY_EMITTED,
      verification_posture:
        record.verification.status === "verified"
          ? VERIFICATION_POSTURE_VALUES.VERIFIED
          : record.verification.status === "partially_verified"
            ? VERIFICATION_POSTURE_VALUES.PARTIALLY_VERIFIED
            : VERIFICATION_POSTURE_VALUES.NOT_VERIFIED,
      integrity_posture:
        record.verification.integrity?.payload_hash_status === "match"
          ? INTEGRITY_POSTURE_VALUES.BOUND
          : record.verification.integrity?.payload_hash_status === "mismatch"
            ? INTEGRITY_POSTURE_VALUES.MISMATCH
            : INTEGRITY_POSTURE_VALUES.UNAVAILABLE,
      corroboration_posture:
        reports.length > 0
          ? CORROBORATION_POSTURE_VALUES.CROSS_SOURCE
          : CORROBORATION_POSTURE_VALUES.SINGLE_SOURCE,
      profile_admissibility: PROFILE_ADMISSIBILITY_VALUES.ADMISSIBLE,
      independence_posture:
        record.verification.status === "verified"
          ? INDEPENDENCE_POSTURE_VALUES.INDEPENDENTLY_VERIFIED
          : INDEPENDENCE_POSTURE_VALUES.VERIFIER_IDENTITY_MISSING,
    });
  }

  for (const report of reports) {
    items.push({
      evidence_item_id: `evidence:${report.report_id}:external_assurance`,
      family_id:
        report.producer.source_type === "runtime_provenance_record" ||
        report.producer.source_type === "runtime_receipt"
          ? "runtime_behavior"
          : "tests_evaluations",
      summary: `external assurance report ${report.report_id}`,
      source_id: `source:${report.report_id}`,
      claim_ids: claims
        .filter((claim) => claim.source_id === `source:${report.report_id}`)
        .map((claim) => claim.claim_id),
      observation_ids: observations
        .filter((observation) => observation.source_id === `source:${report.report_id}`)
        .map((observation) => observation.observation_id),
      verification_ids: verifications
        .filter((verification) => verification.source_id === `source:${report.report_id}`)
        .map((verification) => verification.verification_id),
      evidence_refs: sortStrings([
        report.report_id,
        ...report.executed_checks.flatMap((entry) => entry.evidence_refs ?? []),
        ...report.verified_claims.flatMap((entry) => entry.evidence_refs ?? []),
      ]),
      origin_posture: ORIGIN_POSTURE_VALUES.EXTERNALLY_EMITTED,
      verification_posture:
        report.executed_checks.some((entry) => entry.status === "verified")
          ? VERIFICATION_POSTURE_VALUES.VERIFIED
          : report.executed_checks.some((entry) => entry.status === "partially_verified")
            ? VERIFICATION_POSTURE_VALUES.PARTIALLY_VERIFIED
            : VERIFICATION_POSTURE_VALUES.NOT_VERIFIED,
      integrity_posture: report.report_integrity?.digest
        ? INTEGRITY_POSTURE_VALUES.BOUND
        : INTEGRITY_POSTURE_VALUES.UNAVAILABLE,
      corroboration_posture: CORROBORATION_POSTURE_VALUES.CROSS_SOURCE,
      profile_admissibility: PROFILE_ADMISSIBILITY_VALUES.ADMISSIBLE,
      independence_posture:
        report.executed_checks.length > 0
          ? INDEPENDENCE_POSTURE_VALUES.INDEPENDENTLY_VERIFIED
          : INDEPENDENCE_POSTURE_VALUES.VERIFIER_IDENTITY_MISSING,
    });
  }

  return items.sort((left, right) => left.evidence_item_id.localeCompare(right.evidence_item_id));
}

function summarizeExternalClaimOutcome(
  reports: AssuranceReport[],
  claimType: string,
): { outcome: "passed" | "failed" | null; evidence_refs: string[]; summary: string | null } {
  for (const report of reports) {
    const claim = report.verified_claims.find((entry) => entry.claim_type === claimType);
    if (!claim) {
      continue;
    }

    const normalizedSummary = claim.summary.toLowerCase();
    if (normalizedSummary.includes("passed") || normalizedSummary.includes("success")) {
      return {
        outcome: "passed",
        evidence_refs: sortStrings(claim.evidence_refs ?? []),
        summary: claim.summary,
      };
    }

    if (normalizedSummary.includes("failed") || normalizedSummary.includes("mismatch")) {
      return {
        outcome: "failed",
        evidence_refs: sortStrings(claim.evidence_refs ?? []),
        summary: claim.summary,
      };
    }
  }

  return { outcome: null, evidence_refs: [], summary: null };
}

function summarizeCheckStatus(
  report: AssuranceReport,
  checkType: AssuranceCheckSummary["check_type"],
): AssuranceCheckSummary["status"] | null {
  const match = report.executed_checks.find((entry) => entry.check_type === checkType)
    ?? report.failed_checks.find((entry) => entry.check_type === checkType);
  return match?.status ?? null;
}

function evaluateFamilies(
  pack: EvidencePackV1,
  familyRequirements: EvidenceFamilyRequirement[],
  normalizedRecords: NormalizedEvidenceRecord[],
  reports: AssuranceReport[],
): {
  evaluations: FamilyEvaluation[];
  contradictions: EvidenceAssuranceContradiction[];
} {
  const workflow = asRecord(pack.workflow);
  const authority = asRecord(pack.authority);
  const runtime = asRecord(pack.runtime);
  const scope = asRecord(pack.scope);
  const provenance = asRecord(pack.provenance);
  const verificationItems = asArray<UnknownRecord>(pack.verification);
  const coverage = inspectEvidenceCoverage(pack);
  const contradictions: EvidenceAssuranceContradiction[] = [];
  const externalBuildOutcome = summarizeExternalClaimOutcome(reports, "build_outcome");
  const externalTestOutcome = summarizeExternalClaimOutcome(reports, "test_outcome");
  const externalRollbackOutcome = summarizeExternalClaimOutcome(reports, "rollback_outcome");
  const hasRuntimeExternalEvidence = normalizedRecords.some((record) =>
    ["runtime_receipt", "runtime_provenance_record"].includes(record.source.source_type),
  ) || reports.some((report) =>
    ["runtime_receipt", "runtime_provenance_record"].includes(report.producer.source_type),
  );

  const packBuildPassed = hasVerificationStatus(verificationItems, "build", ["passed"]);
  const packBuildFailed = hasVerificationStatus(verificationItems, "build", ["failed"]);
  const packTestsPassed =
    hasVerificationStatus(verificationItems, "unit_test", ["passed"]) ||
    hasVerificationStatus(verificationItems, "integration_test", ["passed"]);
  const packTestsFailed =
    hasVerificationStatus(verificationItems, "unit_test", ["failed"]) ||
    hasVerificationStatus(verificationItems, "integration_test", ["failed"]);
  const packRollbackPassed = hasVerificationStatus(verificationItems, "rollback_check", ["passed"]);
  const packRollbackFailed =
    hasVerificationStatus(verificationItems, "rollback_check", ["failed"]) ||
    hasVerificationStatus(verificationItems, "rollback_check", ["not_run"]);

  if (
    externalBuildOutcome.outcome &&
    ((packBuildPassed && externalBuildOutcome.outcome === "failed") ||
      (packBuildFailed && externalBuildOutcome.outcome === "passed"))
  ) {
    contradictions.push({
      contradiction_id: "contradiction:build_outcome",
      family_id: "tests_evaluations",
      summary: "build outcome differs between pack-bounded evidence and external assurance evidence",
      left_summary: packBuildPassed ? "pack reports build passed" : "pack reports build failed",
      right_summary: externalBuildOutcome.summary ?? "external assurance reports a different build outcome",
      evidence_refs: sortStrings([
        ...collectVerificationRefs(verificationItems, ["build"]),
        ...externalBuildOutcome.evidence_refs,
      ]),
    });
  }

  if (
    externalTestOutcome.outcome &&
    ((packTestsPassed && externalTestOutcome.outcome === "failed") ||
      (packTestsFailed && externalTestOutcome.outcome === "passed"))
  ) {
    contradictions.push({
      contradiction_id: "contradiction:test_outcome",
      family_id: "tests_evaluations",
      summary: "test outcome differs between pack-bounded evidence and external assurance evidence",
      left_summary: packTestsPassed ? "pack reports tests passed" : "pack reports tests failed",
      right_summary: externalTestOutcome.summary ?? "external assurance reports a different test outcome",
      evidence_refs: sortStrings([
        ...collectVerificationRefs(verificationItems, ["unit_test", "integration_test"]),
        ...externalTestOutcome.evidence_refs,
      ]),
    });
  }

  if (
    externalRollbackOutcome.outcome &&
    ((packRollbackPassed && externalRollbackOutcome.outcome === "failed") ||
      (packRollbackFailed && externalRollbackOutcome.outcome === "passed"))
  ) {
    contradictions.push({
      contradiction_id: "contradiction:rollback_outcome",
      family_id: "rollback_recovery",
      summary: "rollback outcome differs between pack-bounded evidence and external assurance evidence",
      left_summary: packRollbackPassed
        ? "pack reports rollback passed"
        : "pack reports rollback failed or not run",
      right_summary:
        externalRollbackOutcome.summary ??
        "external assurance reports a different rollback outcome",
      evidence_refs: sortStrings([
        ...collectVerificationRefs(verificationItems, ["rollback_check"]),
        ...externalRollbackOutcome.evidence_refs,
      ]),
    });
  }

  const integrityOnlyRuntimeReport = reports.find((report) => {
    const integrityStatus = summarizeCheckStatus(report, "digest_integrity");
    return (
      ["runtime_receipt", "runtime_provenance_record"].includes(report.producer.source_type) &&
      integrityStatus === "verified" &&
      report.verified_claims.length === 0
    );
  });

  const evaluations: FamilyEvaluation[] = familyRequirements.map((requirement) => {
    const base: FamilyEvaluation = {
      family_id: requirement.family_id,
      supported: false,
      contradictory: contradictions.some((entry) => entry.family_id === requirement.family_id),
      rationale: requirement.applicability_basis,
      evidence_refs: [],
      structural_missing_summary: null,
      conclusion_missing_summary: null,
      residual_uncertainty: [],
      profile_admissibility:
        requirement.applicability === EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE
          ? PROFILE_ADMISSIBILITY_VALUES.NOT_APPLICABLE
          : PROFILE_ADMISSIBILITY_VALUES.ADMISSIBLE,
    };

    switch (requirement.family_id) {
      case "identity_actor": {
        const refs = sortStrings([
          asString(authority.requested_by) ?? "",
          asString(authority.owner) ?? "",
        ].filter(Boolean));
        return {
          ...base,
          supported:
            requirement.applicability === EVIDENCE_APPLICABILITY_VALUES.OPTIONAL ||
            refs.length > 0,
          evidence_refs: refs,
          conclusion_missing_summary:
            requirement.applicability === EVIDENCE_APPLICABILITY_VALUES.CONDITIONALLY_REQUIRED &&
            refs.length === 0
              ? "actor or owner identity is needed for this conclusion but is not present"
              : null,
        };
      }
      case "authority_scope": {
        const authRefs = pickStringList(asArray(authority.authorization_evidence));
        const timeWindow = asRecord(authority.time_window);
        const authStatus = asString(authority.authorization_status);
        const timeWindowPresent =
          Boolean(asString(timeWindow.start_at)) && Boolean(asString(timeWindow.end_at));
        return {
          ...base,
          supported: authStatus === "provided" && authRefs.length > 0 && timeWindowPresent,
          evidence_refs: authRefs,
          structural_missing_summary:
            authRefs.length === 0 || !timeWindowPresent
              ? "authority material is structurally incomplete for bounded interpretation"
              : null,
          conclusion_missing_summary:
            authStatus === "declared"
              ? "authority remains declared-only and is not independently verified"
              : null,
          residual_uncertainty:
            authStatus === "provided"
              ? ["authority is present but still depends on producer-supplied review context"]
              : [],
        };
      }
      case "workflow_identity": {
        const repository = asRecord(workflow.repository);
        const refs = sortStrings([
          asString(workflow.workflow_id) ?? "",
          asString(repository.commit_sha) ?? "",
          asString(repository.branch) ?? "",
        ].filter(Boolean));
        return {
          ...base,
          supported: refs.length >= 2,
          evidence_refs: refs,
          structural_missing_summary:
            refs.length < 2
              ? "workflow identity is missing version or repository binding detail"
              : null,
        };
      }
      case "tooling_surface": {
        const refs = sortStrings([
          ...asArray<UnknownRecord>(runtime.tools)
            .map((tool) => asString(tool.tool_name))
            .filter((value): value is string => value !== null),
          ...asArray<UnknownRecord>(pack.tool_calls)
            .map((toolCall) => asString(toolCall.tool_call_id))
            .filter((value): value is string => value !== null),
        ]);
        return {
          ...base,
          supported:
            requirement.applicability === EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE ||
            refs.length > 0,
          evidence_refs: refs,
          conclusion_missing_summary:
            requirement.applicability !== EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE &&
            refs.length === 0
              ? "tooling activity is applicable but no tool inventory or tool-call evidence is present"
              : null,
        };
      }
      case "model_configuration": {
        const model = asRecord(runtime.model);
        const refs = sortStrings([
          asString(model.model_name) ?? "",
          asString(model.model_version) ?? "",
        ].filter(Boolean));
        return {
          ...base,
          supported:
            requirement.applicability === EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE ||
            refs.length > 0,
          evidence_refs: refs,
          conclusion_missing_summary:
            requirement.applicability !== EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE &&
            refs.length === 0
              ? "model or configuration evidence is material to this review but is absent"
              : null,
          residual_uncertainty:
            refs.length > 0 && requirement.applicability !== EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE
              ? ["model configuration remains declaration-backed unless corroborated by external runtime evidence"]
              : [],
        };
      }
      case "tests_evaluations": {
        const refs = collectVerificationRefs(verificationItems, ["unit_test", "integration_test", "build"]);
        const passed = packBuildPassed && packTestsPassed;
        return {
          ...base,
          supported: passed && !base.contradictory,
          evidence_refs: sortStrings([...refs, ...externalBuildOutcome.evidence_refs, ...externalTestOutcome.evidence_refs]),
          structural_missing_summary:
            refs.length === 0 ? "test or build verification entries are structurally absent" : null,
          conclusion_missing_summary:
            refs.length > 0 && !passed && !base.contradictory
              ? "available test or build evidence does not support the requested conclusion"
              : null,
          residual_uncertainty:
            passed && reports.length === 0
              ? ["tests and build succeeded, but the evidence remains producer-bounded unless corroborated separately"]
              : [],
        };
      }
      case "runtime_behavior": {
        const refs = sortStrings([
          ...normalizedRecords
            .filter((record) =>
              ["runtime_receipt", "runtime_provenance_record"].includes(record.source.source_type),
            )
            .flatMap((record) => [record.record.record_id, ...(record.evidence.evidence_refs ?? [])]),
          ...reports
            .filter((report) =>
              ["runtime_receipt", "runtime_provenance_record"].includes(report.producer.source_type),
            )
            .flatMap((report) => [
              report.report_id,
              ...report.executed_checks.flatMap((entry) => entry.evidence_refs ?? []),
            ]),
        ]);
        return {
          ...base,
          supported:
            requirement.applicability === EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE
              ? false
              : hasRuntimeExternalEvidence &&
                reports.some((report) =>
                  ["runtime_receipt", "runtime_provenance_record"].includes(report.producer.source_type) &&
                  report.verified_claims.length > 0,
                ) &&
                !base.contradictory,
          evidence_refs: refs,
          conclusion_missing_summary:
            requirement.applicability !== EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE &&
            !hasRuntimeExternalEvidence
              ? "runtime or staging evidence is applicable to this review but is not present"
              : null,
          residual_uncertainty:
            integrityOnlyRuntimeReport
              ? ["runtime integrity checks succeeded, but real-world runtime truth remains unsupported"]
              : [],
        };
      }
      case "security_safety": {
        const refs = collectVerificationRefs(verificationItems, [
          "security_scan",
          "static_analysis",
          "manual_review",
        ]);
        return {
          ...base,
          supported:
            requirement.applicability === EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE ||
            refs.length > 0,
          evidence_refs: refs,
          conclusion_missing_summary:
            requirement.applicability !== EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE &&
            refs.length === 0
              ? "security or safety evidence is applicable but not present"
              : null,
        };
      }
      case "rollback_recovery": {
        const refs = sortStrings([
          ...collectVerificationRefs(verificationItems, ["rollback_check"]),
          ...externalRollbackOutcome.evidence_refs,
        ]);
        const rollbackPassed = packRollbackPassed && !base.contradictory;
        return {
          ...base,
          supported:
            requirement.applicability === EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE
              ? false
              : rollbackPassed,
          evidence_refs: refs,
          conclusion_missing_summary:
            requirement.applicability !== EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE &&
            !hasVerificationType(verificationItems, "rollback_check")
              ? "rollback or recovery evidence is applicable but structurally absent"
              : requirement.applicability !== EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE &&
                  !rollbackPassed
                ? "rollback or recovery evidence does not support the requested conclusion"
                : null,
        };
      }
      case "provenance_integrity": {
        const artifactHashesPresent = asArray<UnknownRecord>(pack.artifacts).every((artifact) =>
          Boolean(asString(artifact.sha256)),
        );
        const sourcePackHash = asString(provenance.source_pack_hash);
        const integrityVerifiedRuntime = normalizedRecords.some((record) =>
          record.verification.integrity?.payload_hash_status === "match",
        );
        return {
          ...base,
          supported: Boolean(sourcePackHash) && artifactHashesPresent,
          evidence_refs: sortStrings([
            sourcePackHash ?? "",
            ...asArray<UnknownRecord>(pack.artifacts)
              .map((artifact) => asString(artifact.artifact_id))
              .filter((value): value is string => value !== null),
          ].filter(Boolean)),
          structural_missing_summary:
            !sourcePackHash || !artifactHashesPresent
              ? "provenance or integrity binding is structurally incomplete"
              : null,
          residual_uncertainty:
            integrityVerifiedRuntime
              ? ["integrity validation binds content identity but does not establish the truth of the underlying claim"]
              : [],
        };
      }
      case "outcome_verification": {
        const refs = reports
          .filter((report) => report.verified_claims.some((claim) => claim.claim_type === "outcome_verification"))
          .flatMap((report) => report.verified_claims.flatMap((claim) => claim.evidence_refs ?? []));
        return {
          ...base,
          supported:
            requirement.applicability === EVIDENCE_APPLICABILITY_VALUES.OPTIONAL ||
            refs.length > 0,
          evidence_refs: sortStrings(refs),
          conclusion_missing_summary:
            requirement.applicability === EVIDENCE_APPLICABILITY_VALUES.CONDITIONALLY_REQUIRED &&
            refs.length === 0
              ? "outcome verification is expected for this review but is not present"
              : null,
          residual_uncertainty:
            refs.length === 0
              ? ["outcome verification remains absent in this bounded v0.1 review"]
              : [],
        };
      }
      default:
        return base;
    }
  });

  return { evaluations, contradictions };
}

export function evaluateEvidenceAssuranceKernel(
  input: EvidenceAssuranceKernelInput,
): EvidenceAssuranceResult {
  const normalizedRecords = [...(input.normalized_records ?? [])];
  const reports = [...(input.external_assurance_reports ?? [])];
  const profileBundle = buildProductionEvidenceReadinessProfileV1(
    input.pack,
    input.review_scope,
  );
  const coverage = inspectEvidenceCoverage(input.pack);
  const sources = buildSources(input.pack, normalizedRecords, reports);
  const claims = buildClaims(input.pack, reports);
  const observations = buildObservations(input.pack, coverage.reason_codes, reports);
  const verifications = buildVerifications(input.pack, reports);
  const evidenceItems = buildEvidenceItems(
    input.pack,
    normalizedRecords,
    reports,
    claims,
    observations,
    verifications,
  );
  const familyEvaluationResult = evaluateFamilies(
    input.pack,
    profileBundle.family_requirements,
    normalizedRecords,
    reports,
  );

  const structuralMissingEvidence: EvidenceAssuranceMissingEvidence[] = [];
  const conclusionSpecificMissingEvidence: EvidenceAssuranceMissingEvidence[] = [];
  const residualUncertainty: EvidenceAssuranceResidualUncertainty[] = [];

  for (const evaluation of familyEvaluationResult.evaluations) {
    if (evaluation.structural_missing_summary) {
      structuralMissingEvidence.push({
        missing_evidence_id: `missing:${evaluation.family_id}:structural`,
        kind: "structural_missing_evidence",
        family_id: evaluation.family_id,
        conclusion_id: evaluation.family_id,
        summary: evaluation.structural_missing_summary,
        evidence_refs: evaluation.evidence_refs,
      });
    }

    if (evaluation.conclusion_missing_summary) {
      conclusionSpecificMissingEvidence.push({
        missing_evidence_id: `missing:${evaluation.family_id}:conclusion`,
        kind: "conclusion_specific_missing_evidence",
        family_id: evaluation.family_id,
        conclusion_id: evaluation.family_id,
        summary: evaluation.conclusion_missing_summary,
        evidence_refs: evaluation.evidence_refs,
      });
    }

    for (const [index, summary] of evaluation.residual_uncertainty.entries()) {
      residualUncertainty.push({
        uncertainty_id: `uncertainty:${evaluation.family_id}:${index + 1}`,
        family_id: evaluation.family_id,
        summary,
        evidence_refs: evaluation.evidence_refs,
      });
    }
  }

  const supportability: EvidenceAssuranceSupportability[] = [];
  for (const evaluation of familyEvaluationResult.evaluations) {
    const requirement = profileBundle.family_requirements.find(
      (entry) => entry.family_id === evaluation.family_id,
    );
    const contradictions = familyEvaluationResult.contradictions.filter(
      (entry) => entry.family_id === evaluation.family_id,
    );
    const missingIds = [
      ...structuralMissingEvidence
        .filter((entry) => entry.family_id === evaluation.family_id)
        .map((entry) => entry.missing_evidence_id),
      ...conclusionSpecificMissingEvidence
        .filter((entry) => entry.family_id === evaluation.family_id)
        .map((entry) => entry.missing_evidence_id),
    ];
    const uncertaintyIds = residualUncertainty
      .filter((entry) => entry.family_id === evaluation.family_id)
      .map((entry) => entry.uncertainty_id);

    let status: KernelFindingStatusValue;
    if (requirement?.applicability === EVIDENCE_APPLICABILITY_VALUES.NOT_APPLICABLE) {
      status = KERNEL_FINDING_STATUS_VALUES.INADMISSIBLE;
    } else if (contradictions.length > 0) {
      status = KERNEL_FINDING_STATUS_VALUES.CONTRADICTED;
    } else if (missingIds.length > 0) {
      status = KERNEL_FINDING_STATUS_VALUES.INSUFFICIENT_EVIDENCE;
    } else if (evaluation.supported) {
      status = KERNEL_FINDING_STATUS_VALUES.SUPPORTED;
    } else {
      status = KERNEL_FINDING_STATUS_VALUES.UNSUPPORTED;
    }

    supportability.push({
      conclusion_id: evaluation.family_id,
      summary: requirement?.title ?? evaluation.family_id,
      supportability: status,
      profile_admissibility: evaluation.profile_admissibility,
      evidence_refs: evaluation.evidence_refs,
      contradiction_ids: contradictions.map((entry) => entry.contradiction_id),
      missing_evidence_ids: missingIds,
      residual_uncertainty_ids: uncertaintyIds,
      rationale: evaluation.rationale,
    });
  }

  const overallContradictionIds = familyEvaluationResult.contradictions.map(
    (entry) => entry.contradiction_id,
  );
  const overallMissingIds = [
    ...structuralMissingEvidence.map((entry) => entry.missing_evidence_id),
    ...conclusionSpecificMissingEvidence.map((entry) => entry.missing_evidence_id),
  ];
  const overallUncertaintyIds = residualUncertainty.map((entry) => entry.uncertainty_id);
  let overallStatus: KernelFindingStatusValue;
  if (overallContradictionIds.length > 0) {
    overallStatus = KERNEL_FINDING_STATUS_VALUES.CONTRADICTED;
  } else if (overallMissingIds.length > 0) {
    overallStatus = KERNEL_FINDING_STATUS_VALUES.INSUFFICIENT_EVIDENCE;
  } else if (
    supportability.some(
      (entry) =>
        entry.supportability === KERNEL_FINDING_STATUS_VALUES.UNSUPPORTED &&
        entry.profile_admissibility === PROFILE_ADMISSIBILITY_VALUES.ADMISSIBLE,
    )
  ) {
    overallStatus = KERNEL_FINDING_STATUS_VALUES.UNSUPPORTED;
  } else {
    overallStatus = KERNEL_FINDING_STATUS_VALUES.SUPPORTED;
  }

  supportability.push({
    conclusion_id: "overall_production_evidence_readiness",
    summary: "Overall production evidence readiness basis",
    supportability: overallStatus,
    profile_admissibility: PROFILE_ADMISSIBILITY_VALUES.ADMISSIBLE,
    evidence_refs: sortStrings(evidenceItems.flatMap((item) => item.evidence_refs)),
    contradiction_ids: overallContradictionIds,
    missing_evidence_ids: overallMissingIds,
    residual_uncertainty_ids: overallUncertaintyIds,
    rationale:
      "the overall bounded conclusion is derived from applicable family assessments, contradictions, explicit missing evidence, and residual uncertainty",
  });

  const humanReviewItems: EvidenceAssuranceHumanReviewItem[] = [];
  for (const contradiction of familyEvaluationResult.contradictions) {
    humanReviewItems.push({
      review_item_id: `review:${contradiction.contradiction_id}`,
      priority: "high",
      summary: contradiction.summary,
      evidence_refs: contradiction.evidence_refs,
    });
  }

  for (const missing of conclusionSpecificMissingEvidence) {
    humanReviewItems.push({
      review_item_id: `review:${missing.missing_evidence_id}`,
      priority: "medium",
      summary: missing.summary,
      evidence_refs: missing.evidence_refs,
    });
  }

  const resultCore = {
    subject: {
      subject_id: input.pack.pack_id,
      subject_type: input.pack.pack_type,
      workflow_id: asString(asRecord(input.pack.workflow).workflow_id),
      workflow_name: asString(asRecord(input.pack.workflow).workflow_name),
    },
    profile: profileBundle.profile,
    review_scope: profileBundle.review_scope,
    sources,
    claims,
    observations,
    evidence_items: evidenceItems,
    verifications,
    family_requirements: profileBundle.family_requirements,
    supportability,
    contradictions: familyEvaluationResult.contradictions,
    structural_missing_evidence: structuralMissingEvidence,
    conclusion_specific_missing_evidence: conclusionSpecificMissingEvidence,
    residual_uncertainty: residualUncertainty,
    human_review_items: humanReviewItems.sort((left, right) =>
      left.review_item_id.localeCompare(right.review_item_id),
    ),
    provenance: {
      source_pack_id: input.pack.pack_id,
      source_pack_hash: asString(asRecord(input.pack.provenance).source_pack_hash),
      evidence_refs: sortStrings(evidenceItems.flatMap((item) => item.evidence_refs)),
    },
    determinism_metadata: {
      deterministic: true as const,
      canonicalization_version: "stable-json-v1" as const,
      input_hash: hashValue({
        pack: input.pack,
        normalized_records: normalizedRecords,
        external_assurance_reports: reports,
        review_scope: profileBundle.review_scope,
      }),
    },
    version_metadata: {
      kernel_version: EVIDENCE_ASSURANCE_KERNEL_VERSION,
      profile_version: PRODUCTION_EVIDENCE_READINESS_PROFILE_VERSION,
      verifier_versions: collectExternalVerifierVersions(normalizedRecords, reports),
    },
  };

  return {
    ...resultCore,
    integrity: {
      result_hash: hashValue(resultCore),
    },
  };
}

export function mapEvidenceAssuranceToLocalGovernancePreview(
  result: EvidenceAssuranceResult,
): LocalGovernanceMappingPreview {
  const supportedCount = result.supportability.filter(
    (entry) => entry.supportability === KERNEL_FINDING_STATUS_VALUES.SUPPORTED,
  ).length;
  const contradictedCount = result.supportability.filter(
    (entry) => entry.supportability === KERNEL_FINDING_STATUS_VALUES.CONTRADICTED,
  ).length;
  const reasonCodes = sortStrings([
    contradictedCount > 0 ? "kernel:contradiction_visible" : "",
    result.conclusion_specific_missing_evidence.length > 0
      ? "kernel:conclusion_specific_missing_evidence"
      : "",
    result.structural_missing_evidence.length > 0
      ? "kernel:structural_missing_evidence"
      : "",
    supportedCount > 0 ? "kernel:supported_conclusion_present" : "",
    result.residual_uncertainty.length > 0 ? "kernel:residual_uncertainty_present" : "",
  ].filter(Boolean));

  return {
    mapping_id: `governance-mapping:${result.subject.subject_id}`,
    default_off: true,
    public_contract_changed: false,
    governance_reasoning_inputs: {
      reason_codes: reasonCodes,
      missing_evidence: [
        ...result.structural_missing_evidence,
        ...result.conclusion_specific_missing_evidence,
      ].map((item) => ({
        category: item.kind,
        message: item.summary,
        evidence_refs: item.evidence_refs,
      })),
      human_review_requirements: result.human_review_items.map((item) => ({
        summary: item.summary,
        evidence_refs: item.evidence_refs,
      })),
      decision_notes: [
        "kernel findings remain internal and default-off",
        "the released GovernanceReportModel public contract remains unchanged",
        "final governance verdict ownership stays outside the kernel",
      ],
    },
  };
}

export function buildProductionEvidenceReadinessReviewPreview(
  result: EvidenceAssuranceResult,
): ProductionEvidenceReadinessReviewPreview {
  return {
    review_subject: result.subject,
    review_scope: result.review_scope,
    profile: result.profile,
    evidence_inventory: result.evidence_items.map((item) => ({
      evidence_item_id: item.evidence_item_id,
      family_id: item.family_id,
      summary: item.summary,
      source_id: item.source_id,
      evidence_refs: item.evidence_refs,
    })),
    source_map: result.sources,
    verification_posture: result.verifications,
    supportability: result.supportability,
    missing_evidence: [
      ...result.structural_missing_evidence,
      ...result.conclusion_specific_missing_evidence,
    ],
    contradictions: result.contradictions,
    residual_uncertainty: result.residual_uncertainty,
    human_review_items: result.human_review_items,
    provenance: result.provenance,
    integrity: result.integrity,
  };
}
