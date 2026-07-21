/**
 * Minimal External Evidence Assurance Service API v0.1 type-only contracts.
 *
 * These contracts are transport-neutral, additive-only, producer-neutral, and
 * intentionally not publicly exported from guard-core. They provide no runtime
 * implementation, HTTP mapping, persistence, queue, authentication, tenant
 * isolation, billing, approval, blocking, deployment, or certification authority.
 */

import type {
  AdapterManifest,
  EvidencePackage,
  VerificationJob,
  VerificationRequest,
  VerificationRequestReference,
} from "./verificationTypes";
import type { AdapterRegistryMappingSupport } from "./registryTypes";

/**
 * `submission_schema_version` versions only this composition contract; it is
 * not a transport, HTTP media type, or runtime deployment version. Array types
 * do not enforce nonempty candidates, uniqueness, selection, or compatibility.
 * Candidates are supplied explicitly by the caller; this type does not perform
 * identity validation.
 */
export interface VerificationJobSubmissionEnvelope {
  submission_schema_version: "0.1";
  verification_request: VerificationRequest;
  evidence_package: EvidencePackage;
  adapter_manifest_candidates: AdapterManifest[];
  required_mapping_capabilities: (keyof AdapterRegistryMappingSupport)[];
}

/**
 * A new-job disposition means only that a logical job was established. An
 * existing-job disposition means only that the idempotency boundary resolved
 * to that job. Neither implies execution start or completion, artifact
 * availability, evidence validity, approval, or billing, and resolution does
 * not create a new attempt, result, report, or usage artifact.
 */
export type VerificationJobSubmissionDisposition =
  | "created_new_job"
  | "resolved_existing_job";

/**
 * `available` means the artifact exists. `not_yet_available` means a
 * nonterminal job may still produce it. `not_produced` means a terminal job did
 * not produce it. `not_found` means the resource does not exist or may be
 * invisible under a future authorization boundary. No authorization, tenant
 * hiding, or enumeration protection is implemented by these types.
 */
export type VerificationArtifactAvailability =
  | "available"
  | "not_yet_available"
  | "not_produced"
  | "not_found";

export type VerificationPreAcceptanceProblemCategory =
  | "malformed_submission"
  | "evidence_binding_mismatch"
  | "adapter_selection_failed"
  | "unsupported_compatibility"
  | "idempotency_conflict";

export type VerificationArtifactProblemCategory =
  | "resource_not_found"
  | "artifact_not_yet_available"
  | "artifact_not_produced"
  | "internal_verification_service_error";

export type VerificationSubmissionProblemCategory =
  | VerificationPreAcceptanceProblemCategory
  | "internal_verification_service_error";

/**
 * Service problems are not verification findings. Unsupported compatibility
 * does not designate a producer as untrusted, and an internal service error
 * does not establish that evidence is invalid.
 */
export type VerificationServiceProblemCategory =
  | VerificationPreAcceptanceProblemCategory
  | VerificationArtifactProblemCategory;

/** Correlation remains the responsibility of each specific response shape. */
export interface VerificationServiceProblem<
  TCategory extends VerificationServiceProblemCategory =
    VerificationServiceProblemCategory
> {
  problem_category: TCategory;
  summary: string;
  details?: string[];
  problem_schema_version: "0.1";
}

/**
 * `response_kind: "job"` means only that this response carries a job
 * projection, not that verification succeeded. A future behavior must keep
 * `verification_id` equal to `job.verification_id` and `request` equal to
 * `job.request`; this type-only contract does not enforce those equalities.
 * The job may have any existing status, and no result, report, attempt, or
 * usage artifact is automatically included.
 */
export interface VerificationJobSubmissionResolvedResponse {
  response_kind: "job";
  response_schema_version: "0.1";
  request: VerificationRequestReference;
  disposition: VerificationJobSubmissionDisposition;
  verification_id: string;
  job: VerificationJob;
}

/**
 * A malformed envelope may prevent formation of a request reference, so
 * `request` is optional. This variant carries no fabricated verification job
 * identity, job, disposition, attempt, result, report, usage artifact, finding,
 * or assurance report.
 */
export interface VerificationJobSubmissionProblemResponse {
  response_kind: "problem";
  response_schema_version: "0.1";
  request?: VerificationRequestReference;
  problem: VerificationServiceProblem<VerificationSubmissionProblemCategory>;
}

/** The required discriminator keeps job and problem responses distinct. */
export type VerificationJobSubmissionResponse =
  | VerificationJobSubmissionResolvedResponse
  | VerificationJobSubmissionProblemResponse;
