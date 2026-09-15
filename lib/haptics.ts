let audioCtx: AudioContext | null = null;
let lastMotor = 0;

type HapticKind = "grab" | "drag" | "step" | "snap";

const FEEL: Record<
  HapticKind,
  { vibrate: number | number[]; gap: number; freq: number; gain: number }
> = {
  grab: { vibrate: 32, gap: 40, freq: 96, gain: 0.05 },
  drag: { vibrate: 28, gap: 55, freq: 210, gain: 0.03 },
  step: { vibrate: 40, gap: 70, freq: 150, gain: 0.055 },
  snap: { vibrate: [28, 40, 48], gap: 90, freq: 108, gain: 0.065 },
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

function pulseMotor(pattern: number | number[], gap: number) {
  const now = performance.now();
  if (now - lastMotor < gap) return;
  const vibrate =
    typeof navigator.vibrate === "function"
      ? navigator.vibrate.bind(navigator)
      : typeof (navigator as Navigator & { webkitVibrate?: (p: VibratePattern) => boolean })
            .webkitVibrate === "function"
        ? (navigator as Navigator & { webkitVibrate: (p: VibratePattern) => boolean })
            .webkitVibrate.bind(navigator)
        : null;
  if (!vibrate) return;
  lastMotor = now;
  try {
    vibrate(0);
    vibrate(pattern);
  } catch {
    /* ignored */
  }
}

export function hapticTick(kind: HapticKind) {
  if (reducedMotion()) return;
  const feel = FEEL[kind];
  pulseMotor(feel.vibrate, feel.gap);

  try {
    const ctx = context();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = kind === "drag" ? "square" : "triangle";
    osc.frequency.setValueAtTime(feel.freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(55, feel.freq * 0.42), t + 0.05);
    gain.gain.setValueAtTime(feel.gain, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + (kind === "snap" ? 0.09 : 0.055));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  } catch {
    /* ignore locked autoplay */
  }
}

export function armHaptics() {
  try {
    const ctx = context();
    if (ctx?.state === "suspended") void ctx.resume();
    if (typeof navigator.vibrate === "function") navigator.vibrate(1);
  } catch {
    /* ignore */
  }
}
