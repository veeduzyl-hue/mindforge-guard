// Explicit Windows-only MSVC build, no npm preinstall/postinstall.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
if(process.platform!=='win32')throw Error('BUILD_UNSUPPORTED_NON_WINDOWS');
if(Number(process.versions.napi)<8)throw Error('NAPI8_REQUIRED');
const include=process.env.I1_NODE_INCLUDE_DIR;
const lib=process.env.I1_NODE_LIB;
if(!include||!lib||!fs.existsSync(path.join(include,'node_api.h'))||!fs.existsSync(lib))throw Error('EXACT_NODE_HEADERS_AND_IMPORT_LIB_REQUIRED');
const output=path.join(dir,'private_acl.node');
if(fs.existsSync(output))throw Error('EXISTING_BINARY_NEVER_OVERWRITE');
const src=path.join(dir,'native_private_acl.cc');
const cmd=['/nologo','/EHsc','/std:c++17','/O2','/LD','/DNAPI_VERSION=8','/I'+include,src,
 '/link','/OUT:'+output,lib,'advapi32.lib','kernel32.lib'];
const res=spawnSync('cl',cmd,{cwd:dir,encoding:'utf8',timeout:180000,maxBuffer:15e6,windowsHide:true});
if(res.stdout)process.stdout.write(res.stdout);
if(res.stderr)process.stderr.write(res.stderr);
if(res.error||res.status!==0||!fs.existsSync(output))throw Error('MSVC_PRIVATE_ACL_BUILD_FAILED_'+res.status);
const digest=x=>crypto.createHash('sha256').update(fs.readFileSync(x)).digest('hex');
const record={kind:'I1_WIN_NTFS_DACL_ATOMIC_BUILD',experimentalOnly:true,
 node:process.version,napi:process.versions.napi,platform:process.platform,arch:process.arch,
 sourceSha256:digest(src),binarySha256:digest(output),binaryBytes:fs.statSync(output).size,
 compiler:'MSVC',usesNativeSecurityAttributes:true,postCreateIcaclsFallback:false,
 productIntegration:false};
fs.writeFileSync(path.join(dir,'build-receipt.json'),JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log('I1_NATIVE_PRIVATE_ACL_BUILD_PASS',JSON.stringify(record));
