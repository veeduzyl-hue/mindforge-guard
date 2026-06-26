import fs from "node:fs";
import path from "node:path";

function countCompletedEntries(entries) {
  return entries.filter((entry) => entry && typeof entry === "object" && entry.status === "completed").length;
}

function countCommandOutputs(toolCalls) {
  return toolCalls.filter(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      entry.status === "completed" &&
      typeof entry.output_summary === "string" &&
      entry.output_summary.trim().length >= 1
  ).length;
}

function collectArtifactObservations(evidencePack, fixtureDir) {
  const presentRequiredArtifacts = [];
  const missingOptionalArtifacts = [];
  const hashVerifiedArtifacts = [];
  const manifestEntries = new Map(
    evidencePack.manifest.files.map((entry) => [entry.path, entry])
  );

  for (const artifact of evidencePack.artifacts) {
    const artifactPath = path.join(fixtureDir, artifact.path);
    const existsOnDisk = fs.existsSync(artifactPath);

    if (artifact.optional === true && !existsOnDisk) {
      missingOptionalArtifacts.push(artifact.path);
      continue;
    }

    if (!existsOnDisk) {
      continue;
    }

    presentRequiredArtifacts.push(artifact.path);

    const manifestEntry = manifestEntries.get(artifact.path);
    if (manifestEntry && typeof manifestEntry.sha256 === "string") {
      hashVerifiedArtifacts.push(artifact.path);
    }
  }

  return {
    present_required_artifacts: presentRequiredArtifacts.sort(),
    missing_optional_artifacts: missingOptionalArtifacts.sort(),
    hash_verified_artifacts: hashVerifiedArtifacts.sort(),
  };
}

export function normalizeHarnessEvidenceIngestSummary({
  evidencePack,
  validationResult,
  fixtureDir,
  fixtureName,
}) {
  const artifactObservations = collectArtifactObservations(evidencePack, fixtureDir);

  return {
    profile: "harness-evidence-ingest-summary",
    schema_version: "0.1-preview",
    fixture_name: fixtureName,
    producer: {
      id: evidencePack.producer.producer_id,
      name: evidencePack.producer.producer_name,
      version: evidencePack.producer.producer_version,
      boundary: evidencePack.authority.boundary,
    },
    consumer: {
      authority: evidencePack.authority.consumer_authority,
      summary_owner: "mindforge-guard",
    },
    source_pack: {
      id: evidencePack.pack_id,
      created_at: evidencePack.created_at,
      artifact_count: evidencePack.artifacts.length,
      manifest_count: evidencePack.manifest.files.length,
    },
    ingest_validation: {
      valid: validationResult.valid,
      failures: [...validationResult.failures],
      warnings: [...validationResult.warnings],
    },
    action_observations: {
      completed_actions_count: countCompletedEntries(evidencePack.actions),
      blocked_actions_count: evidencePack.blocked_actions.length,
      tool_calls_count: evidencePack.tool_calls.length,
      command_outputs_count: countCommandOutputs(evidencePack.tool_calls),
    },
    artifact_observations: artifactObservations,
    governance_non_claims: {
      verdict: "not_computed",
      reason_codes: "not_computed",
      risk_summary: "not_computed",
      evidence_coverage: "not_scored",
      governance_report: "not_generated",
      evidence_index: "not_generated",
      approval_authority: "not_granted",
      execution_authority: "not_granted",
      deployment_authority: "not_granted",
      rollback_authority: "not_granted",
    },
  };
}
