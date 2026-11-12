// I1-REAL-WRITER-WIN-ACL-INTEGRATION-01 — experiment-only actual Writer hook.
// Enabled ONLY with explicit dual gate and parent marker. No source snapshot
// bytes written before NTFS DACL creation + real native readback succeeds.
// Not a public CLI option or distribution-ready product dependency.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const marker='.I1_WIN_PRIVATE_STAGE_SYNTHETIC_ONLY';
const markerContents='I1_REAL_WRITER_WIN_ACL_SYNTHETIC_ONLY\n';
const e=(code)=>Object.assign(new Error('I-1 Windows private stage cannot be verified.'),{code});
export const isPrivateStageExperimentEnabled=()=>process.platform==='win32'&&
 process.env.I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT==='1';
export function createPrivateStageForRealWriter(parent,outputName) {
 if(!isPrivateStageExperimentEnabled())throw e('acl_experiment_disabled');
 if(process.env.I1_REAL_WIN_ACL_SYNTHETIC_ONLY!=='1')throw e('acl_synthetic_gate_required');
 if(typeof parent!=='string'||!path.isAbsolute(parent)||
    !/^[a-zA-Z0-9._-]{1,90}$/.test(outputName))throw e('acl_invalid_parent_or_name');
 let canonical;
 try{
   canonical=fs.realpathSync(parent);
   const m=path.join(canonical,marker),stat=fs.lstatSync(m);
   if(!stat.isFile()||stat.isSymbolicLink()||
      fs.readFileSync(m,'utf8')!==markerContents)throw Error('NOT_SYNTHETIC');
 }catch{throw e('acl_untrusted_synthetic_scope');}
 const binary=process.env.I1_REAL_WIN_ACL_MODULE_PATH;
 const expected=process.env.I1_REAL_WIN_ACL_MODULE_SHA256;
 if(typeof binary!=='string'||!path.isAbsolute(binary)||typeof expected!=='string'||
    !/^[a-f0-9]{64}$/.test(expected))throw e('acl_native_module_missing_identity');
 let contents;
 try{contents=fs.readFileSync(binary);}catch{throw e('acl_native_module_absent');}
 if(contents.length>8*1024*1024)throw e('acl_native_module_oversize');
 if(crypto.createHash('sha256').update(contents).digest('hex')!==expected)throw e('acl_native_module_digest_mismatch');
 let addon;
 try{addon=require(binary);}catch{throw e('acl_native_load_failed');}
 if(typeof addon?.createPrivateBound!=='function'||typeof addon?.inspectAcl!=='function')throw e('acl_native_api_missing');
 const name='.guard-i1-partial-'+outputName+'-'+crypto.randomUUID();
 let created;
 try{created=addon.createPrivateBound(canonical,name);}
 catch{throw e('acl_creation_outcome_unknown_owner_review');}
 if(!created||created.status!=='CREATED_PRIVATE_DACL_VERIFIED'||
    created.privacyConfirmed!==true||created.protectedDacl!==true||
    created.onlyTrustedAces!==true||created.hasInheritedAces!==false||
    created.parentIdentityRechecked!==true||created.filesystem!=='NTFS'){
   // A directory may now exist. Never retry, delete, or claim no creation.
   throw e('acl_created_or_failed_outcome_requires_owner_review');
 }
 const stage=path.join(canonical,name);
 try{
  const ls=fs.lstatSync(stage);
  if(!ls.isDirectory()||ls.isSymbolicLink())throw Error('NOT_DIRECTORY');
  const post=addon.inspectAcl(stage);
  if(post.status!=='ACL_OBSERVED'||!post.protectedDacl||!post.onlyTrustedAces||
     post.hasInheritedAces||post.createdObjectIdentity!==created.createdObjectIdentity)throw Error('ACL_CHANGED');
 }catch{throw e('acl_post_create_untrusted_owner_review');}
 return {stage,privacyConfirmed:true,nativeApi:created.nativeApi,
    parentIdentity:created.parentObjectIdentity,stageIdentity:created.createdObjectIdentity,
    permissionPolicy:'SYNTHETIC_USER_AND_SYSTEM_ONLY',
    sourceRawCopyWritten:false};
}
