// I-1 local Pack Review, candidate-only.  Never writes inside the input Pack.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ALLOWED_ROOT = new Set([
  'README.md', 'manifest.json', 'agent-profile.json', 'task-scope.md',
  'action-boundary.yaml', 'data-sources.yaml', 'tools.yaml',
  'review-standards.md', 'snapshot.json', 'evidence'
]);
const ALLOWED_EVIDENCE = new Set(['sample-output.json', 'run-record.json']);
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_TOTAL_BYTES = 16 * 1024 * 1024;

export class ReviewInputError extends Error {
  constructor(message, code = 'invalid_input') {
    super(message);
    this.code = code;
  }
}
export class ReviewOutputError extends Error {
  constructor(message) {
    super(message);
    this.code = 'output_error';
  }
}
const hashBytes = (data) => crypto.createHash('sha256').update(data).digest('hex');
const fileHash = (p) => hashBytes(fs.readFileSync(p));
const isWithin = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
};

function assertRegularNoLink(file) {
  let stat;
  try { stat = fs.lstatSync(file); }
  catch { throw new ReviewInputError('Input changed or a required file could not be opened.'); }
  if (stat.isSymbolicLink() || !stat.isFile()) throw new ReviewInputError('Pack contains a symlink, non-file or unsupported special entry.');
  if (stat.size > MAX_FILE_BYTES) throw new ReviewInputError('Selected Pack contains a file exceeding the 4 MiB I-1 limit.');
  return stat;
}
function safeSourceBytes(file) {
  assertRegularNoLink(file);
  const flags = fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0);
  let fd;
  try {
    fd = fs.openSync(file, flags);
    const fstat = fs.fstatSync(fd);
    const before = fs.lstatSync(file);
    if (!fstat.isFile() || fstat.size > MAX_FILE_BYTES || before.isSymbolicLink() ||
        before.dev !== fstat.dev || before.ino !== fstat.ino) {
      throw new ReviewInputError('Selected Pack source identity changed while opening.');
    }
    const bytes = fs.readFileSync(fd);
    const after = fs.fstatSync(fd);
    if (bytes.length !== after.size || after.dev !== fstat.dev || after.ino !== fstat.ino ||
        after.size !== fstat.size) {
      throw new ReviewInputError('Selected Pack file changed while being read.');
    }
    return bytes;
  } catch (e) {
    if (e instanceof ReviewInputError) throw e;
    throw new ReviewInputError('Selected Pack file could not be read safely.');
  } finally { if (fd !== undefined) fs.closeSync(fd); }
}
function enumeratedFiles(root) {
  const results = [];
  const rootNames = fs.readdirSync(root, { withFileTypes:true });
  for (const e of rootNames) {
    if (!ALLOWED_ROOT.has(e.name)) throw new ReviewInputError('Pack has an unexpected file or directory; I-1 only supports the 11-file First Report allowlist.');
    if (e.isSymbolicLink()) throw new ReviewInputError('Pack root contains a symlink.');
    if (e.name === 'evidence') {
      if (!e.isDirectory()) throw new ReviewInputError('Pack evidence entry is not a directory.');
      const dir = path.join(root, 'evidence');
      const actual = fs.realpathSync(dir);
      if (!isWithin(root, actual)) throw new ReviewInputError('Pack evidence entry escapes the selected root.');
      for (const nested of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!ALLOWED_EVIDENCE.has(nested.name) || nested.isSymbolicLink() || !nested.isFile()) {
          throw new ReviewInputError('Evidence subfolder contains an unsupported entry or symlink.');
        }
        results.push(`evidence/${nested.name}`);
      }
    } else if (e.isFile()) { results.push(e.name); }
    else throw new ReviewInputError('Selected Pack contains an unsupported directory or special entry.');
  }
  return results.sort();
}
function validateLocalReferences(root, memoryFiles = null) {
  for (const [file, keys] of [
    ['evidence/sample-output.json', ['output_artifact_ref']],
    ['evidence/run-record.json', ['input_ref', 'output_ref']]
  ]) {
    const full=path.join(root,...file.split('/'));
    if(memoryFiles ? !memoryFiles.has(file) : !fs.existsSync(full)) continue;
    let value;
    try { value=JSON.parse((memoryFiles ? memoryFiles.get(file) : safeSourceBytes(full)).toString('utf8')); }
    catch {continue;} // Native parser will preserve a malformed-input result.
    if(!value || typeof value!=='object')continue;
    for(const key of keys){
      const ref=value[key];
      if(typeof ref!=='string')continue;
      const locator=ref.split('#')[0];
      const generic=locator.replace(/\\/g,'/');
      if(path.posix.isAbsolute(generic) || path.win32.isAbsolute(locator) ||
         generic.split('/').some(part=>part==='..') || generic.startsWith('//') || locator.includes('\0')) {
        throw new ReviewInputError('Selected Pack contains an out-of-scope local reference.');
      }
    }
  }
}
function realPack(packInput) {
  const requested = path.resolve(packInput);
  let stat;
  try { stat = fs.lstatSync(requested); }
  catch { throw new ReviewInputError('Selected Pack directory does not exist.', 'precondition_failed'); }
  if (stat.isSymbolicLink() || !stat.isDirectory()) throw new ReviewInputError('Pack must be a real directory, not a symlink or file.');
  const real = fs.realpathSync(requested);
  if (!fs.statSync(real).isDirectory()) throw new ReviewInputError('Selected Pack root must be a directory.');
  return real;
}
export function preflightReview(packInput, outInput) {
  const packRoot = realPack(packInput);
  const requestedOutput = path.resolve(outInput);
  const outputName = path.basename(requestedOutput);
  const parentRequested = path.dirname(requestedOutput);
  if (!outputName || outputName === '.' || outputName === '..') throw new ReviewInputError('An explicit new output directory name is required.');
  let parent;
  try { parent = fs.realpathSync(parentRequested); }
  catch { throw new ReviewInputError('The output parent directory must already exist.', 'precondition_failed'); }
  if (!fs.statSync(parent).isDirectory()) throw new ReviewInputError('Output parent must be a directory.', 'precondition_failed');
  const finalPath = path.join(parent, outputName);
  if (isWithin(packRoot, finalPath) || isWithin(finalPath, packRoot)) throw new ReviewInputError('Output cannot overlap or contain the input Pack.');
  if (fs.existsSync(finalPath) || isLink(finalPath)) throw new ReviewInputError('Output already exists. No overwrite is permitted.', 'precondition_failed');
  const names = enumeratedFiles(packRoot);
  validateLocalReferences(packRoot);
  return {packRoot, parent, finalPath, outputName, names, sourceName:path.basename(packRoot)};
}
function isLink(file) { try { return fs.lstatSync(file).isSymbolicLink(); } catch { return false; } }
function writeAtomic(stage, relative, bytes) {
  const full = path.join(stage, ...relative.split('/'));
  const parent = path.dirname(full);
  fs.mkdirSync(parent, {recursive:true, mode:0o700});
  const temp = `${full}.tmp-${crypto.randomUUID()}`;
  let fd;
  try {
    fd = fs.openSync(temp, 'wx', 0o600);
    fs.writeFileSync(fd, bytes);
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd=undefined;
    fs.renameSync(temp, full);
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
    if (fs.existsSync(temp)) fs.rmSync(temp, {force:true});
  }
  return {path:relative, bytes:Buffer.byteLength(bytes), sha256:hashBytes(bytes)};
}
// I1-REAL-WRITER-DATAFLOW-01: read once, retain only a bounded in-process
// frozen byte snapshot. NEVER write raw Pack bytes beneath the output parent.
// The opt-in memory view is read-only to callers and preserves legacy parser
// CRLF normalization and sorted-path hash semantics.
function makeMemoryPackView(memoryFiles) {
  return Object.freeze({
    hasFile(relativePath) { return memoryFiles.has(relativePath.replace(/\\/g, '/')); },
    readText(relativePath) {
      const key=relativePath.replace(/\\/g, '/');
      const bytes=memoryFiles.get(key);
      if(!bytes) throw new ReviewInputError('Snapshot file is absent.');
      return bytes.toString('utf8').replace(/\r\n/g, '\n');
    },
    listRelativeFiles() { return [...memoryFiles.keys()].sort(); }
  });
}
export function takeReviewSnapshot(preflight) {
  const expected = new Map();
  const memoryFiles = new Map();
  let stage=null,total=0;
  try {
    // Complete the bounded input capture BEFORE a staging directory exists.
    for(const rel of preflight.names){
      const src=path.join(preflight.packRoot,...rel.split('/'));
      const data=safeSourceBytes(src);
      total+=data.length;
      if(total>MAX_TOTAL_BYTES) throw new ReviewInputError('Selected Pack exceeds the 16 MiB I-1 input limit.');
      expected.set(rel,hashBytes(data));
      memoryFiles.set(rel,data);
    }
    validateLocalReferences(preflight.packRoot,memoryFiles);
    stage=fs.mkdtempSync(path.join(preflight.parent, `.guard-i1-partial-${preflight.outputName}-`));
    fs.chmodSync(stage,0o700); // Windows ACL must be separately verified.
    return {stage,expected,memoryFiles,fileView:makeMemoryPackView(memoryFiles),
      rawSourcePersisted:false, ...preflight};
  }catch(e){
    for(const buf of memoryFiles.values())buf.fill(0);
    memoryFiles.clear();
    if(stage)fs.rmSync(stage,{recursive:true,force:true});
    throw e;
  }
}
// Best-effort in-process Buffer wiping, NOT an anti-swap/core-dump guarantee.
export function releaseReviewMemory(ctx) {
  if(!ctx?.memoryFiles)return;
  for(const bytes of ctx.memoryFiles.values())bytes.fill(0);
  ctx.memoryFiles.clear();
}
export function verifySourceUnchanged(ctx) {
  const current = enumeratedFiles(ctx.packRoot);
  if (current.length !== ctx.names.length || current.some((x,i)=>x!==ctx.names[i])) throw new ReviewInputError('Source files changed during review.');
  for(const rel of ctx.names) {
    const bytes=safeSourceBytes(path.join(ctx.packRoot,...rel.split('/')));
    if(hashBytes(bytes)!==ctx.expected.get(rel)) throw new ReviewInputError('Source content changed during review.');
  }
}
// A .private-source directory is forbidden by the new Writer dataflow.
export function dropPrivateSnapshot(ctx) {
  if(!ctx)return;
  if(fs.existsSync(path.join(ctx.stage,'.private-source'))) {
    throw new ReviewOutputError('Unexpected raw source copy on disk; refuse Bundle publication.');
  }
}
// I1-SEC-01: an exclusive namespace claim closes the observed concurrent
// empty-directory creation race.  On POSIX rename(2) otherwise *replaces* an
// already-existing empty target directory.  Native Windows directory rename
// refuses an existing target, so Windows must not pre-create a placeholder.
//
// Threat boundary: this protects independent creators of the destination name;
// it is not a kernel RENAME_NOREPLACE against an adversary entitled to remove
// and replace the claimed directory or mutate its parent in the same instant.
// Do not describe this as independent assurance or protection against a
// malicious same-user filesystem actor.
export function publishBundleNoReplace(ctx) {
  // A staging and final sibling must share a filesystem. Do not silently
  // copy/move across devices, because that loses atomic visibility guarantees.
  const stageDev = fs.statSync(ctx.stage).dev;
  const parentDev = fs.statSync(ctx.parent).dev;
  if (stageDev !== parentDev) throw new ReviewOutputError('Staging and output destination are on different filesystems; refusing non-atomic copy.');

  let claim = null;
  try {
    if (process.platform !== 'win32') {
      // mkdir is atomic, exclusive and fails when a competing writer created
      // the destination even if that writer's directory is empty.  Holding the
      // empty directory reserves the pathname until the final atomic rename.
      try { fs.mkdirSync(ctx.finalPath, {mode:0o700}); }
      catch (err) {
        if (err?.code === 'EEXIST') throw new ReviewInputError('Output already exists. No overwrite is permitted.', 'precondition_failed');
        throw new ReviewOutputError('Could not reserve output destination.');
      }
      claim = fs.lstatSync(ctx.finalPath);
      if (!claim.isDirectory() || claim.isSymbolicLink()) throw new ReviewOutputError('Output destination claim is not a real directory.');
    } else if (fs.existsSync(ctx.finalPath) || isLink(ctx.finalPath)) {
      throw new ReviewInputError('Output already exists. No overwrite is permitted.', 'precondition_failed');
    }
    // Windows rename refuses an existing destination directory; on POSIX the
    // exclusive claim above prevents an independent mkdir racing this rename.
    try { fs.renameSync(ctx.stage, ctx.finalPath); }
    catch (err) {
      if (['EEXIST','ENOTEMPTY'].includes(err?.code)) {
        throw new ReviewInputError('Output appeared during publication. No overwrite is permitted.', 'precondition_failed');
      }
      throw new ReviewOutputError('Atomic same-filesystem Bundle publication failed.');
    }
  } catch (error) {
    // Clean up only our own empty claim if the rename did not happen.  Never
    // recursively remove finalPath: it could belong to an external actor.
    if (claim) {
      try {
        const now = fs.lstatSync(ctx.finalPath);
        if (now.isDirectory() && !now.isSymbolicLink() && now.dev===claim.dev && now.ino===claim.ino &&
            fs.readdirSync(ctx.finalPath).length===0) fs.rmdirSync(ctx.finalPath);
      } catch { /* Retain an uncertain destination rather than deleting another writer's data. */ }
    }
    throw error;
  }
}

export function commitReviewBundle(ctx,{validation,validationExit,report,reportExit,guardVersion,overallStatus}) {
  const stamp=new Date().toISOString();
  const files=[];
  const validBytes=Buffer.from(JSON.stringify(validation,null,2)+'\n','utf8');
  files.push(writeAtomic(ctx.stage,'components/pack-validation.json',validBytes));
  if(report) files.push(writeAtomic(ctx.stage,'components/single-agent-governance-report.json',Buffer.from(JSON.stringify(report,null,2)+'\n','utf8')));
  const diag={kind:'i1_pack_review_diagnostics', status: overallStatus,
    source_file_count:ctx.names.length, pack_parser_version:validation.parser_version,
    validation_status:validation.validation_status,
    omissions: validation.omissions || [], limitations: validation.limitations || [], parser_warnings: validation.parser_warnings || [],
    non_claims:['ready_for_review is not approval or execution authorization','Hash identity is not evidence provenance authentication','No independent assurance or production verification was performed']};
  files.push(writeAtomic(ctx.stage,'diagnostics.json',Buffer.from(JSON.stringify(diag,null,2)+'\n','utf8')));
  const summary=[
    '# I-1 Local Pack Review · Candidate', '',
    `Status: ${overallStatus}`, `Pack: ${ctx.sourceName}`, `Validation: ${validation.validation_status}`,
    `Review posture: ${report?.review_posture || 'not_generated'}`, `Input hash: ${validation.deterministic_pack_hash || 'unavailable'}`, '',
    '## Evidence limits',
    `- Omissions: ${(validation.omissions||[]).length}`,
    `- Limitations: ${(validation.limitations||[]).length}`,
    `- Parser warnings: ${(validation.parser_warnings||[]).length}`,
    '- This Bundle is a local review envelope, not an additional Evidence Contract.',
    '- No approval, certification, production assurance, compliance decision, or execution authority is granted.',
    '- Inputs are synthetic or explicitly user-supplied; actual origin and completeness were not independently verified.',
    '- No raw input Pack files are copied into staging. This does not guarantee secure RAM/swap erasure.',
    '- Component JSON may include input-provided identifiers and narrative. Treat the Bundle as potentially sensitive and review before sharing.', '',
  ].join('\n');
  files.push(writeAtomic(ctx.stage,'review-summary.md',Buffer.from(summary,'utf8')));
  const manifest={kind:'mindforge_guard_review_bundle',bundle_version:'0.1-candidate',mode:'pack',
    guard_version:guardVersion,created_at:stamp,overall_status:overallStatus,
    input:{source_basename:ctx.sourceName,contract:'first-report-pack',read_only:true,source_file_count:ctx.names.length,deterministic_pack_hash:validation.deterministic_pack_hash||null},
    components:{pack_validation:{status:validation.validation_status,native_exit_code:validationExit,artifact:'components/pack-validation.json'},single_agent_report:{status:report?.review_posture||'not_generated',native_exit_code:report?reportExit:null,artifact:report?'components/single-agent-governance-report.json':null,skipped_reason:report?null:'malformed_input'}},
    artifacts:files.map(f=>({path:f.path,byte_length:f.bytes,sha256:f.sha256})),
    limitations:validation.limitations||[],omissions:validation.omissions||[],
    does_not_support:['Pack validated != action authorized','Report ready_for_review != governance approval','Digest matched != independent producer attestation'],
    recommendation_only:true,non_executing:true,independent_assurance:'NOT_ESTABLISHED'};
  files.push(writeAtomic(ctx.stage,'review-manifest.json',Buffer.from(JSON.stringify(manifest,null,2)+'\n','utf8')));
  const checksums={kind:'i1_bundle_checksums',hash_algorithm:'sha256',note:'Index never self-hashes; paths are relative to the finalized Bundle.',files};
  writeAtomic(ctx.stage,'bundle-checksums.json',Buffer.from(JSON.stringify(checksums,null,2)+'\n','utf8'));
  dropPrivateSnapshot(ctx);
  verifySourceUnchanged(ctx);
  // The exclusive destination claim and same-volume rename must both succeed
  // before the CLI is allowed to announce a complete Review Bundle.
  publishBundleNoReplace(ctx);
  return {manifest,files:[...files,{path:'bundle-checksums.json'}],finalPath:ctx.finalPath};
}
export function markReviewFailed(ctx,err) {
  if(!ctx) return null;
  try {
    dropPrivateSnapshot(ctx);
    const failure={status:'INCOMPLETE',reason:err?.code||'unexpected_error',message:'I-1 did not publish a completed Bundle. Inspect the invoking CLI stderr.',time:new Date().toISOString()};
    writeAtomic(ctx.stage,'INCOMPLETE.json',Buffer.from(JSON.stringify(failure,null,2)+'\n','utf8'));
  }catch{/* Do not mask the original failure. */}
  return ctx.stage;
}
export function removeSnapshotOnFailure(ctx) {if(ctx)dropPrivateSnapshot(ctx);}
