import fs from "node:fs";

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function parseJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
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
    "permit_gate",
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

function expectFixtureSections(fixture, label) {
  for (const section of [
    "current_evidence_package",
    "provenance_classification",
    "grounding_status",
    "grounding_explanation",
  ]) {
    expect(fixture[section], `${label} missing ${section}`);
  }
  expect(
    Array.isArray(fixture.current_evidence_package.evidence_items) &&
      fixture.current_evidence_package.evidence_items.length > 0,
    `${label} evidence_items missing`
  );
  expect(
    Array.isArray(fixture.current_evidence_package.source_refs),
    `${label} source_refs missing`
  );
  expect(
    Array.isArray(fixture.current_evidence_package.source_of_truth_refs),
    `${label} source_of_truth_refs missing`
  );
}

const schema = parseJsonFile("schemas/grounding/grounding-boundary.schema.json");
expect(Array.isArray(schema.required), "schema.required must be an array");
expect(
  schema.$defs?.provenanceClassification?.properties?.origin_type?.enum?.includes("mixed"),
  "origin_type enum must include mixed"
);
expect(
  schema.$defs?.groundingStatus?.properties?.grounding_state?.enum?.includes("partially_grounded"),
  "grounding_state enum must include partially_grounded"
);
expect(
  schema.$defs?.groundingStatus?.properties?.freshness_state?.enum?.includes("expired"),
  "freshness_state enum must include expired"
);
expect(
  schema.$defs?.provenanceClassification?.properties?.verification_status?.enum?.includes("declared_only"),
  "verification_status enum must include declared_only"
);

const groundedFixture = parseJsonFile("fixtures/grounding/grounding-boundary.grounded.valid.json");
const partiallyGroundedFixture = parseJsonFile(
  "fixtures/grounding/grounding-boundary.partially-grounded.valid.json"
);

expectFixtureSections(groundedFixture, "grounded fixture");
expectFixtureSections(partiallyGroundedFixture, "partially_grounded fixture");
expectNoForbiddenFields(groundedFixture, "grounded fixture");
expectNoForbiddenFields(partiallyGroundedFixture, "partially_grounded fixture");

expect(
  groundedFixture.provenance_classification.origin_type === "machine_transformed",
  "grounded fixture origin_type mismatch"
);
expect(
  partiallyGroundedFixture.provenance_classification.origin_type === "ai_assisted",
  "partially_grounded fixture origin_type mismatch"
);
expect(
  groundedFixture.grounding_status.grounding_state === "grounded",
  "grounded fixture grounding_state mismatch"
);
expect(
  partiallyGroundedFixture.grounding_status.grounding_state === "partially_grounded",
  "partially_grounded fixture grounding_state mismatch"
);
expect(
  groundedFixture.current_evidence_package.declared_freshness.freshness_state ===
    groundedFixture.grounding_status.freshness_state,
  "grounded fixture freshness mismatch"
);
expect(
  partiallyGroundedFixture.current_evidence_package.declared_freshness.freshness_state ===
    partiallyGroundedFixture.grounding_status.freshness_state,
  "partially_grounded fixture freshness mismatch"
);
expect(
  groundedFixture.current_evidence_package.authority_explain_receipt_ref &&
    typeof groundedFixture.current_evidence_package.authority_explain_receipt_ref === "string",
  "grounded fixture authority_explain_receipt_ref must be present"
);
expect(
  partiallyGroundedFixture.current_evidence_package.authority_explain_receipt_ref === null,
  "partially_grounded fixture authority_explain_receipt_ref must stay null"
);

const { runGuard } = await import("../packages/guard/src/runGuard.mjs");

for (const [label, fixturePath, expectedGroundingState] of [
  [
    "grounded fixture",
    "fixtures/grounding/grounding-boundary.grounded.valid.json",
    "grounded",
  ],
  [
    "partially_grounded fixture",
    "fixtures/grounding/grounding-boundary.partially-grounded.valid.json",
    "partially_grounded",
  ],
]) {
  const result = await runGuard({
    argv: ["grounding", "explain", "--preview", "--json", "--fixture-file", fixturePath],
  });
  expect(result.exitCode === 0, `${label} command should exit 0`);
  const payload = JSON.parse(result.stdout);
  expect(payload.command === "guard grounding explain", `${label} command mismatch`);
  expect(payload.mode === "preview", `${label} mode mismatch`);
  expect(payload.boundary.preview_only === true, `${label} preview boundary mismatch`);
  expect(payload.boundary.fixture_backed === true, `${label} fixture_backed mismatch`);
  expect(payload.boundary.no_live_repo_state_reading === true, `${label} live repo flag mismatch`);
  expect(payload.boundary.no_live_source_fetching === true, `${label} live source flag mismatch`);
  expect(
    payload.grounding_status.grounding_state === expectedGroundingState,
    `${label} grounding_state mismatch`
  );
  expect(
    payload.admissibility_readiness.reserved === true &&
      payload.admissibility_readiness.evaluated === false &&
      payload.admissibility_readiness.decision === null &&
      payload.admissibility_readiness.reason === "reserved_for_future_admissibility_boundary",
    `${label} admissibility_readiness must remain reserved-only`
  );
  expect(
    payload.non_enforcement_boundary.preview_only === true &&
      payload.non_enforcement_boundary.enforced === false &&
      payload.non_enforcement_boundary.blocks_execution === false &&
      payload.non_enforcement_boundary.changes_exit_semantics === false,
    `${label} non_enforcement_boundary mismatch`
  );
  expectNoForbiddenFields(payload, `${label} payload`);
}

process.stdout.write("PASS verify_v6_16_grounding_boundary_fixtures\n");
