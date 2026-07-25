export type Environment = "development" | "staging" | "production";
export type Identifier = string;

export interface TenantContext {
  tenantId: Identifier;
  studioId?: Identifier;
  environment: Environment;
}

export interface PageRequest {
  page: number;
  size: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  traceId?: string;
}
