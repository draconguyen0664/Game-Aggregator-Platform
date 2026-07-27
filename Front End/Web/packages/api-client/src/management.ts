"use client";

import { managementApiBaseUrl, managementEndpoints } from "./index";

export interface ApiEnvelope<T> { success: boolean; data: T; meta?: { requestId?: string } }
export interface Entity { id: string; name?: string; title?: string; slug?: string; status?: string; createdAt?: string; [key: string]: unknown }
export interface AdminData { studios: Entity[]; publishers: Entity[]; clients: Entity[]; games: Entity[]; versions: Entity[]; builds: Entity[]; releases: Entity[]; deployments: Entity[]; apiKeys: Entity[]; contracts: Entity[]; ledger: Entity[]; revenueRules: Entity[]; invoices: Entity[]; incidents: Entity[]; auditLogs: Entity[]; }
function token() { return typeof window === "undefined" ? null : sessionStorage.getItem("ga_access_token"); }
export async function managementRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${managementApiBaseUrl}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(token() ? { Authorization: `Bearer ${token()}` } : {}), ...init?.headers } });
  if (!response.ok) { const body = await response.json().catch(() => null) as { error?: { message?: string } } | null; throw new Error(body?.error?.message ?? `Request failed with status ${response.status}`); }
  if (response.status === 204) return undefined as T;
  return ((await response.json()) as ApiEnvelope<T>).data;
}
export const adminApi = {
  list: {
    studios: () => managementRequest<Entity[]>(managementEndpoints.studios), publishers: () => managementRequest<Entity[]>(managementEndpoints.publishers),
    clients: () => managementRequest<Entity[]>(`${managementEndpoints.clients}/organizations`), games: () => managementRequest<Entity[]>(managementEndpoints.games), versions: () => managementRequest<Entity[]>(managementEndpoints.versions), builds: () => managementRequest<Entity[]>(managementEndpoints.builds), releases: () => managementRequest<Entity[]>(managementEndpoints.releases), deployments: () => managementRequest<Entity[]>(managementEndpoints.deployments),
    apiKeys: () => managementRequest<Entity[]>(managementEndpoints.apiKeys), contracts: () => managementRequest<Entity[]>(managementEndpoints.contracts),
    revenueRules: () => managementRequest<Entity[]>(managementEndpoints.revenueRules), ledger: () => managementRequest<Entity[]>(`${managementEndpoints.ledger}/transactions`), invoices: () => managementRequest<Entity[]>(`${managementEndpoints.billing}/reports/invoices`),
    incidents: () => managementRequest<Entity[]>(managementEndpoints.incidents), auditLogs: async () => (await managementRequest<{ content: Entity[] }>(managementEndpoints.auditLogs)).content,
  },
  create: (path: string, payload: unknown) => managementRequest<Entity>(path, { method: "POST", body: JSON.stringify(payload) }),
  update: (path: string, payload: unknown) => managementRequest<Entity>(path, { method: "PUT", body: JSON.stringify(payload) }),
  action: (path: string, payload?: unknown) => managementRequest<Entity>(path, { method: "POST", body: payload === undefined ? undefined : JSON.stringify(payload) }),
  remove: (path: string) => managementRequest<void>(path, { method: "DELETE" }),
};