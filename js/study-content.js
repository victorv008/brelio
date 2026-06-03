export const STUDY_CONTENT = {

  // ── Python för nybörjare ──────────────────────────────────────────────
  1: {
    cards: [
      {
        title: 'Vad är Python och varför lära sig det?',
        body: 'Python är ett av världens mest populära programmeringsspråk — och av goda skäl. Det skapades 1991 av Guido van Rossum med ett tydligt mål: kod ska vara så läsbar som engelska prosa.\n\nIdag används Python för AI, maskininlärning, webbsidor, dataanalys och automatisering. Företag som Google, Netflix och NASA använder Python dagligen i sin kärna.\n\nDet är ofta det första språket nybörjare lär sig eftersom syntaxen är ren och logisk — du skriver nästan vad du tänker.',
        insight: 'Python uppfanns 1991 men fick sitt namn från humorgruppen Monty Python, inte från ormen. Guido van Rossum ville att språket skulle vara roligt att använda.'
      },
      {
        title: 'Variabler och datatyper — grunden i allt',
        body: 'En variabel är som en låda med en etikett — du lägger in ett värde och hämtar det senare. I Python är syntaxen enkel:\n\n```python\nålder = 25\nnamn = "Anna"\naktiv = True\npris = 99.90\n```\n\nPython har fyra grundläggande datatyper:\n• int — heltal (5, -3, 1000)\n• float — decimaltal (3.14, -0.5)\n• str — text ("Hej världen")\n• bool — sant/falskt (True, False)\n\nDet smarta: du behöver aldrig ange typen. Python räknar ut det automatiskt — det kallas dynamisk typning.',
        insight: 'Skriv type(variabel) i Python-konsolen för att se vilken typ en variabel har. Prova gärna!'
      },
      {
        title: 'Listor och ordböcker — att organisera data',
        body: 'En lista är en samling värden i ordning:\n\n```python\nfrukter = ["äpple", "banan", "apelsin"]\nprint(frukter[0])  # → "äpple" (index börjar på 0!)\n```\n\nEn ordbok kopplar nycklar till värden — som ett uppslagsverk:\n\n```python\nperson = {"namn": "Anna", "ålder": 28}\nprint(person["namn"])  # → "Anna"\n```\n\nListor är perfekta när ordning spelar roll. Ordböcker är perfekta när du söker på ett namn istället för ett nummer.',
        insight: 'Listor och ordböcker är de datastrukturer du kommer använda mest. 80% av all datahantering sker med dessa två.'
      },
      {
        title: 'Kontrollflöde — if, for och while',
        body: 'Kontrollflöde bestämmer vilken kod som körs och när. Python har tre nyckelkonstruktioner:\n\nif/else — besluta baserat på villkor:\n```python\nif ålder >= 18:\n    print("Vuxen")\nelse:\n    print("Minderårig")\n```\n\nfor-loop — upprepa för varje element:\n```python\nfor frukt in frukter:\n    print(frukt)\n```\n\nwhile-loop — upprepa tills villkoret är falskt:\n```python\nwhile poäng < 100:\n    poäng += 10\n```\n\nIndenteringen (mellanslag i början) är kritisk — det är vad som visar Python vilka rader som hör ihop.',
        insight: 'Glömmer du indentera? Python ger dig ett IndentationError direkt. Det är faktiskt en feature — det tvingar dig att skriva läsbar kod!'
      },
      {
        title: 'Funktioner — återanvändbar kod',
        body: 'En funktion är ett namngivet kodblock du kan köra om och om igen. Istället för att skriva samma kod tio gånger, skriver du den en gång:\n\n```python\ndef hälsa(namn):\n    return f"Hej, {namn}!"\n\nprint(hälsa("Sofia"))   # → "Hej, Sofia!"\nprint(hälsa("Marcus"))  # → "Hej, Marcus!"\n```\n\n`def` definierar funktionen. Parametrar är ingångsdata. `return` skickar tillbaka ett värde.\n\nFunktioner är grunden till DRY-principen (Don\'t Repeat Yourself) — en av programmeringens viktigaste regler.',
        insight: 'Python har massor av inbyggda funktioner: len(), print(), range(), sorted(), input(). Du har redan använt dem utan att tänka på att de är funktioner!'
      },
      {
        title: 'Moduler och nästa steg',
        body: 'Pythons styrka ligger i dess ekosystem av moduler — färdiga kodbibliotek du importerar med ett ord:\n\n```python\nimport math\nprint(math.sqrt(16))    # → 4.0\n\nimport random\nprint(random.randint(1, 6))  # Slumpa tärningskast\n```\n\nInstallera externa bibliotek med pip:\n• `pip install pandas` — dataanalys\n• `pip install requests` — hämta från internet\n• `pip install flask` — bygg en webbserver\n\nDärifrån är nästa steg enkelt: bygg ett projekt. En kalkylator, ett skript som automatiserar något tråkigt, en app. Det bästa sättet att lära sig är att skapa.',
        insight: 'Python har över 450 000 paket tillgängliga via pip. Det finns ett bibliotek för nästan allt tänkbart — du behöver sällan uppfinna hjulet på nytt.'
      }
    ]
  },

  // ── JavaScript ES6+ ───────────────────────────────────────────────────
  13: {
    cards: [
      {
        title: 'JavaScript — webb-världens kärna',
        body: 'JavaScript är det enda programmeringsspråket som körs direkt i webbläsaren. Om HTML är skelettet och CSS är huden, är JavaScript hjärtat — det gör webbsidor interaktiva.\n\nSkapad av Brendan Eich 1995 (på 10 dagar!), är JavaScript idag det mest populära programmeringsspråket på GitHub. Det körs på front-end, back-end (Node.js), i mobilappar och IoT-enheter.\n\nES6+ syftar på moderna versioner av JavaScript (ES2015 och senare) som gav språket ett massivt ansiktslyft med ren, elegant syntax.',
        insight: 'Varje webbsida du besöker idag kör JavaScript. Du läser den här texten tack vare JavaScript!'
      },
      {
        title: 'let, const och var — välj rätt',
        body: 'Moderna JavaScript använder const och let istället för det gamla var:\n\n```js\nconst appNamn = "Brelio"; // Ändras aldrig — använd som standard\nlet poäng = 0;\npoäng += 10; // OK! let kan uppdateras\n```\n\nvar är det gamla sättet — undvik det. Det har förvirrande beteende med scope (var är function-scoped, let/const är block-scoped).\n\nTumregel: Börja alltid med const. Byt till let bara om du behöver ändra värdet. Använd aldrig var i ny kod.',
        insight: 'const hindrar inte att du ändrar innehållet i ett objekt eller array — det hindrar dig bara från att peka om variabeln till ett nytt värde. Det är en vanlig källa till förvirring.'
      },
      {
        title: 'Arrow functions och template literals',
        body: 'ES6 introducerade arrow functions — ett kortare sätt att skriva funktioner:\n\n```js\n// Gammalt sätt\nfunction dubbla(x) { return x * 2; }\n\n// Pilnotation\nconst dubbla = x => x * 2;\nconst addera = (a, b) => a + b;\n```\n\nTemplate literals ersätter strängsammansättning:\n\n```js\nconst namn = "Anna";\nconsole.log(`Välkommen, ${namn}!`);\n// Notera backtick `, inte citattecken\n```\n\nDessa två funktioner är de du kommer använda i nästan varje rad modern JavaScript.',
        insight: 'Arrow functions hanterar this annorlunda än vanliga funktioner — de ärver this från omgivande scope. Detta är avgörande när du jobbar med klasser och event listeners.'
      },
      {
        title: 'Promises och async/await',
        body: 'JavaScript är asynkront — det kan vänta på data (t.ex. från ett API) utan att frysa sidan:\n\n```js\nconst hämtaData = async () => {\n  try {\n    const svar = await fetch("api.example.com/data");\n    const data = await svar.json();\n    console.log(data);\n  } catch (fel) {\n    console.error("Fel:", fel);\n  }\n};\n\nhämtaData();\n```\n\nasync markerar funktionen som asynkron. await pausar till Promisen är klar. try/catch hanterar fel.',
        insight: 'Async/await är syntaktisk socker ovanpå Promises. Under huven är det samma sak. Men koden ser ut som synkron kod och är mycket enklare att läsa och felsöka.'
      },
      {
        title: 'DOM-manipulation',
        body: 'DOM (Document Object Model) är JavaScript\'s gränssnitt till HTML. Du kan ändra, lägga till och ta bort element:\n\n```js\n// Välj element\nconst knapp = document.getElementById("min-knapp");\nconst alla = document.querySelectorAll(".kort");\n\n// Ändra innehåll och stil\nknapp.textContent = "Ny text!";\nknapp.style.background = "#ff6b6b";\n\n// Lyssna på händelser\nknapp.addEventListener("click", () => {\n  console.log("Klickad!");\n});\n```\n\nDOM-manipulation är kärnan i interaktiv webbutveckling. React, Vue och Svelte bygger alla på samma grund.',
        insight: 'Appen du använder just nu (Brelio) är helt byggd med vanilla JavaScript och DOM-manipulation — inga ramverk, bara ren JS.'
      },
      {
        title: 'map, filter, reduce och destructuring',
        body: 'ES6+ har kraftfulla verktyg för att jobba med listor och objekt:\n\n```js\nconst tal = [1, 2, 3, 4, 5];\ntal.map(n => n * 2);        // [2, 4, 6, 8, 10]\ntal.filter(n => n > 3);     // [4, 5]\ntal.reduce((a, b) => a + b); // 15\n\n// Destructuring — packa upp objekt/listor\nconst { namn, ålder } = person;\nconst [första, ...resten] = lista;\n\n// Spread — kopiera/kombinera\nconst ny = [...gamla, nyttElement];\n```\n\nmap, filter och reduce ersätter de flesta for-loopar och gör koden mer läsbar.',
        insight: 'Nästa steg: lär dig ett ramverk som React eller Vue, eller Node.js för backend. Din JavaScript-grund gör dessa enkla att förstå — de är bara JavaScript med extra lager.'
      }
    ]
  },

  // ── ChatGPT & AI-verktyg ──────────────────────────────────────────────
  15: {
    cards: [
      {
        title: 'Vad är AI och varför förändrar det allt?',
        body: 'Artificiell intelligens har funnits sedan 1950-talet, men de senaste åren har hänt något exceptionellt. Large Language Models (LLMs) som GPT-4, Claude och Gemini kan förstå och generera text nästan som en människa.\n\nDessa modeller tränas på miljarder sidor text från internet och lär sig statistiska mönster i språket. De "förstår" inte som en människa — men de kan producera resultat som är svåra att skilja från det.\n\nAI förändrar nu varje bransch: programmering, design, skrivande, analys, kundtjänst, juridik, medicin.',
        insight: 'År 2024 är det inte AI som tar ditt jobb — det är en person som använder AI bättre än du. Lär dig verktygen.'
      },
      {
        title: 'Prompt Engineering — konsten att fråga',
        body: 'Hur du frågar är allt. En vag prompt ger ett vagt svar. En välstrukturerad prompt ger ett professionellt svar.\n\n❌ Dålig prompt: "Skriv om Python"\n\n✓ Bra prompt: "Jag är webbutvecklare med 2 år JavaScript. Förklara Pythons viktigaste skillnader mot JavaScript med konkreta kodexempel. Fokus på syntax och vanliga fallgropar."\n\nTekniker som fungerar:\n• Rollen: "Du är en expert på..."\n• Kontexten: "Jag är...och vill..."\n• Formatet: "Svara med punktlista / kod / tabell"\n• Begränsning: "Max 200 ord, inga tekniska termer"\n• Exempel: "Likt det här exemplet..."',
        insight: 'Spara dina bästa prompts! En effektiv prompt är återanvändbar och sparar timmar. Många proffs håller ett "prompt-bibliotek".'
      },
      {
        title: 'ChatGPT för produktivitet',
        body: 'ChatGPT är som att ha en allvetande assistent tillgänglig dygnet runt. Konkreta användningsfall:\n\nSkrivande:\n• Korrektur och förbättring av mejl, rapporter, CV\n• Omformulera text för olika målgrupper\n• Sammanfatta långa dokument\n\nKod & teknik:\n• Förklara komplicerad kod på enkel svenska\n• Felsök buggar — klistra in koden och felbeskrivningen\n• Generera boilerplate-kod\n\nLärande:\n• Be AI:n förklara ett ämne för en 10-åring\n• Skapa studieplaner och tentafrågor\n• Öva inför intervjuer — be AI:n intervjua dig',
        insight: 'Ett enkelt trick: lägg till "Förklara för en nybörjare" eller "Ge mig ett praktiskt exempel" till vilken prompt som helst för att dramatiskt förbättra svaret.'
      },
      {
        title: 'AI-verktyg för design och bilder',
        body: 'Generativa AI-modeller kan nu skapa professionell bildkonst från en textbeskrivning:\n\nMidjourney — Bäst för konstnärlig, estetisk bildgenerering. Används via Discord. ~$10/mån. Resultaten ser fantastiska ut.\n\nDALL-E 3 — Inbyggt i ChatGPT Plus. Enklast att använda. Bäst för konceptbilder.\n\nStable Diffusion — Gratis, open source. Mer tekniskt men full kontroll.\n\nPrompt-tips för bilder:\n"[Motiv], [stil], [belysning], [stämning]"\n\nT.ex: "Aerial photo of Stockholm at golden hour, cinematic, misty atmosphere, 24mm lens"',
        insight: 'Midjourney tipsar: specifika adjektiv för ljus (golden hour, soft diffused light, backlit) och stil (cinematic, editorial, painterly) ger de bästa resultaten.'
      },
      {
        title: 'Begränsningar och etik',
        body: 'AI är mäktigt men har tydliga begränsningar. Att förstå dem gör dig till en bättre användare:\n\nTekniska begränsningar:\n• Hallucination — AI hittar på fakta som låter trovärdiga men är fel. Verifiera alltid viktiga påståenden.\n• Kutsoff-datum — modellerna vet inte om händelser efter träningsdatats slutdatum.\n• Kontext-fönster — långa konversationer kan "glömmas".\n\nEtiska frågor:\n• Upphovsrätt till AI-genererat innehåll är fortfarande oklar i de flesta länder.\n• AI kan sprida desinformation i stor skala.\n• AI-system kan ärva bias från träningsdata.',
        insight: 'Praktisk regel: Använd AI som ett verktyg för att förstärka ditt kritiska tänkande — inte som en ersättning för det. Fråga alltid "Stämmer det här verkligen?"'
      },
      {
        title: 'AI-verktyg du bör känna till',
        body: 'Ekosystemet exploderar. Här är de mest användbara verktygen just nu:\n\nText & produktivitet:\n• ChatGPT (OpenAI) — Allroundan\n• Claude (Anthropic) — Bäst för långa dokument och kod\n• Perplexity — AI-sökning med källhänvisningar\n\nKod:\n• GitHub Copilot — Kodautocompletition direkt i din editor\n• Cursor — AI-first code editor\n\nDesign:\n• Figma AI — Automatisera designuppgifter\n• Remove.bg — Ta bort bakgrunder direkt\n\nSök:\n• Perplexity.ai — Svar med riktiga källor\n\nVälj rätt verktyg för rätt uppgift — AI är kraftfullast när det förstärker din kompetens.',
        insight: 'Nästa steg: Skaffa ChatGPT Plus (ca $20/mån) och testa GPT-4. Skillnaden mot gratisvarianten är dramatisk för komplexa uppgifter.'
      }
    ]
  },

  // ── Figma för designers ───────────────────────────────────────────────
  14: {
    cards: [
      {
        title: 'Varför Figma har revolutionerat design',
        body: 'Figma lanserades 2016 och förändrade designbranschen fundamentalt. Medan konkurrenter som Sketch och Adobe XD krävde installation och lokal filhantering, körs Figma helt i webbläsaren.\n\nResultatet: flera designers kan arbeta i samma fil, i realtid, var som helst i världen. Klienter kan lämna kommentarer direkt på designen. Utvecklare får precision-specifikationer utan extra steg.\n\nFigma är nu branschstandard — från startups till stora bolag som Google, Airbnb och Microsoft. Att lära sig Figma är idag en grundförväntning för UI/UX-designers.',
        insight: 'Adobe förvärvade Figma 2022 för $20 miljarder — ett av de dyraste förvärven i tech-historien. Affären blockerades av regulatorer 2023 och Figma förblir självständigt.'
      },
      {
        title: 'Grunderna: Frames, lager och komponenter',
        body: 'I Figma jobbar du med tre grundelement:\n\nFrames (F) — din arbetsyta. Välj en förinställd storlek (iPhone 14, Desktop, iPad) eller definiera din egen. Frames kan innehålla andra frames för komplexa layouts.\n\nLager — varje element har ett lager i panelen till vänster. Organisera dem med grupper och namngivning. Välnamngivna lager är skillnaden mellan ett professionellt och ett kaotiskt projekt.\n\nKomponenter (Ctrl/Cmd+Alt+K) — återanvändbara element. Skapa en knapp som komponent och uppdatera alla kopior automatiskt.',
        insight: 'En grundregel: Namnge ALLT. "Frame 1542" och "Rectangle 89" är tecken på oorganiserat arbete. Ta 5 sekunder att namnge varje lager — det sparar timmar senare.'
      },
      {
        title: 'Auto Layout — responsiv design gjort enkelt',
        body: 'Auto Layout är Figmas kraftfullaste funktion för moderna designers. Det låter dina frames och grupper automatiskt anpassa sig till innehållet:\n\n```\nKnapp [Ikon + Text]\n→ Texten ändras → Knappen ändrar storlek automatiskt\n→ Ikon läggs till → Mellanrummet justeras automatiskt\n```\n\nDu konfigurerar:\n• Riktning (horisontell/vertikal)\n• Padding (inre avstånd)\n• Gap (avstånd mellan element)\n• Justering (flex-start, center, flex-end)\n\nAuto Layout är Figmas version av CSS Flexbox — om du förstår Flexbox förstår du Auto Layout.',
        insight: 'Använd Auto Layout på nästan allt du skapar. Det gör handoff till utvecklare enklare och håller ditt design-system konsistent.'
      },
      {
        title: 'Design System — konsistens i stor skala',
        body: 'Ett Design System är en samling återanvändbara komponenter, riktlinjer och tokens som håller produkten konsistent.\n\nKärnan är Variables (tidigare Styles):\n• Färgtokens: --accent: #ff6b6b — ändra en gång, uppdateras överallt\n• Typografi: Definiera H1, H2, Body, Caption\n• Spacing: 4px, 8px, 16px, 24px, 32px...\n\nEn Components-sida med alla grundkomponenter:\n• Knappar (primary, secondary, danger)\n• Input-fält (default, focus, error)\n• Kort, navigering, ikoner\n\nMed ett Design System kan ett team av 10 designers jobba som om de vore en.',
        insight: 'Kolla in Figma Community för gratis Design System-mallar — t.ex. Material Design 3 eller Apple Human Interface Guidelines.'
      },
      {
        title: 'Prototyper och animationer',
        body: 'I Figma kan du skapa klickbara prototyper utan att skriva en enda rad kod:\n\n1. Välj ett element (t.ex. en knapp)\n2. Gå till Prototype-fliken (höger panel)\n3. Dra en anslutningspil till nästa frame\n4. Välj interaktion (On Click, On Hover, Mouse Enter)\n5. Välj animation (Smart Animate, Push, Slide)\n\nSmart Animate är magisk — Figma identifierar automatiskt element med samma namn och animerar övergångar mellan dem.\n\nPrototyper låter dig testa flöden och UX med riktiga användare innan en enda rad kod skrivs.',
        insight: 'Regel: Testa alltid din prototyp på en riktig mobiltelefon. Det ser väldigt annorlunda ut jämfört med preview-läget på datorn.'
      },
      {
        title: 'Handoff till utvecklare',
        body: 'Figma har inbyggd developer handoff — ingen betalda tillägg behövs:\n\nDev Mode (aktiveras i höger panel) visar:\n• Exakta mått och avstånd\n• CSS-properties för varje element (border-radius, box-shadow, font-size)\n• Exportmöjligheter (SVG, PNG, WebP)\n• Länk till kopplade komponenter i designsystemet\n\nBästa praxis för god handoff:\n• Namnge alla lager och frames tydligt\n• Använd ditt design system konsekvent\n• Lämna annotations med interaktionsbeskrivningar\n• Länka till relevant Figma Prototype\n\nMed välorganiserad Figma-fil kan en utvecklare arbeta utan ett enda möte med designern.',
        insight: 'Nästa steg: Kolla in Figma Community — tusentals gratis resurser, ikoner, mockups och UI-kits. Användarnamnet @figma har officiella filer för iOS, Android och Material Design.'
      }
    ]
  },

  // ── SQL & Databaser ───────────────────────────────────────────────────
  22: {
    cards: [
      {
        title: 'Vad är SQL och varför behöver du det?',
        body: 'SQL (Structured Query Language, uttalas "sequel") är språket du pratar med databaser. Nästan varje app, webbsida och tjänst du använder dagligen — Instagram, Spotify, din bank — har en databas bakom sig. De flesta använder SQL.\n\nEn databas organiserar data i tabeller (tänk avancerade Excel-ark). En e-handelsapp kan ha tabellerna: users, products, orders, reviews.\n\nSQL är 50 år gammalt men dominerar fortfarande. Om du jobbar med teknik, affärer eller dataanalys — SQL är en av de mest värdefulla färdigheterna du kan ha.',
        insight: 'SQL rankas konsekvent bland de 3 mest eftertraktade tekniska färdigheterna på LinkedIn. En god SQL-grund ensam kan öppna dörrar till data analyst-roller.'
      },
      {
        title: 'SELECT — att hämta data',
        body: 'SELECT är det vanligaste SQL-kommandot. Med det hämtar du data:\n\n```sql\n-- Hämta allt från tabellen\nSELECT * FROM users;\n\n-- Hämta specifika kolumner\nSELECT namn, epost, ålder FROM users;\n\n-- Räkna antalet rader\nSELECT COUNT(*) FROM users;\n\n-- Aggregat-funktioner\nSELECT AVG(pris) FROM produkter;\nSELECT MAX(betyg) FROM kurser;\nSELECT SUM(kvantitet) FROM order_rader;\n```\n\n`*` betyder "alla kolumner". Bekvämt — men hämta bara de kolumner du faktiskt behöver i produktionskod.',
        insight: 'I stora databaser med miljoner rader kan SELECT * vara mycket långsamt. Specificera alltid vilka kolumner du behöver.'
      },
      {
        title: 'WHERE, ORDER BY och LIMIT',
        body: 'WHERE filtrerar rader. ORDER BY sorterar. LIMIT begränsar antalet resultat:\n\n```sql\n-- Filtrera\nSELECT * FROM users WHERE ålder > 30;\nSELECT * FROM produkter WHERE kategori = \'Elektronik\';\n\n-- Kombinera villkor\nSELECT * FROM users\n  WHERE ålder >= 18 AND land = \'Sverige\';\n\n-- Mönstermatchning\nSELECT * FROM users WHERE namn LIKE \'A%\';\n\n-- Sortera och begränsa\nSELECT * FROM produkter\n  ORDER BY pris DESC\n  LIMIT 10;\n```\n\nLIKE med `%` är jokertecken: `\'A%\'` matchar allt som börjar med A.',
        insight: 'Prova alltid din WHERE-klausul med SELECT * först innan du kör UPDATE eller DELETE. Glöm du WHERE-klausulen vid DELETE raderas ALLA rader — ett klassiskt (och smärtsamt) misstag.'
      },
      {
        title: 'JOIN — kombinera tabeller',
        body: 'JOIN är SQL\'s superkraft. Det kombinerar data från flera tabeller:\n\n```sql\n-- Se alla orders med kundens namn\nSELECT\n  users.namn,\n  orders.produkt,\n  orders.datum,\n  orders.pris\nFROM orders\nINNER JOIN users ON orders.user_id = users.id;\n```\n\nTyper av JOIN:\n• INNER JOIN — bara rader som matchar i båda tabellerna\n• LEFT JOIN — alla rader från vänster + matchande från höger\n• RIGHT JOIN — tvärtom\n\n`ON` specifierar hur tabellerna hänger ihop — vanligtvis via en foreign key.',
        insight: '80% av alla SQL-queries i verkligheten använder JOIN. Det är det viktigaste konceptet att behärska för att gå från nybörjare till intermediate.'
      },
      {
        title: 'INSERT, UPDATE och DELETE',
        body: 'Du läser data med SELECT — men du behöver också skriva, uppdatera och ta bort:\n\n```sql\n-- Lägg till ny rad\nINSERT INTO users (namn, epost, ålder)\nVALUES (\'Anna Svensson\', \'anna@epost.se\', 28);\n\n-- Uppdatera befintlig rad\nUPDATE users\nSET ålder = 29\nWHERE id = 42;\n\n-- Ta bort rad\nDELETE FROM users\nWHERE id = 42;\n```\n\n⚠️ Varning: Kör alltid SELECT med samma WHERE-villkor innan du kör DELETE eller UPDATE. En saknad WHERE-klausul kan radera hela tabellen!',
        insight: 'I professionella system skyddar man sig mot katastrofer med transaktioner: BEGIN TRANSACTION; DELETE ...; och sedan COMMIT (bekräfta) eller ROLLBACK (ångra).'
      },
      {
        title: 'Index och nästa steg',
        body: 'En databas med miljoner rader kan bli långsam. Index löser detta — de fungerar som ett alfabetiskt register i en bok:\n\n```sql\n-- Skapa index på en kolumn du söker ofta\nCREATE INDEX idx_users_epost ON users(epost);\n\n-- Nu är detta millisekunder istället för sekunder:\nSELECT * FROM users WHERE epost = \'anna@epost.se\';\n```\n\nGrundregler för prestanda:\n• Indexera kolumner du filtrerar med ofta\n• Undvik SELECT * i produktion\n• Använd LIMIT för att begränsa resultatstorleken\n\nNästa steg: Ladda ner DB Browser for SQLite (gratis) och skapa din första egna databas. Experimentera med verklig data — det är bästa sättet att lära sig SQL.',
        insight: 'PostgreSQL och MySQL är de två vanligaste databasmotorerna. SQLite är utmärkt för lärande — det är en fil, ingen serverinstallation krävs.'
      }
    ]
  },

  // ── Git & GitHub ──────────────────────────────────────────────────────
  40: {
    cards: [
      {
        title: 'Vad är Git och versionshantering?',
        body: 'Tänk dig att du skriver ett viktigt dokument och sparar det som "rapport_final.docx", "rapport_FINAL2.docx", "rapport_faktisktfinal.docx"... Det är en mardröm.\n\nGit löser det. Det är ett system som spårar varje ändring du gör i kod — vem ändrade vad, när, och varför. Du kan gå tillbaka till vilket tidigare tillstånd som helst.\n\nSkapad av Linus Torvalds 2005 (personen bakom Linux), är Git nu det överlägset vanligaste versionshanteringssystemet. Nästan varje mjukvaruprojekt i världen använder det.',
        insight: 'Git är inte valfritt för en professionell utvecklare. Det är en grundförväntning — som att en bilmekaniker kan använda skiftnycklar.'
      },
      {
        title: 'De viktigaste kommandona',
        body: 'Du behöver 10 kommandon för 90% av allt Git-arbete:\n\n```bash\ngit init              # Starta nytt Git-repo\ngit clone [URL]       # Kopiera befintligt repo\n\ngit status            # Se vad som ändrats\ngit add fil.txt       # Förbered en fil\ngit add .             # Förbered ALLA ändringar\n\ngit commit -m "Lägg till inloggning"  # Spara\n\ngit log               # Se historik\ngit diff              # Se exakt vad som ändrats\n```\n\nArbetsflödet har tre zoner:\n1. Working Directory — dina lokala filer\n2. Staging Area — redo att committas (git add)\n3. Repository — sparad historik (git commit)',
        insight: 'Commita tidigt och ofta. Varje logisk ändring ska vara en commit. "Lade till login, ändrade 50 filer och fixade 3 buggar" är en dålig commit. Dela upp det!'
      },
      {
        title: 'Branches — parallell utveckling',
        body: 'En branch (gren) är en isolerad kopia av din kod där du experimenterar utan att påverka huvudkoden:\n\n```bash\n# Skapa och byt till ny branch\ngit checkout -b ny-funktion\n\n# Se alla branches\ngit branch\n\n# Byt branch\ngit checkout main\n```\n\nMain (eller master) är den stabila, produktionskoden. Du skapar en branch för varje ny funktion eller buggfix. Om något går fel — kasta hela branchen och börja om.\n\nKonvention:\n• main — produktionskod\n• feature/namn — ny funktion\n• fix/namn — buggfix',
        insight: 'Aldrig pusha direkt till main. Det är branschstandard och förhindrar att osignerade ändringar tas till produktion av misstag.'
      },
      {
        title: 'Merge och konflikter',
        body: 'När din funktion är klar kombinerar du den med main:\n\n```bash\ngit checkout main\ngit merge ny-funktion\n```\n\nMerge-konflikter uppstår när två branches ändrat samma rad. Git markerar konflikten:\n\n```\n<<<<<<< HEAD\nKod från main\n=======\nKod från ny-funktion\n>>>>>>> ny-funktion\n```\n\nDu löser det manuellt, väljer vilken kod som stannar, tar bort markeringarna och committar.\n\nRebase vs Merge:\n• Merge — bevarar historiken, skapar en merge commit\n• Rebase — skriver om till en linjär historik (snyggare men mer avancerat)',
        insight: 'VS Code och GitHub Desktop har inbyggda merge conflict-lösare med visuell diff. Börja med dem — det är mycket enklare än att redigera konflikter i en texteditor.'
      },
      {
        title: 'GitHub — samarbete i molnet',
        body: 'GitHub är en webbtjänst som hostar Git-repos och lägger till samarbetsfunktioner:\n\n```bash\ngit remote add origin https://github.com/namn/projekt.git\ngit push origin main   # Skicka till GitHub\ngit pull origin main   # Hämta senaste ändringar\n```\n\nPull Requests (PR) är GitHub\'s kärna:\n1. Pusha din feature-branch\n2. Öppna en PR på GitHub: "Lägg till inloggningsfunktion"\n3. Kollegor granskar, kommenterar, föreslår ändringar\n4. Godkänd → mergeas in i main\n\nIssues är GitHub\'s buggtracker. Projects är enkelt projektledningsverktyg.',
        insight: 'Din GitHub-profil är din portfolio. Regelbundna commits, öppna projekt och välskrivna README-filer imponerar på rekryterare — ibland mer än ditt CV.'
      },
      {
        title: 'Git-workflow för professionella',
        body: 'Professionella team följer strukturerade workflows:\n\nGitHub Flow (enkel, populär för webbutveckling):\n1. Skapa branch från main\n2. Gör commits\n3. Öppna Pull Request\n4. Code review\n5. Merge till main → Deploy\n\nGitflow (för versionerade produkter):\n• main — produktionskod\n• develop — integrationsbranch\n• feature/xxx — nya funktioner\n• release/x.x — release-förberedelse\n• hotfix/xxx — akuta buggfixar\n\nBästa praxis:\n• Skriv tydliga commit-meddelanden\n• En feature per branch\n• Aldrig force-push till main\n• Alltid git pull innan du börjar jobba',
        insight: 'Nästa steg: Skapa ett GitHub-konto, lägg upp ett eget projekt och börja bygga din portfolio. Bidra till ett open source-projekt — det är det bästa sättet att lära sig samarbete i stor skala.'
      }
    ]
  }

};
