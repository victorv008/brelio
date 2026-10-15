// QuickThinkers adminportal — användarhantering.
// Lista, sök, roller, bannlysning och progressvy.

(function () {
  'use strict';

  var U = window.QTUI;
  var el = U.el;
  var Store = window.QTStore;

  var filter = { query: '', role: 'all', status: 'all', sort: 'active' };

  var ROLE_LABEL = { user: 'Användare', premium: 'Premium', admin: 'Admin' };
  var ROLE_KIND = { user: '', premium: 'amber', admin: 'accent' };

  function render(host, ctx) {
    U.clear(host);

    var all = Store.getState().users;

    host.appendChild(el('div.page-head',
      el('div',
        el('h1.page-title', { text: 'Användare' }),
        el('p.page-sub', {
          text: all.length + ' konton · ' +
            all.filter(function (u) { return u.status === 'active'; }).length + ' aktiva · ' +
            all.filter(function (u) { return u.status === 'banned'; }).length + ' bannade',
        })
      ),
      el('div.page-actions',
        el('button.btn.btn--ghost', {
          type: 'button', text: 'Exportera CSV',
          onclick: function () { exportUsers(all); },
        })
      )
    ));

    var searchInput = U.input({
      type: 'search', placeholder: 'Sök namn eller e-post…', value: filter.query,
      oninput: function (e) { filter.query = e.target.value; draw(); },
    });

    host.appendChild(el('div.toolbar',
      el('div.toolbar__search', el('span.toolbar__icon', { text: '⌕' }), searchInput),
      U.select([
        { value: 'all', label: 'Alla roller' },
        { value: 'user', label: 'Användare' },
        { value: 'premium', label: 'Premium' },
        { value: 'admin', label: 'Admin' },
      ], filter.role, { onchange: function (e) { filter.role = e.target.value; draw(); } }),
      U.select([
        { value: 'all', label: 'Alla statusar' },
        { value: 'active', label: 'Aktiva' },
        { value: 'banned', label: 'Bannade' },
      ], filter.status, { onchange: function (e) { filter.status = e.target.value; draw(); } }),
      U.select([
        { value: 'active', label: 'Senast aktiv' },
        { value: 'joined', label: 'Senast registrerad' },
        { value: 'xp', label: 'Mest XP' },
        { value: 'name', label: 'Namn A–Ö' },
      ], filter.sort, { onchange: function (e) { filter.sort = e.target.value; draw(); } })
    ));

    var listHost = el('div.list-host');
    host.appendChild(listHost);

    function draw() {
      U.clear(listHost);
      var rows = Store.listUsers(filter);

      if (!rows.length) {
        listHost.appendChild(U.emptyState('👤', 'Inga användare matchar',
          'Prova att ändra sökningen eller filtren.'));
        return;
      }

      var table = el('div.table.table--users');
      table.appendChild(el('div.table__head',
        el('span', { text: 'Användare' }),
        el('span', { text: 'Roll' }),
        el('span', { text: 'XP' }),
        el('span', { text: 'Streak' }),
        el('span', { text: 'Kurser' }),
        el('span', { text: 'Senast aktiv' }),
        el('span', { text: 'Status' }),
        el('span', { text: '' })
      ));

      rows.forEach(function (u) { table.appendChild(userRow(u, draw, ctx)); });
      listHost.appendChild(table);
    }

    draw();
  }

  function initials(name) {
    return name.split(' ').map(function (p) { return p[0]; }).slice(0, 2).join('').toUpperCase();
  }

  function userRow(u, redraw, ctx) {
    var done = (u.progress || []).filter(function (p) { return p.percent >= 100; }).length;
    var started = (u.progress || []).length;

    return el('div.table__row', { className: u.status === 'banned' ? 'table__row--muted' : '' },
      el('div.user-cell',
        el('span.avatar', { style: { background: u.avatarColor + '22', color: u.avatarColor, borderColor: u.avatarColor + '44' }, text: initials(u.name) }),
        el('div.user-cell__text',
          el('span.user-cell__name', { text: u.name }),
          el('span.user-cell__mail', { text: u.email })
        )
      ),
      el('span', { 'data-label': 'Roll' },
        U.select(
          Object.keys(ROLE_LABEL).map(function (r) { return { value: r, label: ROLE_LABEL[r] }; }),
          u.role,
          {
            className: 'select--inline',
            onchange: function (e) {
              Store.setUserRole(u.id, e.target.value);
              U.toast(u.name + ' är nu ' + ROLE_LABEL[e.target.value].toLowerCase(), 'ok');
              redraw();
            },
          }
        )
      ),
      el('span.cell-mono', { 'data-label': 'XP', text: U.formatNumber(u.xp) }),
      el('span.cell-mono', { 'data-label': 'Streak', text: u.streak ? u.streak + ' 🔥' : '—' }),
      el('span.cell-muted', { 'data-label': 'Kurser', text: done + '/' + started + ' klara' }),
      el('span.cell-muted', { 'data-label': 'Senast aktiv', text: U.relativeTime(u.lastActiveAt) }),
      el('span', { 'data-label': 'Status' },
        U.badge(u.status === 'banned' ? 'Bannad' : 'Aktiv', u.status === 'banned' ? 'danger' : 'ok')
      ),
      el('div.row-actions',
        U.actionBtn('◫', 'Progress', {
          onclick: function () { openUserDetail(u.id, redraw); },
        }),
        U.actionBtn(
          u.status === 'banned' ? '↺' : '⊘',
          u.status === 'banned' ? 'Häv bann' : 'Banna',
          {
            className: u.status === 'banned' ? '' : 'icon-btn--danger',
            onclick: function () {
              if (u.status === 'banned') {
                Store.toggleBan(u.id);
                U.toast(u.name + ' är aktiv igen', 'ok');
                redraw();
                return;
              }
              U.confirm({
                title: 'Banna användaren?',
                message: u.name + ' stängs av och kan inte logga in. Du kan häva det när som helst.',
                confirmLabel: 'Banna', danger: true,
              }).then(function (ok) {
                if (!ok) return;
                Store.toggleBan(u.id);
                U.toast(u.name + ' bannades', 'warn');
                redraw();
              });
            },
          }
        ),
        U.actionBtn('🗑', 'Ta bort', {
          className: 'icon-btn--danger',
          onclick: function () {
            U.confirm({
              title: 'Ta bort kontot?',
              message: 'Kontot för ' + u.name + ' raderas permanent, inklusive XP och progress.',
              confirmLabel: 'Ta bort', danger: true,
            }).then(function (ok) {
              if (!ok) return;
              Store.deleteUser(u.id);
              U.toast('Kontot togs bort', 'warn');
              ctx.refresh();
            });
          },
        })
      )
    );
  }

  // ---------------------------------------------------------------
  // Detaljvy
  // ---------------------------------------------------------------
  function openUserDetail(userId, redraw) {
    var u = Store.getUser(userId);
    if (!u) return;

    var m = U.modal({ title: u.name, subtitle: u.email, wide: true });

    m.body.appendChild(el('div.stat-strip',
      statBox('XP totalt', U.formatNumber(u.xp), 'amber'),
      statBox('Streak', u.streak ? u.streak + ' dagar' : 'Ingen', 'accent'),
      statBox('Kurser påbörjade', String((u.progress || []).length), 'cool'),
      statBox('Kurser klara', String((u.progress || []).filter(function (p) { return p.percent >= 100; }).length), 'ok')
    ));

    m.body.appendChild(el('div.detail-meta',
      metaRow('Roll', ROLE_LABEL[u.role]),
      metaRow('Status', u.status === 'banned' ? 'Bannad' : 'Aktiv'),
      metaRow('Registrerad', U.formatDate(u.joinedAt)),
      metaRow('Senast aktiv', U.relativeTime(u.lastActiveAt))
    ));

    m.body.appendChild(el('h3.section-title', { text: 'Progress per kurs' }));

    if (!(u.progress || []).length) {
      m.body.appendChild(el('p.deck__empty', { text: 'Användaren har inte påbörjat någon kurs än.' }));
    } else {
      var wrap = el('div.progress-list');
      u.progress.forEach(function (p) {
        var c = Store.getCourse(p.courseId);
        if (!c) return;
        wrap.appendChild(el('div.progress-item',
          el('span.progress-item__emoji', { text: c.emoji }),
          el('div.progress-item__body',
            el('div.progress-item__top',
              el('span.progress-item__title', { text: c.title }),
              el('span.progress-item__pct', { text: p.percent + ' %' })
            ),
            el('div.bar', el('div.bar__fill', {
              style: {
                width: p.percent + '%',
                background: p.percent >= 100 ? 'var(--cool)' : 'var(--fire)',
              },
            }))
          )
        ));
      });
      m.body.appendChild(wrap);
    }

    m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Stäng', onclick: m.close }));
    m.footer.appendChild(el('button.btn', {
      type: 'button',
      className: u.status === 'banned' ? 'btn--primary' : 'btn--danger',
      text: u.status === 'banned' ? 'Häv bannlysning' : 'Banna användaren',
      onclick: function () {
        Store.toggleBan(u.id);
        U.toast(u.status === 'banned' ? u.name + ' bannades' : u.name + ' är aktiv igen', 'warn');
        m.close();
        redraw();
      },
    }));
  }

  function statBox(label, value, kind) {
    return el('div.stat-box',
      el('span.stat-box__label', { text: label }),
      el('span.stat-box__value', { className: kind ? 'is-' + kind : '', text: value })
    );
  }

  function metaRow(label, value) {
    return el('div.meta-row',
      el('span.meta-row__label', { text: label }),
      el('span.meta-row__value', { text: value })
    );
  }

  // ---------------------------------------------------------------
  // Export
  // ---------------------------------------------------------------
  function exportUsers(users) {
    var rows = [['Namn', 'E-post', 'Roll', 'Status', 'XP', 'Streak', 'Påbörjade kurser', 'Klara kurser', 'Registrerad', 'Senast aktiv']];
    users.forEach(function (u) {
      rows.push([
        u.name, u.email, ROLE_LABEL[u.role],
        u.status === 'banned' ? 'Bannad' : 'Aktiv',
        u.xp, u.streak,
        (u.progress || []).length,
        (u.progress || []).filter(function (p) { return p.percent >= 100; }).length,
        u.joinedAt.slice(0, 10), u.lastActiveAt.slice(0, 10),
      ]);
    });
    U.downloadCsv('quickthinkers-anvandare.csv', rows);
    U.toast('Användare exporterade', 'ok');
  }

  window.QTViewUsers = { render: render };
})();
