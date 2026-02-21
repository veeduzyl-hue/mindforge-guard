import { execFileSync } from "node:child_process";

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

export function getHeadSha() {
  return git(["rev-parse", "HEAD"]);
}

export function getBranchName() {
  try {
    return git(["rev-parse", "--abbrev-ref", "HEAD"]);
  } catch {
    return "";
  }
}

export function getRepoRoot() {
  return git(["rev-parse", "--show-toplevel"]);
}

/**
 * Return numstat lines: "<added>\t<deleted>\t<path>"
 */
export function diffNumstat({ staged, base, head }) {
  const args = ["diff", "--numstat"];
  if (staged) args.push("--cached");
  if (base) args.push(base);
  if (head) args.push(head);
  const out = git(args);
  if (!out) return [];
  return out.split("\n").map((l) => l.trim()).filter(Boolean);
}

/**
 * Return changed paths: "<path>"
 * Used by Risk v1 Spread Risk (modules_touched).
 */
export function diffNameOnly({ staged, base, head }) {
  const args = ["diff", "--name-only"];
  if (staged) args.push("--cached");
  if (base) args.push(base);
  if (head) args.push(head);

  const out = git(args);
  if (!out) return [];

  return out
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((p) => p.replace(/\\/g, "/"));
}
