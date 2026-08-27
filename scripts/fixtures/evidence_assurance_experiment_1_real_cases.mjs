import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

const evidence = {
  classification: "REAL PRODUCER EVIDENCE / SANITIZED",
  captured_at: "2026-08-28T00:00:00Z",
  raw_artifact_digests: {
    github_actions_run: "sha256:6a447e4dbd97b53eab1ccf7b1f342172ed72041f12a9e799de97fad96ca2b40f",
    github_actions_artifact_index: "sha256:f70745770919255b6a113e7f8cc46dd1fb9b4372ce1c820d6f99a4296168a980",
    github_deployment: "sha256:4439051768fbf943060ddaed103465a6430ef5105c531ad8eb03f988b05059f7",
    github_deployment_statuses: "sha256:155d4ac3a5d934773a91aecd4f016be58f240604261d1c993f4cf2735848e0e8",
  },
  github_actions: {
    run_id: "25858085587",
    workflow: "MindForge Guard First Governance Report",
    run_attempt: 1,
    commit_sha: "5574e40218d6353bab763e81b7facf4892c1cb29",
    ref: "main",
    event: "workflow_dispatch",
    status: "completed",
    conclusion: "success",
    artifact_name: "mindforge-guard-first-governance-report",
    artifact_id: "6993509675",
    artifact_downloadable: false,
    artifact_expired: true,
  },
  github_deployment: {
    deployment_id: "4518932465",
    status_id: "12906692400",
    commit_sha: "680f20dbf6c5138922832b6c4d0ddc3dabfa1d52",
    environment: "Production",
    status: "success",
    deployed_at: "2026-04-29T03:10:14Z",
  },
  redaction: {
    applied: true,
    summary: "Removed actor identity, URLs, API links, node identifiers, and producer payload fields outside the review purpose.",
  },
};

export function createExperiment1RealCases() {
  const pack = JSON.parse(fs.readFileSync(path.join(repoRoot, "fixtures/ai-pr-low-risk-complete/evidence-pack.json"), "utf8"));
  return {
    evidence,
    github_actions: { pack, external_assurance_reports: [report("github_actions")], normalized_records: [], review_scope: {} },
    github_deployment: { pack, external_assurance_reports: [report("github_deployment")], normalized_records: [], review_scope: {} },
    combined: { pack, external_assurance_reports: [report("github_actions"), report("github_deployment")], normalized_records: [], review_scope: {} },
  };
}

function report(kind) {
  const ci = kind === "github_actions";
  const data = ci ? evidence.github_actions : evidence.github_deployment;
  const ref = ci ? `github-actions-run:${data.run_id}` : `github-deployment:${data.deployment_id}`;
  return {
    report_id: `real-${kind}-sanitized-v0.1`, verification_id: `verify-real-${kind}-v0.1`,
    evidence_package: { package_id: ref, package_version: "0.1", digest: ci ? evidence.raw_artifact_digests.github_actions_run : evidence.raw_artifact_digests.github_deployment, integrity_ref: "external-staging-only" },
    producer: { producer_id: "github.com/veeduzyl-hue/mindforge-guard", producer_name: "GitHub", source_type: ci ? "ci_cd_evidence" : "deployment_provenance_evidence", external_reference: ref },
    adapter: { adapter_id: "adapter.local-real-producer-dry-run", adapter_version: "0.1.0" },
    assurance_profiles: [{ profile_id: "production_evidence_readiness", profile_version: "0.1" }],
    executed_checks: [{ check_type: "structural_validity", status: "verified", summary: `Guard independently parsed the sanitized ${ci ? "workflow run" : "deployment"} metadata shape`, evidence_refs: [ref] }, { check_type: "digest_integrity", status: "verified", summary: `Guard bound the sanitized review entry to the retained raw artifact digest`, evidence_refs: [ref] }],
    verified_claims: [{ claim_id: `${kind}-producer-status`, claim_type: ci ? "build_outcome" : "deployment_status", summary: `producer declared ${ci ? `workflow conclusion=${data.conclusion}` : `deployment status=${data.status}`}`, evidence_refs: [ref] }],
    failed_checks: [], unresolved_findings: [],
    missing_evidence: [{ missing_evidence_id: `${kind}-missing-artifact-or-runtime`, description: ci ? "the producer artifact payload expired and cannot be verified" : "build artifact identity and runtime outcome evidence are not available from deployment metadata", evidence_refs: [ref] }],
    scope_limitations: ["Producer declaration is not an independent application-truth verification.", ci ? "The listed uploaded artifact is expired; no artifact payload or digest was available." : "The deployment record is a GitHub producer record, not independently retrieved Vercel provenance."],
    human_review_recommendations: [{ recommendation_id: `${kind}-supplement`, summary: ci ? "Provide a retained build artifact digest and test output to support stronger build conclusions." : "Provide deployment build identity and runtime outcome evidence to support stronger deployment conclusions.", priority: "high", evidence_refs: [ref] }],
    engine_version: "evidence-assurance-real-producer-dry-run-v0.1", report_schema_version: "0.1", generated_at: evidence.captured_at,
    report_integrity: { digest: ci ? evidence.raw_artifact_digests.github_actions_run : evidence.raw_artifact_digests.github_deployment, digest_algorithm: "sha256", integrity_ref: "external-staging-only" },
    verification_summary: `real sanitized ${kind} producer metadata was normalized without upgrading producer trust`,
  };
}
