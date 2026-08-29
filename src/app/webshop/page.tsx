// src/app/webshop/page.tsx
// Old in-site merch URL. The menu opens Bandcamp in a new tab.

import { redirect } from "next/navigation";

import { BANDCAMP_MERCH_URL } from "@/lib/site";

export default function WebshopPage() {
  redirect(BANDCAMP_MERCH_URL);
}
