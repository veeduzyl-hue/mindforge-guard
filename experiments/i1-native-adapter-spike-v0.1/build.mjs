// Explicit CI build only. No npm install/postinstall scripts and no new deps.
// Exact Node headers and compiler are part of the machine receipt.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
const dir=path.dirname(fileURLToPath(import.meta.url));
const nodeDir=path.dirname(process.execPath);
const candidates=[
  process.env.I1_NODE_INCLUDE_DIR,
  path.join(nodeDir,'include','node'),
  path.resolve(nodeDir,'..','include','node'),
  '/usr/include/node',
].filter(Boolean);
const include=candidates.find(p=>fs.existsSync(path.join(p,'node_api.h')));
if(!include){console.error('I1_NATIVE_BUILD_BLOCKED: NODE_API_HEADERS_UNAVAILABLE',JSON.stringify(candidates));process.exit(20);}
const input=path.join(dir,'native_adapter.cc');
const output=path.join(dir,'native_adapter.node');
const args=process.platform==='win32'?
 ['/nologo','/EHsc','/std:c++17','/O2','/LD','/DNAPI_VERSION=8','/I'+include,input,'/link','/OUT:'+output,
  process.env.I1_NODE_LIB||path.join(nodeDir,'node.lib')]:
 process.platform==='darwin'?
 ['-std=c++17','-O2','-fPIC','-bundle','-undefined','dynamic_lookup','-DNAPI_VERSION=8','-I'+include,input,'-o',output]:
 ['-std=c++17','-O2','-fPIC','-shared','-DNAPI_VERSION=8','-I'+include,input,'-o',output];
const compiler=process.platform==='win32'?'cl':process.platform==='darwin'?'clang++':'g++';
console.log('I1_BUILD_ENV',JSON.stringify({compiler,platform:process.platform,arch:process.arch,
 node:process.version,napi:process.versions.napi,include,nodeLib:process.platform==='win32'?args.at(-1):null}));
if(process.platform==='win32'&&!fs.existsSync(args.at(-1))){
 console.error('I1_NATIVE_BUILD_BLOCKED: NODE_IMPORT_LIBRARY_UNAVAILABLE',args.at(-1));process.exit(21);
}
if(fs.existsSync(output))throw new Error('Existing native binary must not be overwritten by spike build');
const result=spawnSync(compiler,args,{cwd:dir,encoding:'utf8',timeout:180000,maxBuffer:16e6,windowsHide:true});
if(result.stdout)process.stdout.write(result.stdout);
if(result.stderr)process.stderr.write(result.stderr);
if(result.error||result.status!==0||!fs.existsSync(output)){
 console.error('I1_NATIVE_BUILD_FAILED',String(result.error||result.status));process.exit(22);
}
const sourceSha=crypto.createHash('sha256').update(fs.readFileSync(input)).digest('hex');
const binSha=crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex');
const manifest={kind:'I1_NATIVE_SPIKE_SOURCE_BINARY_RECEIPT',experimentalOnly:true,
 compiler,platform:process.platform,arch:process.arch,node:process.version,napi:process.versions.napi,
 includeSource:include,sourceSha256:sourceSha,binarySha256:binSha,binaryBytes:fs.statSync(output).size,
 buildViaInstallScript:false,productionPackageChanged:false};
fs.writeFileSync(path.join(dir,'build-receipt.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
console.log('I1_NATIVE_BUILD_SUCCESS',JSON.stringify(manifest));
