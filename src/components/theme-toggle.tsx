// src/components/theme-toggle.tsx
// Switches between the paper and navy themes and remembers the visitor's choice.

"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type SiteTheme = "light" | "dark";

const THEME_STORAGE_KEY = "galaxisok-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<SiteTheme>("light");

  useEffect(() => {
    const currentTheme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const frame = window.requestAnimationFrame(() => setTheme(currentTheme));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const nextTheme: SiteTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  const nextThemeLabel = theme === "dark" ? "világos" : "sötét";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Váltás ${nextThemeLabel} témára`}
      aria-pressed={theme === "dark"}
      title={`Váltás ${nextThemeLabel} témára`}
      onClick={toggleTheme}
    >
      <Sun className="theme-toggle-sun" aria-hidden />
      <Moon className="theme-toggle-moon" aria-hidden />
    </button>
  );
}
