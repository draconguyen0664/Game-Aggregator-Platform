"use client";
import { AppShell } from "@game-aggregator/ui-web";
import { BarChart3, Building2, Gamepad2, LayoutDashboard, Package, Rocket, Settings, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
const navigation = [
  { label: "Overview", href: "/", icon: <LayoutDashboard className="size-4"/>, active: true },
  { label: "Tenants", href: "/#tenants", icon: <Building2 className="size-4"/> },
  { label: "Studios", href: "/#studios", icon: <Gamepad2 className="size-4"/> },
  { label: "Clients", href: "/#clients", icon: <Package className="size-4"/> },
  { label: "Games", href: "/#games", icon: <Rocket className="size-4"/> },
  { label: "Releases", href: "/#releases", icon: <ShieldCheck className="size-4"/> },
  { label: "Incidents", href: "/#incidents", icon: <BarChart3 className="size-4"/>, badge: "3" },
  { label: "Audit log", href: "/#audit-log", icon: <Settings className="size-4"/> },
];
export function PortalShell({ children }: { children: ReactNode }) { return <AppShell portalLabel="Platform operations" navigation={navigation}>{children}</AppShell>; }