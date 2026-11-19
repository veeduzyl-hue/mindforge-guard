// Synthetic-only tests for ARCH v0.2.x M3 DISCOVER / Mapping Draft.
// These M3D IDs are not the M4 62 acceptance test identities.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const root=fs.mkdtempSync(path.join(os.tmpdir(),'arch-v02x-m3-discover-'));
const input=path.join(root,'synthetic-source-pack');
const source=path.resolve('examples/single-agent-governance-pack/hr-self-service-agent');
const cli=path.resolve('scripts/arch_v02x_m3_discover_draft_synthetic.mjs');
const marker='.ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const tests=[];
function run(file=input,args=null,overrides={}){
 const options=args||['--source',file,'--target-contract','first-report-pack','--format','json'];
 const r=spawnSync(process.execPath,[cli,...options],{
  cwd:root,encoding:'utf8',timeout:30000,maxBuffer:6*1024*1024,
  env:{...process.env,
   ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY:'1',
   ARCH_V02X_M3_DISCOVER_SYNTHETIC_ONLY:'1',
   ARCH_V02X_M3_INVENTORY_FIXTURE_ROOT:root,...overrides}
 });
 if(r.error)throw r.error;
 assert.equal(r.signal,null,'Unexpected child termination');
 return {code:r.status,result:JSON.parse(r.stdout),err:r.stderr};
}
function rejectFile(file,reason,args,overrides){
 const r=run(file,args,overrides);
 assert.equal(r.code,24,'Refusal must be nonzero');
 assert.equal(r.result.status,'BLOCKED');
 assert.equal(r.result.reason,reason);
 assert.equal(r.result.no_partial_mapping_export,true);
 assert.equal(r.result.no_source_copy_written,true);
 return r;
}
function check(id,title,fn){
 try {
  const evidence=fn();
  tests.push({id,title,status:'PASS',evidence:evidence||{}});
  console.log('PASS '+id+' '+title);
 } catch(e) {
  tests.push({id,title,status:'FAIL',error:String(e.stack||e).slice(0,2500)});
  console.error('FAIL '+id+' '+String(e.message||e));
 }
}
function notTested(id,reason){
 tests.push({id,status:'NOT_TESTED',reason});
 console.log('NOT_TESTED '+id+' '+reason);
}
function noLeaks(v){
 const s=JSON.stringify(v.result);
 for(const secret of [root,'hr-self-service-agent','HR Self-Service Agent',
  'Handbook Lookup Service','SYNTH_DISCOVERY_SECRET','SYNTH_HIDDEN_SECRET',
  'business_owner_hr_ops','/Users/','C:\\Users\\','node_modules']){
  assert(!s.includes(secret),'Private literal/path/source value in output');
 }
 assert.equal(v.result.no_raw_values_exported,true);
 assert.equal(v.result.no_source_copy_written,true);
 assert.equal(v.result.no_canonical_pack_generated,true);
 assert.equal(v.result.confirmation_record,'NOT_CREATED');
 assert(!s.includes('source_filename'));
}
function fileHash(f){return sha(fs.readFileSync(f));}
try {
 assert(fs.existsSync(source));
 assert(fs.existsSync(cli));
 fs.writeFileSync(path.join(root,marker),'ARCH_V02X_SOURCE_INVENTORY_SYNTHETIC_ONLY\n',{flag:'wx'});
 fs.cpSync(source,input,{recursive:true});
 check('M3D-01','no explicit discovery gate refuses before reading sources',()=>{
  rejectFile(input,'DISCOVER_EXPLICIT_SYNTHETIC_OPT_IN_REQUIRED',null,
   {ARCH_V02X_M3_DISCOVER_SYNTHETIC_ONLY:''});
 });
 check('M3D-02','First Report structural metadata draft stays unconfirmed',()=>{
  const r=run();assert.equal(r.code,0,r.err);
  const o=r.result;
  assert.equal(o.kind,'mindforge_mapping_draft');
  assert.equal(o.version,'0.1');
  assert.equal(o.status,'DRAFT_UNCONFIRMED');
  assert.equal(o.target_contract.id,'first-report-pack');
  assert.equal(o.target_contract.version,'single_agent_governance_pack_preview_v1');
  assert.equal(o.source_inventory_ref.kind,'mindforge_source_inventory');
  assert.match(o.source_inventory_ref.source_digest_set_sha256,/^sha256:[a-f0-9]{64}$/);
  assert.equal(o.counts.sources_inventory,9);
  assert.equal(o.counts.confirmed,0);
  assert.equal(o.counts.ambiguous,0);
  assert.equal(o.counts.suggested,8);
  assert(o.observations.length>o.mappings.length);
  assert(o.mappings.every(m=>m.mapping_status==='suggested'&&
    m.requires_human_confirmation===true&&m.value_exported===false));
  const targets=new Set(o.mappings.map(x=>x.target_locator));
  for(const target of ['manifest.json#/pack_id','manifest.json#/pack_version',
    'agent-profile.json#/agent_name','tools.yaml#/tools/0/tool_name',
    'tools.yaml#/tools/1/tool_name'])assert(targets.has(target));
  noLeaks(r);
  return {mappingSuggestions:o.mappings.length,observations:o.observations.length};
 });
 check('M3D-03','JSON Pointer metadata source locations and digest bindings',()=>{
  const r=run();assert.equal(r.code,0);
  const match=r.result.mappings.find(m=>m.target_locator==='manifest.json#/pack_id');
  assert(match);
  assert.equal(match.source_locator.json_pointer,'/pack_id');
  assert.match(match.source_sha256,/^sha256:[a-f0-9]{64}$/);
  assert(match.loss_notes.includes('source_semantics_unverified'));
  assert.equal(match.semantic_class,'declared');
  noLeaks(r);
 });
 check('M3D-04','YAML tool entries are syntactic suggestions, never permission',()=>{
  const r=run();assert.equal(r.code,0);
  const toolItems=r.result.mappings.filter(x=>x.target_locator.startsWith('tools.yaml#'));
  assert.equal(toolItems.length,2);
  assert(toolItems.every(x=>x.semantic_class==='declared'&&x.mapping_status==='suggested'));
  assert.equal(r.result.hard_confirmation_required.includes('allowed_actions'),true);
  assert.equal(r.result.organizational_authority,'not_established');
  assert.equal(r.result.no_tool_execution,true);
  noLeaks(r);
 });
 check('M3D-05','JSONL tool events remain observed only, no authority mapping',()=>{
  const p=path.join(input,'observed-events.jsonl');
  fs.writeFileSync(p,
   '{"event_type":"call","tool":"SYNTH_DISCOVERY_SECRET","timestamp":"2026-01-01T00:00:00Z"}\n'+
   '{"action":"synthetic_refused","tool":"SYNTH_DISCOVERY_SECRET"}\n');
  const r=run();assert.equal(r.code,0,r.err);
  const events=r.result.observations.filter(x=>x.source_kind==='jsonl');
  assert(events.length>=5);
  assert(events.every(x=>x.semantic_class==='observed'&&x.value_exported===false));
  assert(events.every(x=>x.source_locator.line_start>=1));
  assert(!r.result.mappings.some(x=>events.some(e=>e.source_id===x.source_id)));
  noLeaks(r);
  fs.unlinkSync(p);
 });
 check('M3D-06','Markdown heading discovery never exports heading text',()=>{
  const p=path.join(input,'synthetic-heading.md');
  fs.writeFileSync(p,'# SYNTH_DISCOVERY_SECRET\n\n## Section\nSynthetic private text\n');
  const r=run();assert.equal(r.code,0);
  const headings=r.result.observations.filter(x=>x.field_key==='section_heading');
  assert(headings.length>=2);
  assert(headings.every(x=>x.source_locator.line_start>0));
  assert(!JSON.stringify(r.result).includes('SYNTH_DISCOVERY_SECRET'));
  noLeaks(r);
  fs.unlinkSync(p);
 });
 check('M3D-07','critical owner and action policy never becomes confirmed',()=>{
  const r=run();assert.equal(r.code,0);
  const banned=new Set(['business_owner','technical_owner','review_owner',
    'allowed_actions','prohibited_actions','human_review_required']);
  assert(!r.result.mappings.some(x=>[...banned].some(k=>x.target_locator.includes(k))));
  assert(r.result.observations.some(x=>x.field_key==='allowed_actions'));
  assert(r.result.observations.some(x=>x.field_key==='prohibited_actions'));
  assert.equal(r.result.identity_assurance,'not_verified');
  assert.equal(r.result.confirmation_record,'NOT_CREATED');
  assert.equal(r.result.counts.confirmed,0);
  noLeaks(r);
 });
 check('M3D-08','duplicate target proposals remain ambiguous',()=>{
  const p=path.join(input,'agent-profile.json');
  const before=fs.readFileSync(p);
  const draft=JSON.parse(before.toString('utf8'));
  draft.pack_id='SYNTH_DISCOVERY_SECRET';
  fs.writeFileSync(p,JSON.stringify(draft));
  try{
   const r=run();assert.equal(r.code,0,r.err);
   const ambiguous=r.result.mappings.filter(x=>x.target_locator==='manifest.json#/pack_id');
   assert.equal(ambiguous.length,2);
   assert(ambiguous.every(x=>x.mapping_status==='ambiguous'&&
      x.loss_notes.includes('multiple_candidates_for_target')));
   assert.equal(r.result.counts.ambiguous,2);
   noLeaks(r);
  }finally{fs.writeFileSync(p,before);}
 });
 check('M3D-09','malformed JSON stops without partial draft or values',()=>{
  const p=path.join(input,'invalid-structure.json');
  fs.writeFileSync(p,'{"pack_id": "SYNTH_DISCOVERY_SECRET",');
  const r=rejectFile(input,'JSON_STRUCTURAL_PARSE_FAILED');
  assert(!JSON.stringify(r.result).includes('SYNTH_DISCOVERY_SECRET'));
  fs.unlinkSync(p);
 });
 check('M3D-10','malformed JSONL stops without partial draft or values',()=>{
  const p=path.join(input,'events-malformed.jsonl');
  fs.writeFileSync(p,'{"tool":"SYNTH_DISCOVERY_SECRET"}\n{"invalid":');
  rejectFile(input,'JSONL_LINE_PARSE_FAILED');
  fs.unlinkSync(p);
 });
 check('M3D-11','event resource cap fails closed at more than 64 entries',()=>{
  const p=path.join(input,'events-excess.jsonl');
  fs.writeFileSync(p,Array.from({length:65},()=>JSON.stringify({})).join('\n'));
  rejectFile(input,'JSONL_EVENT_COUNT_LIMIT');
  fs.unlinkSync(p);
 });
 check('M3D-12','source digest output repeatable and source remains unchanged',()=>{
  const p=path.join(input,'manifest.json');
  const before=fileHash(p);
  const a=run(),b=run();
  assert.equal(a.code,0);assert.equal(b.code,0);
  const canonical=x=>JSON.stringify({
   observations:x.observations,mappings:x.mappings,
   counts:x.counts,inventoryDigest:x.source_inventory_ref.source_digest_set_sha256
  });
  assert.equal(canonical(a.result),canonical(b.result));
  assert.equal(fileHash(p),before);
  noLeaks(a);noLeaks(b);
 });
 check('M3D-13','opaque/unknown files remain inventory-only, not discoveries',()=>{
  const pdf=path.join(input,'opaque.pdf'),unknown=path.join(input,'opaque.xyz');
  fs.writeFileSync(pdf,Buffer.from([0,255,12,4]));
  fs.writeFileSync(unknown,Buffer.from('SYNTH_DISCOVERY_SECRET'));
  const r=run();assert.equal(r.code,0);
  assert.equal(r.result.counts.sources_inventory,11);
  const newIds=new Set(['source_010','source_011']); // ids may shift; use source count instead.
  assert(r.result.observations.every(x=>x.source_kind!=='binary'&&x.source_kind!=='unknown'));
  assert(r.result.mappings.every(x=>x.target_locator&&!newIds.has(x.target_locator)));
  noLeaks(r);
  fs.unlinkSync(pdf);fs.unlinkSync(unknown);
 });
 check('M3D-14','unauthorized sources, modes and arguments refuse',()=>{
  rejectFile(path.resolve(os.tmpdir(),'outside-root-guard-test'),'INVENTORY_PREFLIGHT_REFUSED');
  rejectFile(input,'UNSUPPORTED_CONTRACT_OR_FORMAT',
   ['--source',input,'--target-contract','eak-v1','--format','json']);
  rejectFile(input,'DUPLICATE_OPTION',
   ['--source',input,'--source',input,'--target-contract','first-report-pack','--format','json']);
 });
 check('M3D-15','hidden private and key source excluded before discovery',()=>{
  const secret=path.join(input,'.env.hidden');
  fs.writeFileSync(secret,'SYNTH_HIDDEN_SECRET=never-output');
  const r=run();assert.equal(r.code,0);
  noLeaks(r);
  rejectFile(secret,'INVENTORY_PREFLIGHT_REFUSED');
  fs.unlinkSync(secret);
 });
 check('M3D-16','binary or opaque alone cannot be silently mapped',()=>{
  const p=path.join(input,'only.pdf');
  fs.writeFileSync(p,Buffer.from([0,255,1]));
  rejectFile(p,'INVENTORY_PREFLIGHT_REFUSED');
  fs.unlinkSync(p);
 });
 check('M3D-17','invalid UTF-8 text refused without data export',()=>{
  const p=path.join(input,'malformed.md');
  fs.writeFileSync(p,Buffer.from([0xff,0xfe,0xfd]));
  rejectFile(input,'STRUCTURAL_SOURCE_INVALID_UTF8');
  fs.unlinkSync(p);
 });
 check('M3D-18','absolute source path in output and raw copied source forbidden',()=>{
  const r=run();assert.equal(r.code,0);
  noLeaks(r);
  assert.equal(r.result.no_network_access,true);
  assert.equal(r.result.no_review_bundle_generated,true);
  assert.equal(r.result.no_canonical_pack_generated,true);
  assert.equal(r.result.counts.confirmed,0);
 });
 const link=path.join(input,'symlink-source.json');
 try {
  fs.symlinkSync(path.join(root,'outside-source.json'),link,'file');
  check('M3D-19','symlink entry refuses through existing Inventory gate',()=>{
   rejectFile(input,'INVENTORY_PREFLIGHT_REFUSED');
   fs.unlinkSync(link);
  });
 } catch(e){
  if(process.platform==='win32'&&['EPERM','EACCES','UNKNOWN'].includes(e.code)){
   notTested('M3D-19','Windows runner lacks symlink fixture privilege');
  }else throw e;
 }
}finally{
 fs.rmSync(root,{recursive:true,force:true});
}
const failures=tests.filter(x=>x.status==='FAIL');
const counts={pass:tests.filter(x=>x.status==='PASS').length,
 fail:failures.length,not_tested:tests.filter(x=>x.status==='NOT_TESTED').length};
const git=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8',timeout:10000});
const receipt={kind:'ARCH_V02X_M3_DISCOVER_DRAFT_SYNTHETIC_TEST',
 tested_head:git.status===0?git.stdout.trim():'SOURCE_UNVERIFIED',
 platform:process.platform,arch:process.arch,node:process.version,
 scope:'DISCOVER_AND_DRAFT_ONLY',data_class:'SYNTHETIC_ONLY',
 officialM4_62:'NOT_RUN',m5_human_first_user:'NOT_TESTED',
 confirmation_record:'NOT_CREATED',
 canonical_pack:'NOT_GENERATED',review_bundle:'NOT_GENERATED',
 publicGuardCli:'UNCHANGED',customerData:'NOT_AUTHORIZED',
 signedAddon:'DEFERRED_NOT_ESTABLISHED',
 counts,cases:tests};
console.log('ARCH_V02X_M3_DISCOVER_DRAFT_TEST_RECEIPT '+JSON.stringify(receipt));
if(failures.length)process.exitCode=1;
