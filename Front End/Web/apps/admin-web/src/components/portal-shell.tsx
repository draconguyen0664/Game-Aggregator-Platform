"use client";
import { AppShell } from "@game-aggregator/ui-web";
import { BarChart3, Building2, Gamepad2, LayoutDashboard, Settings, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
const navigation = [
  { label: "Overview", href: "/", icon: <LayoutDashboard className="size-4"/>, active: true },
  { label: "Organizations", href: "/#organizations", icon: <Building2 className="size-4"/> },

  { label: "Games", href: "/#games", icon: <Gamepad2 className="size-4"/> },
  { label: "API keys", href: "/#api-keys", icon: <ShieldCheck className="size-4"/> },
  { label: "Operations", href: "/#operations", icon: <BarChart3 className="size-4"/> },
  { label: "Finance", href: "/#finance", icon: <Settings className="size-4"/> },
];
export function PortalShell({ children }: { children: ReactNode }) { return <AppShell portalLabel="Platform operations" navigation={navigation}>{children}</AppShell>; }