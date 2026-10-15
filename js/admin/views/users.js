// QuickThinkers adminportal — användarhantering.
// Lista, sök, roller, bannlysning, radering och progress per kurs.
// Bann och radering går via Edge Function admin-users (kräver secret-nyckel).
import * as Store from '../store.js';
import { errorMessage } from '../../lib/supabase.js';

const U = window.QTUI;
const el = U.el;

let filter = { query: '', role: 'all', status: 'all', sort: 'active' };

const ROLE_LABEL = { user: 'Användare', admin: 'Admin' };
const AVATAR_COLORS = ['#FF4E42', '#7C6BFF', '#FFB23E', '#2DD4BF', '#9A6BFF', '#6E7BFF', '#FF9233'];

// Samma färg för samma användare varje gång.
function avatarColor(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function initials(name) {
  return name.split(/[\s.@_-]+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?';
}

const isMe = (u) => u.id === Store.getState().me.id;

export function render(host, ctx) {
  U.clear(host);
  const state = Store.getState();
  const all = state.users;
  const registered = all.filter((u) => !u.isAnonymous);

  host.appendChild(el('div.page-head',
    el('div',
      el('h1.page-title', { text: 'Användare' }),
      el('p.page-sub', {
        text: `${registered.length} konton · ${registered.filter((u) => u.status === 'banned').length} bannade · ${state.guestCount} gäster`,
      })
    ),
    el('div.page-actions',
      el('button.btn.btn--ghost', { type: 'button', text: 'Exportera CSV', onclick: () => exportUsers(all) }),
      el('button.btn.btn--primary', { type: 'button', onclick: () => openInvite(ctx) },
        el('span', { text: '＋' }), el('span', { text: 'Bjud in admin' }))
    )
  ));

  const invitesHost = el('div');
  host.appendChild(invitesHost);
  drawInvites(invitesHost, ctx);

  // Den som löst in en inbjudan ska dyka upp utan att sidan laddas om.
  Store.refreshUsersIfStale().then((changed) => { if (changed) ctx.refresh(); }).catch(() => {});

  const guestToggle = el('input', { type: 'checkbox' });
  guestToggle.checked = state.includeGuests;
  guestToggle.addEventListener('change', async () => {
    guestToggle.disabled = true;
    try {
      await Store.setIncludeGuests(guestToggle.checked);
      ctx.refresh();
    } catch (err) {
      U.toast('Kunde inte läsa in användarna', 'warn');
      guestToggle.disabled = false;
    }
  });

  host.appendChild(el('div.toolbar',
    el('div.toolbar__search', el('span.toolbar__icon', { text: '⌕' }), U.input({
      type: 'search', placeholder: 'Sök namn eller e-post…', value: filter.query,
      oninput: (e) => { filter.query = e.target.value; draw(); },
    })),
    U.select([
      { value: 'all', label: 'Alla roller' },
      { value: 'user', label: 'Användare' },
      { value: 'admin', label: 'Admin' },
    ], filter.role, { onchange: (e) => { filter.role = e.target.value; draw(); } }),
    U.select([
      { value: 'all', label: 'Alla statusar' },
      { value: 'active', label: 'Aktiva' },
      { value: 'banned', label: 'Bannade' },
    ], filter.status, { onchange: (e) => { filter.status = e.target.value; draw(); } }),
    U.select([
      { value: 'active', label: 'Senast aktiv' },
      { value: 'joined', label: 'Senast registrerad' },
      { value: 'xp', label: 'Mest XP' },
      { value: 'name', label: 'Namn A–Ö' },
    ], filter.sort, { onchange: (e) => { filter.sort = e.target.value; draw(); } }),
    el('label.switch.switch--inline',
      guestToggle,
      el('span.switch__track', el('span.switch__thumb')),
      el('span.switch__label', { text: 'Visa gäster' })
    )
  ));

  const listHost = el('div.list-host');
  host.appendChild(listHost);

  function draw() {
    U.clear(listHost);
    const rows = Store.listUsers(filter);
    if (!rows.length) {
      listHost.appendChild(U.emptyState('👤',
        all.length ? 'Inga användare matchar' : 'Inga användare än',
        all.length ? 'Prova att ändra sökningen eller filtren.' : 'När någon skapar ett konto i appen syns hen här.'));
      return;
    }

    const table = el('div.table.table--users',
      el('div.table__head',
        el('span', { text: 'Användare' }), el('span', { text: 'Roll' }), el('span', { text: 'XP' }),
        el('span', { text: 'Streak' }), el('span', { text: 'Registrerad' }), el('span', { text: 'Senast aktiv' }),
        el('span', { text: 'Status' }), el('span', { text: '' })
      )
    );
    rows.forEach((u) => table.appendChild(userRow(u, draw, ctx)));
    listHost.appendChild(table);
  }

  draw();
}

function roleCell(u, redraw) {
  if (u.isAnonymous) return U.badge('Gäst');

  const select = U.select(
    Object.keys(ROLE_LABEL).map((r) => ({ value: r, label: ROLE_LABEL[r] })),
    u.role,
    { className: 'select--inline' }
  );
  if (isMe(u)) {
    select.disabled = true;
    select.title = 'Du kan inte ändra din egen roll';
  }
  select.addEventListener('change', async () => {
    const role = select.value;
    const ok = await U.confirm({
      title: role === 'admin' ? 'Gör till admin?' : 'Ta bort admin-rollen?',
      message: role === 'admin'
        ? `${u.name} får full tillgång till adminportalen: kurser, användare och statistik.`
        : `${u.name} förlorar tillgången till adminportalen.`,
      confirmLabel: role === 'admin' ? 'Gör till admin' : 'Ta bort rollen',
      danger: role !== 'admin',
    });
    if (!ok) { select.value = u.role; return; }
    select.disabled = true;
    try {
      await Store.setUserRole(u.id, role);
      U.toast(`${u.name} är nu ${ROLE_LABEL[role].toLowerCase()}`, 'ok');
      redraw();
    } catch (err) {
      select.value = u.role;
      select.disabled = false;
      U.toast(errorMessage(err, 'Kunde inte byta roll.'), 'warn');
    }
  });
  return select;
}

function userRow(u, redraw, ctx) {
  const color = avatarColor(u.id);
  const banned = u.status === 'banned';
  // Admins skyddas: först tas rollen bort, sedan kan kontot bannas/raderas.
  const locked = isMe(u) || u.role === 'admin';
  const lockedTitle = isMe(u) ? 'Det här är ditt eget konto' : 'Ta bort admin-rollen först';

  return el('div.table__row', { className: banned ? 'table__row--muted' : '' },
    el('div.user-cell',
      el('span.avatar', { style: { background: `${color}22`, color, borderColor: `${color}44` }, text: initials(u.name) }),
      el('div.user-cell__text',
        el('span.user-cell__name', { text: isMe(u) ? `${u.name} (du)` : u.name }),
        el('span.user-cell__mail', { text: u.email || 'Gästkonto utan e-post' })
      )
    ),
    el('span', { 'data-label': 'Roll' }, roleCell(u, redraw)),
    el('span.cell-mono', { 'data-label': 'XP', text: U.formatNumber(u.xp) }),
    el('span.cell-mono', { 'data-label': 'Streak', text: u.streak ? `${u.streak} 🔥` : '—' }),
    el('span.cell-muted', { 'data-label': 'Registrerad', text: u.isAnonymous ? '—' : U.formatDate(u.joinedAt) }),
    el('span.cell-muted', { 'data-label': 'Senast aktiv', text: U.relativeTime(u.lastActiveAt) }),
    el('span', { 'data-label': 'Status' }, U.badge(banned ? 'Bannad' : 'Aktiv', banned ? 'danger' : 'ok')),
    el('div.row-actions',
      U.actionBtn('◫', 'Progress', { onclick: () => openUserDetail(u.id, redraw) }),
      U.actionBtn(banned ? '↺' : '⊘', banned ? 'Häv bann' : 'Banna', {
        className: banned ? '' : 'icon-btn--danger',
        disabled: locked && !banned,
        title: locked && !banned ? lockedTitle : (banned ? 'Häv bann' : 'Banna'),
        onclick: (e) => toggleBan(u, e.currentTarget, redraw),
      }),
      U.actionBtn('🗑', 'Ta bort', {
        className: 'icon-btn--danger',
        disabled: locked,
        title: locked ? lockedTitle : 'Ta bort',
        onclick: (e) => removeUser(u, e.currentTarget, ctx),
      })
    )
  );
}

async function toggleBan(u, button, redraw) {
  const banned = u.status === 'banned';
  if (!banned) {
    const ok = await U.confirm({
      title: 'Banna användaren?',
      message: `${u.name} stängs av direkt och kan inte logga in. Du kan häva det när som helst.`,
      confirmLabel: 'Banna', danger: true,
    });
    if (!ok) return false;
  }
  const result = await U.busy(button, async () => {
    await Store.setUserBanned(u.id, !banned);
    U.toast(banned ? `${u.name} är aktiv igen` : `${u.name} bannades`, banned ? 'ok' : 'warn');
    redraw();
    return true;
  });
  return !!result;
}

async function removeUser(u, button, ctx) {
  const ok = await U.confirm({
    title: 'Ta bort kontot?',
    message: `Kontot för ${u.name} raderas permanent, inklusive XP, sparade kurser och progress. Det går inte att ångra.`,
    confirmLabel: 'Ta bort', danger: true,
  });
  if (!ok) return false;
  const result = await U.busy(button, async () => {
    await Store.deleteUser(u.id);
    U.toast('Kontot togs bort', 'warn');
    ctx.refresh();
    return true;
  });
  return !!result;
}

// ---------------------------------------------------------------
// Admininbjudningar
// ---------------------------------------------------------------
async function drawInvites(host, ctx) {
  let invites;
  try {
    invites = await Store.listActiveInvites();
  } catch {
    return;
  }
  U.clear(host);
  if (!invites.length) return;

  host.appendChild(el('div.panel.invite-panel',
    el('div.panel__head',
      el('h2.panel__title', { text: `Väntande admininbjudningar (${invites.length})` }),
      el('span.panel__meta', { text: 'Engångslänkar som inte använts än' })
    ),
    el('div.invite-list', invites.map((inv) => el('div.invite-row',
      el('span.invite-row__text', { text: `Skapad ${U.relativeTime(inv.createdAt)} · gäller till ${U.formatDate(inv.expiresAt)}` }),
      U.actionBtn('⊘', 'Återkalla', {
        className: 'icon-btn--danger',
        onclick: (e) => U.busy(e.currentTarget, async () => {
          await Store.revokeInvite(inv.id);
          U.toast('Inbjudan återkallades — länken fungerar inte längre', 'warn');
          ctx.refresh();
        }),
      })
    )))
  ));
}

function openInvite(ctx) {
  const m = U.modal({ title: 'Bjud in admin', subtitle: 'Skapa en engångslänk som ger ett nytt admin-konto.' });

  m.body.appendChild(el('ul.invite-facts',
    el('li', { text: 'Personen väljer själv e-post och lösenord när hen öppnar länken.' }),
    el('li', { text: 'Länken fungerar en gång och gäller i 7 dagar. Du kan återkalla den innan dess.' }),
    el('li', { text: 'Den som har länken kan bli admin — skicka den bara till rätt person.' })
  ));

  const create = el('button.btn.btn--primary', {
    type: 'button', text: 'Skapa länk',
    onclick: () => U.busy(create, async () => {
      const invite = await Store.createInvite();
      showLink(`${window.location.origin}/admin#invite=${invite.token}`);
    }),
  });

  function showLink(link) {
    U.clear(m.body);
    U.clear(m.footer);

    const field = U.input({ value: link, readonly: true, className: 'invite-link' });
    field.addEventListener('focus', () => field.select());

    const copy = el('button.btn.btn--primary', {
      type: 'button', text: 'Kopiera länk',
      onclick: async () => {
        try {
          await navigator.clipboard.writeText(link);
        } catch {
          field.focus();
          document.execCommand('copy');
        }
        copy.textContent = 'Kopierad ✓';
        U.toast('Länken kopierades', 'ok');
      },
    });

    m.body.appendChild(U.field('Inbjudningslänk', field));
    m.body.appendChild(el('p.notice', { text: 'Länken visas bara nu. Kopiera den innan du stänger — sedan går den inte att ta fram igen.' }));
    m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Klar', onclick: () => { m.close(); ctx.refresh(); } }));
    m.footer.appendChild(copy);
    setTimeout(() => field.select(), 60);
  }

  m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Avbryt', onclick: m.close }));
  m.footer.appendChild(create);
}

// ---------------------------------------------------------------
// Detaljvy
// ---------------------------------------------------------------
function openUserDetail(userId, redraw) {
  const u = Store.getUser(userId);
  if (!u) return;

  const m = U.modal({ title: u.name, subtitle: u.email || 'Gästkonto', wide: true });

  m.body.appendChild(el('div.stat-strip',
    statBox('XP totalt', U.formatNumber(u.xp), 'amber'),
    statBox('Streak', u.streak ? `${u.streak} dagar` : 'Ingen', 'accent'),
    statBox('Nivå', String(Math.floor(u.xp / 200) + 1), 'cool'),
    statBox('Status', u.status === 'banned' ? 'Bannad' : 'Aktiv', u.status === 'banned' ? '' : 'ok')
  ));

  m.body.appendChild(el('div.detail-meta',
    metaRow('Roll', u.isAnonymous ? 'Gäst' : ROLE_LABEL[u.role]),
    metaRow('Status', u.status === 'banned' ? 'Bannad' : 'Aktiv'),
    metaRow(u.isAnonymous ? 'Första besök' : 'Registrerad', U.formatDate(u.joinedAt)),
    metaRow('Senast aktiv', U.relativeTime(u.lastActiveAt))
  ));

  m.body.appendChild(el('h3.section-title', { text: 'Progress per kurs' }));
  const progressHost = el('div', U.spinner());
  m.body.appendChild(progressHost);

  Store.getUserProgress(u.id).then((progress) => {
    U.clear(progressHost);
    if (!progress.length) {
      progressHost.appendChild(el('p.deck__empty', { text: 'Användaren har inte klarat någon lektion än.' }));
      return;
    }
    progressHost.appendChild(el('div.progress-list', progress.map((p) => {
      const c = Store.getCourse(p.courseId);
      return el('div.progress-item',
        el('span.progress-item__emoji', { text: c ? c.emoji : '—' }),
        el('div.progress-item__body',
          el('div.progress-item__top',
            el('span.progress-item__title', { text: c ? c.title : 'Borttagen kurs' }),
            el('span.progress-item__pct', { text: `${p.percent} %` })
          ),
          el('div.bar', el('div.bar__fill', {
            style: { width: `${p.percent}%`, background: p.percent >= 100 ? 'var(--cool)' : 'var(--fire)' },
          }))
        )
      );
    })));
  }).catch(() => {
    U.clear(progressHost);
    progressHost.appendChild(el('p.deck__empty', { text: 'Kunde inte läsa in progress.' }));
  });

  m.footer.appendChild(el('button.btn.btn--ghost', { type: 'button', text: 'Stäng', onclick: m.close }));

  const banned = u.status === 'banned';
  if (!isMe(u) && (u.role !== 'admin' || banned)) {
    const banBtn = el('button.btn', {
      type: 'button',
      className: banned ? 'btn--primary' : 'btn--danger',
      text: banned ? 'Häv bannlysning' : 'Banna användaren',
      onclick: async () => {
        if (await toggleBan(u, banBtn, redraw)) m.close();
      },
    });
    m.footer.appendChild(banBtn);
  }
}

function statBox(label, value, kind) {
  return el('div.stat-box',
    el('span.stat-box__label', { text: label }),
    el('span.stat-box__value', { className: kind ? `is-${kind}` : '', text: value })
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
  const rows = [['Namn', 'E-post', 'Roll', 'Status', 'XP', 'Streak', 'Registrerad', 'Senast aktiv']];
  users.forEach((u) => {
    rows.push([
      u.name, u.email, u.isAnonymous ? 'Gäst' : ROLE_LABEL[u.role],
      u.status === 'banned' ? 'Bannad' : 'Aktiv',
      u.xp, u.streak,
      u.isAnonymous ? '' : u.joinedAt.slice(0, 10), u.lastActiveAt.slice(0, 10),
    ]);
  });
  U.downloadCsv('quickthinkers-anvandare.csv', rows);
  U.toast('Användare exporterade', 'ok');
}
