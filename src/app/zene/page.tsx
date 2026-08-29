// src/app/zene/page.tsx
// Old in-site music URL. The menu opens Bandcamp in a new tab.

import { redirect } from "next/navigation";

import { BANDCAMP_MUSIC_URL } from "@/lib/site";

export default function ZenePage() {
  redirect(BANDCAMP_MUSIC_URL);
}
