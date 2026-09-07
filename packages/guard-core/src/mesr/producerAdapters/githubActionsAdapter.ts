import {
  PRODUCER_ADAPTER_ERROR_CODES,
  ProducerAdapterError,
  type EvidenceProducerAdapter,
  type ProducerSemanticInput,
  type SemanticFactProvenance,
} from "./types.ts";

export const GITHUB_ACTIONS_REAL_SCHEMA_VERSION =
  "evidence-assurance-experiment-1.1/v0.1" as const;
export const GITHUB_ACTIONS_CONTROLLED_SCHEMA_VERSION =
  "github-actions-controlled-equivalence/v0.1" as const;

const PRODUCER_ID = "github-actions";
const ADAPTER_ID = "mesr.adapter.github-actions";
const ADAPTER_VERSION = "0.1.0";
const CORE_COMPATIBILITY = ">=0.1.0 <0.2.0";
const SUPPORTED_SCHEMAS = [
  GITHUB_ACTIONS_REAL_SCHEMA_VERSION,
  GITHUB_ACTIONS_CONTROLLED_SCHEMA_VERSION,
] as const;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as UnknownRecord
    : {};
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asStrings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0)
    : [];
}

function resultValue(value: unknown): "passed" | "failed" | null {
  if (value === "passed" || value === "success") return "passed";
  if (value === "failed" || value === "failure") return "failed";
  return null;
}

function inferSchema(record: UnknownRecord): string | null {
  const declared = asString(record.schema_version);
  if (declared) return declared;
  if (
    record.classification === "REAL PRODUCER EVIDENCE / SANITIZED" &&
    record.producer === "GitHub Actions" &&
    asString(record.workflow_name) &&
    asString(record.run_id)
  ) {
    return GITHUB_ACTIONS_REAL_SCHEMA_VERSION;
  }
  return null;
}

function addProvenance(
  target: SemanticFactProvenance[],
  schemaVersion: string,
  semanticFact: string,
  nativeField: string,
  value: unknown,
): void {
  if (value === null || value === undefined || value === "") return;
  target.push({
    semantic_fact: semanticFact,
    producer_id: PRODUCER_ID,
    producer_schema_version: schemaVersion,
    adapter_id: ADAPTER_ID,
    adapter_version: ADAPTER_VERSION,
    native_field: nativeField,
  });
}

function normalizeGitHubActions(input: unknown): ProducerSemanticInput {
  const record = asRecord(input);
  const schemaVersion = inferSchema(record);
  if (!schemaVersion || !SUPPORTED_SCHEMAS.includes(schemaVersion as typeof SUPPORTED_SCHEMAS[number])) {
    throw new ProducerAdapterError(
      PRODUCER_ADAPTER_ERROR_CODES.UNSUPPORTED_PRODUCER_VERSION,
      `github-actions schema ${schemaVersion ?? "unresolved"} is not supported`,
    );
  }

  const controlled = schemaVersion === GITHUB_ACTIONS_CONTROLLED_SCHEMA_VERSION;
  const workflow = controlled ? asRecord(record.workflow_run) : record;
  const change = controlled ? asRecord(record.change) : record;
  const authority = controlled ? asRecord(record.declared_authority) : {};
  const verification = controlled ? asRecord(record.verification) : record;
  const artifact = asRecord(record.artifact);
  const review = controlled ? asRecord(record.review) : {};
  const release = controlled ? asRecord(record.release) : {};
  const effect = controlled ? asRecord(record.effect) : {};

  const repository = asString(change.repository);
  const baseRevision = asString(change.base_sha);
  const candidateRevision = asString(controlled ? change.head_sha : record.commit_sha);
  const changedPaths = asStrings(change.changed_paths).sort();
  const actor = asString(controlled ? workflow.actor : record.actor);
  const action = asString(change.action);
  const subjectRef = repository && candidateRevision
    ? `software-change:${repository}:${candidateRevision}`
    : candidateRevision;
  const verificationExecuted = controlled
    ? asBoolean(verification.executed)
    : asString(record.conclusion) !== null;
  const verificationResult = resultValue(controlled ? verification.result : record.conclusion);
  const verificationSubject = asString(controlled ? verification.commit_sha : record.commit_sha);
  const verificationMethod = asString(
    controlled ? verification.job_name : record.workflow_name,
  );
  const verificationObservedAt = asString(
    controlled ? verification.completed_at : record.completed_at,
  );
  const artifactIdentity = asString(artifact.name);
  const artifactDigest = asString(controlled ? artifact.sha256 : record.guard_computed_digest);
  const artifactSubject = asString(
    controlled ? artifact.commit_sha : artifact.workflow_run_commit_sha,
  );
  const reviewExists = asBoolean(review.exists);
  const reviewer = asString(review.reviewer);
  const reviewSubject = asString(review.commit_sha);
  const reviewScope = asStrings(review.scope).sort();
  const reviewAuthority = asString(review.authority_ref);
  const reviewedAt = asString(review.reviewed_at);
  const releaseIdentity = asString(release.release_id);
  const releaseSubject = asString(release.commit_sha);
  const releaseDigest = asString(release.artifact_sha256);
  const effectObserved = asBoolean(effect.observed);
  const effectRelease = asString(effect.release_id);
  const effectSubject = asString(effect.commit_sha);
  const effectEnvironment = asString(effect.environment);
  const effectBefore = asString(effect.before_state);
  const effectAfter = asString(effect.after_state);
  const effectObservedAt = asString(effect.observed_at);

  const provenance: SemanticFactProvenance[] = [];
  const path = (controlledPath: string, realPath: string): string => controlled ? controlledPath : realPath;
  addProvenance(provenance, schemaVersion, "subject.repository", path("/change/repository", "/repository"), repository);
  addProvenance(provenance, schemaVersion, "subject.base_revision", "/change/base_sha", baseRevision);
  addProvenance(provenance, schemaVersion, "subject.candidate_revision", path("/change/head_sha", "/commit_sha"), candidateRevision);
  addProvenance(provenance, schemaVersion, "subject.changed_paths", "/change/changed_paths", changedPaths.length ? changedPaths : null);
  addProvenance(provenance, schemaVersion, "subject.actor", path("/workflow_run/actor", "/actor"), actor);
  addProvenance(provenance, schemaVersion, "subject.action", "/change/action", action);
  addProvenance(provenance, schemaVersion, "authority.source", "/declared_authority/source", asString(authority.source));
  addProvenance(provenance, schemaVersion, "authority.scope", "/declared_authority/path_scope", asStrings(authority.path_scope).length ? asStrings(authority.path_scope) : null);
  addProvenance(provenance, schemaVersion, "authority.valid_time", "/declared_authority/valid_at", asString(authority.valid_at));
  addProvenance(provenance, schemaVersion, "verification.executed", path("/verification/executed", "/conclusion"), verificationExecuted);
  addProvenance(provenance, schemaVersion, "verification.result", path("/verification/result", "/conclusion"), verificationResult);
  addProvenance(provenance, schemaVersion, "verification.subject_revision", path("/verification/commit_sha", "/commit_sha"), verificationSubject);
  addProvenance(provenance, schemaVersion, "verification.method", path("/verification/job_name", "/workflow_name"), verificationMethod);
  addProvenance(provenance, schemaVersion, "verification.observed_at", path("/verification/completed_at", "/completed_at"), verificationObservedAt);
  addProvenance(provenance, schemaVersion, "artifact.identity", "/artifact/name", artifactIdentity);
  addProvenance(provenance, schemaVersion, "artifact.digest", path("/artifact/sha256", "/guard_computed_digest"), artifactDigest);
  addProvenance(provenance, schemaVersion, "artifact.subject_revision", path("/artifact/commit_sha", "/artifact/workflow_run_commit_sha"), artifactSubject);
  addProvenance(provenance, schemaVersion, "review.exists", "/review/exists", reviewExists);
  addProvenance(provenance, schemaVersion, "review.reviewer", "/review/reviewer", reviewer);
  addProvenance(provenance, schemaVersion, "review.subject_revision", "/review/commit_sha", reviewSubject);
  addProvenance(provenance, schemaVersion, "review.scope", "/review/scope", reviewScope.length ? reviewScope : null);
  addProvenance(provenance, schemaVersion, "review.authority_ref", "/review/authority_ref", reviewAuthority);
  addProvenance(provenance, schemaVersion, "review.reviewed_at", "/review/reviewed_at", reviewedAt);
  addProvenance(provenance, schemaVersion, "release.identity", "/release/release_id", releaseIdentity);
  addProvenance(provenance, schemaVersion, "release.subject_revision", "/release/commit_sha", releaseSubject);
  addProvenance(provenance, schemaVersion, "release.artifact_digest", "/release/artifact_sha256", releaseDigest);
  addProvenance(provenance, schemaVersion, "effect.observed", "/effect/observed", effectObserved);
  addProvenance(provenance, schemaVersion, "effect.release_identity", "/effect/release_id", effectRelease);
  addProvenance(provenance, schemaVersion, "effect.subject_revision", "/effect/commit_sha", effectSubject);
  addProvenance(provenance, schemaVersion, "effect.environment", "/effect/environment", effectEnvironment);
  addProvenance(provenance, schemaVersion, "effect.before_state", "/effect/before_state", effectBefore);
  addProvenance(provenance, schemaVersion, "effect.after_state", "/effect/after_state", effectAfter);
  addProvenance(provenance, schemaVersion, "effect.observed_at", "/effect/observed_at", effectObservedAt);

  const workflowConclusion = asString(workflow.conclusion);
  return {
    producer: {
      producer_id: PRODUCER_ID,
      producer_schema_version: schemaVersion,
      adapter_id: ADAPTER_ID,
      adapter_version: ADAPTER_VERSION,
      mesr_core_compatibility: CORE_COMPATIBILITY,
    },
    subject: {
      subject_ref: subjectRef,
      repository,
      base_revision: baseRevision,
      candidate_revision: candidateRevision,
      changed_paths: changedPaths,
      actor,
      action,
    },
    authority: {
      source: asString(authority.source),
      scope: asStrings(authority.path_scope).sort(),
      valid_time: asString(authority.valid_at),
    },
    verification: {
      executed: verificationExecuted,
      result: verificationResult,
      subject_revision: verificationSubject,
      method: verificationMethod,
      observed_at: verificationObservedAt,
    },
    artifact: {
      identity: artifactIdentity,
      digest: artifactDigest,
      subject_revision: artifactSubject,
    },
    review: {
      exists: reviewExists,
      reviewer,
      subject_revision: reviewSubject,
      scope: reviewScope,
      authority_ref: reviewAuthority,
      reviewed_at: reviewedAt,
    },
    release: {
      identity: releaseIdentity,
      subject_revision: releaseSubject,
      artifact_digest: releaseDigest,
    },
    effect: {
      observed: effectObserved,
      release_identity: effectRelease,
      subject_revision: effectSubject,
      environment: effectEnvironment,
      before_state: effectBefore,
      after_state: effectAfter,
      observed_at: effectObservedAt,
    },
    producer_claims: {
      approval_record_present: workflowConclusion === "approved" || asString(review.conclusion) === "approved",
      verification_claim_present: verificationExecuted !== null || verificationResult !== null,
    },
    provenance,
    producer_native_metadata: {
      workflow_run_id: asString(controlled ? workflow.id : record.run_id),
      workflow_name: asString(controlled ? workflow.name : record.workflow_name),
      run_attempt: controlled ? workflow.run_attempt ?? null : record.run_attempt ?? null,
      event: asString(controlled ? workflow.event : record.event),
      ref: asString(controlled ? workflow.ref : record.ref),
      job_name: asString(verification.job_name),
      artifact_id: asString(artifact.id),
      artifact_name: artifactIdentity,
    },
  };
}

export const GITHUB_ACTIONS_SEMANTIC_ADAPTER: EvidenceProducerAdapter = {
  producerId: PRODUCER_ID,
  adapterId: ADAPTER_ID,
  adapterVersion: ADAPTER_VERSION,
  supportedProducerSchemaVersions: SUPPORTED_SCHEMAS,
  mesrCoreCompatibility: CORE_COMPATIBILITY,
  canHandle(input: unknown): boolean {
    const record = asRecord(input);
    return record.producer === "GitHub Actions";
  },
  normalize: normalizeGitHubActions,
};
