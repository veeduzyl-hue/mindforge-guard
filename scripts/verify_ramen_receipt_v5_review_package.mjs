import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { RAMEN_V5_BASELINE_SHA } from "../experiments/ramen-receipt-v5/verify-ramen-v5.mjs";

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function runVerifyRamenV5(repoRoot) {
  const command = process.platform === "win32" ? "npm.cmd run verify:ramen-v5" : "npm run verify:ramen-v5";
  const output = execSync(command, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
  });

  expect(output.includes("PASS: ramen receipt v5 conformance verified."), "verify:ramen-v5 output missing PASS marker");
  return output;
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "..");

  const requiredFiles = [
    path.join(repoRoot, "docs", "adapters", "ramen-receipt-v5-adapter-spec.md"),
    path.join(repoRoot, "docs", "adapters", "ramen-receipt-v5-formal-review.md"),
    path.join(repoRoot, "experiments", "ramen-receipt-v5", "fixtures", "ramen-v5-conformance.json"),
    path.join(repoRoot, "experiments", "ramen-receipt-v5", "verify-ramen-v5.mjs"),
    path.join(repoRoot, "scripts", "verify_ramen_receipt_v5_conformance.mjs"),
    path.join(repoRoot, "experiments", "ramen-receipt-v5", "artifacts", "verify-ramen-v5-output.txt"),
    path.join(repoRoot, "experiments", "ramen-receipt-v5", "artifacts", "sample-findings-allowed.json"),
    path.join(repoRoot, "experiments", "ramen-receipt-v5", "artifacts", "sample-findings-blocked.json"),
    path.join(repoRoot, "experiments", "ramen-receipt-v5", "artifacts", "sample-findings-steered.json"),
  ];

  for (const filePath of requiredFiles) {
    expect(fs.existsSync(filePath), `required review package file missing: ${path.relative(repoRoot, filePath)}`);
  }

  const specText = readText(path.join(repoRoot, "docs", "adapters", "ramen-receipt-v5-adapter-spec.md"));
  const reviewText = readText(path.join(repoRoot, "docs", "adapters", "ramen-receipt-v5-formal-review.md"));

  expect(reviewText.includes(RAMEN_V5_BASELINE_SHA), "formal review must include frozen baseline SHA");
  expect(
    reviewText.includes("https://gist.github.com/veeduzyl-hue/2ce98f6186ec4fa4e4cfe0af0b886541"),
    "formal review must include Secret Gist link"
  );

  for (const phrase of [
    "policy_content_immutability",
    "execution_binding",
    "legal_applicability",
    "not_provided",
    "not_verified",
  ]) {
    expect(
      specText.includes(phrase) || reviewText.includes(phrase),
      `spec or formal review must include phrase: ${phrase}`
    );
  }

  const verifyOutput = runVerifyRamenV5(repoRoot);

  const summary = {
    baseline_sha: RAMEN_V5_BASELINE_SHA,
    verify_ramen_v5_passed: true,
    verify_output_lines: verifyOutput.trim().split(/\r?\n/).length,
    review_package_ready: true,
  };

  console.log(JSON.stringify(summary, null, 2));
  console.log("PASS: ramen receipt v5 review package verified.");
}

main();
