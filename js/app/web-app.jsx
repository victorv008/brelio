// QuickThinkers web app — root. Atmosphere + sidebar + top HUD + page transitions + modals + flash.
import React from 'react';
import { DS } from '../lib/ds.js';
import { Sidebar, TopBar } from './web-shell.jsx';
import { WebHome } from './web-home.jsx';
import { WebSwipe } from './web-swipe.jsx';
import { WebSearch } from './web-search.jsx';
import { WebSaved } from './web-saved.jsx';
import { CourseModal } from './course-modal.jsx';
import { QuizModal } from './quiz-modal.jsx';

const DS_appw = DS;

export function WebApp() {
  const [tab, setTab] = React.useState('home');
  const [streak] = React.useState(7);
  const [level, setLevel] = React.useState(1);
  const [xp, setXp] = React.useState(35);
  const [saved, setSaved] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [course, setCourse] = React.useState(null);   // course detail modal
  const [quizOpen, setQuizOpen] = React.useState(false);
  const [flash, setFlash] = React.useState(null);     // {color, key}

  const addXp = (n) => setXp((x) => {
    const nx = x + n;
    if (nx >= 200) { setLevel((l) => l + 1); return nx - 200; }
    return nx;
  });
  const addSaved = (c) => setSaved((s) => (s.find((x) => x.id === c.id) ? s : [c, ...s]));
  const doFlash = (color) => setFlash({ color, key: Date.now() });
  const go = (t) => {
    setTab(t);
    const m = document.getElementById('brelio-main');
    if (m) m.scrollTo({ top: 0 });
  };

  const screen = {
    home: <WebHome onStartSwipe={() => go('swipe')} onExplore={() => go('search')}
      onOpen={setCourse} onQuiz={() => setQuizOpen(true)} />,
    swipe: <WebSwipe onXp={addXp} onSaveCourse={addSaved} onFlash={doFlash} />,
    search: <WebSearch query={query} onOpen={setCourse} />,
    saved: <WebSaved saved={saved} onExplore={() => go('search')} onSwipe={() => go('swipe')} onOpen={setCourse} />,
  }[tab];

  return (
    <React.Fragment>
      {/* fixed ambient atmosphere — warm top-right, cool bottom-left */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(800px circle at 100% 0%, rgba(255,78,66,0.08), transparent 58%), radial-gradient(720px circle at 0% 100%, rgba(124,107,255,0.05), transparent 60%), var(--ink-850)' }} />

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Sidebar tab={tab} onTab={go} level={level} xp={xp} onStartSwipe={() => go('swipe')} />
        <main id="brelio-main" style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
          <TopBar streak={streak} level={level} xp={xp} query={query}
            onQuery={(v) => { setQuery(v); if (v) setTab('search'); }} />
          {/* page transition: keyed wrapper re-animates on tab change */}
          <div key={tab} className="b-page" style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 40px 80px' }}>
            {screen}
          </div>
        </main>
      </div>

      {course && <CourseModal course={course} onClose={() => setCourse(null)} onXp={addXp} />}
      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} onXp={addXp} />}

      {/* confirmation flash */}
      {flash && (
        <div key={flash.key} onAnimationEnd={() => setFlash(null)} style={{
          position: 'fixed', inset: 0, zIndex: 80, pointerEvents: 'none',
          background: flash.color, animation: 'b-flash 300ms var(--ease-out) forwards' }} />
      )}
    </React.Fragment>
  );
}
