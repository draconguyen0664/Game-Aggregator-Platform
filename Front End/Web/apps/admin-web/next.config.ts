import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  turbopack: {
    root: fileURLToPath(new URL("../..", import.meta.url)),
  },
  transpilePackages: [
    "@game-aggregator/api-client",
    "@game-aggregator/auth",
    "@game-aggregator/design-tokens",
    "@game-aggregator/types",
    "@game-aggregator/ui-web",
    "@game-aggregator/validation",
  ],
};

export default nextConfig;
