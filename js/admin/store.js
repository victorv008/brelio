// QuickThinkers adminportal — datalager.
// Håller allt i minnet, speglar till localStorage så demon överlever
// omladdning. Byts mot Supabase-anrop i fas 1 utan att vyerna ändras:
// de pratar bara med funktionerna här nere.

(function () {
  'use strict';

  var KEY = 'qt_admin_state_v1';
  var listeners = [];
  var state = null;

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.courses && parsed.users) return parsed;
      }
    } catch (e) {
      console.warn('[store] kunde inte läsa localStorage, använder mockdata', e);
    }
    return {
      courses: clone(window.QT_MOCK.courses),
      users: clone(window.QT_MOCK.users),
      analytics: clone(window.QT_MOCK.analytics),
    };
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[store] kunde inte spara till localStorage', e);
    }
  }

  function emit() {
    persist();
    listeners.forEach(function (fn) { fn(state); });
  }

  state = load();

  // ---------------------------------------------------------------
  // Kurser
  // ---------------------------------------------------------------
  function listCourses(filter) {
    filter = filter || {};
    var out = state.courses.slice();

    if (filter.query) {
      var q = filter.query.toLowerCase();
      out = out.filter(function (c) {
        return c.title.toLowerCase().indexOf(q) !== -1 ||
          c.description.toLowerCase().indexOf(q) !== -1 ||
          (c.tags || []).join(' ').toLowerCase().indexOf(q) !== -1;
      });
    }
    if (filter.category && filter.category !== 'all') {
      out = out.filter(function (c) { return c.category === filter.category; });
    }
    if (filter.status && filter.status !== 'all') {
      var wantPublished = filter.status === 'published';
      out = out.filter(function (c) { return c.published === wantPublished; });
    }
    if (filter.level && filter.level !== 'all') {
      out = out.filter(function (c) { return c.level === filter.level; });
    }

    var sort = filter.sort || 'updated';
    out.sort(function (a, b) {
      if (sort === 'title') return a.title.localeCompare(b.title, 'sv');
      if (sort === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'order') return a.sortOrder - b.sortOrder;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    return out;
  }

  function getCourse(id) {
    return state.courses.filter(function (c) { return c.id === id; })[0] || null;
  }

  function createCourse(data) {
    var now = new Date().toISOString();
    var max = state.courses.reduce(function (m, c) { return Math.max(m, c.sortOrder || 0); }, 0);
    var course = {
      id: uid('c'),
      title: data.title || 'Namnlös kurs',
      description: data.description || '',
      why: data.why || '',
      category: data.category || 'Design',
      emoji: data.emoji || '📚',
      level: data.level || 'Nybörjare',
      lessons: Number(data.lessons) || 0,
      minutes: Number(data.minutes) || 0,
      xp: Number(data.xp) || 0,
      glow: data.glow || '#7C6BFF',
      poster: data.poster || 'linear-gradient(150deg,#1b1b27,#242433)',
      tags: data.tags || [],
      published: !!data.published,
      sortOrder: max + 1,
      createdAt: now,
      updatedAt: now,
      decks: [],
    };
    state.courses.push(course);
    emit();
    return course;
  }

  function updateCourse(id, patch) {
    var c = getCourse(id);
    if (!c) return null;
    Object.keys(patch).forEach(function (k) {
      if (k === 'lessons' || k === 'minutes' || k === 'xp') c[k] = Number(patch[k]) || 0;
      else c[k] = patch[k];
    });
    c.updatedAt = new Date().toISOString();
    emit();
    return c;
  }

  function deleteCourse(id) {
    var i = state.courses.findIndex(function (c) { return c.id === id; });
    if (i === -1) return false;
    state.courses.splice(i, 1);
    // Rensa progress som pekar på den borttagna kursen
    state.users.forEach(function (u) {
      u.progress = (u.progress || []).filter(function (p) { return p.courseId !== id; });
    });
    state.analytics.courseStats = state.analytics.courseStats.filter(function (s) {
      return s.courseId !== id;
    });
    emit();
    return true;
  }

  function togglePublish(id) {
    var c = getCourse(id);
    if (!c) return null;
    c.published = !c.published;
    c.updatedAt = new Date().toISOString();

    // Nypublicerad kurs saknar statistik — ge den en tom rad så
    // analysvyn kan visa den utan specialfall.
    var has = state.analytics.courseStats.some(function (s) { return s.courseId === id; });
    if (c.published && !has) {
      state.analytics.courseStats.push({
        courseId: id, starts: 0, completions: 0,
        avgMinutes: 0, swipes: 0, rating: 0,
      });
    }
    emit();
    return c;
  }

  function duplicateCourse(id) {
    var c = getCourse(id);
    if (!c) return null;
    var copy = clone(c);
    var now = new Date().toISOString();
    copy.id = uid('c');
    copy.title = c.title + ' (kopia)';
    copy.published = false;
    copy.createdAt = now;
    copy.updatedAt = now;
    copy.sortOrder = state.courses.reduce(function (m, x) { return Math.max(m, x.sortOrder || 0); }, 0) + 1;
    copy.decks = (copy.decks || []).map(function (d) {
      d.id = uid('d');
      d.cards = (d.cards || []).map(function (k) { k.id = uid('k'); return k; });
      return d;
    });
    state.courses.push(copy);
    emit();
    return copy;
  }

  // ---------------------------------------------------------------
  // Kortlekar och kort
  // ---------------------------------------------------------------
  function addDeck(courseId, title) {
    var c = getCourse(courseId);
    if (!c) return null;
    var deck = { id: uid('d'), title: title || 'Ny kortlek', cards: [] };
    c.decks = c.decks || [];
    c.decks.push(deck);
    c.updatedAt = new Date().toISOString();
    emit();
    return deck;
  }

  function updateDeck(courseId, deckId, patch) {
    var c = getCourse(courseId);
    if (!c) return null;
    var d = (c.decks || []).filter(function (x) { return x.id === deckId; })[0];
    if (!d) return null;
    Object.assign(d, patch);
    c.updatedAt = new Date().toISOString();
    emit();
    return d;
  }

  function deleteDeck(courseId, deckId) {
    var c = getCourse(courseId);
    if (!c) return false;
    var i = (c.decks || []).findIndex(function (x) { return x.id === deckId; });
    if (i === -1) return false;
    c.decks.splice(i, 1);
    c.updatedAt = new Date().toISOString();
    emit();
    return true;
  }

  function getDeck(courseId, deckId) {
    var c = getCourse(courseId);
    if (!c) return null;
    return (c.decks || []).filter(function (d) { return d.id === deckId; })[0] || null;
  }

  function addCard(courseId, deckId, card) {
    var d = getDeck(courseId, deckId);
    if (!d) return null;
    var newCard = {
      id: uid('k'),
      type: card.type || 'flashcard',
      question: card.question || '',
      answer: card.answer || '',
      options: card.options || [],
      correctIndex: typeof card.correctIndex === 'number' ? card.correctIndex : 0,
    };
    d.cards = d.cards || [];
    d.cards.push(newCard);
    getCourse(courseId).updatedAt = new Date().toISOString();
    emit();
    return newCard;
  }

  function updateCard(courseId, deckId, cardId, patch) {
    var d = getDeck(courseId, deckId);
    if (!d) return null;
    var k = (d.cards || []).filter(function (x) { return x.id === cardId; })[0];
    if (!k) return null;
    Object.assign(k, patch);
    getCourse(courseId).updatedAt = new Date().toISOString();
    emit();
    return k;
  }

  function deleteCard(courseId, deckId, cardId) {
    var d = getDeck(courseId, deckId);
    if (!d) return false;
    var i = (d.cards || []).findIndex(function (x) { return x.id === cardId; });
    if (i === -1) return false;
    d.cards.splice(i, 1);
    getCourse(courseId).updatedAt = new Date().toISOString();
    emit();
    return true;
  }

  function moveCard(courseId, deckId, cardId, dir) {
    var d = getDeck(courseId, deckId);
    if (!d) return false;
    var i = d.cards.findIndex(function (x) { return x.id === cardId; });
    var j = i + dir;
    if (i === -1 || j < 0 || j >= d.cards.length) return false;
    var tmp = d.cards[i];
    d.cards[i] = d.cards[j];
    d.cards[j] = tmp;
    emit();
    return true;
  }

  // ---------------------------------------------------------------
  // Användare
  // ---------------------------------------------------------------
  function listUsers(filter) {
    filter = filter || {};
    var out = state.users.slice();

    if (filter.query) {
      var q = filter.query.toLowerCase();
      out = out.filter(function (u) {
        return u.name.toLowerCase().indexOf(q) !== -1 ||
          u.email.toLowerCase().indexOf(q) !== -1;
      });
    }
    if (filter.role && filter.role !== 'all') {
      out = out.filter(function (u) { return u.role === filter.role; });
    }
    if (filter.status && filter.status !== 'all') {
      out = out.filter(function (u) { return u.status === filter.status; });
    }

    var sort = filter.sort || 'active';
    out.sort(function (a, b) {
      if (sort === 'name') return a.name.localeCompare(b.name, 'sv');
      if (sort === 'xp') return b.xp - a.xp;
      if (sort === 'joined') return new Date(b.joinedAt) - new Date(a.joinedAt);
      return new Date(b.lastActiveAt) - new Date(a.lastActiveAt);
    });
    return out;
  }

  function getUser(id) {
    return state.users.filter(function (u) { return u.id === id; })[0] || null;
  }

  function setUserRole(id, role) {
    var u = getUser(id);
    if (!u) return null;
    u.role = role;
    emit();
    return u;
  }

  function toggleBan(id) {
    var u = getUser(id);
    if (!u) return null;
    u.status = u.status === 'banned' ? 'active' : 'banned';
    if (u.status === 'banned') u.streak = 0;
    emit();
    return u;
  }

  function deleteUser(id) {
    var i = state.users.findIndex(function (u) { return u.id === id; });
    if (i === -1) return false;
    state.users.splice(i, 1);
    emit();
    return true;
  }

  // ---------------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------------
  function getAnalytics() {
    var a = state.analytics;
    var users = state.users;
    var published = state.courses.filter(function (c) { return c.published; });

    var dau = a.dailyActive[a.dailyActive.length - 1].value;
    var dauPrev = a.dailyActive[a.dailyActive.length - 8].value;
    var mau = Math.round(a.dailyActive.reduce(function (s, d) { return s + d.value; }, 0) / 30 * 3.4);

    var newUsers = a.signups.slice(-7).reduce(function (s, d) { return s + d.value; }, 0);
    var newUsersPrev = a.signups.slice(-14, -7).reduce(function (s, d) { return s + d.value; }, 0);

    var totalStarts = a.courseStats.reduce(function (s, x) { return s + x.starts; }, 0);
    var totalCompletions = a.courseStats.reduce(function (s, x) { return s + x.completions; }, 0);
    var completionRate = totalStarts ? Math.round(totalCompletions / totalStarts * 100) : 0;

    var totalSwipes = a.courseStats.reduce(function (s, x) { return s + x.swipes; }, 0);
    var activeUsers = users.filter(function (u) { return u.status === 'active'; }).length;
    var avgStreak = users.length
      ? Math.round(users.reduce(function (s, u) { return s + u.streak; }, 0) / users.length * 10) / 10
      : 0;

    return {
      dailyActive: a.dailyActive,
      signups: a.signups,
      kpis: {
        dau: dau,
        dauChange: dauPrev ? Math.round((dau - dauPrev) / dauPrev * 1000) / 10 : 0,
        mau: mau,
        newUsers: newUsers,
        newUsersChange: newUsersPrev ? Math.round((newUsers - newUsersPrev) / newUsersPrev * 1000) / 10 : 0,
        totalUsers: users.length,
        activeUsers: activeUsers,
        completionRate: completionRate,
        totalSwipes: totalSwipes,
        avgStreak: avgStreak,
        publishedCourses: published.length,
        draftCourses: state.courses.length - published.length,
      },
      courseStats: a.courseStats.map(function (s) {
        var c = getCourse(s.courseId);
        return Object.assign({}, s, {
          title: c ? c.title : 'Borttagen kurs',
          emoji: c ? c.emoji : '—',
          category: c ? c.category : '—',
          completionRate: s.starts ? Math.round(s.completions / s.starts * 100) : 0,
        });
      }).sort(function (x, y) { return y.starts - x.starts; }),
      categoryBreakdown: (function () {
        var map = {};
        published.forEach(function (c) {
          var stat = a.courseStats.filter(function (s) { return s.courseId === c.id; })[0];
          map[c.category] = (map[c.category] || 0) + (stat ? stat.starts : 0);
        });
        return Object.keys(map).map(function (k) {
          return { category: k, value: map[k] };
        }).sort(function (x, y) { return y.value - x.value; });
      })(),
    };
  }

  // ---------------------------------------------------------------
  // Övrigt
  // ---------------------------------------------------------------
  function resetDemo() {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignoreras */ }
    state = {
      courses: clone(window.QT_MOCK.courses),
      users: clone(window.QT_MOCK.users),
      analytics: clone(window.QT_MOCK.analytics),
    };
    emit();
  }

  function subscribe(fn) {
    listeners.push(fn);
    return function () {
      var i = listeners.indexOf(fn);
      if (i !== -1) listeners.splice(i, 1);
    };
  }

  window.QTStore = {
    subscribe: subscribe,
    getState: function () { return state; },
    resetDemo: resetDemo,

    listCourses: listCourses,
    getCourse: getCourse,
    createCourse: createCourse,
    updateCourse: updateCourse,
    deleteCourse: deleteCourse,
    togglePublish: togglePublish,
    duplicateCourse: duplicateCourse,

    getDeck: getDeck,
    addDeck: addDeck,
    updateDeck: updateDeck,
    deleteDeck: deleteDeck,
    addCard: addCard,
    updateCard: updateCard,
    deleteCard: deleteCard,
    moveCard: moveCard,

    listUsers: listUsers,
    getUser: getUser,
    setUserRole: setUserRole,
    toggleBan: toggleBan,
    deleteUser: deleteUser,

    getAnalytics: getAnalytics,
  };
})();
