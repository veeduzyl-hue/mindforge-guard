import { validateGovernanceCaseEvidenceProfile } from "../caseEvidence/governanceCaseEvidenceProfile.mjs";
import { validateGovernanceCaseReviewDecisionContract } from "./governanceCaseReviewDecisionContract.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
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

function getDecisionContext(profile) {
  return profile.governance_case_review_decision.review_decision_context;
}

function buildDecisionIndex(profiles) {
  const index = new Map();
  for (const profile of profiles) {
    const context = getDecisionContext(profile);
    index.set(context.review_decision_id, {
      profile,
      context,
    });
  }
  return index;
}

function detectSupersessionCycle(startId, decisionIndex) {
  const visited = new Set();
  let currentId = startId;
  while (currentId !== null) {
    if (visited.has(currentId)) return true;
    visited.add(currentId);
    const current = decisionIndex.get(currentId);
    if (!current) return false;
    currentId = current.context.supersedes_review_decision_id ?? null;
  }
  return false;
}

export function validateGovernanceCaseReviewDecisionBundle({
  governanceCaseReviewDecisionProfile,
  governanceCaseReviewDecisionContract,
  governanceCaseEvidenceProfile,
  consumedCaseReviewDecision,
  relatedGovernanceCaseReviewDecisionProfiles = [],
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

  const relatedProfileValidations = [];
  if (!Array.isArray(relatedGovernanceCaseReviewDecisionProfiles)) {
    errors.push(
      "related governance case review decision profiles must be provided as an array"
    );
  } else {
    for (const profile of relatedGovernanceCaseReviewDecisionProfiles) {
      const validation = validateGovernanceCaseReviewDecisionProfile(profile);
      relatedProfileValidations.push(validation);
      if (!validation.ok) {
        errors.push(...validation.errors);
      }
    }
  }

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
    relatedProfileValidations.every((validation) => validation.ok) &&
    isPlainObject(governanceCaseReviewDecisionProfile) &&
    isPlainObject(governanceCaseReviewDecisionContract) &&
    isPlainObject(governanceCaseEvidenceProfile) &&
    Array.isArray(relatedGovernanceCaseReviewDecisionProfiles)
  ) {
    const reviewContext =
      governanceCaseReviewDecisionProfile.governance_case_review_decision
        .review_decision_context;
    const evidenceContext =
      governanceCaseEvidenceProfile.governance_case_evidence.evidence_context;
    const relatedProfiles = relatedGovernanceCaseReviewDecisionProfiles.filter(
      (profile) =>
        getDecisionContext(profile).review_decision_id !==
        reviewContext.review_decision_id
    );
    const decisionProfiles = [
      governanceCaseReviewDecisionProfile,
      ...relatedProfiles,
    ];
    const decisionIndex = buildDecisionIndex(decisionProfiles);

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

    if (
      reviewContext.supersedes_review_decision_id !== null &&
      reviewContext.supersedes_review_decision_id === reviewContext.review_decision_id
    ) {
      errors.push(
        "governance case review decision continuity mismatch: supersedes_review_decision_id must not self-reference"
      );
    }

    if (
      reviewContext.continuity_mode ===
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE &&
      (reviewContext.supersedes_review_decision_id !== null ||
        reviewContext.superseded_by_review_decision_id !== null)
    ) {
      errors.push(
        "governance case review decision continuity mismatch: standalone mode must not include supersession links"
      );
    }

    if (
      reviewContext.continuity_mode ===
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING &&
      reviewContext.supersedes_review_decision_id === null
    ) {
      errors.push(
        "governance case review decision continuity mismatch: superseding mode must reference a prior review decision"
      );
    }

    const predecessor =
      reviewContext.supersedes_review_decision_id === null
        ? null
        : decisionIndex.get(reviewContext.supersedes_review_decision_id) ?? null;

    if (
      reviewContext.supersedes_review_decision_id !== null &&
      predecessor === null
    ) {
      errors.push(
        "governance case review decision continuity mismatch: superseding decisions must reference an available prior review decision"
      );
    }

    if (predecessor !== null) {
      if (predecessor.context.case_id !== reviewContext.case_id) {
        errors.push(
          "governance case review decision continuity mismatch: supersession chain must preserve case_id"
        );
      }
      if (
        predecessor.profile.canonical_action_hash !==
        governanceCaseReviewDecisionProfile.canonical_action_hash
      ) {
        errors.push(
          "governance case review decision continuity mismatch: supersession chain must preserve canonical_action_hash"
        );
      }
      if (
        reviewContext.review_decision_sequence <=
        predecessor.context.review_decision_sequence
      ) {
        errors.push(
          "governance case review decision continuity mismatch: review_decision_sequence must not regress under supersession"
        );
      }
      if (
        predecessor.context.superseded_by_review_decision_id !== null &&
        predecessor.context.superseded_by_review_decision_id !==
          reviewContext.review_decision_id
      ) {
        errors.push(
          "governance case review decision continuity mismatch: superseded predecessor must not be superseded by competing decisions"
        );
      }
    }

    const competingSuperseders = decisionProfiles.filter((profile) => {
      const context = getDecisionContext(profile);
      return (
        context.review_decision_id !== reviewContext.review_decision_id &&
        context.supersedes_review_decision_id !== null &&
        context.supersedes_review_decision_id ===
          reviewContext.supersedes_review_decision_id
      );
    });
    if (
      reviewContext.supersedes_review_decision_id !== null &&
      competingSuperseders.length > 0
    ) {
      errors.push(
        "governance case review decision continuity mismatch: competing supersession of the same prior review decision is not allowed"
      );
    }

    if (
      detectSupersessionCycle(reviewContext.review_decision_id, decisionIndex)
    ) {
      errors.push(
        "governance case review decision continuity mismatch: supersession chain must not form a cycle"
      );
    }

    if (
      reviewContext.continuity_mode ===
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED &&
      governanceCaseReviewDecisionContract.current_effective_decision !== false
    ) {
      errors.push(
        "governance case review decision continuity mismatch: superseded review decisions must not remain current"
      );
    }

    const successor =
      reviewContext.superseded_by_review_decision_id === null
        ? null
        : decisionIndex.get(reviewContext.superseded_by_review_decision_id) ?? null;
    if (
      reviewContext.continuity_mode ===
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED &&
      reviewContext.superseded_by_review_decision_id !== null &&
      successor === null
    ) {
      errors.push(
        "governance case review decision continuity mismatch: superseded mode must reference an available successor review decision"
      );
    }

    if (
      successor !== null &&
      successor.context.supersedes_review_decision_id !== reviewContext.review_decision_id
    ) {
      errors.push(
        "governance case review decision continuity mismatch: superseded successor linkage must be reciprocal"
      );
    }

    if (
      reviewContext.continuity_mode ===
      GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL
    ) {
      const parallelPeers = decisionProfiles.filter((profile) => {
        const context = getDecisionContext(profile);
        return (
          context.review_decision_id !== reviewContext.review_decision_id &&
          context.case_id === reviewContext.case_id &&
          profile.canonical_action_hash ===
            governanceCaseReviewDecisionProfile.canonical_action_hash &&
          context.review_decision_sequence === reviewContext.review_decision_sequence &&
          context.continuity_mode ===
            GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL
        );
      });
      if (parallelPeers.length === 0) {
        errors.push(
          "governance case review decision continuity mismatch: parallel mode requires at least one bounded parallel peer"
        );
      }
      if (
        reviewContext.supersedes_review_decision_id !== null ||
        reviewContext.superseded_by_review_decision_id !== null
      ) {
        errors.push(
          "governance case review decision continuity mismatch: parallel mode must not include supersession links"
        );
      }
      if (
        typeof reviewContext.supersession_reason !== "string" ||
        reviewContext.supersession_reason.length === 0
      ) {
        errors.push(
          "governance case review decision continuity mismatch: parallel mode requires a bounded supersession_reason"
        );
      }
    }
  }

  return { ok: errors.length === 0, errors };
}
