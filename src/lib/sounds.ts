// Premium casino sound effects — Web Audio API
// Design: warm sine tones, low volumes, long decays, musical intervals

const audioCtx = () => new (window.AudioContext || (window as any).webkitAudioContext)();

// ─── Shared context for high-frequency calls ───

let tickCtx: AudioContext | null = null;
function getTickCtx() {
  if (!tickCtx || tickCtx.state === "closed") tickCtx = audioCtx();
  return tickCtx;
}

let rewardTickCtx: AudioContext | null = null;

export function ensureRewardTickCtx() {
  try {
    if (!rewardTickCtx || rewardTickCtx.state === "closed") rewardTickCtx = audioCtx();
  } catch {}
}

export function closeRewardTickCtx() {
  // keep alive for reuse
}

// ─── Helper: play a soft sine tone ───

function softTone(
  ctx: AudioContext,
  freq: number,
  vol: number,
  start: number,
  decay: number,
  type: OscillatorType = "sine",
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + decay);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + decay);
}

// ─── Wheel segment tick — soft muted tap ───

export function playTick(pitch: number = 1) {
  try {
    const ctx = getTickCtx();
    const now = ctx.currentTime;
    // Gentle low-mid tap instead of bright click
    softTone(ctx, 420 * pitch, 0.04, now, 0.035);
  } catch {}
}

// ─── Reward counter tick — subtle ascending bell ───

export function playRewardTick(progress: number) {
  try {
    ensureRewardTickCtx();
    const ctx = rewardTickCtx!;
    const now = ctx.currentTime;

    // Gentle rise: 500 → 900 Hz (warm range, not shrill)
    const freq = 500 + progress * 400;
    const duration = 0.05 + (1 - progress) * 0.03;
    const vol = 0.03 + progress * 0.025;

    softTone(ctx, freq, vol, now, duration);
    // Faint harmonic overtone for depth
    softTone(ctx, freq * 2, vol * 0.15, now, duration * 0.5);
  } catch {}
}

// ─── Win sound — warm celebratory chord (wheel result) ───

export function playWinSound() {
  try {
    const ctx = audioCtx();
    const now = ctx.currentTime;

    // Gentle ascending triad: C4 → E4 → G4 → C5
    const chord = [261.63, 329.63, 392, 523.25];
    chord.forEach((freq, i) => {
      const t = now + i * 0.12;
      softTone(ctx, freq, 0.07 - i * 0.008, t, 0.7);
    });

    // Warm sub-bass foundation
    softTone(ctx, 130.81, 0.06, now, 0.5);

    // Soft high shimmer at the end
    softTone(ctx, 1046.5, 0.025, now + 0.5, 0.8);
  } catch {}
}

// ─── Final ding — delicate resolved bell ───

export function playFinalDing() {
  try {
    const ctx = audioCtx();
    const now = ctx.currentTime;

    // Primary bell — G5 (not too high)
    softTone(ctx, 784, 0.08, now, 0.9);
    // Soft overtone — D5
    softTone(ctx, 587.33, 0.04, now + 0.04, 0.7);
  } catch {}
}

// ─── Suspense tick — muted heartbeat pulse ───

export function playSuspenseTick() {
  try {
    const ctx = audioCtx();
    const now = ctx.currentTime;
    // Low warm pulse instead of bright ping
    softTone(ctx, 220, 0.06, now, 0.12);
    softTone(ctx, 330, 0.02, now + 0.02, 0.08);
  } catch {}
}

// ─── Drumroll — refined soft tremolo build ───

export function playDrumroll() {
  try {
    const ctx = audioCtx();
    const now = ctx.currentTime;
    const duration = 2;
    const steps = 24;

    for (let i = 0; i < steps; i++) {
      const t = now + (i / steps) * duration;
      const progress = i / steps;
      // Warm sine taps that build gradually
      const freq = 180 + progress * 80;
      const vol = 0.015 + progress * 0.035;
      softTone(ctx, freq, vol, t, 0.07);
      // Subtle high harmonic for texture
      softTone(ctx, freq * 3, vol * 0.08, t, 0.04);
    }
  } catch {}
}

// ─── Slot win — elegant ascending resolution (wheel prize reveal) ───

export function playSlotWin() {
  try {
    const ctx = audioCtx();
    const now = ctx.currentTime;

    // Slow ascending major arpeggio: G4 → B4 → D5 → G5
    const notes = [392, 493.88, 587.33, 784];
    notes.forEach((freq, i) => {
      const t = now + i * 0.14;
      softTone(ctx, freq, 0.08 - i * 0.01, t, 0.5);
    });

    // Gentle resolve tone
    softTone(ctx, 1046.5, 0.03, now + 0.6, 0.6);
  } catch {}
}

// ─── Bonus confirmed — warm premium chord (celebration modal) ───

export function playBonusConfirmed() {
  try {
    const ctx = audioCtx();
    const now = ctx.currentTime;

    // Warm low tone — foundation
    softTone(ctx, 392, 0.09, now, 0.8);       // G4
    // Soft major third — warmth
    softTone(ctx, 493.88, 0.07, now + 0.08, 0.7); // B4
    // Gentle fifth — resolve
    softTone(ctx, 587.33, 0.06, now + 0.18, 0.9); // D5
    // Subtle octave shimmer — elegance
    softTone(ctx, 784, 0.035, now + 0.3, 1.1);    // G5
  } catch {}
}

// ─── Landing click — refined subtle tap ───

export function playLandingClick() {
  try {
    const ctx = audioCtx();
    const now = ctx.currentTime;
    // Single soft tone instead of harsh dual-click
    softTone(ctx, 600, 0.07, now, 0.1);
    softTone(ctx, 900, 0.025, now, 0.06);
  } catch {}
}
