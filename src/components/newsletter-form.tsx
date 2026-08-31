// src/components/newsletter-form.tsx
// Email field plus a required ÁSZF accept, so subscribe cannot skip the terms.

"use client";

import Link from "next/link";
import { useState } from "react";

import { EmbedGate } from "@/components/embed-gate";

type NewsletterFormProps = {
  embedUrl?: string;
};

export function NewsletterForm({ embedUrl }: NewsletterFormProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <form
      className="mt-8 w-full text-left"
      action={embedUrl && accepted ? undefined : "#"}
      method="post"
      onSubmit={(event) => {
        if (!accepted) {
          event.preventDefault();
        }
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="email@cim.hu"
          className="h-12 flex-1 border border-white/20 bg-transparent px-4 text-center text-white outline-none placeholder:text-white/30 focus:border-white"
        />
        <button
          type="submit"
          className="h-12 bg-white px-6 text-[11px] tracking-[0.24em] text-[#050b1c] uppercase hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!accepted}
        >
          Feliratkozom
        </button>
      </div>
      <label className="mt-4 flex items-start gap-2.5 text-[11px] leading-5 text-white/55">
        <input
          type="checkbox"
          name="aszf"
          required
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-0.5 size-3.5 shrink-0 accent-white"
        />
        <span>Elfogadom az ÁSZF-et és az adatkezelési tájékoztatót.</span>
      </label>
      <p className="mt-2 text-[11px] leading-5 tracking-[0.04em] text-white/45">
        A feliratkozáshoz el kell fogadnod az{" "}
        <Link href="/aszf" className="text-white/70 underline underline-offset-4 hover:text-white">
          ÁSZF
        </Link>
        -et és az{" "}
        <Link
          href="/adatkezeles"
          className="text-white/70 underline underline-offset-4 hover:text-white"
        >
          adatkezelési tájékoztatót
        </Link>
        .
      </p>
      {embedUrl && accepted ? (
        <div className="mt-8">
          <EmbedGate label="hírlevél">
            <iframe
              title="Galaxisok hírlevél feliratkozás"
              src={embedUrl}
              className="h-[420px] w-full border border-white/10 bg-transparent"
            />
          </EmbedGate>
        </div>
      ) : null}
    </form>
  );
}
