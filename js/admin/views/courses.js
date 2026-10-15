// QuickThinkers adminportal — kurshantering.
// Lista → kursformulär → lektioner → block. Allt sparas direkt i Supabase.
import * as Store from '../store.js';
import { LEVELS, BLOCK_TYPES, courseStats, publishProblem, categoryLabel } from '../store.js';
import { mediaUrl, IMAGE_TYPES, UserError } from '../../lib/supabase.js';
import { renderMarkdown, plainText } from '../../lib/markdown.js';
import { youtubeId, youtubeThumbUrl } from '../../lib/youtube.js';
import { quizEditor } from './quiz-editor.js';

const U = window.QTUI;
const el = U.el;

const EMPTY_FILTER = { query: '', category: 'all', status: 'all', level: 'all', sort: 'updated' };
let filter = { ...EMPTY_FILTER };

const DISPLAY_MODES = [
  { value: 'stories', label: 'Ett block i taget' },
  { value: 'scroll', label: 'Scrolla hela lektionen' },
];
const modeLabel = (mode) => (mode === 'scroll' ? 'Scroll' : 'Ett i taget');

const BLOCK_HELP = {
  text: 'Förklarande text med rubriker, fetstil och listor.',
  image: 'En bild med bildtext, t.ex. ett diagram.',
  video: 'En YouTube-video som spelas i lektionen.',
  flashcard: 'Fråga på framsidan, svaret när man vänder kortet.',
  quiz: 'En fråga med 2–4 alternativ och direkt feedback.',
};

function previewCourse(id) {
  window.open(`/?preview=${encodeURIComponent(id)}`, '_blank', 'noopener');
}

// Omslagsbild om den finns, annars gradienten.
function artStyle(course) {
  const cover = mediaUrl(course.coverImagePath);
  return cover
    ? { backgroundImage: `url("${cover}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: course.poster };
}

// ---------------------------------------------------------------
// Vy: lista
// ---------------------------------------------------------------
export function render(host, ctx) {
  U.clear(host);
  const all = Store.getState().courses;
  const published = all.filter((c) => c.published).length;

  host.appendChild(el('div.page-head',
    el('div',
      el('h1.page-title', { text: 'Kurser' }),
      el('p.page-sub', { text: `${all.length} kurser · ${published} publicerade · ${all.length - published} utkast` })
    ),
    el('div.page-actions',
      all.length ? el('button.btn.btn--ghost', { type: 'button', text: 'Exportera CSV', onclick: () => exportCourses(all) }) : null,
      el('button.btn.btn--primary', { type: 'button', onclick: () => openCourseForm(null, ctx) },
        el('span', { text: '＋' }), el('span', { text: 'Ny kurs' }))
    )
  ));

  if (!all.length) {
    host.appendChild(U.emptyState('📚', 'Inga kurser än',
      'Skapa din första kurs. Den sparas som utkast och syns inte i appen förrän du publicerar den.',
      el('button.btn.btn--primary', { type: 'button', text: '＋ Skapa första kursen', onclick: () => openCourseForm(null, ctx) })));
    return;
  }

  const categoryOptions = [{ value: 'all', label: 'Alla kategorier' }].concat(
    Store.getState().categories.map((c) => ({ value: c.id, label: `${c.emoji}  ${c.label}` }))
  );

  host.appendChild(el('div.toolbar',
    el('div.toolbar__search', el('span.toolbar__icon', { text: '⌕' }), U.input({
      type: 'search', placeholder: 'Sök titel, beskrivning eller tagg…', value: filter.query,
      oninput: (e) => { filter.query = e.target.value; drawList(); },
    })),
    U.select(categoryOptions, filter.category, { onchange: (e) => { filter.category = e.target.value; drawList(); } }),
    U.select([{ value: 'all', label: 'Alla nivåer' }].concat(LEVELS.map((l) => ({ value: l, label: l }))), filter.level,
      { onchange: (e) => { filter.level = e.target.value; drawList(); } }),
    U.select([
      { value: 'all', label: 'Alla statusar' },
      { value: 'published', label: 'Publicerade' },
      { value: 'draft', label: 'Utkast' },
    ], filter.status, { onchange: (e) => { filter.status = e.target.value; drawList(); } }),
    U.select([
      { value: 'updated', label: 'Senast ändrad' },
      { value: 'created', label: 'Senast skapad' },
      { value: 'title', label: 'Titel A–Ö' },
      { value: 'order', label: 'Visningsordning' },
    ], filter.sort, { onchange: (e) => { filter.sort = e.target.value; drawList(); } })
  ));

  const listHost = el('div.list-host');
  host.appendChild(listHost);

  function drawList() {
    U.clear(listHost);
    const rows = Store.listCourses(filter);
    if (!rows.length) {
      listHost.appendChild(U.emptyState('🔍', 'Inga kurser matchar', 'Prova att rensa sökningen eller filtren.',
        el('button.btn.btn--ghost', {
          type: 'button', text: 'Rensa filter',
          onclick: () => { filter = { ...EMPTY_FILTER }; render(host, ctx); },
        })));
      return;
    }

    const table = el('div.table.table--courses',
      el('div.table__head',
        el('span', { text: 'Kurs' }), el('span', { text: 'Kategori' }), el('span', { text: 'Nivå' }),
        el('span', { text: 'Innehåll' }), el('span', { text: 'Status' }), el('span', { text: 'Ändrad' }),
        el('span', { text: '' })
      )
    );
    rows.forEach((c) => table.appendChild(courseRow(c, ctx)));
    listHost.appendChild(table);
  }

  drawList();
}

function courseRow(c, ctx) {
  const s = courseStats(c);
  const hasCover = !!c.coverImagePath;

  const statusPill = el('button.status-pill', {
    type: 'button',
    className: c.published ? 'status-pill--live' : 'status-pill--draft',
    title: c.published ? 'Klicka för att avpublicera' : 'Klicka för att publicera',
    onclick: () => U.busy(statusPill, async () => {
      const updated = await Store.togglePublish(c.id);
      U.toast(updated.published ? 'Kursen publicerades — den syns nu i appen' : 'Kursen avpublicerades', updated.published ? 'ok' : 'warn');
      ctx.refresh();
    }),
  }, el('span.status-dot'), el('span', { text: c.published ? 'Publicerad' : 'Utkast' }));

  return el('div.table__row',
    el('div.course-cell',
      el('div.course-thumb', { style: { ...artStyle(c), boxShadow: `0 0 0 1px rgba(255,255,255,.06), 0 6px 18px -8px ${c.glow}` } },
        hasCover ? null : el('span', { text: c.emoji })
      ),
      el('div.course-cell__text',
        el('span.course-cell__title', { text: c.title }),
        el('span.course-cell__desc', { text: c.description || 'Ingen beskrivning' })
      )
    ),
    el('span.cell-muted', { 'data-label': 'Kategori', text: categoryLabel(c.categoryId) }),
    el('span', { 'data-label': 'Nivå' },
      U.badge(c.level, c.level === 'Nybörjare' ? 'cool' : c.level === 'Medel' ? 'amber' : 'accent')),
    el('span.cell-muted', { 'data-label': 'Innehåll' },
      `${s.lessonCount} ${s.lessonCount === 1 ? 'lektion' : 'lektioner'} · ${s.blockCount} block`,
      s.emptyLessons ? el('span.cell-warn', { text: ` · ${s.emptyLessons} tom` }) : null
    ),
    el('span', { 'data-label': 'Status' }, statusPill),
    el('span.cell-muted', { 'data-label': 'Ändrad', text: U.relativeTime(c.updatedAt) }),
    el('div.row-actions',
      U.actionBtn('▤', 'Lektioner', { onclick: () => openLessonManager(c.id, ctx) }),
      U.actionBtn('✎', 'Redigera', { onclick: () => openCourseForm(c.id, ctx) }),
      U.actionBtn('👁', 'Förhandsgranska', { onclick: () => previewCourse(c.id) }),
      U.actionBtn('⧉', 'Duplicera', {
        onclick: (e) => U.busy(e.currentTarget, async () => {
          const copy = await Store.duplicateCourse(c.id);
          U.toast(`Kopia skapad: ${copy.title}`, 'ok');
          ctx.refresh();
        }),
      }),
      U.actionBtn('🗑', 'Ta bort', {
        className: 'icon-btn--danger',
        onclick: async (e) => {
          const button = e.currentTarget;
          const ok = await U.confirm({
            title: 'Ta bort kursen?',
            message: `"${c.title}" och alla dess lektioner tas bort. Användarnas framsteg i kursen försvinner också. Det går inte att ångra.`,
            confirmLabel: 'Ta bort', danger: true,
          });
          if (!ok) return;
          await U.busy(button, async () => {
            await Store.deleteCourse(c.id);
            U.toast('Kursen togs bort', 'warn');
            ctx.refresh();
          });
        },
      })
    )
  );
}

// ---------------------------------------------------------------
// Kursformulär
// ---------------------------------------------------------------
function openCourseForm(courseId, ctx) {
  const isNew = !courseId;
  const categories = Store.getState().categories;
  const c = isNew ? {
    title: '', description: '', why: '', categoryId: categories[0]?.id || null, emoji: '📚',
    level: 'Nybörjare', xp: 100, glow: '#7C6BFF', poster: 'linear-gradient(150deg,#1b1b27,#242433)',
    tags: [], coverImagePath: null, published: false,
  } : Store.getCourse(courseId);

  if (!c) { U.toast('Kursen hittades inte', 'warn'); return; }

  const m = U.modal({
    title: isNew ? 'Ny kurs' : 'Redigera kurs',
    subtitle: isNew ? 'Fyll i grunderna — lektionerna lägger du till i nästa steg.' : c.title,
    wide: true,
  });

  const fTitle = U.input({ value: c.title, placeholder: 'T.ex. UX för nybörjare', maxlength: 120, required: true });
  const fDesc = U.textarea({ value: c.description, placeholder: 'Kort beskrivning som visas på kortet', maxlength: 1000 });
  const fWhy = U.input({ value: c.why, placeholder: 'Passar dig som…', maxlength: 200 });
  const fEmoji = U.input({ value: c.emoji, maxlength: 8, className: 'input--emoji' });
  const fCategory = U.select(
    [{ value: '', label: 'Utan kategori' }].concat(categories.map((x) => ({ value: x.id, label: `${x.emoji}  ${x.label}` }))),
    c.categoryId || ''
  );
  const fLevel = U.select(LEVELS.map((l) => ({ value: l, label: l })), c.level);
  const fXp = U.input({ type: 'number', value: c.xp, min: 0, max: 10000, step: 10 });
  const fTags = U.input({ value: c.tags.join(', '), placeholder: 'ux, design, grunder' });
  const fGlow = el('input.input.input--color', { type: 'color', value: c.glow });
  const fPoster = U.input({ value: c.poster, placeholder: 'linear-gradient(...)', maxlength: 300 });
  const fPublished = el('input', { type: 'checkbox' });
  fPublished.checked = !!c.published;

  // ---- Omslagsbild ----
  let coverPath = c.coverImagePath;
  const fileInput = el('input', { type: 'file', accept: IMAGE_TYPES.join(','), hidden: true });
  const uploadBtn = el('button.btn.btn--ghost.btn--sm', { type: 'button', onclick: () => fileInput.click() });
  const removeBtn = el('button.btn.btn--ghost.btn--sm', {
    type: 'button', text: 'Ta bort bild', onclick: () => { coverPath = null; syncPreview(); },
  });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    fileInput.value = '';
    if (!file) return;
    await U.busy(uploadBtn, async () => {
      coverPath = await Store.uploadCourseImage(file);
      syncPreview();
      U.toast('Bilden laddades upp', 'ok');
    });
  });

  const preview = el('div.poster-preview',
    el('span.poster-preview__emoji'),
    el('span.poster-preview__title')
  );

  function syncPreview() {
    preview.removeAttribute('style');
    Object.assign(preview.style, artStyle({ coverImagePath: coverPath, poster: fPoster.value }));
    preview.style.boxShadow = `0 10px 34px -14px ${fGlow.value}`;
    preview.querySelector('.poster-preview__emoji').textContent = coverPath ? '' : (fEmoji.value || '📚');
    preview.querySelector('.poster-preview__title').textContent = fTitle.value || 'Kurstitel';
    uploadBtn.textContent = coverPath ? 'Byt omslagsbild' : 'Ladda upp omslagsbild';
    removeBtn.hidden = !coverPath;
  }
  [fTitle, fEmoji, fPoster, fGlow].forEach((i) => i.addEventListener('input', syncPreview));
  syncPreview();

  m.body.appendChild(el('div.form-grid',
    el('div.form-col',
      U.field('Titel', fTitle),
      U.field('Beskrivning', fDesc),
      U.field('Varför kursen passar', fWhy, 'Visas som en liten rad under titeln i appen'),
      el('div.form-row', U.field('Emoji', fEmoji), U.field('Kategori', fCategory), U.field('Nivå', fLevel)),
      el('div.form-row.form-row--2',
        U.field('XP för hela kursen', fXp, 'Fördelas lika på lektionerna'),
        U.field('Taggar', fTags, 'Kommaseparerade, används i sök')
      )
    ),
    el('div.form-col',
      el('span.field__label', { text: 'Kortkonst' }),
      preview,
      el('div.upload-row', uploadBtn, removeBtn, fileInput),
      el('p.field__hint', { text: 'Omslagsbild är valfri. Utan bild visas emoji och gradient. JPG, PNG, WebP eller GIF, max 5 MB.' }),
      U.field('Glöd', fGlow),
      U.field('Bakgrund', fPoster, 'CSS-gradient, används när ingen bild finns'),
      isNew ? el('p.form-note', { text: 'Nya kurser sparas som utkast. Du publicerar när lektionerna är klara.' }) :
        el('label.switch',
          fPublished,
          el('span.switch__track', el('span.switch__thumb')),
          el('span.switch__label', { text: 'Publicerad — syns i appen' })
        )
    )
  ));

  const save = el('button.btn.btn--primary', {
    type: 'button', text: isNew ? 'Skapa kurs' : 'Spara ändringar',
    onclick: () => U.busy(save, async () => {
      const title = fTitle.value.trim();
      if (!title) { fTitle.focus(); throw new UserError('Kursen behöver en titel.'); }
      const poster = fPoster.value.trim();
      if (!/^(linear|radial)-gradient\(/.test(poster) || /url\(/i.test(poster)) {
        throw new UserError('Bakgrunden måste vara en CSS-gradient, t.ex. linear-gradient(150deg,#1b1b27,#242433).');
      }
      const xp = Number(fXp.value);
      if (!Number.isInteger(xp) || xp < 0 || xp > 10000) throw new UserError('XP måste vara ett heltal mellan 0 och 10 000.');

      const data = {
        title,
        description: fDesc.value.trim(),
        why: fWhy.value.trim(),
        categoryId: fCategory.value || null,
        emoji: fEmoji.value.trim() || '📚',
        level: fLevel.value,
        xp,
        glow: fGlow.value,
        poster,
        coverImagePath: coverPath,
        tags: fTags.value.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 20),
      };

      if (isNew) {
        const created = await Store.createCourse(data);
        U.toast('Kursen skapades — lägg nu till lektioner', 'ok');
        m.close();
        ctx.refresh();
        openLessonManager(created.id, ctx);
        return;
      }

      if (fPublished.checked && !c.published) {
        const problem = publishProblem(c);
        if (problem) throw new UserError(problem);
      }
      await Store.updateCourse(courseId, { ...data, published: fPublished.checked });
      U.toast('Ändringarna sparades', 'ok');
      m.close();
      ctx.refresh();
    }),
  });

  m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Avbryt', onclick: m.close }));
  m.footer.appendChild(save);
}

// ---------------------------------------------------------------
// Lektioner
// ---------------------------------------------------------------
function openLessonManager(courseId, ctx) {
  const course = Store.getCourse(courseId);
  if (!course) { U.toast('Kursen hittades inte', 'warn'); return; }

  const m = U.modal({ title: 'Lektioner', subtitle: `${course.emoji}  ${course.title}`, wide: true });

  function draw() {
    const c = Store.getCourse(courseId);
    if (!c) { m.close(); return; }

    // Kurslistan bakom fönstret hålls i synk, hur fönstret än stängs.
    ctx.refresh();
    U.clear(m.body);
    U.clear(m.footer);

    const s = courseStats(c);
    const problem = publishProblem(c);
    m.body.appendChild(el('div.lesson-summary',
      el('span', { text: `${s.lessonCount} ${s.lessonCount === 1 ? 'lektion' : 'lektioner'} · ${s.minutes} min · ${s.blockCount} block` }),
      U.badge(c.published ? 'Publicerad' : 'Utkast', c.published ? 'ok' : 'amber')
    ));
    if (problem && !c.published) {
      m.body.appendChild(el('p.notice', { text: `För att kunna publicera: ${problem.charAt(0).toLowerCase()}${problem.slice(1)}` }));
    }

    if (!c.lessons.length) {
      m.body.appendChild(U.emptyState('▤', 'Inga lektioner än',
        'En lektion är 5–15 minuter innehåll: text, bilder, video, flashcards och quiz.'));
    } else {
      m.body.appendChild(el('div.deck-list', c.lessons.map((l, i) => lessonCard(c, l, i, draw))));
    }

    m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Stäng', onclick: m.close }));
    m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: '👁 Förhandsgranska', onclick: () => previewCourse(c.id) }));
    m.footer.appendChild(el('button.btn.btn--primary', {
      type: 'button', text: '＋ Ny lektion', onclick: () => openLessonForm(c.id, null, draw),
    }));
  }

  draw();
}

function lessonCard(course, lesson, index, redraw) {
  const blocks = lesson.blocks;
  const run = (fn) => (e) => U.busy(e.currentTarget, async () => { await fn(); redraw(); });

  return el('div.deck',
    el('div.deck__head',
      el('div.deck__title',
        el('span.deck__index', { text: String(index + 1) }),
        el('span', { text: lesson.title }),
        el('span.deck__count', { text: `${lesson.minutes} min · ${blocks.length} block` }),
        U.badge(modeLabel(lesson.displayMode), 'cool')
      ),
      el('div.row-actions',
        U.actionBtn('↑', 'Flytta upp', { disabled: index === 0, onclick: run(() => Store.moveLesson(course.id, lesson.id, -1)) }),
        U.actionBtn('↓', 'Flytta ner', { disabled: index === course.lessons.length - 1, onclick: run(() => Store.moveLesson(course.id, lesson.id, 1)) }),
        U.actionBtn('✎', 'Redigera', { onclick: () => openLessonForm(course.id, lesson, redraw) }),
        U.actionBtn('🗑', 'Ta bort', {
          className: 'icon-btn--danger',
          onclick: async (e) => {
            const button = e.currentTarget;
            const ok = await U.confirm({
              title: 'Ta bort lektionen?',
              message: `"${lesson.title}" och dess ${blocks.length} block tas bort.`,
              confirmLabel: 'Ta bort', danger: true,
            });
            if (!ok) return;
            await U.busy(button, async () => {
              await Store.deleteLesson(course.id, lesson.id);
              U.toast('Lektionen togs bort', 'warn');
              redraw();
            });
          },
        })
      )
    ),
    el('div.deck__cards',
      blocks.length
        ? blocks.map((b, k) => blockRow(course, lesson, b, k, redraw))
        : el('p.deck__empty', { text: 'Inga block än — lektionen behöver minst ett innan kursen kan publiceras.' })
    ),
    el('button.btn.btn--ghost.btn--sm', {
      type: 'button', text: '＋ Lägg till block', onclick: () => openBlockTypePicker(course.id, lesson.id, redraw),
    })
  );
}

function openLessonForm(courseId, lesson, onDone) {
  const isNew = !lesson;
  const m = U.modal({ title: isNew ? 'Ny lektion' : 'Redigera lektion', subtitle: 'En lektion bör ta 5–15 minuter.' });

  const fTitle = U.input({ value: lesson?.title || '', placeholder: 'T.ex. Vad är UX?', maxlength: 120 });
  const fMinutes = U.input({ type: 'number', value: lesson?.minutes ?? 10, min: 1, max: 120 });
  const fMode = U.select(DISPLAY_MODES, lesson?.displayMode || 'stories');

  m.body.appendChild(U.field('Titel', fTitle));
  m.body.appendChild(U.field('Ungefärlig tid (minuter)', fMinutes));
  m.body.appendChild(U.field('Visning i appen', fMode,
    'Ett block i taget: som stories, man trycker sig fram. Scroll: hela lektionen på en sida.'));

  const save = el('button.btn.btn--primary', {
    type: 'button', text: isNew ? 'Lägg till' : 'Spara',
    onclick: () => U.busy(save, async () => {
      const title = fTitle.value.trim();
      if (!title) { fTitle.focus(); throw new UserError('Lektionen behöver en titel.'); }
      const minutes = Number(fMinutes.value);
      if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120) throw new UserError('Tiden måste vara 1–120 minuter.');
      const data = { title, minutes, displayMode: fMode.value };
      if (isNew) await Store.addLesson(courseId, data);
      else await Store.updateLesson(courseId, lesson.id, data);
      U.toast(isNew ? 'Lektionen lades till' : 'Lektionen sparades', 'ok');
      m.close();
      onDone();
    }),
  });

  fTitle.addEventListener('keydown', (e) => { if (e.key === 'Enter') save.click(); });
  m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Avbryt', onclick: m.close }));
  m.footer.appendChild(save);
}

// ---------------------------------------------------------------
// Block
// ---------------------------------------------------------------
function blockSummary(b) {
  const c = b.content;
  switch (b.type) {
    case 'text': return { main: plainText(c.body), sub: `${c.body.length} tecken` };
    case 'image': return { main: c.caption || c.alt || 'Bild', sub: c.alt ? `Alt-text: ${c.alt}` : 'Ingen alt-text' };
    case 'video': return { main: c.caption || 'YouTube-video', sub: `youtu.be/${c.youtube_id}` };
    case 'flashcard': return { main: c.question, sub: c.answer };
    case 'quiz': return { main: c.question, sub: `Rätt svar: ${c.options[c.correct_index]}` };
    default: return { main: b.type, sub: '' };
  }
}

function blockRow(course, lesson, block, index, redraw) {
  const { main, sub } = blockSummary(block);
  const type = BLOCK_TYPES[block.type];
  const run = (fn) => (e) => U.busy(e.currentTarget, async () => { await fn(); redraw(); });

  return el('div.card-row',
    el('span.card-row__num', { text: String(index + 1) }),
    el('div.card-row__text',
      el('span.card-row__q', { text: main }),
      el('span.card-row__a', { text: sub })
    ),
    U.badge(`${type.icon} ${type.label}`, block.type === 'quiz' ? 'amber' : block.type === 'flashcard' ? 'cool' : ''),
    el('div.row-actions',
      U.actionBtn('↑', 'Upp', { disabled: index === 0, onclick: run(() => Store.moveBlock(course.id, lesson.id, block.id, -1)) }),
      U.actionBtn('↓', 'Ner', { disabled: index === lesson.blocks.length - 1, onclick: run(() => Store.moveBlock(course.id, lesson.id, block.id, 1)) }),
      U.actionBtn('✎', 'Redigera', { onclick: () => openBlockForm(course.id, lesson, block.type, block, redraw) }),
      U.actionBtn('🗑', 'Ta bort', {
        className: 'icon-btn--danger',
        onclick: run(async () => {
          await Store.deleteBlock(course.id, lesson.id, block.id);
          U.toast('Blocket togs bort', 'warn');
        }),
      })
    )
  );
}

function openBlockTypePicker(courseId, lessonId, onDone) {
  const lesson = Store.getLesson(courseId, lessonId);
  const m = U.modal({ title: 'Lägg till block', subtitle: lesson.title });

  m.body.appendChild(el('div.type-grid', Object.keys(BLOCK_TYPES).map((type) =>
    el('button.type-option', {
      type: 'button',
      onclick: () => { m.close(); openBlockForm(courseId, lesson, type, null, onDone); },
    },
      el('span.type-option__icon', { text: BLOCK_TYPES[type].icon }),
      el('span.type-option__label', { text: BLOCK_TYPES[type].label }),
      el('span.type-option__help', { text: BLOCK_HELP[type] })
    )
  )));
  m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Avbryt', onclick: m.close }));
}

function openBlockForm(courseId, lesson, type, block, onDone) {
  const isNew = !block;
  const m = U.modal({
    title: `${isNew ? 'Nytt' : 'Redigera'} block · ${BLOCK_TYPES[type].label}`,
    subtitle: lesson.title,
    wide: type === 'text',
  });

  const form = BLOCK_FORMS[type](m.body, block ? block.content : {});

  const save = el('button.btn.btn--primary', {
    type: 'button', text: isNew ? 'Lägg till' : 'Spara',
    onclick: () => U.busy(save, async () => {
      const content = form.collect();
      if (isNew) await Store.addBlock(courseId, lesson.id, { type, content });
      else await Store.updateBlock(courseId, block.id, { content });
      U.toast(isNew ? 'Blocket lades till' : 'Blocket sparades', 'ok');
      m.close();
      onDone();
    }),
  });

  m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Avbryt', onclick: m.close }));
  m.footer.appendChild(save);
}

// Ett formulär per blocktyp. Varje bygger sina fält i `host` och returnerar
// { collect } som ger innehållet i databasens format eller kastar UserError.
const BLOCK_FORMS = {
  text(host, c) {
    const body = U.textarea({
      value: c.body || '', rows: 14, maxlength: 20000,
      placeholder: '## Rubrik\n\nSkriv lektionstexten här. Tomrad = nytt stycke.\n\n- punkt ett\n- punkt två',
    });
    const preview = el('div.md-preview.prose', { hidden: true });
    let showing = false;
    const toggle = el('button.btn.btn--ghost.btn--sm', {
      type: 'button', text: 'Förhandsgranska',
      onclick: () => {
        showing = !showing;
        if (showing) preview.innerHTML = renderMarkdown(body.value) || '<p>Inget att visa än.</p>';
        preview.hidden = !showing;
        body.hidden = showing;
        toggle.textContent = showing ? 'Fortsätt skriva' : 'Förhandsgranska';
      },
    });

    host.appendChild(U.field('Text', body, 'Markdown: ## rubrik, **fetstil**, *kursiv*, - punktlista, [länk](https://…)'));
    host.appendChild(preview);
    host.appendChild(toggle);

    return {
      collect() {
        const value = body.value.trim();
        if (!value) throw new UserError('Skriv en text innan du sparar.');
        return { body: value };
      },
    };
  },

  image(host, c) {
    let path = c.path || null;
    const img = el('img.image-preview__img', { alt: '' });
    const empty = el('div.image-preview__empty', { text: 'Ingen bild vald' });
    const file = el('input', { type: 'file', accept: IMAGE_TYPES.join(','), hidden: true });
    const pick = el('button.btn.btn--ghost', { type: 'button', onclick: () => file.click() });
    const alt = U.input({ value: c.alt || '', placeholder: 'Beskriv bilden för den som inte ser den', maxlength: 300 });
    const caption = U.input({ value: c.caption || '', placeholder: 'Visas under bilden (valfritt)', maxlength: 300 });

    function sync() {
      img.hidden = !path;
      empty.hidden = !!path;
      if (path) img.src = mediaUrl(path);
      pick.textContent = path ? 'Byt bild…' : 'Välj bild…';
    }
    file.addEventListener('change', async () => {
      const f = file.files[0];
      file.value = '';
      if (!f) return;
      await U.busy(pick, async () => { path = await Store.uploadBlockImage(f); sync(); });
    });
    sync();

    host.appendChild(el('div.image-preview', img, empty));
    host.appendChild(el('div.upload-row', pick, file, el('span.field__hint', { text: 'JPG, PNG, WebP eller GIF · max 5 MB' })));
    host.appendChild(U.field('Alt-text', alt, 'Läses upp av skärmläsare — viktigt för tillgänglighet'));
    host.appendChild(U.field('Bildtext', caption));

    return {
      collect() {
        if (!path) throw new UserError('Välj en bild först.');
        const out = { path };
        if (alt.value.trim()) out.alt = alt.value.trim();
        if (caption.value.trim()) out.caption = caption.value.trim();
        return out;
      },
    };
  },

  video(host, c) {
    const url = U.input({
      value: c.youtube_id ? `https://youtu.be/${c.youtube_id}` : '',
      placeholder: 'https://www.youtube.com/watch?v=…',
    });
    const thumb = el('img.image-preview__img', { alt: '' });
    const empty = el('div.image-preview__empty');
    const caption = U.input({ value: c.caption || '', placeholder: 'Visas under videon (valfritt)', maxlength: 300 });

    function sync() {
      const id = youtubeId(url.value);
      thumb.hidden = !id;
      empty.hidden = !!id;
      if (id) thumb.src = youtubeThumbUrl(id);
      empty.textContent = url.value.trim() && !id
        ? 'Länken känns inte igen som en YouTube-video'
        : 'Klistra in en YouTube-länk så visas videon här';
    }
    url.addEventListener('input', sync);
    sync();

    host.appendChild(U.field('YouTube-länk', url, 'Videon spelas via youtube-nocookie.com'));
    host.appendChild(el('div.image-preview.image-preview--video', thumb, empty));
    host.appendChild(U.field('Bildtext', caption));

    return {
      collect() {
        const id = youtubeId(url.value);
        if (!id) throw new UserError('Klistra in en giltig YouTube-länk.');
        const out = { youtube_id: id };
        if (caption.value.trim()) out.caption = caption.value.trim();
        return out;
      },
    };
  },

  flashcard(host, c) {
    const question = U.textarea({ value: c.question || '', rows: 2, maxlength: 1000, placeholder: 'Vad står UX för?' });
    const answer = U.textarea({ value: c.answer || '', rows: 4, maxlength: 4000, placeholder: 'Svaret som visas när kortet vänds' });
    host.appendChild(U.field('Framsida (fråga)', question));
    host.appendChild(U.field('Baksida (svar)', answer));

    return {
      collect() {
        if (!question.value.trim()) throw new UserError('Skriv en fråga på framsidan.');
        if (!answer.value.trim()) throw new UserError('Skriv ett svar på baksidan.');
        return { question: question.value.trim(), answer: answer.value.trim() };
      },
    };
  },

  quiz(host, c) {
    return quizEditor(host, c);
  },
};

// ---------------------------------------------------------------
// Export
// ---------------------------------------------------------------
function exportCourses(courses) {
  const rows = [['Titel', 'Kategori', 'Nivå', 'Lektioner', 'Minuter', 'Block', 'XP', 'Status', 'Taggar', 'Skapad', 'Ändrad']];
  courses.forEach((c) => {
    const s = courseStats(c);
    rows.push([
      c.title, categoryLabel(c.categoryId), c.level, s.lessonCount, s.minutes, s.blockCount, c.xp,
      c.published ? 'Publicerad' : 'Utkast', c.tags.join(' '),
      c.createdAt.slice(0, 10), c.updatedAt.slice(0, 10),
    ]);
  });
  U.downloadCsv('quickthinkers-kurser.csv', rows);
  U.toast('Kurser exporterade', 'ok');
}
