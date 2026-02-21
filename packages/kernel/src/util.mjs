// .mindforge/runtime/lib/util.mjs
import fs from "node:fs";
import path from "node:path";
import { randomBytes, randomUUID } from "node:crypto";

export function parseArgs(argv) {
  const args = {};
  for (const a of argv) {
    if (a.startsWith("--") && a.includes("=")) {
      const [k, v] = a.slice(2).split("=");
      args[k] = v;
    } else if (a.startsWith("--")) {
      args[a.slice(2)] = true;
    }
  }
  return args;
}

export function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

export function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, "utf8");
}

export function nowIso() {
  return new Date().toISOString();
}

/**
 * Stable UUID generator for Node 16+.
 * - Prefer crypto.randomUUID() when available (Node 16.7+).
 * - Fallback to 16-byte random hex (collision-resistant for our use).
 */
export function uuid() {
  try {
    if (typeof randomUUID === "function") return randomUUID();
  } catch {
    // ignore and fallback
  }
  return randomBytes(16).toString("hex");
}

export function exitWith(code) {
  process.exit(code);
}
// --- v0.11 additions (non-breaking) ---
export function readJson(p) {
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

/**
 * Atomic write (best effort):
 * write to temp file then rename.
 */
export function writeFileAtomic(p, content) {
  ensureDir(path.dirname(p));
  const dir = path.dirname(p);
  const base = path.basename(p);
  const tmp = path.join(dir, `.${base}.${Date.now()}.tmp`);
  fs.writeFileSync(tmp, content, "utf8");
  fs.renameSync(tmp, p);
}
