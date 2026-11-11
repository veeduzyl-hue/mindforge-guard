import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {preflightReview,takeReviewSnapshot,verifySourceUnchanged,dropPrivateSnapshot,commitReviewBundle} from '../packages/guard/src/cli/review_bundle_writer.mjs';

const cli=path.resolve(process.env.I1_TEST_CLI || 'packages/guard/bin/guard.mjs');
const source=path.resolve(process.env.I1_TEST_SAMPLE || 'examples/single-agent-governance-pack/hr-self-service-agent');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'guard-i1-local-'));
const cases=[];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const sameJson=(a,b)=>assert.deepEqual(JSON.parse(a),JSON.parse(b));
const j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const safe=(p)=>fs.existsSync(p) ? fs.readFileSync(p):null;
const makePack=(tag)=>{
 const dir=path.join(temp,`pack-${tag}`);
 fs.cpSync(source,dir,{recursive:true});
 return dir;
};
const run=(args)=>{
 const r=spawnSync(process.execPath,[cli,...args],{cwd:temp,env:{...process.env,HOME:path.join(temp,'empty-home'),USERPROFILE:path.join(temp,'empty-home')},timeout:90000,maxBuffer:7e6,encoding:'utf8'});
 if(r.error)throw r.error;
 return {code:r.status,stdout:r.stdout,stderr:r.stderr};
};
function one(id, name, fn) {
 try {fn();cases.push({id,name,result:'PASS'});console.log(`PASS ${id} ${name}`);}
 catch(e){cases.push({id,name,result:'FAIL',detail:String(e?.stack||e)});console.error(`FAIL ${id} ${e?.message||e}`);}
}
const out=(name)=>path.join(temp,'out-'+name);
function checkFinal(dir,status,expectedCode){
 const p=out(dir);let pack=makePack(dir);
 const pre=hash(fs.readFileSync(path.join(pack,'manifest.json')));
 const r=run(['review','--pack',pack,'--out',p,'--format','json']);
 assert.equal(r.code,expectedCode,r.stderr);
 const summary=JSON.parse(r.stdout);
 assert.equal(summary.status,status);
 assert.equal(j(path.join(p,'review-manifest.json')).overall_status,status);
 assert.equal(hash(fs.readFileSync(path.join(pack,'manifest.json'))),pre);
 return {r,pack,p,summary};
}
let positive;
one('I1-T01','canonical sample returns matching native results',()=>{
 positive=checkFinal('canonical','ready_for_review',0);
 const oldPack=run(['pack','validate','--pack',positive.pack,'--preview','--json']);
 const oldReport=run(['report','single-agent','--pack',positive.pack,'--preview','--json']);
 assert.equal(oldPack.code,0);assert.equal(oldReport.code,0);
 const newPack=j(path.join(positive.p,'components/pack-validation.json'));
 const oldVal=JSON.parse(oldPack.stdout);
 delete newPack.pack_path;delete oldVal.pack_path;
 assert.deepEqual(newPack,oldVal);
 sameJson(fs.readFileSync(path.join(positive.p,'components/single-agent-governance-report.json'),'utf8'),oldReport.stdout);
 const sum=j(path.join(positive.p,'bundle-checksums.json'));
 assert.equal(sum.files.length,5);
 for(const f of sum.files){const b=fs.readFileSync(path.join(positive.p,f.path));assert.equal(hash(b),f.sha256);assert.equal(b.length,f.bytes);}
 assert(!sum.files.some(x=>x.path==='bundle-checksums.json'));
 assert(!fs.existsSync(path.join(positive.p,'.private-source')));
});
one('I1-T02','recommended file absent -> preserved limitations',()=>{
 const p=makePack('optional');fs.unlinkSync(path.join(p,'snapshot.json'));
 const x=run(['review','--pack',p,'--out',out('optional'),'--format','json']);
 assert.equal(x.code,2,x.stderr);assert.equal(JSON.parse(x.stdout).status,'completed_with_limitations');
 const v=j(path.join(out('optional'),'components/pack-validation.json'));
 assert.equal(v.validation_status,'valid_with_limitations');
 assert(j(path.join(out('optional'),'components/single-agent-governance-report.json')).review_posture==='needs_human_review');
});
one('I1-T03','required file absent -> incomplete with native exit 3',()=>{
 const p=makePack('missing');fs.unlinkSync(path.join(p,'agent-profile.json'));
 const x=run(['review','--pack',p,'--out',out('missing'),'--format','json']);
 assert.equal(x.code,3,x.stderr);assert.equal(JSON.parse(x.stdout).status,'incomplete');
 assert.equal(j(path.join(out('missing'),'components/pack-validation.json')).validation_status,'invalid_due_to_omissions');
});
one('I1-T04','malformed JSON -> no success report',()=>{
 const p=makePack('malformed');fs.writeFileSync(path.join(p,'manifest.json'),'{x');
 const x=run(['review','--pack',p,'--out',out('malformed'),'--format','json']);
 assert.equal(x.code,4,x.stderr);
 assert.equal(j(path.join(out('malformed'),'components/pack-validation.json')).validation_status,'invalid_due_to_malformed_input');
 assert(!fs.existsSync(path.join(out('malformed'),'components/single-agent-governance-report.json')));
});
one('I1-T05','reject unsupported and duplicate args before write',()=>{
 for(const argv of [ ['--source','x'],['--repo','x'],['--pack','a','--pack','b','--out',out('dup')],['--pack','a','--out',out('no'), '--format','json','--format','text'],['--pack','a','--out',out('bad'),'--bogus'] ]){
  const x=run(['review',...argv]);assert.equal(x.code,2);assert(!fs.existsSync(out('dup')));
 }
});
one('I1-T06','nonexistent input and output parent -> fail without writes',()=>{
 const x=run(['review','--pack',path.join(temp,'not-there'),'--out',out('not-there')]);assert.equal(x.code,2);assert(!fs.existsSync(out('not-there')));
 const p=makePack('no-out-parent');const y=run(['review','--pack',p,'--out',path.join(temp,'missing-parent','out')]);assert.equal(y.code,2);
});
one('I1-T07','existing and nested output never overwritten',()=>{
 const p=makePack('existing');fs.mkdirSync(out('existing'));fs.writeFileSync(path.join(out('existing'),'keep'),'abc');
 const x=run(['review','--pack',p,'--out',out('existing')]);assert.equal(x.code,2);assert.equal(fs.readFileSync(path.join(out('existing'),'keep'),'utf8'),'abc');
 const nested=path.join(p,'evidence','subdir');const y=run(['review','--pack',p,'--out',nested]);assert.equal(y.code,4);assert(!fs.existsSync(nested));
});
if(process.platform==='win32') {
  cases.push({id:'I1-T08',name:'symlink input is rejected with no output',result:'NOT_TESTED',detail:'Requires privilege to create symlinks on this Windows runner; Linux/macOS run the case.'});
} else one('I1-T08','symlink input is rejected with no output',()=>{
 const p=makePack('link');const src=path.join(p,'agent-profile.json');fs.renameSync(src,src+'.back');fs.symlinkSync(src+'.back',src);
 const x=run(['review','--pack',p,'--out',out('link')]);assert.equal(x.code,4);assert(!fs.existsSync(out('link')));
});
one('I1-T08B','relative ../ local reference escape is refused before output',()=>{
 const p=makePack('refescape');const target=path.join(p,'evidence','sample-output.json');
 const d=JSON.parse(fs.readFileSync(target,'utf8'));
 d.output_artifact_ref='../../outside-secret.txt';fs.writeFileSync(target,JSON.stringify(d));
 const x=run(['review','--pack',p,'--out',out('refescape')]);assert.equal(x.code,4,x.stderr);
 assert(!fs.existsSync(out('refescape')));
});
one('I1-T09','unrelated or hidden file is refused rather than copied',()=>{
 const p=makePack('extra');fs.writeFileSync(path.join(p,'.env'),'SECRET_I1_SAMPLE=TEST_SECRET');
 const x=run(['review','--pack',p,'--out',out('extra')]);assert.equal(x.code,4);assert(!fs.existsSync(out('extra')));assert(!x.stderr.includes('TEST_SECRET'));
});
one('I1-T10','final-path race preserves pre-existing directory; candidate stage not published',()=>{
 const p=makePack('collision');const pre=preflightReview(p,out('collision'));
 const ctx=takeReviewSnapshot(pre);fs.mkdirSync(out('collision'));
 fs.writeFileSync(path.join(out('collision'),'existing-file.txt'),'DO_NOT_REPLACE');
 const fakeValidation={parser_version:'fixture',validation_status:'valid_with_no_omissions',omissions:[],limitations:[],parser_warnings:[],deterministic_pack_hash:'sha256:fixture'};
 try {
  assert.throws(()=>commitReviewBundle(ctx,{validation:fakeValidation,validationExit:0,report:null,reportExit:null,guardVersion:'candidate',overallStatus:'ready_for_review'}));
  assert.equal(fs.readFileSync(path.join(out('collision'),'existing-file.txt'),'utf8'),'DO_NOT_REPLACE');
  assert(!fs.existsSync(path.join(out('collision'),'review-manifest.json')));
 } finally {dropPrivateSnapshot(ctx);fs.rmSync(ctx.stage,{recursive:true,force:true});}
});
one('I1-T11','sibling staging and final output share same parent',()=>{
 const p=makePack('volume');const pre=preflightReview(p,out('volume'));
 const ctx=takeReviewSnapshot(pre);try{assert.equal(path.dirname(ctx.stage),path.dirname(ctx.finalPath));}finally{dropPrivateSnapshot(ctx);fs.rmSync(ctx.stage,{recursive:true,force:true});}
});
one('I1-T12','repeat to same location rejected; no silent overwrite',()=>{
 const b=fs.readFileSync(path.join(positive.p,'review-manifest.json'));
 const x=run(['review','--pack',positive.pack,'--out',positive.p]);assert.equal(x.code,2);assert.deepEqual(fs.readFileSync(path.join(positive.p,'review-manifest.json')),b);
});
one('I1-T13','report is strict BOM-free UTF-8 JSON',()=>{
 const bytes=fs.readFileSync(path.join(positive.p,'components/single-agent-governance-report.json'));
 assert.notDeepEqual([...bytes.slice(0,3)],[0xef,0xbb,0xbf]);new TextDecoder('utf-8',{fatal:true}).decode(bytes);
});
one('I1-T14','Unicode/space path supported',()=>{
 const p=makePack('中文 folder');const dest=out('中文 folder');
 const x=run(['review','--pack',p,'--out',dest,'--format','text']);assert.equal(x.code,0,x.stderr);
 assert(fs.existsSync(path.join(dest,'review-manifest.json')));
});
one('I1-T15','no license required for I-1 Community; paid commands still gated',()=>{
 const x=run(['drift','timeline']);assert.equal(x.code,21);
 const y=run(['review','--pack',positive.pack,'--out',out('community')]);assert.equal(y.code,0,y.stderr);
});
one('I1-T16','does not promote reviewable to approval',()=>{
 const m=j(path.join(positive.p,'review-manifest.json'));
 assert.equal(m.recommendation_only,true);assert.equal(m.non_executing,true);assert(m.does_not_support.some(x=>/approval/i.test(x)));
 const r=j(path.join(positive.p,'components/single-agent-governance-report.json'));
 assert.equal(r.authority_envelope.approval_granted,false);
});
one('I1-T17','native status and numeric component semantics preserved',()=>{
 for(const [dir,code] of [['canonical',0],['optional',2],['missing',3],['malformed',4]]){
  const m=j(path.join(out(dir),'review-manifest.json'));
  assert.equal(m.components.pack_validation.native_exit_code,code);
  if(dir==='malformed')assert.equal(m.components.single_agent_report.skipped_reason,'malformed_input');
 }
});
one('I1-T18','bundle never includes private source directory or host absolute path in validation JSON',()=>{
 const output=fs.readFileSync(path.join(positive.p,'components/pack-validation.json'),'utf8');
 assert(!output.includes(temp));assert(!output.includes('.private-source'));
 assert(!fs.existsSync(path.join(positive.p,'.private-source')));
});
one('I1-T19','source modification after snapshot is detected',()=>{
 const p=makePack('mutate');const ctx=takeReviewSnapshot(preflightReview(p,out('mutate')));
 try{fs.appendFileSync(path.join(p,'README.md'),'\nchanged');assert.throws(()=>verifySourceUnchanged(ctx));}
 finally{dropPrivateSnapshot(ctx);fs.rmSync(ctx.stage,{recursive:true,force:true});}
});
one('I1-T20','legacy commands unchanged for candidate sample',()=>{
 const v=run(['pack','validate','--pack',positive.pack,'--preview','--json']);assert.equal(v.code,0);assert.equal(JSON.parse(v.stdout).validation_status,'valid_with_no_omissions');
 const p=run(['report','single-agent','--pack',positive.pack,'--preview','--json']);assert.equal(p.code,0);assert.equal(JSON.parse(p.stdout).review_posture,'ready_for_review');
});
const failed=cases.filter(c=>c.result==='FAIL');const report={kind:'I1_LOCAL_NEGATIVE_TEST_SUITE',platform:process.platform,arch:process.arch,node:process.version,
 test_counts:{pass:cases.filter(c=>c.result==='PASS').length,fail:failed.length,not_tested:cases.filter(c=>c.result==='NOT_TESTED').length},cases};
if(process.env.I1_TEST_RECEIPT){fs.writeFileSync(process.env.I1_TEST_RECEIPT,JSON.stringify(report,null,2)+'\n');}
console.log('I1_LOCAL_TEST_RECEIPT '+JSON.stringify(report.test_counts));
fs.rmSync(temp,{recursive:true,force:true});
if(failed.length)process.exitCode=1;
