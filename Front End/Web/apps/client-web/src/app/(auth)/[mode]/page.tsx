import { notFound } from "next/navigation";
import { AuthScreen, type AuthScreenMode } from "@game-aggregator/auth";
const modes: AuthScreenMode[] = ["login", "forgot-password", "reset-password", "mfa", "session-expired", "tenant-selector", "unauthorized", "account-locked"];
export function generateStaticParams() { return modes.map(mode => ({ mode })); }
export default async function AuthPage({ params }: { params: Promise<{ mode: string }> }) { const { mode } = await params; if (!modes.includes(mode as AuthScreenMode)) notFound(); return <AuthScreen mode={mode as AuthScreenMode} portalName="Game Aggregator" portalLabel="Client Portal"/>; }