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
  DEFAULT_THEME,
  getActiveTheme,
  readTheme,
  THEME_CHANGED_EVENT,
  type SiteTheme,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: SiteTheme;
  hasStoredTheme: boolean;
  refresh: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  hasStoredTheme: false,
  refresh: () => undefined,
});

export function useSiteTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<SiteTheme>(DEFAULT_THEME);

  const refresh = useCallback(() => {
    const next = getActiveTheme();
    setTheme(next);
    applyThemeToDocument(next);
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

  const value = useMemo(
    () => ({ theme, hasStoredTheme: readTheme() !== null, refresh }),
    [theme, refresh],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
