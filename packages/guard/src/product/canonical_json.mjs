/**
 * Deterministic canonical JSON for signing/verifying.
 * - Objects: keys sorted lexicographically
 * - Arrays: order preserved
 * - Primitives: JSON native
 * - Undefined: omitted (like JSON.stringify)
 */

function isPlainObject(x) {
    return x !== null && typeof x === "object" && !Array.isArray(x);
  }
  
  function canonicalizeValue(v) {
    if (Array.isArray(v)) return v.map(canonicalizeValue);
    if (isPlainObject(v)) {
      const out = {};
      const keys = Object.keys(v).sort();
      for (const k of keys) {
        const val = v[k];
        if (typeof val === "undefined") continue;
        out[k] = canonicalizeValue(val);
      }
      return out;
    }
    return v;
  }
  
  export function canonicalJSONStringify(obj) {
    const canon = canonicalizeValue(obj);
    return JSON.stringify(canon);
  }
  
