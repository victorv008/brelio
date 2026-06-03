import { State } from './state.js';
import { Sounds } from './sounds.js';
import { showToast, updateSavedBadge } from './ui.js';
import { addXP } from './xp.js';

let currentCourse = null;

export function openModal(course) {
  currentCourse = course;
  const overlay = document.getElementById('course-modal');
  if (!overlay) return;

  document.getElementById('modal-emoji').textContent = course.emoji;
  document.getElementById('modal-cat').textContent   = course.category;
  document.getElementById('modal-title').textContent = course.title;
  document.getElementById('modal-desc').textContent  = course.description || '';

  const lv = { 'Nybörjare': 'lv-beginner', 'Medel': 'lv-inter', 'Avancerad': 'lv-advanced' }[course.level] || '';
  document.getElementById('modal-stats').innerHTML = `
    <div class="modal-stat">
      <div class="modal-stat-val">${course.hours}h</div>
      <div class="modal-stat-label">Längd</div>
    </div>
    <div class="modal-stat">
      <div class="modal-stat-val">${course.lessons ?? '—'}</div>
      <div class="modal-stat-label">Lektioner</div>
    </div>
    <div class="modal-stat">
      <div class="modal-stat-val"><span class="result-level ${lv}">${course.level}</span></div>
      <div class="modal-stat-label">Nivå</div>
    </div>
    ${course.rating ? `<div class="modal-stat">
      <div class="modal-stat-val">⭐ ${course.rating.toFixed(1)}</div>
      <div class="modal-stat-label">Betyg</div>
    </div>` : ''}
    ${course.students ? `<div class="modal-stat">
      <div class="modal-stat-val">👥 ${course.students.toLocaleString('sv-SE')}</div>
      <div class="modal-stat-label">Studenter</div>
    </div>` : ''}
  `;

  document.getElementById('modal-tags').innerHTML =
    course.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  document.getElementById('course-modal')?.classList.remove('open');
  document.body.style.overflow = '';
}

export function initModal() {
  const overlay = document.getElementById('course-modal');
  if (!overlay) return;

  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  document.getElementById('modal-save-btn')?.addEventListener('click', () => {
    if (!currentCourse) return;
    State.saveCourse(currentCourse.id);
    addXP(15);
    updateSavedBadge();
    Sounds.play('save');
    showToast(`🔖 Sparad: "${currentCourse.title}"`, 'toast-save');
    closeModal();
  });

  document.getElementById('modal-start-btn')?.addEventListener('click', () => {
    if (!currentCourse) return;
    State.saveCourse(currentCourse.id);
    addXP(15);
    updateSavedBadge();
    Sounds.play('save');
    showToast(`🚀 Sparad & redo att börja!`, 'toast-save');
    closeModal();
  });

  // Swipe-down to dismiss on mobile
  const sheet = overlay.querySelector('.modal-sheet');
  let startY = 0;
  sheet?.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
  sheet?.addEventListener('touchmove',  e => {
    const dy = e.touches[0].clientY - startY;
    if (dy > 0) sheet.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  sheet?.addEventListener('touchend', e => {
    const dy = e.changedTouches[0].clientY - startY;
    if (dy > 100) { closeModal(); }
    else { sheet.style.transform = ''; }
  });
}
