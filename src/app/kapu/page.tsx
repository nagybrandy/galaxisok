// src/app/kapu/page.tsx
// Styled password screen. Same fonts and layout chrome as the rest of the site.

import { unlock } from "./actions";

type KapuPageProps = {
  searchParams: Promise<{ hiba?: string }>;
};

export default async function KapuPage({ searchParams }: KapuPageProps) {
  const { hiba } = await searchParams;

  return (
    <main className="relative z-[1] flex min-h-dvh flex-col items-center justify-center px-6 text-white">
      <p className="mb-10 font-[family-name:var(--font-display)] text-lg tracking-[0.38em] text-glow uppercase">
        Galaxisok
      </p>
      <form
        action={unlock}
        className="flex w-full max-w-sm flex-col gap-5 rounded-md border border-white/15 bg-white/5 px-6 py-8 backdrop-blur-sm"
      >
        <label
          className="text-center text-[11px] tracking-[0.28em] text-white/70 uppercase"
          htmlFor="password"
        >
          Jelszó
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          autoComplete="current-password"
          className="h-12 rounded-sm border border-white/25 bg-black/40 px-4 text-center text-base tracking-[0.2em] text-white outline-none ring-white/30 placeholder:text-white/30 focus:border-white focus:ring-2"
        />
        {hiba ? (
          <p className="text-center text-sm text-red-300">Hibás jelszó.</p>
        ) : null}
        <button
          type="submit"
          className="h-11 rounded-sm bg-white text-[11px] font-medium tracking-[0.28em] text-black uppercase hover:bg-white/90"
        >
          Belépés
        </button>
      </form>
    </main>
  );
}
