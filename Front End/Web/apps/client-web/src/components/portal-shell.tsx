"use client";
import { AppShell } from "@game-aggregator/ui-web";
import { BarChart3, Building2, Gamepad2, LayoutDashboard, Package, Rocket, Settings, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
const navigation = [
  { label: "Overview", href: "/", icon: <LayoutDashboard className="size-4"/>, active: true },
  { label: "Applications", href: "/#applications", icon: <Building2 className="size-4"/> },
  { label: "Entitlements", href: "/#entitlements", icon: <Gamepad2 className="size-4"/> },
  { label: "API keys", href: "/#api-keys", icon: <Package className="size-4"/> },
  { label: "Usage", href: "/#usage", icon: <Rocket className="size-4"/> },
  { label: "Webhooks", href: "/#webhooks", icon: <ShieldCheck className="size-4"/> },
  { label: "Environments", href: "/#environments", icon: <BarChart3 className="size-4"/> },
  { label: "Settings", href: "/#settings", icon: <Settings className="size-4"/> },
];
export function PortalShell({ children }: { children: ReactNode }) { return <AppShell portalLabel="Client workspace" navigation={navigation}>{children}</AppShell>; }