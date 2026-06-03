import { addXP } from './xp.js';
import { Sounds } from './sounds.js';
import { showToast } from './ui.js';

const QUESTIONS = [
  {
    category: 'Programmering',
    question: 'Vilket år skapades programmeringsspråket Python av Guido van Rossum?',
    options: ['1985', '1991', '1999', '2003'],
    correct: 1,
    explanation: 'Python skapades 1991 och namngavs efter humorgruppen Monty Python — inte ormen! 🐍'
  },
  {
    category: 'AI & Data',
    question: 'Vilket företag skapade och lanserade ChatGPT 2022?',
    options: ['Google', 'Meta', 'Microsoft', 'OpenAI'],
    correct: 3,
    explanation: 'OpenAI lanserade ChatGPT i november 2022. Det nådde 100 miljoner användare på bara 2 månader — rekord!'
  },
  {
    category: 'Design',
    question: 'Vilken färgmodell används på digitala skärmar?',
    options: ['CMYK', 'Pantone', 'RGB', 'HSL'],
    correct: 2,
    explanation: 'RGB (Röd, Grön, Blå) används för skärmar som skapar färg med ljus. CMYK används för trycksaker.'
  },
  {
    category: 'Webb',
    question: 'Vilket programmeringsspråk skapades av Brendan Eich på bara 10 dagar år 1995?',
    options: ['Java', 'PHP', 'TypeScript', 'JavaScript'],
    correct: 3,
    explanation: '10 dagar — och idag är JavaScript ett av världens mest använda programmeringsspråk. Inte illa!'
  },
  {
    category: 'Säkerhet',
    question: 'Vad kallas det när en angripare utger sig för att vara en pålitlig källa för att stjäla din information?',
    options: ['Hacking', 'Malware', 'Phishing', 'Ransomware'],
    correct: 2,
    explanation: 'Phishing är ett av de vanligaste cyberhoten. Angriparen skickar falska mejl/SMS som ser legitima ut.'
  },
  {
    category: 'Produktivitet',
    question: 'Vad innebär Pareto-principen, ofta kallad 80/20-regeln?',
    options: [
      'Spara 80% av lönen, använd 20%',
      '80% av resultaten kommer från 20% av insatserna',
      'Jobba 80% av veckan, vila 20%',
      '80% av arbetet tar 20% av budgeten'
    ],
    correct: 1,
    explanation: 'Fokusera på de 20% av uppgifterna som ger 80% av resultaten — det är smart produktivitet!'
  },
  {
    category: 'Ekonomi',
    question: 'Vad är "ränta på ränta" (compound interest)?',
    options: [
      'En extra bankavgift',
      'Ränta som beräknas på den ursprungliga summan',
      'Ränta som beräknas på både kapital och tidigare ränta',
      'En statlig skatteavdrag'
    ],
    correct: 2,
    explanation: 'Albert Einstein ska ha kallat det "världens åttonde underverk". Ränta på ränta gör att pengar växer exponentiellt!'
  },
  {
    category: 'AI & Data',
    question: 'Vad är en "neural network" (neuralt nätverk) inspirerat av?',
    options: ['Internet-arkitektur', 'Den mänskliga hjärnan', 'Matematiska matriser', 'Datorprocessorer'],
    correct: 1,
    explanation: 'Neurala nätverk härmade hur nervceller i hjärnan kommunicerar via synapser — därav namnet!'
  },
  {
    category: 'Business',
    question: 'Vad är "ROI" en förkortning av inom affärsvärlden?',
    options: ['Rate of Income', 'Revenue over Income', 'Return on Investment', 'Risk of Implementation'],
    correct: 2,
    explanation: 'Return on Investment mäter lönsamheten. ROI = (Vinst / Kostnad) × 100%. Grunden för alla affärsbeslut!'
  },
  {
    category: 'Programmering',
    question: 'Hur många bytes är en kilobyte (KB)?',
    options: ['512', '1 000', '1 024', '2 048'],
    correct: 2,
    explanation: 'En kilobyte är 1 024 bytes (2¹⁰), inte 1 000. Datorer arbetar i binära (bas-2) system — varför vi aldrig får exakt vad vi betalar för!'
  },
  {
    category: 'Design',
    question: 'Vilket verktyg har blivit branschstandard för UI/UX-design av appar?',
    options: ['Photoshop', 'Illustrator', 'Sketch', 'Figma'],
    correct: 3,
    explanation: 'Figma dominerar idag tack vare realtidssamarbete direkt i webbläsaren — ingen installation krävs!'
  },
  {
    category: 'Webb',
    question: 'Vad används Git primärt för?',
    options: ['Webbhosting', 'Versionshantering av kod', 'Driftsättning av appar', 'Bildoptimering'],
    correct: 1,
    explanation: 'Git låter utvecklare spåra ändringar och samarbeta utan att skriva över varandras kod. Linus Torvalds skapade det 2005!'
  },
  {
    category: 'Business',
    question: 'Vad skiljer ett "B2B"-företag från ett "B2C"-företag?',
    options: [
      'B2B är digitalt, B2C är fysiskt',
      'B2B säljer till företag, B2C säljer till konsumenter',
      'B2B är billigare, B2C är dyrare',
      'B2B har fler anställda'
    ],
    correct: 1,
    explanation: 'B2B = Business to Business (t.ex. Salesforce). B2C = Business to Consumer (t.ex. Spotify). Helt olika strategier!'
  },
  {
    category: 'AI & Data',
    question: 'Vad är Python vanligast använt för inom datavetenskap?',
    options: ['Mobilappar', 'Speldesign', 'Dataanalys och maskininlärning', 'Operativsystem'],
    correct: 2,
    explanation: 'Python dominerar data science tack vare bibliotek som Pandas, NumPy och TensorFlow. Enkelt att lära, kraftfullt att använda!'
  },
  {
    category: 'Programmering',
    question: 'Vad gör en "for loop" i programmering?',
    options: [
      'Lagrar data i minnet',
      'Fattar beslut baserat på villkor',
      'Upprepar en sekvens av instruktioner',
      'Skickar data till en server'
    ],
    correct: 2,
    explanation: 'En loop upprepar kod ett bestämt antal gånger — perfekt för att bearbeta listor eller automatisera repetitiva uppgifter.'
  },
  {
    category: 'Säkerhet',
    question: 'Vilket av dessa är ett starkt lösenord?',
    options: [
      '"password123"',
      '"Anna1990"',
      '"HusKattBilRegn2024!"',
      '"qwerty"'
    ],
    correct: 2,
    explanation: 'Längd + komplexitet = styrka! En lösenfras med blandade ord, siffror och symboler är svår att knäcka och lätt att minnas.'
  },
  {
    category: 'Produktivitet',
    question: 'Hur lång tid tar det i snitt att bygga en ny vana enligt forskning?',
    options: ['21 dagar', '30 dagar', '66 dagar', '90 dagar'],
    correct: 2,
    explanation: 'Myten om 21 dagar stämmer inte! Forskning från UCL visar att det i snitt tar 66 dagar — var tålmodig med dig själv!'
  },
  {
    category: 'Design',
    question: 'Vad är "whitespace" (negativt utrymme) i design?',
    options: [
      'En bugg som visas som vitt',
      'Tomt utrymme runt och mellan element',
      'Bakgrundsfärgen på en webbsida',
      'Ett verktyg i Figma'
    ],
    correct: 1,
    explanation: 'Whitespace är inte "bortkastat" utrymme — det förbättrar läsbarhet, fokus och ger designen luft. Mindre är mer!'
  },
  {
    category: 'Ekonomi',
    question: 'Vad är en "ETF" (Exchange Traded Fund)?',
    options: [
      'En typ av kryptovaluta',
      'En valutaväxlingstjänst',
      'En fond som handlas på börsen som en aktie',
      'Ett lån med rörlig ränta'
    ],
    correct: 2,
    explanation: 'ETF:er ger dig exponering mot hundratals aktier på en gång, till låga avgifter. Perfekt för nybörjarinvesterare!'
  },
  {
    category: 'AI & Data',
    question: 'Vad kallas fenomenet när en AI-modell hittar mönster i träningsdata som inte stämmer i verkligheten?',
    options: ['Bias', 'Overfitting', 'Underfitting', 'Data drift'],
    correct: 1,
    explanation: 'Overfitting innebär att modellen "pluggat" träningsdatan för bra men presterar dåligt på ny data — som att memorera svar utan att förstå!'
  }
];

const QUIZ_LENGTH = 10;

let sessionQ   = [];
let currentIdx = 0;
let score      = 0;
let combo      = 0;
let earnedXP   = 0;
let answered   = false;

// ─── Public API ────────────────────────────────────────────────────────────

export function initQuiz() {
  document.getElementById('quiz-start-btn')?.addEventListener('click',  startQuiz);
  document.getElementById('quiz-close-start')?.addEventListener('click', closeQuiz);
  document.getElementById('quiz-close-q')?.addEventListener('click',    closeQuiz);
  document.getElementById('quiz-next-btn')?.addEventListener('click',   nextQuestion);
  document.getElementById('quiz-retry-btn')?.addEventListener('click',  startQuiz);
  document.getElementById('quiz-done-btn')?.addEventListener('click',   closeQuiz);
  document.getElementById('quiz-banner')?.addEventListener('click',     openQuiz);
}

export function openQuiz() {
  const overlay = document.getElementById('quiz-overlay');
  if (!overlay) return;
  showScreen('start');
  overlay.classList.add('open');
}

function closeQuiz() {
  document.getElementById('quiz-overlay')?.classList.remove('open');
}

// ─── Quiz flow ─────────────────────────────────────────────────────────────

function startQuiz() {
  sessionQ   = shuffle([...QUESTIONS]).slice(0, QUIZ_LENGTH);
  currentIdx = 0;
  score      = 0;
  combo      = 0;
  earnedXP   = 0;
  answered   = false;

  showScreen('question');
  renderQuestion();
}

function nextQuestion() {
  currentIdx++;
  if (currentIdx >= QUIZ_LENGTH) {
    showResult();
  } else {
    const body = document.getElementById('quiz-body');
    body?.classList.remove('slide-in');
    void body?.offsetWidth;
    body?.classList.add('slide-in');
    renderQuestion();
  }
}

// ─── Rendering ─────────────────────────────────────────────────────────────

function renderQuestion() {
  answered = false;
  const q = sessionQ[currentIdx];

  document.getElementById('quiz-progress-text').textContent = `Fråga ${currentIdx + 1} av ${QUIZ_LENGTH}`;
  document.getElementById('quiz-xp-counter').textContent    = `⚡ ${earnedXP} XP`;
  document.getElementById('quiz-progress-fill').style.width = `${(currentIdx / QUIZ_LENGTH) * 100}%`;

  const comboEl = document.getElementById('quiz-combo');
  if (combo >= 2) {
    const mul = combo >= 3 ? '2x' : '1.5x';
    comboEl.innerHTML = `🔥 ${combo} i rad &nbsp;·&nbsp; ${mul} XP`;
    comboEl.classList.add('visible');
  } else {
    comboEl.classList.remove('visible');
  }

  document.getElementById('quiz-cat-chip').textContent = q.category;
  document.getElementById('quiz-q-text').textContent   = q.question;

  const letters = ['A', 'B', 'C', 'D'];
  document.getElementById('quiz-options-wrap').innerHTML = q.options.map((opt, i) => `
    <button class="quiz-opt-btn" data-index="${i}">
      <span class="quiz-opt-letter">${letters[i]}</span>
      <span class="quiz-opt-text">${opt}</span>
    </button>`).join('');

  document.querySelectorAll('.quiz-opt-btn').forEach(btn =>
    btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.index)))
  );

  const expEl = document.getElementById('quiz-explanation');
  expEl.textContent = '';
  expEl.classList.remove('visible');

  const nextWrap = document.getElementById('quiz-next-wrap');
  nextWrap.classList.remove('visible');
  document.getElementById('quiz-next-btn').textContent =
    currentIdx === QUIZ_LENGTH - 1 ? 'Se resultat 🏆' : 'Nästa fråga →';
}

function selectAnswer(chosen) {
  if (answered) return;
  answered = true;

  const q       = sessionQ[currentIdx];
  const correct = q.correct;
  const btns    = document.querySelectorAll('.quiz-opt-btn');

  btns.forEach(b => { b.disabled = true; });
  btns[correct].classList.add('correct');

  if (chosen === correct) {
    combo++;
    score++;
    const multiplier = combo >= 3 ? 2 : combo >= 2 ? 1.5 : 1;
    const gain = Math.round(10 * multiplier);
    grantXP(gain);
    floatXP(`+${gain} XP${multiplier > 1 ? ' 🔥' : ''}`, btns[correct]);
    Sounds.play('like');
  } else {
    btns[chosen].classList.add('wrong');
    combo = 0;
    grantXP(3);
    Sounds.play('nope');
  }

  if (q.explanation) {
    const expEl = document.getElementById('quiz-explanation');
    expEl.textContent = q.explanation;
    setTimeout(() => expEl.classList.add('visible'), 120);
  }

  setTimeout(() => {
    document.getElementById('quiz-next-wrap').classList.add('visible');
  }, 600);
}

// ─── Result ────────────────────────────────────────────────────────────────

function showResult() {
  const bonus = score === QUIZ_LENGTH ? 50 : 0;
  earnedXP += bonus;
  addXP(earnedXP);

  showScreen('result');

  const pct  = score / QUIZ_LENGTH;
  const tier = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0;

  const emojis   = ['😅', '💪', '🎉', '🏆'];
  const messages = ['Fortsätt öva!', 'Bra jobbat!', 'Imponerande!', 'Perfekt! Geni!'];
  const stars    = tier + 1 > 3 ? 3 : tier + 1;

  document.getElementById('quiz-result-stars').innerHTML =
    '⭐'.repeat(stars) + '<span style="opacity:0.25">⭐</span>'.repeat(3 - stars);
  document.getElementById('quiz-result-emoji').textContent    = emojis[tier];
  document.getElementById('quiz-result-title').textContent    = messages[tier];
  document.getElementById('quiz-result-score').textContent    = `${score} av ${QUIZ_LENGTH} rätt`;

  const xpEl = document.getElementById('quiz-result-xp-num');
  countUp(xpEl, earnedXP, 1000);

  if (bonus) {
    document.getElementById('quiz-bonus-badge').textContent = `+${bonus} bonus!`;
    document.getElementById('quiz-bonus-badge').style.display = 'inline-block';
  } else {
    document.getElementById('quiz-bonus-badge').style.display = 'none';
  }

  if (pct >= 0.6) spawnConfetti();
  Sounds.play(pct >= 0.8 ? 'levelup' : 'save');
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function showScreen(name) {
  document.getElementById('quiz-start').style.display    = name === 'start'    ? 'flex' : 'none';
  document.getElementById('quiz-question-wrap').style.display = name === 'question' ? 'flex' : 'none';
  document.getElementById('quiz-result').style.display  = name === 'result'   ? 'flex' : 'none';
}

function grantXP(amount) {
  earnedXP += amount;
  const el = document.getElementById('quiz-xp-counter');
  if (!el) return;
  el.textContent = `⚡ ${earnedXP} XP`;
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

function floatXP(text, anchor) {
  const el = document.createElement('div');
  el.className = 'quiz-xp-float';
  el.textContent = text;
  anchor.style.position = 'relative';
  anchor.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

function countUp(el, target, duration) {
  const step = target / (duration / 16);
  let current = 0;
  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current);
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function spawnConfetti() {
  const container = document.getElementById('quiz-result');
  const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a29bfe', '#fd79a8', '#00b894'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${4 + Math.random() * 8}px;
      height: ${4 + Math.random() * 8}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.8}s;
      animation-duration: ${1.5 + Math.random() * 1}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 2800);
  }
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
