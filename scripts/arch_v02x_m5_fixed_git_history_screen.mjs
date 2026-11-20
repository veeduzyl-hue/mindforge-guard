// ARCH v0.2.x M5 fixed-source Git history credential screening.
// SCREENING ONLY. All reachable blobs under the exact fixed P1 Git commit
// are examined up to resource limits. This is not a complete independent
// secret audit, not an assurance, and does not admit external distribution.
// NEVER print or upload suspect bytes, Git paths, commit metadata or tokens.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const FIXED_P1='2a5365ea422b6dfb7f3d7bba81138e1e53862be1';
const CURRENT_CANDIDATE_PARENT='2e38044ecb65f4e026f9ffa7441a428277c3f985';
const MAX_BLOB_BYTES=16*1024*1024;
const MAX_BATCH_BYTES=200*1024*1024;
const MAX_OBJECTS=40000;
const MAX_BUFFER=256*1024*1024;
const FIRST_PARTY_SOURCE_ONLY=true;
const PATTERNS=[
 {kind:'private_key_pem',re:/-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g},
 {kind:'github_access_token',re:/\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{34,}\b/g},
 {kind:'github_fine_grained_pat',re:/\bgithub_pat_[A-Za-z0-9_]{70,}\b/g},
 {kind:'openai_key',re:/\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}\b/g},
 {kind:'aws_access_key_id',re:/\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g},
 {kind:'slack_token',re:/\bxox(?:b|p|a|r|s)-[A-Za-z0-9-]{25,}\b/g},
 {kind:'npm_token',re:/\bnpm_[A-Za-z0-9]{36,}\b/g},
 {kind:'gitlab_token',re:/\bglpat-[A-Za-z0-9_-]{20,}\b/g},
 {kind:'stripe_live_key',re:/\bsk_live_[A-Za-z0-9]{24,}\b/g},
 {kind:'private_p12_header',re:/-----BEGIN PKCS12-----/g}
];
const fsGit=(args,input,opts={})=>{
 const r=spawnSync('git',args,{
   cwd:process.cwd(),
   input,
   encoding:opts.raw?undefined:'utf8',
   timeout:opts.timeout||150000,
   maxBuffer:opts.maxBuffer||MAX_BUFFER,
   windowsHide:true,
   env:{...process.env,GIT_TERMINAL_PROMPT:'0',GIT_CONFIG_NOSYSTEM:'1'}
 });
 if(r.error||r.status!==0||r.signal)throw Error('GIT_HISTORY_COMMAND_FAILED_'+args[0]);
 return r.stdout;
};
function scanText(s){
 const found=new Set();
 for(const {kind,re} of PATTERNS){
   re.lastIndex=0;
   if(re.test(s))found.add(kind);
 }
 return [...found];
}
// A literal BEGIN token may appear in safe documentation or unit-test strings.
// Classify *structure* privately without disclosing body or object paths. A
// plausible PEM enclosure is not proof of an actual valid private key.
function classifyPrivatePemStructure(s){
 const re=/-----BEGIN ((?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY)-----([\s\S]{1,24000}?)-----END \1-----/g;
 let match;
 while((match=re.exec(s))!==null){
  const body=match[2].trim();
  const lines=body.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const base64=lines.join('');
  if(base64.length>=96&&base64.length<=24000&&
     /^[A-Za-z0-9+/]+={0,2}$/.test(base64)&&base64.length%4===0){
    return 'POSSIBLE_ENCODED_PEM_BLOCK';
  }
 }
 return 'DELIMITER_ONLY_OR_NON_BASE64_TEXT';
}
function selfCheck(){
 assert(scanText('-----BEGIN PRIVATE KEY-----\nINTERNAL_CANARY_NOT_A_SECRET')
    .includes('private_key_pem'));
 assert(scanText('Authorization: Bearer NOT_A_REAL_TOKEN').length===0);
 assert(!scanText('-----BEGIN PUBLIC KEY-----').includes('private_key_pem'));
 assert(scanText('ghp_'+'A'.repeat(36)).includes('github_access_token'));
}
selfCheck();
function screen(){
 const current=fsGit(['rev-parse','HEAD']).trim();
 assert.match(current,/^[a-f0-9]{40}$/);
 const target=fsGit(['rev-parse',FIXED_P1]).trim();
 if(target!==FIXED_P1)throw Error('FIXED_P1_SOURCE_OBJECT_NOT_PRESENT');
 const bound=fsGit(['merge-base','--is-ancestor',FIXED_P1,current]);
 void bound;
 const parent=fsGit(['merge-base','--is-ancestor',CURRENT_CANDIDATE_PARENT,current]);
 void parent;
 const commits=Number(fsGit(['rev-list','--count',FIXED_P1]).trim());
 if(!Number.isSafeInteger(commits)||commits<1||commits>MAX_OBJECTS)
   throw Error('HISTORY_COMMIT_COUNT_UNBOUNDED');
 const allObjects=fsGit(['rev-list','--objects',FIXED_P1],null,{maxBuffer:10*1024*1024});
 const ids=[...new Set(allObjects.trim().split(/\r?\n/).map(l=>l.split(' ')[0]))];
 if(ids.length<commits||ids.length>MAX_OBJECTS||ids.some(x=>!/^[a-f0-9]{40,64}$/.test(x)))
  throw Error('HISTORY_OBJECT_IDENTITY_UNEXPECTED');
 const check=fsGit(['cat-file','--batch-check=%(objectname) %(objecttype) %(objectsize)'],
   ids.join('\n')+'\n',{maxBuffer:12*1024*1024,timeout:120000});
 const records=check.trim().split(/\r?\n/).map(s=>{
   const [oid,type,size]=s.trim().split(' ');
   if(!ids.includes(oid)||!['blob','tree','commit','tag'].includes(type)||
       !/^\d+$/.test(size))throw Error('HISTORY_OBJECT_HEADER_UNEXPECTED');
   return {oid,type,size:Number(size)};
 });
 if(records.length!==ids.length)throw Error('HISTORY_BATCH_CHECK_INCOMPLETE');
 const blobs=records.filter(x=>x.type==='blob');
 let sizeSum=0,skippedOversized=0,totalExceeded=false;
 const selected=[];
 for(const b of blobs){
   if(b.size>MAX_BLOB_BYTES){skippedOversized++;continue}
   if(sizeSum+b.size>MAX_BATCH_BYTES){totalExceeded=true;break}
   selected.push(b);sizeSum+=b.size;
 }
 const findings={};
 let scanned=0,consumed=0,lfsPointers=0;
 let pemEncodedCandidateBlobs=0,pemDelimiterOnlyBlobs=0;
 if(selected.length){
   const input=selected.map(x=>x.oid).join('\n')+'\n';
   const result=fsGit(['cat-file','--batch'],input,{
     raw:true,maxBuffer:MAX_BUFFER,timeout:150000});
   const bytes=Buffer.isBuffer(result)?result:Buffer.from(result);
   let pos=0;
   for(const b of selected){
     const endHeader=bytes.indexOf(10,pos);
     if(endHeader<0)throw Error('GIT_BATCH_PAYLOAD_TRUNCATED');
     const header=bytes.subarray(pos,endHeader).toString('ascii');
     const match=header.match(/^([a-f0-9]{40,64}) blob (\d+)$/);
     if(!match||match[1]!==b.oid||Number(match[2])!==b.size)
       throw Error('GIT_BATCH_BLOB_HEADER_MISMATCH');
     const start=endHeader+1,end=start+b.size;
     if(end>=bytes.length||bytes[end]!==10)throw Error('GIT_BATCH_BLOB_SEPARATOR_INVALID');
     const blob=bytes.subarray(start,end);
     // Latin-1 decodes every byte one-to-one; scan even binary blobs. Does
     // not certify UTF-16, encodings, fragmented or encrypted credential data.
     const encoded=blob.toString('latin1');
     const hits=scanText(encoded);
     for(const id of hits)findings[id]=(findings[id]||0)+1;
     if(hits.includes('private_key_pem')){
       const pemClass=classifyPrivatePemStructure(encoded);
       if(pemClass==='POSSIBLE_ENCODED_PEM_BLOCK')pemEncodedCandidateBlobs++;
       else pemDelimiterOnlyBlobs++;
     }
     if(encoded.startsWith('version https://git-lfs.github.com/spec/v1'))
       lfsPointers++;
     pos=end+1;
     scanned++;consumed+=blob.length;
   }
   if(pos!==bytes.length)throw Error('GIT_BATCH_UNEXPECTED_TRAILING_BYTES');
 }
 const refs=fsGit(['ls-tree','-r',FIXED_P1]).split(/\r?\n/);
 const submodules=refs.filter(s=>s.startsWith('160000 commit ')).length;
 const coverage={
   scanned_commit_ancestry_count:commits,
   reachable_object_count:records.length,
   reachable_blob_count:blobs.length,
   scanned_blob_count:scanned,
   scanned_blob_bytes:consumed,
   oversized_blobs_unscanned:skippedOversized,
   scan_total_limit_reached:totalExceeded,
   git_lfs_pointers:lfsPointers,
   git_submodules:submodules
 };
 const complete=skippedOversized===0&&!totalExceeded&&scanned===blobs.length&&
   lfsPointers===0&&submodules===0;
 const findingCount=Object.values(findings).reduce((a,b)=>a+b,0);
 // Never say "SAFE" or "SECRET-FREE": only the implemented recognizable patterns.
 const disposition=!complete?'HOLD_INCOMPLETE_COVERAGE':
   findingCount>0?'HOLD_POTENTIAL_CREDENTIAL_PATTERN':
   'SCREENED_NO_HIGH_CONFIDENCE_PATTERN_WITH_LIMITATIONS';
 const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
 return {
  kind:'ARCH_V02X_M5_FIXED_GIT_HISTORY_SECRET_PATTERN_SCREEN',
  version:'0.1',
  scan_target_commit:FIXED_P1,
  candidate_parent:CURRENT_CANDIDATE_PARENT,
  inspected_checkout_head:current,
  evidence_scope:'ALL_GIT_OBJECTS_REACHABLE_FROM_FIXED_P1_HEAD_ONLY',
  scanned_object_index_sha256:sha(ids.join('\n')),
  first_party_scanner:true,
  signatures_covered:PATTERNS.map(x=>x.kind),
  findings_by_category:findings,
  private_key_pem_structure_triage:{
    possible_encoded_pem_block_blobs:pemEncodedCandidateBlobs,
    delimiter_only_or_non_base64_blobs:pemDelimiterOnlyBlobs,
    identity_validity_and_revocation:'NOT_VERIFIED'
  },
  high_confidence_finding_total:findingCount,
  coverage,disposition,
  current_tree_only:false,
  full_secret_audit:'NOT_ESTABLISHED',
  credential_scan_limitations:[
   'regex_high_confidence_only','not_an_external_gitleaks_trufflehog_audit',
   'not_credential_validity_or_revocation','does_not_scan_unreachable_objects',
   'does_not_scan_other_branches_unless_reachable_from_p1','binary_bytes_latin1_only',
   'not_unicode_utf16_or_encrypted_encoding_exhaustive',
   'not_downloaded_LFS_binary_content','no_developer_identity_attestation'
  ],
  M5_WINDOWS_FULL_KIT_EXTERNAL_DISTRIBUTION:'OWNER_REVIEW_REQUIRED',
  M5_REAL_HUMAN_FIRST_USER:'NOT_TESTED',
  M4_ORIGINAL_62:'NOT_RUN',
  SIGNED_NATIVE_ADDON:'DEFERRED',
  NO_MAIN_MERGE:true,NO_RELEASE:true
 };
}
let receipt;
try{receipt=screen()}
catch(e){
  // Fail closed with an error TYPE only, no content or path leakage.
  receipt={kind:'ARCH_V02X_M5_FIXED_GIT_HISTORY_SECRET_PATTERN_SCREEN',
    version:'0.1',scan_target_commit:FIXED_P1,
    disposition:'HOLD_SCAN_EXECUTION_FAILURE',
    error_type:e?.name||'Error',
    M5_WINDOWS_FULL_KIT_EXTERNAL_DISTRIBUTION:'HOLD',
    full_secret_audit:'NOT_ESTABLISHED',
    M5_REAL_HUMAN_FIRST_USER:'NOT_TESTED',M4_ORIGINAL_62:'NOT_RUN'};
  process.exitCode=30;
}
const out=JSON.stringify(receipt);
console.log('ARCH_V02X_M5_HISTORY_SCREEN_RECEIPT '+out);
if(process.env.ARCH_V02X_M5_SECURITY_RECEIPT_FILE){
 const dest=path.resolve(process.env.ARCH_V02X_M5_SECURITY_RECEIPT_FILE);
 const root=path.resolve(process.env.RUNNER_TEMP||os.tmpdir());
 if(!dest.startsWith(root+path.sep))throw Error('RECEIPT_OUTSIDE_RUNNER_TEMP_REFUSED');
 fs.writeFileSync(dest,JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
}
if(receipt.disposition.startsWith('HOLD'))process.exitCode=31;
