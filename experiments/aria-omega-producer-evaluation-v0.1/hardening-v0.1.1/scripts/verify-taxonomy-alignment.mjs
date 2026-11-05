import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(p, "utf8");
const source = JSON.parse(read(path.join(root, "fixtures/source-contract-snapshot.json")));
const baseline = JSON.parse(read(path.join(root, "fixtures/baseline-case-mapping.json")));
const adversarial = JSON.parse(read(path.join(root, "fixtures/adversarial-cases.json")));
const report = JSON.parse(read(path.join(root, "artifacts/verification-result.json")));

const checks = [
  ["finding names", baseline.cases.every((item) => item.finding_types.every((name) => source.finding_types.includes(name)))],
  ["finding categories", source.finding_categories.length === 9],
  ["finding severities", source.finding_severities.length === 5],
  ["EAK check types", baseline.cases.every((item) => item.eak_checks.every(([type]) => source.eak_check_types.includes(type)))],
  ["EAK check statuses", baseline.cases.every((item) => item.eak_checks.every(([, status]) => source.eak_check_statuses.includes(status)))],
  ["case disposition separated", baseline.cases.every((item) => item.case_disposition === "SUPPORTED_LIMITED")],
  ["thirteen adversarial cases", adversarial.cases.length === 13],
  ["adversarial findings use existing taxonomy", adversarial.cases.every((item) => item.expected_findings.every((name) => source.finding_types.includes(name)))],
  ["RAG emits no invented EAK check", baseline.cases.find((item) => item.case_id === "AOE-PE-03-RAG-ZERO-RELEVANCE").eak_checks.length === 0],
  ["C14 positive control", report.positive_control_result.status === "TESTADO_EM_AMBIENTE_CONTROLADO" && report.positive_control_result.findings.length === 0],
  ["independent assurance positive control", report.positive_control_independent_verification_result.findings.length === 0],
  ["no product integration", report.guard_integration === "NOT_PERFORMED" && report.producer_assurance === "NOT_ESTABLISHED"],
  ["EAK source ref pinned", /^[a-f0-9]{40}$/.test(source.source_refs.eak_types.blob_sha)]
];

const output = {
  suite_id: "AOE-PE-v0.1.1-TAXONOMY-ALIGNMENT",
  total_checks: checks.length,
  passed: checks.filter((item) => item[1]).length,
  failed: checks.filter((item) => !item[1]).length,
  checks: checks.map(([name, pass]) => ({ check: name, result: pass ? "PASS" : "FAIL" })),
  limitations: [
    "Uses a frozen source-contract snapshot; refresh if Guard taxonomy or EAK type files change.",
    "This is repository-source alignment, not an independent audit of ARIA or Guard runtime verification."
  ]
};

fs.writeFileSync(path.join(root, "artifacts/taxonomy-alignment-result.json"), JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify(output, null, 2));
if (output.failed) process.exitCode = 1;
