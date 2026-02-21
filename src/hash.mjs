import fs from "node:fs";
import { createHash } from "node:crypto";

export async function sha256File(filePath) {
  const data = fs.readFileSync(filePath);
  const h = createHash("sha256");
  h.update(data);
  return h.digest("hex");
}
