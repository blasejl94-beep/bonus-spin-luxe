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
let countUpCtx: AudioContext | null = null;
let countUpOsc: OscillatorNode | null = null;
let countUpGain: GainNode | null = null;

export function startCountUpSound() {
  try {
    countUpCtx = audioCtx();
    countUpOsc = countUpCtx.createOscillator();
    countUpGain = countUpCtx.createGain();
    countUpOsc.type = "sine";
    countUpOsc.frequency.value = 200;
    countUpGain.gain.value = 0.06;
    countUpOsc.connect(countUpGain).connect(countUpCtx.destination);
    countUpOsc.start();
  } catch {}
}

export function updateCountUpSound(progress: number) {
  try {
    if (!countUpOsc || !countUpGain || !countUpCtx) return;
    // Frequency rises from 200Hz to 900Hz
    const freq = 200 + progress * 700;
    countUpOsc.frequency.setTargetAtTime(freq, countUpCtx.currentTime, 0.02);
    // Volume rises slightly
    const vol = 0.04 + progress * 0.08;
    countUpGain.gain.setTargetAtTime(vol, countUpCtx.currentTime, 0.02);

    // Add rapid ticks at higher progress for slot-machine feel
    if (progress > 0.3 && Math.random() < 0.3) {
      const tickOsc = countUpCtx.createOscillator();
      const tickGain = countUpCtx.createGain();
      tickOsc.type = "triangle";
      tickOsc.frequency.value = freq * 1.5;
      tickGain.gain.setValueAtTime(0.03, countUpCtx.currentTime);
      tickGain.gain.exponentialRampToValueAtTime(0.001, countUpCtx.currentTime + 0.03);
      tickOsc.connect(tickGain).connect(countUpCtx.destination);
      tickOsc.start();
      tickOsc.stop(countUpCtx.currentTime + 0.03);
    }
  } catch {}
}

export function stopCountUpSound() {
  try {
    if (countUpGain && countUpCtx) {
      countUpGain.gain.setTargetAtTime(0, countUpCtx.currentTime, 0.05);
    }
    setTimeout(() => {
      try { countUpOsc?.stop(); } catch {}
      countUpOsc = null;
      countUpGain = null;
    }, 200);
  } catch {}
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
