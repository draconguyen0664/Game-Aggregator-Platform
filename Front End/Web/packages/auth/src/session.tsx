"use client";
import { createContext, createElement, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { TenantContext } from "@game-aggregator/types";
export interface AuthSession { accessToken: string; expiresAt: number; userId: string; tenant: TenantContext; roles: string[]; permissions: string[]; }
export interface AuthContextValue { session: AuthSession | null; isAuthenticated: boolean; }
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children, session }: PropsWithChildren<{ session: AuthSession | null }>) { const value = useMemo(() => ({ session, isAuthenticated: session !== null }), [session]); return createElement(AuthContext.Provider, { value }, children); }
export function useAuth(): AuthContextValue { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within AuthProvider"); return context; }
export function createAuthorizationHeader(session: AuthSession | null) { return session ? { Authorization: `Bearer ${session.accessToken}` } : {}; }
export function clearBrowserSession() { sessionStorage.removeItem("ga_access_token"); sessionStorage.removeItem("ga_refresh_token"); }

export function BrowserAuthGuard({ children, apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/backend" }: PropsWithChildren<{ apiBaseUrl?: string }>) {
  const [state, setState] = useState<"checking" | "authenticated">("checking");
  useEffect(() => {
    const token = sessionStorage.getItem("ga_access_token");
    if (!token) { window.location.assign("/login"); return; }
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/auth/me`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("SESSION_INVALID"); setState("authenticated"); })
      .catch(error => { if (error instanceof DOMException && error.name === "AbortError") return; clearBrowserSession(); window.location.assign("/session-expired"); });
    return () => controller.abort();
  }, [apiBaseUrl]);
  if (state !== "authenticated") return <main className="grid min-h-dvh place-items-center bg-[var(--ga-background)]"><div className="grid justify-items-center gap-3"><span className="size-9 animate-spin rounded-full border-2 border-[var(--ga-border)] border-t-[var(--ga-primary)]"/><p className="text-sm text-[var(--ga-muted-foreground)]">Checking your secure sessionÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦</p></div></main>;
  return children;
}