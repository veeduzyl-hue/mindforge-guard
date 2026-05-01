import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function parseJsonOutput(result, label) {
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    fail(`${label} must output valid JSON (${error.message})`);
  }
}

function walk(value, visit) {
  visit(value);
  if (Array.isArray(value)) {
    for (const entry of value) walk(entry, visit);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      visit(key);
      walk(entry, visit);
    }
  }
}

function expectNoForbiddenFields(value, label) {
  const forbiddenKeys = new Set([
    "admit",
    "deny",
    "defer",
    "commitment_candidate",
    "commitment_receipt",
    "commit_gate",
    "deployment_gate",
    "deployment_approval",
    "permit_gate",
    "risk_acceptance",
    "regulatory_reporting",
    "means_motive_opportunity",
    "insider_threat",
    "runtime_enforcement",
  ]);
  const forbiddenValues = new Set(["admit", "deny", "defer"]);

  walk(value, (entry) => {
    if (typeof entry === "string" && forbiddenValues.has(entry)) {
      throw new Error(`${label} contains forbidden string value ${entry}`);
    }
    if (typeof entry === "string" && forbiddenKeys.has(entry)) {
      throw new Error(`${label} contains forbidden field ${entry}`);
    }
  });
}

function expectEvidenceAdequacy(evidenceAdequacy, label) {
  expect(evidenceAdequacy.supporting_only === true, `${label} supporting_only mismatch`);
  expect(evidenceAdequacy.authoritative === false, `${label} authoritative mismatch`);
  expect(evidenceAdequacy.creates_permission === false, `${label} creates_permission mismatch`);
  expect(evidenceAdequacy.changes_authority === false, `${label} changes_authority mismatch`);
  expect(
    evidenceAdequacy.changes_exit_semantics === false,
    `${label} changes_exit_semantics mismatch`
  );
  expect(
    evidenceAdequacy.evidence_records_explicit === true,
    `${label} evidence_records_explicit mismatch`
  );
  expect(Array.isArray(evidenceAdequacy.omissions), `${label} omissions missing`);
  expect(Array.isArray(evidenceAdequacy.uncertainty_notes), `${label} uncertainty_notes missing`);
  expect(
    Array.isArray(evidenceAdequacy.contrary_artifact_refs),
    `${label} contrary_artifact_refs missing`
  );
  for (const [index, omission] of evidenceAdequacy.omissions.entries()) {
    expect(
      typeof omission.reason === "string" && omission.reason.length > 0,
      `${label} omission ${index} must include a reason`
    );
  }
  for (const [index, note] of evidenceAdequacy.uncertainty_notes.entries()) {
    expect(
      note.supporting_metadata_only === true,
      `${label} uncertainty note ${index} must remain supporting metadata only`
    );
  }
  for (const [index, artifactRef] of evidenceAdequacy.contrary_artifact_refs.entries()) {
    expect(
      artifactRef.supporting_artifact_only === true,
      `${label} contrary artifact ${index} must remain supporting-only`
    );
  }
}

async function expectPassScript(scriptPath, expectedStdout) {
  const absolutePath = path.join(repoRoot, scriptPath);
  const originalStdoutWrite = process.stdout.write.bind(process.stdout);
  const originalStderrWrite = process.stderr.write.bind(process.stderr);
  const originalExit = process.exit;

  let stdout = "";
  let stderr = "";

  process.stdout.write = ((chunk, encoding, callback) => {
    stdout += typeof chunk === "string" ? chunk : chunk.toString(encoding);
    if (typeof callback === "function") callback();
    return true;
  });
  process.stderr.write = ((chunk, encoding, callback) => {
    stderr += typeof chunk === "string" ? chunk : chunk.toString(encoding);
    if (typeof callback === "function") callback();
    return true;
  });
  process.exit = ((code) => {
    throw new Error(`__PROCESS_EXIT__${code ?? 0}`);
  });

  try {
    await import(`${pathToFileURL(absolutePath).href}?acceptance=${Date.now()}-${Math.random()}`);
  } catch (error) {
    if (typeof error?.message === "string" && error.message.startsWith("__PROCESS_EXIT__")) {
      fail(`${scriptPath} should not call process.exit on success`);
    }
    fail(`${scriptPath} failed: ${stderr || error.message}`);
  } finally {
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;
    process.exit = originalExit;
  }

  expect(stdout === expectedStdout, `${scriptPath} stdout mismatch`);
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function createEvidenceAdequacyVariant() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-grounding-acceptance-"));
  const variantPath = path.join(tempRoot, "grounded-evidence-adequacy-variant.json");
  const groundedFixture = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "fixtures", "grounding", "grounding-boundary.grounded.valid.json"),
      "utf8"
    )
  );

  const variantFixture = structuredClone(groundedFixture);
  variantFixture.evidence_adequacy.uncertainty_notes = [
    {
      note_id: "uncertainty-acceptance-001",
      summary: "A supporting-only uncertainty note was added to prove deterministic hash sensitivity.",
      supporting_metadata_only: true,
    },
  ];
  variantFixture.evidence_adequacy.adequacy_explanation =
    "Evidence adequacy remains supporting-only while recording an explicit uncertainty note for acceptance verification.";

  writeJson(variantPath, variantFixture);
  return { tempRoot, variantPath };
}

const { runGuard } = await import("../packages/guard/src/runGuard.mjs");

async function runGroundingExplain(args) {
  return runGuard({
    argv: ["grounding", "explain", ...args],
  });
}

async function main() {
  await expectPassScript(
    "scripts/verify_v6_16_grounding_explain_preview.mjs",
    "grounding explain preview verified\n"
  );

  const groundedFirst = await runGroundingExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/grounding/grounding-boundary.grounded.valid.json",
  ]);
  expect(groundedFirst.exitCode === 0, "grounded explain should exit 0");
  expect(groundedFirst.exitCode !== 21, "grounded explain must not use exit 21");
  expect(groundedFirst.exitCode !== 25, "grounded explain must not use exit 25");
  const groundedFirstPayload = parseJsonOutput(groundedFirst, "grounded explain");
  expectEvidenceAdequacy(groundedFirstPayload.evidence_adequacy, "grounded explain evidence_adequacy");
  expectNoForbiddenFields(groundedFirstPayload, "grounded explain payload");

  const groundedSecond = await runGroundingExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/grounding/grounding-boundary.grounded.valid.json",
  ]);
  expect(groundedSecond.exitCode === 0, "repeat grounded explain should exit 0");
  const groundedSecondPayload = parseJsonOutput(groundedSecond, "repeat grounded explain");
  expect(
    groundedFirstPayload.hashes.evidence_hash === groundedSecondPayload.hashes.evidence_hash,
    "grounded evidence_hash must be stable"
  );
  expect(
    groundedFirstPayload.hashes.source_hash === groundedSecondPayload.hashes.source_hash,
    "grounded source_hash must be stable"
  );
  expect(
    groundedFirstPayload.hashes.provenance_hash === groundedSecondPayload.hashes.provenance_hash,
    "grounded provenance_hash must be stable"
  );
  expect(
    groundedFirstPayload.hashes.deterministic_hash === groundedSecondPayload.hashes.deterministic_hash,
    "grounded deterministic_hash must be stable"
  );

  const partial = await runGroundingExplain([
    "--preview",
    "--json",
    "--fixture-file",
    "fixtures/grounding/grounding-boundary.partially-grounded.valid.json",
  ]);
  expect(partial.exitCode === 0, "partially_grounded explain should exit 0");
  expect(partial.exitCode !== 21, "partially_grounded explain must not use exit 21");
  expect(partial.exitCode !== 25, "partially_grounded explain must not use exit 25");
  const partialPayload = parseJsonOutput(partial, "partially_grounded explain");
  expectEvidenceAdequacy(partialPayload.evidence_adequacy, "partially_grounded evidence_adequacy");
  expectNoForbiddenFields(partialPayload, "partially_grounded payload");

  const { tempRoot, variantPath } = createEvidenceAdequacyVariant();

  try {
    const variant = await runGroundingExplain([
      "--preview",
      "--json",
      "--fixture-file",
      variantPath,
    ]);
    expect(variant.exitCode === 0, "evidence_adequacy variant should exit 0");
    const variantPayload = parseJsonOutput(variant, "evidence_adequacy variant");
    expectEvidenceAdequacy(variantPayload.evidence_adequacy, "variant evidence_adequacy");
    expectNoForbiddenFields(variantPayload, "variant payload");
    expect(
      groundedFirstPayload.hashes.evidence_hash === variantPayload.hashes.evidence_hash,
      "evidence_hash must stay stable when only evidence_adequacy changes"
    );
    expect(
      groundedFirstPayload.hashes.source_hash === variantPayload.hashes.source_hash,
      "source_hash must stay stable when only evidence_adequacy changes"
    );
    expect(
      groundedFirstPayload.hashes.provenance_hash === variantPayload.hashes.provenance_hash,
      "provenance_hash must stay stable when only evidence_adequacy changes"
    );
    expect(
      groundedFirstPayload.hashes.deterministic_hash !== variantPayload.hashes.deterministic_hash,
      "deterministic_hash must change when evidence_adequacy changes"
    );
    expect(
      groundedFirstPayload.hashes.deterministic_hash.startsWith("sha256:") &&
        variantPayload.hashes.deterministic_hash.startsWith("sha256:"),
      "deterministic_hash must stay sha256-prefixed"
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  process.stdout.write("PASS verify_v6_16_grounding_explain_acceptance\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
