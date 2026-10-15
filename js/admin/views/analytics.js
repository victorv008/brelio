// QuickThinkers adminportal — analytics.
// Siffrorna räknas i databasen (admin_analytics). Graferna ritas som
// inline-SVG — inga externa bibliotek, inga anrop ut.
import * as Store from '../store.js';
import { errorMessage } from '../../lib/supabase.js';

var U = window.QTUI;
var el = U.el;

var SVG = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs) {
  var n = document.createElementNS(SVG, tag);
  Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
  return n;
}

export function render(host) {
  U.clear(host);
  host.appendChild(U.spinner());
  Store.getAnalytics()
    .then(function (a) { draw(host, a); })
    .catch(function (err) {
      U.clear(host);
      host.appendChild(U.emptyState('📊', 'Kunde inte läsa in statistiken', errorMessage(err)));
    });
}

function draw(host, a) {
  U.clear(host);
  var k = a.kpis;

  host.appendChild(el('div.page-head',
    el('div',
      el('h1.page-title', { text: 'Analytics' }),
      el('p.page-sub', { text: 'Senaste 30 dagarna · uppdaterad ' + U.relativeTime(new Date().toISOString()) })
    ),
    el('div.page-actions',
      el('button.btn.btn--ghost', {
        type: 'button', text: 'Exportera översikt',
        onclick: function () { exportOverview(a); },
      }),
      el('button.btn.btn--ghost', {
        type: 'button', text: 'Exportera per kurs',
        onclick: function () { exportCourseStats(a); },
      })
    )
  ));

  if (!k.mau && !k.totalSwipes) {
    host.appendChild(el('p.notice', {
      text: 'Ingen aktivitet än. Siffrorna fylls på när användare börjar swipa och läsa kurser.',
    }));
  }

  // ---- KPI-kort ----
  host.appendChild(el('div.kpi-grid',
    kpi('Aktiva idag', U.formatNumber(k.dau), k.dauChange, 'mot förra veckan'),
    kpi('Aktiva denna månad', U.formatNumber(k.mau), null, 'unika användare'),
    kpi('Nya konton', U.formatNumber(k.newUsers), k.newUsersChange, 'senaste 7 dagarna'),
    kpi('Genomförandegrad', k.completionRate + ' %', null, 'av påbörjade kurser'),
    kpi('Swipes totalt', U.formatNumber(k.totalSwipes), null, 'alla kurser'),
    kpi('Snittstreak', String(k.avgStreak), null, 'dagar per användare')
  ));

  // ---- Grafer ----
  host.appendChild(el('div.chart-grid',
    el('div.panel',
      el('div.panel__head',
        el('h2.panel__title', { text: 'Dagligt aktiva användare' }),
        el('span.panel__meta', { text: 'senaste 30 dagarna' })
      ),
      lineChart(a.dailyActive)
    ),
    el('div.panel',
      el('div.panel__head',
        el('h2.panel__title', { text: 'Nya konton per dag' }),
        el('span.panel__meta', { text: U.formatNumber(a.signups.reduce(function (s, d) { return s + d.value; }, 0)) + ' totalt' })
      ),
      barChart(a.signups)
    )
  ));

  // ---- Kategorier + toppkurser ----
  host.appendChild(el('div.chart-grid.chart-grid--split',
    el('div.panel',
      el('div.panel__head', el('h2.panel__title', { text: 'Populäraste kategorier' })),
      categoryBars(a.categoryBreakdown)
    ),
    el('div.panel',
      el('div.panel__head',
        el('h2.panel__title', { text: 'Innehåll' }),
        el('span.panel__meta', { text: 'status just nu' })
      ),
      el('div.stat-strip.stat-strip--tight',
        statBox('Publicerade', String(k.publishedCourses), 'ok'),
        statBox('Utkast', String(k.draftCourses), 'amber'),
        statBox('Konton', String(k.totalUsers), 'cool'),
        statBox('Gäster', String(k.guests), 'accent')
      )
    )
  ));

  // ---- Per kurs ----
  var panel = el('div.panel',
    el('div.panel__head',
      el('h2.panel__title', { text: 'Statistik per kurs' }),
      el('span.panel__meta', { text: a.courseStats.length + ' publicerade kurser' })
    )
  );

  if (!a.courseStats.length) {
    panel.appendChild(U.emptyState('📊', 'Ingen kursstatistik än',
      'Publicera en kurs så börjar siffrorna samlas här.'));
  } else {
    var table = el('div.table.table--stats');
    table.appendChild(el('div.table__head',
      el('span', { text: 'Kurs' }),
      el('span', { text: 'Påbörjade' }),
      el('span', { text: 'Klara' }),
      el('span', { text: 'Genomförande' }),
      el('span', { text: 'Gillar' }),
      el('span', { text: 'Swipes' }),
      el('span', { text: 'Sparade' })
    ));

    a.courseStats.forEach(function (s) {
      table.appendChild(el('div.table__row',
        el('div.course-cell',
          el('span.course-cell__emoji', { text: s.emoji }),
          el('div.course-cell__text',
            el('span.course-cell__title', { text: s.title }),
            el('span.course-cell__desc', { text: s.category })
          )
        ),
        el('span.cell-mono', { 'data-label': 'Påbörjade', text: U.formatNumber(s.starts) }),
        el('span.cell-mono', { 'data-label': 'Klara', text: U.formatNumber(s.completions) }),
        el('div.rate-cell', { 'data-label': 'Genomförande' },
          el('div.bar.bar--sm', el('div.bar__fill', {
            style: { width: s.completionRate + '%', background: 'var(--fire)' },
          })),
          el('span.cell-mono', { text: s.completionRate + ' %' })
        ),
        el('span.cell-mono', { 'data-label': 'Gillar', text: U.formatNumber(s.likes) }),
        el('span.cell-mono', { 'data-label': 'Swipes', text: U.formatNumber(s.swipes) }),
        el('span.cell-mono', { 'data-label': 'Sparade', text: U.formatNumber(s.saves) })
      ));
    });
    panel.appendChild(table);
  }

  host.appendChild(panel);
}

// ---------------------------------------------------------------
// KPI-kort
// ---------------------------------------------------------------
function kpi(label, value, change, hint) {
  var trend = null;
  if (change !== null && change !== undefined) {
    var up = change >= 0;
    trend = el('span.kpi__trend', { className: up ? 'is-up' : 'is-down' },
      el('span', { text: up ? '▲' : '▼' }),
      el('span', { text: Math.abs(change) + ' %' })
    );
  }
  return el('div.kpi',
    el('span.kpi__label', { text: label }),
    el('div.kpi__row',
      el('span.kpi__value', { text: value }),
      trend
    ),
    el('span.kpi__hint', { text: hint })
  );
}

function statBox(label, value, kind) {
  return el('div.stat-box',
    el('span.stat-box__label', { text: label }),
    el('span.stat-box__value', { className: kind ? 'is-' + kind : '', text: value })
  );
}

// ---------------------------------------------------------------
// Linjediagram med area och hovring
// ---------------------------------------------------------------
function lineChart(series) {
  var W = 640, H = 200, PAD = 8;
  var values = series.map(function (d) { return d.value; });
  var max = Math.max.apply(null, values) * 1.08;
  var min = Math.min.apply(null, values) * 0.9;
  var span = max - min || 1;

  var pts = series.map(function (d, i) {
    return {
      x: PAD + (i / (series.length - 1)) * (W - PAD * 2),
      y: H - PAD - ((d.value - min) / span) * (H - PAD * 2),
      d: d,
    };
  });

  var svg = svgEl('svg', {
    viewBox: '0 0 ' + W + ' ' + H,
    preserveAspectRatio: 'none',
    class: 'chart chart--line',
  });

  var grad = svgEl('linearGradient', { id: 'lineFill', x1: '0', y1: '0', x2: '0', y2: '1' });
  grad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': '#FF4E42', 'stop-opacity': '0.28' }));
  grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#FF4E42', 'stop-opacity': '0' }));
  var defs = svgEl('defs');
  defs.appendChild(grad);
  svg.appendChild(defs);

  // Stödlinjer
  [0.25, 0.5, 0.75].forEach(function (f) {
    svg.appendChild(svgEl('line', {
      x1: 0, x2: W, y1: H * f, y2: H * f,
      stroke: 'rgba(255,255,255,0.05)', 'stroke-width': 1,
    }));
  });

  var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' ');
  svg.appendChild(svgEl('path', {
    d: line + ' L' + pts[pts.length - 1].x.toFixed(1) + ' ' + H + ' L' + pts[0].x.toFixed(1) + ' ' + H + ' Z',
    fill: 'url(#lineFill)',
  }));
  svg.appendChild(svgEl('path', {
    d: line, fill: 'none', stroke: '#FF4E42',
    'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round',
    'vector-effect': 'non-scaling-stroke',
  }));

  var dot = svgEl('circle', { r: 4, fill: '#FF4E42', stroke: '#0A0A0F', 'stroke-width': 2, opacity: '0' });
  svg.appendChild(dot);

  var wrap = el('div.chart-wrap');
  var tip = el('div.chart-tip');
  wrap.appendChild(svg);
  wrap.appendChild(tip);

  wrap.addEventListener('mousemove', function (e) {
    var rect = wrap.getBoundingClientRect();
    var ratio = (e.clientX - rect.left) / rect.width;
    var i = Math.round(ratio * (series.length - 1));
    i = Math.max(0, Math.min(series.length - 1, i));
    var p = pts[i];
    dot.setAttribute('cx', p.x);
    dot.setAttribute('cy', p.y);
    dot.setAttribute('opacity', '1');
    tip.textContent = p.d.date + ' · ' + U.formatNumber(p.d.value) + ' aktiva';
    tip.style.left = (p.x / W * 100) + '%';
    tip.style.top = (p.y / H * 100) + '%';
    tip.classList.add('is-on');
  });
  wrap.addEventListener('mouseleave', function () {
    dot.setAttribute('opacity', '0');
    tip.classList.remove('is-on');
  });

  return el('div',
    wrap,
    el('div.chart-axis',
      el('span', { text: series[0].date }),
      el('span', { text: series[series.length - 1].date })
    )
  );
}

// ---------------------------------------------------------------
// Stapeldiagram
// ---------------------------------------------------------------
function barChart(series) {
  var max = Math.max.apply(null, series.map(function (d) { return d.value; })) || 1;
  var wrap = el('div.bars');

  series.forEach(function (d) {
    var h = Math.max(3, (d.value / max) * 100);
    wrap.appendChild(el('div.bars__col', { title: d.date + ' · ' + d.value + ' nya' },
      el('div.bars__bar', { style: { height: h + '%' } })
    ));
  });

  return el('div',
    wrap,
    el('div.chart-axis',
      el('span', { text: series[0].date }),
      el('span', { text: series[series.length - 1].date })
    )
  );
}

// ---------------------------------------------------------------
// Kategorifördelning
// ---------------------------------------------------------------
function categoryBars(data) {
  if (!data.length) {
    return U.emptyState('📁', 'Ingen data', 'Publicera kurser för att se fördelningen.');
  }
  var max = Math.max.apply(null, data.map(function (d) { return d.value; })) || 1;
  var total = data.reduce(function (s, d) { return s + d.value; }, 0);
  var COLORS = ['#FF4E42', '#7C6BFF', '#FFB23E', '#2DD4BF', '#9A6BFF', '#6E7BFF', '#FF9233', '#FF3B4D'];

  var wrap = el('div.cat-list');
  data.forEach(function (d, i) {
    wrap.appendChild(el('div.cat-row',
      el('span.cat-row__emoji', { text: d.emoji || '•' }),
      el('div.cat-row__body',
        el('div.cat-row__top',
          el('span', { text: d.category }),
          el('span.cell-mono', { text: (total ? Math.round(d.value / total * 100) : 0) + ' %' })
        ),
        el('div.bar.bar--sm', el('div.bar__fill', {
          style: { width: (d.value / max * 100) + '%', background: COLORS[i % COLORS.length] },
        }))
      )
    ));
  });
  return wrap;
}

// ---------------------------------------------------------------
// Export
// ---------------------------------------------------------------
function exportOverview(a) {
  var rows = [['Datum', 'Aktiva användare', 'Nya konton']];
  a.dailyActive.forEach(function (d, i) {
    rows.push([d.date, d.value, a.signups[i] ? a.signups[i].value : 0]);
  });
  U.downloadCsv('quickthinkers-oversikt.csv', rows);
  U.toast('Översikt exporterad', 'ok');
}

function exportCourseStats(a) {
  var rows = [['Kurs', 'Kategori', 'Påbörjade', 'Klara', 'Genomförande %', 'Gillar', 'Swipes', 'Sparade']];
  a.courseStats.forEach(function (s) {
    rows.push([s.title, s.category, s.starts, s.completions, s.completionRate, s.likes, s.swipes, s.saves]);
  });
  U.downloadCsv('quickthinkers-kursstatistik.csv', rows);
  U.toast('Kursstatistik exporterad', 'ok');
}
