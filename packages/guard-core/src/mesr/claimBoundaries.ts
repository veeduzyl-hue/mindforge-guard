import { MESR_CORE_VERSION, type MesrClaimBoundary } from "./types.ts";

const SOURCE = ["docs/specs/mesr-claim-boundary-registry-v0.1.md"] as const;

function boundary(
  boundaryId: string,
  evidenceOrState: string,
  evidenceOrStateId: string,
  doesNotSupport: string,
  requiredAdditionalBindings: readonly string[],
  example: string,
  counterexample: string,
): MesrClaimBoundary {
  return {
    boundary_id: boundaryId,
    evidence_or_state: evidenceOrState,
    evidence_or_state_id: evidenceOrStateId,
    does_not_support: doesNotSupport,
    required_additional_bindings: requiredAdditionalBindings,
    example,
    counterexample,
    relation: "does_not_support",
    compatible_core_version: MESR_CORE_VERSION,
    provenance: SOURCE,
  };
}

export const MESR_CLAIM_BOUNDARIES: readonly MesrClaimBoundary[] = [
  boundary("CB-01", "Evidence present", "evidence_present", "authority_verified", ["authority_source", "principal", "action", "target", "scope", "valid_time", "provenance"], "A signed log exists, so the actor is assumed authorized.", "A separate current delegation explicitly binds actor, action, target, and time."),
  boundary("CB-02", "Assessment completed/passed", "assessment_passed", "authority_verified", ["applicable_authority_source", "authority_scope"], "A risk assessment passes, so execution is treated as authorized.", "Assessment and applicable external authority are evaluated as distinct claims."),
  boundary("CB-03", "Resource or system access", "resource_access", "authority_verified", ["permission_source", "intended_action", "scope", "constraints", "valid_time"], "A token can write a repository, so every write is authorized.", "IAM evidence separately binds the exact path, action, and time."),
  boundary("CB-04", "Capability available", "capability_available", "authority_verified", ["applicable_authorization", "capability", "target"], "A runtime has a deploy tool, so deployment is authorized.", "A current scoped authority record separately covers deployment."),
  boundary("CB-05", "Verified identity", "identity_verified", "authority_verified", ["authority_source", "delegation_or_scope", "valid_time", "subject_binding"], "Authentication proves the caller may approve a release.", "Verified identity plus current code-owner delegation permits separate authority evaluation."),
  boundary("CB-06", "Verification passed", "verification_passed", "execution_authorized", ["external_decision_owner", "applicable_permission", "execution_boundary"], "Tests pass, so Guard authorizes merge or deploy.", "An external system may decide using tests and separately established authority."),
  boundary("CB-07", "Observation recorded", "observation_recorded", "verification", ["verifier", "method", "checked_property", "subject", "scope", "time", "limitations"], "A producer log says a test passed, so it is independently verified.", "A separate verifier replays the bound artifact and records method and limitations."),
  boundary("CB-08", "Trace captured", "trace_captured", "evidence_sufficient", ["claim", "trace_scope_and_completeness", "subject_time_binding", "provenance"], "A tool trace exists, so the workflow is fully evidenced.", "The trace is complete for a bounded claim and combined with required artifacts."),
  boundary("CB-09", "Integrity verified", "artifact_integrity", "artifact_truth", ["claim_content_verification", "source_reliability", "required_corroboration"], "SHA-256 matches, so the artifact contents are true.", "Hash preservation and separate content verification support distinct claims."),
  boundary("CB-10", "Artifact authenticity verified", "signature_verified", "claim_correctness", ["issuer_scope", "claim_verification", "subject_time_binding"], "A valid signature makes every signed assertion correct.", "Signature authenticates the issuer while an independent check evaluates correctness."),
  boundary("CB-11", "Evidence present", "evidence_present", "evidence_sufficient", ["claim_specific_required_evidence", "scope", "quality", "admissibility", "time"], "A test report exists, so release evidence is sufficient.", "The report covers the bound candidate and all claim-specific requirements."),
  boundary("CB-12", "Evidence complete against inventory", "evidence_inventory_complete", "claim_correctness", ["property_specific_verification", "acceptance_criteria"], "Every manifest item exists, so the change is correct.", "Complete inventory plus bound verification supports only the checked property."),
  boundary("CB-13", "Execution occurred/succeeded", "execution_succeeded", "outcome_correct", ["expected_outcome", "post_state_observation", "causal_binding", "subject_binding"], "Deployment returned success, so production behavior is correct.", "Bound health observations verify specified postconditions."),
  boundary("CB-14", "Outcome occurred", "outcome_occurred", "causal_attribution", ["candidate_cause", "temporal_ordering", "controls_or_corroboration", "alternative_cause_treatment"], "Error rate fell after deployment, so deployment caused it.", "A bounded experiment may separately support attribution."),
  boundary("CB-15", "Historical evidence was valid", "historical_evidence_valid", "current_standing", ["basis_valid_at", "expiry", "revocation", "supersession", "current_subject"], "A credential was valid last week, so it is valid now.", "Revocation and expiry sources resolve to current at reliance time."),
  boundary("CB-16", "Capability continuity", "capability_continuity", "authority_continuity", ["prior_authority", "current_authority", "unchanged_subject_scope_time", "revocation_check"], "The same tools remain available, so authority remains valid.", "Current authority is independently re-evaluated."),
  boundary("CB-17", "Delegation exists", "delegation_exists", "authority_amplified", ["delegator_delegable_scope", "delegate_scope", "constraints", "chain_validity"], "Read authority is delegated and treated as read/write authority.", "Delegate scope is no broader than a verified delegable source."),
  boundary("CB-18", "Approval record exists", "approval_record_exists", "applicable_review_exists", ["subject", "scope", "authority", "time"], "An old approval note is applied to a different commit.", "Approval binds the same commit, scope, authorized reviewer, and current time."),
  boundary("CB-19", "Policy match recorded", "policy_match_recorded", "legally_compliant", ["authoritative_legal_interpretation", "jurisdiction", "current_law_or_policy", "complete_facts"], "A rule identifier matches, so the action is legally compliant.", "An accountable external owner makes a separate determination."),
  boundary("CB-20", "Framework mapping exists", "framework_mapping_present", "certified", ["framework_and_version", "control_evidence", "authorized_assessor_or_certifier", "certification_scope"], "Framework controls are mapped, so the system is certified.", "An authorized external body may issue a separate certification."),
  boundary("CB-21", "Decision divergence observed", "decision_divergence_observed", "decision_error", ["normative_comparator", "applicable_scope", "criterion_violation_evidence"], "Human and Guard results differ, so one is wrong.", "A bound rule and facts may establish contradiction."),
  boundary("CB-22", "Producer claim present", "producer_claim_present", "independent_verification", ["separate_verifier_identity", "method", "source_separation", "limitations"], "CI metadata contains verified=true, so it is independently verified.", "A separate verifier checks the underlying artifact."),
  boundary("CB-23", "Control present", "control_present", "control_effective", ["operating_period", "test_method", "coverage", "observed_outcomes", "limitations"], "A rollback script exists, so rollback is effective.", "A recovery exercise verifies it against the candidate environment."),
  boundary("CB-24", "Human-in-loop present", "human_in_loop_present", "meaningful_oversight", ["reviewer_authority", "information_access", "time", "actionability", "recorded_rationale"], "A reviewer name exists, so oversight was meaningful.", "An authorized reviewer inspected the bound subject and could intervene."),
] as const;

export function findMesrClaimBoundary(
  evidenceOrStateId: string,
  claimId: string,
): MesrClaimBoundary | null {
  return MESR_CLAIM_BOUNDARIES.find(
    (entry) => entry.evidence_or_state_id === evidenceOrStateId && entry.does_not_support === claimId,
  ) ?? null;
}

export function validateMesrClaimBoundaries(
  boundaries: readonly MesrClaimBoundary[] = MESR_CLAIM_BOUNDARIES,
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const entry of boundaries) {
    if (ids.has(entry.boundary_id)) issues.push(`DUPLICATE_BOUNDARY:${entry.boundary_id}`);
    ids.add(entry.boundary_id);
    if (entry.relation !== "does_not_support") issues.push(`INVALID_RELATION:${entry.boundary_id}`);
    if (entry.required_additional_bindings.length === 0) issues.push(`MISSING_BINDINGS:${entry.boundary_id}`);
  }
  issues.sort();
  return { valid: issues.length === 0, issues };
}
