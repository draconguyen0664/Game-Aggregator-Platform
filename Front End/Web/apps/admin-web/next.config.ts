import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const service = (name: string, fallback: string) => process.env[`BACKEND_${name}_URL`] ?? fallback;
const routes = [
  ["/backend/auth/:path*", service("AUTH", "http://127.0.0.1:8081") + "/auth/:path*"],
  ["/backend/tenants/:path*", service("TENANT", "http://127.0.0.1:8082") + "/tenants/:path*"],
  ["/backend/authorization/:path*", service("AUTHORIZATION", "http://127.0.0.1:8083") + "/authorization/:path*"],
  ["/backend/api/v1/studios/:path*", service("STUDIO", "http://127.0.0.1:8084") + "/api/v1/studios/:path*"],
  ["/backend/api/v1/publishers/:path*", service("PUBLISHER", "http://127.0.0.1:8086") + "/api/v1/publishers/:path*"],
  ["/backend/api/v1/clients/:path*", service("CLIENT", "http://127.0.0.1:8087") + "/api/v1/clients/:path*"],
  ["/backend/api/v1/games/:path*", service("GAME", "http://127.0.0.1:8088") + "/api/v1/games/:path*"],
  ["/backend/api/v1/taxonomies/:path*", service("GAME", "http://127.0.0.1:8088") + "/api/v1/taxonomies/:path*"],
  ["/backend/api/v1/game-media/:path*", service("GAME_MEDIA", "http://127.0.0.1:8089") + "/api/v1/game-media/:path*"],
  ["/backend/api/v1/entitlements/:path*", service("ENTITLEMENT", "http://127.0.0.1:8090") + "/api/v1/entitlements/:path*"],
  ["/backend/api-keys/:path*", service("API_KEY", "http://127.0.0.1:8091") + "/api-keys/:path*"],
  ["/backend/api/v1/versions/:path*", service("VERSION", "http://127.0.0.1:8092") + "/api/v1/versions/:path*"],
  ["/backend/api/v1/builds/:path*", service("BUILD", "http://127.0.0.1:8093") + "/api/v1/builds/:path*"],
  ["/backend/api/v1/releases/:path*", service("RELEASE", "http://127.0.0.1:8094") + "/api/v1/releases/:path*"],
  ["/backend/api/v1/deployments/:path*", service("DEPLOYMENT", "http://127.0.0.1:8095") + "/api/v1/deployments/:path*"],
  ["/backend/api/v1/contracts/:path*", service("CONTRACT", "http://127.0.0.1:8096") + "/api/v1/contracts/:path*"],
  ["/backend/api/v1/revenue-rules/:path*", service("REVENUE", "http://127.0.0.1:8097") + "/api/v1/revenue-rules/:path*"],
  ["/backend/api/v1/ledger/:path*", service("LEDGER", "http://127.0.0.1:8098") + "/api/v1/ledger/:path*"],
  ["/backend/api/v1/billing/:path*", service("BILLING", "http://127.0.0.1:8099") + "/api/v1/billing/:path*"],
  ["/backend/api/v1/webhooks/:path*", service("WEBHOOK", "http://127.0.0.1:8100") + "/api/v1/webhooks/:path*"],
  ["/backend/api/v1/audit-logs/:path*", service("AUDIT", "http://127.0.0.1:8101") + "/api/v1/audit-logs/:path*"],
  ["/backend/api/v1/incidents/:path*", service("INCIDENT", "http://127.0.0.1:8102") + "/api/v1/incidents/:path*"],
  ["/backend/api/v1/feature-flags/:path*", service("FEATURE_FLAG", "http://127.0.0.1:8103") + "/api/v1/feature-flags/:path*"],
] as const;

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  turbopack: { root: fileURLToPath(new URL("../..", import.meta.url)) },
  transpilePackages: ["@game-aggregator/api-client", "@game-aggregator/auth", "@game-aggregator/design-tokens", "@game-aggregator/types", "@game-aggregator/ui-web", "@game-aggregator/validation"],
  async rewrites() { return routes.map(([source, destination]) => ({ source, destination })); },
};
export default nextConfig;