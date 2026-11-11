// No product-side tests. Every path under an owned throwaway temp root.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {nativeCommit,createSyntheticFixtureMarker,spikeModulePath} from './load.mjs';
import {inspectSyntheticStaging} from './audit_staging.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const cases=[];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const binary=spikeModulePath(),binarySha=sha(fs.readFileSync(binary));
let idx=0;
function fixture(tag){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'i1-spike-'+tag+'-'));
 process.env.I1_NATIVE_SPIKE_FIXTURE_BUILDER='1';
 createSyntheticFixtureMarker(root);
 const src=path.join(root,'sources'),dst=path.join(root,'target');
 fs.mkdirSync(src);fs.mkdirSync(dst);
 return {root,src,dst};
}
function stage(f,name,content='SYNTHETIC_ONLY'){
 const p=path.join(f.src,name);fs.mkdirSync(p);fs.writeFileSync(path.join(p,'receipt.txt'),content);return p;
}
function options(f,sourceName,destinationName='final'){
 return {enabled:true,mode:'SYNTHETIC_ONLY',fixtureRoot:f.root,
  sourceParent:f.src,sourceName,
  destinationParent:f.dst,destinationName,
  expectedBinarySha256:binarySha};
}
async function one(id,fn){
 try{
  const evidence=await fn();
  cases.push({id,status:'PASS_BOUNDED',evidence:evidence??{}});
  console.log('PASS',id,JSON.stringify(evidence??{}).slice(0,420));
 }catch(e){cases.push({id,status:'FAIL',reason:String(e?.stack||e).slice(0,1600)});
  console.error('FAIL',id,e?.message||e);}
}
function observed(id,status,note){cases.push({id,status,note});console.log('OBSERVED',id,status);}
function cleanup(f){fs.rmSync(f.root,{force:true,recursive:true});}
async function childRace(i,f){
 const arg=JSON.stringify({root:f.root,sourceName:'worker'+i,destName:'final',binarySha256:binarySha});
 return await new Promise((resolve,reject)=>{
  const c=spawn(process.execPath,[path.join(dir,'race_worker.mjs'),arg],
   {env:{...process.env,I1_NATIVE_SPIKE_ENABLED:'1'},windowsHide:true});
  let stdout='',stderr='';
  c.stdout.on('data',d=>stdout+=d);c.stderr.on('data',d=>stderr+=d);
  c.once('error',reject);
  c.once('close',(code)=>{try{assert.equal(code,0,stderr);
    resolve(JSON.parse(stdout.trim()));}catch(e){reject(e);}});
 });
}
await one('SPK-01-NAPI8-BINARY',()=>{
 assert(Number(process.versions.napi)>=8);
 assert(fs.statSync(binary).isFile());
 return {node:process.version,napi:process.versions.napi,binarySha256:binarySha,platform:process.platform,arch:process.arch};
});
await one('SPK-02-DEFAULT-DISABLED',()=>{
 const f=fixture('off');stage(f,'s0');delete process.env.I1_NATIVE_SPIKE_ENABLED;
 try{const r=nativeCommit(options(f,'s0'));assert.equal(r.status,'DISABLED_DEFAULT_OFF');
   assert(fs.existsSync(path.join(f.src,'s0')));assert(!fs.existsSync(path.join(f.dst,'final')));return r;}
 finally{cleanup(f);}
});
process.env.I1_NATIVE_SPIKE_ENABLED='1';
await one('SPK-03-DUAL-GATE-REQUIRES-OPT-IN',()=>{
 const f=fixture('gate');stage(f,'s0');
 try{let r=nativeCommit({...options(f,'s0'),enabled:false});assert.equal(r.status,'DISABLED_DEFAULT_OFF');
   r=nativeCommit({...options(f,'s0'),mode:'PRODUCTION'});assert.equal(r.status,'REFUSED_NOT_SYNTHETIC_MODE');
   assert(fs.existsSync(path.join(f.src,'s0')));return {gates:'explicit opt-in and synthetic marker required'};}
 finally{cleanup(f);}
});
await one('SPK-04-DIGEST-MISSING-AND-MISMATCH',()=>{
 const f=fixture('hash');stage(f,'s0');
 try{let r=nativeCommit({...options(f,'s0'),expectedBinarySha256:''});assert.equal(r.status,'REFUSED_MISSING_BINARY_DIGEST');
  r=nativeCommit({...options(f,'s0'),expectedBinarySha256:'0'.repeat(64)});
  assert.equal(r.status,'REFUSED_BINARY_DIGEST_MISMATCH');
  assert(!fs.existsSync(path.join(f.dst,'final')));return {missing:'REFUSED',mismatch:'REFUSED'};}
 finally{cleanup(f);}
});
await one('SPK-05-SINGLE-COMPONENT-PATH',()=>{
 const f=fixture('badname');stage(f,'s0');
 try{for(const name of ['../escape','/tmp','.', 'x\\y','x:y']){
    const r=nativeCommit(options(f,'s0',name));assert.equal(r.status,'REFUSED_UNSAFE_BASENAME',name);}
   return {traversalsRejected:5};}
 finally{cleanup(f);}
});
await one('SPK-06-EXPLICIT-ROOT-ONLY',()=>{
 const f=fixture('outside');stage(f,'s0');
 try{const r=nativeCommit({...options(f,'s0'),destinationParent:os.tmpdir()});
 assert.equal(r.status,'REFUSED_OUT_OF_SCOPE');return r;}
 finally{cleanup(f);}
});
await one('SPK-07-EMPTY-DIRECTORY-COLLISION',()=>{
 const f=fixture('empty');stage(f,'s0');fs.mkdirSync(path.join(f.dst,'final'));
 try{const r=nativeCommit(options(f,'s0'));
  assert.equal(r.status,'REFUSED_ALREADY_EXISTS');assert.equal(r.committed,false);
  assert(fs.existsSync(path.join(f.src,'s0')));assert.equal(fs.readdirSync(path.join(f.dst,'final')).length,0);
  return {api:r.api,errorCode:r.rawCode,errorNamespace:r.errorNamespace};}
 finally{cleanup(f);}
});
await one('SPK-08-FOREIGN-FILE-PRESERVED',()=>{
 const f=fixture('foreign');stage(f,'s0');fs.mkdirSync(path.join(f.dst,'final'));
 const foreign=path.join(f.dst,'final','foreign.txt');fs.writeFileSync(foreign,'DO_NOT_CLOBBER');
 try{const before=sha(fs.readFileSync(foreign)),r=nativeCommit(options(f,'s0'));
 assert.equal(r.status,'REFUSED_ALREADY_EXISTS');
 assert.equal(sha(fs.readFileSync(foreign)),before);
 return {foreignSha256:before,code:r.rawCode};}finally{cleanup(f);}
});
await one('SPK-09-FIRST-REAL-NATIVE-COMMIT',()=>{
 const f=fixture('commit');stage(f,'s0');
 try{const r=nativeCommit(options(f,'s0'));
 assert.equal(r.status,'COMMITTED_CONFIRMED');assert.equal(r.committed,true);assert.equal(r.locatorConfirmed,true);
 assert.equal(r.noFallback,true);assert(!fs.existsSync(path.join(f.src,'s0')));
 assert.equal(fs.readFileSync(path.join(f.dst,'final','receipt.txt'),'utf8'),'SYNTHETIC_ONLY');
 assert(r.sourceIdentity.includes(':')&&r.parentIdentity.includes(':'));
 return {api:r.api,filesystem:r.filesystem,sourceId:r.sourceIdentity,parentId:r.parentIdentity};}
 finally{cleanup(f);}
});
await one('SPK-10-UNICODE-FILE-NAMES',()=>{
 const f=fixture('unicode');stage(f,'测试 证据');
 try{const r=nativeCommit(options(f,'测试 证据','审阅 结果'));
 assert.equal(r.status,'COMMITTED_CONFIRMED');assert(fs.existsSync(path.join(f.dst,'审阅 结果','receipt.txt')));
 return {unicode:true};}finally{cleanup(f);}
});
await one('SPK-11-SOURCE-REFUSED-WITHOUT-MUTATION',()=>{
 const f=fixture('source-missing');
 try{const r=nativeCommit(options(f,'not-present'));
 assert.equal(r.committed,false);assert(!fs.existsSync(path.join(f.dst,'final')));
 return {status:r.status,errorNamespace:r.errorNamespace};}finally{cleanup(f);}
});
await one('SPK-12-SYMLINK-SOURCE-REFUSED',()=>{
 const f=fixture('link');const outside=path.join(f.root,'decoy');fs.mkdirSync(outside);
 try{let link=path.join(f.src,'link');try{fs.symlinkSync(outside,link,'dir');}
 catch(e){return {status:'NOT_TESTED_CREATION_UNAVAILABLE',reason:String(e.code)};}
 const r=nativeCommit(options(f,'link'));assert.notEqual(r.status,'COMMITTED_CONFIRMED');
 assert(!fs.existsSync(path.join(f.dst,'final')));return {status:r.status};}
 finally{cleanup(f);}
});
await one('SPK-13-NATIVE-MODULE-MISSING-REFUSED',async()=>{
 const f=fixture('missing');stage(f,'s0');const temp=fs.mkdtempSync(path.join(os.tmpdir(),'i1-spike-module-missing-'));
 try{
  const loader=path.join(temp,'load.mjs');fs.copyFileSync(path.join(dir,'load.mjs'),loader);
  const m=await import(pathToFileURL(loader).href);
  const r=m.nativeCommit(options(f,'s0'));
  assert.equal(r.status,'REFUSED_MODULE_MISSING');assert(fs.existsSync(path.join(f.src,'s0')));return r;
 }finally{cleanup(f);fs.rmSync(temp,{recursive:true,force:true});}
});
await one('SPK-14-NATIVE-MODULE-CORRUPTED-REFUSED',async()=>{
 const f=fixture('corrupt');stage(f,'s0');const temp=fs.mkdtempSync(path.join(os.tmpdir(),'i1-spike-module-corrupt-'));
 try{
  const loader=path.join(temp,'load.mjs');fs.copyFileSync(path.join(dir,'load.mjs'),loader);
  const data=Buffer.from('NOT A VALID SHARED OBJECT');
  fs.writeFileSync(path.join(temp,'native_adapter.node'),data);
  const m=await import(pathToFileURL(loader).href);
  const r=m.nativeCommit({...options(f,'s0'),expectedBinarySha256:sha(data)});
  assert.equal(r.status,'REFUSED_MODULE_LOAD');assert(fs.existsSync(path.join(f.src,'s0')));return r;
 }finally{cleanup(f);fs.rmSync(temp,{recursive:true,force:true});}
});
await one('SPK-15-NODE-NO-ADDONS-REFUSED',()=>{
 const f=fixture('noaddons');stage(f,'s0');
 try{
  const script="import {nativeCommit} from "+JSON.stringify(pathToFileURL(path.join(dir,'load.mjs')).href)+"; console.log(JSON.stringify(nativeCommit("+JSON.stringify(options(f,'s0'))+")))";
  const r=spawnSync(process.execPath,['--no-addons','--input-type=module','-e',script],
   {encoding:'utf8',env:{...process.env,I1_NATIVE_SPIKE_ENABLED:'1'},timeout:90000,windowsHide:true});
  assert.equal(r.status,0,r.stderr);
  const output=JSON.parse(r.stdout.trim());assert.equal(output.status,'REFUSED_MODULE_LOAD');
  assert(fs.existsSync(path.join(f.src,'s0')));return {status:output.status,loadErrorCode:output.loadErrorCode};
 }finally{cleanup(f);}
});
await one('SPK-16-32-PROCESS-ATOMIC-CONTENTION',async()=>{
 const f=fixture('race32');for(let i=0;i<32;i++)stage(f,'worker'+i,'WORKER_'+i);
 try{
  const results=await Promise.all(Array.from({length:32},(_,i)=>childRace(i,f)));
  const winners=results.filter(x=>x.status==='COMMITTED_CONFIRMED');
  const denied=results.filter(x=>x.status==='REFUSED_ALREADY_EXISTS');
  assert.equal(winners.length,1,JSON.stringify(results.map(x=>x.status)));
  assert.equal(denied.length,31,JSON.stringify(results.map(x=>x.status)));
  assert.equal(fs.readdirSync(f.dst).filter(x=>x==='final').length,1);
  assert.equal(fs.readdirSync(f.src).length,31);
  return {winners:1,denied:31,nativeApi:winners[0].api,codeSet:[...new Set(denied.map(x=>x.rawCode))]};
 }finally{cleanup(f);}
});
await one('SPK-17-RECOVERY-SIGKILL-RETAINED-PRIVATE-SNAPSHOT',()=>{
 const f=fixture('crash');
 try{
  const r=spawnSync(process.execPath,[path.join(dir,'crash_staging.mjs'),f.root],
    {env:{...process.env,I1_NATIVE_SPIKE_CRASH_TEST:'1'},encoding:'utf8',timeout:45000,windowsHide:true});
  assert.match(r.stdout,/SYNTHETIC_CRASH_FIXTURE_READY/);
  assert.notEqual(r.status,0);
  const report=inspectSyntheticStaging(f.root);
  assert.equal(report.readOnly,true);assert.equal(report.automaticCleanupPerformed,false);
  assert.equal(report.count,1);assert.equal(report.findings[0].status,'ORPHAN_PRIVATE_SOURCE_RETAINS_DATA');
  assert(fs.existsSync(path.join(f.root,report.findings[0].name,'.private-source','synthetic.txt')));
  return {status:report.findings[0].status,automaticCleanupPerformed:false,childExit:r.status,childSignal:r.signal};
 }finally{cleanup(f);}
});
await one('SPK-18-REPEAT-TARGET-ALWAYS-REFUSED',()=>{
 const f=fixture('repeat');stage(f,'s0');stage(f,'s1');
 try{const a=nativeCommit(options(f,'s0'));const b=nativeCommit(options(f,'s1'));
 assert.equal(a.status,'COMMITTED_CONFIRMED');assert.equal(b.status,'REFUSED_ALREADY_EXISTS');
 assert(fs.existsSync(path.join(f.src,'s1')));return {first:a.status,second:b.status};}
 finally{cleanup(f);}
});
observed('SPK-19-G4-POSTPUBLICATION','OBSERVED_UNPROTECTED',
 'Native NOREPLACE does not prevent same-user content modifications after publish.');
observed('SPK-20-WINDOWS-10-11-DESKTOP','NOT_TESTED','Server 2022 CI is not Windows 10 or 11 desktop.');
observed('SPK-21-UNSUPPORTED-VOLUME','NOT_TESTED',
 'No separate unsupported filesystem volume provisioned; no silent fallback exists in native source.');
observed('SPK-22-MALICIOUS-PARENT-MUTATION','NOT_TESTED',
 'No in-module synchronized attacker harness; post-rename path identity only sampled once.');
observed('SPK-23-POWERFAIL-DURABILITY','NOT_TESTED',
 'Synthetic SIGKILL is not proof of power-loss durability or secure wipe.');
const count={pass:cases.filter(x=>x.status==='PASS_BOUNDED').length,fail:cases.filter(x=>x.status==='FAIL').length,
 not_tested:cases.filter(x=>x.status==='NOT_TESTED').length,observed:cases.filter(x=>x.status==='OBSERVED_UNPROTECTED').length};
const receipt={kind:'I1_NATIVE_NODE_API8_ISOLATED_SPIKE_TEST',utc:new Date().toISOString(),
 candidateSha:process.env.GITHUB_SHA||'LOCAL_REVIEW',platform:process.platform,arch:process.arch,
 node:process.version,napi:process.versions.napi,source:'SYNTHETIC_ONLY',nativeBinarySha256:binarySha,
 publicGuardChanged:false,productionAssurance:'NOT_ESTABLISHED',counts:count,cases};
const folder=process.env.I1_SPIKE_RECEIPT_DIR||dir;fs.mkdirSync(folder,{recursive:true});
fs.writeFileSync(path.join(folder,'spike-test-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log('I1_SPIKE_TEST_FINAL',JSON.stringify(count));
if(count.fail>0)process.exitCode=1;
