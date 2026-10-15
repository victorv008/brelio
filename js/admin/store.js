// QuickThinkers adminportal — datalager mot Supabase.
//
// Allt laddas in i ett lokalt minne vid inloggning (init). Läsningar är
// synkrona mot minnet så vyerna kan rita direkt; skrivningar går till
// databasen först och uppdaterar minnet först när databasen sagt ja.
// Säkerheten ligger i databasens RLS — det här lagret är bara bekvämlighet.
import { supabase, unwrap, uploadImage, invokeFunction, UserError } from '../lib/supabase.js';

export const LEVELS = ['Nybörjare', 'Medel', 'Avancerad'];
export const BLOCK_TYPES = {
  text: { label: 'Text', icon: '¶' },
  image: { label: 'Bild', icon: '▣' },
  video: { label: 'Video', icon: '▶' },
  flashcard: { label: 'Flashcard', icon: '⇄' },
  quiz: { label: 'Quiz', icon: '?' },
};

const listeners = [];
const state = {
  me: null,
  categories: [],
  courses: [],
  users: [],
  guestCount: 0,
  includeGuests: false,
  dailyQuizzes: [],
};

function emit() {
  listeners.forEach((fn) => fn(state));
}

const bySort = (a, b) => a.sortOrder - b.sortOrder;

// -------------------------------------------------------------------
// Mappning databas → vyer (camelCase, härledda fält)
// -------------------------------------------------------------------
function mapBlock(row) {
  return { id: row.id, lessonId: row.lesson_id, type: row.type, content: row.content, sortOrder: row.sort_order };
}

function mapLesson(row) {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    minutes: row.minutes,
    displayMode: row.display_mode,
    sortOrder: row.sort_order,
    blocks: (row.lesson_blocks || []).map(mapBlock).sort(bySort),
  };
}

function mapCourse(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    why: row.why,
    categoryId: row.category_id,
    emoji: row.emoji,
    level: row.level,
    xp: row.xp,
    glow: row.glow,
    poster: row.poster,
    coverImagePath: row.cover_image_path,
    tags: row.tags || [],
    published: row.published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lessons: (row.lessons || []).map(mapLesson).sort(bySort),
  };
}

function mapCategory(row) {
  return { id: row.id, slug: row.slug, label: row.label, emoji: row.emoji, sortOrder: row.sort_order };
}

// Streaken räknas bara om användaren var aktiv idag eller igår.
function effectiveStreak(row) {
  if (!row.streak_last_date) return 0;
  const last = new Date(row.streak_last_date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((today - last) / 86400000);
  return days <= 1 ? row.streak_count : 0;
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.display_name || (row.email ? row.email.split('@')[0] : 'Gäst'),
    email: row.email || '',
    role: row.role,
    status: row.status,
    isAnonymous: row.is_anonymous,
    xp: row.xp,
    streak: effectiveStreak(row),
    joinedAt: row.registered_at || row.created_at,
    lastActiveAt: row.last_active_at,
  };
}

// Kursens härledda värden, så vyerna slipper räkna själva.
export function courseStats(c) {
  const lessons = c.lessons || [];
  return {
    lessonCount: lessons.length,
    minutes: lessons.reduce((s, l) => s + l.minutes, 0),
    blockCount: lessons.reduce((s, l) => s + l.blocks.length, 0),
    emptyLessons: lessons.filter((l) => !l.blocks.length).length,
  };
}

// -------------------------------------------------------------------
// Inläsning
// -------------------------------------------------------------------
const COURSE_SELECT = '*, lessons(*, lesson_blocks(*))';

async function loadCategories() {
  const rows = unwrap(await supabase.from('categories').select('*').order('sort_order'));
  state.categories = rows.map(mapCategory);
}

async function loadCourses() {
  const rows = unwrap(await supabase.from('courses').select(COURSE_SELECT));
  state.courses = rows.map(mapCourse);
}

async function loadUsers() {
  let query = supabase.from('profiles').select('*').order('last_active_at', { ascending: false }).limit(1000);
  if (!state.includeGuests) query = query.eq('is_anonymous', false);
  const rows = unwrap(await query);
  state.users = rows.map(mapUser);

  const { count } = await supabase
    .from('profiles').select('id', { count: 'exact', head: true }).eq('is_anonymous', true);
  state.guestCount = count || 0;
}

async function loadDailyQuizzes() {
  const rows = unwrap(await supabase.from('daily_quizzes').select('*').order('quiz_date', { ascending: false }).limit(60));
  state.dailyQuizzes = rows.map((r) => ({ date: r.quiz_date, questions: r.questions }));
}

export async function init(me) {
  state.me = me;
  await Promise.all([loadCategories(), loadCourses(), loadUsers(), loadDailyQuizzes()]);
  emit();
}

async function reloadCourse(id) {
  const row = unwrap(await supabase.from('courses').select(COURSE_SELECT).eq('id', id).single());
  const course = mapCourse(row);
  const i = state.courses.findIndex((c) => c.id === id);
  if (i === -1) state.courses.push(course);
  else state.courses[i] = course;
  emit();
  return course;
}

// -------------------------------------------------------------------
// Kategorier
// -------------------------------------------------------------------
export function getCategory(id) {
  return state.categories.find((c) => c.id === id) || null;
}

export function categoryLabel(id) {
  const c = getCategory(id);
  return c ? c.label : 'Utan kategori';
}

function slugify(label) {
  return label.toLowerCase()
    .replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/é/g, 'e')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'kategori';
}

export async function createCategory({ label, emoji }) {
  const max = state.categories.reduce((m, c) => Math.max(m, c.sortOrder), 0);
  let slug = slugify(label);
  if (state.categories.some((c) => c.slug === slug)) slug = `${slug}-${Date.now().toString(36)}`.slice(0, 40);
  const row = unwrap(await supabase.from('categories')
    .insert({ label, emoji, slug, sort_order: max + 1 }).select().single());
  state.categories.push(mapCategory(row));
  emit();
}

export async function updateCategory(id, { label, emoji }) {
  const row = unwrap(await supabase.from('categories').update({ label, emoji }).eq('id', id).select().single());
  const i = state.categories.findIndex((c) => c.id === id);
  state.categories[i] = mapCategory(row);
  emit();
}

export async function deleteCategory(id) {
  unwrap(await supabase.from('categories').delete().eq('id', id));
  state.categories = state.categories.filter((c) => c.id !== id);
  // Databasen sätter category_id till null på kurserna — spegla det.
  state.courses.forEach((c) => { if (c.categoryId === id) c.categoryId = null; });
  emit();
}

export async function moveCategory(id, dir) {
  const list = state.categories.slice().sort(bySort);
  if (await move('categories', list, id, dir)) {
    state.categories.sort(bySort);
    emit();
  }
}

// Flyttar en rad ett steg upp/ner. Listan numreras om 1..n så ordningen
// alltid är entydig, och bara rader vars nummer ändrats skrivs.
async function move(table, list, id, dir) {
  const i = list.findIndex((x) => x.id === id);
  const j = i + dir;
  if (i === -1 || j < 0 || j >= list.length) return false;
  const reordered = list.slice();
  [reordered[i], reordered[j]] = [reordered[j], reordered[i]];
  for (let k = 0; k < reordered.length; k++) {
    if (reordered[k].sortOrder !== k + 1) {
      unwrap(await supabase.from(table).update({ sort_order: k + 1 }).eq('id', reordered[k].id));
      reordered[k].sortOrder = k + 1;
    }
  }
  return true;
}

// -------------------------------------------------------------------
// Kurser
// -------------------------------------------------------------------
export function listCourses(filter = {}) {
  let out = state.courses.slice();

  if (filter.query) {
    const q = filter.query.toLowerCase();
    out = out.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.join(' ').toLowerCase().includes(q));
  }
  if (filter.category && filter.category !== 'all') out = out.filter((c) => c.categoryId === filter.category);
  if (filter.status && filter.status !== 'all') out = out.filter((c) => c.published === (filter.status === 'published'));
  if (filter.level && filter.level !== 'all') out = out.filter((c) => c.level === filter.level);

  const sort = filter.sort || 'updated';
  out.sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title, 'sv');
    if (sort === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === 'order') return a.sortOrder - b.sortOrder;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  return out;
}

export function getCourse(id) {
  return state.courses.find((c) => c.id === id) || null;
}

function courseRow(data) {
  const row = {};
  if ('title' in data) row.title = data.title;
  if ('description' in data) row.description = data.description;
  if ('why' in data) row.why = data.why;
  if ('categoryId' in data) row.category_id = data.categoryId || null;
  if ('emoji' in data) row.emoji = data.emoji;
  if ('level' in data) row.level = data.level;
  if ('xp' in data) row.xp = Number(data.xp) || 0;
  if ('glow' in data) row.glow = data.glow;
  if ('poster' in data) row.poster = data.poster;
  if ('coverImagePath' in data) row.cover_image_path = data.coverImagePath || null;
  if ('tags' in data) row.tags = data.tags;
  if ('published' in data) row.published = data.published;
  return row;
}

export async function createCourse(data) {
  const max = state.courses.reduce((m, c) => Math.max(m, c.sortOrder), 0);
  // Nya kurser är alltid utkast — de har inga lektioner än.
  const row = unwrap(await supabase.from('courses')
    .insert({ ...courseRow(data), published: false, sort_order: max + 1, created_by: state.me.id })
    .select(COURSE_SELECT).single());
  const course = mapCourse(row);
  state.courses.push(course);
  emit();
  return course;
}

export async function updateCourse(id, data) {
  unwrap(await supabase.from('courses').update(courseRow(data)).eq('id', id));
  return reloadCourse(id);
}

// Kontrollerna som databasen också gör — här för att kunna visa ett
// tydligt meddelande innan anropet.
export function publishProblem(course) {
  const s = courseStats(course);
  if (!s.lessonCount) return 'Kursen behöver minst en lektion innan den kan publiceras.';
  if (s.emptyLessons) return 'Alla lektioner måste ha minst ett block innan kursen kan publiceras.';
  return null;
}

export async function togglePublish(id) {
  const c = getCourse(id);
  if (!c.published) {
    const problem = publishProblem(c);
    if (problem) throw new UserError(problem);
  }
  return updateCourse(id, { published: !c.published });
}

export async function deleteCourse(id) {
  unwrap(await supabase.from('courses').delete().eq('id', id));
  state.courses = state.courses.filter((c) => c.id !== id);
  emit();
}

// Kopierar kursen med lektioner och block som ett nytt utkast. Bilderna
// delas — sökvägarna pekar på samma filer.
export async function duplicateCourse(id) {
  const c = getCourse(id);
  const copy = await createCourse({ ...c, title: `${c.title} (kopia)`.slice(0, 120) });
  for (const lesson of c.lessons) {
    const newLesson = unwrap(await supabase.from('lessons').insert({
      course_id: copy.id, title: lesson.title, minutes: lesson.minutes,
      display_mode: lesson.displayMode, sort_order: lesson.sortOrder,
    }).select().single());
    if (lesson.blocks.length) {
      unwrap(await supabase.from('lesson_blocks').insert(lesson.blocks.map((b) => ({
        lesson_id: newLesson.id, type: b.type, content: b.content, sort_order: b.sortOrder,
      }))));
    }
  }
  return reloadCourse(copy.id);
}

export async function uploadCourseImage(file) {
  return uploadImage(file, 'covers');
}

// -------------------------------------------------------------------
// Lektioner
// -------------------------------------------------------------------
export function getLesson(courseId, lessonId) {
  const c = getCourse(courseId);
  return c ? c.lessons.find((l) => l.id === lessonId) || null : null;
}

export async function addLesson(courseId, { title, minutes, displayMode }) {
  const c = getCourse(courseId);
  const max = c.lessons.reduce((m, l) => Math.max(m, l.sortOrder), 0);
  unwrap(await supabase.from('lessons').insert({
    course_id: courseId, title, minutes: Number(minutes) || 5,
    display_mode: displayMode, sort_order: max + 1,
  }));
  return reloadCourse(courseId);
}

export async function updateLesson(courseId, lessonId, { title, minutes, displayMode }) {
  unwrap(await supabase.from('lessons').update({
    title, minutes: Number(minutes) || 5, display_mode: displayMode,
  }).eq('id', lessonId));
  return reloadCourse(courseId);
}

export async function deleteLesson(courseId, lessonId) {
  const c = getCourse(courseId);
  if (c.published && c.lessons.length <= 1) {
    throw new UserError('En publicerad kurs måste ha minst en lektion. Avpublicera kursen först.');
  }
  unwrap(await supabase.from('lessons').delete().eq('id', lessonId));
  return reloadCourse(courseId);
}

export async function moveLesson(courseId, lessonId, dir) {
  const c = getCourse(courseId);
  if (!(await move('lessons', c.lessons, lessonId, dir))) return c;
  return reloadCourse(courseId);
}

// -------------------------------------------------------------------
// Block
// -------------------------------------------------------------------
export async function addBlock(courseId, lessonId, { type, content }) {
  const lesson = getLesson(courseId, lessonId);
  const max = lesson.blocks.reduce((m, b) => Math.max(m, b.sortOrder), 0);
  unwrap(await supabase.from('lesson_blocks').insert({
    lesson_id: lessonId, type, content, sort_order: max + 1,
  }));
  return reloadCourse(courseId);
}

export async function updateBlock(courseId, blockId, { content }) {
  unwrap(await supabase.from('lesson_blocks').update({ content }).eq('id', blockId));
  return reloadCourse(courseId);
}

export async function deleteBlock(courseId, lessonId, blockId) {
  const c = getCourse(courseId);
  const lesson = getLesson(courseId, lessonId);
  if (c.published && lesson.blocks.length <= 1) {
    throw new UserError('En lektion i en publicerad kurs måste ha minst ett block. Avpublicera kursen först.');
  }
  unwrap(await supabase.from('lesson_blocks').delete().eq('id', blockId));
  return reloadCourse(courseId);
}

export async function moveBlock(courseId, lessonId, blockId, dir) {
  const lesson = getLesson(courseId, lessonId);
  if (!(await move('lesson_blocks', lesson.blocks, blockId, dir))) return getCourse(courseId);
  return reloadCourse(courseId);
}

export async function uploadBlockImage(file) {
  return uploadImage(file, 'blocks');
}

// -------------------------------------------------------------------
// Dagens quiz
// -------------------------------------------------------------------
export function getDailyQuiz(date) {
  return state.dailyQuizzes.find((q) => q.date === date) || null;
}

export async function saveDailyQuiz(date, questions) {
  unwrap(await supabase.from('daily_quizzes').upsert({ quiz_date: date, questions }));
  await loadDailyQuizzes();
  emit();
}

export async function deleteDailyQuiz(date) {
  unwrap(await supabase.from('daily_quizzes').delete().eq('quiz_date', date));
  state.dailyQuizzes = state.dailyQuizzes.filter((q) => q.date !== date);
  emit();
}

// -------------------------------------------------------------------
// Användare
// -------------------------------------------------------------------
export function listUsers(filter = {}) {
  let out = state.users.slice();

  if (filter.query) {
    const q = filter.query.toLowerCase();
    out = out.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }
  if (filter.role && filter.role !== 'all') out = out.filter((u) => u.role === filter.role);
  if (filter.status && filter.status !== 'all') out = out.filter((u) => u.status === filter.status);

  const sort = filter.sort || 'active';
  out.sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name, 'sv');
    if (sort === 'xp') return b.xp - a.xp;
    if (sort === 'joined') return new Date(b.joinedAt) - new Date(a.joinedAt);
    return new Date(b.lastActiveAt) - new Date(a.lastActiveAt);
  });
  return out;
}

export function getUser(id) {
  return state.users.find((u) => u.id === id) || null;
}

export async function setIncludeGuests(include) {
  state.includeGuests = include;
  await loadUsers();
  emit();
}

export async function setUserRole(id, role) {
  unwrap(await supabase.rpc('admin_set_role', { p_user_id: id, p_role: role }));
  getUser(id).role = role;
  emit();
}

export async function setUserBanned(id, banned) {
  await invokeFunction('admin-users', { action: banned ? 'ban' : 'unban', userId: id });
  const u = getUser(id);
  u.status = banned ? 'banned' : 'active';
  if (banned) u.streak = 0;
  emit();
}

export async function deleteUser(id) {
  await invokeFunction('admin-users', { action: 'delete', userId: id });
  state.users = state.users.filter((u) => u.id !== id);
  emit();
}

// Progress per kurs: andel klara lektioner av kursens lektioner.
export async function getUserProgress(userId) {
  const rows = unwrap(await supabase.from('lesson_completions').select('course_id').eq('user_id', userId));
  const done = {};
  rows.forEach((r) => { done[r.course_id] = (done[r.course_id] || 0) + 1; });
  return Object.keys(done).map((courseId) => {
    const c = getCourse(courseId);
    const total = c ? c.lessons.length : 0;
    return {
      courseId,
      percent: total ? Math.min(100, Math.round(done[courseId] / total * 100)) : 0,
    };
  });
}

// -------------------------------------------------------------------
// Analytics
// -------------------------------------------------------------------
export async function getAnalytics() {
  return unwrap(await supabase.rpc('admin_analytics'));
}

// -------------------------------------------------------------------
export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i !== -1) listeners.splice(i, 1);
  };
}
