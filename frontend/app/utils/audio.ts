/**
 * Epikor Soundtrack & Synthesized Web Audio Telemetry System
 * Plays the official Epikor soundtrack alongside tactical Web Audio mechanical effects.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = false;
let soundtrackAudio: HTMLAudioElement | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function getSoundtrack(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!soundtrackAudio) {
    soundtrackAudio = new Audio("/media/epikor_soundtrack.mp3");
    soundtrackAudio.loop = true;
    soundtrackAudio.volume = 0.35;
    soundtrackAudio.preload = "metadata";
  }
  return soundtrackAudio;
}

export function playSoundtrack(): void {
  const audio = getSoundtrack();
  if (!audio) return;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked by browser policy; will resume upon user gesture
    });
  }
}

export function pauseSoundtrack(): void {
  if (soundtrackAudio) {
    soundtrackAudio.pause();
  }
}

/** Duck soundtrack volume when facility demo video is unmuted */
export function duckSoundtrack(isDucked: boolean): void {
  if (soundtrackAudio) {
    soundtrackAudio.volume = isDucked ? 0.08 : 0.35;
  }
}

export function isAudioEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return soundEnabled;
}

export function setAudioEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("z53_audio", enabled ? "1" : "0");
      window.dispatchEvent(new CustomEvent("z53_audio_change", { detail: enabled }));
    } catch {}

    if (enabled) {
      playSoundtrack();
      playTelemetryPing(true);
    } else {
      pauseSoundtrack();
    }
  }
}

export function toggleAudio(): boolean {
  const next = !soundEnabled;
  setAudioEnabled(next);
  return next;
}

// Audio is OFF by default. Music and effects start strictly upon explicit user interaction with the audio button.

/** Subtle mechanical micro-click for typing / hovering */
export function playMechanicalClick(frequency = 1200): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch {}
}

/** Telemetry ping for focus, section changes, or radar blips */
export function playTelemetryPing(high = false): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    const freq = high ? 1760 : 880;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch {}
}

/** Heavy mechanical stamp impact for sealing classified documents */
export function playHeavyStampSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Sub-bass thump
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(140, now);
    osc1.frequency.exponentialRampToValueAtTime(32, now + 0.25);
    gain1.gain.setValueAtTime(0.28, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Mechanical snap/friction
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(480, now);
    osc2.frequency.exponentialRampToValueAtTime(80, now + 0.06);
    gain2.gain.setValueAtTime(0.08, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.07);
  } catch {}
}

/** Two-tone harmonic confirmation when clearance is authorized */
export function playAuthorizationChord(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    [523.25, 659.25, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.05, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.4);
    });
  } catch {}
}
