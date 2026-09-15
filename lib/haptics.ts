let audioCtx: AudioContext | null = null;
let lastPulse = 0;
let switchInput: HTMLInputElement | null = null;
const rumbleBuffers = new Map<string, AudioBuffer>();

type HapticKind = "grab" | "drag" | "step" | "snap";

const GAP: Record<HapticKind, number> = {
  grab: 40,
  drag: 70,
  step: 80,
  snap: 100,
};

function context(): AudioContext | null {
  const Ctor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx || audioCtx.state === "closed") {
    try {
      audioCtx = new Ctor({ latencyHint: "interactive" });
    } catch {
      audioCtx = new Ctor();
    }
  }
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function appleSwitchTick() {
  try {
    if (!switchInput) {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.setAttribute("switch", "");
      input.setAttribute("aria-hidden", "true");
      input.tabIndex = -1;
      Object.assign(input.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "22px",
        height: "22px",
        opacity: "0",
        pointerEvents: "none",
        margin: "0",
        transform: "scale(0.01)",
        transformOrigin: "0 0",
      });
      document.body.appendChild(input);
      switchInput = input;
    }
    switchInput.click();
  } catch {
    /* Safari versions without switch, or haptic gated */
  }
}

function androidVibrate(kind: HapticKind) {
  if (typeof navigator.vibrate !== "function") return;
  try {
    const pattern =
      kind === "snap" ? [24, 32, 36] : kind === "grab" ? 28 : kind === "step" ? 32 : 22;
    navigator.vibrate(pattern);
  } catch {
    /* ignored */
  }
}

function makeRumble(ctx: AudioContext, kind: HapticKind): AudioBuffer {
  const duration = kind === "snap" ? 0.055 : kind === "drag" ? 0.022 : 0.036;
  const freq = kind === "drag" ? 78 : kind === "grab" ? 56 : 64;
  const n = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(2, n, ctx.sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  const decay = kind === "snap" ? 52 : 78;
  for (let i = 0; i < n; i++) {
    const t = i / ctx.sampleRate;
    const env = Math.exp(-t * decay);
    const wave = Math.sin(2 * Math.PI * freq * t) * env;
    const click = t < 0.0018 ? (1 - t / 0.0018) * 0.22 : 0;
    left[i] = wave * 0.9 + click;
    right[i] = -wave * 0.9 + click;
  }
  return buffer;
}

function playRumble(kind: HapticKind) {
  const ctx = context();
  if (!ctx) return;
  let buffer = rumbleBuffers.get(kind);
  if (!buffer || buffer.sampleRate !== ctx.sampleRate) {
    buffer = makeRumble(ctx, kind);
    rumbleBuffers.set(kind, buffer);
  }
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buffer;
  gain.gain.value = kind === "drag" ? 0.55 : 0.72;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}

function unlockAudio() {
  const ctx = context();
  if (!ctx) return;
  const silent = ctx.createBuffer(1, 1, ctx.sampleRate);
  const src = ctx.createBufferSource();
  src.buffer = silent;
  src.connect(ctx.destination);
  src.start(0);
  try {
    const session = (
      navigator as Navigator & { audioSession?: { type: string } }
    ).audioSession;
    if (session) session.type = "playback";
  } catch {
    /* Safari < 16.4 */
  }
}

export function hapticTick(kind: HapticKind) {
  if (reducedMotion()) return;
  const now = performance.now();
  if (now - lastPulse < GAP[kind]) return;
  lastPulse = now;

  appleSwitchTick();
  androidVibrate(kind);
  playRumble(kind);
}

export function armHaptics() {
  try {
    unlockAudio();
    appleSwitchTick();
  } catch {
    /* ignore */
  }
}
