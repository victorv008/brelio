// Dagens Quiz — 3 questions, +25 XP per correct answer, awarded on finish.
const DS_quiz = window.BrelioDesignSystem_2b4fd5;

function QuizModal({ onClose, onXp }) {
  const { Button } = DS_quiz;
  const quiz = window.BRELIO_QUIZ;
  const [i, setI] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [score, setScore] = React.useState(0);
  const [finished, setFinished] = React.useState(false);

  const q = quiz[i];
  const pick = (idx) => {
    if (picked != null) return;
    setPicked(idx);
    const correct = idx === q.a;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (i + 1 < quiz.length) { setI(i + 1); setPicked(null); }
      else {
        setFinished(true);
        const total = (correct ? score + 1 : score) * 25;
        if (total > 0) onXp && onXp(total);
      }
    }, 900);
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'rgba(5,5,7,0.7)', backdropFilter: 'blur(6px)', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 460, maxWidth: '100%', background: 'var(--ink-800)', borderRadius: 'var(--radius-xl)',
        borderTop: '1px solid rgba(255,178,62,0.4)', borderLeft: '1px solid rgba(255,255,255,0.08)',
        borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
        boxShadow: '0 0 80px -16px rgba(255,178,62,0.4), var(--shadow-pop)',
        padding: 26, animation: 'b-modal 260ms var(--ease-out)' }}>

        {!finished ? (
          <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--amber)' }}>
                🧠 Dagens quiz · {i + 1} / {quiz.length}
              </span>
              <button onClick={onClose} aria-label="Stäng" style={{ width: 30, height: 30, borderRadius: '50%',
                border: '1px solid var(--line-strong)', background: 'none', color: 'var(--text-mid)', cursor: 'pointer', fontSize: 12 }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: 5, marginBottom: 22 }}>
              {quiz.map((_, k) => (
                <span key={k} style={{ flex: 1, height: 4, borderRadius: 2,
                  background: k < i || (k === i && picked != null) ? 'var(--amber)' : 'var(--ink-700)',
                  transition: 'background var(--dur-base) var(--ease-out)' }} />
              ))}
            </div>

            <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 20, color: 'var(--text-hi)', lineHeight: 1.3 }}>{q.q}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {q.options.map((opt, idx) => {
                const isPicked = picked === idx;
                const isRight = picked != null && idx === q.a;
                const isWrong = isPicked && idx !== q.a;
                return (
                  <button key={idx} onClick={() => pick(idx)} style={{
                    padding: '13px 16px', textAlign: 'left', cursor: picked == null ? 'pointer' : 'default',
                    background: isRight ? 'rgba(255,178,62,0.12)' : isWrong ? 'rgba(255,59,77,0.10)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isRight ? 'var(--amber)' : isWrong ? 'var(--accent)' : 'var(--line-strong)'}`,
                    borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500,
                    color: isRight ? 'var(--amber)' : isWrong ? 'var(--accent)' : 'var(--text-hi)',
                    transition: 'all var(--dur-base) var(--ease-out)' }}>
                    {opt}{isRight && ' ✓'}{isWrong && ' ✕'}
                  </button>
                );
              })}
            </div>
          </React.Fragment>
        ) : (
          <div style={{ textAlign: 'center', padding: '14px 4px 4px' }}>
            <div style={{ fontSize: 46, marginBottom: 12 }}>{score === quiz.length ? '🎉' : score > 0 ? '⚡' : '🧠'}</div>
            <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, letterSpacing: '-0.02em', color: 'var(--text-hi)' }}>
              {score} av {quiz.length} rätt
            </h3>
            <p style={{ margin: '0 0 20px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--amber)' }}>+{score * 25} XP intjänat</p>
            <Button variant="primary" fullWidth onClick={onClose}>Klart</Button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { QuizModal });
