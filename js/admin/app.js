// QuickThinkers adminportal — skal och routing.
// Lösenordsvyn är en demospärr, inte säkerhet: allt ligger i klienten.
// Ersätts av Supabase Auth i fas 1.
import { APP_NAME } from '../lib/brand.js';

(function () {
  'use strict';

  var U = window.QTUI;
  var el = U.el;

  var DEMO_PASSWORD = 'quickthinkers';
  var SESSION_KEY = 'qt_admin_session';

  var NAV = [
    { id: 'courses', label: 'Kurser', icon: '▤' },
    { id: 'users', label: 'Användare', icon: '👤' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
  ];

  var current = 'courses';
  var root = null;

  // ---------------------------------------------------------------
  // Inloggning
  // ---------------------------------------------------------------
  function isAuthed() {
    try { return sessionStorage.getItem(SESSION_KEY) === 'ok'; }
    catch (e) { return false; }
  }

  function renderLogin() {
    U.clear(root);
    document.body.classList.add('is-login');

    var pass = el('input.input.login__input', {
      type: 'password', placeholder: 'Lösenord', autocomplete: 'current-password',
    });
    var error = el('p.login__error');

    function submit(e) {
      if (e) e.preventDefault();
      if (pass.value === DEMO_PASSWORD) {
        try { sessionStorage.setItem(SESSION_KEY, 'ok'); } catch (err) { /* ignoreras */ }
        document.body.classList.remove('is-login');
        renderApp();
        U.toast('Välkommen tillbaka', 'ok');
      } else {
        error.textContent = 'Fel lösenord. Försök igen.';
        pass.value = '';
        pass.focus();
        card.classList.remove('shake');
        void card.offsetWidth;
        card.classList.add('shake');
      }
    }

    var card = el('form.login__card', { onsubmit: submit },
      el('div.login__mark', el('span', { text: '⚡' })),
      el('h1.login__title', { text: APP_NAME }),
      el('p.login__sub', { text: 'Adminportal' }),
      pass,
      error,
      el('button.btn.btn--primary.login__btn', { type: 'submit', text: 'Logga in' })
    );

    root.appendChild(el('div.login', el('div.login__glow'), card));
    setTimeout(function () { pass.focus(); }, 80);
  }

  // ---------------------------------------------------------------
  // Portal
  // ---------------------------------------------------------------
  function renderApp() {
    U.clear(root);

    var main = el('main.main');
    var shell = el('div.shell', sidebar(), el('div.content', topbar(), main));
    root.appendChild(shell);

    drawView(main);
  }

  function sidebar() {
    var navList = el('nav.nav');

    NAV.forEach(function (item) {
      navList.appendChild(el('button.nav__item', {
        type: 'button',
        className: current === item.id ? 'is-active' : '',
        onclick: function () {
          if (current === item.id) return;
          current = item.id;
          renderApp();
        },
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
      navList,
      el('div.sidebar__foot',
        el('button.nav__item.nav__item--sub', {
          type: 'button',
          title: 'Läser in mockdatan på nytt',
          onclick: confirmReset,
        }, el('span.nav__icon', { text: '↺' }), el('span.nav__label', { text: 'Återställ demo' })),
        el('div.env-note',
          el('span.env-note__dot'),
          el('span', { text: 'Mockdata — ingen backend' })
        )
      )
    );
  }

  function topbar() {
    var titles = { courses: 'Kurshantering', users: 'Användarhantering', analytics: 'Analytics' };

    return el('header.topbar',
      el('div.topbar__crumb',
        el('span.topbar__crumb-root', { text: APP_NAME }),
        el('span.topbar__sep', { text: '/' }),
        el('span', { text: titles[current] })
      ),
      el('div.topbar__right',
        el('div.user-chip',
          el('span.avatar.avatar--sm', { text: 'VV' }),
          el('div.user-chip__text',
            el('span.user-chip__name', { text: 'Victor' }),
            el('span.user-chip__role', { text: 'Admin' })
          )
        ),
        // Sidomenyns fot syns inte när den blir bottennavigering på mobil,
        // så återställningen får en egen knapp här.
        el('button.icon-btn.topbar__reset', {
          type: 'button', title: 'Återställ demodata', onclick: confirmReset,
        }, el('span.icon-btn__icon', { text: '↺' })),
        el('button.btn.btn--ghost.btn--sm', {
          type: 'button', text: 'Logga ut',
          onclick: function () {
            try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignoreras */ }
            renderLogin();
          },
        })
      )
    );
  }

  function confirmReset() {
    U.confirm({
      title: 'Återställ demodata?',
      message: 'Alla ändringar du gjort i den här demon försvinner och originaldatan läses in igen.',
      confirmLabel: 'Återställ',
    }).then(function (ok) {
      if (!ok) return;
      window.QTStore.resetDemo();
      renderApp();
      U.toast('Demodata återställd', 'ok');
    });
  }

  function drawView(main) {
    var ctx = { refresh: function () { drawView(main); } };

    U.clear(main);
    var page = el('div.page');
    main.appendChild(page);

    if (current === 'courses') window.QTViewCourses.render(page, ctx);
    else if (current === 'users') window.QTViewUsers.render(page, ctx);
    else window.QTViewAnalytics.render(page, ctx);
  }

  // ---------------------------------------------------------------
  // Start
  // ---------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    root = document.getElementById('admin-root');
    if (isAuthed()) renderApp();
    else renderLogin();
  });
})();
