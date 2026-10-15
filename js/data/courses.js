// Tillfällig demodata — ersätts av kurser från Supabase i Fas 3.
export const COURSES = [
  { id: 1, level: 'Nybörjare', desc: 'Lär dig grunderna i användarupplevelse och designtänk.', why: 'Passar dig som vill börja skapa digitalt', title: 'UX för nybörjare', category: 'Design', emoji: '🎨', lessons: 12, minutes: 45, xp: 120, glow: '#9A6BFF', poster: 'linear-gradient(150deg,#2a2440,#3c2040)' },
  { id: 2, level: 'Nybörjare', desc: 'Ta bättre bilder med ljus, linjer och komposition.', why: 'Passar dig som fotar med mobilen', title: 'Komposition & ljus i foto', category: 'Foto', emoji: '📷', lessons: 8, minutes: 32, xp: 90, glow: '#2DD4BF', poster: 'linear-gradient(150deg,#1a2a3a,#2a3520)' },
  { id: 3, level: 'Medel', desc: 'Bygg och publicera en riktig app, steg för steg.', why: 'Passar dig som vill skapa på riktigt', title: 'Bygg din första app', category: 'Kod', emoji: '💻', lessons: 14, minutes: 60, xp: 180, glow: '#6E7BFF', poster: 'linear-gradient(150deg,#0f1a2e,#1a1428)' },
  { id: 4, level: 'Nybörjare', desc: 'Skriv tydligare texter som folk faktiskt läser.', why: 'Passar dig som skriver varje dag', title: 'Skriv som ett proffs', category: 'Språk', emoji: '✍️', lessons: 10, minutes: 38, xp: 110, glow: '#9A6BFF', poster: 'linear-gradient(150deg,#2a1a2e,#1a2a2a)' },
  { id: 5, level: 'Nybörjare', desc: 'Förstå sparande, ränta och budget utan krångel.', why: 'Passar dig som vill få koll på pengarna', title: 'Grunderna i ekonomi', category: 'Pengar', emoji: '💰', lessons: 9, minutes: 40, xp: 130, glow: '#FFB23E', poster: 'linear-gradient(150deg,#2a2010,#1a1a10)' },
  { id: 6, level: 'Nybörjare', desc: 'Få ut mer av din träning med mindre tid.', why: 'Passar dig med fullt schema', title: 'Träna smartare, inte hårdare', category: 'Hälsa', emoji: '🏃', lessons: 7, minutes: 28, xp: 80, glow: '#2DD4BF', poster: 'linear-gradient(150deg,#0f2a1a,#1a2a10)' },
  { id: 7, level: 'Medel', desc: 'Ackord, skalor och rytm — snabbt och praktiskt.', why: 'Passar dig som spelar på gehör', title: 'Musikteori på 30 minuter', category: 'Musik', emoji: '🎵', lessons: 6, minutes: 30, xp: 75, glow: '#FF4E42', poster: 'linear-gradient(150deg,#2a1028,#1a0a18)' },
  { id: 8, level: 'Medel', desc: 'Våga ta ordet och håll presentationer med lugn.', why: 'Passar dig som vill växa i jobbet', title: 'Tala inför publik', category: 'Karriär', emoji: '🎤', lessons: 11, minutes: 42, xp: 140, glow: '#FF9233', poster: 'linear-gradient(150deg,#1a1020,#2a1818)' },
];

export const CATEGORIES = [
  { label: 'Design', emoji: '🎨' }, { label: 'Kod', emoji: '💻' }, { label: 'Foto', emoji: '📷' },
  { label: 'Språk', emoji: '✍️' }, { label: 'Pengar', emoji: '💰' }, { label: 'Hälsa', emoji: '🏃' },
  { label: 'Musik', emoji: '🎵' }, { label: 'Karriär', emoji: '🎤' },
];

// Lesson template for the course reader (durations in min).
export const LESSON_TEMPLATE = [
  { t: 'Introduktion', m: 4 }, { t: 'Grunderna', m: 7 }, { t: 'Verktygen du behöver', m: 6 },
  { t: 'Praktisk övning', m: 9 }, { t: 'Vanliga misstag', m: 5 }, { t: 'Avslutande projekt', m: 12 },
];

// Dagens quiz — 3 frågor, +25 XP per rätt svar.
export const DAILY_QUIZ = [
  { q: 'Vad står "UX" för?', options: ['User Experience', 'Universal Export', 'Unified Syntax', 'User Extension'], a: 0 },
  { q: 'Ungefär hur stor del av jordens yta täcks av vatten?', options: ['50 %', '60 %', '70 %', '85 %'], a: 2 },
  { q: 'Vilket år landade människan första gången på månen?', options: ['1965', '1969', '1972', '1975'], a: 1 },
];
