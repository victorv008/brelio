let _courses = null;

export async function loadCourses() {
  if (_courses) return _courses;
  const res = await fetch('/courses.json');
  _courses = await res.json();
  return _courses;
}

export function getCourses() { return _courses || []; }

export function getCourseById(id) { return (_courses || []).find(c => c.id === id); }
