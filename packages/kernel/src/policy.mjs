import fs from "node:fs";
import path from "node:path";
import { sha256File } from "./hash.mjs";

const POLICY_PATH = path.join(process.cwd(), ".mindforge", "config", "policy.json");

export async function loadPolicy() {
  const raw = fs.readFileSync(POLICY_PATH, "utf8");
  const policy = JSON.parse(raw);
  const policy_hash = await sha256File(POLICY_PATH);
  policy.__policy_hash = policy_hash;
  policy.__policy_path = POLICY_PATH;
  return policy;
}
