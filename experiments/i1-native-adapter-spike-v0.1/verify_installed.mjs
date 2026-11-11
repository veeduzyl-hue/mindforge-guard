// Independent offline install smoke for a synthetic Node-API candidate tarball.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const prefix=path.resolve(process.argv[2]||'');
const out=path.resolve(process.argv[3]||'');
const pkg=path.join(prefix,'node_modules','@mindforge','i1-native-adapter-spike');
const moduleFile=path.join(pkg,'native_adapter.node');
assert(fs.existsSync(moduleFile),'Installed .node binary missing');
const manifest=JSON.parse(fs.readFileSync(path.join(pkg,'package.json'),'utf8'));
assert.equal(manifest.private,true);
assert.deepEqual(Object.keys(manifest.scripts||{}),[]);
assert(!fs.existsSync(path.join(pkg,'native_adapter.cc')));
const sha=crypto.createHash('sha256').update(fs.readFileSync(moduleFile)).digest('hex');
const {nativeCommit,createSyntheticFixtureMarker}=await import(pathToFileURL(path.join(pkg,'load.mjs')).href);
const root=fs.mkdtempSync(path.join(os.tmpdir(),'i1-spike-installed-'));
const src=path.join(root,'src'),dst=path.join(root,'dest');
try{
 process.env.I1_NATIVE_SPIKE_FIXTURE_BUILDER='1';
 createSyntheticFixtureMarker(root);
 fs.mkdirSync(src);fs.mkdirSync(dst);
 fs.mkdirSync(path.join(src,'stage'));
 fs.writeFileSync(path.join(src,'stage','source.txt'),'SYNTHETIC_PACKAGE_SMOKE');
 process.env.I1_NATIVE_SPIKE_ENABLED='1';
 const opts={enabled:true,mode:'SYNTHETIC_ONLY',fixtureRoot:root,
   sourceParent:src,sourceName:'stage',destinationParent:dst,destinationName:'final',
   expectedBinarySha256:sha};
 const first=nativeCommit(opts);assert.equal(first.status,'COMMITTED_CONFIRMED');
 assert.equal(fs.readFileSync(path.join(dst,'final','source.txt'),'utf8'),'SYNTHETIC_PACKAGE_SMOKE');
 fs.mkdirSync(path.join(src,'stage2'));
 const second=nativeCommit({...opts,sourceName:'stage2'});
 assert.equal(second.status,'REFUSED_ALREADY_EXISTS');
 const r={kind:'I1_NATIVE_SPIKE_OFFLINE_PACKAGE_SMOKE',status:'PASS_BOUNDED',
  node:process.version,platform:process.platform,arch:process.arch,private:manifest.private,
  noInstallScripts:true,installedNativeBinarySha256:sha,first:first.status,second:second.status,
  productionGuardIntegration:false};
 fs.writeFileSync(path.join(out,'installed-package-receipt.json'),JSON.stringify(r,null,2)+'\n');
 console.log('I1_NATIVE_SPIKE_INSTALLED_PASS',JSON.stringify(r));
}finally{fs.rmSync(root,{recursive:true,force:true});}
