"use client";

import { ChamberCard, VaultDial } from "@/components/VaultDial";
import { CHAMBERS, chamberByIndex, type ChamberId } from "@/lib/chambers";
import { SITE } from "@/lib/site";
import { FormEvent, useEffect, useMemo, useState } from "react";

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

  const select = (next: number) => {
    setIndex(next);
    const id = CHAMBERS[next].id;
    history.replaceState(null, "", `#${id}`);
  };

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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-5">
      <div className="pointer-events-auto bezel flex w-full max-w-5xl items-center justify-between gap-4 rounded-full bg-steel/80 px-2 py-2 backdrop-blur-xl">
        <a href="#dizajn" className="flex items-center gap-3 pl-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full brass-ring p-[2px]">
            <span className="flex h-full w-full items-center justify-center rounded-full enamel font-mono text-[11px] text-brass-bright">
              {SITE.monogram}
            </span>
          </span>
          <span className="hidden font-display text-sm tracking-wide text-plate sm:block">
            {SITE.name}
          </span>
        </a>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Komory">
          {CHAMBERS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(i)}
              className={`min-h-11 rounded-full px-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 ease-[var(--ease-vault)] ${
                i === index ? "bg-brass text-ink" : "text-mist hover:text-brass-bright"
              }`}
            >
              {item.short}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#kontakt"
            className="group hidden min-h-11 items-center gap-2 rounded-full bg-brass px-4 text-sm text-ink sm:inline-flex"
          >
            Napísať
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/10 transition-transform duration-500 ease-[var(--ease-vault)] group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`absolute h-[1.5px] w-5 bg-brass-bright transition-transform duration-500 ease-[var(--ease-vault)] ${open ? "rotate-45" : "-translate-y-1.5"}`}
            />
            <span
              className={`absolute h-[1.5px] w-5 bg-brass-bright transition-transform duration-500 ease-[var(--ease-vault)] ${open ? "-rotate-45" : "translate-y-1.5"}`}
            />
          </button>
        </div>
      </div>
      {open ? (
        <div
          id="mobile-menu"
          className="pointer-events-auto absolute inset-x-4 top-[4.6rem] z-30 rounded-[1.6rem] bg-steel/95 p-4 backdrop-blur-xl bezel lg:hidden"
        >
          <nav className="grid gap-1" aria-label="Mobilné komory">
            {CHAMBERS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className="min-h-12 rounded-full px-4 text-left font-display text-lg"
                onClick={() => {
                  onSelect(i);
                  setOpen(false);
                }}
              >
                <span className="mr-3 font-mono text-xs text-brass">{item.combo}</span>
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
    <section className="relative min-h-[100dvh] overflow-visible px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <CornerRivets />
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
        <div>
          <p className="inline-flex rounded-full bg-steel-mid px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-brass">
            {SITE.role}
          </p>
          <h1 className="mt-6 max-w-xl font-display text-4xl leading-[0.95] font-semibold tracking-[-0.04em] text-plate sm:text-6xl">
            {SITE.tagline}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-mist">
            Som Samuel Patak. Freelancer na web dizajn, stavbu celého webu a nastavenie
            reklám. Kolečko trezoru je mapa: natočte ho na to, čo vás zaujíma.
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.22em] text-brass/80">
            Ťahajte kolečko · alebo kliknite na komoru
          </p>
        </div>
        <div className="relative">
          <VaultDial index={index} onChange={onSelect} />
          <div className="mx-auto mt-14 max-w-xl">
            <ChamberCard chamber={chamber} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CornerRivets() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-6 hidden sm:block">
      <span className="rivet absolute left-0 top-0 h-3.5 w-3.5 rounded-full" />
      <span className="rivet absolute right-0 top-0 h-3.5 w-3.5 rounded-full" />
      <span className="rivet absolute bottom-0 left-0 h-3.5 w-3.5 rounded-full" />
      <span className="rivet absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full" />
    </div>
  );
}

function WorkProof() {
  const seals = [
    { combo: "18A", title: "Kofein", note: "E-shop s platbami a objednávkami." },
    { combo: "18B", title: "CallBot CRM", note: "Hovory, kampane, automatizácia predaja." },
    { combo: "18C", title: "Scalar.sk", note: "Web a nástroje, ktoré majú prinášať dopyt." },
  ];

  return (
    <section id="recenzie" className="px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brass">
          Komora 18 · pečate
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl tracking-[-0.03em] text-plate sm:text-5xl">
          Recenzie sem patria až po odovzdaní. Zatiaľ tu visia pečate z reálnej práce.
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {seals.map((seal) => (
            <article key={seal.combo} className="bezel rounded-[2rem] bg-steel-mid/80 p-1.5">
              <div className="rounded-[calc(2rem-0.35rem)] bg-steel px-6 py-8">
                <p className="font-mono text-xs text-brass">{seal.combo}</p>
                <h3 className="mt-4 font-display text-2xl text-plate">{seal.title}</h3>
                <p className="mt-3 leading-relaxed text-mist">{seal.note}</p>
              </div>
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
    <section className="px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-6">
        {details.map((item, i) => (
          <article
            key={item.id}
            id={item.id}
            className={`bezel scroll-mt-28 rounded-[2rem] p-1.5 ${i % 2 === 0 ? "bg-steel-mid/80" : "bg-oxblood/25"}`}
          >
            <div className="grid gap-8 rounded-[calc(2rem-0.35rem)] bg-steel px-6 py-10 sm:px-10 md:grid-cols-[8rem_1fr_auto] md:items-center">
              <p className="font-display text-5xl text-brass">{item.combo}</p>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-mist">
                  {item.kicker}
                </p>
                <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-plate sm:text-4xl">
                  {item.short === "Dizajn"
                    ? "Web dizajn"
                    : item.short === "Stavba"
                      ? "Stavba celého webu"
                      : item.short === "Reklamy"
                        ? "Nastavovanie reklám"
                        : item.title}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-mist">{item.body}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelect(item.index);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="min-h-12 rounded-full bg-brass px-5 text-sm text-ink"
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
    <section id="kontakt" className="px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brass">
            Komora 30 · spojenie
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-[-0.03em] text-plate sm:text-5xl">
            Otvorte dvere správou, nie formulárom o ničom.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-mist">
            Aktívna komora je {chamber.short} ({chamber.combo}). Môžete ju nechať, alebo
            kolečko ešte pretočiť. Mail ide na {SITE.email}.
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          className="bezel rounded-[2rem] bg-steel-mid/80 p-1.5"
        >
          <div className="grid gap-4 rounded-[calc(2rem-0.35rem)] bg-steel px-6 py-8 sm:px-8">
            <label className="grid gap-2 text-sm text-mist">
              Meno
              <input
                required
                name="name"
                autoComplete="name"
                className="min-h-12 rounded-full bg-ink px-4 text-plate ring-1 ring-brass/20"
              />
            </label>
            <label className="grid gap-2 text-sm text-mist">
              Email
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="min-h-12 rounded-full bg-ink px-4 text-plate ring-1 ring-brass/20"
              />
            </label>
            <label className="grid gap-2 text-sm text-mist">
              Správa
              <textarea
                required
                name="message"
                rows={5}
                className="rounded-3xl bg-ink px-4 py-3 text-plate ring-1 ring-brass/20"
                placeholder={`Chcem ${chamber.short.toLowerCase()}…`}
              />
            </label>
            <button
              type="submit"
              className="group mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-brass px-5 text-ink"
            >
              {sent ? "Otvára sa mail" : "Poslať kód správy"}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 transition-transform duration-500 ease-[var(--ease-vault)] group-hover:translate-x-0.5">
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
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 rounded-[2rem] bezel bg-steel-mid/50 px-6 py-6 sm:flex-row sm:items-center">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-mist">
          {SITE.monogram} · kombinácia 00–30
        </p>
        <a href={`mailto:${SITE.email}`} className="text-sm text-brass-bright">
          {SITE.email}
        </a>
      </div>
    </footer>
  );
}
