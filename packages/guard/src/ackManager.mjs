import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

function repoRoot() {
  return process.cwd();
}

function nowIso() {
  return new Date().toISOString();
}

function yyyymm(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function stableStringify(obj) {
  const sorter = (x) => {
    if (Array.isArray(x)) return x.map(sorter);
    if (x && typeof x === "object") {
      return Object.keys(x)
        .sort()
        .reduce((acc, k) => {
          acc[k] = sorter(x[k]);
          return acc;
        }, {});
    }
    return x;
  };
  return JSON.stringify(sorter(obj));
}

export function getStagedTreeHash() {
  try {
    return execSync("git write-tree", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString("utf8")
      .trim();
  } catch {
    return "";
  }
}

function acksBaseDir() {
  return path.join(repoRoot(), ".mindforge", "acks");
}

function ackMonthDir() {
  return path.join(acksBaseDir(), yyyymm());
}

function listAckFilesAllMonths() {
  const base = acksBaseDir();
  if (!fs.existsSync(base)) return [];

  const months = fs
    .readdirSync(base)
    .map((x) => path.join(base, x))
    .filter((p) => {
      try {
        return fs.statSync(p).isDirectory();
      } catch {
        return false;
      }
    });

  const files = [];
  for (const d of months) {
    for (const f of fs.readdirSync(d)) {
      if (f.endsWith(".json")) files.push(path.join(d, f));
    }
  }

  return files;
}

export function hasAckForTree(tree) {
  if (!tree) return false;

  for (const f of listAckFilesAllMonths()) {
    const j = readJsonSafe(f);
    if (j && j.kind === "staged_ack" && j.staged_tree === tree) {
      return true;
    }
  }

  return false;
}

export function writeAckForTree(tree, reason = "") {
  const dir = ackMonthDir();
  ensureDir(dir);

  const ts = nowIso();
  const file = path.join(
    dir,
    `ack_${ts.replace(/[:.]/g, "-")}.json`
  );

  const payload = {
    kind: "staged_ack",
    ts,
    actor: "local",
    scope: "git.staged",
    staged_tree: tree,
    reason: String(reason || ""),
  };

  fs.writeFileSync(file, stableStringify(payload) + "\n", "utf8");

  return { file, payload };
}
