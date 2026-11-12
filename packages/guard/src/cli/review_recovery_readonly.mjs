// I1-REAL-WRITER-RECOVERY-02: read-only, bounded evidence/locator inspection.
// Opt-in owner inspection; not a Guard CLI command or independent verifier.
// It never deletes, retries, repairs, uploads, renames or writes receipt files.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const KIND = 'i1_real_writer_recovery_read_only_inspection_v0.1';
const BASELINE_KIND = 'i1_real_writer_recovery_observation_receipt_v0.1';
const EXPECTED = new Set([
  'review-manifest.json',
  'review-summary.md',
  'diagnostics.json',
  'bundle-checksums.json',
  'components/pack-validation.json',
  'components/single-agent-governance-report.json'
]);
const MAX_FILE_BYTES = 32 * 1024 * 1024;
const MAX_TOTAL_BYTES = 64 * 1024 * 1024;
const MAX_STAGES = 64;
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const identity = stat => stat ? {device:String(stat.dev),inode:String(stat.ino)} : null;
const sameId = (a,b) => Boolean(a&&b&&a.device===b.device&&a.inode===b.inode);
const badName = name => typeof name !== 'string'||!name.length||
  name === '.'||name === '..'||name.includes('\0')||
  name.includes('/')||name.includes('\\')||name.includes(':')||
  Buffer.byteLength(name,'utf8')>220;
function statusOfError(e){return e?.code||'INSPECTION_IO_ERROR';}
function lstat(p) {
  try{return fs.lstatSync(p,{bigint:true});}
  catch(e){if(e.code==='ENOENT')return null;throw e;}
}
function safeRegularRead(p,max=MAX_FILE_BYTES){
  const prior=lstat(p);
  if(!prior || !prior.isFile() || prior.isSymbolicLink() || prior.size>BigInt(max)){
    throw Error('FILE_ABSENT_OR_UNSAFE');
  }
  let fd;
  try{
    fd=fs.openSync(p,fs.constants.O_RDONLY|(fs.constants.O_NOFOLLOW||0));
    const before=fs.fstatSync(fd,{bigint:true});
    if(!before.isFile()||before.isSymbolicLink()||
       before.dev!==prior.dev||before.ino!==prior.ino||
       before.size!==prior.size||before.size>BigInt(max))throw Error('FILE_IDENTITY_CHANGED');
    // The descriptor may be grown by an uncooperative writer during our
    // inspection. Read at most the observed bounded byte count, not an
    // unbounded fs.readFileSync(fd) that can expand with the file.
    const expected=Number(before.size);
    const bytes=Buffer.alloc(expected);
    let done=0;
    while(done<expected){
      const n=fs.readSync(fd,bytes,done,expected-done,null);
      if(n===0)throw Error('FILE_TRUNCATED_DURING_INSPECTION');
      done+=n;
    }
    const tail=Buffer.alloc(1);
    if(fs.readSync(fd,tail,0,1,null)!==0)throw Error('FILE_GREW_DURING_INSPECTION');
    const after=fs.fstatSync(fd,{bigint:true});
    if(after.dev!==before.dev||after.ino!==before.ino||
       after.size!==before.size||BigInt(bytes.length)!==before.size)throw Error('FILE_CHANGED_DURING_INSPECTION');
    return bytes;
  }finally{if(fd!==undefined)fs.closeSync(fd);}
}
function fileEntry(bundleRoot,relative){
  const parts=relative.split('/');
  if(!EXPECTED.has(relative)||parts.some(x=>!x||x==='.'||x==='..'))throw Error('UNEXPECTED_RELATIVE_FILE');
  const file=path.join(bundleRoot,...parts);
  if(parts.length===2) {
    const dir=lstat(path.join(bundleRoot,parts[0]));
    if(!dir||!dir.isDirectory()||dir.isSymbolicLink())throw Error('UNSAFE_COMPONENT_DIRECTORY');
  }
  return safeRegularRead(file);
}
function listActual(bundleRoot){
  const actual=[];
  const names=fs.readdirSync(bundleRoot,{withFileTypes:true});
  if(names.length>16)throw Error('BUNDLE_HAS_TOO_MANY_ENTRIES');
  for(const e of names){
    if(e.isSymbolicLink())throw Error('SYMLINK_IN_BUNDLE');
    if(e.name==='components'){
      if(!e.isDirectory())throw Error('COMPONENTS_NOT_DIRECTORY');
      const nested=fs.readdirSync(path.join(bundleRoot,e.name),{withFileTypes:true});
      if(nested.length>10)throw Error('COMPONENTS_TOO_MANY');
      for(const n of nested){
        if(!n.isFile()||n.isSymbolicLink())throw Error('UNSAFE_COMPONENT_ENTRY');
        actual.push('components/'+n.name);
      }
    }else{
      if(!e.isFile())throw Error('UNEXPECTED_BUNDLE_DIRECTORY');
      actual.push(e.name);
    }
  }
  return actual.sort();
}
function verifyBundle(bundleRoot){
  let bytesUsed=0;
  const read = rel => {
    const data=fileEntry(bundleRoot,rel);
    bytesUsed+=data.length;
    if(bytesUsed>MAX_TOTAL_BYTES)throw Error('BOUNDED_READ_EXCEEDED');
    return data;
  };
  const manifestBytes=read('review-manifest.json');
  const checkBytes=read('bundle-checksums.json');
  const manifest=JSON.parse(manifestBytes.toString('utf8'));
  const checks=JSON.parse(checkBytes.toString('utf8'));
  if(manifest.kind!=='mindforge_guard_review_bundle'||
     manifest.bundle_version!=='0.1-candidate'||
     manifest.non_executing!==true||
     checks.kind!=='i1_bundle_checksums'||checks.hash_algorithm!=='sha256'||
     !Array.isArray(checks.files)||!Array.isArray(manifest.artifacts)){
    throw Error('BUNDLE_MANIFEST_OR_CHECKSUM_SCHEMA_UNEXPECTED');
  }
  const actual=listActual(bundleRoot);
  if(actual.some(p=>!EXPECTED.has(p)))throw Error('EXTRA_BUNDLE_ENTRY');
  const indexFiles=checks.files;
  const indexed=new Map();
  for(const item of indexFiles){
    if(!item||typeof item.path!=='string'||!EXPECTED.has(item.path)||
       item.path==='bundle-checksums.json'||indexed.has(item.path)||
       !/^[a-f0-9]{64}$/.test(item.sha256)||
       !Number.isSafeInteger(item.bytes)||item.bytes<0){
      throw Error('CHECKSUM_INDEX_INVALID');
    }
    indexed.set(item.path,{sha256:item.sha256,bytes:item.bytes});
  }
  const expectedPaths=['bundle-checksums.json',...indexed.keys()].sort();
  if(JSON.stringify(expectedPaths)!==JSON.stringify(actual))throw Error('INDEX_COVERAGE_MISMATCH');
  // The manifest cannot include its *own* SHA-256; it enumerates the
  // preceding native component/summary files. The separate checksum index
  // includes that manifest, and excludes only itself.
  if(!indexed.has('review-manifest.json')||
     manifest.artifacts.length!==indexed.size-1)throw Error('MANIFEST_ARTIFACT_COUNT_MISMATCH');
  const manifestPaths=new Set();
  for(const item of manifest.artifacts){
    const known=indexed.get(item.path);
    if(item.path==='review-manifest.json'||manifestPaths.has(item.path)||
       !known||item.sha256!==known.sha256||item.byte_length!==known.bytes){
      throw Error('MANIFEST_INDEX_MISMATCH');
    }
    manifestPaths.add(item.path);
  }
  for(const [relative,item] of indexed){
    const data=relative==='review-manifest.json'?manifestBytes:read(relative);
    if(data.length!==item.bytes||sha(data)!==item.sha256){
      throw Error('ARTIFACT_HASH_MISMATCH');
    }
  }
  return {
    manifestSha256:sha(manifestBytes),
    checksumsSha256:sha(checkBytes),
    indexArtifactCount:indexed.size,
    observedBytes:bytesUsed,
    noUnexpectedEntry:true,
    nativeSemanticsNotIndependentlyVerified:true
  };
}
function observeStage(parent,name){
  const p=path.join(parent,name);
  try{
    const stat=lstat(p);
    if(!stat||stat.isSymbolicLink()||!stat.isDirectory()){
      return {name,status:'UNTRUSTED_STAGE_ENTRY_REVIEW_REQUIRED',ownerReviewRequired:true};
    }
    const children=fs.readdirSync(p,{withFileTypes:true});
    const childNames=children.map(x=>x.name);
    if(childNames.includes('.private-source')){
      return {name,status:'LEGACY_RAW_SOURCE_COPY_CRITICAL',ownerReviewRequired:true,
        derivedDataMayBeSensitive:true,autoCleanupPerformed:false};
    }
    if(children.some(c=>c.isSymbolicLink())){
      return {name,status:'UNTRUSTED_STAGE_CHILD_REVIEW_REQUIRED',
        ownerReviewRequired:true,autoCleanupPerformed:false};
    }
    let status='UNCOMMITTED_STAGE_REVIEW_REQUIRED';
    if(childNames.includes('INCOMPLETE.json'))status='INCOMPLETE_MARKER_REVIEW_REQUIRED';
    else if(children.length===0)status='EMPTY_STAGE_REVIEW_REQUIRED';
    return {name,status,entryCount:children.length,
      derivedDataMayBeSensitive:children.length>0,
      ownerReviewRequired:true,autoCleanupPerformed:false};
  }catch(e){
    return {name,status:'STAGE_INSPECTION_UNCERTAIN_REVIEW_REQUIRED',
      failureCode:statusOfError(e),ownerReviewRequired:true};
  }
}
function validatedPrior(prior,name){
  if(prior==null)return null;
  if(typeof prior!=='object'||prior.kind!==BASELINE_KIND||
     prior.outputName!==name||!prior.parentIdentity||!prior.bundleIdentity||
     !/^[a-f0-9]{64}$/.test(prior.manifestSha256||'')||
     !/^[a-f0-9]{64}$/.test(prior.checksumsSha256||'')){
    throw Error('PRIOR_RECEIPT_INVALID_OR_WRONG_TARGET');
  }
  return prior;
}
/** Explicitly scoped to one already-known output name under a known output parent.
 *  Returns metadata only. Prior receipts are caller-supplied, optional and
 *  UNAUTHENTICATED. No output files or mutation occurs inside this function.
 */
export function inspectI1ReviewRecovery({parent,outputName,priorReceipt=null}={}){
  if(typeof parent!=='string'||!path.isAbsolute(parent)||badName(outputName)){
    throw Error('ABSOLUTE_PARENT_AND_SINGLE_OUTPUT_NAME_REQUIRED');
  }
  const previous=validatedPrior(priorReceipt,outputName);
  const requested=path.resolve(parent);
  const canonical=fs.realpathSync(requested);
  const pstat=lstat(canonical);
  if(!pstat||!pstat.isDirectory()||pstat.isSymbolicLink()){
    throw Error('OUTPUT_PARENT_UNSAFE_OR_ABSENT');
  }
  const parentId=identity(pstat);
  const stagePrefix='.guard-i1-partial-'+outputName+'-';
  const names=fs.readdirSync(canonical,{withFileTypes:true})
    .map(x=>x.name).filter(name=>name.startsWith(stagePrefix)).sort();
  if(names.length>MAX_STAGES)throw Error('TOO_MANY_PARTIAL_STAGES_OWNER_REVIEW_REQUIRED');
  const stages=names.map(name=>observeStage(canonical,name));
  const finalPath=path.join(canonical,outputName);
  const targetStat=lstat(finalPath);
  let finalStatus='NO_FINAL_OUTPUT_OBSERVED_OUTCOME_UNKNOWN';
  let finalIdentity=null,integrity=null,inspectionError=null;
  if(targetStat){
    if(targetStat.isSymbolicLink()||!targetStat.isDirectory()){
      finalStatus='UNTRUSTED_FINAL_ENTRY_REVIEW_REQUIRED';
    }else{
      finalIdentity=identity(targetStat);
      try{
        integrity=verifyBundle(finalPath);
        finalStatus='COMPLETE_BUNDLE_AT_INSPECTION_ONLY';
      }catch(e){
        inspectionError=e.message||'INVALID_OR_UNREADABLE_BUNDLE';
        finalStatus='PUBLISHED_INTEGRITY_UNVERIFIED_OWNER_REVIEW';
      }
    }
  }
  if(previous){
    if(!targetStat){
      finalStatus='PRIOR_RECEIPT_FINAL_OUTPUT_ABSENT_REVIEW_REQUIRED';
    }else if(integrity &&
        (!sameId(previous.parentIdentity,parentId)||
         !sameId(previous.bundleIdentity,finalIdentity))){
      finalStatus='LOCATOR_IDENTITY_CHANGED_REVIEW_REQUIRED';
    }else if(integrity &&
        (previous.manifestSha256!==integrity.manifestSha256||
         previous.checksumsSha256!==integrity.checksumsSha256)){
      finalStatus='CONTENT_DIGEST_CHANGED_REVIEW_REQUIRED';
    }else if(integrity){
      finalStatus='COMPLETE_BUNDLE_MATCHES_UNAUTHENTICATED_PRIOR_AT_INSPECTION';
    }
  }
  // Re-observe the canonical parent after scanning; this is still a
  // point-in-time check and cannot defeat malicious rename immediately later.
  const parentAfter=lstat(canonical);
  const parentChanged= !parentAfter||!sameId(parentId,identity(parentAfter));
  if(parentChanged)finalStatus='PARENT_IDENTITY_CHANGED_DURING_INSPECTION';
  const receiptCandidate=integrity&&!parentChanged?{
    kind:BASELINE_KIND,outputName,
    observedAt:new Date().toISOString(),
    parentIdentity:parentId,bundleIdentity:finalIdentity,
    manifestSha256:integrity.manifestSha256,
    checksumsSha256:integrity.checksumsSha256,
    unauthenticated:true,
    canProveFuturePathOrImmutability:false
  }:null;
  return {
    kind:KIND,readOnly:true,
    outputName,parentCanonicalIsRequested:(requested===canonical),
    requestedParentAliased:(requested!==canonical),
    parentIdentity:parentId,
    final:{status:finalStatus,exists:Boolean(targetStat),
      identity:finalIdentity,integrity:integrity?{
        manifestSha256:integrity.manifestSha256,
        checksumsSha256:integrity.checksumsSha256,
        indexArtifactCount:integrity.indexArtifactCount
      }:null,inspectionError},
    stages,stageCount:stages.length,
    overallReviewRequired:stages.length>0||
      finalStatus!=='COMPLETE_BUNDLE_AT_INSPECTION_ONLY'&&
      finalStatus!=='COMPLETE_BUNDLE_MATCHES_UNAUTHENTICATED_PRIOR_AT_INSPECTION',
    receiptCandidate,
    constraints:{
      noAutomaticDeletion:true,noAutomaticRetry:true,noFileWrites:true,
      noSuccessfulPublishClaimFromMissingReceipt:true,
      pathIdentityAtInspectionOnly:true,
      priorReceiptNotIndependentlyAuthenticated:true,
      NTFS_DACL_GUARANTEE:'NOT_ESTABLISHED',
      dataRetentionGuarantee:'NOT_ESTABLISHED',
      powerLossDurability:'NOT_ESTABLISHED',
      g4PostPublicationTampering:'NOT_ESTABLISHED',
      realCustomerUse:'NOT_AUTHORIZED'
    }
  };
}
