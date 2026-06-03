import { getCourses } from './courses.js';
import { State } from './state.js';
import { openModal } from './modal.js';

export function renderHomeSections() {
  renderTrending();
  renderRecommended();
  renderNew();
}

function renderTrending() {
  const courses  = getCourses();
  const trending = [...courses].sort((a, b) => (b.students ?? 0) - (a.students ?? 0)).slice(0, 10);
  renderRow('trending-row', trending);
}

function renderRecommended() {
  const courses   = getCourses();
  const savedIds  = State.getSaved();
  const interests = State.getInterests();
  let pool;

  if (savedIds.length > 0) {
    const savedCats = [...new Set(
      savedIds.map(id => courses.find(c => c.id === id)).filter(Boolean).map(c => c.category)
    )];
    pool = courses.filter(c => savedCats.includes(c.category) && !savedIds.includes(c.id));
    if (pool.length < 4) pool = shuffled(courses).slice(0, 10);
  } else if (interests.length > 0) {
    pool = courses.filter(c => interests.includes(c.category));
    if (pool.length < 4) pool = shuffled(courses).slice(0, 10);
  } else {
    pool = shuffled(courses).slice(0, 10);
  }

  renderRow('recommended-row', shuffled(pool).slice(0, 10));
}

function renderNew() {
  const courses = getCourses();
  const newest  = [...courses].sort((a, b) => b.id - a.id).slice(0, 10);
  renderRow('new-row', newest);
}

function renderRow(rowId, courses) {
  const row = document.getElementById(rowId);
  if (!row) return;

  row.innerHTML = courses.map(c => {
    const lv = { 'Nybörjare': 'lv-beginner', 'Medel': 'lv-inter', 'Avancerad': 'lv-advanced' }[c.level] || '';
    return `
      <div class="trending-card" data-id="${c.id}">
        <div class="trending-card-img" style="background:${c.color};">${c.emoji}</div>
        <div class="trending-card-body">
          <div class="trending-card-cat">${c.category}</div>
          <div class="trending-card-title">${c.title}</div>
          <div class="trending-card-meta">
            <span class="result-level ${lv}">${c.level}</span>
            ${c.rating ? `<span class="trending-card-rating">⭐ ${c.rating.toFixed(1)}</span>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');

  row.querySelectorAll('.trending-card').forEach(card =>
    card.addEventListener('click', () => {
      const course = courses.find(c => c.id === parseInt(card.dataset.id));
      if (course) openModal(course);
    })
  );
}

function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
