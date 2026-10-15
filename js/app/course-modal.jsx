// Course detail modal — lesson reader. Completing a lesson awards XP once.
import React from 'react';
import { DS } from '../lib/ds.js';
import { LESSON_TEMPLATE } from '../data/courses.js';

const DS_modal = DS;

export function CourseModal({ course, onClose, onXp }) {
  const { Button, Badge } = DS_modal;
  const [done, setDone] = React.useState([]);
  if (!course) return null;
  const lessons = LESSON_TEMPLATE.slice(0, Math.min(6, course.lessons));

  const complete = (i) => {
    if (done.includes(i)) return;
    setDone((d) => [...d, i]);
    onXp && onXp(15);
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'rgba(5,5,7,0.7)', backdropFilter: 'blur(6px)', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 520, maxWidth: '100%', maxHeight: '86vh', overflowY: 'auto',
        background: 'var(--ink-800)', borderRadius: 'var(--radius-xl)',
        borderTop: '1px solid rgba(255,255,255,0.14)', borderLeft: '1px solid rgba(255,255,255,0.08)',
        borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
        boxShadow: 'var(--shadow-pop)', animation: 'b-modal 260ms var(--ease-out)' }}>

        {/* poster header */}
        <div style={{ position: 'relative', height: 170, background: course.poster, borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(110% 90% at 50% -15%, rgba(255,255,255,0.10), transparent 55%), linear-gradient(180deg, transparent 30%, rgba(16,16,25,0.9) 100%)' }} />
          <button onClick={onClose} aria-label="Stäng" style={{ position: 'absolute', top: 14, right: 14, width: 34, height: 34,
            borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(8,8,12,0.5)',
            backdropFilter: 'blur(10px)', color: 'var(--text-hi)', cursor: 'pointer', fontSize: 14 }}>✕</button>
          <div style={{ position: 'absolute', left: 22, bottom: 16, right: 22 }}>
            <Badge>{course.category}</Badge>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, letterSpacing: '-0.02em', color: '#fff', marginTop: 8 }}>{course.title}</div>
          </div>
        </div>

        <div style={{ padding: '18px 22px 22px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', color: 'var(--text-lo)', marginBottom: 16 }}>
            {course.lessons} lektioner · {course.minutes} min · {course.xp} XP totalt
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            {lessons.map((l, i) => {
              const isDone = done.includes(i);
              return (
                <button key={i} onClick={() => complete(i)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', textAlign: 'left',
                  background: isDone ? 'rgba(255,178,62,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isDone ? 'rgba(255,178,62,0.3)' : 'var(--line)'}`,
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  transition: 'background var(--dur-base) var(--ease-out), border var(--dur-base) var(--ease-out)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: isDone ? 'var(--amber)' : 'var(--text-lo)', width: 22 }}>
                    {isDone ? '✓' : String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: 'var(--text-hi)' }}>{l.t}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-lo)' }}>{isDone ? '+15 XP' : l.m + ' min'}</span>
                </button>
              );
            })}
          </div>

          <Button variant="primary" fullWidth onClick={() => complete(done.length < lessons.length ? lessons.findIndex((_, i) => !done.includes(i)) : 0)}>
            {done.length === 0 ? 'Börja lära dig' : done.length >= lessons.length ? 'Kursen klar 🎉' : 'Fortsätt lära dig'}
          </Button>
        </div>
      </div>
    </div>
  );
}
