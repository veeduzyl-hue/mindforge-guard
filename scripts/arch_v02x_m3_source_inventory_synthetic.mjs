// ARCH v0.2.x M3 Track A SELECT -> INVENTORY synthetic candidate.
// No Guard CLI extension, no Source Onboarding routing, no source copies.
// Inputs are restricted to a newly marked synthetic fixture root.
// stdout: metadata only; no raw content, source file names, absolute paths or secrets.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const MARKER='.ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY';
const MARKER_BYTES='ARCH_V02X_SOURCE_INVENTORY_SYNTHETIC_ONLY\n';
const MAX_FILES=32;
const MAX_FILE_BYTES=4*1024*1024;
const MAX_TOTAL_BYTES=16*1024*1024;
const FORMAT_KIND=new Map([
  ['.json','json'],['.jsonl','jsonl'],['.yml','yaml_text'],
  ['.yaml','yaml_text'],['.md','markdown'],['.txt','text']
]);
const BINARY_EXTENSIONS=new Set([
  '.pdf','.png','.jpg','.jpeg','.webp','.gif','.zip',
  '.bin','.docx','.xlsx','.pptx'
]);
const SKIP_NAMES=new Set([
  '.git','.mindforge','.ssh','node_modules','dist','build','coverage',
  'out','target','__pycache__'
]);
const SECRET_EXTENSIONS=new Set(['.pem','.key','.pfx','.p12','.jks','.keystore']);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
class InventoryRefusal extends Error {
  constructor(reason){super(reason);this.name='InventoryRefusal';}
}
const reject=reason=>{throw new InventoryRefusal(reason);};
function forbiddenName(name){
  const n=name.toLowerCase();
  return SKIP_NAMES.has(n)||n.startsWith('.env')||n.startsWith('id_rsa')||
    n.startsWith('id_ed25519')||SECRET_EXTENSIONS.has(path.extname(n))||
    n.startsWith('.') && n!=='.' && n!=='..';
}
function compareName(a,b){return a.name<b.name?-1:a.name>b.name?1:0;}
function safeInside(root,p){
  const relative=path.relative(root,p);
  return relative.length>0 && relative!=='..' && !relative.startsWith('..'+path.sep)
    && !path.isAbsolute(relative);
}
function mustBePlainDir(p){
  const st=fs.lstatSync(p);
  if(!st.isDirectory()||st.isSymbolicLink())reject('UNSAFE_SOURCE_DIRECTORY_OR_REPARSE');
}
function strictArgs(argv){
  if(argv.length===1 && ['-h','--help'].includes(argv[0]))return {help:true};
  const r={source:null,target:null,format:null};
  for(let i=0;i<argv.length;i++){
    const key=argv[i];
    if(!['--source','--target-contract','--format'].includes(key))reject('UNSUPPORTED_OPTION_OR_MODE');
    if(i+1>=argv.length||argv[i+1].startsWith('--'))reject('MISSING_REQUIRED_VALUE');
    const field=key==='--target-contract'?'target':key.slice(2);
    if(r[field]!==null)reject('DUPLICATE_SINGLETON_OPTION');
    r[field]=argv[++i];
  }
  if(!r.source||!r.target||!r.format)reject('EXPLICIT_SOURCE_TARGET_AND_FORMAT_REQUIRED');
  if(r.target!=='first-report-pack'||r.format!=='json')reject('UNSUPPORTED_TARGET_OR_FORMAT');
  if(!path.isAbsolute(r.source))reject('ABSOLUTE_SOURCE_PATH_REQUIRED');
  return r;
}
function metadataFromFile(file,sourceRoot,idx,stamp){
  const before=fs.lstatSync(file,{bigint:true});
  if(!before.isFile()||before.isSymbolicLink())reject('UNSAFE_FILE_ENTRY_OR_REPARSE');
  if(before.size>BigInt(MAX_FILE_BYTES))reject('EXPERIMENTAL_PER_FILE_LIMIT_EXCEEDED');
  const resolved=fs.realpathSync(file);
  if(resolved!==sourceRoot && !safeInside(sourceRoot,resolved)){
    reject('SOURCE_PATH_ESCAPES_SELECTED_SCOPE');
  }
  let fd;
  let data;
  try {
    fd=fs.openSync(file,fs.constants.O_RDONLY);
    const opened=fs.fstatSync(fd,{bigint:true});
    if(!opened.isFile()||opened.dev!==before.dev||opened.ino!==before.ino||
       opened.size!==before.size||opened.mtimeNs!==before.mtimeNs){
      reject('SOURCE_CHANGED_BEFORE_READ');
    }
    data=fs.readFileSync(fd);
    const after=fs.fstatSync(fd,{bigint:true});
    if(after.dev!==opened.dev||after.ino!==opened.ino||
       after.size!==opened.size||after.mtimeNs!==opened.mtimeNs||
       after.ctimeNs!==opened.ctimeNs||BigInt(data.length)!==opened.size){
      reject('SOURCE_CHANGED_DURING_READ');
    }
  } finally {if(fd!==undefined)fs.closeSync(fd);}
  const pathAfter=fs.lstatSync(file,{bigint:true});
  if(pathAfter.dev!==before.dev||pathAfter.ino!==before.ino||
     pathAfter.size!==before.size||pathAfter.mtimeNs!==before.mtimeNs||
     fs.realpathSync(file)!==resolved){
    reject('SOURCE_CHANGED_AFTER_READ');
  }
  const ext=path.extname(file).toLowerCase();
  const sourceKind=FORMAT_KIND.get(ext)||(BINARY_EXTENSIONS.has(ext)?'binary':'unknown');
  const inventoryStatus=sourceKind==='binary'||sourceKind==='unknown'?'inventory_only':'included';
  return {
    source_id:'source_'+String(idx+1).padStart(3,'0'),
    source_kind:sourceKind,
    source_ref:'source_'+String(idx+1).padStart(3,'0'),
    byte_length:data.length,
    source_sha256:'sha256:'+sha(data),
    imported_at:stamp,
    sensitivity:'unknown',
    redaction_status:'not_assessed',
    inventory_status:inventoryStatus,
    known_limits:inventoryStatus==='included'
      ?['no_semantic_extraction_or_authority_inference','relative_locator_withheld']
      :['inventory_only_no_auto_extraction','relative_locator_withheld']
  };
}
function run(argv){
  const args=strictArgs(argv);
  if(args.help)return {help:'Experimental M3 inventory only: --source <absolute-synthetic-file-or-directory> --target-contract first-report-pack --format json; no write, no network, no mapping'};
  if(process.env.ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY!=='1'){
    reject('EXPLICIT_SYNTHETIC_MODE_REQUIRED');
  }
  const root=process.env.ARCH_V02X_M3_INVENTORY_FIXTURE_ROOT;
  if(!root||!path.isAbsolute(root))reject('EXPLICIT_ABSOLUTE_FIXTURE_ROOT_REQUIRED');
  mustBePlainDir(root);
  const canonicalRoot=fs.realpathSync(root);
  const marker=path.join(canonicalRoot,MARKER);
  const markStat=fs.lstatSync(marker);
  if(!markStat.isFile()||markStat.isSymbolicLink()||
     fs.readFileSync(marker,'utf8')!==MARKER_BYTES){
    reject('OWNED_SYNTHETIC_FIXTURE_MARKER_REQUIRED');
  }
  const selected=path.resolve(args.source);
  if(!safeInside(canonicalRoot,selected))reject('SOURCE_OUTSIDE_SYNTHETIC_FIXTURE_ROOT');
  const relative=path.relative(canonicalRoot,selected);
  for(const component of relative.split(path.sep)){
    if(forbiddenName(component))reject('EXCLUDED_OR_SECRET_EXPLICIT_SOURCE');
  }
  // Explicit paths may not pass through a symlink/junction/reparse; don't trust
  // realpath equality alone for the entire path's intermediate components.
  let step=canonicalRoot;
  for(const component of relative.split(path.sep)){
    step=path.join(step,component);
    const st=fs.lstatSync(step);
    if(st.isSymbolicLink())reject('SOURCE_SYMLINK_OR_REPARSE_REFUSED');
  }
  const selectedStat=fs.lstatSync(selected);
  if(selectedStat.isSymbolicLink())reject('SOURCE_SYMLINK_OR_REPARSE_REFUSED');
  const canonicalSelected=fs.realpathSync(selected);
  if(!safeInside(canonicalRoot,canonicalSelected))reject('SOURCE_ROOT_ESCAPE_REFUSED');
  const candidates=[];
  let excluded=0,skippedDirs=0;
  if(selectedStat.isFile()){
    if(forbiddenName(path.basename(selected)))reject('EXCLUDED_OR_SECRET_EXPLICIT_SOURCE');
    candidates.push(selected);
  }else if(selectedStat.isDirectory()){
    const entries=fs.readdirSync(selected,{withFileTypes:true}).sort(compareName);
    if(entries.length>MAX_FILES)reject('EXPERIMENTAL_FILE_COUNT_LIMIT_EXCEEDED');
    for(const ent of entries){
      if(forbiddenName(ent.name)){excluded++;continue;}
      if(ent.isSymbolicLink())reject('SYMLINK_OR_REPARSE_ENTRY_REFUSED');
      if(ent.isDirectory()){skippedDirs++;continue;}
      if(!ent.isFile())reject('NONREGULAR_SOURCE_ENTRY_REFUSED');
      candidates.push(path.join(selected,ent.name));
    }
  }else reject('UNSUPPORTED_SELECTED_ENTRY_TYPE');
  if(candidates.length===0)reject('SUPPORTED_OR_INVENTORY_ONLY_INPUT_REQUIRED');
  if(candidates.length>MAX_FILES)reject('EXPERIMENTAL_FILE_COUNT_LIMIT_EXCEEDED');
  const stamp=new Date().toISOString();
  const sources=[];
  let total=0;
  for(const file of candidates){
    const item=metadataFromFile(file,canonicalSelected,sources.length,stamp);
    total+=item.byte_length;
    if(total>MAX_TOTAL_BYTES)reject('EXPERIMENTAL_TOTAL_BYTES_EXCEEDED');
    sources.push(item);
  }
  if(!sources.some(x=>x.inventory_status==='included')){
    reject('UNSUPPORTED_ONLY_INPUT_NO_AUTOMAPPING');
  }
  return {
    kind:'mindforge_source_inventory',
    version:'0.1',
    inventory_id:'srcinv_'+crypto.randomUUID().replace(/-/g,''),
    created_at:stamp,
    scope:{selection_mode:'explicit_paths',recursive:false,network_access:false,
      target_contract:'first-report-pack'},
    sources,
    summary:{included_count:sources.filter(x=>x.inventory_status==='included').length,
      inventory_only_count:sources.filter(x=>x.inventory_status==='inventory_only').length,
      excluded_count:excluded,skipped_nested_directories:skippedDirs,
      total_bytes_read:total},
    known_limits:[
      'synthetic_fixture_only','not_a_public_guard_command','no_semantic_mapping',
      'no_human_authority_confirmation','no_secret_scanner_guarantee',
      'no_private_source_locator_export','no_canonical_evidence_pack',
      'hash_does_not_prove_authenticity','fixed_experimental_size_limits',
      'not_an_independent_assurance_conclusion'
    ],
    lifecycle:'SELECT_AND_INVENTORY_ONLY',
    authority:'NO_APPROVAL_NO_EXECUTION_PERMISSION',
    source_copy_written:false
  };
}
try{
  const result=run(process.argv.slice(2));
  process.stdout.write(JSON.stringify(result,null,2)+'\n');
}catch(e){
  const reason=e instanceof InventoryRefusal?e.message:'SOURCE_IO_OR_RUNTIME_ERROR';
  process.stdout.write(JSON.stringify({
    kind:'ARCH_V02X_M3_INVENTORY_EXPERIMENT',
    status:'BLOCKED',
    reason,
    source_copy_written:false,
    no_authority_expansion:true
  })+'\n');
  process.exitCode=24;
}
