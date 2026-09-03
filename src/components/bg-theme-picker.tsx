// src/components/bg-theme-picker.tsx
// Theme preview and picker for /bg — presets, custom colors, copy-to-clipboard.

"use client";

import { useCallback, useState } from "react";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { useSiteTheme } from "@/components/theme-provider";
import {
  clearTheme,
  formatThemeCopy,
  THEME_PRESETS,
  writeTheme,
  type SiteTheme,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

function ThemeCard({
  theme,
  active,
  onSelect,
}: {
  theme: SiteTheme;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex flex-col overflow-hidden rounded-sm border text-left transition-colors",
        active
          ? "border-white/50 ring-1 ring-white/30"
          : "border-white/15 hover:border-white/35",
      )}
    >
      <div
        className="flex h-24 items-center justify-center px-4"
        style={{ backgroundColor: theme.bg, color: theme.text }}
      >
        <span className="font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase">
          Galaxisok
        </span>
      </div>
      <div className="space-y-1 bg-black/30 px-4 py-3">
        <p className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.16em] uppercase">
          {theme.name}
        </p>
        <p className="text-xs leading-5 text-white/55">{theme.description}</p>
        <p className="font-mono text-[10px] text-white/40">
          {theme.bg} · {theme.text}
        </p>
      </div>
    </button>
  );
}

export function BgThemePicker() {
  const { theme: activeTheme, refresh } = useSiteTheme();
  const [customBg, setCustomBg] = useState(activeTheme?.bg ?? "#0c246e");
  const [customText, setCustomText] = useState(activeTheme?.text ?? "#f5f7ff");
  const [copied, setCopied] = useState(false);

  const applyTheme = useCallback(
    (theme: SiteTheme) => {
      writeTheme(theme);
      refresh();
      if (theme.id === "custom") {
        setCustomBg(theme.bg);
        setCustomText(theme.text);
      }
    },
    [refresh],
  );

  const handleCopy = async () => {
    const message = formatThemeCopy(customBg, customText);
    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCustom = () => {
    applyTheme({
      id: "custom",
      name: "Egyéni",
      description: "Saját háttér- és szövegszín.",
      bg: customBg,
      text: customText,
      showBackgroundImage: false,
      imageSaturation: 1,
    });
  };

  return (
    <PageShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8">
        <h1 className="page-title page-title-section text-glow">Háttér · Témák</h1>
        <p className="mt-6 max-w-xl font-[family-name:var(--font-fuse)] text-sm leading-7 text-white/60">
          Válassz egy előre beállított témát, vagy állíts be saját színeket. A választás
          elmentődik — bármelyik oldalon kipróbálhatod, majd visszatérhetsz ide.
        </p>

        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.22em] text-white/70 uppercase">
            Előre beállított témák
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {THEME_PRESETS.map((preset) => (
              <ThemeCard
                key={preset.id}
                theme={preset}
                active={activeTheme?.id === preset.id}
                onSelect={() => applyTheme(preset)}
              />
            ))}
          </div>
          {activeTheme ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                clearTheme();
                refresh();
              }}
              className="mt-4 h-10 rounded-sm border-white/25 bg-transparent px-5 text-[11px] tracking-[0.2em] text-white uppercase hover:bg-white/10 hover:text-white"
            >
              Vissza az eredeti háttérképhez
            </Button>
          ) : null}
        </section>

        <section className="mt-12 border-t border-white/10 pt-10">
          <h2 className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.22em] text-white/70 uppercase">
            Egyéni színek
          </h2>
          <p className="mt-3 text-sm text-white/55">
            Állíts be bármilyen háttér- és szövegszínt, majd másold ki az értékeket.
          </p>

          <div
            className="mt-6 rounded-sm border border-white/15 p-6"
            style={{ backgroundColor: customBg, color: customText }}
          >
            <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] uppercase">
              Előnézet
            </p>
            <p className="mt-3 font-[family-name:var(--font-fuse)] text-sm leading-7 opacity-80">
              Ez egy példaszöveg a Galaxisok oldalon. Így néz ki a választott
              háttér és szövegszín kombinációja.
            </p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.18em] text-white/60 uppercase">
                Háttérszín
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customBg}
                  onChange={(event) => setCustomBg(event.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-sm border border-white/20 bg-transparent"
                />
                <input
                  type="text"
                  value={customBg}
                  onChange={(event) => setCustomBg(event.target.value)}
                  className="h-10 flex-1 border border-white/20 bg-transparent px-3 font-mono text-sm text-white outline-none focus:border-white/50"
                  spellCheck={false}
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.18em] text-white/60 uppercase">
                Szövegszín
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customText}
                  onChange={(event) => setCustomText(event.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-sm border border-white/20 bg-transparent"
                />
                <input
                  type="text"
                  value={customText}
                  onChange={(event) => setCustomText(event.target.value)}
                  className="h-10 flex-1 border border-white/20 bg-transparent px-3 font-mono text-sm text-white outline-none focus:border-white/50"
                  spellCheck={false}
                />
              </div>
            </label>
          </div>

          <pre className="mt-6 overflow-x-auto rounded-sm border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-white/70">
            {formatThemeCopy(customBg, customText)}
          </pre>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleApplyCustom}
              className="h-10 rounded-sm px-5 text-[11px] tracking-[0.2em] uppercase"
            >
              Alkalmaz
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="h-10 rounded-sm border-white/25 bg-transparent px-5 text-[11px] tracking-[0.2em] text-white uppercase hover:bg-white/10 hover:text-white"
            >
              {copied ? "Másolva!" : "Másolás"}
            </Button>
          </div>
        </section>

        <p className="mt-12 text-xs text-white/40">
          Aktív téma:{" "}
          <span className="font-mono text-white/60">
            {activeTheme
              ? `${activeTheme.name} (${activeTheme.bg} / ${activeTheme.text})`
              : "Nincs mentve — az eredeti háttérkép aktív"}
          </span>
        </p>
      </main>
    </PageShell>
  );
}
