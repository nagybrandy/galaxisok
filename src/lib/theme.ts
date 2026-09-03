// src/lib/theme.ts
// Site-wide background and text color themes. Persisted in localStorage.

export const THEME_STORAGE_KEY = "galaxisok_site_theme";
export const THEME_CHANGED_EVENT = "galaxisok:theme-changed";

export type ThemePresetId =
  | "kek"
  | "negativ"
  | "pasztell"
  | "ejszaka"
  | "kontraszt"
  | "meleg"
  | "eredeti"
  | "custom";

export type SiteTheme = {
  id: ThemePresetId;
  name: string;
  description: string;
  bg: string;
  text: string;
  showBackgroundImage: boolean;
  imageSaturation: number;
};

export const THEME_PRESETS: SiteTheme[] = [
  {
    id: "kek",
    name: "Kék",
    description: "Egyszínű kék, a háttérkép domináns kékjéből.",
    bg: "#0c246e",
    text: "#f5f7ff",
    showBackgroundImage: false,
    imageSaturation: 1,
  },
  {
    id: "negativ",
    name: "Negatív",
    description: "Világos háttér, sötét kék szöveg — a kék téma fordítottja.",
    bg: "#eef2fc",
    text: "#0c246e",
    showBackgroundImage: false,
    imageSaturation: 1,
  },
  {
    id: "pasztell",
    name: "Pasztell",
    description: "Lágy, halvány kék-lila tónusok.",
    bg: "#d4dff5",
    text: "#2a3d66",
    showBackgroundImage: false,
    imageSaturation: 1,
  },
  {
    id: "ejszaka",
    name: "Éjszaka",
    description: "Mély tengerészkék, kép nélkül — tiszta, olvasható.",
    bg: "#050b1c",
    text: "#f5f7ff",
    showBackgroundImage: false,
    imageSaturation: 1,
  },
  {
    id: "kontraszt",
    name: "Kontraszt",
    description: "Tiszta fekete háttér, fehér szöveg — maximális olvashatóság.",
    bg: "#000000",
    text: "#ffffff",
    showBackgroundImage: false,
    imageSaturation: 1,
  },
  {
    id: "meleg",
    name: "Meleg alkonyat",
    description: "Meleg, sötét bordó-navy — albumhangulat, kép nélkül.",
    bg: "#1a1218",
    text: "#faf5f0",
    showBackgroundImage: false,
    imageSaturation: 1,
  },
  {
    id: "eredeti",
    name: "Eredeti (halványított)",
    description: "A jelenlegi háttérkép, csökkentett szaturációval az olvashatóságért.",
    bg: "#050b1c",
    text: "#f5f7ff",
    showBackgroundImage: true,
    imageSaturation: 0.55,
  },
];

export const DEFAULT_THEME: SiteTheme = THEME_PRESETS.find(
  (preset) => preset.id === "eredeti",
)!;

type StoredTheme = {
  id: ThemePresetId;
  bg?: string;
  text?: string;
};

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

export function isLightColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}

export function textWithOpacity(hex: string, opacity: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function resolveTheme(stored: StoredTheme | null): SiteTheme {
  if (!stored) {
    return DEFAULT_THEME;
  }

  if (stored.id === "custom" && stored.bg && stored.text) {
    return {
      id: "custom",
      name: "Egyéni",
      description: "Saját háttér- és szövegszín.",
      bg: stored.bg,
      text: stored.text,
      showBackgroundImage: false,
      imageSaturation: 1,
    };
  }

  const preset = THEME_PRESETS.find((item) => item.id === stored.id);
  return preset ?? DEFAULT_THEME;
}

export function readTheme(): SiteTheme | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredTheme;
    return resolveTheme(parsed);
  } catch {
    return null;
  }
}

export function clearThemeFromDocument(): void {
  const root = document.documentElement;
  delete root.dataset.siteTheme;

  const properties = [
    "--site-bg",
    "--site-text",
    "--site-show-bg-image",
    "--site-image-saturation",
    "--site-header-tone",
    "--site-text-glow",
    "--site-text-30",
    "--site-text-40",
    "--site-text-45",
    "--site-text-55",
    "--site-text-60",
    "--site-text-65",
    "--site-text-70",
    "--site-text-78",
    "--site-text-80",
    "--site-text-85",
  ];

  for (const property of properties) {
    root.style.removeProperty(property);
  }
}

export function writeTheme(theme: SiteTheme): void {
  const stored: StoredTheme = {
    id: theme.id,
    ...(theme.id === "custom" ? { bg: theme.bg, text: theme.text } : {}),
  };

  window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(stored));
  window.dispatchEvent(new Event(THEME_CHANGED_EVENT));
}

export function clearTheme(): void {
  window.localStorage.removeItem(THEME_STORAGE_KEY);
  window.dispatchEvent(new Event(THEME_CHANGED_EVENT));
}

export function formatThemeCopy(bg: string, text: string): string {
  return `bg: ${bg}\ntext: ${text}`;
}

export function applyThemeToDocument(theme: SiteTheme): void {
  const root = document.documentElement;

  root.dataset.siteTheme = theme.id;
  root.style.setProperty("--site-bg", theme.bg);
  root.style.setProperty("--site-text", theme.text);
  root.style.setProperty(
    "--site-show-bg-image",
    theme.showBackgroundImage ? "1" : "0",
  );
  root.style.setProperty("--site-image-saturation", String(theme.imageSaturation));
  root.style.setProperty(
    "--site-header-tone",
    isLightColor(theme.bg) ? "dark" : "light",
  );

  const opacities = [30, 40, 45, 55, 60, 65, 70, 78, 80, 85] as const;
  for (const opacity of opacities) {
    root.style.setProperty(
      `--site-text-${opacity}`,
      textWithOpacity(theme.text, opacity / 100),
    );
  }

  const glowRgb = hexToRgb(theme.text);
  const glowStrength = isLightColor(theme.bg) ? 0 : 0.22;
  root.style.setProperty(
    "--site-text-glow",
    `0 0 6px rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glowStrength}), 0 0 14px rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glowStrength * 0.36})`,
  );
}
