// I1-WIN-ACL-01 experiment-only, NOT a Guard product import.
// Native CreateDirectoryW receives protected DACL at object creation.
// Double-opt-in + owned synthetic root + exact native binary hash.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const dir=path.dirname(fileURLToPath(import.meta.url));
const binary=path.join(dir,'private_acl.node');
const marker='.I1_WIN_ACL_01_SYNTHETIC_ONLY';
const markerValue='I1_WIN_ACL_01_NO_CUSTOMER_DATA\n';
const result=(status,details={})=>({status,created:false,privacyConfirmed:false,productIntegration:false,
  automaticCleanup:false,syntheticOnly:true,noPostCreateIcaclsFallback:true,...details});
const isWithin=(root,part)=>{
 const rel=path.relative(root,part);
 return rel!==''&&rel!=='..'&&!rel.startsWith('..'+path.sep)&&!path.isAbsolute(rel);
};
const nameOK=n=>typeof n==='string'&&n.length>5&&n.length<90&&/^\.guard-i1-partial-[a-zA-Z0-9-]+$/.test(n);
function scope(o){
 if(!o?.root||!o?.parent||!path.isAbsolute(o.root)||!path.isAbsolute(o.parent))return null;
 const root=fs.realpathSync(o.root),parent=fs.realpathSync(o.parent);
 const f=path.join(root,marker);
 const st=fs.lstatSync(f);
 if(st.isSymbolicLink()||!st.isFile()||fs.readFileSync(f,'utf8')!==markerValue||
    !isWithin(root,parent))return null;
 return {root,parent};
}
function native(o) {
 if(typeof o?.binarySha256!=='string'||!/^[a-f0-9]{64}$/.test(o.binarySha256))return {status:'REFUSED_BINARY_DIGEST_MISSING'};
 let bytes;
 try{bytes=fs.readFileSync(binary);}catch{return {status:'REFUSED_NATIVE_MODULE_MISSING'};}
 const observed=crypto.createHash('sha256').update(bytes).digest('hex');
 if(observed!==o.binarySha256)return {status:'REFUSED_NATIVE_MODULE_DIGEST_MISMATCH',observedSha256:observed};
 try{
  const addon=require(binary);
  if(!addon||typeof addon.createPrivate!=='function'||typeof addon.inspectAcl!=='function')return {status:'REFUSED_NATIVE_ADDON_API'};
  return {addon,observed};
 }catch(e){return {status:'REFUSED_NATIVE_ADDON_LOAD',code:String(e?.code||'UNKNOWN')};}
}
export function makeSyntheticRoot(){
 if(process.env.I1_WIN_ACL_ALLOW_SYNTHETIC_FIXTURE!=='1'||process.platform!=='win32')throw Error('Synthetic root creation disabled');
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'i1-private-acl-synthetic-'));
 fs.writeFileSync(path.join(root,marker),markerValue,{flag:'wx'});
 const parent=path.join(root,'permissive-parent');
 fs.mkdirSync(parent);
 return {root,parent};
}
export function createPrivateStage(o={}){
 if(process.env.I1_WIN_ACL_EXPERIMENT!=='1'||o.enabled!==true)return result('DISABLED_DEFAULT_OFF');
 if(process.platform!=='win32')return result('REFUSED_PLATFORM_NOT_WINDOWS');
 if(o.mode!=='SYNTHETIC_ONLY')return result('REFUSED_NOT_SYNTHETIC');
 if(!nameOK(o.name))return result('REFUSED_UNSAFE_STAGE_BASENAME');
 let s;try{s=scope(o);}catch{return result('REFUSED_SCOPE_INVALID');}
 if(!s)return result('REFUSED_NOT_OWNED_SYNTHETIC_SCOPE');
 const mod=native(o);if(!mod.addon)return result(mod.status,mod);
 let ret;
 try{ret=mod.addon.createPrivate(s.parent,o.name);}
 catch{return result('CREATION_OUTCOME_UNKNOWN_NO_RETRY',{createdMayHaveOccurred:true});}
 if(!ret||typeof ret.status!=='string'||typeof ret.created!=='boolean'||typeof ret.privacyConfirmed!=='boolean'){
  return result('REFUSED_NATIVE_RESULT_UNTRUSTED',{createdMayHaveOccurred:true});
 }
 return {...ret,syntheticOnly:true,productIntegration:false,automaticCleanup:false,
   noPostCreateIcaclsFallback:true,binarySha256:mod.observed};
}
export function inspectSyntheticAcl(o={}){
 if(process.env.I1_WIN_ACL_EXPERIMENT!=='1'||o.enabled!==true)return result('DISABLED_DEFAULT_OFF');
 if(process.platform!=='win32')return result('REFUSED_PLATFORM_NOT_WINDOWS');
 let s;try{s=scope(o);}catch{return result('REFUSED_SCOPE_INVALID');}
 if(!s)return result('REFUSED_NOT_OWNED_SYNTHETIC_SCOPE');
 const mod=native(o);if(!mod.addon)return result(mod.status,mod);
 if(typeof o.path!=='string'||!path.isAbsolute(o.path)||!isWithin(s.root,path.resolve(o.path)))return result('REFUSED_OUT_OF_SCOPE');
 try{return {...mod.addon.inspectAcl(o.path),syntheticOnly:true,productIntegration:false};}
 catch{return result('REFUSED_NATIVE_ACL_INSPECTION');}
}
