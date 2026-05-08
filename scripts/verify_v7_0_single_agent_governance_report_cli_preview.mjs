import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { runGuard } from "../packages/guard/src/runGuard.mjs";

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`${label} must contain valid JSON (${error.message})`);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const fixtureDir = path.join(repoRoot, "fixtures", "single_agent_governance_report");

const fixtureFiles = [
  "ready_for_review.json",
  "needs_human_review.json",
  "insufficient_evidence.json",
  "out_of_scope.json",
  "unknown.json",
];

const allowedReviewPostures = [
  "ready_for_review",
  "needs_human_review",
  "insufficient_evidence",
  "out_of_scope",
  "unknown",
];

const expectedBoundary = {
  recommendation_only: true,
  non_executing: true,
  approval_granted: false,
  execution_permission_granted: false,
  blocking_effect: false,
  deployment_authority: false,
  merge_authority: false,
  enforcement_action: "none",
  legal_compliance_claim: false,
};

function independentlyConfirmPhase2Fixtures() {
  for (const fixtureFile of fixtureFiles) {
    const fixturePath = path.join(fixtureDir, fixtureFile);
    expect(fs.existsSync(fixturePath), `${fixtureFile} must exist`);
    const fixture = readJson(fixturePath, fixtureFile);
    expect(
      fixture.object_type === "single_agent_governance_report_preview",
      `${fixtureFile} object_type mismatch during Phase 2A confirmation`
    );
    expect(fixture.object_version === "v1", `${fixtureFile} object_version mismatch during Phase 2A confirmation`);
    expect(fixture.report_mode === "preview", `${fixtureFile} report_mode mismatch during Phase 2A confirmation`);
    expect(
      allowedReviewPostures.includes(fixture.review_posture),
      `${fixtureFile} review_posture mismatch during Phase 2A confirmation`
    );
    expect(!("readiness_verdict" in fixture), `${fixtureFile} must not contain readiness_verdict`);
    expect(fixture.pre_v6_14_capability_foundation, `${fixtureFile} must preserve pre_v6_14_capability_foundation`);
  }
}

function validateValidOutput(fileName, stdout, stderr, exitCode, inputFixture) {
  expect(exitCode === 0, `${fileName} must exit 0`);
  expect(stderr === "", `${fileName} stderr must be empty`);
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch (error) {
    fail(`${fileName} stdout must be valid JSON (${error.message})`);
  }

  expect(
    parsed.object_type === "single_agent_governance_report_preview",
    `${fileName} object_type mismatch`
  );
  expect(parsed.object_version === "v1", `${fileName} object_version mismatch`);
  expect(parsed.report_mode === "preview", `${fileName} report_mode mismatch`);
  expect(
    allowedReviewPostures.includes(parsed.review_posture),
    `${fileName} review_posture must remain in the allowed set`
  );
  expect(!("readiness_verdict" in parsed), `${fileName} must not contain readiness_verdict`);
  expect(parsed.pre_v6_14_capability_foundation, `${fileName} must preserve pre_v6_14_capability_foundation`);
  expect(
    parsed.pre_v6_14_capability_foundation.license_edition_gate.entitlement_changed === false,
    `${fileName} must keep entitlement_changed false`
  );
  for (const [key, expectedValue] of Object.entries(expectedBoundary)) {
    expect(
      parsed.non_enforcement_boundary?.[key] === expectedValue,
      `${fileName} non_enforcement_boundary.${key} mismatch`
    );
  }
  expect(
    parsed.object_type === inputFixture.object_type &&
      parsed.object_version === inputFixture.object_version &&
      parsed.report_mode === inputFixture.report_mode &&
      parsed.review_posture === inputFixture.review_posture,
    `${fileName} must preserve core preview identity fields`
  );
}

async function main() {
  independentlyConfirmPhase2Fixtures();

  for (const fixtureFile of fixtureFiles) {
    const fixturePath = path.join(fixtureDir, fixtureFile);
    const inputFixture = readJson(fixturePath, fixtureFile);
    const result = await runGuard({
      argv: [
        "report",
        "single-agent",
        "--preview",
        "--json",
        "--fixture-file",
        fixturePath,
      ],
    });

    validateValidOutput(
      fixtureFile,
      result.stdout || "",
      result.stderr || "",
      result.exitCode,
      inputFixture
    );
  }

  const invalidFixturePath = path.join(
    os.tmpdir(),
    `mindforge-invalid-single-agent-report-${process.pid}.json`
  );
  const invalidFixture = {
    ...readJson(path.join(fixtureDir, "ready_for_review.json"), "ready_for_review.json"),
    review_posture: "approve",
    readiness_verdict: "approve",
  };
  fs.writeFileSync(invalidFixturePath, JSON.stringify(invalidFixture, null, 2) + "\n", "utf8");

  try {
    const invalidResult = await runGuard({
      argv: [
        "report",
        "single-agent",
        "--preview",
        "--json",
        "--fixture-file",
        invalidFixturePath,
      ],
    });

    expect(invalidResult.exitCode !== 0, "invalid fixture must exit non-zero");
    if ((invalidResult.stdout || "").trim().length > 0) {
      let parsed;
      try {
        parsed = JSON.parse(invalidResult.stdout);
      } catch {
        parsed = null;
      }
      expect(
        !parsed || !("object_type" in parsed),
        "invalid fixture stdout must not contain partial valid report JSON"
      );
    }
  } finally {
    try {
      fs.unlinkSync(invalidFixturePath);
    } catch {}
  }

  console.log("PASS: v7.0 single_agent_governance_report CLI preview validated.");
}

await main();
