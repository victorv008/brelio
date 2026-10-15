// QuickThinkers adminportal — redigerare för en quizfråga.
// Används av quizblock i lektioner och av dagens quiz, så valideringen är
// densamma på båda ställena och matchar databasens CHECK (2–4 alternativ,
// inga tomma, ett markerat rätt svar).
import { UserError } from '../../lib/supabase.js';

const U = window.QTUI;
const el = U.el;

// Bygger fälten i `host`. Returnerar { collect } som ger innehållet i
// databasens format, eller kastar ett UserError med vad som saknas.
export function quizEditor(host, content = {}, { withExplanation = true, label = '' } = {}) {
  const options = content.options || [];
  const question = U.textarea({
    value: content.question || '', rows: 2, maxlength: 1000, placeholder: 'Vad står UX för?',
  });

  const radioName = `correct_${Math.random().toString(36).slice(2)}`;
  const rows = [0, 1, 2, 3].map((i) => {
    const radio = el('input', { type: 'radio', name: radioName, value: String(i) });
    radio.checked = (content.correct_index ?? 0) === i;
    const text = U.input({ value: options[i] || '', placeholder: `Alternativ ${i + 1}${i > 1 ? ' (valfritt)' : ''}`, maxlength: 200 });
    return { radio, text };
  });

  const explanation = U.textarea({
    value: content.explanation || '', rows: 2, maxlength: 1000,
    placeholder: 'Visas efter att man svarat (valfritt)',
  });

  host.appendChild(U.field(label ? `${label} — fråga` : 'Fråga', question));
  host.appendChild(el('div.field',
    el('span.field__label', { text: 'Alternativ' }),
    el('span.field__hint', { text: 'Markera det rätta svaret till vänster. Minst två alternativ.' }),
    el('div.options', rows.map(({ radio, text }) => el('label.option-row', radio, el('span.option-row__mark'), text)))
  ));
  if (withExplanation) host.appendChild(U.field('Förklaring', explanation));

  function collect() {
    const q = question.value.trim();
    const where = label ? `${label}: ` : '';
    if (!q) throw new UserError(`${where}Skriv en fråga.`);

    const filled = rows
      .map((r, i) => ({ text: r.text.value.trim(), correct: r.radio.checked, i }))
      .filter((r) => r.text);
    if (filled.length < 2) throw new UserError(`${where}Ange minst två alternativ.`);

    const correctIndex = filled.findIndex((r) => r.correct);
    if (correctIndex === -1) throw new UserError(`${where}Markera ett ifyllt alternativ som rätt svar.`);

    const out = { question: q, options: filled.map((r) => r.text), correct_index: correctIndex };
    if (withExplanation && explanation.value.trim()) out.explanation = explanation.value.trim();
    return out;
  }

  return { collect, focus: () => question.focus() };
}
