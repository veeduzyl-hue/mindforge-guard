import { GUARD_REASON_CODES, type GuardReasonCode } from "../reasonCodes.ts";
import { MESR_CORE_REGISTRY } from "./coreRegistry.ts";
import { MESR_SOFTWARE_DOMAIN_SEED } from "./softwareDomainSeed.ts";
import type { MesrReasonCodeBinding } from "./types.ts";

const G = GUARD_REASON_CODES;
const NON_CLAIM_BUNDLES = {
  AUTH: ["authority_verified", "authority_current", "execution_authorized", "action_approved"],
  VERIFY: ["verification_passed", "change_correct", "execution_authorized", "outcome_safe"],
  EVIDENCE: ["evidence_sufficient", "artifact_truth", "claim_correctness", "execution_authorized"],
  REVIEW: ["reviewer_authority_verified", "applicable_approval", "execution_authorized", "legally_compliant"],
  EFFECT: ["outcome_correct", "outcome_safe", "causal_attribution", "execution_authorized"],
  COMPLIANCE: ["legally_compliant", "certified", "safe", "execution_authorized"],
} as const;

type NonClaimBundle = keyof typeof NON_CLAIM_BUNDLES;

function binding(
  reasonCode: GuardReasonCode,
  coreSemanticId: string,
  domainSemanticId: string | null,
  supportedClaim: string,
  bundles: readonly NonClaimBundle[],
): MesrReasonCodeBinding {
  return {
    reason_code: reasonCode,
    core_semantic_id: coreSemanticId,
    domain_semantic_id: domainSemanticId,
    supported_claim: supportedClaim,
    explicit_non_claims: [...new Set(bundles.flatMap((name) => NON_CLAIM_BUNDLES[name]))].sort(),
    binding_status: "active",
    required: true,
  };
}

export const MESR_REASON_CODE_BINDINGS: readonly MesrReasonCodeBinding[] = [
  binding(G.MISSING_AUTHORITY, "mesr.core.authority.scope", null, "authority evidence is missing for the evaluated scope", ["AUTH"]),
  binding(G.DECLARED_AUTHORITY_ONLY, "mesr.core.authority.declared", null, "producer-declared authority is present", ["AUTH"]),
  binding(G.AUTHORITY_OUT_OF_SCOPE, "mesr.core.boundary.authority", null, "submitted authority does not cover the recorded scope", ["AUTH"]),
  binding(G.REVIEWER_MISSING, "mesr.core.review.review", "mesr.domain.software.review.not_demonstrated", "reviewer context is missing", ["REVIEW"]),
  binding(G.OWNER_MISSING, "mesr.core.actor.principal", null, "ownership or principal context is missing", ["AUTH", "REVIEW"]),
  binding(G.TIME_WINDOW_MISSING, "mesr.core.temporal.basis", null, "authority time binding is missing", ["AUTH"]),
  binding(G.TIME_WINDOW_EXPIRED, "mesr.core.temporal.basis", null, "submitted authority basis is stale at evaluation time", ["AUTH"]),
  binding(G.OUT_OF_SCOPE_ACTION, "mesr.core.boundary.authority", null, "recorded action exceeds declared scope", ["AUTH", "EFFECT"]),
  binding(G.OUT_OF_SCOPE_RESOURCE, "mesr.core.boundary.authority", null, "touched resource exceeds declared scope", ["AUTH", "EFFECT"]),
  binding(G.PROTECTED_RESOURCE_TOUCHED, "mesr.core.action.action", null, "protected-resource contact is recorded", ["AUTH", "EFFECT"]),
  binding(G.UNDECLARED_FILE_CHANGE, "mesr.core.action.action", "mesr.domain.software.change.undeclared_file_observed", "a changed file is outside the declared list or limits", ["AUTH", "VERIFY"]),
  binding(G.SCOPE_TOO_BROAD, "mesr.core.claim.scope", null, "submitted scope is broader than the evaluated boundary", ["AUTH", "REVIEW"]),
  binding(G.SCOPE_INCOMPLETE, "mesr.core.claim.scope", null, "claim or action scope bindings are incomplete", ["AUTH", "EVIDENCE"]),
  binding(G.INSUFFICIENT_VERIFICATION, "mesr.core.evidence.verification", "mesr.domain.software.verification.insufficient", "available verification is insufficient for the requested claim", ["VERIFY"]),
  binding(G.TESTS_NOT_RUN, "mesr.core.evidence.verification", "mesr.domain.software.verification.test_execution_not_demonstrated", "test execution is not demonstrated", ["VERIFY"]),
  binding(G.TESTS_FAILED, "mesr.core.evidence.verification", "mesr.domain.software.verification.test_failure_observed", "submitted evidence records unsuccessful tests", ["VERIFY"]),
  binding(G.BUILD_NOT_RUN, "mesr.core.evidence.verification", "mesr.domain.software.verification.build_execution_not_demonstrated", "build execution is not demonstrated", ["VERIFY"]),
  binding(G.BUILD_FAILED, "mesr.core.evidence.verification", "mesr.domain.software.verification.build_failure_observed", "submitted evidence records an unsuccessful build", ["VERIFY"]),
  binding(G.STATIC_ANALYSIS_NOT_RUN, "mesr.core.evidence.verification", "mesr.domain.software.verification.static_analysis_not_demonstrated", "static-analysis execution is not demonstrated", ["VERIFY"]),
  binding(G.SECURITY_SCAN_NOT_RUN, "mesr.core.evidence.verification", "mesr.domain.software.verification.security_scan_not_demonstrated", "security-scan execution is not demonstrated", ["VERIFY", "COMPLIANCE"]),
  binding(G.MANUAL_REVIEW_MISSING, "mesr.core.review.review", "mesr.domain.software.review.not_demonstrated", "expected manual review evidence is missing", ["REVIEW"]),
  binding(G.ROLLBACK_MISSING, "mesr.core.evidence.item", "mesr.domain.software.release.rollback_not_demonstrated", "rollback evidence is missing", ["VERIFY", "EFFECT"]),
  binding(G.ROLLBACK_UNVERIFIED, "mesr.core.evidence.verification", "mesr.domain.software.release.rollback_not_verified", "rollback material lacks required verification", ["VERIFY", "EFFECT"]),
  binding(G.RELEASE_TARGET_UNCLEAR, "mesr.core.claim.scope", "mesr.domain.software.release.target_unclear", "release target binding is unclear", ["AUTH", "EFFECT"]),
  binding(G.PRODUCTION_ENVIRONMENT_UNVERIFIED, "mesr.core.evidence.verification", "mesr.domain.software.deployment.environment_not_verified", "production-environment claim is not sufficiently verified", ["VERIFY", "EFFECT"]),
  binding(G.BLOCKED_ACTION_PRESENT, "mesr.core.action.action", null, "a halted or blocked action is recorded", ["AUTH", "EFFECT"]),
  binding(G.DESTRUCTIVE_COMMAND_ATTEMPTED, "mesr.core.action.tool_invocation", null, "a destructive command attempt is recorded", ["AUTH", "EFFECT"]),
  binding(G.SECRET_ACCESS_ATTEMPTED, "mesr.core.action.tool_invocation", null, "a secret-access attempt is recorded", ["AUTH", "EFFECT"]),
  binding(G.NETWORK_ACCESS_ATTEMPTED, "mesr.core.action.tool_invocation", null, "a network-access attempt is recorded", ["AUTH", "EFFECT"]),
  binding(G.UNSAFE_GIT_OPERATION, "mesr.core.action.tool_invocation", null, "a Git operation with elevated concern is recorded", ["AUTH", "EFFECT"]),
  binding(G.TOOL_OUTPUT_MISSING, "mesr.core.evidence.item", null, "expected tool-output evidence is missing", ["EVIDENCE", "VERIFY"]),
  binding(G.COMMAND_RESULT_MISSING, "mesr.core.evidence.item", null, "expected command-result evidence is missing", ["EVIDENCE", "VERIFY"]),
  binding(G.HIGH_RISK_DATA, "mesr.core.evidence.observation", null, "submitted evidence identifies high-risk-data interaction", ["AUTH", "COMPLIANCE"]),
  binding(G.DATA_SENSITIVITY_UNKNOWN, "mesr.core.claim.scope", null, "data-sensitivity binding is unknown", ["EVIDENCE", "COMPLIANCE"]),
  binding(G.CREDENTIAL_RISK, "mesr.core.actor.identity_assertion", null, "credential-handling risk is recorded", ["AUTH", "COMPLIANCE"]),
  binding(G.EXFILTRATION_RISK, "mesr.core.evidence.observation", null, "evidence records possible exfiltration risk", ["EFFECT", "COMPLIANCE"]),
  binding(G.SECURITY_PATCH_SCOPE_UNCLEAR, "mesr.core.claim.scope", "mesr.domain.software.change.diff_scope", "security-patch scope is unclear", ["AUTH", "VERIFY", "COMPLIANCE"]),
  binding(G.CYBER_AUTHORIZATION_REQUIRED, "mesr.core.boundary.authority", null, "stronger applicable authorization evidence is required", ["AUTH", "COMPLIANCE"]),
  binding(G.EVIDENCE_INCOMPLETE, "mesr.core.evidence.item", null, "evidence is incomplete for the requested interpretation", ["EVIDENCE"]),
  binding(G.MANIFEST_INCOMPLETE, "mesr.core.evidence.item", null, "evidence inventory is incomplete", ["EVIDENCE"]),
  binding(G.ARTIFACT_MISSING, "mesr.core.evidence.item", null, "an expected artifact is missing", ["EVIDENCE"]),
  binding(G.ARTIFACT_HASH_MISSING, "mesr.core.provenance.lineage", null, "stable artifact-integrity binding is missing", ["EVIDENCE"]),
  binding(G.ARTIFACT_REF_UNRESOLVED, "mesr.core.provenance.lineage", null, "an artifact reference is unresolvable", ["EVIDENCE"]),
  binding(G.PROVENANCE_MISSING, "mesr.core.provenance.lineage", null, "required lineage is missing", ["EVIDENCE"]),
  binding(G.PRODUCER_IDENTITY_UNKNOWN, "mesr.core.provenance.producer", null, "producer identity is unknown", ["EVIDENCE", "VERIFY"]),
  binding(G.NON_DETERMINISTIC_PRODUCER, "mesr.core.provenance.producer", null, "producer generation may be non-deterministic", ["EVIDENCE", "VERIFY"]),
  binding(G.DEPENDENCY_CHANGE_DETECTED, "mesr.core.effect.state_transition", "mesr.domain.software.change.dependency_observed", "a dependency-oriented change is recorded", ["VERIFY", "EFFECT"]),
  binding(G.BREAKING_CHANGE_UNVERIFIED, "mesr.core.evidence.verification", "mesr.domain.software.change.breaking_impact_not_verified", "breaking-impact verification is missing or insufficient", ["VERIFY", "EFFECT"]),
  binding(G.LOCKFILE_CHANGED, "mesr.core.effect.state_transition", "mesr.domain.software.change.lockfile_observed", "a lockfile change is recorded", ["VERIFY", "EFFECT"]),
  binding(G.MIGRATION_NOT_DOCUMENTED, "mesr.core.evidence.item", "mesr.domain.software.change.migration_not_documented", "expected migration evidence is missing", ["EVIDENCE", "VERIFY"]),
  binding(G.PUBLIC_API_CHANGE_UNVERIFIED, "mesr.core.evidence.verification", "mesr.domain.software.change.public_api_impact_not_verified", "public-API impact is not sufficiently verified", ["VERIFY", "EFFECT"]),
  binding(G.HUMAN_REVIEW_REQUIRED, "mesr.core.review.review", null, "human review is requested by current reasoning", ["REVIEW"]),
  binding(G.SECURITY_REVIEW_REQUIRED, "mesr.core.review.review", null, "security-oriented review is requested", ["REVIEW", "COMPLIANCE"]),
  binding(G.OWNER_REVIEW_REQUIRED, "mesr.core.review.review", null, "owner review is requested", ["REVIEW"]),
  binding(G.RELEASE_REVIEW_REQUIRED, "mesr.core.review.review", "mesr.domain.software.review.not_demonstrated", "release-oriented review is requested", ["REVIEW"]),
  binding(G.CUSTOMER_REVIEW_REQUIRED, "mesr.core.review.review", null, "customer-facing review is requested", ["REVIEW"]),
] as const;

export interface MesrReasonBindingValidationResult {
  valid: boolean;
  current_reason_count: number;
  mapped_count: number;
  duplicates: string[];
  orphan_mappings: string[];
  missing_mappings: string[];
  unresolved_semantic_ids: string[];
  order_preserved: boolean;
}

export function validateMesrReasonCodeBindings(
  bindings: readonly MesrReasonCodeBinding[] = MESR_REASON_CODE_BINDINGS,
): MesrReasonBindingValidationResult {
  const currentReasons = Object.values(GUARD_REASON_CODES);
  const currentSet = new Set<string>(currentReasons);
  const knownSemanticIds = new Set([
    ...MESR_CORE_REGISTRY.map((entry) => entry.semantic_id),
    ...MESR_SOFTWARE_DOMAIN_SEED.map((entry) => entry.semantic_id),
  ]);
  const seen = new Set<string>();
  const duplicates: string[] = [];
  const orphanMappings: string[] = [];
  const unresolvedSemanticIds: string[] = [];

  for (const entry of bindings) {
    if (seen.has(entry.reason_code)) duplicates.push(entry.reason_code);
    seen.add(entry.reason_code);
    if (!currentSet.has(entry.reason_code)) orphanMappings.push(entry.reason_code);
    for (const semanticId of [entry.core_semantic_id, entry.domain_semantic_id].filter(Boolean) as string[]) {
      if (!knownSemanticIds.has(semanticId)) unresolvedSemanticIds.push(`${entry.reason_code}:${semanticId}`);
    }
  }

  const missingMappings = currentReasons.filter((reasonCode) => !seen.has(reasonCode));
  const orderPreserved = bindings.every((entry, index) => entry.reason_code === currentReasons[index]);
  for (const values of [duplicates, orphanMappings, missingMappings, unresolvedSemanticIds]) values.sort();
  return {
    valid: duplicates.length === 0 && orphanMappings.length === 0 && missingMappings.length === 0 && unresolvedSemanticIds.length === 0 && orderPreserved,
    current_reason_count: currentReasons.length,
    mapped_count: bindings.length,
    duplicates,
    orphan_mappings: orphanMappings,
    missing_mappings: missingMappings,
    unresolved_semantic_ids: unresolvedSemanticIds,
    order_preserved: orderPreserved,
  };
}
