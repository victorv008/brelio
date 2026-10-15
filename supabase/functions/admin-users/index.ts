// QuickThinkers — adminåtgärder som kräver secret-nyckeln:
// bannlysa, häva bann och radera konton.
//
// Driftsätts med verify_jwt = false: funktionen verifierar själv anroparens
// session mot Auth och kontrollerar admin-rollen i databasen.
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ~100 år — Auth har ingen "för alltid".
const BAN_DURATION = '876000h';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function adminClient() {
  const secretKeys = Deno.env.get('SUPABASE_SECRET_KEYS');
  const key = secretKeys
    ? JSON.parse(secretKeys).default
    : Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(Deno.env.get('SUPABASE_URL')!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Metoden stöds inte.' }, 405);

  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'Du behöver vara inloggad.' }, 401);

  const admin = adminClient();

  // Vem anropar — och är hen admin?
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  const caller = authData?.user;
  if (authError || !caller) return json({ error: 'Ogiltig session. Logga in igen.' }, 401);

  const { data: callerProfile } = await admin
    .from('profiles').select('role, status').eq('id', caller.id).single();
  if (callerProfile?.role !== 'admin' || callerProfile?.status !== 'active') {
    return json({ error: 'Du har inte admin-behörighet.' }, 403);
  }

  let body: { action?: string; userId?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Ogiltig förfrågan.' }, 400);
  }

  const { action, userId } = body;
  if (!['ban', 'unban', 'delete'].includes(action ?? '') || typeof userId !== 'string') {
    return json({ error: 'Ogiltig förfrågan.' }, 400);
  }
  if (userId === caller.id) {
    return json({ error: 'Du kan inte göra det här med ditt eget konto.' }, 400);
  }

  const { data: target } = await admin
    .from('profiles').select('role').eq('id', userId).single();
  if (!target) return json({ error: 'Användaren finns inte.' }, 404);
  if (target.role === 'admin' && action !== 'unban') {
    return json({ error: 'Ta bort admin-rollen innan du bannar eller raderar en admin.' }, 400);
  }

  if (action === 'delete') {
    // Profil och all användardata försvinner via ON DELETE CASCADE.
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) return json({ error: 'Kunde inte radera kontot.' }, 500);
    return json({ ok: true });
  }

  const banned = action === 'ban';

  // Auth-bannet stoppar nya inloggningar; status-flaggan stoppar skrivningar
  // direkt via RLS, även för en session som redan är igång.
  const { error: banError } = await admin.auth.admin.updateUserById(userId, {
    ban_duration: banned ? BAN_DURATION : 'none',
  });
  if (banError) return json({ error: 'Kunde inte uppdatera kontot.' }, 500);

  const { error: statusError } = await admin
    .from('profiles').update({ status: banned ? 'banned' : 'active' }).eq('id', userId);
  if (statusError) return json({ error: 'Kunde inte uppdatera kontot.' }, 500);

  return json({ ok: true, status: banned ? 'banned' : 'active' });
});
