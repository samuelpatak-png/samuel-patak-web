"use client";

import { ChamberCard, VaultDial } from "@/components/VaultDial";
import { CHAMBERS, chamberByIndex, type ChamberId } from "@/lib/chambers";
import { SITE } from "@/lib/site";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

export function SiteShell() {
  const [index, setIndex] = useState(0);
  const chamber = chamberByIndex(index);

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "") as ChamberId;
      const found = CHAMBERS.find((item) => item.id === id);
      if (found) setIndex(found.index);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const select = useCallback((next: number) => {
    setIndex(next);
    const id = CHAMBERS[next].id;
    history.replaceState(null, "", `#${id}`);
  }, []);

  return (
    <>
      <Nav index={index} onSelect={select} />
      <main>
        <Hero index={index} onSelect={select} chamber={chamber} />
        <WorkProof />
        <DetailSections onSelect={select} />
        <ContactSection chamber={chamber} />
      </main>
      <Footer />
    </>
  );
}

function Nav({
  index,
  onSelect,
}: {
  index: number;
  onSelect: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-4">
      <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-3 rounded-full neu-raised px-2 py-2">
        <a href="#dizajn" className="flex items-center gap-3 pl-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full neu-inset-sm font-display text-[11px] font-semibold text-accent">
            {SITE.monogram}
          </span>
          <span className="hidden font-display text-sm tracking-wide text-ink sm:block">
            {SITE.name}
          </span>
        </a>
        <div className="flex items-center gap-2">
          <a
            href="#kontakt"
            className="group hidden min-h-11 items-center gap-2 rounded-full neu-raised px-4 text-sm text-ink sm:inline-flex"
          >
            Napísať
            <span className="flex h-7 w-7 items-center justify-center rounded-full neu-inset-sm text-accent transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-full neu-inset-sm lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-300 ease-[var(--ease-soft)] ${open ? "rotate-45" : "-translate-y-1.5"}`}
            />
            <span
              className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-300 ease-[var(--ease-soft)] ${open ? "-rotate-45" : "translate-y-1.5"}`}
            />
          </button>
        </div>
      </div>
      {open ? (
        <div
          id="mobile-menu"
          className="pointer-events-auto absolute inset-x-4 top-[4.4rem] z-30 rounded-[1.8rem] neu-raised p-4 lg:hidden"
        >
          <nav className="grid gap-1" aria-label="Mobilné komory">
            {CHAMBERS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={`min-h-12 rounded-full px-4 text-left font-display text-lg ${
                  i === index ? "neu-press text-accent" : "text-ink"
                }`}
                onClick={() => {
                  onSelect(i);
                  setOpen(false);
                }}
              >
                <span className="mr-3 text-xs text-mute">{item.combo}</span>
                {item.short}
              </button>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function Hero({
  index,
  onSelect,
  chamber,
}: {
  index: number;
  onSelect: (index: number) => void;
  chamber: ReturnType<typeof chamberByIndex>;
}) {
  return (
    <section className="relative overflow-visible px-4 pb-16 pt-[5.25rem] sm:px-6 sm:pt-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="rounded-full neu-inset-sm px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-accent-soft">
          {SITE.role}
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-3xl leading-[0.98] font-semibold tracking-[-0.04em] text-ink sm:mt-5 sm:text-5xl">
          {SITE.tagline}
        </h1>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-mute sm:text-lg">
          Som Samuel Patak. Freelancer na web dizajn, stavbu webu, reklamy a
          automatizácie. Natočte kolečko, alebo kliknite kategóriu.
        </p>
        <div className="mt-5 w-full sm:mt-6">
          <VaultDial index={index} onChange={onSelect} />
        </div>
        <div className="mt-8 w-full max-w-xl text-left">
          <ChamberCard chamber={chamber} />
        </div>
      </div>
    </section>
  );
}

function WorkProof() {
  const seals = [
    { combo: "24A", title: "Kofein", note: "E-shop s platbami a objednávkami." },
    { combo: "24B", title: "CallBot CRM", note: "Hovory, kampane, automatizácia predaja." },
    { combo: "24C", title: "Scalar.sk", note: "Web a nástroje, ktoré majú prinášať dopyt." },
  ];

  return (
    <section id="recenzie" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-[11px] uppercase tracking-[0.22em] text-accent-soft">
          Komora 24 · pečate
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center font-display text-4xl tracking-[-0.03em] text-ink sm:text-5xl">
          Recenzie sem patria až po odovzdaní. Zatiaľ tu visia pečate z reálnej práce.
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {seals.map((seal) => (
            <article key={seal.combo} className="rounded-[2rem] neu-raised px-6 py-8">
              <p className="text-xs tracking-[0.16em] text-accent-soft">{seal.combo}</p>
              <h3 className="mt-4 font-display text-2xl text-ink">{seal.title}</h3>
              <p className="mt-3 leading-relaxed text-mute">{seal.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailSections({ onSelect }: { onSelect: (index: number) => void }) {
  const details = CHAMBERS.filter((item) => item.id !== "recenzie" && item.id !== "kontakt");

  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-4xl gap-5">
        {details.map((item) => (
          <article
            key={item.id}
            id={item.id}
            className="scroll-mt-28 rounded-[2rem] neu-raised px-6 py-9 sm:px-10"
          >
            <div className="grid gap-6 md:grid-cols-[5.5rem_1fr_auto] md:items-center">
              <p className="font-display text-4xl text-accent">{item.combo}</p>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
                  {item.kicker}
                </p>
                <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-ink sm:text-4xl">
                  {item.short === "Dizajn"
                    ? "Web dizajn"
                    : item.short === "Stavba"
                      ? "Stavba celého webu"
                      : item.short === "Reklamy"
                        ? "Nastavovanie reklám"
                        : item.short === "Automatizácia"
                          ? "Automatizácie"
                          : item.title}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-mute">{item.body}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelect(item.index);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="min-h-12 rounded-full neu-raised px-5 text-sm text-ink"
              >
                Natočiť {item.combo}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactSection({
  chamber,
}: {
  chamber: ReturnType<typeof chamberByIndex>;
}) {
  const [sent, setSent] = useState(false);
  const subject = useMemo(
    () => `Vizitka · ${chamber.short} · ${chamber.combo}`,
    [chamber],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const body = encodeURIComponent(
      `Meno: ${name}\nEmail: ${email}\nKomora: ${chamber.short} (${chamber.combo})\n\n${message}`,
    );
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="kontakt" className="px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent-soft">
            Komora 36 · spojenie
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-[-0.03em] text-ink sm:text-5xl">
            Otvorte dvere správou, nie formulárom o ničom.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-mute">
            Aktívna komora je {chamber.short} ({chamber.combo}). Môžete ju nechať, alebo
            kolečko ešte pretočiť. Mail ide na {SITE.email}.
          </p>
        </div>
        <form onSubmit={onSubmit} className="rounded-[2rem] neu-raised p-2">
          <div className="grid gap-4 rounded-[calc(2rem-0.5rem)] px-6 py-8 sm:px-8">
            <label className="grid gap-2 text-sm text-mute">
              Meno
              <input
                required
                name="name"
                autoComplete="name"
                className="min-h-12 rounded-full neu-inset px-4 text-ink"
              />
            </label>
            <label className="grid gap-2 text-sm text-mute">
              Email
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="min-h-12 rounded-full neu-inset px-4 text-ink"
              />
            </label>
            <label className="grid gap-2 text-sm text-mute">
              Správa
              <textarea
                required
                name="message"
                rows={5}
                className="rounded-[1.4rem] neu-inset px-4 py-3 text-ink"
                placeholder={`Chcem ${chamber.short.toLowerCase()}…`}
              />
            </label>
            <button
              type="submit"
              className="group mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full neu-raised px-5 text-ink"
            >
              {sent ? "Otvára sa mail" : "Poslať kód správy"}
              <span className="flex h-8 w-8 items-center justify-center rounded-full neu-inset-sm text-accent transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 pb-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 rounded-[2rem] neu-raised px-6 py-6 sm:flex-row sm:items-center">
        <p className="text-xs uppercase tracking-[0.2em] text-mute">
          {SITE.monogram} · kombinácia 00–36
        </p>
        <a href={`mailto:${SITE.email}`} className="text-sm text-accent">
          {SITE.email}
        </a>
      </div>
    </footer>
  );
}
