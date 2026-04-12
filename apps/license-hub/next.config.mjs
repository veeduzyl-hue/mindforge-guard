import { fileURLToPath } from "node:url";

const nextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL("../../", import.meta.url)),
  transpilePackages: ["@mindforge/db", "@mindforge/licensing"],
};

export default nextConfig;
