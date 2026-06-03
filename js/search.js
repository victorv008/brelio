import { getCourses } from './courses.js';
import { staggerIn } from './animations.js';
import { openModal } from './modal.js';

let activeCategory = null;

export function initSearch() {
  document.getElementById('search-input')?.addEventListener('input', () => renderSearch());
}

export function renderSearch() {
  const courses    = getCourses();
  const categories = [...new Set(courses.map(c => c.category))];
  const chips      = document.getElementById('category-chips');
  const grid       = document.getElementById('results-grid');
  if (!chips || !grid) return;

  chips.innerHTML =
    `<button class="chip ${!activeCategory ? 'active' : ''}" data-cat="">Alla</button>` +
    categories.map(c =>
      `<button class="chip ${activeCategory === c ? 'active' : ''}" data-cat="${c}">${c}</button>`
    ).join('');

  chips.querySelectorAll('.chip').forEach(chip =>
    chip.addEventListener('click', () => { activeCategory = chip.dataset.cat || null; renderSearch(); })
  );

  const q = (document.getElementById('search-input')?.value || '').toLowerCase();
  const filtered = courses.filter(c =>
    (!activeCategory || c.category === activeCategory) &&
    (!q || c.title.toLowerCase().includes(q) ||
           c.category.toLowerCase().includes(q) ||
           c.tags.some(t => t.toLowerCase().includes(q)))
  );

  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;padding:2rem 0;">Inga kurser hittades.</p>';
    return;
  }

  grid.innerHTML = filtered.map(c => {
    const lv = { 'Nybörjare': 'lv-beginner', 'Medel': 'lv-inter', 'Avancerad': 'lv-advanced' }[c.level] || '';
    return `
      <div class="result-card" data-id="${c.id}">
        <div class="result-card-img" style="background:${c.color};">${c.emoji}</div>
        <div class="result-card-body">
          <div class="result-cat">${c.category}</div>
          <div class="result-title">${c.title}</div>
          <div class="result-meta">
            <span class="result-level ${lv}">${c.level}</span>
            <span class="result-hours"><i class="fas fa-clock"></i> ${c.hours}h</span>
            ${c.rating ? `<span class="result-rating">⭐ ${c.rating.toFixed(1)}</span>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');

  grid.querySelectorAll('.result-card').forEach(card =>
    card.addEventListener('click', () => {
      const course = courses.find(c => c.id === parseInt(card.dataset.id));
      if (course) openModal(course);
    })
  );

  staggerIn([...grid.querySelectorAll('.result-card')], 0, 55);
}
