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
  const [glint, setGlint] = useState({ x: 32, y: 26 });
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

  const updateGlint = useCallback((clientX: number, clientY: number) => {
    const el = wheelRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    setGlint({
      x: ((clientX - box.left) / box.width) * 100,
      y: ((clientY - box.top) / box.height) * 100,
    });
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
    updateGlint(event.clientX, event.clientY);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    updateGlint(event.clientX, event.clientY);
    if (!dragging.current) return;
    const next =
      startRot.current -
      shortestAngleDelta(startPointer.current, angleAt(event.clientX, event.clientY));
    applyRotation(next);
    if (Math.abs(next - lastDragTick.current) >= 18) {
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
    <div className="mx-auto w-full max-w-[20.5rem] sm:max-w-[22.5rem]">
      <div className="relative mx-auto aspect-square w-full">
        <p id={labelId} className="sr-only">
          Kolečko trezoru. Ťahajte, kliknite na kategóriu, alebo použite šípky.
        </p>
        <span className="brass-notch" aria-hidden="true" />

        <div
          ref={wheelRef}
          className="absolute inset-0 select-none"
          role="slider"
          tabIndex={0}
          aria-labelledby={labelId}
          aria-valuemin={0}
          aria-valuemax={CHAMBERS.length - 1}
          aria-valuenow={index}
          aria-valuetext={`${chamber.short}, kombinácia ${chamber.combo}`}
          onKeyDown={onKeyDown}
        >
          <div className="dial-steel-well absolute inset-0 rounded-full p-3 sm:p-3.5">
            <div
              className="dial-steel-face relative h-full w-full cursor-grab touch-none rounded-full active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <div
                className="pointer-events-none absolute inset-0 will-change-transform"
                style={{ transform: `rotate(${-rotation}deg)` }}
              >
                {CHAMBERS.map((item, i) => {
                  const selected = i === index;
                  const upright = rotation - i * CHAMBER_STEP;
                  return (
                    <span
                      key={item.id}
                      className="pointer-events-none absolute inset-0"
                      style={{ transform: `rotate(${i * CHAMBER_STEP}deg)` }}
                    >
                      <span
                        className={`mx-auto mt-3 block h-2 w-px rounded-full ${selected ? "bg-brass" : "bg-hub/30"}`}
                        aria-hidden="true"
                      />
                      <button
                        type="button"
                        className={`steel-num pointer-events-auto absolute top-[6%] left-1/2 ${selected ? "is-on" : ""}`}
                        style={{ transform: `translateX(-50%) rotate(${upright}deg)` }}
                        aria-pressed={selected}
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={() =>
                          springTo(shortestRotationToIndex(rotationRef.current, i), i)
                        }
                      >
                        <span className="block font-display text-[13px] leading-none tracking-[0.14em]">
                          {item.combo}
                        </span>
                        <span className="mt-0.5 block text-[8px] leading-tight font-semibold tracking-[0.08em] uppercase">
                          {item.rim}
                        </span>
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
            <div
              className="dial-glint pointer-events-none absolute inset-3 rounded-full sm:inset-3.5"
              style={{ "--glint-x": `${glint.x}%`, "--glint-y": `${glint.y}%` } as React.CSSProperties}
            />
          </div>

          <div className="dial-hub pointer-events-none absolute top-1/2 left-1/2 z-10 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full">
            <span className="text-[9px] font-semibold tracking-[0.28em] text-white/55">SP</span>
            <span className="mt-1 font-display text-[2rem] leading-none font-semibold text-[#f3efe4]">
              {chamber.combo}
            </span>
            <span className="mt-2 flex gap-1" aria-hidden="true">
              {CHAMBERS.map((dot, i) => (
                <span
                  key={dot.id}
                  className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-brass" : "bg-white/25"}`}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChamberCard({ chamber }: { chamber: Chamber }) {
  const [more, setMore] = useState(false);

  useEffect(() => {
    setMore(false);
  }, [chamber.id]);

  const href = chamber.id === "recenzie" ? "#recenzie" : "#kontakt";

  return (
    <article key={chamber.id} className="door-tick door-panel">
      <div className="door-panel-inner px-6 py-7 sm:px-8 sm:py-8">
        <p className="metal-plate font-display text-sm font-semibold">{chamber.combo}</p>
        <h2 className="mt-4 font-display text-[1.85rem] leading-[1.08] font-semibold tracking-[-0.03em] text-ink sm:text-[2.15rem]">
          {chamber.doorTitle}
        </h2>
        <ul className="mt-5 space-y-2.5">
          {chamber.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink/80">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full neu-press" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        {more ? (
          <p className="mt-4 text-[15px] leading-relaxed text-mute">{chamber.body}</p>
        ) : null}
        <button
          type="button"
          className="mt-4 min-h-10 text-[12px] tracking-[0.12em] text-accent-soft uppercase"
          onClick={() => setMore((value) => !value)}
          aria-expanded={more}
        >
          {more ? "menej" : "viac"}
        </button>
        <a
          href={href}
          className="group mt-5 flex min-h-12 w-fit items-center gap-3 rounded-full neu-raised px-5 py-2 text-sm text-ink"
        >
          {chamber.cta}
          <span className="flex h-8 w-8 items-center justify-center rounded-full neu-inset-sm text-brass-deep transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </div>
    </article>
  );
}

export function WaxSeal({ size = "sm" }: { size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "h-16 w-16 text-sm" : "h-10 w-10 text-[10px]";
  return (
    <span
      className={`wax-seal relative inline-flex shrink-0 items-end justify-center overflow-hidden rounded-full ${dim}`}
      aria-hidden="true"
    >
      <span className="wax-silhouette absolute top-[18%] left-1/2 h-[46%] w-[38%] -translate-x-1/2 rounded-[45%_45%_40%_40%]" />
      <span className="relative mb-[18%] font-display font-semibold tracking-[0.12em] text-[#f3e2c4]">
        SP
      </span>
    </span>
  );
}
