// CURRENT_RUNTIME_OBSERVATION only. Never imported by reference.mjs.
import { evaluateMesrClaimSupport } from "../../packages/guard-core/src/mesr/supportEvaluator.ts";
import { composeMesrModules } from "../../packages/guard-core/src/mesr/moduleManifest.ts";
import { validateMesrTemporalBasis } from "../../packages/guard-core/src/mesr/temporalBasis.ts";
import { evaluateEvidenceAssuranceKernel } from "../../packages/guard-core/src/evidenceAssuranceKernel.ts";
import { generateGovernanceReport } from "../../packages/guard-core/src/generateGovernanceReport.ts";
import { inspectEvidenceCoverage } from "../../packages/guard-core/src/inspectEvidenceCoverage.ts";
import { createExperiment0Cases } from "../fixtures/evidence_assurance_experiment_0_cases.mjs";
import { hash } from "./reference.mjs";
const clone=structuredClone;
const legacyClaims={pass:"checked_property_within_scope",occurred:"checked_property_within_scope",independence:"independent_verification",producer_inference:"independent_verification",observation_inference:"verification",integrity:"artifact_integrity",custody:"independent_custody",sufficiency:"evidence_sufficient",current:"controlled_basis_status",authority:"current_authority",old_authority_inference:"current_authority",acceptance:"applicable_reviewer_authority",decision:"review_occurrence",action:"action_state_within_captured_bounds",presence:"evidence_presence",collision:"world.fact"};
export function observe(fixture){
 const x=fixture.input;
 if(x.kind==="composition"){
   if(fixture.case_id.startsWith("C20"))return {surface:"composeMesrModules",not_applicable:"Malformed/unadmitted module type is outside current typed API; no unsafe typed call.",classification:"NOT_APPLICABLE_TO_CURRENT_RUNTIME",gap_ids:["G08"]};
   const output=composeMesrModules(clone(x.modules));
   return {surface:"composeMesrModules",raw_output:output};
 }
 const outputs=[];
 for(const q of x.requests){
   const request={claim_id:legacyClaims[q.path]??q.claim,semantic_ids:q.semantic_ids,provided_bindings:clone(x.bindings),required_bindings:q.required_bindings,evidence_refs:x.bindings.evidence_refs??[],
     observed_state_ids:q.path==="producer_inference"?["producer_claim_present"]:q.path==="observation_inference"?["observation_recorded"]:[],
     supported_claim_parts:x.caller_supported_claim_parts??[],contradicted_claims:x.caller_contradiction?[q.claim]:[]};
   outputs.push({claim:q.claim,path:q.path,request,raw_output:evaluateMesrClaimSupport(request)});
 }
 const t=x.temporal;
 const temporal_request={claim_ref:"fixture:current-standing",observed_at:t?.observed_at??null,verified_at:x.event_time??null,valid_from:t?.effective_from??null,valid_until:t?.effective_until??null,basis_valid_at:t?.reliance_time??null,basis_status:"current",provenance_refs:["fixture:temporal-declaration"]};
 const temporal_output=validateMesrTemporalBasis(temporal_request);
 const sample=createExperiment0Cases().caseA_complete_bounded_evidence;
 // Frozen canonical pack is an independent compatibility control, never a fabricated Harness pack.
 const pack=clone(sample.pack);
 if(x.legacy_report==="require_review")pack.authority.authorization_status="declared";
 if(x.legacy_report==="block")pack.blocked_actions=[{blocked_action_id:"b09-block-control",timestamp:pack.created_at,attempted_action:"fixture:destructive-action",reason_code:"DESTRUCTIVE_COMMAND",policy_ref:"fixture:policy",severity:"critical",human_review_required:true}];
 if(x.legacy_expiry){pack.authority.time_window.end_at=x.legacy_expiry==="equal"?pack.created_at:"2020-01-01T00:00:00Z";}
 const reportBefore=generateGovernanceReport(pack);
 if (!reportBefore.ok) throw Error("Canonical compatibility fixture invalid");
 if (!x.legacy_expiry && reportBefore.report.verdict.value!==x.legacy_report) throw Error("Legacy verdict control mismatch");
 const packBefore=hash(pack);
 let reports=[];
 if(x.external_checks){
   const report=clone(sample.external_assurance_reports[0]);
   report.executed_checks=x.external_checks.map((status,i)=>({...report.executed_checks[0],check_id:"fixture-check-"+i,status}));
   reports=[report];
 }
 const representedEvents=x.events??(x.raw_producer?.jobs?.flatMap(j=>j.check?[j.check]:[])??x.raw_producer?.verification_events??[]);
 const eakPack=clone(pack);
 eakPack.verification=representedEvents.filter(e=>e.kind==="verification"&&["passed","failed","not_run","inconclusive"].includes(e.result)).map(e=>({
   verification_id:e.event_id,verification_type:"unit_test",status:e.result,command:null,artifact_refs:[],coverage_note:"B09 test-only attributed producer event; original reference "+e.output_ref
 }));
 const eakInput={pack:eakPack,external_assurance_reports:reports,normalized_records:[],review_scope:{}};
 const eak=evaluateEvidenceAssuranceKernel(eakInput);
 const reportAfter=generateGovernanceReport(pack);
 if(hash(pack)!==packBefore||hash(JSON.stringify(reportAfter))!==hash(JSON.stringify(reportBefore)))throw Error("UNEXPECTED_REGRESSION: legacy report/input mutation");
 return {surface:"MESR + temporal + EAK + report",mesr:outputs,temporal:{request:temporal_request,raw_output:temporal_output},
   eak:{input:eakInput,raw_output:eak},report:{role:"Separate frozen canonical pack compatibility control; not claimed as Harness normalization",before:reportBefore,after:reportAfter,byte_hash:hash(JSON.stringify(reportBefore)),coverage:inspectEvidenceCoverage(pack)}};
}

