import { State } from './state.js';
import { Sounds } from './sounds.js';
import { showToast, updateSavedBadge } from './ui.js';
import { addXP } from './xp.js';

let timerInterval = null;
let currentCourse = null;

export function showPreview(course) {
  currentCourse = course;
  const overlay = document.getElementById('lesson-preview');
  if (!overlay) return;

  document.getElementById('preview-emoji').textContent = course.emoji;
  document.getElementById('preview-text').textContent  =
    course.preview?.content ?? `Visste du att "${course.title}" kan förändra din karriär?`;

  // Reset state
  const footer = overlay.querySelector('.preview-footer');
  const fill   = overlay.querySelector('.preview-progress-fill');
  const timer  = document.getElementById('preview-timer');
  if (footer) footer.classList.remove('visible');
  if (fill)   fill.style.width = '100%';
  if (timer)  { timer.textContent = '60s'; timer.classList.remove('done'); }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Slight delay so the CSS transition has painted before we start shrinking
  requestAnimationFrame(() => requestAnimationFrame(() => startTimer(60, overlay)));
}

function startTimer(total, overlay) {
  clearInterval(timerInterval);
  let remaining = total;
  const timerEl = document.getElementById('preview-timer');
  const fillEl  = overlay.querySelector('.preview-progress-fill');

  const tick = () => {
    if (timerEl) timerEl.textContent = `${remaining}s`;
    if (fillEl)  fillEl.style.width  = `${(remaining / total) * 100}%`;
    if (remaining <= 0) {
      clearInterval(timerInterval);
      onComplete(overlay);
      return;
    }
    remaining--;
  };

  tick();
  timerInterval = setInterval(tick, 1000);
}

function onComplete(overlay) {
  addXP(25);
  Sounds.play('xp');
  const timerEl = document.getElementById('preview-timer');
  if (timerEl) { timerEl.textContent = '✓ Klar!'; timerEl.classList.add('done'); }
  const footer = overlay.querySelector('.preview-footer');
  if (footer) footer.classList.add('visible');
}

export function closePreview() {
  clearInterval(timerInterval);
  document.getElementById('lesson-preview')?.classList.remove('open');
  document.body.style.overflow = '';
}

export function initPreview() {
  const overlay = document.getElementById('lesson-preview');
  if (!overlay) return;

  document.getElementById('preview-close')?.addEventListener('click', closePreview);
  document.getElementById('preview-dismiss')?.addEventListener('click', closePreview);

  document.getElementById('preview-save')?.addEventListener('click', () => {
    if (!currentCourse) return;
    State.saveCourse(currentCourse.id);
    updateSavedBadge();
    Sounds.play('save');
    showToast(`🔖 Sparad: "${currentCourse.title}"`, 'toast-save');
    closePreview();
  });
}
