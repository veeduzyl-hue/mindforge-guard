// ARCH-v02.x First Report P1: visual-only contrast and markup parity regression.
// Static CSS/color tests do NOT prove full live-browser accessibility conformance.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {runGuard} from '../packages/guard/src/runGuard.mjs';
import {renderRoleBasedHtml as improved} from '../packages/guard/src/presentation/role_based_html_report.mjs';

const PARENT='3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c';
const RENDERER='packages/guard/src/presentation/role_based_html_report.mjs';
const git=spawnSync('git',['show',PARENT+':'+RENDERER],{encoding:'utf8',timeout:15000,maxBuffer:200000});
assert.equal(git.status,0,'Frozen baseline source must be readable');
const extractedBlob=spawnSync('git',['hash-object',RENDERER],{encoding:'utf8',timeout:10000});
assert.equal(extractedBlob.status,0);
assert.equal(extractedBlob.stdout.trim(),'8078a934badae529bdaba1423bbf193ec0cdb761',
 'Exact source blob must match the already bounded P1 CSS source');
const frozen=await import('data:text/javascript;base64,'+Buffer.from(git.stdout).toString('base64'));
const generated=await runGuard({argv:['report','single-agent','--pack',
 'examples/single-agent-governance-pack/hr-self-service-agent','--preview','--json']});
assert.equal(generated.exitCode,0,'Existing report preview must pass');
const bytes=Buffer.from(generated.stdout,'utf8'),report=JSON.parse(generated.stdout);
const baselineHTML=frozen.renderRoleBasedHtml(report,bytes),revisedHTML=improved(report,bytes);
const cssFrom=h=>h.match(/<style>([\s\S]*?)<\/style>/)?.[1];
const baseCSS=cssFrom(baselineHTML),css=cssFrom(revisedHTML);
const results=[];
function check(id,meaning,fn){
 try{const evidence=fn()||{};results.push({id,meaning,status:'PASS',evidence});console.log('PASS '+id+' '+meaning);}
 catch(e){results.push({id,meaning,status:'FAIL',error:String(e?.stack||e).slice(0,1700)});console.error('FAIL '+id+' '+String(e.message||e));}
}
function luminance(h){
 assert.match(h,/^#[a-f0-9]{6}$/i);
 const a=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255)
   .map(c=>c<=0.04045?c/12.92:((c+.055)/1.055)**2.4);
 return a[0]*.2126+a[1]*.7152+a[2]*.0722;
}
function contrast(a,b){
 const x=luminance(a),y=luminance(b);
 return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
check('P1UX-01','renderer changes only embedded stylesheet, not text/hash/authority',()=>{
 const strip=s=>s.replace(/<style>[\s\S]*?<\/style>/,'<style>STYLESHEET_ONLY</style>');
 assert.equal(strip(revisedHTML),strip(baselineHTML));
 assert.equal(report.review_posture,'ready_for_review');
 assert(revisedHTML.includes(report.deterministic_hash));
 assert(revisedHTML.includes("default-src 'none'"));
 assert(!revisedHTML.includes('<script'));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex').length,64);
});
check('P1UX-02','additive typography CSS preserves entire baseline stylesheet',()=>{
 assert(css&&baseCSS);assert(css.startsWith(baseCSS));
 assert(css.includes('FIRST_REPORT_P1_LEGIBILITY_V01'));
 for(const required of ['.card p{font-size:15.5px','.path{font-size:13px',
 '.path a{color:#075d69','.mini .sub{font-size:13px',
 '.raw pre{font-size:13px','.selector label{font-size:15px',
 '.notice p{font-size:15px','footer{font-size:13.5px']){
  assert(css.includes(required),'Missing P1 style '+required);
 }
});
check('P1UX-03','design-defined foreground/background samples exceed 4.5:1',()=>{
 const samples=[
  ['body','#20324a','#f3f6fa'],
  ['card','#34465b','#ffffff'],
  ['metadata','#455970','#ffffff'],
  ['source-path','#41566b','#ffffff'],
  ['source-link','#075d69','#ffffff'],
  ['source-code','#344e65','#ffffff'],
  ['role-choice','#34465b','#ffffff'],
  ['notice','#634416','#fff4e2'],
  ['hero-on-gradient-end','#e8f4f7','#25576a'],
  ['hero-muted-on-navy','#d6eef6','#142a44'],
  ['raw-json','#e1ebf0','#102238']
 ];
 const ratios={};
 for(const [name,fg,bg] of samples){
  const r=contrast(fg,bg);
  assert(r>=4.5,name+' static pair '+r.toFixed(2)+' below 4.5');
  ratios[name]=Number(r.toFixed(2));
 }
 return ratios;
});
check('P1UX-04','three keyboard role inputs have visible focus rings',()=>{
 for(const name of ['business','technical','governance']){
  assert(css.includes('input#view-'+name+':focus-visible ~ .selector label[for=view-'+name+']'));
  assert(revisedHTML.includes('id="view-'+name+'"'));
  assert(revisedHTML.includes('label for="view-'+name+'"'));
  assert(css.includes('input#view-'+name+':checked ~ .selector label[for=view-'+name+']'));
 }
 assert(css.includes('outline:3px solid #0a6a86'));
 for(const name of ['business','technical','governance']){
  assert(revisedHTML.includes('class="panel role-'+name+'"'));
 }
});
check('P1UX-05','links are visibly underlined and source link anchors retain target',()=>{
 assert(css.includes('a{color:#075d69;text-decoration:underline;'));
 assert(css.includes('.path a{color:#075d69'));
 assert(revisedHTML.includes('href="#original-report"'));
 assert(revisedHTML.includes('id="original-report"'));
 assert(revisedHTML.includes('Source field: <code>/authority_summary</code>'));
});
check('P1UX-06','mobile, print and reduced-motion contrast/focus guards present',()=>{
 assert(css.includes('@media(max-width:750px)'));
 assert(css.includes('@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}'));
 assert(css.includes('@media print'));
 assert(css.includes('.hero p,.hero-aside p,.hero .micro{color:#20324a!important}'));
});
check('P1UX-07','deterministic HTML and input injection/authority rejection unchanged',()=>{
 assert.equal(improved(report,bytes),revisedHTML);
 const invalid={...report,non_enforcement_boundary:{...report.non_enforcement_boundary,approval_granted:true}};
 assert.throws(()=>improved(invalid,Buffer.from(JSON.stringify(invalid))),
   /Non-enforcement contract mismatch/);
 const attack={...report,agent_identity:{...report.agent_identity,agent_label:'<script>alert(1)</script>'}};
 const html=improved(attack,Buffer.from(JSON.stringify(attack)));
 assert(!html.includes('<script>alert(1)</script>'));
 assert(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
});
const fails=results.filter(x=>x.status==='FAIL');
const head=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'});
const receipt={kind:'ARCH_V02X_FIRST_REPORT_P1_CLEAN_MAIN_EXTRACTION_TEST',
 source_head:head.status===0?head.stdout.trim():'UNVERIFIED',fixed_parent:PARENT,
 scope:'VISUAL_ONLY_P1_CSS_EXTRACTED_FROM_MAIN',method:'STATIC_CSS_PAIRS_PLUS_NONSTYLE_HTML_BYTE_PARITY',
 live_browser_test:'NOT_RUN_BY_THIS_SCRIPT',full_wcag22_conformance:'NOT_CLAIMED',
 m4_original_62:'NOT_RUN',m5_independent_human:'NOT_TESTED',
 counts:{pass:results.length-fails.length,fail:fails.length},cases:results};
console.log('ARCH_V02X_P1_LEGIBILITY_TEST_RECEIPT '+JSON.stringify(receipt));
if(fails.length)process.exitCode=1;
