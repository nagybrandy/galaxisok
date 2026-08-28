// src/lib/hearts.ts
// Heart stickers live in the article padding. Two per visitor, quietly.

export type PlacedHeart = {
  id: string;
  x: number;
  y: number;
  color: string;
  fresh?: boolean;
};

export type HeartsPayload = {
  hearts: PlacedHeart[];
  canAdd: boolean;
  remaining: number;
};

export const HEART_PRESETS = [
  "#ffffff",
  "#ff6b8a",
  "#ff2d55",
  "#ffd166",
  "#7dd3fc",
  "#c4b5fd",
  "#86efac",
] as const;

export const HEARTS_PER_VISITOR = 2;

export function isHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 50;
  }
  return Math.min(98, Math.max(2, value));
}
