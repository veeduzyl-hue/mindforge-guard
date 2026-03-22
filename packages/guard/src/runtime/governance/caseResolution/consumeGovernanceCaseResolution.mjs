import { assertValidGovernanceCaseResolutionProfile } from "./governanceCaseResolutionProfile.mjs";
import { assertValidGovernanceCaseResolutionCompatibilityContract } from "./governanceCaseResolutionCompatibilityContract.mjs";
import { assertValidGovernanceCaseResolutionStabilizationProfile } from "./governanceCaseResolutionStabilizationProfile.mjs";

export function consumeGovernanceCaseResolution({
  governanceCaseResolutionProfile,
  governanceCaseResolutionCompatibilityContract,
  governanceCaseResolutionStabilizationProfile,
}) {
  const profile = assertValidGovernanceCaseResolutionProfile(
    governanceCaseResolutionProfile
  );
  const compatibility = assertValidGovernanceCaseResolutionCompatibilityContract(
    governanceCaseResolutionCompatibilityContract
  );
  const stabilization = assertValidGovernanceCaseResolutionStabilizationProfile(
    governanceCaseResolutionStabilizationProfile
  );
  const context = profile.governance_case_resolution.resolution_context;

  return {
    consumer_surface: profile.governance_case_resolution.consumer_surface,
    case_id: context.case_id,
    resolution_status: context.resolution_status,
    resolution_mode: context.resolution_mode,
    resolution_rationale: context.resolution_rationale,
    linked_exception_ids: context.linked_exception_ids,
    linked_override_record_ids: context.linked_override_record_ids,
    closure_readiness: context.closure_readiness,
    recommendation_only:
      compatibility.recommendation_only === true &&
      stabilization.governance_case_resolution_stabilization.stabilization_contract
        .recommendation_only === true,
    additive_only:
      compatibility.additive_only === true &&
      stabilization.governance_case_resolution_stabilization.stabilization_contract
        .additive_only === true,
    executing: false,
  };
}
