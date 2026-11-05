import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exp = path.resolve(root, "..");
const read = (p) => fs.readFileSync(p, "utf8");
const facts = JSON.parse(read(path.join(exp, "fixtures/master-dossier-facts.json")));
const baseline = JSON.parse(read(path.join(root, "fixtures/baseline-case-mapping.json")));
const adversarial = JSON.parse(read(path.join(root, "fixtures/adversarial-cases.json")));
const source = JSON.parse(read(path.join(root, "fixtures/source-contract-snapshot.json")));
const failures = [];
const checks = [];
const check = (id, ok) => {
  checks.push({ id, result: ok ? "PASS" : "FAIL" });
  if (!ok) failures.push(id);
};
const sorted = (items) => [...items].sort();

function evaluate(testCase) {
  const input = testCase.input;
  const findings = [];
  let status;

  switch (testCase.kind) {
    case "c14": {
      const admissible =
        input.artifact_present === true &&
        input.current_execution === true &&
        input.bound === true &&
        input.digest_verified === true;
      status = admissible ? input.registered : "DESIGN_DECLARADO";
      if (!admissible) findings.push("evidence_incomplete", "external_report_unavailable");
      break;
    }
    case "crypto":
      if (input.signature_present !== true) findings.push("missing_signature");
      if (input.signature_checked !== true) findings.push("signature_not_checked");
      if (input.raw_payload !== true) findings.push("raw_payload_unavailable");
      break;
    case "tsa":
      if (input.mode === "LOCAL_MOCK" || input.external_token !== true || input.verified !== true) {
        findings.push("timestamp_not_checked");
      }
      break;
    case "rag":
      if (input.retrieved === 0 || input.relevant === 0 || input.relevant / input.retrieved < input.minimum_ratio) {
        findings.push("evidence_insufficient_for_review", "partial_evidence");
      }
      break;
    case "narrative":
      status = input.deterministic;
      if (input.narrative !== input.deterministic) {
        findings.push("reviewer_attention_recommended");
        if (input.bound !== true) findings.push("evidence_incomplete");
      }
      break;
    case "counts":
      if (input.counts.reduce((sum, value) => sum + value, 0) !== input.total) {
        findings.push("not_review_ready", "evidence_incomplete");
      }
      break;
    case "hash":
      if (input.raw_payload === true && input.declared !== input.computed) {
        findings.push("payload_hash_mismatch");
      }
      break;
    case "reference":
      if (input.declared === true && input.retrieved !== true) {
        findings.push("evidence_incomplete", "external_report_unavailable");
      }
      break;
    case "self_assurance": {
      const independentlySupported =
        input.external_verifier_present === true &&
        input.external_verifier_identity_verified === true &&
        input.external_verifier_distinct_from_producer === true &&
        input.external_verification_artifact_present === true &&
        input.external_verification_artifact_retrieved === true &&
        input.artifact_bound_to_claim === true &&
        input.artifact_digest_verified === true;
      if (input.claim === "independently_verified" && !independentlySupported) {
        findings.push("evidence_incomplete", "reviewer_attention_recommended");
      }
      break;
    }
    default:
      throw new Error("UNSUPPORTED_CASE_KIND:" + testCase.kind);
  }

  return { status, findings: sorted(findings) };
}

check("C14 registered/effective downgrade preserved",
  facts.c14.effective_status === "DESIGN_DECLARADO" &&
  facts.c14.registered_status !== facts.c14.effective_status);
check("C14 current-execution evidence absence preserved",
  facts.c14.stress_artifact_found_in_this_execution === false &&
  facts.c14.stress_artifact_verified_in_this_execution === false);
check("MOCK_PROTOCOL remains unsigned",
  facts.envelope.protocol_mode === "MOCK_PROTOCOLO" &&
  facts.envelope.signature === null &&
  facts.envelope.signature_status === "NAO_IMPLEMENTADO");
check("LOCAL_MOCK not promoted to external TSA",
  facts.envelope.tsa_status.startsWith("LOCAL_MOCK") &&
  facts.envelope.external_anchor_present === false);
check("RAG 0/5 relevance preserved",
  facts.rag.sources_retrieved === 5 &&
  facts.rag.relevant_sources === 0 &&
  facts.rag.relevance_status === "contexto_insuficiente");
check("21 claim counts reconcile",
  facts.claims.total === Object.values(facts.claims.effective_status_counts).reduce((sum, value) => sum + value, 0));
check("EAK source snapshot is pinned",
  /^[a-f0-9]{40}$/.test(source.source_refs.eak_types.blob_sha));
check("five baseline mappings exist", baseline.cases.length === 5);
check("baseline finding vocabulary is existing",
  baseline.cases.every((item) =>
    item.case_disposition === "SUPPORTED_LIMITED" &&
    item.finding_types.every((finding) => source.finding_types.includes(finding))));
check("baseline EAK vocabulary is existing",
  baseline.cases.every((item) =>
    item.eak_checks.every(([type, status]) =>
      source.eak_check_types.includes(type) && source.eak_check_statuses.includes(status))));
check("RAG relevance does not invent an EAK check",
  baseline.cases.find((item) => item.case_id === "AOE-PE-03-RAG-ZERO-RELEVANCE").eak_checks.length === 0);

const adversarialResults = adversarial.cases.map((testCase) => {
  const actual = evaluate(testCase);
  const expectedFindings = sorted(testCase.expected_findings);
  const pass =
    JSON.stringify(actual.findings) === JSON.stringify(expectedFindings) &&
    (testCase.expected_status === undefined || actual.status === testCase.expected_status);
  return { case_id: testCase.case_id, pass, actual, expected: { status: testCase.expected_status, findings: expectedFindings } };
});
for (const result of adversarialResults) check("adversarial " + result.case_id, result.pass);

const control = evaluate(adversarial.positive_control);
check("positive control preserves fully bound current-execution evidence",
  JSON.stringify(control.findings) === "[]" &&
  control.status === adversarial.positive_control.expected_status);
const independentControl = evaluate(adversarial.positive_control_independent_verification);
check("positive control accepts independently verified external assurance only when all bindings are present",
  JSON.stringify(independentControl.findings) === "[]" &&
  independentControl.status === undefined);
check("all expected findings use existing taxonomy",
  adversarial.cases.every((item) => item.expected_findings.every((finding) => source.finding_types.includes(finding))));
check("non-authority boundary is explicit",
  adversarial.non_authority_statement.includes("no approval, blocking, deployment, certification, or runtime control"));

const report = {
  suite_id: "AOE-PE-v0.1.1",
  mode: "offline-source-bound-fixtures",
  total_checks: checks.length,
  passed: checks.filter((item) => item.result === "PASS").length,
  failed: failures.length,
  disposition: failures.length === 0 ? "FIXTURE_AND_ADVERSARIAL_ORACLE_PASS" : "FAIL",
  checks,
  adversarial_results: adversarialResults,
  positive_control_result: control,
  positive_control_independent_verification_result: independentControl,
  producer_assurance: "NOT_ESTABLISHED",
  guard_integration: "NOT_PERFORMED",
  limitations: [
    "Source PDF digest is transcribed, not recalculated.",
    "Underlying ARIA repository, raw JSON, signature, TSA token, and stress artifact were not independently fetched or verified.",
    "Oracle is experiment-level fixture logic, not Guard Core or the EAK verifier."
  ],
  non_authority_statement: adversarial.non_authority_statement
};

fs.mkdirSync(path.join(root, "artifacts"), { recursive: true });
fs.writeFileSync(path.join(root, "artifacts/verification-result.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({
  disposition: report.disposition,
  checks: report.total_checks,
  passed: report.passed,
  failed: report.failed,
  failures
}, null, 2));
if (failures.length) process.exitCode = 1;
