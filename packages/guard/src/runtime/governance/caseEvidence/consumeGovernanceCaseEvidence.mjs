import { assertValidGovernanceCaseEvidenceProfile } from "./governanceCaseEvidenceProfile.mjs";
import { assertValidGovernanceCaseEvidenceContract } from "./governanceCaseEvidenceContract.mjs";

export function consumeGovernanceCaseEvidence({
  governanceCaseEvidenceProfile,
  governanceCaseEvidenceContract,
}) {
  const profile = assertValidGovernanceCaseEvidenceProfile(
    governanceCaseEvidenceProfile
  );
  const contract = assertValidGovernanceCaseEvidenceContract(
    governanceCaseEvidenceContract
  );
  const context = profile.governance_case_evidence.evidence_context;

  return {
    consumer_surface: profile.governance_case_evidence.consumer_surface,
    case_id: context.case_id,
    evidence_status: context.evidence_status,
    evidence_mode: context.evidence_mode,
    evidence_rationale: context.evidence_rationale,
    linked_resolution_ids: context.linked_resolution_ids,
    linked_escalation_ids: context.linked_escalation_ids,
    linked_closure_ids: context.linked_closure_ids,
    linked_exception_ids: context.linked_exception_ids,
    linked_override_record_ids: context.linked_override_record_ids,
    support_readiness: context.support_readiness,
    supporting_artifact_only: contract.supporting_artifact_only === true,
    recommendation_only: contract.recommendation_only === true,
    additive_only: contract.additive_only === true,
    executing: false,
  };
}
