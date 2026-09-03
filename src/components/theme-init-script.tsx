// src/components/theme-init-script.tsx
// Inline script that applies saved theme before first paint to avoid flash.

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
  var DEFAULT_ID = "eredeti";

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

  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return;
    var theme = resolve(JSON.parse(raw));
    if (!theme) return;

    var root = document.documentElement;
    root.dataset.siteTheme = theme.id;
    root.style.setProperty("--site-bg", theme.bg);
    root.style.setProperty("--site-text", theme.text);
    root.style.setProperty("--site-show-bg-image", theme.showBackgroundImage ? "1" : "0");
    root.style.setProperty("--site-image-saturation", String(theme.imageSaturation));
    root.style.setProperty("--site-header-tone", isLight(theme.bg) ? "dark" : "light");

    [30, 40, 45, 55, 60, 65, 70, 78, 80, 85].forEach(function (opacity) {
      root.style.setProperty(
        "--site-text-" + opacity,
        textOpacity(theme.text, opacity / 100)
      );
    });

    var glow = hexToRgb(theme.text);
    var strength = isLight(theme.bg) ? 0 : 0.22;
    root.style.setProperty(
      "--site-text-glow",
      "0 0 6px rgba(" + glow.r + "," + glow.g + "," + glow.b + "," + strength + "), 0 0 14px rgba(" + glow.r + "," + glow.g + "," + glow.b + "," + (strength * 0.36) + ")"
    );
  } catch (e) {}
})();
`;

export function ThemeInitScript() {
  return <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />;
}
