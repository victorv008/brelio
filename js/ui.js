import { State } from './state.js';

export function showToast(msg, cls = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast ${cls}`;
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => t.classList.remove('show'), 2800);
}

export function updateSavedBadge() {
  const b = document.getElementById('saved-count-badge');
  const count = State.getSaved().length;
  if (b) b.textContent = count ? ` (${count})` : '';
}
