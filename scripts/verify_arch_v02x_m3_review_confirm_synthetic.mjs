// Separate M3RC synthetic review/confirm acceptance tests, NOT the M4 62.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root=fs.mkdtempSync(path.join(os.tmpdir(),'arch-v02x-m3-review-confirm-'));
const sample=path.join(root,'synthetic-pack');
const source=path.resolve('examples/single-agent-governance-pack/hr-self-service-agent');
const cli=path.resolve('scripts/arch_v02x_m3_review_confirm_synthetic.mjs');
const decisionFile=path.join(root,'mapping-decisions.synthetic.json');
const tests=[];
const ACK='SYNTHETIC_MAPPING_REVIEW_ONLY_NOT_IDENTITY_OR_AUTHORITY';
const env={...process.env,
  ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY:'1',
  ARCH_V02X_M3_DISCOVER_SYNTHETIC_ONLY:'1',
  ARCH_V02X_M3_REVIEW_SYNTHETIC_ONLY:'1',
  ARCH_V02X_M3_INVENTORY_FIXTURE_ROOT:root
};
function args(mode='review',file=sample,format='json',extra=[]){
 return ['--mode',mode,'--source',file,'--target-contract','first-report-pack',
  '--format',format,...extra];
}
function run(mode='review',file=sample,format='json',extra=[],envOverride={}){
 const r=spawnSync(process.execPath,[cli,...args(mode,file,format,extra)],{
  cwd:root,env:{...env,...envOverride},encoding:'utf8',timeout:35000,
  maxBuffer:8*1024*1024,windowsHide:true
 });
 if(r.error)throw r.error;
 assert.equal(r.signal,null,'Child terminated unexpectedly');
 let parsed=null;
 if(format==='json')parsed=JSON.parse(r.stdout);
 return {code:r.status,body:parsed,stdout:r.stdout,stderr:r.stderr};
}
function review(){const r=run();assert.equal(r.code,0,r.stdout+' '+r.stderr);return r;}
function confirm(extra=[],envOverride={}){
 return run('confirm',sample,'json',['--confirmation-file',decisionFile,...extra],envOverride);
}
function expectRefused(r,code){
 assert.equal(r.code,24,'Expected blocked exit 24');
 assert.equal(r.body.status,'BLOCKED');
 assert.equal(r.body.reason,code);
 assert.equal(r.body.no_confirmation_record_created,true);
 assert.equal(r.body.no_authority_expansion,true);
 noSecrets(r);
 return r;
}
function noSecrets(r){
 const s=JSON.stringify(r.body||r.stdout);
 for(const x of [root,'hr-self-service-agent','HR Self-Service Agent',
   'business_owner_hr_ops','SYNTHETIC_SECRET_DO_NOT_EXPORT','private_password',
   'Handbook Lookup Service','SYNTHETIC_PERSONAL_FULL_NAME']){
    assert(!s.includes(x),'Untrusted source/reviewer literal in result');
 }
}
function test(id,title,fn){
 try{const detail=fn();tests.push({id,title,status:'PASS',detail:detail||{}});
   console.log('PASS '+id+' '+title);}
 catch(e){tests.push({id,title,status:'FAIL',error:String(e?.stack||e).slice(0,2600)});
   console.error('FAIL '+id+' '+String(e?.message||e));}
}
function notTested(id,reason){
 tests.push({id,status:'NOT_TESTED',reason});console.log('NOT_TESTED '+id+' '+reason);
}
function request(v,makeDecisions=null){
 const decisions=v.body.mappings.map((m,i)=>{
   const decision=makeDecisions?.(m,i)||['confirm','reject','defer'][i%3];
   const basis=decision==='confirm'?'source_reviewed':
     decision==='defer'?'not_confirmed':'source_reviewed';
   return {
     mapping_item_id:m.mapping_item_id,decision,basis,
     notes:['synthetic_checked_structure']
   };
 });
 return {
   kind:'mindforge_mapping_confirmation_request_synthetic',
   version:'0.1',
   draft_fingerprint_sha256:v.body.draft_fingerprint_sha256,
   source_digest_set_sha256:v.body.source_digest_set_sha256,
   reviewer_label:'synthetic_reviewer',
   reviewer_role:'review_owner',
   synthetic_acknowledgement:ACK,
   decisions
 };
}
function save(o){fs.writeFileSync(decisionFile,JSON.stringify(o,null,2)+'\n');}
function baselineFileHash(){return fs.readFileSync(path.join(sample,'manifest.json'));}
try{
 assert(fs.existsSync(source));
 assert(fs.existsSync(cli));
 fs.writeFileSync(path.join(root,'.ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY'),
   'ARCH_V02X_SOURCE_INVENTORY_SYNTHETIC_ONLY\n',{flag:'wx'});
 fs.cpSync(source,sample,{recursive:true});

 test('M3RC-01','third synthetic gate is mandatory for REVIEW',()=>{
   expectRefused(run('review',sample,'json',[],{ARCH_V02X_M3_REVIEW_SYNTHETIC_ONLY:''}),
     'ALL_THREE_EXPLICIT_SYNTHETIC_GATES_REQUIRED');
 });
 test('M3RC-02','REVIEW JSON displays all candidate source locators without any source values',()=>{
   const v=review();
   assert.equal(v.body.kind,'ARCH_V02X_M3_SYNTHETIC_MAPPING_REVIEW');
   assert.equal(v.body.status,'REVIEW_REQUIRED_UNCONFIRMED');
   assert.equal(v.body.counts.candidates,8);
   assert.equal(v.body.counts.suggested,8);
   assert.equal(v.body.counts.ambiguous,0);
   assert.equal(v.body.counts.confirmed,0);
   assert.match(v.body.draft_fingerprint_sha256,/^sha256:[a-f0-9]{64}$/);
   assert.match(v.body.source_digest_set_sha256,/^sha256:[a-f0-9]{64}$/);
   assert(v.body.mappings.every(m=>m.requires_human_confirmation&&m.value_exported===false));
   assert(v.body.observations.every(o=>o.value_exported===false));
   assert.equal(v.body.no_confirmation_record_created,true);
   assert.equal(v.body.no_evidence_pack_generated,true);
   noSecrets(v);
   return {candidates:v.body.counts.candidates,unknownHardFields:v.body.hard_confirmation_required.length};
 });
 test('M3RC-03','REVIEW text never displays original content, owners or raw source filenames',()=>{
   const v=run('review',sample,'text');
   assert.equal(v.code,0,v.stderr);
   assert.match(v.stdout,/SYNTHETIC ONLY/);
   assert.match(v.stdout,/Draft fingerprint: sha256:/);
   assert.match(v.stdout,/mapitem_001/);
   assert.match(v.stdout,/UNCONFIRMED/);
   assert(!v.stdout.includes('business_owner_hr_ops'));
   noSecrets(v);
 });
 test('M3RC-04','CONFIRM without explicit local decision file must not start',()=>{
   expectRefused(run('confirm'), 'EXPLICIT_CONFIRMATION_FILE_REQUIRED');
 });
 test('M3RC-05','full explicit confirm/reject/defer choices produce bounded synthetic record',()=>{
   const v=review();save(request(v));
   const r=confirm();
   assert.equal(r.code,0,r.stdout+' '+r.stderr);
   assert.equal(r.body.kind,'mindforge_mapping_confirmation');
   assert.equal(r.body.version,'0.1');
   assert.equal(r.body.confirmations.length,8);
   assert.equal(r.body.counts.confirm,3);
   assert.equal(r.body.counts.reject,3);
   assert.equal(r.body.counts.defer,2);
   assert.equal(r.body.counts.unreviewed,0);
   assert.equal(r.body.counts.hard_confirmation_fields_satisfied,0);
   assert.equal(r.body.identity_assurance,'not_verified');
   assert.equal(r.body.organizational_authority,'not_established');
   assert.equal(r.body.verified_actor_identity,'NOT_ESTABLISHED');
   assert.equal(r.body.record_class,'SYNTHETIC_FIXTURE_DECISIONS_NOT_REAL_HUMAN_WITNESS');
   assert.equal(r.body.canonical_pack,'NOT_GENERATED');
   assert.equal(r.body.review_bundle,'NOT_GENERATED');
   assert.equal(r.body.no_execution_authority,true);
   assert.equal(r.body.review_draft_fingerprint_sha256,v.body.draft_fingerprint_sha256);
   noSecrets(r);
   return {counts:r.body.counts};
 });
 test('M3RC-06','all synthetic deferrals produce no silent confirmation',()=>{
   const v=review();save(request(v,()=>'defer'));
   const r=confirm();assert.equal(r.code,0);
   assert.equal(r.body.counts.confirm,0);
   assert.equal(r.body.counts.defer,8);
   assert.equal(r.body.confirmations.every(c=>c.basis==='not_confirmed'),true);
   assert.equal(r.body.business_approval,'NOT_ESTABLISHED');
   noSecrets(r);
 });
 test('M3RC-07','stale draft fingerprint rejected',()=>{
   const v=review(),q=request(v);
   q.draft_fingerprint_sha256='sha256:'+'a'.repeat(64);
   save(q);
   expectRefused(confirm(),'STALE_DRAFT_OR_SOURCE_DIGEST_REVIEW_REQUIRED');
 });
 test('M3RC-08','stale inventory digest rejected',()=>{
   const v=review(),q=request(v);
   q.source_digest_set_sha256='sha256:'+'f'.repeat(64);
   save(q);
   expectRefused(confirm(),'STALE_DRAFT_OR_SOURCE_DIGEST_REVIEW_REQUIRED');
 });
 test('M3RC-09','source changes since REVIEW invalidate prepared confirmations',()=>{
   const v=review(),q=request(v),file=path.join(sample,'manifest.json');
   const before=fs.readFileSync(file);
   save(q);
   fs.writeFileSync(file,Buffer.concat([before,Buffer.from(' ')]));
   try{expectRefused(confirm(),'STALE_DRAFT_OR_SOURCE_DIGEST_REVIEW_REQUIRED');}
   finally{fs.writeFileSync(file,before);}
 });
 test('M3RC-10','missing one explicit mapping decision fails closed',()=>{
   const q=request(review());q.decisions.pop();save(q);
   expectRefused(confirm(),'EXPLICIT_DECISION_REQUIRED_FOR_EVERY_MAPPING');
 });
 test('M3RC-11','duplicate mapping decision fails closed',()=>{
   const q=request(review());
   q.decisions[q.decisions.length-1].mapping_item_id=q.decisions[0].mapping_item_id;
   save(q);expectRefused(confirm(),'DUPLICATE_MAPPING_DECISION');
 });
 test('M3RC-12','unknown mapping ID fails closed',()=>{
   const q=request(review());q.decisions[0].mapping_item_id='mapitem_999';
   save(q);expectRefused(confirm(),'UNKNOWN_MAPPING_ITEM_ID');
 });
 test('M3RC-13','unknown decision enum is rejected before output',()=>{
   const q=request(review());q.decisions[0].decision='approve';
   save(q);expectRefused(confirm(),'UNSUPPORTED_DECISION_OR_UNREVIEWED_NOTES');
 });
 test('M3RC-14','unverified reviewer PII or arbitrary label cannot be exported',()=>{
   const q=request(review());q.reviewer_label='SYNTHETIC_PERSONAL_FULL_NAME';
   save(q);expectRefused(confirm(),'INVALID_SYNTHETIC_REVIEW_REQUEST_CONTRACT');
 });
 test('M3RC-15','unsupported reviewer role is rejected',()=>{
   const q=request(review());q.reviewer_role='chief_executive';
   save(q);expectRefused(confirm(),'INVALID_SYNTHETIC_REVIEW_REQUEST_CONTRACT');
 });
 test('M3RC-16','freeform notes and hidden payload fields cannot be exfiltrated',()=>{
   const q=request(review());q.decisions[0].notes=['SYNTHETIC_SECRET_DO_NOT_EXPORT'];
   save(q);expectRefused(confirm(),'UNSUPPORTED_DECISION_OR_UNREVIEWED_NOTES');
   const another=request(review());another.private_password='SYNTHETIC_SECRET_DO_NOT_EXPORT';
   save(another);
   expectRefused(confirm(),'INVALID_SYNTHETIC_REVIEW_REQUEST_CONTRACT');
 });
 test('M3RC-17','confirm requires explicit source-reviewed basis, not owner-declared trust',()=>{
   const q=request(review());q.decisions[0].basis='owner_declared';
   save(q);expectRefused(confirm(),'CONFIRM_REQUIRES_EXPLICIT_SOURCE_REVIEW_BASIS');
 });
 test('M3RC-18','defer retains not_confirmed basis',()=>{
   const q=request(review());q.decisions[2].basis='source_reviewed';
   save(q);expectRefused(confirm(),'DEFER_MUST_RETAIN_NOT_CONFIRMED_BASIS');
 });
 test('M3RC-19','ambiguous candidate cannot be automatically resolved by synthetic confirm',()=>{
   const profile=path.join(sample,'agent-profile.json'),before=fs.readFileSync(profile);
   const doc=JSON.parse(before.toString('utf8'));
   doc.pack_id='SYNTHETIC_SECRET_DO_NOT_EXPORT';
   fs.writeFileSync(profile,JSON.stringify(doc));
   try{
     const v=review(),q=request(v,m=>m.mapping_status==='ambiguous'?'confirm':'defer');
     assert.equal(v.body.counts.ambiguous,2);
     q.decisions.forEach((d,i)=>{d.basis=d.decision==='confirm'?'source_reviewed':'not_confirmed';});
     save(q);
     expectRefused(confirm(),'AMBIGUOUS_MAPPING_MUST_REMAIN_DEFERRED');
   }finally{fs.writeFileSync(profile,before);}
 });
 test('M3RC-20','ambiguous candidates may only be explicitly deferred without inventing resolution',()=>{
   const profile=path.join(sample,'agent-profile.json'),before=fs.readFileSync(profile);
   const doc=JSON.parse(before.toString('utf8'));
   doc.pack_id='SYNTHETIC_SECRET_DO_NOT_EXPORT';
   fs.writeFileSync(profile,JSON.stringify(doc));
   try{
     const v=review(),q=request(v,()=>'defer');
     assert.equal(v.body.counts.ambiguous,2);
     save(q);
     const r=confirm();assert.equal(r.code,0,r.stdout+' '+r.stderr);
     assert.equal(r.body.counts.confirm,0);
     assert.equal(r.body.counts.defer,9);
     assert.equal(r.body.business_approval,'NOT_ESTABLISHED');
     noSecrets(r);
   }finally{fs.writeFileSync(profile,before);}
 });
 test('M3RC-21','confirmation outside owned fixture root is rejected before read',()=>{
   const v=review(),q=request(v);save(q);
   const other=path.join(os.tmpdir(),'unexpected-reviewers','mapping-decisions.synthetic.json');
   expectRefused(run('confirm',sample,'json',['--confirmation-file',other]),
     'CONFIRMATION_FILE_NOT_IN_MARKED_SYNTHETIC_ROOT');
 });
 test('M3RC-22','decision file within selected source directory is refused',()=>{
   const v=review(),q=request(v);
   const inner=path.join(sample,'mapping-decisions.synthetic.json');
   fs.writeFileSync(inner,JSON.stringify(q));
   try{
     expectRefused(run('confirm',sample,'json',['--confirmation-file',inner]),
       'CONFIRMATION_FILE_MUST_BE_OUTSIDE_SELECTED_SOURCE');
   }finally{fs.unlinkSync(inner);}
 });
 {
   const v=review(),q=request(v);
   const real=path.join(root,'private-real-confirm.json');
   fs.writeFileSync(real,JSON.stringify(q));
   try {
     try{fs.unlinkSync(decisionFile);}catch(e){if(e.code!=='ENOENT')throw e;}
     let symlinkAvailable=true;
     try{fs.symlinkSync(real,decisionFile,'file');}
     catch(e){
       if(process.platform==='win32'&&['EPERM','EACCES','UNKNOWN'].includes(e.code))
         symlinkAvailable=false;
       else throw e;
     }
     if(!symlinkAvailable)notTested('M3RC-23','Windows runner cannot construct symlink; no false PASS');
     else test('M3RC-23','file symlink cannot substitute decision file',()=>{
       expectRefused(confirm(),'CONFIRMATION_PATH_REPARSE_REFUSED');
     });
   }finally{
     try{fs.unlinkSync(decisionFile);}catch(e){if(e.code!=='ENOENT')throw e;}
     fs.unlinkSync(real);
   }
 }
 test('M3RC-24','malformed confirmation JSON cannot create partial record',()=>{
   review();
   fs.writeFileSync(decisionFile,'{"kind":');
   expectRefused(confirm(),'CONFIRMATION_JSON_INVALID_OR_NON_UTF8');
 });
 test('M3RC-25','additional CLI mode/arguments and changed contract fail closed',()=>{
   expectRefused(run('review',sample,'json',['--confirmation-file',decisionFile]),
     'REVIEW_MODE_MUST_NOT_LOAD_CONFIRMATION');
   expectRefused(run('review',sample,'json',['--launch','admin']),
     'UNSUPPORTED_OPTION_OR_MODE');
   expectRefused(run('review',sample,'json',['--mode','confirm']),
     'DUPLICATE_SINGLETON_OPTION');
   expectRefused(run('review',sample,'json',['--target-contract','eak-v1']),
     'DUPLICATE_SINGLETON_OPTION');
 });
 test('M3RC-26','review fingerprint stable across discovery IDs and replays are not certified',()=>{
   const a=review(),b=review();
   assert.equal(a.body.draft_fingerprint_sha256,b.body.draft_fingerprint_sha256);
   assert.equal(a.body.source_digest_set_sha256,b.body.source_digest_set_sha256);
   save(request(a));
   const x=confirm(),y=confirm();
   assert.equal(x.code,0);assert.equal(y.code,0);
   assert.equal(x.body.review_draft_fingerprint_sha256,y.body.review_draft_fingerprint_sha256);
   assert(x.body.limitations.includes('no_persistent_replay_ledger_or_confirmation_idempotency'));
   assert.equal(x.body.no_independent_assurance,true);
   noSecrets(x);noSecrets(y);
 });
}finally{
 // Only this newly-created disposable CI synthetic fixture is removed.
 fs.rmSync(root,{recursive:true,force:true});
}
const fails=tests.filter(x=>x.status==='FAIL');
const counts={pass:tests.filter(x=>x.status==='PASS').length,
 fail:fails.length,not_tested:tests.filter(x=>x.status==='NOT_TESTED').length};
const r=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8',timeout:10000});
const receipt={
 kind:'ARCH_V02X_M3_REVIEW_CONFIRM_SYNTHETIC_TEST',
 source_head:r.status===0?r.stdout.trim():'UNKNOWN',
 platform:process.platform,arch:process.arch,node:process.version,
 source_class:'SYNTHETIC_ONLY',
 test_suite:'M3RC_SEPARATE_FROM_M4',
 m4_original_62:'NOT_RUN',
 m5_real_human_first_user:'NOT_TESTED',
 human_witnessed:false,
 reviewer_identity:'NOT_VERIFIED',
 organizational_authority:'NOT_ESTABLISHED',
 persisted_confirmation:'NOT_CREATED_BY_ENGINE',
 real_customer_data:'NOT_AUTHORIZED',
 guard_runtime:'UNCHANGED',
 signed_native_addon:'DEFERRED',
 counts,cases:tests
};
console.log('ARCH_V02X_M3_REVIEW_CONFIRM_TEST_RECEIPT '+JSON.stringify(receipt));
if(fails.length)process.exitCode=1;
