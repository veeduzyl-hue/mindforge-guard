import fs from "node:fs";import path from "node:path";import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const src=JSON.parse(fs.readFileSync(path.join(root,"fixtures/source-contract-snapshot.json"),"utf8"));
const base=JSON.parse(fs.readFileSync(path.join(root,"fixtures/baseline-case-mapping.json"),"utf8"));
const adv=JSON.parse(fs.readFileSync(path.join(root,"fixtures/adversarial-cases.json"),"utf8"));
const report=JSON.parse(fs.readFileSync(path.join(root,"artifacts/verification-result.json"),"utf8"));
const checks=[
 ["finding names",base.cases.every(c=>c.finding_types.every(x=>src.finding_types.includes(x)))],
 ["finding categories",src.finding_categories.length===9],
 ["EAK check types",base.cases.every(c=>c.eak_checks.every(x=>src.eak_check_types.includes(x[0])))],
 ["EAK check statuses",base.cases.every(c=>c.eak_checks.every(x=>src.eak_check_statuses.includes(x[1])))],
 ["case disposition separated",base.cases.every(c=>c.case_disposition==="SUPPORTED_LIMITED")],
 ["eight adversarial cases",adv.cases.length===8],
 ["positive control",report.positive_control_result.status==="TESTADO_EM_AMBIENTE_CONTROLADO"&&report.positive_control_result.findings.length===0],
 ["no product integration",report.guard_integration==="NOT_PERFORMED"&&report.producer_assurance==="NOT_ESTABLISHED"]
];
const out={suite_id:"AOE-PE-v0.1.1-TAXONOMY-ALIGNMENT",total_checks:checks.length,passed:checks.filter(x=>x[1]).length,failed:checks.filter(x=>!x[1]).length,checks:checks.map(x=>({check:x[0],result:x[1]?"PASS":"FAIL"})),limitations:["Uses a frozen source-contract snapshot; refresh if Guard taxonomy or EAK type files change.","Not an independent audit of ARIA or a Guard runtime verification."]};
fs.writeFileSync(path.join(root,"artifacts/taxonomy-alignment-result.json"),JSON.stringify(out,null,2)+"\n");
console.log(JSON.stringify(out,null,2));
if(out.failed)process.exitCode=1;
