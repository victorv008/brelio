# Brelio — Swipa dig till kunskap

An addictive educational platform inspired by TikTok/Tinder swiping mechanics. Users swipe through course cards to discover and save learning content.

**Live site:** https://brelio-eight.vercel.app

---

## Tech Stack

- **Vanilla HTML/CSS/JS** — no frameworks (intentional constraint)
- **Vite 5** — dev server and build tool only
- **Google Fonts** — Clash Display (display) + Satoshi (body)
- **Font Awesome 6.4** — icons
- **Vercel** — deployment (auto-builds with `vite build`)
- **localStorage** — all user data persistence (no backend/database)

---

## File Structure

```
brelio/
├── index.html              ← Single HTML shell with all page sections
├── public/
│   └── courses.json        ← Course data (fetched at runtime)
├── css/
│   ├── variables.css       ← Design tokens (colors, fonts, spacing)
│   ├── base.css            ← Reset, typography, global styles
│   ├── animations.css      ← All @keyframes and transitions
│   ├── nav.css             ← Top nav + mobile bottom tab bar
│   ├── home.css            ← Home/hero page styles
│   ├── home-sections.css   ← Trending/recommended rows below hero
│   ├── swipe.css           ← Swipe card stack + drag styles
│   ├── search.css          ← Search/explore page
│   ├── saved.css           ← Saved courses page
│   ├── components.css      ← Shared: buttons, toasts, badges
│   ├── modal.css           ← Course detail modal (slides up from bottom)
│   ├── preview.css         ← 60-second lesson preview overlay
│   ├── quiz.css            ← Quiz overlay styles
│   ├── study.css           ← Study mode overlay
│   └── onboarding.css      ← First-visit onboarding flow
├── js/
│   ├── app.js              ← Entry point: imports, routing, init
│   ├── state.js            ← localStorage state API (saved, XP, streak)
│   ├── courses.js          ← Fetches /courses.json, exposes getCourses()
│   ├── swipe.js            ← Card stack rendering + drag/touch/keyboard
│   ├── search.js           ← Search page logic + category filtering
│   ├── saved.js            ← Saved courses rendering
│   ├── home.js             ← Trending/recommended section rendering
│   ├── streak.js           ← Daily streak counter logic
│   ├── xp.js               ← XP points + level system
│   ├── animations.js       ← Count-up stats, stagger helpers
│   ├── ui.js               ← Toast notifications, saved badge
│   ├── modal.js            ← Course detail modal logic
│   ├── preview.js          ← 60-second lesson preview logic
│   ├── quiz.js             ← Quiz overlay logic
│   ├── study.js            ← Study mode logic
│   └── onboarding.js       ← First-visit onboarding (3-step flow)
├── data/
│   └── courses.json        ← Source course data (copy of public/courses.json)
├── vercel.json             ← Vercel build config
├── package.json            ← Vite dependency + build scripts
├── CLAUDE.md               ← Full product spec and sprint roadmap (for AI)
└── README.md               ← This file
```

---

## Design System

All tokens are in `css/variables.css`. **Never change these without updating across all files.**

```css
--bg: #0a0a0f;            /* Page background */
--surface: #13131a;       /* Card/panel backgrounds */
--surface2: #1c1c28;      /* Secondary surfaces */
--border: rgba(255,255,255,0.07);
--accent: #ff6b6b;        /* Coral — primary, skip action */
--accent2: #4ecdc4;       /* Teal — like/positive action */
--accent3: #ffe66d;       /* Yellow — save/highlight action */
--text: #f0f0f5;
--muted: rgba(240,240,245,0.45);
--card-radius: 24px;
--nav-height: 64px;
--font-display: 'Clash Display', sans-serif;
--font-body: 'Satoshi', sans-serif;
```

---

## Key Constraints (READ THIS BEFORE CHANGING ANYTHING)

1. **UI stays in Swedish.** All buttons, labels, toasts, copy — Swedish only.
2. **Dark theme only.** Never add light mode.
3. **No frameworks.** No React, Vue, Tailwind. Vanilla JS/CSS only.
4. **Mobile-first.** Test at 375px. The bottom tab nav appears at ≤768px.
5. **Keep the swipe mechanic.** It is the core feature.

---

## Architecture Notes

### Navigation / Routing
- All 4 pages live in `index.html` as `<main class="page">` elements
- `goTo(page)` in `app.js` handles showing/hiding pages by toggling `.active` class
- `data-page` attributes on buttons wire up navigation automatically

### State Management (`js/state.js`)
All user data is stored in localStorage with these keys:
- `brelio_saved` — array of saved course IDs
- `brelio_xp` — total XP points
- `brelio_streak` — `{ count, lastDate }` object
- `brelio_swipe_index` — current position in swipe deck
- `brelio_achievements` — array of unlocked achievement IDs
- `brelio_onboarded` — boolean, whether onboarding was completed
- `brelio_interests` — array of selected category interests

### Course Data (`public/courses.json`)
Fetched at runtime via `fetch('/courses.json')`. Each course has:
```json
{
  "id": 1,
  "title": "Python for beginners",
  "category": "Programmering",
  "emoji": "🐍",
  "level": "Nybörjare",
  "hours": 12,
  "lessons": 8,
  "tags": ["Python", "Kod"],
  "color": "#1a2a1a",
  "description": "...",
  "students": 1247,
  "rating": 4.8,
  "preview": {
    "type": "fact | quiz",
    "content": "...",
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct": 0
  }
}
```

### Swipe Mechanics (`js/swipe.js`)
- Drag threshold: 80px horizontal → triggers like/skip
- Drag threshold: -80px vertical → triggers save (swipe up)
- Cards rendered as a stack (top = current, behind = next 2)
- Keyboard: `←` skip, `→` like, `↑` save, `Space` preview
- After swiping right: triggers 60-second lesson preview overlay

### Special Cards in Swipe Deck
Every 4th-5th card is a "special" card (fact or quiz) mixed into the feed.

---

## Local Development

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # → builds to dist/
npm run preview    # → serves dist/ at http://localhost:4173
```

## Deployment

Deployed on Vercel. To redeploy after changes:
```bash
vercel --prod
```
Or connect the GitHub repo to Vercel for automatic deploys on every push.

**Important:** Course data must be in `public/courses.json` (not `data/`) so Vite includes it in the build output. If you edit `data/courses.json`, copy it to `public/courses.json` as well.

---

## Sprint Status

### Done
- Modular file structure (split from monolithic index.html)
- localStorage persistence for all state
- Entrance animations (stagger fade-in, count-up stats)
- Keyboard shortcuts for swiping
- Mobile bottom navigation bar
- SEO meta tags
- Course detail modal (tap card → slides up from bottom)
- 60-second lesson preview overlay on swipe right
- Daily streak counter with milestone celebrations
- XP points system with levels and progress bar
- Mixed quiz/fact special cards in swipe feed
- 30+ courses across 10 categories in Swedish
- Trending / recommended / new sections on home page
- Onboarding flow (3-step, first visit only, category selection)

### Not yet built
- Page transition animations between sections
- Achievement/badge system (10-15 achievements defined in CLAUDE.md)
- Improved toast notifications (accent strip + auto-dismiss progress bar)
- Spring physics on card snap-back
- Sound effects with mute toggle
