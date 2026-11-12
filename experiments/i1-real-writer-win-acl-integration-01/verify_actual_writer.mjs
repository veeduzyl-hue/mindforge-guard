// Actual I-1 Writer Windows private-staging adapter test; synthetic-only.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawn,spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const base=path.dirname(fileURLToPath(import.meta.url));
const addonPath=path.join(base,'private_acl.node');
const addon=require(addonPath);
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const digest=hash(fs.readFileSync(addonPath));
const cli=path.resolve('packages/guard/bin/guard.mjs');
const packSource=path.resolve('examples/single-agent-governance-pack/hr-self-service-agent');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'i1-real-windows-acl-'));
const outParent=path.join(root,'permissive-output-parent');
fs.mkdirSync(outParent);
const markerName='.I1_WIN_PRIVATE_STAGE_SYNTHETIC_ONLY';
fs.writeFileSync(path.join(outParent,markerName),'I1_REAL_WRITER_WIN_ACL_SYNTHETIC_ONLY\n');
const cases=[];const originalAcl=addon.inspectAcl(outParent);
function test(id,fn){
 try{const evidence=fn();cases.push({id,status:'PASS_BOUNDED',evidence:evidence||{}});
 console.log('PASS',id,JSON.stringify(evidence||{}).slice(0,260));}
 catch(e){cases.push({id,status:'FAIL',reason:String(e.stack||e).slice(0,1450)});console.error('FAIL',id,e.message);}
}
async function atest(id,fn){
 try{const evidence=await fn();cases.push({id,status:'PASS_BOUNDED',evidence:evidence||{}});
 console.log('PASS',id,JSON.stringify(evidence||{}).slice(0,260));}
 catch(e){cases.push({id,status:'FAIL',reason:String(e.stack||e).slice(0,1450)});console.error('FAIL',id,e.message);}
}
function newPack(name) {const pack=path.join(root,'pack-'+name);fs.cpSync(packSource,pack,{recursive:true});return pack;}
function run(opts={}){
 const pack=opts.pack||newPack(opts.tag||'happy');
 const out=opts.out||path.join(outParent,'bundle-'+(opts.tag||'happy'));
 const env={...process.env,I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT:'1',
 I1_REAL_WIN_ACL_SYNTHETIC_ONLY:'1',I1_REAL_WIN_ACL_MODULE_PATH:addonPath,
 I1_REAL_WIN_ACL_MODULE_SHA256:digest,...(opts.env||{})};
 const r=spawnSync(process.execPath,[cli,'review','--pack',pack,'--out',out,'--format','json'],
  {encoding:'utf8',timeout:85000,env,windowsHide:true,maxBuffer:1e7});
 if(r.error)throw r.error;
 return {r,pack,out};
}
function stages(){return fs.readdirSync(outParent).filter(x=>x.startsWith('.guard-i1-partial-'));}
test('WINI-01-SYNTHETIC_PERMISSIVE_PARENT_BASELINE',()=>{
 const p=spawnSync('icacls.exe',[outParent,'/grant','*S-1-5-11:(OI)(CI)M'],
  {encoding:'utf8',timeout:30000,windowsHide:true});
 assert.equal(p.status,0,p.stderr||p.stdout);
 const weak=path.join(outParent,'synthetic-weak-mode0700');fs.mkdirSync(weak,{mode:0o700});
 const observed=addon.inspectAcl(weak);
 assert.equal(observed.onlyTrustedAces,false);assert.equal(observed.hasInheritedAces,true);
 return {weakParentBroadInherited:true,oldModeDoesNotProtectNTFS:true};
});
let success;
test('WINI-02-REAL_WRITER_PROTECTED_STAGE_AND_FINAL_BUNDLE',()=>{
 success=run({tag:'native'});
 assert.equal(success.r.status,0,success.r.stderr);
 const out=success.out;
 const privateAcl=addon.inspectAcl(out);
 assert.equal(privateAcl.protectedDacl,true);
 assert.equal(privateAcl.onlyTrustedAces,true);
 assert.equal(privateAcl.hasInheritedAces,false);
 assert.equal(privateAcl.filesystem,'NTFS');
 assert(fs.existsSync(path.join(out,'review-manifest.json')));
 assert(!fs.existsSync(path.join(out,'.private-source')));
 const child=addon.inspectAcl(path.join(out,'components','pack-validation.json'));
 assert.equal(child.onlyTrustedAces,true);
 assert.equal(stages().length,0);
 return {actualWriterPath:true,finalDaclProtected:true,childDerivedAclPrivate:true};
});
test('WINI-03-MISSING_ADDON_FAILS_BEFORE_STAGE_CREATE',()=>{
 const x=run({tag:'noaddon',env:{I1_REAL_WIN_ACL_MODULE_PATH:path.join(root,'missing.node')}});
 assert.equal(x.r.status,30,x.r.stderr);
 assert.equal(stages().length,0);assert(!fs.existsSync(x.out));
 return {missingAddonRefused:true,rawPackNotWritten:true};
});
test('WINI-04-BINARY_DIGEST_MISMATCH_REFUSED',()=>{
 const x=run({tag:'sha',env:{I1_REAL_WIN_ACL_MODULE_SHA256:'0'.repeat(64)}});
 assert.equal(x.r.status,30,x.r.stderr);assert.equal(stages().length,0);
 return {digestMismatchRefused:true};
});
test('WINI-05-SYNTHETIC_GATE_MISSING_REFUSED',()=>{
 const x=run({tag:'no-scope',env:{I1_REAL_WIN_ACL_SYNTHETIC_ONLY:'0'}});
 assert.equal(x.r.status,30,x.r.stderr);assert.equal(stages().length,0);
 return {noCustomerDataWithoutExplicitGate:true};
});
test('WINI-06-EXISTING_OUTPUT_REFUSES_NO_OVERWRITE',()=>{
 const x=run({tag:'collision',out:success.out});
 assert.equal(x.r.status,2);assert(fs.existsSync(path.join(success.out,'review-manifest.json')));
 return {existingBundlePreserved:true};
});
test('WINI-07-DERIVED_FILES_INHERIT_PROTECTED_ACL',()=>{
 for(const file of ['review-manifest.json','diagnostics.json','components/single-agent-governance-report.json']){
  const r=addon.inspectAcl(path.join(success.out,...file.split('/')));
  assert.equal(r.onlyTrustedAces,true,file);
 }
 return {derivedArtifactsChecked:3};
});
test('WINI-08-DEFAULT_OLD_BEHAVIOR_NOT_PRODUCT_PRIVACY_PROOF',()=>{
 // Explicitly verify that absent experimental opt-in the existing candidate
 // remains legacy, so no product admission follows from these tests.
 const p=newPack('legacy'),out=path.join(outParent,'bundle-legacy');
 const r=spawnSync(process.execPath,[cli,'review','--pack',p,'--out',out,'--format','json'],
  {encoding:'utf8',timeout:85000,windowsHide:true,env:{...process.env,
   I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT:'0'}});
 assert.equal(r.status,0,r.stderr);
 const acl=addon.inspectAcl(out);
 assert.equal(acl.onlyTrustedAces,false);
 return {defaultProductStillUnprotected:true,realCustomerAdmission:'HOLD'};
});
test('WINI-09-NATIVE_RELATIVE_HANDLE_ATOMIC_COLLISION',()=>{
 const name='.guard-i1-partial-bounded-collision-test';
 const a=addon.createPrivateBound(outParent,name);
 assert.equal(a.status,'CREATED_PRIVATE_DACL_VERIFIED');
 const b=addon.createPrivateBound(outParent,name);
 assert.equal(b.status,'REFUSED_ALREADY_EXISTS');
 assert.equal(a.privacyConfirmed,true);
 return {oneCreated:true,noreplaceRefused:true,rawStatus:b.rawCode};
});
await atest('WINI-10-SYNCHRONIZED_MALICIOUS_PARENT_PATH_SWAP_REJECTED',async()=>{
 const parent=path.join(root,'swappable-parent');fs.mkdirSync(parent);
 fs.writeFileSync(path.join(parent,markerName),'I1_REAL_WRITER_WIN_ACL_SYNTHETIC_ONLY\n');
 const pack=newPack('swap');
 const dest=path.join(parent,'bundle-swap');
 const relocated=path.join(root,'held-original-parent');
 const child=spawn(process.execPath,[cli,'review','--pack',pack,'--out',dest,'--format','json'],
  {windowsHide:true,env:{...process.env,I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT:'1',
   I1_REAL_WIN_ACL_SYNTHETIC_ONLY:'1',I1_REAL_WIN_ACL_MODULE_PATH:addonPath,
   I1_REAL_WIN_ACL_MODULE_SHA256:digest,I1_NATIVE_ACL_TEST_PAUSE_BEFORE_CREATE:'1'}});
 let stdout='',stderr='',moved=false;
 const outcome=await new Promise((resolve,reject)=>{
  let done=false;
  child.stdout.on('data',bytes=>{
   const x=bytes.toString();stdout+=x;
   if(!moved&&stdout.includes('I1_NATIVE_PARENT_HANDLE_PINNED')){
    moved=true;
    try{fs.renameSync(parent,relocated);fs.mkdirSync(parent);
      fs.writeFileSync(path.join(parent,markerName),'SYNTHETIC_DECOY');
    }catch(e){reject(e);}
   }
  });
  child.stderr.on('data',b=>stderr+=b);
  child.once('error',reject);
  child.once('close',code=>resolve(code));
 });
 assert.equal(moved,true,'native parent handle pause not reached');
 assert.notEqual(outcome,0,stdout+stderr);
 const movedEntries=fs.readdirSync(relocated).filter(x=>x.startsWith('.guard-i1-partial-'));
 assert.equal(movedEntries.length,1);
 const acl=addon.inspectAcl(path.join(relocated,movedEntries[0]));
 assert.equal(acl.onlyTrustedAces,true);
 assert.equal(fs.readdirSync(parent).filter(x=>x.startsWith('.guard-i1-partial-')).length,0);
 assert.equal(fs.existsSync(dest),false);
 return {attackTriggeredAfterParentHandle:true,
  stageCreatedUnderOriginalBoundObject:true,
  maliciousPublicPathDidNotReceiveStage:true,
  productCallerRefusedUnconfirmedLocator:true};
});
const fails=cases.filter(x=>x.status==='FAIL');
const receipt={kind:'I1_REAL_WRITER_WIN_ACL_INTEGRATION_01',
 head:process.env.GITHUB_SHA||'LOCAL',syntheticOnly:true,
 platform:process.platform,node:process.version,nativeBinarySha256:digest,
 counts:{pass:cases.length-fails.length,fail:fails.length},
 cases,defaultWindowsProductPrivacy:'HOLD',
 windows11Desktop:'NOT_TESTED',otherAccountEffectiveAccess:'NOT_TESTED',
 signedAddonDistribution:'NOT_ESTABLISHED',actualCustomerInput:'NOT_AUTHORIZED',
 separateProductAdmission:'HOLD',nativeParentHandleBinding:'TESTED_SYNTHETIC',
 finalBundleACLReadback:'TESTED_SYNTHETIC'};
if(process.env.I1_WIN_INTEGRATION_RECEIPT){
 fs.mkdirSync(path.dirname(process.env.I1_WIN_INTEGRATION_RECEIPT),{recursive:true});
 fs.writeFileSync(process.env.I1_WIN_INTEGRATION_RECEIPT,JSON.stringify(receipt,null,2)+'\n');
}
console.log('I1_REAL_WINDOWS_ACL_INTEGRATION_FINAL',JSON.stringify(receipt.counts));
fs.rmSync(root,{recursive:true,force:true});
if(fails.length)process.exitCode=1;
