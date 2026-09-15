"use client";

import { BomTable, DemandMachine, SpecSheet } from "@/components/DemandMachine";
import { PARTS, partById, partByIndex, wrapIndex, type Part } from "@/lib/parts";
import { SITE } from "@/lib/site";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

export function SiteShell() {
  const [index, setIndex] = useState(0);
  const part = partByIndex(index);

  useEffect(() => {
    const fromHash = () => {
      const found = partById(window.location.hash.replace("#", ""));
      if (found) setIndex(found.index);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const select = useCallback((next: number) => {
    const i = wrapIndex(next);
    setIndex(i);
    history.replaceState(null, "", `#${PARTS[i].id}`);
  }, []);

  return (
    <>
      <a
        href="#stroj"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-3 focus:py-2"
      >
        Preskočiť na výkres
      </a>
      <Header index={index} onSelect={select} />
      <main>
        <Hero index={index} onSelect={select} part={part} />
        <BuiltWork />
        <OrderForm part={part} />
      </main>
      <Footer />
    </>
  );
}

function Header({
  index,
  onSelect,
}: {
  index: number;
  onSelect: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-start justify-between gap-4 px-4 pt-5 sm:px-6">
      <div>
        <p className="font-display text-2xl tracking-[-0.03em]">{SITE.name}</p>
        <p className="mt-1 max-w-sm text-sm leading-relaxed text-mute">{SITE.role}</p>
      </div>
      <div className="relative">
        <button
          type="button"
          className="flex h-11 min-w-11 items-center justify-center border border-ink px-3 text-sm"
          aria-expanded={open}
          aria-controls="part-menu"
          aria-label={open ? "Zavrieť zoznam dielov" : "Otvoriť zoznam dielov"}
          onClick={() => setOpen((v) => !v)}
        >
          {PARTS[index].code}
        </button>
        {open ? (
          <nav
            id="part-menu"
            className="absolute top-12 right-0 z-20 w-56 border border-ink bg-sheet p-2"
            aria-label="Diely stroja"
          >
            {PARTS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={`flex min-h-11 w-full items-center justify-between px-2 text-left text-sm ${
                  i === index ? "text-hot" : "text-ink"
                }`}
                onClick={() => {
                  onSelect(i);
                  setOpen(false);
                }}
              >
                <span>{item.short}</span>
                <span className="text-mute">{item.code}</span>
              </button>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}

function Hero({
  index,
  onSelect,
  part,
}: {
  index: number;
  onSelect: (index: number) => void;
  part: Part;
}) {
  return (
    <section id="stroj" className="px-4 py-8 sm:px-6 sm:py-10">
      <p className="max-w-3xl font-display text-3xl leading-[1.12] tracking-[-0.03em] sm:text-5xl">
        {SITE.tagline}
      </p>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-mute sm:text-lg">
        Kliknite na diel. Dopyt padá do násypky, okolo nej sú práce, ktoré viem zapojiť.
        Žiadny balík služieb. Jeden stroj, siedme diely.
      </p>
      <div className="sheet-frame mx-auto mt-8 max-w-6xl bg-paper/55 p-2 sm:p-3">
        <p className="border-b border-ink px-2 py-3 text-sm text-mute md:hidden">
          dopyt do násypky, potom diel zo zoznamu
        </p>
        <div className="hidden md:block">
          <DemandMachine index={index} onChange={onSelect} />
        </div>
        <BomTable index={index} onSelect={onSelect} />
      </div>
      <div className="mx-auto mt-5 max-w-3xl">
        <SpecSheet part={part} />
      </div>
    </section>
  );
}

function BuiltWork() {
  const pieces = [
    { code: "EX-A", title: "Kofein", note: "E-shop s platbami a objednávkami." },
    { code: "EX-B", title: "CallBot CRM", note: "Hovory, kampane, automatizácia predaja." },
  ];

  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl tracking-[-0.03em] sm:text-4xl">
          Dva odovzdané kusy, nie vymyslené recenzie.
        </h2>
        <p className="mt-3 max-w-xl text-mute">
          Ďalšie mená pribudnú po ďalšom odovzdaní.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {pieces.map((piece) => (
            <article key={piece.code} className="sheet-frame bg-paper px-5 py-6">
              <p className="text-sm text-mute">{piece.code}</p>
              <h3 className="mt-2 font-display text-2xl">{piece.title}</h3>
              <p className="mt-2 leading-relaxed text-mute">{piece.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrderForm({ part }: { part: Part }) {
  const [sent, setSent] = useState(false);
  const subject = useMemo(
    () => `Objednávka dielu ${part.code} · ${part.short}`,
    [part],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const body = encodeURIComponent(
      `Meno: ${name}\nEmail: ${email}\nDiel: ${part.short} (${part.code})\n\n${message}`,
    );
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="objednavka" className="px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <div>
          <h2 className="font-display text-3xl tracking-[-0.03em] sm:text-4xl">
            Objednávka dielu {part.code}
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-mute">
            Aktívny diel je {part.short}. Mail ide na {SITE.email}.
          </p>
        </div>
        <form onSubmit={onSubmit} className="sheet-frame bg-paper px-6 py-8 sm:px-8">
          <label className="grid gap-1 text-sm text-mute">
            Meno
            <input required name="name" autoComplete="name" className="rule-input min-h-11 text-ink" />
          </label>
          <label className="mt-5 grid gap-1 text-sm text-mute">
            Email
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              className="rule-input min-h-11 text-ink"
            />
          </label>
          <label className="mt-5 grid gap-1 text-sm text-mute">
            Správa
            <textarea
              required
              name="message"
              rows={4}
              className="rule-input py-3 text-ink"
              placeholder={`Potrebujem ${part.short}`}
            />
          </label>
          <button
            type="submit"
            className="mt-7 inline-flex min-h-12 items-center border border-ink bg-ink px-4 text-sm text-sheet"
          >
            {sent ? "Otvára sa mail" : part.cta}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 pb-8 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 border-t border-ink pt-4 sm:flex-row sm:items-center">
        <p className="text-sm text-mute">
          {SITE.sheet} · {SITE.monogram}
        </p>
        <a href={`mailto:${SITE.email}`} className="text-sm">
          {SITE.email}
        </a>
      </div>
    </footer>
  );
}
