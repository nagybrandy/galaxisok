// src/app/webshop/page.tsx
// Old in-site merch URL. The menu opens the B Side shop in a new tab.

import { redirect } from "next/navigation";

import { MERCH_URL } from "@/lib/site";

export default function WebshopPage() {
  redirect(MERCH_URL);
}
