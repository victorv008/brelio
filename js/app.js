import { loadCourses } from './courses.js';
import { initSwipe } from './swipe.js';
import { initSearch, renderSearch } from './search.js';
import { renderSaved } from './saved.js';
import { initStreak } from './streak.js';
import { updateXPDisplay } from './xp.js';
import { initCountUpStats } from './animations.js';
import { updateSavedBadge } from './ui.js';
import { initModal } from './modal.js';
import { initPreview } from './preview.js';
import { renderHomeSections } from './home.js';
import { checkOnboarding, initOnboarding } from './onboarding.js';
import { initQuiz } from './quiz.js';
import { initStudy } from './study.js';

async function init() {
  await loadCourses();

  initStreak();
  updateXPDisplay();
  updateSavedBadge();
  initSwipe();
  initSearch();
  renderSearch();
  initModal();
  initPreview();
  initCountUpStats();
  renderHomeSections();
  initStudy();
  initQuiz();
  initOnboarding();
  checkOnboarding();
  setupNav();
  setupHomeSearch();
}

function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active', 'page-enter'));
  document.querySelectorAll('.nav-btn, .bottom-nav-btn').forEach(b => b.classList.remove('active'));

  const pageEl = document.getElementById(page);
  if (pageEl) {
    pageEl.classList.add('active');
    requestAnimationFrame(() => pageEl.classList.add('page-enter'));
  }

  document.querySelectorAll(`[data-page="${page}"]`).forEach(b => b.classList.add('active'));

  if (page === 'saved-page')  renderSaved();
  if (page === 'search-page') renderSearch();
  if (page === 'home')        renderHomeSections();

  updateSavedBadge();
}

function setupNav() {
  document.querySelectorAll('[data-page]').forEach(btn =>
    btn.addEventListener('click', () => goTo(btn.dataset.page))
  );
  document.querySelector('.nav-logo')?.addEventListener('click', () => goTo('home'));
}

function setupHomeSearch() {
  document.getElementById('home-search-input')?.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const q = e.target.value.trim();
    goTo('search-page');
    setTimeout(() => {
      const si = document.getElementById('search-input');
      if (si) { si.value = q; renderSearch(); }
    }, 50);
  });
}

init();
