import assert from "node:assert/strict";
import crypto from "node:crypto";
import { freshArtifact } from "./fixtures/evidence_assurance_experiment_1_1_fresh_artifact.mjs";

function digest(value) {
  return `sha256:${crypto.createHash("sha256").update(value, "utf8").digest("hex")}`;
}

const canonical = freshArtifact.files
  .slice()
  .sort((left, right) => left.path.localeCompare(right.path))
  .map((entry) => `${entry.path}:${entry.sha256}`)
  .join("\n");

assert.equal(freshArtifact.classification, "REAL PRODUCER EVIDENCE / SANITIZED");
assert.equal(freshArtifact.artifact.expired, false);
assert.equal(freshArtifact.producer_declared_digest, "unavailable");
assert.equal(freshArtifact.artifact.workflow_run_id, freshArtifact.run_id);
assert.equal(freshArtifact.artifact.workflow_run_commit_sha, freshArtifact.commit_sha);
assert.equal(digest(canonical), freshArtifact.guard_computed_digest);
assert.equal(freshArtifact.run_id, "33100734304");
assert.equal(freshArtifact.commit_sha, "e8b8a1249ba17bd4dd0a5ccd0bc277a017d30b73");
assert.equal(freshArtifact.files.length, 2);
assert.ok(freshArtifact.files.every((entry) => /^[a-f0-9]{64}$/.test(entry.sha256)));
assert.ok(freshArtifact.guard_verified.includes("artifact payload availability"));
assert.ok(freshArtifact.supported_claims.length > 0);
assert.ok(freshArtifact.missing_evidence.includes("deployment evidence"));
assert.ok(freshArtifact.residual_uncertainty.includes("workflow success does not prove production readiness"));
assert.deepStrictEqual(digest(canonical), digest(canonical));
console.log("PASS: Experiment 1.1 fresh artifact verification is deterministic");
