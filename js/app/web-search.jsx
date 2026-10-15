// Desktop search/explore — category pills + responsive results grid.
import React from 'react';
import { DS } from '../lib/ds.js';
import { COURSES, CATEGORIES } from '../data/courses.js';

const DS_searchw = DS;

export function WebSearch({ query, onOpen }) {
  const { CourseCard, SectionHeader } = DS_searchw;
  const [active, setActive] = React.useState('Alla');
  const [sort, setSort] = React.useState('relevant');
  const cats = CATEGORIES;
  const courses = COURSES;
  let list = active === 'Alla' ? courses : courses.filter((c) => c.category === active);
  if (query) list = list.filter((c) => (c.title + c.category).toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="b-rise">
        <SectionHeader title={query ? `Sökresultat för "${query}"` : 'Utforska kurser'} />
      </div>

      <div className="b-rise" style={{ display: 'flex', gap: 14, alignItems: 'center', margin: '18px 0 24px', animationDelay: '60ms' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
          {['Alla', ...cats.map((c) => c.label)].map((label) => (
            <FilterPill key={label} label={label} active={active === label} onClick={() => setActive(label)} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mid)' }}>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', color: 'var(--text-hi)',
            borderRadius: 'var(--radius-md)', padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: 12, cursor: 'pointer' }}>
            <option value="relevant">Mest relevant</option>
            <option value="popular">Populär</option>
            <option value="newest">Senaste</option>
          </select>
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-lo)', marginBottom: 16, letterSpacing: '0.06em' }}>
        {list.length} KURSER HITTADES
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
        {list.map((c, i) => (
          <div key={c.id} className="b-rise" style={{ animationDelay: (120 + i * 40) + 'ms' }}>
            <CourseCard {...c} onClick={() => onOpen(c)} style={{ width: '100%' }} />
          </div>
        ))}
      </div>
      {list.length === 0 && (
        <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-mid)', textAlign: 'center', padding: 60 }}>
          Inga kurser matchar. Prova en annan kategori eller sökterm.
        </div>
      )}
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'var(--font-mono)', fontSize: 13, cursor: 'pointer',
        padding: '9px 18px', borderRadius: 'var(--radius-full)',
        background: active ? 'var(--accent)' : hover ? 'rgba(255,255,255,0.04)' : 'transparent',
        color: active ? '#fff' : hover ? 'var(--text-hi)' : 'var(--text-mid)',
        border: `1px solid ${active ? 'var(--accent)' : hover ? 'rgba(255,255,255,0.12)' : 'var(--line-strong)'}`,
        boxShadow: active && hover ? '0 0 20px -4px rgba(255,78,66,0.6)' : 'none',
        transition: 'all var(--dur-base) var(--ease-out)' }}>
      {label}
    </button>
  );
}
