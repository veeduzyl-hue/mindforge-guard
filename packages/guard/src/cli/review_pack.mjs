// I-1 candidate: one explicitly selected local First Report Pack -> Review Bundle.
import { parseSingleAgentGovernancePackPreview } from '../productization/single_agent_pack_parser_preview.mjs';
import { buildSingleAgentReportPreview } from '../productization/single_agent_report_preview_mapper.mjs';
import { buildPackValidationFromSummary } from './pack_validate_preview.mjs';
import {
  preflightReview, takeReviewSnapshot, verifySourceUnchanged,
  commitReviewBundle, markReviewFailed, releaseReviewMemory, ReviewInputError, ReviewOutputError
} from './review_bundle_writer.mjs';

const USAGE = 'guard review --pack <existing-pack-directory> --out <new-directory> [--format text|json]';
const NATIVE_STATUS_EXIT = Object.freeze({
  valid_with_no_omissions:0, valid_with_limitations:2,
  invalid_due_to_omissions:3, invalid_due_to_malformed_input:4
});
function usage(msg) {return {exitCode:2,stderr:`${msg}\nUsage: ${USAGE}\n`};}
function parseArgs(args){
  if(args.length===1 && ['-h','--help'].includes(args[0]))return {help:true};
  const result={pack:null,out:null,format:'text'};
  let formatSet=false;
  for(let i=0;i<args.length;i++){
    let arg=args[i],key,value;
    if(['--pack','--out','--format'].includes(arg)) {key=arg;value=args[++i];}
    else if(arg.startsWith('--pack=')){key='--pack';value=arg.slice('--pack='.length);}
    else if(arg.startsWith('--out=')){key='--out';value=arg.slice('--out='.length);}
    else if(arg.startsWith('--format=')){key='--format';value=arg.slice('--format='.length);}
    else return {error:`Unsupported option or mode: ${arg}`};
    if(!value || value.startsWith('--'))return {error:`Missing value for ${key}`};
    if(key==='--format'){
      if(formatSet)return {error:'Duplicate --format option.'};
      formatSet=true;result.format=value;
    }else{
      const field=key.slice(2);
      if(result[field]!==null)return {error:`Duplicate ${key} option.`};
      result[field]=value;
    }
  }
  if(!result.pack || !result.out)return {error:'Exactly one --pack and an explicit new --out are required. No implicit mode is allowed.'};
  if(!['text','json'].includes(result.format))return {error:'--format must be text or json.'};
  return {parsed:result};
}
function statusFromValidation(v){
  switch(v.validation_status){
    case 'valid_with_no_omissions':return v.parser_warnings?.length?'completed_with_limitations':'ready_for_review';
    case 'valid_with_limitations':return 'completed_with_limitations';
    case 'invalid_due_to_omissions':return 'incomplete';
    default:return 'invalid_input';
  }
}
export function handleReviewPackSubcommand(args,{guardVersion='unknown'}={}){
  const {help,error,parsed}=parseArgs(args);
  if(help)return {exitCode:0,stdout:USAGE+'\nI-1 existing First Report Pack only. No approval, authority, or network effects.\n'};
  if(error)return usage(error);
  let ctx=null;
  try{
    const preflight=preflightReview(parsed.pack,parsed.out);
    ctx=takeReviewSnapshot(preflight);
    // One bounded in-memory source snapshot; no raw Pack copy on disk.
    // Existing legacy commands retain their filesystem behavior.
    const summary=parseSingleAgentGovernancePackPreview(ctx.packRoot,{fileView:ctx.fileView});
    const validation=buildPackValidationFromSummary(summary);
    validation.pack_path=ctx.sourceName; // do not leak absolute host or staging paths in Bundle
    const validationExit=NATIVE_STATUS_EXIT[validation.validation_status];
    if(!Number.isInteger(validationExit))throw new ReviewInputError('Unexpected native validation status.');
    let report=null;
    if(validation.validation_status!=='invalid_due_to_malformed_input'){
      report=buildSingleAgentReportPreview({packRoot:ctx.packRoot,parserSummary:summary,packValidation:validation,fileView:ctx.fileView});
      if(report.deterministic_hash!==validation.deterministic_pack_hash)throw new ReviewInputError('Pack and report hash disagree.');
    }
    verifySourceUnchanged(ctx);
    const overallStatus=statusFromValidation(validation);
    const result=commitReviewBundle(ctx,{validation,validationExit,report,reportExit:report?validationExit:null,guardVersion,overallStatus});
    const external={status:overallStatus,mode:'pack',bundle_dir:result.finalPath,source_basename:ctx.sourceName,
      native_pack_validation_status:validation.validation_status,native_pack_validation_exit_code:validationExit,
      native_report_review_posture:report?.review_posture||'not_generated',native_report_exit_code:report?validationExit:null,
      deterministic_pack_hash:validation.deterministic_pack_hash,not_approval:true,not_execution_authority:true};
    const stdout=parsed.format==='json'?JSON.stringify(external,null,2)+'\n':[
      'I-1 Guard Pack Review (candidate)',`Status: ${overallStatus}`,`Bundle: ${result.finalPath}`,
      `Validation: ${validation.validation_status}`,`Report posture: ${external.native_report_review_posture}`,
      'This is review evidence only, not approval, certification, or execution permission.',''
    ].join('\n');
    return {exitCode:validationExit,stdout};
  }catch(e){
    const partial=markReviewFailed(ctx,e);
    const reason=e instanceof ReviewInputError?e.code:e instanceof ReviewOutputError?'output_error':'output_error';
    const label=reason==='precondition_failed'?'precondition_failed':reason==='invalid_input'?'invalid_input':'output_error';
    const code=label==='invalid_input'?4:label==='precondition_failed'?2:30;
    const detail=e instanceof ReviewInputError?e.message:'I-1 could not acknowledge a completed Bundle; inspect the requested output path and any retained partial before retry or cleanup.';
    return {exitCode:code,stderr:`I-1 ${label}: ${detail}${partial?' (partial retained in output parent)':''}\n`};
  }finally{
    releaseReviewMemory(ctx);
  }
}
