import { assertValidGovernanceCaseEscalationProfile } from "./governanceCaseEscalationProfile.mjs";
import { assertValidGovernanceCaseEscalationCompatibilityContract } from "./governanceCaseEscalationCompatibilityContract.mjs";
import { assertValidGovernanceCaseEscalationStabilizationProfile } from "./governanceCaseEscalationStabilizationProfile.mjs";

export function consumeGovernanceCaseEscalation({
  governanceCaseEscalationProfile,
  governanceCaseEscalationCompatibilityContract,
  governanceCaseEscalationStabilizationProfile,
}) {
  const profile = assertValidGovernanceCaseEscalationProfile(
    governanceCaseEscalationProfile
  );
  const compatibility = assertValidGovernanceCaseEscalationCompatibilityContract(
    governanceCaseEscalationCompatibilityContract
  );
  const stabilization = assertValidGovernanceCaseEscalationStabilizationProfile(
    governanceCaseEscalationStabilizationProfile
  );
  const context = profile.governance_case_escalation.escalation_context;

  return {
    consumer_surface: profile.governance_case_escalation.consumer_surface,
    case_id: context.case_id,
    escalation_status: context.escalation_status,
    escalation_mode: context.escalation_mode,
    escalation_rationale: context.escalation_rationale,
    linked_exception_ids: context.linked_exception_ids,
    linked_override_record_ids: context.linked_override_record_ids,
    linked_resolution_ids: context.linked_resolution_ids,
    recommended_escalation_lane: context.recommended_escalation_lane,
    closure_readiness: context.closure_readiness,
    recommendation_only:
      compatibility.recommendation_only === true &&
      stabilization.governance_case_escalation_stabilization
        .stabilization_contract.recommendation_only === true,
    additive_only:
      compatibility.additive_only === true &&
      stabilization.governance_case_escalation_stabilization
        .stabilization_contract.additive_only === true,
    executing: false,
  };
}
