// Desktop saved — saved list, or an inviting empty state with floating icon.
import React from 'react';
import { DS } from '../lib/ds.js';

const DS_savedw = DS;

export function WebSaved({ saved, onExplore, onSwipe, onOpen }) {
  const { SectionHeader, Badge, Button } = DS_savedw;

  if (!saved || saved.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '55vh' }}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 380 }}>
          {/* indigo glow behind icon */}
          <div aria-hidden="true" style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
            width: 220, height: 220, borderRadius: '50%', background: 'var(--cool)', opacity: 0.14, filter: 'blur(64px)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 16, animation: 'b-float 3s ease-in-out infinite' }}>🔖</div>
          <h2 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 30, letterSpacing: '-0.02em', color: 'var(--text-hi)' }}>
            Inga sparade ännu
          </h2>
          <p style={{ margin: '0 0 24px', fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.5, color: 'var(--text-mid)' }}>
            Swipa upp på en kurs i flödet för att spara den hit för senare.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="primary" onClick={onExplore}>Utforska kurser</Button>
            <Button variant="ghost" onClick={onSwipe}>Börja swipa</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="b-rise">
        <SectionHeader title="Sparade kurser" />
      </div>
      <p className="b-rise" style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-mid)', margin: '12px 0 26px', animationDelay: '50ms' }}>
        Kurser du har sparat för att läsa senare
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {saved.map((c, i) => (
          <div key={c.id} className="b-rise" onClick={() => onOpen(c)} style={{
            display: 'flex', gap: 18, alignItems: 'center', background: 'var(--ink-750)',
            border: '1px solid var(--line)', borderTop: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 'var(--radius-lg)', padding: 14, cursor: 'pointer', animationDelay: (100 + i * 50) + 'ms',
            transition: 'background var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ink-700)'; e.currentTarget.style.transform = 'translateX(3px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ink-750)'; e.currentTarget.style.transform = 'none'; }}>
            <div style={{ width: 76, height: 76, borderRadius: 'var(--radius-md)', background: c.poster, flex: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{c.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Badge>{c.category}</Badge>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 18, color: 'var(--text-hi)', margin: '8px 0 5px' }}>{c.title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', color: 'var(--text-lo)' }}>{c.lessons} lektioner · {c.minutes} min · {c.xp} XP</div>
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--accent)', whiteSpace: 'nowrap' }}>Börja lära dig →</span>
          </div>
        ))}
      </div>
    </div>
  );
}
