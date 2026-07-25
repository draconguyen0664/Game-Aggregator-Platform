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
