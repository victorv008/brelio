// Desktop home — hero band, breathing quiz banner, staggered course grid.
const DS_homew = window.BrelioDesignSystem_2b4fd5;

function WebRail({ number, title, courses, delay, onOpen, onSeeAll }) {
  const { SectionHeader, CourseCard } = DS_homew;
  return (
    <div style={{ marginBottom: 40 }}>
      <div className="b-rise" style={{ animationDelay: delay + 'ms' }}>
        <SectionHeader number={number} title={title} action={<span onClick={onSeeAll}>Se alla →</span>} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginTop: 22 }}>
        {courses.map((c, i) => (
          <div key={c.id} className="b-rise" style={{ animationDelay: (delay + 60 + i * 40) + 'ms' }}>
            <CourseCard {...c} onClick={() => onOpen(c)} style={{ width: '100%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WebHome({ onStartSwipe, onExplore, onOpen, onQuiz }) {
  const { Button } = DS_homew;
  const [quizHover, setQuizHover] = React.useState(false);
  const courses = window.BRELIO_COURSES;
  return (
    <div>
      {/* hero band */}
      <div className="b-rise" style={{ position: 'relative', borderRadius: 'var(--radius-2xl)', overflow: 'hidden',
        padding: '52px 48px', marginBottom: 40, border: '1px solid var(--line)', borderTop: '1px solid rgba(255,255,255,0.10)',
        background: 'radial-gradient(120% 140% at 0% 0%, rgba(124,107,255,0.22), transparent 55%), radial-gradient(120% 140% at 100% 100%, rgba(255,78,66,0.22), transparent 55%), var(--ink-800)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11,
          textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--amber)', background: 'var(--amber-tint)',
          border: '1px solid rgba(255,178,62,0.25)', padding: '6px 13px', borderRadius: 'var(--radius-full)', marginBottom: 22 }}>
          ✨ Lärande gjort enkelt
        </span>
        <h1 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(40px, 5vw, 60px)',
          lineHeight: 1.02, letterSpacing: '-0.03em', color: 'var(--text-hi)', maxWidth: 720, textWrap: 'pretty' }}>
          Swipa dig till <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>din nästa kurs</span>
        </h1>
        <p style={{ margin: '0 0 30px', fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.5, color: 'var(--text-mid)', maxWidth: 560 }}>
          Bläddra bland hundratals kurser precis som på Tinder. Gilla det du vill lära dig, hoppa över resten — och spara det för senare.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="primary" size="lg" onClick={onStartSwipe}>Börja swipa</Button>
          <Button variant="ghost" size="lg" onClick={onExplore}>Utforska kurser</Button>
        </div>
      </div>

      {/* quiz banner — glass with ambient amber breathe */}
      <div className="b-rise" onClick={onQuiz}
        onMouseEnter={() => setQuizHover(true)} onMouseLeave={() => setQuizHover(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 44, cursor: 'pointer',
          borderRadius: 'var(--radius-xl)', padding: '22px 26px', animationDelay: '80ms',
          background: 'rgba(24,22,30,0.9)',
          borderTop: '1px solid rgba(255,178,62,0.4)', borderLeft: '1px solid rgba(255,255,255,0.08)',
          borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)',
          boxShadow: quizHover ? '0 0 60px -6px rgba(255,178,62,0.55), inset 0 1px 0 rgba(255,255,255,0.08)' : undefined,
          animation: quizHover ? 'none' : 'b-quizpulse 2.5s ease-in-out infinite',
          transform: quizHover ? 'translateY(-3px)' : 'none',
          transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)' }}>
        <span style={{ fontSize: 42 }}>🧠</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 20, color: 'var(--text-hi)' }}>Dagens Quiz — testa din kunskap!</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-mid)', marginTop: 3, letterSpacing: '0.04em' }}>10 frågor · tjäna upp till 200 XP · bygg din combo</div>
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, padding: '10px 20px', borderRadius: 'var(--radius-full)',
          color: quizHover ? '#0A0A0F' : 'var(--amber)', background: quizHover ? 'var(--amber)' : 'var(--amber-tint)',
          border: '1px solid rgba(255,178,62,0.45)', transition: 'all var(--dur-base) var(--ease-out)' }}>Starta →</span>
      </div>

      <WebRail number="01" title="Populärt just nu 🔥" courses={courses.slice(0, 4)} delay={160} onOpen={onOpen} onSeeAll={onExplore} />
      <WebRail number="02" title="Rekommenderat för dig ✨" courses={courses.slice(4, 8)} delay={280} onOpen={onOpen} onSeeAll={onExplore} />
    </div>
  );
}

Object.assign(window, { WebHome });
