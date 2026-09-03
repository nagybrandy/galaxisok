// src/components/theme-init-script.tsx
// Inline script that applies saved theme (or Holdfény default) before first paint.

import { THEME_PRESETS, THEME_STORAGE_KEY } from "@/lib/theme";

const PRESET_DATA = THEME_PRESETS.map((preset) => ({
  id: preset.id,
  bg: preset.bg,
  text: preset.text,
  showBackgroundImage: preset.showBackgroundImage,
  imageSaturation: preset.imageSaturation,
}));

const INIT_SCRIPT = `
(function () {
  var KEY = ${JSON.stringify(THEME_STORAGE_KEY)};
  var PRESETS = ${JSON.stringify(PRESET_DATA)};
  var DEFAULT_ID = "holdfeny";

  function hexToRgb(hex) {
    var n = hex.replace("#", "");
    if (n.length === 3) {
      n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2];
    }
    return {
      r: parseInt(n.slice(0, 2), 16),
      g: parseInt(n.slice(2, 4), 16),
      b: parseInt(n.slice(4, 6), 16),
    };
  }

  function isLight(hex) {
    var c = hexToRgb(hex);
    return (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255 > 0.55;
  }

  function textOpacity(hex, opacity) {
    var c = hexToRgb(hex);
    return "rgba(" + c.r + "," + c.g + "," + c.b + "," + opacity + ")";
  }

  function resolve(stored) {
    if (!stored) return PRESETS.find(function (p) { return p.id === DEFAULT_ID; });
    if (stored.id === "custom" && stored.bg && stored.text) {
      return {
        id: "custom",
        bg: stored.bg,
        text: stored.text,
        showBackgroundImage: false,
        imageSaturation: 1,
      };
    }
    return PRESETS.find(function (p) { return p.id === stored.id; }) ||
      PRESETS.find(function (p) { return p.id === DEFAULT_ID; });
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    var light = isLight(theme.bg);

    root.dataset.siteTheme = theme.id;
    if (light) {
      root.dataset.siteLight = "true";
    } else {
      delete root.dataset.siteLight;
    }

    root.style.setProperty("--site-bg", theme.bg);
    root.style.setProperty("--site-text", theme.text);
    root.style.setProperty("--site-show-bg-image", theme.showBackgroundImage ? "1" : "0");
    root.style.setProperty("--site-image-saturation", String(theme.imageSaturation));
    root.style.setProperty("--site-header-tone", light ? "dark" : "light");

    [8, 10, 18, 20, 22, 25, 28, 30, 40, 45, 50, 52, 55, 60, 65, 70, 72, 78, 80, 82, 85, 88].forEach(function (opacity) {
      root.style.setProperty(
        "--site-text-" + opacity,
        textOpacity(theme.text, opacity / 100)
      );
    });

    root.style.setProperty("--background", theme.bg);
    root.style.setProperty("--foreground", theme.text);
    root.style.setProperty("--card", theme.bg);
    root.style.setProperty("--card-foreground", theme.text);
    root.style.setProperty("--muted-foreground", textOpacity(theme.text, 0.55));
    root.style.setProperty("--border", textOpacity(theme.text, 0.12));
    root.style.setProperty("--input", textOpacity(theme.text, 0.16));
    root.style.setProperty("--primary", light ? theme.text : "#ffffff");
    root.style.setProperty("--primary-foreground", theme.bg);
    root.style.setProperty("--site-text-glow", light ? "none" : (
      "0 0 6px rgba(" + hexToRgb(theme.text).r + "," + hexToRgb(theme.text).g + "," + hexToRgb(theme.text).b + ",0.22), 0 0 14px rgba(" + hexToRgb(theme.text).r + "," + hexToRgb(theme.text).g + "," + hexToRgb(theme.text).b + ",0.08)"
    ));
  }

  try {
    var raw = localStorage.getItem(KEY);
    var theme = resolve(raw ? JSON.parse(raw) : null);
    if (!theme) return;
    applyTheme(theme);
  } catch (e) {}
})();
`;

export function ThemeInitScript() {
  return <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />;
}
