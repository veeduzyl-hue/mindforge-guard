import { MESR_REASON_CODE_BINDINGS } from "../reasonCodeBindings.ts";
import { evaluateMesrClaimSupport } from "../supportEvaluator.ts";
import type {
  MesrClaimSupportResult,
  MesrSemanticBinding,
  MesrSemanticProjection,
} from "../types.ts";
import type { ProducerSemanticInput } from "./types.ts";

function present(value: unknown): boolean {
  return value !== null && value !== undefined && value !== "" &&
    (!Array.isArray(value) || value.length > 0);
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

function addSemanticBinding(
  target: MesrSemanticBinding[],
  semanticId: string,
  binding: string,
  value: MesrSemanticBinding["value"],
): void {
  if (present(value)) target.push({ semantic_id: semanticId, binding, value });
}

export function projectProducerSemanticInputToMesr(
  input: ProducerSemanticInput,
): MesrSemanticProjection {
  const semanticIds = new Set<string>([
    "mesr.core.claim.claim",
    "mesr.core.claim.scope",
    "mesr.core.claim.support_relation",
    "mesr.core.provenance.producer",
    "mesr.core.provenance.lineage",
  ]);
  if (input.subject.actor) semanticIds.add("mesr.core.actor.actor");
  if (input.subject.subject_ref || input.subject.candidate_revision) semanticIds.add("mesr.core.action.action");
  if (input.authority.source) semanticIds.add("mesr.core.authority.source");
  if (input.authority.scope.length > 0) semanticIds.add("mesr.core.authority.scope");
  if (input.verification.executed !== null || input.verification.result !== null) {
    semanticIds.add("mesr.core.evidence.verification");
  }
  if (input.artifact.identity || input.artifact.digest) semanticIds.add("mesr.core.evidence.item");
  if (input.review.exists !== null) semanticIds.add("mesr.core.review.review");
  if (input.effect.observed !== null) {
    semanticIds.add("mesr.core.effect.effect");
    semanticIds.add("mesr.core.effect.state_transition");
  }
  if (
    input.verification.observed_at || input.review.reviewed_at ||
    input.effect.observed_at || input.authority.valid_time
  ) semanticIds.add("mesr.core.temporal.basis");

  const relations: MesrClaimSupportResult[] = [];
  const evaluate = (
    claimId: string,
    ids: readonly string[],
    providedBindings: Readonly<Record<string, unknown>>,
    requiredBindings: readonly string[],
    supported: boolean,
    observedStateIds: readonly string[] = [],
    contradicted = false,
  ): void => {
    relations.push(evaluateMesrClaimSupport({
      claim_id: claimId,
      semantic_ids: ids,
      observed_state_ids: observedStateIds,
      provided_bindings: providedBindings,
      required_bindings: requiredBindings,
      supported_claim_parts: supported ? [claimId] : [],
      contradicted_claims: contradicted ? [claimId] : [],
      evidence_refs: input.provenance.map((entry) =>
        `${entry.producer_id}:${entry.native_field}`
      ),
    }));
  };

  evaluate(
    "bounded_software_change_observed",
    ["mesr.core.action.action", "mesr.domain.software.change.subject"],
    {
      repository: input.subject.repository,
      base_revision: input.subject.base_revision,
      candidate_revision: input.subject.candidate_revision,
      diff_scope: input.subject.changed_paths,
      actor: input.subject.actor,
      action: input.subject.action,
      observed_at: input.verification.observed_at,
    },
    ["repository", "base_revision", "candidate_revision", "diff_scope", "actor", "action", "observed_at"],
    true,
  );
  evaluate(
    "tests_executed",
    ["mesr.core.evidence.verification", "mesr.domain.software.verification.test_evidence"],
    {
      executed: input.verification.executed === true ? true : null,
      subject: input.verification.subject_revision,
      method: input.verification.method,
      time: input.verification.observed_at,
    },
    ["executed", "subject", "method", "time"],
    input.verification.executed === true,
    input.producer_claims.verification_claim_present ? ["producer_claim_present"] : [],
  );
  evaluate(
    "tests_passed",
    ["mesr.core.evidence.verification", "mesr.domain.software.verification.test_evidence"],
    {
      executed: input.verification.executed === true ? true : null,
      result: input.verification.result,
      subject: input.verification.subject_revision,
      method: input.verification.method,
      time: input.verification.observed_at,
    },
    ["executed", "result", "subject", "method", "time"],
    input.verification.executed === true && input.verification.result === "passed",
    input.verification.result === "passed" ? ["verification_passed"] : [],
    input.verification.result === "failed",
  );
  evaluate(
    "artifact_integrity",
    ["mesr.core.evidence.item", "mesr.core.evidence.verification"],
    { digest: input.artifact.digest, subject: input.artifact.subject_revision },
    ["digest", "subject"],
    Boolean(input.artifact.digest),
    input.artifact.digest ? ["artifact_integrity"] : [],
  );
  evaluate(
    "applicable_review_exists",
    ["mesr.core.review.review", "mesr.core.claim.scope"],
    {
      subject: input.review.subject_revision,
      scope: input.review.scope,
      authority: input.review.authority_ref,
      time: input.review.reviewed_at,
    },
    ["subject", "scope", "authority", "time"],
    input.review.exists === true,
    input.producer_claims.approval_record_present || input.review.exists === true
      ? ["approval_record_exists"]
      : [],
  );
  const subjectsComparable = Boolean(
    input.verification.subject_revision && input.release.subject_revision,
  );
  const subjectsMatch = subjectsComparable &&
    input.verification.subject_revision === input.release.subject_revision;
  evaluate(
    "release_subject_equals_verification_subject",
    ["mesr.domain.software.verification.subject_equals_execution_subject"],
    {
      verification_subject: input.verification.subject_revision,
      release_subject: input.release.subject_revision,
      comparison_method: subjectsComparable ? "exact_revision_identity" : null,
      time: input.effect.observed_at ?? input.verification.observed_at,
    },
    ["verification_subject", "release_subject", "comparison_method", "time"],
    subjectsMatch,
    [],
    subjectsComparable && !subjectsMatch,
  );
  evaluate(
    "authority_verified",
    ["mesr.core.evidence.item"],
    {},
    [],
    false,
    input.producer_claims.approval_record_present ? ["evidence_present"] : [],
  );
  evaluate(
    "execution_authorized",
    ["mesr.core.evidence.verification", "mesr.core.review.review"],
    {},
    [],
    false,
    input.verification.result === "passed" ? ["verification_passed"] : [],
  );
  evaluate(
    "independent_verification",
    ["mesr.core.provenance.producer"],
    {},
    [],
    false,
    input.producer_claims.verification_claim_present ? ["producer_claim_present"] : [],
  );
  evaluate(
    "artifact_truth",
    ["mesr.core.evidence.verification"],
    {},
    [],
    false,
    input.artifact.digest ? ["artifact_integrity"] : [],
  );
  evaluate(
    "change_correctness",
    ["mesr.core.evidence.verification"],
    {},
    [],
    false,
    input.artifact.digest ? ["artifact_integrity"] : [],
  );
  evaluate(
    "safe",
    ["mesr.core.evidence.verification"],
    {},
    [],
    false,
    input.artifact.digest ? ["artifact_integrity"] : [],
  );

  const bindings: MesrSemanticBinding[] = [];
  addSemanticBinding(bindings, "mesr.domain.software.change.subject", "subject_ref", input.subject.subject_ref);
  addSemanticBinding(bindings, "mesr.domain.software.change.subject", "repository", input.subject.repository);
  addSemanticBinding(bindings, "mesr.domain.software.change.base_commit", "immutable_commit_id", input.subject.base_revision);
  addSemanticBinding(bindings, "mesr.domain.software.change.candidate_commit", "immutable_commit_id", input.subject.candidate_revision);
  addSemanticBinding(bindings, "mesr.domain.software.change.diff_scope", "changed_paths", input.subject.changed_paths);
  addSemanticBinding(bindings, "mesr.core.actor.actor", "actor_id", input.subject.actor);
  addSemanticBinding(bindings, "mesr.core.action.action", "action_type", input.subject.action);
  addSemanticBinding(bindings, "mesr.core.authority.source", "source_identity", input.authority.source);
  addSemanticBinding(bindings, "mesr.core.authority.scope", "scope", input.authority.scope);
  addSemanticBinding(bindings, "mesr.domain.software.verification.test_evidence", "executed", input.verification.executed);
  addSemanticBinding(bindings, "mesr.domain.software.verification.test_evidence", "result", input.verification.result);
  addSemanticBinding(bindings, "mesr.domain.software.verification.test_evidence", "subject_revision", input.verification.subject_revision);
  addSemanticBinding(bindings, "mesr.core.evidence.item", "artifact_digest", input.artifact.digest);
  addSemanticBinding(bindings, "mesr.core.evidence.item", "subject_revision", input.artifact.subject_revision);
  addSemanticBinding(bindings, "mesr.domain.software.review.binding", "subject_revision", input.review.subject_revision);
  addSemanticBinding(bindings, "mesr.domain.software.review.binding", "scope", input.review.scope);
  addSemanticBinding(bindings, "mesr.domain.software.review.binding", "authority_ref", input.review.authority_ref);
  addSemanticBinding(bindings, "mesr.domain.software.release.identity", "release_identity", input.release.identity);
  addSemanticBinding(bindings, "mesr.domain.software.release.identity", "subject_revision", input.release.subject_revision);
  addSemanticBinding(bindings, "mesr.domain.software.release.identity", "artifact_digest", input.release.artifact_digest);
  addSemanticBinding(bindings, "mesr.domain.software.deployment.effect", "observed", input.effect.observed);
  addSemanticBinding(bindings, "mesr.domain.software.deployment.effect", "release_identity", input.effect.release_identity);
  addSemanticBinding(bindings, "mesr.domain.software.deployment.effect", "subject_revision", input.effect.subject_revision);
  addSemanticBinding(bindings, "mesr.domain.software.deployment.effect", "environment", input.effect.environment);
  addSemanticBinding(bindings, "mesr.domain.software.deployment.effect", "before_state", input.effect.before_state);
  addSemanticBinding(bindings, "mesr.domain.software.deployment.effect", "after_state", input.effect.after_state);

  const explicitNonClaims = sortedUnique([
    ...relations.flatMap((entry) => entry.explicit_non_claims),
    "artifact_truth",
    "authority_verified",
    "certified",
    "change_correctness",
    "execution_authorized",
    "governance_verdict",
    "independent_verification",
    "safe",
  ]);

  return {
    semantic_ids: sortedUnique([...semanticIds]),
    claim_support_relations: relations,
    claim_boundaries_applied: sortedUnique(
      relations.flatMap((entry) => entry.claim_boundaries_applied),
    ),
    explicit_non_claims: explicitNonClaims,
    semantic_provenance: input.provenance.map((entry) =>
      `${entry.semantic_fact}|${entry.producer_id}|${entry.producer_schema_version}|${entry.adapter_id}@${entry.adapter_version}|${entry.native_field}`
    ),
    subject_effect_bindings: bindings,
    reason_code_bindings: MESR_REASON_CODE_BINDINGS,
  };
}
