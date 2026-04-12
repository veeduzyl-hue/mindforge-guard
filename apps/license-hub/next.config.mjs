import { fileURLToPath } from "node:url";

const nextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL("../../", import.meta.url)),
  outputFileTracingIncludes: {
    "/*": ["../../packages/db/generated/client/**/*"],
    "/api/**/*": ["../../packages/db/generated/client/**/*"],
  },
  transpilePackages: ["@mindforge/db", "@mindforge/licensing"],
};

export default nextConfig;
