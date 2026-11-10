import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const version='7.1.0-rc.0';
const outDir=process.env.GUARD_RC_OUTPUT_DIR;
const installDir=process.env.GUARD_RC_INSTALL_DIR;
const tgz=process.env.GUARD_RC_TGZ;
if (!outDir || !installDir || !tgz) throw Error('Missing explicit GUARD_RC_OUTPUT_DIR, GUARD_RC_INSTALL_DIR or GUARD_RC_TGZ');
fs.mkdirSync(outDir,{recursive:true});
const expectedTgzName='veeduzyl-mindforge-guard-7.1.0-rc.0.tgz';
assert.equal(path.basename(tgz),expectedTgzName);
const pkg=path.join(installDir,'node_modules','@veeduzyl','mindforge-guard');
const cli=path.join(pkg,'bin','guard.mjs');
const sourceZip=path.join(process.cwd(),'downloads','mindforge-guard-hr-self-service-sample-pack-v0.1.zip');
const pack=path.join(outDir,'sample','hr-self-service-agent');
const receipt={test_id:'GUARD_V7_1_0_RC_0_PACKAGED_INSTALL_TEST',status:'INCONCLUSIVE',version,runner:process.platform,arch:process.arch,node:process.version,head_sha:process.env.GITHUB_SHA??'UNSPECIFIED',tarball_sha256:null,checks:[],human_windows_10_first_user:'NOT_TESTED',npm_publish:'NOT_PERFORMED',production_assurance:'NOT_ESTABLISHED'};
const hash=(b)=>crypto.createHash('sha256').update(b).digest('hex');
const safeStep=(name,fn)=>{fn();receipt.checks.push({name,result:'PASS'});};
const testHome=path.join(outDir,'isolated-home');
fs.mkdirSync(testHome,{recursive:true});
const env={...process.env,HOME:testHome,USERPROFILE:testHome};
function call(args){
 const c=spawnSync(process.execPath,[cli,...args],{cwd:outDir,encoding:null,env,timeout:120000,maxBuffer:6*1024*1024,windowsHide:true});
 if(c.error) throw c.error;
 return {exitCode:c.status,stdout:Buffer.from(c.stdout||[]),stderr:Buffer.from(c.stderr||[]).toString('utf8')};
}
function success(args){
 const r=call(args);
 assert.equal(r.exitCode,0,args.join(' ')+' failed '+r.stderr);
 return r.stdout;
}
function failExit(args,code){
 const r=call(args);
 assert.equal(r.exitCode,code,args.join(' ')+' exit '+r.exitCode+' expected '+code+' '+r.stderr);
 return r;
}
try {
 safeStep('tarball identity and installation package manifest',()=>{
  assert(fs.existsSync(tgz));
  receipt.tarball_sha256=hash(fs.readFileSync(tgz));
  const m=JSON.parse(fs.readFileSync(path.join(pkg,'package.json'),'utf8'));
  assert.equal(m.version,version);
  assert.equal(m.name,'@veeduzyl/mindforge-guard');
  assert.equal(m.license,'Apache-2.0');
  assert.equal(m.bin.guard,'bin/guard.mjs');
  for(const f of ['src/cli/report_render_html.mjs','src/presentation/role_based_html_report.mjs','README.md','EDITIONS.md','LICENSE'])assert(fs.existsSync(path.join(pkg,f)),f);
 });
 safeStep('npm-installed CLI version, help and status',()=>{
  assert.equal(success(['--version']).toString('utf8').trim(),'guard '+version);
  assert(success(['--help']).toString('utf8').includes('guard report render --input'));
  assert(success(['status']).toString('utf8').includes('License:'));
 });
 let validation,report,reportBytes,sourceFile,htmlBytes;
 safeStep('standalone sample ZIP extraction, pack validation and JSON report',()=>{
  assert(fs.existsSync(sourceZip));
  assert(fs.existsSync(path.join(pack,'manifest.json')));
  validation=JSON.parse(success(['pack','validate','--pack',pack,'--preview','--json']).toString('utf8'));
  assert.equal(validation.validation_status,'valid_with_no_omissions');
  reportBytes=success(['report','single-agent','--pack',pack,'--preview','--json']);
  report=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(reportBytes));
  assert.equal(report.report_mode,'preview');
  assert.equal(report.review_posture,'ready_for_review');
  assert.equal(report.deterministic_hash,validation.deterministic_pack_hash);
  sourceFile=path.join(outDir,'first-report.json');
  fs.writeFileSync(sourceFile,reportBytes,{flag:'wx'});
  fs.writeFileSync(path.join(outDir,'pack-validation.json'),JSON.stringify(validation,null,2)+'\n',{flag:'wx'});
 });
 safeStep('English offline HTML and input immutability',()=>{
  const p=path.join(outDir,'first-report.html');
  success(['report','render','--input',sourceFile,'--out',p,'--format','html']);
  htmlBytes=fs.readFileSync(p);
  const html=new TextDecoder('utf-8',{fatal:true}).decode(htmlBytes);
  for(const snippet of ['<html lang="en">','Business owner','Technical reviewer','Governance / risk reviewer','No operational authority','ready_for_review','sha256:'+hash(reportBytes)])assert(html.includes(snippet),snippet);
  assert(!html.includes('<script'));
  assert(!html.includes('https://cdn.'));
  assert.deepEqual(fs.readFileSync(sourceFile),reportBytes);
  receipt.report_json_sha256=hash(reportBytes);
  receipt.report_html_sha256=hash(htmlBytes);
 });
 safeStep('deterministic rerender and no overwrite',()=>{
  const another=path.join(outDir,'first-report-again.html');
  success(['report','render','--input',sourceFile,'--out',another,'--format','html']);
  assert.deepEqual(fs.readFileSync(another),htmlBytes);
  failExit(['report','render','--input',sourceFile,'--out',path.join(outDir,'first-report.html'),'--format','html'],4);
  assert.deepEqual(fs.readFileSync(path.join(outDir,'first-report.html')),htmlBytes);
  assert.deepEqual(fs.readFileSync(sourceFile),reportBytes);
 });
 safeStep('bad encoding, conflicting input/output, missing option',()=>{
  const badFile=path.join(outDir,'bad-utf16.json');
  fs.writeFileSync(badFile,Buffer.from('\ufeff'+reportBytes.toString('utf8'),'utf16le'));
  failExit(['report','render','--input',badFile,'--out',path.join(outDir,'bad.html'),'--format','html'],4);
  failExit(['report','render','--input',sourceFile,'--out',sourceFile,'--format','html'],4);
  failExit(['report','render','--input',sourceFile,'--out',path.join(outDir,'missing-format.html')],2);
  assert(!fs.existsSync(path.join(outDir,'bad.html')));
 });
 safeStep('Community can generate first report without signed license; paid commands remain gated',()=>{
  assert(!fs.existsSync(path.join(testHome,'.guard','license.json')));
  for(const [args,edition] of [
   [['drift','timeline'],'pro'],
   [['drift','compare'],'pro_plus'],
   [['assoc','correlate'],'pro_plus']
  ]){
   const r=failExit(args,21);
   const j=JSON.parse(r.stdout.toString('utf8'));
   assert.equal(j.error.kind,'license_required');
   assert.equal(j.error.required_edition,edition);
  }
 });
 receipt.status='PASS_BOUNDED_PACKAGED_INSTALL_AND_REPORT';
 fs.writeFileSync(path.join(outDir,'rc-tarball.sha256'),receipt.tarball_sha256+'  '+expectedTgzName+'\n');
 console.log('PASS: packaged v7.1.0-rc.0, local Community first report, English HTML, license boundaries');
}catch(e){
 receipt.status='FAIL';
 receipt.error=String(e.stack||e);
 console.error(receipt.error);
 process.exitCode=1;
}finally{
 fs.writeFileSync(path.join(outDir,'rc-verification-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
 console.log('RC_RECEIPT_STATUS '+receipt.status);
}
