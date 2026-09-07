import { MESR_CORE_VERSION, type MesrModuleManifest, type MesrSemanticEntry } from "./types.ts";

const SOURCE = ["docs/specs/mesr-software-change-domain-pack-v0.1.md"] as const;

function softwareEntry(semanticId: string, definition: string, requiredBindings: readonly string[] = ["subject", "provenance"]): MesrSemanticEntry {
  return {
    semantic_id: semanticId,
    namespace: "mesr.domain.software",
    version: MESR_CORE_VERSION,
    definition,
    status: "active",
    supports: [`${semanticId}.observed`],
    does_not_support: ["execution_authorized", "outcome_safe", "claim_correctness"],
    stronger_than: [], weaker_than: [], conflicts_with: [],
    required_bindings: requiredBindings,
    provenance: SOURCE,
    supersedes: [], deprecated_by: null,
  };
}

export const MESR_SOFTWARE_DOMAIN_SEED: readonly MesrSemanticEntry[] = [
  softwareEntry("mesr.domain.software.change.subject", "Bounded software change under review.", ["repository", "base_ref", "candidate_ref", "diff_scope", "subject_hash"]),
  softwareEntry("mesr.domain.software.change.base_commit", "Revision against which the candidate is compared.", ["repository", "immutable_commit_id", "provenance"]),
  softwareEntry("mesr.domain.software.change.candidate_commit", "Candidate revision proposed for review.", ["repository", "immutable_commit_id", "provenance"]),
  softwareEntry("mesr.domain.software.change.diff_scope", "Files, paths, and change set between base and candidate.", ["base", "candidate", "canonical_diff_identity"]),
  softwareEntry("mesr.domain.software.authority.code_owner", "Evidence of applicable code-owner authority.", ["actor", "repository_or_path", "action", "source", "valid_time"]),
  softwareEntry("mesr.domain.software.verification.test_evidence", "Test execution evidence bound to a candidate.", ["candidate_or_subject_hash", "command_or_suite", "result", "producer_or_verifier", "time"]),
  softwareEntry("mesr.domain.software.review.binding", "Review event bound to an exact software subject.", ["reviewer", "reviewer_authority_ref", "subject_hash", "scope", "time", "rationale_ref"]),
  softwareEntry("mesr.domain.software.release.identity", "Immutable identity of an accepted or released revision or artifact.", ["candidate_or_accepted_commit", "artifact_digest_or_tag", "provenance"]),
  softwareEntry("mesr.domain.software.deployment.effect", "Observed deployment transition for a release identity.", ["release_identity", "environment", "before_state", "after_state", "time", "provenance"]),
  softwareEntry("mesr.domain.software.rollback.reference", "Addressable rollback or recovery material.", ["release_identity_or_environment", "reference_or_digest", "valid_time"]),
  softwareEntry("mesr.domain.software.verification.subject_equals_execution_subject", "Equality check between reviewed or verified subject and executed or deployed subject.", ["review_subject_identity", "execution_subject_identity", "comparison_method", "time"]),
  softwareEntry("mesr.domain.software.verification.insufficient", "Available software verification is insufficient for the requested bounded claim."),
  softwareEntry("mesr.domain.software.verification.test_execution_not_demonstrated", "Test execution is not demonstrated by submitted evidence."),
  softwareEntry("mesr.domain.software.verification.test_failure_observed", "Submitted evidence records unsuccessful tests."),
  softwareEntry("mesr.domain.software.verification.build_execution_not_demonstrated", "Build execution is not demonstrated by submitted evidence."),
  softwareEntry("mesr.domain.software.verification.build_failure_observed", "Submitted evidence records an unsuccessful build."),
  softwareEntry("mesr.domain.software.verification.static_analysis_not_demonstrated", "Static-analysis execution is not demonstrated by submitted evidence."),
  softwareEntry("mesr.domain.software.verification.security_scan_not_demonstrated", "Security-scan execution is not demonstrated by submitted evidence."),
  softwareEntry("mesr.domain.software.review.not_demonstrated", "Expected software review evidence is not demonstrated."),
  softwareEntry("mesr.domain.software.release.rollback_not_demonstrated", "Rollback evidence is not demonstrated."),
  softwareEntry("mesr.domain.software.release.rollback_not_verified", "Rollback material lacks required verification."),
  softwareEntry("mesr.domain.software.release.target_unclear", "Release target binding is unclear."),
  softwareEntry("mesr.domain.software.deployment.environment_not_verified", "Production-environment claim is not sufficiently verified."),
  softwareEntry("mesr.domain.software.change.undeclared_file_observed", "A changed file is outside the declared list or limits."),
  softwareEntry("mesr.domain.software.change.dependency_observed", "A dependency-oriented change is recorded."),
  softwareEntry("mesr.domain.software.change.breaking_impact_not_verified", "Breaking-impact verification is missing or insufficient."),
  softwareEntry("mesr.domain.software.change.lockfile_observed", "A lockfile change is recorded."),
  softwareEntry("mesr.domain.software.change.migration_not_documented", "Expected migration evidence is missing."),
  softwareEntry("mesr.domain.software.change.public_api_impact_not_verified", "Public-API impact is not sufficiently verified."),
] as const;

export const MESR_SOFTWARE_DOMAIN_MODULE: MesrModuleManifest = {
  module_id: "mesr.module.software.v0_1",
  module_type: "domain_pack",
  version: MESR_CORE_VERSION,
  semantic_namespace: "mesr.domain.software",
  core_compatibility: ">=0.1.0 <0.2.0",
  dependencies: [{ module_id: "mesr.core", version: MESR_CORE_VERSION }],
  added_semantics: MESR_SOFTWARE_DOMAIN_SEED,
  mappings: [], external_references: [],
  prohibited_overrides: ["mesr.core.*", "core.required_bindings", "core.support_relations", "core.does_not_support"],
  conformance_requirements: ["semantic_non_interference", "deterministic_resolution", "explicit_provenance", "no_execution_authority"],
};
