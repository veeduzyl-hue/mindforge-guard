// Candidate-only installed-package check. No publish, no network calls by Guard.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const tgz=process.env.I1_CANONICAL_TGZ;
const prefix=process.env.I1_INSTALL_PREFIX;
const sample=process.env.I1_SAMPLE_DIR;
const out=process.env.I1_RECEIPT_DIR;
if(!tgz||!prefix||!sample||!out)throw Error('I1_CANONICAL_TGZ, I1_INSTALL_PREFIX, I1_SAMPLE_DIR and I1_RECEIPT_DIR are required.');
fs.mkdirSync(out,{recursive:true});
const hash=(b)=>crypto.createHash('sha256').update(b).digest('hex');
const pkg=path.join(prefix,'node_modules','@veeduzyl','mindforge-guard');
const cli=path.join(pkg,'bin','guard.mjs');
const receipt={kind:'i1_installed_package_smoke',tested_sha:process.env.I1_TESTED_SHA||'UNKNOWN',
 platform:process.platform,arch:process.arch,node:process.version,package_tar_sha256:hash(fs.readFileSync(tgz)),
 case_results:[],status:'INCOMPLETE',non_claims:['Not a production assurance','Not an independent user acceptance','Not release authorization']};
function check(name,fn){fn();receipt.case_results.push({name,result:'PASS'});}
function call(args){const p=spawnSync(process.execPath,[cli,...args],{cwd:out,encoding:'utf8',timeout:90000,maxBuffer:8e6,
 env:{...process.env,HOME:path.join(out,'isolated-home'),USERPROFILE:path.join(out,'isolated-home')}});
 if(p.error)throw p.error;return p;}
try{
 check('installed identity and candidate-only CLI',()=>{
  assert.equal(JSON.parse(fs.readFileSync(path.join(pkg,'package.json'),'utf8')).version,'7.1.0-rc.0');
  assert.equal(call(['--version']).stdout.trim(),'guard 7.1.0-rc.0');
  assert(call(['--help']).stdout.includes('guard review --pack'));
 });
 let result;
 check('one-command I-1 installed bundle generation',()=>{
  const dest=path.join(out,'review-bundle');
  result=call(['review','--pack',sample,'--out',dest,'--format','json']);
  assert.equal(result.status,0,result.stderr);
  const summary=JSON.parse(result.stdout);assert.equal(summary.status,'ready_for_review');
  assert.equal(summary.native_pack_validation_exit_code,0);
  assert.equal(summary.not_approval,true);
  const manifest=JSON.parse(fs.readFileSync(path.join(dest,'review-manifest.json'),'utf8'));
  assert.equal(manifest.non_executing,true);
  assert.equal(manifest.components.pack_validation.native_exit_code,0);
  assert(!fs.existsSync(path.join(dest,'.private-source')));
  const index=JSON.parse(fs.readFileSync(path.join(dest,'bundle-checksums.json'),'utf8'));
  for(const f of index.files){const bytes=fs.readFileSync(path.join(dest,f.path));assert.equal(hash(bytes),f.sha256);assert.equal(bytes.length,f.bytes);}
  receipt.bundle_artifact_hashes=Object.fromEntries(index.files.map(x=>[x.path,x.sha256]));
  receipt.logic_hash=summary.deterministic_pack_hash;
 });
 check('installed native report comparison',()=>{
  const orig=call(['report','single-agent','--pack',sample,'--preview','--json']);
  assert.equal(orig.status,0,orig.stderr);
  assert.deepEqual(JSON.parse(orig.stdout),JSON.parse(fs.readFileSync(path.join(out,'review-bundle','components','single-agent-governance-report.json'),'utf8')));
  receipt.report_sha256=hash(Buffer.from(orig.stdout,'utf8'));
 });
 check('installed I-1 explicit no-clobber',()=>{
  const again=call(['review','--pack',sample,'--out',path.join(out,'review-bundle')]);
  assert.notEqual(again.status,0);
  assert(fs.existsSync(path.join(out,'review-bundle','review-manifest.json')));
 });
 receipt.status='PASS_BOUNDED_INSTALLED_I1';
}catch(e){receipt.status='FAIL';receipt.error=String(e.stack||e);console.error(receipt.error);process.exitCode=1;}
finally{fs.writeFileSync(path.join(out,'i1-installed-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
 console.log('I1_INSTALL_RECEIPT '+receipt.status);}
