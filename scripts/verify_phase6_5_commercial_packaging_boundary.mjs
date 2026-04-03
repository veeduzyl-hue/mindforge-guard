import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function expect(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(root, filePath));
}

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

const requiredFiles = [
  "docs/product/current-product-baseline.md",
  "docs/product/capability-baseline.md",
  "docs/product/user-journey.md",
  "docs/demo/commercial-demo-paths.md",
  "docs/release/release-readiness-checklist.md",
];

for (const file of requiredFiles) {
  expect(fileExists(file), `missing packaging file: ${file}`);
}

const rootReadme = read("README.md");
for (const link of [
  "docs/product/current-product-baseline.md",
  "docs/product/capability-baseline.md",
  "docs/product/user-journey.md",
  "docs/demo/commercial-demo-paths.md",
  "docs/release/release-readiness-checklist.md",
]) {
  expect(rootReadme.includes(link), `README missing link to ${link}`);
}

const guardReadme = read("packages/guard/README.md");
expect(guardReadme.includes("../../docs/product/current-product-baseline.md"), "guard README missing product baseline link");
expect(guardReadme.includes("../../docs/release/release-readiness-checklist.md"), "guard README missing release checklist link");

const hubReadme = read("apps/license-hub/README.md");
expect(hubReadme.includes("../../docs/product/current-product-baseline.md"), "license hub README missing product baseline link");
expect(hubReadme.includes("../../docs/demo/commercial-demo-paths.md"), "license hub README missing demo paths link");

const baselineDoc = read("docs/product/current-product-baseline.md");
expect(baselineDoc.includes("What is currently sellable"), "baseline doc should state what is sellable");
expect(baselineDoc.includes("What should not be promised yet"), "baseline doc should state what not to promise");

const capabilityDoc = read("docs/product/capability-baseline.md");
expect(capabilityDoc.includes("What is not fully launched"), "capability baseline should distinguish unfinished surfaces");
expect(capabilityDoc.includes("License Hub supporting surfaces"), "capability baseline should mention supporting surfaces");

const journeyDoc = read("docs/product/user-journey.md");
expect(journeyDoc.includes("```mermaid"), "user journey should include a mermaid diagram");
expect(journeyDoc.includes("guard license install --file"), "user journey should mention CLI install");

const demoDoc = read("docs/demo/commercial-demo-paths.md");
for (const heading of ["Demo Path A", "Demo Path B", "Demo Path C"]) {
  expect(demoDoc.includes(heading), `demo doc missing ${heading}`);
}

const releaseDoc = read("docs/release/release-readiness-checklist.md");
expect(releaseDoc.includes("Required environment variables"), "release checklist should include env requirements");
expect(releaseDoc.includes("Guard CLI smoke steps"), "release checklist should include CLI smoke steps");

const rootPackage = read("package.json");
expect(rootPackage.includes("\"verify:phase6-5-commercial-packaging\""), "package.json should expose phase 6.5 verify");

const guardRun = read("packages/guard/src/runGuard.mjs");
expect(!guardRun.includes("license activate"), "phase 6.5 packaging should not introduce online activation into CLI main path");

process.stdout.write("phase6.5 commercial packaging boundary verified\n");
