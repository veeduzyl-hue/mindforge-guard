import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const PARSER_VERSION = "single_agent_governance_pack_parser_preview_v1";

const REQUIRED_FILES = [
  "manifest.json",
  "agent-profile.json",
  "task-scope.md",
  "action-boundary.yaml",
  "data-sources.yaml",
  "tools.yaml",
  "evidence/sample-output.json"
];

const RECOMMENDED_FILES = [
  "review-standards.md",
  "evidence/run-record.json",
  "snapshot.json"
];

const JSON_REQUIRED_FIELDS = {
  "manifest.json": [
    "pack_id",
    "pack_version",
    "pack_type",
    "created_at",
    "updated_at",
    "owner",
    "source_repo",
    "report_target"
  ],
  "agent-profile.json": [
    "agent_id",
    "agent_name",
    "agent_type",
    "business_owner",
    "technical_owner",
    "review_owner",
    "intended_users",
    "operating_context"
  ],
  "evidence/sample-output.json": [
    "sample_id",
    "input_summary",
    "output_summary",
    "output_artifact_ref",
    "expected_behavior",
    "observed_behavior",
    "reviewer_note"
  ],
  "evidence/run-record.json": [
    "run_id",
    "run_timestamp",
    "environment",
    "input_ref",
    "output_ref",
    "tool_calls_summary",
    "errors_or_warnings",
    "reviewer_observation"
  ],
  "snapshot.json": [
    "snapshot_id",
    "version",
    "commit_sha",
    "environment",
    "generated_at",
    "artifact_hashes",
    "comparison_baseline"
  ]
};

const YAML_REQUIRED_KEYS = {
  "action-boundary.yaml": [
    "allowed_actions",
    "prohibited_actions",
    "human_review_required",
    "escalation_required",
    "external_side_effects"
  ],
  "data-sources.yaml": [
    "data_sources",
    "data_source_id",
    "data_source_name",
    "data_category",
    "access_mode",
    "sensitivity_level",
    "retention_note",
    "usage_purpose"
  ],
  "tools.yaml": [
    "tools",
    "tool_id",
    "tool_name",
    "tool_type",
    "permitted_operations",
    "prohibited_operations",
    "requires_human_approval",
    "side_effect_level"
  ]
};

const TASK_SCOPE_SECTIONS = [
  "intended task:",
  "in-scope behavior:",
  "out-of-scope behavior:",
  "success criteria:",
  "known limitations:"
];

const REVIEW_STANDARDS_SECTIONS = [
  "review criteria:",
  "acceptance expectations:",
  "known policy references:",
  "reviewer notes:"
];

function normalizeText(text) {
  return text.replace(/\r\n/g, "\n");
}

function createSummary(packRoot) {
  return {
    parser_version: PARSER_VERSION,
    pack_path: packRoot,
    pack_identity: {},
    parsed_files: [],
    missing_files: [],
    malformed_files: [],
    required_field_gaps: [],
    optional_field_gaps: [],
    evidence_refs: [],
    owner_refs: [],
    action_boundary_summary: { present: false, visible_keys: [], allowed_action_count: 0, prohibited_action_count: 0 },
    data_source_summary: { present: false, visible_keys: [], data_source_count: 0 },
    tool_boundary_summary: { present: false, visible_keys: [], tool_count: 0 },
    sample_output_summary: { present: false },
    run_record_summary: { present: false },
    snapshot_summary: { present: false },
    omissions: [],
    limitations: [],
    parser_warnings: [],
    deterministic_pack_hash: ""
  };
}

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length >= 1))].sort();
}

function pushUnique(target, value) {
  if (typeof value === "string" && value.length >= 1 && !target.includes(value)) {
    target.push(value);
  }
}

function hasFile(rootDir, relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function readText(filePath) {
  return normalizeText(fs.readFileSync(filePath, "utf8"));
}

function safeReadJson(filePath) {
  return JSON.parse(readText(filePath));
}

function listRelativeFiles(rootDir) {
  const entries = [];
  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const nextPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(nextPath);
      } else {
        entries.push(path.relative(rootDir, nextPath).replace(/\\/g, "/"));
      }
    }
  }
  walk(rootDir);
  return entries.sort();
}

function stableHashForPack(rootDir) {
  const hash = crypto.createHash("sha256");
  for (const relativePath of listRelativeFiles(rootDir)) {
    hash.update(relativePath);
    hash.update("\n");
    hash.update(readText(path.join(rootDir, relativePath)));
    hash.update("\n");
  }
  return `sha256:${hash.digest("hex")}`;
}

function countYamlListItems(text, sectionName, itemIndent = 2) {
  const lines = text.split("\n");
  let inSection = false;
  let count = 0;
  const itemPattern = new RegExp(`^\\s{${itemIndent}}-\\s+`);
  for (const line of lines) {
    if (new RegExp(`^${sectionName}:\\s*$`).test(line.trim())) {
      inSection = true;
      continue;
    }
    if (inSection && /^[A-Za-z0-9_-]+:\s*/.test(line)) {
      break;
    }
    if (inSection && itemPattern.test(line)) {
      count += 1;
    }
  }
  return count;
}

function hasYamlKey(text, key) {
  return new RegExp(`(^|\\n)\\s*(-\\s*)?${key}:`, "m").test(text);
}

function addOmission(summary, message) {
  pushUnique(summary.omissions, message);
}

function addLimitation(summary, message) {
  pushUnique(summary.limitations, message);
}

function addWarning(summary, message) {
  pushUnique(summary.parser_warnings, message);
}

function addRequiredFieldGap(summary, relativePath, fieldName) {
  const gap = `${relativePath}: ${fieldName}`;
  pushUnique(summary.required_field_gaps, gap);
  addOmission(summary, `required field gap: ${gap}`);
}

function addOptionalFieldGap(summary, relativePath, fieldName) {
  const gap = `${relativePath}: ${fieldName}`;
  pushUnique(summary.optional_field_gaps, gap);
}

function validateJsonFields(summary, relativePath, value, requiredFields) {
  for (const fieldName of requiredFields) {
    if (!(fieldName in value)) {
      addRequiredFieldGap(summary, relativePath, fieldName);
    }
  }
}

function validateYamlKeys(summary, relativePath, text, requiredKeys) {
  for (const key of requiredKeys) {
    if (!hasYamlKey(text, key)) {
      addRequiredFieldGap(summary, relativePath, key);
    }
  }
}

function validateMarkdownSections(summary, relativePath, text, sections, emptyIsLimitation) {
  if (!text.trim()) {
    if (emptyIsLimitation) {
      addOptionalFieldGap(summary, relativePath, "non_empty_content");
      addLimitation(summary, `empty recommended markdown: ${relativePath}`);
    } else {
      addRequiredFieldGap(summary, relativePath, "non_empty_content");
    }
    return;
  }
  for (const section of sections) {
    if (!text.includes(section)) {
      if (emptyIsLimitation) {
        addOptionalFieldGap(summary, relativePath, section);
        addLimitation(summary, `recommended markdown section missing: ${relativePath}: ${section}`);
      } else {
        addRequiredFieldGap(summary, relativePath, section);
      }
    }
  }
}

function inspectLocalRef(summary, packRoot, relativePath, refValue) {
  if (typeof refValue !== "string" || refValue.length < 1) {
    return;
  }
  pushUnique(summary.evidence_refs, refValue);
  const refPath = refValue.split("#")[0];
  if (!refPath) {
    return;
  }
  if (path.isAbsolute(refPath) || refPath.startsWith("..")) {
    addWarning(summary, `suspicious local ref in ${relativePath}: ${refValue}`);
    return;
  }
  if (!hasFile(packRoot, refPath)) {
    addWarning(summary, `unverifiable local ref in ${relativePath}: ${refValue}`);
  }
}

function finalizeSummary(summary) {
  summary.parsed_files = uniqueSorted(summary.parsed_files);
  summary.missing_files = uniqueSorted(summary.missing_files);
  summary.malformed_files = uniqueSorted(summary.malformed_files);
  summary.required_field_gaps = uniqueSorted(summary.required_field_gaps);
  summary.optional_field_gaps = uniqueSorted(summary.optional_field_gaps);
  summary.evidence_refs = uniqueSorted(summary.evidence_refs);
  summary.owner_refs = uniqueSorted(summary.owner_refs);
  summary.omissions = uniqueSorted(summary.omissions);
  summary.limitations = uniqueSorted(summary.limitations);
  summary.parser_warnings = uniqueSorted(summary.parser_warnings);
  summary.action_boundary_summary.visible_keys = uniqueSorted(summary.action_boundary_summary.visible_keys);
  summary.data_source_summary.visible_keys = uniqueSorted(summary.data_source_summary.visible_keys);
  summary.tool_boundary_summary.visible_keys = uniqueSorted(summary.tool_boundary_summary.visible_keys);
  return summary;
}

export function parseSingleAgentGovernancePackPreview(packRoot, options = {}) {
  const resolvedPackRoot = path.resolve(packRoot);
  const summary = createSummary(resolvedPackRoot);

  if (!fs.existsSync(resolvedPackRoot) || !fs.statSync(resolvedPackRoot).isDirectory()) {
    throw new Error(`pack root must exist as a directory: ${resolvedPackRoot}`);
  }

  const expectedFiles = [...REQUIRED_FILES, ...RECOMMENDED_FILES];
  for (const relativePath of expectedFiles) {
    if (hasFile(resolvedPackRoot, relativePath)) {
      pushUnique(summary.parsed_files, relativePath);
    } else {
      pushUnique(summary.missing_files, relativePath);
      if (REQUIRED_FILES.includes(relativePath)) {
        addOmission(summary, `missing required file: ${relativePath}`);
      } else {
        addOptionalFieldGap(summary, relativePath, "missing_file");
        addLimitation(summary, `missing recommended file: ${relativePath}`);
      }
    }
  }

  const jsonFiles = [
    "manifest.json",
    "agent-profile.json",
    "evidence/sample-output.json",
    "evidence/run-record.json",
    "snapshot.json"
  ];
  const parsedJson = {};

  for (const relativePath of jsonFiles) {
    if (!hasFile(resolvedPackRoot, relativePath)) {
      continue;
    }
    try {
      parsedJson[relativePath] = safeReadJson(path.join(resolvedPackRoot, relativePath));
      validateJsonFields(summary, relativePath, parsedJson[relativePath], JSON_REQUIRED_FIELDS[relativePath]);
    } catch (error) {
      pushUnique(summary.malformed_files, relativePath);
      addOmission(summary, `malformed JSON: ${relativePath}`);
      addWarning(summary, `parser note: ${relativePath} could not be parsed (${error.message})`);
    }
  }

  const yamlFiles = ["action-boundary.yaml", "data-sources.yaml", "tools.yaml"];
  const yamlText = {};
  for (const relativePath of yamlFiles) {
    if (!hasFile(resolvedPackRoot, relativePath)) {
      continue;
    }
    yamlText[relativePath] = readText(path.join(resolvedPackRoot, relativePath));
    validateYamlKeys(summary, relativePath, yamlText[relativePath], YAML_REQUIRED_KEYS[relativePath]);
  }

  if (hasFile(resolvedPackRoot, "task-scope.md")) {
    validateMarkdownSections(
      summary,
      "task-scope.md",
      readText(path.join(resolvedPackRoot, "task-scope.md")),
      TASK_SCOPE_SECTIONS,
      false
    );
  }

  if (hasFile(resolvedPackRoot, "review-standards.md")) {
    validateMarkdownSections(
      summary,
      "review-standards.md",
      readText(path.join(resolvedPackRoot, "review-standards.md")),
      REVIEW_STANDARDS_SECTIONS,
      true
    );
  }

  const manifest = parsedJson["manifest.json"];
  if (manifest) {
    summary.pack_identity = {
      pack_id: manifest.pack_id ?? null,
      pack_version: manifest.pack_version ?? null,
      pack_type: manifest.pack_type ?? null,
      report_target: manifest.report_target ?? null,
      owner: manifest.owner ?? null
    };
    if (manifest.owner) {
      pushUnique(summary.owner_refs, manifest.owner);
    }
  }

  const agentProfile = parsedJson["agent-profile.json"];
  if (agentProfile) {
    for (const key of ["business_owner", "technical_owner", "review_owner"]) {
      if (agentProfile[key]) {
        pushUnique(summary.owner_refs, agentProfile[key]);
      }
    }
    if (!agentProfile.business_owner || !agentProfile.technical_owner || !agentProfile.review_owner) {
      addOmission(summary, "missing owner reference");
    }
  }

  if (yamlText["action-boundary.yaml"]) {
    summary.action_boundary_summary = {
      present: true,
      visible_keys: YAML_REQUIRED_KEYS["action-boundary.yaml"].filter((key) => hasYamlKey(yamlText["action-boundary.yaml"], key)),
      allowed_action_count: countYamlListItems(yamlText["action-boundary.yaml"], "allowed_actions"),
      prohibited_action_count: countYamlListItems(yamlText["action-boundary.yaml"], "prohibited_actions")
    };
  }

  if (yamlText["data-sources.yaml"]) {
    summary.data_source_summary = {
      present: true,
      visible_keys: YAML_REQUIRED_KEYS["data-sources.yaml"].filter((key) => hasYamlKey(yamlText["data-sources.yaml"], key)),
      data_source_count: countYamlListItems(yamlText["data-sources.yaml"], "data_sources", 2)
    };
  }

  if (yamlText["tools.yaml"]) {
    summary.tool_boundary_summary = {
      present: true,
      visible_keys: YAML_REQUIRED_KEYS["tools.yaml"].filter((key) => hasYamlKey(yamlText["tools.yaml"], key)),
      tool_count: countYamlListItems(yamlText["tools.yaml"], "tools", 2)
    };
  }

  const sampleOutput = parsedJson["evidence/sample-output.json"];
  if (sampleOutput) {
    summary.sample_output_summary = {
      present: true,
      sample_id: sampleOutput.sample_id ?? null,
      output_artifact_ref: sampleOutput.output_artifact_ref ?? null
    };
    inspectLocalRef(summary, resolvedPackRoot, "evidence/sample-output.json", sampleOutput.output_artifact_ref);
  } else {
    addOmission(summary, "missing sample output evidence");
  }

  const runRecord = parsedJson["evidence/run-record.json"];
  if (runRecord) {
    summary.run_record_summary = {
      present: true,
      run_id: runRecord.run_id ?? null,
      environment: runRecord.environment ?? null,
      tool_call_count: Array.isArray(runRecord.tool_calls_summary) ? runRecord.tool_calls_summary.length : 0
    };
    inspectLocalRef(summary, resolvedPackRoot, "evidence/run-record.json", runRecord.input_ref);
    inspectLocalRef(summary, resolvedPackRoot, "evidence/run-record.json", runRecord.output_ref);
  }

  const snapshot = parsedJson["snapshot.json"];
  if (snapshot) {
    summary.snapshot_summary = {
      present: true,
      snapshot_id: snapshot.snapshot_id ?? null,
      version: snapshot.version ?? null,
      artifact_hash_count: Array.isArray(snapshot.artifact_hashes) ? snapshot.artifact_hashes.length : 0
    };
  }

  summary.deterministic_pack_hash = stableHashForPack(resolvedPackRoot);
  return finalizeSummary(summary);
}
