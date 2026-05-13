import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_PHRASES = [
  "After purchase: generate your first governance report",
  "npm install -g @veeduzyl/mindforge-guard@7.0.1",
  "guard license verify --file downloaded-license.json",
  "guard report single-agent",
  "authority boundary",
  "execution evidence",
  "missing evidence",
  "risk/drift signals",
  "does not approve, block, deploy, certify, or control execution",
  "No extra runtime authority",
];

const FORBIDDEN_PHRASES = [
  "v7.0 First Report Candidate doc",
  "Historical GitHub Release v7.0.0",
  "current commercial release baseline remains",
  "current commercial baseline remains v6.13.1",
  "not a public launch",
  "safe to deploy",
  "compliance certification",
  "legal compliance guarantee",
  "runtime enforcement",
  "deployment gate",
  "maturity certification",
];

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function assertPhrasesPresent(text, phrases) {
  for (const phrase of phrases) {
    expect(text.includes(phrase), `required phrase missing: ${phrase}`);
  }
}

function assertPhrasesAbsent(text, phrases) {
  const lower = text.toLowerCase();
  for (const phrase of phrases) {
    expect(!lower.includes(phrase.toLowerCase()), `forbidden phrase present: ${phrase}`);
  }
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const targets = [
    "apps/license-hub/app/page.tsx",
    "apps/license-hub/app/docs/page.tsx",
    "apps/license-hub/lib/commercialCatalog.ts",
  ];

  const combinedText = targets
    .map((relativePath) => readText(path.join(repoRoot, relativePath)))
    .join("\n");

  assertPhrasesPresent(combinedText, REQUIRED_PHRASES);
  assertPhrasesAbsent(combinedText, FORBIDDEN_PHRASES);

  console.log("PASS: v7.0.1 License Hub after-purchase onboarding copy verified.");
}

main();
