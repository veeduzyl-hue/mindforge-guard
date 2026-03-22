import { assertValidGovernanceCaseClosureProfile } from "./governanceCaseClosureProfile.mjs";
import { assertValidGovernanceCaseClosureCompatibilityContract } from "./governanceCaseClosureCompatibilityContract.mjs";
import { assertValidGovernanceCaseClosureStabilizationProfile } from "./governanceCaseClosureStabilizationProfile.mjs";

export function consumeGovernanceCaseClosure({
  governanceCaseClosureProfile,
  governanceCaseClosureCompatibilityContract,
  governanceCaseClosureStabilizationProfile,
}) {
  const profile = assertValidGovernanceCaseClosureProfile(
    governanceCaseClosureProfile
  );
  const compatibility = assertValidGovernanceCaseClosureCompatibilityContract(
    governanceCaseClosureCompatibilityContract
  );
  const stabilization = assertValidGovernanceCaseClosureStabilizationProfile(
    governanceCaseClosureStabilizationProfile
  );
  const context = profile.governance_case_closure.closure_context;

  return {
    consumer_surface: profile.governance_case_closure.consumer_surface,
    case_id: context.case_id,
    closure_status: context.closure_status,
    closure_mode: context.closure_mode,
    closure_rationale: context.closure_rationale,
    linked_exception_ids: context.linked_exception_ids,
    linked_override_record_ids: context.linked_override_record_ids,
    linked_resolution_ids: context.linked_resolution_ids,
    linked_escalation_ids: context.linked_escalation_ids,
    closure_readiness: context.closure_readiness,
    post_closure_observation_readiness:
      context.post_closure_observation_readiness,
    recommendation_only:
      compatibility.recommendation_only === true &&
      stabilization.governance_case_closure_stabilization.stabilization_contract
        .recommendation_only === true,
    additive_only:
      compatibility.additive_only === true &&
      stabilization.governance_case_closure_stabilization.stabilization_contract
        .additive_only === true,
    executing: false,
  };
}
