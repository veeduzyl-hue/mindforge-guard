import { buildLocalIdempotencyReplayFixture } from "../../packages/guard-core/src/externalEvidence/localIdempotencyReplayFixture.mjs";
import { buildLocalTechnicalUsageRecordFixture } from "../../packages/guard-core/src/externalEvidence/localTechnicalUsageRecordFixture.mjs";
import { createLocalIdempotencyReplayFixtureInput } from "./local_external_evidence_idempotency_replay.mjs";

export function createLocalTechnicalUsageRecordFixtureInput() {
  const upstreamInput = cloneValue(
    createLocalIdempotencyReplayFixtureInput()
  );

  upstreamInput.source_envelope_input.verification_usage_record.cryptographic_operation_count =
    3;
  upstreamInput.source_envelope_input.verification_usage_record.evidence_chain_depth =
    2;

  delete upstreamInput.replay_envelope_input.verification_usage_record
    .retention_tier_ref;

  delete upstreamInput.intentional_new_job_envelope_input
    .verification_usage_record.retention_class;

  return buildLocalIdempotencyReplayFixture(upstreamInput);
}

export function createLocalTechnicalUsageRecordFixtureSamples() {
  return buildLocalTechnicalUsageRecordFixture(
    createLocalTechnicalUsageRecordFixtureInput()
  );
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}
