import { STUDY_CONTENT } from './study-content.js';
import { getCourses } from './courses.js';
import { State } from './state.js';
import { addXP } from './xp.js';
import { Sounds } from './sounds.js';
import { showToast } from './ui.js';

let activeCourse  = null;
let cards         = [];
let currentCard   = 0;
const XP_PER_CARD = 8;
const XP_COMPLETE = 20;

// ─── Public API ────────────────────────────────────────────────────────

export function initStudy() {
  document.getElementById('study-close')?.addEventListener('click', closeStudy);
  document.getElementById('study-next')?.addEventListener('click', nextCard);
  document.getElementById('study-prev')?.addEventListener('click', prevCard);
  document.getElementById('study-save-btn')?.addEventListener('click', saveFromStudy);
  document.getElementById('study-done-btn')?.addEventListener('click', closeStudy);
  document.getElementById('study-retry-btn')?.addEventListener('click', () => {
    currentCard = 0;
    showCard(currentCard);
    document.getElementById('study-complete').style.display  = 'none';
    document.getElementById('study-nav-bar').style.display   = '';
    document.getElementById('study-card-wrap').style.display = 'flex';
  });
}

export function openStudy(courseId) {
  const course  = getCourses().find(c => c.id === courseId);
  const content = STUDY_CONTENT[courseId];

  const overlay = document.getElementById('study-overlay');
  if (!overlay || !course) return;

  if (!content) {
    showToast('📖 Innehåll kommer snart!', 'toast-save');
    return;
  }

  activeCourse = course;
  cards        = content.cards;
  currentCard  = 0;

  // Fill header
  document.getElementById('study-course-emoji').textContent = course.emoji;
  document.getElementById('study-course-title').textContent = course.title;

  // Reset screens
  document.getElementById('study-card-wrap').style.display = 'flex';
  document.getElementById('study-complete').style.display  = 'none';

  showCard(0);
  overlay.classList.add('open');
}

// ─── Card rendering ────────────────────────────────────────────────────

function showCard(idx) {
  const card  = cards[idx];
  const total = cards.length;

  document.getElementById('study-card-num').textContent   = `${idx + 1} / ${total}`;
  document.getElementById('study-progress-fill').style.width = `${((idx + 1) / total) * 100}%`;

  const bodyEl = document.getElementById('study-card-wrap');
  bodyEl.classList.remove('card-enter');
  void bodyEl.offsetWidth;
  bodyEl.classList.add('card-enter');

  document.getElementById('study-card-title').textContent = card.title;
  document.getElementById('study-card-body').innerHTML    = formatBody(card.body);

  const insightEl = document.getElementById('study-insight');
  if (card.insight) {
    insightEl.textContent = card.insight;
    insightEl.style.display = 'block';
  } else {
    insightEl.style.display = 'none';
  }

  // Button states
  document.getElementById('study-prev').style.opacity      = idx === 0 ? '0.3' : '1';
  document.getElementById('study-prev').style.pointerEvents = idx === 0 ? 'none' : 'auto';
  const nextBtn = document.getElementById('study-next');
  nextBtn.innerHTML = idx === total - 1
    ? 'Avsluta lektion 🎓'
    : 'Nästa <i class="fas fa-arrow-right"></i>';
}

function formatBody(text) {
  return text
    .split('\n')
    .map(line => {
      if (line.startsWith('```')) return line;
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      line = line.replace(/`([^`]+)`/g, '<code>$1</code>');
      if (line.startsWith('•')) return `<span class="study-bullet">${line}</span>`;
      return line;
    })
    .join('\n')
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) =>
      `<pre class="study-code"><code>${escHtml(code.trim())}</code></pre>`
    )
    .split('\n')
    .map(line => line.startsWith('<') ? line : `<p>${line}</p>`)
    .join('');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Navigation ────────────────────────────────────────────────────────

function nextCard() {
  addXP(XP_PER_CARD);
  Sounds.play('xp');

  if (currentCard < cards.length - 1) {
    currentCard++;
    showCard(currentCard);
  } else {
    showComplete();
  }
}

function prevCard() {
  if (currentCard > 0) {
    currentCard--;
    showCard(currentCard);
  }
}

// ─── Completion ────────────────────────────────────────────────────────

function showComplete() {
  addXP(XP_COMPLETE);
  Sounds.play('levelup');

  document.getElementById('study-card-wrap').style.display = 'none';
  document.getElementById('study-nav-bar').style.display   = 'none';
  document.getElementById('study-complete').style.display  = 'flex';

  const totalXP = cards.length * XP_PER_CARD + XP_COMPLETE;
  const xpEl    = document.getElementById('study-complete-xp');
  countUp(xpEl, totalXP, 800);

  const alreadySaved = activeCourse && State.isSaved(activeCourse.id);
  const saveBtn = document.getElementById('study-save-btn');
  if (saveBtn) saveBtn.style.display = alreadySaved ? 'none' : 'inline-flex';

  spawnStudyConfetti();
}

function saveFromStudy() {
  if (!activeCourse) return;
  State.saveCourse(activeCourse.id);
  addXP(15);
  showToast(`🔖 Sparad: "${activeCourse.title}"`, 'toast-save');
  document.getElementById('study-save-btn').style.display = 'none';
}

function closeStudy() {
  document.getElementById('study-overlay')?.classList.remove('open');
  activeCourse = null;
}

// ─── Helpers ───────────────────────────────────────────────────────────

function countUp(el, target, duration) {
  let current = 0;
  const step = target / (duration / 16);
  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current);
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function spawnStudyConfetti() {
  const container = document.getElementById('study-complete');
  const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a29bfe', '#fd79a8'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${5 + Math.random() * 7}px;
      height: ${5 + Math.random() * 7}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.6}s;
      animation-duration: ${1.5 + Math.random() * 1}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 2800);
  }
}
