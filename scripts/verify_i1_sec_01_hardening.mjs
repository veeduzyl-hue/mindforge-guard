// I1-SEC-01: isolated failure-injection and cross-process NOREPLACE tests.
// Local synthetic first-report packs only; these are NOT the M4 62 cases.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {preflightReview,takeReviewSnapshot,verifySourceUnchanged,publishBundleNoReplace,commitReviewBundle,markReviewFailed} from '../packages/guard/src/cli/review_bundle_writer.mjs';

const source=path.resolve(process.env.I1_TEST_SAMPLE||'examples/single-agent-governance-pack/hr-self-service-agent');
const cli=path.resolve(process.env.I1_TEST_CLI||'packages/guard/bin/guard.mjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'i1-sec01-'));
const cases=[];
const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
function error(code){return Object.assign(new Error('synthetic '+code),{code});}
function setup(tag){
 const pack=path.join(root,'pack-'+tag),output=path.join(root,'out-'+tag);
 fs.cpSync(source,pack,{recursive:true});
 return {pack,output,ctx:takeReviewSnapshot(preflightReview(pack,output))};
}
function cleanup(c){if(fs.existsSync(c.ctx.stage))fs.rmSync(c.ctx.stage,{recursive:true,force:true});}
function one(id,fn){
 try{fn();cases.push({id,result:'PASS'});console.log('PASS',id);}
 catch(e){cases.push({id,result:'FAIL',detail:String(e.stack||e)});console.error('FAIL',id,e.message);}
}
function partial(c){
 const p=markReviewFailed(c.ctx,error('EIO'));
 assert.equal(p,c.ctx.stage);
 assert(fs.existsSync(path.join(p,'INCOMPLETE.json')));
 assert(!fs.existsSync(path.join(p,'.private-source')));
 assert(!fs.existsSync(c.output));
}
one('SEC-T01-creator-before-publish',()=>{
 const c=setup('pre');fs.mkdirSync(c.output);fs.writeFileSync(path.join(c.output,'foreign.txt'),'KEEP');
 try{assert.throws(()=>publishBundleNoReplace(c.ctx),e=>e.code==='precondition_failed');assert.equal(fs.readFileSync(path.join(c.output,'foreign.txt'),'utf8'),'KEEP');}
 finally{cleanup(c);}
});
one('SEC-T02-creator-at-rename',()=>{
 const c=setup('race'),old=fs.renameSync;let attempted=false,rejected=false;
 try{
  fs.renameSync=(a,b)=>{
   if(a===c.ctx.stage&&b===c.ctx.finalPath){attempted=true;try{fs.mkdirSync(b);}catch(e){if(e.code==='EEXIST')rejected=true;else throw e;}}
   return old(a,b);
  };
  if(process.platform==='win32'){
   assert.throws(()=>publishBundleNoReplace(c.ctx));
   assert(fs.statSync(c.output).isDirectory());
   assert(!fs.existsSync(path.join(c.output,'review-manifest.json')));
  }else{
   publishBundleNoReplace(c.ctx);
   assert(rejected);
  }
  assert(attempted);
 }finally{fs.renameSync=old;cleanup(c);}
});
for(const code of ['EIO','EXDEV']){
 one('SEC-T03-final-rename-'+code,()=>{
  const c=setup('rename-'+code),old=fs.renameSync;
  try{
   fs.renameSync=(a,b)=>a===c.ctx.stage&&b===c.ctx.finalPath?(()=>{throw error(code);})():old(a,b);
   assert.throws(()=>publishBundleNoReplace(c.ctx),e=>e.code==='output_error');
  }finally{fs.renameSync=old;partial(c);cleanup(c);}
 });
}
one('SEC-T04-POSIX-reservation-EACCES',()=>{
 if(process.platform==='win32')return; // Windows uses native no-replace rename
 const c=setup('access'),old=fs.mkdirSync;
 try{
  fs.mkdirSync=(p,...args)=>p===c.ctx.finalPath?(()=>{throw error('EACCES');})():old(p,...args);
  assert.throws(()=>publishBundleNoReplace(c.ctx),e=>e.code==='output_error');
 }finally{fs.mkdirSync=old;partial(c);cleanup(c);}
});
one('SEC-T05-ENOSPC-before-publication',()=>{
 const c=setup('nospace'),old=fs.openSync;
 const val={parser_version:'test',validation_status:'valid_with_no_omissions',omissions:[],limitations:[],parser_warnings:[],deterministic_pack_hash:'sha256:test'};
 let fired=false;
 try{
  fs.openSync=(p,...args)=>typeof p==='string'&&p.includes('.tmp-')&&!fired?(fired=true,(()=>{throw error('ENOSPC');})()):old(p,...args);
  assert.throws(()=>commitReviewBundle(c.ctx,{validation:val,validationExit:0,report:null,reportExit:null,guardVersion:'candidate',overallStatus:'ready_for_review'}));
 }finally{fs.openSync=old;assert(fired);partial(c);cleanup(c);}
});
one('SEC-T06-device-mismatch-fail-closed',()=>{
 const c=setup('dev'),old=fs.statSync;
 try{
  fs.statSync=(p,...args)=>{const s=old(p,...args);return p===c.ctx.stage?new Proxy(s,{get(o,k){return k==='dev'?Number(o.dev)+1:Reflect.get(o,k);}}):s;};
  assert.throws(()=>publishBundleNoReplace(c.ctx),e=>e.code==='output_error');
 }finally{fs.statSync=old;partial(c);cleanup(c);}
});
one('SEC-T07-existing-file-preserved',()=>{
 const c=setup('file');fs.writeFileSync(c.output,'KEEP');
 try{assert.throws(()=>publishBundleNoReplace(c.ctx));assert.equal(fs.readFileSync(c.output,'utf8'),'KEEP');}
 finally{cleanup(c);}
});
one('SEC-T08-input-unchanged-after-failure',()=>{
 const c=setup('source'),before=digest(fs.readFileSync(path.join(c.pack,'manifest.json'))),old=fs.renameSync;
 try{
  fs.renameSync=(a,b)=>a===c.ctx.stage&&b===c.ctx.finalPath?(()=>{throw error('EIO');})():old(a,b);
  assert.throws(()=>publishBundleNoReplace(c.ctx));
 }finally{
  fs.renameSync=old;verifySourceUnchanged(c.ctx);
  assert.equal(digest(fs.readFileSync(path.join(c.pack,'manifest.json'))),before);
  partial(c);cleanup(c);
 }
});
function child(args){return new Promise((resolve,reject)=>{
 const p=spawn(process.execPath,[cli,...args],{env:{...process.env,HOME:path.join(root,'empty-home'),USERPROFILE:path.join(root,'empty-home')},windowsHide:true});
 let out='',err='';p.stdout.on('data',x=>out+=x);p.stderr.on('data',x=>err+=x);
 p.once('error',reject);p.once('close',(code,signal)=>resolve({code,signal,out,err}));
});}
try{
 const pack=path.join(root,'pack-concurrent'),output=path.join(root,'out-concurrent');
 fs.cpSync(source,pack,{recursive:true});
 const results=await Promise.all(Array.from({length:5},()=>child(['review','--pack',pack,'--out',output,'--format','json'])));
 assert.equal(results.filter(x=>x.code===0).length,1,JSON.stringify(results.map(x=>({code:x.code,err:x.err.slice(0,100)}))));
 assert.equal(results.filter(x=>x.code===2).length,4);
 const idx=JSON.parse(fs.readFileSync(path.join(output,'bundle-checksums.json'),'utf8'));
 assert.equal(idx.files.length,5);
 for(const f of idx.files)assert.equal(digest(fs.readFileSync(path.join(output,f.path))),f.sha256);
 assert.equal(JSON.parse(fs.readFileSync(path.join(output,'review-manifest.json'),'utf8')).overall_status,'ready_for_review');
 assert(!fs.existsSync(path.join(output,'.private-source')));
 cases.push({id:'SEC-T09-five-real-processes-one-winner',result:'PASS',exit_codes:results.map(x=>x.code)});
 console.log('PASS SEC-T09-five-real-processes-one-winner');
}catch(e){cases.push({id:'SEC-T09-five-real-processes-one-winner',result:'FAIL',detail:String(e.stack||e)});console.error('FAIL SEC-T09',e.message);}
const counts={pass:cases.filter(x=>x.result==='PASS').length,fail:cases.filter(x=>x.result==='FAIL').length,not_tested:0};
const receipt={kind:'I1_SEC_01_NO_REPLACE_FAILURE_INJECTION',candidate_sha:process.env.GITHUB_SHA||'LOCAL',platform:process.platform,arch:process.arch,node:process.version,synthetic_only:true,threat_model:'independent path creators, not malicious replacement of claimed empty directory by a same-user actor',actual_cross_volume_or_disk_full_test:false,counts,cases};
if(process.env.I1_SEC_RECEIPT)fs.writeFileSync(process.env.I1_SEC_RECEIPT,JSON.stringify(receipt,null,2)+'\n');
console.log('I1_SEC_01_RESULT',JSON.stringify(counts));
fs.rmSync(root,{recursive:true,force:true});
if(counts.fail)process.exitCode=1;
