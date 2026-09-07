import {
  MESR_CORE_VERSION,
  type MesrSemanticEntry,
  type MesrValidationIssue,
  type MesrValidationResult,
} from "./types.ts";

const CORE_PROVENANCE = ["docs/specs/mesr-core-v0.1.md"] as const;

function coreEntry(
  semanticId: string,
  definition: string,
  requiredBindings: readonly string[],
  supports: readonly string[],
  doesNotSupport: readonly string[],
): MesrSemanticEntry {
  return {
    semantic_id: semanticId,
    namespace: "mesr.core",
    version: MESR_CORE_VERSION,
    definition,
    status: "active",
    supports,
    does_not_support: doesNotSupport,
    stronger_than: [],
    weaker_than: [],
    conflicts_with: [],
    required_bindings: requiredBindings,
    provenance: CORE_PROVENANCE,
    supersedes: [],
    deprecated_by: null,
  };
}

export const MESR_CORE_REGISTRY: readonly MesrSemanticEntry[] = [
  coreEntry("mesr.core.actor.principal", "Entity on whose behalf an action or claim is represented.", ["principal_id", "provenance"], ["principal_identity_reference"], ["verified_identity", "authority", "approval"]),
  coreEntry("mesr.core.actor.actor", "Entity that performed or is reported to have performed an action.", ["actor_id", "subject", "provenance"], ["actor_attribution"], ["principal_equivalence", "authority", "intent_correctness"]),
  coreEntry("mesr.core.actor.identity_assertion", "Assertion binding an identifier or credential to an actor.", ["actor", "credential_or_source", "observed_or_verified_time"], ["identity_assertion_presence", "verified_identity"], ["verified_authority", "delegation", "current_standing"]),
  coreEntry("mesr.core.authority.source", "Identified source from which an authority claim originates.", ["source_identity", "subject", "provenance"], ["authority_source_attribution"], ["source_validity", "applicable_authority", "execution_permission"]),
  coreEntry("mesr.core.authority.scope", "Bounded actions, targets, resources, and constraints to which authority evidence refers.", ["subject", "action", "target", "scope", "valid_time", "provenance"], ["scope_bounded_authority_claim"], ["broader_authority", "current_authority_without_temporal_basis"]),
  coreEntry("mesr.core.authority.delegation", "Recorded transfer of bounded authority from a source to a delegate.", ["delegator", "delegate", "scope", "valid_time", "provenance"], ["delegation_occurrence", "bounded_delegation_scope"], ["authority_amplification", "transitive_delegation", "execution_permission"]),
  coreEntry("mesr.core.authority.declared", "Producer-supplied authority assertion without independent authority verification.", ["producer", "subject", "scope", "asserted_time"], ["declared_authority"], ["verified_authority", "current_authority", "execution_authorization"]),
  coreEntry("mesr.core.intent.intent", "Declared objective associated with a subject or proposed action.", ["declaring_actor", "subject", "scope", "time"], ["intent_declaration"], ["action_occurrence", "outcome", "authority"]),
  coreEntry("mesr.core.action.action", "Bounded act proposed, attempted, observed, or completed.", ["actor", "target", "action_type", "time", "provenance"], ["action_state_within_captured_bounds"], ["authorization", "correct_outcome", "causal_attribution"]),
  coreEntry("mesr.core.action.tool_invocation", "Invocation or attempted invocation of a named tool.", ["actor", "tool", "inputs_or_ref", "status", "time", "provenance"], ["invocation_occurrence", "invocation_status"], ["tool_output_truth", "authorization", "safe_effect"]),
  coreEntry("mesr.core.boundary.authority", "Limit within which an authority claim may be evaluated.", ["subject", "allowed_action", "target_or_scope", "time"], ["authority_boundary_match"], ["authority_validity", "approval"]),
  coreEntry("mesr.core.boundary.execution", "Limit between evidence interpretation and an external execution decision.", ["evaluated_claim", "external_decision_owner"], ["assurance_execution_separation"], ["execution_permission", "execution_control"]),
  coreEntry("mesr.core.boundary.effect", "Limit of effects attributable to a bounded action or transition.", ["action", "target", "before_state", "after_state", "provenance"], ["bounded_effect_claim"], ["outcome_correctness", "complete_side_effect_absence"]),
  coreEntry("mesr.core.boundary.reliance", "Context and time in which an institution relies on evidence.", ["relying_party_or_context", "basis_valid_at", "provenance"], ["reliance_basis_evaluation"], ["timeless_validity", "universal_applicability"]),
  coreEntry("mesr.core.effect.effect", "Observed or asserted change associated with an action.", ["action_ref", "affected_subject", "time", "provenance"], ["bounded_effect_occurrence"], ["causation", "correctness", "safety"]),
  coreEntry("mesr.core.effect.outcome", "Result state observed or asserted after an action or transition.", ["subject", "state", "observation_time", "provenance"], ["outcome_occurrence"], ["causal_attribution", "desired_outcome", "safety"]),
  coreEntry("mesr.core.effect.state_transition", "Bound movement from one identified state to another.", ["from_state", "to_state", "boundary", "time", "provenance"], ["transition_occurrence"], ["authority", "correctness", "completeness"]),
  coreEntry("mesr.core.evidence.item", "Addressable artifact or record offered as evidence.", ["evidence_id_or_ref", "producer_or_source", "subject", "provenance"], ["evidence_presence", "bounded_content"], ["evidence_sufficiency", "artifact_truth", "authority"]),
  coreEntry("mesr.core.evidence.observation", "Recorded observation made by an identified source or method.", ["observer_or_source", "subject", "method", "observed_time"], ["observation_occurrence", "observation_content"], ["independent_verification", "truth_beyond_method"]),
  coreEntry("mesr.core.evidence.attestation", "Signed or attributable assertion by an identified attester.", ["attester", "subject", "assertion", "time", "provenance"], ["attributable_assertion", "authenticity_when_verified"], ["claim_correctness", "authority_without_separate_binding"]),
  coreEntry("mesr.core.evidence.verification", "Bounded act that checks a stated property using an identified method and verifier.", ["verifier", "method", "subject", "scope", "verified_at", "result", "limitations"], ["checked_property_within_scope"], ["approval", "execution_authority", "untested_properties"]),
  coreEntry("mesr.core.claim.claim", "Evaluated proposition with an explicit subject and boundaries.", ["claim_id", "subject", "predicate", "scope", "time"], ["claim_identity"], ["claim_truth_without_evidence", "claim_support_without_evidence"]),
  coreEntry("mesr.core.claim.scope", "Subject, scope, time, and provenance boundary of a claim.", ["subject", "scope", "valid_or_reliance_time", "provenance"], ["bounded_applicability"], ["transfer_to_another_subject", "transfer_to_another_scope", "transfer_to_another_time"]),
  coreEntry("mesr.core.claim.support_relation", "Relation between bound evidence and a bound claim.", ["evidence_refs", "claim_ref", "evaluator_and_version", "rationale"], ["controlled_support_relation"], ["governance_disposition", "execution_permission"]),
  coreEntry("mesr.core.provenance.producer", "Entity or process that emitted or packaged evidence.", ["producer_identity_and_version", "output_ref", "time"], ["production_attribution"], ["independent_verification", "issuer_trust"]),
  coreEntry("mesr.core.provenance.verifier", "Entity or process that performed a bounded verification.", ["verifier_identity_and_version", "method", "subject", "time"], ["verification_attribution"], ["independence_without_producer_separation"]),
  coreEntry("mesr.core.provenance.lineage", "Ordered source and transformation history of an artifact or semantic result.", ["source_refs", "transformations", "versions", "times"], ["traceable_lineage"], ["truth", "completeness", "authority"]),
  coreEntry("mesr.core.temporal.basis", "Evaluation of whether evidence remains a valid basis at reliance time.", ["produced_observed_or_verified_time", "basis_valid_at", "expiry_revocation_or_supersession_refs"], ["controlled_basis_status"], ["timeless_validity", "authority_by_itself"]),
  coreEntry("mesr.core.review.review", "Human or institutional review event over a bound subject.", ["reviewer", "subject_hash_or_ref", "scope", "time", "provenance"], ["review_occurrence"], ["applicable_reviewer_authority", "approval", "execution_permission"]),
  coreEntry("mesr.core.review.disposition", "External or Guard report expression about a reviewed evidence state, retaining residual uncertainty.", ["review_or_evaluation_ref", "decision_or_rationale_ref", "owner", "time"], ["bounded_disposition_record"], ["semantic_truth", "execution_authority", "certification"]),
] as const;

const SEMANTIC_REFERENCE_FIELDS = [
  "supports",
  "does_not_support",
  "stronger_than",
  "weaker_than",
  "conflicts_with",
  "supersedes",
] as const;

function issueSortKey(issue: MesrValidationIssue): string {
  return `${issue.code}\u0000${issue.subject}\u0000${issue.field}\u0000${issue.detail}`;
}

export function validateMesrCoreRegistry(
  registry: readonly MesrSemanticEntry[] = MESR_CORE_REGISTRY,
): MesrValidationResult {
  const issues: MesrValidationIssue[] = [];
  const entriesById = new Map<string, MesrSemanticEntry>();

  for (const entry of registry) {
    const existing = entriesById.get(entry.semantic_id);
    if (existing) {
      issues.push({
        code: existing.definition === entry.definition ? "DUPLICATE_SEMANTIC_ID" : "SEMANTIC_COLLISION",
        subject: entry.semantic_id,
        field: "semantic_id",
        detail: "semantic_id must have exactly one definition",
      });
    } else {
      entriesById.set(entry.semantic_id, entry);
    }

    if (!entry.semantic_id.startsWith("mesr.core.") || entry.namespace !== "mesr.core") {
      issues.push({
        code: "INVALID_CORE_NAMESPACE",
        subject: entry.semantic_id,
        field: "namespace",
        detail: "Core may define only mesr.core.* semantics",
      });
    }
    if (entry.does_not_support.length === 0) {
      issues.push({
        code: "MISSING_EXPLICIT_NON_CLAIM",
        subject: entry.semantic_id,
        field: "does_not_support",
        detail: "Core entries require at least one explicit non-claim",
      });
    }
    if (entry.status === "active" && entry.deprecated_by !== null) {
      issues.push({
        code: "INVALID_LIFECYCLE",
        subject: entry.semantic_id,
        field: "deprecated_by",
        detail: "active entries cannot declare deprecated_by",
      });
    }
    if (entry.status === "deprecated" && entry.deprecated_by === null) {
      issues.push({
        code: "INVALID_LIFECYCLE",
        subject: entry.semantic_id,
        field: "deprecated_by",
        detail: "deprecated entries require deprecated_by",
      });
    }
  }

  for (const entry of registry) {
    for (const field of SEMANTIC_REFERENCE_FIELDS) {
      for (const reference of entry[field]) {
        if (reference.startsWith("mesr.") && !entriesById.has(reference)) {
          issues.push({
            code: "UNRESOLVED_SEMANTIC_REFERENCE",
            subject: entry.semantic_id,
            field,
            detail: reference,
          });
        }
      }
    }
    if (entry.deprecated_by?.startsWith("mesr.") && !entriesById.has(entry.deprecated_by)) {
      issues.push({
        code: "UNRESOLVED_SEMANTIC_REFERENCE",
        subject: entry.semantic_id,
        field: "deprecated_by",
        detail: entry.deprecated_by,
      });
    }
  }

  issues.sort((left, right) => issueSortKey(left).localeCompare(issueSortKey(right)));
  return { valid: issues.length === 0, issues };
}

export function getMesrCoreSemantic(semanticId: string): MesrSemanticEntry | null {
  return MESR_CORE_REGISTRY.find((entry) => entry.semantic_id === semanticId) ?? null;
}
