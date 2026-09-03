// src/components/theme-provider.tsx
// Applies the saved site theme on navigation and listens for changes from /bg.

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  applyThemeToDocument,
  clearThemeFromDocument,
  readTheme,
  THEME_CHANGED_EVENT,
  type SiteTheme,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: SiteTheme | null;
  refresh: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: null,
  refresh: () => undefined,
});

export function useSiteTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<SiteTheme | null>(null);

  const refresh = useCallback(() => {
    const next = readTheme();
    setTheme(next);
    if (next) {
      applyThemeToDocument(next);
    } else {
      clearThemeFromDocument();
    }
  }, []);

  useEffect(() => {
    refresh();

    const onThemeChanged = () => refresh();
    window.addEventListener(THEME_CHANGED_EVENT, onThemeChanged);
    window.addEventListener("storage", onThemeChanged);

    return () => {
      window.removeEventListener(THEME_CHANGED_EVENT, onThemeChanged);
      window.removeEventListener("storage", onThemeChanged);
    };
  }, [refresh]);

  const value = useMemo(() => ({ theme, refresh }), [theme, refresh]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
