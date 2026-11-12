import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {parseSingleAgentGovernancePackPreview} from '../packages/guard/src/productization/single_agent_pack_parser_preview.mjs';
import {buildSingleAgentReportPreview} from '../packages/guard/src/productization/single_agent_report_preview_mapper.mjs';
import {buildPackValidationFromSummary} from '../packages/guard/src/cli/pack_validate_preview.mjs';
import {preflightReview,takeReviewSnapshot,verifySourceUnchanged,releaseReviewMemory,
 commitReviewBundle,markReviewFailed} from '../packages/guard/src/cli/review_bundle_writer.mjs';

const root=fs.mkdtempSync(path.join(os.tmpdir(),'guard-i1-dataflow-'));
const canonical=path.resolve('examples/single-agent-governance-pack/hr-self-service-agent');
const cli=path.resolve('packages/guard/bin/guard.mjs');
const cases=[];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const pack=tag=>{const p=path.join(root,'pack-'+tag);fs.cpSync(canonical,p,{recursive:true});return p;};
const out=tag=>path.join(root,'out-'+tag);
const run=args=>{const p=spawnSync(process.execPath,[cli,...args],{cwd:root,encoding:'utf8',
 timeout:90000,maxBuffer:12e6,windowsHide:true,
 env:{...process.env,HOME:path.join(root,'isolated-home'),USERPROFILE:path.join(root,'isolated-home')}});
 if(p.error)throw p.error;return p;};
const walk=dir=>{const result=[];
 function visit(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){
  const item=path.join(p,e.name);
  if(e.isSymbolicLink())throw Error('TEST_UNEXPECTED_SYMLINK');
  if(e.isDirectory())visit(item);else if(e.isFile())result.push(item);
 }}visit(dir);return result;};
async function check(id,desc,fn){
 try{const evidence=await fn();cases.push({id,desc,result:'PASS',evidence:evidence??{}});
  console.log('PASS',id,desc,JSON.stringify(evidence??{}).slice(0,220));}
 catch(e){cases.push({id,desc,result:'FAIL',error:String(e.stack||e).slice(0,2600)});
  console.error('FAIL',id,e.message);}
}
function fakeValid(){return {parser_version:'synthetic',validation_status:'valid_with_no_omissions',
 omissions:[],limitations:[],parser_warnings:[],deterministic_pack_hash:'sha256:synthetic'};}
await check('DF01','bounded source snapshot exists only in memory',()=>{
 const p=pack('mem'),ctx=takeReviewSnapshot(preflightReview(p,out('mem')));
 try{assert.equal(ctx.rawSourcePersisted,false);
 assert.equal(ctx.fileView.listRelativeFiles().length,ctx.names.length);
 assert.equal(ctx.fileView.hasFile('manifest.json'),true);
 assert.equal(fs.readdirSync(ctx.stage).length,0);
 return {files:ctx.names.length,stageEntries:0,rawCopy:false};}
 finally{releaseReviewMemory(ctx);fs.rmSync(ctx.stage,{recursive:true,force:true});}
});
await check('DF02','memory parser and report match legacy native contracts',()=>{
 const p=pack('parity'),ctx=takeReviewSnapshot(preflightReview(p,out('parity')));
 try{
 const disk=parseSingleAgentGovernancePackPreview(p);
 const mem=parseSingleAgentGovernancePackPreview(p,{fileView:ctx.fileView});
 assert.deepEqual(mem,disk);
 const dv=buildPackValidationFromSummary(disk),mv=buildPackValidationFromSummary(mem);
 assert.deepEqual(mv,dv);
 assert.deepEqual(buildSingleAgentReportPreview({packRoot:p,parserSummary:mem,packValidation:mv,fileView:ctx.fileView}),
  buildSingleAgentReportPreview({packRoot:p,parserSummary:disk,packValidation:dv}));
 return {hash:mem.deterministic_pack_hash,parity:true};
 }finally{releaseReviewMemory(ctx);fs.rmSync(ctx.stage,{recursive:true,force:true});}
});
await check('DF03','real CLI components and checksum manifest match legacy',()=>{
 const p=pack('cli'),dst=out('cli');
 const a=run(['review','--pack',p,'--out',dst,'--format','json']);
 assert.equal(a.status,0,a.stderr);
 const v=run(['pack','validate','--pack',p,'--preview','--json']);
 const q=run(['report','single-agent','--pack',p,'--preview','--json']);
 assert.equal(v.status,0);assert.equal(q.status,0);
 const n=readJson(path.join(dst,'components','pack-validation.json')),o=JSON.parse(v.stdout);
 delete n.pack_path;delete o.pack_path;assert.deepEqual(n,o);
 assert.deepEqual(readJson(path.join(dst,'components','single-agent-governance-report.json')),JSON.parse(q.stdout));
 const index=readJson(path.join(dst,'bundle-checksums.json'));
 for(const item of index.files){const b=fs.readFileSync(path.join(dst,item.path));assert.equal(sha(b),item.sha256);assert.equal(b.length,item.bytes);}
 assert(!fs.existsSync(path.join(dst,'.private-source')));
 return {reportSha256:sha(Buffer.from(q.stdout)),checksums:index.files.length};
});
await check('DF04','synthetic private unknown input not written to Bundle',()=>{
 const p=pack('secret'),secret='I1_PRIVATE_CANARY_'+crypto.randomUUID();
 const a=path.join(p,'agent-profile.json'),v=readJson(a);
 v.x_private_test_canary=secret;fs.writeFileSync(a,JSON.stringify(v,null,2)+'\n');
 const r=run(['review','--pack',p,'--out',out('secret')]);
 assert.equal(r.status,0,r.stderr);
 assert.deepEqual(walk(out('secret')).filter(f=>fs.readFileSync(f).includes(Buffer.from(secret))),[]);
 assert.equal(readJson(a).x_private_test_canary,secret);
 return {rawPrivateTestFieldNotPersisted:true};
});
await check('DF05','mapped sensitive narrative visible and explicitly cautioned',()=>{
 const p=pack('visible'),secret='I1_VISIBLE_SYNTHETIC_'+crypto.randomUUID();
 const a=path.join(p,'evidence','sample-output.json'),v=readJson(a);
 v.output_summary=secret;fs.writeFileSync(a,JSON.stringify(v,null,2)+'\n');
 const r=run(['review','--pack',p,'--out',out('visible')]);
 assert.equal(r.status,0,r.stderr);
 assert.equal(readJson(path.join(out('visible'),'components','single-agent-governance-report.json')).action_summary,secret);
 assert(fs.readFileSync(path.join(out('visible'),'review-summary.md'),'utf8').includes('potentially sensitive'));
 return {derivedFieldVisible:true,notRedacted:true};
});
await check('DF06','changed source after snapshot rejected while memory stays frozen',()=>{
 const p=pack('mutate'),ctx=takeReviewSnapshot(preflightReview(p,out('mutate')));
 try{
 const before=ctx.fileView.readText('task-scope.md');
 fs.appendFileSync(path.join(p,'task-scope.md'),'\nchanged');
 assert.equal(ctx.fileView.readText('task-scope.md'),before);
 assert.throws(()=>verifySourceUnchanged(ctx));
 assert.equal(fs.readdirSync(ctx.stage).length,0);
 return {mutationDetected:true};
 }finally{releaseReviewMemory(ctx);fs.rmSync(ctx.stage,{recursive:true,force:true});}
});
await check('DF07','best-effort Buffer clearing on completion',()=>{
 const p=pack('wipe'),ctx=takeReviewSnapshot(preflightReview(p,out('wipe')));
 try{
 const b=ctx.memoryFiles.get('agent-profile.json');assert(b.length>0);
 releaseReviewMemory(ctx);assert.equal(ctx.memoryFiles.size,0);
 assert(b.every(x=>x===0));return {bufferWiped:true,swapSecurityNotEstablished:true};
 }finally{fs.rmSync(ctx.stage,{recursive:true,force:true});}
});
await check('DF08','missing optional preserves native exit 2',()=>{
 const p=pack('opt');fs.unlinkSync(path.join(p,'snapshot.json'));
 const r=run(['review','--pack',p,'--out',out('opt'),'--format','json']);
 assert.equal(r.status,2,r.stderr);
 assert.equal(JSON.parse(r.stdout).status,'completed_with_limitations');return {exit:2};
});
await check('DF09','missing required preserves exit 3',()=>{
 const p=pack('req');fs.unlinkSync(path.join(p,'agent-profile.json'));
 const r=run(['review','--pack',p,'--out',out('req'),'--format','json']);
 assert.equal(r.status,3,r.stderr);assert.equal(JSON.parse(r.stdout).status,'incomplete');return {exit:3};
});
await check('DF10','malformed JSON preserves exit 4 and omitted report',()=>{
 const p=pack('bad');fs.writeFileSync(path.join(p,'manifest.json'),'{INVALID');
 const r=run(['review','--pack',p,'--out',out('bad'),'--format','json']);
 assert.equal(r.status,4,r.stderr);
 assert(!fs.existsSync(path.join(out('bad'),'components','single-agent-governance-report.json')));
 return {exit:4,noReport:true};
});
await check('DF11','existing target never overwritten',()=>{
 const p=pack('occupied'),target=out('occupied');
 fs.mkdirSync(target);fs.writeFileSync(path.join(target,'keep'),'FOREIGN');
 const r=run(['review','--pack',p,'--out',target]);
 assert.equal(r.status,2);assert.equal(fs.readFileSync(path.join(target,'keep'),'utf8'),'FOREIGN');
 return {existingDataPreserved:true};
});
await check('DF12','ENOSPC injection leaves only INCOMPLETE stage marker',()=>{
 const p=pack('enospc'),ctx=takeReviewSnapshot(preflightReview(p,out('enospc'))),original=fs.openSync;
 try{
 let fired=false;
 fs.openSync=(file,...args)=>typeof file==='string'&&file.includes('.tmp-')&&!fired?
  (fired=true,(()=>{throw Object.assign(new Error('ENOSPC'),{code:'ENOSPC'});})()):original(file,...args);
 try{assert.throws(()=>commitReviewBundle(ctx,{validation:fakeValid(),validationExit:0,
  report:null,reportExit:null,guardVersion:'test',overallStatus:'ready_for_review'}));}
 finally{fs.openSync=original;}
 assert(fired);markReviewFailed(ctx,Object.assign(new Error('synthetic'),{code:'output_error'}));
 assert(fs.existsSync(path.join(ctx.stage,'INCOMPLETE.json')));
 assert(!fs.existsSync(path.join(ctx.stage,'.private-source')));assert(!fs.existsSync(ctx.finalPath));
 return {rawCopy:false,retainedIncomplete:true};
 }finally{fs.openSync=original;releaseReviewMemory(ctx);fs.rmSync(ctx.stage,{recursive:true,force:true});}
});
await check('DF13','real process kill after snapshot leaves no raw stage',()=>{
 const p=pack('crash');fs.writeFileSync(path.join(root,'.I1_SYNTHETIC_CRASH_MARKER'),'ONLY_TEST');
 const r=spawnSync(process.execPath,['scripts/i1_dataflow_crash_child.mjs',p,out('crash')],{
  cwd:path.resolve('.'),encoding:'utf8',windowsHide:true,timeout:30000,
  env:{...process.env,I1_DATAFLOW_CRASH_TEST:'1'}});
 assert.notEqual(r.status,0);
 assert((r.stdout||'').includes('I1_DATAFLOW_STAGE_CREATED'));
 const found=fs.readdirSync(root).filter(n=>n.startsWith('.guard-i1-partial-out-crash-'));
 assert.equal(found.length,1,JSON.stringify(found));
 assert.equal(fs.readdirSync(path.join(root,found[0])).length,0);
 return {rawFilesInOrphan:0,exit:r.status,signal:r.signal||null};
});
await check('DF14','synthetic cloud-named output writes only derived Bundle',()=>{
 const p=pack('cloud'),folder=path.join(root,'OneDrive-SYNTHETIC-NOT_CONNECTED');
 fs.mkdirSync(folder);
 const r=run(['review','--pack',p,'--out',path.join(folder,'bundle')]);
 assert.equal(r.status,0,r.stderr);
 const files=walk(path.join(folder,'bundle'));
 assert(files.length>=5);
 assert(!files.some(x=>x.includes('.private-source')));
 return {cloudServiceActuallyTested:false,derivedOutputFiles:files.length};
});
await check('DF15','extra unknown source entry rejected without staging',()=>{
 const p=pack('extra');fs.writeFileSync(path.join(p,'.env'),'SYNTHETIC_ONLY');
 const r=run(['review','--pack',p,'--out',out('extra')]);
 assert.equal(r.status,4);assert(!fs.existsSync(out('extra')));
 assert(!fs.readdirSync(root).some(n=>n.startsWith('.guard-i1-partial-out-extra-')));
 return {earlyRejection:true};
});
const failed=cases.filter(c=>c.result==='FAIL');
const receipt={kind:'I1_REAL_WRITER_DATAFLOW_01',candidateSha:process.env.GITHUB_SHA||'LOCAL',
 platform:process.platform,arch:process.arch,node:process.version,
 syntheticOnly:true,counts:{pass:cases.length-failed.length,fail:failed.length},
 cloudSyncRealWorld:'NOT_TESTED',windowsDaclGuarantee:'NOT_ESTABLISHED',
 realPowerLoss:'NOT_TESTED',actualCustomerData:'NOT_TESTED',
 publicGuardReleased:false,cases};
if(process.env.I1_DATAFLOW_RECEIPT_FILE){
 const file=path.resolve(process.env.I1_DATAFLOW_RECEIPT_FILE);
 fs.mkdirSync(path.dirname(file),{recursive:true});
 fs.writeFileSync(file,JSON.stringify(receipt,null,2)+'\n');
}
console.log('I1_DATAFLOW_RECEIPT',JSON.stringify(receipt.counts));
fs.rmSync(root,{recursive:true,force:true});
if(failed.length)process.exitCode=1;
