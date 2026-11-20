// New SRC-TXB-* bounded transition-bridge cases; NOT original M4 62 cases.
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
const BRIDGE=path.resolve('scripts/arch_v02x_strict_source_bridge_synthetic.mjs');
const GUARD=path.resolve('packages/guard/bin/guard.mjs');
const tests=[],baseEnv={...process.env,
 ARCH_V02X_STRICT_SOURCE_BRIDGE_SYNTHETIC_ONLY:'1',
 ARCH_V02X_P0_SOURCE_ADMISSION_SYNTHETIC_ONLY:'1'};
function call(file,args,env={}){
 const r=spawnSync(process.execPath,[file,...args],{
  cwd:path.resolve('.'),encoding:'utf8',windowsHide:true,timeout:70000,
  maxBuffer:8*1024*1024,env:{...baseEnv,...env}
 });
 if(r.error||r.signal)throw Error('CHILD_CRASH_OR_TIMEOUT');
 let json;try{json=JSON.parse(r.stdout)}catch{json=null}
 return {status:r.status,json,stderr:r.stderr,stdout:r.stdout};
}
const arg=digest=>['--source',PACK,'--fixture-root',ROOT,
 '--source-contract','strict-v0.1-synthetic','--format','json',
 '--expected-source-digest',digest];
const hashBuffer=b=>crypto.createHash('sha256').update(b).digest('hex');
function digest(){
 const r=call(GATE,['--pack',PACK,'--fixture-root',ROOT,'--format','json']);
 assert.equal(r.status,0,'Preflight must admit fixed sample');
 return r.json.source_content_set_sha256;
}
function blocked(r,reason){
 assert.equal(r.status,24,JSON.stringify(r.json));
 assert.equal(r.json.status,'BLOCKED');
 assert.equal(r.json.reason,reason);
 assert.equal(r.json.no_partial_success,true);
 assert(!r.stdout.includes(ROOT));
}
function item(id,title,fn){
 try{const data=fn()||{};
  if(data.fixture_unavailable){tests.push({id,title,status:'NOT_TESTED',reason:'WINDOWS_SYMLINK_FIXTURE_UNAVAILABLE'});console.log('NOT_TESTED '+id);return;}
  tests.push({id,title,status:'PASS',evidence:data});console.log('PASS '+id)}
 catch(e){tests.push({id,title,status:'FAIL',error_type:e?.name||'Error'});
  console.error('FAIL '+id+' '+String(e?.message||e));}
}
function addAndCheck(name,data,reason='STRICT_SOURCE_ADMISSION_PREFLIGHT_BLOCKED'){
 const f=path.join(PACK,name);
 fs.writeFileSync(f,data);
 try{blocked(call(BRIDGE,arg(currentDigest)),reason)}finally{fs.unlinkSync(f)}
}
let currentDigest;
try{
 fs.mkdirSync(ROOT);
 fs.writeFileSync(path.join(ROOT,'.ARCH_V02X_P0_SYNTHETIC_SOURCE_ONLY'),
  'ARCH_V02X_P0_SOURCE_ADMISSION_FIXED_SYNTHETIC_ONLY\n');
 fs.cpSync(SAMPLE,PACK,{recursive:true});
 currentDigest=digest();
 item('SRC-TXB-01','Default-off no processing',()=>{
  blocked(call(BRIDGE,arg(currentDigest),{ARCH_V02X_STRICT_SOURCE_BRIDGE_SYNTHETIC_ONLY:''}),
   'EXPLICIT_TWO_SYNTHETIC_GATES_REQUIRED');
 });
 item('SRC-TXB-02','Exact fixed synthetic source to legacy Pack preview',()=>{
  const r=call(BRIDGE,arg(currentDigest));
  assert.equal(r.status,0,JSON.stringify(r.json));
  assert.equal(r.json.status,'VALIDATED_BOUNDED_SYNTHETIC_NOT_PRODUCTION_ADMITTED');
  assert.equal(r.json.legacy_validation_status,'valid_with_no_omissions');
  assert.equal(r.json.source_files_count,11);
  assert.equal(r.json.m4_original_62,'NOT_RUN');
  assert.equal(r.json.real_customer_data,'NOT_AUTHORIZED');
  assert.equal(r.json.native_legacy_pack_hash,call(GUARD,
    ['pack','validate','--pack',PACK,'--preview','--json']).json?.deterministic_pack_hash);
  assert(!r.stdout.includes(ROOT));
  return{native_hash_matches:true};
 });
 item('SRC-TXB-03','Exact pinned source digest required',()=>{
  blocked(call(BRIDGE,arg('sha256:'+'f'.repeat(64))),'PINNED_SOURCE_SET_DIGEST_MISMATCH');
 });
 item('SRC-TXB-04','Unversioned/unsupported route refuses',()=>{
  const altered=arg(currentDigest);
  altered[altered.indexOf('strict-v0.1-synthetic')]='strict-v0.2';
  blocked(call(BRIDGE,altered),'UNSUPPORTED_CONTRACT_VERSION_OR_FORMAT');
 });
 item('SRC-TXB-05','No implicit opt-in from previous source gate',()=>{
  blocked(call(BRIDGE,arg(currentDigest),{ARCH_V02X_P0_SOURCE_ADMISSION_SYNTHETIC_ONLY:''}),
   'EXPLICIT_TWO_SYNTHETIC_GATES_REQUIRED');
 });
 item('SRC-TXB-06','Hidden file refused before native parser',()=>{
  addAndCheck('.env.synthetic','SYNTH_NOT_REAL_SECRET');
 });
 item('SRC-TXB-07','Opaque binary refused before native parser',()=>{
  addAndCheck('unrelated-opaque.bin',Buffer.from([0,255,1]));
 });
 item('SRC-TXB-08','Unknown extra text refused',()=>{
  addAndCheck('unexpected.txt','SYNTHETIC_ONLY');
 });
 item('SRC-TXB-09','Source changed after digest pin -> stale source cannot validate',()=>{
  const f=path.join(PACK,'manifest.json'),old=fs.readFileSync(f);
  fs.appendFileSync(f,' ');
  try{blocked(call(BRIDGE,arg(currentDigest)),'PINNED_SOURCE_SET_DIGEST_MISMATCH')}
  finally{fs.writeFileSync(f,old)}
 });
 item('SRC-TXB-10','Symlinked allowlisted source prevents preview',()=>{
  const file=path.join(PACK,'evidence','sample-output.json');
  const original=fs.readFileSync(file),external=path.join(ROOT,'external-synthetic.json');
  fs.writeFileSync(external,'{"synthetic":"not customer"}');
  fs.unlinkSync(file);
  try{
    try{fs.symlinkSync(external,file,'file')}
    catch(e){
      if(process.platform==='win32'&&['EPERM','EACCES','UNKNOWN'].includes(e.code)){
        return{fixture_unavailable:true,actual_rejection:'NOT_TESTED'};
      }
      throw e;
    }
    blocked(call(BRIDGE,arg(currentDigest)),'STRICT_SOURCE_ADMISSION_PREFLIGHT_BLOCKED');
  }finally{fs.rmSync(file,{force:true});fs.writeFileSync(file,original);}
 });
 item('SRC-TXB-11','Absolute root escape refused',()=>{
  const p=path.join(os.tmpdir(),'external-unadmitted-source-test');
  const a=arg(currentDigest);a[1]=p;
  blocked(call(BRIDGE,a),'STRICT_SOURCE_ADMISSION_PREFLIGHT_BLOCKED');
 });
 item('SRC-TXB-12','Same fixed baseline unaffected after all negatives',()=>{
  assert.equal(digest(),currentDigest);
  const r=call(BRIDGE,arg(currentDigest));
  assert.equal(r.status,0);
  assert.equal(r.json.legacy_validation_status,'valid_with_no_omissions');
  const baseline=call(GUARD,['pack','validate','--pack',PACK,'--preview','--json']);
  assert.equal(baseline.status,0);
  assert.equal(r.json.native_legacy_pack_hash,baseline.json.deterministic_pack_hash);
  assert.equal(r.json.no_source_values_or_host_paths_exported,true);
  return{same_pack_hash:true};
 });
}finally{fs.rmSync(ROOT,{recursive:true,force:true});}
const failed=tests.filter(x=>x.status==='FAIL');
const head=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8',timeout:10000});
const receipt={kind:'ARCH_V02X_STRICT_V0_1_SYNTHETIC_SOURCE_BRIDGE_TEST',
 source_head:head.status===0?head.stdout.trim():'UNVERIFIED',
 mode:'EXPLICIT_OPT_IN_SYNTHETIC_ONLY',
 frozen_legacy_parser:'UNCHANGED',
 new_public_source_cli:'NOT_IMPLEMENTED',
 user_or_customer_data:'NOT_AUTHORIZED',
 m4_original_62:'NOT_RUN',
 m5_independent_first_user:'NOT_TESTED',
 synthetic_test_results:{pass:tests.filter(x=>x.status==='PASS').length,fail:failed.length,
  not_tested:tests.filter(x=>x.status==='NOT_TESTED').length},
 cases:tests};
console.log('ARCH_STRICT_V01_BRIDGE_TEST_RECEIPT '+JSON.stringify(receipt));
if(failed.length)process.exitCode=1;
