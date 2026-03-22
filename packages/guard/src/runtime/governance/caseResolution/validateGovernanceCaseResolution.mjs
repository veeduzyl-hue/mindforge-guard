import { validateGovernanceCaseResolutionProfile } from "./governanceCaseResolutionProfile.mjs";
import { validateGovernanceCaseResolutionContract } from "./governanceCaseResolutionContract.mjs";
import { validateGovernanceCaseResolutionCompatibilityContract } from "./governanceCaseResolutionCompatibilityContract.mjs";
import { validateGovernanceCaseResolutionStabilizationProfile } from "./governanceCaseResolutionStabilizationProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function validateGovernanceCaseResolutionBundle({
  governanceCaseResolutionProfile,
  governanceCaseResolutionContract,
  governanceCaseResolutionCompatibilityContract,
  governanceCaseResolutionStabilizationProfile,
  consumedCaseResolution,
}) {
  const errors = [];

  const profileValidation = validateGovernanceCaseResolutionProfile(
    governanceCaseResolutionProfile
  );
  if (!profileValidation.ok) errors.push(...profileValidation.errors);

  const contractValidation = validateGovernanceCaseResolutionContract(
    governanceCaseResolutionContract
  );
  if (!contractValidation.ok) errors.push(...contractValidation.errors);

  const compatibilityValidation =
    validateGovernanceCaseResolutionCompatibilityContract(
      governanceCaseResolutionCompatibilityContract
    );
  if (!compatibilityValidation.ok) errors.push(...compatibilityValidation.errors);

  const stabilizationValidation =
    validateGovernanceCaseResolutionStabilizationProfile(
      governanceCaseResolutionStabilizationProfile
    );
  if (!stabilizationValidation.ok) errors.push(...stabilizationValidation.errors);

  if (!isPlainObject(consumedCaseResolution)) {
    errors.push("consumed governance case resolution must be an object");
  } else {
    if (consumedCaseResolution.recommendation_only !== true) {
      errors.push("consumed governance case resolution recommendation boundary drifted");
    }
    if (consumedCaseResolution.additive_only !== true) {
      errors.push("consumed governance case resolution additive boundary drifted");
    }
    if (consumedCaseResolution.executing !== false) {
      errors.push("consumed governance case resolution execution boundary drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}
