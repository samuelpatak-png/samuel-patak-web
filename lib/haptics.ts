let audioCtx: AudioContext | null = null;

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

export function hapticTick(kind: "step" | "snap") {
  try {
    if (reducedMotion()) return;

    try {
      navigator.vibrate?.(kind === "snap" ? [6, 14, 18] : 7);
    } catch {
      /* some WebViews throw on vibrate */
    }

    const ctx = context();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(kind === "snap" ? 132 : 196, t);
    osc.frequency.exponentialRampToValueAtTime(72, t + 0.045);
    gain.gain.setValueAtTime(kind === "snap" ? 0.038 : 0.02, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
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
