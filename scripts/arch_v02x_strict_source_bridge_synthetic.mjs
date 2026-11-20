// Architecture v0.2.x SRC strict-v0.1-synthetic transition experiment.
// An explicit default-off source gate wraps existing Pack Validate WITHOUT
// modifying it. Fixed synthetic only; NOT an installed 'guard review --source'.
// Gate before and after legacy Parser; race-proof capture NOT ESTABLISHED.
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const GATE=path.join(ROOT,'scripts/arch_v02x_source_admission_gate_synthetic.mjs');
const CLI=path.join(ROOT,'packages/guard/bin/guard.mjs');
class Stop extends Error{constructor(code){super(code);this.name='Stop';}}
const refuse=x=>{throw new Stop(x)};
function parse(argv){
 if(argv.length===1&&['-h','--help'].includes(argv[0]))return{help:true};
 const map={'--source':'source','--fixture-root':'fixture','--source-contract':'contract',
 '--format':'format','--expected-source-digest':'expected'};
 const data={source:null,fixture:null,contract:null,format:null,expected:null};
 for(let i=0;i<argv.length;i++){
  const dest=map[argv[i]];if(!dest)refuse('UNSUPPORTED_OPTION');
  if(data[dest]!==null)refuse('DUPLICATE_OPTION');
  const value=argv[++i];if(!value||value.startsWith('--'))refuse('OPTION_VALUE_REQUIRED');
  data[dest]=value;
 }
 if(Object.values(data).some(x=>!x))refuse('EXPLICIT_PINNED_SOURCE_CONTRACT_REQUIRED');
 if(data.contract!=='strict-v0.1-synthetic'||data.format!=='json')
  refuse('UNSUPPORTED_CONTRACT_VERSION_OR_FORMAT');
 if(!path.isAbsolute(data.source)||!path.isAbsolute(data.fixture))
  refuse('ABSOLUTE_EXPLICIT_SOURCE_AND_FIXTURE_REQUIRED');
 if(!/^sha256:[a-f0-9]{64}$/.test(data.expected))
  refuse('EXACT_SOURCE_SET_DIGEST_REQUIRED');
 return data;
}
function exec(file,args,env){
 const p=spawnSync(process.execPath,[file,...args],{
  cwd:ROOT,env:{...process.env,...env},
  encoding:'utf8',windowsHide:true,timeout:60000,maxBuffer:8*1024*1024
 });
 if(p.error||p.signal!==null)refuse('SUBPROCESS_FAILED_CLOSED');
 return p;
}
function asJSON(out,reason){
 try{return JSON.parse(out)}catch{refuse(reason)}
}
function run(argv){
 const arg=parse(argv);
 if(arg.help)return{help:'SYNTHETIC ONLY: --source <absolute fixture Pack> --fixture-root <absolute marked TEMP root> --source-contract strict-v0.1-synthetic --format json --expected-source-digest sha256:<64 hex>. No product admission.'};
 if(process.env.ARCH_V02X_STRICT_SOURCE_BRIDGE_SYNTHETIC_ONLY!=='1'||
    process.env.ARCH_V02X_P0_SOURCE_ADMISSION_SYNTHETIC_ONLY!=='1')
  refuse('EXPLICIT_TWO_SYNTHETIC_GATES_REQUIRED');
 const gate=()=>exec(GATE,['--pack',arg.source,'--fixture-root',arg.fixture,'--format','json'],{
   ARCH_V02X_P0_SOURCE_ADMISSION_SYNTHETIC_ONLY:'1'
 });
 const first=gate(),before=asJSON(first.stdout,'SOURCE_ADMISSION_RESPONSE_NOT_JSON');
 if(first.status!==0||before.kind!=='ARCH_V02X_P0_SYNTHETIC_SOURCE_ADMISSION'||
    before.status!=='BOUNDARY_OBSERVED_FOR_SYNTHETIC_FIXTURE'||
    before.general_real_source_admission!=='NOT_AUTHORIZED')
  refuse('STRICT_SOURCE_ADMISSION_PREFLIGHT_BLOCKED');
 if(before.source_content_set_sha256!==arg.expected)
  refuse('PINNED_SOURCE_SET_DIGEST_MISMATCH');
 const result=exec(CLI,['pack','validate','--pack',arg.source,'--preview','--json'],{
   I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT:'0',
   I1_REAL_WIN_ACL_SYNTHETIC_ONLY:'0',
   I1_REAL_WIN_ACL_MODULE_PATH:'',
   I1_REAL_WIN_ACL_MODULE_SHA256:''
 });
 if(result.status!==0)refuse('LEGACY_PACK_VALIDATE_FAILED');
 const native=asJSON(result.stdout,'LEGACY_VALIDATOR_RESPONSE_NOT_JSON');
 if(native.validation_status!=='valid_with_no_omissions'||
    !/^sha256:[a-f0-9]{64}$/.test(native.deterministic_pack_hash))
  refuse('LEGACY_NATIVE_VALIDATION_NOT_ACCEPTED');
 const second=gate(),after=asJSON(second.stdout,'SOURCE_ADMISSION_POSTCHECK_NOT_JSON');
 if(second.status!==0||after.status!==before.status||
    after.source_content_set_sha256!==before.source_content_set_sha256||
    after.total_bytes!==before.total_bytes||after.file_count!==before.file_count)
  refuse('SOURCE_CHANGED_DURING_LEGACY_VALIDATION_OR_POSTCHECK');
 return {
  kind:'ARCH_V02X_STRICT_SOURCE_V01_SYNTHETIC_PREVIEW',
  version:'strict-v0.1-synthetic',
  status:'VALIDATED_BOUNDED_SYNTHETIC_NOT_PRODUCTION_ADMITTED',
  input_source_class:'FIXED_HR_SYNTHETIC_ONLY',
  source_set_sha256:before.source_content_set_sha256,
  native_legacy_pack_hash:native.deterministic_pack_hash,
  legacy_validation_status:native.validation_status,
  source_files_count:before.file_count,
  source_content_bytes:before.total_bytes,
  explicitly_versioned_contract:true,legacy_pack_parser_unmodified:true,
  source_gate_pre_and_post_check:true,
  no_source_values_or_host_paths_exported:true,
  no_source_copy_written:true,no_network_calls:true,
  secure_snapshot_and_adversarial_toctou:'NOT_ESTABLISHED',
  m2_public_source_route:'NOT_IMPLEMENTED',
  real_customer_data:'NOT_AUTHORIZED',
  authority_verification:'NOT_ESTABLISHED',
  m4_original_62:'NOT_RUN',
  m5_independent_first_user:'NOT_TESTED',
  no_release:true
 };
}
try{process.stdout.write(JSON.stringify(run(process.argv.slice(2)))+'\n')}
catch(e){const code=e instanceof Stop?e.message:'SOURCE_BRIDGE_IO_OR_RUNTIME_ERROR';
 process.stdout.write(JSON.stringify({
  kind:'ARCH_V02X_STRICT_SOURCE_V01_SYNTHETIC_PREVIEW',
  status:'BLOCKED',reason:code,no_partial_success:true,
  original_legacy_parser:'UNCHANGED',no_real_data_or_authority_admission:true
 })+'\n');process.exitCode=24}
