import createClient, { type Middleware } from "openapi-fetch";
import createQueryClient from "openapi-react-query";
import type { paths } from "./generated/schema";

export interface ApiClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | null | Promise<string | null>;
  tenantId?: string;
}

export function createApiClient(options: ApiClientOptions) {
  const client = createClient<paths>({ baseUrl: options.baseUrl });
  const authMiddleware: Middleware = {
    async onRequest({ request }) {
      const token = await options.getAccessToken?.();
      if (token) request.headers.set("Authorization", `Bearer ${token}`);
      if (options.tenantId) {
        request.headers.set("X-Tenant-Id", options.tenantId);
      }
      return request;
    },
  };
  client.use(authMiddleware);
  return client;
}

export type ApiClient = ReturnType<typeof createApiClient>;

export function createApiQueryClient(client: ApiClient) {
  return createQueryClient(client);
}

export type { paths } from "./generated/schema";

/** Same-origin management API base used by the web portals. */
export const managementApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/backend";

export const managementEndpoints = {
  auth: "/auth", tenants: "/tenants", authorization: "/authorization",
  studios: "/api/v1/studios", publishers: "/api/v1/publishers", clients: "/api/v1/clients",
  games: "/api/v1/games", taxonomies: "/api/v1/taxonomies", gameMedia: "/api/v1/game-media",
  entitlements: "/api/v1/entitlements", apiKeys: "/api-keys", versions: "/api/v1/versions",
  builds: "/api/v1/builds", releases: "/api/v1/releases", deployments: "/api/v1/deployments",
  contracts: "/api/v1/contracts", revenueRules: "/api/v1/revenue-rules", ledger: "/api/v1/ledger",
  billing: "/api/v1/billing", webhooks: "/api/v1/webhooks", auditLogs: "/api/v1/audit-logs",
  incidents: "/api/v1/incidents", featureFlags: "/api/v1/feature-flags",
} as const;

export function createManagementApiClient(options: Omit<ApiClientOptions, "baseUrl"> = {}) {
  return createApiClient({ ...options, baseUrl: managementApiBaseUrl });
}
export * from "./management";
