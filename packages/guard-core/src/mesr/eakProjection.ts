import {
  KERNEL_FINDING_STATUS_VALUES,
  type EvidenceAssuranceResult,
} from "../evidenceAssuranceKernel.ts";
import { MESR_REASON_CODE_BINDINGS } from "./reasonCodeBindings.ts";
import { evaluateMesrClaimSupport } from "./supportEvaluator.ts";
import type {
  MesrClaimSupportRequest,
  MesrClaimSupportResult,
  MesrReasonCodeBinding,
  MesrSemanticProjection,
} from "./types.ts";
import type { GuardReasonCode } from "../reasonCodes.ts";

export interface MesrEakProjectionInput {
  result: EvidenceAssuranceResult;
  claims: Readonly<Record<string, MesrClaimSupportRequest & { observed_state_ids?: readonly string[] }>>;
  reason_codes?: readonly GuardReasonCode[];
}

export function projectEvidenceAssuranceResultToMesr(
  input: MesrEakProjectionInput,
): MesrSemanticProjection {
  const claimSupportRelations: MesrClaimSupportResult[] = input.result.supportability.map((supportability) => {
    const request = input.claims[supportability.conclusion_id] ?? {
      claim_id: supportability.conclusion_id,
      semantic_ids: [],
      provided_bindings: {},
      required_bindings: [],
      evidence_refs: supportability.evidence_refs,
    };

    if (supportability.supportability === KERNEL_FINDING_STATUS_VALUES.CONTRADICTED) {
      return evaluateMesrClaimSupport({
        ...request,
        contradicted_claims: [...(request.contradicted_claims ?? []), request.claim_id],
      });
    }

    if (
      supportability.supportability === KERNEL_FINDING_STATUS_VALUES.INSUFFICIENT_EVIDENCE ||
      supportability.supportability === KERNEL_FINDING_STATUS_VALUES.INADMISSIBLE
    ) {
      const evaluated = evaluateMesrClaimSupport({ ...request, observed_state_ids: [] });
      return { ...evaluated, relation: "indeterminate", rationale_code: "EAK_BASIS_INSUFFICIENT_OR_INADMISSIBLE" };
    }

    if (supportability.supportability === KERNEL_FINDING_STATUS_VALUES.UNSUPPORTED) {
      const evaluated = evaluateMesrClaimSupport(request);
      return evaluated.relation === "does_not_support"
        ? evaluated
        : { ...evaluated, relation: "indeterminate", rationale_code: "EAK_UNSUPPORTED_WITHOUT_BOUNDARY" };
    }

    return evaluateMesrClaimSupport(request);
  });

  const reasonCodeSet = new Set(input.reason_codes ?? []);
  const reasonCodeBindings: MesrReasonCodeBinding[] = MESR_REASON_CODE_BINDINGS.filter((entry) =>
    reasonCodeSet.has(entry.reason_code),
  );

  return {
    semantic_ids: [...new Set(claimSupportRelations.flatMap((entry) => entry.semantic_ids))].sort(),
    claim_support_relations: [...claimSupportRelations].sort((left, right) => left.claim_id.localeCompare(right.claim_id)),
    claim_boundaries_applied: [...new Set(claimSupportRelations.flatMap((entry) => entry.claim_boundaries_applied))].sort(),
    explicit_non_claims: [...new Set([
      ...claimSupportRelations.flatMap((entry) => entry.explicit_non_claims),
      ...reasonCodeBindings.flatMap((entry) => entry.explicit_non_claims),
    ])].sort(),
    semantic_provenance: [
      `eak:${input.result.version_metadata.kernel_version}`,
      `eak-result:${input.result.integrity.result_hash}`,
      "mesr-projection:0.1.0",
    ],
    reason_code_bindings: reasonCodeBindings,
  };
}
