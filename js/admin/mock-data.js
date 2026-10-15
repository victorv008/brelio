// QuickThinkers adminportal — mockdata.
// Ingen backend. Store.js läser detta som utgångsläge och speglar sedan
// alla ändringar till localStorage så demon överlever omladdning.

(function () {
  'use strict';

  // Deterministisk PRNG — grafer och siffror ser likadana ut vid varje besök.
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  var NOW = new Date('2026-08-01T09:00:00Z');

  function daysAgo(n) {
    return new Date(NOW.getTime() - n * 86400000).toISOString();
  }

  // ---------------------------------------------------------------
  // Kategorier
  // ---------------------------------------------------------------
  var CATEGORIES = [
    { slug: 'design', label: 'Design', emoji: '🎨' },
    { slug: 'kod', label: 'Kod', emoji: '💻' },
    { slug: 'foto', label: 'Foto', emoji: '📷' },
    { slug: 'sprak', label: 'Språk', emoji: '✍️' },
    { slug: 'pengar', label: 'Pengar', emoji: '💰' },
    { slug: 'halsa', label: 'Hälsa', emoji: '🏃' },
    { slug: 'musik', label: 'Musik', emoji: '🎵' },
    { slug: 'karriar', label: 'Karriär', emoji: '🎤' },
  ];

  var LEVELS = ['Nybörjare', 'Medel', 'Avancerad'];

  // ---------------------------------------------------------------
  // Kurser — de åtta från appen plus två utkast
  // ---------------------------------------------------------------
  var COURSES = [
    {
      id: 'c1', title: 'UX för nybörjare',
      description: 'Lär dig grunderna i användarupplevelse och designtänk.',
      why: 'Passar dig som vill börja skapa digitalt',
      category: 'Design', emoji: '🎨', level: 'Nybörjare',
      lessons: 12, minutes: 45, xp: 120,
      glow: '#9A6BFF', poster: 'linear-gradient(150deg,#2a2440,#3c2040)',
      tags: ['ux', 'design', 'grunder'], published: true, sortOrder: 1,
      createdAt: daysAgo(180), updatedAt: daysAgo(4),
      decks: [
        {
          id: 'd1', title: 'Vad är UX?', cards: [
            { id: 'k1', type: 'flashcard', question: 'Vad står UX för?', answer: 'User Experience — hela upplevelsen en person har av en produkt, inte bara hur den ser ut.' },
            { id: 'k2', type: 'flashcard', question: 'Vad skiljer UX från UI?', answer: 'UI är gränssnittet man ser och rör. UX är helheten: flöde, känsla, om målet nås.' },
            { id: 'k3', type: 'quiz', question: 'Vilket är det bästa sättet att veta om en design fungerar?', options: ['Fråga en kollega', 'Testa på riktiga användare', 'Jämföra med konkurrenter', 'Lita på magkänslan'], correctIndex: 1 },
          ],
        },
        {
          id: 'd2', title: 'Användartester', cards: [
            { id: 'k4', type: 'flashcard', question: 'Hur många testpersoner behövs för att hitta de flesta problemen?', answer: 'Ungefär fem. Nielsen visade att fem personer avslöjar runt 85 % av användbarhetsproblemen.' },
            { id: 'k5', type: 'quiz', question: 'Vad bör du undvika när du leder ett användartest?', options: ['Vara tyst', 'Ställa ledande frågor', 'Spela in sessionen', 'Låta personen tänka högt'], correctIndex: 1 },
            { id: 'k6', type: 'flashcard', question: 'Vad betyder "tänka högt"-metoden?', answer: 'Testpersonen berättar vad hen tänker medan hen använder produkten — då hörs tveksamheten, inte bara resultatet.' },
          ],
        },
      ],
    },
    {
      id: 'c2', title: 'Komposition & ljus i foto',
      description: 'Ta bättre bilder med ljus, linjer och komposition.',
      why: 'Passar dig som fotar med mobilen',
      category: 'Foto', emoji: '📷', level: 'Nybörjare',
      lessons: 8, minutes: 32, xp: 90,
      glow: '#2DD4BF', poster: 'linear-gradient(150deg,#1a2a3a,#2a3520)',
      tags: ['foto', 'komposition'], published: true, sortOrder: 2,
      createdAt: daysAgo(165), updatedAt: daysAgo(12),
      decks: [
        {
          id: 'd3', title: 'Komposition', cards: [
            { id: 'k7', type: 'flashcard', question: 'Vad är tredjedelsregeln?', answer: 'Dela bilden i ett 3×3-rutnät och lägg motivet längs linjerna eller i skärningspunkterna — ofta lugnare än mitt i.' },
            { id: 'k8', type: 'quiz', question: 'Vad kallas linjer som drar blicken in i bilden?', options: ['Ledande linjer', 'Horisontlinjer', 'Gyllene linjer', 'Brytlinjer'], correctIndex: 0 },
            { id: 'k9', type: 'flashcard', question: 'Varför fungerar negativt utrymme?', answer: 'Tomrum runt motivet ger det plats att andas och gör att blicken inte konkurrerar med bakgrunden.' },
          ],
        },
        {
          id: 'd4', title: 'Ljus', cards: [
            { id: 'k10', type: 'flashcard', question: 'Vad är den gyllene timmen?', answer: 'Timmen efter soluppgång och före solnedgång. Ljuset är varmt, mjukt och kommer från sidan.' },
            { id: 'k11', type: 'quiz', question: 'Vilket ljus ger mjukast skuggor?', options: ['Middagssol', 'Blixt rakt framifrån', 'Mulet väder', 'Punktbelysning'], correctIndex: 2 },
          ],
        },
      ],
    },
    {
      id: 'c3', title: 'Bygg din första app',
      description: 'Bygg och publicera en riktig app, steg för steg.',
      why: 'Passar dig som vill skapa på riktigt',
      category: 'Kod', emoji: '💻', level: 'Medel',
      lessons: 14, minutes: 60, xp: 180,
      glow: '#6E7BFF', poster: 'linear-gradient(150deg,#0f1a2e,#1a1428)',
      tags: ['kod', 'app', 'projekt'], published: true, sortOrder: 3,
      createdAt: daysAgo(150), updatedAt: daysAgo(2),
      decks: [
        {
          id: 'd5', title: 'Kom igång', cards: [
            { id: 'k12', type: 'flashcard', question: 'Vad är skillnaden mellan frontend och backend?', answer: 'Frontend är det användaren ser och klickar på. Backend är servern som lagrar data och kör logiken.' },
            { id: 'k13', type: 'quiz', question: 'Vad används ett versionshanteringssystem som Git till?', options: ['Snabba upp koden', 'Spåra ändringar över tid', 'Hosta webbsidor', 'Testa appen'], correctIndex: 1 },
            { id: 'k14', type: 'flashcard', question: 'Vad är ett API?', answer: 'Ett avtalat sätt för två program att prata med varandra — du skickar en förfrågan och får ett svar i känt format.' },
          ],
        },
        {
          id: 'd6', title: 'Publicera', cards: [
            { id: 'k15', type: 'flashcard', question: 'Vad betyder "deploy"?', answer: 'Att flytta koden från din dator till en server där andra kan nå den.' },
            { id: 'k16', type: 'quiz', question: 'Vad bör du aldrig lägga i publik källkod?', options: ['Kommentarer', 'API-nycklar', 'Bilder', 'Tester'], correctIndex: 1 },
          ],
        },
      ],
    },
    {
      id: 'c4', title: 'Skriv som ett proffs',
      description: 'Skriv tydligare texter som folk faktiskt läser.',
      why: 'Passar dig som skriver varje dag',
      category: 'Språk', emoji: '✍️', level: 'Nybörjare',
      lessons: 10, minutes: 38, xp: 110,
      glow: '#9A6BFF', poster: 'linear-gradient(150deg,#2a1a2e,#1a2a2a)',
      tags: ['skrivande', 'text'], published: true, sortOrder: 4,
      createdAt: daysAgo(140), updatedAt: daysAgo(20),
      decks: [
        {
          id: 'd7', title: 'Tydlighet', cards: [
            { id: 'k17', type: 'flashcard', question: 'Vad är den vanligaste orsaken till otydlig text?', answer: 'Att skribenten skriver för sig själv i stället för för läsaren — meningarna följer tanken, inte behovet.' },
            { id: 'k18', type: 'quiz', question: 'Vilken meningslängd är oftast lättast att läsa?', options: ['5 ord', '15–20 ord', '35 ord', 'Så lång som möjligt'], correctIndex: 1 },
            { id: 'k19', type: 'flashcard', question: 'Vad menas med aktiv form?', answer: '"Vi ändrade beslutet" i stället för "beslutet ändrades". Aktiv form säger vem som gör vad.' },
          ],
        },
      ],
    },
    {
      id: 'c5', title: 'Grunderna i ekonomi',
      description: 'Förstå sparande, ränta och budget utan krångel.',
      why: 'Passar dig som vill få koll på pengarna',
      category: 'Pengar', emoji: '💰', level: 'Nybörjare',
      lessons: 9, minutes: 40, xp: 130,
      glow: '#FFB23E', poster: 'linear-gradient(150deg,#2a2010,#1a1a10)',
      tags: ['ekonomi', 'sparande'], published: true, sortOrder: 5,
      createdAt: daysAgo(120), updatedAt: daysAgo(7),
      decks: [
        {
          id: 'd8', title: 'Ränta', cards: [
            { id: 'k20', type: 'flashcard', question: 'Vad är ränta-på-ränta?', answer: 'Avkastningen börjar själv ge avkastning. Därför växer sparande allt snabbare ju längre det får ligga.' },
            { id: 'k21', type: 'quiz', question: 'Ungefär hur många år tar det att fördubbla pengarna vid 7 % årlig avkastning?', options: ['5 år', '10 år', '20 år', '30 år'], correctIndex: 1 },
            { id: 'k22', type: 'flashcard', question: 'Vad är inflation?', answer: 'Att pengar tappar köpkraft över tid — samma hundralapp köper mindre nästa år.' },
          ],
        },
        {
          id: 'd9', title: 'Budget', cards: [
            { id: 'k23', type: 'quiz', question: 'Vad brukar 50/30/20-regeln fördela?', options: ['Lån, sparande, aktier', 'Behov, önskemål, sparande', 'Mat, hyra, nöje', 'Skatt, lön, pension'], correctIndex: 1 },
            { id: 'k24', type: 'flashcard', question: 'Hur stor buffert brukar rekommenderas?', answer: 'Två till tre månadsutgifter på ett konto du kommer åt direkt.' },
          ],
        },
      ],
    },
    {
      id: 'c6', title: 'Träna smartare, inte hårdare',
      description: 'Få ut mer av din träning med mindre tid.',
      why: 'Passar dig med fullt schema',
      category: 'Hälsa', emoji: '🏃', level: 'Nybörjare',
      lessons: 7, minutes: 28, xp: 80,
      glow: '#2DD4BF', poster: 'linear-gradient(150deg,#0f2a1a,#1a2a10)',
      tags: ['träning', 'hälsa'], published: true, sortOrder: 6,
      createdAt: daysAgo(110), updatedAt: daysAgo(30),
      decks: [
        {
          id: 'd10', title: 'Återhämtning', cards: [
            { id: 'k25', type: 'flashcard', question: 'När byggs muskeln?', answer: 'Under vilan, inte under passet. Träningen är stimulansen — sömnen gör jobbet.' },
            { id: 'k26', type: 'quiz', question: 'Hur mycket sömn brukar rekommenderas för den som tränar regelbundet?', options: ['4–5 timmar', '6 timmar', '7–9 timmar', '10–12 timmar'], correctIndex: 2 },
          ],
        },
      ],
    },
    {
      id: 'c7', title: 'Musikteori på 30 minuter',
      description: 'Ackord, skalor och rytm — snabbt och praktiskt.',
      why: 'Passar dig som spelar på gehör',
      category: 'Musik', emoji: '🎵', level: 'Medel',
      lessons: 6, minutes: 30, xp: 75,
      glow: '#FF4E42', poster: 'linear-gradient(150deg,#2a1028,#1a0a18)',
      tags: ['musik', 'teori'], published: true, sortOrder: 7,
      createdAt: daysAgo(95), updatedAt: daysAgo(45),
      decks: [
        {
          id: 'd11', title: 'Ackord', cards: [
            { id: 'k27', type: 'flashcard', question: 'Vilka toner bygger ett durackord?', answer: 'Grundton, stor ters och kvint — till exempel C, E och G i ett C-durackord.' },
            { id: 'k28', type: 'quiz', question: 'Vad skiljer moll från dur?', options: ['Kvinten sänks', 'Tersen sänks ett halvt steg', 'Grundtonen höjs', 'Inget, bara tempot'], correctIndex: 1 },
          ],
        },
      ],
    },
    {
      id: 'c8', title: 'Tala inför publik',
      description: 'Våga ta ordet och håll presentationer med lugn.',
      why: 'Passar dig som vill växa i jobbet',
      category: 'Karriär', emoji: '🎤', level: 'Medel',
      lessons: 11, minutes: 42, xp: 140,
      glow: '#FF9233', poster: 'linear-gradient(150deg,#1a1020,#2a1818)',
      tags: ['presentation', 'karriär'], published: true, sortOrder: 8,
      createdAt: daysAgo(80), updatedAt: daysAgo(9),
      decks: [
        {
          id: 'd12', title: 'Nervositet', cards: [
            { id: 'k29', type: 'flashcard', question: 'Varför blir vi nervösa av att tala inför folk?', answer: 'Kroppen tolkar många blickar som hot och startar stresspåslag. Det är fysiologi, inte ett tecken på att du är dålig.' },
            { id: 'k30', type: 'quiz', question: 'Vad hjälper mest mot nervositet precis innan du ska tala?', options: ['Läsa manus en sista gång', 'Långsam utandning', 'Dricka kaffe', 'Undvika publiken'], correctIndex: 1 },
            { id: 'k31', type: 'flashcard', question: 'Vad är den starkaste öppningen?', answer: 'Något konkret — en scen, en siffra, en fråga. Inte en presentation av dig själv.' },
          ],
        },
      ],
    },
    {
      id: 'c9', title: 'Förhandla lön',
      description: 'Förbered dig, sätt ditt pris och håll det.',
      why: 'Passar dig inför lönesamtalet',
      category: 'Karriär', emoji: '🤝', level: 'Avancerad',
      lessons: 8, minutes: 35, xp: 150,
      glow: '#FF9233', poster: 'linear-gradient(150deg,#241423,#2e1a12)',
      tags: ['lön', 'förhandling', 'karriär'], published: false, sortOrder: 9,
      createdAt: daysAgo(14), updatedAt: daysAgo(1),
      decks: [
        {
          id: 'd13', title: 'Förberedelse', cards: [
            { id: 'k32', type: 'flashcard', question: 'Vad bör du ta reda på innan samtalet?', answer: 'Marknadslönen för din roll, din egen leverans i siffror, och vad du minst accepterar.' },
            { id: 'k33', type: 'quiz', question: 'Vem bör helst nämna en siffra först?', options: ['Alltid du', 'Alltid chefen', 'Den som är bäst förberedd', 'Ingen'], correctIndex: 2 },
          ],
        },
      ],
    },
    {
      id: 'c10', title: 'AI i vardagen',
      description: 'Använd AI-verktyg utan att tappa omdömet.',
      why: 'Passar dig som vill jobba snabbare',
      category: 'Kod', emoji: '🤖', level: 'Nybörjare',
      lessons: 9, minutes: 36, xp: 125,
      glow: '#6E7BFF', poster: 'linear-gradient(150deg,#101a2e,#1c1430)',
      tags: ['ai', 'verktyg'], published: false, sortOrder: 10,
      createdAt: daysAgo(6), updatedAt: daysAgo(6),
      decks: [],
    },
  ];

  // ---------------------------------------------------------------
  // Användare
  // ---------------------------------------------------------------
  var NAMES = [
    'Elsa Lindqvist', 'Oskar Bergström', 'Maja Nilsson', 'Hugo Karlsson',
    'Alva Persson', 'William Sandberg', 'Ebba Holm', 'Liam Åkesson',
    'Astrid Wallin', 'Noah Ekström', 'Saga Lundgren', 'Elias Forsberg',
    'Wilma Dahl', 'Lucas Hedman', 'Nora Sjöberg', 'Adam Isaksson',
    'Ines Blomqvist', 'Theo Norberg', 'Vera Sundström', 'Melvin Ahlberg',
    'Signe Hammar', 'Arvid Löfgren', 'Tuva Engström', 'Malte Rydberg',
    'Ellen Björk', 'Viggo Strand', 'Iris Palm', 'Sixten Falk',
  ];

  var AVATAR_COLORS = ['#FF4E42', '#7C6BFF', '#FFB23E', '#2DD4BF', '#9A6BFF', '#6E7BFF', '#FF9233'];

  function slugName(name) {
    return name.toLowerCase()
      .replace(/å|ä/g, 'a').replace(/ö/g, 'o')
      .replace(/é/g, 'e')
      .replace(/\s+/g, '.');
  }

  var rand = rng(20260801);

  var USERS = NAMES.map(function (name, i) {
    var role = i < 2 ? 'admin' : (rand() < 0.28 ? 'premium' : 'user');
    var banned = i === 11 || i === 22;
    var joined = Math.floor(rand() * 300) + 5;
    var last = banned ? Math.floor(rand() * 60) + 20 : Math.floor(rand() * 14);
    var xp = Math.floor(rand() * 4200) + 40;

    // Progress mot ett urval publicerade kurser
    var progress = [];
    var pool = COURSES.filter(function (c) { return c.published; });
    var count = Math.floor(rand() * 5) + 1;
    var used = {};
    for (var p = 0; p < count; p++) {
      var pick = pool[Math.floor(rand() * pool.length)];
      if (used[pick.id]) continue;
      used[pick.id] = true;
      progress.push({ courseId: pick.id, percent: Math.floor(rand() * 101) });
    }

    return {
      id: 'u' + (i + 1),
      name: name,
      email: slugName(name) + '@' + (rand() < 0.5 ? 'gmail.com' : 'outlook.com'),
      avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
      role: role,
      status: banned ? 'banned' : 'active',
      joinedAt: daysAgo(joined),
      lastActiveAt: daysAgo(last),
      xp: xp,
      streak: banned ? 0 : Math.floor(rand() * 24),
      progress: progress,
    };
  });

  // ---------------------------------------------------------------
  // Analytics — 30 dagars tidsserier
  // ---------------------------------------------------------------
  var ar = rng(770231);

  var dailyActive = [];
  var signups = [];
  var base = 340;
  for (var d = 29; d >= 0; d--) {
    var weekday = new Date(NOW.getTime() - d * 86400000).getUTCDay();
    var weekendDip = (weekday === 0 || weekday === 6) ? 0.78 : 1;
    base += (ar() - 0.42) * 18;
    dailyActive.push({
      date: daysAgo(d).slice(0, 10),
      value: Math.max(120, Math.round(base * weekendDip)),
    });
    signups.push({
      date: daysAgo(d).slice(0, 10),
      value: Math.round((ar() * 22 + 6) * weekendDip),
    });
  }

  var ANALYTICS = {
    dailyActive: dailyActive,
    signups: signups,
    // Per-kurs — genereras mot publicerade kurser
    courseStats: COURSES.filter(function (c) { return c.published; }).map(function (c) {
      var starts = Math.round(ar() * 900 + 220);
      var completions = Math.round(starts * (ar() * 0.45 + 0.18));
      return {
        courseId: c.id,
        starts: starts,
        completions: completions,
        avgMinutes: Math.round(c.minutes * (0.55 + ar() * 0.5)),
        swipes: Math.round(starts * (ar() * 9 + 6)),
        rating: Math.round((3.6 + ar() * 1.3) * 10) / 10,
      };
    }),
  };

  window.QT_MOCK = {
    categories: CATEGORIES,
    levels: LEVELS,
    courses: COURSES,
    users: USERS,
    analytics: ANALYTICS,
    generatedAt: NOW.toISOString(),
  };
})();
