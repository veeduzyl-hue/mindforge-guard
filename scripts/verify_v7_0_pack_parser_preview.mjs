import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSingleAgentGovernancePackPreview } from "../packages/guard/src/productization/single_agent_pack_parser_preview.mjs";

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function listRelativeFiles(rootDir) {
  const entries = [];
  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const nextPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(nextPath);
      } else {
        entries.push(path.relative(rootDir, nextPath).replace(/\\/g, "/"));
      }
    }
  }
  walk(rootDir);
  return entries.sort();
}

function stableDirectoryHash(rootDir) {
  const hash = crypto.createHash("sha256");
  for (const relativePath of listRelativeFiles(rootDir)) {
    hash.update(relativePath);
    hash.update("\n");
    hash.update(fs.readFileSync(path.join(rootDir, relativePath), "utf8").replace(/\r\n/g, "\n"));
    hash.update("\n");
  }
  return hash.digest("hex");
}

function walk(value, visit, currentPath = "") {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => walk(entry, visit, `${currentPath}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      const nextPath = currentPath ? `${currentPath}.${key}` : key;
      visit(key, entry, nextPath);
      walk(entry, visit, nextPath);
    }
  }
}

function assertNoForbiddenOutputFields(summary, label) {
  const forbiddenKeys = new Set([
    "enforcement_action",
    "approval_status",
    "blocking_effect",
    "merge_allowed",
    "deployment_allowed",
    "execution_authority_granted",
    "compliance_certified",
    "legal_compliance_result",
    "maturity_certified"
  ]);

  walk(summary, (key, _entry, entryPath) => {
    expect(!forbiddenKeys.has(key), `${label} must not contain forbidden key ${entryPath}`);
  });
}

function main() {
  expect(
    typeof parseSingleAgentGovernancePackPreview === "function",
    "parser preview module must export parseSingleAgentGovernancePackPreview"
  );

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const fixtureRoot = path.join(repoRoot, "fixtures", "single_agent_governance_pack_parser_preview");
  const validPack = path.join(fixtureRoot, "valid_pack");
  const missingRequiredFilePack = path.join(fixtureRoot, "missing_required_file_pack");
  const missingRequiredFieldPack = path.join(fixtureRoot, "missing_required_field_pack");
  const malformedJsonPack = path.join(fixtureRoot, "malformed_json_pack");
  const limitationPack = path.join(fixtureRoot, "limitation_recommended_missing_pack");
  const examplePack = path.join(repoRoot, "examples", "single-agent-governance-pack", "hr-self-service-agent");

  for (const packPath of [validPack, missingRequiredFilePack, missingRequiredFieldPack, malformedJsonPack, limitationPack, examplePack]) {
    expect(fs.existsSync(packPath), `pack fixture must exist: ${packPath}`);
  }

  const validBeforeHash = stableDirectoryHash(validPack);
  const validSummary = parseSingleAgentGovernancePackPreview(validPack);
  const validAfterHash = stableDirectoryHash(validPack);
  expect(validSummary.parser_version === "single_agent_governance_pack_parser_preview_v1", "valid_pack parser version mismatch");
  expect(validSummary.omissions.length === 0, "valid_pack must not report omissions");
  expect(validSummary.limitations.length === 0, "valid_pack must not report limitations");
  expect(validSummary.malformed_files.length === 0, "valid_pack must not report malformed files");
  expect(validSummary.pack_identity.pack_id === "parser-preview-valid-pack", "valid_pack identity mismatch");
  expect(validSummary.sample_output_summary.present === true, "valid_pack sample output summary must be present");
  expect(validBeforeHash === validAfterHash, "parser must not mutate valid_pack");

  const validSummaryRepeat = parseSingleAgentGovernancePackPreview(validPack);
  expect(
    validSummary.deterministic_pack_hash === validSummaryRepeat.deterministic_pack_hash,
    "valid_pack deterministic hash must be stable across repeated parse calls"
  );

  const missingRequiredFileSummary = parseSingleAgentGovernancePackPreview(missingRequiredFilePack);
  expect(missingRequiredFileSummary.omissions.length >= 1, "missing_required_file_pack must report omission");
  expect(
    missingRequiredFileSummary.omissions.some((entry) => entry.includes("missing required file")),
    "missing_required_file_pack omission classification mismatch"
  );

  const missingRequiredFieldSummary = parseSingleAgentGovernancePackPreview(missingRequiredFieldPack);
  expect(missingRequiredFieldSummary.omissions.length >= 1, "missing_required_field_pack must report omission");
  expect(
    missingRequiredFieldSummary.required_field_gaps.some((entry) => entry.includes("business_owner")),
    "missing_required_field_pack must report required field gap"
  );

  const malformedJsonSummary = parseSingleAgentGovernancePackPreview(malformedJsonPack);
  expect(malformedJsonSummary.omissions.length >= 1, "malformed_json_pack must report omission");
  expect(
    malformedJsonSummary.malformed_files.includes("manifest.json"),
    "malformed_json_pack must report malformed manifest.json"
  );

  const limitationSummary = parseSingleAgentGovernancePackPreview(limitationPack);
  expect(limitationSummary.omissions.length === 0, "limitation_recommended_missing_pack must not report omission");
  expect(limitationSummary.limitations.length >= 1, "limitation_recommended_missing_pack must report limitation");
  expect(
    limitationSummary.limitations.some((entry) => entry.includes("missing recommended file")),
    "limitation_recommended_missing_pack limitation classification mismatch"
  );

  const exampleBeforeHash = stableDirectoryHash(examplePack);
  const exampleSummary = parseSingleAgentGovernancePackPreview(examplePack);
  const exampleAfterHash = stableDirectoryHash(examplePack);
  expect(exampleSummary.omissions.length === 0, "example pack must not report omissions");
  expect(exampleSummary.pack_identity.pack_id === "hr-self-service-agent-pack", "example pack identity mismatch");
  expect(exampleSummary.owner_refs.includes("business_owner_hr_ops"), "example pack owner refs mismatch");
  expect(exampleBeforeHash === exampleAfterHash, "parser must not mutate example pack");

  for (const [label, summary] of [
    ["valid_pack", validSummary],
    ["missing_required_file_pack", missingRequiredFileSummary],
    ["missing_required_field_pack", missingRequiredFieldSummary],
    ["malformed_json_pack", malformedJsonSummary],
    ["limitation_recommended_missing_pack", limitationSummary],
    ["example_pack", exampleSummary]
  ]) {
    assertNoForbiddenOutputFields(summary, label);
  }

  console.log("PASS: v7.0 pack parser preview validated.");
}

main();
