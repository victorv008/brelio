# Brelio (KursSwipe) — Phase A: Improvement Plan

## 🧠 PROJECT CONTEXT

This is **Brelio** (currently branded "KursSwipe") — an **addictive educational platform** inspired by TikTok/Tinder swiping mechanics. Users swipe through course cards to discover and save learning content. Lessons are designed to be **10-15 minutes** each.

**The core philosophy: Make learning as addictive as social media scrolling.**

### Current State
- Single-page app: everything lives in `index.html` (~841 lines — HTML + CSS + JS all inline)
- `kursswipe.html` is an exact duplicate of `index.html` — **DELETE IT**
- Vite dev server (`npm run dev` → `localhost:5173`)
- 12 hardcoded courses with emoji icons
- Swedish UI language (keep it Swedish)
- Dark theme with Clash Display + Satoshi fonts
- Card swipe mechanics work (drag left/right/up) but **the dopamine loop is incomplete**

### Tech Stack
- **Vanilla HTML/CSS/JS** — no frameworks (keep it this way)
- **Vite 5** for dev server only
- **Google Fonts**: Clash Display (display) + Satoshi (body)
- **Font Awesome 6.4** for icons

### Design System (KEEP THESE)
```css
--bg: #0a0a0f;
--surface: #13131a;
--surface2: #1c1c28;
--border: rgba(255,255,255,0.07);
--accent: #ff6b6b;      /* coral — primary */
--accent2: #4ecdc4;     /* teal — like/positive */
--accent3: #ffe66d;     /* yellow — save/highlight */
--text: #f0f0f5;
--muted: rgba(240,240,245,0.45);
--card-radius: 24px;
--font-display: 'Clash Display', sans-serif;
--font-body: 'Satoshi', sans-serif;
```

---

## ⚠️ CRITICAL RULES

1. **Keep the UI in Swedish.** All labels, buttons, toasts, and copy must stay in Swedish.
2. **Keep the dark theme.** Do not switch to light mode. Keep the existing color palette.
3. **Keep the swipe card mechanic.** This is the core of the product — improve it, don't remove it.
4. **Mobile-first.** Every feature you build must work beautifully on mobile. Test at 375px viewport.
5. **Aesthetics matter enormously.** This must look and feel premium. Use smooth animations, glassmorphism, gradients, and micro-interactions. A boring-looking result is a failed result.
6. **No frameworks.** Stay with vanilla HTML/CSS/JS. No React, no Vue, no Tailwind.

---

## 🎨 ANIMATED BACKGROUNDS — MAKE EVERY SECTION ALIVE (URGENT)

> **The current backgrounds look AI-generated.** Every section uses the same blurred gradient orbs floating around. It's the #1 giveaway that this was generated, not designed. This needs to be fixed ACROSS EVERY SECTION with unique, professionally-crafted animated backgrounds that match each page's purpose.

### The Problem
- Home, Swipe, Search, Saved all use the same technique: blurred CSS circles floating with `@keyframes`. It's generic and repetitive.
- Search and Saved pages have NO background at all — just flat `--bg` color. They feel dead.
- The orbs are too opaque, too simple, and too "seen it a million times on AI demos."

### The Philosophy
Each page has a different **emotional purpose**. The background should reinforce that emotion subtly, not just be decoration. Think of how Spotify, Linear, Vercel, and Raycast use backgrounds — they're atmospheric, layered, and never distract from the content.

**IMPORTANT RULES:**
- **Never use the same background technique twice across pages.** Each section must feel unique.
- **Backgrounds must be subtle.** They create atmosphere, not distraction. Content always comes first.
- **Layer multiple techniques.** Don't just use one effect — combine 2-3 subtle layers for depth.
- **Performance matters.** Use CSS wherever possible. Only use `<canvas>` when CSS truly can't achieve the effect. Always use `will-change` and `transform` for GPU-accelerated animations.
- **Do NOT use blurred circles/orbs as the primary background technique on any page.** That pattern is banned going forward.

---

### HOME PAGE — "Awe & Wonder" (Hero + Sections)

The home page needs to feel like you've arrived somewhere special. Think Linear.app landing page energy.

**Technique: Animated mesh gradient + floating grain texture**

1. **Mesh gradient background** (CSS `@property` animated):
   - Use 3-4 gradient color stops that slowly shift position over 30-60 seconds
   - Colors: deep navy (`#0d0f1a`), dark plum (`#1a0a20`), dark teal tint (`#0a1a1a`), and the base `--bg`
   - Animate `background-position` or use CSS Heron interpolation for organic movement
   - Keep it very dark and subtle — this isn't a screensaver, it's atmosphere

2. **Film grain overlay** (CSS noise):
   - Add a subtle noise/grain texture using a CSS `background-image` with a tiny SVG noise pattern or base64 data URI
   - `opacity: 0.03-0.05` — barely visible but adds texture that breaks the "too clean" digital look
   - Apply as a `::after` pseudo-element on the page with `pointer-events: none`

3. **Subtle grid pattern** (CSS):
   - A very faint dot grid or line grid (`opacity: 0.03`) as a `::before` pseudo-element
   - Creates the "premium dashboard" feel (like Vercel, Linear)
   - Use `background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 32px 32px;`

4. **Remove the current orbs** or reduce them to a single, very subtle accent glow anchored behind the hero title (not floating).

**For the home-sections area** (trending/recommended rows below the hero):
- The mesh gradient should fade out into the solid `--bg` with a smooth gradient transition
- The sections area should have the subtle dot grid continuing, giving visual continuity

```css
/* Example: Animated mesh gradient for home */
#home::before {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(78,205,196,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(255,107,107,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(162,155,254,0.05) 0%, transparent 50%);
  animation: meshShift 40s ease-in-out infinite alternate;
  pointer-events: none; z-index: 0;
}

@keyframes meshShift {
  0%   { background-position: 0% 0%, 100% 0%, 50% 100%; }
  100% { background-position: 100% 100%, 0% 100%, 50% 0%; }
}

/* Film grain */
#home::after {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px 128px;
  opacity: 0.4;
  pointer-events: none; z-index: 1;
  mix-blend-mode: overlay;
}
```

---

### SWIPE PAGE — "Focus & Energy"

The swipe page is where the action happens. The background should feel energetic but focused — all attention on the card stack.

**Technique: Reactive color glow that responds to the current card + subtle radial pulse**

1. **Card-reactive ambient glow** (JS + CSS):
   - A single large, soft radial gradient behind the card stack that takes its color from the current top card's `color` property
   - When the card changes, smoothly transition the glow color (CSS `transition: background 0.8s ease`)
   - This creates a subtle, living connection between the card and its environment
   - Size: roughly 600x600px, centered behind the card stack, `filter: blur(120px)`, `opacity: 0.12`

2. **Radial pulse ring** (CSS animation):
   - A very subtle expanding ring that pulses outward from the center of the card stack every 4 seconds
   - Think of a heartbeat or radar ping
   - `border: 1px solid rgba(255,255,255,0.03)` expanding from 100px to 400px, fading out
   - Creates a sense of "alive-ness" without being distracting

3. **Remove the current 5 floating orbs.** Replace entirely with the above techniques.

```css
/* Reactive glow behind card stack */
.swipe-ambient-glow {
  position: absolute;
  width: 500px; height: 500px;
  border-radius: 50%;
  top: 50%; left: 50%;
  transform: translate(-50%, -55%);
  filter: blur(120px);
  opacity: 0.12;
  pointer-events: none;
  transition: background 0.8s ease;
  z-index: 0;
}

/* Pulse ring */
.swipe-pulse-ring {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -55%);
  width: 100px; height: 100px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.04);
  pointer-events: none;
  animation: pulseRing 4s ease-out infinite;
  z-index: 0;
}

@keyframes pulseRing {
  0%   { width: 100px; height: 100px; opacity: 0.5; border-width: 1.5px; }
  100% { width: 500px; height: 500px; opacity: 0; border-width: 0.5px; }
}
```

**JavaScript needed:** When `renderCards()` is called, read the top card's color and apply it to `.swipe-ambient-glow`'s `background` property.

---

### SEARCH PAGE — "Calm Exploration"

Search is about browsing and filtering. The background should feel spacious, calm, and organized — like walking through a well-lit library.

**Technique: Subtle animated vertical light beams + top accent gradient**

1. **Top accent gradient** (CSS):
   - A soft gradient that fades from a tinted color into `--bg` over the top 300px of the page
   - Color: a very muted version of `--accent` mixed with `--bg`
   - `background: linear-gradient(180deg, rgba(255,107,107,0.04) 0%, transparent 300px);`
   - This gives visual weight to the top and makes the title area feel warmer

2. **Animated light columns** (CSS):
   - 2-3 very tall, very thin vertical gradient strips that slowly drift horizontally
   - `width: 1-2px`, `height: 100%`, soft gradient from transparent → `rgba(255,255,255,0.03)` → transparent
   - Animate `translateX` very slowly (60-90 second cycles)
   - Creates a sense of depth, like light streaming through windows

3. **Dot grid texture** (CSS):
   - Same subtle dot grid as home page for consistency
   - `opacity: 0.02` — even more subtle here so it doesn't compete with the course cards

```css
#search-page {
  position: relative; overflow: hidden;
}
#search-page::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(255,107,107,0.035) 0%, transparent 350px);
  pointer-events: none; z-index: 0;
}
.search-light-beam {
  position: absolute; top: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.03) 70%, transparent 100%);
  pointer-events: none; z-index: 0;
}
.search-light-beam:nth-child(1) { left: 25%; animation: lightDrift 70s ease-in-out infinite alternate; }
.search-light-beam:nth-child(2) { left: 65%; animation: lightDrift 90s ease-in-out infinite alternate-reverse; }

@keyframes lightDrift {
  0%   { transform: translateX(0); opacity: 0.5; }
  50%  { transform: translateX(40px); opacity: 1; }
  100% { transform: translateX(-30px); opacity: 0.5; }
}
```

---

### SAVED PAGE — "Personal & Warm"

The saved page is personal — these are courses the user chose to keep. It should feel cozy and intimate.

**Technique: Warm gradient corner glow + breathing ambient light**

1. **Corner accent glow** (CSS):
   - A single warm gradient in the top-left corner: `radial-gradient(ellipse at 0% 0%, rgba(255,230,109,0.05) 0%, transparent 50%)`
   - The yellow/gold tint matches the "save" action color, creating a subconscious connection
   - Static, no animation — this is a calm, personal space

2. **Slow breathing ambient light** (CSS):
   - A very subtle full-page brightness oscillation: `opacity` cycling between `0.03` and `0.06` over 8 seconds
   - Like a room with a candle in the corner — barely noticeable but creates warmth
   - Apply as a radial gradient centered at bottom-right

3. **Horizontal rule accents** (CSS):
   - Instead of a background animation, add very subtle `border-top` gradient separators between saved items on hover
   - `border-image: linear-gradient(90deg, transparent, rgba(255,230,109,0.15), transparent) 1;`

```css
#saved-page {
  position: relative; overflow: hidden;
}
#saved-page::before {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 0% 0%, rgba(255,230,109,0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 100% 100%, rgba(78,205,196,0.03) 0%, transparent 40%);
  pointer-events: none; z-index: 0;
}
#saved-page::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 80% 90%, rgba(255,230,109,0.04) 0%, transparent 50%);
  animation: savedBreathe 8s ease-in-out infinite;
  pointer-events: none; z-index: 0;
}

@keyframes savedBreathe {
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 1; }
}
```

---

### OVERLAYS (Quiz, Study, Lesson Preview) — "Immersive Focus"

The full-screen overlays should feel like entering a different space entirely.

**Technique: Deep gradient background with vignette**

1. **Vignette effect** (CSS):
   - Darken the edges of the overlay more than the center, creating a cinema-like focus effect
   - `box-shadow: inset 0 0 150px 50px rgba(0,0,0,0.5);`

2. **Deep color shift** (CSS):
   - Each overlay type gets a unique tint:
     - Quiz: deep purple tint (`rgba(162,155,254,0.06)`)
     - Study: deep blue tint (`rgba(78,205,196,0.05)`)
     - Lesson Preview: warm coral tint (`rgba(255,107,107,0.05)`)

3. **No floating elements.** Overlays need maximum focus on content. Background is just atmosphere.

---

### Implementation Notes

- Create a new CSS file: `css/backgrounds.css` — keep all background styles isolated
- Add it to `index.html` after `variables.css` and before page-specific CSS files
- For the swipe page reactive glow, add a single `<div class="swipe-ambient-glow">` to the `#swipe` page HTML and update its `background` color in `swipe.js` when the top card changes
- For the search page light beams, add 2 `<div class="search-light-beam">` elements to `#search-page` HTML
- Remove ALL existing `.home-bg-orb`, `.swipe-orb` divs and their CSS entirely — they are being replaced
- Make sure all background elements have `pointer-events: none` and `z-index: 0` so they never interfere with interaction
- Test on mobile — make sure backgrounds don't cause scroll jank. Use `will-change: transform` sparingly and only on animated elements

---

## 🏗️ FILE STRUCTURE TARGET

Refactor the single HTML file into this structure:

```
brelio/
├── index.html              ← Shell HTML only (semantic, with meta tags)
├── css/
│   ├── variables.css       ← Design tokens (colors, fonts, spacing)
│   ├── base.css            ← Reset, typography, global styles
│   ├── nav.css             ← Navigation (top bar + mobile bottom bar)
│   ├── home.css            ← Home/landing page styles
│   ├── swipe.css           ← Swipe page + card styles
│   ├── search.css          ← Search/explore page styles
│   ├── saved.css           ← Saved courses page styles
│   ├── components.css      ← Shared components (buttons, toasts, modals, badges)
│   └── animations.css      ← All keyframe animations + transitions
├── js/
│   ├── app.js              ← Main entry: imports, routing, init
│   ├── state.js            ← State management + localStorage persistence
│   ├── courses.js          ← Course data (export from JSON-like structure)
│   ├── swipe.js            ← Swipe card rendering + drag/touch logic
│   ├── search.js           ← Search page logic + filtering
│   ├── saved.js            ← Saved courses rendering
│   ├── streak.js           ← Daily streak counter logic
│   ├── xp.js               ← XP/points system logic
│   ├── animations.js       ← Animation utilities (count-up, stagger, etc.)
│   └── sounds.js           ← Sound effect manager (with mute toggle)
├── data/
│   └── courses.json        ← All courses as structured JSON (30-50 courses)
├── assets/
│   └── sounds/             ← Short sound effects (optional, can add later)
├── package.json
├── CLAUDE.md               ← This file
└── README.md
```

Use ES modules (`type="module"` in script tag, `import/export` in JS files). Vite handles this natively.

---

## 🔥 SPRINT 1 — FOUNDATION (DO THIS FIRST)

These are the highest-priority changes. Do all of these before moving to Sprint 2.

### 1.1 Delete `kursswipe.html`
It's a duplicate. Remove it.

### 1.2 Refactor into modular file structure
Split the monolithic `index.html` into the file structure above. This is the foundation for everything else.

### 1.3 Add localStorage persistence
**THIS IS CRITICAL.** Currently everything resets on page refresh.

Persist in localStorage:
- `brelio_saved` — Array of saved course IDs
- `brelio_swipe_index` — Current position in swipe deck
- `brelio_xp` — Total XP points
- `brelio_streak` — `{ count: number, lastDate: "YYYY-MM-DD" }`
- `brelio_achievements` — Array of unlocked achievement IDs

Create a `state.js` module that handles all reads/writes with a clean API:
```js
// Example API
State.getSaved()        // → [1, 5, 8]
State.saveCourse(id)    // → persists
State.removeSaved(id)   // → persists
State.getStreak()       // → { count: 3, lastDate: "2026-05-24" }
State.getXP()           // → 450
State.addXP(amount)     // → persists, returns new total
```

### 1.4 Add entrance animations
- **Home page**: Stagger fade-in + slide-up for badge, title, subtitle, search, CTAs, stats (each 100ms delayed)
- **Swipe cards**: Cards should scale-in when the page loads (not just appear)
- **Search results**: Grid items should fade in with stagger
- **Saved list**: Items slide in from the right with stagger

Use CSS `@keyframes` + animation classes. Add them in `animations.css`:
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.animate-in {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}
```

### 1.5 Animate the home page orbs
The background orbs should float/pulse subtly:
```css
@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(30px, -20px); }
  66% { transform: translate(-20px, 15px); }
}
```
Apply different durations (15s, 20s, 25s) to each orb for organic movement.

### 1.6 Count-up animation on stats
The "200+", "18", "100%" stats on the home page should count up from 0 when they scroll into view. Use Intersection Observer + requestAnimationFrame.

### 1.7 Keyboard shortcuts for swiping
On the swipe page, listen for:
- `←` Arrow Left → Skip (swipe left)
- `→` Arrow Right → Like (swipe right)
- `↑` Arrow Up → Save (swipe up)
- `Space` → Flip/preview card details

Show a small keyboard hint below the action buttons on desktop: `← skippa | ↑ spara | → gillar`

### 1.8 Responsive mobile bottom navigation
On screens ≤ 768px, replace the top nav links with a **fixed bottom tab bar**:
- 4 tabs with icons + labels: 🏠 Hem, 🔥 Swipa, 🔍 Sök, 📚 Sparade
- Active tab highlighted with accent color
- The top nav on mobile should show only the logo
- Use glassmorphism style: `background: rgba(19,19,26,0.9); backdrop-filter: blur(20px);`

### 1.9 Add proper SEO meta tags to `index.html`
```html
<meta name="description" content="Swipa dig till din nästa kurs. Upptäck hundratals kurser med KursSwipe — lärande gjort enkelt och beroendeframkallande.">
<meta property="og:title" content="Brelio — Swipa dig till kunskap">
<meta property="og:description" content="Hitta din nästa kurs genom att swipa. Snabbt, enkelt och beroendeframkallande lärande.">
<meta property="og:type" content="website">
<meta name="theme-color" content="#0a0a0f">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>">
```

---

## 🔥 SPRINT 2 — THE DOPAMINE LOOP (DO THIS SECOND)

This is what transforms the app from a prototype into something addictive.

### 2.1 Course Detail Modal

**When a user TAPS (not drags) a swipe card OR taps a card in search**, show a detail modal:

- Slides up from the bottom (mobile sheet pattern)
- Glassmorphism background with blur
- Shows: course emoji (large), title, full description, lesson count, duration, difficulty, tags
- Two CTAs: "🔖 Spara" and "🚀 Börja lära dig"
- Can be dismissed by swiping down or tapping the overlay
- On desktop: centered modal with backdrop blur

### 2.2 Lesson Preview on Like (60-second hook)

**THIS IS THE MOST IMPORTANT FEATURE.** When a user swipes right (likes a course), instead of just a toast:

1. Show a full-screen **lesson preview overlay** that slides up
2. Display a **60-second countdown timer** in the top-right
3. Show a bite-sized piece of course content:
   - A "Did you know?" fact
   - A single quiz question with 4 options
   - A key concept with a visual diagram
   - A short code snippet to analyze (for programming courses)
4. After 60 seconds OR when dismissed: "Vill du fortsätta? 🚀" with options to save or skip
5. The preview content should be stored in the course data as a `preview` field

This creates the **TikTok moment** — you didn't plan to learn, but now you're hooked.

### 2.3 Daily Streak Counter 🔥

Display in the navbar (next to the logo):
- Flame emoji + number: "🔥 3"
- Tooltip/popup on hover/tap showing streak details
- Streak increments when user completes any interaction on a new calendar day
- If a day is missed, streak resets to 0 (creates **loss aversion**)
- Store in localStorage with `lastDate` tracking
- When streak increases, show a celebratory animation (confetti burst or flame grow)
- Milestone celebrations at 3, 7, 14, 30 days

### 2.4 XP Points System

- Show XP bar in nav area (thin progress bar under the navbar, or a level badge)
- XP actions:
  - +5 XP: Swipe any card (skip or like)
  - +15 XP: Save a course
  - +25 XP: Complete a lesson preview
  - +100 XP: Complete a full lesson (future)
- Level thresholds: Level 1 (0 XP) → Level 2 (100 XP) → Level 3 (300 XP) → Level 4 (600 XP) → etc.
- Show level-up animation when threshold is crossed
- Display format: "⚡ Lvl 3 · 245/600 XP"

### 2.5 Sound Effects (with toggle)

Add subtle, satisfying sound effects:
- **Like swipe**: Short positive "pop" / "ding"
- **Skip swipe**: Soft "whoosh"
- **Save**: Bookmarky "click"
- **XP gain**: Coin-like "tink"
- **Level up**: Celebratory jingle
- **Streak milestone**: Achievement sound

Include a 🔇/🔊 toggle button in the nav. Default to OFF (respect users). Use Web Audio API or short base64-encoded audio for zero-dependency sounds. Keep sounds very short (<0.5s) and subtle.

---

## 🔥 SPRINT 3 — CONTENT & ENGAGEMENT (DO THIS THIRD)

### 3.1 Expand to 30-50 courses
Create a `data/courses.json` file with 30-50 courses across these categories:
- Programmering (Python, JavaScript, React, Node.js, SQL, Git)
- Design (UI/UX, Figma, 3D/Blender, Photoshop)
- AI & Data (Machine Learning, Data Science, ChatGPT)
- Business (Marknadsföring, Entreprenörskap, E-handel)
- Kreativt (Foto, Video, Musik)
- Språk (Engelska, Spanska, Franska)
- Ekonomi (Investering, Budgetering, Krypto)
- Produktivitet (Excel, Notion, Projektledning)
- Hälsa (Mindfulness, Träning, Näringslära)
- Säkerhet (Etisk Hacking, Cybersäkerhet)

Each course should have:
```json
{
  "id": 1,
  "title": "Python för nybörjare",
  "category": "Programmering",
  "emoji": "🐍",
  "level": "Nybörjare",
  "hours": 12,
  "lessons": 8,
  "tags": ["Python", "Kod", "Logik"],
  "color": "#1a2a1a",
  "description": "Lär dig grunderna i Python...",
  "students": 1247,
  "rating": 4.8,
  "preview": {
    "type": "fact",
    "content": "Visste du att Python uppfanns 1991 av Guido van Rossum och namngavs efter Monty Python?"
  }
}
```

### 3.2 Trending & Recommended sections on Home
Replace or supplement the current home page with:
- **"Populärt just nu 🔥"** — horizontal scroll row of 5-6 trending courses
- **"Rekommenderat för dig ✨"** — based on saved courses' categories (if any saved) or random selection
- **"Nya kurser 🆕"** — recently added

Use horizontally scrollable cards with snap scrolling:
```css
.trending-row {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;
}
.trending-row::-webkit-scrollbar { display: none; }
.trending-card { scroll-snap-align: start; flex-shrink: 0; width: 220px; }
```

### 3.3 Mix quiz/fact cards into the swipe feed
Every 4th-5th card in the swipe deck should be a **special card** instead of a course:
- "Visste du att...?" — fun educational fact
- Quick quiz — single question with 4 options, instant feedback
- "Dagens utmaning 🏆" — a challenge prompt

These keep the feed feeling dynamic and varied, just like TikTok mixes content types.

### 3.4 Basic onboarding flow (first visit only)
When `localStorage` has no data (first visit), show a 3-step overlay:
1. **"Välkommen till Brelio! 👋"** — Brief intro
2. **"Välj dina intressen"** — Grid of category chips to select (at least 3)
3. **"Så funkar det"** — Quick visual showing swipe left/right/up gestures

Store completion flag in localStorage. Never show again.

---

## 🔥 SPRINT 4 — POLISH (DO THIS LAST)

### 4.1 Page transition animations
When navigating between pages, add smooth transitions instead of instant `display:none/block`:
- Fade out current page (200ms)
- Fade in new page (300ms)
- Or: slide from the direction of the nav item

### 4.2 Achievement/badge system
Define 10-15 achievements:
- 🏅 "Första Swipe" — Swipe your first card
- 📚 "Bokmal" — Save 5 courses
- 🔥 "Eldsjäl" — 3-day streak
- ⚡ "Blixtsnabb" — Swipe 10 cards in under 60 seconds
- 🦉 "Nattuggle" — Study after 22:00
- 🌅 "Morgonfågel" — Study before 07:00
- 💯 "Hundringen" — Earn 100 XP
- 🎯 "Fokuserad" — Complete 5 lesson previews
- 🌍 "Världsmedborgare" — Save courses from 5+ categories
- 🏆 "Legend" — 30-day streak

Show a celebration popup when unlocked. Store in localStorage.

### 4.3 Improve toast notifications
Replace the current plain toast with:
- Colored accent strip on the left matching the action (teal for like, coral for skip, yellow for save)
- Icon + message
- Slide in from top-right (desktop) or top (mobile)
- Auto-dismiss progress bar (thin line that shrinks over 2.5s)

### 4.4 Spring physics on card snap-back
When a swipe doesn't meet the threshold and the card snaps back, use a spring easing:
```css
transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
```
This gives a satisfying "bounce" effect.

### 4.5 Fix event listener cleanup
In `swipe.js`, properly remove `mousemove` and `mouseup` listeners from `document` when a card is swiped away. Use `AbortController` or named function references.

### 4.6 Social proof on cards
Add to each card in the swipe deck:
- "👥 1,247 studenter" (student count)
- "⭐ 4.8" (rating)
- These create trust and FOMO

---

## 📝 GENERAL CODE STYLE

- Use `const` and `let`, never `var`
- Use arrow functions for callbacks
- Use template literals for HTML strings
- Use semantic HTML5 elements (`<main>`, `<section>`, `<article>`, `<nav>`)
- CSS: Use the existing CSS custom properties (variables). Add new ones to `variables.css` if needed
- Keep functions small and focused (max ~30 lines)
- Comment non-obvious logic
- Use `data-*` attributes for JS hooks instead of classes where possible

---

## ✅ DEFINITION OF DONE

After completing all 4 sprints, the app should:
1. ✅ Have a modular, maintainable file structure
2. ✅ Persist all user data across page refreshes (localStorage)
3. ✅ Feel alive with animations, transitions, and micro-interactions
4. ✅ Have a working dopamine loop: swipe → preview → XP → streak → come back
5. ✅ Work beautifully on mobile (375px) and desktop
6. ✅ Have 30-50 courses with rich metadata
7. ✅ Include streaks, XP, and at least basic achievements
8. ✅ Sound effects with a mute toggle
9. ✅ Onboarding for first-time users
10. ✅ Be something you'd actually want to use
