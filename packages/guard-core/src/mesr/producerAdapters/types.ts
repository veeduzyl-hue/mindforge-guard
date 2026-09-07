import type { MesrSemanticProjection } from "../types.ts";

export const PRODUCER_ADAPTER_ERROR_CODES = {
  UNSUPPORTED_PRODUCER: "UNSUPPORTED_PRODUCER",
  UNSUPPORTED_PRODUCER_VERSION: "UNSUPPORTED_PRODUCER_VERSION",
  INVALID_PRODUCER_INPUT: "INVALID_PRODUCER_INPUT",
  AMBIGUOUS_PRODUCER_ADAPTER: "AMBIGUOUS_PRODUCER_ADAPTER",
} as const;

export type ProducerAdapterErrorCode =
  (typeof PRODUCER_ADAPTER_ERROR_CODES)[keyof typeof PRODUCER_ADAPTER_ERROR_CODES];

export class ProducerAdapterError extends Error {
  readonly code: ProducerAdapterErrorCode;

  constructor(code: ProducerAdapterErrorCode, message: string) {
    super(`${code}: ${message}`);
    this.name = "ProducerAdapterError";
    this.code = code;
  }
}

export interface SemanticFactProvenance {
  semantic_fact: string;
  producer_id: string;
  producer_schema_version: string;
  adapter_id: string;
  adapter_version: string;
  native_field: string;
}

export interface ProducerSemanticInput {
  producer: {
    producer_id: string;
    producer_schema_version: string;
    adapter_id: string;
    adapter_version: string;
    mesr_core_compatibility: string;
  };
  subject: {
    subject_ref: string | null;
    repository: string | null;
    base_revision: string | null;
    candidate_revision: string | null;
    changed_paths: readonly string[];
    actor: string | null;
    action: string | null;
  };
  authority: {
    source: string | null;
    scope: readonly string[];
    valid_time: string | null;
  };
  verification: {
    executed: boolean | null;
    result: "passed" | "failed" | null;
    subject_revision: string | null;
    method: string | null;
    observed_at: string | null;
  };
  artifact: {
    identity: string | null;
    digest: string | null;
    subject_revision: string | null;
  };
  review: {
    exists: boolean | null;
    reviewer: string | null;
    subject_revision: string | null;
    scope: readonly string[];
    authority_ref: string | null;
    reviewed_at: string | null;
  };
  release: {
    identity: string | null;
    subject_revision: string | null;
    artifact_digest: string | null;
  };
  effect: {
    observed: boolean | null;
    release_identity: string | null;
    subject_revision: string | null;
    environment: string | null;
    before_state: string | null;
    after_state: string | null;
    observed_at: string | null;
  };
  producer_claims: {
    approval_record_present: boolean;
    verification_claim_present: boolean;
  };
  provenance: readonly SemanticFactProvenance[];
  producer_native_metadata: Readonly<Record<string, unknown>>;
}

export interface EvidenceProducerAdapter {
  producerId: string;
  adapterId: string;
  adapterVersion: string;
  supportedProducerSchemaVersions: readonly string[];
  mesrCoreCompatibility: string;
  canHandle(input: unknown): boolean;
  normalize(input: unknown): ProducerSemanticInput;
}

export interface ProducerSemanticProjectionResult {
  normalized: ProducerSemanticInput;
  projection: MesrSemanticProjection;
}
