"use client";

import {
  CHAMBERS,
  chamberByIndex,
  nearestChamberIndex,
  rotationForIndex,
  type Chamber,
} from "@/lib/chambers";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type VaultDialProps = {
  index: number;
  onChange: (index: number) => void;
};

function playTick() {
  try {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 210;
    gain.gain.value = 0.028;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
    osc.stop(ctx.currentTime + 0.06);
    osc.onended = () => ctx.close();
  } catch {
    /* ignore locked autoplay */
  }
}

export function VaultDial({ index, onChange }: VaultDialProps) {
  const chamber = chamberByIndex(index);
  const wheelRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startPointer = useRef(0);
  const startRot = useRef(0);
  const [rotation, setRotation] = useState(() => rotationForIndex(index));
  const [snapping, setSnapping] = useState(true);
  const labelId = useId();
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (dragging.current) return;
    setSnapping(true);
    setRotation(rotationForIndex(index));
  }, [index]);

  const angleAt = useCallback((clientX: number, clientY: number) => {
    const el = wheelRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  }, []);

  const snapTo = useCallback(
    (nextIndex: number, withSound: boolean) => {
      const i = ((nextIndex % CHAMBERS.length) + CHAMBERS.length) % CHAMBERS.length;
      setSnapping(true);
      setRotation(rotationForIndex(i));
      if (i !== index) {
        if (withSound && !reduced.current) playTick();
        if (withSound && navigator.vibrate) navigator.vibrate(10);
        onChange(i);
      }
    },
    [index, onChange],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragging.current = true;
    setSnapping(false);
    startPointer.current = angleAt(event.clientX, event.clientY);
    startRot.current = rotation;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const delta = angleAt(event.clientX, event.clientY) - startPointer.current;
    setRotation(startRot.current + delta);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    const delta = angleAt(event.clientX, event.clientY) - startPointer.current;
    const next = nearestChamberIndex(startRot.current + delta);
    snapTo(next, true);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      snapTo(index + 1, true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      snapTo(index - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      snapTo(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      snapTo(CHAMBERS.length - 1, true);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      <ul className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
        {CHAMBERS.map((item, i) => {
          const angle = (i / CHAMBERS.length) * 360;
          const selected = i === index;
          return (
            <li
              key={item.id}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotate(${angle}deg) translateY(clamp(-15.2rem, -46vw, -11.4rem)) rotate(${-angle}deg) translateX(-50%)`,
              }}
            >
              <button
                type="button"
                className={`pointer-events-auto min-h-11 min-w-11 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-500 ease-[var(--ease-vault)] ${
                  selected
                    ? "bg-brass text-ink"
                    : "bg-steel/80 text-mist ring-1 ring-brass/25 hover:text-brass-bright"
                }`}
                onClick={() => snapTo(i, true)}
                aria-pressed={selected}
                aria-label={`${item.short}, kombinácia ${item.combo}`}
              >
                {item.short}
              </button>
            </li>
          );
        })}
      </ul>

      <div
        ref={wheelRef}
        className="relative mx-auto aspect-square w-[min(100%,28rem)] select-none"
        role="slider"
        tabIndex={0}
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={CHAMBERS.length - 1}
        aria-valuenow={index}
        aria-valuetext={`${chamber.short}, kombinácia ${chamber.combo}`}
        onKeyDown={onKeyDown}
      >
        <p id={labelId} className="sr-only">
          Kolečko trezoru. Ťahajte, alebo použite šípky.
        </p>

        <div className="absolute inset-0 rounded-full p-2 bezel brass-ring">
          <div className="h-full w-full rounded-full p-[0.7rem] knurl">
            <div className="relative h-full w-full rounded-full bg-steel-mid p-2 shadow-[inset_0_10px_24px_rgba(0,0,0,0.45)]">
              <div
                className="absolute inset-[0.55rem] cursor-grab touch-none rounded-full enamel active:cursor-grabbing"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: snapping ? "transform 700ms var(--ease-snap)" : "none",
                  willChange: "transform",
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                <DialFace selectedCombo={chamber.combo} />
              </div>

              <div className="pointer-events-none absolute left-1/2 top-[0.35rem] z-10 -translate-x-1/2">
                <span className="block h-0 w-0 border-l-[9px] border-r-[9px] border-t-[16px] border-l-transparent border-r-transparent border-t-brass-bright drop-shadow-[0_2px_0_rgba(0,0,0,0.45)]" />
              </div>

              <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full brass-ring p-[3px]">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full enamel ring-1 ring-black/60">
                  <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-brass/80">
                    kód
                  </span>
                  <span className="font-display text-3xl font-semibold leading-none text-brass-bright sm:text-4xl">
                    {chamber.combo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DialFace({ selectedCombo }: { selectedCombo: string }) {
  const ticks = Array.from({ length: 36 }, (_, i) => i);

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <circle cx="100" cy="100" r="98" fill="none" stroke="#c6a45e" strokeWidth="0.6" opacity="0.4" />
      {ticks.map((tick) => {
        const major = tick % 6 === 0;
        const angle = (tick / 36) * 360;
        const combo = String(tick).padStart(2, "0");
        const active = combo === selectedCombo;
        return (
          <g key={tick} transform={`rotate(${angle} 100 100)`}>
            <line
              x1="100"
              y1={major ? "12" : "16"}
              x2="100"
              y2={major ? "26" : "22"}
              stroke={active ? "#ead7a2" : major ? "#c6a45e" : "#8c96a3"}
              strokeWidth={major ? 1.6 : 0.7}
              strokeLinecap="round"
            />
            {major ? (
              <text
                x="100"
                y="38"
                textAnchor="middle"
                fill={active ? "#ead7a2" : "#c9d0d8"}
                fontSize="7.2"
                fontFamily="var(--font-ibm), ui-monospace, monospace"
                transform={`rotate(${-angle} 100 38)`}
              >
                {combo}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function ChamberCard({ chamber }: { chamber: Chamber }) {
  return (
    <article
      key={chamber.id}
      className="bezel rounded-[2rem] bg-steel-mid/70 p-1.5 md:rotate-[1.2deg]"
    >
      <div className="ledger rounded-[calc(2rem-0.35rem)] px-6 py-7 sm:px-8 sm:py-9">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brass-deep">
          {chamber.kicker}
        </p>
        <h2 className="mt-3 font-display text-3xl leading-[1.05] font-semibold tracking-[-0.03em] text-ledger-ink sm:text-4xl">
          {chamber.title}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ledger-ink/80">{chamber.lead}</p>
        <p className="mt-3 text-base leading-relaxed text-ledger-ink/70">{chamber.body}</p>
        <ul className="mt-6 space-y-3">
          {chamber.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-[0.95rem] leading-relaxed">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-oxblood" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <a
          href={`#${chamber.id === "kontakt" ? "kontakt" : chamber.id}`}
          className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-5 py-2 text-sm tracking-wide text-ledger"
        >
          {chamber.cta}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brass text-ink transition-transform duration-500 ease-[var(--ease-vault)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
            →
          </span>
        </a>
      </div>
    </article>
  );
}
