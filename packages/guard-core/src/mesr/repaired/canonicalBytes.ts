import { createHash } from "node:crypto";

export class CanonicalInputError extends Error {}

export function compareCodePoints(left: string, right: string): number {
  const a = Array.from(left, c => c.codePointAt(0)!);
  const b = Array.from(right, c => c.codePointAt(0)!);
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i];
  return a.length - b.length;
}

/** Full JSON representation: no coercion, getters, holes, cycles or hidden keys. */
export function canonicalJson(value: unknown): string {
  const ancestors = new Set<object>();
  function encode(item: unknown): string {
    if (item === null || typeof item === "string" || typeof item === "boolean") return JSON.stringify(item);
    if (typeof item === "number" && Number.isFinite(item)) return JSON.stringify(item);
    if (typeof item !== "object" || item === null) throw new CanonicalInputError("Non-JSON value");
    if (ancestors.has(item)) throw new CanonicalInputError("Cyclic JSON value");
    const array = Array.isArray(item);
    if (!array && Object.getPrototypeOf(item) !== Object.prototype && Object.getPrototypeOf(item) !== null) throw new CanonicalInputError("Non-JSON prototype");
    const properties = Object.getOwnPropertyDescriptors(item);
    if (Reflect.ownKeys(item).some(key => typeof key !== "string")) throw new CanonicalInputError("Symbol key");
    for (const [key, descriptor] of Object.entries(properties)) {
      if (array && key === "length") continue;
      if (!("value" in descriptor) || !descriptor.enumerable) throw new CanonicalInputError("Non-data JSON property");
    }
    ancestors.add(item);
    let result: string;
    if (array) {
      if (Object.keys(item).length !== item.length || Object.keys(item).some((key, i) => key !== String(i))) throw new CanonicalInputError("Sparse/decorated array");
      result = `[${item.map(encode).join(",")}]`;
    } else {
      result = `{${Object.keys(properties).sort(compareCodePoints).map(key => `${JSON.stringify(key)}:${encode(properties[key].value)}`).join(",")}}`;
    }
    ancestors.delete(item);
    return result;
  }
  return encode(value);
}

export const sha256Bytes = (bytes: string | Uint8Array): string => createHash("sha256").update(bytes).digest("hex");
export const contentDigest = (value: unknown): string => sha256Bytes(canonicalJson(value));

/** Parse exact JSON text, rejecting duplicate decoded keys before JSON.parse can erase them. */
export function parseExactJson(text: string): unknown {
  let offset = 0;
  const invalid = (): never => { throw new CanonicalInputError("Invalid or duplicate-key JSON"); };
  const whitespace = () => { while (/[\x20\t\r\n]/.test(text[offset] ?? "\0")) offset++; };
  const stringToken = (): string => {
    const match = /^"(?:[^\u0022\\\x00-\x1f]|\\(?:[\u0022\\/bfnrt]|u[0-9a-fA-F]{4}))*"/.exec(text.slice(offset));
    if (!match) return invalid();
    offset += match[0].length;
    return JSON.parse(match[0]);
  };
  const value = (): void => {
    whitespace();
    if (text[offset] === "{") {
      offset++; whitespace();
      const keys = new Set<string>();
      if (text[offset] === "}") { offset++; return; }
      for (;;) {
        whitespace(); const key = stringToken();
        if (keys.has(key)) invalid();
        keys.add(key); whitespace();
        if (text[offset++] !== ":") invalid();
        value(); whitespace();
        const separator = text[offset++];
        if (separator === "}") return;
        if (separator !== ",") invalid();
      }
    }
    if (text[offset] === "[") {
      offset++; whitespace();
      if (text[offset] === "]") { offset++; return; }
      for (;;) {
        value(); whitespace();
        const separator = text[offset++];
        if (separator === "]") return;
        if (separator !== ",") invalid();
      }
    }
    if (text[offset] === '"') { stringToken(); return; }
    const primitive = /^(?:null|true|false|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)/.exec(text.slice(offset));
    if (!primitive) invalid();
    offset += primitive![0].length;
  };
  value(); whitespace();
  if (offset !== text.length) invalid();
  const parsed = JSON.parse(text);
  canonicalJson(parsed);
  return parsed;
}
