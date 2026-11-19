// Bounded M3 Source Inventory test suite; SEPARATE from M4 62 scenarios.
// No product CLI/source contracts changes, no real customer inputs.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const source=path.resolve('examples/single-agent-governance-pack/hr-self-service-agent');
const cli=path.resolve('scripts/arch_v02x_m3_source_inventory_synthetic.mjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'arch-v02x-m3-inventory-'));
const sample=path.join(root,'synthetic-source-pack');
const marker='.ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY';
const tests=[];
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
function run(args,envOverride={}){
  const env={...process.env,
    ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY:'1',
    ARCH_V02X_M3_INVENTORY_FIXTURE_ROOT:root,
    ...envOverride};
  const r=spawnSync(process.execPath,[cli,...args],{
    cwd:root,env,encoding:'utf8',timeout:20000,maxBuffer:4*1024*1024
  });
  if(r.error)throw r.error;
  assert.equal(r.signal,null,'Unexpected child signal');
  assert(r.stdout,'Missing machine output');
  return {exit:r.status,result:JSON.parse(r.stdout),stderr:r.stderr};
}
const argsFor=p=>['--source',p,'--target-contract','first-report-pack','--format','json'];
function rejectWith(args,reason,env){
  const r=run(args,env);
  assert.equal(r.exit,24,'Must fail closed');
  assert.equal(r.result.status,'BLOCKED');
  assert.equal(r.result.reason,reason);
  assert.equal(r.result.source_copy_written,false);
  return r;
}
function check(id,name,fn){
  try {const result=fn();tests.push({id,name,status:'PASS',detail:result||{}});
    console.log('PASS '+id+' '+name);}
  catch(e){tests.push({id,name,status:'FAIL',error:String(e?.stack||e).slice(0,2300)});
    console.error('FAIL '+id+' '+String(e?.message||e));}
}
const notTested=(id,reason)=>{
  tests.push({id,status:'NOT_TESTED',reason});console.log('NOT_TESTED '+id+' '+reason);
};
function noLeaks(r){
  const serialized=JSON.stringify(r.result);
  assert(!serialized.includes(root),'Absolute fixture paths leaked');
  assert(!serialized.includes('manifest.json'),'Original source filenames leaked');
  assert(!serialized.includes('SYNTH_SECRET_MARKER'),'Secret sample text leaked');
  assert(!serialized.includes('.env'),'Excluded filenames leaked');
  assert(!serialized.includes('private_acl.node'),'Native addon path leaked');
}
try{
  assert(fs.existsSync(cli));
  assert(fs.existsSync(source));
  fs.writeFileSync(path.join(root,marker),'ARCH_V02X_SOURCE_INVENTORY_SYNTHETIC_ONLY\n',{flag:'wx'});
  fs.cpSync(source,sample,{recursive:true});

  check('M3I-01','no synthetic opt-in refuses all input without sensitive leakage',()=>{
    const r=rejectWith(argsFor(sample),'EXPLICIT_SYNTHETIC_MODE_REQUIRED',{
      ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY:''});
    noLeaks(r);
  });
  check('M3I-02','canonical First Report top-level inventory without recursion',()=>{
    const r=run(argsFor(sample));assert.equal(r.exit,0,r.stderr);
    const inv=r.result;
    assert.equal(inv.kind,'mindforge_source_inventory');
    assert.equal(inv.version,'0.1');
    assert.equal(inv.scope.selection_mode,'explicit_paths');
    assert.equal(inv.scope.recursive,false);
    assert.equal(inv.scope.network_access,false);
    assert.equal(inv.scope.target_contract,'first-report-pack');
    assert.equal(inv.summary.included_count,9);
    assert.equal(inv.summary.inventory_only_count,0);
    assert.equal(inv.summary.skipped_nested_directories,1);
    assert.equal(inv.sources.length,9);
    assert(inv.sources.every(x=>x.sensitivity==='unknown' &&
      x.redaction_status==='not_assessed'&&x.inventory_status==='included'));
    assert(inv.sources.every(x=>/^sha256:[a-f0-9]{64}$/.test(x.source_sha256)));
    assert.equal(inv.lifecycle,'SELECT_AND_INVENTORY_ONLY');
    assert.equal(inv.authority,'NO_APPROVAL_NO_EXECUTION_PERMISSION');
    noLeaks(r);
    return {topLevelFiles:9,nestedDirectorySkipped:1};
  });
  check('M3I-03','sensitive and build entries excluded without hashing or exporting names',()=>{
    fs.writeFileSync(path.join(sample,'.env.local'),'SYNTH_SECRET_MARKER=NEVER_EXPORT');
    fs.writeFileSync(path.join(sample,'key.pfx'),'SYNTH_SECRET_MARKER_PFX');
    fs.mkdirSync(path.join(sample,'node_modules'));
    fs.mkdirSync(path.join(sample,'.git'));
    const r=run(argsFor(sample));assert.equal(r.exit,0);
    assert.equal(r.result.summary.included_count,9);
    assert.equal(r.result.summary.excluded_count,4);
    noLeaks(r);
  });
  check('M3I-04','binary source inventory-only; no automatic semantic extraction',()=>{
    const bytes=Buffer.from([0,1,2,3,0,255,100]);
    fs.writeFileSync(path.join(sample,'opaque.pdf'),bytes);
    const r=run(argsFor(sample));assert.equal(r.exit,0);
    const opaque=r.result.sources.filter(x=>x.source_kind==='binary');
    assert.equal(opaque.length,1);
    assert.equal(opaque[0].inventory_status,'inventory_only');
    assert.equal(opaque[0].source_sha256,'sha256:'+digest(bytes));
    assert.equal(r.result.summary.included_count,9);
    assert.equal(r.result.summary.inventory_only_count,1);
    noLeaks(r);
  });
  check('M3I-05','explicit secret file is rejected before digest export',()=>{
    const p=path.join(sample,'.env.local');
    const r=rejectWith(argsFor(p),'EXCLUDED_OR_SECRET_EXPLICIT_SOURCE');
    noLeaks(r);
  });
  check('M3I-06','symlink source entry escape refused and never read',()=>{
    const link=path.join(sample,'outside-link.json');
    try{fs.symlinkSync(path.join(root,'outside-secret.json'),link,'file');}
    catch(e){
      if(process.platform==='win32'&&['EPERM','EACCES','UNKNOWN'].includes(e.code)){
        notTested('M3I-06-SYMLINK-WINDOWS','Host cannot create test symlink; not a rejection PASS');
        return {platformLimitation:true};
      }
      throw e;
    }
    const r=rejectWith(argsFor(sample),'SYMLINK_OR_REPARSE_ENTRY_REFUSED');
    noLeaks(r);
    fs.unlinkSync(link);
  });
  check('M3I-07','outside fixture scope never follows source',()=>{
    const outside=path.resolve(os.tmpdir(),'arch-v02x-no-implicit-source');
    const r=rejectWith(argsFor(outside),'SOURCE_OUTSIDE_SYNTHETIC_FIXTURE_ROOT');
    noLeaks(r);
  });
  check('M3I-08','duplicates and unsupported grammar fail before reading sources',()=>{
    rejectWith([...argsFor(sample),'--source',sample],'DUPLICATE_SINGLETON_OPTION');
    rejectWith(['--source',sample,'--format','json'],'EXPLICIT_SOURCE_TARGET_AND_FORMAT_REQUIRED');
    rejectWith(['--source',sample,'--target-contract','eak-v1','--format','json'],'UNSUPPORTED_TARGET_OR_FORMAT');
    rejectWith(['--source',sample,'--target-contract','first-report-pack','--format','json','--recursive'],'UNSUPPORTED_OPTION_OR_MODE');
    rejectWith(['--source','relative','--target-contract','first-report-pack','--format','json'],'ABSOLUTE_SOURCE_PATH_REQUIRED');
  });
  check('M3I-09','per-file byte cap fails closed',()=>{
    const p=path.join(sample,'oversize.txt');
    fs.writeFileSync(p,Buffer.alloc(4*1024*1024+1,0));
    rejectWith(argsFor(sample),'EXPERIMENTAL_PER_FILE_LIMIT_EXCEEDED');
    fs.unlinkSync(p);
  });
  check('M3I-10','file count cap fails closed',()=>{
    const added=[];
    for(let i=0;i<23;i++){
      const p=path.join(sample,'synthetic-extra-'+i+'.txt');
      fs.writeFileSync(p,'SYNTHETIC_ONLY');added.push(p);
    }
    const r=rejectWith(argsFor(sample),'EXPERIMENTAL_FILE_COUNT_LIMIT_EXCEEDED');
    noLeaks(r);
    for(const p of added)fs.unlinkSync(p);
  });
  check('M3I-11','explicit single JSON file has one opaque source reference',()=>{
    const p=path.join(sample,'manifest.json');
    const r=run(argsFor(p));assert.equal(r.exit,0);
    assert.equal(r.result.sources.length,1);
    assert.equal(r.result.sources[0].source_kind,'json');
    assert.equal(r.result.sources[0].source_sha256,'sha256:'+digest(fs.readFileSync(p)));
    assert.equal(r.result.summary.included_count,1);
    noLeaks(r);
  });
  check('M3I-12','Unicode source file name accepted but withheld',()=>{
    const name='合成示例文件-😀.md';
    const p=path.join(sample,name);
    fs.writeFileSync(p,'合成資料 - no confidential content');
    const r=run(argsFor(sample));assert.equal(r.exit,0);
    assert.equal(r.result.summary.included_count,10);
    assert.equal(r.result.sources.filter(x=>x.source_kind==='markdown').length,3);
    assert(!JSON.stringify(r.result).includes(name));
    noLeaks(r);
    fs.unlinkSync(p);
  });
  check('M3I-13','source hashes stable on repeated read; no original file mutation',()=>{
    const m=path.join(sample,'manifest.json');
    const before=digest(fs.readFileSync(m));
    const a=run(argsFor(sample)),b=run(argsFor(sample));
    assert.equal(a.exit,0);assert.equal(b.exit,0);
    const fields=arr=>arr.map(x=>({
      id:x.source_id,kind:x.source_kind,hash:x.source_sha256,size:x.byte_length,status:x.inventory_status
    }));
    assert.deepEqual(fields(a.result.sources),fields(b.result.sources));
    assert.equal(digest(fs.readFileSync(m)),before);
    assert.equal(a.result.source_copy_written,false);
    noLeaks(a);noLeaks(b);
  });
  check('M3I-14','unsupported-only input refuses automatic mapping',()=>{
    const p=path.join(sample,'opaque.pdf');
    const r=rejectWith(argsFor(p),'UNSUPPORTED_ONLY_INPUT_NO_AUTOMAPPING');
    noLeaks(r);
  });
  check('M3I-15','unknown file is listed inventory-only without content',()=>{
    fs.writeFileSync(path.join(sample,'opaque.xyz'),'SYNTH_SECRET_MARKER_NEVER_OUTPUT');
    const r=run(argsFor(sample));assert.equal(r.exit,0);
    assert.equal(r.result.sources.filter(x=>x.source_kind==='unknown').length,1);
    assert.equal(r.result.sources.filter(x=>x.inventory_status==='inventory_only').length,2);
    noLeaks(r);
  });
}finally{
  // Delete ONLY this fresh disposable synthetic test root; no customer inputs.
  fs.rmSync(root,{recursive:true,force:true});
}
const fails=tests.filter(x=>x.status==='FAIL');
const counts={pass:tests.filter(x=>x.status==='PASS').length,
  fail:fails.length,not_tested:tests.filter(x=>x.status==='NOT_TESTED').length};
const id=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8',timeout:5000});
const receipt={kind:'ARCH_V02X_M3_SOURCE_INVENTORY_SYNTHETIC_TEST',
  tested_head:id.status===0?id.stdout.trim():'UNVERIFIED',
  platform:process.platform,arch:process.arch,node:process.version,
  data_class:'SYNTHETIC_ONLY',scope:'SELECT_INVENTORY_ONLY',
  officialM4Matrix62:'NOT_RUN',humanConfirmation:'NOT_IMPLEMENTED',
  packageOutput:'NOT_IMPLEMENTED',customerData:'NOT_AUTHORIZED',
  runtimeGuardCli:'UNCHANGED',sourceCopyWritten:false,
  counts,cases:tests};
console.log('ARCH_V02X_M3_INVENTORY_TEST_RECEIPT '+JSON.stringify(receipt));
if(fails.length)process.exitCode=1;
