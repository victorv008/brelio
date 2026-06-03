const KEYS = {
  saved:       'brelio_saved',
  swipeIndex:  'brelio_swipe_index',
  xp:          'brelio_xp',
  streak:      'brelio_streak',
  achievements:'brelio_achievements',
};

function read(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}

function write(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export const State = {
  getSaved:      () => read(KEYS.saved, []),
  isSaved:       (id) => read(KEYS.saved, []).includes(id),
  saveCourse(id) {
    const saved = this.getSaved();
    if (!saved.includes(id)) { saved.push(id); write(KEYS.saved, saved); }
  },
  removeSaved(id) { write(KEYS.saved, this.getSaved().filter(s => s !== id)); },

  getSwipeIndex:  () => read(KEYS.swipeIndex, 0),
  setSwipeIndex:  (i) => write(KEYS.swipeIndex, i),
  resetSwipeIndex:() => write(KEYS.swipeIndex, 0),

  getXP: () => read(KEYS.xp, 0),
  addXP(amount) {
    const next = this.getXP() + amount;
    write(KEYS.xp, next);
    return next;
  },

  getStreak: () => read(KEYS.streak, { count: 0, lastDate: null }),
  updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const s = this.getStreak();
    if (s.lastDate === today) return s;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const count = s.lastDate === yesterday ? s.count + 1 : 1;
    const next = { count, lastDate: today };
    write(KEYS.streak, next);
    return next;
  },

  getOnboarded:  () => read('brelio_onboarded', false),
  setOnboarded:  () => write('brelio_onboarded', true),
  getInterests:  () => read('brelio_interests', []),
  setInterests:  (arr) => write('brelio_interests', arr),

  getAchievements: () => read(KEYS.achievements, []),
  unlockAchievement(id) {
    const ach = this.getAchievements();
    if (ach.includes(id)) return false;
    ach.push(id); write(KEYS.achievements, ach); return true;
  },
};
