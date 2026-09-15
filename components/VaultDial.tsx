"use client";

import {
  CHAMBERS,
  CHAMBER_STEP,
  chamberByIndex,
  nearestChamberIndex,
  shortestAngleDelta,
  shortestRotationToIndex,
  wrapIndex,
  type Chamber,
} from "@/lib/chambers";
import { armHaptics, hapticTick } from "@/lib/haptics";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type VaultDialProps = {
  index: number;
  onChange: (index: number) => void;
};

type Sample = { t: number; r: number };

export function VaultDial({ index, onChange }: VaultDialProps) {
  const chamber = chamberByIndex(index);
  const wheelRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startPointer = useRef(0);
  const startRot = useRef(0);
  const rotationRef = useRef(index * CHAMBER_STEP);
  const lastIndex = useRef(index);
  const indexRef = useRef(index);
  const lastDragTick = useRef(index * CHAMBER_STEP);
  const samples = useRef<Sample[]>([]);
  const velocity = useRef(0);
  const raf = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  const [rotation, setRotation] = useState(index * CHAMBER_STEP);
  const labelId = useId();
  const reduced = useRef(false);

  onChangeRef.current = onChange;
  indexRef.current = index;

  const applyRotation = useCallback((value: number) => {
    rotationRef.current = value;
    setRotation(value);
  }, []);

  const stopRaf = useCallback(() => {
    if (raf.current != null) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return stopRaf;
  }, [stopRaf]);

  const announce = useCallback((nextIndex: number, haptic: "step" | "snap") => {
    const i = wrapIndex(nextIndex);
    const changed = i !== lastIndex.current || i !== indexRef.current;
    lastIndex.current = i;
    if (!changed) return;
    onChangeRef.current(i);
    hapticTick(haptic);
  }, []);

  const springTo = useCallback(
    (target: number, nextIndex: number) => {
      stopRaf();
      announce(nextIndex, "step");
      if (reduced.current) {
        applyRotation(target);
        hapticTick("snap");
        return;
      }

      let vel = velocity.current * 16;
      const tick = () => {
        const current = rotationRef.current;
        const diff = target - current;
        vel = vel * 0.78 + diff * 0.16;
        applyRotation(current + vel);
        if (Math.abs(diff) < 0.12 && Math.abs(vel) < 0.12) {
          applyRotation(target);
          hapticTick("snap");
          raf.current = null;
          return;
        }
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    },
    [announce, applyRotation, stopRaf],
  );

  useEffect(() => {
    if (dragging.current) return;
    if (index === lastIndex.current) return;
    lastIndex.current = index;
    springTo(shortestRotationToIndex(rotationRef.current, index), index);
  }, [index, springTo]);

  const angleAt = useCallback((clientX: number, clientY: number) => {
    const el = wheelRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return (
      (Math.atan2(clientY - (r.top + r.height / 2), clientX - (r.left + r.width / 2)) *
        180) /
      Math.PI
    );
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    armHaptics();
    hapticTick("grab");
    stopRaf();
    dragging.current = true;
    startPointer.current = angleAt(event.clientX, event.clientY);
    startRot.current = rotationRef.current;
    lastDragTick.current = rotationRef.current;
    velocity.current = 0;
    samples.current = [{ t: performance.now(), r: rotationRef.current }];
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const next =
      startRot.current +
      shortestAngleDelta(startPointer.current, angleAt(event.clientX, event.clientY));
    applyRotation(next);
    if (Math.abs(next - lastDragTick.current) >= 6) {
      lastDragTick.current = next;
      hapticTick("drag");
    }
    const now = performance.now();
    samples.current.push({ t: now, r: next });
    samples.current = samples.current.filter((sample) => now - sample.t < 90);
    const first = samples.current[0];
    const last = samples.current[samples.current.length - 1];
    if (last.t !== first.t) velocity.current = (last.r - first.r) / (last.t - first.t);
    announce(nearestChamberIndex(next), "step");
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const current = rotationRef.current;
    const flung = Math.abs(velocity.current) > 0.28;
    let targetIndex = nearestChamberIndex(current + velocity.current * 220);
    if (flung && targetIndex === nearestChamberIndex(current)) {
      targetIndex = wrapIndex(nearestChamberIndex(current) + (velocity.current > 0 ? 1 : -1));
    }
    springTo(shortestRotationToIndex(current, targetIndex), targetIndex);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      springTo(shortestRotationToIndex(rotationRef.current, index + 1), index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      springTo(shortestRotationToIndex(rotationRef.current, index - 1), index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      springTo(shortestRotationToIndex(rotationRef.current, 0), 0);
    } else if (event.key === "End") {
      event.preventDefault();
      springTo(shortestRotationToIndex(rotationRef.current, CHAMBERS.length - 1), CHAMBERS.length - 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[22rem] sm:max-w-[24rem]">
      <div
        ref={wheelRef}
        className="relative mx-auto aspect-square w-[min(100%,18.5rem)] select-none sm:w-[min(100%,20rem)]"
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

        <div className="absolute inset-0 rounded-full neu-inset p-5">
          <div
            className="relative h-full w-full cursor-grab touch-none rounded-full neu-raised active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {CHAMBERS.map((item, i) => (
              <span
                key={item.id}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ transform: `rotate(${i * CHAMBER_STEP}deg)` }}
              >
                <span
                  className={`mx-auto mt-3 block h-1.5 w-1.5 rounded-full ${
                    i === index ? "bg-accent" : "bg-shade"
                  }`}
                />
              </span>
            ))}
            <div
              className="pointer-events-none absolute inset-0 will-change-transform"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className="dial-needle absolute inset-0" aria-hidden="true">
                <span className="dial-needle-shaft absolute left-1/2 top-[11%] h-[22%] w-[6px] -translate-x-1/2 rounded-full" />
                <span className="dial-needle-tip absolute left-1/2 top-[8%] h-4 w-4 -translate-x-1/2 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full neu-inset">
          <span className="text-[10px] uppercase tracking-[0.28em] text-mute">
            {chamber.short}
          </span>
          <span className="mt-1 font-display text-3xl font-semibold leading-none text-ink">
            {chamber.combo}
          </span>
        </div>
      </div>

      <ul className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Komory kolečka">
        {CHAMBERS.map((item, i) => {
          const selected = i === index;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`min-h-11 cursor-pointer rounded-full px-3.5 text-[12px] font-medium tracking-[0.02em] transition-all duration-300 ease-[var(--ease-soft)] ${
                  selected ? "neu-press text-accent" : "text-mute hover:text-ink"
                }`}
                onClick={() =>
                  springTo(shortestRotationToIndex(rotationRef.current, i), i)
                }
                aria-pressed={selected}
              >
                {item.short}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ChamberCard({ chamber }: { chamber: Chamber }) {
  return (
    <article key={chamber.id} className="rounded-[2rem] neu-raised p-1">
      <div className="rounded-[calc(2rem-0.25rem)] px-7 py-8 sm:px-9 sm:py-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-accent-soft">
          {chamber.kicker}
        </p>
        <h2 className="mt-3 font-display text-3xl leading-[1.08] font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
          {chamber.title}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink/80">{chamber.lead}</p>
        <p className="mt-3 text-base leading-relaxed text-mute">{chamber.body}</p>
        <ul className="mt-6 space-y-3">
          {chamber.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink/80">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full neu-press"
                aria-hidden="true"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <a
          href={`#${chamber.id === "kontakt" ? "kontakt" : chamber.id}`}
          className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full neu-raised px-5 py-2 text-sm text-ink"
        >
          {chamber.cta}
          <span className="flex h-8 w-8 items-center justify-center rounded-full neu-inset-sm text-accent transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </div>
    </article>
  );
}
