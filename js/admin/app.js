// QuickThinkers adminportal — inloggning, skal och routing.
// Inloggningen sker mot Supabase Auth och kontot måste ha rollen admin.
// Den verkliga spärren är databasens RLS; det här är bara gränssnittet.
import { APP_NAME } from '../lib/brand.js';
import { supabase, errorMessage } from '../lib/supabase.js';
import * as Store from './store.js';
import * as CoursesView from './views/courses.js';
import * as CategoriesView from './views/categories.js';
import * as QuizView from './views/daily-quiz.js';
import * as UsersView from './views/users.js';
import * as AnalyticsView from './views/analytics.js';

const U = window.QTUI;
const el = U.el;

const NAV = [
  { id: 'kurser', label: 'Kurser', icon: '▤', title: 'Kurshantering', view: CoursesView },
  { id: 'kategorier', label: 'Kategorier', icon: '◫', title: 'Kategorier', view: CategoriesView },
  { id: 'quiz', label: 'Dagens quiz', icon: '🧠', title: 'Dagens quiz', view: QuizView },
  { id: 'anvandare', label: 'Användare', icon: '👤', title: 'Användarhantering', view: UsersView },
  { id: 'analytics', label: 'Analytics', icon: '📊', title: 'Analytics', view: AnalyticsView },
];

// Återställningslänken landar här med #...type=recovery. Supabase-klienten
// plockar bort hashen när den läst in sessionen, så kolla den direkt.
const arrivedFromRecovery = /type=recovery/.test(window.location.hash);

let root = null;
let current = NAV.find((n) => `#${n.id}` === window.location.hash) ? window.location.hash.slice(1) : 'kurser';

// -------------------------------------------------------------------
// Uppstart
// -------------------------------------------------------------------
async function boot() {
  U.clear(root);
  root.appendChild(el('div.boot', U.spinner()));

  const { data: { session } } = await supabase.auth.getSession();

  if (arrivedFromRecovery && session) {
    renderNewPassword();
    return;
  }
  if (!session || session.user.is_anonymous) {
    renderLogin();
    return;
  }

  try {
    const { data: me, error } = await supabase
      .from('profiles').select('*').eq('id', session.user.id).single();
    if (error) throw error;
    if (me.role !== 'admin' || me.status !== 'active') {
      renderDenied(session.user.email);
      return;
    }
    await Store.init(me);
    renderApp();
  } catch (err) {
    console.error(err);
    renderFatal(errorMessage(err, 'Kunde inte läsa in adminportalen.'));
  }
}

// -------------------------------------------------------------------
// Inloggningsvyer
// -------------------------------------------------------------------
function authCard(title, sub, ...children) {
  U.clear(root);
  document.body.classList.add('is-login');
  const card = el('div.login__card',
    el('div.login__mark', el('span', { text: '⚡' })),
    el('h1.login__title', { text: title }),
    el('p.login__sub', { text: sub }),
    ...children
  );
  root.appendChild(el('div.login', el('div.login__glow'), card));
  return card;
}

function shake(card) {
  card.classList.remove('shake');
  void card.offsetWidth;
  card.classList.add('shake');
}

function renderLogin(notice) {
  const email = U.input({ type: 'email', placeholder: 'E-post', autocomplete: 'email', className: 'login__input', required: true });
  const pass = U.input({ type: 'password', placeholder: 'Lösenord', autocomplete: 'current-password', className: 'login__input', required: true });
  const error = el('p.login__error', { text: notice || '' });
  const submit = el('button.btn.btn--primary.login__btn', { type: 'submit', text: 'Logga in' });

  const form = el('form.login__form', {
    onsubmit: async (e) => {
      e.preventDefault();
      error.textContent = '';
      await U.busy(submit, async () => {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.value.trim(), password: pass.value,
        });
        if (authError) {
          error.textContent = errorMessage(authError);
          pass.value = '';
          pass.focus();
          shake(card);
          return;
        }
        await boot();
      });
    },
  }, email, pass, error, submit);

  const card = authCard(APP_NAME, 'Adminportal', form,
    el('button.login__link', { type: 'button', text: 'Glömt lösenordet?', onclick: () => renderForgot(email.value) }),
    el('a.login__link', { href: '/', text: '← Till appen' })
  );
  setTimeout(() => email.focus(), 80);
}

function renderForgot(prefill) {
  const email = U.input({ type: 'email', placeholder: 'E-post', autocomplete: 'email', className: 'login__input', value: prefill || '', required: true });
  const message = el('p.login__error');
  const submit = el('button.btn.btn--primary.login__btn', { type: 'submit', text: 'Skicka länk' });

  const form = el('form.login__form', {
    onsubmit: async (e) => {
      e.preventDefault();
      await U.busy(submit, async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(email.value.trim(), {
          redirectTo: window.location.origin + window.location.pathname,
        });
        if (error) throw error;
        // Samma svar oavsett om kontot finns, så ingen kan testa adresser.
        message.classList.add('login__error--ok');
        message.textContent = 'Om det finns ett konto med adressen har vi skickat en länk. Kolla inkorgen.';
      });
    },
  }, email, message, submit);

  authCard('Glömt lösenord', 'Vi mejlar en återställningslänk', form,
    el('button.login__link', { type: 'button', text: '← Tillbaka till inloggning', onclick: () => renderLogin() })
  );
  setTimeout(() => email.focus(), 80);
}

function renderNewPassword() {
  const pass = U.input({ type: 'password', placeholder: 'Nytt lösenord', autocomplete: 'new-password', className: 'login__input', minlength: 8, required: true });
  const again = U.input({ type: 'password', placeholder: 'Upprepa lösenordet', autocomplete: 'new-password', className: 'login__input', required: true });
  const error = el('p.login__error');
  const submit = el('button.btn.btn--primary.login__btn', { type: 'submit', text: 'Spara lösenord' });

  const form = el('form.login__form', {
    onsubmit: async (e) => {
      e.preventDefault();
      error.textContent = '';
      if (pass.value.length < 8) { error.textContent = 'Lösenordet måste vara minst 8 tecken.'; return; }
      if (pass.value !== again.value) { error.textContent = 'Lösenorden matchar inte.'; return; }
      await U.busy(submit, async () => {
        const { error: authError } = await supabase.auth.updateUser({ password: pass.value });
        if (authError) throw authError;
        history.replaceState(null, '', window.location.pathname);
        U.toast('Lösenordet är bytt', 'ok');
        await boot();
      });
    },
  }, pass, again, error, submit);

  authCard('Nytt lösenord', 'Välj ett lösenord på minst 8 tecken', form);
  setTimeout(() => pass.focus(), 80);
}

function renderDenied(email) {
  authCard('Ingen behörighet', 'Adminportal',
    el('p.login__text', { text: `Kontot ${email} har inte admin-behörighet. Be en admin att ge dig rollen, eller logga in med ett annat konto.` }),
    el('button.btn.btn--primary.login__btn', {
      type: 'button', text: 'Logga in med annat konto',
      onclick: async () => { await supabase.auth.signOut(); renderLogin(); },
    }),
    el('a.login__link', { href: '/', text: '← Till appen' })
  );
}

function renderFatal(message) {
  authCard('Något gick fel', 'Adminportal',
    el('p.login__text', { text: message }),
    el('button.btn.btn--primary.login__btn', { type: 'button', text: 'Försök igen', onclick: boot })
  );
}

// -------------------------------------------------------------------
// Portal
// -------------------------------------------------------------------
function renderApp() {
  document.body.classList.remove('is-login');
  U.clear(root);

  const main = el('main.main');
  root.appendChild(el('div.shell', sidebar(), el('div.content', topbar(), main)));
  drawView(main);
}

function go(id) {
  if (current === id) return;
  current = id;
  history.replaceState(null, '', `#${id}`);
  renderApp();
}

function sidebar() {
  const nav = el('nav.nav');
  NAV.forEach((item) => {
    nav.appendChild(el('button.nav__item', {
      type: 'button',
      className: current === item.id ? 'is-active' : '',
      onclick: () => go(item.id),
    },
      el('span.nav__icon', { text: item.icon }),
      el('span.nav__label', { text: item.label })
    ));
  });

  return el('aside.sidebar',
    el('div.brand',
      el('span.brand__mark', { text: '⚡' }),
      el('div.brand__text',
        el('span.brand__name', { text: APP_NAME }),
        el('span.brand__role', { text: 'Adminportal' })
      )
    ),
    nav,
    el('div.sidebar__foot',
      el('a.nav__item.nav__item--sub', { href: '/', target: '_blank', rel: 'noopener' },
        el('span.nav__icon', { text: '↗' }),
        el('span.nav__label', { text: 'Öppna appen' })
      ),
      el('div.env-note',
        el('span.env-note__dot.env-note__dot--live'),
        el('span', { text: 'Live — ändringar syns direkt' })
      )
    )
  );
}

function initials(name) {
  return name.split(/[\s.@]+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?';
}

function topbar() {
  const me = Store.getState().me;
  const name = me.display_name || (me.email || '').split('@')[0];
  const item = NAV.find((n) => n.id === current);

  return el('header.topbar',
    el('div.topbar__crumb',
      el('span.topbar__crumb-root', { text: APP_NAME }),
      el('span.topbar__sep', { text: '/' }),
      el('span', { text: item.title })
    ),
    el('div.topbar__right',
      el('div.user-chip',
        el('span.avatar.avatar--sm', { text: initials(name) }),
        el('div.user-chip__text',
          el('span.user-chip__name', { text: name }),
          el('span.user-chip__role', { text: 'Admin' })
        )
      ),
      el('button.btn.btn--ghost.btn--sm', {
        type: 'button', text: 'Logga ut',
        onclick: async () => { await supabase.auth.signOut(); },
      })
    )
  );
}

function drawView(main) {
  const ctx = { refresh: () => drawView(main) };
  U.clear(main);
  const page = el('div.page');
  main.appendChild(page);
  NAV.find((n) => n.id === current).view.render(page, ctx);
}

// -------------------------------------------------------------------
// Start
// -------------------------------------------------------------------
supabase.auth.onAuthStateChange((event) => {
  // Utloggning i en annan flik (eller i appen) loggar ut här också.
  if (event === 'SIGNED_OUT' && root) renderLogin();
  if (event === 'PASSWORD_RECOVERY' && root) renderNewPassword();
});

document.addEventListener('DOMContentLoaded', () => {
  root = document.getElementById('admin-root');
  boot();
});
