import { validateGovernanceCaseEscalationProfile } from "./governanceCaseEscalationProfile.mjs";
import { validateGovernanceCaseEscalationContract } from "./governanceCaseEscalationContract.mjs";
import { validateGovernanceCaseEscalationCompatibilityContract } from "./governanceCaseEscalationCompatibilityContract.mjs";
import { validateGovernanceCaseEscalationStabilizationProfile } from "./governanceCaseEscalationStabilizationProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function validateGovernanceCaseEscalationBundle({
  governanceCaseEscalationProfile,
  governanceCaseEscalationContract,
  governanceCaseEscalationCompatibilityContract,
  governanceCaseEscalationStabilizationProfile,
  consumedCaseEscalation,
}) {
  const errors = [];

  const profileValidation = validateGovernanceCaseEscalationProfile(
    governanceCaseEscalationProfile
  );
  if (!profileValidation.ok) errors.push(...profileValidation.errors);

  const contractValidation = validateGovernanceCaseEscalationContract(
    governanceCaseEscalationContract
  );
  if (!contractValidation.ok) errors.push(...contractValidation.errors);

  const compatibilityValidation =
    validateGovernanceCaseEscalationCompatibilityContract(
      governanceCaseEscalationCompatibilityContract
    );
  if (!compatibilityValidation.ok) errors.push(...compatibilityValidation.errors);

  const stabilizationValidation =
    validateGovernanceCaseEscalationStabilizationProfile(
      governanceCaseEscalationStabilizationProfile
    );
  if (!stabilizationValidation.ok) errors.push(...stabilizationValidation.errors);

  if (!isPlainObject(consumedCaseEscalation)) {
    errors.push("consumed governance case escalation must be an object");
  } else {
    if (consumedCaseEscalation.recommendation_only !== true) {
      errors.push("consumed governance case escalation recommendation boundary drifted");
    }
    if (consumedCaseEscalation.additive_only !== true) {
      errors.push("consumed governance case escalation additive boundary drifted");
    }
    if (consumedCaseEscalation.executing !== false) {
      errors.push("consumed governance case escalation execution boundary drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}
