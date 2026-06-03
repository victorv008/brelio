let ctx = null;
let muted = false;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function beep(freq, type, duration, vol = 0.12) {
  if (muted) return;
  try {
    const c = getCtx();
    const osc  = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  } catch {}
}

export const Sounds = {
  play(action) {
    switch (action) {
      case 'like':
        beep(523, 'sine', 0.12, 0.1);
        setTimeout(() => beep(659, 'sine', 0.1, 0.07), 80);
        break;
      case 'nope':
        beep(220, 'triangle', 0.18, 0.09);
        break;
      case 'save':
        beep(440, 'sine', 0.1, 0.09);
        setTimeout(() => beep(554, 'sine', 0.1, 0.07), 60);
        break;
      case 'xp':
        beep(880, 'sine', 0.07, 0.05);
        break;
      case 'levelup':
        [523, 659, 784, 1047].forEach((f, i) =>
          setTimeout(() => beep(f, 'sine', 0.14, 0.09), i * 80)
        );
        break;
    }
  },
  toggle() { muted = !muted; return muted; },
  isMuted: () => muted,
};
