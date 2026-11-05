import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const exp=path.resolve(root,"..");
const read=p=>fs.readFileSync(p,"utf8");
const facts=JSON.parse(read(path.join(exp,"fixtures/master-dossier-facts.json")));
const cases=JSON.parse(read(path.join(root,"fixtures/baseline-case-mapping.json")));
const adv=JSON.parse(read(path.join(root,"fixtures/adversarial-cases.json")));
const src=JSON.parse(read(path.join(root,"fixtures/source-contract-snapshot.json")));
const failures=[],checks=[];
const check=(id,ok)=>{checks.push({id,result:ok?"PASS":"FAIL"});if(!ok)failures.push(id);};
const sort=a=>[...a].sort();
function evalCase(c){
 const x=c.input;let status;const f=[];
 switch(c.kind){
 case "c14":{const ok=x.artifact_present&&x.bound&&x.digest_verified;status=ok?x.registered:"DESIGN_DECLARADO";if(!ok)f.push("evidence_incomplete","external_report_unavailable");break;}
 case "crypto":if(!x.signature_present)f.push("missing_signature");if(!x.signature_checked)f.push("signature_not_checked");if(!x.raw_payload)f.push("raw_payload_unavailable");break;
 case "tsa":if(x.mode==="LOCAL_MOCK"||!x.external_token||!x.verified)f.push("timestamp_not_checked");break;
 case "rag":if(x.retrieved===0||x.relevant===0||x.relevant/x.retrieved<x.minimum_ratio)f.push("evidence_insufficient_for_review","partial_evidence");break;
 case "narrative":status=x.deterministic;if(x.narrative!==x.deterministic){f.push("reviewer_attention_recommended");if(!x.bound)f.push("evidence_incomplete");}break;
 case "counts":if(x.counts.reduce((a,b)=>a+b,0)!==x.total)f.push("not_review_ready","evidence_incomplete");break;
 case "hash":if(x.raw_payload&&x.declared!==x.computed)f.push("payload_hash_mismatch");break;
 case "reference":if(x.declared&&!x.retrieved)f.push("evidence_incomplete","external_report_unavailable");break;
 }
 return {status,findings:sort(f)};
}
check("C14 downgrade preserved",facts.c14.effective_status==="DESIGN_DECLARADO"&&facts.c14.registered_status!==facts.c14.effective_status);
check("mock envelope remains unsigned",facts.envelope.protocol_mode==="MOCK_PROTOCOLO"&&facts.envelope.signature===null);
check("local TSA not external",facts.envelope.tsa_status.startsWith("LOCAL_MOCK")&&!facts.envelope.external_anchor_present);
check("RAG zero relevance",facts.rag.sources_retrieved===5&&facts.rag.relevant_sources===0);
check("claim counts reconcile",facts.claims.total===Object.values(facts.claims.effective_status_counts).reduce((a,b)=>a+b,0));
check("five baseline mappings",cases.cases.length===5);
check("no new finding vocabulary",cases.cases.every(c=>c.case_disposition==="SUPPORTED_LIMITED"&&c.finding_types.every(x=>src.finding_types.includes(x))));
check("EAK values are existing",cases.cases.every(c=>c.eak_checks.every(x=>src.eak_check_types.includes(x[0])&&src.eak_check_statuses.includes(x[1]))));
const results=adv.cases.map(c=>{const a=evalCase(c);return {case_id:c.case_id,pass:JSON.stringify(a.findings)===JSON.stringify(sort(c.expected_findings))&&(c.expected_status===undefined||a.status===c.expected_status),actual:a};});
for(const r of results)check("adversarial "+r.case_id,r.pass);
const control=evalCase(adv.positive_control);
check("positive control",JSON.stringify(control.findings)===JSON.stringify(sort(adv.positive_control.expected_findings))&&control.status===adv.positive_control.expected_status);
const report={suite_id:"AOE-PE-v0.1.1",mode:"offline-source-bound-fixtures",total_checks:checks.length,passed:checks.filter(x=>x.result==="PASS").length,failed:failures.length,disposition:failures.length===0?"FIXTURE_AND_ADVERSARIAL_ORACLE_PASS":"FAIL",checks,adversarial_results:results,positive_control_result:control,producer_assurance:"NOT_ESTABLISHED",guard_integration:"NOT_PERFORMED",limitations:["Source PDF digest is transcribed, not recalculated.","Underlying ARIA repository, raw JSON, signature, TSA token, and stress artifact were not independently fetched or verified.","Oracle is experimental fixture logic, not Guard Core or the EAK verifier."],non_authority_statement:adv.non_authority_statement};
fs.mkdirSync(path.join(root,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(root,"artifacts/verification-result.json"),JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({disposition:report.disposition,checks:report.total_checks,passed:report.passed,failed:report.failed},null,2));
if(failures.length)process.exitCode=1;
