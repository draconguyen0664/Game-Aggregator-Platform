import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@game-aggregator/ui-web";
import { themeInitializationScript } from "@game-aggregator/ui-web/theme-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Platform Admin Portal | Game Aggregator",
  description: "Operate tenants, services, incidents, releases, and platform-wide access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="ga-theme" strategy="beforeInteractive">{themeInitializationScript}</Script>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
