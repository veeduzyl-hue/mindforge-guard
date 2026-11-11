// I1-NATIVE-ADAPTER-SPIKE-v0.1: experiment-only loader, intentionally default OFF.
// Not imported by Guard CLI, I-1 Bundle Writer or npm product. Never falls
// back to fs.rename, copy+unlink, subprocess mv, or a Python helper.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require = createRequire(import.meta.url);
const MODULE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'native_adapter.node');
const MARKER = '.i1-native-spike-synthetic-only';
const MARKER_TEXT = 'I1_NATIVE_SPIKE_SYNTHETIC_FIXTURE_V01\n';

const result=(status, extra={})=>({status,committed:false,locatorConfirmed:false,noFallback:true,
  experimentalOnly:true,productionGuardIntegration:false,...extra});
const inside=(parent,child)=>{
  const rel=path.relative(parent,child);
  return rel && rel!=='..'&&!rel.startsWith('..'+path.sep)&&!path.isAbsolute(rel);
};
const nameOk=x=>typeof x==='string'&&x.length>0&&x!=='.'&&x!=='..'&&!/[\/\\:\0]/.test(x)&&Buffer.byteLength(x,'utf8')<=240;
export function spikeModulePath(){return MODULE;}
export function markerName(){return MARKER;}
export function createSyntheticFixtureMarker(root){
  if(process.env.I1_NATIVE_SPIKE_FIXTURE_BUILDER!=='1')throw new Error('Fixture creation forbidden without explicit isolated test mode');
  const base=fs.realpathSync(root);
  fs.writeFileSync(path.join(base,MARKER),MARKER_TEXT,{flag:'wx',mode:0o600});
}
export function nativeCommit(options={}){
  // Both gates are mandatory and checked before loading the binary.
  if(process.env.I1_NATIVE_SPIKE_ENABLED!=='1'||options.enabled!==true){
    return result('DISABLED_DEFAULT_OFF');
  }
  if(options.mode!=='SYNTHETIC_ONLY')return result('REFUSED_NOT_SYNTHETIC_MODE');
  if(!Number.isInteger(Number(process.versions.napi))||Number(process.versions.napi)<8){
    return result('REFUSED_INCOMPATIBLE_NODE_API');
  }
  if(!nameOk(options.sourceName)||!nameOk(options.destinationName)){
    return result('REFUSED_UNSAFE_BASENAME');
  }
  let root,sourceParent,destinationParent;
  try{
    if(!options.fixtureRoot||!options.sourceParent||!options.destinationParent)return result('REFUSED_MISSING_SCOPE');
    if(!path.isAbsolute(options.fixtureRoot)||!path.isAbsolute(options.sourceParent)||!path.isAbsolute(options.destinationParent)){
      return result('REFUSED_RELATIVE_PATH');
    }
    // realpath is admission preflight, *not* the native security boundary.
    root=fs.realpathSync(options.fixtureRoot);
    sourceParent=fs.realpathSync(options.sourceParent);
    destinationParent=fs.realpathSync(options.destinationParent);
    const marker=path.join(root,MARKER);
    if(fs.lstatSync(marker).isSymbolicLink()||fs.readFileSync(marker,'utf8')!==MARKER_TEXT){
      return result('REFUSED_MISSING_SYNTHETIC_MARKER');
    }
    if(!inside(root,sourceParent)||!inside(root,destinationParent)){
      return result('REFUSED_OUT_OF_SCOPE');
    }
  }catch{return result('REFUSED_INVALID_FIXTURE_ROOT');}
  if(typeof options.expectedBinarySha256!=='string'||!/^[a-f0-9]{64}$/.test(options.expectedBinarySha256)){
    return result('REFUSED_MISSING_BINARY_DIGEST');
  }
  let bytes;
  try{bytes=fs.readFileSync(MODULE);}catch{return result('REFUSED_MODULE_MISSING');}
  const observed=crypto.createHash('sha256').update(bytes).digest('hex');
  if(observed!==options.expectedBinarySha256)return result('REFUSED_BINARY_DIGEST_MISMATCH',{observedSha256:observed});
  let native;
  try{native=require(MODULE);}
  catch(err){return result('REFUSED_MODULE_LOAD',{loadErrorCode:String(err?.code||'MODULE_LOAD_ERROR')});}
  if(!native||typeof native.renameNoReplace!=='function')return result('REFUSED_MODULE_API');
  try{
    const response=native.renameNoReplace(sourceParent,options.sourceName,destinationParent,options.destinationName);
    if(!response||response.noFallback!==true||typeof response.status!=='string'){
      return result('REFUSED_INVALID_NATIVE_RESULT');
    }
    return {...response,experimentalOnly:true,productionGuardIntegration:false,
      fixtureScope:'SYNTHETIC_ONLY',binarySha256:observed};
  }catch(err){
    // If a native call raised an unexpected exception we CANNOT assert the
    // commit did not occur. Report uncertain, never clean up any target blindly.
    return result('COMMIT_OUTCOME_UNKNOWN',{commitStateKnown:false,
      errorCode:String(err?.code||'NATIVE_EXCEPTION')});
  }
}
