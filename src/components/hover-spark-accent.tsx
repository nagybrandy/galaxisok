// src/components/hover-spark-accent.tsx
// Menu: one centered spark cluster. Logo: three clusters across the wordmark.

type HoverSparkAccentProps = {
  variant?: "menu" | "logo";
};

export function HoverSparkAccent({ variant = "menu" }: HoverSparkAccentProps) {
  if (variant === "logo") {
    return (
      <>
        <span className="hover-spark-halo" aria-hidden />
        <span className="hover-spark-dots site-logo-spark-start" aria-hidden />
        <span className="hover-spark-dots site-logo-spark-mid" aria-hidden />
        <span className="hover-spark-dots site-logo-spark-end" aria-hidden />
      </>
    );
  }

  return (
    <>
      <span className="hover-spark-halo" aria-hidden />
      <span className="hover-spark-dots" aria-hidden />
    </>
  );
}
