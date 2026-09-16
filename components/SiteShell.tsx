"use client";

import { BomTable, DemandMachine } from "@/components/DemandMachine";
import { ReviewsColumn } from "@/components/ReviewsColumn";
import type { Review } from "@/app/reviews";
import { PARTS, partById, partByIndex, wrapIndex, type Part } from "@/lib/parts";
import { SITE } from "@/lib/site";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

export function SiteShell({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState<number | null>(null);
  const hovered = partByIndex(index);
  const openPart = opened == null ? null : partByIndex(opened);

  useEffect(() => {
    const fromHash = () => {
      const found = partById(window.location.hash.replace("#", ""));
      if (found) {
        setIndex(found.index);
        setOpened(found.index);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const hover = useCallback((next: number) => {
    setIndex(wrapIndex(next));
  }, []);

  const open = useCallback((next: number) => {
    const i = wrapIndex(next);
    setIndex(i);
    setOpened(i);
    history.replaceState(null, "", `#${PARTS[i].id}`);
    requestAnimationFrame(() => {
      document.getElementById("diel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <>
      <a
        href="#stroj"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-3 focus:py-2"
      >
        Preskočiť na výkres
      </a>
      <Header index={index} onOpen={open} />
      <main>
        <Hero index={index} hovered={hovered} onHover={hover} onOpen={open} />
        {openPart ? <PartPage part={openPart} /> : null}
        <OrderForm part={openPart ?? hovered} />
        <ReviewsColumn reviews={reviews} />
      </main>
      <Footer />
    </>
  );
}

function Header({
  index,
  onOpen,
}: {
  index: number;
  onOpen: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-start justify-between gap-4 px-4 pt-3 sm:px-6">
      <div>
        <p className="font-display text-xl tracking-[-0.03em] sm:text-2xl">{SITE.name}</p>
        <p className="mt-0.5 max-w-sm text-sm text-mute">{SITE.role}</p>
      </div>
      <div className="flex items-start gap-2">
        <a href="#recenzie" className="flex h-11 items-center border border-sheet px-3 text-sm">
          Recenzie
        </a>
        <div className="relative">
        <button
          type="button"
          className="flex h-11 min-w-11 items-center justify-center border border-sheet px-3 text-sm"
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
            className="absolute top-12 right-0 z-20 w-56 border border-ink bg-paper p-2 text-ink"
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
                  onOpen(i);
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
      </div>
    </header>
  );
}

function Hero({
  index,
  hovered,
  onHover,
  onOpen,
}: {
  index: number;
  hovered: Part;
  onHover: (index: number) => void;
  onOpen: (index: number) => void;
}) {
  return (
    <section id="stroj" className="px-4 py-3 sm:px-6">
      <p className="max-w-4xl font-display text-2xl leading-[1.12] tracking-[-0.03em] sm:text-3xl">
        {SITE.tagline}
      </p>
      <p className="mt-1 max-w-3xl text-sm text-mute">
        Myšou označíte diel. Klikom sa pod výkresom otvorí jeho list.
      </p>
      <div className="sheet-frame mx-auto mt-3 max-w-6xl md:grid md:grid-cols-[minmax(0,1fr)_17rem] md:items-stretch">
        <div className="hidden p-1 md:block">
          <DemandMachine index={index} onHover={onHover} onOpen={onOpen} />
        </div>
        <div className="flex min-h-0 flex-col md:border-l md:border-ink">
          <p className="border-b border-ink px-3 py-2 text-sm text-mute md:hidden">
            diel zo zoznamu otvorí list pod výkresom
          </p>
          <div className="border-b border-ink px-3 py-3">
            <p className="text-[11px] tracking-[0.08em] text-mute uppercase">Diel {hovered.code}</p>
            <p className="mt-1 font-display text-xl leading-tight">{hovered.short}</p>
            <p className="mt-2 text-sm text-mute">Kliknite, otvorí sa list.</p>
          </div>
          <div className="px-1 py-1">
            <BomTable index={index} onHover={onHover} onOpen={onOpen} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PartPage({ part }: { part: Part }) {
  return (
    <section id="diel" className="px-4 py-6 sm:px-6">
      <article className="sheet-frame mx-auto max-w-5xl bg-paper px-6 py-8 sm:px-10 sm:py-10">
        <p className="text-sm text-mute">
          List {part.code} · {SITE.sheet}
        </p>
        <h2 className="mt-2 font-display text-3xl leading-tight tracking-[-0.03em] sm:text-4xl">
          {part.title}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mute">{part.body}</p>
        <ul className="mt-6 space-y-2 text-[0.95rem] leading-relaxed">
          {part.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="mt-2 h-px w-4 shrink-0 bg-rule" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <a
          href="#objednavka"
          className="mt-8 inline-flex min-h-12 items-center border border-ink bg-ink px-4 text-sm text-sheet"
        >
          {part.cta}
        </a>
      </article>
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
          <h2 className="font-display text-2xl tracking-[-0.03em] sm:text-3xl">
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
        <a href="#recenzie" className="text-sm">
          Recenzie
        </a>
        <a href={`mailto:${SITE.email}`} className="text-sm">
          {SITE.email}
        </a>
      </div>
    </footer>
  );
}
