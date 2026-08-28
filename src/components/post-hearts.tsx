// src/components/post-hearts.tsx
// Pick a heart, then click anywhere on the page to drop it. Save is background.

"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

import { HeartMark } from "@/components/heart-mark";
import { setCursorHeart } from "@/lib/cursor-glyph";
import {
  HEART_PRESETS,
  HEARTS_PER_VISITOR,
  clampPercent,
  type HeartsPayload,
  type PlacedHeart,
} from "@/lib/hearts";
import { cn } from "@/lib/utils";

type PostHeartsProps = {
  postId: number;
  initial: HeartsPayload;
};

export function PostHearts({ postId, initial }: PostHeartsProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [hearts, setHearts] = useState<PlacedHeart[]>(initial.hearts);
  const [remaining, setRemaining] = useState(initial.remaining);
  const [color, setColor] = useState<string>(HEART_PRESETS[1]);
  const [placing, setPlacing] = useState(false);

  const canAdd = remaining > 0;

  useEffect(() => {
    if (!placing) {
      setCursorHeart(null);
      return;
    }

    setCursorHeart(color);
    return () => setCursorHeart(null);
  }, [placing, color]);

  useEffect(() => {
    if (!placing) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPlacing(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [placing]);

  async function dropHeartAt(x: number, y: number) {
    if (!canAdd) {
      return;
    }

    const localId = `local-${Date.now()}`;
    const optimistic: PlacedHeart = {
      id: localId,
      x,
      y,
      color,
      fresh: true,
    };

    setHearts((current) => [...current, optimistic]);
    const nextRemaining = Math.max(0, remaining - 1);
    setRemaining(nextRemaining);
    if (nextRemaining === 0) {
      setPlacing(false);
    }

    try {
      const response = await fetch("/api/hearts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          x,
          y,
          color,
        }),
      });
      const payload = (await response.json()) as HeartsPayload & { ok?: boolean };

      if (!response.ok || !payload.ok) {
        setHearts((current) => current.filter((heart) => heart.id !== localId));
        setRemaining((value) => Math.min(HEARTS_PER_VISITOR, value + 1));
        return;
      }

      if (typeof payload.remaining === "number") {
        setRemaining(payload.remaining);
        if (payload.remaining === 0) {
          setPlacing(false);
        }
      } else if (payload.canAdd === false) {
        setRemaining(0);
        setPlacing(false);
      }
    } catch {
      setHearts((current) => current.filter((heart) => heart.id !== localId));
      setRemaining((value) => Math.min(HEARTS_PER_VISITOR, value + 1));
    }
  }

  function onPlace(event: MouseEvent<HTMLButtonElement>) {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    const rect = stage.getBoundingClientRect();
    const x = clampPercent(((event.clientX - rect.left) / rect.width) * 100);
    const y = clampPercent(((event.clientY - rect.top) / rect.height) * 100);
    void dropHeartAt(x, y);
  }

  return (
    <div ref={stageRef} className="pointer-events-none absolute inset-0 z-[2]">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute"
          style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
        >
          <span
            className={cn(
              "block -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]",
              heart.fresh && "heart-sticker-pop",
            )}
          >
            <HeartMark color={heart.color} className="size-7 sm:size-8" />
          </span>
        </span>
      ))}

      {placing ? (
        <button
          type="button"
          className="heart-place-layer pointer-events-auto"
          aria-label="Tedd le valahova"
          onClick={onPlace}
        />
      ) : null}

      <div className="pointer-events-auto fixed right-3 bottom-3 z-[4] sm:right-5 sm:bottom-5">
        <div className="heart-composer">
          <div className="heart-composer-tray" role="group" aria-label="Szív színe">
            {HEART_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-label="Szín"
                aria-pressed={color === preset}
                className={cn(
                  "heart-swatch",
                  color === preset && "is-active",
                )}
                onClick={() => {
                  setColor(preset);
                  if (canAdd) {
                    setPlacing(true);
                  }
                }}
              >
                <HeartMark color={preset} className="size-5" />
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!canAdd}
            aria-pressed={placing}
            aria-label={
              !canAdd
                ? "Már raktál szívet"
                : placing
                  ? "Szív elhelyezés visszavonása"
                  : "Szív hozzáadása"
            }
            className={cn("heart-fab", placing && "is-placing")}
            onClick={() => {
              if (!canAdd) {
                return;
              }
              setPlacing((value) => !value);
            }}
          >
            <HeartMark color={canAdd ? color : "rgba(255,255,255,0.35)"} className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
