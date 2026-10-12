// src/components/newsletter-form.tsx
// Email field plus required ÁSZF accept; submits into WordPress → Mailchimp.

"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";

type SubmitState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function NewsletterForm() {
  const [accepted, setAccepted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const startedAtRef = useRef(0);
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  function markStarted() {
    if (startedAtRef.current === 0) {
      startedAtRef.current = Date.now();
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    markStarted();
    if (!accepted || state.kind === "loading") {
      return;
    }

    setState({ kind: "loading" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          aszf: accepted,
          startedAt: startedAtRef.current,
          company: "",
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        setState({
          kind: "error",
          message:
            payload?.message ||
            "A feliratkozás nem sikerült. Próbáld újra később.",
        });
        return;
      }

      setState({
        kind: "success",
        message:
          payload?.message ||
          "Köszönjük! Nézd meg a postaládádat, és erősítsd meg a feliratkozást.",
      });
      setName("");
      setEmail("");
      setAccepted(false);
      startedAtRef.current = 0;
    } catch {
      setState({
        kind: "error",
        message: "Nem sikerült elküldeni. Próbáld újra később.",
      });
    }
  }

  return (
    <form className="newsletter-form" onSubmit={onSubmit}>
      <div className="newsletter-fields">
        <div className="newsletter-input-wrap">
          <label className="sr-only" htmlFor="name">
            Név vagy becenév
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={60}
            autoComplete="nickname"
            value={name}
            onFocus={markStarted}
            onChange={(event) => {
              markStarted();
              setName(event.target.value);
            }}
            placeholder="Név vagy becenév"
            className="newsletter-input"
            disabled={state.kind === "loading"}
          />
          <label className="sr-only" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onFocus={markStarted}
            onChange={(event) => {
              markStarted();
              setEmail(event.target.value);
            }}
            placeholder="email@cim.hu"
            className="newsletter-input"
            disabled={state.kind === "loading"}
          />
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="sr-only"
            defaultValue=""
          />
        </div>
        <button
          type="submit"
          className="concert-ticket newsletter-submit"
          disabled={!accepted || state.kind === "loading"}
        >
          {state.kind === "loading" ? "Küldés…" : "Feliratkozom"}
        </button>
      </div>
      <label className="newsletter-consent">
        <input
          type="checkbox"
          name="aszf"
          required
          checked={accepted}
          onChange={(event) => {
            markStarted();
            setAccepted(event.target.checked);
          }}
          className="newsletter-checkbox"
        />
        <span>
          Hozzájárulok, hogy a Galaxisok a megadott e-mail-címemre hírlevelet
          küldjön. Az adatkezelési tájékoztatót megismertem.
        </span>
      </label>
      <p className="newsletter-legal">
        A feliratkozást egy megerősítő e-mailben kell jóváhagynod. A
        hozzájárulásod bármikor visszavonhatod a levelek alján lévő
        leiratkozó linkkel. Részletek:{" "}
        <Link
          href="/adatkezeles"
          className="text-white/70 underline underline-offset-4 hover:text-white"
        >
          adatkezelési tájékoztató
        </Link>{" "}
        és{" "}
        <Link href="/aszf" className="text-white/70 underline underline-offset-4 hover:text-white">
          ÁSZF
        </Link>
        .
      </p>
      {state.kind === "success" ? (
        <p className="newsletter-feedback is-success" role="status">
          {state.message}
        </p>
      ) : null}
      {state.kind === "error" ? (
        <p className="newsletter-feedback is-error" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
