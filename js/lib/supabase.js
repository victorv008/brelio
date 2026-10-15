// Delad Supabase-klient för appen och adminportalen. Båda ligger på samma
// domän och delar därför session — en inloggad admin kan förhandsgranska
// utkast i appen.
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error('VITE_SUPABASE_URL och VITE_SUPABASE_PUBLISHABLE_KEY saknas — se .env.example');
}

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export const MEDIA_BUCKET = 'course-media';
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function mediaUrl(path) {
  if (!path) return null;
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

// Laddar upp en bild till course-media och returnerar sökvägen. Filnamnet
// slumpas så två uppladdningar aldrig skriver över varandra.
export async function uploadImage(file, folder) {
  if (!IMAGE_TYPES.includes(file.type)) {
    throw new UserError('Bilden måste vara JPG, PNG, WebP eller GIF.');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UserError('Bilden får vara högst 5 MB.');
  }
  const ext = file.type.split('/')[1].replace('jpeg', 'jpg');
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
  });
  if (error) throw error;
  return path;
}

// Ett fel vars meddelande är skrivet för användaren och visas som det är
// (t.ex. "Välj en bild först.").
export class UserError extends Error {}

// Felmeddelanden från databasens egna funktioner är redan på svenska.
// Tekniska fel från Postgres, Auth och nätverket översätts här.
const KNOWN_ERRORS = [
  [/row-level security|permission denied/i, 'Du har inte behörighet att göra det här.'],
  [/violates check constraint/i, 'Något av fälten har ett ogiltigt värde.'],
  [/duplicate key/i, 'Det finns redan en post med samma värde.'],
  [/violates foreign key/i, 'Posten hänger ihop med annan data och kan inte ändras så.'],
  [/Invalid login credentials/i, 'Fel e-post eller lösenord.'],
  [/Email not confirmed/i, 'Bekräfta din e-postadress först — kolla inkorgen.'],
  [/User already registered|already been registered/i, 'Det finns redan ett konto med den e-postadressen.'],
  [/Password should be|password is too weak|weak password/i, 'Lösenordet är för svagt. Använd minst 8 tecken.'],
  [/rate limit|too many requests/i, 'För många försök. Vänta en stund och försök igen.'],
  [/JWT expired|invalid JWT|session.*(missing|not found)/i, 'Sessionen har gått ut. Logga in igen.'],
  [/Failed to fetch|NetworkError|Load failed|fetch failed/i, 'Ingen kontakt med servern. Kolla din uppkoppling.'],
  [/Payload too large|exceeded the maximum allowed size/i, 'Filen är för stor.'],
  [/mime type .* is not supported|invalid mime type/i, 'Filtypen stöds inte.'],
];

export function errorMessage(error, fallback = 'Något gick fel. Försök igen.') {
  if (!error) return fallback;
  if (error instanceof UserError) return error.message;
  const message = typeof error === 'string' ? error : (error.message || '');
  for (const [pattern, text] of KNOWN_ERRORS) {
    if (pattern.test(message)) return text;
  }
  // Våra egna meddelanden (RAISE EXCEPTION, Edge Functions) är på svenska.
  if (/[åäöÅÄÖ]/.test(message)) return message;
  return fallback;
}

// Supabase returnerar { data, error } — kasta felet så att anroparen kan
// använda try/catch.
export function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}

// Edge Functions returnerar { error } i kroppen vid 4xx; supabase-js gömmer
// den i error.context. Plocka fram meddelandet.
export async function invokeFunction(name, body) {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    try {
      const payload = await error.context.json();
      if (payload?.error) throw new UserError(payload.error);
    } catch (inner) {
      if (inner instanceof UserError) throw inner;
      /* ingen JSON-kropp */
    }
    throw error;
  }
  return data;
}
