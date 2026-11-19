// ARCH v0.2.x M3 Track A: DISCOVER -> DRAFT only, synthetic-only.
// It delegates SELECT/INVENTORY to the fixed PR #374 CLI and rechecks exact
// on-disk bytes against inventory SHA before structural discovery.
// No raw value, file name, absolute path, authorization or canonical Pack output.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const SCRIPT_DIR=path.dirname(fileURLToPath(import.meta.url));
const INVENTORY_CLI=path.join(SCRIPT_DIR,'arch_v02x_m3_source_inventory_synthetic.mjs');
const MAX_LINES=1024;
const MAX_EVENTS=64;
const MAX_OBSERVATIONS=128;
const MAX_MAPPING_ITEMS=32;
const MAX_BYTES=4*1024*1024;
const VALID_KIND=new Set(['json','jsonl','yaml_text','markdown','text','binary','unknown']);
const SAFE_NAMES=new Set(['manifest.json','agent-profile.json','tools.yaml']);
const SECRET_MARKER=/^(\.env|id_rsa|id_ed25519)/i;
const ALLOWED_KEYS=new Set([
  'pack_id','pack_version','report_target','agent_id','agent_name','agent_type',
  'tool_name','tool_id','tool_type','tools','allowed_actions','prohibited_actions',
  'requires_human_approval','human_review_required','event_type','tool','action',
  'timestamp','events'
]);
const JSON_TARGETS=new Map([
 ['pack_id','manifest.json#/pack_id'],
 ['pack_version','manifest.json#/pack_version'],
 ['report_target','manifest.json#/report_target'],
 ['agent_id','agent-profile.json#/agent_id'],
 ['agent_name','agent-profile.json#/agent_name'],
 ['agent_type','agent-profile.json#/agent_type']
]);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
class BoundedRefusal extends Error {constructor(reason){super(reason);this.name='BoundedRefusal';}}
const stop=code=>{throw new BoundedRefusal(code);};
function parseArgs(argv){
 if(argv.length===1&&['--help','-h'].includes(argv[0]))return {help:true};
 const args={source:null,target:null,format:null};
 for(let i=0;i<argv.length;i++){
  const key=argv[i];
  if(!['--source','--target-contract','--format'].includes(key))stop('UNSUPPORTED_OPTION');
  if(i+1>=argv.length||argv[i+1].startsWith('--'))stop('MISSING_OPTION_VALUE');
  const field=key==='--target-contract'?'target':key.slice(2);
  if(args[field]!==null)stop('DUPLICATE_OPTION');
  args[field]=argv[++i];
 }
 if(!args.source||!args.target||!args.format)stop('EXPLICIT_SOURCE_TARGET_FORMAT_REQUIRED');
 if(!path.isAbsolute(args.source))stop('ABSOLUTE_SOURCE_PATH_REQUIRED');
 if(args.target!=='first-report-pack'||args.format!=='json')stop('UNSUPPORTED_CONTRACT_OR_FORMAT');
 return args;
}
function rootSafe(root,selected){
 const rel=path.relative(root,selected);
 return rel.length>0&&rel!=='..'&&!rel.startsWith('..'+path.sep)&&!path.isAbsolute(rel);
}
function readBoundedExact(p, expected){
 const before=fs.lstatSync(p,{bigint:true});
 if(!before.isFile()||before.isSymbolicLink())stop('SOURCE_FILE_OR_REPARSE_UNTRUSTED');
 if(before.size>BigInt(MAX_BYTES))stop('SOURCE_BYTE_LIMIT');
 const real=fs.realpathSync(p);
 const fd=fs.openSync(p,fs.constants.O_RDONLY|(fs.constants.O_NOFOLLOW||0));
 let bytes;
 try{
  const opened=fs.fstatSync(fd,{bigint:true});
  if(!opened.isFile()||opened.dev!==before.dev||opened.ino!==before.ino||
     opened.size!==before.size||opened.mtimeNs!==before.mtimeNs)stop('SOURCE_CHANGED_BEFORE_DISCOVERY');
  bytes=fs.readFileSync(fd);
  const after=fs.fstatSync(fd,{bigint:true});
  if(after.dev!==opened.dev||after.ino!==opened.ino||
     after.size!==opened.size||after.mtimeNs!==opened.mtimeNs||
     after.ctimeNs!==opened.ctimeNs||BigInt(bytes.length)!==opened.size){
    stop('SOURCE_CHANGED_DURING_DISCOVERY');
  }
 }finally{fs.closeSync(fd);}
 const end=fs.lstatSync(p,{bigint:true});
 if(end.dev!==before.dev||end.ino!==before.ino||end.size!==before.size||
    end.mtimeNs!==before.mtimeNs||fs.realpathSync(p)!==real){
   stop('SOURCE_CHANGED_AFTER_DISCOVERY');
 }
 if(expected.byte_length!==bytes.length||expected.source_sha256!=='sha256:'+sha(bytes)){
   stop('SOURCE_CHANGED_SINCE_INVENTORY');
 }
 return bytes;
}
function sortedFiles(selected, selectedIsFile){
 if(selectedIsFile)return [selected];
 const names=fs.readdirSync(selected,{withFileTypes:true}).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0);
 if(names.length>32)stop('SOURCE_COUNT_CHANGED_SINCE_INVENTORY');
 const excluded=(name)=>{
  const l=name.toLowerCase();
  return l.startsWith('.')||SECRET_MARKER.test(l)||
   ['node_modules','dist','build','coverage','out','target','__pycache__'].includes(l)||
   ['.pem','.key','.pfx','.p12','.jks','.keystore'].includes(path.extname(l));
 };
 const files=[];
 for(const ent of names){
  if(excluded(ent.name))continue;
  if(ent.isSymbolicLink())stop('SOURCE_SYMLINK_OR_REPARSE_REFUSED');
  if(ent.isDirectory())continue;
  if(!ent.isFile())stop('SOURCE_NONREGULAR_ENTRY');
  files.push(path.join(selected,ent.name));
 }
 return files;
}
function validText(b){
 // Decode UTF-8 losslessly; binary or invalid Unicode remains inventory-only.
 const decoder=new TextDecoder('utf-8',{fatal:true});
 try{return decoder.decode(b);}catch{stop('STRUCTURAL_SOURCE_INVALID_UTF8');}
}
function jsonPointer(key){return '/'+key.replace(/~/g,'~0').replace(/\//g,'~1');}
function inspect(argv){
 const args=parseArgs(argv);
 if(args.help)return {help:'Experimental M3 DISCOVER/DRAFT only, synthetic fixture --source <absolute> --target-contract first-report-pack --format json. No raw values or confirmed mappings.'};
 if(process.env.ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY!=='1'||
    process.env.ARCH_V02X_M3_INVENTORY_FIXTURE_ROOT===undefined){
   stop('INVENTORY_EXPLICIT_SYNTHETIC_OPT_IN_REQUIRED');
 }
 if(process.env.ARCH_V02X_M3_DISCOVER_SYNTHETIC_ONLY!=='1'){
   stop('DISCOVER_EXPLICIT_SYNTHETIC_OPT_IN_REQUIRED');
 }
 const run=spawnSync(process.execPath,[INVENTORY_CLI,...argv],{
   cwd:path.dirname(INVENTORY_CLI),
   env:process.env,encoding:'utf8',timeout:20000,maxBuffer:4*1024*1024
 });
 if(run.error||run.status!==0)stop('INVENTORY_PREFLIGHT_REFUSED');
 let inv;
 try{inv=JSON.parse(run.stdout);}catch{stop('INVENTORY_OUTPUT_NOT_VALID_JSON');}
 if(inv.kind!=='mindforge_source_inventory'||inv.version!=='0.1'||
    inv.scope?.target_contract!=='first-report-pack'||inv.scope?.recursive!==false||
    inv.scope?.network_access!==false||!Array.isArray(inv.sources)||
    inv.sources.length<1||inv.sources.length>32)stop('INVENTORY_CONTRACT_INVALID');
 const root=process.env.ARCH_V02X_M3_INVENTORY_FIXTURE_ROOT;
 if(!root||!path.isAbsolute(root))stop('INVALID_EXPLICIT_FIXTURE_ROOT');
 const canonicalRoot=fs.realpathSync(root);
 const selected=path.resolve(args.source);
 if(!rootSafe(canonicalRoot,selected))stop('DISCOVERY_OUTSIDE_SYNTHETIC_SCOPE');
 const selectedStat=fs.lstatSync(selected);
 if(!selectedStat.isDirectory()&&!selectedStat.isFile())stop('UNSUPPORTED_SELECTED_SOURCE');
 const selectedCanonical=fs.realpathSync(selected);
 if(!rootSafe(canonicalRoot,selectedCanonical))stop('DISCOVERY_SOURCE_ESCAPE');
 const files=sortedFiles(selected,selectedStat.isFile());
 if(files.length!==inv.sources.length)stop('INVENTORY_SOURCE_SET_CHANGED');
 let total=0;
 const observations=[];
 const mappings=[];
 const discoveredAt=new Date().toISOString();
 function addObservation(source,kind,loc,key,semantics='unknown'){
   if(observations.length>=MAX_OBSERVATIONS)stop('DISCOVERY_OBSERVATION_LIMIT');
   const item={
     observation_id:'obs_'+String(observations.length+1).padStart(3,'0'),
     source_id:source.source_id,source_sha256:source.source_sha256,
     source_kind:kind,source_locator:loc,field_key:key,
     field_state:'present',semantic_class:semantics,
     value_exported:false,authenticity:'not_established',
     known_limits:['structural_presence_only','no_source_value_export']
   };
   observations.push(item);
   return item;
 }
 function addDraft(source,observation,targetLocator){
   if(mappings.length>=MAX_MAPPING_ITEMS)stop('MAPPING_DRAFT_LIMIT');
   mappings.push({
      mapping_item_id:'mapitem_'+String(mappings.length+1).padStart(3,'0'),
      source_id:source.source_id,
      source_sha256:source.source_sha256,
      source_locator:observation.source_locator,
      target_locator:targetLocator,
      semantic_class:'declared',field_state:'present',mapping_status:'suggested',
      transformation_id:'structural_key_presence_v0_1',
      loss_notes:['value_not_exported','source_semantics_unverified','human_review_required'],
      requires_human_confirmation:true,
      value_exported:false
   });
 }
 for(let i=0;i<files.length;i++){
   const item=inv.sources[i],file=files[i],name=path.basename(file);
   if(!item||item.source_id!=='source_'+String(i+1).padStart(3,'0')||
      !VALID_KIND.has(item.source_kind))stop('INVENTORY_SOURCE_IDENTITY_MISMATCH');
   const b=readBoundedExact(file,item);
   total+=b.length;
   if(total>16*1024*1024)stop('DISCOVERY_TOTAL_SOURCE_BYTES_LIMIT');
   const extension=path.extname(name).toLowerCase();
   const actualKind=new Map([
     ['.json','json'],['.jsonl','jsonl'],['.yaml','yaml_text'],
     ['.yml','yaml_text'],['.md','markdown'],['.txt','text']
   ]).get(extension)||(['.pdf','.png','.jpg','.jpeg','.webp','.gif','.zip',
     '.bin','.docx','.xlsx','.pptx'].includes(extension)?'binary':'unknown');
   if(actualKind!==item.source_kind)stop('SOURCE_FORMAT_CHANGED_SINCE_INVENTORY');
   if(item.inventory_status==='inventory_only')continue;
   if(item.inventory_status!=='included')stop('UNSUPPORTED_INVENTORY_SOURCE_STATUS');
   if(item.source_kind==='json'){
     let parsed;
     try{parsed=JSON.parse(validText(b));}catch{stop('JSON_STRUCTURAL_PARSE_FAILED');}
     if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))stop('JSON_TOP_LEVEL_OBJECT_REQUIRED');
     for(const key of Object.keys(parsed)){
       if(!ALLOWED_KEYS.has(key))continue;
       const observation=addObservation(item,'json',{json_pointer:jsonPointer(key),line_start:null,line_end:null},
         key,'declared');
       const target=JSON_TARGETS.get(key);
       if(target&&SAFE_NAMES.has(name))addDraft(item,observation,target);
     }
   }else if(item.source_kind==='jsonl'){
     const rows=validText(b).split(/\r?\n/);
     if(rows.length>MAX_LINES)stop('JSONL_LINE_LIMIT');
     let events=0;
     for(let row=0;row<rows.length;row++){
       if(!rows[row].trim())continue;
       if(++events>MAX_EVENTS)stop('JSONL_EVENT_COUNT_LIMIT');
       let parsed;
       try{parsed=JSON.parse(rows[row]);}catch{stop('JSONL_LINE_PARSE_FAILED');}
       if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))stop('JSONL_OBJECT_PER_LINE_REQUIRED');
       for(const key of Object.keys(parsed)){
         if(!['event_type','tool','action','timestamp'].includes(key))continue;
         addObservation(item,'jsonl',{json_pointer:jsonPointer(key),
           line_start:row+1,line_end:row+1},key,'observed');
       }
     }
   }else if(item.source_kind==='yaml_text'){
     const lines=validText(b).split(/\r?\n/);
     if(lines.length>MAX_LINES)stop('YAML_LINE_LIMIT');
     let toolIndex=0;
     for(let idx=0;idx<lines.length;idx++){
       const line=lines[idx];
       // Only structural indentation/key detection, NOT YAML semantic parsing.
       if(line.includes('\t'))continue;
       const match=line.match(/^ {0,6}(?:-\s+)?([A-Za-z_][A-Za-z0-9_]{0,40}):(?=\s|$)/);
       if(!match||!ALLOWED_KEYS.has(match[1]))continue;
       const key=match[1];
       const ob=addObservation(item,'yaml_text',{json_pointer:null,line_start:idx+1,
         line_end:idx+1},key,'declared');
       if(key==='tool_name'&&name==='tools.yaml'){
         if(toolIndex>=8)stop('TOOL_MAPPING_SUGGESTION_LIMIT');
         addDraft(item,ob,'tools.yaml#/tools/'+toolIndex+'/tool_name');
         toolIndex++;
       }
     }
   }else if(item.source_kind==='markdown'||item.source_kind==='text'){
     const lines=validText(b).split(/\r?\n/);
     if(lines.length>MAX_LINES)stop('TEXT_LINE_LIMIT');
     for(let idx=0;idx<lines.length;idx++){
       // Never export heading text; a heading is not evidence of authority.
       if(/^#{1,4}\s+\S/.test(lines[idx])||
          /^(intended task|in-scope behavior|out-of-scope behavior|success criteria|known limitations):\s*$/i.test(lines[idx])){
         addObservation(item,item.source_kind,{json_pointer:null,line_start:idx+1,
           line_end:idx+1},'section_heading','unknown');
       }
     }
   }
 }
 if(total!==inv.summary?.total_bytes_read)stop('SOURCE_TOTAL_BYTES_CHANGED_SINCE_INVENTORY');
 // All conflicting candidates remain ambiguous; do not prefer first source.
 const uses=new Map();
 for(const x of mappings)uses.set(x.target_locator,(uses.get(x.target_locator)||0)+1);
 for(const x of mappings){
   if(uses.get(x.target_locator)>1){
     x.mapping_status='ambiguous';
     x.loss_notes.push('multiple_candidates_for_target');
   }
 }
 const inventoryDigest=sha(Buffer.from(inv.sources.map(x=>x.source_id+':'+x.source_sha256).join('|'),'utf8'));
 return {
   kind:'mindforge_mapping_draft',version:'0.1',
   mapping_id:'map_'+crypto.randomUUID().replace(/-/g,''),
   created_at:discoveredAt,
   source_inventory_ref:{kind:inv.kind,version:inv.version,
     inventory_id:inv.inventory_id,source_digest_set_sha256:'sha256:'+inventoryDigest},
   target_contract:{id:'first-report-pack',version:'single_agent_governance_pack_preview_v1'},
   lifecycle:'DISCOVER_AND_DRAFT_ONLY',status:'DRAFT_UNCONFIRMED',
   observations,mappings,
   counts:{sources_inventory:inv.sources.length,observations:observations.length,
     suggested:mappings.filter(x=>x.mapping_status==='suggested').length,
     ambiguous:mappings.filter(x=>x.mapping_status==='ambiguous').length,
     confirmed:0},
   hard_confirmation_required:[
     'task_intent','success_criteria','allowed_actions','prohibited_actions',
     'policy','authorization','business_owner','review_owner',
     'data_sensitivity','control_objectives'
   ],
   confirmation_record:'NOT_CREATED',
   identity_assurance:'not_verified',
   organizational_authority:'not_established',
   no_raw_values_exported:true,no_source_copy_written:true,
   no_canonical_pack_generated:true,no_review_bundle_generated:true,
   no_tool_execution:true,no_network_access:true,
   known_limits:['synthetic_only','inventory_digests_rechecked',
     'structural_keys_not_semantic_validation','yaml_is_line_level_not_full_parse',
     'markdown_headings_only_not_source_text','observed_tool_not_authorized',
     'mapping_suggestions_require_human_confirmation',
     'no_public_cli_or_authoritative_evidence_contract',
     'no_secret_scanner_guarantee','no_independent_assurance',
     'not_real_world_race_or_junction_proof']
 };
}
try{
 process.stdout.write(JSON.stringify(inspect(process.argv.slice(2)),null,2)+'\n');
}catch(error){
 const reason=error instanceof BoundedRefusal?error.message:'DISCOVERY_IO_OR_RUNTIME_ERROR';
 process.stdout.write(JSON.stringify({kind:'ARCH_V02X_M3_DISCOVER_DRAFT_EXPERIMENT',
  status:'BLOCKED',reason,no_source_copy_written:true,
  no_authority_expansion:true,no_partial_mapping_export:true})+'\n');
 process.exitCode=24;
}
