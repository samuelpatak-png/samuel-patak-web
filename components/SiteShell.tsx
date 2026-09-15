"use client";

import { ChamberCard, VaultDial, WaxSeal } from "@/components/VaultDial";
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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div className="pointer-events-auto relative">
        <div className="flex w-max items-center gap-2 rounded-full neu-raised py-1.5 pr-1.5 pl-1.5">
          <WaxSeal />
          <a
            href="#dizajn"
            className="flex min-h-10 items-center px-1 font-display text-sm tracking-[0.2em] text-ink"
          >
            {SITE.monogram} · {CHAMBERS[index].combo}
          </a>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full neu-inset-sm"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`absolute h-[1.5px] w-4 bg-ink transition-transform duration-300 ease-[var(--ease-soft)] ${open ? "rotate-45" : "-translate-y-1"}`}
            />
            <span
              className={`absolute h-[1.5px] w-4 bg-ink transition-transform duration-300 ease-[var(--ease-soft)] ${open ? "-rotate-45" : "translate-y-1"}`}
            />
          </button>
        </div>
        {open ? (
          <div
            id="mobile-menu"
            className="absolute top-[3.6rem] left-1/2 z-30 w-[16.5rem] -translate-x-1/2 rounded-[1.4rem] neu-raised p-3"
          >
            <nav className="grid gap-0.5" aria-label="Komory">
              {CHAMBERS.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  className={`min-h-11 rounded-full px-4 text-left font-display text-base ${
                    i === index ? "neu-press text-brass-deep" : "text-ink"
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
      </div>
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
    <section className="relative overflow-visible px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="w-full">
          <VaultDial index={index} onChange={onSelect} />
        </div>
        <h1 className="mt-6 max-w-lg font-display text-xl leading-snug font-semibold tracking-[-0.03em] text-ink sm:text-2xl">
          {SITE.tagline}
        </h1>
        <div className="mt-8 w-full max-w-xl text-left">
          <ChamberCard chamber={chamber} />
        </div>
      </div>
    </section>
  );
}

function WorkProof() {
  const seals = [
    {
      combo: "24A",
      title: "Kofein",
      note: "E-shop s platbami a objednávkami.",
      preview: "kofein" as const,
    },
    {
      combo: "24B",
      title: "CallBot CRM",
      note: "Hovory, kampane, automatizácia predaja.",
      preview: "callbot" as const,
    },
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
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {seals.map((seal) => (
            <article key={seal.combo} className="rounded-[2rem] neu-raised p-4 sm:p-5">
              <SealCrop variant={seal.preview} />
              <p className="mt-5 font-display text-xs tracking-[0.16em] text-brass-deep">
                {seal.combo}
              </p>
              <h3 className="mt-2 font-display text-2xl text-ink">{seal.title}</h3>
              <p className="mt-2 leading-relaxed text-mute">{seal.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SealCrop({ variant }: { variant: "kofein" | "callbot" }) {
  if (variant === "kofein") {
    return (
      <div className="seal-screen bg-[#f4ece3]">
        <div className="flex gap-1.5 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#d7c4b0]" />
          <span className="h-2 w-2 rounded-full bg-[#d7c4b0]" />
          <span className="h-2 w-2 rounded-full bg-[#d7c4b0]" />
        </div>
        <div className="grid grid-cols-3 gap-2 px-3 pb-3">
          {["Espresso", "Filter", "Kakao"].map((item) => (
            <div key={item} className="rounded-lg bg-[#efe4d6] px-2 py-3">
              <div className="mx-auto h-8 w-8 rounded-full bg-[#6b3f2a]" />
              <p className="mt-2 text-center text-[10px] text-[#4a3226]">{item}</p>
              <p className="text-center text-[9px] text-[#8a6a55]">4,90 €</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="seal-screen bg-[#1b222c]">
      <div className="flex gap-1.5 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#3d4a58]" />
        <span className="h-2 w-2 rounded-full bg-[#3d4a58]" />
        <span className="h-2 w-2 rounded-full bg-[#3d4a58]" />
      </div>
      <div className="space-y-1.5 px-3 pb-3">
        {[
          ["09:14", "Nový dopyt", "živý"],
          ["09:31", "Spätný hovor", "hotovo"],
          ["10:02", "Kampaň A", "beží"],
        ].map((row) => (
          <div
            key={row[1]}
            className="flex items-center justify-between rounded-md bg-white/10 px-2 py-2 text-[10px] text-[#d7dde6]"
          >
            <span className="text-[#8b96a4]">{row[0]}</span>
            <span>{row[1]}</span>
            <span className="text-[#c4a046]">{row[2]}</span>
          </div>
        ))}
      </div>
    </div>
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
    <section id="kontakt" className="px-4 py-20 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <div>
          <WaxSeal size="lg" />
          <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-brass-deep">
            Komora 36 · lístok
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-[-0.03em] text-ink sm:text-5xl">
            Otvorte dvere správou.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-mute">
            Aktívna kombinácia je {chamber.combo} · {chamber.short}. Mail ide na{" "}
            {SITE.email}.
          </p>
        </div>
        <form onSubmit={onSubmit} className="door-panel">
          <div className="door-panel-inner grid gap-5 px-6 py-8 sm:px-8">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] tracking-[0.18em] text-mute uppercase">lístok do trezoru</p>
              <span className="metal-plate font-display text-sm font-semibold">{chamber.combo}</span>
            </div>
            <label className="grid gap-1 text-[11px] tracking-[0.16em] text-mute uppercase">
              Meno
              <input
                required
                name="name"
                autoComplete="name"
                className="slip-line min-h-11 bg-transparent text-[15px] tracking-normal text-ink outline-none"
              />
            </label>
            <label className="grid gap-1 text-[11px] tracking-[0.16em] text-mute uppercase">
              Email
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="slip-line min-h-11 bg-transparent text-[15px] tracking-normal text-ink outline-none"
              />
            </label>
            <label className="grid gap-1 text-[11px] tracking-[0.16em] text-mute uppercase">
              Správa
              <textarea
                required
                name="message"
                rows={4}
                className="slip-line bg-transparent py-3 text-[15px] tracking-normal text-ink outline-none"
                placeholder={`Kombinácia ${chamber.combo} — čo treba otvoriť`}
              />
            </label>
            <button
              type="submit"
              className="group mt-1 inline-flex min-h-12 w-fit items-center gap-3 rounded-full neu-raised px-5 text-ink"
            >
              {sent ? "Otvára sa mail" : "Odoslať kód"}
              <span className="flex h-8 w-8 items-center justify-center rounded-full neu-inset-sm text-brass-deep transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-0.5">
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
