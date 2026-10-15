// QuickThinkers adminportal — dagens quiz.
// Ett quiz per datum (svensk tid). Användarna får ett försök per dag och
// 25 XP per rätt svar — poängen räknas i databasen.
import * as Store from '../store.js';
import { UserError } from '../../lib/supabase.js';
import { quizEditor } from './quiz-editor.js';

const U = window.QTUI;
const el = U.el;

const MIN_QUESTIONS = 3;
const MAX_QUESTIONS = 10;

// Datum som YYYY-MM-DD i svensk tid — samma dag som databasen räknar med.
function stockholmToday() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' });
}

function addDays(iso, n) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function formatDay(iso, opts = { weekday: 'long', day: 'numeric', month: 'long' }) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('sv-SE', { ...opts, timeZone: 'UTC' });
}

function nextFreeDate(today) {
  let d = today;
  while (Store.getDailyQuiz(d)) d = addDays(d, 1);
  return d;
}

export function render(host, ctx) {
  U.clear(host);
  const today = stockholmToday();
  const quizzes = Store.getState().dailyQuizzes;
  const todays = Store.getDailyQuiz(today);

  host.appendChild(el('div.page-head',
    el('div',
      el('h1.page-title', { text: 'Dagens quiz' }),
      el('p.page-sub', { text: `Ett quiz per dag med ${MIN_QUESTIONS}–${MAX_QUESTIONS} frågor. 25 XP per rätt svar, ett försök per användare.` })
    ),
    el('div.page-actions',
      el('button.btn.btn--primary', { type: 'button', onclick: () => openForm(nextFreeDate(today), true, ctx) },
        el('span', { text: '＋' }), el('span', { text: 'Nytt quiz' }))
    )
  ));

  host.appendChild(todays
    ? el('p.notice.notice--ok', { text: `Dagens quiz är upplagt — ${todays.questions.length} frågor.` })
    : el('p.notice', { text: 'Inget quiz idag. Quizbannern i appen är dold tills du lägger upp ett.' }));

  // Veckoöversikt: vilka av de kommande sju dagarna har ett quiz?
  host.appendChild(el('div.week-strip', [0, 1, 2, 3, 4, 5, 6].map((n) => {
    const date = addDays(today, n);
    const quiz = Store.getDailyQuiz(date);
    return el('button.week-day', {
      type: 'button',
      className: quiz ? 'is-done' : '',
      title: quiz ? 'Redigera' : 'Lägg upp quiz',
      onclick: () => openForm(date, !quiz, ctx),
    },
      el('span.week-day__name', { text: n === 0 ? 'Idag' : formatDay(date, { weekday: 'short' }) }),
      el('span.week-day__date', { text: formatDay(date, { day: 'numeric', month: 'short' }) }),
      el('span.week-day__mark', { text: quiz ? `✓ ${quiz.questions.length}` : '＋' })
    );
  })));

  if (!quizzes.length) {
    host.appendChild(U.emptyState('🧠', 'Inga quiz än',
      'Lägg upp dagens quiz — det dyker upp som en banner på appens startsida.'));
    return;
  }

  const table = el('div.table.table--quiz',
    el('div.table__head',
      el('span', { text: 'Datum' }), el('span', { text: 'Frågor' }), el('span', { text: 'Status' }), el('span', { text: '' })
    )
  );

  quizzes.forEach((q) => {
    const past = q.date < today;
    const status = q.date === today ? U.badge('Idag', 'ok') : past ? U.badge('Tidigare') : U.badge('Kommande', 'cool');
    table.appendChild(el('div.table__row', { className: past ? 'table__row--muted' : '' },
      el('div.course-cell',
        el('span.course-cell__emoji', { text: '🧠' }),
        el('div.course-cell__text',
          el('span.course-cell__title', { text: formatDay(q.date) }),
          el('span.course-cell__desc', { text: q.questions[0]?.question || '' })
        )
      ),
      el('span.cell-mono', { 'data-label': 'Frågor', text: String(q.questions.length) }),
      el('span', { 'data-label': 'Status' }, status),
      el('div.row-actions',
        past
          ? U.actionBtn('👁', 'Visa', { onclick: () => openReadOnly(q) })
          : U.actionBtn('✎', 'Redigera', { onclick: () => openForm(q.date, false, ctx) }),
        U.actionBtn('🗑', 'Ta bort', {
          className: 'icon-btn--danger',
          onclick: async (e) => {
            const button = e.currentTarget;
            const ok = await U.confirm({
              title: 'Ta bort quizet?',
              message: `Quizet för ${formatDay(q.date)} tas bort, inklusive användarnas resultat för den dagen. XP de redan fått finns kvar.`,
              confirmLabel: 'Ta bort', danger: true,
            });
            if (!ok) return;
            await U.busy(button, async () => {
              await Store.deleteDailyQuiz(q.date);
              U.toast('Quizet togs bort', 'warn');
              ctx.refresh();
            });
          },
        })
      )
    ));
  });

  host.appendChild(table);
}

function openForm(date, isNew, ctx) {
  const today = stockholmToday();
  const existing = isNew ? null : Store.getDailyQuiz(date);

  const m = U.modal({
    title: isNew ? 'Nytt quiz' : `Redigera quiz`,
    subtitle: isNew ? 'Välj datum och skriv frågorna.' : formatDay(date),
    wide: true,
  });

  const fDate = U.input({ type: 'date', value: date, min: today });
  if (isNew) m.body.appendChild(U.field('Datum', fDate, 'Quizet visas i appen hela dagen (svensk tid)'));
  if (!isNew && date === today) {
    m.body.appendChild(el('p.notice', { text: 'Quizet är live idag. Den som redan svarat behåller sitt resultat.' }));
  }

  const list = el('div.quiz-list');
  const addBtn = el('button.btn.btn--ghost.btn--sm', { type: 'button', text: '＋ Lägg till fråga' });
  m.body.appendChild(list);
  m.body.appendChild(addBtn);

  const items = [];

  function renumber() {
    items.forEach((item, i) => {
      item.title.textContent = `Fråga ${i + 1}`;
      item.remove.disabled = items.length <= MIN_QUESTIONS;
    });
    addBtn.disabled = items.length >= MAX_QUESTIONS;
    addBtn.textContent = items.length >= MAX_QUESTIONS ? `Max ${MAX_QUESTIONS} frågor` : '＋ Lägg till fråga';
  }

  function addQuestion(content) {
    const title = el('span.quiz-q__title');
    const remove = el('button.icon-btn.icon-btn--danger', { type: 'button', title: 'Ta bort frågan' }, '✕');
    const body = el('div.quiz-q__body');
    const wrap = el('div.quiz-q', el('div.quiz-q__head', title, remove), body);
    const item = { wrap, title, remove, editor: null };
    item.editor = quizEditor(body, content || {}, { withExplanation: false });
    remove.addEventListener('click', () => {
      if (items.length <= MIN_QUESTIONS) return;
      items.splice(items.indexOf(item), 1);
      wrap.remove();
      renumber();
    });
    items.push(item);
    list.appendChild(wrap);
    renumber();
    return item;
  }

  (existing ? existing.questions : [null, null, null]).forEach(addQuestion);
  addBtn.addEventListener('click', () => {
    if (items.length >= MAX_QUESTIONS) return;
    addQuestion(null).editor.focus();
  });

  const save = el('button.btn.btn--primary', {
    type: 'button', text: 'Spara quiz',
    onclick: () => U.busy(save, async () => {
      const quizDate = isNew ? fDate.value : date;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(quizDate)) throw new UserError('Välj ett datum.');
      if (isNew && quizDate < today) throw new UserError('Datumet har redan varit.');
      if (isNew && Store.getDailyQuiz(quizDate)) {
        throw new UserError(`Det finns redan ett quiz för ${formatDay(quizDate)} — redigera det i stället.`);
      }
      const questions = items.map((item, i) => {
        try {
          return item.editor.collect();
        } catch (err) {
          throw new UserError(`Fråga ${i + 1}: ${err.message}`);
        }
      });
      if (questions.length < MIN_QUESTIONS) throw new UserError(`Quizet behöver minst ${MIN_QUESTIONS} frågor.`);

      await Store.saveDailyQuiz(quizDate, questions);
      U.toast(`Quizet för ${formatDay(quizDate)} sparades`, 'ok');
      m.close();
      ctx.refresh();
    }),
  });

  m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Avbryt', onclick: m.close }));
  m.footer.appendChild(save);
}

function openReadOnly(quiz) {
  const m = U.modal({ title: 'Quiz', subtitle: formatDay(quiz.date), wide: true });
  m.body.appendChild(el('ol.quiz-readonly', quiz.questions.map((q) =>
    el('li',
      el('strong', { text: q.question }),
      el('ul', q.options.map((o, i) => el('li', { className: i === q.correct_index ? 'is-correct' : '', text: o })))
    )
  )));
  m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Stäng', onclick: m.close }));
}
