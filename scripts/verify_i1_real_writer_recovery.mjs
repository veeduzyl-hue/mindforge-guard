// I1-REAL-WRITER-RECOVERY-02: actual Writer + read-only inspector test
// against disposable synthetic First Report Packs. No production files.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {inspectI1ReviewRecovery} from '../packages/guard/src/cli/review_recovery_readonly.mjs';

const root=fs.mkdtempSync(path.join(os.tmpdir(),'i1-real-writer-recovery-'));
const canonical=path.resolve('examples/single-agent-governance-pack/hr-self-service-agent');
const cli=path.resolve('packages/guard/bin/guard.mjs');
const child=path.resolve('scripts/i1_real_writer_recovery_crash_child.mjs');
const inspector=path.resolve('scripts/i1_real_writer_recovery_inspect.mjs');
fs.writeFileSync(path.join(root,'.I1_RECOVERY_SYNTHETIC_ONLY'),'ALLOW_TEST_ONLY\n',{flag:'wx'});
const cases=[];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function make(tag){
  const pack=path.join(root,'pack-'+tag);
  fs.cpSync(canonical,pack,{recursive:true});
  const name='bundle-'+tag;
  return {pack,name,out:path.join(root,name)};
}
function invoke(f){
  const r=spawnSync(process.execPath,[cli,'review','--pack',f.pack,'--out',f.out,'--format','json'],
    {cwd:root,encoding:'utf8',timeout:90000,maxBuffer:9e6,windowsHide:true});
  if(r.error)throw r.error;
  return r;
}
function inspect(name,prior=null){
  return inspectI1ReviewRecovery({parent:root,outputName:name,priorReceipt:prior});
}
function completed(tag){
  const f=make(tag),r=invoke(f);
  assert.equal(r.status,0,r.stderr);
  const reading=inspect(f.name);
  assert.equal(reading.final.status,'COMPLETE_BUNDLE_AT_INSPECTION_ONLY');
  assert(reading.receiptCandidate);
  return {f,reading,receipt:reading.receiptCandidate};
}
function childRun(f,point){
  const r=spawnSync(process.execPath,[child,f.pack,f.out,point],{
    cwd:path.resolve('.'),encoding:'utf8',timeout:80000,maxBuffer:9e6,windowsHide:true,
    env:{...process.env,I1_RECOVERY_SYNTHETIC_CRASH:'1'}});
  if(r.error)throw r.error;
  assert((r.stdout||'').includes('I1_REAL_RECOVERY_CHECKPOINT '+point),
    'injection checkpoint not reached: '+point+' '+String(r.stderr).slice(0,180));
  return r;
}
async function one(id,description,fn){
  try{
    const evidence=await fn();
    cases.push({id,description,status:'PASS_BOUNDED',evidence:evidence||{}});
    console.log('PASS',id,JSON.stringify(evidence||{}).slice(0,270));
  }catch(e){
    cases.push({id,description,status:'FAIL',error:String(e.stack||e).slice(0,2300)});
    console.error('FAIL',id,String(e.message||e).slice(0,350));
  }
}
function notRun(id,reason){
  cases.push({id,status:'NOT_TESTED',reason});
  console.log('NOT_TESTED',id);
}
await one('REC2-01','actual completed output checksum/manifest verified at inspection',()=>{
 const {f,reading}=completed('complete');
 assert.equal(reading.stageCount,0);
 assert.equal(reading.final.integrity.indexArtifactCount,5);
 assert.equal(reading.overallReviewRequired,false);
 assert.equal(reading.constraints.noAutomaticDeletion,true);
 return {status:reading.final.status,indexed:5};
});
await one('REC2-02','caller-provided observation receipt matches complete bundle',()=>{
 const {f,receipt}=completed('prior');
 const r=inspect(f.name,receipt);
 assert.equal(r.final.status,'COMPLETE_BUNDLE_MATCHES_UNAUTHENTICATED_PRIOR_AT_INSPECTION');
 assert.equal(r.receiptCandidate.unauthenticated,true);
 assert.equal(r.receiptCandidate.canProveFuturePathOrImmutability,false);
 return {status:r.final.status,receiptUnauthenticated:true};
});
await one('REC2-03','missing target does not imply no commit',()=>{
 const r=inspect('bundle-never-observed');
 assert.equal(r.final.status,'NO_FINAL_OUTPUT_OBSERVED_OUTCOME_UNKNOWN');
 assert.equal(r.overallReviewRequired,true);
 return {status:r.final.status};
});
await one('REC2-04','empty incomplete stage remains for manual review',()=>{
 const name='bundle-empty';
 const stage=fs.mkdtempSync(path.join(root,'.guard-i1-partial-'+name+'-'));
 const r=inspect(name);
 assert.equal(r.stages[0].status,'EMPTY_STAGE_REVIEW_REQUIRED');
 assert.equal(r.stages[0].autoCleanupPerformed,false);
 assert(fs.existsSync(stage));
 return {status:r.stages[0].status};
});
await one('REC2-05','retained INCOMPLETE marker observed but not deleted',()=>{
 const name='bundle-incomplete';
 const stage=fs.mkdtempSync(path.join(root,'.guard-i1-partial-'+name+'-'));
 fs.writeFileSync(path.join(stage,'INCOMPLETE.json'),'{"status":"INCOMPLETE"}');
 const r=inspect(name);
 assert.equal(r.stages[0].status,'INCOMPLETE_MARKER_REVIEW_REQUIRED');
 assert(fs.existsSync(stage));
 return {status:r.stages[0].status};
});
await one('REC2-06','legacy raw copy is CRITICAL and never opened',()=>{
 const name='bundle-legacy';
 const stage=fs.mkdtempSync(path.join(root,'.guard-i1-partial-'+name+'-'));
 fs.mkdirSync(path.join(stage,'.private-source'));
 fs.writeFileSync(path.join(stage,'.private-source','SYNTHETIC_FAKE_SECRET'),'DO_NOT_OPEN_OR_DELETE');
 const r=inspect(name);
 assert.equal(r.stages[0].status,'LEGACY_RAW_SOURCE_COPY_CRITICAL');
 assert(fs.existsSync(path.join(stage,'.private-source','SYNTHETIC_FAKE_SECRET')));
 return {status:r.stages[0].status};
});
await one('REC2-07','derived stage remains review-required',()=>{
 const name='bundle-derived';
 const stage=fs.mkdtempSync(path.join(root,'.guard-i1-partial-'+name+'-'));
 fs.writeFileSync(path.join(stage,'diagnostics.json'),'{"synthetic":true}');
 const r=inspect(name);
 assert.equal(r.stages[0].status,'UNCOMMITTED_STAGE_REVIEW_REQUIRED');
 assert.equal(r.stages[0].derivedDataMayBeSensitive,true);
 return {status:r.stages[0].status};
});
await one('REC2-08','prior receipt and now absent output remain uncertain',()=>{
 const {f,receipt}=completed('removed');
 const moved=path.join(root,'relocated-original');
 fs.renameSync(f.out,moved);
 const r=inspect(f.name,receipt);
 assert.equal(r.final.status,'PRIOR_RECEIPT_FINAL_OUTPUT_ABSENT_REVIEW_REQUIRED');
 assert(fs.existsSync(path.join(moved,'review-manifest.json')));
 return {status:r.final.status};
});
await one('REC2-09','same bytes different directory identity detected',()=>{
 const {f,receipt}=completed('decoy');
 const moved=path.join(root,'relocated-decoy-original');
 fs.renameSync(f.out,moved);
 fs.cpSync(moved,f.out,{recursive:true});
 const r=inspect(f.name,receipt);
 assert.equal(r.final.status,'LOCATOR_IDENTITY_CHANGED_REVIEW_REQUIRED');
 assert.equal(r.final.integrity.indexArtifactCount,5);
 return {status:r.final.status,bundleBytesValid:true};
});
await one('REC2-10','corrupted file checksum detected without repair',()=>{
 const {f}=completed('tampered');
 fs.appendFileSync(path.join(f.out,'review-summary.md'),'\nSYNTHETIC_MUTATION');
 const r=inspect(f.name);
 assert.equal(r.final.status,'PUBLISHED_INTEGRITY_UNVERIFIED_OWNER_REVIEW');
 assert.equal(r.overallReviewRequired,true);
 return {status:r.final.status,reason:r.final.inspectionError};
});
await one('REC2-11','unsolicited extra file is not silently accepted',()=>{
 const {f}=completed('extra');
 fs.writeFileSync(path.join(f.out,'.env'),'SYNTHETIC_DO_NOT_SHARE');
 const r=inspect(f.name);
 assert.equal(r.final.status,'PUBLISHED_INTEGRITY_UNVERIFIED_OWNER_REVIEW');
 return {status:r.final.status};
});
await one('REC2-12','fully rehashed edits still detected against prior receipt',()=>{
 const {f,receipt}=completed('rehash');
 const summary=path.join(f.out,'review-summary.md'),manifest=path.join(f.out,'review-manifest.json');
 const idx=path.join(f.out,'bundle-checksums.json');
 fs.appendFileSync(summary,'\nSYNTHETIC_WRITER_EDIT');
 const summaryBytes=fs.readFileSync(summary);
 const m=JSON.parse(fs.readFileSync(manifest,'utf8'));
 const s=m.artifacts.find(x=>x.path==='review-summary.md');
 s.sha256=hash(summaryBytes);s.byte_length=summaryBytes.length;
 fs.writeFileSync(manifest,JSON.stringify(m,null,2)+'\n');
 const ix=JSON.parse(fs.readFileSync(idx,'utf8'));
 const a=ix.files.find(x=>x.path==='review-summary.md');
 a.sha256=hash(summaryBytes);a.bytes=summaryBytes.length;
 const mb=fs.readFileSync(manifest),mi=ix.files.find(x=>x.path==='review-manifest.json');
 mi.sha256=hash(mb);mi.bytes=mb.length;
 fs.writeFileSync(idx,JSON.stringify(ix,null,2)+'\n');
 const r=inspect(f.name,receipt);
 assert.equal(r.final.status,'CONTENT_DIGEST_CHANGED_REVIEW_REQUIRED');
 return {status:r.final.status,receiptNotAuthenticated:true};
});
await one('REC2-13','prior observation of another target rejected',()=>{
 const {receipt}=completed('otherprior');
 assert.throws(()=>inspect('bundle-different',receipt),/PRIOR_RECEIPT_INVALID/);
 return {crossTargetPriorRejected:true};
});
await one('REC2-14','traversal and alternate target paths rejected',()=>{
 for(const name of ['../escape','/root','..','x\\y','C:other']){
  assert.throws(()=>inspect(name),/ABSOLUTE_PARENT_AND_SINGLE_OUTPUT_NAME_REQUIRED/);
 }
 return {badNamesRejected:5};
});
await one('REC2-15','published file instead of bundle refused',()=>{
 const name='bundle-file';
 fs.writeFileSync(path.join(root,name),'SYNTHETIC');
 const r=inspect(name);
 assert.equal(r.final.status,'UNTRUSTED_FINAL_ENTRY_REVIEW_REQUIRED');
 return {status:r.final.status};
});
await one('REC2-16','read-only repeated observation leaves files unchanged',()=>{
 const {f}=completed('readonly');
 const files=['review-manifest.json','bundle-checksums.json','review-summary.md'];
 const before=files.map(n=>hash(fs.readFileSync(path.join(f.out,n))));
 const one=inspect(f.name),two=inspect(f.name);
 assert.deepEqual(one.final,two.final);
 assert.deepEqual(before,files.map(n=>hash(fs.readFileSync(path.join(f.out,n)))));
 assert.equal(one.constraints.noFileWrites,true);
 return {noWrites:true};
});
await one('REC2-17','kill immediately after REAL Writer created stage',()=>{
 const f=make('kill-stage'),c=childRun(f,'AFTER_STAGE_CREATED');
 assert.notEqual(c.status,0);
 const r=inspect(f.name);
 assert.equal(r.stageCount,1);
 assert.equal(r.stages[0].status,'EMPTY_STAGE_REVIEW_REQUIRED');
 assert.equal(r.final.exists,false);
 return {stage:r.stages[0].status,signal:c.signal||null,exit:c.status};
});
await one('REC2-18','kill after REAL checksum index leaves derived partial only',()=>{
 const f=make('kill-checksum'),c=childRun(f,'AFTER_CHECKSUM_INDEX_WRITTEN');
 assert.notEqual(c.status,0);
 const r=inspect(f.name);
 assert.equal(r.stageCount,1);assert.equal(r.final.exists,false);
 assert.equal(r.stages[0].status,'UNCOMMITTED_STAGE_REVIEW_REQUIRED');
 const stage=fs.readdirSync(root).find(x=>x.startsWith('.guard-i1-partial-'+f.name+'-'));
 assert(!fs.existsSync(path.join(root,stage,'.private-source')));
 return {staging:r.stages[0].status,rawSourcePersisted:false};
});
await one('REC2-19','kill after REAL final rename yields completed bundle, no ack',()=>{
 const f=make('kill-publish'),c=childRun(f,'AFTER_FINAL_DIRECTORY_RENAME');
 assert.notEqual(c.status,0);
 const r=inspect(f.name);
 assert.equal(r.stageCount,0);
 assert.equal(r.final.status,'COMPLETE_BUNDLE_AT_INSPECTION_ONLY');
 return {status:r.final.status,externalSuccessAcknowledgement:false};
});
await one('REC2-20','post-rename exception cannot fabricate phantom stage',()=>{
 const f=make('throw-after-commit'),c=childRun(f,'THROW_AFTER_FINAL_DIRECTORY_RENAME');
 assert.equal(c.status,30);
 assert.equal(fs.readdirSync(root).filter(x=>x.startsWith('.guard-i1-partial-'+f.name+'-')).length,0);
 const r=inspect(f.name);
 assert.equal(r.final.status,'COMPLETE_BUNDLE_AT_INSPECTION_ONLY');
 assert((c.stderr||'').includes('could not acknowledge a completed Bundle'));
 return {cliExit:30,phantomStageCreated:false,bundleAtInspection:true};
});
await one('REC2-21','native fault injection leaves INCOMPLETE not false success',()=>{
 const f=make('eio'),c=childRun(f,'EIO_BEFORE_FINAL_DIRECTORY_RENAME');
 assert.equal(c.status,30);
 const r=inspect(f.name);
 assert.equal(r.final.exists,false);
 assert.equal(r.stageCount,1);
 assert.equal(r.stages[0].status,'INCOMPLETE_MARKER_REVIEW_REQUIRED');
 return {cliExit:30,status:r.stages[0].status};
});
await one('REC2-22','standalone owner inspector is read only and uses explicit args',()=>{
 const {f}=completed('inspector');
 const r=spawnSync(process.execPath,[inspector,'--parent',root,'--name',f.name],
   {cwd:root,encoding:'utf8',timeout:60000,windowsHide:true});
 assert.equal(r.status,0,r.stderr);
 const view=JSON.parse(r.stdout);
 assert.equal(view.final.status,'COMPLETE_BUNDLE_AT_INSPECTION_ONLY');
 assert.equal(view.constraints.noAutomaticDeletion,true);
 return {readonlyEntry:true,unchangedGuardCli:true};
});
await one('REC2-23','max bounded number of partials is fail-closed',()=>{
 const name='bundle-many';
 for(let i=0;i<65;i++)fs.mkdirSync(path.join(root,'.guard-i1-partial-'+name+'-'+String(i).padStart(3,'0')));
 assert.throws(()=>inspect(name),/TOO_MANY_PARTIAL_STAGES/);
 return {maxStageLimit:64,untrustedBulkScanRefused:true};
});
if(process.platform!=='win32'){
 await one('REC2-24','symlink final rejected without following target',()=>{
  const name='bundle-symlink',elsewhere=path.join(root,'synthetic-elsewhere');
  fs.mkdirSync(elsewhere);
  fs.symlinkSync(elsewhere,path.join(root,name),'dir');
  const r=inspect(name);
  assert.equal(r.final.status,'UNTRUSTED_FINAL_ENTRY_REVIEW_REQUIRED');
  return {status:r.final.status};
 });
}else notRun('REC2-24','Windows unprivileged symlink creation not assumed; requires separate junction/ACL admission.');
await one('REC2-25','oversize artifact refused before large read',()=>{
 const {f}=completed('oversize');
 const p=path.join(f.out,'review-summary.md');
 fs.truncateSync(p,32*1024*1024+1);
 const r=inspect(f.name);
 assert.equal(r.final.status,'PUBLISHED_INTEGRITY_UNVERIFIED_OWNER_REVIEW');
 return {status:r.final.status,readMaxBytes:32*1024*1024};
});
const failed=cases.filter(c=>c.status==='FAIL');
const counts={pass:cases.filter(c=>c.status==='PASS_BOUNDED').length,fail:failed.length,
  not_tested:cases.filter(c=>c.status==='NOT_TESTED').length};
const receipt={kind:'I1_REAL_WRITER_RECOVERY_02_TEST_RECEIPT',
  testedSha:process.env.GITHUB_SHA||'LOCAL',platform:process.platform,
  arch:process.arch,node:process.version,syntheticOnly:true,
  noAutomaticDeletion:true,noAutomaticRetry:true,
  guardPublicCliUnchanged:true,windowsNtfsAclProductAdmission:'HOLD',
  sourceRawDiskCopyEliminatedInParentDataflow:true,
  persistentReceiptAuthentication:'NOT_ESTABLISHED',
  realPowerLoss:'NOT_TESTED',customerData:'NOT_TESTED',
  counts,cases};
if(process.env.I1_RECOVERY_02_RECEIPT){
 const p=path.resolve(process.env.I1_RECOVERY_02_RECEIPT);
 fs.mkdirSync(path.dirname(p),{recursive:true});
 fs.writeFileSync(p,JSON.stringify(receipt,null,2)+'\n');
}
console.log('I1_REAL_WRITER_RECOVERY_02_FINAL',JSON.stringify(counts));
fs.rmSync(root,{recursive:true,force:true});
if(failed.length)process.exitCode=1;
