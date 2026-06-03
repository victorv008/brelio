import { State } from './state.js';

export function checkAndUpdateStreak() {
  const streak = State.updateStreak();
  updateStreakDisplay(streak.count);
  return streak;
}

export function initStreak() {
  const streak = State.getStreak();
  updateStreakDisplay(streak.count);
}

function updateStreakDisplay(count) {
  const el   = document.getElementById('streak-count');
  const wrap = document.getElementById('nav-streak');
  if (!el || !wrap) return;
  if (count > 0) {
    el.textContent = count;
    wrap.style.display = '';
  } else {
    wrap.style.display = 'none';
  }
}
