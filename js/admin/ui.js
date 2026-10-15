// QuickThinkers adminportal — UI-primitiver.
// Allt byggs som DOM-noder, aldrig via innerHTML med data i, så
// kurstitlar och användarnamn aldrig kan tolkas som markup.
import { errorMessage } from '../lib/supabase.js';

(function () {
  'use strict';

  // ---------------------------------------------------------------
  // Elementbyggare
  //   el('div.card', { onclick: fn }, child, child)
  //   Taggen får ha .klasser och #id i strängen.
  // ---------------------------------------------------------------
  function el(spec, props) {
    var parts = spec.split(/(?=[.#])/);
    var node = document.createElement(parts[0] || 'div');
    parts.slice(1).forEach(function (p) {
      if (p[0] === '.') node.classList.add(p.slice(1));
      else if (p[0] === '#') node.id = p.slice(1);
    });

    if (props && typeof props === 'object' && !(props instanceof Node) && !Array.isArray(props)) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'text') node.textContent = v;
        else if (k === 'html') node.innerHTML = v;          // bara för statiska ikoner
        else if (k === 'style') Object.assign(node.style, v);
        else if (k === 'dataset') Object.assign(node.dataset, v);
        else if (k.indexOf('on') === 0) node.addEventListener(k.slice(2), v);
        else if (k === 'className') node.className += ' ' + v;
        else node.setAttribute(k, v === true ? '' : v);
      });
    }

    var start = (props && typeof props === 'object' && !(props instanceof Node) && !Array.isArray(props)) ? 2 : 1;
    for (var i = start; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }

  function append(parent, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(parent, c); }); return; }
    parent.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
    return node;
  }

  // ---------------------------------------------------------------
  // Formatering
  // ---------------------------------------------------------------
  function formatDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function relativeTime(iso) {
    var diff = Date.now() - new Date(iso).getTime();
    var days = Math.floor(diff / 86400000);
    if (days < 0) return 'nyss';
    if (days === 0) return 'idag';
    if (days === 1) return 'igår';
    if (days < 7) return days + ' dagar sedan';
    if (days < 30) return Math.floor(days / 7) + ' v sedan';
    if (days < 365) return Math.floor(days / 30) + ' mån sedan';
    return Math.floor(days / 365) + ' år sedan';
  }

  function formatNumber(n) {
    return new Intl.NumberFormat('sv-SE').format(Math.round(n));
  }

  // ---------------------------------------------------------------
  // Toast
  // ---------------------------------------------------------------
  var toastHost = null;

  function toast(message, kind) {
    if (!toastHost) {
      toastHost = el('div.toast-host');
      document.body.appendChild(toastHost);
    }
    var t = el('div.toast', { className: kind ? 'toast--' + kind : '' },
      el('span.toast__dot'),
      el('span', { text: message })
    );
    toastHost.appendChild(t);
    setTimeout(function () {
      t.classList.add('is-leaving');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 240);
    }, 2600);
  }

  // ---------------------------------------------------------------
  // Modal — används för formulär och bekräftelser
  // ---------------------------------------------------------------
  function modal(opts) {
    var overlay = el('div.overlay');
    var box = el('div.modal', { className: opts.wide ? 'modal--wide' : '' });

    var header = el('div.modal__head',
      el('div',
        el('h2.modal__title', { text: opts.title }),
        opts.subtitle ? el('p.modal__sub', { text: opts.subtitle }) : null
      ),
      el('button.icon-btn', { type: 'button', 'aria-label': 'Stäng', onclick: close }, '✕')
    );

    var body = el('div.modal__body');
    var footer = el('div.modal__foot');

    box.appendChild(header);
    box.appendChild(body);
    box.appendChild(footer);
    overlay.appendChild(box);

    function close() {
      overlay.classList.add('is-leaving');
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.removeEventListener('keydown', onKey);
      }, 180);
    }

    function onKey(e) {
      if (e.key === 'Escape') close();
    }

    overlay.addEventListener('mousedown', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);

    // Fokusera första fältet så tangentbordet fungerar direkt
    setTimeout(function () {
      var first = box.querySelector('input, textarea, select, button.btn');
      if (first) first.focus();
    }, 60);

    return { overlay: overlay, body: body, footer: footer, close: close };
  }

  function confirm(opts) {
    return new Promise(function (resolve) {
      var m = modal({ title: opts.title, subtitle: opts.subtitle });
      m.body.appendChild(el('p.confirm-text', { text: opts.message }));
      m.footer.appendChild(el('button.btn.btn--ghost', {
        type: 'button',
        text: opts.cancelLabel || 'Avbryt',
        onclick: function () { m.close(); resolve(false); },
      }));
      m.footer.appendChild(el('button.btn', {
        type: 'button',
        className: opts.danger ? 'btn--danger' : 'btn--primary',
        text: opts.confirmLabel || 'Bekräfta',
        onclick: function () { m.close(); resolve(true); },
      }));
    });
  }

  // ---------------------------------------------------------------
  // Formulärfält
  // ---------------------------------------------------------------
  function field(label, control, hint) {
    return el('label.field',
      el('span.field__label', { text: label }),
      control,
      hint ? el('span.field__hint', { text: hint }) : null
    );
  }

  function input(props) {
    return el('input.input', Object.assign({ type: 'text' }, props || {}));
  }

  function textarea(props) {
    return el('textarea.input.input--area', Object.assign({ rows: 3 }, props || {}));
  }

  function select(options, value, props) {
    var s = el('select.input.select', props || {});
    options.forEach(function (o) {
      var opt = el('option', { value: o.value, text: o.label });
      if (o.value === value) opt.selected = true;
      s.appendChild(opt);
    });
    return s;
  }

  function badge(text, kind) {
    return el('span.badge', { className: kind ? 'badge--' + kind : '', text: text });
  }

  // Åtgärdsknapp i tabellrader. Ikonen räcker på desktop; på mobil visas
  // etiketten också, eftersom raderna då är kort med gott om bredd.
  function actionBtn(icon, label, props) {
    return el('button.icon-btn', Object.assign({ type: 'button', title: label }, props || {}),
      el('span.icon-btn__icon', { text: icon }),
      el('span.icon-btn__text', { text: label })
    );
  }

  function emptyState(icon, title, message, action) {
    return el('div.empty',
      el('div.empty__icon', { text: icon }),
      el('h3.empty__title', { text: title }),
      el('p.empty__msg', { text: message }),
      action || null
    );
  }

  // ---------------------------------------------------------------
  // CSV-export — Blob + a[download], inga externa anrop
  // ---------------------------------------------------------------
  function downloadCsv(filename, rows) {
    var csv = rows.map(function (row) {
      return row.map(function (cell) {
        var s = cell === null || cell === undefined ? '' : String(cell);
        // Användarnamn kommer från användarna själva. En cell som börjar
        // med = + - @ tolkas annars som formel av Excel (CSV-injektion).
        if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
        return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(';');
    }).join('\n');

    // BOM så Excel öppnar åäö rätt
    var blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = el('a', { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ---------------------------------------------------------------
  // Spara-knappar: låses medan anropet pågår så ett dubbelklick inte
  // skapar två kurser. Felet visas som toast och knappen släpps igen.
  //   busy(btn, function () { return Store.createCourse(data); })
  // ---------------------------------------------------------------
  function busy(button, run, errorText) {
    if (button.disabled) return Promise.resolve(null);
    button.disabled = true;
    button.classList.add('is-busy');
    return Promise.resolve()
      .then(run)
      .catch(function (err) {
        console.error(err);
        toast(errorMessage(err, errorText), 'warn');
        return null;
      })
      .finally(function () {
        button.disabled = false;
        button.classList.remove('is-busy');
      });
  }

  function spinner() {
    return el('div.loading', el('span.loading__dot'), el('span.loading__dot'), el('span.loading__dot'));
  }

  window.QTUI = {
    el: el, clear: clear, append: append,
    formatDate: formatDate, relativeTime: relativeTime, formatNumber: formatNumber,
    toast: toast, modal: modal, confirm: confirm,
    field: field, input: input, textarea: textarea, select: select,
    badge: badge, actionBtn: actionBtn, emptyState: emptyState,
    downloadCsv: downloadCsv, busy: busy, spinner: spinner,
  };
})();
