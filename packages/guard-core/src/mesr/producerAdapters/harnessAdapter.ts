import {
  PRODUCER_ADAPTER_ERROR_CODES,
  ProducerAdapterError,
  type EvidenceProducerAdapter,
  type ProducerSemanticInput,
  type SemanticFactProvenance,
} from "./types.ts";

export const HARNESS_EVIDENCE_PACK_SCHEMA_VERSION =
  "harness-evidence-pack/v0.1" as const;

const PRODUCER_ID = "guard-native-agent-harness-local";
const ADAPTER_ID = "mesr.adapter.guard-native-harness";
const ADAPTER_VERSION = "0.1.0";
const CORE_COMPATIBILITY = ">=0.1.0 <0.2.0";
const SUPPORTED_SCHEMAS = [HARNESS_EVIDENCE_PACK_SCHEMA_VERSION] as const;

type UnknownRecord = Record<string, unknown>;
type LocatedClaim = { value: string; pointer: string; record: UnknownRecord };

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as UnknownRecord
    : {};
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function recordsFrom(input: UnknownRecord): UnknownRecord[] {
  return Array.isArray(input.records) ? input.records.map(asRecord) : [];
}

function claimsFrom(record: UnknownRecord): UnknownRecord[] {
  return Array.isArray(record.claims) ? record.claims.map(asRecord) : [];
}

function locatedClaims(records: readonly UnknownRecord[], claimType: string): LocatedClaim[] {
  const matches: LocatedClaim[] = [];
  records.forEach((record, recordIndex) => {
    claimsFrom(record).forEach((claim, claimIndex) => {
      if (claim.claim_type === claimType) {
        const value = asString(claim.detail);
        if (value) matches.push({
          value,
          pointer: `/records/${recordIndex}/claims/${claimIndex}/detail`,
          record,
        });
      }
    });
  });
  return matches;
}

function firstClaim(records: readonly UnknownRecord[], claimType: string): LocatedClaim | null {
  return locatedClaims(records, claimType)[0] ?? null;
}

function firstSubjectValue(records: readonly UnknownRecord[], key: string): { value: string; pointer: string } | null {
  for (let index = 0; index < records.length; index += 1) {
    const value = asString(asRecord(records[index].subject)[key]);
    if (value) return { value, pointer: `/records/${index}/subject/${key}` };
  }
  return null;
}

function booleanClaim(claim: LocatedClaim | null): boolean | null {
  if (!claim) return null;
  if (claim.value === "true") return true;
  if (claim.value === "false") return false;
  return null;
}

function resultClaim(claim: LocatedClaim | null): "passed" | "failed" | null {
  if (claim?.value === "passed") return "passed";
  if (claim?.value === "failed") return "failed";
  return null;
}

function addProvenance(
  target: SemanticFactProvenance[],
  semanticFact: string,
  located: LocatedClaim | { value: string; pointer: string } | null,
): void {
  if (!located) return;
  target.push({
    semantic_fact: semanticFact,
    producer_id: PRODUCER_ID,
    producer_schema_version: HARNESS_EVIDENCE_PACK_SCHEMA_VERSION,
    adapter_id: ADAPTER_ID,
    adapter_version: ADAPTER_VERSION,
    native_field: located.pointer,
  });
}

function normalizeHarness(input: unknown): ProducerSemanticInput {
  const pack = asRecord(input);
  const declaredVersion = asString(pack.pack_version);
  const schemaVersion = declaredVersion ? `harness-evidence-pack/v${declaredVersion}` : null;
  if (schemaVersion !== HARNESS_EVIDENCE_PACK_SCHEMA_VERSION) {
    throw new ProducerAdapterError(
      PRODUCER_ADAPTER_ERROR_CODES.UNSUPPORTED_PRODUCER_VERSION,
      `guard-native Harness schema ${schemaVersion ?? "unresolved"} is not supported`,
    );
  }
  const records = recordsFrom(pack);
  if (records.length === 0) {
    throw new ProducerAdapterError(
      PRODUCER_ADAPTER_ERROR_CODES.INVALID_PRODUCER_INPUT,
      "guard-native Harness evidence pack must contain records",
    );
  }

  const repositoryClaim = firstClaim(records, "repository");
  const baseClaim = firstClaim(records, "base_revision");
  const candidateClaim = firstClaim(records, "candidate_revision");
  const changedPathClaims = locatedClaims(records, "changed_path");
  const actorSubject = firstSubjectValue(records, "agent_id");
  const taskSubject = firstSubjectValue(records, "task_id");
  const actionClaim = firstClaim(records, "change_action") ?? firstClaim(records, "tool_invocation");
  const authoritySourceClaim = firstClaim(records, "declared_authority_source");
  const authorityScopeClaims = locatedClaims(records, "declared_authority_scope");
  const authorityTimeClaim = firstClaim(records, "declared_authority_valid_at");
  const executedClaim = firstClaim(records, "verification_executed");
  const result = firstClaim(records, "verification_result");
  const verificationSubject = firstClaim(records, "verification_subject_revision");
  const verificationMethod = firstClaim(records, "verification_method");
  const verificationTime = firstClaim(records, "verification_observed_at");
  const commandRecordIndex = records.findIndex((record) => record.evidence_type === "command_result");
  const commandRecord = commandRecordIndex >= 0 ? records[commandRecordIndex] : null;
  const commandExecution = commandRecord && asRecord(commandRecord.assurance).execution_evidence === "provided"
    ? { value: "true", pointer: `/records/${commandRecordIndex}/assurance/execution_evidence` }
    : null;
  const artifactIdentity = firstClaim(records, "artifact_identity");
  const artifactDigest = firstClaim(records, "artifact_digest");
  const artifactSubject = firstClaim(records, "artifact_subject_revision");
  const rawReferenceRecordIndex = records.findIndex((record) => asString(asRecord(record.raw_reference).digest_sha256));
  const rawDigest = rawReferenceRecordIndex >= 0
    ? {
        value: asString(asRecord(records[rawReferenceRecordIndex].raw_reference).digest_sha256) as string,
        pointer: `/records/${rawReferenceRecordIndex}/raw_reference/digest_sha256`,
      }
    : null;
  const reviewExists = firstClaim(records, "review_exists");
  const reviewer = firstClaim(records, "reviewer");
  const reviewSubject = firstClaim(records, "review_subject_revision");
  const reviewScope = locatedClaims(records, "review_scope");
  const reviewAuthority = firstClaim(records, "review_authority_ref");
  const reviewTime = firstClaim(records, "reviewed_at");
  const releaseIdentity = firstClaim(records, "release_identity");
  const releaseSubject = firstClaim(records, "release_subject_revision");
  const releaseDigest = firstClaim(records, "release_artifact_digest");
  const effectObserved = firstClaim(records, "effect_observed");
  const effectRelease = firstClaim(records, "effect_release_identity");
  const effectSubject = firstClaim(records, "effect_subject_revision");
  const effectEnvironment = firstClaim(records, "effect_environment");
  const effectBefore = firstClaim(records, "effect_before_state");
  const effectAfter = firstClaim(records, "effect_after_state");
  const effectTime = firstClaim(records, "effect_observed_at");
  const approvalRecord = firstClaim(records, "approval_record");

  const provenance: SemanticFactProvenance[] = [];
  addProvenance(provenance, "subject.repository", repositoryClaim);
  addProvenance(provenance, "subject.base_revision", baseClaim);
  addProvenance(provenance, "subject.candidate_revision", candidateClaim);
  changedPathClaims.forEach((entry) => addProvenance(provenance, "subject.changed_paths", entry));
  addProvenance(provenance, "subject.actor", actorSubject);
  addProvenance(provenance, "subject.action", actionClaim);
  addProvenance(provenance, "authority.source", authoritySourceClaim);
  authorityScopeClaims.forEach((entry) => addProvenance(provenance, "authority.scope", entry));
  addProvenance(provenance, "authority.valid_time", authorityTimeClaim);
  addProvenance(provenance, "verification.executed", executedClaim ?? commandExecution);
  addProvenance(provenance, "verification.result", result);
  addProvenance(provenance, "verification.subject_revision", verificationSubject);
  addProvenance(provenance, "verification.method", verificationMethod);
  addProvenance(provenance, "verification.observed_at", verificationTime);
  addProvenance(provenance, "artifact.identity", artifactIdentity);
  addProvenance(provenance, "artifact.digest", artifactDigest ?? rawDigest);
  addProvenance(provenance, "artifact.subject_revision", artifactSubject);
  addProvenance(provenance, "review.exists", reviewExists);
  addProvenance(provenance, "review.reviewer", reviewer);
  addProvenance(provenance, "review.subject_revision", reviewSubject);
  reviewScope.forEach((entry) => addProvenance(provenance, "review.scope", entry));
  addProvenance(provenance, "review.authority_ref", reviewAuthority);
  addProvenance(provenance, "review.reviewed_at", reviewTime);
  addProvenance(provenance, "release.identity", releaseIdentity);
  addProvenance(provenance, "release.subject_revision", releaseSubject);
  addProvenance(provenance, "release.artifact_digest", releaseDigest);
  addProvenance(provenance, "effect.observed", effectObserved);
  addProvenance(provenance, "effect.release_identity", effectRelease);
  addProvenance(provenance, "effect.subject_revision", effectSubject);
  addProvenance(provenance, "effect.environment", effectEnvironment);
  addProvenance(provenance, "effect.before_state", effectBefore);
  addProvenance(provenance, "effect.after_state", effectAfter);
  addProvenance(provenance, "effect.observed_at", effectTime);

  const repository = repositoryClaim?.value ?? null;
  const candidateRevision = candidateClaim?.value ?? null;
  return {
    producer: {
      producer_id: PRODUCER_ID,
      producer_schema_version: schemaVersion,
      adapter_id: ADAPTER_ID,
      adapter_version: ADAPTER_VERSION,
      mesr_core_compatibility: CORE_COMPATIBILITY,
    },
    subject: {
      subject_ref: repository && candidateRevision
        ? `software-change:${repository}:${candidateRevision}`
        : taskSubject?.value ?? null,
      repository,
      base_revision: baseClaim?.value ?? null,
      candidate_revision: candidateRevision,
      changed_paths: changedPathClaims.map((entry) => entry.value).sort(),
      actor: actorSubject?.value ?? null,
      action: actionClaim?.value ?? null,
    },
    authority: {
      source: authoritySourceClaim?.value ?? null,
      scope: authorityScopeClaims.map((entry) => entry.value).sort(),
      valid_time: authorityTimeClaim?.value ?? null,
    },
    verification: {
      executed: booleanClaim(executedClaim) ?? (commandExecution ? true : null),
      result: resultClaim(result),
      subject_revision: verificationSubject?.value ?? null,
      method: verificationMethod?.value ?? asString(commandRecord?.source),
      observed_at: verificationTime?.value ?? asString(commandRecord?.timestamp),
    },
    artifact: {
      identity: artifactIdentity?.value ?? (rawReferenceRecordIndex >= 0 ? asString(records[rawReferenceRecordIndex].record_id) : null),
      digest: artifactDigest?.value ?? rawDigest?.value ?? null,
      subject_revision: artifactSubject?.value ?? null,
    },
    review: {
      exists: booleanClaim(reviewExists),
      reviewer: reviewer?.value ?? null,
      subject_revision: reviewSubject?.value ?? null,
      scope: reviewScope.map((entry) => entry.value).sort(),
      authority_ref: reviewAuthority?.value ?? null,
      reviewed_at: reviewTime?.value ?? null,
    },
    release: {
      identity: releaseIdentity?.value ?? null,
      subject_revision: releaseSubject?.value ?? null,
      artifact_digest: releaseDigest?.value ?? null,
    },
    effect: {
      observed: booleanClaim(effectObserved),
      release_identity: effectRelease?.value ?? null,
      subject_revision: effectSubject?.value ?? null,
      environment: effectEnvironment?.value ?? null,
      before_state: effectBefore?.value ?? null,
      after_state: effectAfter?.value ?? null,
      observed_at: effectTime?.value ?? null,
    },
    producer_claims: {
      approval_record_present: approvalRecord?.value === "approved",
      verification_claim_present: Boolean(executedClaim || result || commandExecution),
    },
    provenance,
    producer_native_metadata: {
      pack_id: asString(pack.pack_id),
      generated_at: asString(pack.generated_at),
      record_ids: records.map((record) => asString(record.record_id)).filter(Boolean),
      source_ids: records.map((record) => asString(record.source_id)).filter(Boolean),
      source_schemas: records.map((record) => asString(record.source_schema)).filter(Boolean),
      tool_names: records.map((record) => asString(asRecord(record.subject).tool_name)).filter(Boolean),
    },
  };
}

export const HARNESS_SEMANTIC_ADAPTER: EvidenceProducerAdapter = {
  producerId: PRODUCER_ID,
  adapterId: ADAPTER_ID,
  adapterVersion: ADAPTER_VERSION,
  supportedProducerSchemaVersions: SUPPORTED_SCHEMAS,
  mesrCoreCompatibility: CORE_COMPATIBILITY,
  canHandle(input: unknown): boolean {
    const pack = asRecord(input);
    const records = recordsFrom(pack);
    return pack.producer === PRODUCER_ID ||
      records.some((record) => record.source === PRODUCER_ID) ||
      asString(pack.pack_id)?.startsWith("harness-") === true;
  },
  normalize: normalizeHarness,
};
