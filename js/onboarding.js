import { State } from './state.js';

const CATEGORIES = [
  { name: 'Programmering', emoji: '💻' },
  { name: 'Design',        emoji: '🎨' },
  { name: 'AI & Data',     emoji: '🤖' },
  { name: 'Business',      emoji: '📈' },
  { name: 'Kreativt',      emoji: '✨' },
  { name: 'Språk',         emoji: '🌍' },
  { name: 'Ekonomi',       emoji: '💰' },
  { name: 'Produktivitet', emoji: '⚡' },
  { name: 'Hälsa',         emoji: '🧘' },
  { name: 'Säkerhet',      emoji: '🔐' },
];

export function checkOnboarding() {
  if (!State.getOnboarded()) showOnboarding();
}

export function initOnboarding() {
  const overlay = document.getElementById('onboarding-overlay');
  if (!overlay) return;

  renderCategoryGrid();

  document.getElementById('onboarding-next-1')?.addEventListener('click', () => goToStep(1));

  document.getElementById('onboarding-next-2')?.addEventListener('click', () => {
    const selected = [...document.querySelectorAll('.onboarding-cat.selected')].map(b => b.dataset.cat);
    if (!selected.length) {
      // shake the grid to prompt selection
      const grid = document.getElementById('onboarding-cats');
      grid?.classList.add('shake');
      setTimeout(() => grid?.classList.remove('shake'), 500);
      return;
    }
    State.setInterests(selected);
    goToStep(2);
  });

  document.getElementById('onboarding-finish')?.addEventListener('click', () => {
    State.setOnboarded();
    overlay.classList.remove('open');
    // Refresh home sections with new interests
    import('./home.js').then(m => m.renderHomeSections());
  });
}

function showOnboarding() {
  goToStep(0);
  document.getElementById('onboarding-overlay')?.classList.add('open');
}

function goToStep(step) {
  document.querySelectorAll('.onboarding-step').forEach((el, i) =>
    el.classList.toggle('active', i === step)
  );
  document.querySelectorAll('.onboarding-dot').forEach((dot, i) =>
    dot.classList.toggle('active', i <= step)
  );
}

function renderCategoryGrid() {
  const grid = document.getElementById('onboarding-cats');
  if (!grid) return;

  grid.innerHTML = CATEGORIES.map(c => `
    <button class="onboarding-cat" data-cat="${c.name}">
      <span class="onboarding-cat-emoji">${c.emoji}</span>
      <span>${c.name}</span>
    </button>`).join('');

  grid.querySelectorAll('.onboarding-cat').forEach(btn =>
    btn.addEventListener('click', () => btn.classList.toggle('selected'))
  );
}
