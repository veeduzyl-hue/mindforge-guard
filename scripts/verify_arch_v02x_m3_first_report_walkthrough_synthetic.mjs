// Standalone user-path demo tests. NOT M4 original 62, not real human sessions.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

const cli=path.resolve('scripts/arch_v02x_m3_first_report_walkthrough_synthetic.mjs');
const workspace=path.join(os.tmpdir(),'guard-v02x-synthetic-'+crypto.randomUUID().replaceAll('-',''));
const source=path.resolve('examples/single-agent-governance-pack/hr-self-service-agent');
const cases=[];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const env={...process.env,ARCH_V02X_FIRST_REPORT_DEMO_SYNTHETIC_ONLY:'1'};
const args=(mode,where=workspace)=>['--mode',mode,'--workspace',where];
function cliRun(mode,where=workspace,overrides={}){
 const x=spawnSync(process.execPath,[cli,...args(mode,where)],{
  cwd:os.tmpdir(),encoding:'utf8',timeout:120000,windowsHide:true,
  maxBuffer:20*1024*1024,env:{...env,...overrides}
 });
 if(x.error)throw x.error;
 assert.equal(x.signal,null,'CLI terminated with signal');
 return {exit:x.status,body:JSON.parse(x.stdout),stderr:x.stderr};
}
function item(id,title,fn){
 try{const evidence=fn();cases.push({id,title,status:'PASS',evidence:evidence||{}});
  console.log('PASS '+id+' '+title);}
 catch(e){cases.push({id,title,status:'FAIL',error:String(e.stack||e).slice(0,2700)});
  console.error('FAIL '+id+' '+String(e.message||e));}
}
function refusal(r,reason){
 assert.equal(r.exit,24);
 assert.equal(r.body.status,'BLOCKED');
 assert.equal(r.body.reason,reason);
 assert.equal(r.body.no_customer_data,true);
 assert.equal(r.body.no_automatic_cleanup,true);
}
function decisions(){
 const p=path.join(workspace,'mapping-decisions.synthetic.json');
 return JSON.parse(fs.readFileSync(p,'utf8'));
}
function saveDecisions(obj){
 fs.writeFileSync(path.join(workspace,'mapping-decisions.synthetic.json'),JSON.stringify(obj,null,2)+'\n');
}
function allConfirm(){
 const d=decisions();
 for(const x of d.decisions){
  x.decision='confirm';x.basis='source_reviewed';
  x.notes=['synthetic_checked_structure'];
 }
 return d;
}
function hashSample(){
 return sha(fs.readFileSync(path.join(source,'manifest.json')));
}
const originalHash=hashSample();
try {
 item('M3FLOW-01','default opt-in absent does not create any fixture',()=>{
  refusal(cliRun('prepare',workspace,{ARCH_V02X_FIRST_REPORT_DEMO_SYNTHETIC_ONLY:''}),
   'SYNTHETIC_DEMO_EXPLICIT_OPT_IN_REQUIRED');
  assert.equal(fs.existsSync(workspace),false);
 });
 item('M3FLOW-02','source path and unsupported mode rejected before any effect',()=>{
  refusal(cliRun('prepare',path.join(os.tmpdir(),'unexpected-folder')),
   'ONLY_FRESH_DIRECT_CHILD_OF_SYSTEM_TEMP_ALLOWED');
  refusal(cliRun('unexpected',workspace),'MODE_AND_WORKSPACE_REQUIRED');
  assert.equal(fs.existsSync(workspace),false);
 });
 item('M3FLOW-03','PREPARE generates synthetic fixture and unconfirmed eight-row review',()=>{
  const r=cliRun('prepare');assert.equal(r.exit,0,r.stderr);
  assert.equal(r.body.status,'SYNTHETIC_PREPARED');
  assert.equal(r.body.review_items,8);
  assert.equal(r.body.delivery,'NOT_BUILT');
  assert(fs.existsSync(path.join(workspace,'START_HERE.txt')));
  assert(fs.existsSync(path.join(workspace,'mapping-review.synthetic.json')));
  const review=JSON.parse(fs.readFileSync(path.join(workspace,'mapping-review.synthetic.json'),'utf8'));
  assert.equal(review.kind,'ARCH_V02X_M3_SYNTHETIC_MAPPING_REVIEW');
  assert.equal(review.counts.confirmed,0);
  assert.equal(review.mappings.length,8);
  assert(review.mappings.every(m=>m.value_exported===false));
  const d=decisions();
  assert.equal(d.decisions.length,8);
  assert(d.decisions.every(x=>x.decision==='defer'&&x.basis==='not_confirmed'));
  assert.equal(fs.existsSync(path.join(workspace,'delivery')),false);
  return {preparedMappings:8,reviewStatus:review.status};
 });
 item('M3FLOW-04','STATUS prepared reports no false delivery',()=>{
  const r=cliRun('status');assert.equal(r.exit,0);
  assert.equal(r.body.status,'SYNTHETIC_REVIEW_PREPARED');
  assert.equal(r.body.has_delivery,false);
 });
 item('M3FLOW-05','incomplete decisions do not build Pack or create delivery',()=>{
  refusal(cliRun('complete'),'MAPPING_DECISIONS_INCOMPLETE_OR_NOT_CONFIRMABLE');
  assert.equal(fs.existsSync(path.join(workspace,'delivery')),false);
 });
 item('M3FLOW-06','partial confirmation does not silently promote remainder',()=>{
  const d=decisions();d.decisions[0].decision='confirm';d.decisions[0].basis='source_reviewed';
  saveDecisions(d);
  refusal(cliRun('complete'),'MAPPING_DECISIONS_INCOMPLETE_OR_NOT_CONFIRMABLE');
  assert.equal(fs.existsSync(path.join(workspace,'delivery')),false);
 });
 item('M3FLOW-07','stale source preflight refuses before writing any final Pack',()=>{
  const p=path.join(workspace,'synthetic-input-pack','manifest.json');
  const before=fs.readFileSync(p);
  fs.writeFileSync(p,Buffer.concat([before,Buffer.from(' ')]));
  try{refusal(cliRun('complete'),'SOURCE_CHANGED_SINCE_PREPARE');}
  finally{fs.writeFileSync(p,before);}
  assert.equal(fs.existsSync(path.join(workspace,'delivery')),false);
 });
 item('M3FLOW-08','stale review fingerprint blocks builder, not only confirmation',()=>{
  const p=path.join(workspace,'mapping-review.synthetic.json'),before=fs.readFileSync(p);
  const obj=JSON.parse(before.toString('utf8'));
  obj.draft_fingerprint_sha256='sha256:'+'a'.repeat(64);
  fs.writeFileSync(p,JSON.stringify(obj));
  try{refusal(cliRun('complete'),'PREPARED_REVIEW_STALE_OR_SOURCE_CHANGED');}
  finally{fs.writeFileSync(p,before);}
 });
 item('M3FLOW-09','invalid reviewer note cannot yield a build',()=>{
  const d=allConfirm();d.decisions[0].notes=['FREE_TEXT_SECRET_SHOULD_NEVER_PRINT'];
  saveDecisions(d);
  refusal(cliRun('complete'),'M3_CONFIRMATION_FAIL_CLOSED');
  assert.equal(fs.existsSync(path.join(workspace,'delivery')),false);
 });
 item('M3FLOW-10','complete confirmed synthetic-only mapping builds real native validated report and HTML',()=>{
  saveDecisions(allConfirm());
  const r=cliRun('complete');
  assert.equal(r.exit,0,r.stderr+' '+JSON.stringify(r.body));
  assert.equal(r.body.status,'SYNTHETIC_DEMO_DELIVERY_CREATED');
  assert.equal(r.body.mapping_decisions,8);
  assert.equal(r.body.validation,'valid_with_no_omissions');
  assert.equal(r.body.report_posture,'ready_for_review');
  assert.equal(r.body.product_bundle,'NOT_ADMITTED');
  assert.equal(r.body.actual_user_identity,'NOT_ESTABLISHED');
  assert.equal(r.body.no_native_addon_loaded,true);
  assert.equal(r.body.m4_62,'NOT_RUN');
  assert(fs.existsSync(path.join(workspace,'delivery','report.html')));
  assert(fs.existsSync(path.join(workspace,'delivery','synthetic-first-report-pack','evidence','sample-output.json')));
  return {status:r.body.status,hash:r.body.deterministic_pack_hash};
 });
 item('M3FLOW-11','Pack and Report share actual deterministic hash and non-execution boundary',()=>{
  const base=path.join(workspace,'delivery');
  const validate=JSON.parse(fs.readFileSync(path.join(base,'pack-validation.json'),'utf8'));
  const report=JSON.parse(fs.readFileSync(path.join(base,'single-agent-report.json'),'utf8'));
  const manifest=JSON.parse(fs.readFileSync(path.join(base,'demo-delivery-manifest.json'),'utf8'));
  assert.equal(validate.validation_status,'valid_with_no_omissions');
  assert.equal(report.review_posture,'ready_for_review');
  assert.equal(validate.deterministic_pack_hash,report.deterministic_hash);
  assert.equal(manifest.deterministic_pack_hash,report.deterministic_hash);
  assert.equal(manifest.identity_assurance,'not_verified');
  assert.equal(manifest.organizational_authority,'not_established');
  assert.equal(manifest.human_first_user_witnessed,false);
  assert.equal(manifest.no_execution_authority,true);
  assert.equal(manifest.delivery_type,'SYNTHETIC_DEMO_NOT_I1_SECURE_REVIEW_BUNDLE');
  assert(!JSON.stringify(validate).includes(workspace));
  assert(!JSON.stringify(report).includes(workspace));
  return {deterministic_hash:report.deterministic_hash};
 });
 item('M3FLOW-12','HTML First Report is rendered and machine checksums verify',()=>{
  const base=path.join(workspace,'delivery');
  const html=fs.readFileSync(path.join(base,'report.html'),'utf8');
  assert.match(html,/<!doctype html|<html/i);
  assert.match(html,/review|governance|report/i);
  const index=JSON.parse(fs.readFileSync(path.join(base,'demo-checksums.json'),'utf8'));
  assert.equal(index.kind,'arch_v02x_synthetic_demo_checksum_index');
  assert.equal(index.self_digest_excluded,true);
  assert(index.files.length>=16);
  assert(index.files.every(x=>x.relative_path!=='demo-checksums.json'));
  for(const x of index.files){
   assert(!x.relative_path.includes('..'));
   const content=fs.readFileSync(path.join(base,...x.relative_path.split('/')));
   assert.equal(content.length,x.byte_length);
   assert.equal(sha(content),x.sha256);
  }
  assert.match(fs.readFileSync(path.join(base,'DELIVERY-READ-ME.txt'),'utf8'),/NOT a product Bundle/);
  return {checkedMembers:index.files.length};
 });
 item('M3FLOW-13','second COMPLETE refuses overwrite of delivered result',()=>{
  const f=path.join(workspace,'delivery','single-agent-report.json'),before=sha(fs.readFileSync(f));
  refusal(cliRun('complete'),'DELIVERY_ALREADY_EXISTS_NO_OVERWRITE');
  assert.equal(sha(fs.readFileSync(f)),before);
 });
 item('M3FLOW-14','STATUS confirms candidate delivery without release claim',()=>{
  const r=cliRun('status');
  assert.equal(r.exit,0);
  assert.equal(r.body.has_delivery,true);
  assert.equal(r.body.product_admission,'HOLD');
  assert.equal(r.body.real_user_first_report,'NOT_TESTED');
 });
 item('M3FLOW-15','PREPARE never overwrites an existing workspace',()=>{
  refusal(cliRun('prepare'),'WORKSPACE_ALREADY_EXISTS_NO_OVERWRITE');
 });
 item('M3FLOW-16','original repository synthetic source remains unchanged',()=>{
  assert.equal(hashSample(),originalHash);
  const s=spawnSync('git',['status','--porcelain=v1','--untracked-files=normal'],{
   cwd:path.resolve('.'),encoding:'utf8'
  });
  assert.equal(s.status,0);
  assert(!s.stdout.includes('arch_v02x_m3_first_report_walkthrough_synthetic'));
 });
}finally{
 // Only the test harness' own new disposable synthetic workspace.
 if(fs.existsSync(workspace))fs.rmSync(workspace,{recursive:true,force:true});
}
const failed=cases.filter(x=>x.status==='FAIL');
const git=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'});
const receipt={
 kind:'ARCH_V02X_M3_SYNTHETIC_FIRST_REPORT_USER_PATH_TEST',
 source_sha:git.status===0?git.stdout.trim():'NOT_ESTABLISHED',
 platform:process.platform,arch:process.arch,node:process.version,
 flow:'PREPARE_EXPLICIT_CONFIRM_BUILD_NATIVE_VALIDATE_REPORT_HTML_DEMO_PACKAGE',
 input_class:'FIXED_COMMITTED_SYNTHETIC_HR_ONLY',
 m3_real_source_onboarding:'NOT_ESTABLISHED',
 m3_human_witness:'NOT_TESTED',
 secure_i1_native_bundle:'NOT_RUN',
 signed_addon:'DEFERRED',
 m4_original_62:'NOT_RUN',
 m5_real_first_user:'NOT_TESTED',
 no_released_product:true,
 counts:{pass:cases.length-failed.length,fail:failed.length,not_tested:0},cases
};
console.log('ARCH_V02X_M3_FIRST_REPORT_WALKTHROUGH_TEST_RECEIPT '+JSON.stringify(receipt));
if(failed.length)process.exitCode=1;
