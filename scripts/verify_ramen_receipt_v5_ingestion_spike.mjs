import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function runScript(command, repoRoot, passMarker) {
  const output = execSync(command, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
  });

  expect(output.includes(passMarker), `missing pass marker for command: ${command}`);
  return output;
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const specPath = path.join(repoRoot, "docs", "adapters", "ramen-receipt-v5-adapter-spec.md");
  const reviewPath = path.join(repoRoot, "docs", "adapters", "ramen-receipt-v5-formal-review.md");
  const mappingPath = path.join(repoRoot, "docs", "adapters", "ramen-receipt-v5-evidence-pack-mapping.md");
  const allowedPath = path.join(repoRoot, "experiments", "ramen-receipt-v5", "artifacts", "sample-evidence-record-allowed.json");
  const blockedPath = path.join(repoRoot, "experiments", "ramen-receipt-v5", "artifacts", "sample-evidence-record-blocked.json");
  const steeredPath = path.join(repoRoot, "experiments", "ramen-receipt-v5", "artifacts", "sample-evidence-record-steered.json");
  const reportPath = path.join(repoRoot, "experiments", "ramen-receipt-v5", "artifacts", "sample-guard-report-section.md");

  for (const filePath of [specPath, reviewPath, mappingPath, allowedPath, blockedPath, steeredPath, reportPath]) {
    expect(fs.existsSync(filePath), `required ingestion spike file missing: ${path.relative(repoRoot, filePath)}`);
  }

  const mappingText = readText(mappingPath);
  for (const phrase of [
    "signed decision-and-steering receipt",
    "evidence record only",
    "not approval",
    "not certification",
    "not execution proof",
    "policy content immutability",
    "legal applicability",
    "does not change `audit`, `permit`, or `classify`",
  ]) {
    expect(mappingText.includes(phrase), `mapping doc must include phrase: ${phrase}`);
  }

  const allowed = readJson(allowedPath);
  const blocked = readJson(blockedPath);
  const steered = readJson(steeredPath);

  for (const [label, record] of [
    ["allowed", allowed],
    ["blocked", blocked],
    ["steered", steered],
  ]) {
    expect(record.evidence_type === "external_runtime_decision_receipt", `${label} evidence_type mismatch`);
    expect(record.source === "ramen", `${label} source mismatch`);
    expect(record.source_schema === "ramen-receipt-v5", `${label} source_schema mismatch`);
    expect(record.signature_valid === true, `${label} signature_valid mismatch`);
    expect(record.input_binding_valid === true, `${label} input_binding_valid mismatch`);
    expect(record.assurance_limits.includes("policy_content_immutability_not_provided"), `${label} missing immutability limit`);
    expect(record.assurance_limits.includes("execution_binding_not_provided"), `${label} missing execution limit`);
    expect(record.assurance_limits.includes("legal_applicability_not_verified"), `${label} missing legal limit`);
    expect(
      record.non_authority_statement ===
        "This record is external receipt evidence only. It does not approve, block, deploy, certify, or control execution.",
      `${label} non_authority_statement mismatch`
    );
  }

  expect(allowed.decision === "allow", "allowed sample decision mismatch");
  expect(blocked.decision === "block", "blocked sample decision mismatch");
  expect(steered.decision === "steered_allow", "steered sample decision mismatch");

  const verifyCommand = process.platform === "win32" ? "npm.cmd run verify:ramen-v5" : "npm run verify:ramen-v5";
  const reviewCommand =
    process.platform === "win32" ? "npm.cmd run verify:ramen-v5:review" : "npm run verify:ramen-v5:review";
  runScript(verifyCommand, repoRoot, "PASS: ramen receipt v5 conformance verified.");
  runScript(reviewCommand, repoRoot, "PASS: ramen receipt v5 review package verified.");

  const summary = {
    ingestion_mapping_ready: true,
    sample_records_verified: true,
    report_section_present: true,
  };

  console.log(JSON.stringify(summary, null, 2));
  console.log("PASS: ramen receipt v5 ingestion spike verified.");
}

main();
