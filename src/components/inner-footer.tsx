// src/components/inner-footer.tsx
// Quiet footer on blog pages: official profiles plus a home return.

import { SocialLinks } from "./social-links";

export function InnerFooter() {
  return (
    <footer className="mt-auto border-t border-border/70 px-5 py-8 sm:px-8">
      <SocialLinks tone="dark" />
    </footer>
  );
}
