let audioCtx: AudioContext | null = null;

type HapticKind = "grab" | "drag" | "step" | "snap";

const FEEL: Record<HapticKind, { vibrate: number | number[]; freq: number; gain: number }> = {
  grab: { vibrate: 12, freq: 110, gain: 0.045 },
  drag: { vibrate: 5, freq: 240, gain: 0.028 },
  step: { vibrate: 14, freq: 168, gain: 0.05 },
  snap: { vibrate: [10, 18, 22], freq: 124, gain: 0.06 },
};

function context(): AudioContext | null {
  const Ctor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx || audioCtx.state === "closed") audioCtx = new Ctor();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hapticTick(kind: HapticKind) {
  try {
    if (reducedMotion()) return;
    const feel = FEEL[kind];

    try {
      navigator.vibrate?.(feel.vibrate);
    } catch {
      /* some WebViews throw on vibrate */
    }

    const ctx = context();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = kind === "drag" ? "square" : "triangle";
    osc.frequency.setValueAtTime(feel.freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(60, feel.freq * 0.45), t + 0.04);
    gain.gain.setValueAtTime(feel.gain, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + (kind === "snap" ? 0.08 : 0.05));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  } catch {
    /* ignore locked autoplay / missing audio */
  }
}

export function armHaptics() {
  try {
    const ctx = context();
    if (ctx?.state === "suspended") void ctx.resume();
  } catch {
    /* ignore */
  }
}
