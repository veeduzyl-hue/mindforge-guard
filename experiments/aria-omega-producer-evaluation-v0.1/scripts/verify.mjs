import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const facts = JSON.parse(fs.readFileSync(path.join(root, "fixtures/master-dossier-facts.json"), "utf8"));
const suite = JSON.parse(fs.readFileSync(path.join(root, "fixtures/evaluation-cases.json"), "utf8"));
const failures = [];
const checks = [];
function check(id, condition, detail) {
  checks.push({ id, result: condition ? "PASS" : "FAIL", detail });
  if (!condition) failures.push(id);
}

check("source-hash-present", /^[a-f0-9]{64}$/.test(facts.source_artifact.sha256), "Frozen source PDF SHA-256 is recorded.");
check("c14-downgrade", facts.c14.registered_status === "TESTADO_EM_AMBIENTE_CONTROLADO" && facts.c14.effective_status === "DESIGN_DECLARADO", "C14 registered/effective status distinction is preserved.");
check("c14-current-execution-missing", facts.c14.stress_artifact_found_in_this_execution === false && facts.c14.stress_artifact_verified_in_this_execution === false, "Missing stress evidence in this execution is not inferred from another branch.");
check("mock-protocol", facts.envelope.protocol_mode === "MOCK_PROTOCOLO", "Envelope remains explicitly mock protocol.");
check("signature-absent", facts.envelope.signature === null && facts.envelope.signature_status === "NAO_IMPLEMENTADO", "No signature is inferred.");
check("tsa-local-mock", facts.envelope.tsa_status.startsWith("LOCAL_MOCK") && facts.envelope.external_anchor_present === false, "Local mock is not promoted to external TSA proof.");
check("rag-zero-relevance", facts.rag.sources_retrieved === 5 && facts.rag.relevant_sources === 0 && facts.rag.relevance_status === "contexto_insuficiente", "Retrieval count is not mistaken for relevant support.");
const counts = facts.claims.effective_status_counts;
check("claim-total", facts.claims.total === 21 && Object.values(counts).reduce((a, b) => a + b, 0) === 21, "Effective status counts reconcile to 21.");
check("claim-status-distribution", counts.IMPLEMENTADO_EM_PROTOTIPO === 7 && counts.DESIGN_DECLARADO === 8 && counts.EM_ROADMAP === 6, "7 prototype / 8 design / 6 roadmap.");
check("c14-reconciliation", facts.claims.c14_registered_status === facts.c14.registered_status && facts.claims.c14_effective_status === facts.c14.effective_status, "C14 status is consistent across dossier sections.");
check("no-independent-recalculation-claim", facts.self_reported_integrity_checks.external_independent_recalculation_by_this_evaluation === false, "This harness does not claim independent cryptographic recalculation.");
check("case-count", suite.cases.length === 5, "Exactly five requested focus cases are present.");
check("unique-case-ids", new Set(suite.cases.map(c => c.case_id)).size === suite.cases.length, "Case IDs are unique.");
check("all-cases-limited", suite.cases.every(c => c.expected_finding === "SUPPORTED_LIMITED" && c.limitation), "Every case preserves a bounded finding and explicit limitation.");
check("non-authority-boundary", typeof suite.suite_non_authority_statement === "string" && suite.suite_non_authority_statement.includes("does not approve, block, deploy, certify, or control execution"), "Non-authority statement is present.");

const report = {
  suite_id: suite.suite_id,
  evaluated_at: "SOURCE_BOUND_OFFLINE_RUN",
  mode: "offline_source_bound_fixture",
  total_checks: checks.length,
  passed: checks.filter(c => c.result === "PASS").length,
  failed: failures.length,
  disposition: failures.length === 0 ? "FIXTURE_CONTRACT_PASS" : "FIXTURE_CONTRACT_FAIL",
  producer_assurance: "NOT_ESTABLISHED",
  guard_integration: "NOT_PERFORMED",
  checks,
  limitations: [
    "The source repository and original JSON dossier were not independently fetched.",
    "The original JSON payload hashes were not independently recomputed from source bytes.",
    "No signature, certificate chain, TSA token, or external witness was verified.",
    "The evaluation tests the dossier disclosures and fixture semantics, not ARIA runtime behavior.",
    "This result is not certification, production admission, or independent assurance of ARIA OMEGA."
  ],
  non_authority_statement: suite.suite_non_authority_statement
};
fs.mkdirSync(path.join(root, "artifacts"), { recursive: true });
fs.writeFileSync(path.join(root, "artifacts/verification-result.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ disposition: report.disposition, total_checks: report.total_checks, passed: report.passed, failed: report.failed, failures }, null, 2));
if (failures.length) process.exitCode = 1;
