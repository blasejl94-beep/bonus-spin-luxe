// Casino win sound synthesized via Web Audio API — no files needed
const audioCtx = () => new (window.AudioContext || (window as any).webkitAudioContext)();

export function playWinSound() {
  try {
    const ctx = audioCtx();

    // Fanfare arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
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
  } catch (e) {
    // Audio not supported — silently ignore
  }
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
  } catch (e) {}
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
      // Accelerating and crescendo
      const vol = 0.02 + (i / steps) * 0.06;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  } catch (e) {}
}
