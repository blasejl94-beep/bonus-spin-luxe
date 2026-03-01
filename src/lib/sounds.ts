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

export function playWinSound() {
  try {
    const ctx = audioCtx();

    // Fanfare arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.6);
    });

    // Shimmer sweep
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(800, ctx.currentTime + 0.5);
    shimmer.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 1.2);
    shimmerGain.gain.setValueAtTime(0.08, ctx.currentTime + 0.5);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
    shimmer.connect(shimmerGain).connect(ctx.destination);
    shimmer.start(ctx.currentTime + 0.5);
    shimmer.stop(ctx.currentTime + 1.4);
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
