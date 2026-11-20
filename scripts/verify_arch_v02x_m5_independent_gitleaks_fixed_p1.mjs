// M5 independent tool SECOND-OPINION: Gitleaks v8.30.1 on fixed P1 Git ancestry
// and separate current tree. Outputs CATEGORY COUNTS ONLY.
// Does not disclose any raw finding, path, line, source metadata or secret.
// CI-only synthetic/public repository. No customer data or production admission.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const P1='2a5365ea422b6dfb7f3d7bba81138e1e53862be1';
const PARENT='f43862f93741a0e377358e820f2f45f8d92f8424';
const TOOL_SHA='551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb';
const MAX_REPORT=16*1024*1024;
function refuse(code){throw Object.assign(new Error(code),{code});}
function run(bin,args,cwd,quiet=false){
 const r=spawnSync(bin,args,{
  cwd,encoding:'utf8',windowsHide:true,timeout:160000,
  maxBuffer:2*1024*1024,
  stdio:quiet?['ignore','ignore','ignore']:['ignore','pipe','pipe'],
  env:{...process.env,GIT_TERMINAL_PROMPT:'0'}
 });
 if(r.error)refuse('INDEPENDENT_TOOL_OR_GIT_IO_ERROR');
 if(r.signal)refuse('INDEPENDENT_TOOL_TIMEOUT_OR_SIGNAL');
 return r;
}
function rootGuard(root,child){
 const a=path.resolve(root),b=path.resolve(child);
 if(!b.startsWith(a+path.sep))refuse('INDEPENDENT_SCAN_PATH_OUTSIDE_CI_TEMP');
}
function readReport(file,code){
 if(!fs.existsSync(file)){
  if(code!==0)refuse('GITLEAKS_NONZERO_WITHOUT_JSON_REPORT');
  return [];
 }
 const stat=fs.lstatSync(file);
 if(!stat.isFile()||stat.isSymbolicLink()||stat.size>MAX_REPORT)
  refuse('GITLEAKS_REPORT_SIZE_OR_TYPE_INVALID');
 let data;
 try {data=JSON.parse(fs.readFileSync(file,'utf8'))}
 catch{refuse('GITLEAKS_JSON_PARSE_FAILED')}
 if(data===null)return[];
 if(!Array.isArray(data)||data.length>25000)refuse('GITLEAKS_UNEXPECTED_REPORT_FORMAT');
 for(const row of data){
  if(!row||typeof row.RuleID!=='string'||row.RuleID.length>100)
   refuse('GITLEAKS_REPORT_RULE_ID_MISSING');
 }
 return data;
}
function group(report){
 const counts={};
 for(const row of report){
  // Gitleaks RuleID is a known rule identifier (not an arbitrary file path).
  // Reduce to alphanumeric/dash/underscore to prevent leaking unknown strings.
  const id=row.RuleID;
  const safe=/^[A-Za-z0-9_-]{1,100}$/.test(id)?id:'OTHER_RULE_CATEGORY';
  counts[safe]=(counts[safe]||0)+1;
 }
 return Object.fromEntries(Object.entries(counts).sort((a,b)=>a[0].localeCompare(b[0])));
}
// Private bounded structural triage. No report path, fragment, byte, author,
// line number or key is exported. A parse error does NOT mean "secret-free".
function triagePrivateKeyPatterns(rows,root,repoRoot){
 const base=fs.realpathSync(root);
 const unique=new Set(),stats={
  gitleaks_private_key_findings:0,
  distinct_reported_paths_resolved:0,
  source_object_identity_verified:0,
  unresolved_or_untrusted_path_count:0,
  files_with_paired_private_key_delimiters:0,
  files_with_cryptographically_parseable_private_key:0,
  files_with_no_paired_delimiters:0
 };
 for(const row of rows){
  if(row.RuleID!=='private-key')continue;
  stats.gitleaks_private_key_findings++;
  if(typeof row.File!=='string'||row.File.length>4096){
   stats.unresolved_or_untrusted_path_count++;continue;
  }
  // The Gitleaks dir scanner may use absolute or root-relative file paths.
  // Never follow the report to a file outside the pinned extracted P1 root.
  const candidate=path.resolve(base,row.File);
  if(unique.has(candidate))continue;
  unique.add(candidate);
  const rel=path.relative(base,candidate);
  if(!rel||rel==='..'||rel.startsWith('..'+path.sep)||path.isAbsolute(rel)){
   stats.unresolved_or_untrusted_path_count++;continue;
  }
  try{
   const st=fs.lstatSync(candidate);
   if(!st.isFile()||st.isSymbolicLink()||st.size>16*1024*1024){
    stats.unresolved_or_untrusted_path_count++;continue;
   }
   const canonical=fs.realpathSync(candidate);
   const realRel=path.relative(base,canonical);
   if(realRel!==rel){
    stats.unresolved_or_untrusted_path_count++;continue;
   }
   stats.distinct_reported_paths_resolved++;
   const expected=run('git',['rev-parse',P1+':'+rel.split(path.sep).join('/')],repoRoot);
   const actual=run('git',['hash-object',candidate],repoRoot);
   if(expected.status!==0||actual.status!==0||expected.stdout.trim()!==actual.stdout.trim()){
    stats.unresolved_or_untrusted_path_count++;continue;
   }
   stats.source_object_identity_verified++;
   const content=fs.readFileSync(candidate).toString('utf8');
   const regex=/-----BEGIN ((?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY)-----([\s\S]{0,24000}?)-----END \1-----/g;
   let foundPair=false,parsed=false,match;
   while((match=regex.exec(content))!==null){
    foundPair=true;
    try{
      const key=crypto.createPrivateKey({key:match[0],format:'pem'});
      if(key?.type==='private')parsed=true;
    }catch{}
   }
   if(foundPair)stats.files_with_paired_private_key_delimiters++;
   else stats.files_with_no_paired_delimiters++;
   if(parsed)stats.files_with_cryptographically_parseable_private_key++;
  }catch{
   stats.unresolved_or_untrusted_path_count++;
  }
 }
 return {
  scope:'PRIVATE_IN_MEMORY_STRUCTURAL_TRIAGE_ONLY',
  counts:stats,
  syntactic_delimiter_absence_does_not_prove_secret_free:true,
  encrypted_or_unrecognized_private_key_formats_not_ruled_out:true,
  actual_credential_validity_or_ownership:'NOT_ESTABLISHED',
  independent_human_classification:'NOT_PERFORMED'
 };
}
// Pure synthetic malformed marker checks; no key generation or sensitive logs.
{
 const test='-----BEGIN PRIVATE KEY-----\nSYNTHETIC_NOT_A_PRIVATE_KEY\n-----END PRIVATE KEY-----';
 let parserRejected=false;
 try{crypto.createPrivateKey({key:test,format:'pem'})}
 catch{parserRejected=true}
 assert(parserRejected);
 assert(!/-----BEGIN ((?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY)-----/.test('-----BEGIN PUBLIC KEY-----'));
}

let temp=null,receipt=null;
try{
 if(process.env.GITHUB_ACTIONS!=='true'||
    process.env.ARCH_V02X_M5_GITLEAKS_FIXED_SCOPE!=='1')
  refuse('HOSTED_CI_SCOPE_REQUIRED');
 const checkout=process.cwd();
 const head=run('git',['rev-parse','HEAD'],checkout);
 if(head.status!==0||!/^[a-f0-9]{40}$/.test(head.stdout.trim()))
   refuse('FIXED_CHECKOUT_IDENTITY_MISSING');
 const p1=run('git',['rev-parse',P1],checkout);
 if(p1.status!==0||p1.stdout.trim()!==P1)refuse('FIXED_P1_COMMIT_NOT_PRESENT');
 if(run('git',['merge-base','--is-ancestor',PARENT,head.stdout.trim()],checkout).status!==0)
  refuse('WRONG_INDEPENDENT_SECURITY_PARENT');
 const tool=process.env.ARCH_V02X_M5_VERIFIED_GITLEAKS_BIN;
 const archive=process.env.ARCH_V02X_M5_VERIFIED_GITLEAKS_ARCHIVE;
 if(!tool||!archive||!path.isAbsolute(tool)||!path.isAbsolute(archive))
   refuse('PINNED_INDEPENDENT_TOOL_REQUIRED');
 if(!fs.existsSync(tool)||!fs.existsSync(archive))
   refuse('TOOL_AND_DOWNLOAD_MISSING');
 const binaryVersion=run(tool,['version'],checkout);
 if(binaryVersion.status!==0||!binaryVersion.stdout.includes('8.30.1'))
  refuse('GITLEAKS_UNEXPECTED_VERSION');
 const hash=crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
 if(hash!==TOOL_SHA)refuse('GITLEAKS_ARCHIVE_DIGEST_MISMATCH');
 const tree=process.env.ARCH_V02X_M5_EXTRACTED_P1_TREE;
 if(!tree||!path.isAbsolute(tree)||!fs.existsSync(tree))
  refuse('EXTRACTED_FIXED_TREE_REQUIRED');
 // Verify sampled source identity via Git object fingerprints against exact P1
 // without relying on current HEAD or UI state.
 const file='packages/guard/src/presentation/role_based_html_report.mjs';
 const check=run('git',['rev-parse',P1+':'+file],checkout);
 const obj=run('git',['hash-object',path.join(tree,file)],checkout);
 if(check.status!==0||obj.status!==0||check.stdout.trim()!==obj.stdout.trim())
  refuse('EXTRACTED_P1_TREE_NOT_BOUND_TO_SOURCE_COMMIT');
 temp=fs.mkdtempSync(path.join(process.env.RUNNER_TEMP||os.tmpdir(),'m5-gitleaks-scan-'));
 const history=path.join(temp,'history-private.json');
 const current=path.join(temp,'current-tree-private.json');
 const common=[
  '--no-banner','--log-level','error','--redact=100',
  '--gitleaks-ignore-path','/dev/null',
  '--report-format','json','--max-decode-depth','1',
  '--max-archive-depth','0','--timeout','140'
 ];
 const hist=run(tool,['git',...common,'--log-opts',P1,
  '--report-path',history,checkout],checkout,true);
 if(![0,1].includes(hist.status))refuse('GITLEAKS_HISTORY_SCAN_ERROR');
 const all=readReport(history,hist.status);
 const dir=run(tool,['dir',...common,'--max-target-megabytes','16',
  '--report-path',current,tree],checkout,true);
 if(![0,1].includes(dir.status))refuse('GITLEAKS_TREE_SCAN_ERROR');
 const seen=readReport(current,dir.status);
 // Files, paths, email, line, RuleID match strings, tokens and report content are
 // never uploaded. Only finite normalized categories/counts from the tool.
 const hCounts=group(all),tCounts=group(seen);
 const privateTriage=triagePrivateKeyPatterns(seen,tree,checkout);
 receipt={
  kind:'ARCH_V02X_M5_INDEPENDENT_GITLEAKS_FIXED_P1_SCREEN',
  version:'0.1',tool:'gitleaks',tool_version:'8.30.1',
  tool_download_sha256:TOOL_SHA,
  fixed_p1_source_head:P1,
  inspected_candidate_head:head.stdout.trim(),
  scan_scope:'FIXED_P1_ANCESTRY_AND_EXTRACTED_CURRENT_TREE_SEPARATELY',
  raw_report_uploaded:false,
  raw_match_content_exported:false,
  sensitive_commit_paths_or_authors_exported:false,
  history_finding_count:all.length,
  current_tree_finding_count:seen.length,
  history_rule_categories:hCounts,
  current_tree_rule_categories:tCounts,
  current_tree_private_key_structural_triage:privateTriage,
  original_382_first_party_pem_markers:'7_DELIMITER_HITS_0_STRUCTURAL_ENCODED_BLOCKS',
  independent_tool_scope:'RECOGNIZED_GITLEAKS_RULE_PATTERNS_ONLY',
  independent_secret_free_certification:'NOT_ESTABLISHED',
  current_tree_manual_triage:'NOT_COMPLETE',
  historic_author_metadata_approval:'NOT_ESTABLISHED',
  external_full_windows_m5_kit:'HOLD',
  real_m5_human:'NOT_TESTED',
  original_m4_62:'NOT_RUN',
  no_customer_data:true,no_release:true,no_main_merge:true,
  disposition:all.length||seen.length?
   'HOLD_INDEPENDENT_POTENTIAL_FINDINGS':
   'HOLD_DESPITE_ZERO_DETECTOR_FINDINGS_PENDING_OWNER_REVIEW'
 };
 if(all.length||seen.length)process.exitCode=31;
}catch(e){
 receipt={
  kind:'ARCH_V02X_M5_INDEPENDENT_GITLEAKS_FIXED_P1_SCREEN',
  version:'0.1',tool:'gitleaks',fixed_p1_source_head:P1,
  disposition:'HOLD_INDEPENDENT_TOOL_OR_SCOPE_FAILURE',
  error_type:e?.code||e?.name||'Error',
  no_raw_match_export:true,
  external_full_windows_m5_kit:'HOLD',
  original_m4_62:'NOT_RUN',real_m5_human:'NOT_TESTED'
 };
 process.exitCode=30;
}finally{
 // Delete only scanner-created temp private report files, even after failure.
 if(temp&&fs.existsSync(temp))fs.rmSync(temp,{recursive:true,force:true});
}
const output=JSON.stringify(receipt);
console.log('ARCH_V02X_M5_GITLEAKS_SCREEN_RECEIPT '+output);
if(process.env.ARCH_V02X_M5_GITLEAKS_SANITIZED_RECEIPT){
 const name=process.env.ARCH_V02X_M5_GITLEAKS_SANITIZED_RECEIPT;
 const runner=process.env.RUNNER_TEMP||os.tmpdir();
 rootGuard(runner,name);
 fs.writeFileSync(name,JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
}
