import { State } from './state.js';
import { getCourses } from './courses.js';
import { SPECIAL_CARDS } from './specials.js';
import { addXP } from './xp.js';
import { Sounds } from './sounds.js';
import { checkAndUpdateStreak } from './streak.js';
import { showToast, updateSavedBadge } from './ui.js';
import { showPreview } from './preview.js';
import { openStudy } from './study.js';

let deck        = [];
let currentIdx  = 0;
let isDragging  = false;
const abortControllers = new Map();
let initialized = false;

// ─── Deck ──────────────────────────────────────────────────────────────────

function buildDeck(courses) {
  const mixed = [];
  courses.forEach((course, i) => {
    mixed.push({ ...course, type: 'course' });
    if ((i + 1) % 4 === 0) {
      mixed.push(SPECIAL_CARDS[(Math.floor(i / 4)) % SPECIAL_CARDS.length]);
    }
  });
  return mixed;
}

// ─── Init ──────────────────────────────────────────────────────────────────

export function initSwipe() {
  deck       = buildDeck(getCourses());
  currentIdx = Math.min(State.getSwipeIndex(), deck.length - 1);
  if (!initialized) {
    setupKeyboard();
    setupActionButtons();
    initialized = true;
  }
  renderCards();
}

// ─── Render ────────────────────────────────────────────────────────────────

function renderCards() {
  const stack    = document.getElementById('card-stack');
  const doneCard = document.getElementById('done-card');
  if (!stack) return;

  [...stack.children].forEach(c => { if (c !== doneCard) c.remove(); });
  doneCard.classList.remove('visible');

  const actions = document.getElementById('swipe-actions');
  if (actions) { actions.style.opacity = '1'; actions.style.pointerEvents = 'auto'; }

  const visible = deck.slice(currentIdx, currentIdx + 3);
  if (!visible.length) { showDone(); return; }

  renderProgressBar();
  [...visible].reverse().forEach((item, i) =>
    stack.appendChild(createCard(item, i === visible.length - 1))
  );
}

function createCard(item, isTop) {
  const relIdx = deck.indexOf(item) - currentIdx;
  const posClass = relIdx === 0 ? 'top' : relIdx === 1 ? 'behind' : 'behind2';

  if (item.type === 'fact')  return createFactCard(item, isTop, posClass);
  if (item.type === 'quiz')  return createQuizCard(item, isTop, posClass);
  return createCourseCard(item, isTop, posClass);
}

function createCourseCard(course, isTop, posClass) {
  const div = document.createElement('div');
  div.className = `swipe-card course-card ${posClass}`;
  div.style.perspective = '1200px';
  if (isTop) {
    div.classList.add('entering');
    div.addEventListener('animationend', () => div.classList.remove('entering'), { once: true });
  }

  const lv       = { 'Nybörjare': 'lv-beginner', 'Medel': 'lv-inter', 'Avancerad': 'lv-advanced' }[course.level] || '';
  const students = course.students ? course.students.toLocaleString('sv-SE') : '';
  const rating   = course.rating?.toFixed(1) ?? '';
  const hours    = course.hours ?? '';
  const lessons  = course.lessons ?? '';

  div.innerHTML = `
    <div class="flip-inner">
      <div class="flip-front">
        <div class="card-bg" style="background:${course.color};">${course.emoji}</div>
        <div class="card-overlay"></div>
        <div class="swipe-stamp stamp-like">GILLAR ❤️</div>
        <div class="swipe-stamp stamp-nope">NOPE ✕</div>
        <div class="swipe-stamp stamp-save">SPARA 🔖</div>
        <div class="card-content">
          <div class="card-category">${course.category}</div>
          <div class="card-title">${course.title}</div>
          ${students || rating ? `<div class="card-social-proof">
            ${students ? `<span class="card-social-item">👥 ${students}</span>` : ''}
            ${rating   ? `<span class="card-social-item">⭐ ${rating}</span>` : ''}
          </div>` : ''}
          <div class="card-meta">
            <span class="card-meta-item"><i class="fas fa-clock"></i> ${hours}h</span>
            <span class="card-meta-item result-level ${lv}">${course.level}</span>
          </div>
          <div class="card-tags">${course.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}</div>
        </div>
        <div class="card-tap-hint">Tryck för info</div>
      </div>
      <div class="flip-back">
        <div class="flip-back-header">
          <button class="flip-back-close">✕</button>
        </div>
        <div class="flip-back-body">
          <div class="flip-back-emoji-row">${course.emoji}</div>
          <div class="flip-back-cat">${course.category}</div>
          <div class="flip-back-title">${course.title}</div>
          <p class="flip-back-desc">${course.description ?? ''}</p>
          <div class="flip-back-stats">
            ${hours    ? `<span class="flip-back-stat">🕒 ${hours}h</span>` : ''}
            ${lessons  ? `<span class="flip-back-stat">📖 ${lessons} lektioner</span>` : ''}
            ${rating   ? `<span class="flip-back-stat">⭐ ${rating}</span>` : ''}
            ${students ? `<span class="flip-back-stat">👥 ${students}</span>` : ''}
            <span class="flip-back-stat result-level ${lv}">${course.level}</span>
          </div>
          <div class="flip-back-tags">${course.tags.map(t => `<span class="flip-back-tag">${t}</span>`).join('')}</div>
        </div>
        <div class="flip-back-actions">
          <button class="flip-back-save">🔖 Spara</button>
          <button class="btn-swipe flip-back-study">📖 Lär dig</button>
        </div>
      </div>
    </div>`;

  if (isTop) {
    addDragListeners(div, course);

    const inner    = div.querySelector('.flip-inner');
    const flipBack = () => inner.classList.remove('flipped');

    div.querySelector('.flip-back-close').addEventListener('click', e => {
      e.stopPropagation(); flipBack();
    });
    div.querySelector('.flip-back').addEventListener('click', e => {
      if (!e.target.closest('button')) flipBack();
    });
    div.querySelector('.flip-back-save').addEventListener('click', e => {
      e.stopPropagation(); saveAction(course);
    });
    div.querySelector('.flip-back-study').addEventListener('click', e => {
      e.stopPropagation(); openStudy(course.id);
    });
  }
  return div;
}

function createFactCard(item, isTop, posClass) {
  const div = document.createElement('div');
  div.className = `swipe-card special-card ${posClass}`;
  div.style.background = item.color;
  if (isTop) {
    div.classList.add('entering');
    div.addEventListener('animationend', () => div.classList.remove('entering'), { once: true });
  }

  div.innerHTML = `
    <div class="swipe-stamp stamp-like">COOL! 🤩</div>
    <div class="swipe-stamp stamp-nope">NOPE ✕</div>
    <div class="swipe-stamp stamp-save">SPARA 🔖</div>
    <span class="special-card-badge">✨ Visste du att...?</span>
    <div class="special-card-emoji">${item.emoji}</div>
    <p class="special-card-text">${item.content}</p>
    <div class="special-card-footer">
      <span class="card-tag">${item.category}</span>
    </div>`;

  if (isTop) addDragListeners(div, item);
  return div;
}

function createQuizCard(item, isTop, posClass) {
  const div = document.createElement('div');
  div.className = `swipe-card special-card ${posClass}`;
  div.style.background = item.color;
  if (isTop) {
    div.classList.add('entering');
    div.addEventListener('animationend', () => div.classList.remove('entering'), { once: true });
  }

  div.innerHTML = `
    <div class="swipe-stamp stamp-like">RÄTT! ✓</div>
    <div class="swipe-stamp stamp-nope">NOPE ✕</div>
    <span class="special-card-badge">⚡ Snabbquiz +${item.xp} XP</span>
    <div class="special-card-emoji">${item.emoji}</div>
    <p class="quiz-question">${item.question}</p>
    <div class="quiz-options">
      ${item.options.map((opt, i) =>
        `<button class="quiz-option" data-index="${i}">${opt}</button>`
      ).join('')}
    </div>`;

  if (isTop) {
    // Quiz option interaction — answer before swiping
    div.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const chosen  = parseInt(btn.dataset.index);
        const correct = item.correctIndex;
        div.querySelectorAll('.quiz-option').forEach((b, i) => {
          if (i === correct) b.classList.add(chosen === correct ? 'correct' : 'reveal');
          else if (i === chosen) b.classList.add('wrong');
          else b.classList.add('wrong');
        });
        if (chosen === correct) {
          Sounds.play('like');
          addXP(item.xp ?? 10);
          showToast(`✓ Rätt svar! +${item.xp ?? 10} XP`, 'toast-like');
        } else {
          Sounds.play('nope');
          showToast(`✗ Rätt svar: ${item.options[correct]}`, 'toast-nope');
        }
        // Auto-swipe after feedback
        setTimeout(() => swipeCard('right'), 1600);
      });
    });

    addDragListeners(div, item);
  }
  return div;
}

// ─── Drag ─────────────────────────────────────────────────────────────────

function addDragListeners(card, item) {
  let startX, startY, hasMoved = false;
  const ac = new AbortController();
  const { signal } = ac;
  abortControllers.set(card, ac);

  const onStart = (x, y) => {
    if (card.querySelector('.flip-inner')?.classList.contains('flipped')) return;
    startX = x; startY = y; hasMoved = false;
    isDragging = true; card.style.transition = 'none';
  };

  const onMove = (x, y) => {
    if (!isDragging) return;
    const dx = x - startX, dy = y - startY;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) hasMoved = true;
    if (!hasMoved) return;

    card.style.transform = `translate(${dx}px,${dy}px) rotate(${dx * 0.07}deg)`;
    const like = card.querySelector('.stamp-like');
    const nope = card.querySelector('.stamp-nope');
    const save = card.querySelector('.stamp-save');
    if (!like || !nope) return;
    if (dy < -50 && Math.abs(dx) < 80) {
      if (save) save.style.opacity = Math.min(1, Math.abs(dy) / 100);
      like.style.opacity = nope.style.opacity = 0;
    } else if (dx > 30) {
      like.style.opacity = Math.min(1, dx / 100);
      nope.style.opacity = 0; if (save) save.style.opacity = 0;
    } else if (dx < -30) {
      nope.style.opacity = Math.min(1, Math.abs(dx) / 100);
      like.style.opacity = 0; if (save) save.style.opacity = 0;
    } else {
      like.style.opacity = nope.style.opacity = 0;
      if (save) save.style.opacity = 0;
    }
  };

  const onEnd = (x, y) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = x - startX, dy = y - startY;

    if (!hasMoved) {
      if (item.type === 'course') {
        card.querySelector('.flip-inner')?.classList.toggle('flipped');
      }
      return;
    }

    if      (dy < -100 && Math.abs(dx) < 100) { flyCard(card, 0, -900);      dispatchAction('up',    item); }
    else if (dx > 100)                          { flyCard(card, 900, dy * 0.3); dispatchAction('right', item); }
    else if (dx < -100)                         { flyCard(card, -900, dy * 0.3); dispatchAction('left', item); }
    else {
      card.style.transition = 'transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275)';
      card.style.transform  = '';
    }
  };

  card.addEventListener('mousedown', e => onStart(e.clientX, e.clientY), { signal });
  document.addEventListener('mousemove', e => { if (isDragging) onMove(e.clientX, e.clientY); }, { signal });
  document.addEventListener('mouseup',   e => { if (isDragging) onEnd(e.clientX, e.clientY);  }, { signal });

  card.addEventListener('touchstart', e => {
    const t = e.touches[0]; onStart(t.clientX, t.clientY);
  }, { passive: true, signal });
  card.addEventListener('touchmove', e => {
    const t = e.touches[0]; onMove(t.clientX, t.clientY); e.preventDefault();
  }, { passive: false, signal });
  card.addEventListener('touchend', e => {
    const t = e.changedTouches[0]; onEnd(t.clientX, t.clientY);
  }, { signal });
}

// ─── Card flight ───────────────────────────────────────────────────────────

function flyCard(card, tx, ty) {
  card.style.transition = 'transform 0.45s cubic-bezier(0.55,0,1,0.45), opacity 0.35s';
  card.style.transform  = `translate(${tx}px,${ty}px) rotate(${tx * 0.04}deg)`;
  card.style.opacity    = '0';
  const ac = abortControllers.get(card);
  if (ac) { ac.abort(); abortControllers.delete(card); }
  setTimeout(() => {
    card.remove();
    currentIdx++;
    State.setSwipeIndex(currentIdx);
    checkAndUpdateStreak();
    renderCards();
  }, 400);
}

// ─── Swipe from buttons ────────────────────────────────────────────────────

export function swipeCard(dir) {
  const stack = document.getElementById('card-stack');
  const top   = stack?.querySelector('.swipe-card.top');
  if (!top) return;
  const item = deck[currentIdx];
  if (!item) return;

  const stampSel = { right: '.stamp-like', left: '.stamp-nope', up: '.stamp-save' }[dir];
  const stamp = top.querySelector(stampSel);
  if (stamp) stamp.style.opacity = '1';

  top.style.transition = 'transform 0.1s ease-out';
  if (dir === 'right') top.style.transform = 'translateX(16px) rotate(5deg)';
  if (dir === 'left')  top.style.transform = 'translateX(-16px) rotate(-5deg)';
  if (dir === 'up')    top.style.transform = 'translateY(-16px)';

  setTimeout(() => {
    if (dir === 'right') { flyCard(top, 900, 0);    dispatchAction('right', item); }
    if (dir === 'left')  { flyCard(top, -900, 0);   dispatchAction('left',  item); }
    if (dir === 'up')    { flyCard(top, 0, -900);   dispatchAction('up',    item); }
  }, 110);
}

export function resetSwipe() {
  currentIdx = 0;
  State.resetSwipeIndex();
  deck = buildDeck(getCourses());
  renderCards();
}

// ─── Actions ───────────────────────────────────────────────────────────────

function dispatchAction(dir, item) {
  if (item.type === 'course') {
    if (dir === 'right') likeAction(item);
    if (dir === 'left')  nopeAction(item);
    if (dir === 'up')    saveAction(item);
  } else {
    Sounds.play(dir === 'right' ? 'like' : dir === 'up' ? 'save' : 'nope');
    addXP(5);
  }
}

function likeAction(c) {
  Sounds.play('like');
  addXP(5);
  showPreview(c);
}
function nopeAction(c) {
  Sounds.play('nope');
  addXP(5);
  showToast(`✕ Skippad: "${c.title}"`, 'toast-nope');
}
function saveAction(c) {
  Sounds.play('save');
  State.saveCourse(c.id);
  addXP(15);
  updateSavedBadge();
  showToast(`🔖 Sparad: "${c.title}"`, 'toast-save');
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function showDone() {
  document.getElementById('done-card').classList.add('visible');
  const actions = document.getElementById('swipe-actions');
  if (actions) { actions.style.opacity = '0.3'; actions.style.pointerEvents = 'none'; }
}

function renderProgressBar() {
  const bar     = document.getElementById('progress-bar');
  const courses = deck.filter(d => d.type === 'course');
  const done    = deck.slice(0, currentIdx).filter(d => d.type === 'course').length;
  if (!bar) return;
  bar.innerHTML = courses.map((_, i) =>
    `<div class="prog-dot ${i < done ? 'done' : i === done ? 'current' : ''}"></div>`
  ).join('');
}

function setupKeyboard() {
  document.addEventListener('keydown', e => {
    if (!document.getElementById('swipe')?.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  swipeCard('left');
    if (e.key === 'ArrowRight') swipeCard('right');
    if (e.key === 'ArrowUp')    swipeCard('up');
  });
}

function setupActionButtons() {
  document.getElementById('btn-nope')?.addEventListener('click', () => swipeCard('left'));
  document.getElementById('btn-like')?.addEventListener('click', () => swipeCard('right'));
  document.getElementById('btn-save')?.addEventListener('click', () => swipeCard('up'));
  document.getElementById('restart-btn')?.addEventListener('click', resetSwipe);
}
