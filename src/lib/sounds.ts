// Casino sound effects synthesized via Web Audio API
const audioCtx = () => new (window.AudioContext || (window as any).webkitAudioContext)();

let tickCtx: AudioContext | null = null;

export function playTick(pitch: number = 1) {
  try {
    if (!tickCtx || tickCtx.state === "closed") tickCtx = audioCtx();
    const ctx = tickCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 600 * pitch;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
}

// Rising tone that follows the count-up progress (0 to 1)
let rewardTickCtx: AudioContext | null = null;

export function ensureRewardTickCtx() {
  try {
    if (!rewardTickCtx || rewardTickCtx.state === "closed") rewardTickCtx = audioCtx();
  } catch {}
}

// Casino-style tick for reward counter — short metallic click
export function playRewardTick(progress: number) {
  try {
    ensureRewardTickCtx();
    const ctx = rewardTickCtx!;

    // Base frequency rises gently: 800 → 1400 Hz (not harsh)
    const freq = 800 + progress * 600;
    const duration = 0.04 + (1 - progress) * 0.03; // 70ms → 40ms as it accelerates
    const vol = 0.04 + progress * 0.04; // subtle, grows slightly

    // Primary tick — triangle wave for soft metallic feel
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);

    // Subtle second harmonic for "coin" texture
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2.5;
    gain2.gain.setValueAtTime(vol * 0.25, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration * 0.6);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start();
    osc2.stop(ctx.currentTime + duration * 0.6);
  } catch {}
}

export function closeRewardTickCtx() {
  // no-op, keep ctx alive for reuse
}

export function playWinSound() {
  try {
    const ctx = audioCtx();

    // Big impact hit
    const impact = ctx.createOscillator();
    const impactGain = ctx.createGain();
    impact.type = "sine";
    impact.frequency.value = 150;
    impactGain.gain.setValueAtTime(0.2, ctx.currentTime);
    impactGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    impact.connect(impactGain).connect(ctx.destination);
    impact.start();
    impact.stop(ctx.currentTime + 0.3);

    // Fanfare arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.5);
    });

    // Final shimmer sweep
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(1200, ctx.currentTime + 0.5);
    shimmer.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 1.0);
    shimmerGain.gain.setValueAtTime(0.06, ctx.currentTime + 0.5);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    shimmer.connect(shimmerGain).connect(ctx.destination);
    shimmer.start(ctx.currentTime + 0.5);
    shimmer.stop(ctx.currentTime + 1.2);
  } catch {}
}

export function playFinalDing() {
  try {
    const ctx = audioCtx();
    // Soft chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 1568; // G6
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);

    // Gentle harmonic
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 2349; // D7
    gain2.gain.setValueAtTime(0.06, ctx.currentTime + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.05);
    osc2.stop(ctx.currentTime + 0.6);
  } catch {}
}

export function playSuspenseTick() {
  try {
    const ctx = audioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 440;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

export function playDrumroll() {
  try {
    const ctx = audioCtx();
    const duration = 2;
    const steps = 30;

    for (let i = 0; i < steps; i++) {
      const t = ctx.currentTime + (i / steps) * duration;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 100 + Math.random() * 60;
      const vol = 0.02 + (i / steps) * 0.06;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  } catch {}
}

export function playSlotWin() {
  try {
    const ctx = audioCtx();
    // Rapid ascending chimes
    const notes = [880, 1108.73, 1318.51, 1567.98, 2093];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
    // Final ding
    const ding = ctx.createOscillator();
    const dingGain = ctx.createGain();
    ding.type = "sine";
    ding.frequency.value = 2637;
    const dingStart = ctx.currentTime + notes.length * 0.12;
    dingGain.gain.setValueAtTime(0.18, dingStart);
    dingGain.gain.exponentialRampToValueAtTime(0.001, dingStart + 0.5);
    ding.connect(dingGain).connect(ctx.destination);
    ding.start(dingStart);
    ding.stop(dingStart + 0.5);
  } catch {}
}

export function playLandingClick() {
  try {
    const ctx = audioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);

    // Second harmonic click
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.value = 2400;
    gain2.gain.setValueAtTime(0.08, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.08);
  } catch {}
}
