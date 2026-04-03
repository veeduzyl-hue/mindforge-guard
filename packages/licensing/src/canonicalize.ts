export type CanonicalJsonValue =
  | null
  | string
  | number
  | boolean
  | CanonicalJsonValue[]
  | { [key: string]: CanonicalJsonValue };

function canonicalizeValue(value: unknown): CanonicalJsonValue | undefined {
  if (typeof value === "undefined") {
    return undefined;
  }

  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => canonicalizeValue(item))
      .filter((item): item is CanonicalJsonValue => typeof item !== "undefined");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    const output: Record<string, CanonicalJsonValue> = {};
    for (const [key, entryValue] of entries) {
      const normalized = canonicalizeValue(entryValue);
      if (typeof normalized === "undefined") {
        continue;
      }
      output[key] = normalized;
    }
    return output;
  }

  return String(value);
}

export function canonicalizeJson(value: unknown): string {
  return JSON.stringify(canonicalizeValue(value));
}
