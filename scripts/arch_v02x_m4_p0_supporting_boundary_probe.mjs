// M4 v0.1.1 P0 supporting PROBES, NOT executions of the 62 original M4 cases.
// Tests CURRENT experimental Guard/M3 interfaces with synthetic local fixtures.
// A successful probe is not an admitted M4 test, product PASS, or M4 case closure.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const GUARD=path.join(REPO,'packages/guard/bin/guard.mjs');
const INVENTORY=path.join(REPO,'scripts/arch_v02x_m3_source_inventory_synthetic.mjs');
const DEMO=path.join(REPO,'scripts/arch_v02x_m3_first_report_walkthrough_synthetic.mjs');
const SAMPLE=path.join(REPO,'examples/single-agent-governance-pack/hr-self-service-agent');
const ROOT=fs.mkdtempSync(path.join(os.tmpdir(),'arch-v02x-m4-p0-support-'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const safeEnv={
 PATH:process.env.PATH||'',Path:process.env.Path||'',SystemRoot:process.env.SystemRoot||'',
 HOME:path.join(ROOT,'isolated-home'),USERPROFILE:path.join(ROOT,'isolated-home'),
 TEMP:ROOT,TMP:ROOT,
 I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT:'0',
 I1_REAL_WIN_ACL_SYNTHETIC_ONLY:'0',
 I1_REAL_WIN_ACL_MODULE_PATH:'',
 I1_REAL_WIN_ACL_MODULE_SHA256:''
};
const observations=[];
function call(file,args,env={}){
 const r=spawnSync(process.execPath,[file,...args],{
  cwd:REPO,encoding:'utf8',timeout:60000,maxBuffer:8*1024*1024,windowsHide:true,
  env:{...safeEnv,...env}
 });
 if(r.error)throw r.error;
 if(r.signal)throw Error('CHILD_SIGNAL_NOT_ALLOWED');
 return {code:r.status,stdout:r.stdout,stderr:r.stderr};
}
function runPack(dir){return call(GUARD,['pack','validate','--pack',dir,'--preview','--json']);}
function statusOf(r){
 let j;try{j=JSON.parse(r.stdout)}catch{j=null}
 return {exit:r.code,validation:j?.validation_status||null,
  hash:j?.deterministic_pack_hash||null,
  // Sensitive data & filesystem locations never emitted in this receipt.
  absolute_path_exported:!!(j&&JSON.stringify(j).includes(ROOT)),
  valid_json:!!j
 };
}
function caseRun(id,m4Targets,title,fn){
 try{
  const result=fn();
  if(!['ENFORCED_BOUNDED_CURRENT_INTERFACE','GAP_OBSERVED_IN_CURRENT_INTERFACE',
       'NOT_TESTED','CONDITION_OPEN'].includes(result.status))throw Error('UNSUPPORTED_RESULT_LABEL');
  observations.push({id,related_original_ids:m4Targets,title,...result});
  console.log('OBSERVED '+id+' '+result.status);
 }catch(e){
  observations.push({id,related_original_ids:m4Targets,title,status:'PROBE_EXECUTION_ERROR',
   exception_type:e?.name||'Error'});
  console.error('PROBE_EXECUTION_ERROR '+id+' '+(e?.name||'Error'));
 }
}
const clone=id=>{
 const dst=path.join(ROOT,'pack-'+id);
 fs.cpSync(SAMPLE,dst,{recursive:true});
 return dst;
};
try{
 fs.mkdirSync(safeEnv.HOME,{recursive:true});
 assert(fs.existsSync(GUARD)&&fs.existsSync(SAMPLE)&&fs.existsSync(INVENTORY));
 caseRun('M4P0-SUPPORT-01',['REL-05'],'Canonical Pack extra binary + hidden content, current parser response',()=>{
  const baseline=clone('base'),variant=clone('extra');
  const before=statusOf(runPack(baseline));
  assert.equal(before.validation,'valid_with_no_omissions','Fixed baseline must validate');
  const secret='SYNTHETIC_NOT_A_REAL_SECRET_P0_TEST_ONLY';
  fs.writeFileSync(path.join(variant,'.env.synthetic'),secret);
  fs.writeFileSync(path.join(variant,'opaque-binary.bin'),Buffer.from([0,255,13,10,0,123]));
  const raw=runPack(variant),after=statusOf(raw);
  const syntheticValueLeaked=raw.stdout.includes(secret)||raw.stderr.includes(secret);
  const noBaselineChange=sha(fs.readFileSync(path.join(baseline,'manifest.json')))===
    sha(fs.readFileSync(path.join(variant,'manifest.json')));
  assert(noBaselineChange);
  const swallowedExtra=after.exit===0&&after.validation==='valid_with_no_omissions';
  return {status:swallowedExtra||syntheticValueLeaked?
       'GAP_OBSERVED_IN_CURRENT_INTERFACE':'ENFORCED_BOUNDED_CURRENT_INTERFACE',
   observed:{base_validation:before.validation,with_extra_validation:after.validation,
    with_extra_exit:after.exit,extra_changes_pack_digest:before.hash!==after.hash,
    accepted_extra_unrelated_files:swallowedExtra,synthetic_secret_value_exported:syntheticValueLeaked},
   original_m4_case_state:'NOT_RUN_FUTURE_M2_M3_SCENARIO'};
 });
 caseRun('M4P0-SUPPORT-02',['REL-06','BND-07'],'Canonical Pack source symlink to out-of-root synthetic bytes',()=>{
  const baseline=clone('symlink-base');
  const without=statusOf(runPack(baseline));
  const external=path.join(ROOT,'outside-synthetic-source.txt');
  fs.writeFileSync(external,'SYNTHETIC_EXTERNAL_NOT_REAL_DATA');
  const link=path.join(baseline,'evidence','external-source.txt');
  try{fs.symlinkSync(external,link,'file');}
  catch(e){
    if(process.platform==='win32'&&['EPERM','EACCES','UNKNOWN'].includes(e.code))
      return {status:'NOT_TESTED',reason:'SYMLINK_FIXTURE_PRIVILEGE_UNAVAILABLE',
        original_m4_case_state:'NOT_RUN'};
    throw e;
  }
  const observed=runPack(baseline),after=statusOf(observed);
  const observedExternal=after.hash!==without.hash;
  const allowed=after.exit===0&&after.validation==='valid_with_no_omissions';
  return {status:allowed||observedExternal?
    'GAP_OBSERVED_IN_CURRENT_INTERFACE':'ENFORCED_BOUNDED_CURRENT_INTERFACE',
    observed:{symlink_fixture_constructed:true,validated_with_symlink:allowed,
      digest_changes_on_external_source:observedExternal,
      raw_synthetic_external_value_exported:observed.stdout.includes('SYNTHETIC_EXTERNAL_NOT_REAL_DATA')},
    original_m4_case_state:'NOT_RUN_FUTURE_ONBOARDING_PATH'};
 });
 caseRun('M4P0-SUPPORT-03',['CLI-09'],'Existing Review output must preserve bytes; no overwrite',()=>{
  const pack=clone('out-collision'),out=path.join(ROOT,'already-exists');
  fs.mkdirSync(out);
  const keep=path.join(out,'keep-owner-data.txt');
  fs.writeFileSync(keep,'SYNTHETIC_EXISTING_OUTPUT_BYTES');
  const before=sha(fs.readFileSync(keep));
  const review=call(GUARD,['review','--pack',pack,'--out',out,'--format','json']);
  const accepted=review.code===2&&sha(fs.readFileSync(keep))===before;
  return {status:accepted?'ENFORCED_BOUNDED_CURRENT_INTERFACE':'GAP_OBSERVED_IN_CURRENT_INTERFACE',
   observed:{existing_output_exit:review.code,owner_bytes_unchanged:sha(fs.readFileSync(keep))===before},
   original_m4_case_state:'NOT_RUN_FUTURE_UNIFIED_SOURCE_MODE'};
 });
 caseRun('M4P0-SUPPORT-04',['BND-01','BND-02'],'M3 explicit Inventory excludes synthetically named secret and does not export value/path',()=>{
  const fixture=path.join(ROOT,'inventory-fixture');
  fs.mkdirSync(fixture);
  fs.writeFileSync(path.join(fixture,'.ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY'),
    'ARCH_V02X_SOURCE_INVENTORY_SYNTHETIC_ONLY\n');
  const pack=path.join(fixture,'synthetic-pack');
  fs.cpSync(SAMPLE,pack,{recursive:true});
  const secret='SYNTHETIC_NOT_A_REAL_SECRET_NO_EXPORT';
  fs.writeFileSync(path.join(pack,'.env.local'),secret);
  const r=call(INVENTORY,['--source',pack,'--target-contract','first-report-pack','--format','json'],{
    ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY:'1',
    ARCH_V02X_M3_INVENTORY_FIXTURE_ROOT:fixture
  });
  let j;try{j=JSON.parse(r.stdout)}catch{j=null}
  const noRaw=r.stdout&&!r.stdout.includes(secret)&&!r.stdout.includes(ROOT)&&
    !r.stdout.includes('.env.local');
  const accepted=r.code===0&&j?.kind==='mindforge_source_inventory'&&
    j.summary?.excluded_count>=1&&noRaw;
  return {status:accepted?'ENFORCED_BOUNDED_CURRENT_INTERFACE':'GAP_OBSERVED_IN_CURRENT_INTERFACE',
   observed:{inventory_exit:r.code,excluded_count:j?.summary?.excluded_count??null,
      no_raw_secret_or_path_export:!!noRaw,source_copy_written:j?.source_copy_written??null},
   original_m4_case_state:'NOT_RUN_FULL_BUNDLE_REQUIREMENT'};
 });
 caseRun('M4P0-SUPPORT-05',['BND-03','BND-05'],'Unconfirmed synthetic demo does not create final delivery',()=>{
  const workspace=path.join(os.tmpdir(),'guard-v02x-synthetic-'+crypto.randomUUID().replaceAll('-',''));
  const enabled={ARCH_V02X_FIRST_REPORT_DEMO_SYNTHETIC_ONLY:'1'};
  try{
    const start=call(DEMO,['--mode','prepare','--workspace',workspace],enabled);
    const finish=call(DEMO,['--mode','complete','--workspace',workspace],enabled);
    let j=null;try{j=JSON.parse(finish.stdout)}catch{}
    const success=start.code===0&&finish.code===24&&
      j?.reason==='MAPPING_DECISIONS_INCOMPLETE_OR_NOT_CONFIRMABLE'&&
      !fs.existsSync(path.join(workspace,'delivery'));
    return {status:success?'ENFORCED_BOUNDED_CURRENT_INTERFACE':'GAP_OBSERVED_IN_CURRENT_INTERFACE',
      observed:{prepare_exit:start.code,finish_exit:finish.code,
        no_final_delivery:!fs.existsSync(path.join(workspace,'delivery'))},
      original_m4_case_state:'NOT_RUN_SECURE_I1_BUNDLE_NOT_TESTED'};
  }finally{
    if(fs.existsSync(workspace))fs.rmSync(workspace,{recursive:true,force:true});
  }
 });
 caseRun('M4P0-SUPPORT-06',['BND-07'],'Inventory refuses selected source outside marked synthetic root',()=>{
  const fixture=path.join(ROOT,'inventory-root-only');
  fs.mkdirSync(fixture);
  fs.writeFileSync(path.join(fixture,'.ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY'),
   'ARCH_V02X_SOURCE_INVENTORY_SYNTHETIC_ONLY\n');
  const outside=path.join(ROOT,'outside-not-approved.txt');
  fs.writeFileSync(outside,'SYNTHETIC_ONLY');
  const r=call(INVENTORY,['--source',outside,'--target-contract','first-report-pack','--format','json'],{
    ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY:'1',
    ARCH_V02X_M3_INVENTORY_FIXTURE_ROOT:fixture
  });
  let j=null;try{j=JSON.parse(r.stdout)}catch{}
  const refused=r.code===24&&j?.reason==='SOURCE_OUTSIDE_SYNTHETIC_FIXTURE_ROOT';
  return {status:refused?'ENFORCED_BOUNDED_CURRENT_INTERFACE':'GAP_OBSERVED_IN_CURRENT_INTERFACE',
    observed:{exit:r.code,refusal_reason:j?.reason||'NO_MACHINE_REASON'},
    original_m4_case_state:'NOT_RUN_FULL_M2_M3_UNIFIED_PATH'};
 });
}finally{
 // Only the fresh synthetic fixture tree created by this probe; no customer files.
 fs.rmSync(ROOT,{recursive:true,force:true});
}
const errors=observations.filter(x=>x.status==='PROBE_EXECUTION_ERROR');
const gaps=observations.filter(x=>x.status==='GAP_OBSERVED_IN_CURRENT_INTERFACE');
const untested=observations.filter(x=>x.status==='NOT_TESTED');
const head=spawnSync('git',['rev-parse','HEAD'],{cwd:REPO,encoding:'utf8'});
const report={
 kind:'M4_V011_P0_SUPPORTING_PROBE_NOT_ORIGINAL_ACCEPTANCE',
 tested_source_head:head.status===0?head.stdout.trim():'UNVERIFIED',
 platform:process.platform,node:process.version,
 source_scope:'FIXED_SYNTHETIC_ONLY',
 original_m4_62:'NOT_RUN',
 original_m4_cases_closed:0,
 test_status:'EXECUTED_SUPPORTING_OBSERVATIONS_ONLY',
 critical_findings_count:gaps.length,
 execution_errors:errors.length,
 fixture_not_tested_count:untested.length,
 no_real_customer_data:true,
 no_product_release:true,
 count:observations.length,observations
};
console.log('ARCH_M4_P0_SUPPORTING_RECEIPT '+JSON.stringify(report));
if(errors.length)process.exitCode=1;
