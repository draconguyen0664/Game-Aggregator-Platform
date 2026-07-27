"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { Select, cn } from "./primitives";
import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY } from "./theme-config";

export type ThemePreference = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function resolveTheme(theme: ThemePreference): ResolvedTheme {
  if (theme !== "system") return theme;
  return window.matchMedia(THEME_MEDIA_QUERY).matches ? "dark" : "light";
}

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = isThemePreference(savedTheme) ? savedTheme : "system";
    const initialResolved = resolveTheme(initialTheme);
    setThemeState(initialTheme);
    setResolvedTheme(initialResolved);
    applyTheme(initialResolved);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(THEME_MEDIA_QUERY);
    const updateSystemTheme = () => {
      if (theme !== "system") return;
      const nextTheme = media.matches ? "dark" : "light";
      setResolvedTheme(nextTheme);
      applyTheme(nextTheme);
    };
    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, [theme]);

  const setTheme = (nextTheme: ThemePreference) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    const nextResolved = resolveTheme(nextTheme);
    setThemeState(nextTheme);
    setResolvedTheme(nextResolved);
    applyTheme(nextResolved);
  };

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

const themeOptions = [
  { label: "Light", value: "light", description: "Always use light colors" },
  { label: "Dark", value: "dark", description: "Always use dark colors" },
  { label: "System", value: "system", description: "Match this device" },
];

export function ThemeSwitcher({ className, showLabel = false }: { className?: string; showLabel?: boolean }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const Icon = theme === "system" ? Laptop : resolvedTheme === "dark" ? Moon : Sun;
  return <div className={cn("flex items-center gap-2", className)}>
    <Icon className="size-4 shrink-0 text-[var(--ga-muted-foreground)]" aria-hidden="true" />
    <Select ariaLabel="Color theme" value={theme} onValueChange={(value) => setTheme(value as ThemePreference)} options={themeOptions} size="sm" className={showLabel ? "min-w-32" : "w-24"} triggerClassName={showLabel ? "w-32" : "w-24"} />
  </div>;
}
