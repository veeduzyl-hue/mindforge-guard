// I1-NATIVE-RECOVERY-01: isolated synthetic-only crash/locator prototype.
// Intentionally NOT imported by Guard, Bundle Writer, any published package.
// Native publishing uses previously validated Node-API8 SPIKE loader.
// Never copies .private-source; never automatically deletes orphan stages.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {nativeCommit, createSyntheticFixtureMarker, markerName} from '../i1-native-adapter-spike-v0.1/load.mjs';
const MARKER_TEXT='I1_NATIVE_SPIKE_SYNTHETIC_FIXTURE_V01\n';
const sha=(b)=>crypto.createHash('sha256').update(b).digest('hex');
const owned=(root,p)=>{const v=path.relative(root,p);return v&&!v.startsWith('..'+path.sep)&&v!=='..'&&!path.isAbsolute(v);};
const regular=(p)=>{const s=fs.lstatSync(p);return s.isFile()&&!s.isSymbolicLink();};
const identity=(p)=>{
  try{
    const st=fs.statSync(p,{bigint:true});
    if(!st.isDirectory())return null;
    return {device:String(st.dev),inode:String(st.ino)};
  }catch{return null;}
};
const sameId=(a,b)=>Boolean(a&&b&&a.device===b.device&&a.inode===b.inode);
function marker(root){
  const p=path.join(root,markerName());
  if(!regular(p)||fs.readFileSync(p,'utf8')!==MARKER_TEXT)throw Error('NOT_OWNED_SYNTHETIC_FIXTURE');
  return true;
}
const dirs=(root)=>({source:path.join(root,'source'),stages:path.join(root,'staging'),published:path.join(root,'published'),receipts:path.join(root,'receipts')});
const event=(name,hook)=>{
  process.stdout.write('I1_RECOVERY_CHECKPOINT '+name+'\n');
  if(typeof hook==='function')hook(name);
  if(process.env.I1_RECOVERY_CRASH_POINT===name){
    if(process.env.I1_RECOVERY_CRASH_FIXTURE!=='1')throw Error('CRASH_POINT_NOT_AUTHORIZED');
    // Intentional crash only in a newly created synthetic fixture.
    process.kill(process.pid,'SIGKILL');
    throw Error('CRASH_DID_NOT_TERMINATE');
  }
};
function openNew(p,data){
  const fd=fs.openSync(p,'wx',0o600);
  try{fs.writeFileSync(fd,data);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
}
function safeSyncDir(dir){
  if(process.platform==='win32')return 'NOT_ESTABLISHED_WINDOWS_DIR_FSYNC';
  try{
    const fd=fs.openSync(dir,fs.constants.O_RDONLY|(fs.constants.O_DIRECTORY||0));
    try{fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
    return 'FSYNC_RETURNED_SUCCESS_NOT_POWERLOSS_PROOF';
  }catch{return 'NOT_ESTABLISHED_DIRECTORY_FSYNC_FAILED';}
}
function safeSource(p){
  if(!regular(p))throw Error('SYNTHETIC_SOURCE_MUST_BE_REGULAR_FILE');
  const prior=fs.lstatSync(p);
  if(prior.size>256*1024||prior.size<1)throw Error('SOURCE_TOO_LARGE_OR_EMPTY');
  const fd=fs.openSync(p,fs.constants.O_RDONLY|(fs.constants.O_NOFOLLOW||0));
  try{
    const before=fs.fstatSync(fd);
    if(!before.isFile()||before.ino!==prior.ino||before.dev!==prior.dev)throw Error('SOURCE_IDENTITY_CHANGED');
    const bytes=fs.readFileSync(fd);
    const after=fs.fstatSync(fd);
    if(bytes.length!==after.size||before.ino!==after.ino||before.dev!==after.dev)throw Error('SOURCE_MUTATED_WHILE_READING');
    return bytes;
  }finally{fs.closeSync(fd);}
}
function serialize(value){return Buffer.from(JSON.stringify(value,null,2)+'\n','utf8');}
export function newSyntheticRecoveryFixture(){
  if(process.env.I1_RECOVERY_ALLOW_FIXTURE!=='1')throw Error('SYNTHETIC_FIXTURE_CREATION_DISABLED');
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'guard-i1-native-recovery-'));
  process.env.I1_NATIVE_SPIKE_FIXTURE_BUILDER='1';
  createSyntheticFixtureMarker(root);
  const d=dirs(root);
  for(const dir of Object.values(d))fs.mkdirSync(dir,{mode:0o700});
  openNew(path.join(d.source,'synthetic-evidence.txt'),Buffer.from('SYNTHETIC_ONLY_PRIVATE_CANARY_DO_NOT_PERSIST_'+crypto.randomUUID(),'utf8'));
  return {root,sourceFile:path.join(d.source,'synthetic-evidence.txt'),...d};
}
// Only the fixture contract is accepted. The input canary stays in memory;
// staging contains *derived* facts only. It does NOT prove production reports
// are free of private content, since real report outputs can include narratives.
export function publishSyntheticReview({root,expectedBinarySha256,name,hook}={}){
  if(process.env.I1_RECOVERY_ALLOW_PUBLISH!=='1')return {status:'REFUSED_RECOVERY_EXPERIMENT_DEFAULT_OFF'};
  if(!root||!path.isAbsolute(root))return {status:'REFUSED_NO_ROOT'};
  root=fs.realpathSync(root);marker(root);
  const d=dirs(root);
  for(const dir of Object.values(d))if(fs.realpathSync(dir)!==dir||!owned(root,dir))throw Error('UNTRUSTED_FIXTURE_DIR');
  if(!/^bundle-[a-z0-9-]{4,60}$/.test(name||''))return {status:'REFUSED_UNSAFE_FINAL_NAME'};
  if(fs.existsSync(path.join(d.published,name)))return {status:'REFUSED_FINAL_ALREADY_EXISTS'};
  const source=safeSource(path.join(d.source,'synthetic-evidence.txt'));
  const sourceSha=sha(source);
  const canary=source.toString('utf8');
  event('AFTER_SOURCE_READ',hook);
  const stage=fs.mkdtempSync(path.join(d.stages,'.guard-i1-partial-'+name+'-'));
  fs.chmodSync(stage,0o700);
  event('AFTER_STAGE_CREATED',hook);
  const derived={kind:'synthetic_i1_derived_only',source_sha256:sourceSha,
    no_raw_source_copy:true,note:'Source bytes were read in memory and not duplicated into staging.'};
  const derivedBytes=serialize(derived);
  if(derivedBytes.includes(Buffer.from(canary)))throw Error('PRIVATE_CANARY_IN_DERIVED_CONTENT');
  openNew(path.join(stage,'derived.json'),derivedBytes);
  const contentHashes={'derived.json':sha(derivedBytes)};
  const manifestBytes=serialize({kind:'synthetic_review_bundle',version:'recovery-01',
    derived_files:contentHashes,no_private_source_snapshot:true,
    review_only:true,no_execution_authority:true});
  openNew(path.join(stage,'review-manifest.json'),manifestBytes);
  const journalBytes=serialize({kind:'i1_recovery_journal',phase:'READY_FOR_NATIVE_COMMIT',
    final_name:name,component_count:2,source_sha256:sourceSha,contains_private_source:false,
    manifest_sha256:sha(manifestBytes)});
  openNew(path.join(stage,'staging-journal.json'),journalBytes);
  const stageSync=safeSyncDir(stage);
  const parentSync=safeSyncDir(d.stages);
  event('AFTER_DERIVED_WRITTEN',hook);
  // Never use fs.renameSync as a fallback. The native adapter holds
  // directory FD/HANDLE and reports the outcome explicitly.
  event('BEFORE_NATIVE_COMMIT',hook);
  const native=nativeCommit({enabled:true,mode:'SYNTHETIC_ONLY',fixtureRoot:root,
    sourceParent:d.stages,sourceName:path.basename(stage),
    destinationParent:d.published,destinationName:name,
    expectedBinarySha256});
  if(native.committed!==true){
    return {status:'NATIVE_COMMIT_REFUSED_OR_UNKNOWN',native,
      stageName:path.basename(stage),readyButNotPublished:true,
      automaticCleanupPerformed:false,sourceSnapshotOnDisk:false};
  }
  event('AFTER_NATIVE_COMMIT_BEFORE_RECEIPT',hook);
  const finalPath=path.join(d.published,name);
  const publishedParentSync=safeSyncDir(d.published);
  const parentId=identity(d.published),fileId=identity(finalPath);
  const currentValid=inspectOneBundle(finalPath);
  const readbackConfirmed=native.locatorConfirmed===true &&
    parentId!==null&&fileId!==null&&currentValid.valid===true;
  // Diagnostic receipt is outside the published tree. It may be absent on a
  // crash, so its absence is NEVER interpreted as non-commit.
  const receipt={kind:'i1_native_recovery_publication_receipt',version:'0.1',
    name,confirmed_at_check:readbackConfirmed,
    status:readbackConfirmed?'COMMITTED_CONFIRMED_AT_READBACK':'COMMITTED_LOCATOR_UNCONFIRMED',
    locator_id_at_check:{parentId,fileId},source_sha256:sourceSha,
    bundle_digests_at_check:{manifest_sha256:currentValid.manifestHash||null,derived_sha256:currentValid.hash||null},
    publishedParentSync,
    native:{status:native.status,committed:native.committed,locatorConfirmed:native.locatorConfirmed,
      api:native.api,rawCode:native.rawCode,errorNamespace:native.errorNamespace},
    stageSync,parentSync,persistentDurability:'NOT_ESTABLISHED',
    securityScope:'SYNTHETIC_ONLY'};
  openNew(path.join(d.receipts,name+'.json'),serialize(receipt));
  const receiptSync=safeSyncDir(d.receipts);
  event('AFTER_RECEIPT_WRITTEN',hook);
  return {status:receipt.status,receiptSync,
    committed:true,locatorConfirmedAtReadback:readbackConfirmed,
    noRawSnapshotWritten:true,stageName:path.basename(stage),
    nativeApi:native.api,persistentDurability:'NOT_ESTABLISHED'};
}
function inspectOneBundle(p){
  try{
    if(fs.lstatSync(p).isSymbolicLink()||!fs.lstatSync(p).isDirectory())return {valid:false,reason:'NOT_REGULAR_DIRECTORY'};
    const manifestPath=path.join(p,'review-manifest.json'),derivedPath=path.join(p,'derived.json');
    if(!regular(manifestPath)||!regular(derivedPath))return {valid:false,reason:'MANIFEST_OR_DERIVED_ABSENT'};
    const m=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
    const b=fs.readFileSync(derivedPath);
    if(m.kind!=='synthetic_review_bundle'||m.no_private_source_snapshot!==true||
       m.derived_files?.['derived.json']!==sha(b))return {valid:false,reason:'CONTENT_HASH_MISMATCH'};
    const listing=fs.readdirSync(p);
    if(listing.includes('.private-source'))return {valid:false,reason:'PRIVATE_SOURCE_ON_DISK'};
    return {valid:true,hash:sha(b),manifestHash:sha(fs.readFileSync(manifestPath))};
  }catch{return {valid:false,reason:'CORRUPTED_OR_UNREADABLE'};}
}
// Read-only audit. No unlink, no recursive deletion, no automatic recovery,
// no sanitization of other user's files. It is not a production cleanup tool.
export function inspectSyntheticRecovery(root){
  root=fs.realpathSync(root);marker(root);const d=dirs(root);
  const stages=[],published=[],seen=new Set();
  for(const e of fs.readdirSync(d.stages,{withFileTypes:true})){
    if(!e.name.startsWith('.guard-i1-partial-'))continue;
    const p=path.join(d.stages,e.name);
    if(e.isSymbolicLink()||!e.isDirectory()){
      stages.push({name:e.name,status:'UNTRUSTED_STAGE_NO_ACTION',ownerReviewRequired:true});continue;
    }
    const files=fs.readdirSync(p);
    stages.push({name:e.name,
      status:files.includes('.private-source')?'PRIVATE_SOURCE_RETAINED_CRITICAL':
        'UNCOMMITTED_ORPHAN_REVIEW_REQUIRED',
      privateSnapshotPresent:files.includes('.private-source'),
      ownerReviewRequired:true,automaticCleanupPerformed:false,
      derivedDataMayBeSensitive:true});
  }
  for(const e of fs.readdirSync(d.published,{withFileTypes:true})){
    if(!e.name.startsWith('bundle-'))continue;
    seen.add(e.name);
    const p=path.join(d.published,e.name);
    if(e.isSymbolicLink()||!e.isDirectory()){
      published.push({name:e.name,status:'UNTRUSTED_PUBLISHED_NAME',ownerReviewRequired:true});continue;
    }
    const contents=inspectOneBundle(p);
    const receiptPath=path.join(d.receipts,e.name+'.json');
    let receipt=null;
    try{if(regular(receiptPath))receipt=JSON.parse(fs.readFileSync(receiptPath,'utf8'));}catch{}
    const nowFile=identity(p),nowParent=identity(d.published);
    const match=receipt&&sameId(receipt.locator_id_at_check?.fileId,nowFile)&&
       sameId(receipt.locator_id_at_check?.parentId,nowParent);
    const digestMatch=receipt&&receipt.bundle_digests_at_check?.manifest_sha256===contents.manifestHash&&
       receipt.bundle_digests_at_check?.derived_sha256===contents.hash;
    const status=!contents.valid?'CORRUPT_OR_PARTIAL_PUBLISHED':
      !receipt?'COMMITTED_WITHOUT_RECEIPT_OWNER_REVIEW':
      !match?'LOCATOR_IDENTITY_CHANGED_OWNER_REVIEW':
      !digestMatch?'CONTENT_DIGEST_CHANGED_OWNER_REVIEW':
      'VALID_AT_AUDIT_INSTANT';
    published.push({name:e.name,status,manifestDigestValid:contents.valid,
      identityConsistentWithPriorReceipt:Boolean(match),contentMatchesPriorReceipt:Boolean(digestMatch),
      ownerReviewRequired:status!=='VALID_AT_AUDIT_INSTANT',
      attestedCurrentPathForFuture:false,automaticCleanupPerformed:false});
  }
  // Receipts must still be considered when an attacker has moved the entire
  // published parent away and replaced the public path with a decoy.
  for(const entry of fs.readdirSync(d.receipts,{withFileTypes:true})){
    if(!/^bundle-[a-z0-9-]{4,60}\.json$/.test(entry.name))continue;
    const name=entry.name.slice(0,-5);
    if(!seen.has(name))published.push({name,status:'RECEIPT_WITH_MISSING_OR_REBOUND_PUBLIC_PATH',
      ownerReviewRequired:true,automaticCleanupPerformed:false,
      attestedCurrentPathForFuture:false});
  }
  return {kind:'I1_NATIVE_RECOVERY_01_READ_ONLY_AUDIT',rootOwnershipConfirmed:true,
    stages,published,autoRecovery:false,automaticCleanupPerformed:false,
    G4PostPublicationImmutability:'NOT_ESTABLISHED',
    durabilityAfterPowerLoss:'NOT_ESTABLISHED'};
}
