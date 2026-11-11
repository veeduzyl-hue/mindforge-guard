import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {newSyntheticRecoveryFixture,publishSyntheticReview,inspectSyntheticRecovery} from './recovery.mjs';
import {spikeModulePath} from '../i1-native-adapter-spike-v0.1/load.mjs';
const directory=path.dirname(fileURLToPath(import.meta.url));
const binarySha=crypto.createHash('sha256').update(fs.readFileSync(spikeModulePath())).digest('hex');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const results=[],roots=[];
process.env.I1_RECOVERY_ALLOW_FIXTURE='1';
process.env.I1_RECOVERY_ALLOW_PUBLISH='1';
process.env.I1_NATIVE_SPIKE_ENABLED='1';
function fresh(){const f=newSyntheticRecoveryFixture();roots.push(f.root);return f;}
function commit(f,name){return publishSyntheticReview({root:f.root,name,expectedBinarySha256:binarySha});}
function noLeak(f){
 const secret=fs.readFileSync(f.sourceFile);
 let count=0;
 function scan(d){
  for(const e of fs.readdirSync(d,{withFileTypes:true})){
   const p=path.join(d,e.name);assert(!e.isSymbolicLink());
   if(e.isDirectory())scan(p);
   else if(e.isFile()){assert(!fs.readFileSync(p).includes(secret),'PRIVATE_SOURCE_COPIED_TO_STAGE');count++;}
  }
 }
 scan(f.stages);scan(f.published);scan(f.receipts);
 return count;
}
async function one(id,fn){
 try{const evidence=await fn();results.push({id,status:'PASS_BOUNDED',evidence:evidence||{}});
   console.log('PASS',id,JSON.stringify(evidence||{}).slice(0,320));}
 catch(e){results.push({id,status:'FAIL',reason:String(e?.stack||e).slice(0,1600)});
   console.error('FAIL',id,String(e?.message||e).slice(0,350));}
}
function notRun(id,status,reason){results.push({id,status,reason});console.log('LIMIT',id,status);}
await one('REC-01-NORMAL-BOUND-NATIVE-LOCATOR',()=>{
 const f=fresh(),name='bundle-normal';const ret=commit(f,name);
 assert.equal(ret.status,'COMMITTED_CONFIRMED_AT_READBACK');
 const audit=inspectSyntheticRecovery(f.root);
 assert.equal(audit.published[0].status,'VALID_AT_AUDIT_INSTANT');
 assert.equal(audit.stages.length,0);assert.equal(audit.automaticCleanupPerformed,false);
 return {nativeApi:ret.nativeApi,locator:audit.published[0].status};
});
await one('REC-02-RAW-SOURCE-NOT-STAGED',()=>{
 const f=fresh(),name='bundle-canary';const ret=commit(f,name);
 assert(ret.committed);assert(noLeak(f)>0);
 assert(!fs.existsSync(path.join(f.published,name,'.private-source')));
 return {privateSourceNotDuplicated:true,derivedMayStillContainSensitiveNarrative:true};
});
await one('REC-03-EXISTING-TARGET-NO-OVERWRITE',()=>{
 const f=fresh(),name='bundle-existing';const ret=commit(f,name);assert(ret.committed);
 const file=path.join(f.published,name,'review-manifest.json'),before=hash(fs.readFileSync(file));
 assert.equal(commit(f,name).status,'REFUSED_FINAL_ALREADY_EXISTS');
 assert.equal(hash(fs.readFileSync(file)),before);
 return {nativeNoOverwritePreserved:true};
});
await one('REC-04-DEFAULT-OFF',()=>{
 const f=fresh();delete process.env.I1_RECOVERY_ALLOW_PUBLISH;
 try{const ret=commit(f,'bundle-off');
   assert.equal(ret.status,'REFUSED_RECOVERY_EXPERIMENT_DEFAULT_OFF');
   assert.equal(fs.readdirSync(f.stages).length,0);return {status:ret.status};
 }finally{process.env.I1_RECOVERY_ALLOW_PUBLISH='1';}
});
const crashPoints=['AFTER_SOURCE_READ','AFTER_STAGE_CREATED','AFTER_DERIVED_WRITTEN',
 'BEFORE_NATIVE_COMMIT','AFTER_NATIVE_COMMIT_BEFORE_RECEIPT','AFTER_RECEIPT_WRITTEN'];
for(let i=0;i<crashPoints.length;i++){
 const point=crashPoints[i];
 await one('REC-'+String(i+5).padStart(2,'0')+'-TERMINATE-'+point,()=>{
  const f=fresh(),name='bundle-crash-'+String(i).padStart(2,'0');
  const p=spawnSync(process.execPath,[path.join(directory,'crash_child.mjs'),f.root,name,binarySha],
   {env:{...process.env,I1_RECOVERY_CRASH_FIXTURE:'1',I1_RECOVERY_CRASH_POINT:point},
    encoding:'utf8',timeout:90000,maxBuffer:8e6,windowsHide:true});
  assert.notEqual(p.status,0,'Unexpected clean child completion');
  assert((p.stdout||'').includes('I1_RECOVERY_CHECKPOINT '+point),
    'Checkpoint not reached: '+point+' '+String(p.stderr||'').slice(0,150));
  const audit=inspectSyntheticRecovery(f.root),n=noLeak(f);
  assert.equal(audit.automaticCleanupPerformed,false);
  const staged=audit.stages.length,published=audit.published.length;
  if(i===0){assert.equal(staged,0);assert.equal(published,0);}
  if(i>=1&&i<=3){
   assert.equal(staged,1);assert.equal(published,0);
   assert.equal(audit.stages[0].status,'UNCOMMITTED_ORPHAN_REVIEW_REQUIRED');
   assert.equal(audit.stages[0].privateSnapshotPresent,false);
  }
  if(i===4){
   assert.equal(staged,0);assert.equal(published,1);
   assert.equal(audit.published[0].status,'COMMITTED_WITHOUT_RECEIPT_OWNER_REVIEW');
  }
  if(i===5){
   assert.equal(staged,0);assert.equal(published,1);
   assert.equal(audit.published[0].status,'VALID_AT_AUDIT_INSTANT');
  }
  return {crashCheckpoint:point,exitCode:p.status,signal:p.signal,
    stages:staged,published,outputFilesScanned:n,
    status:audit.published[0]?.status||null,privateSourceCopied:false};
 });
}
await one('REC-11-READ_ONLY_RECOVERY_AUDIT',()=>{
 const f=fresh(),name='bundle-audit';commit(f,name);
 const file=path.join(f.published,name,'derived.json'),before=hash(fs.readFileSync(file));
 assert.deepEqual(inspectSyntheticRecovery(f.root),inspectSyntheticRecovery(f.root));
 assert.equal(hash(fs.readFileSync(file)),before);
 return {unchanged:true,noAutomaticCleanup:true};
});
await one('REC-12-PARENT-MOVED-PUBLIC-LOCATOR-MISSING',()=>{
 const f=fresh(),name='bundle-moved';commit(f,name);
 const displaced=path.join(f.root,'displaced-original');fs.renameSync(f.published,displaced);
 fs.mkdirSync(f.published);
 const audit=inspectSyntheticRecovery(f.root);
 assert.equal(audit.published.length,1);
 assert.equal(audit.published[0].status,'RECEIPT_WITH_MISSING_OR_REBOUND_PUBLIC_PATH');
 assert(fs.existsSync(path.join(displaced,name,'review-manifest.json')));
 return {status:audit.published[0].status,originalArtifactPreserved:true};
});
await one('REC-13-PARENT-REPLACED-DECOY-SAME-BYTES',()=>{
 const f=fresh(),name='bundle-decoy';commit(f,name);
 const relocated=path.join(f.root,'relocated-old');fs.renameSync(f.published,relocated);
 fs.mkdirSync(f.published);
 fs.cpSync(path.join(relocated,name),path.join(f.published,name),{recursive:true});
 const audit=inspectSyntheticRecovery(f.root);
 assert.equal(audit.published[0].status,'LOCATOR_IDENTITY_CHANGED_OWNER_REVIEW');
 assert.equal(audit.published[0].manifestDigestValid,true);
 return {status:audit.published[0].status,sameBytesDifferentObject:true};
});
await one('REC-14-SAME-INODE-CONTENT-AND-MANIFEST-CHANGED',()=>{
 const f=fresh(),name='bundle-tamper';commit(f,name);
 const dir=path.join(f.published,name),derived=path.join(dir,'derived.json');
 fs.writeFileSync(derived,JSON.stringify({kind:'attacker'})+'\n');
 const p=path.join(dir,'review-manifest.json'),m=JSON.parse(fs.readFileSync(p,'utf8'));
 m.derived_files['derived.json']=hash(fs.readFileSync(derived));
 fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n');
 const audit=inspectSyntheticRecovery(f.root);
 assert.equal(audit.published[0].status,'CONTENT_DIGEST_CHANGED_OWNER_REVIEW');
 return {status:audit.published[0].status,attackerCouldAlsoAlterExternalReceipt:true};
});
await one('REC-15-MALFORMED-BUNDLE-DETECTED',()=>{
 const f=fresh(),name='bundle-invalid';commit(f,name);
 fs.writeFileSync(path.join(f.published,name,'review-manifest.json'),'{ BAD JSON');
 const audit=inspectSyntheticRecovery(f.root);
 assert.equal(audit.published[0].status,'CORRUPT_OR_PARTIAL_PUBLISHED');
 return {status:audit.published[0].status};
});
await one('REC-16-LEGACY-PRIVATE_SOURCE-ORPHAN-FLAGGED',()=>{
 const f=fresh(),stage=path.join(f.stages,'.guard-i1-partial-legacy');
 fs.mkdirSync(stage);fs.mkdirSync(path.join(stage,'.private-source'));
 fs.writeFileSync(path.join(stage,'.private-source','canary.txt'),'SYNTHETIC');
 const audit=inspectSyntheticRecovery(f.root);
 assert.equal(audit.stages[0].status,'PRIVATE_SOURCE_RETAINED_CRITICAL');
 assert.equal(audit.automaticCleanupPerformed,false);
 return {legacyCriticalOrphanDetected:true};
});
await one('REC-17-BINARY-DIGEST-FAILS-CLOSED',()=>{
 const f=fresh();const ret=publishSyntheticReview({root:f.root,
  name:'bundle-bad-binary',expectedBinarySha256:'0'.repeat(64)});
 assert.equal(ret.status,'NATIVE_COMMIT_REFUSED');
 assert.equal(ret.native.status,'REFUSED_BINARY_DIGEST_MISMATCH');
 assert.equal(inspectSyntheticRecovery(f.root).stages.length,1);
 assert.equal(fs.readdirSync(f.published).length,0);
 return {refusal:ret.native.status,stageRetainedForOwnerReview:true};
});
await one('REC-17B-SYNTHETIC-AMBIGUOUS-NATIVE-RESULT-NO-FALSE-NONCOMMIT',()=>{
 const f=fresh();
 process.env.I1_RECOVERY_SYNTHETIC_UNKNOWN='1';
 process.env.I1_RECOVERY_FAULT_INJECTION_AUTHORIZED='1';
 try{
  const ret=publishSyntheticReview({root:f.root,name:'bundle-unknown',
    expectedBinarySha256:binarySha});
  assert.equal(ret.status,'COMMIT_OUTCOME_UNKNOWN_OWNER_REVIEW');
  assert.equal(ret.publicationState,'UNKNOWN_REQUIRES_READ_ONLY_RECONCILIATION');
  assert.equal(ret.ownerReviewRequired,true);
  assert.equal(ret.automaticCleanupPerformed,false);
  assert.equal(Object.hasOwn(ret,'readyButNotPublished'),false);
  const audit=inspectSyntheticRecovery(f.root);
  assert.equal(audit.stages.length,1);
  return {injectionSyntheticOnly:true,status:ret.status,noNegativeCommitClaim:true};
 }finally{delete process.env.I1_RECOVERY_SYNTHETIC_UNKNOWN;
  delete process.env.I1_RECOVERY_FAULT_INJECTION_AUTHORIZED;}
});
notRun('REC-18-G4-FUTURE_PATH_AND_CONTENT_MUTATION','OBSERVED_UNPROTECTED',
 'Same-user actor can mutate published bytes or public path after any instantaneous readback.');
notRun('REC-19-POWERLOSS_JOURNAL_REPLAY','NOT_TESTED','SIGKILL does not simulate physical power-loss durability.');
notRun('REC-20-WIN10_WIN11_CLIENT','NOT_TESTED','Windows Server 2022 CI is not desktop Windows 10/11.');
notRun('REC-21-REAL_GUARD_PACK_AND_I1_WRITER','NOT_TESTED','Only synthetic in-memory-derived fixture; Guard writer unchanged.');
notRun('REC-22_ENCRYPTED_STORAGE_AND_SECURE_WIPE','NOT_TESTED','No encrypted staging, memory zeroization or safe automated orphan deletion.');
notRun('REC-23_SYNCHRONIZED_PARENT_RACE','NOT_TESTED','Post-return rebind tested; not a pre-call synchronized attacker.');
notRun('REC-24_UNSUPPORTED_VOLUME','NOT_TESTED','CI volume support only; no cross-device fallback.');
let cleaned=0;for(const root of roots){fs.rmSync(root,{recursive:true,force:true});cleaned++;}
const counts={pass:results.filter(r=>r.status==='PASS_BOUNDED').length,
 fail:results.filter(r=>r.status==='FAIL').length,
 not_tested:results.filter(r=>r.status==='NOT_TESTED').length,
 observed:results.filter(r=>r.status==='OBSERVED_UNPROTECTED').length};
const receipt={kind:'I1_NATIVE_RECOVERY_01_SYNTHETIC_TEST_RECEIPT',
 fixedHead:process.env.GITHUB_SHA||'LOCAL',platform:process.platform,arch:process.arch,
 node:process.version,napi:process.versions.napi,syntheticOnly:true,productIntegrated:false,
 autoCleanupOrRecovery:false,sourceCopiesStoredInStage:false,
 powerLossDurability:'NOT_ESTABLISHED',G4:'NOT_ESTABLISHED',counts,cases:results,
 cleanupOfOwnedSyntheticFixturesOnly:true,fixtureCount:cleaned};
const dest=path.resolve(process.env.I1_RECOVERY_RECEIPT_DIR||directory);
fs.mkdirSync(dest,{recursive:true});
fs.writeFileSync(path.join(dest,'recovery-test-receipt.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('I1_NATIVE_RECOVERY_FINAL',JSON.stringify(counts));
if(counts.fail)process.exitCode=1;
