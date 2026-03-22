import { validateGovernanceCaseEvidenceProfile } from "../caseEvidence/governanceCaseEvidenceProfile.mjs";
import { validateGovernanceCaseReviewDecisionContract } from "./governanceCaseReviewDecisionContract.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_SUFFICIENCY_LEVELS,
  GOVERNANCE_CASE_REVIEW_DECISION_STATUSES,
  validateGovernanceCaseReviewDecisionProfile,
} from "./governanceCaseReviewDecisionProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stableStringify(value) {
  return JSON.stringify(value);
}

export function validateGovernanceCaseReviewDecisionBundle({
  governanceCaseReviewDecisionProfile,
  governanceCaseReviewDecisionContract,
  governanceCaseEvidenceProfile,
  consumedCaseReviewDecision,
}) {
  const errors = [];

  const profileValidation = validateGovernanceCaseReviewDecisionProfile(
    governanceCaseReviewDecisionProfile
  );
  if (!profileValidation.ok) errors.push(...profileValidation.errors);

  const contractValidation = validateGovernanceCaseReviewDecisionContract(
    governanceCaseReviewDecisionContract
  );
  if (!contractValidation.ok) errors.push(...contractValidation.errors);

  const evidenceValidation = validateGovernanceCaseEvidenceProfile(
    governanceCaseEvidenceProfile
  );
  if (!evidenceValidation.ok) errors.push(...evidenceValidation.errors);

  if (!isPlainObject(consumedCaseReviewDecision)) {
    errors.push("consumed governance case review decision must be an object");
  } else {
    if (consumedCaseReviewDecision.supporting_artifact_only !== true) {
      errors.push(
        "consumed governance case review decision supporting-artifact boundary drifted"
      );
    }
    if (consumedCaseReviewDecision.recommendation_only !== true) {
      errors.push(
        "consumed governance case review decision recommendation boundary drifted"
      );
    }
    if (consumedCaseReviewDecision.additive_only !== true) {
      errors.push(
        "consumed governance case review decision additive boundary drifted"
      );
    }
    if (consumedCaseReviewDecision.executing !== false) {
      errors.push(
        "consumed governance case review decision execution boundary drifted"
      );
    }
  }

  if (
    profileValidation.ok &&
    contractValidation.ok &&
    evidenceValidation.ok &&
    isPlainObject(governanceCaseReviewDecisionProfile) &&
    isPlainObject(governanceCaseReviewDecisionContract) &&
    isPlainObject(governanceCaseEvidenceProfile)
  ) {
    const reviewContext =
      governanceCaseReviewDecisionProfile.governance_case_review_decision
        .review_decision_context;
    const evidenceContext =
      governanceCaseEvidenceProfile.governance_case_evidence.evidence_context;

    if (
      governanceCaseReviewDecisionProfile.canonical_action_hash !==
      governanceCaseEvidenceProfile.canonical_action_hash
    ) {
      errors.push(
        "governance case review decision continuity mismatch: canonical_action_hash must match evidence continuity chain"
      );
    }
    if (
      governanceCaseReviewDecisionContract.canonical_action_hash !==
      governanceCaseReviewDecisionProfile.canonical_action_hash
    ) {
      errors.push(
        "governance case review decision contract mismatch: canonical_action_hash must match review decision profile"
      );
    }
    if (reviewContext.case_id !== evidenceContext.case_id) {
      errors.push(
        "governance case review decision continuity mismatch: case_id must match evidence continuity chain"
      );
    }
    const expectedEvidenceLink = `evidence-${evidenceContext.case_id}`;
    if (
      !Array.isArray(reviewContext.linked_evidence_ids) ||
      !reviewContext.linked_evidence_ids.includes(expectedEvidenceLink)
    ) {
      errors.push(
        "governance case review decision continuity mismatch: linked_evidence_ids must include the canonical evidence link for the case continuity chain"
      );
    }
    if (
      stableStringify(reviewContext.linked_resolution_ids) !==
      stableStringify(evidenceContext.linked_resolution_ids)
    ) {
      errors.push(
        "governance case review decision continuity mismatch: linked_resolution_ids must match evidence continuity chain"
      );
    }
    if (
      stableStringify(reviewContext.linked_escalation_ids) !==
      stableStringify(evidenceContext.linked_escalation_ids)
    ) {
      errors.push(
        "governance case review decision continuity mismatch: linked_escalation_ids must match evidence continuity chain"
      );
    }
    if (
      stableStringify(reviewContext.linked_closure_ids) !==
      stableStringify(evidenceContext.linked_closure_ids)
    ) {
      errors.push(
        "governance case review decision continuity mismatch: linked_closure_ids must match evidence continuity chain"
      );
    }
    if (
      !GOVERNANCE_CASE_REVIEW_DECISION_STATUSES.includes(reviewContext.review_status)
    ) {
      errors.push(
        "governance case review decision continuity mismatch: review_status must remain within bounded values"
      );
    }
    if (
      !GOVERNANCE_CASE_REVIEW_DECISION_EVIDENCE_SUFFICIENCY_LEVELS.includes(
        reviewContext.evidence_sufficiency
      )
    ) {
      errors.push(
        "governance case review decision continuity mismatch: evidence_sufficiency must remain within bounded values"
      );
    }
  }

  return { ok: errors.length === 0, errors };
}
