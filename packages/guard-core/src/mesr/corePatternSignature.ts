import {
  MESR_CORE_VERSION,
  type MesrClaimSupportResult,
  type MesrSemanticEntry,
  type MesrSupportRelation,
} from "./types.ts";

export interface MesrCorePatternRelation {
  pattern_role: string;
  result: MesrClaimSupportResult;
}

export interface MesrCorePatternSignatureInput {
  semantic_ids: readonly string[];
  support_relations: readonly MesrCorePatternRelation[];
  required_binding_categories: readonly string[];
  transition_boundary_pattern: readonly string[];
  provenance_roles: readonly string[];
  independence_roles: readonly string[];
}

export interface CanonicalCorePatternSignature {
  core_version: typeof MESR_CORE_VERSION;
  core_semantic_ids: string[];
  semantic_families: string[];
  support_relations: Array<{
    pattern_role: string;
    relation: MesrSupportRelation;
    core_semantic_ids: string[];
    satisfied_binding_categories: string[];
    missing_binding_categories: string[];
  }>;
  claim_boundary_ids: string[];
  required_binding_categories: string[];
  transition_boundary_pattern: string[];
  provenance_roles: string[];
  independence_roles: string[];
}

export interface CanonicalCoreRegistryEntry {
  semantic_id: string;
  namespace: string;
  version: string;
  definition: string;
  status: string;
  supports: string[];
  does_not_support: string[];
  stronger_than: string[];
  weaker_than: string[];
  conflicts_with: string[];
  required_bindings: string[];
  provenance: string[];
  supersedes: string[];
  deprecated_by: string | null;
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

function semanticFamily(semanticId: string): string | null {
  const parts = semanticId.split(".");
  return parts.length >= 4 && parts[0] === "mesr" && parts[1] === "core"
    ? parts[2]
    : null;
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

export function createCanonicalCorePatternSignature(
  input: MesrCorePatternSignatureInput,
): CanonicalCorePatternSignature {
  const coreSemanticIds = sortedUnique(
    input.semantic_ids.filter((semanticId) => semanticId.startsWith("mesr.core.")),
  );
  const supportRelations = input.support_relations
    .map(({ pattern_role, result }) => ({
      pattern_role,
      relation: result.relation,
      core_semantic_ids: sortedUnique(
        result.semantic_ids.filter((semanticId) => semanticId.startsWith("mesr.core.")),
      ),
      satisfied_binding_categories: sortedUnique(result.satisfied_bindings),
      missing_binding_categories: sortedUnique(result.missing_bindings),
    }))
    .sort((left, right) => left.pattern_role.localeCompare(right.pattern_role));

  return {
    core_version: MESR_CORE_VERSION,
    core_semantic_ids: coreSemanticIds,
    semantic_families: sortedUnique(
      coreSemanticIds.map(semanticFamily).filter((value): value is string => value !== null),
    ),
    support_relations: supportRelations,
    claim_boundary_ids: sortedUnique(
      input.support_relations.flatMap(({ result }) => result.claim_boundaries_applied),
    ),
    required_binding_categories: sortedUnique(input.required_binding_categories),
    transition_boundary_pattern: sortedUnique(input.transition_boundary_pattern),
    provenance_roles: sortedUnique(input.provenance_roles),
    independence_roles: sortedUnique(input.independence_roles),
  };
}

export function serializeCanonicalCorePatternSignature(
  signature: CanonicalCorePatternSignature,
): string {
  return JSON.stringify(canonicalize(signature));
}

export function createCanonicalCoreRegistrySnapshot(
  registry: readonly MesrSemanticEntry[],
): CanonicalCoreRegistryEntry[] {
  return registry
    .map((entry) => ({
      semantic_id: entry.semantic_id,
      namespace: entry.namespace,
      version: entry.version,
      definition: entry.definition,
      status: entry.status,
      supports: sortedUnique(entry.supports),
      does_not_support: sortedUnique(entry.does_not_support),
      stronger_than: sortedUnique(entry.stronger_than),
      weaker_than: sortedUnique(entry.weaker_than),
      conflicts_with: sortedUnique(entry.conflicts_with),
      required_bindings: sortedUnique(entry.required_bindings),
      provenance: sortedUnique(entry.provenance),
      supersedes: sortedUnique(entry.supersedes),
      deprecated_by: entry.deprecated_by,
    }))
    .sort((left, right) => left.semantic_id.localeCompare(right.semantic_id));
}

export function serializeCanonicalCoreRegistrySnapshot(
  snapshot: readonly CanonicalCoreRegistryEntry[],
): string {
  return JSON.stringify(canonicalize(snapshot));
}
