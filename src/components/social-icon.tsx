// src/components/social-icon.tsx
// Brand marks for the official Galaxisok profiles. Paths stay inline so no extra assets load.

import type { SocialKind } from "@/lib/socials";

type SocialIconProps = {
  kind: SocialKind;
  className?: string;
};

export function SocialIcon({ kind, className }: SocialIconProps) {
  switch (kind) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className={className}>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M7.2 2.2h9.6A5 5 0 0 1 21.8 7.2v9.6a5 5 0 0 1-5 5H7.2a5 5 0 0 1-5-5V7.2a5 5 0 0 1 5-5ZM12 7.35A4.65 4.65 0 1 0 16.65 12 4.65 4.65 0 0 0 12 7.35Zm4.9-2.2a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1Z"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className={className}>
          <path
            fill="currentColor"
            d="M13.6 8.4V6.8c0-.7.5-1.1 1.2-1.1H16V3h-2.1C11.4 3 10 4.5 10 6.6v1.8H8v2.7h2V21h3.6v-9.9h2.4l.5-2.7h-2.9Z"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className={className}>
          <path
            fill="currentColor"
            d="M22.5 7.2a3.1 3.1 0 0 0-2.2-2.2C18.4 4.5 12 4.5 12 4.5s-6.4 0-8.3.5A3.1 3.1 0 0 0 1.5 7.2 32 32 0 0 0 1 12a32 32 0 0 0 .5 4.8 3.1 3.1 0 0 0 2.2 2.2c1.9.5 8.3.5 8.3.5s6.4 0 8.3-.5a3.1 3.1 0 0 0 2.2-2.2A32 32 0 0 0 23 12a32 32 0 0 0-.5-4.8ZM10 15.3V8.7L15.7 12 10 15.3Z"
          />
        </svg>
      );
    case "spotify":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className={className}>
          <path
            fill="currentColor"
            d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.38-2.16-10.548-1.877-.402.046-.779-.179-.779-.58 0-.359.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.66.42.18.479.659.168 1.336zm1.68-3.12c-.301.42-.841.6-1.262.3-3.239-2.021-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 19.8 13.8c.361.181.54.78.401 1.42zm1.38-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
          />
        </svg>
      );
    case "apple":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className={className}>
          <path
            fill="currentColor"
            d="M16.7 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.2 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-.9 2.8-2c.9-1.2 1.2-2.4 1.2-2.5-.1 0-2.4-.9-2.4-3.8Zm-2.2-6.5c.6-.8 1.1-1.8.9-2.9-1 .1-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.8 1.1.1 2.2-.5 2.9-1.3Z"
          />
        </svg>
      );
    case "bandcamp":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className={className}>
          <path fill="currentColor" d="M3 17.5 8.6 6.5h12.4L15.4 17.5H3Z" />
        </svg>
      );
    case "deezer":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className={className}>
          <path fill="currentColor" d="M2 14.2h3.2v3.3H2zm4.2 0H9.4v3.3H6.2zm4.3-2.2h3.1v5.5h-3.1zm4.2-2.1h3.2v7.6h-3.2zm4.3-3.4H22v11H19.2z" />
        </svg>
      );
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
