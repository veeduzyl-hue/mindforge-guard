import { GITHUB_ACTIONS_SEMANTIC_ADAPTER } from "./githubActionsAdapter.ts";
import { HARNESS_SEMANTIC_ADAPTER } from "./harnessAdapter.ts";
import {
  PRODUCER_ADAPTER_ERROR_CODES,
  ProducerAdapterError,
  type EvidenceProducerAdapter,
  type ProducerSemanticInput,
} from "./types.ts";

export const EVIDENCE_PRODUCER_ADAPTERS: readonly EvidenceProducerAdapter[] = [
  GITHUB_ACTIONS_SEMANTIC_ADAPTER,
  HARNESS_SEMANTIC_ADAPTER,
].sort((left, right) => left.adapterId.localeCompare(right.adapterId));

export function resolveEvidenceProducerAdapter(input: unknown): EvidenceProducerAdapter {
  const matches = EVIDENCE_PRODUCER_ADAPTERS.filter((adapter) => adapter.canHandle(input));
  if (matches.length === 0) {
    throw new ProducerAdapterError(
      PRODUCER_ADAPTER_ERROR_CODES.UNSUPPORTED_PRODUCER,
      "no local MESR evidence producer adapter can handle the input",
    );
  }
  if (matches.length > 1) {
    throw new ProducerAdapterError(
      PRODUCER_ADAPTER_ERROR_CODES.AMBIGUOUS_PRODUCER_ADAPTER,
      `multiple adapters matched: ${matches.map((entry) => entry.adapterId).join(",")}`,
    );
  }
  return matches[0];
}

export function normalizeProducerEvidence(input: unknown): ProducerSemanticInput {
  return resolveEvidenceProducerAdapter(input).normalize(input);
}
