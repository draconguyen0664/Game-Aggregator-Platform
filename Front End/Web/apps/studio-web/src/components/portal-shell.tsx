"use client";
import { AppShell } from "@game-aggregator/ui-web";
import { BarChart3, Building2, Gamepad2, LayoutDashboard, Package, Rocket, Settings, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
const navigation = [
  { label: "Overview", href: "/", icon: <LayoutDashboard className="size-4"/>, active: true },
  { label: "Games", href: "/#projects", icon: <Building2 className="size-4"/> },
  { label: "Builds", href: "/#projects", icon: <Gamepad2 className="size-4"/> },
  { label: "Releases", href: "/#projects", icon: <Package className="size-4"/> },
  { label: "Media", href: "/#projects", icon: <Rocket className="size-4"/> },
  { label: "Team", href: "/#team", icon: <ShieldCheck className="size-4"/> },
  { label: "Analytics", href: "/#analytics", icon: <BarChart3 className="size-4"/> },
  { label: "Settings", href: "/#integration", icon: <Settings className="size-4"/> },
];
export function PortalShell({ children }: { children: ReactNode }) { return <AppShell portalLabel="Studio workspace" navigation={navigation}>{children}</AppShell>; }