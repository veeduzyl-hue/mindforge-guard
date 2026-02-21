import fs from "node:fs";
import path from "node:path";
import { sha256File } from "./hash.mjs";

export function getDefaultPolicyPath(repoRoot = process.cwd()) {
  return path.join(repoRoot, ".mindforge", "config", "policy.json");
}

/**
 * Load policy from repo-local .mindforge/config/policy.json
 * - On success: returns policy with __policy_hash and __policy_path attached.
 * - On missing file: throws Error with code "MF_POLICY_MISSING" and policy_path set.
 */
export async function loadPolicy(opts = {}) {
  const repoRoot = opts.repoRoot || process.cwd();
  const policyPath = opts.policyPath || getDefaultPolicyPath(repoRoot);

  try {
    const raw = fs.readFileSync(policyPath, "utf8");
    const policy = JSON.parse(raw);
    const policy_hash = await sha256File(policyPath);

    policy.__policy_hash = policy_hash;
    policy.__policy_path = policyPath;
    return policy;
  } catch (err) {
    if (err && err.code === "ENOENT") {
      const e = new Error("policy_missing");
      e.code = "MF_POLICY_MISSING";
      e.policy_path = policyPath;
      throw e;
    }
    throw err;
  }
}
