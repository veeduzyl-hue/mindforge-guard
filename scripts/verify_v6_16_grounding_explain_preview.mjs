import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function parseJsonOutput(result, label) {
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`${label} must output valid JSON (${error.message})`);
  }
}

function expectExactKeys(actual, expectedKeys, label) {
  const actualKeys = Object.keys(actual).sort();
  const expectedSorted = [...expectedKeys].sort();
  expect(
    JSON.stringify(actualKeys) === JSON.stringify(expectedSorted),
    `${label} keys mismatch: expected ${expectedSorted.join(", ")} got ${actualKeys.join(", ")}`
  );
}

function walk(value, visit) {
  visit(value);
  if (Array.isArray(value)) {
    for (const entry of value) walk(entry, visit);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      visit(key);
      walk(entry, visit);
    }
  }
}

function expectNoForbiddenFields(value, label) {
  const forbiddenKeys = new Set([
    "admit",
    "deny",
    "defer",
    "commitment_candidate",
    "commitment_receipt",
    "commit_gate",
    "deployment_gate",
    "deployment_approval",
    "permit_gate",
    "risk_acceptance",
    "regulatory_reporting",
    "means_motive_opportunity",
    "insider_threat",
    "runtime_enforcement",
  ]);
  const forbiddenValues = new Set(["admit", "deny", "defer"]);

  walk(value, (entry) => {
    if (typeof entry === "string" && forbiddenValues.has(entry)) {
      throw new Error(`${label} contains forbidden string value ${entry}`);
    }
    if (typeof entry === "string" && forbiddenKeys.has(entry)) {
      throw new Error(`${label} contains forbidden field ${entry}`);
    }
  });
}

function expectHash(hash, label) {
  expect(typeof hash === "string" && hash.startsWith("sha256:"), `${label} hash mismatch`);
}

function expectEvidenceAdequacy(evidenceAdequacy, label) {
  expect(evidenceAdequacy.supporting_only === true, `${label} supporting_only mismatch`);
  expect(evidenceAdequacy.authoritative === false, `${label} authoritative mismatch`);
  expect(evidenceAdequacy.creates_permission === false, `${label} creates_permission mismatch`);
  expect(evidenceAdequacy.changes_authority === false, `${label} changes_authority mismatch`);
  expect(
    evidenceAdequacy.changes_exit_semantics === false,
    `${label} changes_exit_semantics mismatch`
  );
  expect(
    evidenceAdequacy.evidence_records_explicit === true,
    `${label} evidence_records_explicit mismatch`
  );
  expect(Array.isArray(evidenceAdequacy.omissions), `${label} omissions missing`);
  expect(Array.isArray(evidenceAdequacy.uncertainty_notes), `${label} uncertainty_notes missing`);
  expect(
    Array.isArray(evidenceAdequacy.contrary_artifact_refs),
    `${label} contrary_artifact_refs missing`
  );
  expect(
    typeof evidenceAdequacy.adequacy_explanation === "string" &&
      evidenceAdequacy.adequacy_explanation.length > 0,
    `${label} adequacy_explanation missing`
  );
  for (const [index, omission] of evidenceAdequacy.omissions.entries()) {
    expect(
      typeof omission.reason === "string" && omission.reason.length > 0,
      `${label} omission ${index} must include a reason`
    );
  }
  for (const [index, note] of evidenceAdequacy.uncertainty_notes.entries()) {
    expect(
      note.supporting_metadata_only === true,
      `${label} uncertainty note ${index} must remain supporting metadata only`
    );
  }
  for (const [index, artifactRef] of evidenceAdequacy.contrary_artifact_refs.entries()) {
    expect(
      artifactRef.supporting_artifact_only === true,
      `${label} contrary artifact ${index} must remain supporting-only`
    );
  }
}

function expectPayload(payload, expectedGroundingState, label) {
  expectExactKeys(
    payload,
    [
      "boundary",
      "command",
      "mode",
      "schema_version",
      "input_ref",
      "current_evidence_package",
      "provenance_classification",
      "grounding_status",
      "grounding_explanation",
      "evidence_adequacy",
      "hashes",
      "admissibility_readiness",
      "receipt_linkage",
      "non_enforcement_boundary",
    ],
    `${label} top-level`
  );
  expect(payload.command === "guard grounding explain", `${label} command mismatch`);
  expect(payload.mode === "preview", `${label} mode mismatch`);
  expect(payload.schema_version === "guard.grounding_explain_preview.v6_16", `${label} schema_version mismatch`);
  expect(payload.boundary.preview_only === true, `${label} boundary.preview_only mismatch`);
  expect(payload.boundary.fixture_backed === true, `${label} boundary.fixture_backed mismatch`);
  expect(payload.boundary.derived_only === true, `${label} boundary.derived_only mismatch`);
  expect(payload.boundary.explanation_only === true, `${label} boundary.explanation_only mismatch`);
  expect(payload.boundary.recommendation_only === true, `${label} boundary.recommendation_only mismatch`);
  expect(payload.boundary.non_enforcing === true, `${label} boundary.non_enforcing mismatch`);
  expect(payload.boundary.default_off === true, `${label} boundary.default_off mismatch`);
  expect(payload.boundary.no_live_repo_state_reading === true, `${label} boundary live repo mismatch`);
  expect(payload.boundary.no_live_source_fetching === true, `${label} boundary live source mismatch`);
  expect(payload.boundary.no_authority_contract_mutation === true, `${label} authority mutation mismatch`);
  expect(payload.input_ref.kind === "fixture_file", `${label} input_ref.kind mismatch`);
  expect(payload.input_ref.fixture_backed === true, `${label} input_ref.fixture_backed mismatch`);
  expect(
    payload.grounding_status.grounding_state === expectedGroundingState,
    `${label} grounding_status.grounding_state mismatch`
  );
  expect(
    payload.admissibility_readiness.reserved === true &&
      payload.admissibility_readiness.evaluated === false &&
      payload.admissibility_readiness.decision === null &&
      payload.admissibility_readiness.reason === "reserved_for_future_admissibility_boundary",
    `${label} admissibility_readiness mismatch`
  );
  expectExactKeys(
    payload.admissibility_readiness,
    ["reserved", "evaluated", "decision", "reason"],
    `${label} admissibility_readiness`
  );
  expect(
    payload.non_enforcement_boundary.preview_only === true &&
      payload.non_enforcement_boundary.enforced === false &&
      payload.non_enforcement_boundary.blocks_execution === false &&
      payload.non_enforcement_boundary.changes_exit_semantics === false,
    `${label} non_enforcement_boundary mismatch`
  );
  expectHash(payload.hashes.evidence_hash, `${label} evidence`);
  expectHash(payload.hashes.source_hash, `${label} source`);
  expectHash(payload.hashes.provenance_hash, `${label} provenance`);
  expectHash(payload.hashes.deterministic_hash, `${label} deterministic`);
  expectEvidenceAdequacy(payload.evidence_adequacy, `${label} evidence_adequacy`);
  expectNoForbiddenFields(payload, `${label} payload`);
}

function expectDeterministicStability(firstPayload, secondPayload, label) {
  expect(
    firstPayload.hashes.evidence_hash === secondPayload.hashes.evidence_hash,
    `${label} evidence_hash must be stable`
  );
  expect(
    firstPayload.hashes.source_hash === secondPayload.hashes.source_hash,
    `${label} source_hash must be stable`
  );
  expect(
    firstPayload.hashes.provenance_hash === secondPayload.hashes.provenance_hash,
    `${label} provenance_hash must be stable`
  );
  expect(
    firstPayload.hashes.deterministic_hash === secondPayload.hashes.deterministic_hash,
    `${label} deterministic_hash must be stable`
  );
  expect(
    JSON.stringify(firstPayload) === JSON.stringify(secondPayload),
    `${label} payload must be stable across repeated runs`
  );
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function createTempFixtures() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-grounding-preview-"));
  const groundedFixture = JSON.parse(
    fs.readFileSync("fixtures/grounding/grounding-boundary.grounded.valid.json", "utf8")
  );

  const ungroundedPath = path.join(tempRoot, "ungrounded.json");
  const unknownPath = path.join(tempRoot, "unknown.json");
  const malformedPath = path.join(tempRoot, "malformed.json");
  const invalidJsonPath = path.join(tempRoot, "invalid.json");

  const ungroundedFixture = structuredClone(groundedFixture);
  ungroundedFixture.current_evidence_package.evidence_package_id = "grounding-boundary-ungrounded-temp";
  ungroundedFixture.current_evidence_package.source_refs = [];
  ungroundedFixture.current_evidence_package.source_of_truth_refs = [];
  ungroundedFixture.current_evidence_package.declared_freshness.freshness_state = "unknown";
  ungroundedFixture.current_evidence_package.declared_freshness.basis = "fixture_declared_missing_source_refs";
  ungroundedFixture.current_evidence_package.authority_explain_receipt_ref = null;
  ungroundedFixture.provenance_classification.origin_type = "mixed";
  ungroundedFixture.provenance_classification.source_depth = 0;
  ungroundedFixture.provenance_classification.primary_source_available = false;
  ungroundedFixture.provenance_classification.verification_status = "unverifiable";
  ungroundedFixture.grounding_status.grounding_state = "ungrounded";
  ungroundedFixture.grounding_status.source_available = false;
  ungroundedFixture.grounding_status.source_of_truth_ref = null;
  ungroundedFixture.grounding_status.primary_source_ref = null;
  ungroundedFixture.grounding_status.freshness_state = "unknown";
  ungroundedFixture.grounding_explanation.summary =
    "The evidence package is ungrounded because the fixture declares no available source refs or source-of-truth refs.";
  ungroundedFixture.grounding_explanation.basis = [
    "The evidence package no longer declares retrievable source refs.",
    "No primary or source-of-truth refs remain attached to the package."
  ];
  ungroundedFixture.grounding_explanation.limitations = [
    "This preview does not attempt to discover evidence automatically."
  ];
  ungroundedFixture.evidence_adequacy.omissions = [
    {
      omission_id: "omission-ungrounded-001",
      artifact_kind: "source_refs",
      artifact_ref: null,
      reason: "The fixture declares no retained source refs for this ungrounded state."
    }
  ];
  ungroundedFixture.evidence_adequacy.uncertainty_notes = [
    {
      note_id: "uncertainty-ungrounded-001",
      summary: "Ungrounded status reflects explicit source absence rather than a deny or block.",
      supporting_metadata_only: true
    }
  ];
  ungroundedFixture.evidence_adequacy.contrary_artifact_refs = [];
  ungroundedFixture.evidence_adequacy.adequacy_explanation =
    "Evidence adequacy stays supporting-only and records the missing evidence as an explicit omission.";
  writeJson(ungroundedPath, ungroundedFixture);

  const unknownFixture = structuredClone(groundedFixture);
  unknownFixture.current_evidence_package.evidence_package_id = "grounding-boundary-unknown-temp";
  unknownFixture.current_evidence_package.declared_freshness.freshness_state = "unknown";
  unknownFixture.current_evidence_package.declared_freshness.basis = "fixture_declared_unknown_freshness";
  unknownFixture.current_evidence_package.authority_explain_receipt_ref = null;
  unknownFixture.provenance_classification.origin_type = "unknown";
  unknownFixture.provenance_classification.source_depth = 0;
  unknownFixture.provenance_classification.generation_count = 0;
  unknownFixture.provenance_classification.primary_source_available = false;
  unknownFixture.provenance_classification.verification_status = "unknown";
  unknownFixture.grounding_status.grounding_state = "unknown";
  unknownFixture.grounding_status.source_available = false;
  unknownFixture.grounding_status.source_of_truth_ref = null;
  unknownFixture.grounding_status.primary_source_ref = null;
  unknownFixture.grounding_status.freshness_state = "unknown";
  unknownFixture.grounding_explanation.summary =
    "The evidence package remains unknown because the fixture only declares incomplete provenance and freshness metadata.";
  unknownFixture.grounding_explanation.basis = [
    "Origin metadata is unknown.",
    "Freshness is declared as unknown without live verification."
  ];
  unknownFixture.grounding_explanation.limitations = [
    "This preview does not fetch sources or infer missing provenance."
  ];
  unknownFixture.evidence_adequacy.omissions = [
    {
      omission_id: "omission-unknown-001",
      artifact_kind: "provenance_detail",
      artifact_ref: null,
      reason: "The fixture does not declare enough provenance detail to resolve unknown status further."
    }
  ];
  unknownFixture.evidence_adequacy.uncertainty_notes = [
    {
      note_id: "uncertainty-unknown-001",
      summary: "Unknown grounding remains a supporting metadata condition only.",
      supporting_metadata_only: true
    }
  ];
  unknownFixture.evidence_adequacy.contrary_artifact_refs = [
    {
      artifact_ref_id: "contrary-unknown-001",
      summary: "A contrary note records that the existing metadata is insufficient to claim stronger grounding.",
      supporting_artifact_only: true
    }
  ];
  unknownFixture.evidence_adequacy.adequacy_explanation =
    "Evidence adequacy remains non-authoritative and records unresolved provenance as an explicit omission plus uncertainty metadata.";
  writeJson(unknownPath, unknownFixture);

  const malformedFixture = structuredClone(groundedFixture);
  delete malformedFixture.grounding_explanation;
  writeJson(malformedPath, malformedFixture);

  fs.writeFileSync(invalidJsonPath, "{invalid-json", "utf8");

  return { tempRoot, ungroundedPath, unknownPath, malformedPath, invalidJsonPath };
}

const { runGuard } = await import("../packages/guard/src/runGuard.mjs");

async function runGroundingExplain(args) {
  return runGuard({
    argv: ["grounding", "explain", ...args],
  });
}

const groundedResult = await runGroundingExplain([
  "--preview",
  "--json",
  "--fixture-file",
  "fixtures/grounding/grounding-boundary.grounded.valid.json",
]);
expect(groundedResult.exitCode === 0, "grounded explain should exit 0");
expect(groundedResult.exitCode !== 21, "grounded explain must not use exit 21");
expect(groundedResult.exitCode !== 25, "grounded explain must not use exit 25");
const groundedPayload = parseJsonOutput(groundedResult, "grounded explain");
expectPayload(groundedPayload, "grounded", "grounded explain");

const groundedRepeatResult = await runGroundingExplain([
  "--preview",
  "--json",
  "--fixture-file",
  "fixtures/grounding/grounding-boundary.grounded.valid.json",
]);
expect(groundedRepeatResult.exitCode === 0, "repeat grounded explain should exit 0");
const groundedRepeatPayload = parseJsonOutput(groundedRepeatResult, "repeat grounded explain");
expectPayload(groundedRepeatPayload, "grounded", "repeat grounded explain");
expectDeterministicStability(groundedPayload, groundedRepeatPayload, "grounded explain");

const partialResult = await runGroundingExplain([
  "--preview",
  "--json",
  "--fixture-file",
  "fixtures/grounding/grounding-boundary.partially-grounded.valid.json",
]);
expect(partialResult.exitCode === 0, "partially_grounded explain should exit 0");
expect(partialResult.exitCode !== 21, "partially_grounded explain must not use exit 21");
expect(partialResult.exitCode !== 25, "partially_grounded explain must not use exit 25");
const partialPayload = parseJsonOutput(partialResult, "partially_grounded explain");
expectPayload(partialPayload, "partially_grounded", "partially_grounded explain");

const missingPreview = await runGroundingExplain([
  "--json",
  "--fixture-file",
  "fixtures/grounding/grounding-boundary.grounded.valid.json",
]);
expect(missingPreview.exitCode === 2, "missing --preview should exit 2");

const missingJson = await runGroundingExplain([
  "--preview",
  "--fixture-file",
  "fixtures/grounding/grounding-boundary.grounded.valid.json",
]);
expect(missingJson.exitCode === 2, "missing --json should exit 2");

const missingFixtureFlag = await runGroundingExplain([
  "--preview",
  "--json",
]);
expect(missingFixtureFlag.exitCode === 2, "missing --fixture-file should exit 2");

const unknownOption = await runGroundingExplain([
  "--preview",
  "--json",
  "--fixture-file",
  "fixtures/grounding/grounding-boundary.grounded.valid.json",
  "--unknown-option",
]);
expect(unknownOption.exitCode === 2, "unknown option should exit 2");

const { tempRoot, ungroundedPath, unknownPath, malformedPath, invalidJsonPath } = createTempFixtures();

try {
  const ungroundedResult = await runGroundingExplain([
    "--preview",
    "--json",
    "--fixture-file",
    ungroundedPath,
  ]);
  expect(ungroundedResult.exitCode === 0, "ungrounded explain should exit 0");
  expect(ungroundedResult.exitCode !== 21, "ungrounded explain must not use exit 21");
  expect(ungroundedResult.exitCode !== 25, "ungrounded explain must not use exit 25");
  const ungroundedPayload = parseJsonOutput(ungroundedResult, "ungrounded explain");
  expectPayload(ungroundedPayload, "ungrounded", "ungrounded explain");

  const unknownResult = await runGroundingExplain([
    "--preview",
    "--json",
    "--fixture-file",
    unknownPath,
  ]);
  expect(unknownResult.exitCode === 0, "unknown explain should exit 0");
  expect(unknownResult.exitCode !== 21, "unknown explain must not use exit 21");
  expect(unknownResult.exitCode !== 25, "unknown explain must not use exit 25");
  const unknownPayload = parseJsonOutput(unknownResult, "unknown explain");
  expectPayload(unknownPayload, "unknown", "unknown explain");

  const malformedResult = await runGroundingExplain([
    "--preview",
    "--json",
    "--fixture-file",
    malformedPath,
  ]);
  expect(malformedResult.exitCode === 30, "malformed fixture should exit 30");

  const invalidJsonResult = await runGroundingExplain([
    "--preview",
    "--json",
    "--fixture-file",
    invalidJsonPath,
  ]);
  expect(invalidJsonResult.exitCode === 30, "invalid JSON fixture should exit 30");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

process.stdout.write("grounding explain preview verified\n");
