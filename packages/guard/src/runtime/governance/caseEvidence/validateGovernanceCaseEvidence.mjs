import { validateGovernanceCaseClosureStabilizationProfile } from "../caseClosure/governanceCaseClosureStabilizationProfile.mjs";
import { validateGovernanceCaseEvidenceContract } from "./governanceCaseEvidenceContract.mjs";
import { validateGovernanceCaseEvidenceProfile } from "./governanceCaseEvidenceProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stableStringify(value) {
  return JSON.stringify(value);
}

export function validateGovernanceCaseEvidenceBundle({
  governanceCaseEvidenceProfile,
  governanceCaseEvidenceContract,
  governanceCaseClosureStabilizationProfile,
  consumedCaseEvidence,
}) {
  const errors = [];

  const profileValidation = validateGovernanceCaseEvidenceProfile(
    governanceCaseEvidenceProfile
  );
  if (!profileValidation.ok) errors.push(...profileValidation.errors);

  const contractValidation = validateGovernanceCaseEvidenceContract(
    governanceCaseEvidenceContract
  );
  if (!contractValidation.ok) errors.push(...contractValidation.errors);

  const closureValidation = validateGovernanceCaseClosureStabilizationProfile(
    governanceCaseClosureStabilizationProfile
  );
  if (!closureValidation.ok) errors.push(...closureValidation.errors);

  if (!isPlainObject(consumedCaseEvidence)) {
    errors.push("consumed governance case evidence must be an object");
  } else {
    if (consumedCaseEvidence.supporting_artifact_only !== true) {
      errors.push(
        "consumed governance case evidence supporting-artifact boundary drifted"
      );
    }
    if (consumedCaseEvidence.recommendation_only !== true) {
      errors.push("consumed governance case evidence recommendation boundary drifted");
    }
    if (consumedCaseEvidence.additive_only !== true) {
      errors.push("consumed governance case evidence additive boundary drifted");
    }
    if (consumedCaseEvidence.executing !== false) {
      errors.push("consumed governance case evidence execution boundary drifted");
    }
  }

  if (
    profileValidation.ok &&
    contractValidation.ok &&
    closureValidation.ok &&
    isPlainObject(governanceCaseEvidenceProfile) &&
    isPlainObject(governanceCaseEvidenceContract) &&
    isPlainObject(governanceCaseClosureStabilizationProfile)
  ) {
    const evidenceContext =
      governanceCaseEvidenceProfile.governance_case_evidence.evidence_context;
    const closureContinuity =
      governanceCaseClosureStabilizationProfile
        .governance_case_closure_stabilization.continuity_ref;

    if (
      governanceCaseEvidenceProfile.canonical_action_hash !==
      governanceCaseClosureStabilizationProfile.canonical_action_hash
    ) {
      errors.push(
        "governance case evidence continuity mismatch: canonical_action_hash must match closure continuity chain"
      );
    }
    if (
      governanceCaseEvidenceContract.canonical_action_hash !==
      governanceCaseEvidenceProfile.canonical_action_hash
    ) {
      errors.push(
        "governance case evidence contract mismatch: canonical_action_hash must match evidence profile"
      );
    }
    if (evidenceContext.case_id !== closureContinuity.case_id) {
      errors.push(
        "governance case evidence continuity mismatch: case_id must match closure continuity chain"
      );
    }
    if (
      stableStringify(evidenceContext.linked_resolution_ids) !==
      stableStringify(closureContinuity.linked_resolution_ids)
    ) {
      errors.push(
        "governance case evidence continuity mismatch: linked_resolution_ids must match closure continuity chain"
      );
    }
    if (
      stableStringify(evidenceContext.linked_escalation_ids) !==
      stableStringify(closureContinuity.linked_escalation_ids)
    ) {
      errors.push(
        "governance case evidence continuity mismatch: linked_escalation_ids must match closure continuity chain"
      );
    }
    if (
      !Array.isArray(evidenceContext.linked_closure_ids) ||
      evidenceContext.linked_closure_ids.length === 0
    ) {
      errors.push(
        "governance case evidence continuity mismatch: linked_closure_ids are required"
      );
    }
    if (
      stableStringify(evidenceContext.linked_exception_ids) !==
      stableStringify(closureContinuity.linked_exception_ids)
    ) {
      errors.push(
        "governance case evidence continuity mismatch: linked_exception_ids must match closure continuity basis"
      );
    }
    if (
      stableStringify(evidenceContext.linked_override_record_ids) !==
      stableStringify(closureContinuity.linked_override_record_ids)
    ) {
      errors.push(
        "governance case evidence continuity mismatch: linked_override_record_ids must match closure continuity basis"
      );
    }
  }

  return { ok: errors.length === 0, errors };
}
