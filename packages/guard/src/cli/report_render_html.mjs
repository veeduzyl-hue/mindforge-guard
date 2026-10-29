import fs from 'node:fs';
import path from 'node:path';
import { renderRoleBasedHtml, validatePreviewForRendering } from '../presentation/role_based_html_report.mjs';

const USAGE = 'guard report render --input <report.json> --out <report.html> --format html';
const MAX_INPUT_BYTES = 4 * 1024 * 1024;

function usage(message) { return {exitCode:2, stderr:`${message}\nUsage: ${USAGE}\n`}; }
function error(message) { return {exitCode:4, stderr:`Report presentation not generated: ${message}\n`}; }

function parseArgs(args) {
  const out = {input:null, output:null, format:null};
  for (let i=0; i<args.length; i++) {
    const arg=args[i];
    if (arg==='--help' || arg==='-h') return {help:true};
    let key,value;
    if (arg==='--input' || arg==='--out' || arg==='--format') {key=arg; value=args[++i];}
    else if (arg.startsWith('--input=')) {key='--input'; value=arg.slice(8);}
    else if (arg.startsWith('--out=')) {key='--out'; value=arg.slice(6);}
    else if (arg.startsWith('--format=')) {key='--format'; value=arg.slice(9);}
    else return {error:`Unsupported argument: ${arg}`};
    if (!value || value.startsWith('--')) return {error:`Missing value for ${key}`};
    const dest = key==='--input'?'input':key==='--out'?'output':'format';
    if (out[dest]!==null) return {error:`Duplicate option: ${key}`};
    out[dest]=value;
  }
  if (!out.input || !out.output || out.format!=='html') return {error:'Explicit --input, --out and --format html are required.'};
  return {parsed:out};
}

export function handleReportRenderHtmlSubcommand(args) {
  const {help, parsed, error:argError} = parseArgs(args);
  if (help) return {exitCode:0, stdout:USAGE+'\n'};
  if (argError) return usage(argError);
  try {
    const input=path.resolve(parsed.input);
    const output=path.resolve(parsed.output);
    if (input===output) return error('Input and output must be different paths.');
    if (path.extname(output).toLowerCase()!=='.html') return usage('Output must use the .html extension.');
    const stat=fs.lstatSync(input);
    if (!stat.isFile() || stat.isSymbolicLink()) return error('Input must be a regular, non-symlink JSON file.');
    if (stat.size===0 || stat.size>MAX_INPUT_BYTES) return error('Input must be between 1 byte and 4 MiB.');
    const bytes=fs.readFileSync(input);
    if (bytes.length>MAX_INPUT_BYTES) return error('Input exceeds 4 MiB.');
    let report;
    try {report=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}
    catch {return error('Input must be valid UTF-8 JSON (not PowerShell 5.1 UTF-16 output).');}
    validatePreviewForRendering(report);
    const html=renderRoleBasedHtml(report, bytes);
    // Exclusive creation. Existing outputs are never overwritten or removed.
    fs.writeFileSync(output,html,{encoding:'utf8',flag:'wx',mode:0o600});
    return {exitCode:0,stdout:`HTML report created: ${output}\nSource report was not modified. English presentation only; no governance decision was recalculated.\n`};
  } catch(e) {return error(e?.code==='EEXIST'?'Output already exists; choose a new path.':(e?.message||String(e)));}
}
