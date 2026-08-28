// src/lib/cursor-glyph.ts
// Social hover and the heart tool share the custom cursor lens.

"use client";

import { useEffect, useState } from "react";

import { type SocialKind } from "@/lib/socials";

export type CursorGlyph =
  | { kind: "heart"; color: string }
  | { kind: SocialKind }
  | null;

type GlyphState = {
  hover: SocialKind | null;
  heartColor: string | null;
};

let state: GlyphState = { hover: null, heartColor: null };
const listeners = new Set<(next: CursorGlyph) => void>();

function resolved(next: GlyphState): CursorGlyph {
  if (next.heartColor) {
    return { kind: "heart", color: next.heartColor };
  }
  if (next.hover) {
    return { kind: next.hover };
  }
  return null;
}

function emit() {
  const glyph = resolved(state);
  for (const listener of listeners) {
    listener(glyph);
  }
}

export function setCursorHover(kind: SocialKind | null) {
  state = { ...state, hover: kind };
  emit();
}

export function setCursorHeart(color: string | null) {
  state = { ...state, heartColor: color };
  emit();
}

export function useCursorGlyph(): CursorGlyph {
  const [value, setValue] = useState<CursorGlyph>(() => resolved(state));

  useEffect(() => {
    listeners.add(setValue);
    return () => {
      listeners.delete(setValue);
    };
  }, []);

  return value;
}
