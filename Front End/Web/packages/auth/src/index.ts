"use client";

import {
  createContext,
  createElement,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import type { TenantContext } from "@game-aggregator/types";

export interface AuthSession {
  accessToken: string;
  expiresAt: number;
  userId: string;
  tenant: TenantContext;
  roles: string[];
}

export interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  session,
}: PropsWithChildren<{ session: AuthSession | null }>) {
  const value = useMemo(
    () => ({ session, isAuthenticated: session !== null }),
    [session],
  );
  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function createAuthorizationHeader(session: AuthSession | null) {
  return session ? { Authorization: `Bearer ${session.accessToken}` } : {};
}
