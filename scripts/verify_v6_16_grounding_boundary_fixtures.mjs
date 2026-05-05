import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function parseJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function runGit(args) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
}

function changedFilesFor(paths) {
  const mergeBase = runGit(["merge-base", "main", "HEAD"]);
  const committed = runGit(["diff", "--name-only", `${mergeBase}...HEAD`, "--", ...paths]);
  const unstaged = runGit(["diff", "--name-only", "--", ...paths]);
  const staged = runGit(["diff", "--cached", "--name-only", "--", ...paths]);
  return [...new Set(
    [committed, unstaged, staged]
      .flatMap((chunk) => chunk.split(/\r?\n/))
      .map((value) => value.trim())
      .filter(Boolean)
  )];
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

function expectFixtureSections(fixture, label) {
  for (const section of [
    "current_evidence_package",
    "provenance_classification",
    "grounding_status",
    "grounding_explanation",
    "evidence_adequacy",
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
expect(
  changedFilesFor([
    "README.md",
    "docs/product/current",
    "docs/demos/current",
    "docs/first-10-minutes.md",
    "docs/trust/safety-boundary.md",
    "apps/license-hub",
    "vercel.json",
  ]).length === 0,
  "commercial and production protected paths must remain unchanged"
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
expectEvidenceAdequacy(groundedFixture.evidence_adequacy, "grounded fixture evidence_adequacy");
expectEvidenceAdequacy(
  partiallyGroundedFixture.evidence_adequacy,
  "partially_grounded fixture evidence_adequacy"
);
expect(groundedFixture.evidence_adequacy.omissions.length === 0, "grounded fixture must not declare omissions");
expect(
  groundedFixture.evidence_adequacy.contrary_artifact_refs.length === 0,
  "grounded fixture must not require contrary artifact refs"
);
expect(
  partiallyGroundedFixture.evidence_adequacy.omissions.length > 0,
  "partially_grounded fixture must declare an explicit omission"
);
expect(
  partiallyGroundedFixture.evidence_adequacy.uncertainty_notes.length > 0,
  "partially_grounded fixture must declare uncertainty notes"
);
expect(
  partiallyGroundedFixture.evidence_adequacy.contrary_artifact_refs.length > 0,
  "partially_grounded fixture must declare contrary artifact refs"
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
  expectEvidenceAdequacy(payload.evidence_adequacy, `${label} payload evidence_adequacy`);
  expectNoForbiddenFields(payload, `${label} payload`);
}

process.stdout.write("PASS verify_v6_16_grounding_boundary_fixtures\n");
