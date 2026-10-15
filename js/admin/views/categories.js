// QuickThinkers adminportal — kategorier.
// Ordningen här är ordningen i appens filter och i onboardingen.
import * as Store from '../store.js';
import { UserError } from '../../lib/supabase.js';

const U = window.QTUI;
const el = U.el;

export function render(host, ctx) {
  U.clear(host);
  const { categories, courses } = Store.getState();
  const sorted = categories.slice().sort((a, b) => a.sortOrder - b.sortOrder);

  host.appendChild(el('div.page-head',
    el('div',
      el('h1.page-title', { text: 'Kategorier' }),
      el('p.page-sub', { text: `${categories.length} kategorier · visas i den här ordningen i appen` })
    ),
    el('div.page-actions',
      el('button.btn.btn--primary', { type: 'button', onclick: () => openForm(null, ctx) },
        el('span', { text: '＋' }), el('span', { text: 'Ny kategori' }))
    )
  ));

  if (!sorted.length) {
    host.appendChild(U.emptyState('◫', 'Inga kategorier',
      'Kategorier hjälper användarna att hitta rätt och styr rekommendationerna.'));
    return;
  }

  const table = el('div.table.table--categories',
    el('div.table__head',
      el('span', { text: 'Kategori' }), el('span', { text: 'Kurser' }), el('span', { text: 'Publicerade' }), el('span', { text: '' })
    )
  );

  sorted.forEach((cat, i) => {
    const inCategory = courses.filter((c) => c.categoryId === cat.id);
    const run = (fn) => (e) => U.busy(e.currentTarget, async () => { await fn(); ctx.refresh(); });

    table.appendChild(el('div.table__row',
      el('div.course-cell',
        el('span.course-cell__emoji', { text: cat.emoji }),
        el('div.course-cell__text', el('span.course-cell__title', { text: cat.label }))
      ),
      el('span.cell-mono', { 'data-label': 'Kurser', text: String(inCategory.length) }),
      el('span.cell-mono', { 'data-label': 'Publicerade', text: String(inCategory.filter((c) => c.published).length) }),
      el('div.row-actions',
        U.actionBtn('↑', 'Flytta upp', { disabled: i === 0, onclick: run(() => Store.moveCategory(cat.id, -1)) }),
        U.actionBtn('↓', 'Flytta ner', { disabled: i === sorted.length - 1, onclick: run(() => Store.moveCategory(cat.id, 1)) }),
        U.actionBtn('✎', 'Redigera', { onclick: () => openForm(cat, ctx) }),
        U.actionBtn('🗑', 'Ta bort', {
          className: 'icon-btn--danger',
          onclick: async (e) => {
            const button = e.currentTarget;
            const ok = await U.confirm({
              title: 'Ta bort kategorin?',
              message: inCategory.length
                ? `"${cat.label}" tas bort. ${inCategory.length} ${inCategory.length === 1 ? 'kurs blir' : 'kurser blir'} utan kategori — kurserna finns kvar.`
                : `"${cat.label}" tas bort.`,
              confirmLabel: 'Ta bort', danger: true,
            });
            if (!ok) return;
            await U.busy(button, async () => {
              await Store.deleteCategory(cat.id);
              U.toast('Kategorin togs bort', 'warn');
              ctx.refresh();
            });
          },
        })
      )
    ));
  });

  host.appendChild(table);
}

function openForm(category, ctx) {
  const isNew = !category;
  const m = U.modal({ title: isNew ? 'Ny kategori' : 'Redigera kategori' });

  const fLabel = U.input({ value: category?.label || '', placeholder: 'T.ex. Psykologi', maxlength: 40 });
  const fEmoji = U.input({ value: category?.emoji || '📚', maxlength: 8, className: 'input--emoji' });

  m.body.appendChild(el('div.form-row.form-row--2', U.field('Namn', fLabel), U.field('Emoji', fEmoji)));

  const save = el('button.btn.btn--primary', {
    type: 'button', text: isNew ? 'Skapa' : 'Spara',
    onclick: () => U.busy(save, async () => {
      const label = fLabel.value.trim();
      if (!label) { fLabel.focus(); throw new UserError('Kategorin behöver ett namn.'); }
      const data = { label, emoji: fEmoji.value.trim() || '📚' };
      if (isNew) await Store.createCategory(data);
      else await Store.updateCategory(category.id, data);
      U.toast(isNew ? 'Kategorin skapades' : 'Kategorin sparades', 'ok');
      m.close();
      ctx.refresh();
    }),
  });

  fLabel.addEventListener('keydown', (e) => { if (e.key === 'Enter') save.click(); });
  m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Avbryt', onclick: m.close }));
  m.footer.appendChild(save);
}
