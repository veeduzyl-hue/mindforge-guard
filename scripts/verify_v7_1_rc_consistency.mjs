import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

const read=(p)=>fs.readFileSync(p,'utf8');
const pkg=JSON.parse(read('packages/guard/package.json'));
const lock=JSON.parse(read('package-lock.json'));
assert.equal(pkg.name,'@veeduzyl/mindforge-guard');
assert.equal(pkg.version,'7.1.0-rc.0');
assert.equal(lock.packages['packages/guard'].version,pkg.version);
assert.equal(lock.packages['node_modules/@veeduzyl/mindforge-guard'].resolved,'packages/guard');
assert.equal(pkg.license,'Apache-2.0');
assert.equal(pkg.bin.guard,'bin/guard.mjs');
// Git converts eligible text files to CRLF in Windows checkout. Compare their
// canonical LF text bytes to the fixed Git Blob SHA without ignoring any other edit.
const blobSha=(p)=>{const bytes=Buffer.from(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),'utf8');return crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');};
assert.equal(blobSha('apps/license-hub/lib/commercialCatalog.ts'),'b766f0a98bf19efefe980ad0959ad512cd38984a','Commercial catalog changed');
assert.equal(blobSha('apps/license-hub/lib/paddlePrices.ts'),'e897c22b092f844b8cdb6ae862143292acce75cc','Paddle price IDs changed');
assert.equal(blobSha('packages/guard/src/product/license_gate.mjs'),'0ee6997d4e217d5456b4cdf0b02d7174fc16bb10','License tier gates changed');
for(const f of ['packages/guard/src/cli/report.mjs','packages/guard/src/cli/report_render_html.mjs','packages/guard/src/presentation/role_based_html_report.mjs','docs/release/v7_1_0_rc_0_release_candidate.md','docs/commercial/pilot/v0.1/PILOT_README.md','docs/commercial/pilot/v0.1/PILOT_INTAKE.md','docs/commercial/pilot/v0.1/PILOT_FEEDBACK.md','docs/commercial/pilot/v0.1/PILOT_COMMERCIAL_HYPOTHESIS.md']) assert(fs.existsSync(f),f);
const releaseDoc=read('docs/release/v7_1_0_rc_0_release_candidate.md');
assert(releaseDoc.includes('no Git tag')&&releaseDoc.includes('7.1.0-rc.0')&&releaseDoc.includes('7.0.1'));
const pilot=read('docs/commercial/pilot/v0.1/PILOT_README.md');
assert(pilot.includes('No automatic telemetry')&&pilot.includes('not been published to npm'));
console.log('PASS: candidate manifest/lockfile, unchanged commercial and license identities, draft pilot and release boundaries');
