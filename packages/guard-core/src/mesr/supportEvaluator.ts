import { MESR_CLAIM_BOUNDARIES } from "./claimBoundaries.ts";
import { MESR_CORE_REGISTRY } from "./coreRegistry.ts";
import { MESR_SOFTWARE_DOMAIN_SEED } from "./softwareDomainSeed.ts";
import {
  MESR_SUPPORT_RELATIONS,
  type MesrClaimSupportRequest,
  type MesrClaimSupportResult,
  type MesrSemanticEntry,
} from "./types.ts";

export const MESR_SUPPORT_EVALUATOR_VERSION = "0.1.0" as const;

type ExtendedSupportRequest = MesrClaimSupportRequest & {
  observed_state_ids?: readonly string[];
};

const DEFAULT_SEMANTICS = [...MESR_CORE_REGISTRY, ...MESR_SOFTWARE_DOMAIN_SEED] as const;

function isPresent(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "";
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

export function evaluateMesrClaimSupport(
  request: ExtendedSupportRequest,
  semanticEntries: readonly MesrSemanticEntry[] = DEFAULT_SEMANTICS,
): MesrClaimSupportResult {
  const semanticById = new Map(semanticEntries.map((entry) => [entry.semantic_id, entry]));
  const resolvedEntries = request.semantic_ids
    .map((semanticId) => semanticById.get(semanticId))
    .filter((entry): entry is MesrSemanticEntry => Boolean(entry));
  const missingBindings = sortedUnique(
    request.required_bindings.filter((binding) => !isPresent(request.provided_bindings[binding])),
  );
  const satisfiedBindings = sortedUnique(
    request.required_bindings.filter((binding) => isPresent(request.provided_bindings[binding])),
  );
  const observedStates = sortedUnique(request.observed_state_ids ?? []);
  const applicableBoundaries = MESR_CLAIM_BOUNDARIES.filter(
    (entry) => observedStates.includes(entry.evidence_or_state_id) && entry.does_not_support === request.claim_id,
  );
  const activeBoundaries = applicableBoundaries.filter((entry) =>
    entry.required_additional_bindings.some(
      (binding) => !isPresent(request.provided_bindings[binding]),
    ),
  );
  const explicitNonClaims = sortedUnique([
    ...resolvedEntries.flatMap((entry) => entry.does_not_support),
    ...applicableBoundaries.map((entry) => entry.does_not_support),
  ]);
  const common = {
    claim_id: request.claim_id,
    semantic_ids: sortedUnique(request.semantic_ids),
    claim_boundaries_applied: sortedUnique(activeBoundaries.map((entry) => entry.boundary_id)),
    explicit_non_claims: explicitNonClaims,
    satisfied_bindings: satisfiedBindings,
    missing_bindings: missingBindings,
    evidence_refs: sortedUnique(request.evidence_refs ?? []),
    evaluator_version: request.evaluator_version ?? MESR_SUPPORT_EVALUATOR_VERSION,
  };

  if ((request.contradicted_claims ?? []).includes(request.claim_id)) {
    return { ...common, relation: MESR_SUPPORT_RELATIONS.CONTRADICTS, rationale_code: "EXPLICIT_CONTRADICTION" };
  }

  if (activeBoundaries.length > 0) {
    return { ...common, relation: MESR_SUPPORT_RELATIONS.DOES_NOT_SUPPORT, rationale_code: "REGISTERED_CLAIM_BOUNDARY" };
  }

  if (resolvedEntries.length !== request.semantic_ids.length || missingBindings.length > 0) {
    return { ...common, relation: MESR_SUPPORT_RELATIONS.INDETERMINATE, rationale_code: "UNRESOLVED_SEMANTIC_OR_BINDING" };
  }

  const positiveClaims = new Set([
    ...resolvedEntries.flatMap((entry) => entry.supports),
    ...(request.supported_claim_parts ?? []),
  ]);
  const requiredClaimParts = sortedUnique(request.required_claim_parts ?? [request.claim_id]);
  const supportedParts = requiredClaimParts.filter((part) => positiveClaims.has(part));

  if (supportedParts.length === requiredClaimParts.length && requiredClaimParts.length > 0) {
    return { ...common, relation: MESR_SUPPORT_RELATIONS.SUPPORTS, rationale_code: "EXPLICIT_POSITIVE_RELATION" };
  }
  if (supportedParts.length > 0) {
    return { ...common, relation: MESR_SUPPORT_RELATIONS.PARTIALLY_SUPPORTS, rationale_code: "EXPLICIT_PARTIAL_RELATION" };
  }

  return { ...common, relation: MESR_SUPPORT_RELATIONS.INDETERMINATE, rationale_code: "NO_REGISTERED_RELATION" };
}
