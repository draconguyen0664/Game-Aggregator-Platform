export const THEME_STORAGE_KEY = "ga_theme";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const themeInitializationScript = `(() => {
  try {
    const saved = localStorage.getItem("${THEME_STORAGE_KEY}");
    const preference = saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
    const resolved = preference === "system"
      ? (matchMedia("${THEME_MEDIA_QUERY}").matches ? "dark" : "light")
      : preference;
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.style.colorScheme = resolved;
    document.documentElement.dataset.theme = resolved;
  } catch (_) {}
})();`;
