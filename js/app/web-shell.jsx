// Brelio web shell — glass sidebar + top HUD bar with working popovers and XP burst.
const DS_shellw = window.BrelioDesignSystem_2b4fd5;

const WEB_NAV = [
  { id: 'home', label: 'Hem', icon: '⌂' },
  { id: 'swipe', label: 'Swipa', icon: '⇄' },
  { id: 'search', label: 'Sök', icon: '⌕' },
  { id: 'saved', label: 'Sparade', icon: '🔖' },
];

function Sidebar({ tab, onTab, level, xp, onStartSwipe }) {
  const { Button } = DS_shellw;
  return (
    <aside style={{
      width: 248, flex: 'none', background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      borderRight: '1px solid var(--line)', borderTop: '1px solid rgba(255,255,255,0.08)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', padding: '26px 18px', height: '100vh', position: 'sticky', top: 0,
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em', color: 'var(--text-hi)', padding: '0 10px 26px' }}>
        Brelio <span style={{ fontSize: 18 }}>🔥</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {WEB_NAV.map((n) => <NavItem key={n.id} item={n} active={tab === n.id} onTab={onTab} />)}
      </nav>

      <div style={{ marginTop: 22, padding: '0 4px' }}>
        <Button variant="primary" fullWidth onClick={onStartSwipe}
          style={{ animation: 'b-breathe 2s ease-in-out infinite' }}>Börja swipa</Button>
      </div>

      <div style={{ marginTop: 'auto', padding: '16px 12px 0', borderTop: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cool)' }}>⚡ Nivå {level}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-lo)' }}><TickNumber value={xp} /> / 200 XP</span>
        </div>
        <div style={{ height: 5, background: 'var(--ink-700)', borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${(xp / 200) * 100}%`, background: 'var(--fire)', borderRadius: 3, transition: 'width var(--dur-cine) var(--ease-spring)' }} />
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: xp >= 150 ? 'var(--amber)' : 'var(--text-mid)', marginTop: 8, fontWeight: 500 }}>
          {xp >= 150 ? `Bara ${200 - xp} XP till nästa nivå! 🔥` : 'Gilla kurser och klara lektioner för XP'}
        </div>
      </div>
    </aside>
  );
}

function NavItem({ item, active, onTab }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={() => onTab(item.id)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', cursor: 'pointer',
        borderRadius: 'var(--radius-md)', border: 'none', textAlign: 'left',
        background: active ? 'var(--accent-tint)' : hover ? 'rgba(255,255,255,0.05)' : 'transparent',
        color: active ? 'var(--accent)' : hover ? 'var(--text-hi)' : 'var(--text-mid)',
        fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: active ? 600 : 500,
        transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',
      }}>
      <span style={{ fontSize: 20, width: 22, textAlign: 'center' }}>{item.icon}</span>{item.label}
    </button>
  );
}

/* Animated number — ticks from old to new value over 600ms. */
function TickNumber({ value }) {
  const [shown, setShown] = React.useState(value);
  const prev = React.useRef(value);
  React.useEffect(() => {
    const from = prev.current, to = value;
    prev.current = value;
    if (from === to) return;
    const t0 = performance.now(), dur = 600;
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3); // ease-out
      setShown(Math.round(from + (to - from) * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span>{shown}</span>;
}

/* Chip wrapper that pops + emits a particle burst when `signal` changes. */
function BurstChip({ signal, color, onClick, children }) {
  const [burst, setBurst] = React.useState(null);
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) { first.current = false; return; }
    setBurst(Date.now());
    const t = setTimeout(() => setBurst(null), 550);
    return () => clearTimeout(t);
  }, [signal]);
  const dots = burst ? [...Array(6)].map((_, i) => {
    const ang = (i / 6) * Math.PI * 2 + 0.4;
    return { x: Math.cos(ang) * 34, y: Math.sin(ang) * 34, key: burst + '-' + i };
  }) : [];
  return (
    <span onClick={onClick} style={{ position: 'relative', display: 'inline-flex', cursor: 'pointer',
      animation: burst ? 'b-chippop 500ms var(--ease-spring)' : 'none' }}>
      {children}
      {dots.map((d) => (
        <span key={d.key} style={{
          position: 'absolute', left: '50%', top: '50%', width: 5, height: 5, borderRadius: '50%',
          background: color, pointerEvents: 'none', '--bx': d.x + 'px', '--by': d.y + 'px',
          animation: 'b-burst 500ms var(--ease-out) forwards',
        }} />
      ))}
    </span>
  );
}

function Popover({ x = 'right', children, onClose }) {
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40 }}></div>
      <div style={{
        position: 'absolute', top: 'calc(100% + 10px)', [x]: 0, zIndex: 50, minWidth: 230,
        background: 'rgba(17,17,26,0.97)',
        borderTop: '1px solid rgba(255,255,255,0.14)', borderLeft: '1px solid rgba(255,255,255,0.10)',
        borderRight: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 'var(--radius-lg)', padding: 16, boxShadow: 'var(--shadow-pop)',
        animation: 'b-modal 200ms var(--ease-out)',
      }}>{children}</div>
    </React.Fragment>
  );
}

function TopBar({ streak, level, xp, query, onQuery }) {
  const { StatChip } = DS_shellw;
  const [open, setOpen] = React.useState(null); // 'streak' | 'level' | 'profile'
  const [focus, setFocus] = React.useState(false);
  const days = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];
  const toggle = (k) => setOpen(open === k ? null : k);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 20, padding: '18px 40px',
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(12,12,18,0.88)',
      borderBottom: '1px solid var(--line)', borderTop: '1px solid rgba(255,255,255,0.08)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
    }}>
      <div style={{ flex: 1, maxWidth: 460, display: 'flex', alignItems: 'center', gap: 10,
        background: focus ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${focus ? 'rgba(255,78,66,0.28)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: focus ? '0 0 16px -6px rgba(255,78,66,0.28), inset 0 1px 0 rgba(255,255,255,0.06)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
        borderRadius: 'var(--radius-full)', padding: '10px 16px',
        transition: 'border var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)' }}>
        <span style={{ color: 'var(--text-mid)', fontSize: 16 }}>⌕</span>
        <input value={query} onChange={(e) => onQuery(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          placeholder="Sök bland hundratals kurser…"
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-hi)', fontSize: 14,
            fontFamily: 'var(--font-body)', '::placeholder': { color: 'var(--text-lo)' } }} />
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ position: 'relative' }}>
          <BurstChip signal={streak} color="var(--accent)" onClick={() => toggle('streak')}>
            <StatChip role="streak" icon="🔥">{streak} dagar</StatChip>
          </BurstChip>
          {open === 'streak' && (
            <Popover onClose={() => setOpen(null)}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: 'var(--text-hi)', marginBottom: 4 }}>🔥 {streak} dagar i rad</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-mid)', marginBottom: 14 }}>Lär dig något varje dag för att behålla din streak.</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {days.map((d, i) => (
                  <span key={i} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10,
                    padding: '8px 0', borderRadius: 8,
                    background: i < streak ? 'var(--accent-tint)' : 'rgba(255,255,255,0.04)',
                    color: i < streak ? 'var(--accent)' : 'var(--text-lo)',
                    border: `1px solid ${i < streak ? 'rgba(255,78,66,0.3)' : 'var(--line)'}` }}>{d}</span>
                ))}
              </div>
            </Popover>
          )}
        </span>

        <span style={{ position: 'relative' }}>
          <BurstChip signal={xp} color="var(--amber)" onClick={() => toggle('level')}>
            <StatChip role="level" icon="⚡">Lvl {level}</StatChip>
          </BurstChip>
          {open === 'level' && (
            <Popover onClose={() => setOpen(null)}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: 'var(--text-hi)', marginBottom: 4 }}>⚡ Nivå {level}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-mid)', marginBottom: 12 }}>{200 - xp} XP kvar till nivå {level + 1}.</div>
              <div style={{ height: 6, background: 'var(--ink-700)', borderRadius: 3, marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${(xp / 200) * 100}%`, background: 'var(--fire)', borderRadius: 3, transition: 'width var(--dur-cine) var(--ease-spring)' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-lo)' }}><TickNumber value={xp} /> / 200 XP</div>
            </Popover>
          )}
        </span>

        <span style={{ position: 'relative' }}>
          <button onClick={() => toggle('profile')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--fire)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff',
            fontFamily: 'var(--font-body)', border: 'none', cursor: 'pointer',
            boxShadow: open === 'profile' ? '0 0 0 2px rgba(255,78,66,0.5)' : 'none' }}>A</button>
          {open === 'profile' && (
            <Popover onClose={() => setOpen(null)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--fire)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-body)' }}>A</span>
                <span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: 'var(--text-hi)' }}>Alex Andersson</span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-lo)', marginTop: 2 }}>Nivå {level} · {streak} dagars streak</span>
                </span>
              </div>
              {['Min profil', 'Inställningar', 'Notiser', 'Logga ut'].map((r) => (
                <button key={r} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 10px',
                  background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 14, color: r === 'Logga ut' ? 'var(--accent)' : 'var(--text-mid)',
                  transition: 'background var(--dur-base) var(--ease-out)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>{r}</button>
              ))}
            </Popover>
          )}
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, TopBar, TickNumber });
