import { State } from './state.js';
import { Sounds } from './sounds.js';
import { showToast } from './ui.js';

const LEVELS = [0, 100, 300, 600, 1000, 1500, 2200, 3000];

export function getLevel(xp) {
  let level = 1;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i]) level = i + 1;
  }
  return level;
}

export function addXP(amount) {
  const before = State.getXP();
  const after  = State.addXP(amount);
  updateXPDisplay(after);
  if (getLevel(after) > getLevel(before)) onLevelUp(getLevel(after));
  return after;
}

export function updateXPDisplay(xp) {
  xp = xp ?? State.getXP();
  const level = getLevel(xp);
  const curr  = LEVELS[level - 1] ?? 0;
  const next  = LEVELS[level]     ?? null;

  const el = document.getElementById('xp-display');
  if (el) el.textContent = next ? `Lvl ${level} · ${xp}/${next} XP` : `Lvl ${level} · Max!`;

  const wrap = document.getElementById('nav-xp');
  if (wrap) wrap.style.display = '';

  // Progress bar under nav
  const fill = document.getElementById('xp-bar-fill');
  if (fill) {
    const pct = next ? Math.max(2, ((xp - curr) / (next - curr)) * 100) : 100;
    fill.style.width = `${pct}%`;
  }
}

function onLevelUp(level) {
  Sounds.play('levelup');
  showToast(`⚡ Level upp! Du är nu Nivå ${level}!`, 'toast-save');
}
