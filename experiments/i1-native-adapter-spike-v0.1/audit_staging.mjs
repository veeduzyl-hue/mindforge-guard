// Read-only synthetic orphan audit; never deletes or copies a staging directory.
// Not a Guard CLI recovery command and never runs on production directories.
import fs from 'node:fs';
import path from 'node:path';
import {markerName} from './load.mjs';
export function inspectSyntheticStaging(root){
  if(!path.isAbsolute(root))throw new Error('Absolute synthetic fixture root required');
  const canonical=fs.realpathSync(root);
  if(fs.readFileSync(path.join(canonical,markerName()),'utf8')!=='I1_NATIVE_SPIKE_SYNTHETIC_FIXTURE_V01\n'){
    throw new Error('Not a synthetic fixture root');
  }
  const findings=[];
  for(const item of fs.readdirSync(canonical,{withFileTypes:true})){
    if(!item.name.startsWith('.guard-i1-partial-'))continue;
    const target=path.join(canonical,item.name);
    if(item.isSymbolicLink()||!item.isDirectory()){
      findings.push({name:item.name,status:'UNTRUSTED_STAGING_ENTRY',ownerReviewRequired:true});
      continue;
    }
    const privatePath=path.join(target,'.private-source');
    const incompletePath=path.join(target,'INCOMPLETE.json');
    let sensitive=false,marked=false;
    try{const s=fs.lstatSync(privatePath);sensitive=s.isDirectory()&&!s.isSymbolicLink();}catch{}
    try{const s=fs.lstatSync(incompletePath);marked=s.isFile()&&!s.isSymbolicLink();}catch{}
    findings.push({name:item.name,status:sensitive?'ORPHAN_PRIVATE_SOURCE_RETAINS_DATA':
      marked?'INCOMPLETE_REVIEW_REQUIRED':'UNCLASSIFIED_PARTIAL_REVIEW_REQUIRED',
      sensitiveSnapshotPresent:sensitive,incompleteMarkerPresent:marked,
      ownerReviewRequired:true,automaticCleanupPerformed:false});
  }
  return {kind:'I1_NATIVE_SPIKE_SYNTHETIC_RECOVERY_AUDIT',readOnly:true,
    productIntegration:false,automaticCleanupPerformed:false,
    count:findings.length,findings};
}
