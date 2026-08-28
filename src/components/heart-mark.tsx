// src/components/heart-mark.tsx
// Shared heart shape for stickers, the picker, and the cursor.

type HeartMarkProps = {
  color: string;
  className?: string;
};

export function HeartMark({ color, className }: HeartMarkProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        fill={color}
        stroke="rgba(0,0,0,0.28)"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
