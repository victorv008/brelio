// Markdown → säker HTML för textblock. Allt tvättas med DOMPurify och bara
// en kort lista taggar släpps igenom, så ett textblock aldrig kan bära skript
// — inte ens om ett adminkonto skulle kapas.
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'h2', 'h3', 'h4',
  'blockquote', 'code', 'pre', 'a', 'hr'];

// Länkar öppnas i ny flik och får inte komma åt sidan som öppnade dem.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export function renderMarkdown(source) {
  const html = marked.parse(source || '', { gfm: true, breaks: true, async: false });
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
  });
}

// Ren text för förhandsvisningar i listor ("**Hej** _där_" → "Hej där").
export function plainText(source, max = 90) {
  const text = (source || '')
    .replace(/[#>*_`~[\]()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}
