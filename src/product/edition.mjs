export function normalizeEdition(v) {
  if (v === "community" || v === "pro" || v === "enterprise") return v;
  return "community";
}

export function normalizeTier(v) {
  if (v === "community" || v === "pro" || v === "enterprise") return v;
  return "community";
}

export function allowedTiersForEdition(edition) {
  switch (edition) {
    case "community":
      return ["community"];
    case "pro":
      return ["community", "pro"];
    case "enterprise":
      return ["community", "pro", "enterprise"];
    default:
      return ["community"];
  }
}
