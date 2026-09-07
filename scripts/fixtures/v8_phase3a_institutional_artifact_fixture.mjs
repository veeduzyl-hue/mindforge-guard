import { createHash } from "node:crypto";
import { createExperiment0Cases } from "./evidence_assurance_experiment_0_cases.mjs";
import { evaluateMesrClaimSupport } from "../../packages/guard-core/src/mesr/supportEvaluator.ts";

const SCHEMA_VERSION = "institutional-artifact-v0.1";
const GENERATED_AT = "2026-09-07T00:00:00.000Z";

const SOURCE_REFS = Object.freeze({
  basePack: "fixtures/ai-pr-low-risk-complete/evidence-pack.json",
  caseDefinition:
    "scripts/fixtures/evidence_assurance_experiment_0_cases.mjs#caseC_conclusion_specific_missing_evidence",
  mesrCore: "docs/specs/mesr-core-v0.1.md",
  claimBoundaries: "docs/specs/mesr-claim-boundary-registry-v0.1.md",
  softwarePack: "docs/specs/mesr-software-change-domain-pack-v0.1.md",
  dispositionBoundary:
    "docs/adr/0008-claim-supportability-is-not-governance-disposition.md"
});

const SECTION_IDS = Object.freeze([
  "consequential_transition",
  "evidence_summary",
  "claim_support",
  "explicit_nonclaims",
  "authority_context",
  "temporal_basis",
  "semantic_provenance",
  "residual_uncertainty",
  "reviewer_questions",
  "required_follow_up"
]);

const FROZEN_REVIEWER_QUESTIONS = Object.freeze([
  "What consequential transition is this artifact asking you to review?",
  "Which claim is supported, by which evidence, and within what boundary?",
  "What does the artifact explicitly say it does not prove or authorize?",
  "What authority is declared, what authority is independently verified, and what authority evidence is missing?",
  "Can you trace one conclusion from its artifact statement to the source evidence and semantic identifiers?",
  "Which evidence is stale, missing, conflicting, or otherwise insufficient for your decision?",
  "What additional evidence or human follow-up would you request before disposition?",
  "Did this artifact improve the review workflow; if so, where did it reduce evidence chase or ambiguity?",
  "Where, if anywhere, does the artifact overclaim, imply certification, or exceed its evidence?",
  "Can you rely on this artifact as review input without delegating your institutional decision or authority to Guard?"
]);

const PROFILE_CONFIG = Object.freeze({
  Developer: Object.freeze({
    artifactId: "institutional-artifact.phase3a.case-c.developer.v0.1",
    profileId: "mesr.profile.developer.phase3a_v0_1",
    sectionOrder: Object.freeze([...SECTION_IDS]),
    emphasisStatementIds: Object.freeze([
      "claim.checked-property",
      "uncertainty.runtime-evidence",
      "review-request.runtime-evidence"
    ])
  }),
  "Audit/Assurance": Object.freeze({
    artifactId: "institutional-artifact.phase3a.case-c.audit-assurance.v0.1",
    profileId: "mesr.profile.audit_assurance.phase3a_v0_1",
    sectionOrder: Object.freeze([
      "authority_context",
      "explicit_nonclaims",
      "semantic_provenance",
      "temporal_basis",
      "consequential_transition",
      "evidence_summary",
      "claim_support",
      "residual_uncertainty",
      "required_follow_up",
      "reviewer_questions"
    ]),
    emphasisStatementIds: Object.freeze([
      "nonclaim.no-approval",
      "nonclaim.no-independent-authority-verification",
      "uncertainty.temporal-authority",
      "review-request.decision-owner"
    ])
  })
});

function assertReviewCase(reviewCase) {
  if (reviewCase.pack.workflow.environment !== "staging") throw new Error("Case C must target staging");
  if (reviewCase.review_scope.runtime_behavior_in_scope !== true) throw new Error("Case C must include runtime behavior");
  if (reviewCase.external_assurance_reports.length !== 0) throw new Error("Case C must preserve the missing external runtime evidence");
}

function statement(statementId, statementKind, text, evidenceRefs = []) {
  return {
    statement_id: statementId,
    statement_kind: statementKind,
    text,
    evidence_refs: [...evidenceRefs]
  };
}

function buildSemanticState(reviewCase) {
  assertReviewCase(reviewCase);
  const subjectRef = reviewCase.pack.workflow.repository.commit_sha;
  const verification = reviewCase.pack.verification[0];
  const testAction = reviewCase.pack.actions.find((action) => action.action_type === "test_execution");
  const verificationBindings = {
    verifier: reviewCase.pack.producer.producer_id,
    method: verification.command,
    subject: subjectRef,
    scope: verification.coverage_note,
    verified_at: testAction.timestamp,
    result: verification.status,
    limitations: "utility-specific verification only",
    candidate_or_subject_hash: subjectRef,
    command_or_suite: verification.command,
    producer_or_verifier: reviewCase.pack.producer.producer_id,
    time: testAction.timestamp
  };
  const verificationRequiredBindings = [
    "verifier",
    "method",
    "subject",
    "scope",
    "verified_at",
    "result",
    "limitations",
    "candidate_or_subject_hash",
    "command_or_suite",
    "producer_or_verifier",
    "time"
  ];
  const supportedResult = evaluateMesrClaimSupport({
    claim_id: "checked_property_within_scope",
    semantic_ids: [
      "mesr.core.evidence.verification",
      "mesr.domain.software.verification.test_evidence"
    ],
    provided_bindings: verificationBindings,
    required_bindings: verificationRequiredBindings,
    evidence_refs: [`${SOURCE_REFS.caseDefinition}:$.pack.verification[0]`]
  });
  const executionNonclaimResult = evaluateMesrClaimSupport({
    claim_id: "execution_authorized",
    semantic_ids: ["mesr.core.evidence.verification"],
    observed_state_ids: ["verification_passed"],
    provided_bindings: {},
    required_bindings: []
  });
  const runtimeResult = evaluateMesrClaimSupport({
    claim_id: "runtime_behavior_verified",
    semantic_ids: [
      "mesr.core.evidence.verification",
      "mesr.domain.software.deployment.environment_not_verified"
    ],
    provided_bindings: { subject: subjectRef },
    required_bindings: verificationRequiredBindings,
    evidence_refs: [`${SOURCE_REFS.caseDefinition}:$.external_assurance_reports(empty)`]
  });
  const supportedClaim = statement(
    "claim.checked-property",
    "SUPPORTED_CLAIM",
    "The controlled workflow evidence supports only that the recorded test property passed within the stated verification scope.",
    [
      `${SOURCE_REFS.caseDefinition}:$.pack.verification[0].status`,
      SOURCE_REFS.mesrCore,
      SOURCE_REFS.softwarePack
    ]
  );

  const runtimeUncertainty = statement(
    "uncertainty.runtime-evidence",
    "UNCERTAINTY",
    "Runtime behavior is in scope for the staging transition, but runtime-behavior evidence is absent from the controlled case.",
    [
      `${SOURCE_REFS.caseDefinition}:$.pack.workflow.environment`,
      `${SOURCE_REFS.caseDefinition}:$.external_assurance_reports(empty)`
    ]
  );

  const noApproval = statement(
    "nonclaim.no-approval",
    "NON_CLAIM",
    "The supported verification claim does not approve the change and does not authorize execution or deployment.",
    [SOURCE_REFS.claimBoundaries, SOURCE_REFS.dispositionBoundary]
  );

  const noIndependentAuthority = statement(
    "nonclaim.no-independent-authority-verification",
    "NON_CLAIM",
    "The artifact does not independently verify producer-supplied authority or verifier independence.",
    [SOURCE_REFS.caseDefinition, SOURCE_REFS.claimBoundaries]
  );

  return {
    consequential_transition: [
      statement(
        "fact.transition",
        "FACT",
        "The controlled repository case changes AI-assisted software subject ${subjectRef} from proposed evidence to institutional review input for a staging transition.",
        [SOURCE_REFS.basePack, SOURCE_REFS.caseDefinition]
      )
    ],
    evidence_summary: {
      observed: [
        statement(
          "fact.subject",
          "FACT",
          "The evidence pack identifies repository commit ${subjectRef} as the review subject.",
          [`${SOURCE_REFS.basePack}:$.workflow.repository.commit_sha`]
        ),
        statement(
          "fact.environment",
          "FACT",
          "The controlled Case C definition sets the workflow environment to staging and marks runtime behavior as in scope.",
          [`${SOURCE_REFS.caseDefinition}:$.pack.workflow.environment`]
        )
      ],
      verified: [
        statement(
          "fact.test-verification",
          "FACT",
          "The controlled workflow record reports a passed test verification; its subject, command, result, producer/verifier, time, and bounded coverage are traceable within the pack.",
          [`${SOURCE_REFS.caseDefinition}:$.pack.verification[0]`]
        )
      ],
      missing: [runtimeUncertainty],
      conflicting: []
    },
    claim_support: [
      {
        claim_id: "checked_property_within_scope",
        core_semantic_id: "mesr.core.evidence.verification",
        domain_semantic_id: "mesr.domain.software.verification.test_evidence",
        relation: supportedResult.relation,
        claim_boundary_ids: supportedResult.claim_boundaries_applied,
        required_bindings: verificationRequiredBindings,
        observed_bindings: supportedResult.satisfied_bindings,
        missing_bindings: supportedResult.missing_bindings,
        supporting_evidence_refs: [`${SOURCE_REFS.caseDefinition}:$.pack.verification[0]`],
        statement: supportedClaim
      },
      {
        claim_id: "runtime_behavior_verified",
        core_semantic_id: "mesr.core.evidence.verification",
        domain_semantic_id: "mesr.domain.software.deployment.environment_not_verified",
        relation: runtimeResult.relation,
        claim_boundary_ids: runtimeResult.claim_boundaries_applied,
        required_bindings: verificationRequiredBindings,
        observed_bindings: runtimeResult.satisfied_bindings,
        missing_bindings: runtimeResult.missing_bindings,
        supporting_evidence_refs: [`${SOURCE_REFS.caseDefinition}:$.external_assurance_reports(empty)`],
        statement: runtimeUncertainty
      }
    ],
    explicit_nonclaims: [
      noApproval,
      noIndependentAuthority,
      statement(
        "nonclaim.no-runtime-proof",
        "NON_CLAIM",
        "The passed test verification does not prove runtime behavior in staging.",
        [SOURCE_REFS.claimBoundaries, SOURCE_REFS.softwarePack]
      ),
      statement(
        "nonclaim.no-certification",
        "NON_CLAIM",
        "The artifact is not a certification, legal opinion, policy decision, or institutional disposition.",
        [SOURCE_REFS.dispositionBoundary]
      )
    ],
    authority_context: {
      declared: [
        statement(
          "fact.declared-authority",
          "FACT",
          "The controlled evidence pack includes producer-supplied authority metadata and a declared validity window.",
          [`${SOURCE_REFS.basePack}:$.authority`]
        )
      ],
      verified: [],
      missing: [
        noIndependentAuthority,
        statement(
          "uncertainty.authority-evidence",
          "UNCERTAINTY",
          "No independent institutional authority attestation or verifier-independence evidence is present in the controlled case.",
          [`${SOURCE_REFS.caseDefinition}:$.pack.authority`, `${SOURCE_REFS.caseDefinition}:$.pack.verification[0]`]
        )
      ]
    },
    temporal_basis: {
      basis_valid_at: GENERATED_AT,
      basis_status: "stale",
      statements: [
        statement(
          "uncertainty.temporal-authority",
          "UNCERTAINTY",
          "At the Phase 3A fixture evaluation time, the producer-declared authority window in the historical evidence pack has ended; this temporal result does not independently validate authority.",
          [`${SOURCE_REFS.basePack}:$.authority.time_window.end_at`]
        )
      ],
      provenance_refs: [`${SOURCE_REFS.basePack}:$.created_at`, `${SOURCE_REFS.basePack}:$.authority`]
    },
    semantic_provenance: [
      {
        chain_id: "provenance.supported-test-claim",
        chain_kind: "supported_claim",
        source_pointer: `${SOURCE_REFS.caseDefinition}:$.pack.verification[0].status`,
        normalized_fact: statement(
          "fact.provenance.test-passed",
          "FACT",
          "The bounded test verification status is passed.",
          [`${SOURCE_REFS.caseDefinition}:$.pack.verification[0].status`]
        ),
        core_semantic_id: "mesr.core.evidence.verification",
        domain_semantic_id: "mesr.domain.software.verification.test_evidence",
        claim_boundary_id: null,
        support_relation: supportedResult.relation,
        artifact_statement_id: supportedClaim.statement_id
      },
      {
        chain_id: "provenance.explicit-execution-nonclaim",
        chain_kind: "explicit_nonclaim",
        source_pointer: `${SOURCE_REFS.caseDefinition}:$.pack.verification[0].status`,
        normalized_fact: statement(
          "fact.provenance.verification-observation",
          "FACT",
          "A verification result is an evidence observation, not execution authority.",
          [`${SOURCE_REFS.caseDefinition}:$.pack.verification[0].status`, SOURCE_REFS.claimBoundaries]
        ),
        core_semantic_id: "mesr.core.evidence.verification",
        domain_semantic_id: "mesr.domain.software.verification.test_evidence",
        claim_boundary_id: executionNonclaimResult.claim_boundaries_applied[0],
        support_relation: executionNonclaimResult.relation,
        artifact_statement_id: noApproval.statement_id
      },
      {
        chain_id: "provenance.indeterminate-runtime-claim",
        chain_kind: "missing_or_indeterminate",
        source_pointer: `${SOURCE_REFS.caseDefinition}:$.external_assurance_reports(empty)`,
        normalized_fact: statement(
          "uncertainty.provenance.runtime-absent",
          "UNCERTAINTY",
          "Runtime behavior is applicable but no runtime verification fact is available.",
          [`${SOURCE_REFS.caseDefinition}:$.pack.workflow.environment`, `${SOURCE_REFS.caseDefinition}:$.external_assurance_reports(empty)`]
        ),
        core_semantic_id: "mesr.core.evidence.verification",
        domain_semantic_id: "mesr.domain.software.deployment.environment_not_verified",
        claim_boundary_id: null,
        support_relation: runtimeResult.relation,
        artifact_statement_id: "review-request.runtime-evidence"
      }
    ],
    residual_uncertainty: [
      runtimeUncertainty,
      statement(
        "uncertainty.institutional-disposition",
        "UNCERTAINTY",
        "The controlled evidence cannot determine the institution's disposition or the additional evidence its accountable reviewer will require.",
        [SOURCE_REFS.dispositionBoundary]
      )
    ],
    reviewer_questions: FROZEN_REVIEWER_QUESTIONS.map((text, index) =>
      statement(`review-question.${String(index + 1).padStart(2, "0")}`, "REVIEW_REQUEST", text, [
        "docs/validation/v8-gate-3-institutional-artifact-acceptance-contract-v0.1.md"
      ])
    ),
    required_follow_up: [
      statement(
        "review-request.runtime-evidence",
        "REVIEW_REQUEST",
        "Determine which runtime-behavior evidence is required before institutional disposition of the staging transition.",
        [`${SOURCE_REFS.caseDefinition}:$.external_assurance_reports(empty)`]
      ),
      statement(
        "review-request.decision-owner",
        "REVIEW_REQUEST",
        "Record the accountable institutional decision owner outside Guard and whether further authority evidence is required.",
        [SOURCE_REFS.dispositionBoundary]
      )
    ]
  };
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])])
    );
  }
  return value;
}

export function canonicalJson(value) {
  return `${JSON.stringify(canonicalize(value), null, 2)}\n`;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function renderStatement(value) {
  return `- [${value.statement_kind}] ${value.text} (${value.statement_id})`;
}

function renderSection(sectionId, state) {
  if (sectionId === "consequential_transition") {
    return ["## Consequential transition", ...state.consequential_transition.map(renderStatement)];
  }
  if (sectionId === "evidence_summary") {
    return [
      "## Evidence summary",
      ...Object.entries(state.evidence_summary).flatMap(([group, values]) => [
        `### ${group}`,
        ...(values.length > 0 ? values.map(renderStatement) : ["- None recorded"])
      ])
    ];
  }
  if (sectionId === "claim_support") {
    return ["## Claim support", ...state.claim_support.map((entry) => renderStatement(entry.statement))];
  }
  if (sectionId === "explicit_nonclaims") {
    return ["## Explicit nonclaims", ...state.explicit_nonclaims.map(renderStatement)];
  }
  if (sectionId === "authority_context") {
    return [
      "## Authority context",
      ...Object.entries(state.authority_context).flatMap(([group, values]) => [
        `### ${group}`,
        ...(values.length > 0 ? values.map(renderStatement) : ["- None recorded"])
      ])
    ];
  }
  if (sectionId === "temporal_basis") {
    return ["## Temporal basis", ...state.temporal_basis.statements.map(renderStatement)];
  }
  if (sectionId === "semantic_provenance") {
    return [
      "## Semantic provenance",
      ...state.semantic_provenance.flatMap((chain) => [
        `### ${chain.chain_id}`,
        renderStatement(chain.normalized_fact),
        `- Relation path: ${chain.core_semantic_id} -> ${chain.domain_semantic_id} -> ${chain.support_relation} -> ${chain.artifact_statement_id}`
      ])
    ];
  }
  if (sectionId === "residual_uncertainty") {
    return ["## Residual uncertainty", ...state.residual_uncertainty.map(renderStatement)];
  }
  if (sectionId === "reviewer_questions") {
    return ["## Reviewer questions", ...state.reviewer_questions.map(renderStatement)];
  }
  return ["## Required follow-up", ...state.required_follow_up.map(renderStatement)];
}

export function renderInstitutionalArtifactMarkdown(artifact) {
  return [
    `# Institutional Artifact v0.1 — ${artifact.artifact_identity.profile}`,
    "",
    `Artifact: ${artifact.artifact_identity.artifact_id}`,
    `Semantic snapshot: ${artifact.artifact_identity.semantic_snapshot_sha256}`,
    "",
    ...artifact.presentation.section_order.flatMap((sectionId) => [
      ...renderSection(sectionId, artifact.semantic_state),
      ""
    ])
  ].join("\n");
}

function renderProfile(profileName, semanticState, semanticSnapshotSha256) {
  const config = PROFILE_CONFIG[profileName];
  const artifact = {
    schema_version: SCHEMA_VERSION,
    artifact_identity: {
      artifact_id: config.artifactId,
      artifact_version: "0.1",
      generated_at: GENERATED_AT,
      profile: profileName,
      semantic_snapshot_sha256: semanticSnapshotSha256,
      source_case: "caseC_conclusion_specific_missing_evidence"
    },
    semantic_state: structuredClone(semanticState),
    presentation: {
      profile_id: config.profileId,
      section_order: [...config.sectionOrder],
      emphasis_statement_ids: [...config.emphasisStatementIds]
    }
  };
  return {
    artifact,
    canonical_json: canonicalJson(artifact),
    markdown: renderInstitutionalArtifactMarkdown(artifact)
  };
}

export function createV8Phase3AInstitutionalArtifactFixture() {
  const reviewCase = createExperiment0Cases().caseC_conclusion_specific_missing_evidence;
  const semanticState = buildSemanticState(reviewCase);
  const semanticSnapshotBytes = canonicalJson(semanticState);
  const semanticSnapshotSha256 = sha256(semanticSnapshotBytes);
  return {
    source_case: {
      case_id: "caseC_conclusion_specific_missing_evidence",
      base_fixture: SOURCE_REFS.basePack,
      case_definition: SOURCE_REFS.caseDefinition,
      evidence_classification: "CONTROLLED_REPOSITORY_FIXTURE",
      external_institutional_evidence: false,
      subject_ref: reviewCase.pack.workflow.repository.commit_sha,
      effect_binding: "staging_transition_with_runtime_behavior_in_scope"
    },
    semantic_snapshot_bytes: semanticSnapshotBytes,
    semantic_snapshot_sha256: semanticSnapshotSha256,
    profiles: {
      developer: renderProfile("Developer", semanticState, semanticSnapshotSha256),
      audit_assurance: renderProfile("Audit/Assurance", semanticState, semanticSnapshotSha256)
    }
  };
}

export const institutionalArtifactV0_1 = Object.freeze({
  schemaVersion: SCHEMA_VERSION,
  generatedAt: GENERATED_AT,
  sectionIds: SECTION_IDS,
  reviewerQuestions: FROZEN_REVIEWER_QUESTIONS,
  profileIds: Object.freeze(Object.values(PROFILE_CONFIG).map((profile) => profile.profileId))
});
