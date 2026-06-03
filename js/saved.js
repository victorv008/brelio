import { State } from './state.js';
import { getCourses } from './courses.js';
import { staggerIn } from './animations.js';
import { updateSavedBadge } from './ui.js';
import { openStudy } from './study.js';

export function renderSaved() {
  const el = document.getElementById('saved-list');
  if (!el) return;

  const savedIds = State.getSaved();
  const courses  = getCourses();
  const saved    = savedIds.map(id => courses.find(c => c.id === id)).filter(Boolean);

  if (!saved.length) {
    el.innerHTML = `
      <div class="saved-empty">
        <i class="fas fa-bookmark"></i>
        <p>Du har inga sparade kurser ännu.<br>Swipa eller bläddra för att spara!</p>
      </div>`;
    return;
  }

  el.innerHTML = `<div class="saved-list">${saved.map(c => `
    <div class="saved-item" data-id="${c.id}">
      <div class="saved-emoji">${c.emoji}</div>
      <div class="saved-info">
        <div class="saved-item-title">${c.title}</div>
        <div class="saved-item-meta">${c.category} · ${c.hours}h · ${c.level}</div>
      </div>
      <div class="saved-item-actions">
        <button class="study-btn" data-id="${c.id}">📖 Lär dig</button>
        <button class="remove-btn" data-id="${c.id}"><i class="fas fa-times"></i></button>
      </div>
    </div>`).join('')}</div>`;

  el.querySelectorAll('.study-btn').forEach(btn =>
    btn.addEventListener('click', () => openStudy(parseInt(btn.dataset.id)))
  );
  el.querySelectorAll('.remove-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      State.removeSaved(parseInt(btn.dataset.id));
      updateSavedBadge();
      renderSaved();
    })
  );

  staggerIn([...el.querySelectorAll('.saved-item')], 0, 60);
}
