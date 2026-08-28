// src/app/kapu/actions.ts
// Checks the tesztoldal password and writes the httpOnly gate cookie.

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { GATE_COOKIE, gatePassword, gateToken } from "@/lib/gate";

export async function unlock(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (password !== gatePassword()) {
    redirect("/kapu?hiba=1");
  }

  const jar = await cookies();
  jar.set(GATE_COOKIE, gateToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/");
}
