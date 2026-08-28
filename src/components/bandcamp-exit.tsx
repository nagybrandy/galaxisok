// src/components/bandcamp-exit.tsx
// Icon-only Bandcamp exit; hover grows the button and reveals the label.

import { SocialIcon } from "./social-icon";

type BandcampExitProps = {
  href: string;
};

export function BandcampExit({ href }: BandcampExitProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="bandcamp-exit"
    >
      <SocialIcon kind="bandcamp" className="bandcamp-exit-icon" />
      <span className="bandcamp-exit-label">Tovább a Bandcamp oldalára</span>
    </a>
  );
}
