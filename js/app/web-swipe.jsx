// Desktop swipe — physical card deck; keyboard ← ↑ →; confirmation flash via onFlash.
import React from 'react';
import { DS } from '../lib/ds.js';
import { COURSES } from '../data/courses.js';

const DS_swipew = DS;

export function WebSwipe({ onXp, onSaveCourse, onFlash }) {
  const { SwipeCard } = DS_swipew;
  const [idx, setIdx] = React.useState(0);
  const [toast, setToast] = React.useState(null);
  const [popKey, setPopKey] = React.useState(null);
  const courses = COURSES;
  const done = idx >= courses.length;

  const flash = (msg, color) => { setToast({ msg, color }); setTimeout(() => setToast(null), 1200); };

  const advance = React.useCallback((kind) => {
    setIdx((i) => {
      if (i >= courses.length) return i;
      if (kind === 'like') { onXp && onXp(10); flash('Gillade! +10 XP 🔥', 'var(--accent)'); onFlash && onFlash('rgba(255,78,66,0.08)'); }
      if (kind === 'save') { onSaveCourse && onSaveCourse(courses[i]); flash('Sparad till din resa 🔖', 'var(--cool)'); onFlash && onFlash('rgba(124,107,255,0.08)'); }
      if (kind === 'skip') { flash('Nästa →', 'rgba(255,255,255,0.2)'); }
      return i + 1;
    });
    setPopKey(kind + Date.now());
  }, []);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); advance('skip'); }
      if (e.key === 'ArrowUp') { e.preventDefault(); advance('save'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); advance('like'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance]);

  if (done) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
          <h2 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, letterSpacing: '-0.02em', color: 'var(--text-hi)' }}>
            Du har sett allt!
          </h2>
          <p style={{ margin: '0 0 24px', fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.5, color: 'var(--text-mid)' }}>
            Bra jobbat. Kolla dina sparade kurser eller börja om och hitta fler guldkorn.
          </p>
          <button onClick={() => setIdx(0)} style={{
            padding: '11px 22px', borderRadius: 'var(--radius-full)', background: 'var(--accent)', color: '#fff',
            fontFamily: 'var(--font-body)', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Börja om</button>
        </div>
      </div>
    );
  }

  const top = courses[idx];
  const peek = courses[idx + 1];
  const peek2 = courses[idx + 2];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-lo)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 6 }}>
        Hitta kursen som tar dig närmare ditt mål
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-mid)', margin: '0 0 28px', letterSpacing: '0.05em' }}>
        Kort {idx + 1} av {courses.length} · Piltangenter fungerar också
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: 360, height: 520 }}>
        {/* card stack peek */}
        {peek2 && (
          <div key={'peek2' + peek2.id} style={{ position: 'absolute', inset: 0, transform: 'scale(0.88) translateY(28px)', filter: 'brightness(0.50)', zIndex: 1 }}>
            <SwipeCard {...peek2} style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        {peek && (
          <div key={'peek' + peek.id} style={{ position: 'absolute', inset: 0, transform: 'scale(0.92) translateY(16px)', filter: 'brightness(0.65)', zIndex: 2 }}>
            <SwipeCard {...peek} style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        <div key={top.id} style={{ position: 'absolute', inset: 0, animation: 'b-cardrise 280ms var(--ease-spring)', zIndex: 3 }}>
          <SwipeCard {...top} style={{ width: '100%', height: '100%' }}
            onLike={() => advance('like')} onSkip={() => advance('skip')} onSave={() => advance('save')} />
        </div>
      </div>

      {/* action buttons — compact row below card */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 24 }}>
        <SwipeBtn color="#5A5A6B" label="Skippa" glyph="✕" pop={popKey && popKey.startsWith('skip')} onClick={() => advance('skip')} />
        <SwipeBtn color="#FF4E42" label="Gillar" glyph="♥" pop={popKey && popKey.startsWith('like')} onClick={() => advance('like')} />
        <SwipeBtn color="#7C6BFF" label="Spara" glyph="🔖" pop={popKey && popKey.startsWith('save')} onClick={() => advance('save')} />
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 5,
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap',
          background: toast.color, padding: '12px 22px', borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-pop)', animation: 'popw var(--dur-slow) var(--ease-spring)' }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function SwipeBtn({ color, label, glyph, pop, onClick }) {
  const [press, setPress] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const size = 64;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <button aria-label={label} onClick={onClick}
        onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)}
        onPointerEnter={() => setHover(true)} onPointerLeave={() => { setPress(false); setHover(false); }}
        style={{ width: size, height: size, borderRadius: '50%', cursor: 'pointer',
          background: 'var(--ink-750)', border: `2px solid ${color}`, color,
          fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: press ? 'scale(0.88)' : hover ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-base) var(--ease-out)',
          boxShadow: hover ? `0 0 20px -2px ${color}` : `0 8px 20px ${color}22`,
          animation: pop ? 'b-pop 400ms var(--ease-spring)' : 'none' }}>
        {glyph}
      </button>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-lo)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</span>
    </div>
  );
}
