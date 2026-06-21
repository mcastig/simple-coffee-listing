import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "coffee-theme";

/**
 * Resolve the initial theme: an explicit stored choice wins; otherwise fall
 * back to the OS preference. Mirrors the inline boot script in index.html
 * (which sets `data-theme` before paint to avoid a flash of wrong theme).
 */
const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
};

interface UseThemeResult {
  theme: Theme;
  toggleTheme: () => void;
}

/** Owns the active theme, syncs it to the DOM root and to localStorage. */
export const useTheme = (): UseThemeResult => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    [],
  );

  return { theme, toggleTheme };
};
