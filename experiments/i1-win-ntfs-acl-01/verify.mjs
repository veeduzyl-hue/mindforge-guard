// I1-WIN-NTFS-ACL-01: controlled Windows NTFS DACL proof.
// Every created/changed path is below a fresh synthetic temp root.
// Only tests actually executed count as PASS.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {makeSyntheticRoot,createPrivateStage,inspectSyntheticAcl} from './load.mjs';
const baseDir=path.dirname(fileURLToPath(import.meta.url));
const binaryPath=path.join(baseDir,'private_acl.node');
const binSha=crypto.createHash('sha256').update(fs.readFileSync(binaryPath)).digest('hex');
const cases=[];let root=null,parent=null,modifiedByIcacls=false;
const reports={};
function record(id,fn){
 try{const evidence=fn();cases.push({id,status:'PASS_BOUNDED',evidence});
 console.log('PASS',id,JSON.stringify(evidence).slice(0,420));}
 catch(e){cases.push({id,status:'FAIL',reason:String(e.stack||e).slice(0,2400)});
 console.error('FAIL',id,String(e.message||e).slice(0,450));}
}
async function asyncRecord(id,fn){
 try{const evidence=await fn();cases.push({id,status:'PASS_BOUNDED',evidence});
 console.log('PASS',id,JSON.stringify(evidence).slice(0,420));}
 catch(e){cases.push({id,status:'FAIL',reason:String(e.stack||e).slice(0,2400)});
 console.error('FAIL',id,String(e.message||e).slice(0,450));}
}
function limit(id,reason){cases.push({id,status:'NOT_TESTED',reason});console.log('NOT_TESTED',id);}
if(process.platform!=='win32')throw Error('WINDOWS_ONLY_CI');
process.env.I1_WIN_ACL_ALLOW_SYNTHETIC_FIXTURE='1';
process.env.I1_WIN_ACL_EXPERIMENT='1';
({root,parent}=makeSyntheticRoot());
const name=(key)=>'.guard-i1-partial-'+key;
const opts=(key)=>({enabled:true,mode:'SYNTHETIC_ONLY',root,parent,name:name(key),binarySha256:binSha});
const secure=(key)=>{
 const r=createPrivateStage(opts(key));
 assert.equal(r.status,'CREATED_PRIVATE_DACL_VERIFIED',JSON.stringify(r));
 assert.equal(r.created,true);assert.equal(r.privacyConfirmed,true);
 assert.equal(r.filesystem,'NTFS');assert.equal(r.persistentAcls,true);
 assert.equal(r.protectedDacl,true);assert.equal(r.onlyTrustedAces,true);
 assert.equal(r.hasInheritedAces,false);assert.equal(r.parentIdentityRechecked,true);
 return r;
};
record('ACL-01-OWNED-SYNTHETIC-NTFS_PARENT',()=>{
 const ret=inspectSyntheticAcl({...opts('unused'),path:parent});
 assert.equal(ret.status,'ACL_OBSERVED');assert.equal(ret.filesystem,'NTFS');
 assert.equal(ret.persistentAcls,true);
 return {platform:process.platform,filesystem:ret.filesystem,parentInitiallyProtected:ret.protectedDacl,
   parentAllowedTrusteesRestricted:ret.onlyTrustedAces};
});
record('ACL-02-PERMISSIVE_PARENT_CONTROLLED_INHERITANCE',()=>{
 const icacls=spawnSync('icacls.exe',[parent,'/grant','*S-1-5-11:(OI)(CI)M'],
  {encoding:'utf8',timeout:30000,windowsHide:true});
 assert.equal(icacls.status,0,icacls.stderr||icacls.stdout);
 modifiedByIcacls=true;
 const weak=path.join(parent,'node-0700-default-permissions');
 fs.mkdirSync(weak,{mode:0o700});
 const ret=inspectSyntheticAcl({...opts('unused'),path:weak});
 assert.equal(ret.status,'ACL_OBSERVED');
 assert.equal(ret.onlyTrustedAces,false,'A mode:0700 Node folder unexpectedly has only user/system ACEs');
 assert.equal(ret.hasInheritedAces,true);
 reports.inheritedControl={protectedDacl:ret.protectedDacl,onlyTrustedAces:ret.onlyTrustedAces,
  hasInheritedAces:ret.hasInheritedAces,aceCount:ret.aceCount};
 return {...reports.inheritedControl,configuredInheritedAuthenticatedUsersModify:true};
});
record('ACL-03-PRIVATE_DACL_AT_DIRECTORY_CREATION',()=>{
 const ret=secure('created-once');
 reports.privateDirectory=ret;
 return {status:ret.status,protectedDacl:ret.protectedDacl,inherited:ret.hasInheritedAces,
  allowedOnlyOwnerAndSystem:ret.onlyTrustedAces,aceCount:ret.aceCount,
  filesystem:ret.filesystem,noPostCreateIcaclsFallback:ret.noIcaclsRepair};
});
record('ACL-04-CREATED_DIRECTORY_READBACK_MATCHES_IDENTITIES',()=>{
 const ret=inspectSyntheticAcl({...opts('created-once'),path:path.join(parent,name('created-once'))});
 assert.equal(ret.status,'ACL_OBSERVED');assert.equal(ret.protectedDacl,true);
 assert.equal(ret.onlyTrustedAces,true);assert.equal(ret.createdObjectIdentity,reasonsCreatedId());
 return {protected:true,onlyTrusted:true,objectIdStable:true};
});
function reasonsCreatedId(){return reports.privateDirectory?.createdObjectIdentity;}
record('ACL-05-CHILD_FILE_INHERITS_ONLY_PRIVATE_PRINCIPALS',()=>{
 const p=path.join(parent,name('created-once'),'synthetic-derived-report.json');
 fs.writeFileSync(p,'{"synthetic":true}\n',{flag:'wx'});
 const ret=inspectSyntheticAcl({...opts('created-once'),path:p});
 assert.equal(ret.status,'ACL_OBSERVED');
 assert.equal(ret.onlyTrustedAces,true);
 assert.equal(ret.hasInheritedAces,true);
 return {childAclLimited:true,childInherited:true,aceCount:ret.aceCount};
});
record('ACL-06-EXISTING_DESTINATION_REFUSED_WITHOUT_MUTATION',()=>{
 const before=fs.readFileSync(path.join(parent,name('created-once'),'synthetic-derived-report.json'));
 const ret=createPrivateStage(opts('created-once'));
 assert.equal(ret.status,'REFUSED_ALREADY_EXISTS');
 assert.equal(ret.created,false);
 assert.deepEqual(fs.readFileSync(path.join(parent,name('created-once'),'synthetic-derived-report.json')),before);
 return {code:ret.rawCode,status:ret.status,foreignDataPreserved:true};
});
record('ACL-07-DEFAULT_OFF_REQUIRES_EXPLICIT_TWO_GATES',()=>{
 const a=createPrivateStage({...opts('disabled'),enabled:false});
 assert.equal(a.status,'DISABLED_DEFAULT_OFF');
 const b=createPrivateStage({...opts('wrong-mode'),mode:'CUSTOMER_DATA'});
 assert.equal(b.status,'REFUSED_NOT_SYNTHETIC');
 assert(!fs.existsSync(path.join(parent,name('disabled'))));
 return {default:a.status,nonSynthetic:b.status};
});
record('ACL-08-NATIVE_BINARY_HASH_MISMATCH_FAIL_CLOSED',()=>{
 const ret=createPrivateStage({...opts('hash-rejected'),binarySha256:'0'.repeat(64)});
 assert.equal(ret.status,'REFUSED_NATIVE_MODULE_DIGEST_MISMATCH');
 assert(!fs.existsSync(path.join(parent,name('hash-rejected'))));
 return {status:ret.status,created:false};
});
record('ACL-09-OUT_OF_SCOPE_PARENT_REFUSED',()=>{
 const ret=createPrivateStage({...opts('scope-rejected'),parent:os.tmpdir()});
 assert.equal(ret.status,'REFUSED_NOT_OWNED_SYNTHETIC_SCOPE');
 return {status:ret.status,doesNotTouchUnownedPaths:true};
});
record('ACL-10-PRE_EXISTING_SYMLINK_STAGE_REFUSED',()=>{
 const originalDir=path.join(parent,'target-for-symlink');fs.mkdirSync(originalDir);
 const link=path.join(parent,name('existing-link'));
 let made=false;
 try{fs.symlinkSync(originalDir,link,'junction');made=true;}
 catch{ /* Candidate feature may be unavailable to restricted runner */ }
 if(!made)throw Error('JUNCTION_CREATION_UNAVAILABLE_NOT_VERIFIED');
 const ret=createPrivateStage(opts('existing-link'));
 assert.equal(ret.status,'REFUSED_ALREADY_EXISTS');
 assert(fs.existsSync(originalDir));
 return {junctionExistingRejected:true};
});
record('ACL-11-NO_NATIVE_PARENT_ALIAS_REDIRECTION_PROOF',()=>{
 const source=fs.readFileSync(path.join(baseDir,'native_private_acl.cc'),'utf8');
 assert(source.includes('CreateDirectoryW(target.c_str(),&sa)'));
 assert(source.includes('D:P(A;OICI;FA;;;'));
 assert(!source.includes('icacls.exe'));
 return {creationUsesSecurityAttributes:true,flagsNoPostCreateFix:true,
  parentPathRebindingDuringCreate:'NOT_TESTED'};
});
async function concurrent(){
 const nameOfStage=name('race-same-name');
 const payload=JSON.stringify({...opts('race-same-name')});
 const runs=Array.from({length:12},()=>new Promise((resolve,reject)=>{
  const c=spawn(process.execPath,[path.join(baseDir,'create_worker.mjs'),payload],
   {env:{...process.env,I1_WIN_ACL_EXPERIMENT:'1'},windowsHide:true});
  let stdout='',stderr='';c.stdout.on('data',x=>stdout+=x);
  c.stderr.on('data',x=>stderr+=x);c.once('error',reject);
  c.once('close',code=>{try{assert.equal(code,0,stderr);
    resolve(JSON.parse(stdout.trim()));}catch(e){reject(e);}});
 }));
 const results=await Promise.all(runs);
 const winners=results.filter(x=>x.status==='CREATED_PRIVATE_DACL_VERIFIED');
 const losers=results.filter(x=>x.status==='REFUSED_ALREADY_EXISTS');
 assert.equal(winners.length,1,JSON.stringify(results.map(x=>x.status)));
 assert.equal(losers.length,11);
 const verify=inspectSyntheticAcl({...opts('race-same-name'),path:path.join(parent,nameOfStage)});
 assert.equal(verify.onlyTrustedAces,true);assert.equal(verify.protectedDacl,true);
 return {onePrivateWinner:1,elevenRefused:11,createdAtMostOnce:true,
  codeSet:[...new Set(losers.map(x=>x.rawCode))]};
}
await asyncRecord('ACL-12-REAL_PARALLEL_12_PROCESSES_COLLISION',concurrent);
record('ACL-13-RENAMED_DIRECTORY_RETURNS_RETAINED_PRIVATE_DACL',()=>{
 const before=path.join(parent,name('created-once'));
 const after=path.join(parent,name('renamed-once'));
 // This is only an ACL retention diagnostic; not an I-1 publication API.
 fs.renameSync(before,after);
 const ret=inspectSyntheticAcl({...opts('renamed-once'),path:after});
 assert.equal(ret.protectedDacl,true);assert.equal(ret.onlyTrustedAces,true);
 assert.equal(ret.createdObjectIdentity,reasonsCreatedId());
 return {privateDaclRetainedAfterSyntheticRename:true,
  strictNoReplaceDuringRename:'NOT_TESTED_IN_THIS_ACL_PROBE'};
});
await asyncRecord('ACL-14-MODULE_MISSING_REFUSES_CREATION',async()=>{
 const p=path.join(root,'alternate-loader');
 fs.mkdirSync(p);
 fs.copyFileSync(path.join(baseDir,'load.mjs'),path.join(p,'load.mjs'));
 const {pathToFileURL}=await import('node:url');
 const alternate=await import(pathToFileURL(path.join(p,'load.mjs')).href);
 const ret=alternate.createPrivateStage(opts('module-missing'));
 assert.equal(ret.status,'REFUSED_NATIVE_MODULE_MISSING');
 assert(!fs.existsSync(path.join(parent,name('module-missing'))));
 return {status:ret.status};
});
record('ACL-15-CONTROLLED_PARENT_REQUIRES_NO_OWNER_CLEANUP',()=>{
 assert.equal(modifiedByIcacls,true);
 const created=path.join(parent,name('race-same-name'));
 assert(fs.statSync(created).isDirectory());
 const ret=inspectSyntheticAcl({...opts('race-same-name'),path:created});
 assert.equal(ret.protectedDacl,true);assert.equal(ret.onlyTrustedAces,true);
 return {retainedProtectedDaclWhileParentPermissive:true,autoCleanupPerformed:false};
});
limit('ACL-16-REAL_WINDOWS10_DESKTOP','Windows 10 22H2 desktop not in CI; technical capability and support policy unverified.');
limit('ACL-17-REAL_WINDOWS11_DESKTOP','Windows 11 desktop SID/ACL behavior not tested in consumer session.');
limit('ACL-18_DISTINCT_OS_USER_ACCESS_ATTEMPT','No independent second-user token, logon session or effective permission denial attempted.');
limit('ACL-19-SMB_REFS_FAT_UNSUPPORTED_FS','No second non-NTFS volume; only NTFS test. Fail-closed branch exists but not host-tested.');
limit('ACL-20-MALICIOUS_PARENT_SWAP_DURING_CREATE','CreateDirectoryW uses a path; parent HANDLE is rechecked after, but creation not HANDLE-bound. G3 race not eliminated.');
limit('ACL-21-REAL_GUARD_WRITER_INTEGRATION','No actual Guard Writer code path imported native private ACL module; product staging still inherits Windows ACL.');
limit('ACL-22-SECURE_REMOVAL_AND_REAL_DATA','No customer Evidence, legal hold, retention test, auto deletion or secure erasure.');
const fail=cases.filter(x=>x.status==='FAIL'),notTested=cases.filter(x=>x.status==='NOT_TESTED');
const receipt={kind:'I1_WIN_NTFS_ACL_NATIVE_POC',fixedHead:process.env.GITHUB_SHA||'LOCAL',
 platform:process.platform,node:process.version,napi:process.versions.napi,
 syntheticOnly:true,createdWithSecurityAttributesAtCreation:true,
 noPostCreateAclFix:true,platformNativeOnly:true,
 productWriterChanged:false,
 testParentPermissive:modifiedByIcacls,
 evidenceLimit:'Protected DACL and allowed trustees observed on this NTFS runner. Distinct user effective denial not demonstrated.',
 noAutomaticCleanupInAdapter:true,
 cleanupOwnedSyntheticFixturesByTestHarnessOnly:true,
 counts:{pass:cases.length-fail.length-notTested.length,fail:fail.length,not_tested:notTested.length},
 cases};
const output=process.env.I1_ACL_RECEIPT_DIR||baseDir;
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'acl-test-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log('I1_WIN_ACL_RESULT',JSON.stringify(receipt.counts));
fs.rmSync(root,{force:true,recursive:true});
if(fail.length)process.exitCode=1;
