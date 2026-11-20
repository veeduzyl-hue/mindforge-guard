// Architecture v0.2.x P0 source-capture ADMISSION CANDIDATE, default-off.
// Executes ONLY on separately marked disposable synthetic HR fixture sources.
// Existing Pack Parser, hashes, Guard CLI, schema and I-1 Writer are unchanged.
// Passing this check does not grant production ingestion or execution authority.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

const MARK='.ARCH_V02X_P0_SYNTHETIC_SOURCE_ONLY';
const MARK_VALUE='ARCH_V02X_P0_SOURCE_ADMISSION_FIXED_SYNTHETIC_ONLY\n';
const ALLOW_ROOT=new Set([
  'README.md','manifest.json','agent-profile.json','task-scope.md',
  'action-boundary.yaml','data-sources.yaml','tools.yaml',
  'review-standards.md','snapshot.json','evidence'
]);
const ALLOW_EVIDENCE=new Set(['sample-output.json','run-record.json']);
const REQUIRED=new Set([
  'manifest.json','agent-profile.json','task-scope.md','action-boundary.yaml',
  'data-sources.yaml','tools.yaml','evidence/sample-output.json'
]);
const MAX_FILE=4*1024*1024,MAX_TOTAL=16*1024*1024,MAX_FILES=32;
class Refusal extends Error { constructor(reason){super(reason);this.name='Refusal';} }
const block=reason=>{throw new Refusal(reason)};
const hex=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function isInside(parent,child){
 const x=path.relative(parent,child);
 return x.length>0&&x!=='..'&&!x.startsWith('..'+path.sep)&&!path.isAbsolute(x);
}
function args(argv){
 if(argv.length===1&&['--help','-h'].includes(argv[0]))return{help:true};
 const a={pack:null,fixtureRoot:null,format:null};
 for(let i=0;i<argv.length;i++){
  const k=argv[i], dest=({'--pack':'pack','--fixture-root':'fixtureRoot','--format':'format'})[k];
  if(!dest)block('UNSUPPORTED_MODE_OR_OPTION');
  if(a[dest]!==null)block('DUPLICATE_OPTION');
  const v=argv[++i];
  if(!v||v.startsWith('--'))block('MISSING_OPTION_VALUE');
  a[dest]=v;
 }
 if(!a.pack||!a.fixtureRoot||a.format!=='json')
  block('EXPLICIT_PACK_FIXTURE_ROOT_JSON_REQUIRED');
 if(!path.isAbsolute(a.pack)||!path.isAbsolute(a.fixtureRoot))
  block('ABSOLUTE_PATH_REQUIRED');
 return a;
}
function safeDir(p){
 const st=fs.lstatSync(p);
 if(!st.isDirectory()||st.isSymbolicLink())block('SOURCE_DIRECTORY_REPARSE_OR_SPECIAL');
 return st;
}
function ancestorCheck(root,p){
 const canonical=fs.realpathSync(root),rel=path.relative(canonical,p);
 if(!isInside(canonical,p))block('SOURCE_OUTSIDE_MARKED_ROOT');
 let now=canonical;
 for(const part of rel.split(path.sep)){
  if(part==='..'||part===''||part==='.')block('UNSAFE_SOURCE_COMPONENT');
  now=path.join(now,part);
  const st=fs.lstatSync(now);
  if(st.isSymbolicLink())block('SOURCE_SYMLINK_OR_REPARSE_DENY');
  const actual=fs.realpathSync(now);
  const expected=fs.realpathSync(path.dirname(now));
  const expectedPath=path.join(expected,path.basename(now));
  const equals=process.platform==='win32'?
   actual.toLowerCase()===expectedPath.toLowerCase():actual===expectedPath;
  if(!equals)block('SOURCE_REPARSE_OR_PATH_IDENTITY_DENY');
 }
 return canonical;
}
function readPinned(file){
 const a=fs.lstatSync(file,{bigint:true});
 if(!a.isFile()||a.isSymbolicLink()||a.nlink>1n)
  block('SOURCE_NOT_UNIQUE_REGULAR_FILE');
 if(a.size>BigInt(MAX_FILE))block('SOURCE_FILE_LIMIT');
 const flags=fs.constants.O_RDONLY|(fs.constants.O_NOFOLLOW||0);
 const fd=fs.openSync(file,flags);
 let buf;
 try{
  const b=fs.fstatSync(fd,{bigint:true});
  if(!b.isFile()||a.dev!==b.dev||a.ino!==b.ino||a.size!==b.size||
     a.mtimeNs!==b.mtimeNs||a.ctimeNs!==b.ctimeNs)
   block('SOURCE_CHANGED_BEFORE_CAPTURE');
  buf=fs.readFileSync(fd);
  const c=fs.fstatSync(fd,{bigint:true});
  if(c.dev!==b.dev||c.ino!==b.ino||c.size!==b.size||
     c.mtimeNs!==b.mtimeNs||c.ctimeNs!==b.ctimeNs||BigInt(buf.length)!==b.size)
   block('SOURCE_CHANGED_DURING_CAPTURE');
 }finally{fs.closeSync(fd);}
 const d=fs.lstatSync(file,{bigint:true});
 if(d.dev!==a.dev||d.ino!==a.ino||d.size!==a.size||
    d.mtimeNs!==a.mtimeNs||d.ctimeNs!==a.ctimeNs)
  block('SOURCE_CHANGED_AFTER_CAPTURE');
 return buf;
}
function run(argv){
 const a=args(argv);
 if(a.help)return{help:'P0 synthetic-only source-admission gate; explicit --pack --fixture-root --format json; no production acceptance'};
 if(process.env.ARCH_V02X_P0_SOURCE_ADMISSION_SYNTHETIC_ONLY!=='1')
  block('EXPLICIT_SYNTHETIC_ONLY_GATE_REQUIRED');
 const canonicalTemp=fs.realpathSync(os.tmpdir());
 const root=path.resolve(a.fixtureRoot);
 // Restrict all input to a newly marked direct child of SYSTEM TEMP.
 if(path.dirname(root)!==canonicalTemp||
    !/^arch-v02x-p0-owned-[a-f0-9]{32}$/.test(path.basename(root)))
  block('UNTRUSTED_FIXTURE_ROOT');
 safeDir(root);
 if(fs.realpathSync(root)!==root)block('FIXTURE_ROOT_REPARSE');
 const mark=path.join(root,MARK);
 if(!readPinned(mark).equals(Buffer.from(MARK_VALUE)))
  block('MARKED_SYNTHETIC_FIXTURE_REQUIRED');
 const pack=path.resolve(a.pack);
 ancestorCheck(root,pack);
 safeDir(pack);
 const scanned=[],files=[];
 let total=0;
 function visit(dir,scope){
  const entries=fs.readdirSync(dir,{withFileTypes:true});
  if(entries.length>MAX_FILES)block('SOURCE_ENTRY_COUNT_LIMIT');
  for(const e of entries.sort((x,y)=>x.name<y.name?-1:x.name>y.name?1:0)){
   const allowed=scope==='root'?ALLOW_ROOT:ALLOW_EVIDENCE;
   if(!allowed.has(e.name))block('SOURCE_EXTRA_HIDDEN_BINARY_OR_UNRELATED_ENTRY');
   const p=path.join(dir,e.name);
   ancestorCheck(root,p);
   if(e.isSymbolicLink())block('SOURCE_SYMLINK_OR_REPARSE_DENY');
   if(e.isDirectory()){
    if(scope!=='root'||e.name!=='evidence')block('SOURCE_NESTED_DIRECTORY_UNEXPECTED');
    safeDir(p);visit(p,'evidence');continue;
   }
   if(!e.isFile())block('SOURCE_NONREGULAR_ENTRY');
   const bytes=readPinned(p);
   total+=bytes.length;
   if(total>MAX_TOTAL)block('SOURCE_TOTAL_BYTES_LIMIT');
   const rel=scope==='root'?e.name:'evidence/'+e.name;
   scanned.push(rel);files.push([rel,bytes]);
   if(files.length>MAX_FILES)block('SOURCE_FILE_COUNT_LIMIT');
  }
 }
 visit(pack,'root');
 for(const req of REQUIRED)if(!scanned.includes(req))block('REQUIRED_CANONICAL_SOURCE_MISSING');
 const digest=crypto.createHash('sha256');
 for(const [rel,bytes] of files){
  digest.update(rel);digest.update('\n');digest.update(bytes);digest.update('\n');
 }
 return{
  kind:'ARCH_V02X_P0_SYNTHETIC_SOURCE_ADMISSION',
  source_class:'FIXED_SYNTHETIC_ONLY',
  status:'BOUNDARY_OBSERVED_FOR_SYNTHETIC_FIXTURE',
  file_count:files.length,
  total_bytes:total,
  admitted_relative_source_file_count:files.length,
  source_content_set_sha256:'sha256:'+digest.digest('hex'),
  no_raw_content_exported:true,no_host_paths_exported:true,
  source_files_copied:false,network_effects:false,
  original_legacy_pack_parser:'UNCHANGED',
  general_real_source_admission:'NOT_AUTHORIZED',
  persistent_transaction_or_adversarial_race_assurance:'NOT_ESTABLISHED',
  production_secure_i1_native_bundle:'NOT_TESTED',
  original_m4_62:'NOT_RUN',
  m5_independent_first_user:'NOT_TESTED'
 };
}
try{process.stdout.write(JSON.stringify(run(process.argv.slice(2)))+'\n')}
catch(e){
 const reason=e instanceof Refusal?e.message:'SOURCE_IO_OR_RUNTIME_ERROR';
 process.stdout.write(JSON.stringify({
  kind:'ARCH_V02X_P0_SYNTHETIC_SOURCE_ADMISSION',
  status:'BLOCKED',reason,
  no_raw_content_exported:true,
  no_source_copy_written:true,
  no_authority_expansion:true
 })+'\n');
 process.exitCode=24;
}
