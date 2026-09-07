import type { CanonicalSemanticSnapshot, MesrSemanticProjection } from "./types.ts";

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

export function createCanonicalSemanticSnapshot(
  projection: MesrSemanticProjection,
): CanonicalSemanticSnapshot {
  return {
    core_semantic_ids: sortedUnique(projection.semantic_ids.filter((id) => id.startsWith("mesr.core."))),
    support_relations: projection.claim_support_relations
      .map((entry) => ({
        claim_id: entry.claim_id,
        relation: entry.relation,
        semantic_ids: sortedUnique(entry.semantic_ids),
        satisfied_bindings: sortedUnique(entry.satisfied_bindings),
        missing_bindings: sortedUnique(entry.missing_bindings),
      }))
      .sort((left, right) => left.claim_id.localeCompare(right.claim_id)),
    claim_boundaries: sortedUnique(projection.claim_boundaries_applied),
    binding_statuses: [...(projection.reason_code_bindings ?? [])]
      .map((entry) => ({ reason_code: entry.reason_code, binding_status: entry.binding_status, required: entry.required }))
      .sort((left, right) => left.reason_code.localeCompare(right.reason_code)),
    explicit_non_claims: sortedUnique(projection.explicit_non_claims),
    subject_effect_bindings: [...(projection.subject_effect_bindings ?? [])]
      .map((entry) => ({
        semantic_id: entry.semantic_id,
        binding: entry.binding,
        value: Array.isArray(entry.value) ? sortedUnique(entry.value) : entry.value,
      }))
      .sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right))),
  };
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, canonicalize(item)]),
    );
  }
  return value;
}

export function serializeCanonicalSemanticSnapshot(snapshot: CanonicalSemanticSnapshot): string {
  return JSON.stringify(canonicalize(snapshot));
}
