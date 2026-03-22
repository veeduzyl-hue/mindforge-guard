import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  validateGovernanceCaseReviewDecisionProfile,
} from "./governanceCaseReviewDecisionProfile.mjs";

function normalizeOptionalString(value) {
  return value === undefined || value === null ? null : String(value);
}

function getContext(profile) {
  return profile.governance_case_review_decision.review_decision_context;
}

function getContinuityMode(context) {
  if (context.continuity_mode) return context.continuity_mode;
  if (context.supersedes_review_decision_id) {
    return GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING;
  }
  if (context.superseded_by_review_decision_id) {
    return GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED;
  }
  return GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE;
}

function getSequence(context) {
  return context.review_decision_sequence === undefined
    ? 1
    : context.review_decision_sequence;
}

function sortProfiles(profiles) {
  return [...profiles].sort((left, right) => {
    const leftContext = getContext(left);
    const rightContext = getContext(right);
    const sequenceDiff = getSequence(leftContext) - getSequence(rightContext);
    if (sequenceDiff !== 0) return sequenceDiff;
    return String(leftContext.review_decision_id).localeCompare(
      String(rightContext.review_decision_id)
    );
  });
}

function buildDecisionIndex(profiles) {
  const index = new Map();
  for (const profile of profiles) {
    const context = getContext(profile);
    if (index.has(context.review_decision_id)) {
      throw new Error(
        "governance case review decision current selection mismatch: duplicate review_decision_id is not allowed"
      );
    }
    index.set(context.review_decision_id, {
      profile,
      context,
      continuityMode: getContinuityMode(context),
      sequence: getSequence(context),
      supersedesReviewDecisionId: normalizeOptionalString(
        context.supersedes_review_decision_id
      ),
      supersededByReviewDecisionId: normalizeOptionalString(
        context.superseded_by_review_decision_id
      ),
    });
  }
  return index;
}

function detectCycle(startId, index) {
  const visited = new Set();
  let currentId = startId;
  while (currentId !== null) {
    if (visited.has(currentId)) return true;
    visited.add(currentId);
    const current = index.get(currentId);
    if (!current) return false;
    currentId = current.supersedesReviewDecisionId;
  }
  return false;
}

export function selectGovernanceCaseReviewDecisionCurrent({
  governanceCaseReviewDecisionProfiles,
}) {
  if (
    !Array.isArray(governanceCaseReviewDecisionProfiles) ||
    governanceCaseReviewDecisionProfiles.length === 0
  ) {
    throw new Error(
      "governance case review decision current selection requires a non-empty profile array"
    );
  }

  for (const profile of governanceCaseReviewDecisionProfiles) {
    const validation = validateGovernanceCaseReviewDecisionProfile(profile);
    if (!validation.ok) {
      throw new Error(
        `governance case review decision current selection profile invalid: ${validation.errors.join("; ")}`
      );
    }
  }

  const profiles = sortProfiles(governanceCaseReviewDecisionProfiles);
  const firstContext = getContext(profiles[0]);
  const caseId = firstContext.case_id;
  const canonicalActionHash = profiles[0].canonical_action_hash;
  const index = buildDecisionIndex(profiles);
  const supersedesTargets = new Map();

  for (const profile of profiles) {
    const context = getContext(profile);
    const id = context.review_decision_id;
    const entry = index.get(id);

    if (context.case_id !== caseId) {
      throw new Error(
        "governance case review decision current selection mismatch: case_id must remain bounded to one selection scope"
      );
    }
    if (profile.canonical_action_hash !== canonicalActionHash) {
      throw new Error(
        "governance case review decision current selection mismatch: canonical_action_hash must remain bounded to one selection scope"
      );
    }
    if (entry.supersedesReviewDecisionId === id) {
      throw new Error(
        "governance case review decision current selection mismatch: supersedes_review_decision_id must not self-reference"
      );
    }
    if (
      entry.continuityMode ===
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE &&
      (entry.supersedesReviewDecisionId !== null ||
        entry.supersededByReviewDecisionId !== null)
    ) {
      throw new Error(
        "governance case review decision current selection mismatch: standalone continuity must remain link-free"
      );
    }
    if (
      entry.continuityMode ===
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING &&
      entry.supersedesReviewDecisionId === null
    ) {
      throw new Error(
        "governance case review decision current selection mismatch: superseding continuity must reference a prior review decision"
      );
    }
    if (
      entry.continuityMode ===
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED &&
      entry.supersededByReviewDecisionId === null
    ) {
      throw new Error(
        "governance case review decision current selection mismatch: superseded continuity must reference a successor review decision"
      );
    }
    if (
      entry.continuityMode ===
        GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL &&
      (entry.supersedesReviewDecisionId !== null ||
        entry.supersededByReviewDecisionId !== null)
    ) {
      throw new Error(
        "governance case review decision current selection mismatch: parallel continuity must remain link-free"
      );
    }

    if (entry.supersedesReviewDecisionId !== null) {
      const predecessor = index.get(entry.supersedesReviewDecisionId);
      if (!predecessor) {
        throw new Error(
          "governance case review decision current selection mismatch: superseding decisions must reference an available prior review decision"
        );
      }
      if (entry.sequence <= predecessor.sequence) {
        throw new Error(
          "governance case review decision current selection mismatch: review_decision_sequence must not regress across supersession"
        );
      }
      if (predecessor.supersededByReviewDecisionId !== id) {
        throw new Error(
          "governance case review decision current selection mismatch: supersession linkage must remain reciprocal"
        );
      }
      if (supersedesTargets.has(entry.supersedesReviewDecisionId)) {
        throw new Error(
          "governance case review decision current selection mismatch: multiple decisions must not compete to supersede the same prior decision"
        );
      }
      supersedesTargets.set(entry.supersedesReviewDecisionId, id);
    }

    if (entry.supersededByReviewDecisionId !== null) {
      const successor = index.get(entry.supersededByReviewDecisionId);
      if (!successor) {
        throw new Error(
          "governance case review decision current selection mismatch: superseded decisions must reference an available successor review decision"
        );
      }
      if (successor.supersedesReviewDecisionId !== id) {
        throw new Error(
          "governance case review decision current selection mismatch: superseded successor linkage must remain reciprocal"
        );
      }
    }

    if (detectCycle(id, index)) {
      throw new Error(
        "governance case review decision current selection mismatch: supersession chain must not form a cycle"
      );
    }
  }

  const terminalEntries = profiles
    .map((profile) => index.get(getContext(profile).review_decision_id))
    .filter(
      (entry) =>
        entry.continuityMode !==
          GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED &&
        entry.supersededByReviewDecisionId === null
    );

  const terminalReviewDecisionIds = Object.freeze(
    terminalEntries
      .map((entry) => entry.context.review_decision_id)
      .sort((left, right) => left.localeCompare(right))
  );
  const candidateReviewDecisionIds = Object.freeze(
    profiles
      .map((profile) => getContext(profile).review_decision_id)
      .sort((left, right) => left.localeCompare(right))
  );

  if (terminalEntries.length === 1) {
    return Object.freeze({
      selection_status: "selected",
      case_id: caseId,
      canonical_action_hash: canonicalActionHash,
      candidate_review_decision_ids: candidateReviewDecisionIds,
      terminal_review_decision_ids: terminalReviewDecisionIds,
      current_review_decision_id: terminalEntries[0].context.review_decision_id,
      conflict_review_decision_ids: Object.freeze([]),
      deterministic: true,
    });
  }

  return Object.freeze({
    selection_status: "conflict",
    case_id: caseId,
    canonical_action_hash: canonicalActionHash,
    candidate_review_decision_ids: candidateReviewDecisionIds,
    terminal_review_decision_ids: terminalReviewDecisionIds,
    current_review_decision_id: null,
    conflict_review_decision_ids: terminalReviewDecisionIds,
    deterministic: true,
  });
}
