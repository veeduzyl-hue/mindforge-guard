import { validateGovernanceCaseClosureProfile } from "./governanceCaseClosureProfile.mjs";
import { validateGovernanceCaseClosureContract } from "./governanceCaseClosureContract.mjs";
import { validateGovernanceCaseClosureCompatibilityContract } from "./governanceCaseClosureCompatibilityContract.mjs";
import { validateGovernanceCaseClosureStabilizationProfile } from "./governanceCaseClosureStabilizationProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function validateGovernanceCaseClosureBundle({
  governanceCaseClosureProfile,
  governanceCaseClosureContract,
  governanceCaseClosureCompatibilityContract,
  governanceCaseClosureStabilizationProfile,
  consumedCaseClosure,
}) {
  const errors = [];

  const profileValidation = validateGovernanceCaseClosureProfile(
    governanceCaseClosureProfile
  );
  if (!profileValidation.ok) errors.push(...profileValidation.errors);

  const contractValidation = validateGovernanceCaseClosureContract(
    governanceCaseClosureContract
  );
  if (!contractValidation.ok) errors.push(...contractValidation.errors);

  const compatibilityValidation =
    validateGovernanceCaseClosureCompatibilityContract(
      governanceCaseClosureCompatibilityContract
    );
  if (!compatibilityValidation.ok) errors.push(...compatibilityValidation.errors);

  const stabilizationValidation =
    validateGovernanceCaseClosureStabilizationProfile(
      governanceCaseClosureStabilizationProfile
    );
  if (!stabilizationValidation.ok) errors.push(...stabilizationValidation.errors);

  if (!isPlainObject(consumedCaseClosure)) {
    errors.push("consumed governance case closure must be an object");
  } else {
    if (consumedCaseClosure.recommendation_only !== true) {
      errors.push("consumed governance case closure recommendation boundary drifted");
    }
    if (consumedCaseClosure.additive_only !== true) {
      errors.push("consumed governance case closure additive boundary drifted");
    }
    if (consumedCaseClosure.executing !== false) {
      errors.push("consumed governance case closure execution boundary drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}
