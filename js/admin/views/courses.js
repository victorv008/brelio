// QuickThinkers adminportal — kurshantering.
// Lista → kursformulär → kortlekar → kort. Allt mot QTStore.

(function () {
  'use strict';

  var U = window.QTUI;
  var el = U.el;
  var Store = window.QTStore;

  var filter = { query: '', category: 'all', status: 'all', level: 'all', sort: 'updated' };

  // ---------------------------------------------------------------
  // Vy: lista
  // ---------------------------------------------------------------
  function render(host, ctx) {
    U.clear(host);

    var all = Store.getState().courses;

    host.appendChild(el('div.page-head',
      el('div',
        el('h1.page-title', { text: 'Kurser' }),
        el('p.page-sub', {
          text: all.length + ' kurser · ' +
            all.filter(function (c) { return c.published; }).length + ' publicerade · ' +
            all.filter(function (c) { return !c.published; }).length + ' utkast',
        })
      ),
      el('div.page-actions',
        el('button.btn.btn--ghost', {
          type: 'button', text: 'Exportera CSV',
          onclick: function () { exportCourses(all); },
        }),
        el('button.btn.btn--primary', {
          type: 'button', onclick: function () { openCourseForm(null, ctx); },
        }, el('span', { text: '＋' }), el('span', { text: 'Ny kurs' }))
      )
    ));

    // ---- Filterrad ----
    var searchInput = U.input({
      type: 'search', placeholder: 'Sök titel, beskrivning eller tagg…',
      value: filter.query,
      oninput: function (e) { filter.query = e.target.value; rerenderList(); },
    });

    var categoryOptions = [{ value: 'all', label: 'Alla kategorier' }].concat(
      window.QT_MOCK.categories.map(function (c) { return { value: c.label, label: c.emoji + '  ' + c.label }; })
    );

    host.appendChild(el('div.toolbar',
      el('div.toolbar__search', el('span.toolbar__icon', { text: '⌕' }), searchInput),
      U.select(categoryOptions, filter.category, {
        onchange: function (e) { filter.category = e.target.value; rerenderList(); },
      }),
      U.select([
        { value: 'all', label: 'Alla nivåer' },
        { value: 'Nybörjare', label: 'Nybörjare' },
        { value: 'Medel', label: 'Medel' },
        { value: 'Avancerad', label: 'Avancerad' },
      ], filter.level, {
        onchange: function (e) { filter.level = e.target.value; rerenderList(); },
      }),
      U.select([
        { value: 'all', label: 'Alla statusar' },
        { value: 'published', label: 'Publicerade' },
        { value: 'draft', label: 'Utkast' },
      ], filter.status, {
        onchange: function (e) { filter.status = e.target.value; rerenderList(); },
      }),
      U.select([
        { value: 'updated', label: 'Senast ändrad' },
        { value: 'created', label: 'Senast skapad' },
        { value: 'title', label: 'Titel A–Ö' },
        { value: 'order', label: 'Visningsordning' },
      ], filter.sort, {
        onchange: function (e) { filter.sort = e.target.value; rerenderList(); },
      })
    ));

    var listHost = el('div.list-host');
    host.appendChild(listHost);

    function rerenderList() {
      U.clear(listHost);
      var rows = Store.listCourses(filter);

      if (!rows.length) {
        listHost.appendChild(U.emptyState('🔍', 'Inga kurser matchar',
          'Prova att rensa sökningen eller filtren.',
          el('button.btn.btn--ghost', {
            type: 'button', text: 'Rensa filter',
            onclick: function () {
              filter = { query: '', category: 'all', status: 'all', level: 'all', sort: 'updated' };
              render(host, ctx);
            },
          })
        ));
        return;
      }

      var table = el('div.table.table--courses');
      table.appendChild(el('div.table__head',
        el('span', { text: 'Kurs' }),
        el('span', { text: 'Kategori' }),
        el('span', { text: 'Nivå' }),
        el('span', { text: 'Innehåll' }),
        el('span', { text: 'Status' }),
        el('span', { text: 'Ändrad' }),
        el('span', { text: '' })
      ));

      rows.forEach(function (c) {
        table.appendChild(courseRow(c, ctx));
      });
      listHost.appendChild(table);
    }

    rerenderList();
  }

  function courseRow(c, ctx) {
    var cardCount = (c.decks || []).reduce(function (s, d) { return s + (d.cards || []).length; }, 0);

    return el('div.table__row',
      el('div.course-cell',
        el('div.course-thumb', { style: { background: c.poster, boxShadow: '0 0 0 1px rgba(255,255,255,.06), 0 6px 18px -8px ' + c.glow } },
          el('span', { text: c.emoji })
        ),
        el('div.course-cell__text',
          el('span.course-cell__title', { text: c.title }),
          el('span.course-cell__desc', { text: c.description })
        )
      ),
      el('span.cell-muted', { 'data-label': 'Kategori', text: c.category }),
      el('span', { 'data-label': 'Nivå' },
        U.badge(c.level, c.level === 'Nybörjare' ? 'cool' : c.level === 'Medel' ? 'amber' : 'accent')),
      el('span.cell-muted', { 'data-label': 'Innehåll', text: (c.decks || []).length + ' lekar · ' + cardCount + ' kort' }),
      el('span', { 'data-label': 'Status' },
        el('button.status-pill', {
          type: 'button',
          className: c.published ? 'status-pill--live' : 'status-pill--draft',
          title: c.published ? 'Klicka för att avpublicera' : 'Klicka för att publicera',
          onclick: function () {
            Store.togglePublish(c.id);
            U.toast(c.published ? 'Kursen avpublicerades' : 'Kursen publicerades', c.published ? 'warn' : 'ok');
            ctx.refresh();
          },
        }, el('span.status-dot'), el('span', { text: c.published ? 'Publicerad' : 'Utkast' }))
      ),
      el('span.cell-muted', { 'data-label': 'Ändrad', text: U.relativeTime(c.updatedAt) }),
      el('div.row-actions',
        U.actionBtn('▤', 'Kortlekar', {
          onclick: function () { openDeckManager(c.id, ctx); },
        }),
        U.actionBtn('✎', 'Redigera', {
          onclick: function () { openCourseForm(c.id, ctx); },
        }),
        U.actionBtn('⧉', 'Duplicera', {
          onclick: function () {
            var copy = Store.duplicateCourse(c.id);
            U.toast('Kopia skapad: ' + copy.title, 'ok');
            ctx.refresh();
          },
        }),
        U.actionBtn('🗑', 'Ta bort', {
          className: 'icon-btn--danger',
          onclick: function () {
            U.confirm({
              title: 'Ta bort kursen?',
              message: '"' + c.title + '" och alla dess kortlekar och frågor tas bort. Det går inte att ångra.',
              confirmLabel: 'Ta bort',
              danger: true,
            }).then(function (ok) {
              if (!ok) return;
              Store.deleteCourse(c.id);
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
    var isNew = !courseId;
    var c = isNew ? {
      title: '', description: '', why: '', category: 'Design', emoji: '📚',
      level: 'Nybörjare', lessons: 8, minutes: 30, xp: 100,
      glow: '#7C6BFF', poster: 'linear-gradient(150deg,#1b1b27,#242433)',
      tags: [], published: false,
    } : Store.getCourse(courseId);

    if (!c) { U.toast('Kursen hittades inte', 'warn'); return; }

    var m = U.modal({
      title: isNew ? 'Ny kurs' : 'Redigera kurs',
      subtitle: isNew ? 'Fyll i grunderna — du kan lägga till kortlekar efteråt.' : c.title,
      wide: true,
    });

    var fTitle = U.input({ value: c.title, placeholder: 'T.ex. UX för nybörjare', required: true });
    var fDesc = U.textarea({ value: c.description, placeholder: 'Kort beskrivning som visas på kortet' });
    var fWhy = U.input({ value: c.why, placeholder: 'Passar dig som…' });
    var fEmoji = U.input({ value: c.emoji, maxlength: 4, className: 'input--emoji' });
    var fCategory = U.select(
      window.QT_MOCK.categories.map(function (x) { return { value: x.label, label: x.emoji + '  ' + x.label }; }),
      c.category
    );
    var fLevel = U.select(
      window.QT_MOCK.levels.map(function (l) { return { value: l, label: l }; }), c.level
    );
    var fLessons = U.input({ type: 'number', value: c.lessons, min: 0 });
    var fMinutes = U.input({ type: 'number', value: c.minutes, min: 0 });
    var fXp = U.input({ type: 'number', value: c.xp, min: 0 });
    var fGlow = el('input.input.input--color', { type: 'color', value: c.glow });
    var fPoster = U.input({ value: c.poster, placeholder: 'linear-gradient(...)' });
    var fTags = U.input({ value: (c.tags || []).join(', '), placeholder: 'ux, design, grunder' });
    var fPublished = el('input', { type: 'checkbox' });
    fPublished.checked = !!c.published;

    // Levande förhandsvisning av kortkonsten
    var preview = el('div.poster-preview', { style: { background: c.poster } },
      el('span.poster-preview__emoji', { text: c.emoji }),
      el('span.poster-preview__title', { text: c.title || 'Kurstitel' })
    );

    function syncPreview() {
      preview.style.background = fPoster.value;
      preview.style.boxShadow = '0 10px 34px -14px ' + fGlow.value;
      preview.querySelector('.poster-preview__emoji').textContent = fEmoji.value || '📚';
      preview.querySelector('.poster-preview__title').textContent = fTitle.value || 'Kurstitel';
    }
    [fTitle, fEmoji, fPoster, fGlow].forEach(function (i) { i.addEventListener('input', syncPreview); });
    syncPreview();

    m.body.appendChild(el('div.form-grid',
      el('div.form-col',
        U.field('Titel', fTitle),
        U.field('Beskrivning', fDesc),
        U.field('Varför kursen passar', fWhy, 'Visas som en liten rad under titeln i appen'),
        el('div.form-row',
          U.field('Emoji', fEmoji),
          U.field('Kategori', fCategory),
          U.field('Nivå', fLevel)
        ),
        el('div.form-row',
          U.field('Lektioner', fLessons),
          U.field('Minuter', fMinutes),
          U.field('XP', fXp)
        ),
        U.field('Taggar', fTags, 'Kommaseparerade')
      ),
      el('div.form-col',
        el('span.field__label', { text: 'Kortkonst' }),
        preview,
        U.field('Glöd', fGlow),
        U.field('Bakgrund', fPoster, 'CSS-gradient'),
        el('label.switch',
          fPublished,
          el('span.switch__track', el('span.switch__thumb')),
          el('span.switch__label', { text: 'Publicerad — syns i appen' })
        )
      )
    ));

    m.footer.appendChild(el('button.btn.btn--ghost', {
      type: 'button', text: 'Avbryt', onclick: m.close,
    }));
    m.footer.appendChild(el('button.btn.btn--primary', {
      type: 'button', text: isNew ? 'Skapa kurs' : 'Spara ändringar',
      onclick: function () {
        if (!fTitle.value.trim()) {
          U.toast('Kursen behöver en titel', 'warn');
          fTitle.focus();
          return;
        }
        var data = {
          title: fTitle.value.trim(),
          description: fDesc.value.trim(),
          why: fWhy.value.trim(),
          category: fCategory.value,
          emoji: fEmoji.value.trim() || '📚',
          level: fLevel.value,
          lessons: fLessons.value,
          minutes: fMinutes.value,
          xp: fXp.value,
          glow: fGlow.value,
          poster: fPoster.value.trim(),
          tags: fTags.value.split(',').map(function (t) { return t.trim(); }).filter(Boolean),
          published: fPublished.checked,
        };
        if (isNew) {
          var created = Store.createCourse(data);
          U.toast('Kursen skapades', 'ok');
          m.close();
          ctx.refresh();
          openDeckManager(created.id, ctx);
        } else {
          Store.updateCourse(courseId, data);
          U.toast('Ändringarna sparades', 'ok');
          m.close();
          ctx.refresh();
        }
      },
    }));
  }

  // ---------------------------------------------------------------
  // Kortlekar
  // ---------------------------------------------------------------
  function openDeckManager(courseId, ctx) {
    var course = Store.getCourse(courseId);
    if (!course) { U.toast('Kursen hittades inte', 'warn'); return; }

    var m = U.modal({
      title: 'Kortlekar',
      subtitle: course.emoji + '  ' + course.title,
      wide: true,
    });

    function draw() {
      var c = Store.getCourse(courseId);
      if (!c) { m.close(); return; }

      U.clear(m.body);
      U.clear(m.footer);

      var decks = c.decks || [];

      if (!decks.length) {
        m.body.appendChild(U.emptyState('▤', 'Inga kortlekar än',
          'En kortlek samlar frågorna som användaren swipar igenom.'));
      } else {
        var list = el('div.deck-list');
        decks.forEach(function (d, i) {
          list.appendChild(deckCard(c, d, i, draw));
        });
        m.body.appendChild(list);
      }

      m.footer.appendChild(el('button.btn.btn--ghost', {
        type: 'button', text: 'Stäng',
        onclick: function () { m.close(); ctx.refresh(); },
      }));
      m.footer.appendChild(el('button.btn.btn--primary', {
        type: 'button', text: '＋ Ny kortlek',
        onclick: function () {
          promptText('Ny kortlek', 'Namn på kortleken', '', function (title) {
            Store.addDeck(courseId, title);
            U.toast('Kortlek tillagd', 'ok');
            draw();
          });
        },
      }));
    }

    function deckCard(course, deck, index, redraw) {
      var cards = deck.cards || [];
      var body = el('div.deck__cards');

      if (!cards.length) {
        body.appendChild(el('p.deck__empty', { text: 'Inga kort än — lägg till den första frågan.' }));
      } else {
        cards.forEach(function (k, ki) {
          body.appendChild(el('div.card-row',
            el('span.card-row__num', { text: String(ki + 1) }),
            el('div.card-row__text',
              el('span.card-row__q', { text: k.question || '(tom fråga)' }),
              el('span.card-row__a', {
                text: k.type === 'quiz'
                  ? 'Rätt svar: ' + (k.options[k.correctIndex] || '—')
                  : k.answer,
              })
            ),
            U.badge(k.type === 'quiz' ? 'Quiz' : 'Flashcard', k.type === 'quiz' ? 'amber' : 'cool'),
            el('div.row-actions',
              U.actionBtn('↑', 'Upp', {
                disabled: ki === 0,
                onclick: function () { Store.moveCard(course.id, deck.id, k.id, -1); redraw(); },
              }),
              U.actionBtn('↓', 'Ner', {
                disabled: ki === cards.length - 1,
                onclick: function () { Store.moveCard(course.id, deck.id, k.id, 1); redraw(); },
              }),
              U.actionBtn('✎', 'Redigera', {
                onclick: function () { openCardForm(course.id, deck.id, k, redraw); },
              }),
              U.actionBtn('🗑', 'Ta bort', {
                className: 'icon-btn--danger',
                onclick: function () {
                  Store.deleteCard(course.id, deck.id, k.id);
                  U.toast('Kortet togs bort', 'warn');
                  redraw();
                },
              })
            )
          ));
        });
      }

      return el('div.deck',
        el('div.deck__head',
          el('div.deck__title',
            el('span.deck__index', { text: String(index + 1) }),
            el('span', { text: deck.title }),
            el('span.deck__count', { text: cards.length + ' kort' })
          ),
          el('div.row-actions',
            U.actionBtn('✎', 'Byt namn', {
              onclick: function () {
                promptText('Byt namn', 'Namn på kortleken', deck.title, function (t) {
                  Store.updateDeck(course.id, deck.id, { title: t });
                  redraw();
                });
              },
            }),
            U.actionBtn('🗑', 'Ta bort', {
              className: 'icon-btn--danger',
              onclick: function () {
                U.confirm({
                  title: 'Ta bort kortleken?',
                  message: '"' + deck.title + '" och dess ' + cards.length + ' kort tas bort.',
                  confirmLabel: 'Ta bort', danger: true,
                }).then(function (ok) {
                  if (!ok) return;
                  Store.deleteDeck(course.id, deck.id);
                  U.toast('Kortleken togs bort', 'warn');
                  redraw();
                });
              },
            })
          )
        ),
        body,
        el('button.btn.btn--ghost.btn--sm', {
          type: 'button', text: '＋ Lägg till kort',
          onclick: function () { openCardForm(course.id, deck.id, null, redraw); },
        })
      );
    }

    draw();
  }

  // ---------------------------------------------------------------
  // Kortformulär — flashcard eller quiz
  // ---------------------------------------------------------------
  function openCardForm(courseId, deckId, card, onDone) {
    var isNew = !card;
    var data = card || { type: 'flashcard', question: '', answer: '', options: ['', '', '', ''], correctIndex: 0 };

    var m = U.modal({
      title: isNew ? 'Nytt kort' : 'Redigera kort',
      subtitle: 'Flashcard visar svaret på baksidan. Quiz ger fyra alternativ.',
    });

    var fType = U.select([
      { value: 'flashcard', label: 'Flashcard — fråga och svar' },
      { value: 'quiz', label: 'Quiz — fyra alternativ' },
    ], data.type);

    var fQuestion = U.textarea({ value: data.question, placeholder: 'Vad står UX för?', rows: 2 });
    var fAnswer = U.textarea({ value: data.answer, placeholder: 'Svaret som visas på baksidan', rows: 3 });

    var optionInputs = [];
    var optionsWrap = el('div.options');
    var radioName = 'correct_' + Math.random().toString(36).slice(2);

    for (var i = 0; i < 4; i++) {
      (function (idx) {
        var radio = el('input', { type: 'radio', name: radioName, value: String(idx) });
        radio.checked = data.correctIndex === idx;
        var text = U.input({
          value: (data.options && data.options[idx]) || '',
          placeholder: 'Alternativ ' + (idx + 1),
        });
        optionInputs.push({ radio: radio, text: text });
        optionsWrap.appendChild(el('label.option-row',
          radio,
          el('span.option-row__mark'),
          text
        ));
      })(i);
    }

    var answerField = U.field('Svar', fAnswer);
    var optionsField = el('div.field',
      el('span.field__label', { text: 'Alternativ' }),
      el('span.field__hint', { text: 'Markera det rätta svaret till vänster' }),
      optionsWrap
    );

    function syncType() {
      var quiz = fType.value === 'quiz';
      answerField.style.display = quiz ? 'none' : '';
      optionsField.style.display = quiz ? '' : 'none';
    }
    fType.addEventListener('change', syncType);

    m.body.appendChild(U.field('Korttyp', fType));
    m.body.appendChild(U.field('Fråga', fQuestion));
    m.body.appendChild(answerField);
    m.body.appendChild(optionsField);
    syncType();

    m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Avbryt', onclick: m.close }));
    m.footer.appendChild(el('button.btn.btn--primary', {
      type: 'button', text: isNew ? 'Lägg till' : 'Spara',
      onclick: function () {
        var q = fQuestion.value.trim();
        if (!q) { U.toast('Kortet behöver en fråga', 'warn'); fQuestion.focus(); return; }

        var payload = { type: fType.value, question: q };

        if (fType.value === 'quiz') {
          var opts = optionInputs.map(function (o) { return o.text.value.trim(); });
          if (opts.filter(Boolean).length < 2) {
            U.toast('Ange minst två alternativ', 'warn');
            return;
          }
          var correct = optionInputs.findIndex(function (o) { return o.radio.checked; });
          if (!opts[correct]) {
            U.toast('Det markerade alternativet är tomt', 'warn');
            return;
          }
          payload.options = opts;
          payload.correctIndex = correct;
          payload.answer = '';
        } else {
          if (!fAnswer.value.trim()) { U.toast('Kortet behöver ett svar', 'warn'); fAnswer.focus(); return; }
          payload.answer = fAnswer.value.trim();
          payload.options = [];
          payload.correctIndex = 0;
        }

        if (isNew) Store.addCard(courseId, deckId, payload);
        else Store.updateCard(courseId, deckId, card.id, payload);

        U.toast(isNew ? 'Kortet lades till' : 'Kortet sparades', 'ok');
        m.close();
        onDone();
      },
    }));
  }

  // ---------------------------------------------------------------
  // Liten textprompt
  // ---------------------------------------------------------------
  function promptText(title, label, value, onSave) {
    var m = U.modal({ title: title });
    var inp = U.input({ value: value, placeholder: label });
    m.body.appendChild(U.field(label, inp));

    function save() {
      var v = inp.value.trim();
      if (!v) { U.toast('Fältet får inte vara tomt', 'warn'); return; }
      m.close();
      onSave(v);
    }
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') save(); });

    m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Avbryt', onclick: m.close }));
    m.footer.appendChild(el('button.btn.btn--primary', { type: 'button', text: 'Spara', onclick: save }));
  }

  // ---------------------------------------------------------------
  // Export
  // ---------------------------------------------------------------
  function exportCourses(courses) {
    var rows = [['Titel', 'Kategori', 'Nivå', 'Lektioner', 'Minuter', 'XP', 'Kortlekar', 'Kort', 'Status', 'Taggar', 'Skapad', 'Ändrad']];
    courses.forEach(function (c) {
      var cards = (c.decks || []).reduce(function (s, d) { return s + (d.cards || []).length; }, 0);
      rows.push([
        c.title, c.category, c.level, c.lessons, c.minutes, c.xp,
        (c.decks || []).length, cards,
        c.published ? 'Publicerad' : 'Utkast',
        (c.tags || []).join(' '),
        c.createdAt.slice(0, 10), c.updatedAt.slice(0, 10),
      ]);
    });
    U.downloadCsv('quickthinkers-kurser.csv', rows);
    U.toast('Kurser exporterade', 'ok');
  }

  window.QTViewCourses = { render: render };
})();
