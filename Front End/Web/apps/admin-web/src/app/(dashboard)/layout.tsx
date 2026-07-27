import { BrowserAuthGuard } from "@game-aggregator/auth";
import { PortalShell } from "../../components/portal-shell";
export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <BrowserAuthGuard><PortalShell>{children}</PortalShell></BrowserAuthGuard>; }