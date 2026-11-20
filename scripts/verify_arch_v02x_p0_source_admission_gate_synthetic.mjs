// P0 source admission experiment: synthetic-only negative and compatibility tests.
// These P0G IDs do NOT close any original M4 62 cases. Legacy parser unchanged.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const ROOT=path.join(os.tmpdir(),'arch-v02x-p0-owned-'+crypto.randomUUID().replaceAll('-',''));
const PACK=path.join(ROOT,'synthetic-pack');
const SAMPLE=path.resolve('examples/single-agent-governance-pack/hr-self-service-agent');
const GATE=path.resolve('scripts/arch_v02x_source_admission_gate_synthetic.mjs');
const LEGACY=path.resolve('packages/guard/bin/guard.mjs');
const results=[];
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function run(which=PACK,optin='1'){
 const x=spawnSync(process.execPath,[GATE,'--pack',which,
   '--fixture-root',ROOT,'--format','json'],{
   encoding:'utf8',timeout:25000,windowsHide:true,
   env:{...process.env,ARCH_V02X_P0_SOURCE_ADMISSION_SYNTHETIC_ONLY:optin}
 });
 if(x.error)throw x.error;
 return{exit:x.status,data:JSON.parse(x.stdout),stderr:x.stderr};
}
function reject(reason,which=PACK){
 const r=run(which);
 assert.equal(r.exit,24,JSON.stringify(r.data));
 assert.equal(r.data.reason,reason);
 assert.equal(r.data.status,'BLOCKED');
 assert.equal(r.data.no_source_copy_written,true);
 assert(!JSON.stringify(r.data).includes(ROOT));
}
function check(id,title,fn){
 try{const info=fn()||{};results.push({id,status:'PASS',title,info});console.log('PASS '+id);}
 catch(e){results.push({id,status:'FAIL',title,error_type:e?.name||'Error'});
  console.error('FAIL '+id+' '+String(e?.message||e));}
}
function notTested(id,why){
 results.push({id,status:'NOT_TESTED',reason:why});console.log('NOT_TESTED '+id);}
try{
 fs.mkdirSync(ROOT);
 fs.writeFileSync(path.join(ROOT,'.ARCH_V02X_P0_SYNTHETIC_SOURCE_ONLY'),
   'ARCH_V02X_P0_SOURCE_ADMISSION_FIXED_SYNTHETIC_ONLY\n');
 fs.cpSync(SAMPLE,PACK,{recursive:true});
 const manifest=path.join(PACK,'manifest.json');
 const before=sha(manifest);
 check('P0G-01','opt-in default-deny',()=>{
  const r=run(PACK,'');assert.equal(r.exit,24);assert.equal(r.data.reason,'EXPLICIT_SYNTHETIC_ONLY_GATE_REQUIRED');
 });
 check('P0G-02','fixed canonical HR sample allowlisted',()=>{
  const r=run();assert.equal(r.exit,0,JSON.stringify(r.data));
  assert.equal(r.data.file_count,11);
  assert.match(r.data.source_content_set_sha256,/^sha256:[0-9a-f]{64}$/);
  assert.equal(r.data.general_real_source_admission,'NOT_AUTHORIZED');
  assert.equal(r.data.original_m4_62,'NOT_RUN');
  assert(!JSON.stringify(r.data).includes(ROOT));
  return{count:r.data.file_count};
 });
 check('P0G-03','legacy parser hash/exit unchanged for valid Pack',()=>{
  const r=spawnSync(process.execPath,[LEGACY,'pack','validate','--pack',PACK,'--preview','--json'],
    {encoding:'utf8',timeout:40000});
  assert.equal(r.status,0);
  const v=JSON.parse(r.stdout);
  assert.equal(v.validation_status,'valid_with_no_omissions');
  assert.equal(sha(manifest),before);
  return {legacy_status:v.validation_status,legacy_exit:r.status};
 });
 check('P0G-04','hidden .env extra file explicitly rejected',()=>{
  const f=path.join(PACK,'.env.synthetic');fs.writeFileSync(f,'SYNTHETIC_NO_REAL_SECRET');
  try{reject('SOURCE_EXTRA_HIDDEN_BINARY_OR_UNRELATED_ENTRY');}
  finally{fs.unlinkSync(f);}
 });
 check('P0G-05','binary extra file explicitly rejected before read',()=>{
  const f=path.join(PACK,'opaque-binary.bin');fs.writeFileSync(f,Buffer.from([0,255,0]));
  try{reject('SOURCE_EXTRA_HIDDEN_BINARY_OR_UNRELATED_ENTRY');}
  finally{fs.unlinkSync(f);}
 });
 check('P0G-06','unrelated text rejected, not automatically hashed',()=>{
  const f=path.join(PACK,'arbitrary-note.txt');fs.writeFileSync(f,'SYNTHETIC');
  try{reject('SOURCE_EXTRA_HIDDEN_BINARY_OR_UNRELATED_ENTRY');}
  finally{fs.unlinkSync(f);}
 });
 check('P0G-07','nested arbitrary evidence directory rejected',()=>{
  const d=path.join(PACK,'evidence','nested');fs.mkdirSync(d);
  try{reject('SOURCE_EXTRA_HIDDEN_BINARY_OR_UNRELATED_ENTRY');}
  finally{fs.rmdirSync(d);}
 });
 check('P0G-08','required file missing refuses the source',()=>{
  const p=path.join(PACK,'manifest.json'),save=fs.readFileSync(p);
  fs.unlinkSync(p);
  try{reject('REQUIRED_CANONICAL_SOURCE_MISSING');}
  finally{fs.writeFileSync(p,save);}
 });
 check('P0G-09','known canonical field mutation yields distinct content fingerprint',()=>{
  const one=run();assert.equal(one.exit,0);
  const old=fs.readFileSync(manifest);
  fs.appendFileSync(manifest,' ');
  try{const next=run();assert.equal(next.exit,0);assert.notEqual(one.data.source_content_set_sha256,next.data.source_content_set_sha256);}
  finally{fs.writeFileSync(manifest,old);}
  assert.equal(sha(manifest),before);
 });
 check('P0G-10','absolute outside synthetic fixture never admitted',()=>{
  const outside=path.resolve(os.tmpdir(),'out-of-scope-customer-must-not-be-read');
  reject('SOURCE_OUTSIDE_MARKED_ROOT',outside);
 });
 const link=path.join(PACK,'evidence','sample-output.json');
 const external=path.join(ROOT,'external-controlled-synthetic.json');
 fs.writeFileSync(external,'{"source":"SYNTHETIC_ONLY"}');
 const oldSample=fs.readFileSync(link);
 fs.unlinkSync(link);
 let canLink=true;
 try{fs.symlinkSync(external,link,'file');}
 catch(e){
  if(process.platform==='win32'&&['EPERM','EACCES','UNKNOWN'].includes(e.code))canLink=false;
  else throw e;
 }
 if(!canLink){
  fs.writeFileSync(link,oldSample);
  notTested('P0G-11','Windows hosted runner cannot create symlink fixture');
 }else check('P0G-11','allowlisted evidence file symlink to outside root denied',()=>{
  try{reject('SOURCE_SYMLINK_OR_REPARSE_DENY');}
  finally{fs.unlinkSync(link);fs.writeFileSync(link,oldSample);}
 });
 const evidence=path.join(PACK,'evidence');
 const relocated=path.join(ROOT,'relocated-controlled-evidence');
 let canJunction=true;
 fs.renameSync(evidence,relocated);
 try{fs.symlinkSync(relocated,evidence,process.platform==='win32'?'junction':'dir');}
 catch(e){
  if(process.platform==='win32'&&['EPERM','EACCES','UNKNOWN'].includes(e.code))canJunction=false;
  else throw e;
 }
 if(!canJunction){
  fs.renameSync(relocated,evidence);
  notTested('P0G-12','Windows junction/symlink fixture unavailable');
 }else check('P0G-12','allowlisted evidence directory junction/reparse refused',()=>{
  try{reject('SOURCE_SYMLINK_OR_REPARSE_DENY');}
  finally{fs.unlinkSync(evidence);fs.renameSync(relocated,evidence);}
 });
 check('P0G-13','hardlinked canonical Pack file rejected by identity link-count',()=>{
  const dst=path.join(ROOT,'duplicate-hardlink-outside-pack.json');
  fs.linkSync(manifest,dst);
  try{reject('SOURCE_NOT_UNIQUE_REGULAR_FILE');}
  finally{fs.unlinkSync(dst);}
  assert.equal(run().exit,0);
 });
 check('P0G-14','per-file size limit and no partial output',()=>{
  const p=path.join(PACK,'README.md'),old=fs.readFileSync(p);
  fs.writeFileSync(p,Buffer.alloc(4*1024*1024+1,0));
  try{reject('SOURCE_FILE_LIMIT');}finally{fs.writeFileSync(p,old);}
 });
 check('P0G-15','legacy raw Pack parser deliberately remains separate from strict candidate',()=>{
  const p=path.join(PACK,'unused.bin');fs.writeFileSync(p,Buffer.from([0,255,0]));
  try{
   reject('SOURCE_EXTRA_HIDDEN_BINARY_OR_UNRELATED_ENTRY');
   const r=spawnSync(process.execPath,[LEGACY,'pack','validate','--pack',PACK,'--preview','--json'],
     {encoding:'utf8',timeout:40000});
   assert.equal(r.status,0);
   assert.equal(JSON.parse(r.stdout).validation_status,'valid_with_no_omissions');
   return{legacy_current_behavior:'ACCEPTS_EXTRA_SYNTHETIC_BINARY',
     source_gate_current_behavior:'DENIES',
     original_m4_case:'NOT_RUN'};
  }finally{fs.unlinkSync(p);}
 });
}finally{
 fs.rmSync(ROOT,{recursive:true,force:true});
}
const fail=results.filter(x=>x.status==='FAIL');
const counts={pass:results.filter(x=>x.status==='PASS').length,
 fail:fail.length,not_tested:results.filter(x=>x.status==='NOT_TESTED').length};
const head=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'});
const receipt={
 kind:'ARCH_V02X_P0_SYNTHETIC_SOURCE_ADMISSION_REGRESSION',
 tested_head:head.status===0?head.stdout.trim():'NOT_ESTABLISHED',
 platform:process.platform,arch:process.arch,node:process.version,
 original_pack_parser:'UNCHANGED',admission_gate:'DEFAULT_OFF_SYNTHETIC_ONLY',
 full_m4_original_62:'NOT_RUN',
 m5_real_user:'NOT_TESTED',customer_evidence:'NOT_AUTHORIZED',
 source_admission_product:'NOT_IMPLEMENTED',counts,cases:results
};
console.log('ARCH_V02X_P0_SOURCE_ADMISSION_TEST_RECEIPT '+JSON.stringify(receipt));
if(fail.length)process.exitCode=1;
