// src/components/post-hearts.tsx
// Collapsed heart chip. Hover opens colors; click places on the article.

"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

import { HeartMark } from "@/components/heart-mark";
import { setCursorHeart } from "@/lib/cursor-glyph";
import {
  HEART_PRESETS,
  HEARTS_PER_VISITOR,
  clampPercent,
  parseHeartsPayload,
  type PlacedHeart,
} from "@/lib/hearts";
import { cn } from "@/lib/utils";

type PostHeartsProps = {
  postId: number;
};

export function PostHearts({ postId }: PostHeartsProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [hearts, setHearts] = useState<PlacedHeart[]>([]);
  const [remaining, setRemaining] = useState(HEARTS_PER_VISITOR);
  const [color, setColor] = useState<string>(HEART_PRESETS[1]);
  const [placing, setPlacing] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/hearts?postId=${postId}`)
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) {
          return;
        }
        const payload = parseHeartsPayload(data);
        setHearts(payload.hearts);
        setRemaining(payload.remaining);
      })
      .catch(() => {
        /* keep the empty local state */
      });

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const canAdd = remaining > 0;
  const open = hovered || placing;

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
      const payload = parseHeartsPayload(await response.json());

      if (!response.ok) {
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

  function hintText(): string {
    if (!canAdd) {
      return "Már kitetted a két szíved";
    }
    if (placing) {
      return "Kattints a cikk köré · Esc: mégsem";
    }
    return "Válassz színt, majd tedd a cikk köré";
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
          aria-label="Tedd le a szívet a cikk köré"
          onClick={onPlace}
        />
      ) : null}

      <div
        className="pointer-events-auto fixed right-3 bottom-3 z-[4] sm:right-5 sm:bottom-5"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <div className={cn("heart-composer", open && "is-open", placing && "is-placing")}>
          <button
            type="button"
            disabled={!canAdd}
            aria-pressed={placing}
            aria-expanded={open}
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
            <HeartMark color={canAdd ? color : "rgba(255,255,255,0.35)"} className="size-5" />
            {canAdd ? (
              <span className="heart-fab-count">{remaining}</span>
            ) : null}
          </button>
          <div className="heart-composer-panel">
            <p className="heart-composer-hint">{hintText()}</p>
            {canAdd ? (
              <div className="heart-composer-tray" role="group" aria-label="Szív színe">
                {HEART_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    aria-label="Szín"
                    aria-pressed={color === preset}
                    className={cn("heart-swatch", color === preset && "is-active")}
                    onClick={() => {
                      setColor(preset);
                      setPlacing(true);
                    }}
                  >
                    <HeartMark color={preset} className="size-5" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
